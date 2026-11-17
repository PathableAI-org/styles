/**
 * Shared pixel visual-regression harness.
 *
 * Every workspace suite (the styles Storybook now, the React Storybook later)
 * captures through this module, so both use the same viewports, condition
 * variants, container image, diff threshold, animation and caret settings,
 * canvas framing and baseline naming. A workspace differs only by the
 * configuration in `workspaces.mjs`.
 *
 * The mechanism, the rule for which conditions apply to a story and the
 * commands are documented in docs/testing/visual-regression.md.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  VIEWPORTS,
  visualViewportNames,
} from '../../packages/styles/scripts/quality-gates.mjs'

export { VIEWPORTS }

export const REPOSITORY_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../..',
)

/** Baselines live outside every package's published `files`. */
export const BASELINE_DIRECTORY = 'visual-baselines'

/**
 * The pinned Linux image that renders every capture, locally and in CI. Its
 * tag is the exact Playwright version in the lockfile, so the browser build in
 * the image always matches the Playwright library that drives it, and a
 * Playwright upgrade moves the image with it.
 */
export function containerImage(root = REPOSITORY_ROOT) {
  const manifest = JSON.parse(
    readFileSync(join(root, 'node_modules/playwright/package.json'), 'utf8'),
  )
  return `mcr.microsoft.com/playwright:v${manifest.version}-noble`
}

/**
 * Comparison settings shared by every suite.
 *
 * - `threshold`: per-pixel colour distance (0 to 1, YIQ) below which two
 *   pixels count as equal. At 0.01 a uniform shift of about 3/255 per channel
 *   already counts as different, so a token colour change is caught, while
 *   rounding noise is not.
 * - `maxDiffPixels`: pixels allowed beyond `threshold`. Zero: inside the
 *   pinned container rendering is deterministic. Pixels the comparator
 *   classifies as anti-aliased edges are not counted.
 * - `animations: 'disabled'` finishes finite CSS animations and transitions
 *   and cancels infinite ones; `caret: 'hide'` hides the text caret.
 * - `fullPage`: the canvas framing is the whole story iframe page at the
 *   viewport width, with the Storybook preview's own padding and background
 *   and no harness decorators, so overflow and focus rings at the edge of the
 *   story root are captured.
 */
export const SCREENSHOT_OPTIONS = Object.freeze({
  threshold: 0.01,
  maxDiffPixels: 0,
  animations: 'disabled',
  caret: 'hide',
  scale: 'css',
  fullPage: true,
})

/** Browser context settings shared by every suite. */
export const CONTEXT_OPTIONS = Object.freeze({
  deviceScaleFactor: 1,
  colorScheme: 'light',
  locale: 'en-US',
  timezoneId: 'UTC',
})

const DEFAULT_FONT_SIZE = 16

/**
 * Emulate the browser's text-size setting, as a user who enlarges text does.
 * The DevTools session stays attached for the page's lifetime: detaching it
 * drops the override.
 */
async function setDefaultFontSize(page, standard) {
  const session = await page.context().newCDPSession(page)
  await session.send('Page.setFontSizes', {
    fontSizes: { standard, fixed: Math.round(standard * 0.8125) },
  })
}

/** Read the active emulation state from the page. */
function readEmulation(page) {
  return page.evaluate(() => {
    const probe = document.createElement('div')
    probe.style.fontSize = 'medium'
    document.body.append(probe)
    const fontSize = getComputedStyle(probe).fontSize
    probe.remove()
    const active = document.activeElement
    return {
      forcedColors: matchMedia('(forced-colors: active)').matches,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      defaultFontSize: fontSize,
      focusOnBody: !active || active === document.body,
      focusVisible: Boolean(active && active.matches(':focus-visible')),
    }
  })
}

/**
 * Condition variants. `beforeLoad` runs before navigation so the story renders
 * under the condition from the start; `afterSettle` runs once the story has
 * rendered and its play function has finished; `expect` is the emulation state
 * the capture verifies before every screenshot.
 *
 * Which conditions apply to a story is decided per story in `workspaces.mjs`,
 * by the rule in docs/testing/visual-regression.md.
 */
