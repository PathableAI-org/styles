// Ported from pathableai-org/pre-ets scripts/verification/request.ts @ f2ee390 (adapted: the slice table's Telemetry rows column is now Stories, read as Storybook story IDs).
/**
 * Builds a slice's verification request from its feature artifacts at one revision. The request is derived, never
 * hand-picked: claims and Storybook stories come from the slice's `plan.md` row, sections from `quickstart.md`, and
 * approved limitations from `verification.md` and the plan.
 */
import {
  anchor,
  bullets,
  headings,
  plain,
  sectionBullets,
  tables,
  topLevelItems,
} from './markdown.mjs'
import { storyId } from '../schema-checks.mjs'
/** @typedef {import('./markdown.mjs').Table} Table */

/**
 * @typedef {object} ApprovedLimitation
 * @property {string} id
 * @property {string} source
 * @property {string} text
 */

/**
 * @typedef {"full" | "partial"} ClaimScope
 */

/**
 * @typedef {object} FeatureArtifacts
 * @property {string} plan
 * @property {string} quickstart
 * @property {string | undefined} [research] Plan limitations may live in `research.md`, which the plan links.
 * @property {string} verification
 */

/**
 * @typedef {object} RequestedClaim
 * @property {string} id
 * @property {ClaimScope} scope
 * @property {string | undefined} [scopeNote] The plan's qualifier for a partial claim, such as "HTTP part".
 */

/**
 * @typedef {object} RequestTarget
 * @property {string} featureDir
 * @property {string} sha
 * @property {string} sliceId
 */

/**
 * @typedef {object} SectionRef
 * @property {string} anchor
 * @property {string} heading
 */

/**
 * @typedef {object} VerificationRequest
 * @property {readonly ApprovedLimitation[]} approvedLimitations
 * @property {readonly RequestedClaim[]} claims
 * @property {string} featureDir
 * @property {readonly SectionRef[]} quickstartSections
 * @property {1} schemaVersion
 * @property {string} sha
 * @property {string} sliceId
 * @property {"legacy-table" | "structured"} source `structured` reads the ID-only slice columns; `legacy-table` reads the older prose "Claim IDs advanced" cell.
 * @property {readonly string[]} stories Storybook story IDs the plan assigns to the slice.
 * @property {readonly string[]} warnings Anything the parser could not read. A request with warnings does not pass the gate.
 */

/**
 * @template T
 * @typedef {object} Parsed
 * @property {T} value
 * @property {readonly string[]} warnings
 */

const idItemPattern = (prefix) =>
  new RegExp(
    `^(?:(partial)\\s+)?(${prefix}-\\d+)(?:\\s*[–—-]\\s*(${prefix}-\\d+))?(?:\\s*\\((.+)\\))?$`,
    'i',
  )

/** Expands `V-009–V-018` into each ID, keeping the zero padding of the first. */
const expandRange = (first, last) => {
  if (last === undefined) return [first]
  const [prefix, from = ''] = first.split('-')
  const to = Number(last.split('-')[1])
  const ids = []
  for (let n = Number(from); n <= to; n += 1)
    ids.push(`${prefix ?? ''}-${String(n).padStart(from.length, '0')}`)
  return ids
}

const isNone = (cell) => /^(none\b|—|-|n\/a\b)/i.test(plain(cell))

/** One claim item such as `V-001 (gate)`, `partial V-002`, `V-009–V-018`, or `V-006 (full)`. */
const claimItem = (item, defaultScope) => {
  const match = idItemPattern('V').exec(item)
  if (match?.[2] === undefined) return undefined
  const note = match[4]?.trim()
  const qualified = note !== undefined && note !== 'full'
  const scope =
    defaultScope === 'partial' || match[1] !== undefined || qualified
      ? 'partial'
      : 'full'
  const scopeNote = qualified ? note : undefined
  return expandRange(match[2], match[3]).map((id) => ({ id, scope, scopeNote }))
}

const claimsFrom = (cell, defaultScope, label) => {
  if (isNone(cell)) return { value: [], warnings: [] }
  const items = topLevelItems(plain(cell)).map((item) => ({
    claims: claimItem(item, defaultScope),
    item,
  }))
  return {
    value: items.flatMap((entry) => entry.claims ?? []),
    warnings: items.flatMap((entry) =>
      entry.claims === undefined
        ? [`${label}: cannot read "${entry.item}" as a claim ID`]
        : [],
    ),
  }
}

const storiesFrom = (cell, label) => {
  if (isNone(cell)) return { value: [], warnings: [] }
  const stories = []
  const warnings = []
  for (const item of topLevelItems(plain(cell))) {
    if (storyId(item, label).length > 0)
      warnings.push(`${label}: cannot read "${item}" as a story ID`)
    else stories.push(item)
  }
  return { value: stories, warnings }
}

const column = (table, name) =>
  table.header.findIndex((cell) => name.test(plain(cell)))

const sliceTable = (plan) =>
  tables(plan).find(
    (table) =>
      /^slice$/i.test(plain(table.header[0] ?? '')) &&
      (column(table, /^claim ids advanced$/i) >= 0 ||
        column(table, /^full claims$/i) >= 0),
  )

/** The first slice in `plan.md`'s slice table, which the first implementation branch (`-impl`) carries. */
export const firstSliceId = (plan) => {
  const first = sliceTable(plan)?.rows[0]?.[0]
  return first === undefined || plain(first).length === 0
    ? undefined
    : plain(first)
}

const sliceRow = (table, sliceId) =>
  table.rows.find(
    (row) => plain(row[0] ?? '').toLowerCase() === sliceId.toLowerCase(),
  )

