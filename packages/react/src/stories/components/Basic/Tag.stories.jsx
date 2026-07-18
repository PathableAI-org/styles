import React from 'react'
import { Tag } from '../../../components/Tag/Tag'

export default {
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
      defaultValue: 'default',
    },
    children: {
      control: { type: 'text' },
      description: 'Consumer-supplied inline content.',
      defaultValue: 'Tag Text',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional root class names.',
      defaultValue: '',
    },
  },
}

const Template = (args) => <Tag {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'Default Tag',
  size: 'default',
}

export const Big = Template.bind({})
Big.args = {
  children: 'Big Tag',
  size: 'big',
}

export const RichContent = {
  render: () => (
    <Tag>
      <strong>Due:</strong> <time dateTime="2026-07-25">July 25, 2026</time>
    </Tag>
  ),
}

export const CustomAttributes = {
  render: () => (
    <Tag aria-label="Status indicator" data-testid="status-tag">
      Active
    </Tag>
  ),
}

export const EmptyContent = {
  render: () => <Tag />,
}

export const UnsupportedSizeFallback = {
  name: 'Unsupported Size (fallback)',
  render: () => (
    <Tag size="extra-large">Unsupported size falls back to default</Tag>
  ),
}
