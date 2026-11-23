/**
 * Verification reports for High-risk pull requests: reports stored as Git
 * notes on the verified SHA and the ready-for-review gate. See
 * docs/engineering/verification-harness.md.
 */

import {
  ancestorLimit,
  changedPaths,
  currentBranch,
  isCommit,
  nearestAnnotated,
  resolveSha,
} from './git-access.mjs'
import { importEntry, latestEntry, recordEntry } from './note-store.mjs'
import {
  defaultNotesRef as reviewNotesRef,
  nearestReview,
  reviewProblems,
} from './review-findings.mjs'
import { isFixSlice } from './schema-checks.mjs'
import {
  evidenceOnlyFindings,
  fixReportFindings,
} from './verification/gate.mjs'
import { reportInputs } from './verification/inputs.mjs'
import { notesRef, reportNotes } from './verification/notes.mjs'

export { notesRef } from './verification/notes.mjs'
export { validateReport } from './verification/report.mjs'

const fail = (...problems) => ({ ok: false, problems })

const reports = (cwd) => ({ cwd, kind: reportNotes, ref: notesRef })

const verifiedShaExists = (cwd) => (report) =>
  isCommit(cwd, report.verifiedSha)
    ? []
    : [`${report.verifiedSha} is not a commit in this repository`]

const inputsMatch = (cwd) => (report) => {
  const missing = verifiedShaExists(cwd)(report)
  if (missing.length > 0 || report.inputs === undefined) return missing
  const actual = reportInputs(cwd, report.verifiedSha, report.featureDir)
  return actual.codeTree === report.inputs.codeTree &&
    actual.featureInputs === report.inputs.featureInputs
    ? []
    : [`its recorded inputs are not those of ${report.verifiedSha}`]
}

/** Validate and append a report to the note on its verified SHA. */
export const recordReport = (cwd, json) =>
  recordEntry(reports(cwd), json, verifiedShaExists(cwd), (report) =>
    isCommit(cwd, report.verifiedSha)
      ? {
          ...report,
          inputs: reportInputs(cwd, report.verifiedSha, report.featureDir),
        }
      : report,
  )

/** Import a report published by another clone. */
export const importReport = (cwd, json) =>
  importEntry(reports(cwd), json, inputsMatch(cwd))

/** The latest report on a revision, if its note is valid. */
export const reportAt = (cwd, revision) => latestEntry(reports(cwd), revision)

const nearestReport = (cwd, head) => {
  const verified = nearestAnnotated(cwd, notesRef, head)
  if (verified === undefined) {
    return fail(
      `no verification report on HEAD or its last ${String(ancestorLimit)} ancestors`,
    )
  }
  const report = reportAt(cwd, verified)
  if (!report.ok) return report
  return report.value === undefined
    ? fail(`the note on ${verified} has no report`)
    : { ok: true, value: report.value }
}

const driftFindings = (cwd, evidence, head) =>
  evidence.sha === head
    ? []
    : evidenceOnlyFindings(evidence, changedPaths(cwd, evidence.sha, head))

const reviewFindings = (cwd, head, review) => {
  if (!review.ok)
    return review.problems.map((problem) => `code review: ${problem}`)
  return [
    ...reviewProblems(review.value),
    ...(isFixSlice(review.value.sliceId)
      ? []
      : [
          `the review is for slice ${review.value.sliceId}, not this pull request (slice fix)`,
        ]),
    ...driftFindings(
      cwd,
      { label: 'reviewed', sha: review.value.reviewedSha },
      head,
    ),
  ].map((problem) => `code review: ${problem}`)
}

/** The checked-out branch at HEAD, optionally with its pull request labels. */
export const checkedOut = (cwd, labels) => ({
  branch: currentBranch(cwd),
  head: resolveSha(cwd, 'HEAD'),
  labels,
})

const highLabel = 'risk:high'

/** Every High-risk pull request requires verification before it is ready. */
export const gateApplies = (_cwd, target) =>
  target.labels?.includes(highLabel) === true

const passFor = (cwd, target) => {
  if (target.labels === undefined) {
    return fail(
      `no pull request was found to show whether ${target.branch ?? 'the checked-out branch'} is labelled ${highLabel}`,
    )
  }
  if (!target.labels.includes(highLabel)) {
    return fail(
      `${target.branch ?? 'the checked-out branch'} is not labelled ${highLabel}`,
    )
  }

  const report = nearestReport(cwd, target.head)
  if (!report.ok) return report
  const problems = [
    ...driftFindings(
      cwd,
      { label: 'verified', sha: report.value.verifiedSha },
      target.head,
    ),
    ...fixReportFindings(report.value),
    ...reviewFindings(
      cwd,
      target.head,
      nearestReview(cwd, reviewNotesRef, target.head),
    ),
  ]
  return problems.length > 0 ? fail(...problems) : report
}

/** Run the High-risk verification and code-review gate. */
export const runGate = (cwd, target = checkedOut(cwd)) => {
  const pass = passFor(cwd, target)
  return pass.ok
    ? {
        ok: true,
        value: {
          branch: target.branch ?? 'a detached HEAD',
          head: target.head,
          report: pass.value,
        },
      }
    : pass
}