export const CONDITIONS = Object.freeze({
  default: {
    expect: {
      forcedColors: false,
      reducedMotion: false,
      defaultFontSize: `${DEFAULT_FONT_SIZE}px`,
      focusOnBody: true,
    },
  },
  'forced-colors': {
    beforeLoad: (page) => page.emulateMedia({ forcedColors: 'active' }),
    expect: { forcedColors: true, focusOnBody: true },
  },
  'text-200': {
    beforeLoad: (page) => setDefaultFontSize(page, DEFAULT_FONT_SIZE * 2),
    expect: {
      defaultFontSize: `${DEFAULT_FONT_SIZE * 2}px`,
      focusOnBody: true,
    },
  },
  'reduced-motion': {
    beforeLoad: (page) => page.emulateMedia({ reducedMotion: 'reduce' }),
    expect: { reducedMotion: true, focusOnBody: true },
  },
  'focus-visible': {
    // A real keyboard Tab from the document start focuses the first
    // interactive control, so the browser applies :focus-visible itself.
    afterSettle: (page) => page.keyboard.press('Tab'),
    expect: { focusOnBody: false, focusVisible: true },
  },
})

const KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Check a workspace configuration. Returns a list of problems; an empty list
 * means the configuration is valid.
 */
export function validateWorkspace(workspace) {
  const problems = []
  const canonical = new Map(workspace.canonicalStories.map((s) => [s.id, s]))
  const seenIds = new Set()
  const seenKeys = new Set()

  for (const story of workspace.stories) {
    if (!canonical.has(story.id)) {
      problems.push(`${story.id} is not a canonical story of ${workspace.name}`)
    }
    if (seenIds.has(story.id)) problems.push(`${story.id} is listed twice`)
    seenIds.add(story.id)

    if (!KEY_PATTERN.test(story.key)) {
      problems.push(
        `${story.id}: key "${story.key}" is not "<component>/<state>" in kebab case`,
      )
    }
    if (seenKeys.has(story.key)) problems.push(`key ${story.key} is used twice`)
    seenKeys.add(story.key)

    if (!story.conditions?.length) {
      problems.push(`${story.id} lists no conditions`)
    }
    for (const condition of story.conditions ?? []) {
      if (!CONDITIONS[condition]) {
        problems.push(`${story.id}: unknown condition "${condition}"`)
      }
    }
  }

  const components = new Set(workspace.stories.map((s) => componentOf(s.key)))
  for (const component of workspace.rollout) {
    if (!components.has(component)) {
      problems.push(`rollout component ${component} has no story entries`)
    }
  }

  return problems
}

function componentOf(key) {
  return key.split('/')[0]
}

/** The baseline path, relative to the repository root, for one capture. */
export function baselinePath(workspaceName, key, viewport, condition) {
  return [
    BASELINE_DIRECTORY,
    workspaceName,
    key,
    `${viewport}-${condition}.png`,
  ].join('/')
}

/**
 * List the captures for a workspace. By default only components on the
 * rollout list are planned; `components` narrows or (for an update) names the
 * components to capture instead.
 */
export function planCaptures(workspace, { components } = {}) {
  const selected = new Set(components?.length ? components : workspace.rollout)
  const modes = new Map(workspace.canonicalStories.map((s) => [s.id, s.mode]))
  const captures = []

  for (const story of workspace.stories) {
    const component = componentOf(story.key)
    if (!selected.has(component)) continue

    for (const viewport of visualViewportNames(modes.get(story.id))) {
      for (const condition of story.conditions) {
        const [, state] = story.key.split('/')
        captures.push({
          storyId: story.id,
          key: story.key,
          component,
          viewport,
          condition,
          title: `${story.key} ${viewport} ${condition}`,
          snapshotName: [component, state, `${viewport}-${condition}.png`],
          baseline: baselinePath(
            workspace.name,
            story.key,
            viewport,
            condition,
          ),
        })
      }
    }
  }

  return captures
}

