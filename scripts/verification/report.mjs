// Ported from pathableai-org/pre-ets scripts/verification/report.ts @ f2ee390 (adapted: telemetry rows, forbidden data, traces and queries replaced by Storybook stories and per-claim evidence channels).

/** @typedef {import('./request.mjs').ClaimScope} ClaimScope */

/**
 * The verification report the verifier writes to git notes. `validateReport` is the schema: it accepts unknown JSON
 * and returns either the typed report or every problem found, each with its JSON path.
 */
import {
  digest,
  featureDir,
  featureDirUnlessFix,
  isRecord,
  list,
  matching,
  object,
  ok,
  oneOf,
  optional,
  schemaVersion1,
  sha,
  sliceId,
  storyId,
  text,
  treeId,
  uuid,
} from '../schema-checks.mjs'
/** @typedef {import('../schema-checks.mjs').Check} Check */
/** @typedef {import('../schema-checks.mjs').Validated} Validated */

const claimResults = ['established', 'violated', 'not established', 'blocked']
/**
 * @typedef {(typeof claimResults)[number]} ClaimResult
 */

const storyStatuses = ['passing', 'failing', 'missing']
/**
 * @typedef {(typeof storyStatuses)[number]} StoryStatus
 */

const storybooks = ['styles', 'react']
/**
 * @typedef {(typeof storybooks)[number]} StorybookName
 */

/**
 * Where a claim's evidence was observed. `storybook-test`: the Storybook test runner, rendered axe checks included,
 * for named stories. `visual`: `pnpm test:visual` snapshot diffs. `browser`: Playwright observation of specific
 * stories (keyboard and focus, narrow and wide viewports, increased text size, forced colors, reduced motion).
 * `package`: `check:package`, `check:types`, `test:next-consumer`. `agent-guidance`: `pnpm check:agent-guidance`.
 * `unit-test`: the `@pathableai/react` unit tests. `assistive-technology`: a person's manual check.
 */
const evidenceChannels = [
  'storybook-test',
  'visual',
  'browser',
  'package',
  'agent-guidance',
  'unit-test',
  'assistive-technology',
]
/**
 * @typedef {(typeof evidenceChannels)[number]} EvidenceChannel
 */

const escalationKinds = ['specification', 'plan', 'disagreement', 'third round']

/**
 * @typedef {object} ClaimReport
 * @property {string} conditions
 * @property {Evidence} evidence
 * @property {string} id
 * @property {string | undefined} [limitationId] Required for `not established` and `blocked`: an approved limitation ID from the request.
 * @property {string} observed
 * @property {ClaimResult} result
 * @property {ClaimScope} scope
 */

/**
 * @typedef {object} Escalation
 * @property {string} detail
 * @property {(typeof escalationKinds)[number]} kind
 */

/**
 * @typedef {object} Evidence
 * @property {EvidenceChannel} channel
 * @property {readonly string[] | undefined} [commands] The commands run, such as `pnpm test:storybook-react`.
 * @property {string | undefined} [procedure] Quickstart steps or what a person or browser observation did.
 * @property {readonly string[] | undefined} [stories] Storybook story IDs, such as `components-button--primary`.
 */

/**
 * What the report was observed against, recorded by `verify:record` from the verified SHA rather than written by the verifier: the code tree outside `specs/`, and a digest of the feature's artifacts without its execution results. Reports recorded before this field existed have none.
 * @typedef {object} ReportInputs
 * @property {string} codeTree
 * @property {string | undefined} [featureInputs] Absent for a High fix, which has no feature directory.
 */

/**
 * A story the plan assigns to the slice, as the Storybook test runner observed it.
 * @typedef {object} StoryReport
 * @property {string | undefined} [detail]
 * @property {string} id The Storybook story ID.
 * @property {StoryStatus} status
 * @property {StorybookName} storybook
 */

/**
 * @typedef {object} VerificationReport
 * @property {readonly ClaimReport[]} claims
 * @property {{ readonly complete: boolean; readonly remaining?: string | undefined }} cleanup
 * @property {string} environment Which Storybooks, ports, and builds the run used, without credentials.
 * @property {readonly Escalation[]} escalations
 * @property {string | undefined} [featureDir] The feature's `specs/{number}-{slug}`. A High fix (slice ID `fix`) may omit it.
 * @property {ReportInputs | undefined} [inputs]
 * @property {string} runId
 * @property {1} schemaVersion
 * @property {string} sliceId
 * @property {string | undefined} [supersedesRunId] The run ID of the report on the same SHA that this retry replaces.
 * @property {readonly StoryReport[]} stories
 * @property {{ readonly end: string; readonly start: string }} timeRange
 * @property {readonly ClaimReport[]} unrequestedViolations Claims the request did not name that the run happened to show as violated.
 * @property {string} verifiedSha
 */

const isoTime = matching(
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/,
  'an ISO 8601 time',
)
const claimId = matching(/^V-\d+$/, 'a claim ID such as V-001')

const evidence = (value, path) => {
  const shape = object({
    channel: oneOf(evidenceChannels),
    commands: optional(list(text)),
    procedure: optional(text),
    stories: optional(list(storyId)),
  })(value, path)
  if (shape.length > 0 || !isRecord(value)) return shape
  const given = [value.stories, value.commands, value.procedure].some(
    (entry) => (Array.isArray(entry) ? entry.length > 0 : entry !== undefined),
  )
  return given ? ok : [`${path}: give stories, commands, or the procedure`]
}

const claimShape = object({
  conditions: text,
  evidence,
  id: claimId,
  limitationId: optional(
    matching(/^[A-Z]+-\d+$/, 'a limitation ID such as L-1'),
  ),
  observed: text,
  result: oneOf(claimResults),
  scope: oneOf(['full', 'partial']),
})

const claim = (value, path) => {
  const shape = claimShape(value, path)
  if (shape.length > 0 || !isRecord(value)) return shape
  const needsLimitation =
    value.result === 'not established' || value.result === 'blocked'
  return needsLimitation && value.limitationId === undefined
    ? [`${path}.limitationId: required for a ${String(value.result)} result`]
    : ok
}

const report = object({
  claims: list(claim),
  cleanup: object({
    complete: (value, path) =>
      typeof value === 'boolean' ? ok : [`${path}: expected true or false`],
    remaining: optional(text),
  }),
  environment: text,
  escalations: list(object({ detail: text, kind: oneOf(escalationKinds) })),
  featureDir: optional(featureDir),
  inputs: optional(
    object({ codeTree: treeId, featureInputs: optional(digest) }),
  ),
  runId: uuid,
  schemaVersion: schemaVersion1,
  sliceId,
  supersedesRunId: optional(uuid),
  stories: list(
    object({
      detail: optional(text),
      id: storyId,
      status: oneOf(storyStatuses),
      storybook: oneOf(storybooks),
    }),
  ),
  timeRange: object({ end: isoTime, start: isoTime }),
  unrequestedViolations: list(claim),
  verifiedSha: sha,
})

export const validateReport = (value) => {
  const shape = report(value, '$')
  const problems =
    shape.length > 0 || !isRecord(value) ? shape : featureDirUnlessFix(value)
  // The checks above establish every field of VerificationReport.
  return problems.length === 0
    ? { ok: true, value: value }
    : { ok: false, problems }
}
