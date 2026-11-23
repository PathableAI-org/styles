import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it } from 'node:test'

import {
  changesRequestedBy,
  checkProblems,
  guardrailPaths,
  matchesAny,
  renderingPaths,
  reviewCoversHead,
  runMergeGate,
} from '../merge-gate.mjs'
import {
  gateGitHub,
  gateState,
  recordCleanVisual,
  recordFixReview,
  restReview,
} from './merge-support.mjs'
import { sampleRepo } from './support.mjs'

const branch = 'fix/button-ring'

let repo
let base
let head

/** A branch from main whose one commit changes `files`. */
const setUp = (files) => {
  repo.git('checkout', '--quiet', '-b', branch, 'main')
  head = repo.commit('fix: ring', files)
}

beforeEach(() => {
  repo = sampleRepo()
  base = repo.git('rev-parse', 'main')
})

afterEach(() => {
  repo.remove()
})

const gate = (state) => runMergeGate(repo.dir, gateGitHub(state), 7)

const problemsOf = (result) => (result.ok ? [] : result.problems)

void describe('path matching', () => {
  void it('matches directory prefixes and globs at any depth', () => {
    for (const path of [
      '.claude/settings.json',
      'scripts/claude/pr-ready-hook.mjs',
      '.agents/skills/code-reviewer/SKILL.md',
      'eslint.config.js',
      '.stylelintrc.json',
      'packages/styles/.stylelintrc.json',
      '.markdownlint.json',
      '.prettierrc',
      '.lintstagedrc.json',
      '.husky/pre-commit',
      'commitlint.config.cjs',
      'packages/react/tsconfig.build.json',
      '.github/workflows/ci-full.yml',
      'renovate.json5',
      '.changeset/config.json',
      'scripts/merge-gate.mjs',
      'scripts/verification/gate.mjs',
      'scripts/visual-review/schema.mjs',
      'AGENTS.md',
      'packages/styles/AGENTS.md',
      'CLAUDE.md',
      'package.json',
      'scripts/review.mjs',
      'docs/engineering/git-workflow.md',
    ]) {
      assert.ok(matchesAny([path], guardrailPaths), path)
    }
    for (const path of [
      'docs/theming/consumer-guide.md',
      '.changeset/button-ring.md',
      'packages/styles/package.json',
      'scripts/test-storybook.mjs',
      'packages/styles/src/button.scss',
    ]) {
      assert.equal(matchesAny([path], guardrailPaths), false, path)
    }
    assert.ok(matchesAny(['packages/styles/src/x.scss'], renderingPaths))
    assert.ok(matchesAny(['pnpm-lock.yaml'], renderingPaths))
    assert.ok(matchesAny(['apps/storybook-react/main.ts'], renderingPaths))
    assert.equal(
      matchesAny(['docs/x.md', 'scripts/merge.mjs'], renderingPaths),
      false,
    )
  })
})

void describe('review coverage of a later head', () => {
  const lines = 'a\nb\nc\nd\ne\nf\ng\n'

  /** main has `lines`; the branch changes line c and is reviewed there. */
  const reviewedBranch = () => {
    repo.git('checkout', '--quiet', 'main')
    base = repo.commit('chore: lines', { 'src/lines.ts': lines })
    repo.git('checkout', '--quiet', '-b', branch)
    return repo.commit('fix: c', { 'src/lines.ts': lines.replace('c', 'C') })
  }

  const mergeMain = (files) => {
    repo.git('checkout', '--quiet', 'main')
    repo.commit('feat: main moves', files)
    repo.git('checkout', '--quiet', branch)
    repo.git('merge', '--quiet', '--no-edit', 'main')
    return repo.git('rev-parse', 'HEAD')
  }

  void it('covers the same commit and a later commit that changes no path', () => {
    const reviewed = reviewedBranch()
    assert.equal(reviewCoversHead(repo.dir, reviewed, reviewed).covers, true)
    repo.git('commit', '--quiet', '--allow-empty', '-m', 'chore: empty')
    const empty = repo.git('rev-parse', 'HEAD')
    assert.equal(reviewCoversHead(repo.dir, reviewed, empty).covers, true)
  })

  void it('carries across a merge of main that leaves the own diff unchanged', () => {
    const reviewed = reviewedBranch()
    const merged = mergeMain({ 'src/other.ts': 'export const other = 1\n' })
    const coverage = reviewCoversHead(repo.dir, reviewed, merged, 'main')
    assert.deepEqual(coverage, {
      covers: true,
      how: `the pull request's own diff is unchanged since ${reviewed}`,
    })
  })

  void it('does not carry when main changes a line the diff carries as context, or the branch changes more', () => {
    const reviewed = reviewedBranch()
    const merged = mergeMain({ 'src/lines.ts': lines.replace('a', 'A') })
    const coverage = reviewCoversHead(repo.dir, reviewed, merged, 'main')
    assert.equal(coverage.covers, false)
    assert.match(coverage.how, /own diff changed/)
    const more = repo.commit('fix: e too', {
      'src/lines.ts': lines
        .replace('a', 'A')
        .replace('c', 'C')
        .replace('e', 'E'),
    })
    assert.equal(
      reviewCoversHead(repo.dir, reviewed, more, 'main').covers,
      false,
    )
  })

  void it('does not cover a head that does not descend from the reviewed commit', () => {
    const reviewed = reviewedBranch()
    repo.git('checkout', '--quiet', 'main')
    const other = repo.commit('fix: elsewhere', { 'src/x.ts': 'x\n' })
    const coverage = reviewCoversHead(repo.dir, reviewed, other, 'main')
    assert.equal(coverage.covers, false)
    assert.match(coverage.how, /is not an ancestor/)
  })
})

