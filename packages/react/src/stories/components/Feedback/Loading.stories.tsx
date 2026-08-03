import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'

import { Loading } from '../../../components/Loading/Loading'

const meta = {
  title: 'Components/Feedback/Loading',
  component: Loading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `An inline loading indicator that renders the existing PathAble spinner and optional status text without owning application loading state.

**When to use**: Use Loading while a page, region, or operation is waiting for asynchronous work. Provide concise text that identifies what is loading, and use the large size for page-level or prominent loading states.

**When not to use**: Do not use Loading for skeleton content placeholders, completed or error states, a progress percentage, or a generic animated decoration. Use Skeleton for content-shaped placeholders and let the consuming application replace Loading when work finishes.

**Underlying element**: A native \`<div>\` containing a decorative spinner \`<span>\` and optional status-text \`<span>\`.

**Accessibility**: The root defaults to \`aria-live="polite"\`. Spinner-only usage requires a consumer-provided accessible name such as \`role="status" aria-label="Loading"\`. The spinner is always hidden from assistive technology, and consumers remain responsible for status timing and announcements outside the component's rendered content.`,
      },
    },
  },
  argTypes: {
    size: {
      options: ['default', 'large'],
      control: { type: 'select' },
      description:
        'Selects the default 24px indicator or the large 40px page-level treatment.',
    },
    text: {
      control: { type: 'text' },
      description:
        'Optional visible status text. Omit it only when the root receives an accessible status name for spinner-only usage.',
    },
    role: {
      control: { type: 'text' },
      description:
        'Optional consumer-selected semantic role, such as status for spinner-only loading.',
    },
    'aria-live': {
      options: ['off', 'polite', 'assertive'],
      control: { type: 'select' },
      description:
        'Live-region politeness. The wrapper defaults this to polite and allows the consumer to override it.',
    },
    'aria-label': {
      control: { type: 'text' },
      description:
        'Accessible name for spinner-only usage or a more specific loading region.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional class names appended after the PathAble loading classes.',
    },
  },
  args: {
    size: 'default',
    text: 'Loading participant records...',
  },
} satisfies Meta<typeof Loading>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    text: 'Loading participant records...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const text = canvas.getByText('Loading participant records...')
    const root = text.parentElement

    await expect(root).toHaveClass('pathable-loading')
    await expect(root).not.toHaveClass('pathable-loading--large')
    await expect(root).toHaveAttribute('aria-live', 'polite')
    await expect(
      root?.querySelector('.pathable-loading__spinner'),
    ).toHaveAttribute('aria-hidden', 'true')
  },
}

export const SpinnerOnly: Story = {
  args: {
    text: undefined,
    role: 'status',
    'aria-label': 'Loading participant records',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const root = canvas.getByRole('status', {
      name: 'Loading participant records',
    })

    await expect(root).toHaveClass('pathable-loading')
    await expect(root).toHaveAttribute('aria-live', 'polite')
    await expect(root.querySelector('.pathable-loading__text')).toBeNull()
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    text: 'Loading the participant dashboard...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const text = canvas.getByText('Loading the participant dashboard...')

    await expect(text.parentElement).toHaveClass(
      'pathable-loading',
      'pathable-loading--large',
    )
  },
}

export const LongContent: Story = {
  args: {
    text: 'Loading employment coaching records, action plans, and upcoming participant sessions',
  },
}

export const Narrow: Story = {
  args: {
    text: 'Loading participant resources and recommended coaching materials...',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const CustomAttributes: Story = {
  args: {
    text: 'Loading saved session notes...',
    id: 'saved-session-notes-loading',
    'aria-label': 'Saved session notes loading region',
    'data-state': 'loading',
    className: 'custom-loading',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const text = canvas.getByText('Loading saved session notes...')
    const root = text.parentElement

    await expect(root).toHaveClass('pathable-loading', 'custom-loading')
    await expect(root).toHaveAttribute('id', 'saved-session-notes-loading')
    await expect(root).toHaveAttribute(
      'aria-label',
      'Saved session notes loading region',
    )
    await expect(root).toHaveAttribute('data-state', 'loading')
  },
}

export const DashboardComposition: Story = {
  render: () => (
    <main aria-labelledby="dashboard-heading">
      <h1 id="dashboard-heading">Participant dashboard</h1>
      <Loading size="large" text="Loading dashboard data..." />
      <p>Dashboard content will appear when the request completes.</p>
    </main>
  ),
}
