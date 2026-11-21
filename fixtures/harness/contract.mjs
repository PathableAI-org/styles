/**
 * Ties each fixture folder to its component page and the compiled CSS.
 *
 *   node harness/contract.mjs [folder …]    default: every component folder
 *
 * It fails when:
 *   - a folder on disk is missing from fixtures/folders.json, or a folder that
 *     file lists is missing from disk (always checked, whatever folders are
 *     named, so deleting a folder has to edit the list visibly);
 *   - a folder's name is not the slug of a page in components/;
 *   - a folder holds no fixture;
 *   - a fixture's file name is not a kebab-case state name such as
 *     `no-actions.html`, or a component folder holds anything other than such
 *     files (a subfolder, `.htm`, `.HTML`), which the checks would skip;
 *   - a `pathable-*` class in a fixture is not a class selector in
 *     @pathableai/styles/dist/styles.css (a class without the prefix, such as
 *     the USWDS utility `margin-x-2`, is not checked here: the component-page
 *     check reads every class of a page's examples, fixtures included);
 *   - a non-default variant in the page's front matter has no fixture in the
 *     folder that uses its modifier class (a utility or token page has no
 *     variants, so this does not apply to it).
 *
 * A folder is named after the slug of its page whatever the page's kind:
 * component pages, `utilities-<uswds slug>` and `tokens-<uswds path>`.
 *
 * Classes are read by parsing each fixture: only `class` attributes of
 * elements count, not `data-class` or similar attributes, and not markup
 * inside comments. Page parsing and CSS reading are the component-page
 * check's own (packages/styles/scripts/), so the two checks read the same
 * facts.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import process from 'node:process'

import { parseFragment } from 'parse5'

import { readCss } from '../../packages/styles/scripts/check-component-pages.mjs'
import { readPages } from '../../packages/styles/scripts/component-pages.mjs'

import { stylesCssPath } from './css.mjs'
import {
  allFolders,
  fixtureFiles,
  fixturesRoot,
  foldersFromArgs,
} from './folders.mjs'

/** A fixture file name: a kebab-case state name ending in `.html`. */
export const STATE_FILE_NAME = /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.html$/u

/** The committed list of component folders. */
export const folderListPath = join(fixturesRoot, 'folders.json')

/** Every class in a `class` attribute of an element in the markup. */
export function classesIn(html) {
  const classes = new Set()
  const visit = (node) => {
    for (const attr of node.attrs ?? []) {
      if (attr.name !== 'class') continue
      for (const name of attr.value.split(/\s+/u)) if (name) classes.add(name)
    }
    for (const child of node.childNodes ?? []) visit(child)
    if (node.content) visit(node.content)
  }
  visit(parseFragment(html))
  return classes
}

/**
 * Compares the committed folder list with the component folders on disk, in
 * both directions. Returns errors.
 */
export function checkFolderList(listed, onDisk) {
  const errors = []
  const listedSet = new Set(listed)
  const diskSet = new Set(onDisk)
  for (const folder of listed) {
    if (!diskSet.has(folder)) {
      errors.push(
        `folders.json lists ${folder}/, which is not on disk; remove it from folders.json if the removal is deliberate`,
      )
    }
  }
  for (const folder of onDisk) {
    if (!listedSet.has(folder))
      errors.push(`${folder}/ is on disk but not listed in folders.json`)
  }
  return errors
}

/**
 * Errors for entries of a component folder that are not `.html` files, so a
 * subfolder or a file such as `disabled.htm` cannot sit beside the fixtures
 * unchecked. `entries` is a list of `{ name, isDirectory }`; dotfiles are
 * ignored.
 */
export function checkFolderEntries(folder, entries) {
  return entries
    .filter(({ name }) => !name.startsWith('.'))
    .filter(({ name, isDirectory }) => isDirectory || !name.endsWith('.html'))
    .map(({ name, isDirectory }) =>
      isDirectory
        ? `${folder}/${name}/: component folders hold only <state>.html fixtures, not subfolders`
        : `${folder}/${name}: component folders hold only <state>.html fixtures; this file would not be checked`,
    )
}

/** Reads fixtures/folders.json: a JSON array of folder names. */
export function readFolderList(path = folderListPath) {
  const list = JSON.parse(readFileSync(path, 'utf8'))
  if (!Array.isArray(list) || !list.every((name) => typeof name === 'string'))
    throw new Error('folders.json must be a JSON array of folder names')
  return list
}

/**
 * Checks one folder. `fixtures` maps file name to markup, `page` is the parsed
 * component page (or undefined) and `css` is readCss() output. Returns errors.
 */
export function checkFolder(folder, fixtures, page, css) {
  if (!page) {
    return [
      `${folder}/: no component page components/${folder}.md; a fixture folder must be named after a page slug`,
    ]
  }
  const errors = []
  if (fixtures.size === 0) errors.push(`${folder}/: holds no .html fixture`)

  const used = new Set()
  for (const [file, html] of fixtures) {
    if (!STATE_FILE_NAME.test(file)) {
      errors.push(
        `${folder}/${file}: a fixture file name must be a kebab-case state name, such as no-actions.html`,
      )
    }
    for (const name of classesIn(html)) {
      used.add(name)
      if (name.startsWith('pathable-') && !css.classes.has(name)) {
        errors.push(
          `${folder}/${file}: .${name} is not a class selector in dist/styles.css`,
        )
      }
    }
  }

  // A utility or token page has no component class and no variants, so it has
  // no variant fixtures to demand.
  const cls = page.data['styles-class']
  for (const variant of page.data.variants ?? []) {
    for (const value of variant?.values ?? []) {
      if (value === variant.default) continue
      const modifier = `${cls}--${value}`
      if (!used.has(modifier)) {
        errors.push(
          `${folder}/: variant "${variant.axis}=${value}" has no fixture using .${modifier}`,
        )
      }
    }
  }
  return errors
}

export async function checkFolders(folders, root = fixturesRoot) {
  const pages = new Map((await readPages()).map((page) => [page.slug, page]))
  const css = readCss(readFileSync(stylesCssPath(), 'utf8'))
  return folders.flatMap((folder) => {
    if (!existsSync(join(root, folder)))
      return [`${folder}/: no such folder under fixtures/`]
    const fixtures = new Map(
      fixtureFiles(folder, root).map((file) => [
        file,
        readFileSync(join(root, folder, file), 'utf8'),
      ]),
    )
    const entries = readdirSync(join(root, folder), {
      withFileTypes: true,
    }).map((entry) => ({ name: entry.name, isDirectory: entry.isDirectory() }))
    return [
      ...checkFolderEntries(folder, entries),
      ...checkFolder(folder, fixtures, pages.get(folder), css),
    ]
  })
}

async function main(argv) {
  const folders = foldersFromArgs(argv)
  const errors = [
    ...checkFolderList(readFolderList(), allFolders()),
    ...(await checkFolders(folders)),
  ]
  for (const error of errors)
    process.stderr.write(`[fixtures:contract] ${error}\n`)
  process.stdout.write(
    `[fixtures:contract] ${folders.length} folder(s) checked; ${errors.length} problem(s)\n`,
  )
  if (errors.length > 0) process.exitCode = 1
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`[fixtures:contract] ${error.message}\n`)
    process.exitCode = 1
  })
}
