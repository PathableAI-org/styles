/**
 * The merge gate for agent merge: whether a pull request is eligible for an agent to merge it, and whether it is ready
 * to merge now. It reads the pull request, its files, reviews, checks and statuses through REST, syncs its note
 * comments, and judges the latest code review and visual review at the head.
 * See docs/engineering/git-workflow.md#agent-merge and docs/engineering/visual-review.md.
 */
import { execFileSync } from 'node:child_process'

import { fetchCommit, isCommit } from './git-access.mjs'
import { syncNotice } from './note-sync.mjs'
import {
  defaultNotesRef,
  nearestReview,
  reviewProblems,
} from './review-findings.mjs'
import { isFixSlice, isRecord } from './schema-checks.mjs'
import {
  defaultVisualNotesRef,
  nearestVisualReview,
  visualProblems,
} from './visual-review.mjs'

/** @typedef {import('./github-access.mjs').RestAccess} RestAccess */

/**
 * Files whose change waits for a person, whatever the tier: docs/engineering/git-workflow.md#guardrail-changes. A
 * pattern ending in `/` is a directory prefix; otherwise `**\/` matches any leading directories and `*` any run of
 * characters within one path segment.
 */
export const guardrailPaths = [
  '.claude/',
  'scripts/claude/',
  '.agents/skills/',
  '**/eslint.config.*',
  '**/.eslintrc*',
  '**/stylelint.config.*',
  '**/.stylelintrc*',
  '**/.markdownlint*',
  '**/prettier.config.*',
  '**/.prettierrc*',
  '**/.prettierignore',
  '**/lint-staged.config.*',
  '**/.lintstagedrc*',
  '.husky/',
  '**/commitlint.config.*',
  '**/.commitlintrc*',
  'scripts/accessibility-exceptions.mjs',
  '**/tsconfig*.json',
  '.github/',
  'renovate.json5',
  '.changeset/config.json',
  'scripts/merge-gate.mjs',
  'scripts/merge-hook.mjs',
  'scripts/ready-hook.mjs',
  'scripts/guardrail-write.mjs',
  'scripts/verification.mjs',
  'scripts/verification/',
  'scripts/review-findings/',
  'scripts/visual-review/',
  'scripts/note-sync.mjs',
  'scripts/note-sync/',
  'scripts/note-store.mjs',
  'scripts/merge.mjs',
  'scripts/verify.mjs',
  'scripts/review.mjs',
  'scripts/visual.mjs',
  'scripts/notes.mjs',
  'scripts/review-findings.mjs',
  'scripts/visual-review.mjs',
  'scripts/schema-checks.mjs',
  'scripts/git-access.mjs',
  'scripts/github-access.mjs',
  'scripts/cli.mjs',
  'package.json',
  '**/AGENTS.md',
  'CLAUDE.md',
  'docs/engineering/',
]

/** Paths whose change can alter what the Storybooks render: docs/engineering/visual-review.md#when-a-visual-review-runs. */
export const renderingPaths = [
  'packages/styles/src/',
  'packages/styles/scripts/',
  'packages/styles/package.json',
  'packages/react/src/',
  'packages/react/package.json',
  'apps/storybook/',
  'apps/storybook-react/',
  'visual-baselines/',
  'pnpm-lock.yaml',
]

const globSource = (pattern) =>
  pattern
    .split(/(\*\*\/|\*)/)
    .map((part) => {
      if (part === '**/') return '(?:.*/)?'
      if (part === '*') return '[^/]*'
      return part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    })
    .join('')

/** Whether a repository-relative path matches one pattern from `guardrailPaths` or `renderingPaths`. */
export const matchesPattern = (path, pattern) =>
  pattern.endsWith('/')
    ? path.startsWith(pattern)
    : new RegExp(`^${globSource(pattern)}$`).test(path)

/** Whether any of `paths` matches any of `patterns`. */
export const matchesAny = (paths, patterns) =>
  paths.some((path) =>
    patterns.some((pattern) => matchesPattern(path, pattern)),
  )

/** The paths among `paths` that match any of `patterns`. */
export const matchingPaths = (paths, patterns) =>
  paths.filter((path) =>
    patterns.some((pattern) => matchesPattern(path, pattern)),
  )

// Git

const git = (cwd, args, input) =>
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    input,
    maxBuffer: 256 * 1024 * 1024,
    stdio: 'pipe',
    timeout: 60_000,
  })

