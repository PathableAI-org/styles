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
 * tested. Tests cite guarantees, as `<page>/<guarantee-id>`:
 *   - a story play function, with `guarantee(step, id, …)` or, for an unmet
 *     guarantee, `guarantee.unmet(step, id, …)` (src/stories/shared/guarantee.ts);
 *   - a pixel baseline entry, with `covers: [id]` (scripts/pixel-stories.mjs).
 *
 * There are two stages, because they need different inputs.
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
 *     modifier the CSS has for the class is a variant on the page;
 *   - the body's summary paragraph and Variants table agree with the front
 *     matter, and every token the page names is used by the component's rules;
 *   - every pixel citation names a met guarantee that exists, belongs to an
 *     entry on the rollout list (so the suite compares it) and has its images
 *     committed; a static component has at least one.
 * It does not look at play functions.
 *
 * Stage 2, `… check:component-pages:executed`, needs the records the Storybook
 * test-runner writes during `pnpm test:storybook-styles`
 * (apps/storybook/test-results/component-pages/). It proves:
 *   - every guarantee id a play function executed exists, with the right
 *     form: `guarantee()` for met, `guarantee.unmet()` for unmet;
 *   - every met guarantee was executed by a play function or is covered by a
 *     pixel citation; an unmet guarantee may have no test yet;
 *   - a story whose pixel baseline covers a static page rendered the class
 *     and every non-default variant modifier.
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

import { render } from '../../../scripts/component-docs/render.mjs'
import { ComponentDocsError } from '../../../scripts/component-docs/segments.mjs'
import { readCoverage } from '../../../scripts/component-docs/sources.mjs'
import { pageSources } from '../../../scripts/component-docs/write.mjs'

import { parsePage, readPages } from './component-pages.mjs'

const packageRoot = resolve(import.meta.dirname, '..')
const repoRoot = resolve(packageRoot, '../..')
const compiledCss = join(packageRoot, 'dist/styles.css')
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

/** Only static components have pages for now. */
const KINDS = ['static']
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
 * in a rule's selector, and for each class the custom properties the rules
 * that mention it declare or read through `var()`. Comments are not rules, so
 * a class named only in a comment is not found.
 */
export function readCss(css) {
  const classes = new Set()
  const tokens = new Map()

  postcss.parse(css).walkRules((rule) => {
    const inRule = classesInSelector(rule.selector)

    const used = new Set()
    rule.walkDecls((declaration) => {
      if (declaration.prop.startsWith('--')) used.add(declaration.prop)
      for (const [, name] of declaration.value.matchAll(/var\(\s*(--[\w-]+)/gu))
        used.add(name)
    })
    for (const name of inRule) {
      classes.add(name)
      if (!tokens.has(name)) tokens.set(name, new Set())
      for (const token of used) tokens.get(name).add(token)
    }
  })
  return { classes, tokens }
}

/** The modifiers (`class--modifier`) the CSS has for a class. */
export const modifiersOf = (css, className) =>
  [...css.classes]
    .filter((name) => name.startsWith(`${className}--`))
    .map((name) => name.slice(className.length + 2))

/** The custom properties the rules of a class and its modifiers use. */
const tokensOf = (css, className) =>
  new Set(
    [...css.tokens]
      .filter(
        ([name]) =>
          name === className ||
          name.startsWith(`${className}--`) ||
          name.startsWith(`${className}__`),
      )
      .flatMap(([, used]) => [...used]),
  )

// ---------------------------------------------------------------------------
// Stage 1: the page against the compiled CSS and the pixel entries
// ---------------------------------------------------------------------------

const fencedBlocks = (body, language) =>
  [
    ...body.matchAll(
      new RegExp(`^\`\`\`${language}\\n([\\s\\S]*?)^\`\`\`$`, 'gmu'),
    ),
  ].map((match) => match[1])

const flat = (text) => text.replace(/\s+/gu, ' ').trim()

/** The body of one `## Section`, up to the next heading of that level. */
const section = (body, heading) =>
  body.match(
    new RegExp(`^## ${heading}\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'mu'),
  )?.[1] ?? ''

function checkFrontMatter(page, errors) {
  const { data, slug } = page
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined)
      errors.push(`missing front matter field "${field}"`)
  }
  for (const field of Object.keys(data)) {
    if (!REQUIRED_FIELDS.includes(field)) {
      errors.push(`unknown front matter field "${field}"`)
    }
  }
  if (data.slug !== undefined && data.slug !== slug) {
    errors.push(`slug "${data.slug}" does not match the file name "${slug}.md"`)
  }
  if (data.kind !== undefined && !KINDS.includes(data.kind)) {
    errors.push(
      `kind must be one of ${KINDS.join(', ')}; received "${data.kind}"`,
    )
  }
  for (const field of ['variants', 'guarantees']) {
    if (data[field] !== undefined && !Array.isArray(data[field])) {
      errors.push(`"${field}" must be a list`)
    }
  }

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
  for (const heading of REQUIRED_SECTIONS) {
    if (!headings.has(heading)) errors.push(`missing section "## ${heading}"`)
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

/** Example placeholders (`<!-- example: … -->`) in a source page. */
const examplePlaceholders = (markdown) =>
  [
    ...markdown
      .replace(/^```[\s\S]*?^```$/gmu, '')
      .matchAll(/^<!--\s*example:/gmu),
  ].length

function checkNames(page, css, errors) {
  // A page has one minimal example: a literal html block, or a placeholder
  // that the build replaces with a fixture. `<!-- examples -->` lists the
  // states and is not the minimal example.
  const source = page.source ?? page.markdown
  const examples =
    fencedBlocks(parsePage(source).body, 'html').length +
    examplePlaceholders(source)
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
  const used = tokensOf(css, page.data['styles-class'])
  for (const token of named(/`(--[a-z0-9-]+)`/gu)) {
    if (!used.has(token)) {
      errors.push(
        `the page names \`${token}\`, which the component's rules do not use`,
      )
    }
  }
}

