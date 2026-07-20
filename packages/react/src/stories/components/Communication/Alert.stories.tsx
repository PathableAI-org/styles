import { Alert } from '../../../components/Alert/Alert'
import type { Meta, StoryObj } from '@storybook/react'
import { LONG_CONTENT } from './fixtures'

const meta = {
  title: 'Components/Communication/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `An alert that communicates status information. Supports info, success, warning, error, and emergency severity levels with an optional slim variant.

**When to use**: To convey important status information to the user — success confirmations, warnings, errors, or emergency notices.

**When not to use**: Do not use Alert for persistent site-wide notifications (use SiteAlert instead). Do not use Alert for non-critical, dismissible messages.

**Underlying element**: \`<div role="alert">\`

**Known constraints**: Status is visual only — the component does not derive urgency from context. The default role is \`alert\` but can be overridden.`,
      },
    },
  },
  argTypes: {
    status: {
      options: ['info', 'success', 'warning', 'error', 'emergency'],
      control: { type: 'select' },
      description: 'The severity level of the alert.',
    },
    slim: {
      control: { type: 'boolean' },
      description: 'When true, renders a compact variant with reduced padding.',
    },
    heading: {
      control: { type: 'text' },
      description: 'Optional alert heading rendered before body content.',
    },
    children: {
      control: { type: 'text' },
      description: 'Alert body content.',
    },
    role: {
      control: { type: 'text' },
      description: 'ARIA role override. Defaults to "alert".',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after PathAble classes.',
    },
  },
  args: {
    status: 'info',
    slim: false,
    heading: 'Notice',
    children: 'This is an informational alert.',
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Info: Story = {
  args: {
    status: 'info',
    heading: 'Informational Notice',
    children: (
      <p>
        This is an informational alert providing helpful context or guidance.
      </p>
    ),
  },
}

export const Success: Story = {
  args: {
    status: 'success',
    heading: 'Success',
    children: <p>Changes have been saved successfully.</p>,
  },
}

export const Warning: Story = {
  args: {
    status: 'warning',
    heading: 'Warning',
    children: <p>Please review the missing items before proceeding.</p>,
  },
}

export const Error: Story = {
  args: {
    status: 'error',
    heading: 'Error',
    children: <p>An unexpected error occurred. Please try again.</p>,
  },
}

export const Emergency: Story = {
  args: {
    status: 'emergency',
    heading: 'Emergency Alert',
    children: (
      <p>
        This is an emergency alert for urgent situations requiring immediate
        attention.
      </p>
    ),
  },
}

export const Slim: Story = {
  args: {
    status: 'info',
    slim: true,
    children: (
      <p>A slim alert variant with reduced padding for compact layouts.</p>
    ),
  },
}

export const LongContent: Story = {
  args: {
    status: 'warning',
    heading: 'Multiple Issues Detected',
    children: <p>{LONG_CONTENT}</p>,
  },
}

export const Narrow: Story = {
  args: {
    status: 'info',
    heading: 'Mobile Notice',
    children: <p>This alert displayed in a narrow viewport.</p>,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
