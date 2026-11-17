#!/usr/bin/env node

/**
 * Run a workspace's pixel visual-regression suite in the pinned container.
 *
 * Usage (from the repository root, after building the workspace's Storybook):
 *
 *   node scripts/visual-regression/run.mjs --workspace styles
 *   node scripts/visual-regression/run.mjs --workspace styles --update --component icon-button
 *   node scripts/visual-regression/run.mjs --workspace styles --update --all
 *   node scripts/visual-regression/run.mjs --workspace styles --no-container
 *
 * Without --no-container the script re-runs itself inside the pinned
 * Playwright image with Docker, with the repository mounted at the same path,
 * no network, and the caller's user ID, so baselines written there are owned
 * by the caller. --no-container compares on the host browser instead; its
 * results may differ from the baselines and it cannot update them.
 *
 * See docs/testing/visual-regression.md.
 */

import { spawn } from 'node:child_process'
import { access } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { parseArgs } from 'node:util'

import { startServer } from '../../packages/styles/scripts/quality-gates.mjs'
import {
  REPOSITORY_ROOT,
  containerImage,
  coverageSummary,
  findUnusedBaselines,
  planCaptures,
  validateWorkspace,
} from './harness.mjs'
import { getWorkspace } from './workspaces.mjs'

const IN_CONTAINER = process.env.VISUAL_REGRESSION_IN_CONTAINER === '1'

function fail(message) {
  console.error(`\n✗ ${message}`)
  process.exit(1)
}

function run(command, args, env = process.env) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {
      cwd: REPOSITORY_ROOT,
      env,
      stdio: 'inherit',
    })
    child.once('error', rejectRun)
    child.once('close', (code, signal) => resolveRun(signal ? 1 : code))
  })
}

const { values } = parseArgs({
  options: {
    workspace: { type: 'string' },
    update: { type: 'boolean', default: false },
    component: { type: 'string', multiple: true, default: [] },
    all: { type: 'boolean', default: false },
    'no-container': { type: 'boolean', default: false },
  },
})

const workspace = getWorkspace(values.workspace)
const problems = validateWorkspace(workspace)
if (problems.length > 0) {
  fail(
    `scripts/visual-regression/workspaces.mjs is invalid:\n  ${problems.join('\n  ')}`,
  )
}

const components = values.component.flatMap((c) => c.split(',')).filter(Boolean)
if (values.update && components.length === 0 && !values.all) {
  fail(
    'An update needs --component <key> (for example --component icon-button), or --all to update every rollout component.',
  )
}
const knownComponents = new Set(
  workspace.stories.map((s) => s.key.split('/')[0]),
)
for (const component of components) {
  if (!knownComponents.has(component)) {
    fail(
      `Component "${component}" has no story entries in the ${workspace.name} workspace configuration.`,
    )
  }
}

if (!IN_CONTAINER && !values['no-container']) {
  const image = containerImage()
  console.log(`Running in the pinned container ${image}\n`)
  const forwarded = process.argv.slice(2)
  const code = await run('docker', [
    'run',
    '--rm',
    '--init',
    '--ipc=host',
    '--network=none',
    `--user=${process.getuid()}:${process.getgid()}`,
    '--env=HOME=/tmp',
    '--env=VISUAL_REGRESSION_IN_CONTAINER=1',
    ...(process.env.CI ? ['--env=CI'] : []),
    `--volume=${REPOSITORY_ROOT}:${REPOSITORY_ROOT}`,
    `--workdir=${REPOSITORY_ROOT}`,
    image,
    'node',
    'scripts/visual-regression/run.mjs',
    ...forwarded,
  ]).catch((error) =>
    fail(
      `Could not start Docker (${error.message}). Install Docker, or see docs/testing/visual-regression.md for running without it.`,
    ),
  )
  process.exit(code)
}

if (!IN_CONTAINER) {
  if (values.update) {
    fail(
      'Baselines can only be updated inside the pinned container, so local and CI captures match. Drop --no-container, or see docs/testing/visual-regression.md for updating without Docker.',
    )
  }
  console.warn(
    'Warning: comparing outside the pinned container. Differences may come from the host browser and fonts, not from the change.\n',
  )
}

const staticDirectory = join(REPOSITORY_ROOT, workspace.staticDirectory)
await access(join(staticDirectory, 'iframe.html')).catch(() =>
  fail(
    `No built Storybook at ${workspace.staticDirectory}. Build it first (for styles: pnpm build:docs).`,
  ),
)

const summary = coverageSummary(workspace)
console.log(summary.join('\n'))

if (!values.update) {
  const unused = findUnusedBaselines(workspace)
  if (unused.length > 0) {
    fail(
      `Baselines that no rollout capture compares (stale, or for a component not on the rollout list):\n  ${unused.join('\n  ')}`,
    )
  }
}

const selected = values.all ? [] : components
const captures = planCaptures(workspace, { components: selected })
if (values.update) {
  const names = selected.length ? selected : workspace.rollout
  console.log(
    `Updating ${captures.length} baseline capture(s) for: ${names.join(', ')}`,
  )
  const offRollout = names.filter((name) => !workspace.rollout.includes(name))
  if (offRollout.length > 0) {
    console.log(
      `Not on the rollout list yet, so not compared until added: ${offRollout.join(', ')}`,
    )
  }
}
console.log('')

const server = await startServer({
  staticDir: staticDirectory,
  port: workspace.port,
})
const require = createRequire(import.meta.url)
let code
try {
  code = await run(
    process.execPath,
    [
      require.resolve('@playwright/test/cli'),
      'test',
      '--config',
      'scripts/visual-regression/playwright.config.mjs',
    ],
    {
      ...process.env,
      VISUAL_WORKSPACE: workspace.name,
      VISUAL_BASE_URL: `http://127.0.0.1:${workspace.port}`,
      VISUAL_COMPONENTS: selected.join(','),
      VISUAL_UPDATE: values.update ? '1' : '0',
    },
  )
} finally {
  server.close()
}

console.log(`\n${summary.join('\n')}`)
if (code !== 0) {
  console.log(
    `\nExpected, actual and diff images for each failing capture: ${workspace.resultsDirectory}/`,
  )
}
process.exit(code)
