/**
 * Visual reviews from the visual reviewer session, stored as git notes on the reviewed SHA, and the visual half of
 * the merge gate. See docs/engineering/visual-review.md.
 */

/** @typedef {import('./schema-checks.mjs').Validated} Validated */

import {
  ancestorLimit,
  checkNotesRef,
  codeTree,
  isCommit,
  nearestAnnotated,
} from './git-access.mjs'
import { importEntry, latestEntry, recordEntry } from './note-store.mjs'
import { visualNotes } from './visual-review/notes.mjs'
import { openBlockingVisual } from './visual-review/schema.mjs'
/** @typedef {import('./visual-review/schema.mjs').VisualReview} VisualReview */

export { defaultVisualNotesRef } from './visual-review/notes.mjs'
export {
  openBlockingVisual,
  validateVisualReview,
} from './visual-review/schema.mjs'

const fail = (...problems) => ({
  ok: false,
  problems,
})

const commitsExist = (cwd) => (review) =>
  [review.reviewedSha, review.baseSha]
    .filter((sha) => !isCommit(cwd, sha))
    .map((sha) => `${sha} is not a commit in this repository`)

/** The inputs `visual:record` records: the code trees of the base and reviewed SHAs. */
const inputsOf = (cwd, review) => ({
  baseCodeTree: codeTree(cwd, review.baseSha),
  codeTree: codeTree(cwd, review.reviewedSha),
})

/** A visual review's recorded inputs, when it has them, must be those of its base and reviewed SHAs. */
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

const appendVisualReview = (cwd, ref, append) => {
  const notes = checkNotesRef(ref)
  return notes.ok
    ? append({ cwd, kind: visualNotes, ref }, commitsExist(cwd))
    : notes
}

/** Validates a visual review, records its inputs, and appends it to the note on its reviewed SHA in `ref`. */
export const recordVisualReview = (cwd, ref, json) =>
  appendVisualReview(cwd, ref, (target, check) =>
    recordEntry(target, json, check, (review) =>
      commitsExist(cwd)(review).length === 0
        ? { ...review, inputs: inputsOf(cwd, review) }
        : review,
    ),
  )

/** Validates a visual review recorded in another clone and appends it in `ref` unless its ID is already there. */
export const importVisualReview = (cwd, ref, json) =>
  appendVisualReview(cwd, ref, (target) =>
    importEntry(target, json, inputsMatch(cwd)),
  )

/** The latest visual review on `revision` in `ref`. */
export const latestVisualReview = (cwd, ref, revision) => {
  const notes = checkNotesRef(ref)
  if (!notes.ok) return notes
  const latest = latestEntry({ cwd, kind: visualNotes, ref }, revision)
  if (!latest.ok) return latest
  return latest.value === undefined
    ? fail(`no visual review on ${revision} in ${ref}`)
    : { ok: true, value: latest.value }
}

/** The nearest commit at or below `head` with a visual review note in `ref`, and its latest visual review. */
export const nearestVisualReview = (cwd, ref, head) => {
  const reviewed = nearestAnnotated(cwd, ref, head)
  return reviewed === undefined
    ? fail(
        `no visual review on ${head} or its last ${String(ancestorLimit)} ancestors`,
      )
    : latestVisualReview(cwd, ref, reviewed)
}

/** Why a visual review does not let the pull request merge: open blocking findings and escalations. Empty passes. */
export const visualProblems = (review) => [
  ...openBlockingVisual(review).map(
    (entry) =>
      `${entry.id} is blocking in ${entry.story}${entry.viewport === undefined ? '' : ` at ${entry.viewport}`}: ${entry.summary}`,
  ),
  ...review.escalations.map(
    (entry) => `open escalation (${entry.kind}): ${entry.detail}`,
  ),
]

/** A visual review's counts and one line per open blocking finding, for the implementation session. */
export const visualSummary = (review) => {
  const blocking = openBlockingVisual(review)
  const head =
    `Visual review ${review.visualReviewId} (round ${String(review.round)}) of pull request #${String(
      review.pullRequest,
    )} at ${review.reviewedSha}: ` +
    `${String(blocking.length)} blocking, ${String(review.findings.length - blocking.length)} advisory, ` +
    `${String(review.escalations.length)} escalations.\n` +
    `Screenshots: ${review.page}\n`
  return (
    head +
    blocking
      .map((entry) => `  ${entry.id} ${entry.story} ${entry.summary}\n`)
      .join('')
  )
}
