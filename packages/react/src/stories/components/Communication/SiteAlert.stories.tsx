import { SiteAlert } from '../../../components/SiteAlert/SiteAlert'
import type { Meta, StoryObj } from '@storybook/react'
import { LONG_CONTENT } from './fixtures'

const meta = {
  title: 'Components/Communication/SiteAlert',
  component: SiteAlert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A persistent site-wide notification banner. Supports info and emergency severity levels with an optional slim variant. Unlike Alert, SiteAlert is intended for persistent, site-level messages rather than transient status updates.

**When to use**: For persistent site-wide notifications such as emergency closures, system maintenance, or general announcements that apply to the entire site.

**When not to use**: Do not use SiteAlert for transient status messages (use Alert instead). Do not use SiteAlert for dismissible notifications.

**Underlying element**: \`<div role="alert">\`

**Known constraints**: Status is visual only — the component does not derive urgency from context. The default role is \`alert\` but can be overridden. The warning and error statuses available in Alert are not available for SiteAlert.`,
      },
    },
  },
  argTypes: {
    status: {
      options: ['default', 'info', 'emergency'],
      control: { type: 'select' },
      description:
        'The severity level of the site alert. "default" renders with no status modifier.',
    },
    slim: {
      control: { type: 'boolean' },
      description: 'When true, renders a compact variant with reduced padding.',
    },
    heading: {
      control: { type: 'text' },
      description: 'Optional site alert heading rendered before body content.',
    },
    children: {
      control: { type: 'text' },
      description: 'Site alert body content.',
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
    heading: 'Site Notice',
    children: 'This is a site-wide notification.',
  },
} satisfies Meta<typeof SiteAlert>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    status: 'default',
    children: <p>This is a default site alert with no status modifier.</p>,
  },
}

export const Info: Story = {
  args: {
    status: 'info',
    heading: 'Site Announcement',
    children: <p>This is an informational site-wide announcement.</p>,
  },
}

export const Emergency: Story = {
  args: {
    status: 'emergency',
    heading: 'Emergency Closure',
    children: (
      <p>
        The building is closed due to inclement weather. Please check back for
        updates.
      </p>
    ),
  },
}

export const Slim: Story = {
  args: {
    status: 'info',
    slim: true,
    children: (
      <p>A slim site alert variant with reduced padding for compact layouts.</p>
    ),
  },
}

export const LongContent: Story = {
  args: {
    status: 'info',
    heading: 'Important System Update',
    children: <p>{LONG_CONTENT}</p>,
  },
}

export const Narrow: Story = {
  args: {
    status: 'info',
    heading: 'Mobile Notice',
    children: <p>This site alert displayed in a narrow viewport.</p>,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
