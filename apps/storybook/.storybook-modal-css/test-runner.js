import { injectAxe, checkA11y } from 'axe-playwright'

/** @type { import('@storybook/test-runner').TestRunnerConfig } */
const config = {
  async preVisit(page, context) {
    await page.setViewportSize({ width: 1280, height: 900 })
    const storyViewports = new Map([
      ['components-communication-modal--narrow', { width: 320, height: 700 }],
    ])
    const storyViewport = storyViewports.get(context.id)
    if (storyViewport) {
      await page.setViewportSize(storyViewport)
    }

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
          // Storybook iframe lacks page landmarks.
          region: { enabled: false },
          // Demo fixtures may include brand swatches / USWDS contrast conventions.
          'color-contrast': { enabled: false },
        },
      },
    })
  },
}

export default config
