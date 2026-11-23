import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it } from 'node:test'

import {
  publishLatest,
  publishVisualReview,
  syncPullNotes,
} from '../note-sync.mjs'
import { formatComment, parseComment } from '../note-sync/comment.mjs'
import { renderVisualReview } from '../note-sync/render.mjs'
import { defaultNotesRef } from '../review-findings.mjs'
import {
  defaultVisualNotesRef,
  latestVisualReview,
  nearestVisualReview,
  recordVisualReview,
  validateVisualReview,
  visualProblems,
} from '../visual-review.mjs'
import { fakeGitHub, restPull, sampleRepo } from './support.mjs'

const branch = 'work/button-focus'
const page = 'https://claude.ai/artifact/0f4b2c6e-screens'

/** A round-one visual review of pull request 7 from `base` to `sha` with one blocking and one advisory finding. */
const sampleVisual = (
  base = '1111111111111111111111111111111111111111',
  sha = '2222222222222222222222222222222222222222',
  edit = () => undefined,
) => {
  const review = {
    baseSha: base,
    captures: [
      {
        conditions: ['default', 'focus'],
        reason: 'The pull request changes the button focus ring.',
        story: 'components-button--primary',
        theme: 'default',
        viewports: ['mobile', 'desktop'],
      },
    ],
    closed: [],
    escalations: [],
    findings: [
      {
        category: 'unexplained',
        condition: 'focus',
        confidence: 'high',
        id: 'VR-001',
        observed:
          'The head draws a 3 px ring; the base drew 2 px. The pull request does not mention it.',
        severity: 'blocking',
        story: 'components-button--primary',
        summary: 'The focus ring grew without a stated reason.',
        verification: 'Re-captured both SHAs; 412 pixels differ.',
        viewport: 'desktop',
      },
      {
        category: 'brand',
        confidence: 'medium',
        id: 'VR-002',
        observed: 'The label sits 1 px low against the icon.',
        severity: 'advisory',
        story: 'components-button--primary',
        summary: 'Icon and label baselines differ by a pixel.',
        verification: 'Measured in the head capture.',
      },
    ],
    page,
    pullRequest: 7,
    reviewedSha: sha,
    round: 1,
    schemaVersion: 1,
    visualReviewId: '6d1e2f3a-4b5c-4d6e-8f70-112233445566',
  }
  edit(review)
  return review
}

const problems = (edit) => {
  const result = validateVisualReview(sampleVisual(undefined, undefined, edit))
  return result.ok ? [] : result.problems
}

