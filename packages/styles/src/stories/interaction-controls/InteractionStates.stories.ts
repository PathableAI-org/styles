import { expect, userEvent, within } from 'storybook/test'

export default {
  title: 'Interaction Controls/Interaction States',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only (SCSS mixins)\n\n**States verified**: Keyboard focus remains visible, selected and disabled fixtures expose their intended visual states, and loading content communicates that it is busy while suppressing pointer interaction. These are deterministic CSS reference fixtures, not standalone application controls.\n\n**Consumers must**: Include the `interaction-states` mixin in their component SCSS and apply semantics appropriate to the interactive component. No JavaScript is required for the visual states.',
      },
    },
  },
}

const demoCard = (
  state: string,
  label: string,
  extraClasses = '',
  extraAttrs = '',
) => `
  <div class="pathable-interaction-states-demo${extraClasses ? ' ' + extraClasses : ''}" ${extraAttrs} style="min-width: 200px;">
    <div style="font-size: 0.875rem; font-weight: 600;">${label}</div>
    <div style="font-size: 0.75rem; margin-top: 0.25rem; opacity: 0.7;">${state}</div>
  </div>
`

export const AllStates = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Interaction States</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Hover over each card to see the hover state. Tab to the rest card to see the focus ring.
      Selected and disabled states are shown below.
    </p>
    <div class="pathable-cluster" style="align-items: stretch;">
      ${demoCard('Rest', 'Rest (hover/focus me)', '', 'tabindex="0" data-testid="rest-state"')}
      ${demoCard('Selected', 'Selected', 'is-selected', 'tabindex="0" data-testid="selected-state"')}
      ${demoCard('Disabled', 'Disabled', '', 'aria-disabled="true" data-testid="disabled-state"')}
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView
    const rest = canvas.getByTestId('rest-state')
    const selected = canvas.getByTestId('selected-state')
    const disabled = canvas.getByTestId('disabled-state')

    if (!view) throw new Error('InteractionStates story window is unavailable')

    await userEvent.tab()

    const restStyle = view.getComputedStyle(rest)
    const selectedStyle = view.getComputedStyle(selected)
    const disabledStyle = view.getComputedStyle(disabled)

    await expect(rest).toHaveFocus()
    await expect(restStyle.outlineStyle).toBe('solid')
    await expect(restStyle.outlineWidth).toBe('2px')
    await expect(selected).toHaveClass('is-selected')
    await expect(selectedStyle.borderWidth).toBe('2px')
    await expect(selectedStyle.fontWeight).toBe('700')
    await expect(disabled).toHaveAttribute('aria-disabled', 'true')
    await expect(disabled).not.toHaveAttribute('tabindex')
    await expect(disabledStyle.cursor).toBe('default')
    await expect(disabledStyle.opacity).toBe('0.5')
  },
}

export const LoadingState = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Loading State</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      The loading state shows a CSS-only border spinner and prevents interaction.
    </p>
    <div class="pathable-cluster" style="align-items: stretch;">
      ${demoCard('Loading', 'Loading', 'is-loading', 'aria-busy="true" data-testid="loading-state"')}
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView
    const loading = canvas.getByTestId('loading-state')

    if (!view) throw new Error('InteractionStates story window is unavailable')

    const loadingStyle = view.getComputedStyle(loading)

    await expect(loading).toHaveClass('is-loading')
    await expect(loading).toHaveAttribute('aria-busy', 'true')
    await expect(loadingStyle.cursor).toBe('wait')
    await expect(loadingStyle.pointerEvents).toBe('none')
  },
}

export const Default = AllStates
