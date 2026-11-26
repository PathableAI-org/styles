/**
 * Shared helpers for the fixture checks: where the fixtures live, which
 * folders hold components, and how a check reads the folder list it is given.
 */

import { readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'

/** The fixtures package root (the parent of harness/). */
export const packageRoot = resolve(import.meta.dirname, '..')

/**
 * Where the component folders are read from: the package
 * root, or FIXTURES_ROOT when it is set. The harness's own tests set it to run
 * the real commands against a scratch folder; nothing else should.
 */
export const fixturesRoot = process.env.FIXTURES_ROOT
  ? resolve(process.env.FIXTURES_ROOT)
  : packageRoot

/** The only folder under fixtures/ that is not a component folder. */
export const HARNESS_DIR = 'harness'

/** Folders that are never component folders (tooling output). */
const IGNORED_DIRS = new Set([HARNESS_DIR, 'node_modules'])

/** Every component folder under fixtures/, sorted. */
export function allFolders(root = fixturesRoot) {
  return readdirSync(root, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith('.') &&
        !IGNORED_DIRS.has(entry.name),
    )
    .map((entry) => entry.name)
    .sort()
}

/** The `.html` fixture files in one component folder, sorted. */
export function fixtureFiles(folder, root = fixturesRoot) {
  return readdirSync(join(root, folder))
    .filter((file) => file.endsWith('.html'))
    .sort()
}

/**
 * The folders a check runs on: the command-line arguments if any were given
 * (whitespace- or comma-separated), otherwise every folder.
 */
export function foldersFromArgs(argv, root = fixturesRoot) {
  const named = argv.flatMap((arg) => arg.split(/[\s,]+/u)).filter(Boolean)
  return named.length > 0 ? [...new Set(named)].sort() : allFolders(root)
}
