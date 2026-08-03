import type { MouseEvent } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Toast, ToastRegion } from '../../../components/Toast/Toast'

const dismissSpy = fn()
const actionSpy = fn()

const INFO_ICON = (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M12 10v6M12 7h.01" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const PROGRESS_ICON = (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path
      d="M12 3a9 9 0 1 0 9 9"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
)

const SUCCESS_ICON = (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="m8 12 3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const WARNING_ICON = (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path
      d="m12 3 10 18H2L12 3Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M12 9v5M12 17h.01" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const ERROR_ICON = (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="m9 9 6 6m0-6-6 6" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const STORY_REGION_STYLE = {
  position: 'relative' as const,
  inset: 'auto',
  maxWidth: '28rem',
}

const STATIC_TOAST_STYLE = { animation: 'none' }

function handleAction(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
  actionSpy(event)
}

const meta = {
  title: 'Components/Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A transient notification that applies the existing PathAble toast contract without owning visibility, queuing, or auto-dismiss state.

**When to use**: Use Toast for brief operation feedback such as saved, synced, uploading, warning, or failure messages. Place individual toasts inside ToastRegion when multiple notifications should stack in the standard overlay position.

**When not to use**: Do not use Toast for persistent page instructions, inline validation, blocking errors, loading placeholders, or a dialog. Use Alert for persistent status content, Loading for an active wait state, and Modal when the user must address content before continuing.

**Underlying elements**: Toast renders a native \`<div>\` with an optional decorative icon, message span, native action element, and native dismiss button. ToastRegion renders the stacking \`<div>\` container.

**Variants**: \`info\`, \`progress\`, and \`success\` default to \`role="status"\`; \`warning\` and \`error\` default to \`role="alert"\`. Consumers can override the role when the notification context requires different urgency.

**Behavior**: The wrapper invokes consumer callbacks but does not remove the toast, start a timer, queue notifications, or manage application state. Consumers own those lifecycle decisions.`,
      },
    },
  },
  argTypes: {
    variant: {
      options: ['info', 'progress', 'success', 'warning', 'error'],
      control: { type: 'select' },
      description: 'Notification context and matching PathAble modifier class.',
    },
    message: {
      control: { type: 'text' },
      description:
        'Concise notification content rendered in the message region.',
    },
    icon: {
      control: false,
      description:
        'Optional decorative React element. The wrapper adds the icon class and forces aria-hidden="true".',
    },
    action: {
      control: false,
      description:
        'Optional native link or button element. It must accept className so the action class can be merged.',
    },
    dismissible: {
      control: { type: 'boolean' },
      description:
        'Adds the native dismiss button and dismissible modifier class.',
    },
    dismissLabel: {
      control: { type: 'text' },
      description: 'Accessible label for the dismiss button.',
    },
    role: {
      options: ['status', 'alert'],
      control: { type: 'select' },
      description:
        'Optional live-region role. The default is derived from the variant urgency convention.',
    },
    onDismiss: {
      control: false,
      description:
        "Native dismiss callback. Removing the toast remains the consumer's responsibility.",
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional class names appended after the PathAble toast classes.',
    },
  },
  args: {
    variant: 'info',
    message: 'Your participant records have been synced.',
    icon: INFO_ICON,
    dismissible: true,
    dismissLabel: 'Dismiss notification',
    onDismiss: dismissSpy,
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Info: Story = {
  args: {
    variant: 'info',
    message: 'Your participant records have been synced.',
    icon: INFO_ICON,
    dismissible: true,
  },
  play: async ({ canvasElement }) => {
    dismissSpy.mockClear()
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Dismiss notification' })
    const message = canvas.getByText(
      'Your participant records have been synced.',
    )

    await expect(message.parentElement).toHaveClass(
      'pathable-toast',
      'pathable-toast--info',
      'pathable-toast--dismissible',
    )
    await expect(message.parentElement).toHaveAttribute('role', 'status')
    await userEvent.click(button)
    await expect(dismissSpy).toHaveBeenCalledTimes(1)
  },
}

export const Progress: Story = {
  args: {
    variant: 'progress',
    message: 'Uploading the participant action plan...',
    icon: PROGRESS_ICON,
    dismissible: false,
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    message: 'Action plan saved successfully.',
    icon: SUCCESS_ICON,
    dismissible: true,
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    message: 'Connection lost. Your changes are saved locally.',
    icon: WARNING_ICON,
    action: (
      <a href="#retry" onClick={handleAction}>
        Retry
      </a>
    ),
    dismissible: true,
    style: STATIC_TOAST_STYLE,
  },
  play: async ({ canvasElement }) => {
    actionSpy.mockClear()
    const canvas = within(canvasElement)
    const message = canvas.getByText(
      'Connection lost. Your changes are saved locally.',
    )
    const action = canvas.getByRole('link', { name: 'Retry' })

    await expect(message.parentElement).toHaveClass(
      'pathable-toast--warning',
      'pathable-toast--has-action',
    )
    await expect(message.parentElement).toHaveAttribute('role', 'alert')
    await expect(action).toHaveClass('pathable-toast__action')
    await userEvent.click(action)
    await expect(actionSpy).toHaveBeenCalledTimes(1)
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    message: 'Failed to save the participant action plan. Please try again.',
    icon: ERROR_ICON,
    dismissible: true,
  },
}

export const Stacked: Story = {
  render: () => (
    <ToastRegion style={STORY_REGION_STYLE} aria-label="Notifications">
      <Toast
        variant="info"
        message="Background sync complete."
        icon={INFO_ICON}
        dismissible
        onDismiss={dismissSpy}
        style={STATIC_TOAST_STYLE}
      />
      <Toast
        variant="success"
        message="Document saved."
        icon={SUCCESS_ICON}
        dismissible
        onDismiss={dismissSpy}
        style={STATIC_TOAST_STYLE}
      />
      <Toast
        variant="warning"
        message="Low disk space on the server."
        icon={WARNING_ICON}
        style={STATIC_TOAST_STYLE}
      />
    </ToastRegion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByText('Background sync complete.'),
    ).toBeInTheDocument()
    await expect(canvas.getByText('Document saved.')).toBeInTheDocument()
    await expect(
      canvas.getByText('Low disk space on the server.'),
    ).toBeInTheDocument()
  },
}

