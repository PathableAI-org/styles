/**
 * Ties each component page (components/*.md, the source pages) to the styles
 * package it describes. The page is written by hand and is the specification;
 * this check fails when the page and the package disagree. A page may take
 * its examples from the HTML fixtures (fixtures/<slug>/) through placeholders
 * (components/README.md); the checks below then read the page as the styles
 * package ships it, with the fixtures in place.
 *
 * A page states guarantees: expected behaviour, each `met` (the default),
 * `unmet` (not implemented yet) or `unverified` (read from the source and
 * believed true, but no test cites it yet). It does not say how they are
 * tested. A test cites a guarantee, as `<page>/<guarantee-id>`:
 *   - a story play function, with `guarantee(step, id, …)` or, for an unmet
 *     guarantee, `guarantee.unmet(step, id, …)` (src/stories/shared/guarantee.ts).
 *
 * There are two stages, because they need different inputs.
 *
 * A page has one of four kinds, which decide its front matter and sections:
 *   - `static`, a component: `styles-class` and `variants`, and the sections
 *     When to use, Example, Variants, Composition, Guarantees and The consumer
 *     owns. Everything below that is not marked otherwise applies to it.
 *   - `utility`, a family of USWDS utility classes (slug `utilities-<uswds
 *     slug>`): `uswds` and a non-empty `classes` list of unprefixed class
 *     patterns, and the sections When to use, Example, Classes, Variants, States,
 *     Guarantees and The consumer owns, in that order.
 *   - `token`, a USWDS design token group (slug `tokens-<uswds path>`): `uswds`
 *     and no `classes`, and the sections When to use, Example, Values, Utilities,
 *     States, Guarantees and The consumer owns, in order.
 *     The public contract of both is the compiled CSS only: the pages
 *     document class names and the values they output, never a Sass API.
 *   - `settings`, how the build configures USWDS (slug `settings` or
 *     `settings-<name>`): `name`, `slug`, `kind` and `summary`, and an optional
 *     `uswds` link under /documentation/settings/. The first section is "Not
 *     public API", which says plainly that the settings are information only;
 *     a `settings-<name>` page also has "Values". A settings page is the one
 *     place that names Sass settings (`$theme-color-primary`), and it has no
 *     fixture, example, html block, `styles-class`, `variants`, `classes` or
 *     `guarantees`: nothing on it is a consumer contract, so there is nothing
 *     to cite from a test. It renders to the Storybook only.
 * `utility` and `token` pages have no `styles-class` and no `variants` (both
 * are rejected), because they describe unprefixed USWDS names rather than one
 * `pathable-*` component with modifiers. The class of a variant, the variant
 * rules and the "every modifier is a variant" rule are therefore `static`
 * only. A page of any of the three kinds that names a `--custom-property` in
 * prose or in a guarantee claim fails, because no custom property is public. Every other rule applies
 * to all three kinds: the guarantees, the
 * title and summary paragraph, no `usa-` anywhere, exactly one html example,
 * and every class in an html example (fixtures included) being a class
 * selector in the compiled CSS, so a utility class the package does not emit
 * is reported as a defect.
 *
 * A page may cite a `pathable-` utility class (one in dist/utilities.css outside
 * a pseudo-class argument, with or without a `hover:` style prefix) only when
 * a page's `classes` declares it, in prose, an html block, a fixture or a
 * guarantee claim. `<name>` placeholders in `classes` match `[a-z0-9-]+`.
 *
 * Stage 1, `pnpm --filter @pathableai/styles check:component-pages`, needs the
 * built stylesheet (dist/styles.css). It proves:
 *   - every placeholder resolves: each fixture it names exists, package
 *     blocks are well formed and, for a component the React package covers,
 *     each state has a React example module;
 *   - a page with placeholders shows every fixture in its folder, and a page
 *     whose component the React package covers has placeholders;
 *   - the front matter has the known fields and the body the required sections;
 *   - the class, every non-default variant's modifier class, every class in
 *     the markup examples (fixtures included) and every class named in prose
 *     is a class selector
 *     in the compiled CSS; a default variant has no modifier class; every
 *     modifier the CSS has for the class is a variant on the page (static);
 *   - the body's summary paragraph and Variants table agree with the front
 *     matter, and no page names a custom property in prose or a claim;
 * It does not look at play functions.
 *
 * Stage 2, `… check:component-pages:executed`, needs the records the Storybook
 * test-runner writes during `pnpm test:storybook-styles`
 * (apps/storybook/test-results/component-pages/). It proves:
 *   - every guarantee id a play function executed exists, with the right
 *     form: `guarantee()` for met, `guarantee.unmet()` for unmet;
 *   - every met guarantee was executed by a play function; an unmet guarantee
 *     may have no test yet.
 * It reads what ran, not the story source, so a `guarantee()` call that never
 * executes counts for nothing. A record left by an earlier run is not trusted:
 * one of a story the built Storybook no longer has is ignored, and one older
 * than the build is an error (see `currentRecords`).
 *
 * Neither stage proves that a citing test's assertions are sufficient for the
 * claim. Components without a page are counted, not failed.
 *
 *   node scripts/check-component-pages.mjs              stage 1
 *   node scripts/check-component-pages.mjs --executed   stage 2
 *   … --trace   also print which test cites each guarantee (with --executed,
 *               play functions included)
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { basename, join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'

import { render, shownStates } from '../../../scripts/component-docs/render.mjs'
import {
  codeBlocks,
  ComponentDocsError,
  exampleSegments,
  findPlaceholders,
  segment,
  visibleMarkdown,
} from '../../../scripts/component-docs/segments.mjs'
import { readCoverage } from '../../../scripts/component-docs/sources.mjs'
import { pageSources } from '../../../scripts/component-docs/write.mjs'

import { parsePage, readPages } from './component-pages.mjs'

const packageRoot = resolve(import.meta.dirname, '..')
const repoRoot = resolve(packageRoot, '../..')
const compiledCss = join(packageRoot, 'dist/styles.css')
const utilitiesCss = join(packageRoot, 'dist/utilities.css')
const executedDir = join(
  repoRoot,
  'apps/storybook/test-results/component-pages',
)
const storybookIndex = join(
  repoRoot,
  'apps/storybook/storybook-static/index.json',
)

export const REQUIRED_FIELDS = [
  'name',
  'slug',
  'kind',
  'summary',
  'styles-class',
  'variants',
  'guarantees',
]

export const REQUIRED_SECTIONS = [
  'When to use',
  'Example',
  'Variants',
  'Composition',
  'Guarantees',
  'The consumer owns',
]

/** The fields of a utility page; it has no `styles-class` and no `variants`. */
export const UTILITY_FIELDS = [
  'name',
  'slug',
  'kind',
  'summary',
  'uswds',
  'classes',
  'guarantees',
]
/** The fields of a token page. */
export const TOKEN_FIELDS = [
  'name',
  'slug',
  'kind',
  'summary',
  'uswds',
  'guarantees',
]

