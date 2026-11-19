/**
 * The visual review the visual reviewer session writes to git notes. `validateVisualReview` is the schema: it accepts
 * unknown JSON and returns either the typed review or every problem found, each with its JSON path. See
 * docs/engineering/visual-review.md for what each field means.
 */
import {
  list,
  matching,
  object,
  ok,
  oneOf,
  optional,
  schemaVersion1,
  sha,
  storyId,
  text,
  treeId,
  uuid,
} from '../schema-checks.mjs'
/** @typedef {import('../schema-checks.mjs').Validated} Validated */

export const viewports = ['mobile', 'tablet', 'desktop']
export const conditions = [
  'default',
  'focus',
  'forced-colors',
  'text-200',
  'reduced-motion',
]
const severities = ['blocking', 'advisory']
/** The categories in docs/engineering/visual-review.md#findings. */
const categories = [
  'regression',
  'unexplained',
  'defect',
  'brand',
  'baseline',
  'missing',
  'tier',
]
const confidences = ['high', 'medium']
const closures = ['fixed', 'justified', 'withdrawn']
const escalationKinds = ['disagreement', 'third round', 'design']

/** The most findings one visual review may report. */
const findingLimit = 10

/** The round from which an open blocking finding must be escalated. */
const escalationRound = 3

/**
 * @typedef {object} Capture
 * @property {readonly (typeof conditions)[number][]} conditions
 * @property {string} reason Why the reviewer chose this story.
 * @property {string} story The Storybook story ID.
 * @property {readonly (typeof viewports)[number][]} viewports
 */

/**
 * @typedef {object} VisualFinding
 * @property {(typeof categories)[number]} category
 * @property {(typeof conditions)[number] | undefined} [condition]
 * @property {(typeof confidences)[number]} confidence
 * @property {string} id A stable ID such as VR-001, kept across rounds until closed.
 * @property {string} observed What the head capture shows, and for a difference what the base showed.
 * @property {(typeof severities)[number]} severity
 * @property {string} story
 * @property {string} summary
 * @property {string} verification How the reviewer confirmed the finding.
 * @property {(typeof viewports)[number] | undefined} [viewport]
 */

/**
 * @typedef {object} VisualReview
 * @property {string} baseSha
 * @property {readonly Capture[]} captures
 * @property {readonly { closure: (typeof closures)[number]; id: string; note: string }[]} closed
 * @property {readonly { detail: string; findingIds: readonly string[]; kind: (typeof escalationKinds)[number] }[]} escalations
 * @property {readonly VisualFinding[]} findings
 * @property {{ baseCodeTree: string; codeTree: string } | undefined} [inputs] Recorded by `visual:record`.
 * @property {string} page The URL of the page that shows the captures.
 * @property {number} pullRequest
 * @property {string} reviewedSha
 * @property {number} round
 * @property {1} schemaVersion
 * @property {string | undefined} [supersedesVisualReviewId]
 * @property {string} visualReviewId
 */

const positiveInteger = (value, path) =>
  Number.isInteger(value) && Number(value) > 0
    ? ok
    : [`${path}: expected a positive integer`]

const nonEmpty = (check) => (value, path) =>
  Array.isArray(value) && value.length === 0
    ? [`${path}: expected at least one entry`]
    : check(value, path)

const findingId = matching(/^VR-\d{3,}$/, 'a finding ID such as VR-001')

const capture = object({
  conditions: nonEmpty(list(oneOf(conditions))),
  reason: text,
  story: storyId,
  viewports: nonEmpty(list(oneOf(viewports))),
})

const finding = object({
  category: oneOf(categories),
  condition: optional(oneOf(conditions)),
  confidence: oneOf(confidences),
  id: findingId,
  observed: text,
  severity: oneOf(severities),
  story: storyId,
  summary: text,
  verification: text,
  viewport: optional(oneOf(viewports)),
})

const shape = object({
  baseSha: sha,
  captures: nonEmpty(list(capture)),
  closed: list(object({ closure: oneOf(closures), id: findingId, note: text })),
  escalations: list(
    object({
      detail: text,
      findingIds: list(findingId),
      kind: oneOf(escalationKinds),
    }),
  ),
  findings: list(finding),
  inputs: optional(object({ baseCodeTree: treeId, codeTree: treeId })),
  page: text,
  pullRequest: positiveInteger,
  reviewedSha: sha,
  round: positiveInteger,
  schemaVersion: schemaVersion1,
  supersedesVisualReviewId: optional(uuid),
  visualReviewId: uuid,
})

const duplicates = (ids) => ids.filter((id, index) => ids.indexOf(id) !== index)

/** Rules across fields, checked once the shape is valid. */
const consistency = (review) => {
  const open = review.findings.map((entry) => entry.id)
  const closed = review.closed.map((entry) => entry.id)
  const known = new Set([...open, ...closed])
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
    openBlockingVisual(review).length > 0 &&
    !review.escalations.some((entry) => entry.kind === 'third round')
      ? [
          `$.escalations: round ${String(review.round)} with open blocking findings needs a third round escalation`,
        ]
      : []),
    ...(review.baseSha === review.reviewedSha
      ? ['$.baseSha: must differ from reviewedSha']
      : []),
  ]
}

export const validateVisualReview = (value) => {
  const problems = shape(value, '$')
  if (problems.length > 0) return { ok: false, problems }
  // The shape check above establishes every field of VisualReview.
  const review = value
  const rules = consistency(review)
  return rules.length === 0
    ? { ok: true, value: review }
    : { ok: false, problems: rules }
}

/** The blocking findings still open in a visual review. */
export const openBlockingVisual = (review) =>
  review.findings.filter((entry) => entry.severity === 'blocking')
