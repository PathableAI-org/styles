import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { injectAxe, checkA11y } from 'axe-playwright'

// The test-runner runs with this workspace (apps/storybook) as its working
// directory, from the root scripts and CI alike.
const EXECUTED_DIR = join(process.cwd(), 'test-results/component-pages')

/**
 * Writes what one story did for the component pages check
 * (packages/styles/scripts/check-component-pages.mjs --executed): the
 * guarantee ids whose assertions ran, which the `guarantee` story helper
 * collects on the page, and the `pathable-*` classes the story rendered. The
 * page is reused across stories, so the list is cleared once read.
 */
async function recordExecuted(page, context) {
  const executed = await page.evaluate(() => {
    const guarantees = globalThis.__componentPageGuarantees ?? []
    globalThis.__componentPageGuarantees = []
    const classes = new Set()
    for (const element of document.querySelectorAll(
      '#storybook-root [class]',
    )) {
      for (const name of element.classList) {
        if (name.startsWith('pathable-')) classes.add(name)
      }
    }
    return { guarantees, classes: [...classes].sort() }
  })
  mkdirSync(EXECUTED_DIR, { recursive: true })
  writeFileSync(
    join(EXECUTED_DIR, `${context.id}.json`),
    `${JSON.stringify({ story: context.id, ...executed }, null, 2)}\n`,
  )
}

/** @type { import('@storybook/test-runner').TestRunnerConfig } */
const config = {
  async preVisit(page) {
    await page.setViewportSize({ width: 1280, height: 900 })
    await injectAxe(page)
  },
  async postVisit(page, context) {
    await recordExecuted(page, context)
    await checkA11y(page, 'body', {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        },
        rules: {
          // Components render in Storybook's isolated iframe without page-level
          // landmarks, making the "region" check a persistent false positive.
          region: { enabled: false },
          // Token and utility stories render color swatches, not text. The
          // fixtures axe check (fixtures/harness/axe.mjs) checks contrast for
          // every fixture against the compiled CSS.
          'color-contrast': { enabled: false },
          // USWDS pagination uses a standard <ul> inside <nav aria-label="Pagination">.
          // The "list" rule is over-strict here as the nav label provides adequate
          // context. This is a pre-existing USWDS pattern.
          list: { enabled: false },
          // USWDS pagination uses role="presentation" + aria-label on the ellipsis
          // element. This is a pre-existing USWDS code pattern.
          'presentation-role-conflict': { enabled: false },
          // USWDS combo box uses a bare <select> that gets programmatic labeling via
          // USWDS JavaScript. In Storybook's isolated iframe without JS initialization,
          // no accessible name exists. Pre-existing issue.
          'select-name': { enabled: false },
        },
      },
    })
  },
}

export default config