/** The sections of a utility page, in the order the body must have them. */
export const UTILITY_SECTIONS = [
  'When to use',
  'Example',
  'Classes',
  'Variants',
  'States',
  'Guarantees',
  'The consumer owns',
]
/** The sections of a token page, in order. */
export const TOKEN_SECTIONS = [
  'When to use',
  'Example',
  'Values',
  'Utilities',
  'States',
  'Guarantees',
  'The consumer owns',
]

/** The fields of a settings page; `uswds` is optional. */
export const SETTINGS_FIELDS = ['name', 'slug', 'kind', 'summary']
export const SETTINGS_OPTIONAL_FIELDS = ['uswds']
/** The sections of every settings page; the first must come first on the page. */
export const SETTINGS_SECTIONS = ['Not public API']
/** The extra section of a `settings-<name>` page, which lists the values. */
export const SETTINGS_VALUES_SECTION = 'Values'
const SETTINGS_URL = 'https://designsystem.digital.gov/documentation/settings/'

const KINDS = ['static', 'utility', 'token', 'settings']
/** Where the page's `uswds` link must point, and how its slug starts. */
const USWDS_KINDS = {
  utility: {
    prefix: 'https://designsystem.digital.gov/utilities/',
    slug: 'utilities-',
  },
  token: {
    prefix: 'https://designsystem.digital.gov/design-tokens/',
    slug: 'tokens-',
  },
}

/** Whether the page documents unprefixed USWDS names rather than one component. */
const isUswdsPage = (page) => page.data.kind in USWDS_KINDS

/** Whether the page documents the USWDS build settings (information only). */
const isSettingsPage = (page) => page.data.kind === 'settings'

/** The front matter fields a page of this kind has (static when unknown). */
const fieldsOf = (kind) =>
  ({
    utility: UTILITY_FIELDS,
    token: TOKEN_FIELDS,
    settings: SETTINGS_FIELDS,
  })[kind] ?? REQUIRED_FIELDS

/** The fields a page of this kind may have without requiring them. */
const optionalFieldsOf = (kind) =>
  kind === 'settings' ? SETTINGS_OPTIONAL_FIELDS : []

/**
 * The sections a page has (static when the kind is unknown). Only the
 * overview, slug `settings`, has no `## Values`.
 */
const sectionsOf = ({ kind, slug }) =>
  kind === 'settings'
    ? slug === 'settings'
      ? SETTINGS_SECTIONS
      : [...SETTINGS_SECTIONS, SETTINGS_VALUES_SECTION]
    : ({ utility: UTILITY_SECTIONS, token: TOKEN_SECTIONS }[kind] ??
      REQUIRED_SECTIONS)
