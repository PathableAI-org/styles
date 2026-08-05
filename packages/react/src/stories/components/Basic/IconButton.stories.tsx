import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

import {
  IconButton,
  type IconButtonAppearance,
  type IconButtonShape,
  type IconButtonSize,
} from '../../../components/IconButton/IconButton'

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  )
}

function contrastRatio(foreground: string, background: string) {
  const luminance = (value: string) => {
    const channels = value
      .match(/[\d.]+/g)
      ?.slice(0, 3)
      .map(Number)
    if (!channels || channels.length !== 3) {
      throw new Error(`Unsupported computed color: ${value}`)
    }

    const [red, green, blue] = channels.map((channel) => {
      const normalized = channel / 255
      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4
    })

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue
  }

  const foregroundLuminance = luminance(foreground)
  const backgroundLuminance = luminance(background)
  const lighter = Math.max(foregroundLuminance, backgroundLuminance)
  const darker = Math.min(foregroundLuminance, backgroundLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `An icon-only native button for compact actions, using the existing PathAble IconButton visual contract.

**When to use**: Use IconButton for familiar, concise actions such as closing a panel, opening a menu, deleting an item, or showing more options when visible button text would be unnecessarily repetitive.

**When not to use**: Do not use IconButton when the symbol is unfamiliar, the action requires explanation, or visible text would improve comprehension. Use Button for labelled actions and Link for navigation.

**Underlying element**: A native \`<button type="button">\` containing consumer-provided icon content.

**Accessibility**: Every IconButton requires an accessible name through \`aria-label\` or \`aria-labelledby\`. Decorative SVG children should use \`aria-hidden="true"\` and \`focusable="false"\`. The compact size is 32px and should be limited to dense desktop interfaces; prefer the 44px default for touch targets.

**Known constraints**: IconButton does not provide icons, tooltips, loading behavior, or persistent toggle styling. Native button attributes and \`aria-pressed\` are forwarded to the underlying element.`,
      },
    },
  },
  argTypes: {
    appearance: {
      options: ['bare', 'subtle', 'bordered', 'inverse', 'destructive'],
      control: { type: 'select' },
      description:
        'Visual treatment for the action. Use destructive only for dangerous or irreversible actions and inverse on an appropriate contrasting surface.',
    },
    size: {
      options: ['compact', 'default', 'large'],
      control: { type: 'select' },
      description:
        'Target size. Prefer the 44px default; reserve the 32px compact size for dense desktop controls.',
    },
    shape: {
      options: ['square', 'circle'],
      control: { type: 'select' },
      description:
        'Rounded-square or circular presentation without changing button semantics.',
    },
    children: {
      control: false,
      description:
        'Consumer-provided icon content. Decorative SVGs should be hidden from assistive technology.',
    },
    'aria-label': {
      control: { type: 'text' },
      description:
        'Accessible action name. Use aria-labelledby instead when visible text elsewhere provides the name.',
    },
    disabled: {
      control: { type: 'boolean' },
      description:
        'Native disabled state that prevents focus and pointer or keyboard activation.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional class names appended after the PathAble IconButton classes.',
    },
  },
  args: {
    appearance: 'bare',
    size: 'default',
    shape: 'square',
    'aria-label': 'Close panel',
    children: <CloseIcon />,
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Close panel' })
    const icon = button.querySelector('svg')

    await expect(button).toHaveClass(
      'pathable-icon-button',
      'pathable-icon-button--bare',
    )
    await expect(button).not.toHaveClass(
      'pathable-icon-button--compact',
      'pathable-icon-button--large',
      'pathable-icon-button--circle',
    )
    await expect(button).toHaveAttribute('type', 'button')
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('focusable', 'false')
  },
}

export const Subtle: Story = {
  args: { appearance: 'subtle' },
}

export const Bordered: Story = {
  args: { appearance: 'bordered' },
}

export const Inverse: Story = {
  args: { appearance: 'inverse' },
  decorators: [
    (Story) => (
      <div className="pathable-surface pathable-surface--inverse pathable-padding-4">
        <Story />
      </div>
    ),
  ],
}