const gitSucceeds = (cwd, args) => {
  try {
    git(cwd, args)
    return true
  } catch {
    return false
  }
}

/** The main branch the pull request's own diff is taken against: `origin/main` when this clone has it, else `main`. */
export const mainRefFor = (cwd) =>
  gitSucceeds(cwd, ['rev-parse', '--verify', '--quiet', 'origin/main^{commit}'])
    ? 'origin/main'
    : 'main'

/** The stable patch ID of `sha`'s own diff: from its merge base with `mainRef` to `sha`. Empty for an empty diff. */
export const ownPatchId = (cwd, mainRef, sha) => {
  const base = git(cwd, ['merge-base', mainRef, sha]).trim()
  const diff = git(cwd, ['diff', '--binary', base, sha])
  return git(cwd, ['patch-id', '--stable'], diff).trim().split(' ')[0] ?? ''
}

/**
 * Whether a review recorded at `reviewedSha` still covers `head`, as docs/engineering/git-workflow.md#keeping-up-to-date
 * defines: the same commit; or `reviewedSha` is an ancestor of `head` and either nothing changed between them, or the
 * pull request's own diff against `mainRef` has the same patch ID at both. `how` says which, or why not.
 */
export const reviewCoversHead = (
  cwd,
  reviewedSha,
  head,
  mainRef = mainRefFor(cwd),
) => {
  if (reviewedSha === head) return { covers: true, how: 'reviewed at the head' }
  if (!isCommit(cwd, reviewedSha))
    return { covers: false, how: `${reviewedSha} is not in this clone` }
  if (!gitSucceeds(cwd, ['merge-base', '--is-ancestor', reviewedSha, head]))
    return {
      covers: false,
      how: `${reviewedSha} is not an ancestor of the head ${head}`,
    }
  if (git(cwd, ['diff', '--name-only', reviewedSha, head]).trim() === '')
    return { covers: true, how: `no path changed since ${reviewedSha}` }
  try {
    return ownPatchId(cwd, mainRef, reviewedSha) ===
      ownPatchId(cwd, mainRef, head)
      ? {
          covers: true,
          how: `the pull request's own diff is unchanged since ${reviewedSha}`,
        }
      : {
          covers: false,
          how: `the pull request's own diff changed after ${reviewedSha}; request a new round at the head ${head}`,
        }
  } catch {
    return {
      covers: false,
      how: `cannot compare the diffs of ${reviewedSha} and ${head} against ${mainRef}`,
    }
  }
}

/** Fetches `main` from `origin` so the merge base is taken against the current main. Best effort: offline is fine. */
const refreshMain = (cwd) =>
  gitSucceeds(cwd, ['fetch', '--quiet', '--no-tags', 'origin', 'main'])

// GitHub

const fail = (...problems) => ({ ok: false, problems })

const firstLine = (error) => {
  const stderr = isRecord(error) ? error.stderr : undefined
  const text =
    typeof stderr === 'string' && stderr.trim().length > 0
      ? stderr
      : String(error)
  return text.trim().split('\n')[0] ?? 'unknown error'
}

/** One REST GET, read by `read`; a thrown error or a shape `read` refuses is a problem. */
const restGet = (rest, path, read) => {
  let value
  try {
    value = rest.get(path)
  } catch (error) {
    return fail(`GitHub ${path}: ${firstLine(error)}`)
  }
  const result = read(value)
  return result === undefined
    ? fail(`GitHub ${path}: unexpected response`)
    : { ok: true, value: result }
}

const pageSize = 100

/** Every item of a paginated REST route; `items` takes one page's response and returns its items or undefined. */
const restPages = (rest, path, items) => {
  const all = []
  const separator = path.includes('?') ? '&' : '?'
  for (let page = 1; ; page += 1) {
    const batch = restGet(
      rest,
      `${path}${separator}per_page=${String(pageSize)}&page=${String(page)}`,
      items,
    )
    if (!batch.ok) return batch
    all.push(...batch.value)
    if (batch.value.length < pageSize) return { ok: true, value: all }
  }
}

const listOf = (read) => (value) => {
  if (!Array.isArray(value)) return undefined
  const items = value.map(read)
  return items.every((item) => item !== undefined) ? items : undefined
}

const stringField = (value, key) =>
  isRecord(value) && typeof value[key] === 'string' ? value[key] : undefined

