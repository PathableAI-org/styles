#!/usr/bin/env node

/**
 * Pixel visual-regression suite for the styles Storybook.
 *
 * Runs the Storybook test-runner against the built styles Storybook with a
 * capture plan, so its postVisit hook (apps/storybook/.storybook/pixels.js)
 * screenshots each planned story and compares it with the committed baselines
 * through jest-image-snapshot. Everything runs in the pinned Playwright
 * container. The mechanism, the story rule and the commands are in
 * docs/testing/visual-regression.md.
 *
 *   node packages/styles/scripts/test-pixels.mjs                  compare
 *   node packages/styles/scripts/test-pixels.mjs --update --component icon-button
 *   node packages/styles/scripts/test-pixels.mjs --no-container   compare on the host
 */

import { spawn } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs'
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
 * Story entries: each canonical story with baselines and its
 * renderer-independent `<component>/<state>` key (the baseline directory, not
 * derived from the story ID, so a React capture of the same state can share
 * it). One image per viewport; which stories get an entry is in the docs.
 */
const STORIES = [
  {
    id: 'interaction-controls-iconbutton--all-variants',
    key: 'icon-button/all-variants',
  },
  {
    id: 'interaction-controls-icon-tile--all-variants',
    key: 'icon-tile/all-variants',
  },
  // The aggregate: rest with the focus ring, selected, natively disabled and
  // aria-disabled side by side, so the two disabled forms are compared.
  // `state-precedence` (selected-and-disabled, and the loading spinner) is
  // not compared yet: its spinner renders wrongly until #275 is fixed.
  {
    id: 'interaction-controls-interaction-states--all-states',
    key: 'interaction-states/all-states',
  },
  // OptionalFormSection has no aggregate story. Collapsed (`default`) shows
  // the button, its focus outline and the down indicator at every viewport.
  {
    id: 'components-form-controls-optional-form-section--default',
    key: 'optional-form-section/default',
  },
  // Expanded has rules of its own: the button's square bottom corners, the
  // rotated indicator and the content region's border and padding.
  {
    id: 'components-form-controls-optional-form-section--expanded',
    key: 'optional-form-section/expanded',
  },
  // Content pressure: a wrapping heading shows the button's gap, the
  // indicator's `flex: 0 0 auto` and `overflow-wrap`, which a one-line heading
  // does not exercise; its play function asserts only the absence of overflow.
  {
    id: 'components-form-controls-optional-form-section--narrow',
    key: 'optional-form-section/narrow',
  },
  // Integration toolbar: stroke-only (fill="none") icons on the bare, subtle
  // and bordered icon-button surfaces, which the filled icons of IconButton
  // `all-variants` do not show. The play function asserts the shapes stay
  // unfilled (#278); this image adds what an assertion cannot name: stroke
  // weight, line caps, and icon size and position in each surface. The
  // full-composition story has no baseline while its segmented control lacks
  // its gap (#277).
  {
    id: 'interaction-controls-integration--toolbar-panel',
    key: 'integration/toolbar-panel',
  },
  // Input, Select and Textarea have no aggregate story. Each KeyboardFocus
  // story renders one labelled field as the only control, so the capture's Tab
  // shows its brand focus ring (#282) beside its label. Desktop only: the
  // focus rule has no viewport dependency, and the controls' mobile
  // min-height rule is outside that fix.
  {
    id: 'components-form-controls-input--keyboard-focus',
    key: 'input/keyboard-focus',
  },
  {
    id: 'components-form-controls-select--keyboard-focus',
    key: 'select/keyboard-focus',
  },
  {
    id: 'components-form-controls-textarea--keyboard-focus',
    key: 'textarea/keyboard-focus',
  },
  // FormRow aggregate: control alignment under uneven hints, side by side at
  // desktop and stacked below 1024 px, with the first control (a select)
  // showing its focus ring.
  {
    id: 'components-form-controls-form-row--default',
    key: 'form-row/default',
  },
  // FilterableOptionList main story: the filter input (focused), the bounded
  // option region and the status line.
  {
    id: 'components-form-controls-filterable-option-list--default',
    key: 'filterable-option-list/default',
  },
  // The only canonical story with checked checkboxes outside forced colors.
  {
    id: 'components-form-controls-filterable-option-list--selected',
    key: 'filterable-option-list/selected',
  },
  // The `__empty` message rule, which no other baseline shows.
  {
    id: 'components-form-controls-filterable-option-list--empty',
    key: 'filterable-option-list/empty',
  },
  // Modal has no aggregate story. `open` shows the overlay, the centred
  // dialog, the content padding on every side and the close button in its
  // top-right corner; it is the first control, so the capture's Tab shows its
  // focus ring. Its image also shows the open outline-button defect (#287),
  // accepted by the maintainer for #285; its fix updates it.
  { id: 'components-communication-modal--open', key: 'modal/open' },
  // Narrow (mobile) is the only state where the overlay's padding, not the
  // dialog's max-width, sets the dialog width; it must still fit the viewport
  // (#286). Its image also shows #287 and the stacked footer buttons
  // touching with no gap, accepted by the maintainer for #286.
  {
    id: 'components-communication-modal--narrow',
    key: 'modal/narrow',
  },
  // Long content: a dialog taller than the viewport sits at the top of the
  // scrolling overlay (padding plus dialog margin) instead of centring.
  {
    id: 'components-communication-modal--long-content',
    key: 'modal/long-content',
  },
]

