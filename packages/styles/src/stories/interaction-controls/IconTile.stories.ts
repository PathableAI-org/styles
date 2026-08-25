import { expect, within } from 'storybook/test'

export default {
  title: 'Interaction Controls/Icon Tile',
  tags: ['autodocs', 'contract-icon-tile'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only and noninteractive.\n\n**Semantics verified**: Decorative tiles remain outside the accessibility tree when adjacent text communicates status. Standalone meaningful icons expose an image role and accessible name.\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required. Use `aria-hidden="true"` for decorative tiles or `role="img"` and `aria-label` on meaningful SVGs.',
      },
    },
  },
}

const iconTile = (
  modifiers: string,
  label: string,
  meaningful = false,
  testId?: string,
) => `
  <span class="pathable-icon-tile ${modifiers}"${meaningful ? '' : ' aria-hidden="true"'}${testId ? ` data-testid="${testId}"` : ''}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"${meaningful ? ` role="img" aria-label="${label}"` : ' aria-hidden="true"'}${testId ? ` data-testid="${testId}-icon"` : ''}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  </span>
`

const iconTileWithText = (
  modifiers: string,
  label: string,
  text: string,
  meaningful = false,
  testId?: string,
) => `
  <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
    ${iconTile(modifiers, label, meaningful, testId)}
    <span style="font-size: 0.875rem;">${text}</span>
  </span>
`

const sectionHeading = (text: string) => `
  <h3 style="margin: 1.5rem 0 0.5rem; font-size: 1rem; font-weight: 600;">${text}</h3>
`

const shapes = ['square', 'circle'] as const
const sizes = [
  {
    name: 'compact',
    modifier: 'pathable-icon-tile--compact',
    tile: 32,
    icon: 16,
  },
  { name: 'default', modifier: '', tile: 44, icon: 20 },
  { name: 'large', modifier: 'pathable-icon-tile--large', tile: 52, icon: 24 },
] as const
const statuses = [
  { name: 'default', modifier: '', token: '--pathable-color-text' },
  {
    name: 'success',
    modifier: 'pathable-icon-tile--success',
    token: '--pathable-color-success',
  },
  {
    name: 'error',
    modifier: 'pathable-icon-tile--error',
    token: '--pathable-color-danger',
  },
  {
    name: 'warning',
    modifier: 'pathable-icon-tile--warning',
    token: '--pathable-color-status-warning-text',
  },
  {
    name: 'info',
    modifier: 'pathable-icon-tile--info',
    token: '--pathable-color-link',
  },
] as const

const getTileIcon = (tile: HTMLElement) => {
  const icon = tile.querySelector<SVGElement>('svg')

  if (!icon) throw new Error('IconTile SVG is missing')
  return icon
}

const expectCentered = async (tile: HTMLElement, icon: SVGElement) => {
  const tileBounds = tile.getBoundingClientRect()
  const iconBounds = icon.getBoundingClientRect()

  await expect(iconBounds.left + iconBounds.width / 2).toBeCloseTo(
    tileBounds.left + tileBounds.width / 2,
    2,
  )
  await expect(iconBounds.top + iconBounds.height / 2).toBeCloseTo(
    tileBounds.top + tileBounds.height / 2,
    2,
  )
}

const resolveColorToken = (
  canvasElement: HTMLElement,
  token: string,
): string => {
  const view = canvasElement.ownerDocument.defaultView
  const tokenValue = view
    ?.getComputedStyle(canvasElement)
    .getPropertyValue(token)
    .trim()

  if (!tokenValue) throw new Error(`IconTile token ${token} is undefined`)

  const probe = canvasElement.ownerDocument.createElement('span')
  probe.style.color = `var(${token})`
  probe.hidden = true
  canvasElement.append(probe)
  const color = view?.getComputedStyle(probe).color
  probe.remove()

  if (!color) throw new Error(`Unable to resolve ${token}`)
  return color
}