export const Destructive: Story = {
  args: {
    appearance: 'destructive',
    'aria-label': 'Delete participant record',
    children: <DeleteIcon />,
  },
}

export const Compact: Story = {
  args: { size: 'compact' },
}

export const Large: Story = {
  args: { size: 'large' },
}

export const Circle: Story = {
  args: { shape: 'circle' },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-label': 'Close panel unavailable',
  },
}

export const LongAccessibleName: Story = {
  args: {
    'aria-label':
      'Close the participant employment coaching details side panel',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', {
        name: 'Close the participant employment coaching details side panel',
      }),
    ).toBeVisible()
  },
}

export const Narrow: Story = {
  args: {
    appearance: 'subtle',
    'aria-label': 'Open navigation menu',
    children: <MenuIcon />,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const CustomAttributes: Story = {
  args: {
    appearance: 'bordered',
    className: 'custom-icon-button',
    id: 'participant-menu-button',
    'aria-label': 'Open participant actions',
    'aria-controls': 'participant-actions',
    'aria-expanded': false,
    'data-state': 'closed',
    children: <MenuIcon />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', {
      name: 'Open participant actions',
    })

    await expect(button).toHaveClass(
      'pathable-icon-button',
      'pathable-icon-button--bordered',
      'custom-icon-button',
    )
    await expect(button).toHaveAttribute('id', 'participant-menu-button')
    await expect(button).toHaveAttribute('aria-controls', 'participant-actions')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(button).toHaveAttribute('data-state', 'closed')
  },
}

export const UnsupportedValuesFallback: Story = {
  render: () => (
    <IconButton
      appearance={'unsupported' as IconButtonAppearance}
      size={'unsupported' as IconButtonSize}
      shape={'unsupported' as IconButtonShape}
      aria-label="Fallback icon action"
    >
      <CloseIcon />
    </IconButton>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Fallback icon action' })

    await expect(button).toHaveClass(
      'pathable-icon-button',
      'pathable-icon-button--bare',
    )
    await expect(button.className).not.toContain('unsupported')
  },
}