void describe('eligibility', () => {
  beforeEach(() => {
    setUp({ 'src/app.ts': 'export const app = 2\n' })
  })

  const ineligible = (edit) => {
    const state = gateState(branch, head, ['src/app.ts'])
    edit(state)
    const result = gate(state)
    assert.equal(result.ok, false)
    assert.equal(result.ok || result.eligible, false)
    return problemsOf(result)
  }

  void it('is not eligible for risk:high, a missing risk label, or the hold label', () => {
    assert.deepEqual(
      ineligible((state) => {
        state.pull.labels = [{ name: 'risk:high' }]
      }),
      ["it is labelled risk:high, which merges on a person's approval"],
    )
    assert.deepEqual(
      ineligible((state) => {
        state.pull.labels = [{ name: 'bug' }]
      }),
      ['it has no risk label (risk:standard or risk:light)'],
    )
    assert.deepEqual(
      ineligible((state) => {
        state.pull.labels.push({ name: 'hold' })
      }),
      ['it is labelled hold'],
    )
  })

  void it('is not eligible when it changes a guardrail file or is the release pull request', () => {
    assert.deepEqual(
      ineligible((state) => {
        state.files = ['src/app.ts', '.github/workflows/ci-full.yml']
      }),
      ['it changes guardrail files: .github/workflows/ci-full.yml'],
    )
    const release = [
      'it is the ci: version packages release pull request, which publishes to npm',
    ]
    assert.deepEqual(
      ineligible((state) => {
        state.pull.title = 'ci: version packages'
      }),
      release,
    )
    assert.deepEqual(
      ineligible((state) => {
        state.pull.head = { ref: 'changeset-release/main', sha: head }
      }),
      release,
    )
  })

  void it("is not eligible while a person's latest review requests changes", () => {
    assert.deepEqual(
      ineligible((state) => {
        state.reviews = [
          restReview('maintainer', 'CHANGES_REQUESTED'),
          restReview('maintainer', 'COMMENTED'),
        ]
      }),
      ['maintainer requested changes'],
    )
    assert.deepEqual(
      changesRequestedBy([
        { bot: false, login: 'maintainer', state: 'CHANGES_REQUESTED' },
        { bot: false, login: 'maintainer', state: 'APPROVED' },
        { bot: true, login: 'copilot', state: 'CHANGES_REQUESTED' },
        { bot: false, login: 'other', state: 'CHANGES_REQUESTED' },
        { bot: false, login: 'other', state: 'DISMISSED' },
      ]),
      [],
    )
  })

  void it('is not eligible while the latest code review has an open escalation', () => {
    recordFixReview(repo.dir, base, head, (review) => {
      review.escalations = [
        {
          detail: 'The tier looks wrong.',
          findingIds: [],
          kind: 'disagreement',
        },
      ]
    })
    assert.deepEqual(
      ineligible(() => undefined),
      [
        'the code review has an open escalation (disagreement): The tier looks wrong.',
      ],
    )
  })

  void it('does not infer workflow from a numeric branch name', () => {
    repo.git('checkout', '--quiet', '-b', '900-sample')
    const state = gateState('900-sample', head, ['src/app.ts'])
    const result = gate(state)
    assert.equal(result.ok || result.eligible, true)
  })
})