const STATUSES = ['met', 'unmet', 'unverified']

const list = (value) => (Array.isArray(value) ? value : [])
const statusOf = (guarantee) => guarantee.status ?? 'met'

/** Whether no guarantee of the page is still waiting for its first test. */
export const isVerified = (page) =>
  list(page.data.guarantees).every(
    (guarantee) => statusOf(guarantee) !== 'unverified',
  )

// ---------------------------------------------------------------------------
// Compiled CSS
// ---------------------------------------------------------------------------

/** The class names a selector list names, anywhere in it (`:is()` and `:not()` included). */
export function classesInSelector(selector) {
  const classes = new Set()
  selectorParser((selectors) => {
    selectors.walkClasses((node) => classes.add(node.value))
  }).processSync(selector)
  return classes
}

/**
 * Parses compiled CSS into the facts the checks use: every class that appears
 * in a rule's selector. Comments are not rules, so a class named only in a
 * comment is not found.
 */
export function readCss(css) {
  const classes = new Set()

  postcss.parse(css).walkRules((rule) => {
    for (const name of classesInSelector(rule.selector)) classes.add(name)
  })
  return { classes }
}

/**
 * The PathAble utility classes in compiled utilities CSS: classes that begin
 * `pathable-`, with an optional `<state>:` prefix, in a selector outside any
 * pseudo-class argument, so `.pathable-button` inside `:not(:where(...))` is a
 * component class and does not count.
 */
export function readUtilityClasses(css) {
  const utilities = new Set()
  postcss.parse(css).walkRules((rule) => {
    selectorParser((selectors) => {
      selectors.walkClasses((node) => {
        if (node.parent?.parent?.type === 'pseudo') return
        if (/^(?:[a-z-]+:)?pathable-/u.test(node.value)) {
          utilities.add(node.value)
        }
      })
    }).processSync(rule.selector)
  })
  return utilities
}

/**
 * The patterns the pages declare for PathAble utility classes: every entry of
 * a page's `classes` that contains `pathable-`. `<name>` matches `[a-z0-9-]+`.
 */
export function utilityPatterns(pages) {
  return pages
    .flatMap((page) => list(page.data?.classes))
    .filter((entry) => typeof entry === 'string' && entry.includes('pathable-'))
    .map(
      (entry) =>
        new RegExp(
          `^${entry
            .split(/<[^>]+>/u)
            .map((part) => part.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'))
            .join('[a-z0-9-]+')}$`,
          'u',
        ),
    )
}

/** The `pathable-` utility classes cited in `text`, as written. */
export const citedUtilityClasses = (text) =>
  new Set(
    [...text.matchAll(/(?<![\w:-])((?:[a-z-]+:)?pathable-[a-z0-9-]+)/gu)].map(
      (match) => match[1].replace(/-+$/u, ''),
    ),
  )

/**
 * The classes among `cited` that are PathAble utility classes (in `utilities`)
 * no pattern declares.
 */
export const undeclaredUtilityClasses = (cited, utilities, patterns) =>
  [...cited].filter(
    (name) =>
      utilities.has(name) && !patterns.some((pattern) => pattern.test(name)),
  )

export const undeclaredUtilityMessage = (name) =>
  `.${name} is a PathAble utility class no page declares: a page may cite only a \`pathable-\` utility that a page's \`classes\` front matter declares`

/** The modifiers (`class--modifier`) the CSS has for a class. */
export const modifiersOf = (css, className) =>
  [...css.classes]
    .filter((name) => name.startsWith(`${className}--`))
    .map((name) => name.slice(className.length + 2))

// ---------------------------------------------------------------------------
// Stage 1: the page against the compiled CSS
// ---------------------------------------------------------------------------

/**
 * The code blocks in `language`, as the Markdown parser reads them: a fence of
 * any length, as the generator writes one around code that holds backticks.
 */
const fencedBlocks = (body, language) => codeBlocks(body, language)

const flat = (text) => text.replace(/\s+/gu, ' ').trim()

