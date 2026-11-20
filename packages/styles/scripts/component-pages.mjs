/**
 * Component pages: one hand-written Markdown page per component, under
 * packages/styles/components/, is the product specification for that
 * component and ships as agent documentation in @pathableai/styles.
 *
 * This module reads the pages and writes the one derived file, the catalog
 * index. The index is build output: the package's `build` script writes it,
 * it is not committed, and it ships through `files` like `dist/`. The checks
 * that tie a page to the code are in check-component-pages.mjs.
 *
 *   node scripts/component-pages.mjs index   write components/index.md
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { parse } from 'yaml'

/** Where the pages live: the styles package owns the component contract. */
export const pagesDir = resolve(import.meta.dirname, '../components')
export const indexFile = 'index.md'

/** Splits a page into its front matter (parsed as YAML) and its Markdown body. */
export function parsePage(markdown) {
  const normalized = markdown.replace(/\r\n?/gu, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n/u)
  if (!match) throw new Error('A component page must start with front matter')

  const data = parse(match[1])
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('The front matter must be a YAML mapping')
  }
  return { data, body: normalized.slice(match[0].length) }
}

/** Reads every component page (every Markdown file except the index). */
export async function readPages(dir = pagesDir) {
  const files = (await readdir(dir))
    .filter((file) => file.endsWith('.md') && file !== indexFile)
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

/** Renders the catalog index: one line per page, from its front matter. */
export function renderIndex(pages) {
  const lines = [...pages]
    .sort((a, b) => a.data.name.localeCompare(b.data.name))
    .map(
      ({ file, data }) =>
        `- [${data.name}](${file}) (\`${data['styles-class']}\`, ${data.kind}): ${data.summary}`,
    )

  return [
    '# Component pages',
    '',
    'Each page describes one component: what it is for, a minimal example, its',
    'variants, the tokens it uses, how to compose it, what it guarantees and',
    'what you own. A guarantee marked `status: unmet` is expected behaviour the',
    'component does not have yet: do not rely on it. One marked',
    '`status: unverified` was read from the package source and no test checks it',
    'yet.',
    '',
    'Components not listed here have no page yet. For those, use the package',
    'README and the stylesheet source under `src/`.',
    '',
    ...lines,
    '',
  ].join('\n')
}

async function writeIndex() {
  const pages = await readPages()
  await writeFile(join(pagesDir, indexFile), renderIndex(pages))
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
