import { Link } from '../../../components/Link/Link'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A navigational link styled with PathAble design tokens. Renders a standard \`<a>\` element with \`.pathable-link\` class.

**When to use**: For navigating between pages, linking to external resources, or any standard hyperlink behavior. Prefer Link over raw \`<a>\` elements to ensure consistent PathAble styling.

**When not to use**: Do not use Link for actions that trigger application behavior (use \`<Button>\` instead). Do not use Link for in-page anchor navigation that doesn't need link styling.

**Underlying element**: \`<a>\` (HTMLAnchorElement).

**Navigation policy**: The \`external\` presentation adds only a visual indicator (\`.pathable-link--external\`). Consumers are responsible for \`href\`, \`target\`, \`rel\`, download behavior, and any routing logic. For external links, consumers should set \`target="_blank"\` and \`rel="noopener noreferrer"\` as needed.

**Known constraints**: The component does not validate href values. Unsupported \`presentation\` values silently fall back to \`default\` with no visual change.`,
      },
    },
  },
  argTypes: {
    presentation: {
      options: ['default', 'external'],
      control: { type: 'select' },
      description:
        'The link presentation variant. \`default\`: standard inline link. \`external\`: adds a visual indicator that the link leads to an external resource.',
    },
    children: {
      control: { type: 'text' },
      description:
        'Link content. Can be plain text or rich content (elements). Must be meaningful out of context — avoid "click here" or "read more" as the only content.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble link classes.',
    },
  },
  args: {
    href: '#example',
    children: 'Example Link',
    presentation: 'default',
  },
} satisfies Meta<typeof Link>

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
    href: '#example-default',
    children: 'Default Link',
    presentation: 'default',
  },
}

/** External links receive the \`.pathable-link--external\` modifier class
 *  for a visual external-link indicator. */
export const External: Story = {
  args: {
    href: '#example-external',
    children: 'External Link',
    presentation: 'external',
  },
}

export const RichContent: Story = {
  render: () => (
    <Link href="#rich-content">
      Review the <strong>participant plan</strong> and{' '}
      <em>confirm next steps</em>
    </Link>
  ),
}

export const CustomAttributes: Story = {
  render: () => (
    <Link
      href="#custom-attrs"
      aria-label="Navigate to participant dashboard"
      data-testid="dashboard-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      Open Dashboard
    </Link>
  ),
}

export const EmptyContent: Story = {
  render: () => <Link href="#empty" aria-label="Empty link example" />,
}

export const UnsupportedPresentationFallback: Story = {
  name: 'Unsupported Presentation (fallback)',
  render: () => (
    <Link href="#fallback" presentation="nav">
      Unsupported presentation falls back to default
    </Link>
  ),
}

// ---------------------------------------------------------------------------
// Long content
// ---------------------------------------------------------------------------

export const LongLabel: Story = {
  args: {
    href: '#long',
    children:
      'Review the comprehensive employment coaching program enrollment requirements and submit your application for the next available cohort',
  },
}

// ---------------------------------------------------------------------------
// Narrow viewport
// ---------------------------------------------------------------------------

export const Narrow: Story = {
  args: {
    href: '#narrow',
    children: 'Mobile Link',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// ---------------------------------------------------------------------------
// Interaction tests
// ---------------------------------------------------------------------------

/** Verifies that a link renders with the correct role and accessible name. */
export const AccessibilityCheck: Story = {
  args: {
    href: '#a11y-test',
    children: 'Accessible Link',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('link has correct role and accessible name', async () => {
      const link = canvas.getByRole('link', { name: 'Accessible Link' })
      await expect(link).toBeVisible()
    })

    await step('link has valid href attribute', async () => {
      const link = canvas.getByRole('link', { name: 'Accessible Link' })
      await expect(link).toHaveAttribute('href', '#a11y-test')
    })
  },
}

/** Verifies keyboard focus behavior on the link element. */
export const KeyboardFocus: Story = {
  args: {
    href: '#focus-test',
    children: 'Focusable Link',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('link receives keyboard focus', async () => {
      const link = canvas.getByRole('link', { name: 'Focusable Link' })
      await userEvent.tab()
      await expect(link).toHaveFocus()
    })
  },
}

// ---------------------------------------------------------------------------
// Composition — link in a realistic content context
// ---------------------------------------------------------------------------

/** A link used inline within a paragraph of body text, demonstrating the
 *  expected content pattern for navigation links. */
export const InlineInParagraph: Story = {
  render: () => (
    <p>
      Before your next session, please{' '}
      <Link href="#review-notes">review the participant notes</Link> and update
      any action items that have changed since the last meeting.
    </p>
  ),
}
