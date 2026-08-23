import { expect, userEvent, within } from 'storybook/test'

export default {
  title: 'Interaction Controls/IconButton',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: Native button behavior with CSS-driven interactive states.\n\n**Semantics verified**: Icon buttons retain native button semantics, expose an accessible name, and keep decorative SVGs outside the accessibility tree and keyboard order.\n\n**Consumers must**: Import `@pathableai/styles` CSS. Provide an accessible name through `aria-label` or `aria-labelledby`, set `type="button"` when the control must not submit a form, and hide decorative icons from assistive technology.',
      },
    },
  },
}

const closeIcon = `
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
  </svg>
`

const iconButton = (variant: string, label: string, disabled = false) => `
  <button type="button" class="pathable-icon-button ${variant}" aria-label="${label}"${disabled ? ' disabled' : ''}>
    ${closeIcon}
  </button>
`

export const AllVariants = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">All Appearance Variants</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Icon buttons in all five appearance variants. Hover and focus each button to see the interactive state transitions.
    </p>
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: center;">
      ${iconButton('pathable-icon-button--bare', 'Bare')}
      ${iconButton('pathable-icon-button--subtle', 'Subtle')}
      ${iconButton('pathable-icon-button--bordered', 'Bordered')}
      ${iconButton('pathable-icon-button--inverse', 'Inverse')}
      ${iconButton('pathable-icon-button--destructive', 'Destructive')}
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const variants = [
      ['Bare', 'pathable-icon-button--bare'],
      ['Subtle', 'pathable-icon-button--subtle'],
      ['Bordered', 'pathable-icon-button--bordered'],
      ['Inverse', 'pathable-icon-button--inverse'],
      ['Destructive', 'pathable-icon-button--destructive'],
    ] as const

    for (const [name, modifier] of variants) {
      const button = canvas.getByRole('button', { name })
      const icon = button.querySelector('svg')

      await expect(button).toHaveClass('pathable-icon-button', modifier)
      await expect(button).toHaveAttribute('type', 'button')
      await expect(icon).toHaveAttribute('aria-hidden', 'true')
      await expect(icon).toHaveAttribute('focusable', 'false')
    }
  },
}

export const AllSizes = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">All Size Variants</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Compact (32px), default (44px), and large (52px) icon buttons using the subtle variant. WCAG minimum touch target is 44px.
    </p>
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: center;">
      <div style="text-align: center;">
        <button type="button" class="pathable-icon-button pathable-icon-button--subtle pathable-icon-button--compact" aria-label="Close">
          ${closeIcon}
        </button>
        <div style="font-size: 0.75rem; margin-top: 0.25rem; color: #666;">Compact (32px)</div>
      </div>
      <div style="text-align: center;">
        <button type="button" class="pathable-icon-button pathable-icon-button--subtle" aria-label="Close">
          ${closeIcon}
        </button>
        <div style="font-size: 0.75rem; margin-top: 0.25rem; color: #666;">Default (44px)</div>
      </div>
      <div style="text-align: center;">
        <button type="button" class="pathable-icon-button pathable-icon-button--subtle pathable-icon-button--large" aria-label="Close">
          ${closeIcon}
        </button>
        <div style="font-size: 0.75rem; margin-top: 0.25rem; color: #666;">Large (52px)</div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const [compact, defaultButton, large] = canvas.getAllByRole('button', {
      name: 'Close',
    })
    const sizes = [
      [compact, 32],
      [defaultButton, 44],
      [large, 52],
    ] as const

    await expect(compact).toHaveClass('pathable-icon-button--compact')
    await expect(defaultButton).toHaveClass('pathable-icon-button')
    await expect(large).toHaveClass('pathable-icon-button--large')

    for (const [button, size] of sizes) {
      const bounds = button.getBoundingClientRect()

      await expect(bounds.width).toBe(size)
      await expect(bounds.height).toBe(size)
    }
  },
}

