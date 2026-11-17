/**
 * Pixel visual-regression captures for one workspace, generated from its
 * configuration in `workspaces.mjs`. Run through `run.mjs`; see
 * docs/testing/visual-regression.md.
 */

import { expect, test } from '@playwright/test'

import {
  CONDITIONS,
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

for (const capture of captures) {
  test(capture.title, async ({ page }) => {
    await prepareStory(page, capture)
    await expect(page).toHaveScreenshot(capture.snapshotName, {
      fullPage: SCREENSHOT_OPTIONS.fullPage,
    })
  })
}

// Every condition's emulation must take effect, including conditions that no
// rollout story uses yet, so a later baseline is never recorded under an
// emulation that silently failed. Compares no pixels.
if (process.env.VISUAL_UPDATE !== '1' && captures.length > 0) {
  for (const condition of Object.keys(CONDITIONS)) {
    test(`harness: condition ${condition} takes effect`, async ({ page }) => {
      await prepareStory(page, { ...captures[0], condition })
    })
  }
}
