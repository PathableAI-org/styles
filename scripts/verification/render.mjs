// Ported from pathableai-org/pre-ets scripts/verification/render.ts @ f2ee390 (adapted: a channel column per claim and a stories table replace telemetry rows and forbidden data).

/** @typedef {import('./report.mjs').ClaimReport} ClaimReport */
/** @typedef {import('./report.mjs').VerificationReport} VerificationReport */

/** @typedef {import('./request.mjs').VerificationRequest} VerificationRequest */

/**
 * Renders a report as the slice's `quickstart.md` execution results, in the format earlier features used, so the
 * implementation session commits generated text instead of a hand summary.
 */
import { cell, table } from '../markdown.mjs'
import { headings, sectionRange } from './markdown.mjs'

const short = (sha) => sha.slice(0, 7)

const claimLabel = (claim, request) => {
  const note = request?.claims.find(
    (requested) => requested.id === claim.id,
  )?.scopeNote
  if (claim.scope === 'full') return claim.id
  return note === undefined ? `${claim.id} (partial)` : `${claim.id} (${note})`
}

const resultLabel = (claim) =>
  claim.limitationId === undefined
    ? claim.result
    : `${claim.result} (${claim.limitationId})`

const evidenceText = (claim) => {
  const parts = [
    claim.evidence.stories?.length
      ? `stories ${claim.evidence.stories.map((id) => `\`${id}\``).join(', ')}`
      : '',
    claim.evidence.commands?.length
      ? `commands ${claim.evidence.commands.map((command) => `\`${command}\``).join('; ')}`
      : '',
    claim.evidence.procedure ?? '',
  ].filter((part) => part.length > 0)
  return parts.join('; ')
}

const observation = (claim) =>
  cell(
    `${claim.observed} Conditions: ${claim.conditions}. Evidence: ${evidenceText(claim)}.`,
  )

const listOrNone = (items) => (items.length === 0 ? 'none' : items.join('; '))

/** The stories the plan assigns to the slice as the test runner observed them, or a line saying there are none. */
const storyLines = (report) =>
  report.stories.length === 0
    ? ['**Stories:** none.']
    : [
        '**Stories:**',
        '',
        table(
          ['Story', 'Storybook', 'Status', 'Detail'],
          report.stories.map((story) => [
            `\`${story.id}\``,
            story.storybook,
            story.status,
            cell(story.detail ?? ''),
          ]),
        ),
      ]

const supersedesLine = (report, earlierSha) => {
  const lines = []
  if (earlierSha !== undefined && earlierSha !== report.verifiedSha) {
    lines.push(`This run supersedes the \`${short(earlierSha)}\` report above.`)
  }
  if (report.supersedesRunId !== undefined) {
    lines.push(
      `This run supersedes run \`${report.supersedesRunId}\` at the same revision.`,
    )
  }
  return lines.length === 0 ? [] : [lines.join(' '), '']
}

/**
 * @typedef {object} RenderOptions
 * @property {string | undefined} [earlierSha] The SHA of the slice's most recent earlier results, which this report marks stale.
 * @property {undefined | VerificationRequest} [request]
 */

export const renderReport = (report, options = {}) => {
  const claims = [...report.claims, ...report.unrequestedViolations]
  const rows = claims.map((claim) => [
    claimLabel(claim, options.request),
    resultLabel(claim),
    claim.evidence.channel,
    observation(claim),
  ])
  return [
    `### Slice ${report.sliceId} — \`${report.verifiedSha}\` (${report.timeRange.start.slice(0, 10)})`,
    '',
    `Generated from the verification note on \`${short(
      report.verifiedSha,
    )}\` (\`refs/notes/verification\`). Do not edit by hand.`,
    '',
    ...supersedesLine(report, options.earlierSha),
    `**Run:** \`${report.runId}\`, ${report.timeRange.start} to ${report.timeRange.end}.`,
    '',
    `**Conditions:** ${report.environment}`,
    '',
    table(['Claim', 'Result', 'Channel', 'Observation'], rows),
    '',
    ...storyLines(report),
    '',
    `**Escalation:** ${listOrNone(
      report.escalations.map(
        (escalation) => `${escalation.kind}: ${escalation.detail}`,
      ),
    )}.`,
    '',
    `**Cleanup:** ${report.cleanup.complete ? 'complete' : `incomplete: ${report.cleanup.remaining ?? 'not stated'}`}.`,
    '',
  ].join('\n')
}

const sliceHeading = (sliceId) =>
  new RegExp(`^Slice ${sliceId}\\b.*\`([0-9a-f]{7,40})\``, 'i')

/** The SHA in the slice's latest earlier execution-results heading, if any. */
export const earlierResultSha = (quickstart, sliceId) =>
  headings(quickstart)
    .flatMap((heading) => sliceHeading(sliceId).exec(heading.text)?.[1] ?? [])
    .at(-1)

/** Appends the rendered results to the end of the execution-results section. */
export const insertResults = (quickstart, rendered) => {
  const range = sectionRange(quickstart, /^execution results$/i)
  if (range === undefined) return undefined
  const lines = quickstart.split('\n')
  const before = lines.slice(0, range.end)
  while (before.at(-1) === '') before.pop()
  return [
    ...before,
    '',
    rendered.trimEnd(),
    ...(range.end < lines.length ? ['', ...lines.slice(range.end)] : ['']),
  ].join('\n')
}
