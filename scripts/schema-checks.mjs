// Ported from pathableai-org/pre-ets scripts/schema-checks.ts @ f2ee390 (adapted: adds storyId, the Storybook story ID check).
/**
 * Small composable checks for JSON the agent workflow tooling stores in git notes: verification reports and code reviews. A check takes an unknown value and its JSON path and returns every problem found.
 * @typedef {(value: unknown, path: string) => readonly string[]} Check
 */

/**
 * @template T
 * @typedef {{ readonly ok: false; readonly problems: readonly string[] } | { readonly ok: true readonly value: T }} Validated
 */

export const ok = []

export const isRecord = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Values that look like credentials or tokens. Notes name fields and code; they never carry secret values. */
const secretPatterns = [
  /\beyJ[\w-]{8,}\.[\w-]{8,}\./,
  /\bbearer\s+[\w.~+/-]{8,}/i,
  /\b(password|passwd|secret|token|cookie|authorization|api[_-]?key)\s*[=:]\s*\S/i,
]

/** Non-empty text that does not look like it holds a credential. */
export const text = (value, path) => {
  if (typeof value !== 'string' || value.trim().length === 0)
    return [`${path}: expected non-empty text`]
  return secretPatterns.some((pattern) => pattern.test(value))
    ? [`${path}: looks like it holds a credential`]
    : ok
}

export const matching = (pattern, description) => (value, path) =>
  typeof value === 'string' && pattern.test(value)
    ? ok
    : [`${path}: expected ${description}`]

export const oneOf = (allowed) => (value, path) =>
  typeof value === 'string' && allowed.includes(value)
    ? ok
    : [`${path}: expected one of ${allowed.join(', ')}`]

export const optional = (check) => (value, path) =>
  value === undefined ? ok : check(value, path)

export const list = (item) => (value, path) =>
  Array.isArray(value)
    ? value.flatMap((entry, index) => item(entry, `${path}[${String(index)}]`))
    : [`${path}: expected a list`]

/** An object with exactly these fields; an unknown field is a problem. */
export const object = (fields) => (value, path) => {
  if (!isRecord(value)) return [`${path}: expected an object`]
  const unknown = Object.keys(value)
    .filter((key) => !(key in fields))
    .map((key) => `${path}.${key}: unknown field`)
  return [
    ...unknown,
    ...Object.entries(fields).flatMap(([key, check]) =>
      check(value[key], `${path}.${key}`),
    ),
  ]
}

export const sha = matching(/^[0-9a-f]{40}$/, 'a full 40-character commit SHA')
export const treeId = matching(/^[0-9a-f]{40}$/, 'a 40-character git tree ID')
export const digest = matching(
  /^[0-9a-f]{64}$/,
  'a 64-character SHA-256 digest',
)
export const uuid = matching(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  'a UUID',
)
export const featureDir = matching(
  /^specs\/\d+-[a-z0-9-]+$/,
  'specs/{number}-{slug}',
)
/** A Storybook story ID: the kebab-case title, two hyphens, and the kebab-case story name. */
export const storyId = matching(
  /^[a-z0-9]+(?:-[a-z0-9]+)*--[a-z0-9]+(?:-[a-z0-9]+)*$/,
  'a Storybook story ID such as components-button--primary',
)
export const sliceId = matching(/^[A-Za-z0-9]+$/, 'a slice ID such as A1')

/** Whether a slice ID names a High fix's single pull request rather than an implementation slice. */
export const isFixSlice = (id) => id.toLowerCase() === 'fix'

/** A High fix (slice ID `fix`) may omit its feature directory; every implementation slice names one. */
export const featureDirUnlessFix = (value) =>
  value.featureDir === undefined &&
  !(typeof value.sliceId === 'string' && isFixSlice(value.sliceId))
    ? ['$.featureDir: required unless sliceId is fix']
    : ok
export const schemaVersion1 = (value, path) =>
  value === 1 ? ok : [`${path}: expected 1`]