export const SquareAndCircle = {
  render: () => `
    ${sectionHeading('Square (default) vs Circular (--circle)')}
    <p style="color: var(--pathable-color-text-muted); font-size: 0.875rem; margin: 0 0 1rem;">
      Use for decorative icons that don't convey semantic meaning. Add <code>aria-hidden="true"</code> to the tile.
    </p>
    <div class="pathable-cluster" style="align-items: center;">
      ${iconTile('', 'bell - square', false, 'square-icon-tile')}
      ${iconTile('pathable-icon-tile--circle', 'bell - circle', false, 'circle-icon-tile')}
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const square = canvas.getByTestId('square-icon-tile')
    const circle = canvas.getByTestId('circle-icon-tile')
    const squareIcon = getTileIcon(square)
    const circleIcon = getTileIcon(circle)
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('IconTile story window is unavailable')

    await expect(square).toHaveClass('pathable-icon-tile')
    await expect(square).not.toHaveClass('pathable-icon-tile--circle')
    await expect(circle).toHaveClass(
      'pathable-icon-tile',
      'pathable-icon-tile--circle',
    )
    await expect(square).toHaveAttribute('aria-hidden', 'true')
    await expect(circle).toHaveAttribute('aria-hidden', 'true')
    await expect(square.tagName).toBe('SPAN')
    await expect(circle.tagName).toBe('SPAN')
    await expect(square).not.toHaveAttribute('role')
    await expect(circle).not.toHaveAttribute('role')
    await expect(square).not.toHaveAttribute('tabindex')
    await expect(circle).not.toHaveAttribute('tabindex')
    await expect(view.getComputedStyle(square).display).toBe('flex')
    await expect(view.getComputedStyle(square).alignItems).toBe('center')
    await expect(view.getComputedStyle(square).justifyContent).toBe('center')
    await expect(view.getComputedStyle(square).borderRadius).not.toBe('50%')
    await expect(view.getComputedStyle(circle).borderRadius).toBe('50%')
    await expectCentered(square, squareIcon)
    await expectCentered(circle, circleIcon)
  },
}

export const SizeVariants = {
  render: () => `
    ${sectionHeading('Compact / Default / Large')}
    <p style="color: var(--pathable-color-text-muted); font-size: 0.875rem; margin: 0 0 1rem;">
      Three predefined sizes: compact (32px), default (44px), and large (52px).
    </p>
    ${shapes
      .map(
        (shape) => `
          <div class="pathable-cluster" style="align-items: center; margin-top: 0.5rem;">
            ${sizes
              .map(({ name, modifier }) => {
                const shapeModifier =
                  shape === 'circle' ? 'pathable-icon-tile--circle' : ''
                const modifiers = [shapeModifier, modifier]
                  .filter(Boolean)
                  .join(' ')
                return iconTileWithText(
                  modifiers,
                  `bell - ${shape} ${name}`,
                  `${name} ${shape}`,
                  false,
                  `${shape}-${name}-icon-tile`,
                )
              })
              .join('')}
          </div>
        `,
      )
      .join('')}
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('IconTile story window is unavailable')

    for (const shape of shapes) {
      for (const size of sizes) {
        const tile = canvas.getByTestId(`${shape}-${size.name}-icon-tile`)
        const icon = getTileIcon(tile)
        const tileBounds = tile.getBoundingClientRect()
        const iconBounds = icon.getBoundingClientRect()
        const tileStyle = view.getComputedStyle(tile)

        await expect(tile).toHaveClass('pathable-icon-tile')
        if (size.modifier) await expect(tile).toHaveClass(size.modifier)
        if (shape === 'circle') {
          await expect(tile).toHaveClass('pathable-icon-tile--circle')
          await expect(tileStyle.borderRadius).toBe('50%')
        } else {
          await expect(tile).not.toHaveClass('pathable-icon-tile--circle')
          await expect(tileStyle.borderRadius).not.toBe('50%')
        }
        await expect(tileBounds.width).toBeCloseTo(size.tile, 3)
        await expect(tileBounds.height).toBeCloseTo(size.tile, 3)
        await expect(iconBounds.width).toBeCloseTo(size.icon, 3)
        await expect(iconBounds.height).toBeCloseTo(size.icon, 3)
        await expect(tileStyle.flexShrink).toBe('0')
        await expectCentered(tile, icon)
      }
    }
  },
}

