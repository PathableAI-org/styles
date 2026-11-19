/**
 * Visual review handoff commands. Run through the `visual:*` package scripts:
 *
 *   pnpm visual:record <visual.json | -> [--pr <n>] [--notes-ref <ref>]   validate a visual review, add it to the
 *                                                                         reviewed SHA's note, and post it on that
 *                                                                         SHA's pull request
 *   pnpm visual:show [<rev>] [--notes-ref <ref>]                          print the latest visual review on a commit
 *                                                                         and its blocking findings; exits 1 while a
 *                                                                         blocking finding or an escalation is open
 *
 * `--notes-ref` defaults to refs/notes/visual. The notes ref is never pushed: entries travel as pull request comments,
 * and `show` first syncs the checked-out branch's pull request into the local notes when it can. See
 * docs/engineering/visual-review.md#storage.
 */
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'

import { failed, runCommand } from './cli.mjs'
import { ghRest } from './github-access.mjs'
import {
  publishRecordedVisualReview,
  syncCheckedOutBranch,
} from './note-sync.mjs'
import { defaultNotesRef } from './review-findings.mjs'
import {
  defaultVisualNotesRef,
  latestVisualReview,
  recordVisualReview,
  visualProblems,
  visualSummary,
} from './visual-review.mjs'

const cwd = process.cwd()
const rest = ghRest(cwd)

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    'notes-ref': { default: defaultVisualNotesRef, type: 'string' },
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
  const outcome = recordVisualReview(cwd, ref, json)
  if (!outcome.ok)
    return failed('Visual review not recorded:', outcome.problems)
  const review = outcome.value
  process.stdout.write(
    `Recorded visual review ${review.visualReviewId} for pull request #${String(review.pullRequest)} on ${review.reviewedSha} in ${ref}.\n` +
      `Pointer for the implementation session: ${ref} @ ${review.reviewedSha} (visual review ${review.visualReviewId}).\n` +
      visualSummary(review),
  )
  return publishRecordedVisualReview({ cwd, pr: values.pr, ref, rest }, review)
}

const show = () => {
  process.stderr.write(
    syncCheckedOutBranch({
      cwd,
      refs: { review: defaultNotesRef, visual: ref },
      rest,
    }).notice,
  )
  const outcome = latestVisualReview(cwd, ref, argument ?? 'HEAD')
  if (!outcome.ok) return failed('No visual review:', outcome.problems)
  process.stdout.write(`${JSON.stringify(outcome.value, null, 2)}\n`)
  process.stderr.write(visualSummary(outcome.value))
  return visualProblems(outcome.value).length === 0 ? 0 : 1
}

const commands = { record, show }

runCommand(
  commands,
  command,
  'Usage: visual.mjs record|show (see the header of scripts/visual.mjs)',
)