/** The body of one `## Section`, up to the next heading of that level. */
const section = (body, heading) =>
  body.match(
    new RegExp(`^## ${heading}\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'mu'),
  )?.[1] ?? ''

/** The `uswds` link, the slug prefix and, for a utility page, `classes`. */
function checkUswdsFields(page, errors) {
  const { data, slug } = page
  const { prefix, slug: slugPrefix } = USWDS_KINDS[data.kind]
  if (!slug.startsWith(slugPrefix)) {
    errors.push(`a ${data.kind} page's slug must start with "${slugPrefix}"`)
  }
  if (data.uswds !== undefined) {
    if (typeof data.uswds !== 'string' || !data.uswds.startsWith(prefix)) {
      errors.push(
        `"uswds" must be a ${prefix}… URL for a ${data.kind} page; received "${data.uswds}"`,
      )
    } else if (!data.uswds.endsWith('/') || data.uswds === prefix) {
      errors.push(
        `"uswds" must name one page under ${prefix} and end with "/"; received "${data.uswds}"`,
      )
    }
  }
  if (data.kind === 'utility' && Array.isArray(data.classes)) {
    if (data.classes.length === 0) {
      errors.push('"classes" must list at least one class pattern')
    }
    for (const pattern of data.classes) {
      if (typeof pattern !== 'string' || pattern.trim() === '') {
        errors.push('each entry of "classes" must be a non-empty string')
      }
    }
  }
}

/** The slug and the `uswds` link of a settings page. */
function checkSettingsFields(page, errors) {
  const { data, slug } = page
  if (slug !== 'settings' && !slug.startsWith('settings-')) {
    errors.push(
      'a settings page\'s slug must be "settings" or start with "settings-"',
    )
  }
  if (data.uswds !== undefined) {
    if (
      typeof data.uswds !== 'string' ||
      !data.uswds.startsWith(SETTINGS_URL)
    ) {
      errors.push(
        `"uswds" must be a ${SETTINGS_URL}… URL for a settings page; received "${data.uswds}"`,
      )
    }
  }
}

function checkFrontMatter(page, errors) {
  const { data, slug } = page
  const fields = fieldsOf(data.kind)
  const optional = optionalFieldsOf(data.kind)
  for (const field of fields) {
    if (data[field] === undefined)
      errors.push(`missing front matter field "${field}"`)
  }
  for (const field of Object.keys(data)) {
    if (fields.includes(field) || optional.includes(field)) continue
    errors.push(
      isUswdsPage(page) && ['styles-class', 'variants'].includes(field)
        ? `a ${data.kind} page has no "${field}": it documents unprefixed USWDS names, not one component with modifiers`
        : isSettingsPage(page) &&
            ['styles-class', 'variants', 'classes', 'guarantees'].includes(
              field,
            )
          ? `a settings page has no "${field}": it is information only and states no consumer contract`
          : `unknown front matter field "${field}"`,
    )
  }
  if (data.slug !== undefined && data.slug !== slug) {
    errors.push(`slug "${data.slug}" does not match the file name "${slug}.md"`)
  }
  if (data.kind !== undefined && !KINDS.includes(data.kind)) {
    errors.push(
      `kind must be one of ${KINDS.join(', ')}; received "${data.kind}"`,
    )
  }
  for (const field of ['variants', 'classes', 'guarantees']) {
    if (
      fields.includes(field) &&
      data[field] !== undefined &&
      !Array.isArray(data[field])
    ) {
      errors.push(`"${field}" must be a list`)
    }
  }
  if (isUswdsPage(page)) checkUswdsFields(page, errors)
  if (isSettingsPage(page)) checkSettingsFields(page, errors)

  const ids = new Set()
  for (const guarantee of list(data.guarantees)) {
    const { id, claim, status, ...rest } = guarantee ?? {}
    if (!id || !claim) {
      errors.push('each guarantee needs "id" and "claim"')
      continue
    }
    if (Object.keys(rest).length > 0) {
      errors.push(
        `guarantee "${id}": only "id", "claim" and "status" belong on the page; tests cite the guarantee, not the other way round (found "${Object.keys(rest).join('", "')}")`,
      )
    }
    if (status !== undefined && !STATUSES.includes(status)) {
      errors.push(
        `guarantee "${id}": status must be ${STATUSES.join(' or ')}; received "${status}"`,
      )
    }
    if (ids.has(id)) errors.push(`duplicate guarantee id "${id}"`)
    ids.add(id)
  }
  if (Array.isArray(data.guarantees) && ids.size === 0) {
    errors.push('a page must state at least one guarantee')
  }
}