/**
 * @typedef {object} GatePull
 * @property {string} baseRef
 * @property {boolean} draft
 * @property {string} headRef
 * @property {string} headSha
 * @property {readonly string[]} labels
 * @property {number} number
 * @property {string} state
 * @property {string} title
 */

const readGatePull = (value) => {
  if (!isRecord(value) || typeof value.number !== 'number') return undefined
  const headRef = stringField(value.head, 'ref')
  const headSha = stringField(value.head, 'sha')
  const baseRef = stringField(value.base, 'ref')
  const state = stringField(value, 'state')
  if (
    headRef === undefined ||
    headSha === undefined ||
    baseRef === undefined ||
    state === undefined
  )
    return undefined
  return {
    baseRef,
    draft: value.draft === true,
    headRef,
    headSha,
    labels: Array.isArray(value.labels)
      ? value.labels.flatMap((label) => {
          const name = stringField(label, 'name')
          return name === undefined ? [] : [name]
        })
      : [],
    number: value.number,
    state,
    title: stringField(value, 'title') ?? '',
  }
}

const readFile = (value) => {
  const filename = stringField(value, 'filename')
  if (filename === undefined) return undefined
  const previous = stringField(value, 'previous_filename')
  return previous === undefined ? [filename] : [filename, previous]
}

/**
 * @typedef {object} PullReview
 * @property {string} login
 * @property {boolean} bot
 * @property {string} state APPROVED, CHANGES_REQUESTED, COMMENTED, DISMISSED or PENDING.
 */

const readReview = (value) => {
  const state = stringField(value, 'state')
  const login = isRecord(value) ? stringField(value.user, 'login') : undefined
  if (state === undefined || login === undefined) return undefined
  return {
    bot: isRecord(value) && stringField(value.user, 'type') === 'Bot',
    login,
    state,
  }
}

const readCheckRuns = (value) => {
  if (!isRecord(value) || !Array.isArray(value.check_runs)) return undefined
  return listOf((run) => {
    const name = stringField(run, 'name')
    const status = stringField(run, 'status')
    if (name === undefined || status === undefined) return undefined
    return {
      conclusion:
        isRecord(run) && typeof run.conclusion === 'string'
          ? run.conclusion
          : undefined,
      name,
      status,
    }
  })(value.check_runs)
}

const readStatuses = (value) => {
  if (!isRecord(value) || !Array.isArray(value.statuses)) return undefined
  return listOf((status) => {
    const context = stringField(status, 'context')
    const state = stringField(status, 'state')
    return context === undefined || state === undefined
      ? undefined
      : { context, state }
  })(value.statuses)
}

const readBehindBy = (value) =>
  isRecord(value) && typeof value.behind_by === 'number'
    ? value.behind_by
    : undefined

// Eligibility

const riskLabels = ['risk:high', 'risk:standard', 'risk:light']
const holdLabel = 'hold'
const releaseTitle = /^ci: version packages\b/i
const releaseBranch = /^changeset-release\//

/** People whose latest review that is not a comment requests changes. Bots' reviews and comments do not count. */
export const changesRequestedBy = (reviews) => {
  const latest = new Map()
  for (const review of reviews) {
    if (
      review.bot ||
      review.state === 'COMMENTED' ||
      review.state === 'PENDING'
    )
      continue
    latest.set(review.login, review.state)
  }
  return [...latest]
    .filter(([, state]) => state === 'CHANGES_REQUESTED')
    .map(([login]) => login)
}

/**
 * @typedef {object} EligibilityFacts
 * @property {readonly string[]} escalations Open escalations in the latest code and visual reviews, one line each.
 * @property {readonly string[]} files Every path the pull request changes, renamed-from paths included.
 * @property {GatePull} pull
 * @property {readonly PullReview[]} reviews The pull request's GitHub reviews, oldest first.
 */

/**
 * Why the pull request is not one an agent may merge (docs/engineering/git-workflow.md#which-pull-requests), so a
 * person must decide. Empty when it is eligible.
 */
