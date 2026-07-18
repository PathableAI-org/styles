import { List } from '../../../components/List/List'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/List',
  component: List,
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
      options: ['unordered', 'ordered', 'unstyled'],
      control: { type: 'select' },
      description: 'Existing Pathable list presentation.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS class names.',
    },
  },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      'Unordered list item one',
      'Unordered list item two',
      'Unordered list item three',
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

export const Ordered: Story = {
  render: () => (
    <List
      presentation="ordered"
      items={[
        'Complete intake notes',
        'Schedule follow-up session',
        'Send resource summary',
      ]}
    />
  ),
}

export const Unstyled: Story = {
  render: () => (
    <List
      presentation="unstyled"
      items={[
        'Unstyled list item one',
        'Unstyled list item two',
        'Unstyled list item three',
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
