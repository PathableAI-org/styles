#!/usr/bin/env node

/**
 * Pixel visual-regression suite for the styles Storybook.
 *
 * Runs the Storybook test-runner against the built styles Storybook with a
 * capture plan, so its postVisit hook (apps/storybook/.storybook/pixels.js)
 * screenshots each planned story and compares it with the committed baselines
 * through jest-image-snapshot. Everything runs in the pinned Playwright
 * container. The mechanism, the condition rule and the commands are in
 * docs/testing/visual-regression.md.
 *
 *   node packages/styles/scripts/test-pixels.mjs                  compare
 *   node packages/styles/scripts/test-pixels.mjs --update --component icon-button
 *   node packages/styles/scripts/test-pixels.mjs --no-container   compare on the host
 */

import { spawn } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { parseArgs } from 'node:util'

import {
  CANONICAL_STORIES,
  VIEWPORTS,
  startServer,
  visualViewportNames,
} from './quality-gates.mjs'

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const WORKSPACE = 'styles'
const ROOT = resolve(import.meta.dirname, '../../..')
const STATIC_DIR = join(ROOT, 'apps/storybook/storybook-static')
const BASELINE_DIR = join(ROOT, 'visual-baselines', WORKSPACE)
const RESULTS_DIR = join(ROOT, 'apps/storybook/test-results/pixels')
const PORT = 6014

/**
 * Per-pixel colour distance (0 to 1) below which two pixels count as equal.
 * At 0.01 a uniform shift of about 3/255 per channel already differs. No
 * differing pixel is allowed; anti-aliased edge pixels are not counted.
 */
const THRESHOLD = 0.01

/**
 * Story entries: each canonical story with baselines, its
 * renderer-independent `<component>/<state>` key (the baseline directory, not
 * derived from the story ID, so a React capture of the same state can share
 * it) and its conditions, chosen by the rule in the docs.
 */
const STORIES = [
  {
    id: 'interaction-controls-iconbutton--all-variants',
    key: 'icon-button/all-variants',
    // forced-colors: variants differ by colour, background and border, and
    // the component has forced-colors rules. focus-visible: interactive.
    // Not text-200: icon-only and sized in px. Not reduced-motion: its only
    // motion rule removes transitions, which a still capture never shows.
    conditions: ['default', 'forced-colors', 'focus-visible'],
  },
]

/** Components whose baselines are enforced. Only these are compared. */
const ROLLOUT = ['icon-button']

// ---------------------------------------------------------------------------

const { values } = parseArgs({
  options: {
    update: { type: 'boolean', default: false },
    component: { type: 'string', multiple: true, default: [] },
    'no-container': { type: 'boolean', default: false },
  },
})

function fail(message) {
  console.error(`\n✗ ${message}`)
  process.exit(1)
}

function run(command, args, options = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options })
    child.once('error', rejectRun)
    child.once('close', (code, signal) => resolveRun(signal ? 1 : code))
  })
}

const componentOf = (story) => story.key.split('/')[0]

if (values.update && values.component.length === 0) {
  fail(
    'An update needs --component <key>, for example --component icon-button.',
  )
}
for (const component of values.component) {
  if (!STORIES.some((story) => componentOf(story) === component)) {
    fail(
      `Component "${component}" has no story entries in ${relative(ROOT, import.meta.filename)}.`,
    )
  }
}

// Re-run inside the pinned image, whose tag is the lockfile's Playwright
// version, so the browser matches the library and local and CI captures agree.
if (process.env.PIXELS_IN_CONTAINER !== '1' && !values['no-container']) {
  const { version } = JSON.parse(
    readFileSync(join(ROOT, 'node_modules/playwright/package.json'), 'utf8'),
  )
  const image = `mcr.microsoft.com/playwright:v${version}-noble`
  console.log(`Running in the pinned container ${image}\n`)
  const code = await run('docker', [
    'run',
    '--rm',
    '--init',
    '--ipc=host',
    '--network=none',
    `--user=${process.getuid()}:${process.getgid()}`,
    '--env=HOME=/tmp',
    '--env=PIXELS_IN_CONTAINER=1',
    `--volume=${ROOT}:${ROOT}`,
    `--workdir=${ROOT}`,
    image,
    'node',
    relative(ROOT, import.meta.filename),
    ...process.argv.slice(2),
  ]).catch((error) =>
    fail(
      `Could not start Docker (${error.message}). See docs/testing/visual-regression.md.`,
    ),
  )
  process.exit(code)
}
if (process.env.PIXELS_IN_CONTAINER !== '1') {
  if (values.update)
    fail(
      'Baselines can only be updated in the pinned container. Drop --no-container.',
    )
  console.warn(
    'Warning: comparing outside the pinned container; differences may come from the host.\n',
  )
}

