import { List } from '../../../components/List/List'
import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from 'storybook/test'

const meta = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A semantic list component for ordered, unordered, and unstyled list content. Renders an \`<ul>\` or \`<ol>\` element with \`.pathable-list\` class.

**When to use**: For grouping related items in a list structure. Use \`unordered\` for bulleted lists, \`ordered\` for sequential steps or ranked content, and \`unstyled\` when list semantics are needed without visual markers.

**When not to use**: Do not use List for navigation menus (use \`<nav>\` with appropriate link structure). Do not use List for purely decorative visual arrangement — list elements carry semantic meaning.

**Underlying element**: \`<ul>\` for unordered/unstyled, \`<ol>\` for ordered.

**Known constraints**: Unsupported \`presentation\` values silently fall back to \`unordered\`. The \`items\` prop accepts both plain ReactNodes and \`ListItemObject\` shapes; plain ReactNodes are rendered directly as \`<li>\` content.`,
      },
    },
  },
  argTypes: {
    presentation: {
      options: ['unordered', 'ordered', 'unstyled'],
      control: { type: 'select' },
      description:
        'The list presentation. \`unordered\`: bulleted list. \`ordered\`: numbered list. \`unstyled\`: no visual markers, but retains list semantics.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble list classes.',
    },
  },
  args: {
    presentation: 'unordered',
    items: [
      'Unordered list item one',
      'Unordered list item two',
      'Unordered list item three',
    ],
  },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {}

// ---------------------------------------------------------------------------
// Fixed state stories
// ---------------------------------------------------------------------------

export const Unordered: Story = {
  args: {
    items: [
      'Unordered list item one',
      'Unordered list item two',
      'Unordered list item three',
    ],
  },
}

export const Ordered: Story = {
  args: {
    presentation: 'ordered',
    items: [
      'Complete intake notes',
      'Schedule follow-up session',
      'Send resource summary',
    ],
  },
}

export const Unstyled: Story = {
  args: {
    presentation: 'unstyled',
    items: [
      'Unstyled list item one',
      'Unstyled list item two',
      'Unstyled list item three',
    ],
  },
}

export const RichItems: Story = {
  render: () => (
    <List
      items={[
        {
          content: (
            <>
              Review the <a href="#participant-plan">participant plan</a>.
            </>
          ),
          key: 'review-plan',
        },
        {
          content: <strong>Confirm coaching session goals.</strong>,
          key: 'confirm-goals',
          attributes: { 'aria-label': 'Confirm coaching session goals' },
        },
        [
          <span key="array-prefix">Array node content </span>,
          <span key="array-suffix">renders as one item.</span>,
        ],
        'Share follow-up resources.',
      ]}
    />
  ),
}

export const Empty: Story = {
  render: () => <List aria-label="No current action items" items={[]} />,
}

export const CustomClassName: Story = {
  render: () => (
    <List
      className="demo-list-composition"
      items={[
        'Custom class list item one',
        'Custom class list item two',
        'Custom class list item three',
      ]}
    />
  ),
}

export const UnsupportedPresentationFallback: Story = {
  render: () => (
    <List
      presentation="timeline"
      items={[
        'Unsupported presentations fall back to unordered output.',
        'The wrapper does not create new list visual semantics.',
      ]}
    />
  ),
}

// ---------------------------------------------------------------------------
// Long content
// ---------------------------------------------------------------------------

export const LongItems: Story = {
  args: {
    items: [
      'Review the comprehensive employment coaching program enrollment requirements and submit your application documentation before the quarterly intake deadline',
      'Schedule an initial assessment with your assigned career coach to establish baseline goals and identify priority skill development areas',
      'Complete the workplace readiness self-assessment questionnaire and share results with your coaching team for review',
    ],
  },
}

// ---------------------------------------------------------------------------
// Narrow viewport
// ---------------------------------------------------------------------------

export const Narrow: Story = {
  args: {
    items: [
      'Review participant notes',
      'Schedule follow-up session',
      'Send resource summary',
    ],
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

/** Verifies the list renders with correct list semantics and each item is
 *  present in the accessible DOM. */
export const AccessibilityCheck: Story = {
  args: {
    items: [
      'Accessible item one',
      'Accessible item two',
      'Accessible item three',
    ],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('list renders with list role', async () => {
      const list = canvas.getByRole('list')
      await expect(list).toBeVisible()
    })

    await step('all list items are present', async () => {
      const items = canvas.getAllByRole('listitem')
      await expect(items).toHaveLength(3)
    })
  },
}