function checkBody(page, errors) {
  const { body, data } = page
  const headings = new Set(
    [...body.matchAll(/^#{1,6} (.+)$/gmu)].map((match) => match[1].trim()),
  )
  const title = `# ${data.name}\n`
  if (!body.trimStart().startsWith(title)) {
    errors.push(`the body must start with "# ${data.name}"`)
  } else {
    const opening = body.trimStart().slice(title.length).trimStart()
    if (!flat(opening.split(/\n\s*\n/u)[0]).startsWith(flat(data.summary))) {
      errors.push(
        'the paragraph under the title must start with the front matter summary',
      )
    }
  }
  const required = sectionsOf({ kind: data.kind, slug: page.slug })
  for (const heading of required) {
    if (!headings.has(heading)) errors.push(`missing section "## ${heading}"`)
  }
  if (isUswdsPage(page) || isSettingsPage(page)) {
    // The sections of a utility, token or settings page come in a fixed order,
    // so every page reads the same way. (A static page's order is not checked.)
    const found = [
      ...body.replace(/^```[\s\S]*?^```$/gmu, '').matchAll(/^## (.+)$/gmu),
    ]
      .map((match) => match[1].trim())
      .filter((heading) => required.includes(heading))
    const expected = required.filter((heading) => found.includes(heading))
    if (found.join('|') !== expected.join('|')) {
      errors.push(
        `the sections must come in this order: ${required.map((heading) => `"${heading}"`).join(', ')}`,
      )
    }
  }
  if (isSettingsPage(page)) {
    // The reader must learn that the settings are not API before anything else.
    const first = body
      .replace(/^```[\s\S]*?^```$/gmu, '')
      .match(/^## (.+)$/mu)?.[1]
      .trim()
    if (first !== SETTINGS_SECTIONS[0]) {
      errors.push(
        `the first section must be "## ${SETTINGS_SECTIONS[0]}", so a reader learns first that the settings are information only; found "${first ?? 'none'}"`,
      )
    }
  }
  if (/\busa-/u.test(page.markdown)) {
    errors.push('consumer-facing pages must not mention usa-* classes')
  }
}

function checkVariants(page, css, errors) {
  const { data } = page
  const cls = data['styles-class']
  const expected = new Map()

  for (const variant of list(data.variants)) {
    const { axis, values } = variant ?? {}
    if (!axis || !Array.isArray(values) || variant.default === undefined) {
      errors.push('each variant needs "axis", "default" and a "values" list')
      continue
    }
    if (!values.includes(variant.default)) {
      errors.push(
        `variant "${axis}": default "${variant.default}" is not one of its values`,
      )
    }
    for (const value of values) {
      const modifier = `${cls}--${value}`
      const label = `variant "${axis}=${value}"`
      const isDefault = value === variant.default
      expected.set(
        `${axis} | \`${value}\``,
        isDefault ? 'none' : `\`${modifier}\``,
      )
      if (isDefault && css.classes.has(modifier)) {
        errors.push(
          `${label}: the default has a .${modifier} rule, so it is not the default`,
        )
      }
      if (!isDefault && !css.classes.has(modifier)) {
        errors.push(`${label}: no .${modifier} rule in the compiled CSS`)
      }
    }
  }

  const listed = new Set(
    list(data.variants).flatMap((variant) => variant?.values ?? []),
  )
  for (const modifier of modifiersOf(css, cls)) {
    if (!listed.has(modifier)) {
      errors.push(
        `the compiled CSS has .${cls}--${modifier}, which is not a variant on the page`,
      )
    }
  }

  // The Variants table repeats the front matter, so it must agree with it.
  const rows = new Map(
    [...section(page.body, 'Variants').matchAll(/^\|(.+)\|$/gmu)]
      .map((match) => match[1].split('|').map((cell) => cell.trim()))
      .filter(([axis]) => axis !== 'Axis' && !/^-+$/u.test(axis))
      .map(([axis, value, className]) => [`${axis} | ${value}`, className]),
  )
  for (const [row, className] of expected) {
    if (!rows.has(row)) {
      errors.push(`the Variants table has no row for ${row}`)
    } else if (rows.get(row) !== className) {
      errors.push(
        `the Variants table gives ${rows.get(row)} for ${row}; the front matter means ${className}`,
      )
    }
  }
  for (const row of rows.keys()) {
    if (!expected.has(row)) {
      errors.push(
        `the Variants table has a row for ${row}, which is not in the front matter`,
      )
    }
  }
}

/**
 * The `<!-- example: … -->` placeholders the styles page shows, read by the
 * generator's own parser, so a placeholder in a code block does not count.
 */
const examplePlaceholders = (markdown) =>
  exampleSegments(segment(markdown), 'styles').filter(
    (item) => item.type === 'example',
  ).length

function checkNames(page, css, errors) {
  // A page has one minimal example: a literal html block, or a placeholder
  // that the build replaces with a fixture. `<!-- examples -->` lists the
  // states and is not the minimal example.
  // Count literal blocks only where the styles page shows them, so an HTML
  // snippet in a React-only block does not count.
  const source = page.source ?? page.markdown
  const examples =
    fencedBlocks(
      visibleMarkdown(segment(parsePage(source).body), 'styles'),
      'html',
    ).length + examplePlaceholders(source)
  if (examples !== 1)
    errors.push(
      `expected one html example (a literal html block or an "<!-- example: … -->" placeholder); found ${examples}`,
    )

  for (const markup of fencedBlocks(page.body, 'html')) {
    for (const [, classes] of markup.matchAll(/class="([^"]*)"/gu)) {
      for (const className of classes.split(/\s+/u).filter(Boolean)) {
        if (!css.classes.has(className)) {
          errors.push(
            `the html example uses .${className}, which the compiled CSS does not define`,
          )
        }
      }
    }
  }

  const prose = page.body.replace(/^```[\s\S]*?^```$/gmu, '')
  const named = (pattern) =>
    new Set([...prose.matchAll(pattern)].map((match) => match[1]))
  for (const className of named(/`(pathable-[a-z0-9-]+)`/gu)) {
    if (!css.classes.has(className)) {
      errors.push(
        `the page names \`${className}\`, which the compiled CSS does not define`,
      )
    }
  }
  for (const token of named(/`(--[a-z0-9-]+)`/gu)) {
    errors.push(
      `the page names \`${token}\`, but a page names no custom property: none is public`,
    )
  }
  // Claims ship in the packed page too. A custom property is `--x` not
  // preceded by a word character, so a BEM modifier does not match.
  for (const guarantee of list(page.data.guarantees)) {
    const claim = typeof guarantee?.claim === 'string' ? guarantee.claim : ''
    const tokens = new Set(
      [...claim.matchAll(/(?<!\w)(--[a-z0-9-]+)/gu)].map((match) => match[1]),
    )
    for (const token of tokens) {
      errors.push(
        `guarantee "${guarantee.id}" names \`${token}\`, but a page names no custom property: none is public`,
      )
    }
  }
}

/** Reports each undeclared PathAble utility class the body or a claim cites. */
function checkUtilityCitations(page, facts, errors) {
  if (!facts.utilities) return
  const text = [
    page.body,
    ...list(page.data.guarantees).map((guarantee) => guarantee?.claim ?? ''),
  ].join('\n')
  for (const name of undeclaredUtilityClasses(
    citedUtilityClasses(text),
    facts.utilities,
    facts.utilityPatterns ?? [],
  )) {
    errors.push(undeclaredUtilityMessage(name))
  }
}

/**
 * A settings page shows no example: no html block, no example placeholder and
 * no package block, and it names no custom property (the settings are Sass
 * and are not part of any consumer contract).
 */
function checkSettingsBody(page, errors) {
  const source = page.source ?? page.markdown
  if (fencedBlocks(page.body, 'html').length > 0) {
    errors.push('a settings page has no example: remove the html block')
  }
  if (findPlaceholders(source).placeholders.length > 0) {
    errors.push(
      'a settings page has no fixture or example: remove the "<!-- example -->", "<!-- examples -->" or "<!-- package -->" placeholder',
    )
  }
  const prose = page.body.replace(/^```[\s\S]*?^```$/gmu, '')
  for (const [, token] of prose.matchAll(/`(--[a-z0-9-]+)`/gu)) {
    errors.push(
      `the page names \`${token}\`, but a settings page documents Sass settings only, not custom properties`,
    )
  }
}

/** A utility or token page shows every fixture of its folder under `## States`. */
function checkStates(page, errors) {
  const states = section(page.source ?? page.markdown, 'States')
  if (!/^<!--\s*examples\s*-->$/mu.test(states)) {
    errors.push('the "## States" section must hold "<!-- examples -->"')
  }
}

/**
 * Renders a source page as the styles package ships it and checks its
 * placeholders. Returns { page, errors }: `page` is the rendered page, ready
 * for checkPage (with the source kept as `page.source`), or undefined when
 * the placeholders do not resolve.
 */
export function renderForCheck(page, sources) {
  const errors = []
  let markdown
  try {
    markdown = render(page, 'styles', sources)
    if (sources.examples) render(page, 'react', sources)
    // The Storybook page turns each state into a story export name. A settings
    // page has no fixtures but still renders to the Storybook.
    if (sources.fixtures.size > 0 || page.data?.kind === 'settings') {
      render(page, 'storybook', sources)
    }
  } catch (error) {
    if (!(error instanceof ComponentDocsError)) throw error
    return { errors: error.problems }
  }
  const converted = markdown !== page.markdown
  // A page the React fixture manifest lists but that has no placeholders
  // fails the React render above.
  if (converted) {
    // Coverage is by state name, so two states that share markup are each
    // checked for their own placeholder.
    const shown = shownStates(page, 'styles', sources)
    for (const state of sources.fixtures.keys()) {
      if (!shown.has(state)) {
        errors.push(
          `fixtures/${page.slug}/${state}.html is not shown: add "<!-- examples -->" (or "<!-- example: ${state} -->")`,
        )
      }
    }
  }
  return {
    page: { ...page, ...parsePage(markdown), markdown, source: page.markdown },
    errors,
  }
}

/** Every stage 1 disagreement between one page and the package, as messages. */
export function checkPage(page, facts) {
  const errors = []
  checkFrontMatter(page, errors)
  if (errors.length) return errors

  if (isSettingsPage(page)) {
    // Nothing on a settings page is checked against the CSS: it is not API.
    checkBody(page, errors)
    checkSettingsBody(page, errors)
    return errors
  }

  const cls = page.data['styles-class']
  if (!isUswdsPage(page) && !facts.css.classes.has(cls)) {
    errors.push(`styles-class "${cls}" has no rule in the compiled CSS`)
  }
  checkBody(page, errors)
  if (isUswdsPage(page)) checkStates(page, errors)
  else checkVariants(page, facts.css, errors)
  checkNames(page, facts.css, errors)
  checkUtilityCitations(page, facts, errors)

  return errors
}

/** Looks a cited id up; returns the guarantee, or a message saying what is wrong. */
function resolveId(pages, id) {
  const [slug, guaranteeId, ...extra] = String(id).split('/')
  if (!slug || !guaranteeId || extra.length > 0) {
    return { error: 'which is not "<page>/<guarantee-id>"' }
  }
  const page = pages.find((candidate) => candidate.slug === slug)
  if (!page) return { error: `but there is no component page "${slug}.md"` }
  const guarantee = list(page.data.guarantees).find(
    (candidate) => candidate?.id === guaranteeId,
  )
  if (!guarantee) {
    return { error: `but ${slug}.md has no guarantee "${guaranteeId}"` }
  }
  return { guarantee }
}

// ---------------------------------------------------------------------------
// Stage 2: the pages against what the Storybook test run executed
// ---------------------------------------------------------------------------

/** Every stage 2 disagreement, as messages. `records` is one entry per story. */
export function checkExecuted(pages, records) {
  const errors = []
  const executed = records.flatMap((record) =>
    list(record.guarantees).map((entry) => ({ ...entry, story: record.story })),
  )

  for (const { id, mode, story } of executed) {
    const where = `story ${story} executed "${id}"`
    const { guarantee, error } = resolveId(pages, id)
    if (error) {
      errors.push(`${where}, ${error}`)
    } else if (statusOf(guarantee) === 'unmet' && mode === 'met') {
      errors.push(
        `${where} with guarantee(), but the page marks it unmet: use guarantee.unmet(), or set its status to met`,
      )
    } else if (statusOf(guarantee) === 'unverified') {
      errors.push(
        `${where}, which the page marks unverified: a test now cites it, so set its status to ${mode === 'unmet' ? 'unmet' : 'met'}`,
      )
    } else if (statusOf(guarantee) === 'met' && mode === 'unmet') {
      errors.push(
        `${where} with guarantee.unmet(), but the page does not mark it unmet`,
      )
    }
  }

  for (const page of pages) {
    for (const guarantee of list(page.data.guarantees)) {
      const id = `${page.slug}/${guarantee.id}`
      const ran = executed.some((entry) => entry.id === id)
      if (statusOf(guarantee) === 'met' && !ran) {
        errors.push(
          `${page.file}: guarantee "${guarantee.id}" is met but no test covers it: no play function executed guarantee(step, '${id}', …). Mark it "status: unverified" if it holds but no test exists yet, or "status: unmet" if the component does not do this yet`,
        )
      }
    }
  }
  return errors
}

// ---------------------------------------------------------------------------
// Trace
// ---------------------------------------------------------------------------

/** The traceability table: page → guarantee → the tests that cite it. */
export function renderTrace(pages, records) {
  const lines = []
  for (const page of pages) {
    lines.push(`${page.data.name} (${page.file})`)
    for (const guarantee of list(page.data.guarantees)) {
      const id = `${page.slug}/${guarantee.id}`
      const unmet = statusOf(guarantee) === 'unmet'
      const label = { unmet: '[UNMET] ', unverified: '[UNVERIFIED] ', met: '' }[
        statusOf(guarantee)
      ]
      lines.push(`  ${label}${guarantee.id}: ${guarantee.claim}`)
      const cited = [
        ...(records ?? [])
          .filter((record) =>
            list(record.guarantees).some((entry) => entry.id === id),
          )
          .map(
            (record) =>
              `play   ${record.story}${unmet ? ' (expected to fail)' : ''}`,
          ),
      ]
      for (const line of cited) lines.push(`    ${line}`)
      if (cited.length === 0) {
        lines.push(
          records
            ? `    (no test${unmet ? ' yet' : ''})`
            : '    (play functions not read without --executed)',
        )
      }
    }
  }
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Facts: what the repository contains
// ---------------------------------------------------------------------------

/**
 * The denominator for coverage: wrapper files named after a class the
 * compiled CSS defines (`pathable-card.scss` and `.pathable-card`). That
 * leaves out partials and the bundle files that only forward other wrappers.
 */
export const wrapperComponents = (fileNames, css) =>
  fileNames
    .map((file) => basename(file, '.scss'))
    .filter((name) => css.classes.has(name))

async function readUtilityCss() {
  if (!existsSync(utilitiesCss)) {
    throw new Error(
      `${relative(repoRoot, utilitiesCss)} is missing; run pnpm --filter @pathableai/styles build first`,
    )
  }
  return readUtilityClasses(await readFile(utilitiesCss, 'utf8'))
}

async function readCompiledCss() {
  if (!existsSync(compiledCss)) {
    throw new Error(
      `${relative(repoRoot, compiledCss)} is missing; run pnpm --filter @pathableai/styles build first`,
    )
  }
  return readCss(await readFile(compiledCss, 'utf8'))
}

/**
 * Keeps the records that describe the built Storybook. The test-runner only
 * overwrites the record of a story it runs, so the directory can hold records
 * left by an earlier run: of a story since deleted or renamed, or written
 * before the Storybook was last built (for example when only a filtered run
 * followed the build). A record of a story the build no longer has is dropped.
 * A record older than the build is an error, because it may claim coverage
 * the current code does not have.
 */
export function currentRecords(records, build) {
  const errors = []
  const current = []
  for (const { record, writtenAt } of records) {
    if (!build.storyIds.has(record.story)) continue
    if (writtenAt < build.builtAt) {
      errors.push(
        `the record of story ${record.story} is older than the Storybook build: delete ${relative(repoRoot, executedDir)} and run pnpm test:storybook-styles again`,
      )
      continue
    }
    current.push(record)
  }
  return { records: current, errors }
}

function readRecords() {
  if (!existsSync(executedDir)) {
    throw new Error(
      `${relative(repoRoot, executedDir)} is missing; run pnpm test:storybook-styles first`,
    )
  }
  if (!existsSync(storybookIndex)) {
    throw new Error(
      `${relative(repoRoot, storybookIndex)} is missing; run pnpm build:docs first`,
    )
  }
  const index = JSON.parse(readFileSync(storybookIndex, 'utf8'))
  return currentRecords(
    readdirSync(executedDir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => {
        const path = join(executedDir, file)
        return {
          record: JSON.parse(readFileSync(path, 'utf8')),
          writtenAt: statSync(path).mtimeMs,
        }
      }),
    {
      storyIds: new Set(Object.keys(index.entries)),
      builtAt: statSync(storybookIndex).mtimeMs,
    },
  )
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main() {
  const flags = new Set(process.argv.slice(2))
  // `--page=<slug>` checks one page at stage 1, for work on a single page.
  const only = process.argv
    .slice(2)
    .find((flag) => flag.startsWith('--page='))
    ?.slice('--page='.length)
  const allPages = await readPages()
  const pages = only ? allPages.filter((page) => page.slug === only) : allPages
  if (only && pages.length === 0) {
    throw new Error(`no component page "${only}.md"`)
  }
  const errors = []
  let records
  let summary

  if (flags.has('--executed')) {
    const read = readRecords()
    records = read.records
    errors.push(...read.errors, ...checkExecuted(pages, records))
    summary = `stage 2 (what ran): ${pages.length} page(s) checked against ${records.length} story records`
  } else {
    const css = await readCompiledCss()
    const utilities = await readUtilityCss()
    const patterns = utilityPatterns(allPages)
    const coverage = await readCoverage()
    for (const page of pages) {
      const rendered = await pageSources(page, coverage).then(
        (sources) => renderForCheck(page, sources),
        (error) => {
          if (!(error instanceof ComponentDocsError)) throw error
          return { errors: error.problems }
        },
      )
      errors.push(
        ...[
          ...rendered.errors,
          ...(rendered.page
            ? checkPage(rendered.page, {
                css,
                utilities,
                utilityPatterns: patterns,
              })
            : []),
        ].map((error) => `${page.file}: ${error}`),
      )
    }
    const components = wrapperComponents(
      readdirSync(join(packageRoot, 'src/pathable-component-wrappers')),
      css,
    )
    const withPage = new Set(pages.map((page) => page.data['styles-class']))
    const covered = components.filter((name) => withPage.has(name)).length
    const verified = pages.filter(
      (page) => !isSettingsPage(page) && isVerified(page),
    ).length
    summary = `stage 1 (page against compiled CSS): ${pages.length} page(s) checked, ${verified} with every guarantee under test; ${covered} of ${components.length} component wrapper stylesheets have a page`
  }

  for (const error of errors) console.error(`[component-pages] ${error}`)
  if (flags.has('--trace')) console.log(renderTrace(pages, records))
  console.log(`[component-pages] ${summary}`)
  if (errors.length > 0) process.exitCode = 1
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error(`[component-pages] ${error.message}`)
    process.exitCode = 1
  })
}
