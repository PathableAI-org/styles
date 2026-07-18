import React from 'react'
import { Link } from '../../../components/Link/Link'

export default {
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
      defaultValue: 'default',
    },
    children: {
      control: { type: 'text' },
      description: 'Consumer-supplied link content.',
      defaultValue: 'Link Text',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional root class names.',
      defaultValue: '',
    },
  },
}

const Template = (args) => <Link {...args} />

export const Default = Template.bind({})
Default.args = {
  href: '#example-default',
  children: 'Default Link',
  presentation: 'default',
}

export const External = Template.bind({})
External.args = {
  href: '#example-external',
  children: 'External Link',
  presentation: 'external',
}

export const RichContent = {
  render: () => (
    <Link href="#rich-content">
      Review the <strong>participant plan</strong> and{' '}
      <em>confirm next steps</em>
    </Link>
  ),
}

export const CustomAttributes = {
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

export const EmptyContent = {
  render: () => <Link href="#empty" aria-label="Empty link example" />,
}

export const UnsupportedPresentationFallback = {
  name: 'Unsupported Presentation (fallback)',
  render: () => (
    <Link href="#fallback" presentation="nav">
      Unsupported presentation falls back to default
    </Link>
  ),
}