export const DecorativeWithStatusText = {
  render: () => `
    <div style="display: inline-flex; align-items: center; gap: 0.5rem;">
      ${iconTile('pathable-icon-tile--success', 'Application approved', false, 'decorative-status-tile')}
      <span>Application approved</span>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const tile = canvas.getByTestId('decorative-status-tile')
    const icon = canvas.getByTestId('decorative-status-tile-icon')

    await expect(tile).toHaveClass(
      'pathable-icon-tile',
      'pathable-icon-tile--success',
    )
    await expect(tile).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('focusable', 'false')
    await expect(canvas.getByText('Application approved')).toBeVisible()
    await expect(canvas.queryByRole('img')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument()
    await expect(tile.tagName).toBe('SPAN')
    await expect(tile).not.toHaveAttribute('role')
    await expect(tile).not.toHaveAttribute('tabindex')
  },
}

export const MeaningfulStatusIcon = {
  render: () => `
    ${iconTile('pathable-icon-tile--circle pathable-icon-tile--info', 'Three unread messages', true, 'meaningful-status-tile')}
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const tile = canvas.getByTestId('meaningful-status-tile')
    const icon = canvas.getByRole('img', { name: 'Three unread messages' })

    await expect(tile).toHaveClass(
      'pathable-icon-tile',
      'pathable-icon-tile--circle',
      'pathable-icon-tile--info',
    )
    await expect(tile).not.toHaveAttribute('aria-hidden')
    await expect(icon).toHaveAttribute('focusable', 'false')
    await expect(icon.parentElement).toBe(tile)
    await expect(canvas.getAllByRole('img')).toHaveLength(1)
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument()
    await expect(tile.tagName).toBe('SPAN')
    await expect(tile).not.toHaveAttribute('role')
    await expect(tile).not.toHaveAttribute('tabindex')
  },
}

