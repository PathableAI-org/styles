/**
 * Ties each fixture folder to its component page and the compiled CSS.
 *
 *   node harness/contract.mjs [folder …]    default: every component folder
 *
 * It fails when:
 *   - a folder's name is not the slug of a page in components/;
 *   - a folder holds no fixture;
 *   - a fixture's file name is not a kebab-case state name such as
 *     `no-actions.html`, or a component folder holds anything other than such
 *     files (a subfolder, `.htm`, `.HTML`), which the checks would skip;
 *   - a `pathable-*` class in a fixture is not in the `classes` of any module
 *     in @pathableai/styles/dist/css/manifest.json (a class without the prefix, such as
 *     the USWDS utility `margin-x-2`, is not checked here: the component-page
 *     check reads every class of a page's examples, fixtures included);
 *   - a `pathable-` utility class in a fixture (one in dist/utilities.css
 *     outside a pseudo-class argument, such as `pathable-margin-top-2` or
 *     `hover:pathable-bg-link`) is not declared by the `classes` front matter
 *     of any page: a fixture may show only a documented utility;
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

import {
  readUtilityClasses,
  undeclaredUtilityClasses,
  undeclaredUtilityMessage,
  utilityPatterns,
} from '../../packages/styles/scripts/check-component-pages.mjs'
import { readPages } from '../../packages/styles/scripts/component-pages.mjs'

import { utilitiesCssPath } from './css.mjs'
import { fixtureFiles, fixturesRoot, foldersFromArgs } from './folders.mjs'
import { classOwners, classesIn, readManifest } from './modules.mjs'

export { classesIn }

/** A fixture file name: a kebab-case state name ending in `.html`. */
export const STATE_FILE_NAME = /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.html$/u

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

/**
 * Checks one folder. `fixtures` maps file name to markup, `page` is the parsed
 * component page (or undefined) and `owners` is classOwners() of the manifest. `utility` is
 * `{ classes, patterns }`: the utility classes of dist/utilities.css and the
 * patterns every page declares (omitted: utility citations are not checked).
 * Returns errors.
 */
export function checkFolder(folder, fixtures, page, owners, utility) {
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
    const classes = classesIn(html)
    if (utility) {
      for (const name of undeclaredUtilityClasses(
        classes,
        utility.classes,
        utility.patterns,
      )) {
        errors.push(`${folder}/${file}: ${undeclaredUtilityMessage(name)}`)
      }
    }
    for (const name of classes) {
      used.add(name)
      if (name.startsWith('pathable-') && !owners.has(name)) {
        errors.push(
          `${folder}/${file}: .${name} is not defined by any module in dist/css/manifest.json`,
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
  const allPages = await readPages()
  const pages = new Map(allPages.map((page) => [page.slug, page]))
  const utility = {
    classes: readUtilityClasses(readFileSync(utilitiesCssPath(), 'utf8')),
    patterns: utilityPatterns(allPages),
  }
  const owners = classOwners(readManifest())
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
      ...checkFolder(folder, fixtures, pages.get(folder), owners, utility),
    ]
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