export const mergeEligibility = (facts) => {
  const { pull } = facts
  const risk = pull.labels.filter((label) => riskLabels.includes(label))
  const guardrails = matchingPaths(facts.files, guardrailPaths)
  return [
    ...(pull.labels.includes('risk:high')
      ? ["it is labelled risk:high, which merges on a person's approval"]
      : []),
    ...(risk.length === 0
      ? ['it has no risk label (risk:standard or risk:light)']
      : []),
    ...(risk.length > 1
      ? [`it has more than one risk label (${risk.join(', ')})`]
      : []),
    ...(guardrails.length > 0
      ? [`it changes guardrail files: ${guardrails.join(', ')}`]
      : []),
    ...(releaseTitle.test(pull.title) || releaseBranch.test(pull.headRef)
      ? [
          'it is the ci: version packages release pull request, which publishes to npm',
        ]
      : []),
    ...(pull.labels.includes(holdLabel) ? ['it is labelled hold'] : []),
    ...changesRequestedBy(facts.reviews).map(
      (login) => `${login} requested changes`,
    ),
    ...facts.escalations,
  ]
}

// Readiness

/** Problems with the head's check runs and commit statuses: unfinished, failed, or none at all. */
export const checkProblems = (runs, statuses) => {
  if (runs.length === 0 && statuses.length === 0)
    return ['no check run or commit status exists on the head']
  return [
    ...runs.flatMap((run) => {
      if (run.status !== 'completed')
        return [`check ${run.name} is ${run.status}`]
      return ['success', 'neutral', 'skipped'].includes(run.conclusion ?? '')
        ? []
        : [
            `check ${run.name} concluded ${run.conclusion ?? 'without a conclusion'}`,
          ]
    }),
    ...statuses.flatMap((status) =>
      status.state === 'success'
        ? []
        : [`status ${status.context} is ${status.state}`],
    ),
  ]
}

const coverageProblems = (cwd, label, reviewedSha, head, mainRef) => {
  const coverage = reviewCoversHead(cwd, reviewedSha, head, mainRef)
  return coverage.covers
    ? []
    : [`${label} does not cover the head: ${coverage.how}`]
}

/** The code review half of the merge gate. */
const codeReviewProblems = (cwd, pull, mainRef) => {
  const review = nearestReview(cwd, defaultNotesRef, pull.headSha)
  if (!review.ok)
    return review.problems.map((problem) => `code review: ${problem}`)
  return [
    ...(isFixSlice(review.value.sliceId)
      ? []
      : [
          `code review: the review is for slice ${review.value.sliceId}, not single-pull-request work (slice fix)`,
        ]),
    ...reviewProblems(review.value).map((problem) => `code review: ${problem}`),
    ...coverageProblems(
      cwd,
      `code review ${review.value.reviewId}`,
      review.value.reviewedSha,
      pull.headSha,
      mainRef,
    ),
  ]
}

const visualReviewProblems = (cwd, pull, mainRef) => {
  const review = nearestVisualReview(cwd, defaultVisualNotesRef, pull.headSha)
  if (!review.ok)
    return review.problems.map(
      (problem) => `visual review (a rendering path changed): ${problem}`,
    )
  return [
    ...(review.value.pullRequest === pull.number
      ? []
      : [
          `visual review: the latest is for pull request #${String(review.value.pullRequest)}, not #${String(pull.number)}`,
        ]),
    ...visualProblems(review.value).map(
      (problem) => `visual review: ${problem}`,
    ),
    ...coverageProblems(
      cwd,
      `visual review ${review.value.visualReviewId}`,
      review.value.reviewedSha,
      pull.headSha,
      mainRef,
    ),
  ]
}

/** Open escalations in the latest code review and, when one is needed, the latest visual review at or below the head. */
const openEscalations = (cwd, head) => {
  const review = nearestReview(cwd, defaultNotesRef, head)
  const visual = nearestVisualReview(cwd, defaultVisualNotesRef, head)
  return [
    ...(review.ok
      ? review.value.escalations.map(
          (entry) =>
            `the code review has an open escalation (${entry.kind}): ${entry.detail}`,
        )
      : []),
    ...(visual.ok
      ? visual.value.escalations.map(
          (entry) =>
            `the visual review has an open escalation (${entry.kind}): ${entry.detail}`,
        )
      : []),
  ]
}

/**
 * @typedef {object} MergeGatePass
 * @property {string} head
 * @property {string} notice The note sync result.
 * @property {number} pr
 * @property {boolean} visualRequired
 */

/**
 * @typedef {{ readonly ok: true; readonly value: MergeGatePass } | { readonly ok: false; readonly eligible: boolean; readonly problems: readonly string[]; readonly notice?: string | undefined }} MergeGateResult
 */

