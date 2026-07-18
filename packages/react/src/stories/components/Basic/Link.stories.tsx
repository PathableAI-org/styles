import { Link } from '../../../components/Link/Link'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
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
      options: ['default', 'external'],
      control: { type: 'select' },
      description: 'Selects an implemented Link treatment.',
    },
    children: {
      control: { type: 'text' },
      description: 'Consumer-supplied link content.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional root class names.',
    },
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: '#example-default',
    children: 'Default Link',
    presentation: 'default',
  },
}

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
