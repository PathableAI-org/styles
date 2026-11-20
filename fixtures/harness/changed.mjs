/**
 * Prints the component folders under fixtures/ that a git diff touched, one
 * per line, so CI checks only what changed.
 *
 *   node harness/changed.mjs [base]       default base: origin/main
 *   node harness/changed.mjs --all        every folder
 *
 * It runs `git diff --name-only <base>...HEAD -- fixtures/`. A change to the
 * shared tooling (harness/, .htmlvalidate.json or package.json) can change
 * the result for every fixture, so it selects every folder. A deleted folder
 * is not printed, because there is nothing left in it to check.
 */

import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import process from 'node:process'

import { HARNESS_DIR, allFolders, fixturesRoot } from './folders.mjs'

/** Files at the fixtures root whose change selects every folder. */
const SHARED_FILES = new Set(['.htmlvalidate.json', 'package.json'])

/**
 * Maps changed paths (repository-relative, as git prints them) to the
 * component folders to check. Pure, so it can be unit tested.
 */
export function selectFolders(changedPaths, folders) {
  const selected = new Set()
  for (const path of changedPaths) {
    const parts = path.split('/')
    if (parts[0] !== 'fixtures' || parts.length < 2) continue
    const [, first] = parts
    if (
      first === HARNESS_DIR ||
      (parts.length === 2 && SHARED_FILES.has(first))
    )
      return [...folders].sort()
    if (parts.length > 2 && folders.includes(first)) selected.add(first)
  }
  return [...selected].sort()
}

/** The paths under fixtures/ that changed between base and HEAD. */
export function changedPaths(base, cwd = fixturesRoot) {
  const output = execFileSync(
    'git',
    ['diff', '--name-only', `${base}...HEAD`, '--', 'fixtures/'],
    { cwd: join(cwd, '..'), encoding: 'utf8' },
  )
  return output.split('\n').filter(Boolean)
}

function main(argv) {
  const folders = allFolders()
  const selected = argv.includes('--all')
    ? folders
    : selectFolders(changedPaths(argv[0] ?? 'origin/main'), folders).filter(
        (folder) => existsSync(join(fixturesRoot, folder)),
      )
  if (selected.length > 0) process.stdout.write(`${selected.join('\n')}\n`)
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    main(process.argv.slice(2))
  } catch (error) {
    process.stderr.write(`[fixtures:changed] ${error.message}\n`)
    process.exitCode = 1
  }
}
