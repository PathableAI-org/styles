import { injectAxe, checkA11y } from 'axe-playwright'

/** @type { import('@storybook/test-runner').TestRunnerConfig } */
const config = {
  // When driven as a target by scripts/test-storybook.mjs (STORYBOOK_TARGET set),
  // scope execution to the registered behavior-contract fixtures so unrelated
  // enhancement-runtime stories (with pre-existing Axe exceptions) do not gate
  // the Accordion conformance target. The package-specific test:storybook-react
  // path (no STORYBOOK_TARGET) continues to run every story.
  tags:
    process.env.STORYBOOK_TARGET === 'react'
      ? { include: ['behavior-contract'] }
      : undefined,
  async preVisit(page) {
    await injectAxe(page)
  },
  async postVisit(page, context) {
    // Stories with a documented source contrast exception.
    // – WorkflowWithStatus, LongContent, AsStatusIndicators:
    //   The .pathable-card__status element has insufficient color contrast
    //   against the card background — a pre-existing design token issue in
    //   @pathableai/styles. Tracked for future fix.
    // – Alert/Error: color contrast violation from pre-existing design
    //   tokens in the error alert background color.
    const skipA11yStoryIds = new Set([
      'components-card--workflow-with-status',
      'components-card--long-content',
      'components-card--narrow-workflow',
      'components-tag--as-status-indicators',
      'components-communication-alert--error',
    ])
    if (skipA11yStoryIds.has(context.id)) {
      return
    }

    const colorContrastExceptionStoryIds = new Set([
      'components-feedback-pageerror--not-found',
      'components-feedback-pageerror--access-restricted',
      'components-feedback-pageerror--custom-attributes',
      'components-feedback-pageerror--accessibility-check',
      'components-feedback-pageerror--page-composition',
      // Dashboard Overview composition stories: the `.pathable-kpi-card__trend`
      // success-color text (`--pathable-color-success`) fails AA contrast on
      // the light card — a pre-existing `@pathableai/styles` KPI-trend token
      // issue, identical to the styles `KpiGrid`/`Dashboard Overview` markup.
      // Keep every other axe rule active; tracked for a styles-side fix.
      'dashboard-dashboard-overview--playground',
      'dashboard-dashboard-overview--populated',
      'dashboard-dashboard-overview--mobile',
    ])

    const rules = {
      // Storybook renders components in an isolated iframe without
      // page-level landmarks, making the "region" check a persistent
      // false positive for all stories.
      region: { enabled: false },
      ...(colorContrastExceptionStoryIds.has(context.id)
        ? {
            // The source page-error link token currently fails contrast on
            // the light surface. Keep every other axe rule active while the
            // design-token issue is tracked separately.
            'color-contrast': { enabled: false },
          }
        : {}),
    }

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        },
        rules,
      },
    })

    await assertThemeResolution(page, context)
  },
}

/**
 * Fail with a descriptive message when two values differ.
 */
function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(
      `${label}: expected ${JSON.stringify(expected)} but received ${JSON.stringify(actual)}`,
    )
  }
}

/**
 * Rendered theming-resolution assertions (feature 062). These run in a real
 * Chromium page so `getComputedStyle` resolves `var(--pathable-color-*)` to
 * concrete values — jsdom cannot resolve CSS custom properties, so a Vitest
 * test cannot prove resolution. Keyed to specific story ids.
 */
async function assertThemeResolution(page, context) {
  if (
    context.id === 'components-themeprovider--app-shell-under-partial-theme'
  ) {
    // The active sidebar nav item resolves both the overridden accent (via its
    // border-left indicator) and the default text token (via its color). The
    // `aria-current="page"` state is an observable, viewport-independent
    // outcome; the link is a semantic target regardless of sidebar visibility.
    const activeNav = page.locator('a[aria-current="page"]')

    // (a) FR-006 — the overridden token resolves to the provided value.
    const accent = await activeNav.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--pathable-color-accent'),
    )
    assertEqual(accent, '#7c3aed', 'overridden --pathable-color-accent')

    // Real cascade resolution: the active indicator actually paints the
    // overridden accent. Chromium reports resolved colors as rgb().
    const borderLeftColor = await activeNav.evaluate(
      (el) => getComputedStyle(el).borderLeftColor,
    )
    assertEqual(
      borderLeftColor,
      'rgb(124, 58, 237)',
      'resolved active-nav border-left color',
    )

    // (b) FR-007 — an unspecified token falls through to the default.
    const text = await activeNav.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--pathable-color-text'),
    )
    assertEqual(text, '#00365c', 'default --pathable-color-text')

    // (c) FR-008 — the override is scoped to the provider subtree: a sibling
    // rendered outside the provider resolves the :root default, not the override.
    const outsideAccent = await page
      .getByText('Outside the provider subtree')
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue('--pathable-color-accent'),
      )
    assertEqual(
      outsideAccent,
      '#1cae96',
      'scoped --pathable-color-accent outside provider',
    )
  }

  if (context.id === 'components-themeprovider--default') {
    // (d) Backward-compat supplement — a `ThemeProvider` with `defaultTheme`
    // (or an omitted `theme`) renders children directly with no wrapper element
    // carrying `--pathable-color-*` inline custom properties.
    const themeWrapperCount = await page
      .locator('#storybook-root [style*="--pathable-color-"]')
      .count()
    assertEqual(
      themeWrapperCount,
      0,
      'default-theme provider renders no wrapper',
    )
  }
}

export default config
