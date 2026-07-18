import { Tag } from '../../../components/Tag/Tag'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Tag',
  component: Tag,
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
    size: {
      options: ['default', 'big'],
      control: { type: 'select' },
      description: 'Selects an implemented Tag size.',
    },
    children: {
      control: { type: 'text' },
      description: 'Consumer-supplied inline content.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional root class names.',
    },
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

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
