/** @typedef {import('./report.mjs').VerificationReport} VerificationReport */

import { isFixSlice } from '../schema-checks.mjs'

/** A reported Storybook story that is not passing. */
const storyStatus = (story) =>
  story.status === 'passing'
    ? []
    : [
        `story ${story.id} in the ${story.storybook} Storybook is ${story.status}`,
      ]

/** Findings that block any report. */
const reportBlockers = (report) => [
  ...report.unrequestedViolations.map(
    (claim) => `${claim.id} was observed violated outside the request`,
  ),
  ...report.escalations.map(
    (escalation) =>
      `open escalation (${escalation.kind}): ${escalation.detail}`,
  ),
]

/**
 * Every reason a High-risk pull request's latest report does not pass.
 *
 * Reports use the legacy `sliceId` field because published note schemas are
 * append-only. New reports identify the whole pull request with `sliceId: fix`
 * and omit `featureDir`.
 *
 * @param {VerificationReport} report
 */
export const fixReportFindings = (report) => [
  ...(isFixSlice(report.sliceId)
    ? []
    : [
        `the report is for slice ${report.sliceId}, not this pull request (slice fix)`,
      ]),
  ...(report.claims.length === 0 ? ['the report names no claim'] : []),
  ...report.claims.flatMap((claim) =>
    claim.result === 'established'
      ? []
      : [
          `${claim.id} is ${claim.result}; a High-risk pull request must establish every claim`,
        ],
  ),
  ...report.stories.flatMap(storyStatus),
  ...reportBlockers(report),
]

/**
 * Evidence applies only to the exact revision it records. Empty commits are
 * harmless, but any changed path after review or verification requires a new
 * round.
 */
export const evidenceOnlyFindings = (evidence, paths) =>
  paths.length === 0
    ? []
    : [`commits after the ${evidence.label} SHA change ${paths.join(', ')}`]
