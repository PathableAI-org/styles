import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { injectAxe, checkA11y } from 'axe-playwright'

import { capturePixels, pixelMode, setupPixels } from './pixels.js'

// The test-runner runs with this workspace (apps/storybook) as its working
// directory, from the root scripts, the pixel suite and CI alike.
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
  setup() {
    if (pixelMode) setupPixels()
  },
  async preVisit(page, context) {
    await page.setViewportSize({ width: 1280, height: 900 })
    const storyViewports = new Map([
      ['application-shell-mobile-shell--default', { width: 320, height: 700 }],
      [
        'application-shell-mobile-shell--legacy-active-color-override',
        { width: 320, height: 700 },
      ],
      [
        'application-shell-mobile-shell--shared-navigation',
        { width: 320, height: 700 },
      ],
      [
        'components-form-controls-form-row--narrow',
        { width: 320, height: 700 },
      ],
      [
        'components-form-controls-form-stack--narrow',
        { width: 320, height: 700 },
      ],
      [
        'components-feedback-pageerror--mobile-full-page',
        { width: 375, height: 812 },
      ],
      [
        'components-form-controls-form-row--at-desktop-breakpoint',
        { width: 1024, height: 900 },
      ],
      [
        'components-form-controls-form-row--below-desktop-breakpoint',
        { width: 1023, height: 900 },
      ],
    ])
    const storyViewport = storyViewports.get(context.id)
    if (storyViewport) {
      await page.setViewportSize(storyViewport)
    }
    // Stories named `--forced-colors` render and run their play functions with
    // forced colors active, matching quality-gates.mjs and test-visual.mjs.
    // This runs before the pixel-mode return so a play function sees the same
    // rendering in both runs; no pixel baseline captures a forced-colors story.
    // The page is reused across the stories of one file, so every other story
    // resets the emulation.
    await page.emulateMedia({
      forcedColors: context.id.endsWith('--forced-colors') ? 'active' : null,
    })

    // Pixel runs only capture; the accessibility job owns the axe checks.
    if (pixelMode) return
    await injectAxe(page)
  },
  async postVisit(page, context) {
    await recordExecuted(page, context)
    if (pixelMode) return capturePixels(page, context)
    await assertInteractionStatesPointerFeedback(page, context)
    const isFilterableOptionList = context.id.startsWith(
      'components-form-controls-filterable-option-list--',
    )
    // The workflow card's status text once failed contrast (#314); keep the
    // rule on for the story that shows it.
    const checksColorContrast =
      isFilterableOptionList ||
      context.id === 'components-card--workflow-card-with-status'
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
          // Color contrast violations in demo/utility stories and USWDS component
          // stories are pre-existing. Utility stories showcase color swatches; USWDS
          // components follow their own design system conventions (e.g., links use
          // underline as the visual indicator).
          'color-contrast': { enabled: checksColorContrast },
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

async function assertInteractionStatesPointerFeedback(page, context) {
  if (context.id !== 'interaction-controls-interaction-states--all-states') {
    return
  }

  const fail = (capability, message) => {
    throw new Error(`[styles/${context.id}/${capability}] ${message}`)
  }
  const rest = page.getByRole('button', {
    name: 'Rest Hover, focus, or press',
  })
  const disabled = page.getByRole('button', {
    name: 'Disabled Unavailable',
  })
  const ariaDisabled = page.getByRole('button', {
    name: 'ARIA disabled Application-suppressed',
  })
  const restingStyle = await rest.evaluate((element) => {
    const style = getComputedStyle(element)
    const probe = element.ownerDocument.createElement('span')
    probe.style.backgroundColor = 'var(--pathable-color-bg)'
    probe.style.position = 'fixed'
    probe.style.visibility = 'hidden'
    element.append(probe)
    const hoverBackground = getComputedStyle(probe).backgroundColor
    probe.remove()

    return {
      background: style.backgroundColor,
      hoverBackground,
      shadow: style.boxShadow,
    }
  })

  await rest.hover()
  const hoverStyle = await rest.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      background: style.backgroundColor,
      shadow: style.boxShadow,
    }
  })
  if (hoverStyle.shadow === restingStyle.shadow) {
    fail('interaction-states.hover', 'hover did not change elevation')
  }
  if (
    hoverStyle.background === restingStyle.background ||
    hoverStyle.background !== restingStyle.hoverBackground
  ) {
    fail(
      'interaction-states.hover',
      `hover background was ${JSON.stringify(hoverStyle.background)}, expected token value ${JSON.stringify(restingStyle.hoverBackground)} distinct from rest`,
    )
  }

  const restBounds = await rest.boundingBox()
  if (!restBounds)
    fail('interaction-states.active', 'rest control has no bounds')
  await page.mouse.move(
    restBounds.x + restBounds.width / 2,
    restBounds.y + restBounds.height / 2,
  )
  await page.mouse.down()
  const activeShadow = await rest.evaluate(
    (element) => getComputedStyle(element).boxShadow,
  )
  await page.mouse.up()
  if (activeShadow !== 'none') {
    fail(
      'interaction-states.active',
      `active elevation was ${JSON.stringify(activeShadow)}, expected "none"`,
    )
  }

  const disabledBeforeHover = await disabled.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      background: style.backgroundColor,
      shadow: style.boxShadow,
    }
  })
  await disabled.hover()
  const disabledAfterHover = await disabled.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      background: style.backgroundColor,
      shadow: style.boxShadow,
    }
  })
  if (
    disabledAfterHover.background !== disabledBeforeHover.background ||
    disabledAfterHover.shadow !== disabledBeforeHover.shadow
  ) {
    fail(
      'interaction-states.disabled-hover',
      'disabled control changed appearance on hover',
    )
  }

  const ariaDisabledBeforeHover = await ariaDisabled.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      background: style.backgroundColor,
      shadow: style.boxShadow,
    }
  })
  await ariaDisabled.hover()
  const ariaDisabledAfterHover = await ariaDisabled.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      background: style.backgroundColor,
      shadow: style.boxShadow,
    }
  })
  if (
    ariaDisabledAfterHover.background !== ariaDisabledBeforeHover.background ||
    ariaDisabledAfterHover.shadow !== ariaDisabledBeforeHover.shadow
  ) {
    fail(
      'interaction-states.aria-disabled-hover',
      'ARIA-disabled control changed appearance on hover',
    )
  }
}

export default config