if (!existsSync(join(STATIC_DIR, 'index.json'))) {
  fail('No built styles Storybook. Run pnpm build:docs first.')
}

// ---------------------------------------------------------------------------
// Plan and coverage
// ---------------------------------------------------------------------------

const selected = values.component.length > 0 ? values.component : ROLLOUT
const planned = STORIES.filter((story) => selected.includes(componentOf(story)))
const modes = new Map(CANONICAL_STORIES.map((story) => [story.id, story.mode]))
for (const story of STORIES) {
  if (!modes.has(story.id)) fail(`${story.id} is not in CANONICAL_STORIES.`)
}

const enforced = STORIES.filter((story) => ROLLOUT.includes(componentOf(story)))
const captureCount = enforced.reduce(
  (sum, story) =>
    sum +
    visualViewportNames(modes.get(story.id)).length * story.conditions.length,
  0,
)
const summary = [
  `Pixel visual regression (${WORKSPACE}): rollout list: ${ROLLOUT.join(', ')}.`,
  `Comparing ${enforced.length} of ${CANONICAL_STORIES.length} canonical stories (${captureCount} captures): ${enforced.map((story) => story.id).join(', ')}.`,
  `The other ${CANONICAL_STORIES.length - enforced.length} canonical stories, including any other stories of rollout components, have no baselines yet: nothing to compare for them. This is partial coverage, not full coverage.`,
]
console.log(`${summary.join('\n')}\n`)

// A baseline no rollout capture compares is stale or belongs to a component
// not on the rollout list; either way it would never be checked.
if (!values.update) {
  const expected = new Set(
    enforced.flatMap((story) =>
      visualViewportNames(modes.get(story.id)).flatMap((viewport) =>
        story.conditions.map((condition) =>
          join(BASELINE_DIR, story.key, `${viewport}-${condition}.png`),
        ),
      ),
    ),
  )
  const unused = existsSync(BASELINE_DIR)
    ? readdirSync(BASELINE_DIR, { recursive: true })
        .filter((file) => file.endsWith('.png'))
        .map((file) => join(BASELINE_DIR, file))
        .filter((file) => !expected.has(file))
    : []
  if (unused.length > 0) {
    fail(
      `Baselines that no rollout capture compares:\n  ${unused.map((file) => relative(ROOT, file)).join('\n  ')}`,
    )
  }
}

// ---------------------------------------------------------------------------
// Run the test-runner on the planned stories
// ---------------------------------------------------------------------------

// The test-runner writes one test file per component title (the story ID
// before `--`) and takes no story filter, so select the planned stories' files;
// the hook captures only the planned stories in them. (It passes arguments
// through a shell, so the patterns stay free of shell syntax.)
const testFiles = [...new Set(planned.map((story) => story.id.split('--')[0]))]

const plan = {
  baselineDir: BASELINE_DIR,
  resultsDir: RESULTS_DIR,
  threshold: THRESHOLD,
  update: values.update,
  stories: Object.fromEntries(
    planned.map((story) => [
      story.id,
      {
        key: story.key,
        conditions: story.conditions,
        viewports: visualViewportNames(modes.get(story.id)).map((name) => ({
          name,
          ...VIEWPORTS[name],
        })),
      },
    ]),
  ),
}

const server = await startServer({ staticDir: STATIC_DIR, port: PORT })
let code
try {
  code = await run(
    join(ROOT, 'apps/storybook/node_modules/.bin/test-storybook'),
    [
      '--index-json',
      '--url',
      `http://127.0.0.1:${PORT}`,
      '--maxWorkers=1',
      '--disable-telemetry',
      ...(values.update ? ['--updateSnapshot'] : ['--ci']),
      ...testFiles.map((file) => `/${file}.test.js`),
    ],
    {
      cwd: join(ROOT, 'apps/storybook'),
      env: { ...process.env, PIXELS_PLAN: JSON.stringify(plan) },
    },
  )
} finally {
  server.close()
}

console.log(`\n${summary.join('\n')}`)
if (code !== 0)
  console.log(`\nDiff and received images: ${relative(ROOT, RESULTS_DIR)}/`)
process.exit(code)
