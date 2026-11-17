// Ported from pathableai-org/pre-ets scripts/verification.ts @ f2ee390 (types stripped only).
/**
 * Verification handoff between implementation and verification sessions: requests generated from a feature's
 * artifacts at a pushed SHA, reports stored as git notes on the verified SHA, the gate, and generated quickstart
 * results. See docs/engineering/verification-harness.md.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/** @typedef {import('./verification/report.mjs').VerificationReport} VerificationReport */

import {
  ancestorLimit,
  changedPaths,
  currentBranch,
  isCommit,
  isDirectoryAt,
  nearestAnnotated,
  readAtSha,
  repositoryRoot,
  resolveSha,
} from './git-access.mjs'
import {
  importEntry,
  latestEntry,
  latestMatching,
  recordEntry,
} from './note-store.mjs'
import {
  latestReviewMatching,
  nearestReview,
  defaultNotesRef as reviewNotesRef,
  reviewProblems,
} from './review-findings.mjs'
/** @typedef {import('./review-findings.mjs').Review} Review */
import { isFixSlice } from './schema-checks.mjs'
import {
  evidenceOnlyFindings,
  fixReportFindings,
  gateForBranch,
  implementationBranch,
  phaseFeatureDirs,
  sliceMatchesBranch,
} from './verification/gate.mjs'
/** @typedef {import('./verification/gate.mjs').ImplementationBranch} ImplementationBranch */
import { featureArtifactsAt } from './verification/git.mjs'
import { reportInputs } from './verification/inputs.mjs'
import { notesRef, reportNotes } from './verification/notes.mjs'
import {
  earlierResultSha,
  insertResults,
  renderReport,
} from './verification/render.mjs'
import { buildRequest, firstSliceId } from './verification/request.mjs'
/** @typedef {import('./verification/request.mjs').VerificationRequest} VerificationRequest */

export { notesRef } from './verification/notes.mjs'
export { validateReport } from './verification/report.mjs'
/** @typedef {import('./verification/report.mjs').VerificationReport} VerificationReport */
export { buildRequest } from './verification/request.mjs'
/** @typedef {import('./verification/request.mjs').VerificationRequest} VerificationRequest */

/**
 * @template T
 * @typedef {{ readonly ok: false; readonly problems: readonly string[] } | { readonly ok: true readonly value: T }} Outcome
 */

const fail = (...problems) => ({
  ok: false,
  problems,
})

/** Whether `branch` is an implementation-slice branch, `{number}-{slug}-impl` or `{number}-{slug}-impl-<slice>`. */
export const isImplementationBranch = (branch) =>
  implementationBranch(branch) !== undefined

/** The feature directory of the checked-out implementation-slice branch. */
export const featureForBranch = (cwd) =>
  implementationBranch(currentBranch(cwd))?.featureDir

/** The request for a slice, read from the feature's committed artifacts at `revision`. */
export const generateRequest = (cwd, target) => {
  const sha = resolveSha(cwd, target.revision)
  const artifacts = featureArtifactsAt(cwd, sha, target.featureDir)
  if (typeof artifacts === 'string') return fail(artifacts)
  return {
    ok: true,
    value: buildRequest(artifacts, {
      featureDir: target.featureDir,
      sha,
      sliceId: target.sliceId,
    }),
  }
}

const reports = (cwd) => ({ cwd, kind: reportNotes, ref: notesRef })

const verifiedShaExists = (cwd) => (report) =>
  isCommit(cwd, report.verifiedSha)
    ? []
    : [`${report.verifiedSha} is not a commit in this repository`]

/** A report's recorded inputs, when it has them, must be the inputs of its verified SHA. */
const inputsMatch = (cwd) => (report) => {
  const missing = verifiedShaExists(cwd)(report)
  if (missing.length > 0 || report.inputs === undefined) return missing
  const actual = reportInputs(cwd, report.verifiedSha, report.featureDir)
  return actual.codeTree === report.inputs.codeTree &&
    actual.featureInputs === report.inputs.featureInputs
    ? []
    : [`its recorded inputs are not those of ${report.verifiedSha}`]
}

/** Validates a report, records its inputs from the verified SHA, and appends it to the note on that SHA. */
export const recordReport = (cwd, json) =>
  recordEntry(reports(cwd), json, verifiedShaExists(cwd), (report) =>
    isCommit(cwd, report.verifiedSha)
      ? {
          ...report,
          inputs: reportInputs(cwd, report.verifiedSha, report.featureDir),
        }
      : report,
  )

/**
 * Validates a report recorded in another clone and appends it unless its run ID is already on that SHA. Recorded
 * inputs must match the verified SHA.
 */
