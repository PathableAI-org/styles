/**
 * Pixel visual-regression captures for one workspace, generated from its
 * configuration in `workspaces.mjs`. Run through `run.mjs`; see
 * docs/testing/visual-regression.md.
 */

import { expect, test } from '@playwright/test'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import {
  CONDITIONS,
  REPOSITORY_ROOT,
  SCREENSHOT_OPTIONS,
  planCaptures,
  prepareStory,
} from './harness.mjs'
import { getWorkspace } from './workspaces.mjs'

const workspace = getWorkspace(process.env.VISUAL_WORKSPACE)
const components = (process.env.VISUAL_COMPONENTS ?? '')
  .split(',')
  .filter(Boolean)
const captures = planCaptures(workspace, { components })

const updating = process.env.VISUAL_UPDATE === '1'

for (const capture of captures) {
  test(capture.title, async ({ page }, testInfo) => {
    await prepareStory(page, capture)

    // With updates off, Playwright fails a missing baseline without rendering
    // it. Record the capture as an -actual.png image instead, so a
    // contributor without Docker can take a new baseline from the CI artifact.
    if (!updating && !existsSync(join(REPOSITORY_ROOT, capture.baseline))) {
      const [component, state, file] = capture.snapshotName
      const actual = testInfo.outputPath(
        component,
        state,
        file.replace(/\.png$/, '-actual.png'),
      )
      await mkdir(dirname(actual), { recursive: true })
      const {
        threshold: _t,
        maxDiffPixels: _m,
        ...options
      } = SCREENSHOT_OPTIONS
      await writeFile(actual, await page.screenshot(options))
      throw new Error(
        `No baseline at ${capture.baseline}. This run's capture is at ${actual}.`,
      )
    }

    await expect(page).toHaveScreenshot(capture.snapshotName, {
      fullPage: SCREENSHOT_OPTIONS.fullPage,
    })
  })
}

// Every condition's emulation must take effect, including conditions that no
// rollout story uses yet, so a later baseline is never recorded under an
// emulation that silently failed. Compares no pixels. Each check uses the
// first capture whose story lists the condition, or else the first capture;
// focus-visible is checked only on a story that lists it, because it needs an
// interactive control.
if (!updating && captures.length > 0) {
  for (const condition of Object.keys(CONDITIONS)) {
    const listed = captures.find((c) => c.condition === condition)
    const target = listed ?? captures[0]
    test(`harness: condition ${condition} takes effect`, async ({ page }) => {
      test.skip(
        condition === 'focus-visible' && !listed,
        'No planned story lists focus-visible.',
      )
      await prepareStory(page, { ...target, condition })
    })
  }
}