void describe('visual review schema', () => {
  void it('accepts the sample, which does not pass while a blocking finding is open', () => {
    const result = validateVisualReview(sampleVisual())
    assert.ok(result.ok)
    assert.deepEqual(visualProblems(result.value), [
      'VR-001 is blocking in components-button--primary at desktop: The focus ring grew without a stated reason.',
    ])
  })

  void it('passes with only advisory findings, and fails on an open escalation', () => {
    const clean = sampleVisual(undefined, undefined, (review) => {
      review.findings = review.findings.slice(1)
    })
    assert.deepEqual(visualProblems(clean), [])
    const escalated = sampleVisual(undefined, undefined, (review) => {
      review.findings = []
      review.escalations = [
        { detail: 'Needs a brand decision.', findingIds: [], kind: 'design' },
      ]
    })
    assert.ok(validateVisualReview(escalated).ok)
    assert.deepEqual(visualProblems(escalated), [
      'open escalation (design): Needs a brand decision.',
    ])
  })

  void it('holds section-508 findings to a criterion and blocking, and brand findings to the default theme', () => {
    assert.deepEqual(
      problems((review) => {
        Object.assign(review.findings[0], { category: 'section-508' })
        Object.assign(review.findings[1], {
          category: 'section-508',
          criterion: '1.4.3',
        })
      }),
      [
        '$.findings: VR-001 is a section-508 finding without a criterion',
        '$.findings: VR-002 is a section-508 finding, which always blocks',
      ],
    )
    assert.deepEqual(
      problems((review) => {
        review.captures[0].theme = 'other'
      }),
      [
        '$.findings: VR-002 is a brand finding on components-button--primary, which was not captured in the default theme',
      ],
    )
    assert.deepEqual(
      problems((review) => {
        review.findings[0].criterion = 'contrast'
      }),
      [
        '$.findings[0].criterion: expected a WCAG success criterion number such as 1.4.3',
      ],
    )
  })

  void it('accepts a section 508 conflict escalation only when it names a finding', () => {
    const conflict = (findingIds) =>
      sampleVisual(undefined, undefined, (review) => {
        Object.assign(review.findings[0], {
          category: 'section-508',
          criterion: '1.4.3',
        })
        review.escalations = [
          {
            detail:
              'BRAND_RULES.md asks for white labels on Intelligent Jade, which fails 1.4.3.',
            findingIds,
            kind: 'section 508 conflict',
          },
        ]
      })
    assert.ok(validateVisualReview(conflict(['VR-001'])).ok)
    assert.deepEqual(validateVisualReview(conflict([])).problems, [
      '$.escalations[0].findingIds: a section 508 conflict names the section-508 finding it concerns',
    ])
  })

  void it('rejects bad enums, IDs, story IDs and an empty capture list', () => {
    assert.deepEqual(
      problems((review) => {
        review.captures = []
      }),
      ['$.captures: expected at least one entry'],
    )
    assert.deepEqual(
      problems((review) => {
        Object.assign(review.findings[0], {
          category: 'correctness',
          condition: 'dark',
          id: 'R-001',
          story: 'Button Primary',
          viewport: 'watch',
        })
      }),
      [
        '$.findings[0].category: expected one of section-508, regression, unexplained, defect, brand, baseline, missing, tier',
        '$.findings[0].condition: expected one of default, focus, forced-colors, text-200, reduced-motion',
        '$.findings[0].id: expected a finding ID such as VR-001',
        '$.findings[0].story: expected a Storybook story ID such as components-button--primary',
        '$.findings[0].viewport: expected one of mobile, tablet, desktop',
      ],
    )
    assert.deepEqual(
      problems((review) => {
        review.captures[0].viewports = []
        review.pullRequest = 0
        review.page = ''
      }),
      [
        '$.captures[0].viewports: expected at least one entry',
        '$.page: expected non-empty text',
        '$.pullRequest: expected a positive integer',
      ],
    )
  })

  void it('checks the rules across fields', () => {
    assert.deepEqual(
      problems((review) => {
        review.findings = Array.from({ length: 11 }, (_, index) => ({
          ...review.findings[1],
          id: `VR-${String(index + 1).padStart(3, '0')}`,
        }))
      }),
      ['$.findings: report at most 10 findings'],
    )
    assert.deepEqual(
      problems((review) => {
        review.closed = [{ closure: 'fixed', id: 'VR-001', note: 'abc1234' }]
        review.escalations = [
          { detail: 'Disputed.', findingIds: ['VR-009'], kind: 'disagreement' },
        ]
      }),
      [
        '$: VR-001 appears more than once',
        '$.escalations[0].findingIds: VR-009 is not a finding in this review',
      ],
    )
    assert.deepEqual(
      problems((review) => {
        review.round = 3
        review.baseSha = review.reviewedSha
      }),
      [
        '$.escalations: round 3 with open blocking findings needs a third round escalation',
        '$.baseSha: must differ from reviewedSha',
      ],
    )
    assert.deepEqual(
      problems((review) => {
        review.round = 3
        review.escalations = [
          {
            detail: 'Still open.',
            findingIds: ['VR-001'],
            kind: 'third round',
          },
        ]
      }),
      [],
    )
  })
})

let repo
let base
let reviewed

beforeEach(() => {
  repo = sampleRepo()
  base = repo.git('rev-parse', 'main')
  reviewed = repo.commit('feat: focus ring', {
    'src/app.ts': 'export const app = 2\n',
  })
})

afterEach(() => {
  repo.remove()
})

const record = (edit, dir = repo.dir) => {
  const recorded = recordVisualReview(
    dir,
    defaultVisualNotesRef,
    JSON.stringify(sampleVisual(base, reviewed, edit)),
  )
  assert.ok(recorded.ok, recorded.ok ? '' : recorded.problems.join('\n'))
  return recorded.value
}

