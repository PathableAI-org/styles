import { expect, userEvent, within } from 'storybook/test'

export default {
  title: 'Interaction Controls/Interaction States',
  tags: ['autodocs', 'contract-interaction-states'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only SCSS mixins with semantics supplied by the consuming control.\n\n**States verified**: The combined mixin provides hover, focus-visible, focus-within, active, selected, disabled, and loading feedback. Fixtures verify disabled/loading precedence and compatibility with consumer-owned narrow and increased-text containment. The alternative granular pressed mixin is not part of the combined demo.\n\n**Consumers must**: Include the appropriate interaction-state mixins in component SCSS. Use native disabled semantics or application logic to suppress activation while unavailable or loading, and expose persistent state with the ARIA semantics appropriate to the control.',
      },
    },
  },
}

type InteractionStatesPlayContext = {
  canvasElement: HTMLElement
  id: string
}

const stateButton = (
  label: string,
  state: string,
  extraClasses = '',
  extraAttrs = '',
  extraStyles = '',
) => `
  <button type="button" class="pathable-interaction-states-demo${extraClasses ? ` ${extraClasses}` : ''}" ${extraAttrs} style="min-width: 200px; box-sizing: border-box; font-family: inherit; font-size: inherit; text-align: left; ${extraStyles}">
    <span style="display: block; font-size: 0.875em; font-weight: 600;">${label}</span>
    <span style="display: block; font-size: 0.75em; margin-top: 0.25rem; opacity: 0.7;">${state}</span>
  </button>
`

function getStoryView(canvasElement: HTMLElement) {
  const view = canvasElement.ownerDocument.defaultView

  if (!view) throw new Error('InteractionStates story window is unavailable')
  return view
}

function resolveColorToken(
  canvasElement: HTMLElement,
  view: Window,
  token: string,
) {
  const value = view
    .getComputedStyle(canvasElement)
    .getPropertyValue(token)
    .trim()
  const probe = canvasElement.ownerDocument.createElement('span')

  if (!value) throw new Error(`InteractionStates token ${token} is undefined`)

  probe.style.color = `var(${token})`
  probe.hidden = true
  canvasElement.append(probe)
  const color = view.getComputedStyle(probe).color
  probe.remove()

  if (!color)
    throw new Error(`Unable to resolve InteractionStates token ${token}`)
  return color
}

async function expectStylesReady(element: HTMLElement, view: Window) {
  const style = view.getComputedStyle(element)

  await expect(style.boxShadow).not.toBe('none')
  await expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
}

async function runInteractionStatesProof(
  storyId: string,
  capability: string,
  proof: () => Promise<void>,
) {
  try {
    await proof()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`[styles/${storyId}/${capability}] ${message}`, {
      cause: error,
    })
  }
}

const allStatesRender = (idSuffix = 'all-states') => `
  <section aria-labelledby="interaction-states-heading-${idSuffix}">
    <h3 id="interaction-states-heading-${idSuffix}" style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Interaction States</h3>
    <p style="color: var(--pathable-color-text-muted); font-size: 0.875rem; margin: 0 0 1rem;">
      The Rest control exercises transient pointer and keyboard states. Selected and disabled are persistent semantic fixtures.
    </p>
    <div class="pathable-cluster" style="align-items: stretch;">
      ${stateButton('Rest', 'Hover, focus, or press')}
      <div role="listbox" aria-label="Selection state example">
        <div role="option" aria-selected="true" tabindex="0" class="pathable-interaction-states-demo" style="min-width: 200px; box-sizing: border-box;">
          <span style="display: block; font-size: 0.875em; font-weight: 600;">Selected</span>
          <span style="display: block; font-size: 0.75em; margin-top: 0.25rem; opacity: 0.7;">Persistent selection</span>
        </div>
      </div>
      ${stateButton('Disabled', 'Unavailable', '', 'disabled')}
      ${stateButton('ARIA disabled', 'Application-suppressed', '', 'aria-disabled="true" tabindex="-1"')}
    </div>
  </section>
`

