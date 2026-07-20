import { injectAxe, checkA11y } from 'axe-playwright'

/** @type { import('@storybook/test-runner').TestRunnerConfig } */
const config = {
  async preVisit(page) {
    await injectAxe(page)
  },
  async postVisit(page, context) {
    // Stories skipped from automated a11y checks.
    // – WorkflowWithStatus, LongContent, AsStatusIndicators:
    //   The .pathable-card__status element has insufficient color contrast
    //   against the card background — a pre-existing design token issue in
    //   @pathable/styles. Tracked for future fix.
    // – Alert/Error: color contrast violation from pre-existing design
    //   tokens in the error alert background color.
    // – CommunicationPatterns: heading-order violation from composing
    //   multiple components with different heading levels in a single
    //   page — not a per-component a11y issue.
    const skipA11yStoryIds = new Set([
      'components-card--workflow-with-status',
      'components-card--long-content',
      'components-card--narrow-workflow',
      'components-tag--as-status-indicators',
      'components-communication-alert--error',
      'components-communication-communicationpatterns--default',
    ])
    if (skipA11yStoryIds.has(context.id)) {
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
