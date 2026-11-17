// Ported from pathableai-org/pre-ets scripts/note-sync/render.ts @ f2ee390 (types stripped only).
/**
 * The human-readable part of a note comment, generated from the entry alone so it always matches the JSON below it.
 * Entry text is written as single-line inline text: line breaks are collapsed and anything that would open an HTML
 * tag is escaped, so an entry cannot end the comment's `<details>` block or start a fenced block of its own. A later
 * entry names and links the earlier one on the pull request it supersedes, found from those entries' own JSON, and
 * says nothing when that entry is not there.
 */

/** @typedef {import('../review-findings.mjs').Review} Review */

/** @typedef {import('../verification.mjs').VerificationReport} VerificationReport */

import { cell, table } from '../markdown.mjs'

/**
 * An entry already posted on the pull request, and the web URL of the comment that carries it.
 * @template T
 * @typedef {object} Earlier
 * @property {T} entry
 * @property {string} url
 */

/**
 * @template T
 * @typedef {object} RenderContext
 * @property {readonly Earlier<T>[]} earlier Entries of the same kind already on the pull request, oldest first.
 * @property {string} repository The repository's web URL, for links into its files.
 */

/**
 * @typedef {VerificationReport["claims"][number]} Claim
 */

const short = (value) => value.slice(0, 8)

/** A line linking the superseded entry, after a blank line, or nothing when there is none. */
const supersedesLine = (line) => (line === undefined ? [] : ['', line])

/** Entry text as one line of inline markdown that cannot open an HTML tag or comment. */
const inline = (value) =>
  value
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/<(?=[A-Za-z/!?])/g, '&lt;')

const count = (entries, noun) => `${String(entries.length)} ${noun}`

/** A titled section, or nothing when it has no lines. */
const section = (title, lines) =>
  lines.length === 0 ? [] : ['', `#### ${title}`, '', ...lines]

const severity = (review, level) =>
  review.findings.filter((finding) => finding.severity === level)

/** The blob URL of `file` at `line` in the reviewed SHA. */
const blobUrl = (repository, sha, file, line) =>
  `${repository}/blob/${sha}/${file.split('/').map(encodeURIComponent).join('/')}#L${String(line)}`

/** Blocking findings first, then advisory ones, each in recorded order. */
const findingLines = (review, repository) =>
  [...severity(review, 'blocking'), ...severity(review, 'advisory')].flatMap(
    (finding) => {
      const location = `${finding.file}:${String(finding.line)}`
      return [
        `- **${finding.severity}** ${finding.id} [\`${inline(location)}\`](${blobUrl(
          repository,
          review.reviewedSha,
          finding.file,
          finding.line,
        )}) (${finding.category}): ${inline(finding.summary)}`,
        `  - Failure scenario: ${inline(finding.failureScenario)}`,
      ]
    },
  )

/**
 * The review this one supersedes: the one it names, else for a later round the latest review of the same slice in the
 * round before.
 */
const supersededReview = (review, earlier) => {
  if (review.supersedesReviewId !== undefined) {
    return earlier.find(
      ({ entry }) => entry.reviewId === review.supersedesReviewId,
    )
  }
  return earlier
    .filter(
      ({ entry }) =>
        entry.sliceId === review.sliceId && entry.round === review.round - 1,
    )
    .at(-1)
}

const reviewSupersedes = (review, earlier) => {
  const superseded = supersededReview(review, earlier)
  if (superseded === undefined) return undefined
  const { reviewedSha, reviewId, round } = superseded.entry
  return `Round ${String(review.round)} supersedes round ${String(round)} ([review ${short(reviewId)} at ${reviewedSha.slice(
    0,
    7,
  )}](${superseded.url})).`
}