const runAllStatesPlay = async (
  { canvasElement, id }: InteractionStatesPlayContext,
  capability: string,
) => {
  await runInteractionStatesProof(id, capability, async () => {
    const canvas = within(canvasElement)
    const view = getStoryView(canvasElement)
    const rest = canvas.getByRole('button', {
      name: 'Rest Hover, focus, or press',
    })
    const selected = canvas.getByRole('option', {
      name: 'Selected Persistent selection',
    })
    const disabled = canvas.getByRole('button', {
      name: 'Disabled Unavailable',
    })
    const ariaDisabled = canvas.getByRole('button', {
      name: 'ARIA disabled Application-suppressed',
    })

    await expectStylesReady(rest, view)

    await userEvent.tab()
    await expect(rest).toHaveFocus()
    const focusedStyle = view.getComputedStyle(rest)
    await expect(focusedStyle.outlineStyle).toBe('solid')
    await expect(focusedStyle.outlineWidth).toBe('2px')
    await expect(focusedStyle.outlineColor).toBe(
      resolveColorToken(canvasElement, view, '--pathable-color-focus-ring'),
    )

    const selectedStyle = view.getComputedStyle(selected)
    await expect(selected).toHaveAttribute('aria-selected', 'true')
    await expect(selectedStyle.borderTopWidth).toBe('2px')
    await expect(selectedStyle.borderTopColor).toBe(
      resolveColorToken(canvasElement, view, '--pathable-color-border'),
    )
    await expect(selectedStyle.fontWeight).toBe('700')

    let activations = 0
    disabled.addEventListener('click', () => {
      activations += 1
    })
    disabled.click()
    disabled.focus()
    const disabledStyle = view.getComputedStyle(disabled)
    await expect(disabled).toBeDisabled()
    await expect(disabled).not.toHaveFocus()
    await expect(activations).toBe(0)
    await expect(disabledStyle.cursor).toBe('default')
    await expect(disabledStyle.boxShadow).toBe('none')
    await expect(disabledStyle.opacity).toBe('0.5')

    let ariaDisabledAttempts = 0
    let ariaDisabledActions = 0
    ariaDisabled.addEventListener('click', (event) => {
      ariaDisabledAttempts += 1
      if (ariaDisabled.getAttribute('aria-disabled') === 'true') {
        event.preventDefault()
        return
      }
      ariaDisabledActions += 1
    })
    ariaDisabled.click()
    const ariaDisabledStyle = view.getComputedStyle(ariaDisabled)
    await expect(ariaDisabled).toHaveAttribute('aria-disabled', 'true')
    await expect(ariaDisabled).toHaveAttribute('tabindex', '-1')
    await expect(ariaDisabledAttempts).toBe(1)
    await expect(ariaDisabledActions).toBe(0)
    await expect(ariaDisabledStyle.cursor).toBe('default')
    await expect(ariaDisabledStyle.boxShadow).toBe('none')
    await expect(ariaDisabledStyle.opacity).toBe('0.5')

    await userEvent.tab()
    await expect(selected).toHaveFocus()
    await userEvent.tab()
    await expect(disabled).not.toHaveFocus()
    await expect(ariaDisabled).not.toHaveFocus()
  })
}

export const AllStates = {
  render: () => allStatesRender(),
  play: (context: InteractionStatesPlayContext) =>
    runAllStatesPlay(context, 'interaction-states.aggregate'),
}

export const FocusWithin = {
  render: () => `
    <section aria-labelledby="focus-within-heading">
      <h3 id="focus-within-heading" style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Focus Within</h3>
      <div class="pathable-interaction-states-demo" role="group" aria-label="Focus-within example" style="max-width: 24rem;">
        <span style="display: block; margin-bottom: 0.5rem;">The container receives a ring when its child is focused.</span>
        <button type="button">Focus child</button>
      </div>
    </section>
  `,
  play: async ({ canvasElement, id }: InteractionStatesPlayContext) => {
    await runInteractionStatesProof(
      id,
      'interaction-states.focus-within',
      async () => {
        const canvas = within(canvasElement)
        const view = getStoryView(canvasElement)
        const group = canvas.getByRole('group', {
          name: 'Focus-within example',
        })
        const child = canvas.getByRole('button', { name: 'Focus child' })

        await expectStylesReady(group, view)
        await expect(view.getComputedStyle(group).outlineStyle).toBe('none')
        await userEvent.tab()
        await expect(child).toHaveFocus()
        const focusedStyle = view.getComputedStyle(group)
        await expect(focusedStyle.outlineStyle).toBe('solid')
        await expect(focusedStyle.outlineWidth).toBe('2px')
      },
    )
  },
}

