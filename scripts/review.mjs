// Ported from pathableai-org/pre-ets scripts/review.ts @ f2ee390 (types stripped only).
/**
 * Code review handoff commands. Run through the `review:*` package scripts:
 *
 *   pnpm review:record <review.json | -> [--pr <n>] [--notes-ref <ref>]   validate a review, add it to the reviewed
 *                                                                         SHA's note, and post it on that SHA's pull
 *                                                                         request
 *   pnpm review:show [<rev>] [--notes-ref <ref>]                          print the latest review on a commit and its
 *                                                                         blocking findings; exits 1 while a blocking
 *                                                                         finding or an escalation is open
 *
 * `--notes-ref` defaults to refs/notes/review. The notes ref is never pushed: entries travel as pull request comments,
 * and `show` first syncs the checked-out branch's pull request into the local notes when it can. See
 * docs/engineering/code-review.md#storage.
 */
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'

import { failed, runCommand } from './cli.mjs'
import { ghRest } from './github-access.mjs'
import { publishRecordedReview, syncCheckedOutBranch } from './note-sync.mjs'
import {
  blockingSummary,
  defaultNotesRef,
  latestReview,
  recordReview,
  reviewProblems,
} from './review-findings.mjs'

const cwd = process.cwd()
const rest = ghRest(cwd)

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    'notes-ref': { default: defaultNotesRef, type: 'string' },
    pr: { type: 'string' },
  },
})

const [command, argument] = positionals
const ref = values['notes-ref']

const record = () => {
  const json = readFileSync(
    argument === undefined || argument === '-' ? 0 : argument,
    'utf8',
  )
  const outcome = recordReview(cwd, ref, json)
  if (!outcome.ok) return failed('Review not recorded:', outcome.problems)
  const review = outcome.value
  process.stdout.write(
    `Recorded review ${review.reviewId} for this pull request on ${review.reviewedSha} in ${ref}.\n` +
      `Pointer for the implementation session: ${ref} @ ${review.reviewedSha} (review ${review.reviewId}).\n` +
      blockingSummary(review),
  )
  return publishRecordedReview({ cwd, pr: values.pr, ref, rest }, review)
}

const show = () => {
  process.stderr.write(
    syncCheckedOutBranch({ cwd, refs: { review: ref }, rest }).notice,
  )
  const outcome = latestReview(cwd, ref, argument ?? 'HEAD')
  if (!outcome.ok) return failed('No review:', outcome.problems)
  process.stdout.write(`${JSON.stringify(outcome.value, null, 2)}\n`)
  process.stderr.write(blockingSummary(outcome.value))
  return reviewProblems(outcome.value).length === 0 ? 0 : 1
}

const commands = { record, show }

runCommand(
  commands,
  command,
  'Usage: review.mjs record|show (see the header of scripts/review.mjs)',
)
