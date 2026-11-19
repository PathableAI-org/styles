/**
 * Ties each component page to the styles code it describes. It does not
 * generate the page: the page is written by hand and is the specification;
 * this check fails when the page and the code disagree. It reads source files
 * only, so it needs no build.
 *
 * A page states guarantees; it does not say how they are tested. The tests
 * cite the guarantees they cover, as `<page>/<guarantee-id>`:
 *   - a story's play function, with `guarantee(step, '<id>', …)` from
 *     packages/styles/src/stories/shared/guarantee.ts;
 *   - a pixel baseline entry, with `covers: ['<id>']` in
 *     packages/styles/scripts/pixel-stories.mjs.
 * The check fails when a guarantee is cited by no test, and when a test cites
 * a page or guarantee that does not exist. A guarantee added to a page
 * therefore fails until a test cites it.
 *
 * For every component that has a page under packages/styles/components/:
 *   - the front matter has the required fields and the body the required
 *     sections, and the page does not mention the underlying framework classes;
 *   - the styles class has a rule in the SCSS;
 *   - every variant value that is not a default has a modifier rule, the page
 *     names that modifier class, and a story whose pixel baseline covers the
 *     page renders it;
 *   - every modifier the SCSS defines for the class is a variant on the page;
 *   - every state names a story that exists;
 *   - the markup example, and every class the body names in a code span, uses
 *     only classes the SCSS defines;
 *   - every guarantee is cited by a test, and a static component by at least
 *     one pixel baseline;
 *   - the derived index is current.
 *
 * Components without a page are counted, not failed: pages are opt-in while
 * the format is trialled.
 *
 *   pnpm check:component-pages   check, then run this script's tests
 *   pnpm trace:component-pages   check, and print which test cites each guarantee
 */

import { existsSync, readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import ts from 'typescript'

import {
  indexFile,
  pagesDir,
  readPages,
  renderIndex,
} from './component-pages.mjs'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export const REQUIRED_FIELDS = [
  'name',
  'slug',
  'kind',
  'summary',
  'styles-class',
  'variants',
  'states',
  'guarantees',
]

export const REQUIRED_SECTIONS = [
  'When to use',
  'Example',
  'Variants',
  'States',
  'Composition',
  'Guarantees',
  'The consumer owns',
  'Known defects',
]

const KINDS = ['static', 'behavioural']

/** The helper story play functions cite a guarantee with. */
const HELPER = 'guarantee'

// ---------------------------------------------------------------------------
// Pure checks: pages against facts gathered from the repository
// ---------------------------------------------------------------------------

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')

/** The modifiers (`.class--modifier`) stylesheet source defines for a class. */
export const modifiersOf = (scss, className) => [
  ...new Set(
    [
      ...scss.matchAll(
        new RegExp(`\\.${escapeRegExp(className)}--([a-z0-9-]+)`, 'gu'),
      ),
    ].map((match) => match[1]),
  ),
]

/** Whether stylesheet source defines a rule for the class. */
export const hasClass = (scss, className) =>
  new RegExp(`\\.${escapeRegExp(className)}(?![\\w-])`, 'u').test(scss)

const fencedBlocks = (body, language) =>
  [
    ...body.matchAll(
      new RegExp(`^\`\`\`${language}\\n([\\s\\S]*?)^\`\`\`$`, 'gmu'),
    ),
  ].map((match) => match[1])

const list = (value) => (Array.isArray(value) ? value : [])

/** The citations of one page: those whose id starts with its slug. */
const citing = (page, citations) =>
  citations.filter((citation) => citation.id.split('/')[0] === page.slug)

function checkFrontMatter(page, errors) {
  const { data, slug } = page
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined)
      errors.push(`missing front matter field "${field}"`)
  }
  if (data.slug !== undefined && data.slug !== slug) {
    errors.push(`slug "${data.slug}" does not match the file name "${slug}.md"`)
  }
  if (data.kind !== undefined && !KINDS.includes(data.kind)) {
    errors.push(
      `kind must be one of ${KINDS.join(', ')}; received "${data.kind}"`,
    )
  }
  for (const field of ['variants', 'states', 'guarantees']) {
    if (data[field] !== undefined && !Array.isArray(data[field])) {
      errors.push(`"${field}" must be a list`)
    }
  }
  if (Array.isArray(data.guarantees) && data.guarantees.length === 0) {
    errors.push('a page must state at least one guarantee')
  }
}