/**
 * Baselines on disk that no rollout capture compares. They are stale (a
 * removed story, viewport or condition) or belong to a component that is not
 * yet on the rollout list; either way they would never be checked.
 */
export function findUnusedBaselines(workspace, root = REPOSITORY_ROOT) {
  const directory = join(root, BASELINE_DIRECTORY, workspace.name)
  const expected = new Set(planCaptures(workspace).map((c) => c.baseline))
  return listPngFiles(directory)
    .map((file) => relative(root, file).split(sep).join('/'))
    .filter((file) => !expected.has(file))
}

function listPngFiles(directory) {
  let entries
  try {
    entries = readdirSync(directory, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
  return entries.flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return listPngFiles(path)
    return entry.name.endsWith('.png') ? [path] : []
  })
}

/**
 * Lines stating what the suite compares and what it does not, so partial
 * coverage is never mistaken for full coverage.
 */
export function coverageSummary(workspace) {
  const captures = planCaptures(workspace)
  const compared = [...new Set(captures.map((c) => c.storyId))]
  const total = workspace.canonicalStories.length
  const uncovered = total - compared.length
  return [
    `Pixel visual regression (${workspace.name}): rollout list: ${workspace.rollout.join(', ')}.`,
    `Comparing ${compared.length} of ${total} canonical stories (${captures.length} captures): ${compared.join(', ')}.`,
    `The other ${uncovered} canonical stories, including any other stories of rollout components, have no baselines yet: nothing to compare for them. This is partial coverage, not full coverage.`,
  ]
}

/**
 * Open a story and bring it to the state a capture records.
 *
 * 1. Size the viewport and apply the condition's emulation before navigation.
 * 2. Load the story iframe and wait for Storybook to finish rendering it and
 *    running its play function. Play-function assertions are the
 *    test-runner's job; under an emulated condition they may fail, which does
 *    not stop the capture, but a render error does.
 * 3. Wait for web fonts, then return focus to the document body, as after a
 *    page load, so focus left by the play function is not captured.
 * 4. Run the condition's after-settle step and verify the emulation state.
 */
export async function prepareStory(page, { storyId, viewport, condition }) {
  const variant = CONDITIONS[condition]
  if (!variant) throw new Error(`Unknown condition "${condition}"`)

  await page.setViewportSize(VIEWPORTS[viewport])
  await page.mouse.move(0, 0)
  await variant.beforeLoad?.(page)

  await page.goto(
    `/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`,
  )
  await page.waitForFunction(
    () =>
      ['finished', 'errored', 'aborted'].includes(
        globalThis.__STORYBOOK_PREVIEW__?.currentRender?.phase,
      ),
    null,
    { timeout: 30_000 },
  )

  const render = await page.evaluate(() => ({
    phase: globalThis.__STORYBOOK_PREVIEW__.currentRender.phase,
    errorShown: document.body.classList.contains('sb-show-errordisplay'),
    empty: !document.getElementById('storybook-root')?.innerHTML.trim(),
  }))
  if (render.phase !== 'finished' || render.errorShown || render.empty) {
    throw new Error(
      `Story ${storyId} did not render cleanly: ${JSON.stringify(render)}`,
    )
  }

  await page.evaluate(async () => {
    await document.fonts.ready
    document.activeElement?.blur()
    // Focusing the body resets the sequential focus navigation starting
    // point to the document start; the attribute is removed straight away.
    const { body } = document
    body.setAttribute('tabindex', '-1')
    body.focus({ preventScroll: true })
    body.removeAttribute('tabindex')
    body.blur()
  })

  await variant.afterSettle?.(page)

  const state = await readEmulation(page)
  const mismatches = Object.entries(variant.expect).filter(
    ([name, value]) => state[name] !== value,
  )
  if (mismatches.length > 0) {
    throw new Error(
      `Condition "${condition}" is not in effect for ${storyId}: expected ${JSON.stringify(
        Object.fromEntries(mismatches),
      )}, got ${JSON.stringify(state)}`,
    )
  }
}
