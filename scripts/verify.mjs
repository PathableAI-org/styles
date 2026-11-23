/**
 * Verification commands for High-risk pull requests:
 *
 *   pnpm verify:record <report.json | -> [--pr <n>]  validate, store, and publish a report
 *   pnpm verify:show [<rev>]                          print the latest report on a commit
 *   pnpm verify:gate                                  check the pull request against the gate
 *
 * `show` and `gate` first sync the checked-out branch's pull request comments
 * into local Git notes. Without a pull request or GitHub access, they use the
 * local notes as-is. See scripts/note-sync.mjs.
 */
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'

import { runCommand } from './cli.mjs'
import { ghRest } from './github-access.mjs'
import { publishRecordedReport, syncCheckedOutBranch } from './note-sync.mjs'
import { defaultNotesRef } from './review-findings.mjs'
import {
  checkedOut,
  notesRef,
  recordReport,
  reportAt,
  runGate,
} from './verification.mjs'

const cwd = process.cwd()

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    pr: { type: 'string' },
  },
})

const [command, argument] = positionals
const rest = ghRest(cwd)

/** Sync the branch's pull request and return its labels when it has one. */
const syncFirst = () => {
  const context = syncCheckedOutBranch({
    cwd,
    refs: { review: defaultNotesRef },
    rest,
  })
  process.stderr.write(context.notice)
  return context.pull?.labels
}

const print = (value) => {
  process.stdout.write(
    typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`,
  )
}

const finish = (outcome, onSuccess, heading) => {
  if (outcome.ok) {
    onSuccess(outcome.value)
    return 0
  }
  process.stderr.write(
    `${heading}\n${outcome.problems.map((problem) => `  - ${problem}`).join('\n')}\n`,
  )
  return 1
}

const record = () => {
  const json = readFileSync(
    argument === undefined || argument === '-' ? 0 : argument,
    'utf8',
  )
  const recorded = recordReport(cwd, json)
  if (!recorded.ok) return finish(recorded, print, 'Report not recorded')
  const report = recorded.value
  print(
    `Recorded run ${report.runId} for this pull request on ${report.verifiedSha} in ${notesRef}.\n` +
      `Pointer for the implementation session: ${notesRef} @ ${report.verifiedSha} (run ${report.runId}).\n`,
  )
  return publishRecordedReport({ cwd, pr: values.pr, rest }, report)
}

const gate = () =>
  finish(
    runGate(cwd, checkedOut(cwd, syncFirst())),
    (pass) => {
      const via =
        pass.report.verifiedSha === pass.head
          ? 'HEAD'
          : `${pass.report.verifiedSha}, followed only by empty commits`
      print(
        `Verification gate passed for ${pass.branch}: run ${pass.report.runId}, via ${via}.\n`,
      )
    },
    'Verification gate failed:',
  )

const commands = {
  gate,
  record,
  show: () => {
    syncFirst()
    return finish(
      reportAt(cwd, argument ?? 'HEAD'),
      (report) => {
        print(report ?? 'No report on that commit.\n')
      },
      'No report',
    )
  },
}

runCommand(
  commands,
  command,
  'Usage: verify.mjs record|show|gate (see the header of scripts/verify.mjs)',
)