function checkBody(page, errors) {
  const headings = new Set(
    [...page.body.matchAll(/^#{1,6} (.+)$/gmu)].map((match) => match[1].trim()),
  )
  if (!page.body.trimStart().startsWith(`# ${page.data.name}\n`)) {
    errors.push(`the body must start with "# ${page.data.name}"`)
  }
  for (const section of REQUIRED_SECTIONS) {
    if (!headings.has(section)) errors.push(`missing section "## ${section}"`)
  }
  if (/\busa-/u.test(page.markdown)) {
    errors.push('consumer-facing pages must not mention usa-* classes')
  }
}

function checkVariants(page, facts, errors) {
  const { data } = page
  const cls = data['styles-class']
  const rendered = citing(page, facts.citations)
    .filter((citation) => citation.kind === 'pixel')
    .map((citation) => facts.stories.get(citation.story) ?? '')
  const listed = new Set()

  for (const variant of list(data.variants)) {
    const { axis, values } = variant
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
      listed.add(value)
      if (value === variant.default) {
        if (hasClass(facts.scss, modifier)) {
          errors.push(
            `${label}: the default has a .${modifier} rule, so it is not the default`,
          )
        }
        continue
      }
      if (!hasClass(facts.scss, modifier)) {
        errors.push(`${label}: no .${modifier} rule in the styles source`)
      }
      if (!page.body.includes(`\`${modifier}\``)) {
        errors.push(`${label}: the page body never names \`${modifier}\``)
      }
      if (
        rendered.length > 0 &&
        !rendered.some((source) => source.includes(modifier))
      ) {
        errors.push(
          `${label}: no story with a pixel baseline covering this page renders .${modifier}`,
        )
      }
    }
  }

  for (const modifier of modifiersOf(facts.scss, cls)) {
    if (!listed.has(modifier)) {
      errors.push(
        `the styles source defines .${cls}--${modifier}, which is not a variant on the page`,
      )
    }
  }
}

function checkStates(page, facts, errors) {
  const { data } = page
  for (const state of list(data.states)) {
    if (!state?.name || !state?.story) {
      errors.push('each state needs "name" and "story" (a story id)')
    } else if (!facts.stories.has(state.story)) {
      errors.push(`state "${state.name}": no story "${state.story}"`)
    }
  }
  if (data.kind === 'static' && list(data.states).length > 0) {
    errors.push('a static component has no states; mark it behavioural instead')
  }
}

function checkClasses(page, facts, errors) {
  const html = fencedBlocks(page.body, 'html')
  if (html.length !== 1)
    errors.push(`expected one html example; found ${html.length}`)

  for (const markup of html) {
    for (const [, classes] of markup.matchAll(/class="([^"]*)"/gu)) {
      for (const className of classes.split(/\s+/u).filter(Boolean)) {
        if (!hasClass(facts.scss, className)) {
          errors.push(
            `the html example uses .${className}, which the styles source does not define`,
          )
        }
      }
    }
  }

  const prose = page.body.replace(/^```[\s\S]*?^```$/gmu, '')
  const named = new Set(
    [...prose.matchAll(/`(pathable-[a-z0-9-]+)`/gu)].map((match) => match[1]),
  )
  for (const className of named) {
    if (!hasClass(facts.scss, className)) {
      errors.push(
        `the page names \`${className}\`, which the styles source does not define`,
      )
    }
  }
}

function checkGuarantees(page, facts, errors) {
  const cited = citing(page, facts.citations)
  const ids = new Set()

  for (const guarantee of list(page.data.guarantees)) {
    const { id, claim, ...rest } = guarantee ?? {}
    if (!id || !claim) {
      errors.push('each guarantee needs "id" and "claim"')
      continue
    }
    if (Object.keys(rest).length > 0) {
      errors.push(
        `guarantee "${id}": only "id" and "claim" belong on the page; tests cite the guarantee, not the other way round (found "${Object.keys(rest).join('", "')}")`,
      )
    }
    if (ids.has(id)) errors.push(`duplicate guarantee id "${id}"`)
    ids.add(id)
    if (!cited.some((citation) => citation.id === `${page.slug}/${id}`)) {
      errors.push(
        `guarantee "${id}" is cited by no test: cite "${page.slug}/${id}" from a play step (${HELPER}) or a pixel entry (covers)`,
      )
    }
  }

  if (
    page.data.kind === 'static' &&
    !cited.some((citation) => citation.kind === 'pixel')
  ) {
    errors.push(
      'a static component needs a pixel baseline: no pixel entry covers a guarantee of this page',
    )
  }
}