export const ClickActivation: Story = {
  args: {
    appearance: 'subtle',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Close panel' }))
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const KeyboardActivation: Story = {
  args: {
    appearance: 'bordered',
    onClick: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Close panel' })

    await step('focuses with a visible keyboard indicator', async () => {
      await userEvent.tab()
      await expect(button).toHaveFocus()
      const style = window.getComputedStyle(button)
      await expect(style.outlineStyle).not.toBe('none')
      await expect(
        Number.parseFloat(style.outlineWidth),
      ).toBeGreaterThanOrEqual(2)
    })

    await step('activates once with Enter', async () => {
      await userEvent.keyboard('{Enter}')
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })

    await step('activates once with Space', async () => {
      await userEvent.keyboard(' ')
      await expect(args.onClick).toHaveBeenCalledTimes(2)
    })
  },
}

export const DisabledInteraction: Story = {
  args: {
    disabled: true,
    onClick: fn(),
  },
  render: (args) => (
    <div>
      <IconButton {...args} />
      <button type="button">Next control</button>
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Close panel' })
    const next = canvas.getByRole('button', { name: 'Next control' })

    await expect(button).toBeDisabled()
    await userEvent.click(button, { skipPointerEventsCheck: true })
    await expect(args.onClick).not.toHaveBeenCalled()
    await userEvent.tab()
    await expect(next).toHaveFocus()
  },
}

export const DisabledAppearances: Story = {
  render: () => (
    <div className="pathable-cluster pathable-cluster--gap-lg">
      {(
        [
          'bare',
          'subtle',
          'bordered',
          'inverse',
          'destructive',
        ] satisfies IconButtonAppearance[]
      ).map((appearance) => (
        <IconButton
          key={appearance}
          appearance={appearance}
          disabled
          aria-label={`Disabled ${appearance} action`}
        >
          <CloseIcon />
        </IconButton>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const appearance of [
      'bare',
      'subtle',
      'bordered',
      'inverse',
      'destructive',
    ] satisfies IconButtonAppearance[]) {
      const button = canvas.getByRole('button', {
        name: `Disabled ${appearance} action`,
      })
      const style = window.getComputedStyle(button)
      const restingStyle = {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        color: style.color,
        opacity: style.opacity,
      }

      await expect(button).toBeDisabled()
      await expect(
        contrastRatio(restingStyle.color, restingStyle.backgroundColor),
      ).toBeGreaterThanOrEqual(3)
      await userEvent.hover(button)

      const hoverStyle = window.getComputedStyle(button)
      await expect({
        backgroundColor: hoverStyle.backgroundColor,
        borderColor: hoverStyle.borderColor,
        color: hoverStyle.color,
        opacity: hoverStyle.opacity,
      }).toEqual(restingStyle)

      await userEvent.unhover(button)
    }
  },
}

export const OnDifferentSurfaces: Story = {
  render: () => (
    <div className="pathable-cluster pathable-cluster--gap-lg">
      <div className="pathable-surface pathable-surface--base pathable-padding-4">
        <IconButton appearance="bare" aria-label="Close base panel">
          <CloseIcon />
        </IconButton>
      </div>
      <div className="pathable-surface pathable-surface--brand pathable-padding-4">
        <IconButton appearance="bare" aria-label="Close brand panel">
          <CloseIcon />
        </IconButton>
      </div>
      <div className="pathable-surface pathable-surface--inverse pathable-padding-4">
        <IconButton appearance="inverse" aria-label="Close inverse panel">
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of [
      'Close base panel',
      'Close brand panel',
      'Close inverse panel',
    ]) {
      await userEvent.tab()
      const button = canvas.getByRole('button', { name })
      await expect(button).toHaveFocus()
      await expect(window.getComputedStyle(button).outlineStyle).not.toBe(
        'none',
      )

      if (name === 'Close brand panel') {
        const brandSurface = button.parentElement
        await expect(brandSurface).not.toBeNull()
        await expect(
          contrastRatio(
            window.getComputedStyle(button).outlineColor,
            window.getComputedStyle(brandSurface as HTMLElement)
              .backgroundColor,
          ),
        ).toBeGreaterThanOrEqual(3)
      }
    }
  },
}

export const NestedSurfaces: Story = {
  render: () => (
    <div className="pathable-cluster pathable-cluster--gap-lg">
      <div className="pathable-surface pathable-surface--brand pathable-padding-4">
        <div className="pathable-surface pathable-surface--inverse pathable-padding-4">
          <IconButton
            appearance="inverse"
            aria-label="Close nested inverse panel"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </div>
      <div className="pathable-surface pathable-surface--inverse pathable-padding-4">
        <div className="pathable-surface pathable-surface--brand pathable-padding-4">
          <IconButton appearance="bare" aria-label="Close nested brand panel">
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const name of [
      'Close nested inverse panel',
      'Close nested brand panel',
    ]) {
      await userEvent.tab()
      const button = canvas.getByRole('button', { name })
      const surface = button.parentElement

      await expect(button).toHaveFocus()
      await expect(surface).not.toBeNull()
      await expect(
        contrastRatio(
          window.getComputedStyle(button).outlineColor,
          window.getComputedStyle(surface as HTMLElement).backgroundColor,
        ),
      ).toBeGreaterThanOrEqual(3)
    }
  },
}

export const ToolbarComposition: Story = {
  render: () => (
    <div
      role="group"
      aria-label="Participant record actions"
      className="pathable-cluster pathable-cluster--gap-sm"
    >
      <IconButton appearance="subtle" aria-label="Open navigation menu">
        <MenuIcon />
      </IconButton>
      <IconButton appearance="bordered" aria-label="Close participant record">
        <CloseIcon />
      </IconButton>
      <IconButton
        appearance="destructive"
        aria-label="Delete participant record"
      >
        <DeleteIcon />
      </IconButton>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Participant record actions' }),
    ).toBeVisible()
    await expect(canvas.getAllByRole('button')).toHaveLength(3)
  },
}
