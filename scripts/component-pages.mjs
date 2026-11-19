/**
 * Component pages: one hand-written Markdown page per component, under
 * packages/styles/components/, is the product specification for that
 * component and ships as agent documentation in both packages.
 *
 * This module reads the pages and derives the one generated file, the catalog
 * index, from their front matter. The checks that tie a page to the code are
 * in check-component-pages.mjs.
 *
 *   node scripts/component-pages.mjs index           rewrite components/index.md
 *   node scripts/component-pages.mjs copy-to-react   copy the pages into the
 *                                                    React agent guidance
 */

import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { table } from './markdown.mjs'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** Where the pages live: the styles package owns the component contract. */
export const pagesDir = join(repoRoot, 'packages/styles/components')
export const indexFile = 'index.md'

/** Where the React package carries its version-pinned copy (gitignored). */
export const reactCopyDir = join(
  repoRoot,
  'packages/react/agent-guidance/pathable-react/components',
)

// ---------------------------------------------------------------------------
// Front matter
// ---------------------------------------------------------------------------

const KEY = /^([a-z][a-z0-9-]*):(?: (.*))?$/u

function parseScalar(raw) {
  const value = raw.trim()
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim()
    return inner === '' ? [] : inner.split(',').map((item) => item.trim())
  }
  if (/^(['"]).*\1$/u.test(value)) return value.slice(1, -1)
  return value
}

const indentOf = (line) => line.length - line.trimStart().length

/**
 * Parses the small YAML subset the pages use: `key: value`, flow lists
 * (`[a, b]`), block lists of scalars, and block lists of maps whose values are
 * themselves scalars, flow lists or block lists. Anything else is an error, so
 * a page cannot silently say something the checks do not read.
 */
function parseBlock(lines, start, indent) {
  const first = lines[start]
  const isList = first.trimStart().startsWith('- ')
  const result = isList ? [] : {}
  let index = start

  while (index < lines.length && indentOf(lines[index]) === indent) {
    const text = lines[index].trimStart()

    if (isList) {
      if (!text.startsWith('- ')) {
        throw new Error(`Expected a list item: ${lines[index]}`)
      }
      const item = text.slice(2)
      if (KEY.test(item)) {
        // A map item: re-read its first line as a map line two columns in.
        const mapLines = [...lines]
        mapLines[index] = `${' '.repeat(indent + 2)}${item}`
        const [map, next] = parseBlock(mapLines, index, indent + 2)
        result.push(map)
        index = next
      } else {
        result.push(parseScalar(item))
        index += 1
      }
      continue
    }

    const match = text.match(KEY)
    if (!match) throw new Error(`Expected "key: value": ${lines[index]}`)
    const [, key, value] = match
    if (key in result) throw new Error(`Duplicate key: ${key}`)
    if (value !== undefined) {
      result[key] = parseScalar(value)
      index += 1
    } else if (
      index + 1 < lines.length &&
      indentOf(lines[index + 1]) > indent
    ) {
      const [block, next] = parseBlock(
        lines,
        index + 1,
        indentOf(lines[index + 1]),
      )
      result[key] = block
      index = next
    } else {
      throw new Error(`Key has no value: ${key}`)
    }
  }

  if (index < lines.length && indentOf(lines[index]) > indent) {
    throw new Error(`Unexpected indentation: ${lines[index]}`)
  }
  return [result, index]
}

/** Splits a page into its front matter (parsed) and its Markdown body. */
export function parsePage(markdown) {
  const normalized = markdown.replace(/\r\n?/gu, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n/u)
  if (!match) throw new Error('A component page must start with front matter')

  const lines = match[1].split('\n').filter((line) => line.trim() !== '')
  const [data, end] = parseBlock(lines, 0, 0)
  if (end !== lines.length) {
    throw new Error(`Unexpected front matter line: ${lines[end]}`)
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

// ---------------------------------------------------------------------------
// The derived index
// ---------------------------------------------------------------------------

const code = (value) => `\`${value}\``

/** Renders the catalog index from the pages' front matter. */
export function renderIndex(pages) {
  const rows = [...pages]
    .sort((a, b) => a.data.name.localeCompare(b.data.name))
    .map(({ file, data }) => [
      `[${data.name}](${file})`,
      data.kind,
      data.summary,
      code(data['styles-class']),
      data['react-export'] ? code(data['react-export']) : '',
    ])

  return [
    '<!-- Generated from the front matter of each page by `pnpm build:component-index`. Do not edit by hand. -->',
    '',
    '# Component pages',
    '',
    'Each page describes one component: what it is for, a minimal example, its',
    'variants and states, how to compose it, what it guarantees, what you own and',
    'its known defects. A static component has no interactive states; a',
    'behavioural one does.',
    '',
    'Components not listed here have no page yet. For those, use the package',
    'README and the installed type declarations.',
    '',
    table(['Component', 'Kind', 'Purpose', 'Class', 'React export'], rows),
    '',
  ].join('\n')
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function writeIndex() {
  const pages = await readPages()
  await writeFile(join(pagesDir, indexFile), renderIndex(pages))
  console.log(`[component-pages] Wrote ${indexFile} with ${pages.length} pages`)
}

async function copyToReact() {
  await rm(reactCopyDir, { recursive: true, force: true })
  await mkdir(reactCopyDir, { recursive: true })
  const files = (await readdir(pagesDir)).filter((file) => file.endsWith('.md'))
  for (const file of files) {
    await cp(join(pagesDir, file), join(reactCopyDir, file))
  }
  console.log(
    `[component-pages] Copied ${files.length} files to the React guidance`,
  )
}

const commands = { index: writeIndex, 'copy-to-react': copyToReact }

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const command = commands[process.argv[2]]
  if (!command) {
    console.error(
      `Usage: component-pages.mjs ${Object.keys(commands).join('|')}`,
    )
    process.exitCode = 1
  } else {
    command().catch((error) => {
      console.error(`[component-pages] ${error.message}`)
      process.exitCode = 1
    })
  }
}
