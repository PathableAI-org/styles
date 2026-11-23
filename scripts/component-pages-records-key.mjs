#!/usr/bin/env node
/**
 * Prints the GitHub Actions cache key for the component page records: what
 * the HTML Storybook test runner writes to
 * apps/storybook/test-results/component-pages/, saved with the Storybook
 * index (apps/storybook/storybook-static/index.json) that
 * `check:component-pages:executed` reads beside them.
 *
 * Docs Deploy saves the records under this key after every test run on
 * `main`. Storybook Quality restores them for a pull request that changes
 * component pages but nothing the HTML Storybook is built or tested from, so
 * it can run the executed check without building and testing the Storybook.
 *
 * The key hashes the Git blob of every tracked file that can change the
 * records. It is built from exclusions, so a file nobody thought about is
 * part of the key: a new input can only cost a cache miss, never a stale
 * hit. Excluded are only files the HTML Storybook build and test run do not
 * read:
 *   - Markdown, including the component pages in components/ (the records do
 *     not depend on them: the stories generated beside each page take their
 *     names and markup from the fixtures, and the page only becomes an
 *     untested docs entry), except under apps/storybook/ and
 *     packages/styles/src/, where a story could import it;
 *   - the React package and React Storybook;
 *   - pixel baselines, which only the pixel suite reads;
 *   - documentation, specifications, changesets, agent files and the
 *     repository scripts under scripts/, which neither build nor test run
 *     imports, except scripts/component-docs/, which writes the generated
 *     fixture stories before every Storybook build.
 *
 * Usage: node scripts/component-pages-records-key.mjs
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Bump to invalidate every saved entry, e.g. when the record format changes. */
export const KEY_VERSION = 'v1'

const MARKDOWN_KEPT_UNDER = ['apps/storybook/', 'packages/styles/src/']

const EXCLUDED_DIRECTORIES = [
  'packages/react/',
  'apps/storybook-react/',
  'visual-baselines/',
  'docs/',
  '.changeset/',
  '.agents/',
  '.claude/',
  'scripts/',
]

/** Directories inside the excluded ones that the Storybook build runs. */
const KEPT_DIRECTORIES = ['scripts/component-docs/']

/** Whether a tracked path can change the component page records. */
export function isRecordInput(path) {
  if (
    EXCLUDED_DIRECTORIES.some((directory) => path.startsWith(directory)) &&
    !KEPT_DIRECTORIES.some((directory) => path.startsWith(directory))
  ) {
    return false
  }
  if (path.toLowerCase().endsWith('.md')) {
    return MARKDOWN_KEPT_UNDER.some((directory) => path.startsWith(directory))
  }
  return true
}

/**
 * The cache key for `git ls-files --stage` entries, each
 * `<mode> <blob> <stage>\t<path>`.
 */
export function recordsKey(stagedEntries) {
  const hash = createHash('sha256')
  for (const entry of [...stagedEntries].sort()) {
    const path = entry.slice(entry.indexOf('\t') + 1)
    if (isRecordInput(path)) hash.update(`${entry}\n`)
  }
  return `component-pages-records-${KEY_VERSION}-${hash.digest('hex')}`
}

function stagedEntries(repositoryRoot) {
  return execFileSync('git', ['ls-files', '--stage', '-z'], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
    .split('\0')
    .filter(Boolean)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  console.log(recordsKey(stagedEntries(repositoryRoot)))
}
