import { expect, within } from 'storybook/test'

export default {
  title: 'Components/Layout/Icon',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Semantics verified**: Meaningful icons expose an image role and accessible name. Decorative icons are hidden from assistive technology while adjacent text retains the meaning. Every icon renders at 24 px and paints its shapes in the current text colour.\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required. Use filled artwork, such as the USWDS icon set these stories draw from: `.pathable-icon` paints with `fill: currentColor`, which overrides a `fill="none"` attribute, so stroke-only artwork renders as solid shapes. Size the icon through `font-size`: `.pathable-icon` is `1em` square, which overrides the `width` and `height` attributes. Keep those attributes at the intended size as the fallback when the CSS has not loaded.',
      },
    },
  },
}

/**
 * Filled artwork from the USWDS icon set (`@uswds/uswds/dist/img/usa-icons`),
 * which `.pathable-icon` wraps through `.usa-icon`.
 */
const ICONS: ReadonlyArray<{ name: string; paths: readonly string[] }> = [
  {
    name: 'schedule',
    paths: [
      'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
      'M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z',
    ],
  },
  {
    name: 'insights',
    paths: [
      'M21 8c-1.45 0-2.26 1.44-1.93 2.51l-3.55 3.56c-.3-.09-.74-.09-1.04 0l-2.55-2.55C12.27 10.45 11.46 9 10 9c-1.45 0-2.27 1.44-1.93 2.52l-4.56 4.55C2.44 15.74 1 16.55 1 18c0 1.1.9 2 2 2 1.45 0 2.26-1.44 1.93-2.51l4.55-4.56c.3.09.74.09 1.04 0l2.55 2.55C12.73 16.55 13.54 18 15 18c1.45 0 2.27-1.44 1.93-2.52l3.56-3.55c1.07.33 2.51-.48 2.51-1.93 0-1.1-.9-2-2-2z',
      'm15 9 .94-2.07L18 6l-2.06-.93L15 3l-.92 2.07L12 6l2.08.93zM3.5 11 4 9l2-.5L4 8l-.5-2L3 8l-2 .5L3 9z',
    ],
  },
  {
    name: 'notifications',
    paths: [
      'M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
    ],
  },
  {
    name: 'folder',
    paths: [
      'M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z',
    ],
  },
  {
    name: 'launch',
    paths: [
      'M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z',
    ],
  },
  {
    name: 'file_present',
    paths: [
      'M15 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7l-5-5zM6 20V4h8v4h4v12H6zm10-10v5c0 2.21-1.79 4-4 4s-4-1.79-4-4V8.5a2.5 2.5 0 0 1 2.76-2.49c1.3.13 2.24 1.32 2.24 2.63V15h-2V8.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V15c0 1.1.9 2 2 2s2-.9 2-2v-5h2z',
    ],
  },
  {
    name: 'search',
    paths: [
      'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    ],
  },
  {
    name: 'verified_user',
    paths: [
      'M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z',
    ],
  },
  {
    name: 'trending_up',
    paths: [
      'm16 6 2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z',
    ],
  },
  {
    name: 'check_circle',
    paths: [
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    ],
  },
  {
    name: 'person',
    paths: [
      'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    ],
  },
  {
    name: 'mail',
    paths: [
      'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z',
    ],
  },
]

const CLOCK = ICONS[0]

/** `.pathable-icon` is `1em` square, so 1.5rem sizes the icon to 24 px. */
const ICON_SIZE_STYLE = 'font-size: 1.5rem;'

const iconPaths = (paths: readonly string[]) =>
  paths.map((d) => `<path d="${d}" />`).join('')

const iconTile = ({ name, paths }: (typeof ICONS)[number]) => `
  <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100px; text-align: center;">
    <svg class="pathable-icon" style="${ICON_SIZE_STYLE}" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${iconPaths(paths)}</svg>
    <span style="font-size: 0.75rem;">${name}</span>
  </div>`

/**
 * The icon renders at its intended 24 px and paints every shape with the
 * current text colour. The artwork is filled, not stroked: `.pathable-icon`
 * fills stroke-only artwork into solid shapes (#310), so no shape may carry a
 * stroke.
 */
const verifyIconRendering = async (icon: Element) => {
  const style = getComputedStyle(icon)

  await expect(icon).toHaveClass('pathable-icon')
  await expect(style.width).toBe('24px')
  await expect(style.height).toBe('24px')
  await expect(style.fill).toBe(style.color)
  await expect(style.stroke).toBe('none')

  const shapes = icon.querySelectorAll('path')
  await expect(shapes.length).toBeGreaterThan(0)
  for (const shape of shapes) {
    const shapeStyle = getComputedStyle(shape)
    await expect(shapeStyle.fill).toBe(style.color)
    await expect(shapeStyle.stroke).toBe('none')
  }
}

export const AllIcons = {
  render: () => `
<div style="display: flex; flex-wrap: wrap; gap: 1rem; padding: 1rem;">${ICONS.map(iconTile).join('')}
</div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const icons = canvasElement.querySelectorAll('svg')

    await expect(icons).toHaveLength(ICONS.length)
    for (const icon of icons) {
      await verifyIconRendering(icon)
    }
  },
}

export const Default = AllIcons

export const MeaningfulIcon = {
  render: () => `
    <svg class="pathable-icon" style="${ICON_SIZE_STYLE}" role="img" aria-label="Upcoming appointment" focusable="false" width="24" height="24" viewBox="0 0 24 24">${iconPaths(CLOCK.paths)}</svg>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const icon = canvas.getByRole('img', { name: 'Upcoming appointment' })

    await expect(icon).toHaveAttribute('focusable', 'false')
    await verifyIconRendering(icon)
  },
}

export const DecorativeIcon = {
  render: () => `
    <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
      <svg data-testid="decorative-icon" class="pathable-icon" style="${ICON_SIZE_STYLE}" aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24">${iconPaths(CLOCK.paths)}</svg>
      <span>Upcoming appointment at 2:00 PM</span>
    </span>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const icon = canvas.getByTestId('decorative-icon')
    const text = canvas.getByText('Upcoming appointment at 2:00 PM')

    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('focusable', 'false')
    await expect(canvas.queryByRole('img')).toBeNull()
    await expect(text).toBeVisible()
    await expect(text.closest('[aria-hidden="true"]')).toBeNull()
    await verifyIconRendering(icon)
  },
}
