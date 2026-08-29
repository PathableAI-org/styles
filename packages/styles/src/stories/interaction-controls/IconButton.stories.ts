import { expect, userEvent, within } from 'storybook/test'

export default {
  title: 'Interaction Controls/IconButton',
  tags: ['autodocs', 'contract-icon-button'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: Native button behavior with CSS-driven interactive states.\n\n**Semantics verified**: Icon buttons retain native button semantics, expose an accessible name, and keep decorative SVGs outside the accessibility tree and keyboard order. Loading buttons remain disabled and expose their busy state without changing size.\n\n**Consumers must**: Import `@pathableai/styles` CSS. Provide an accessible name through `aria-label` or `aria-labelledby`, set `type="button"` when the control must not submit a form, and hide decorative icons from assistive technology. Pair `pathable-icon-button--loading` with native `disabled` and `aria-busy="true"` so pointer and keyboard activation are both suppressed.',
      },
    },
  },
}

const closeIcon = `
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
  </svg>
`

const iconButton = (variant: string, label: string, attributes = '') => `
  <button type="button" class="pathable-icon-button ${variant}" aria-label="${label}"${attributes ? ` ${attributes}` : ''}>
    ${closeIcon}
  </button>
`

const loadingCases = [
  {
    label: 'Compact bare',
    appearanceClass: 'pathable-icon-button--bare',
    sizeClass: 'pathable-icon-button--compact',
    loadingClass: 'pathable-icon-button--loading',
    buttonSize: 32,
    spinnerSize: 16,
  },
  {
    label: 'Default subtle',
    appearanceClass: 'pathable-icon-button--subtle',
    sizeClass: '',
    loadingClass: 'pathable-icon-button--loading',
    buttonSize: 44,
    spinnerSize: 20,
  },
  {
    label: 'Large bordered',
    appearanceClass: 'pathable-icon-button--bordered',
    sizeClass: 'pathable-icon-button--large',
    loadingClass: 'pathable-icon-button--loading',
    buttonSize: 52,
    spinnerSize: 24,
  },
  {
    label: 'Inverse',
    appearanceClass: 'pathable-icon-button--inverse',
    sizeClass: '',
    loadingClass: 'pathable-icon-button--loading',
    buttonSize: 44,
    spinnerSize: 20,
  },
  {
    label: 'Generic inverse',
    appearanceClass: 'pathable-icon-button--inverse',
    sizeClass: '',
    loadingClass: 'is-loading',
    buttonSize: 44,
    spinnerSize: 20,
  },
  {
    label: 'Generic destructive',
    appearanceClass: 'pathable-icon-button--destructive',
    sizeClass: '',
    loadingClass: 'is-loading',
    buttonSize: 44,
    spinnerSize: 20,
  },
] as const

const loadingExample = ({
  label,
  appearanceClass,
  sizeClass,
  loadingClass,
}: (typeof loadingCases)[number]) => {
  const restingClasses = [appearanceClass, sizeClass].filter(Boolean).join(' ')
  const loadingClasses = [restingClasses, loadingClass].join(' ')

  return `
    <div style="display: inline-flex; align-items: center; gap: 0.5rem;">
      <span>${label}</span>
      ${iconButton(restingClasses, `${label} save changes`)}
      ${iconButton(
        loadingClasses,
        `${label} saving changes`,
        'disabled aria-busy="true"',
      )}
    </div>
  `
}

const parseComputedColor = (color: string) => {
  const channels = color.match(/[\d.]+/g)?.map(Number)

  if (!channels || channels.length < 3) {
    throw new Error(`Unable to parse computed color: ${color}`)
  }

  return {
    channels: channels.slice(0, 3),
    alpha: channels[3] ?? 1,
  }
}

const findOpaqueBackground = (element: HTMLElement, view: Window) => {
  let current: HTMLElement | null = element

  while (current) {
    const background = view.getComputedStyle(current).backgroundColor

    if (parseComputedColor(background).alpha === 1) return background
    current = current.parentElement
  }

  throw new Error('IconButton has no opaque background')
}

