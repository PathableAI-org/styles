import { Tag } from '../../../components/Tag/Tag'
import { Card } from '../../../components/Card/Card'
import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from 'storybook/test'

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A non-interactive presentational label used to categorize, highlight, or provide metadata about content.

**When to use**: For status indicators, category labels, metadata chips, or any inline label that communicates a property of associated content. Use \`"default"\` size for most inline usage and \`"big"\` for standalone status badges.

**When not to use**: Do not use Tag as an interactive element. If the label needs to be clickable (e.g., filter chips), use a \`<button>\` styled appropriately. Do not use Tag to replace semantic heading elements.

**Underlying element**: \`<span>\` with \`.pathable-tag\` class.

**Known constraints**: Tag is purely presentational. It does not receive keyboard focus, does not participate in the tab order, and does not have an implicit ARIA role beyond the generic \`<span>\` semantics. If a tag needs to convey semantic state to assistive technology, consumers must add appropriate \`aria-\` attributes.`,
      },
    },
  },
  argTypes: {
    size: {
      options: ['default', 'big'],
      control: { type: 'select' },
      description:
        'The tag size variant. \`default\` is for inline usage alongside text. \`big\` is for standalone badge or label usage.',
    },
    children: {
      control: { type: 'text' },
      description:
        'Tag label content. Keep labels short (1-3 words). Can include rich content like dates or status indicators.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble tag classes.',
    },
  },
  args: {
    size: 'default',
    children: 'Tag',
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {}

// ---------------------------------------------------------------------------
// Fixed state stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    children: 'Default Tag',
    size: 'default',
  },
}

export const Big: Story = {
  args: {
    children: 'Big Tag',
    size: 'big',
  },
}

export const RichContent: Story = {
  render: () => (
    <Tag>
      <strong>Due:</strong> <time dateTime="2026-07-25">July 25, 2026</time>
    </Tag>
  ),
}

export const CustomAttributes: Story = {
  render: () => (
    <Tag aria-label="Status indicator" data-testid="status-tag">
      Active
    </Tag>
  ),
}

export const EmptyContent: Story = {
  render: () => <Tag />,
}

export const UnsupportedSizeFallback: Story = {
  name: 'Unsupported Size (fallback)',
  render: () => (
    <Tag size="extra-large">Unsupported size falls back to default</Tag>
  ),
}

// ---------------------------------------------------------------------------
// Long content
// ---------------------------------------------------------------------------

export const LongLabel: Story = {
  args: {
    children: 'Awaiting Regional Coordinator Approval — Escalated',
  },
}

// ---------------------------------------------------------------------------
// Narrow viewport
// ---------------------------------------------------------------------------

export const Narrow: Story = {
  args: {
    children: 'Active',
    size: 'default',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// ---------------------------------------------------------------------------
// Accessibility check
// ---------------------------------------------------------------------------

/** Verifies the tag renders and can be queried by its visible text content. */
export const AccessibilityCheck: Story = {
  args: {
    children: 'Completed',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('tag is visible with correct text', async () => {
      const tag = canvas.getByText('Completed')
      await expect(tag).toBeVisible()
    })
  },
}

// ---------------------------------------------------------------------------
// Composition — tags used to annotate a card
// ---------------------------------------------------------------------------

/** Tags used as status indicators within a workflow card, demonstrating
 *  the typical pattern of using tags for metadata alongside content.
 *
 *  The status badge (.pathable-card__status) has insufficient color contrast
 *  against the card background — a pre-existing design token issue in
 *  @pathable/styles. Tracked for future fix. */
export const AsStatusIndicators: Story = {
  tags: ['skip-a11y'],
  render: () => {
    return (
      <Card
        presentation="workflow"
        title="Participant Onboarding"
        metadata="Started: Jul 1, 2026"
        status={<Tag>In Progress</Tag>}
      >
        <p>Complete the initial assessment and assign a coaching pathway.</p>
      </Card>
    )
  },
}