/** Every disagreement between one page and the repository, as messages. */
export function checkPage(page, facts) {
  const errors = []
  checkFrontMatter(page, errors)
  if (errors.length) return errors

  const { data } = page
  if (!hasClass(facts.scss, data['styles-class'])) {
    errors.push(
      `styles-class "${data['styles-class']}" has no rule in the styles source`,
    )
  }
  checkBody(page, errors)
  checkVariants(page, facts, errors)
  checkStates(page, facts, errors)
  checkClasses(page, facts, errors)
  checkGuarantees(page, facts, errors)
  return errors
}

/** Every citation that is malformed or points at nothing, as messages. */
export function checkCitations(pages, citations) {
  const guarantees = new Map(
    pages.map((page) => [
      page.slug,
      new Set(list(page.data.guarantees).map((guarantee) => guarantee?.id)),
    ]),
  )
  const errors = []

  for (const citation of citations) {
    const where = `${citation.source} cites "${citation.id}"`
    for (const problem of citation.problems ?? []) {
      errors.push(`${where}: ${problem}`)
    }
    const [slug, id, ...extra] = citation.id.split('/')
    if (!slug || !id || extra.length > 0) {
      errors.push(`${where}, which is not "<page>/<guarantee-id>"`)
    } else if (!guarantees.has(slug)) {
      errors.push(`${where}, but there is no component page "${slug}.md"`)
    } else if (!guarantees.get(slug).has(id)) {
      errors.push(`${where}, but ${slug}.md has no guarantee "${id}"`)
    }
  }
  return errors
}

/** The traceability table: page → guarantee → the tests that cite it. */
export function renderTrace(pages, citations) {
  const lines = []
  for (const page of pages) {
    lines.push(`${page.data.name} (${page.file})`)
    for (const { id, claim } of list(page.data.guarantees)) {
      lines.push(`  ${id}: ${claim}`)
      const cited = citations.filter(
        (citation) => citation.id === `${page.slug}/${id}`,
      )
      for (const citation of cited) {
        lines.push(`    ${citation.kind.padEnd(5)} ${citation.source}`)
      }
      if (cited.length === 0) lines.push('    (no test cites this)')
    }
  }
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Facts: what the repository contains
// ---------------------------------------------------------------------------

function listFiles(dir, pattern) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && pattern.test(entry.name))
    .map((entry) => join(entry.parentPath, entry.name))
}

/** Storybook's id rules: sanitized title, `--`, sanitized start-cased export name. */
export const sanitize = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')

export const storyId = (title, exportName) =>
  `${sanitize(title)}--${sanitize(exportName.replace(/([a-z0-9])([A-Z])/gu, '$1 $2'))}`

const isText = (node) =>
  node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))

/** The `title` of a CSF file's default export, read from the syntax tree. */
function csfTitle(file) {
  const literals = new Map()
  let meta
  for (const statement of file.statements) {
    if (ts.isVariableStatement(statement)) {
      for (const { name, initializer } of statement.declarationList
        .declarations) {
        if (ts.isIdentifier(name) && initializer)
          literals.set(name.text, initializer)
      }
    }
    if (ts.isExportAssignment(statement)) meta = statement.expression
  }
  while (meta && !ts.isObjectLiteralExpression(meta)) {
    meta = ts.isIdentifier(meta) ? literals.get(meta.text) : meta.expression
  }
  const title = meta?.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) &&
      property.name.getText(file) === 'title',
  )
  return isText(title?.initializer) ? title.initializer.text : undefined
}

/**
 * Parses a CSF file with the TypeScript parser (no type check): the ids of
 * its stories, and each `guarantee(step, '<id>', …)` call with the story whose
 * export contains it.
 */
export function readStoryFile(source, fileName = 'story.ts') {
  const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest)
  const title = csfTitle(file)
  const stories = []
  const citations = []
  if (!title) return { stories, citations }

  const visit = (node, story) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === HELPER
    ) {
      const id = node.arguments[1]
      const problems = []
      if (!isText(id)) problems.push('the id must be a string literal')
      if (!story) {
        problems.push(
          `call ${HELPER}() directly in a story's play function, so the story is known`,
        )
      }
      citations.push({
        id: isText(id) ? id.text : '?',
        kind: 'play',
        story,
        source: `${story ?? 'no story'} (${fileName})`,
        problems,
      })
    }
    ts.forEachChild(node, (child) => visit(child, story))
  }

  for (const statement of file.statements) {
    const exported =
      ts.isVariableStatement(statement) &&
      statement.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
      )
    if (!exported) {
      visit(statement)
      continue
    }
    for (const declaration of statement.declarationList.declarations) {
      const id = storyId(title, declaration.name.getText(file))
      stories.push(id)
      visit(declaration, id)
    }
  }
  return { stories, citations }
}