export const StatusVariants = {
  render: () => `
    ${sectionHeading('Status Color Variants')}
    <p style="color: var(--pathable-color-text-muted); font-size: 0.875rem; margin: 0 0 1rem;">
      Foreground color tokens for status indicators with adjacent text. These icons are decorative and hidden from assistive technology.
    </p>
    ${shapes
      .map(
        (shape) => `
          <div class="pathable-cluster" style="align-items: center; margin-top: 0.5rem;">
            ${statuses
              .map(({ name, modifier }) => {
                const shapeModifier =
                  shape === 'circle' ? 'pathable-icon-tile--circle' : ''
                const modifiers = [shapeModifier, modifier]
                  .filter(Boolean)
                  .join(' ')
                return iconTileWithText(
                  modifiers,
                  `${name} ${shape}`,
                  `${name} ${shape}`,
                  false,
                  `${shape}-${name}-status-tile`,
                )
              })
              .join('')}
          </div>
        `,
      )
      .join('')}
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView
    const background = resolveColorToken(canvasElement, '--pathable-color-bg')

    if (!view) throw new Error('IconTile story window is unavailable')

    for (const shape of shapes) {
      for (const status of statuses) {
        const tile = canvas.getByTestId(`${shape}-${status.name}-status-tile`)
        const icon = getTileIcon(tile)
        const tileStyle = view.getComputedStyle(tile)
        const iconStyle = view.getComputedStyle(icon)
        const expectedColor = resolveColorToken(canvasElement, status.token)
        const bounds = tile.getBoundingClientRect()

        await expect(tile).toHaveClass('pathable-icon-tile')
        if (status.modifier) await expect(tile).toHaveClass(status.modifier)
        await expect(tileStyle.color).toBe(expectedColor)
        await expect(iconStyle.color).toBe(expectedColor)
        await expect(tileStyle.backgroundColor).toBe(background)
        await expect(bounds.width).toBeCloseTo(44, 3)
        await expect(bounds.height).toBeCloseTo(44, 3)
        await expect(tile).toHaveAttribute('aria-hidden', 'true')
      }
    }

    await expect(canvas.queryByRole('img')).not.toBeInTheDocument()
  },
}

export const InlineAlignment = {
  render: () => `
    ${sectionHeading('Inline Icon with Text Alignment')}
    <p style="color: var(--pathable-color-text-muted); font-size: 0.875rem; margin: 0 0 1rem;">
      Icon tiles align naturally with text in an inline flow. Use <code>display: inline-flex</code> on the wrapper with <code>gap</code> for spacing.
    </p>
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      <div data-testid="inline-alignment-row" style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="pathable-icon-tile pathable-icon-tile--success" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </span>
        <span style="font-size: 0.875rem;">Training record verified</span>
      </div>
      <div data-testid="inline-alignment-row" style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="pathable-icon-tile pathable-icon-tile--error" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </span>
        <span style="font-size: 0.875rem;">Missing required documentation</span>
      </div>
      <div data-testid="inline-alignment-row" style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="pathable-icon-tile pathable-icon-tile--warning" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        <span style="font-size: 0.875rem;">Approval pending review</span>
      </div>
      <div data-testid="inline-alignment-row" style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="pathable-icon-tile pathable-icon-tile--circle pathable-icon-tile--info" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </span>
        <span style="font-size: 0.875rem;">3 new messages</span>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const rows = canvas.getAllByTestId('inline-alignment-row')
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('IconTile story window is unavailable')

    await expect(rows).toHaveLength(4)

    for (const row of rows) {
      const tile = row.querySelector<HTMLElement>('.pathable-icon-tile')
      const text = tile?.nextElementSibling as HTMLElement | null

      if (!tile || !text) {
        throw new Error('Inline IconTile row is missing its tile or label')
      }

      const rowStyle = view.getComputedStyle(row)
      const tileBounds = tile.getBoundingClientRect()
      const textBounds = text.getBoundingClientRect()

      await expect(rowStyle.display).toBe('flex')
      await expect(rowStyle.alignItems).toBe('center')
      await expect(tileBounds.width).toBeCloseTo(44, 3)
      await expect(tileBounds.height).toBeCloseTo(44, 3)
      await expect(tileBounds.top + tileBounds.height / 2).toBeCloseTo(
        textBounds.top + textBounds.height / 2,
        2,
      )
      await expect(tile).toHaveAttribute('aria-hidden', 'true')
      await expect(tile).not.toHaveAttribute('role')
      await expect(tile).not.toHaveAttribute('tabindex')
      await expect(text).toBeVisible()
    }

    await expect(canvas.queryByRole('img')).not.toBeInTheDocument()
  },
}

export const InlineContentPressure = {
  render: () => `
    <div data-testid="icon-tile-content-pressure" style="width: 16rem; max-width: 100%;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        ${iconTile('pathable-icon-tile--warning', 'Approval pending', false, 'pressure-icon-tile')}
        <span>Approval pending regional documentation and eligibility review</span>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const fixture = canvas.getByTestId('icon-tile-content-pressure')
    const tile = canvas.getByTestId('pressure-icon-tile')
    const text = canvas.getByText(
      'Approval pending regional documentation and eligibility review',
    )
    const bounds = tile.getBoundingClientRect()
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('IconTile story window is unavailable')

    await expect(tile).toHaveClass(
      'pathable-icon-tile',
      'pathable-icon-tile--warning',
    )
    await expect(bounds.width).toBeCloseTo(44, 3)
    await expect(bounds.height).toBeCloseTo(44, 3)
    await expect(view.getComputedStyle(tile).flexShrink).toBe('0')
    await expect(text).toBeVisible()
    await expect(fixture.scrollWidth).toBeLessThanOrEqual(fixture.clientWidth)
  },
}

export const IncreasedText = {
  render: () => `
    <div data-testid="icon-tile-increased-text" style="width: 20rem; max-width: 100%;">
      <div data-testid="icon-tile-increased-text-row" style="display: flex; align-items: center; gap: 0.5rem;">
        ${iconTile('pathable-icon-tile--success', 'Training verified', false, 'increased-text-icon-tile')}
        <span data-testid="icon-tile-increased-text-label" style="font-size: 2rem; line-height: 1.25;">Training record verified</span>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const fixture = canvas.getByTestId('icon-tile-increased-text')
    const tile = canvas.getByTestId('increased-text-icon-tile')
    const text = canvas.getByTestId('icon-tile-increased-text-label')
    const tileBounds = tile.getBoundingClientRect()
    const textBounds = text.getBoundingClientRect()

    await expect(tileBounds.width).toBeCloseTo(44, 3)
    await expect(tileBounds.height).toBeCloseTo(44, 3)
    await expect(tileBounds.top + tileBounds.height / 2).toBeCloseTo(
      textBounds.top + textBounds.height / 2,
      2,
    )
    await expect(text).toBeVisible()
    await expect(fixture.scrollWidth).toBeLessThanOrEqual(fixture.clientWidth)
  },
}

