import { Card } from '../../../components/Card/Card'
import { Button } from '../../../components/Button/Button'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: React component\n\n**Consumers must**: Import from `@pathable/react`. No additional CSS import required.',
      },
    },
  },
  argTypes: {
    presentation: {
      options: ['base', 'media', 'flag', 'header-first', 'workflow'],
      control: { type: 'select' },
      description: 'Existing Pathable card presentation.',
    },
    title: {
      control: { type: 'text' },
      description: 'Card heading content.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS class names.',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
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
      footer={<a href="#card-footer">Learn more</a>}
    >
      <p>This card has body content and footer content after the body.</p>
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

export const Media: Story = {
  render: () => (
    <Card
      presentation="media"
      title="Media Card Title"
      media={<img src="https://placehold.co/600x400" alt="Media placeholder" />}
      footer={<span>Updated today</span>}
    >
      <p>This card includes a media element alongside the body content.</p>
    </Card>
  ),
}

export const Flag: Story = {
  render: () => (
    <Card
      presentation="flag"
      title="Flag card"
      media={<img src="https://placehold.co/240x160" alt="Flag placeholder" />}
      footer={<a href="#flag-card">Review details</a>}
    >
      <p>This card uses the existing flag modifier from the styles contract.</p>
    </Card>
  ),
}

export const HeaderFirst: Story = {
  render: () => (
    <Card
      presentation="header-first"
      title="Header-first card"
      media={
        <img src="https://placehold.co/600x320" alt="Header placeholder" />
      }
    >
      <p>
        The header-first modifier maps directly to the Pathable styles class.
      </p>
    </Card>
  ),
}

export const Workflow: Story = {
  render: () => (
    <Card
      presentation="workflow"
      title="Today's Coaching Session: J. Doe"
      metadata="Last updated: Today, 2:30 PM | Duration: 45 min"
      actions={<a href="#workflow-card">View session notes</a>}
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
