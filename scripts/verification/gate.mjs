// Ported from pathableai-org/pre-ets scripts/verification/gate.ts @ f2ee390 (types stripped only).

/** @typedef {import('./report.mjs').ClaimReport} ClaimReport */
/** @typedef {import('./report.mjs').VerificationReport} VerificationReport */

/** @typedef {import('./request.mjs').VerificationRequest} VerificationRequest */

/**
 * The verification gate from docs/engineering/verification-harness.md#gate-and-escalation, applied to a report and
 * the request regenerated at the report's verified SHA.
 */
import { isFixSlice } from '../schema-checks.mjs'
import { withoutSection } from './markdown.mjs'

/**
 * @typedef {object} ImplementationBranch
 * @property {string} featureDir
 * @property {string | undefined} [sliceSuffix] The `-impl-<slice>` suffix, or undefined for the first slice's `-impl` branch.
 */

/** `{number}-{slug}-impl` or `{number}-{slug}-impl-<slice>`; anything else is not an implementation slice. */
export const implementationBranch = (branch) => {
  const match = /^(\d+-[a-z0-9-]+?)-impl(?:-([a-z0-9]+))?$/i.exec(branch ?? '')
  return match?.[1] === undefined
    ? undefined
    : { featureDir: `specs/${match[1]}`, sliceSuffix: match[2] }
}

/**
 * The feature directories a Spec Kit specification `{number}-{slug}` or plan `{number}-{slug}-plan` branch could name:
 * the branch itself and, without a trailing `-plan`, its specification. A slug may itself end in `-plan`, so both count.
 */
export const phaseFeatureDirs = (branch) =>
  /^\d+-[a-z0-9-]+$/i.test(branch)
    ? [...new Set([branch, branch.replace(/-plan$/i, '')])].map(
        (name) => `specs/${name}`,
      )
    : []

/** Whether a report or review names this branch's feature and, for a suffixed branch, its slice. */
export const sliceMatchesBranch = (evidence, branch) => {
  if (evidence.featureDir !== branch.featureDir) {
    return [
      `the ${evidence.label} is for ${
        evidence.featureDir ?? 'no feature directory'
      }, but this branch belongs to ${branch.featureDir}`,
    ]
  }
  const expected = branch.sliceSuffix
  return expected !== undefined &&
    expected.toLowerCase() !== evidence.sliceId.toLowerCase()
    ? [
        `the ${evidence.label} is for slice ${evidence.sliceId}, but this branch is slice ${expected}`,
      ]
    : []
}

const claimFindings = (claim, request) => {
  if (claim.result === 'violated') return [`${claim.id} is violated`]
  if (claim.result === 'established') return []
  // A limitation can excuse only a claim the slice asserts in part; a full claim must be established.
  if (claim.scope === 'full')
    return [`${claim.id} is asserted in full but ${claim.result}`]
  const approved = request.approvedLimitations.some(
    (limitation) => limitation.id === claim.limitationId,
  )
  return approved
    ? []
    : [
        `${claim.id} is ${claim.result} under ${claim.limitationId ?? 'no limitation'}, which is not approved`,
      ]
}

/** Each requested ID's reported entry, or a finding when the report has none. */
const eachRequested = (ids, reported, missing, check) =>
  ids.flatMap((id) => {
    const entry = reported.find((candidate) => candidate.id === id)
    return entry === undefined ? [missing(id)] : check(entry)
  })

const claimsCoverRequest = (report, request) =>
  eachRequested(
    request.claims.map((claim) => claim.id),
    report.claims,
    (id) => `${id} has no result`,
    (reported) => {
      const scope = request.claims.find(
        (claim) => claim.id === reported.id,
      )?.scope
      return reported.scope === scope
        ? claimFindings(reported, request)
        : [
            `${reported.id} is reported as ${reported.scope} but the plan assigns it ${scope ?? 'nothing'}`,
          ]
    },
  )