export const CircleShape = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Circle Shape</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Icon buttons with the \`--circle\` modifier in bare, subtle, and bordered variants. Circular shape uses \`border-radius: 50%\`.
    </p>
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: center;">
      ${iconButton('pathable-icon-button--bare pathable-icon-button--circle', 'Bare Circle')}
      ${iconButton('pathable-icon-button--subtle pathable-icon-button--circle', 'Subtle Circle')}
      ${iconButton('pathable-icon-button--bordered pathable-icon-button--circle', 'Bordered Circle')}
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)

    for (const name of ['Bare Circle', 'Subtle Circle', 'Bordered Circle']) {
      await expect(canvas.getByRole('button', { name })).toHaveClass(
        'pathable-icon-button',
        'pathable-icon-button--circle',
      )
    }
  },
}

export const OnDifferentSurfaces = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">On Different Surfaces</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Bare icon buttons on base, brand, and inverse surfaces. Tab through to verify focus ring visibility across all surface types.
    </p>
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: center;">
      <div class="pathable-surface pathable-surface--base" style="padding: 1.5rem; display: inline-flex; align-items: center; justify-content: center;">
        <button type="button" class="pathable-icon-button pathable-icon-button--bare" aria-label="Close on base surface">
          ${closeIcon}
        </button>
      </div>
      <div class="pathable-surface pathable-surface--brand" style="padding: 1.5rem; display: inline-flex; align-items: center; justify-content: center;">
        <button type="button" class="pathable-icon-button pathable-icon-button--bare" aria-label="Close on brand surface">
          ${closeIcon}
        </button>
      </div>
      <div class="pathable-surface pathable-surface--inverse" style="padding: 1.5rem; display: inline-flex; align-items: center; justify-content: center;">
        <button type="button" class="pathable-icon-button pathable-icon-button--bare" aria-label="Close on inverse surface">
          ${closeIcon}
        </button>
      </div>
    </div>
    <p style="color: #888; font-size: 0.8rem; margin-top: 0.75rem;">
      Surfaces (left to right): base, brand (<code>.pathable-surface--brand</code>), inverse (<code>.pathable-surface--inverse</code>).
    </p>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const buttons = [
      canvas.getByRole('button', { name: 'Close on base surface' }),
      canvas.getByRole('button', { name: 'Close on brand surface' }),
      canvas.getByRole('button', { name: 'Close on inverse surface' }),
    ]

    buttons[0].focus()

    for (const [index, button] of buttons.entries()) {
      if (index > 0) await userEvent.tab()

      const style = getComputedStyle(button)

      await expect(button).toHaveFocus()
      await expect(style.outlineStyle).toBe('solid')
      await expect(style.outlineWidth).toBe('2px')
    }
  },
}

export const Disabled = {
  render: () => `
    ${iconButton('pathable-icon-button--subtle', 'Close unavailable', true)}
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Close unavailable' })
    const icon = button.querySelector('svg')

    await expect(button).toBeDisabled()
    await expect(button).toHaveClass(
      'pathable-icon-button',
      'pathable-icon-button--subtle',
    )
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('focusable', 'false')
  },
}

export const ConstrainedContent = {
  render: () => `
    <div data-testid="icon-button-content-pressure" style="width: 16rem; max-width: 100%;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        ${iconButton('pathable-icon-button--subtle', 'Dismiss notification')}
        <span>Regional documentation requires review before approval</span>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const fixture = canvas.getByTestId('icon-button-content-pressure')
    const button = canvas.getByRole('button', {
      name: 'Dismiss notification',
    })
    const text = canvas.getByText(
      'Regional documentation requires review before approval',
    )
    const bounds = button.getBoundingClientRect()

    await expect(bounds.width).toBe(44)
    await expect(bounds.height).toBe(44)
    await expect(text).toBeVisible()
    await expect(fixture.scrollWidth).toBeLessThanOrEqual(fixture.clientWidth)
  },
}

export const Default = AllVariants