export const CustomSizing = {
  render: () => `
    <span
      class="pathable-icon-tile pathable-icon-tile--circle"
      aria-hidden="true"
      data-testid="custom-sized-icon-tile"
      style="--pathable-icon-tile-size: 48px; --pathable-icon-tile-icon-size: 28px;"
    >
      <svg data-testid="custom-sized-icon" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" focusable="false" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      </svg>
    </span>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const tile = canvas.getByTestId('custom-sized-icon-tile')
    const icon = canvas.getByTestId(
      'custom-sized-icon',
    ) as unknown as SVGElement
    const tileBounds = tile.getBoundingClientRect()
    const iconBounds = icon.getBoundingClientRect()

    await expect(tileBounds.width).toBeCloseTo(48, 3)
    await expect(tileBounds.height).toBeCloseTo(48, 3)
    await expect(iconBounds.width).toBeCloseTo(28, 3)
    await expect(iconBounds.height).toBeCloseTo(28, 3)
    await expectCentered(tile, icon)
  },
}

export const AllVariants = {
  render: () => `
    ${sectionHeading('All Icon Tile Variants')}
    <p style="color: var(--pathable-color-text-muted); font-size: 0.875rem; margin: 0 0 1rem;">
      Every shape, size, and status combination in the IconTile contract.
    </p>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        ${shapes
          .map(
            (shape) => `
              <span style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.5rem;">${shape}</span>
              <div class="pathable-cluster" style="align-items: center;">
                ${sizes
                  .flatMap((size) =>
                    statuses.map((status) => {
                      const modifiers = [
                        shape === 'circle' ? 'pathable-icon-tile--circle' : '',
                        size.modifier,
                        status.modifier,
                      ]
                        .filter(Boolean)
                        .join(' ')
                      const id = `${shape}-${size.name}-${status.name}-variant`
                      return iconTile(
                        modifiers,
                        `${shape} ${size.name} ${status.name}`,
                        false,
                        id,
                      )
                    }),
                  )
                  .join('')}
              </div>
            `,
          )
          .join('')}
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    let count = 0

    for (const shape of shapes) {
      for (const size of sizes) {
        for (const status of statuses) {
          const tile = canvas.getByTestId(
            `${shape}-${size.name}-${status.name}-variant`,
          )
          const bounds = tile.getBoundingClientRect()

          count += 1
          await expect(tile).toHaveClass('pathable-icon-tile')
          if (shape === 'circle') {
            await expect(tile).toHaveClass('pathable-icon-tile--circle')
          }
          if (size.modifier) await expect(tile).toHaveClass(size.modifier)
          if (status.modifier) await expect(tile).toHaveClass(status.modifier)
          await expect(bounds.width).toBeCloseTo(size.tile, 3)
          await expect(bounds.height).toBeCloseTo(size.tile, 3)
          await expect(tile).toHaveAttribute('aria-hidden', 'true')
        }
      }
    }

    await expect(count).toBe(30)
    await expect(canvas.queryByRole('img')).not.toBeInTheDocument()
  },
}

export const Default = AllVariants
