import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'

import { Icon } from '../../../components/Icon/Icon'
import { IconButton } from '../../../components/IconButton/IconButton'

/*
 * Filled artwork from the USWDS icon set (`@uswds/uswds/dist/img/usa-icons`),
 * which `.pathable-icon` wraps through `.usa-icon`. `.pathable-icon` paints
 * with `fill: currentColor`, so stroke-only artwork would render as solid
 * shapes.
 */

function ClockGlyph() {
  return (
    <>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
      <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </>
  )
}

function BellGlyph() {
  return (
    <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  )
}

function CheckGlyph() {
  return (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  )
}

function CloseGlyph() {
  return (
    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  )
}

/**
 * `.pathable-icon` is `1em` square and paints every shape with
 * `fill: currentColor`. The stories set no `width`, `height` or `fill`
 * attributes, so without the class each icon would render at the SVG default
 * size (300 by 150 px) and the size check would fail. `size` defaults to the
 * icon's own font size, which is what `1em` resolves to.
 */
async function expectIconContract(icon: Element | null, size?: string) {
  await expect(icon).not.toBeNull()
  if (!icon) return

  const style = getComputedStyle(icon)

  await expect(icon).toHaveClass('pathable-icon')
  await expect(style.width).toBe(size ?? style.fontSize)
  await expect(style.height).toBe(size ?? style.fontSize)
  await expect(style.fill).toBe(style.color)
  await expect(style.stroke).toBe('none')

  const shapes = icon.querySelectorAll('path')
  await expect(shapes.length).toBeGreaterThan(0)
  for (const shape of shapes) {
    await expect(getComputedStyle(shape).fill).toBe(style.color)
  }
}

const meta = {
  title: 'Components/Layout/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A thin native SVG wrapper that applies the PathAble icon visual contract while keeping icon artwork and semantics consumer-owned.

**When to use**: Use Icon to render consumer-provided SVG paths consistently in labels, status messages, controls, and compact compositions.

**When not to use**: Do not use Icon as an interactive control by itself. Wrap decorative Icon content in a labelled Button or IconButton for actions, and use visible text when a symbol may be unfamiliar.

**Underlying element**: A native \`<svg>\` with a default \`viewBox="0 0 24 24"\`.

**Accessibility**: Icons are decorative by default with \`aria-hidden="true"\` and \`focusable="false"\`. For a meaningful standalone icon, explicitly set \`aria-hidden={false}\`, \`role="img"\`, and an accessible name through \`aria-label\` or \`aria-labelledby\`.

**Sizing and fill**: Icon always applies \`.pathable-icon\`, which is \`1em\` square and paints with \`fill: currentColor\`. Those rules override the native \`width\`, \`height\` and \`fill\` attributes, so passing them has no visible effect. Size an icon through \`font-size\` on the icon or a parent (\`1.5rem\` renders 24 px), and set its colour through \`color\`. Use filled artwork, such as the USWDS icon set these stories draw from: stroke-only artwork (\`fill="none"\` with a stroke) renders as solid shapes. IconButton and IconTile size the icon inside them through their own rules.

**Known constraints**: Icon does not ship artwork, a named icon registry, interactions, tooltips, or size variants. Consumers provide filled SVG children.`,
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description:
        'Consumer-provided SVG shapes such as path, circle, or group.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional class names appended after the PathAble icon class.',
    },
    viewBox: {
      control: { type: 'text' },
      description:
        'Native SVG coordinate system. Defaults to the common 24 by 24 icon canvas.',
    },
    style: {
      control: { type: 'object' },
      description:
        'Inline styles. Set fontSize to size the icon, because .pathable-icon is 1em square and overrides the width and height attributes; set color to change its fill.',
    },
    role: {
      control: { type: 'text' },
      description:
        'Optional semantic role. Meaningful standalone icons normally use img.',
    },
    'aria-label': {
      control: { type: 'text' },
      description:
        'Accessible name for a meaningful icon. Also set aria-hidden to false and role to img.',
    },
    'aria-hidden': {
      control: { type: 'boolean' },
      description:
        'Excludes decorative artwork from the accessibility tree by default.',
    },
    focusable: {
      options: ['false', 'true', 'auto'],
      control: { type: 'radio' },
      description:
        'Native SVG focusability hint. Defaults to false because Icon is not an interactive control.',
    },
  },
  args: {
    children: <ClockGlyph />,
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('svg')

    await expect(icon).toHaveClass('pathable-icon')
    await expect(icon).toHaveAttribute('viewBox', '0 0 24 24')
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('focusable', 'false')
    await expectIconContract(icon)
  },
}