void describe('readiness of an eligible pull request', () => {
  void it('passes with a clean fix review at the head and passing checks, and needs no visual review for code-only paths', () => {
    setUp({ 'src/app.ts': 'export const app = 2\n' })
    recordFixReview(repo.dir, base, head)
    const result = gate(gateState(branch, head, ['src/app.ts']))
    assert.equal(result.ok, true, problemsOf(result).join('\n'))
    assert.equal(result.ok && result.value.visualRequired, false)
  })

  void it('lists a draft, a wrong base, being behind, and a missing review', () => {
    setUp({ 'src/app.ts': 'export const app = 2\n' })
    const state = gateState(branch, head, ['src/app.ts'])
    state.pull.draft = true
    state.pull.base = { ref: 'feature' }
    state.behindBy = 2
    const result = gate(state)
    assert.equal(result.ok || result.eligible, true)
    assert.deepEqual(problemsOf(result), [
      'the pull request is a draft',
      'the pull request targets feature, not main',
      'the head is 2 commits behind main; merge origin/main in and push',
      'code review: no review on HEAD or its last 200 ancestors',
    ])
  })

  void it('fails on pending, failed or missing checks and failing statuses', () => {
    setUp({ 'src/app.ts': 'export const app = 2\n' })
    recordFixReview(repo.dir, base, head)
    const state = gateState(branch, head, ['src/app.ts'])
    state.runs = [
      { conclusion: null, name: 'build', status: 'in_progress' },
      { conclusion: 'failure', name: 'lint', status: 'completed' },
      { conclusion: 'skipped', name: 'pixels', status: 'completed' },
      { conclusion: 'neutral', name: 'info', status: 'completed' },
    ]
    state.statuses = [
      { context: 'deploy', state: 'pending' },
      { context: 'legacy', state: 'error' },
    ]
    assert.deepEqual(problemsOf(gate(state)), [
      'check build is in_progress',
      'check lint concluded failure',
      'status deploy is pending',
      'status legacy is error',
    ])
    state.runs = []
    state.statuses = []
    assert.deepEqual(problemsOf(gate(state)), [
      'no check run or commit status exists on the head',
    ])
    assert.deepEqual(
      checkProblems([], [{ context: 'ci/legacy', state: 'success' }]),
      [],
    )
  })

  void it('fails when the review is blocking, is not slice fix, or does not cover the head', () => {
    setUp({ 'src/app.ts': 'export const app = 2\n' })
    recordFixReview(repo.dir, base, head, (review) => {
      review.sliceId = 'A1'
      review.featureDir = 'specs/900-sample'
      review.findings = [
        {
          category: 'correctness',
          confidence: 'high',
          failureScenario: 'Clicking twice submits twice.',
          file: 'src/app.ts',
          id: 'R-001',
          line: 1,
          severity: 'blocking',
          summary: 'Double submit.',
          verification: 'Ran it.',
        },
      ]
    })
    const later = repo.commit('fix: more', {
      'src/app.ts': 'export const app = 3\n',
    })
    const problems = problemsOf(gate(gateState(branch, later, ['src/app.ts'])))
    assert.equal(problems.length, 3)
    assert.match(
      problems[0] ?? '',
      /not single-pull-request work \(slice fix\)/,
    )
    assert.equal(problems[1], 'code review: R-001 is blocking at src/app.ts:1')
    assert.match(
      problems[2] ?? '',
      /does not cover the head: the pull request's own diff changed/,
    )
  })

  void it('keeps the review across a merge of main that leaves the own diff unchanged', () => {
    setUp({ 'src/app.ts': 'export const app = 2\n' })
    recordFixReview(repo.dir, base, head)
    repo.git('checkout', '--quiet', 'main')
    repo.commit('feat: main moves', { 'src/other.ts': 'export const o = 1\n' })
    repo.git('checkout', '--quiet', branch)
    repo.git('merge', '--quiet', '--no-edit', 'main')
    const merged = repo.git('rev-parse', 'HEAD')
    const result = gate(gateState(branch, merged, ['src/app.ts']))
    assert.equal(result.ok, true, problemsOf(result).join('\n'))
  })

  void it('requires a covering, clean visual review of this pull request only when a rendering path changes', () => {
    setUp({ 'packages/styles/src/button.scss': '.b { color: red; }\n' })
    recordFixReview(repo.dir, base, head)
    const state = gateState(branch, head, ['packages/styles/src/button.scss'])
    assert.deepEqual(problemsOf(gate(state)), [
      `visual review (a rendering path changed): no visual review on ${head} or its last 200 ancestors`,
    ])
    recordCleanVisual(repo.dir, base, head, (review) => {
      review.pullRequest = 8
    })
    assert.deepEqual(problemsOf(gate(state)), [
      'visual review: the latest is for pull request #8, not #7',
    ])
    recordCleanVisual(repo.dir, base, head, (review) => {
      review.visualReviewId = '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d'
    })
    const result = gate(state)
    assert.equal(result.ok && result.value.visualRequired, true)
  })

  void it('fails closed when GitHub cannot be read or the head is missing', () => {
    setUp({ 'src/app.ts': 'export const app = 2\n' })
    const offline = gateState(branch, head, ['src/app.ts'])
    offline.offline = true
    const unread = gate(offline)
    assert.equal(unread.ok || unread.eligible, true)
    assert.match(problemsOf(unread)[0] ?? '', /^cannot read the pull request: /)
    const missing = 'f'.repeat(40)
    assert.deepEqual(
      problemsOf(gate(gateState(branch, missing, ['src/app.ts']))),
      [
        `the head ${missing} of ${branch} is not in this clone and could not be fetched from origin; fetch the branch first`,
      ],
    )
  })
})