export const importReport = (cwd, json) =>
  importEntry(reports(cwd), json, inputsMatch(cwd))

/** The latest report on `revision`, if its note is valid. */
export const reportAt = (cwd, revision) => latestEntry(reports(cwd), revision)

/**
 * @typedef {object} GatePass
 * @property {string} branch
 * @property {string} head
 * @property {VerificationReport} report
 */

/** The nearest commit at or below HEAD that carries a verification note. */
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

/** The slice an implementation branch carries: its suffix, or for the first slice's `-impl` branch, plan.md's first. */
const branchSlice = (cwd, branch, head) =>
  branch.sliceSuffix ??
  firstSliceId(readAtSha(cwd, head, `${branch.featureDir}/plan.md`) ?? '')

/** Whether a report or review is for this feature and slice. */
const forSlice = (featureDir, sliceId) => (entry) =>
  entry.featureDir === featureDir &&
  entry.sliceId.toLowerCase() === sliceId.toLowerCase()

/**
 * The slice's latest report, whatever commit it is on: a restack leaves the verified commit off the branch, and
 * the drift check then decides whether it still covers HEAD. Without a slice ID, the nearest annotated ancestor.
 */
const sliceReport = (cwd, featureDir, sliceId, head) => {
  if (sliceId === undefined) return nearestReport(cwd, head)
  const latest = latestMatching(reports(cwd), forSlice(featureDir, sliceId))
  if (!latest.ok) return latest
  return latest.value === undefined
    ? fail(`no verification report for slice ${sliceId} of ${featureDir}`)
    : { ok: true, value: latest.value }
}

/** The slice's latest review, found like `sliceReport`. */
const sliceReview = (cwd, featureDir, sliceId, head) => {
  if (sliceId === undefined) return nearestReview(cwd, reviewNotesRef, head)
  const latest = latestReviewMatching(
    cwd,
    reviewNotesRef,
    forSlice(featureDir, sliceId),
  )
  if (!latest.ok) return latest
  return latest.value === undefined
    ? fail(`no review for slice ${sliceId} of ${featureDir}`)
    : { ok: true, value: latest.value }
}

/** Findings for commits after `evidence.sha` other than the feature's quickstart execution results. */
const driftFindings = (cwd, evidence, head) => {
  if (evidence.sha === head) return []
  const quickstart = `${evidence.featureDir ?? ''}/quickstart.md`
  return evidenceOnlyFindings(evidence, changedPaths(cwd, evidence.sha, head), {
    head: readAtSha(cwd, head, quickstart),
    verified: readAtSha(cwd, evidence.sha, quickstart),
  })
}

/** The code review half of the gate: the review found passes, matches the branch, and covers HEAD. */
const reviewFindings = (cwd, head, review, checks) => {
  if (!review.ok)
    return review.problems.map((problem) => `code review: ${problem}`)
  return [
    ...reviewProblems(review.value),
    ...checks.matches(review.value),
    ...driftFindings(
      cwd,
      {
        featureDir: checks.featureDir(review.value),
        label: 'reviewed',
        sha: review.value.reviewedSha,
      },
      head,
    ),
  ].map((problem) => `code review: ${problem}`)
}

/**
 * The branch and commit the gate judges, and the labels of its pull request when one was found.
 * @typedef {object} GateTarget
 * @property {string | undefined} branch
 * @property {string} head
 * @property {readonly string[] | undefined} [labels]
 */

/** The checked-out branch at HEAD. */
export const checkedOut = (cwd, labels) => ({
  branch: currentBranch(cwd),
  head: resolveSha(cwd, 'HEAD'),
  labels,
})

const highFixLabel = 'risk:high'

/**
 * Whether `target` is a Spec Kit specification or plan branch: it names a feature directory, `{number}-{slug}` or
 * `{number}-{slug}-plan`, that exists in the tree at its head. Such a pull request carries the feature's tier label,
 * risk:high included, but has no slice to verify or review. A head missing from the clone shows no directory.
 */
const isPhaseBranch = (cwd, target) =>
  target.branch !== undefined &&
  phaseFeatureDirs(target.branch).some((featureDir) =>
    isDirectoryAt(cwd, target.head, featureDir),
  )

/**
 * Whether marking the target's pull request ready needs the gate: an implementation slice, or a High fix, which is a
 * branch labelled risk:high that is not a Spec Kit specification or plan branch.
 */
export const gateApplies = (cwd, target) =>
  implementationBranch(target.branch) !== undefined ||
  (target.labels?.includes(highFixLabel) === true &&
    !isPhaseBranch(cwd, target))