export const LoadingState = {
  render: () => `
    <section aria-labelledby="loading-state-heading">
      <h3 id="loading-state-heading" style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Loading State</h3>
      <p style="color: var(--pathable-color-text-muted); font-size: 0.875rem; margin: 0 0 1rem;">
        The CSS spinner removes the loading control from pointer hit-testing; native disabled semantics suppress keyboard activation.
      </p>
      <div class="pathable-cluster" style="align-items: stretch;">
        ${stateButton('Ready', 'Saving preferences')}
        ${stateButton('Loading', 'Saving preferences', 'is-loading', 'disabled aria-busy="true"')}
      </div>
    </section>
  `,
  play: async ({ canvasElement, id }: InteractionStatesPlayContext) => {
    await runInteractionStatesProof(
      id,
      'interaction-states.loading',
      async () => {
        const canvas = within(canvasElement)
        const view = getStoryView(canvasElement)
        const ready = canvas.getByRole('button', {
          name: 'Ready Saving preferences',
        })
        const loading = canvas.getByRole('button', {
          name: 'Loading Saving preferences',
        })

        await expectStylesReady(ready, view)
        const readyBounds = ready.getBoundingClientRect()
        const loadingBounds = loading.getBoundingClientRect()
        const loadingStyle = view.getComputedStyle(loading)
        const spinner = view.getComputedStyle(loading, '::after')
        let activations = 0
        loading.addEventListener('click', () => {
          activations += 1
        })
        loading.click()

        await expect(loading).toBeDisabled()
        await expect(loading).toHaveAttribute('aria-busy', 'true')
        await expect(activations).toBe(0)
        await expect(loadingStyle.pointerEvents).toBe('none')
        await expect(spinner.content).toBe('""')
        await expect(spinner.position).toBe('absolute')
        await expect(spinner.borderTopWidth).toBe('2px')
        await expect(loadingBounds.width).toBeCloseTo(readyBounds.width, 3)
        await expect(loadingBounds.height).toBeCloseTo(readyBounds.height, 3)
        const loadingHitTarget = canvasElement.ownerDocument.elementFromPoint(
          loadingBounds.left + loadingBounds.width / 2,
          loadingBounds.top + loadingBounds.height / 2,
        )
        if (!loadingHitTarget) {
          throw new Error('Loading-state center has no browser hit target')
        }
        await expect(loading.contains(loadingHitTarget)).toBe(false)
        await userEvent.tab()
        await expect(ready).toHaveFocus()
        await userEvent.tab()
        await expect(loading).not.toHaveFocus()
      },
    )
  },
}

