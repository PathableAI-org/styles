/**
 * Component pages: one hand-written Markdown page per component, under the
 * repository's top-level components/ directory, is the product specification
 * for that component. The styles `build` turns each source page into
 * packages/styles/components/<slug>.md (scripts/component-docs/), which ships
 * as agent documentation in @pathableai/styles; how to write a source page is
 * in components/README.md.
 *
 * This module reads the source pages and writes the catalog index beside the
 * built pages. Everything in packages/styles/components/ is build output: it
 * is not committed, and it ships through `files` like `dist/`. The checks
 * that tie a page to the code are in check-component-pages.mjs.
 *
 *   node scripts/component-pages.mjs index   write packages/styles/components/index.md
 */

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { parse, parseDocument } from 'yaml'

/** Where the source pages live, shared by every package's documentation. */
export const pagesDir = resolve(import.meta.dirname, '../../../components')
/** Where the styles build writes the pages and index it ships. */
export const outputDir = resolve(import.meta.dirname, '../components')
export const indexFile = 'index.md'
/** Markdown in the source directory that is not a component page. */
const NOT_PAGES = new Set([indexFile, 'README.md'])

/** Finds the front matter block of a page: the match, and the text between the fences. */
function frontMatterMatch(markdown) {
  const normalized = markdown.replace(/\r\n?/gu, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n/u)
  if (!match) throw new Error('A component page must start with front matter')
  return { normalized, match }
}

/** The front matter of a page as a YAML document, which keeps comments. */
export function parseFrontMatterDocument(markdown) {
  return parseDocument(frontMatterMatch(markdown).match[1])
}

/** Splits a page into its front matter (parsed as YAML) and its Markdown body. */
export function parsePage(markdown) {
  const { normalized, match } = frontMatterMatch(markdown)

  const data = parse(match[1])
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('The front matter must be a YAML mapping')
  }
  return { data, body: normalized.slice(match[0].length) }
}

/** Reads every component page (every Markdown file but the index and README). */
export async function readPages(dir = pagesDir) {
  const files = (await readdir(dir))
    .filter((file) => file.endsWith('.md') && !NOT_PAGES.has(file))
    .sort()

  return Promise.all(
    files.map(async (file) => {
      const markdown = await readFile(join(dir, file), 'utf8')
      return {
        file,
        slug: basename(file, '.md'),
        markdown,
        ...parsePage(markdown),
      }
    }),
  )
}

/**
 * The index sections, in order: the page kinds each lists and its heading. A
 * settings page is in none of them: it is for the Storybook only, and the
 * styles build does not write it (scripts/component-docs/write.mjs).
 */
const INDEX_GROUPS = [
  { heading: 'Design tokens', kinds: ['token'] },
  { heading: 'Utilities', kinds: ['utility'] },
  { heading: 'Components', kinds: ['static'] },
]

/**
 * One index line. A component names its class, inside the link text so that a
 * name such as "Link" still makes descriptive link text (markdownlint MD059
 * lints this build output); a utility or token page has no class.
 */
const indexLine = ({ file, data }) =>
  data['styles-class']
    ? `- [${data.name} (\`${data['styles-class']}\`)](${file}) (${data.kind}): ${data.summary}`
    : `- [${data.name}](${file}) (${data.kind}): ${data.summary}`

/**
 * Renders the catalog index: one line per page, from its front matter,
 * grouped under Design tokens, Utilities and Components (a group with no page
 * is left out).
 */
export function renderIndex(pages) {
  const groups = INDEX_GROUPS.flatMap(({ heading, kinds }) => {
    const lines = pages
      .filter(({ data }) => kinds.includes(data.kind))
      .sort((a, b) => a.data.name.localeCompare(b.data.name))
      .map(indexLine)
    return lines.length > 0 ? [`## ${heading}`, '', ...lines, ''] : []
  })

  return [
    '# Component pages',
    '',
    'Each page describes one part of the design system: a component, a family',
    'of utility classes or a group of design tokens. It says what it is for, a',
    'minimal example, its variants, the tokens or settings it uses, how to',
    'compose it, what it guarantees and what you own. A guarantee marked',
    '`status: unmet` is expected behaviour the component does not have yet: do',
    'not rely on it. One marked `status: unverified` was read from the package',
    'source and no test checks it yet.',
    '',
    'Utility and token pages describe USWDS names that carry no prefix, so',
    'they are the same in @pathableai/styles as in USWDS.',
    '',
    'Components not listed here have no page yet. For those, use the package',
    'README and the stylesheet source under `src/`.',
    '',
    ...groups,
  ].join('\n')
}

async function writeIndex() {
  const pages = await readPages()
  await mkdir(outputDir, { recursive: true })
  await writeFile(join(outputDir, indexFile), renderIndex(pages))
  console.log(`[component-pages] Wrote ${indexFile} with ${pages.length} pages`)
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  if (process.argv[2] !== 'index') {
    console.error('Usage: component-pages.mjs index')
    process.exitCode = 1
  } else {
    writeIndex().catch((error) => {
      console.error(`[component-pages] ${error.message}`)
      process.exitCode = 1
    })
  }
}