const slicePass = (cwd, branch, target) => {
  const sliceId = branchSlice(cwd, branch, target.head)
  const report = sliceReport(cwd, branch.featureDir, sliceId, target.head)
  if (!report.ok) return report
  const { featureDir, verifiedSha } = report.value
  // A report without a feature directory fails gateForBranch's branch check; the branch's own one builds the request.
  const request = generateRequest(cwd, {
    featureDir: featureDir ?? branch.featureDir,
    revision: verifiedSha,
    sliceId: report.value.sliceId,
  })
  if (!request.ok) return request
  const problems = [
    ...driftFindings(
      cwd,
      { featureDir, label: 'verified', sha: verifiedSha },
      target.head,
    ),
    ...gateForBranch(report.value, request.value, branch),
    ...reviewFindings(
      cwd,
      target.head,
      sliceReview(cwd, branch.featureDir, sliceId, target.head),
      {
        featureDir: (review) => review.featureDir,
        matches: (review) =>
          sliceMatchesBranch(
            {
              featureDir: review.featureDir,
              label: 'review',
              sliceId: review.sliceId,
            },
            branch,
          ),
      },
    ),
  ]
  return problems.length > 0 ? fail(...problems) : report
}

/**
 * The gate for a High fix's single pull request. There is no plan, so no request: the report must pass on its own
 * terms, and only a commit that changes no path counts as evidence-only after the verified or reviewed SHA.
 */
const fixPass = (cwd, target) => {
  const report = nearestReport(cwd, target.head)
  if (!report.ok) return report
  const problems = [
    ...driftFindings(
      cwd,
      {
        featureDir: undefined,
        label: 'verified',
        sha: report.value.verifiedSha,
      },
      target.head,
    ),
    ...fixReportFindings(report.value),
    ...reviewFindings(
      cwd,
      target.head,
      nearestReview(cwd, reviewNotesRef, target.head),
      {
        featureDir: () => undefined,
        matches: (review) =>
          isFixSlice(review.sliceId)
            ? []
            : [
                `the review is for slice ${review.sliceId}, not a High fix (slice fix)`,
              ],
      },
    ),
  ]
  return problems.length > 0 ? fail(...problems) : report
}

const nameOf = (target) => target.branch ?? 'a detached HEAD'

const passFor = (cwd, target) => {
  const branch = implementationBranch(target.branch)
  if (branch !== undefined) return slicePass(cwd, branch, target)
  if (target.labels === undefined) {
    return fail(
      `${nameOf(target)} is not an implementation-slice branch, and no pull request was found to show a High fix`,
    )
  }
  if (isPhaseBranch(cwd, target)) {
    return fail(
      `${nameOf(target)} is a Spec Kit specification or plan branch, which the gate does not judge`,
    )
  }
  return target.labels.includes(highFixLabel)
    ? fixPass(cwd, target)
    : fail(
        `${nameOf(target)} is not an implementation-slice branch or a High fix labelled ${highFixLabel}`,
      )
}

/**
 * The gate for `target`, by default the checked-out branch: the slice gate on an implementation-slice branch, the
 * fix gate on a branch whose pull request is labelled risk:high and that is not a Spec Kit specification or plan
 * branch. Labels come from the pull request; without them only an implementation-slice branch can be judged.
 */
export const runGate = (cwd, target = checkedOut(cwd)) => {
  const pass = passFor(cwd, target)
  return pass.ok
    ? {
        ok: true,
        value: {
          branch: nameOf(target),
          head: target.head,
          report: pass.value,
        },
      }
    : pass
}

/**
 * @typedef {object} RenderedResults
 * @property {string} path The working-tree `quickstart.md` the results belong in.
 * @property {string} rendered
 * @property {string | undefined} updated That file with the results appended, or undefined when it has no execution-results section.
 */

/** The quickstart results for the latest report on `revision`, rendered against the working-tree quickstart. */
export const renderResults = (cwd, revision) => {
  const report = reportAt(cwd, revision)
  if (!report.ok) return report
  if (report.value === undefined)
    return fail(`no verification report on ${revision}`)
  const { featureDir, sliceId, verifiedSha } = report.value
  if (featureDir === undefined) {
    return fail(
      `the report on ${revision} is for a High fix with no feature directory, so it has no quickstart results`,
    )
  }
  const path = join(repositoryRoot(cwd), featureDir, 'quickstart.md')
  const quickstart = existsSync(path) ? readFileSync(path, 'utf8') : ''
  const request = generateRequest(cwd, {
    featureDir,
    revision: verifiedSha,
    sliceId,
  })
  const rendered = renderReport(report.value, {
    earlierSha: earlierResultSha(quickstart, report.value.sliceId),
    request: request.ok ? request.value : undefined,
  })
  return {
    ok: true,
    value: { path, rendered, updated: insertResults(quickstart, rendered) },
  }
}
