/**
 * Pixel visual-regression captures for the Storybook test-runner.
 *
 * Active only when `packages/styles/scripts/test-pixels.mjs` runs the
 * test-runner with a capture plan in `PIXELS_PLAN`; it is the only supported
 * entry point (docs/testing/visual-regression.md). After the test-runner has
 * rendered a planned story and run its play function, `capturePixels` takes a
 * full-page screenshot at each planned viewport and condition and compares it
 * with the committed baseline through jest-image-snapshot.
 */

import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

const plan = process.env.PIXELS_PLAN
  ? JSON.parse(process.env.PIXELS_PLAN)
  : null

export const pixelMode = Boolean(plan)

// The test-runner runs this file inside Jest, which provides `expect` as a
// global; @jest/globals cannot be imported here because the configuration is
// loaded as native ESM.
const jestExpect = () => globalThis.expect

export function setupPixels() {
  jestExpect().extend({ toMatchImageSnapshot })
}

const CONDITIONS = {
  default: { expect: { focusOnBody: true } },
  'forced-colors': {
    apply: (page) => page.emulateMedia({ forcedColors: 'active' }),
    expect: { forcedColors: true, focusOnBody: true },
  },
  'reduced-motion': {
    apply: (page) => page.emulateMedia({ reducedMotion: 'reduce' }),
    expect: { reducedMotion: true, focusOnBody: true },
  },
  // The browser's text-size setting at 200 %, through a DevTools session that
  // stays attached until the capture is done (detaching drops the override).
  'text-200': {
    apply: (_page, session) =>
      session.send('Page.setFontSizes', {
        fontSizes: { standard: 32, fixed: 26 },
      }),
    expect: { defaultFontSize: '32px', focusOnBody: true },
  },
  // A real keyboard Tab from the document start focuses the first interactive
  // control, so the browser applies :focus-visible itself.
  'focus-visible': {
    apply: (page) => page.keyboard.press('Tab'),
    expect: { focusOnBody: false, focusVisible: true },
  },
}

async function resetFocus(page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    document.activeElement?.blur()
    // Focusing the body moves the sequential focus navigation starting point
    // to the document start, so focus left by the play function is dropped.
    const { body } = document
    body.setAttribute('tabindex', '-1')
    body.focus({ preventScroll: true })
    body.removeAttribute('tabindex')
    body.blur()
  })
}

function readState(page) {
  return page.evaluate(() => {
    const probe = document.createElement('div')
    probe.style.fontSize = 'medium'
    document.body.append(probe)
    const defaultFontSize = getComputedStyle(probe).fontSize
    probe.remove()
    const active = document.activeElement
    return {
      forcedColors: matchMedia('(forced-colors: active)').matches,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      defaultFontSize,
      focusOnBody: !active || active === document.body,
      focusVisible: Boolean(active?.matches(':focus-visible')),
    }
  })
}

async function capture(page, viewport, condition) {
  const variant = CONDITIONS[condition]
  const session = await page.context().newCDPSession(page)
  try {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    })
    await resetFocus(page)
    await variant.apply?.(page, session)

    const state = await readState(page)
    const wrong = Object.entries(variant.expect).filter(
      ([name, value]) => state[name] !== value,
    )
    if (wrong.length > 0) {
      throw new Error(
        `Condition "${condition}" is not in effect: ${JSON.stringify(state)}`,
      )
    }

    return await page.screenshot({
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    })
  } finally {
    await page.emulateMedia({
      forcedColors: 'none',
      reducedMotion: 'no-preference',
    })
    await session.detach()
  }
}

export async function capturePixels(page, context) {
  const story = plan.stories[context.id]
  if (!story) return

  const baselineDir = join(plan.baselineDir, story.key)
  const resultsDir = join(plan.resultsDir, story.key)
  const failures = []

  for (const viewport of story.viewports) {
    for (const condition of story.conditions) {
      const identifier = `${viewport.name}-${condition}`
      try {
        const image = await capture(page, viewport, condition)

        // jest-image-snapshot fails a missing baseline without saving the
        // capture. Save it, so a new baseline can be taken from CI's artifact.
        const baseline = join(baselineDir, `${identifier}.png`)
        if (!plan.update && !existsSync(baseline)) {
          mkdirSync(resultsDir, { recursive: true })
          writeFileSync(join(resultsDir, `${identifier}-received.png`), image)
        }

        jestExpect()(image).toMatchImageSnapshot({
          customSnapshotsDir: baselineDir,
          customSnapshotIdentifier: identifier,
          customDiffDir: resultsDir,
          storeReceivedOnFailure: true,
          customReceivedDir: resultsDir,
          failureThreshold: 0,
          customDiffConfig: { threshold: plan.threshold },
        })
      } catch (error) {
        failures.push(`${story.key} ${identifier}: ${error.message}`)
      } finally {
        // test-pixels.mjs checks that every planned capture ran.
        mkdirSync(plan.resultsDir, { recursive: true })
        appendFileSync(
          join(plan.resultsDir, 'captured.txt'),
          `${story.key}/${identifier}\n`,
        )
      }
    }
  }

  if (failures.length > 0) throw new Error(failures.join('\n\n'))
}
