import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, matchesGlob } from 'node:path'
import { test } from 'node:test'

import { repoRoot } from './affected.mjs'
import { INPUT_GLOBS } from './select.mjs'

// The styles package's YAML parser, as the component-page scripts use.
const { parse } = createRequire(join(repoRoot, 'packages/styles/package.json'))(
  'yaml',
)

test('the Fixtures workflow runs on every path the selection reads', () => {
  const workflow = parse(
    readFileSync(join(repoRoot, '.github/workflows/fixtures.yml'), 'utf8'),
  )
  const triggers = workflow.on.pull_request.paths
  const missing = INPUT_GLOBS.filter((glob) => !triggers.includes(glob))
  assert.deepEqual(
    missing,
    [],
    `add these to pull_request.paths in fixtures.yml: ${missing.join(', ')}`,
  )
})

test('the Fixtures workflow runs for the folder list and the lockfile', () => {
  const workflow = parse(
    readFileSync(join(repoRoot, '.github/workflows/fixtures.yml'), 'utf8'),
  )
  const triggers = workflow.on.pull_request.paths
  for (const path of ['fixtures/folders.json', 'pnpm-lock.yaml']) {
    assert.ok(
      triggers.some((glob) => matchesGlob(path, glob)),
      `no pull_request.paths entry in fixtures.yml matches ${path}`,
    )
    assert.ok(
      INPUT_GLOBS.some((glob) => matchesGlob(path, glob)),
      `INPUT_GLOBS in select.mjs does not cover ${path}`,
    )
  }
})