export const LongContent: Story = {
  args: {
    variant: 'info',
    message:
      'The scheduled maintenance window has been extended by approximately two hours. Please save your work and log out if you plan to leave before the window closes.',
    icon: INFO_ICON,
    dismissible: true,
  },
}

export const Narrow: Story = {
  render: () => (
    <ToastRegion style={STORY_REGION_STYLE} aria-label="Notifications">
      <Toast
        variant="info"
        message="Data synced successfully."
        icon={INFO_ICON}
        dismissible
        onDismiss={dismissSpy}
      />
    </ToastRegion>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const CustomAttributes: Story = {
  args: {
    variant: 'success',
    message: 'Session notes saved.',
    icon: SUCCESS_ICON,
    id: 'session-notes-toast',
    'aria-label': 'Session notes notification',
    'data-state': 'success',
    className: 'custom-toast',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const message = canvas.getByText('Session notes saved.')
    const root = message.parentElement

    await expect(root).toHaveClass(
      'pathable-toast',
      'pathable-toast--success',
      'custom-toast',
    )
    await expect(root).toHaveAttribute('id', 'session-notes-toast')
    await expect(root).toHaveAttribute(
      'aria-label',
      'Session notes notification',
    )
    await expect(root).toHaveAttribute('data-state', 'success')
  },
}

export const DismissKeyboard: Story = {
  args: {
    variant: 'info',
    message: 'Keyboard dismissal is supported.',
    icon: INFO_ICON,
    dismissible: true,
  },
  play: async ({ canvasElement }) => {
    dismissSpy.mockClear()
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Dismiss notification' })

    await userEvent.tab()
    await expect(button).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(dismissSpy).toHaveBeenCalledTimes(1)
  },
}

export const DashboardComposition: Story = {
  render: () => (
    <main aria-labelledby="dashboard-heading">
      <h1 id="dashboard-heading">Participant dashboard</h1>
      <p>Recent activity and upcoming sessions.</p>
      <ToastRegion
        style={STORY_REGION_STYLE}
        aria-label="Dashboard notifications"
      >
        <Toast
          variant="success"
          message="Dashboard data refreshed."
          icon={SUCCESS_ICON}
        />
      </ToastRegion>
    </main>
  ),
}
