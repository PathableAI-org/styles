import { Card } from '../../../components/Card/Card'
import { Button } from '../../../components/Button/Button'
import { Link } from '../../../components/Link/Link'
import type { Meta, StoryObj } from '@storybook/react'

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3Crect width='4' height='3' fill='%23c8c8c8'/%3E%3C/svg%3E"

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A container that groups related content and actions. The Card component supports multiple presentations for different content patterns.

**When to use**: For grouping related content in a visually distinct container. Use the \`base\` presentation for simple content groups, \`media\` for cards with images, \`flag\` for media beside text, \`header-first\` for hero layouts, and \`workflow\` for task or status cards.

**When not to use**: Do not use Card purely for visual decoration. For simple bordered content groups without semantic grouping requirements, consider a \`<section>\` or a container div with the appropriate spacing utility classes.

**Underlying element**: \`<div>\` with \`.pathable-card\` class.

**Accessible naming**: Cards do not have an implicit heading level. Consumers should provide a heading element (via the \`title\` prop or children) at the appropriate heading level for their document outline.

**Known constraints**: The \`workflow\` presentation auto-applies when \`metadata\`, \`status\`, or \`actions\` props are provided, regardless of the explicit \`presentation\` value. The \`media\` and \`flag\` presentations require a \`media\` prop with image content.`,
      },
    },
  },
  argTypes: {
    presentation: {
      options: ['base', 'media', 'flag', 'header-first', 'workflow'],
      control: { type: 'select' },
      description:
        'The card presentation pattern. \`base\`: simple content container with optional title. \`media\`: card with a media/image element. \`flag\`: media beside text in a horizontal layout. \`header-first\`: hero-style card with media above content. \`workflow\`: task or status card with metadata and actions. When \`metadata\`, \`status\`, or \`actions\` are provided, the presentation auto-resolves to \`workflow\`.',
    },
    title: {
      control: { type: 'text' },
      description:
        'Card heading content. Rendered as an \`<h3>\` inside the card header region. Consumers must ensure heading levels fit their document outline.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble card classes.',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    title: 'Card Title',
    presentation: 'base',
    children: (
      <p>
        This is the default card body content. Cards can contain text, links,
        and other elements.
      </p>
    ),
  },
}

// ---------------------------------------------------------------------------
// Fixed state stories
// ---------------------------------------------------------------------------

export const Base: Story = {
  args: {
    title: 'Card Title',
    children: (
      <p>
        This is the default card body content. Cards can contain text, links,
        and other elements.
      </p>
    ),
  },
}

export const WithFooter: Story = {
  render: () => (
    <Card
      title="Card with footer"
      footer={<Link href="#card-footer">Learn more</Link>}
    >
      <p>This card has body content and a footer link following the body.</p>
    </Card>
  ),
}

export const WithoutTitle: Story = {
  render: () => (
    <Card>
      <p>
        This card renders body content without creating an empty title region.
      </p>
    </Card>
  ),
}

export const CustomClassName: Story = {
  render: () => (
    <Card title="Custom class" className="demo-card-composition">
      <p>The custom class is preserved next to the Pathable card class.</p>
    </Card>
  ),
}

export const MediaPresentation: Story = {
  render: () => (
    <Card
      presentation="media"
      title="Media Card"
      media={<img src={PLACEHOLDER_IMAGE} alt="Media placeholder" />}
      footer={<span>Updated today</span>}
    >
      <p>This card includes a media element alongside the body content.</p>
    </Card>
  ),
}

export const FlagPresentation: Story = {
  render: () => (
    <Card
      presentation="flag"
      title="Flag card"
      media={<img src={PLACEHOLDER_IMAGE} alt="Flag placeholder" />}
      footer={<Link href="#flag-card">Review details</Link>}
    >
      <p>This card uses the flag layout with media beside the text.</p>
    </Card>
  ),
}

export const HeaderFirstPresentation: Story = {
  render: () => (
    <Card
      presentation="header-first"
      title="Header-first card"
      media={<img src={PLACEHOLDER_IMAGE} alt="Header placeholder" />}
    >
      <p>
        The header-first presentation places media above the content region.
      </p>
    </Card>
  ),
}

export const WorkflowPresentation: Story = {
  render: () => (
    <Card
      presentation="workflow"
      title="Today's Coaching Session: J. Doe"
      metadata="Last updated: Today, 2:30 PM | Duration: 45 min"
      actions={<Link href="#workflow-card">View session notes</Link>}
      tabIndex={0}
    >
      <p>
        Session 12 of 24 - Focus: Workplace communication skills and job
        readiness practice.
      </p>
    </Card>
  ),
}

export const WorkflowWithStatus: Story = {
  render: () => (
    <Card
      presentation="workflow"
      title="Employment Progress Report: K. Smith"
      metadata="Generated: Jul 8, 2026 | Period: Q2 2026"
      status="Completed"
      actions={<Button variant="secondary">Download report</Button>}
      tabIndex={0}
    >
      <p>
        All 6 employment goal milestones have been met this period. Next review
        scheduled for next month.
      </p>
    </Card>
  ),
}

// ---------------------------------------------------------------------------
// Long content
// ---------------------------------------------------------------------------

export const LongContent: Story = {
  render: () => (
    <Card
      presentation="workflow"
      title="Comprehensive Employment Assessment and Progress Tracking for Participant K. Smith — Q2 2026 Review Period"
      metadata="Generated: Jul 8, 2026 | Period: Q2 2026 | Status: Under Review by Regional Coordinator"
      status="In Progress"
      actions={
        <div className="pathable-button-group">
          <Button variant="secondary">Download Report</Button>
          <Button variant="primary">Schedule Review</Button>
        </div>
      }
    >
      <p>
        This is a deliberately long card description that demonstrates how the
        workflow card handles extended body content. It includes multiple
        sentences and demonstrates text wrapping behavior. The card should
        accommodate variable-length content without breaking the layout or
        causing overflow issues.
      </p>
      <p>
        Additional paragraph content to verify multi-paragraph body rendering
        and spacing between paragraphs inside the card body region.
      </p>
    </Card>
  ),
}

// ---------------------------------------------------------------------------
// Narrow (mobile) viewport
// ---------------------------------------------------------------------------

export const Narrow: Story = {
  args: {
    title: 'Mobile Card',
    children: <p>This card renders at a narrow mobile viewport width.</p>,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const NarrowWorkflow: Story = {
  render: () => (
    <Card
      presentation="workflow"
      title="Coaching Session"
      metadata="Today, 2:30 PM"
      status="Scheduled"
      actions={<Button variant="primary">Join Session</Button>}
    >
      <p>Upcoming session with J. Doe. Focus: workplace communication.</p>
    </Card>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
