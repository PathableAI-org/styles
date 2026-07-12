import { injectAxe, checkA11y } from 'axe-playwright'

/** @type { import('@storybook/test-runner').TestRunnerConfig } */
const config = {
  async preVisit(page) {
    await injectAxe(page)
  },
  async postVisit(page) {
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
          // USWDS pagination uses a standard <ul> inside <nav aria-label="Pagination">.
          // The "list" rule is over-strict here as the nav label provides adequate
          // context. This is a pre-existing USWDS pattern.
          list: { enabled: false },
          // USWDS pagination uses role="presentation" + aria-label on the ellipsis
          // element. This is a pre-existing USWDS code pattern.
          'presentation-role-conflict': { enabled: false },
        },
      },
    })
  },
}

export default config