const contrastRatio = (foreground: string, background: string) => {
  const luminance = (color: string) => {
    const { channels } = parseComputedColor(color)

    const [red, green, blue] = channels.map((channel) => {
      const value = channel / 255
      return value <= 0.04045
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue
  }

  const lighter = Math.max(luminance(foreground), luminance(background))
  const darker = Math.min(luminance(foreground), luminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}

const getButtonIcon = (button: HTMLElement) => {
  const icon = button.querySelector<SVGElement>('svg')

  if (!icon) throw new Error('IconButton SVG is missing')
  return icon
}

const expectCentered = async (button: HTMLElement, icon: SVGElement) => {
  const buttonBounds = button.getBoundingClientRect()
  const iconBounds = icon.getBoundingClientRect()

  await expect(iconBounds.left + iconBounds.width / 2).toBeCloseTo(
    buttonBounds.left + buttonBounds.width / 2,
    2,
  )
  await expect(iconBounds.top + iconBounds.height / 2).toBeCloseTo(
    buttonBounds.top + buttonBounds.height / 2,
    2,
  )
}

const resolveColorToken = (canvasElement: HTMLElement, token: string) => {
  const view = canvasElement.ownerDocument.defaultView

  if (!view) throw new Error('IconButton story window is unavailable')

  const tokenValue = view
    .getComputedStyle(canvasElement)
    .getPropertyValue(token)
    .trim()
  const probe = canvasElement.ownerDocument.createElement('span')

  if (!tokenValue) throw new Error(`IconButton token ${token} is undefined`)

  probe.style.color = `var(${token})`
  probe.hidden = true
  canvasElement.append(probe)
  const color = view.getComputedStyle(probe).color
  probe.remove()

  if (!color) throw new Error(`Unable to resolve IconButton token ${token}`)
  return color
}

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
    const view = canvasElement.ownerDocument.defaultView
    const variants = [
      ['Bare', 'pathable-icon-button--bare'],
      ['Subtle', 'pathable-icon-button--subtle'],
      ['Bordered', 'pathable-icon-button--bordered'],
      ['Inverse', 'pathable-icon-button--inverse'],
      ['Destructive', 'pathable-icon-button--destructive'],
    ] as const

    if (!view) throw new Error('IconButton story window is unavailable')

    for (const [name, modifier] of variants) {
      const button = canvas.getByRole('button', { name })
      const icon = getButtonIcon(button)
      const buttonBounds = button.getBoundingClientRect()
      const iconBounds = icon.getBoundingClientRect()
      const style = view.getComputedStyle(button)

      await expect(button).toHaveClass('pathable-icon-button', modifier)
      await expect(button).toHaveAttribute('type', 'button')
      await expect(icon).toHaveAttribute('aria-hidden', 'true')
      await expect(icon).toHaveAttribute('focusable', 'false')
      await expect(Math.round(buttonBounds.width)).toBe(44)
      await expect(Math.round(buttonBounds.height)).toBe(44)
      await expect(Math.round(iconBounds.width)).toBe(20)
      await expect(Math.round(iconBounds.height)).toBe(20)
      await expect(style.alignItems).toBe('center')
      await expect(style.justifyContent).toBe('center')
      await expect(style.flexShrink).toBe('0')
      await expectCentered(button, icon)
    }

    const bareStyle = view.getComputedStyle(
      canvas.getByRole('button', { name: 'Bare' }),
    )
    const subtleStyle = view.getComputedStyle(
      canvas.getByRole('button', { name: 'Subtle' }),
    )
    const borderedStyle = view.getComputedStyle(
      canvas.getByRole('button', { name: 'Bordered' }),
    )
    const inverseStyle = view.getComputedStyle(
      canvas.getByRole('button', { name: 'Inverse' }),
    )
    const destructiveStyle = view.getComputedStyle(
      canvas.getByRole('button', { name: 'Destructive' }),
    )

    await expect(bareStyle.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(subtleStyle.backgroundColor).toBe(
      resolveColorToken(canvasElement, '--pathable-color-bg'),
    )
    await expect(borderedStyle.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(borderedStyle.borderTopWidth).toBe('1px')
    await expect(borderedStyle.borderTopColor).toBe(
      resolveColorToken(canvasElement, '--pathable-color-border'),
    )
    await expect(inverseStyle.backgroundColor).toBe(
      resolveColorToken(canvasElement, '--pathable-color-text'),
    )
    await expect(inverseStyle.color).toBe(
      resolveColorToken(canvasElement, '--pathable-color-surface'),
    )
    await expect(destructiveStyle.color).toBe(
      resolveColorToken(canvasElement, '--pathable-color-danger'),
    )

    const bare = canvas.getByRole('button', { name: 'Bare' })
    const destructive = canvas.getByRole('button', { name: 'Destructive' })
    let activations = 0
    bare.addEventListener('click', () => {
      activations += 1
    })

    await userEvent.tab()
    await expect(bare).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    await expect(activations).toBe(2)

    for (let index = 0; index < 4; index += 1) await userEvent.tab()
    await expect(destructive).toHaveFocus()
    await expect(view.getComputedStyle(destructive).outlineStyle).toBe('solid')
    await expect(view.getComputedStyle(destructive).outlineWidth).toBe('2px')
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
      [compact, 32, 16],
      [defaultButton, 44, 20],
      [large, 52, 24],
    ] as const

    await expect(compact).toHaveClass('pathable-icon-button--compact')
    await expect(defaultButton).toHaveClass('pathable-icon-button')
    await expect(large).toHaveClass('pathable-icon-button--large')

    for (const [button, size, iconSize] of sizes) {
      const bounds = button.getBoundingClientRect()
      const icon = getButtonIcon(button)
      const iconBounds = icon.getBoundingClientRect()

      await expect(Math.round(bounds.width)).toBe(size)
      await expect(Math.round(bounds.height)).toBe(size)
      await expect(Math.round(iconBounds.width)).toBe(iconSize)
      await expect(Math.round(iconBounds.height)).toBe(iconSize)
      await expectCentered(button, icon)
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
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('IconButton story window is unavailable')

    for (const name of ['Bare Circle', 'Subtle Circle', 'Bordered Circle']) {
      const button = canvas.getByRole('button', { name })
      const bounds = button.getBoundingClientRect()

      await expect(button).toHaveClass(
        'pathable-icon-button',
        'pathable-icon-button--circle',
      )
      await expect(view.getComputedStyle(button).borderRadius).toBe('50%')
      await expect(Math.round(bounds.width)).toBe(Math.round(bounds.height))
      await expectCentered(button, getButtonIcon(button))
    }
  },
}

export const OnDifferentSurfaces = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">On Different Surfaces</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Bare icon buttons on base and brand surfaces plus the inverse appearance on a dark surface. Tab through to verify icon and focus-ring visibility across all surface types.
    </p>
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: center;">
      <div class="pathable-surface pathable-surface--base" style="padding: 1.5rem; display: inline-flex; align-items: center; justify-content: center; background: var(--pathable-color-surface);">
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
        <button type="button" class="pathable-icon-button pathable-icon-button--inverse" aria-label="Close on inverse surface">
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
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('IconButton story window is unavailable')

    await userEvent.tab()

    for (const [index, button] of buttons.entries()) {
      if (index > 0) await userEvent.tab()

      const style = view.getComputedStyle(button)
      const background = findOpaqueBackground(button, view)

      await expect(button).toHaveFocus()
      await expect(style.outlineStyle).toBe('solid')
      await expect(style.outlineWidth).toBe('2px')
      await expect(
        contrastRatio(style.color, background),
      ).toBeGreaterThanOrEqual(3)
      await expect(
        contrastRatio(style.outlineColor, background),
      ).toBeGreaterThanOrEqual(3)
    }
  },
}

export const Disabled = {
  render: () => `
    ${iconButton('pathable-icon-button--subtle', 'Close unavailable', 'disabled')}
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Close unavailable' })
    const icon = getButtonIcon(button)
    const view = canvasElement.ownerDocument.defaultView
    let activations = 0

    if (!view) throw new Error('IconButton story window is unavailable')

    button.addEventListener('click', () => {
      activations += 1
    })
    button.click()
    button.focus()
    const restingBackground = view.getComputedStyle(button).backgroundColor
    await userEvent.hover(button)

    await expect(button).toBeDisabled()
    await expect(activations).toBe(0)
    await expect(button).not.toHaveFocus()
    await expect(button).toHaveClass(
      'pathable-icon-button',
      'pathable-icon-button--subtle',
    )
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('focusable', 'false')
    await expect(view.getComputedStyle(button).opacity).toBe('0.5')
    await expect(view.getComputedStyle(button).cursor).toBe('default')
    await expect(view.getComputedStyle(button).boxShadow).toBe('none')
    await expect(view.getComputedStyle(button).backgroundColor).toBe(
      restingBackground,
    )
  },
}

export const Loading = {
  render: () => `
    <div class="pathable-surface pathable-surface--tone-default">
      <div class="pathable-stack pathable-stack--gap-md">
        ${loadingCases.map(loadingExample).join('')}
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('IconButton story window is unavailable')

    for (const loadingCase of loadingCases) {
      const resting = canvas.getByRole('button', {
        name: `${loadingCase.label} save changes`,
      })
      const loading = canvas.getByRole('button', {
        name: `${loadingCase.label} saving changes`,
      })
      const icon = loading.querySelector('svg')

      if (!icon) {
        throw new Error(
          `${loadingCase.label} loading IconButton SVG is missing`,
        )
      }

      const restingBounds = resting.getBoundingClientRect()
      const loadingBounds = loading.getBoundingClientRect()
      const loadingStyle = view.getComputedStyle(loading)
      const iconStyle = view.getComputedStyle(icon)
      const spinnerStyle = view.getComputedStyle(loading, '::after')
      let activations = 0

      loading.addEventListener('click', () => {
        activations += 1
      })
      loading.click()
      loading.focus()

      await expect(loading).toBeDisabled()
      await expect(activations).toBe(0)
      await expect(loading).not.toHaveFocus()
      await expect(loading).toHaveAttribute('aria-busy', 'true')
      await expect(loading).toHaveClass(
        'pathable-icon-button',
        loadingCase.appearanceClass,
        loadingCase.loadingClass,
      )
      await expect(loadingStyle.pointerEvents).toBe('none')
      await expect(loadingStyle.cursor).toBe('wait')
      await expect(loadingStyle.opacity).toBe('1')
      await expect(icon).toHaveAttribute('aria-hidden', 'true')
      await expect(icon).toHaveAttribute('focusable', 'false')
      await expect(iconStyle.visibility).toBe('hidden')
      await expect(spinnerStyle.content).toBe('""')
      await expect(spinnerStyle.width).toBe(`${loadingCase.spinnerSize}px`)
      await expect(spinnerStyle.height).toBe(`${loadingCase.spinnerSize}px`)
      await expect(spinnerStyle.borderRightStyle).toBe('solid')
      await expect(spinnerStyle.borderRightWidth).toBe('2px')
      await expect(
        parseComputedColor(spinnerStyle.borderRightColor).alpha,
      ).toBe(1)
      await expect(Math.round(restingBounds.width)).toBe(loadingCase.buttonSize)
      await expect(Math.round(restingBounds.height)).toBe(
        loadingCase.buttonSize,
      )
      await expect(Math.round(loadingBounds.width)).toBe(
        Math.round(restingBounds.width),
      )
      await expect(Math.round(loadingBounds.height)).toBe(
        Math.round(restingBounds.height),
      )
      await expect(
        contrastRatio(
          spinnerStyle.borderRightColor,
          findOpaqueBackground(loading, view),
        ),
      ).toBeGreaterThanOrEqual(3)
    }
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
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('IconButton story window is unavailable')

    await expect(Math.round(bounds.width)).toBe(44)
    await expect(Math.round(bounds.height)).toBe(44)
    await expect(view.getComputedStyle(button).flexShrink).toBe('0')
    await expectCentered(button, getButtonIcon(button))
    await expect(text).toBeVisible()
    await expect(fixture.scrollWidth).toBeLessThanOrEqual(fixture.clientWidth)
  },
}

export const Default = AllVariants