/** The review's headline, open findings with links into the reviewed SHA, closures, and escalations. */
export const renderReview = (review, context) => {
  const { earlier, repository } = context
  return [
    `**Code review** \`${review.reviewId}\` (round ${String(
      review.round,
    )}) of slice ${review.sliceId} at \`${review.reviewedSha}\`: ${count(severity(review, 'blocking'), 'blocking')}, ${count(
      severity(review, 'advisory'),
      'advisory',
    )}, ${count(review.closed, 'closed')}, ${count(review.escalations, 'escalations')}.`,
    ...supersedesLine(reviewSupersedes(review, earlier)),
    '',
    '#### Findings',
    '',
    ...(review.findings.length === 0
      ? ['No open findings.']
      : findingLines(review, repository)),
    ...section(
      'Closures',
      review.closed.map(
        (closed) =>
          `- ${closed.id} **${closed.closure}**: ${inline(closed.note)}`,
      ),
    ),
    ...section(
      'Escalations',
      review.escalations.map(
        (escalation) =>
          `- **${escalation.kind}**${
            escalation.findingIds.length === 0
              ? ''
              : ` (${escalation.findingIds.join(', ')})`
          }: ${inline(escalation.detail)}`,
      ),
    ),
  ].join('\n')
}

const claimResults = ['established', 'violated', 'not established', 'blocked']

const reportHeadline = (report) => {
  const results = claimResults.flatMap((result) => {
    const matching = report.claims.filter((claim) => claim.result === result)
    return matching.length > 0 ? [count(matching, result)] : []
  })
  return `**Verification report** run \`${report.runId}\` of slice ${report.sliceId} at \`${report.verifiedSha}\`: ${
    results.length > 0 ? results.join(', ') : 'no claims'
  }; ${count(
    report.telemetryRows.filter((row) => row.status !== 'present'),
    'telemetry rows not present',
  )}; ${count(
    report.forbiddenData,
    'forbidden-data findings',
  )}; ${count(report.escalations, 'escalations')}.`
}

/** The procedure behind a claim: the stated procedure, else the queries and traces it rests on. */
const procedure = (claim) => {
  const { procedure: stated, queries = [], traceIds = [] } = claim.evidence
  if (stated !== undefined) return stated
  return [
    queries.length === 0 ? '' : `queries ${queries.join('; ')}`,
    traceIds.length === 0 ? '' : `traces ${traceIds.join(', ')}`,
  ]
    .filter((part) => part.length > 0)
    .join('; ')
}

const claimRow = (claim, unrequested) => [
  `${claim.id}${claim.scope === 'partial' ? ' (partial)' : ''}${unrequested ? ' (unrequested)' : ''}`,
  claim.limitationId === undefined
    ? claim.result
    : `${claim.result} (${claim.limitationId})`,
  cell(inline(procedure(claim))),
  cell(inline(claim.conditions)),
]

/** The report this one supersedes: the run it names, else the latest earlier report of the same slice. */
const supersededReport = (report, earlier) =>
  report.supersedesRunId === undefined
    ? earlier.filter(({ entry }) => entry.sliceId === report.sliceId).at(-1)
    : earlier.find(({ entry }) => entry.runId === report.supersedesRunId)

const reportSupersedes = (report, earlier) => {
  const superseded = supersededReport(report, earlier)
  if (superseded === undefined) return undefined
  const { runId, verifiedSha } = superseded.entry
  return `Supersedes [run ${short(runId)} at ${verifiedSha.slice(0, 7)}](${superseded.url}).`
}

/** The report's headline, a claims table, then any escalations, forbidden data, and telemetry rows not present. */
export const renderReport = (report, context) => {
  const rows = [
    ...report.claims.map((claim) => claimRow(claim, false)),
    ...report.unrequestedViolations.map((claim) => claimRow(claim, true)),
  ]
  return [
    reportHeadline(report),
    ...supersedesLine(reportSupersedes(report, context.earlier)),
    '',
    '#### Claims',
    '',
    rows.length === 0
      ? 'No claims.'
      : table(['Claim', 'Result', 'Procedure', 'Conditions'], rows),
    ...section(
      'Escalations',
      report.escalations.map(
        (escalation) =>
          `- **${escalation.kind}**: ${inline(escalation.detail)}`,
      ),
    ),
    ...section(
      'Forbidden data',
      report.forbiddenData.map(
        (finding) => `- ${inline(finding.signal)} field \`${finding.field}\``,
      ),
    ),
    ...section(
      'Telemetry rows not present',
      report.telemetryRows
        .filter((row) => row.status !== 'present')
        .map(
          (row) =>
            `- ${row.id} **${row.status}**${row.detail === undefined ? '' : `: ${inline(row.detail)}`}`,
        ),
    ),
  ].join('\n')
}
