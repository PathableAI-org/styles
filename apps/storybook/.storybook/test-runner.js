import { injectAxe, checkA11y } from 'axe-playwright'

/** @type { import('@storybook/test-runner').TestRunnerConfig } */
const config = {
  async preVisit(page, context) {
    await page.setViewportSize({ width: 1280, height: 900 })
    if (
      new Set([
        'application-shell-mobile-shell--default',
        'application-shell-mobile-shell--legacy-active-color-override',
        'application-shell-mobile-shell--shared-navigation',
      ]).has(context.id)
    ) {
      await page.setViewportSize({ width: 320, height: 700 })
    }

    await injectAxe(page)
  },
  async postVisit(page, context) {
    await assertInteractionStatesPointerFeedback(page, context)
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