const notEligible = (problems, notice) => ({
  eligible: false,
  notice,
  ok: false,
  problems,
})
const notReady = (problems, notice) => ({
  eligible: true,
  notice,
  ok: false,
  problems,
})

/** Reads every REST fact the gate needs about pull request `pr` in `repository`. */
const readFacts = (rest, repository, pr) => {
  const base = `repos/${repository}`
  const pull = restGet(rest, `${base}/pulls/${String(pr)}`, readGatePull)
  if (!pull.ok) return pull
  const files = restPages(
    rest,
    `${base}/pulls/${String(pr)}/files`,
    listOf(readFile),
  )
  if (!files.ok) return files
  const reviews = restPages(
    rest,
    `${base}/pulls/${String(pr)}/reviews`,
    listOf(readReview),
  )
  if (!reviews.ok) return reviews
  return {
    ok: true,
    value: {
      files: [...new Set(files.value.flat())],
      pull: pull.value,
      reviews: reviews.value,
    },
  }
}

/** The head's check runs, commit statuses and how far it is behind main. */
const readHeadState = (rest, repository, head) => {
  const base = `repos/${repository}`
  const runs = restPages(
    rest,
    `${base}/commits/${head}/check-runs`,
    readCheckRuns,
  )
  if (!runs.ok) return runs
  const statuses = restPages(
    rest,
    `${base}/commits/${head}/status`,
    readStatuses,
  )
  if (!statuses.ok) return statuses
  const behind = restGet(rest, `${base}/compare/main...${head}`, readBehindBy)
  if (!behind.ok) return behind
  return {
    ok: true,
    value: {
      behindBy: behind.value,
      runs: runs.value,
      statuses: statuses.value,
    },
  }
}

/**
 * The merge gate for pull request `prNumber`: docs/engineering/git-workflow.md#the-merge-gate. `eligible: false`
 * means the pull request is not one an agent may merge, so a person must decide; `eligible: true` with problems means
 * it is eligible but not ready, or that the gate could not establish the facts it needs (fail closed).
 */
export const runMergeGate = (
  cwd,
  rest,
  prNumber,
  repository = '{owner}/{repo}',
) => {
  const facts = readFacts(rest, repository, prNumber)
  if (!facts.ok)
    return notReady([
      `cannot read the pull request: ${facts.problems.join('; ')}`,
    ])
  const { files, pull, reviews } = facts.value
  const restIneligible = mergeEligibility({
    escalations: [],
    files,
    pull,
    reviews,
  })
  if (restIneligible.length > 0) return notEligible(restIneligible)
  if (!isCommit(cwd, pull.headSha) && !fetchCommit(cwd, pull.headSha)) {
    return notReady([
      `the head ${pull.headSha} of ${pull.headRef} is not in this clone and could not be fetched from origin; fetch the branch first`,
    ])
  }
  const notice = syncNotice(
    { cwd, refs: { review: defaultNotesRef }, rest },
    pull.number,
  )
  const ineligible = mergeEligibility({
    escalations: openEscalations(cwd, pull.headSha),
    files,
    pull,
    reviews,
  })
  if (ineligible.length > 0) return notEligible(ineligible, notice)
  const state = readHeadState(rest, repository, pull.headSha)
  if (!state.ok)
    return notReady(
      [`cannot read the head's checks: ${state.problems.join('; ')}`],
      notice,
    )
  refreshMain(cwd)
  const mainRef = mainRefFor(cwd)
  const visualRequired = matchesAny(files, renderingPaths)
  const problems = [
    ...(pull.state === 'open'
      ? []
      : [`the pull request is ${pull.state}, not open`]),
    ...(pull.draft ? ['the pull request is a draft'] : []),
    ...(pull.baseRef === 'main'
      ? []
      : [`the pull request targets ${pull.baseRef}, not main`]),
    ...(state.value.behindBy > 0
      ? [
          `the head is ${String(state.value.behindBy)} commits behind main; merge origin/main in and push`,
        ]
      : []),
    ...checkProblems(state.value.runs, state.value.statuses),
    ...codeReviewProblems(cwd, pull, mainRef),
    ...(visualRequired ? visualReviewProblems(cwd, pull, mainRef) : []),
  ]
  return problems.length > 0
    ? notReady(problems, notice)
    : {
        ok: true,
        value: { head: pull.headSha, notice, pr: pull.number, visualRequired },
      }
}
