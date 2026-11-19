/**
 * Ties each component page to the styles code it describes. It does not
 * generate the page: the page is written by hand and is the specification;
 * this check fails when the page and the code disagree. It reads source files
 * only, so it needs no build.
 *
 * For every component that has a page under packages/styles/components/:
 *   - the front matter has the required fields and the body the required
 *     sections, and the page does not mention the underlying framework classes;
 *   - the styles class has a rule in the SCSS;
 *   - every variant value that is not a default has a modifier rule, the page
 *     names that modifier class, and the canonical story's file renders it;
 *   - every modifier the SCSS defines for the class is a variant on the page;
 *   - every state names a story that exists;
 *   - the canonical story exists and is a canonical story of the quality
 *     gates, and the baseline key is a committed pixel baseline of that story;
 *   - the markup example, and every class the body names in a code span, uses
 *     only classes the SCSS defines;
 *   - every guarantee cites evidence that exists: a pixel baseline, or a story
 *     play function, optionally a named `step` in it;
 *   - the derived index is current.
 *
 * Components without a page are counted, not failed: pages are opt-in while
 * the format is trialled.
 *
 *   node scripts/check-component-pages.mjs
 */

import { existsSync, readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

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
  'canonical-story',
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

// ---------------------------------------------------------------------------
// Pure checks: a page against facts gathered from the repository
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
  if (data.kind === 'static' && !data.baseline) {
    errors.push(
      'a static component needs a "baseline": its pixel baseline is its main evidence',
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

function checkStory(id, facts, errors, context) {
  const story = facts.stories.get(id)
  if (!story) errors.push(`${context}: no story "${id}"`)
  return story
}

function checkVariants(page, facts, errors) {
  const { data } = page
  const cls = data['styles-class']
  const storySource = facts.stories.get(data['canonical-story'])?.fileSource
  const listed = new Set()

  for (const variant of Array.isArray(data.variants) ? data.variants : []) {
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
      if (storySource !== undefined && !storySource.includes(modifier)) {
        errors.push(
          `${label}: the canonical story's file never renders .${modifier}`,
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
  for (const state of Array.isArray(data.states) ? data.states : []) {
    if (!state?.name || !state?.story) {
      errors.push('each state needs "name" and "story" (a story id)')
      continue
    }
    checkStory(state.story, facts, errors, `state "${state.name}"`)
  }
  if (
    data.kind === 'static' &&
    Array.isArray(data.states) &&
    data.states.length > 0
  ) {
    errors.push('a static component has no states; mark it behavioural instead')
  }
}

function checkStoriesAndBaseline(page, facts, errors) {
  const { data } = page
  const id = data['canonical-story']
  checkStory(id, facts, errors, 'canonical-story')
  if (id && !facts.canonicalStories.has(id)) {
    errors.push(
      `canonical-story "${id}" is not in the quality gates' CANONICAL_STORIES`,
    )
  }
  if (data.baseline) {
    const baselineStory = facts.baselines.get(data.baseline)
    if (!baselineStory) {
      errors.push(
        `baseline "${data.baseline}" is not a committed pixel baseline`,
      )
    } else if (baselineStory !== id) {
      errors.push(
        `baseline "${data.baseline}" captures "${baselineStory}", not the canonical story`,
      )
    }
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

const EVIDENCE =
  /^(?:pixel (?<baseline>\S+)|play (?<story>\S+?)(?: > (?<step>.+))?)$/u

function checkGuarantees(page, facts, errors) {
  const ids = new Set()
  for (const guarantee of Array.isArray(page.data.guarantees)
    ? page.data.guarantees
    : []) {
    const { id, claim, evidence } = guarantee ?? {}
    if (!id || !claim || !Array.isArray(evidence) || evidence.length === 0) {
      errors.push(
        'each guarantee needs "id", "claim" and a non-empty "evidence" list',
      )
      continue
    }
    if (ids.has(id)) errors.push(`duplicate guarantee id "${id}"`)
    ids.add(id)

    for (const item of evidence) {
      const match = String(item).match(EVIDENCE)
      if (!match) {
        errors.push(
          `guarantee "${id}": evidence "${item}" is neither "pixel <key>" nor "play <story-id>[ > <step>]"`,
        )
        continue
      }
      const { baseline, story, step } = match.groups
      if (baseline && !facts.baselines.has(baseline)) {
        errors.push(
          `guarantee "${id}": no committed pixel baseline "${baseline}"`,
        )
      }
      if (story) {
        const found = checkStory(story, facts, errors, `guarantee "${id}"`)
        if (found && !found.play) {
          errors.push(`guarantee "${id}": ${story} has no play function`)
        }
        if (found && step && !found.steps.includes(step)) {
          errors.push(`guarantee "${id}": ${story} has no step "${step}"`)
        }
      }
    }
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
  checkStoriesAndBaseline(page, facts, errors)
  checkClasses(page, facts, errors)
  checkGuarantees(page, facts, errors)
  return errors
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

/** Parses a CSF file's stories: id, play function and named steps per export. */
export function readStories(source) {
  const title = source.match(/\btitle:\s*['"]([^'"]+)['"]/u)?.[1]
  if (!title) return []
  const exports = [...source.matchAll(/^export const (\w+)/gmu)]
  return exports.map((match, index) => {
    const block = source.slice(
      match.index,
      exports[index + 1]?.index ?? source.length,
    )
    const alias = block.match(
      /^export const \w+(?::\s*\w+)?\s*=\s*(\w+)\s*$/mu,
    )?.[1]
    const target = alias
      ? exports.find((other) => other[1] === alias)
      : undefined
    const own = target
      ? source.slice(
          target.index,
          exports[exports.indexOf(target) + 1]?.index ?? source.length,
        )
      : block
    return {
      id: storyId(title, match[1]),
      play: /\bplay:/u.test(own),
      steps: [...own.matchAll(/\bstep\(\s*['"]([^'"]+)['"]/gu)].map(
        (step) => step[1],
      ),
      fileSource: source,
    }
  })
}

async function readStorybook(dir, pattern) {
  const stories = new Map()
  for (const file of listFiles(dir, pattern)) {
    for (const story of readStories(await readFile(file, 'utf8'))) {
      stories.set(story.id, story)
    }
  }
  return stories
}

async function readBaselines() {
  const source = await readFile(
    join(repoRoot, 'packages/styles/scripts/test-pixels.mjs'),
    'utf8',
  )
  const baselines = new Map()
  for (const [, id, key] of source.matchAll(
    /id:\s*'([^']+)',\s*key:\s*'([^']+)'/gu,
  )) {
    const dir = join(repoRoot, 'visual-baselines/styles', key)
    if (
      existsSync(dir) &&
      readdirSync(dir).some((file) => file.endsWith('.png'))
    ) {
      baselines.set(key, id)
    }
  }
  return baselines
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

/** Gathers everything the checks compare a page with. */
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

  const { CANONICAL_STORIES } = await import(
    pathToFileURL(join(repoRoot, 'packages/styles/scripts/quality-gates.mjs'))
      .href
  )

  return {
    scss: files.map(({ source }) => source).join('\n'),
    components: wrapperComponents(
      files.filter(({ file }) => dirname(file) === wrappers),
    ),
    stories: await readStorybook(join(sources, 'stories'), /\.stories\.ts$/u),
    canonicalStories: new Set(CANONICAL_STORIES.map((story) => story.id)),
    baselines: await readBaselines(),
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