export const Decorative: Story = {
  args: {
    children: <BellGlyph />,
  },
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('svg')

    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).not.toHaveAttribute('role')
  },
}

export const Meaningful: Story = {
  args: {
    'aria-hidden': false,
    role: 'img',
    'aria-label': 'Appointment time',
  },
  play: async ({ canvasElement }) => {
    const icon = within(canvasElement).getByRole('img', {
      name: 'Appointment time',
    })

    await expect(icon).toHaveAttribute('aria-hidden', 'false')
    await expect(icon).toHaveAttribute('focusable', 'false')
  },
}

export const CustomSize: Story = {
  args: {
    style: { fontSize: '3rem' },
  },
  play: async ({ canvasElement }) => {
    await expectIconContract(canvasElement.querySelector('svg'), '48px')
  },
}

export const CurrentColor: Story = {
  decorators: [
    (Story) => (
      <div style={{ color: 'var(--pathable-color-link)' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('svg')

    await expect(icon).not.toBeNull()
    if (!icon) return
    // Black is the SVG initial fill, so a fill matching the non-black link
    // colour shows that fill: currentColor applied.
    await expect(getComputedStyle(icon).color).not.toBe('rgb(0, 0, 0)')
    await expectIconContract(icon)
  },
}

export const CustomAttributes: Story = {
  args: {
    id: 'appointment-time-icon',
    className: 'schedule-icon',
    'data-icon-name': 'clock',
    'aria-hidden': false,
    role: 'img',
    'aria-label': 'Scheduled appointment',
  },
  play: async ({ canvasElement }) => {
    const icon = within(canvasElement).getByRole('img', {
      name: 'Scheduled appointment',
    })

    await expect(icon).toHaveClass('pathable-icon', 'schedule-icon')
    await expect(icon).toHaveAttribute('id', 'appointment-time-icon')
    await expect(icon).toHaveAttribute('data-icon-name', 'clock')
  },
}

export const LongLabel: Story = {
  args: {
    'aria-hidden': false,
    role: 'img',
    'aria-label':
      'Appointment scheduled for employment coaching and workplace readiness planning',
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Appointment scheduled for employment coaching and workplace readiness planning',
      }),
    ).toBeVisible()
  },
}

export const Narrow: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const IconSet: Story = {
  render: () => (
    <div
      className="pathable-cluster pathable-cluster--gap-lg"
      style={{ fontSize: '2rem' }}
    >
      <div className="pathable-stack pathable-stack--gap-sm">
        <Icon>
          <ClockGlyph />
        </Icon>
        <span style={{ fontSize: '1rem' }}>Clock</span>
      </div>
      <div className="pathable-stack pathable-stack--gap-sm">
        <Icon>
          <BellGlyph />
        </Icon>
        <span style={{ fontSize: '1rem' }}>Bell</span>
      </div>
      <div className="pathable-stack pathable-stack--gap-sm">
        <Icon>
          <CheckGlyph />
        </Icon>
        <span style={{ fontSize: '1rem' }}>Check</span>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const icons = canvasElement.querySelectorAll('svg')

    await expect(canvas.getByText('Clock')).toBeVisible()
    await expect(canvas.getByText('Bell')).toBeVisible()
    await expect(canvas.getByText('Check')).toBeVisible()
    await expect(icons).toHaveLength(3)
    for (const icon of icons) {
      await expectIconContract(icon, '32px')
    }
  },
}

export const IconButtonComposition: Story = {
  render: () => (
    <IconButton appearance="subtle" aria-label="Close appointment details">
      <Icon>
        <CloseGlyph />
      </Icon>
    </IconButton>
  ),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Close appointment details',
    })
    const icon = button.querySelector('svg')

    await expect(button).toBeVisible()
    await expect(icon).toHaveClass('pathable-icon')
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
  },
}
