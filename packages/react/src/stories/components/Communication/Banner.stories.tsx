import { Banner } from '../../../components/Banner/Banner'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect, fn } from 'storybook/test'
import { LONG_CONTENT } from './fixtures'

const meta = {
  title: 'Components/Communication/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A disclosure widget that shows important but non-critical information that users can expand for more details.

**When to use**: To present a summary of important information with the option to reveal additional details. Ideal for site-wide notices, disclaimers, or guidance that most users do not need to see.

**When not to use**: Do not use for status alerts (use Alert or SiteAlert). Do not use for content that all users must read. Do not use for dismissible notifications.

**Keyboard behavior**: Enter or Space toggles the disclosure open or closed.

**Underlying element**: \`<section>\` with a button disclosure per the USWDS banner pattern.`,
      },
    },
  },
  argTypes: {
    summary: { description: 'Content shown in the toggle button.' },
    children: { description: 'Content revealed when expanded.' },
    expanded: {
      control: { type: 'boolean' },
      description: 'Controlled expanded state.',
    },
    defaultExpanded: {
      control: { type: 'boolean' },
      description: 'Default expanded state (uncontrolled).',
    },
    onExpandedChange: {
      action: 'expandedChange',
      description: 'Called with the boolean expanded state on toggle.',
    },
    id: {
      control: { type: 'text' },
      description: 'Custom id for stable aria relationships.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS class names.',
    },
  },
  args: {
    summary: "Here's how you know",
    children: (
      <p>
        Reminder: Session documentation must be completed within 24 hours.{' '}
        <a href="#/">View compliance policy</a>.
      </p>
    ),
  },
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {}

// ---------------------------------------------------------------------------
// Fixed stories
// ---------------------------------------------------------------------------

export const Collapsed: Story = {
  args: {
    summary: "Here's how you know",
    defaultExpanded: false,
    children: <p>The banner content is initially hidden.</p>,
  },
}

export const Expanded: Story = {
  args: {
    summary: "Here's how you know",
    defaultExpanded: true,
    children: <p>The banner content is initially visible.</p>,
  },
}

export const LongContent: Story = {
  args: {
    summary: 'Important Information',
    defaultExpanded: true,
    children: <p>{LONG_CONTENT}</p>,
  },
}

export const Narrow: Story = {
  args: {
    summary: "Here's how you know",
    children: <p>Banner content on a narrow viewport.</p>,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

// ---------------------------------------------------------------------------
// Interaction tests
// ---------------------------------------------------------------------------

export const ToggleBehavior: Story = {
  args: {
    summary: 'Click to reveal',
    children: <p>Revealed content.</p>,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('click expands the banner content', async () => {
      const button = canvas.getByRole('button', { name: /Click to reveal/ })
      await userEvent.click(button)
      await expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    await step('click collapses the banner content', async () => {
      const button = canvas.getByRole('button', { name: /Click to reveal/ })
      await userEvent.click(button)
      await expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  },
}

export const ControlledExpanded: Story = {
  args: {
    summary: 'Controlled disclosure',
    expanded: true,
    children: (
      <p>This banner is controlled externally via the expanded prop.</p>
    ),
    onExpandedChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('banner starts expanded', async () => {
      const button = canvas.getByRole('button', {
        name: /Controlled disclosure/,
      })
      await expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    await step('click calls onExpandedChange', async () => {
      const button = canvas.getByRole('button', {
        name: /Controlled disclosure/,
      })
      await userEvent.click(button)
      await expect(args.onExpandedChange).toHaveBeenCalledWith(false)
    })
  },
}
