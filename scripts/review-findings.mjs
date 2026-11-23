// Ported from pathableai-org/pre-ets scripts/review-findings.ts @ f2ee390 (types stripped only).
/**
 * Code review findings from the reviewer session, stored as git notes on the reviewed SHA, and the review half of
 * the ready gate. See docs/engineering/code-review.md.
 */

/** @typedef {import('./schema-checks.mjs').Validated} Validated */

import {
  ancestorLimit,
  checkNotesRef,
  codeTree,
  isCommit,
  nearestAnnotated,
} from './git-access.mjs'
import {
  importEntry,
  latestEntry,
  latestMatching,
  recordEntry,
} from './note-store.mjs'
/** @typedef {import('./note-store.mjs').NoteTarget} NoteTarget */
import { reviewNotes } from './review-findings/notes.mjs'
import { openBlocking } from './review-findings/schema.mjs'
/** @typedef {import('./review-findings/schema.mjs').Review} Review */

export { defaultNotesRef } from './review-findings/notes.mjs'
export { validateReview } from './review-findings/schema.mjs'
/** @typedef {import('./review-findings/schema.mjs').Review} Review */

const fail = (...problems) => ({
  ok: false,
  problems,
})

const commitsExist = (cwd) => (review) =>
  [review.reviewedSha, review.baseSha]
    .filter((sha) => !isCommit(cwd, sha))
    .map((sha) => `${sha} is not a commit in this repository`)

/** The inputs `review:record` records: the code trees of the base and reviewed SHAs. */
const inputsOf = (cwd, review) => ({
  baseCodeTree: codeTree(cwd, review.baseSha),
  codeTree: codeTree(cwd, review.reviewedSha),
})

/** A review's recorded inputs, when it has them, must be those of its base and reviewed SHAs. */
const inputsMatch = (cwd) => (review) => {
  const missing = commitsExist(cwd)(review)
  if (missing.length > 0 || review.inputs === undefined) return missing
  const actual = inputsOf(cwd, review)
  return actual.codeTree === review.inputs.codeTree &&
    actual.baseCodeTree === review.inputs.baseCodeTree
    ? []
    : [
        `its recorded inputs are not those of ${review.baseSha}..${review.reviewedSha}`,
      ]
}

/** Appends a review to its reviewed SHA's note in `ref`, through `append`, once the ref is known to be a notes ref. */
const appendReview = (cwd, ref, append) => {
  const notes = checkNotesRef(ref)
  return notes.ok
    ? append({ cwd, kind: reviewNotes, ref }, commitsExist(cwd))
    : notes
}

/** Validates a review, records its inputs, and appends it to the note on its reviewed SHA in `ref`. */
export const recordReview = (cwd, ref, json) =>
  appendReview(cwd, ref, (target, check) =>
    recordEntry(target, json, check, (review) =>
      commitsExist(cwd)(review).length === 0
        ? { ...review, inputs: inputsOf(cwd, review) }
        : review,
    ),
  )

/**
 * Validates a review recorded in another clone and appends it in `ref` unless its ID is already there. Recorded
 * inputs must match its commits.
 */
export const importReview = (cwd, ref, json) =>
  appendReview(cwd, ref, (target) =>
    importEntry(target, json, inputsMatch(cwd)),
  )

/** The latest review on `revision` in `ref`. */
export const latestReview = (cwd, ref, revision) => {
  const notes = checkNotesRef(ref)
  if (!notes.ok) return notes
  const latest = latestEntry({ cwd, kind: reviewNotes, ref }, revision)
  if (!latest.ok) return latest
  return latest.value === undefined
    ? fail(`no review on ${revision} in ${ref}`)
    : { ok: true, value: latest.value }
}

/** The nearest commit at or below `head` with a review note in `ref`, and its latest review. */
export const nearestReview = (cwd, ref, head) => {
  const reviewed = nearestAnnotated(cwd, ref, head)
  return reviewed === undefined
    ? fail(`no review on HEAD or its last ${String(ancestorLimit)} ancestors`)
    : latestReview(cwd, ref, reviewed)
}

/** The latest review in `ref` that `matches` accepts, from the commit whose note was written most recently. */
export const latestReviewMatching = (cwd, ref, matches) => {
  const notes = checkNotesRef(ref)
  return notes.ok
    ? latestMatching({ cwd, kind: reviewNotes, ref }, matches)
    : notes
}

/** Why a review does not let the pull request proceed: open blocking findings and escalations. Empty passes. */
export const reviewProblems = (review) => [
  ...openBlocking(review).map(
    (entry) => `${entry.id} is blocking at ${entry.file}:${String(entry.line)}`,
  ),
  ...review.escalations.map(
    (entry) => `open escalation (${entry.kind}): ${entry.detail}`,
  ),
]

/** A review's counts and one line per open blocking finding. */
export const blockingSummary = (review) => {
  const blocking = openBlocking(review)
  const scope =
    review.sliceId.toLowerCase() === 'fix'
      ? 'for this pull request'
      : `for legacy slice ${review.sliceId}`
  const head =
    `Review ${review.reviewId} (round ${String(review.round)}) ${scope} at ${review.reviewedSha}: ` +
    `${String(blocking.length)} blocking, ${String(review.findings.length - blocking.length)} advisory, ` +
    `${String(review.escalations.length)} escalations.\n`
  return (
    head +
    blocking
      .map(
        (entry) =>
          `  ${entry.id} ${entry.file}:${String(entry.line)} ${entry.summary}\n`,
      )
      .join('')
  )
}