void describe('recording and reading visual reviews', () => {
  void it('records inputs, reads the latest back, and finds it from a later commit', () => {
    const first = record()
    assert.equal(typeof first.inputs?.codeTree, 'string')
    assert.equal(typeof first.inputs?.baseCodeTree, 'string')
    const second = record((review) => {
      review.visualReviewId = '7e2f3a4b-5c6d-4e7f-8a91-223344556677'
      review.round = 2
      review.findings = []
      review.closed = [
        { closure: 'fixed', id: 'VR-001', note: 'ring restored' },
        { closure: 'withdrawn', id: 'VR-002', note: 'within tolerance' },
      ]
    })
    assert.equal(second.supersedesVisualReviewId, first.visualReviewId)
    const latest = latestVisualReview(repo.dir, defaultVisualNotesRef, reviewed)
    assert.deepEqual(latest, { ok: true, value: second })
    repo.commit('docs: later', { 'README.md': '# Later\n' })
    const nearest = nearestVisualReview(repo.dir, defaultVisualNotesRef, 'HEAD')
    assert.equal(
      nearest.ok && nearest.value.visualReviewId,
      second.visualReviewId,
    )
    assert.equal(repo.git('notes', `--ref=${defaultNotesRef}`, 'list'), '')
  })

  void it('refuses unknown commits, a reused ID, and a ref outside refs/notes/', () => {
    const unknown = recordVisualReview(
      repo.dir,
      defaultVisualNotesRef,
      JSON.stringify(sampleVisual(base, 'a'.repeat(40))),
    )
    assert.deepEqual(unknown.ok ? [] : unknown.problems, [
      `${'a'.repeat(40)} is not a commit in this repository`,
    ])
    record()
    const again = recordVisualReview(
      repo.dir,
      defaultVisualNotesRef,
      JSON.stringify(sampleVisual(base, reviewed)),
    )
    assert.equal(again.ok, false)
    const branchRef = recordVisualReview(
      repo.dir,
      'refs/heads/main',
      JSON.stringify(sampleVisual(base, reviewed)),
    )
    assert.deepEqual(branchRef.ok ? [] : branchRef.problems, [
      'refs/heads/main is not a ref under refs/notes/',
    ])
    const none = nearestVisualReview(
      repo.dir,
      'refs/notes/visual-trial',
      'HEAD',
    )
    assert.equal(none.ok, false)
  })
})

void describe('visual review comments', () => {
  void it('formats a comment that links the screenshots page and parses back to the same entry', () => {
    const entry = sampleVisual(base, reviewed)
    const rendered = renderVisualReview(entry, {
      earlier: [],
      repository: 'https://github.test/owner/repo',
    })
    assert.match(rendered, /^\*\*Visual review\*\* `6d1e2f3a-/)
    assert.ok(rendered.includes(`[Screenshots](${page})`))
    assert.match(
      rendered,
      /- \*\*blocking\*\* VR-001 `components-button--primary, desktop, focus` \(unexplained\)/,
    )
    assert.match(rendered, /#### Captures/)
    const marker = { id: entry.visualReviewId, kind: 'visual', sha: reviewed }
    const parsed = parseComment(formatComment(marker, rendered, entry))
    assert.deepEqual(parsed, {
      ok: true,
      value: { ...marker, entry: JSON.parse(JSON.stringify(entry)) },
    })
  })

  void it('publishes a recorded visual review and imports it into another clone', () => {
    const github = fakeGitHub({
      pulls: [restPull(7, { ref: branch, sha: reviewed })],
    })
    const recorded = record()
    const published = publishVisualReview(
      { cwd: repo.dir, rest: github },
      recorded,
    )
    assert.ok(published.ok && published.value.posted)
    const [comment] = github.comments.get(7) ?? []
    assert.ok(
      String(comment?.body).startsWith(
        `<!-- pathable-note kind=visual sha=${reviewed} id=${recorded.visualReviewId} -->\n**Visual review**`,
      ),
    )
    const other = sampleRepo()
    try {
      other.git(
        'fetch',
        '--quiet',
        repo.dir,
        `${branch}:refs/remotes/origin/${branch}`,
      )
      const synced = syncPullNotes(
        { cwd: other.dir, refs: { review: defaultNotesRef }, rest: github },
        7,
      )
      assert.deepEqual(synced.ok && synced.value, {
        imported: 1,
        present: 0,
        rejected: [],
        unavailable: [],
      })
      assert.deepEqual(
        latestVisualReview(other.dir, defaultVisualNotesRef, reviewed),
        { ok: true, value: JSON.parse(JSON.stringify(recorded)) },
      )
    } finally {
      other.remove()
    }
  })

  void it('posts the latest local visual review with notes:publish visual', () => {
    const github = fakeGitHub({
      pulls: [restPull(7, { ref: branch, sha: reviewed })],
    })
    const recorded = record()
    const target = {
      cwd: repo.dir,
      refs: { review: defaultNotesRef },
      rest: github,
    }
    const published = publishLatest(target, 'visual', reviewed)
    assert.deepEqual(published, {
      ok: true,
      value: {
        posted: true,
        pr: 7,
        url: 'https://github.test/pull/7#issuecomment-1',
      },
    })
    const parsed = parseComment(String(github.comments.get(7)?.[0]?.body))
    assert.equal(parsed?.ok && parsed.value.kind, 'visual')
    assert.equal(parsed?.ok && parsed.value.id, recorded.visualReviewId)
    const again = publishLatest({ ...target, pr: '7' }, 'visual', reviewed)
    assert.deepEqual(again, {
      ok: true,
      value: { posted: false, pr: 7, url: undefined },
    })
  })
})
