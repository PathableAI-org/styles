import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'

import { Icon } from '../../../components/Icon/Icon'
import { IconButton } from '../../../components/IconButton/IconButton'

function ClockGlyph() {
  return (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  )
}

function BellGlyph() {
  return (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M14 21h-4" />
    </>
  )
}

function CheckGlyph() {
  return (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  )
}

function CloseGlyph() {
  return <path d="M6 6l12 12M18 6 6 18" />
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

**Known constraints**: Icon does not ship artwork, a named icon registry, interactions, tooltips, or size variants. Consumers provide SVG children and presentation attributes such as fill, stroke, width, and height.`,
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
    width: {
      control: { type: 'text' },
      description: 'Consumer-owned native SVG width.',
    },
    height: {
      control: { type: 'text' },
      description: 'Consumer-owned native SVG height.',
    },
    fill: {
      control: { type: 'text' },
      description:
        'Native SVG fill paint, commonly currentColor or none depending on the artwork.',
    },
    stroke: {
      control: { type: 'text' },
      description:
        'Native SVG stroke paint, commonly currentColor for outline artwork.',
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
    width: 24,
    height: 24,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
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
    width: 48,
    height: 48,
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
    <div className="pathable-cluster pathable-cluster--gap-lg">
      <div className="pathable-stack pathable-stack--gap-sm">
        <Icon
          width="32"
          height="32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <ClockGlyph />
        </Icon>
        <span>Clock</span>
      </div>
      <div className="pathable-stack pathable-stack--gap-sm">
        <Icon
          width="32"
          height="32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <BellGlyph />
        </Icon>
        <span>Bell</span>
      </div>
      <div className="pathable-stack pathable-stack--gap-sm">
        <Icon
          width="32"
          height="32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <CheckGlyph />
        </Icon>
        <span>Check</span>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Clock')).toBeVisible()
    await expect(canvas.getByText('Bell')).toBeVisible()
    await expect(canvas.getByText('Check')).toBeVisible()
    await expect(canvasElement.querySelectorAll('svg')).toHaveLength(3)
  },
}

export const IconButtonComposition: Story = {
  render: () => (
    <IconButton appearance="subtle" aria-label="Close appointment details">
      <Icon
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
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
