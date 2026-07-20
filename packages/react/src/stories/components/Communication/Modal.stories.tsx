import { Modal } from '../../../components/Modal/Modal'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect, fn } from 'storybook/test'
import { LONG_CONTENT } from './fixtures'

const meta = {
  title: 'Components/Communication/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A dialog that displays content in an overlay layer, focusing user attention on a specific task or message.

**When to use**: For confirmations, forms, alerts that require immediate user attention, or content that benefits from focused interaction without leaving the current page.

**When not to use**: Do not use for non-essential information (use a Banner or Alert instead). Do not use for long or complex workflows. Do not use when the user needs to reference the underlying page content.

**Keyboard behavior**: Tab cycles through focusable elements within the modal. Escape closes the modal. Focus is trapped inside the modal while open.

**Underlying element**: Portaled \`<div>\` with role="dialog" and aria-modal="true".`,
      },
    },
  },
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Controlled modal open state.',
    },
    onClose: {
      action: 'close',
      description: 'Called when the modal requests to close.',
    },
    title: { description: 'Modal heading text.' },
    description: {
      description: 'Optional description paragraph below the heading.',
    },
    children: { description: 'Content rendered inside the modal body.' },
    footer: { description: 'Content rendered in the modal footer area.' },
    closeLabel: {
      control: { type: 'text' },
      description: 'Accessible label for the close button.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS class names.',
    },
  },
  args: {
    open: true,
    title: 'Add Support Activity',
    children: (
      <p>
        Select the type of support activity to add to this participant's
        coaching plan. Activities are tied to employment goals and require
        supervisor approval.
      </p>
    ),
    footer: (
      <div
        style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}
      >
        <button className="pathable-button" type="button">
          Add Activity
        </button>
        <button
          className="pathable-button pathable-button--outline"
          type="button"
        >
          Cancel
        </button>
      </div>
    ),
    onClose: fn(),
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    open: false,
  },
}

// ---------------------------------------------------------------------------
// Fixed stories
// ---------------------------------------------------------------------------

export const ClosedTrigger: Story = {
  args: {
    open: false,
    title: 'Confirm Deletion',
    children: (
      <p>
        Are you sure you want to delete this item? This action cannot be undone.
      </p>
    ),
    footer: (
      <div
        style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}
      >
        <button
          className="pathable-button pathable-button--outline"
          type="button"
        >
          Cancel
        </button>
        <button className="pathable-button" type="button">
          Delete
        </button>
      </div>
    ),
    onClose: fn(),
  },
}

export const Open: Story = {
  args: {
    open: true,
    title: 'Confirm Deletion',
    children: (
      <p>
        Are you sure you want to delete this item? This action cannot be undone.
      </p>
    ),
    footer: (
      <div
        style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}
      >
        <button
          className="pathable-button pathable-button--outline"
          type="button"
        >
          Cancel
        </button>
        <button className="pathable-button" type="button">
          Delete
        </button>
      </div>
    ),
    onClose: fn(),
  },
}

export const LongContent: Story = {
  args: {
    open: true,
    title: 'Terms and Conditions',
    children: <p>{LONG_CONTENT}</p>,
    footer: (
      <div
        style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}
      >
        <button className="pathable-button" type="button">
          Accept
        </button>
        <button
          className="pathable-button pathable-button--outline"
          type="button"
        >
          Decline
        </button>
      </div>
    ),
    onClose: fn(),
  },
}

export const LongActions: Story = {
  args: {
    open: true,
    title: 'Multiple Actions',
    children: <p>Choose how to proceed with this item.</p>,
    footer: (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button className="pathable-button" type="button">
          Save and Continue
        </button>
        <button
          className="pathable-button pathable-button--outline"
          type="button"
        >
          Save as Draft
        </button>
        <button
          className="pathable-button pathable-button--outline"
          type="button"
        >
          Preview
        </button>
        <button
          className="pathable-button pathable-button--outline"
          type="button"
        >
          Cancel
        </button>
      </div>
    ),
    onClose: fn(),
  },
}

export const Narrow: Story = {
  args: {
    open: true,
    title: 'Confirm',
    children: <p>Please confirm your selection.</p>,
    footer: (
      <div
        style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}
      >
        <button className="pathable-button" type="button">
          Confirm
        </button>
        <button
          className="pathable-button pathable-button--outline"
          type="button"
        >
          Cancel
        </button>
      </div>
    ),
    onClose: fn(),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

// ---------------------------------------------------------------------------
// Interaction tests
// ---------------------------------------------------------------------------

export const OpenCloseBehavior: Story = {
  args: {
    open: true,
    title: 'Test Modal',
    children: <p>Content here.</p>,
    onClose: fn(),
  },
  play: async ({ args, step }) => {
    await step('modal is rendered in the portal', async () => {
      // The modal is portaled to document.body, so query the whole document
      const dialog = document.body.querySelector('[role="dialog"]')
      await expect(dialog).not.toBeNull()
    })

    await step('close button calls onClose', async () => {
      const closeButton = within(document.body).getByRole('button', {
        name: 'Close modal',
      })
      await userEvent.click(closeButton)
      await expect(args.onClose).toHaveBeenCalledTimes(1)
    })
  },
}

export const EscapeCloses: Story = {
  args: {
    open: true,
    title: 'Escape Test',
    children: <p>Press Escape to close.</p>,
    onClose: fn(),
  },
  play: async ({ args, step }) => {
    await step('Escape key calls onClose', async () => {
      await userEvent.keyboard('{Escape}')
      await expect(args.onClose).toHaveBeenCalledTimes(1)
    })
  },
}

export const TabContainment: Story = {
  args: {
    open: true,
    title: 'Tab Trap',
    children: <p>Tab should cycle within modal.</p>,
    footer: (
      <div
        style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}
      >
        <button className="pathable-button" type="button">
          Confirm
        </button>
        <button
          className="pathable-button pathable-button--outline"
          type="button"
        >
          Cancel
        </button>
      </div>
    ),
    onClose: fn(),
  },
  play: async ({ step }) => {
    await step('Tab cycles forward through focusable elements', async () => {
      const closeButton = within(document.body).getByRole('button', {
        name: 'Close modal',
      })
      const confirmButton = within(document.body).getByRole('button', {
        name: 'Confirm',
      })
      const cancelButton = within(document.body).getByRole('button', {
        name: 'Cancel',
      })

      // Close button should be first focused initially
      await expect(closeButton).toHaveFocus()

      // Tab should go to Confirm
      await userEvent.tab()
      await expect(confirmButton).toHaveFocus()

      // Tab should go to Cancel
      await userEvent.tab()
      await expect(cancelButton).toHaveFocus()

      // Tab should cycle back to Close
      await userEvent.tab()
      await expect(closeButton).toHaveFocus()
    })

    await step(
      'Shift+Tab cycles backward through focusable elements',
      async () => {
        const closeButton = within(document.body).getByRole('button', {
          name: 'Close modal',
        })
        const cancelButton = within(document.body).getByRole('button', {
          name: 'Cancel',
        })

        // Start from Close button, Shift+Tab goes to Cancel
        await closeButton.focus()
        await userEvent.tab({ shift: true })
        await expect(cancelButton).toHaveFocus()
      },
    )
  },
}