const unrequestedClaims = (report, request) =>
  report.claims
    .filter(
      (claim) => !request.claims.some((requested) => requested.id === claim.id),
    )
    .map(
      (claim) =>
        `${claim.id} is reported but not assigned to slice ${request.sliceId}`,
    )

const telemetryFindings = (report, request) =>
  eachRequested(
    request.telemetryRows,
    report.telemetryRows,
    (id) => `telemetry row ${id} has no status`,
    (row) =>
      row.status === 'present'
        ? []
        : [`telemetry row ${row.id} is ${row.status}`],
  )

/** What blocks any report, whatever was requested: a violation seen outside the claims, forbidden data, escalations. */
const reportBlockers = (report) => [
  ...report.unrequestedViolations.map(
    (claim) => `${claim.id} was observed violated outside the request`,
  ),
  ...report.forbiddenData.map(
    (finding) => `forbidden data in ${finding.signal} field ${finding.field}`,
  ),
  ...report.escalations.map(
    (escalation) =>
      `open escalation (${escalation.kind}): ${escalation.detail}`,
  ),
]

/** Every reason the report fails the gate for the request. An empty list passes. */
const evaluateGate = (report, request) => [
  ...request.warnings.map(
    (warning) => `the request cannot be generated reliably: ${warning}`,
  ),
  ...(report.verifiedSha === request.sha
    ? []
    : [`the report covers ${report.verifiedSha}, not ${request.sha}`]),
  ...(report.sliceId.toLowerCase() === request.sliceId.toLowerCase()
    ? []
    : [`the report is for slice ${report.sliceId}`]),
  ...claimsCoverRequest(report, request),
  ...unrequestedClaims(report, request),
  ...telemetryFindings(report, request),
  ...reportBlockers(report),
]

export const gateForBranch = (report, request, branch) => [
  ...sliceMatchesBranch(
    { featureDir: report.featureDir, label: 'report', sliceId: report.sliceId },
    branch,
  ),
  ...evaluateGate(report, request),
]

/**
 * Every reason a High fix's latest report does not pass. A fix has no plan to regenerate a request from, so the report
 * must name at least one claim, establish every claim it names, find every telemetry row it lists present, and show
 * no violation, forbidden data, or open escalation. No limitation can excuse a claim, because none is approved.
 */
export const fixReportFindings = (report) => [
  ...(isFixSlice(report.sliceId)
    ? []
    : [
        `the report is for slice ${report.sliceId}, not a High fix (slice fix)`,
      ]),
  ...(report.claims.length === 0 ? ['the report names no claim'] : []),
  ...report.claims.flatMap((claim) =>
    claim.result === 'established'
      ? []
      : [
          `${claim.id} is ${claim.result}; a High fix must establish every claim`,
        ],
  ),
  ...report.telemetryRows.flatMap((row) =>
    row.status === 'present'
      ? []
      : [`telemetry row ${row.id} is ${row.status}`],
  ),
  ...reportBlockers(report),
]

/** The quickstart section evidence-only commits may change. */
export const executionResults = /^execution results$/i

/**
 * Whether the commits from the verified or reviewed SHA to HEAD are evidence-only: they change nothing but the
 * feature's `quickstart.md` execution results. Without a feature directory, as for a High fix, they must change
 * nothing at all.
 */
export const evidenceOnlyFindings = (evidence, paths, quickstartAt) => {
  const quickstart =
    evidence.featureDir === undefined
      ? undefined
      : `${evidence.featureDir}/quickstart.md`
  const after = `commits after the ${evidence.label} SHA change`
  const other = paths.filter((path) => path !== quickstart)
  if (other.length > 0) return [`${after} ${other.join(', ')}`]
  if (quickstart === undefined || !paths.includes(quickstart)) return []
  const outside = (content) => withoutSection(content ?? '', executionResults)
  return outside(quickstartAt.verified) === outside(quickstartAt.head)
    ? []
    : [`${after} ${quickstart} outside its execution results`]
}
