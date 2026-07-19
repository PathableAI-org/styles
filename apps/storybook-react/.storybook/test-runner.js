import { injectAxe, checkA11y } from 'axe-playwright'

/** @type { import('@storybook/test-runner').TestRunnerConfig } */
const config = {
  async preVisit(page) {
    await injectAxe(page)
  },
  async postVisit(page, context) {
    // Skip stories tagged 'skip-a11y' from automated checks.
    // Only use this tag when a violation is a false positive with
    // documented rationale — never to suppress legitimate issues.
    if (context.tags?.includes('skip-a11y')) {
      return
    }

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        },
        rules: {
          // Storybook renders components in an isolated iframe without
          // page-level landmarks, making the "region" check a persistent
          // false positive for all stories.
          region: { enabled: false },
        },
      },
    })
  },
}

export default config