/** Components whose baselines are enforced. Only these are compared. */
const ROLLOUT = [
  'filterable-option-list',
  'form-row',
  'icon-button',
  'icon-tile',
  'integration',
  'input',
  'interaction-states',
  'modal',
  'optional-form-section',
  'select',
  'textarea',
]

// ---------------------------------------------------------------------------

// pnpm forwards a `--` separator to the script; it carries no meaning here.
const args = process.argv.slice(2).filter((arg) => arg !== '--')
const { values } = parseArgs({
  args,
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
// The container uses the host's node_modules, so the host must be Linux.
if (process.env.PIXELS_IN_CONTAINER !== '1' && !values['no-container']) {
  if (process.platform !== 'linux') {
    fail(
      'The pinned container needs a Linux host, because it uses the installed node_modules. On macOS or Windows, take baselines from CI (docs/testing/visual-regression.md).',
    )
  }
  const { version } = JSON.parse(
    readFileSync(join(ROOT, 'node_modules/playwright/package.json'), 'utf8'),
  )
  const image = `mcr.microsoft.com/playwright:v${version}-noble`
  const daemon = await run('docker', ['info'], { stdio: 'ignore' }).catch(
    () => 1,
  )
  if (daemon !== 0) {
    fail(
      'The Docker daemon is not reachable. Docker may be installed with its daemon stopped, as in Claude Code cloud sessions: start it with `(nohup dockerd > /tmp/dockerd.log 2>&1 &)`, wait for `docker info` to succeed, and run this again. Do not take baselines from CI artifacts on a Linux host. See "In a Claude Code cloud session" in docs/testing/visual-regression.md.',
    )
  }
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
    ...args,
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
  (sum, story) => sum + visualViewportNames(modes.get(story.id)).length,
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
      visualViewportNames(modes.get(story.id)).map((viewport) =>
        join(BASELINE_DIR, story.key, `${viewport}.png`),
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
        viewports: visualViewportNames(modes.get(story.id)).map((name) => ({
          name,
          ...VIEWPORTS[name],
        })),
      },
    ]),
  ),
}

const capturedLog = join(RESULTS_DIR, 'captured.txt')
rmSync(capturedLog, { force: true })
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

// A story the test-runner skipped (for example through a tag) would pass with
// nothing compared, so check that every planned capture ran.
const captured = new Set(
  existsSync(capturedLog) ? readFileSync(capturedLog, 'utf8').split('\n') : [],
)
const missing = planned.flatMap((story) =>
  plan.stories[story.id].viewports
    .map(({ name }) => `${story.key}/${name}`)
    .filter((capture) => !captured.has(capture)),
)
console.log(`\n${summary.join('\n')}`)
console.log(
  `Captures run: ${[...captured].filter(Boolean).length}${values.update ? ` (update: ${selected.join(', ')})` : ''}.`,
)
if (missing.length > 0) {
  console.error(
    `\n✗ Planned captures that did not run:\n  ${missing.join('\n  ')}`,
  )
  code = 1
}
if (code !== 0)
  console.log(`\nDiff and received images: ${relative(ROOT, RESULTS_DIR)}/`)
process.exit(code)