/** A pixel citation of this page's guarantee `id` that the suite enforces. */
const pixelCitations = (page, id, pixels) =>
  pixels.filter(
    (entry) =>
      list(entry.covers).includes(`${page.slug}/${id}`) &&
      entry.enforced &&
      entry.missing.length === 0,
  )

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
  } catch (error) {
    if (!(error instanceof ComponentDocsError)) throw error
    return { errors: error.problems }
  }
  const converted = markdown !== page.markdown
  if (sources.component && !converted) {
    errors.push(
      `the React package covers this component (${sources.component}), so the page must take its examples from the fixtures through placeholders`,
    )
  }
  if (converted) {
    const shown = new Set(fencedBlocks(parsePage(markdown).body, 'html'))
    for (const [state, fixture] of sources.fixtures) {
      if (!shown.has(`${fixture.html.replace(/\n+$/u, '')}\n`)) {
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

  const cls = page.data['styles-class']
  if (!facts.css.classes.has(cls)) {
    errors.push(`styles-class "${cls}" has no rule in the compiled CSS`)
  }
  checkBody(page, errors)
  checkVariants(page, facts.css, errors)
  checkNames(page, facts.css, errors)

  const covered = page.data.guarantees.some(
    ({ id }) => pixelCitations(page, id, facts.pixels).length > 0,
  )
  // A page with an unverified guarantee is still being brought under test; it
  // owes its baseline once every guarantee is met or unmet.
  if (page.data.kind === 'static' && !covered && isVerified(page)) {
    errors.push(
      'a static component needs a pixel baseline: no enforced pixel entry covers a guarantee of this page. While tests are still being written, mark the guarantees no test cites "status: unverified"',
    )
  }
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

/** Every pixel citation that points at nothing or is never compared. */
export function checkPixelCitations(pages, pixels) {
  const errors = []
  for (const entry of pixels) {
    for (const id of list(entry.covers)) {
      const where = `pixel entry ${entry.key} cites "${id}"`
      const { guarantee, error } = resolveId(pages, id)
      if (error) {
        errors.push(`${where}, ${error}`)
        continue
      }
      if (statusOf(guarantee) === 'unmet') {
        errors.push(
          `${where}, which is unmet: a baseline cannot be expected to fail; cite it with guarantee.unmet() in a play function`,
        )
      }
      if (statusOf(guarantee) === 'unverified') {
        errors.push(
          `${where}, which the page marks unverified: a test now cites it, so set its status to met`,
        )
      }
      if (!entry.enforced) {
        errors.push(
          `${where}, but "${entry.key.split('/')[0]}" is not on ROLLOUT, so the suite never compares this baseline`,
        )
      }
      for (const image of entry.missing) {
        errors.push(`${where}, but the baseline ${image} is not committed`)
      }
    }
  }
  return errors
}

// ---------------------------------------------------------------------------
// Stage 2: the pages against what the Storybook test run executed
// ---------------------------------------------------------------------------

/** Every stage 2 disagreement, as messages. `records` is one entry per story. */
export function checkExecuted(pages, records, pixels) {
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
    const cls = page.data['styles-class']
    for (const guarantee of list(page.data.guarantees)) {
      const id = `${page.slug}/${guarantee.id}`
      const ran = executed.some((entry) => entry.id === id)
      const pictured = pixelCitations(page, guarantee.id, pixels).length > 0
      if (statusOf(guarantee) === 'met' && !ran && !pictured) {
        errors.push(
          `${page.file}: guarantee "${guarantee.id}" is met but no test covers it: no play function executed guarantee(step, '${id}', …) and no enforced pixel entry lists it in covers. Mark it "status: unverified" if it holds but no test exists yet, or "status: unmet" if the component does not do this yet`,
        )
      }
    }

    // A static page's picture has to show every variant it describes.
    const covering = new Set(
      list(page.data.guarantees).flatMap(({ id }) =>
        pixelCitations(page, id, pixels).map((entry) => entry.id),
      ),
    )
    if (covering.size === 0) continue
    const rendered = new Set(
      records
        .filter((record) => covering.has(record.story))
        .flatMap((record) => list(record.classes)),
    )
    const missingRecords = [...covering].filter(
      (story) => !records.some((record) => record.story === story),
    )
    for (const story of missingRecords) {
      errors.push(
        `${page.file}: no record of story ${story}, whose pixel baseline covers this page; run pnpm test:storybook-styles`,
      )
    }
    if (missingRecords.length > 0) continue
    const expected = [
      cls,
      ...list(page.data.variants).flatMap((variant) =>
        list(variant?.values)
          .filter((value) => value !== variant.default)
          .map((value) => `${cls}--${value}`),
      ),
    ]
    for (const className of expected) {
      if (!rendered.has(className)) {
        errors.push(
          `${page.file}: no story whose pixel baseline covers this page rendered .${className} (${[...covering].join(', ')})`,
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
export function renderTrace(pages, pixels, records) {
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
        ...pixelCitations(page, guarantee.id, pixels).map(
          (entry) => `pixel  baseline ${entry.key} of ${entry.id}`,
        ),
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
            : '    (no pixel citation; play functions not read without --executed)',
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
 * The pixel entries with what the checks need to know about each: whether the
 * suite compares it (its component is on the rollout list) and which of its
 * baseline images, one per viewport of the story's mode, are not committed.
 */
export function readPixels({ stories, rollout, viewportsOf, hasImage }) {
  return stories.map((entry) => ({
    ...entry,
    enforced: rollout.includes(entry.key.split('/')[0]),
    missing: viewportsOf(entry.id)
      .map((viewport) => `${entry.key}/${viewport}.png`)
      .filter((image) => !hasImage(image)),
  }))
}

/**
 * The denominator for coverage: wrapper files named after a class the
 * compiled CSS defines (`pathable-card.scss` and `.pathable-card`). That
 * leaves out partials and the bundle files that only forward other wrappers.
 */
export const wrapperComponents = (fileNames, css) =>
  fileNames
    .map((file) => basename(file, '.scss'))
    .filter((name) => css.classes.has(name))

async function readPixelEntries() {
  const { ROLLOUT, STORIES } = await import('./pixel-stories.mjs')
  const { CANONICAL_STORIES, visualViewportNames } =
    await import('./quality-gates.mjs')
  const modes = new Map(
    CANONICAL_STORIES.map((story) => [story.id, story.mode]),
  )
  return readPixels({
    stories: STORIES,
    rollout: ROLLOUT,
    viewportsOf: (id) => visualViewportNames(modes.get(id)),
    hasImage: (image) =>
      existsSync(join(repoRoot, 'visual-baselines/styles', image)),
  })
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
  const pixels = await readPixelEntries()
  const errors = []
  let records
  let summary

  if (flags.has('--executed')) {
    const read = readRecords()
    records = read.records
    errors.push(...read.errors, ...checkExecuted(pages, records, pixels))
    summary = `stage 2 (what ran): ${pages.length} page(s) checked against ${records.length} story records`
  } else {
    const css = await readCompiledCss()
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
          ...(rendered.page ? checkPage(rendered.page, { css, pixels }) : []),
        ].map((error) => `${page.file}: ${error}`),
      )
    }
    if (!only) errors.push(...checkPixelCitations(pages, pixels))
    const components = wrapperComponents(
      readdirSync(join(packageRoot, 'src/pathable-component-wrappers')),
      css,
    )
    const withPage = new Set(pages.map((page) => page.data['styles-class']))
    const covered = components.filter((name) => withPage.has(name)).length
    const verified = pages.filter(isVerified).length
    summary = `stage 1 (page against compiled CSS and pixel entries): ${pages.length} page(s) checked, ${verified} with every guarantee under test; ${covered} of ${components.length} component wrapper stylesheets have a page`
  }

  for (const error of errors) console.error(`[component-pages] ${error}`)
  if (flags.has('--trace')) console.log(renderTrace(pages, pixels, records))
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