/**
 * Pixel citations: each `covers` id of a pixel story entry. The entry's
 * baseline images, one per viewport of the story's mode, must be committed.
 */
export function pixelCitations(entries, { viewportsOf, hasBaseline }) {
  return entries.flatMap((entry) =>
    (entry.covers ?? []).map((id) => ({
      id,
      kind: 'pixel',
      story: entry.id,
      source: `baseline ${entry.key} of ${entry.id}`,
      problems: viewportsOf(entry.id)
        .filter((viewport) => !hasBaseline(entry.key, viewport))
        .map(
          (viewport) =>
            `the baseline ${entry.key}/${viewport}.png is not committed`,
        ),
    })),
  )
}

/**
 * The denominator for coverage: wrapper files named after the class they
 * define (`pathable-card.scss` defines `.pathable-card`). That leaves out
 * partials and the bundle files that only forward other wrappers.
 */
export function wrapperComponents(files) {
  return files
    .filter(({ name, source }) => hasClass(source, name))
    .map(({ name }) => name)
}

const importScript = (path) =>
  import(pathToFileURL(join(repoRoot, 'packages/styles/scripts', path)).href)

/** Gathers everything the checks compare the pages with. */
export async function gatherFacts() {
  const sources = join(repoRoot, 'packages/styles/src')
  const files = await Promise.all(
    listFiles(sources, /\.scss$/u).map(async (file) => ({
      file,
      name: basename(file, '.scss'),
      source: await readFile(file, 'utf8'),
    })),
  )
  const wrappers = join(sources, 'pathable-component-wrappers')

  const stories = new Map()
  const citations = []
  for (const file of listFiles(join(sources, 'stories'), /\.stories\.ts$/u)) {
    const source = await readFile(file, 'utf8')
    const parsed = readStoryFile(source, relative(repoRoot, file))
    for (const id of parsed.stories) stories.set(id, source)
    citations.push(...parsed.citations)
  }

  const { STORIES } = await importScript('pixel-stories.mjs')
  const { CANONICAL_STORIES, visualViewportNames } =
    await importScript('quality-gates.mjs')
  const modes = new Map(
    CANONICAL_STORIES.map((story) => [story.id, story.mode]),
  )
  citations.push(
    ...pixelCitations(STORIES, {
      viewportsOf: (id) => visualViewportNames(modes.get(id)),
      hasBaseline: (key, viewport) =>
        existsSync(
          join(repoRoot, 'visual-baselines/styles', key, `${viewport}.png`),
        ),
    }),
  )

  return {
    scss: files.map(({ source }) => source).join('\n'),
    components: wrapperComponents(
      files.filter(({ file }) => dirname(file) === wrappers),
    ),
    stories,
    citations,
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main() {
  const pages = await readPages()
  const facts = await gatherFacts()
  let failed = false

  for (const page of pages) {
    const errors = checkPage(page, facts)
    for (const error of errors)
      console.error(`[component-pages] ${page.file}: ${error}`)
    failed ||= errors.length > 0
  }
  for (const error of checkCitations(pages, facts.citations)) {
    console.error(`[component-pages] ${error}`)
    failed = true
  }

  const indexPath = join(pagesDir, indexFile)
  const committed = existsSync(indexPath)
    ? await readFile(indexPath, 'utf8')
    : ''
  if (committed !== renderIndex(pages)) {
    console.error(
      `[component-pages] ${relative(repoRoot, indexPath)} is stale; run pnpm build:component-index`,
    )
    failed = true
  }

  if (process.argv.includes('--trace')) {
    console.log(renderTrace(pages, facts.citations))
  }
  const withPage = new Set(pages.map((page) => page.data['styles-class']))
  const covered = facts.components.filter((name) => withPage.has(name)).length
  console.log(
    `[component-pages] ${pages.length} page(s) checked; ${covered} of ${facts.components.length} component wrapper stylesheets have a page`,
  )
  if (failed) process.exitCode = 1
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