export const StatePrecedence = {
  render: () => `
    <section aria-labelledby="precedence-heading">
      <h3 id="precedence-heading" style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">State Precedence</h3>
      <div class="pathable-cluster" style="align-items: stretch;">
        ${stateButton('Rest', 'Comparison state')}
        ${stateButton('Selected disabled', 'Unavailable selection', 'is-selected', 'disabled aria-pressed="true"')}
        ${stateButton('Loading disabled', 'Pending and unavailable', 'is-loading', 'disabled aria-busy="true"')}
      </div>
    </section>
  `,
  play: async ({ canvasElement, id }: InteractionStatesPlayContext) => {
    await runInteractionStatesProof(
      id,
      'interaction-states.precedence',
      async () => {
        const canvas = within(canvasElement)
        const view = getStoryView(canvasElement)
        const rest = canvas.getByRole('button', {
          name: 'Rest Comparison state',
        })
        const selectedDisabled = canvas.getByRole('button', {
          name: 'Selected disabled Unavailable selection',
        })
        const loadingDisabled = canvas.getByRole('button', {
          name: 'Loading disabled Pending and unavailable',
        })

        await expectStylesReady(rest, view)
        const selectedDisabledStyle = view.getComputedStyle(selectedDisabled)
        await expect(selectedDisabled).toBeDisabled()
        await expect(selectedDisabled).toHaveAttribute('aria-pressed', 'true')
        await expect(selectedDisabledStyle.boxShadow).toBe('none')
        await expect(selectedDisabledStyle.cursor).toBe('default')
        await expect(selectedDisabledStyle.borderTopWidth).toBe('2px')
        await expect(selectedDisabledStyle.borderTopColor).toBe(
          resolveColorToken(canvasElement, view, '--pathable-color-border'),
        )
        await expect(selectedDisabledStyle.backgroundColor).toBe(
          resolveColorToken(canvasElement, view, '--pathable-color-bg'),
        )
        await expect(selectedDisabledStyle.fontWeight).toBe('700')

        const loadingStyle = view.getComputedStyle(loadingDisabled)
        await expect(loadingDisabled).toBeDisabled()
        await expect(loadingDisabled).toHaveAttribute('aria-busy', 'true')
        await expect(loadingStyle.pointerEvents).toBe('none')
      },
    )
  },
}

const pressureRender = (increasedText = false) => {
  const idSuffix = increasedText ? 'increased-text' : 'content-pressure'

  return `
  <section aria-labelledby="pressure-heading-${idSuffix}" style="box-sizing: border-box; width: 320px; max-width: 100%; ${increasedText ? 'font-size: 2rem;' : ''}">
    <h3 id="pressure-heading-${idSuffix}" style="margin: 0 0 0.5rem; font-size: 1em; font-weight: 600; overflow-wrap: anywhere;">${increasedText ? 'Increased-text interaction states' : 'Constrained interaction states'}</h3>
    <p style="color: var(--pathable-color-text-muted); font-size: 0.75em; margin: 0 0 0.75rem; overflow-wrap: anywhere;">The consuming surface owns wrapping and containment; interaction feedback must remain intact within it.</p>
    <div style="min-width: 0;">
      ${stateButton('Regional documentation review', 'A deliberately long interaction-state label must wrap without escaping its constrained surface.', '', '', 'width: 100%; min-width: 0; white-space: normal; overflow-wrap: anywhere;')}
      ${stateButton('Pending accessibility approval', 'Selected state remains visible when content wraps across several lines.', 'is-selected', 'aria-pressed="true"', 'width: 100%; min-width: 0; margin-top: 0.75rem; white-space: normal; overflow-wrap: anywhere;')}
    </div>
  </section>
`
}

async function verifyPressure(
  canvasElement: HTMLElement,
  expectedHeading: string,
) {
  const canvas = within(canvasElement)
  const view = getStoryView(canvasElement)
  const fixture = canvas.getByRole('region', { name: expectedHeading })
  const buttons = within(fixture).getAllByRole('button')

  await expectStylesReady(buttons[0], view)
  for (const button of buttons) await expect(button).toBeVisible()
  await expect(fixture.scrollWidth).toBeLessThanOrEqual(fixture.clientWidth)
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  )
}

export const ContentPressure = {
  render: () => pressureRender(),
  play: async ({ canvasElement, id }: InteractionStatesPlayContext) => {
    await runInteractionStatesProof(
      id,
      'interaction-states.content-pressure',
      async () => {
        await verifyPressure(canvasElement, 'Constrained interaction states')
      },
    )
  },
}

export const IncreasedText = {
  render: () => pressureRender(true),
  play: async ({ canvasElement, id }: InteractionStatesPlayContext) => {
    await runInteractionStatesProof(
      id,
      'interaction-states.increased-text',
      async () => {
        await verifyPressure(canvasElement, 'Increased-text interaction states')
      },
    )
  },
}

export const Default = {
  render: () => allStatesRender('default'),
  play: (context: InteractionStatesPlayContext) =>
    runAllStatesPlay(context, 'interaction-states.default'),
}
