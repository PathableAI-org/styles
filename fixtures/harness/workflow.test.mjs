import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
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
