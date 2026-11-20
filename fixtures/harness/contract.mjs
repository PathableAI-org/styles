/**
 * Ties each fixture folder to its component page and the compiled CSS.
 *
 *   node harness/contract.mjs [folder …]    default: every component folder
 *
 * It fails when:
 *   - a folder's name is not the slug of a page in packages/styles/components/;
 *   - a folder holds no fixture;
 *   - a `pathable-*` class in a fixture is not a class selector in
 *     @pathableai/styles/dist/styles.css;
 *   - a non-default variant in the page's front matter has no fixture in the
 *     folder that uses its modifier class.
 *
 * Page parsing and CSS reading are the component-page check's own
 * (packages/styles/scripts/), so the two checks read the same facts.
 */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import process from 'node:process'

import { readCss } from '../../packages/styles/scripts/check-component-pages.mjs'
import { readPages } from '../../packages/styles/scripts/component-pages.mjs'

import { stylesCssPath } from './css.mjs'
import { fixtureFiles, fixturesRoot, foldersFromArgs } from './folders.mjs'

/** Every class named in a `class` attribute of the markup. */
export function classesIn(html) {
  const classes = new Set()
  for (const [, , value] of html.matchAll(/\bclass\s*=\s*(["'])(.*?)\1/gsu))
    for (const name of value.split(/\s+/u)) if (name) classes.add(name)
  return classes
}

/**
 * Checks one folder. `fixtures` maps file name to markup, `page` is the parsed
 * component page (or undefined) and `css` is readCss() output. Returns errors.
 */
export function checkFolder(folder, fixtures, page, css) {
  if (!page) {
    return [
      `${folder}/: no component page packages/styles/components/${folder}.md; a fixture folder must be named after a page slug`,
    ]
  }
  const errors = []
  if (fixtures.size === 0) errors.push(`${folder}/: holds no .html fixture`)

  const used = new Set()
  for (const [file, html] of fixtures) {
    for (const name of classesIn(html)) {
      used.add(name)
      if (name.startsWith('pathable-') && !css.classes.has(name)) {
        errors.push(
          `${folder}/${file}: .${name} is not a class selector in dist/styles.css`,
        )
      }
    }
  }

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
    return checkFolder(folder, fixtures, pages.get(folder), css)
  })
}

async function main(argv) {
  const folders = foldersFromArgs(argv)
  const errors = await checkFolders(folders)
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