const quickstartHeadings = (quickstart) => {
  const all = headings(quickstart)
  const results = all.findIndex((heading) =>
    /^execution results$/i.test(heading.text),
  )
  return (results < 0 ? all : all.slice(0, results))
    .filter((heading) => heading.level <= 3)
    .map((heading) => ({
      anchor: anchor(heading.text),
      heading: plain(heading.text),
    }))
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Legacy: headings whose parenthetical names the slice, as in "§A1 — … (slice A1)", plus "(every slice)". */
const legacySections = (quickstart, sliceId) => {
  const own = new RegExp(
    `\\([^)]*\\bslices?\\b[^)]*\\b${escapeRegExp(sliceId)}\\b[^)]*\\)`,
    'i',
  )
  const value = quickstartHeadings(quickstart).filter(
    (section) =>
      own.test(section.heading) || /\(every slice\)/i.test(section.heading),
  )
  const named = value.some((section) => own.test(section.heading))
  return {
    value,
    warnings: named
      ? []
      : [`Slice ${sliceId}: no quickstart heading names "(slice ${sliceId})"`],
  }
}

const namedSections = (quickstart, cell, label) => {
  const available = quickstartHeadings(quickstart)
  const value = []
  const warnings = []
  for (const item of topLevelItems(plain(cell))) {
    const found = available.find((section) =>
      section.heading.toLowerCase().startsWith(item.toLowerCase()),
    )
    if (found === undefined)
      warnings.push(`${label}: no quickstart heading starts with "${item}"`)
    else value.push(found)
  }
  return { value, warnings }
}

const explicitId = /^\*\*([A-Z]+-\d+):\*\*\s*(.*)$/

/** Limitations from `verification.md`'s limitations section. Unnumbered bullets get positional `VL-n` IDs. */
const verificationLimitations = (verification) =>
  sectionBullets(verification, /^limitations/i).map((bullet, index) => {
    const match = explicitId.exec(bullet)
    return match?.[1] !== undefined
      ? { id: match[1], source: 'verification.md', text: match[2] ?? '' }
      : {
          id: `VL-${String(index + 1)}`,
          source: `verification.md (unnumbered bullet ${String(index + 1)})`,
          text: bullet,
        }
  })

/** Plan limitations defined as `- **L-n:** …` in `plan.md` or `research.md`. */
const planLimitations = (document, source) =>
  bullets(document ?? '').flatMap((bullet) => {
    const match = /^\*\*(L-\d+):\*\*\s*(.*)$/.exec(bullet)
    return match?.[1] === undefined
      ? []
      : [{ id: match[1], source, text: match[2] ?? '' }]
  })

/**
 * @typedef {object} SliceFields
 * @property {Parsed<readonly RequestedClaim[]>} claims
 * @property {Parsed<readonly SectionRef[]>} sections
 * @property {VerificationRequest["source"]} source
 * @property {Parsed<readonly string[]>} stories
 */

const structuredFields = (table, row, quickstart, label) => {
  const cell = (name) => row[column(table, name)] ?? '—'
  const full = claimsFrom(
    cell(/^full claims$/i),
    'full',
    `${label} full claims`,
  )
  const partial = claimsFrom(
    cell(/^partial claims$/i),
    'partial',
    `${label} partial claims`,
  )
  return {
    claims: {
      value: [...full.value, ...partial.value],
      warnings: [...full.warnings, ...partial.warnings],
    },
    sections: namedSections(
      quickstart,
      cell(/^quickstart sections$/i),
      `${label} quickstart sections`,
    ),
    source: 'structured',
    stories: storiesFrom(cell(/^stories$/i), `${label} stories`),
  }
}

const legacyFields = (table, row, quickstart, label, sliceId) => {
  const cell = (name) => row[column(table, name)] ?? '—'
  return {
    claims: claimsFrom(
      cell(/^claim ids advanced$/i),
      'full',
      `${label} claims`,
    ),
    sections: legacySections(quickstart, sliceId),
    source: 'legacy-table',
    stories: storiesFrom(cell(/^stories$/i), `${label} stories`),
  }
}

const sliceFields = (plan, quickstart, sliceId) => {
  const table = sliceTable(plan)
  if (table === undefined) return 'plan.md has no implementation-slice table'
  const row = sliceRow(table, sliceId)
  if (row === undefined) return `plan.md has no slice "${sliceId}"`
  const label = `Slice ${sliceId}`
  return column(table, /^full claims$/i) >= 0
    ? structuredFields(table, row, quickstart, label)
    : legacyFields(table, row, quickstart, label, sliceId)
}

const empty = {
  claims: { value: [], warnings: [] },
  sections: { value: [], warnings: [] },
  source: 'legacy-table',
  stories: { value: [], warnings: [] },
}

/** The request for one slice. It never throws on content; anything unreadable is a warning. */
export const buildRequest = (artifacts, target) => {
  const fields = sliceFields(
    artifacts.plan,
    artifacts.quickstart,
    target.sliceId,
  )
  const found = typeof fields === 'string' ? empty : fields
  const claimWarnings =
    found.claims.value.length === 0
      ? [`Slice ${target.sliceId} advances no claim`]
      : []
  return {
    approvedLimitations: [
      ...verificationLimitations(artifacts.verification),
      ...planLimitations(artifacts.plan, 'plan.md'),
      ...planLimitations(artifacts.research, 'research.md'),
    ],
    claims: found.claims.value,
    featureDir: target.featureDir,
    quickstartSections: found.sections.value,
    schemaVersion: 1,
    sha: target.sha,
    sliceId: target.sliceId,
    source: found.source,
    stories: found.stories.value,
    warnings: [
      ...(typeof fields === 'string' ? [fields] : claimWarnings),
      ...found.claims.warnings,
      ...found.stories.warnings,
      ...found.sections.warnings,
    ],
  }
}
