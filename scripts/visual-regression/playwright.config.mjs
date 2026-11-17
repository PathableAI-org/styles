/**
 * Playwright Test configuration for the pixel visual-regression suites.
 *
 * Do not run this directly: `run.mjs` (through `pnpm test:pixels-styles`)
 * starts the pinned container and the Storybook server and sets the
 * environment this file reads. See docs/testing/visual-regression.md.
 */

import { defineConfig } from '@playwright/test'
import { join } from 'node:path'

import {
  BASELINE_DIRECTORY,
  CONTEXT_OPTIONS,
  REPOSITORY_ROOT,
  SCREENSHOT_OPTIONS,
} from './harness.mjs'
import { getWorkspace } from './workspaces.mjs'

const workspace = getWorkspace(process.env.VISUAL_WORKSPACE)
const baseURL = process.env.VISUAL_BASE_URL
if (!baseURL) {
  throw new Error(
    'VISUAL_BASE_URL is not set. Run the suite with `pnpm test:pixels-styles`, not `playwright test`.',
  )
}

const { fullPage: _fullPage, ...comparison } = SCREENSHOT_OPTIONS

export default defineConfig({
  testDir: import.meta.dirname,
  testMatch: 'pixels.spec.mjs',
  outputDir: join(REPOSITORY_ROOT, workspace.resultsDirectory),
  snapshotPathTemplate: join(
    REPOSITORY_ROOT,
    BASELINE_DIRECTORY,
    workspace.name,
    '{arg}{ext}',
  ),
  forbidOnly: true,
  retries: 0,
  reporter: [['list']],
  updateSnapshots: process.env.VISUAL_UPDATE === '1' ? 'changed' : 'none',
  expect: { toHaveScreenshot: comparison },
  use: {
    ...CONTEXT_OPTIONS,
    baseURL,
    browserName: 'chromium',
    headless: true,
  },
})
