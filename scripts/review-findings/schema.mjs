// Ported from pathableai-org/pre-ets scripts/review-findings/schema.ts @ f2ee390 (adapted: module-ownership replaced by design-system categories).
/**
 * The code review the reviewer session writes to git notes. `validateReview` is the schema: it accepts unknown JSON
 * and returns either the typed review or every problem found, each with its JSON path. See
 * docs/engineering/code-review.md for what each field means.
 */
import {
  featureDir,
  featureDirUnlessFix,
  list,
  matching,
  object,
  ok,
  oneOf,
  optional,
  schemaVersion1,
  sha,
  sliceId,
  text,
  treeId,
  uuid,
} from '../schema-checks.mjs'
/** @typedef {import('../schema-checks.mjs').Check} Check */
/** @typedef {import('../schema-checks.mjs').Validated} Validated */

const severities = ['blocking', 'advisory']
/**
 * The general categories, then the design system's own. `source-first`: a wrapper exposes behaviour before the
 * styles contract exists. `wrapper-styling`: wrapper-only or private CSS. `naming-parity`: a React name that is not
 * the CamelCase of the styles component name without `pathable`. `token-usage`: a raw value where a semantic token
 * exists. `story-contract`: stories that are not deterministic, named contracts. `accessibility`: keyboard, focus, or
 * ARIA behaviour. `guidance-drift`: consumer agent guidance out of date. `ownership`: code in the wrong package or
 * layer.
 */
const categories = [
  'correctness',
  'duplication',
  'readability',
  'complexity',
  'test-meaningfulness',
  'contract-drift',
  'source-first',
  'wrapper-styling',
  'naming-parity',
  'token-usage',
  'story-contract',
  'accessibility',
  'guidance-drift',
  'ownership',
]
const confidences = ['high', 'medium']
const closures = ['fixed', 'justified', 'withdrawn']
const escalationKinds = ['specification', 'plan', 'disagreement', 'third round']

/** The most findings one review may report. A longer list hides the findings that matter. */
const findingLimit = 10

/** The round from which an open blocking finding must be escalated. */
const escalationRound = 3

/**
 * @typedef {object} ClosedFinding
 * @property {(typeof closures)[number]} closure
 * @property {string} id
 * @property {string} note The fixing SHA, the implementation session's justification, or why the reviewer withdrew it.
 */

/**
 * @typedef {object} Escalation
 * @property {string} detail
 * @property {readonly string[]} findingIds Finding IDs the escalation concerns.
 * @property {(typeof escalationKinds)[number]} kind
 */

/**
 * @typedef {object} Finding
 * @property {(typeof categories)[number]} category
 * @property {(typeof confidences)[number]} confidence
 * @property {string} failureScenario Concrete inputs or state, and the wrong outcome they produce.
 * @property {string} file Repository-relative path at the reviewed SHA.
 * @property {string} id A stable ID such as R-001. A finding keeps its ID across rounds until it is closed.
 * @property {number} line
 * @property {(typeof severities)[number]} severity
 * @property {string} summary
 * @property {string} verification How the reviewer confirmed the finding before reporting it: what was read, traced, or run.
 */

/**
 * @typedef {object} Review
 * @property {string} baseSha The slice's base: the parent branch tip the diff was taken from.
 * @property {readonly ClosedFinding[]} closed Findings from earlier rounds that this review closes.
 * @property {readonly Escalation[]} escalations
 * @property {string | undefined} [featureDir] The feature's `specs/{number}-{slug}`. A High fix (slice ID `fix`) may omit it.
 * @property {readonly Finding[]} findings Every finding still open at the reviewed SHA, carried-forward findings included.
 * @property {ReviewInputs | undefined} [inputs]
 * @property {string} reviewedSha
 * @property {string} reviewId
 * @property {number} round 1 for the first review of a slice; each re-review after a fix adds one.
 * @property {1} schemaVersion
 * @property {string} sliceId
 * @property {string | undefined} [supersedesReviewId] The review ID on the same SHA that this review replaces.
 */

/**
 * What the review covered, recorded by `review:record` from the base and reviewed SHAs rather than written by the reviewer: each commit's code tree outside `specs/`. Reviews recorded before this field existed have none.
 * @typedef {object} ReviewInputs
 * @property {string} baseCodeTree
 * @property {string} codeTree
 */

const positiveInteger = (value, path) =>
  Number.isInteger(value) && Number(value) > 0
    ? ok
    : [`${path}: expected a positive integer`]

const findingId = matching(/^R-\d{3,}$/, 'a finding ID such as R-001')
const repoPath = matching(
  /^(?!\/)(?!.*(^|\/)\.\.(\/|$))[^\s]+$/,
  'a repository-relative path',
)

const finding = object({
  category: oneOf(categories),
  confidence: oneOf(confidences),
  failureScenario: text,
  file: repoPath,
  id: findingId,
  line: positiveInteger,
  severity: oneOf(severities),
  summary: text,
  verification: text,
})

const shape = object({
  baseSha: sha,
  closed: list(object({ closure: oneOf(closures), id: findingId, note: text })),
  escalations: list(
    object({
      detail: text,
      findingIds: list(findingId),
      kind: oneOf(escalationKinds),
    }),
  ),
  featureDir: optional(featureDir),
  findings: list(finding),
  inputs: optional(object({ baseCodeTree: treeId, codeTree: treeId })),
  reviewedSha: sha,
  reviewId: uuid,
  round: positiveInteger,
  schemaVersion: schemaVersion1,
  sliceId,
  supersedesReviewId: optional(uuid),
})

const duplicates = (ids) => ids.filter((id, index) => ids.indexOf(id) !== index)

/** Rules across fields, checked once the shape is valid. */
const consistency = (review) => {
  const open = review.findings.map((entry) => entry.id)
  const closed = review.closed.map((entry) => entry.id)
  const known = new Set([...open, ...closed])
  const blocking = review.findings.filter(
    (entry) => entry.severity === 'blocking',
  )
  return [
    ...(open.length > findingLimit
      ? [`$.findings: report at most ${String(findingLimit)} findings`]
      : []),
    ...duplicates([...open, ...closed]).map(
      (id) => `$: ${id} appears more than once`,
    ),
    ...review.escalations.flatMap((entry, index) =>
      entry.findingIds
        .filter((id) => !known.has(id))
        .map(
          (id) =>
            `$.escalations[${String(index)}].findingIds: ${id} is not a finding in this review`,
        ),
    ),
    ...(review.round >= escalationRound &&
    blocking.length > 0 &&
    !review.escalations.some((entry) => entry.kind === 'third round')
      ? [
          `$.escalations: round ${String(review.round)} with open blocking findings needs a third round escalation`,
        ]
      : []),
    ...(review.baseSha === review.reviewedSha
      ? ['$.baseSha: must differ from reviewedSha']
      : []),
    ...featureDirUnlessFix(review),
  ]
}

export const validateReview = (value) => {
  const problems = shape(value, '$')
  if (problems.length > 0) return { ok: false, problems }
  // The shape check above establishes every field of Review.
  const review = value
  const rules = consistency(review)
  return rules.length === 0
    ? { ok: true, value: review }
    : { ok: false, problems: rules }
}

/** The blocking findings still open in a review. */
export const openBlocking = (review) =>
  review.findings.filter((entry) => entry.severity === 'blocking')
