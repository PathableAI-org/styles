import { Modal } from '../../../components/Modal/Modal'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect, fn, waitFor } from 'storybook/test'
import { useRef, useState } from 'react'
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

**Behavior**: React owns the complete portaled overlay. Opening the modal isolates background body content with \`inert\` and \`aria-hidden\`, locks scrolling, and moves focus inside. The close button, Escape, or the backdrop requests close. Closing restores all managed document state and returns focus to the prior element. A separate \`@pathableai/styles/js\` import is not required.

**Keyboard behavior**: Tab cycles through focusable elements within the modal. Escape closes the modal. Focus is trapped inside the modal while open.

**Underlying element**: A complete portaled overlay containing a \`<div>\` with role="dialog" and aria-modal="true".`,
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

function ModalLifecycleFixture({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false)
  const initialFocusRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open contract modal
      </button>
      <Modal
        open={open}
        onClose={() => {
          onClose()
          setOpen(false)
        }}
        title="Review activity"
        description="Confirm the activity details before continuing."
        initialFocusRef={initialFocusRef}
        className="contract-dialog"
        data-testid="contract-dialog"
        footer={<button type="button">Save activity</button>}
      >
        <button ref={initialFocusRef} type="button">
          Review selection
        </button>
      </Modal>
    </>
  )
}

function StackedModalFixture() {
  const [lowerOpen, setLowerOpen] = useState(false)
  const [upperOpen, setUpperOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setLowerOpen(true)}>
        Open lower modal
      </button>
      <Modal
        open={lowerOpen}
        onClose={() => setLowerOpen(false)}
        title="Lower modal"
      >
        <button type="button" onClick={() => setUpperOpen(true)}>
          Open upper modal
        </button>
      </Modal>
      <Modal
        open={upperOpen}
        onClose={() => setUpperOpen(false)}
        title="Upper modal"
      >
        <button type="button" onClick={() => setLowerOpen(false)}>
          Remove lower modal
        </button>
      </Modal>
    </>
  )
}

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
    description: 'Modal contract description.',
    children: <p>Content here.</p>,
    className: 'custom-dialog',
    'data-testid': 'test-dialog',
    onClose: fn(),
  },
  play: async ({ args, step }) => {
    await step(
      'React renders and owns the complete portaled overlay',
      async () => {
        const dialog = within(document.body).getByRole('dialog', {
          name: 'Test Modal',
        })
        const wrapper = dialog.closest('.pathable-modal-wrapper')
        const overlay = dialog.closest('.pathable-modal-overlay')

        await expect(dialog).toHaveAccessibleDescription(
          'Modal contract description.',
        )
        await expect(dialog).toHaveClass('pathable-modal', 'custom-dialog')
        await expect(dialog).toHaveAttribute('data-react-owned', 'true')
        await expect(dialog).toHaveAttribute('data-testid', 'test-dialog')
        await expect(wrapper).toHaveAttribute('data-react-owned', 'true')
        await expect(overlay).not.toBeNull()
        await expect(
          document.querySelector('[data-placeholder-for]'),
        ).toBeNull()
      },
    )

    await step('close button calls onClose', async () => {
      const closeButton = within(document.body).getByRole('button', {
        name: 'Close modal',
      })
      await userEvent.click(closeButton)
      await expect(args.onClose).toHaveBeenCalledTimes(1)
    })
  },
}

export const DocumentStateRestoration: Story = {
  render: (args) => <ModalLifecycleFixture onClose={args.onClose} />,
  args: {
    open: false,
    onClose: fn(),
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    const opener = canvas.getByRole('button', { name: 'Open contract modal' })
    const preservedSibling = document.createElement('div')
    const dynamicSibling = document.createElement('div')
    const previousOverflow = document.body.style.getPropertyValue('overflow')
    const previousOverflowPriority =
      document.body.style.getPropertyPriority('overflow')
    const hadActiveClass = document.body.classList.contains(
      'pathable-js-modal--active',
    )

    preservedSibling.setAttribute('aria-hidden', 'false')
    preservedSibling.setAttribute('inert', 'preserved')
    document.body.append(preservedSibling)

    try {
      await step(
        'opening isolates the background and moves focus',
        async () => {
          await userEvent.click(opener)

          const dialog = within(document.body).getByRole('dialog', {
            name: 'Review activity',
          })
          const initialFocus = within(dialog).getByRole('button', {
            name: 'Review selection',
          })

          await waitFor(() => expect(initialFocus).toHaveFocus())
          await expect(dialog).toHaveAccessibleDescription(
            'Confirm the activity details before continuing.',
          )
          await expect(canvasElement).toHaveAttribute('aria-hidden', 'true')
          await expect(canvasElement).toHaveAttribute('inert')
          await expect(preservedSibling).toHaveAttribute('aria-hidden', 'true')
          await expect(preservedSibling).toHaveAttribute('inert', '')
          document.body.append(dynamicSibling)
          await waitFor(() => {
            expect(dynamicSibling).toHaveAttribute('aria-hidden', 'true')
            expect(dynamicSibling).toHaveAttribute('inert', '')
          })
          await expect(document.body.style.overflow).toBe('hidden')
          await expect(
            document.body.classList.contains('pathable-js-modal--active'),
          ).toBe(hadActiveClass)
        },
      )

      await step(
        'backdrop close restores prior document state and focus',
        async () => {
          const overlay = document.body.querySelector<HTMLElement>(
            '.pathable-modal-overlay',
          )
          await expect(overlay).not.toBeNull()
          await userEvent.click(overlay as HTMLElement)

          await waitFor(() => {
            expect(
              within(document.body).queryByRole('dialog', {
                name: 'Review activity',
              }),
            ).not.toBeInTheDocument()
          })
          await expect(args.onClose).toHaveBeenCalledTimes(1)
          await expect(opener).toHaveFocus()
          await expect(canvasElement).not.toHaveAttribute('aria-hidden')
          await expect(canvasElement).not.toHaveAttribute('inert')
          await expect(preservedSibling).toHaveAttribute('aria-hidden', 'false')
          await expect(preservedSibling).toHaveAttribute('inert', 'preserved')
          await expect(dynamicSibling).not.toHaveAttribute('aria-hidden')
          await expect(dynamicSibling).not.toHaveAttribute('inert')
          await expect(document.body.style.overflow).toBe(previousOverflow)
          await expect(
            document.body.style.getPropertyPriority('overflow'),
          ).toBe(previousOverflowPriority)
          await expect(
            document.body.classList.contains('pathable-js-modal--active'),
          ).toBe(hadActiveClass)
        },
      )

      await step(
        'Escape closes and restores focus after reopening',
        async () => {
          await userEvent.click(opener)
          await waitFor(() => {
            expect(
              within(document.body).getByRole('button', {
                name: 'Review selection',
              }),
            ).toHaveFocus()
          })
          await userEvent.keyboard('{Escape}')
          await waitFor(() => expect(opener).toHaveFocus())
          await expect(args.onClose).toHaveBeenCalledTimes(2)
        },
      )
    } finally {
      preservedSibling.remove()
      dynamicSibling.remove()
    }
  },
}

export const StackedModalRestoration: Story = {
  render: () => <StackedModalFixture />,
  args: {
    open: false,
  },
  play: async ({ canvasElement, step }) => {
    const pageOpener = within(canvasElement).getByRole('button', {
      name: 'Open lower modal',
    })

    await step('opening an upper modal isolates the lower layer', async () => {
      await userEvent.click(pageOpener)
      const lowerDialog = within(document.body).getByRole('dialog', {
        name: 'Lower modal',
      })
      await userEvent.click(
        within(lowerDialog).getByRole('button', { name: 'Open upper modal' }),
      )

      const lowerWrapper = lowerDialog.closest('.pathable-modal-wrapper')
      const upperDialog = within(document.body).getByRole('dialog', {
        name: 'Upper modal',
      })
      await expect(lowerWrapper).toHaveAttribute('aria-hidden', 'true')
      await expect(lowerWrapper).toHaveAttribute('inert')
      await expect(upperDialog).not.toHaveAttribute('aria-hidden')
      await expect(document.body.style.overflow).toBe('hidden')
    })

    await step(
      'out-of-order teardown preserves the active layer and page focus target',
      async () => {
        const upperDialog = within(document.body).getByRole('dialog', {
          name: 'Upper modal',
        })
        await userEvent.click(
          within(upperDialog).getByRole('button', {
            name: 'Remove lower modal',
          }),
        )

        await waitFor(() => {
          expect(
            within(document.body).queryByRole('dialog', {
              name: 'Lower modal',
            }),
          ).not.toBeInTheDocument()
        })
        await expect(document.body.style.overflow).toBe('hidden')

        await userEvent.click(
          within(upperDialog).getByRole('button', { name: 'Close modal' }),
        )
        await waitFor(() => expect(pageOpener).toHaveFocus())
        await expect(document.body.style.overflow).toBe('')
      },
    )
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
      const closeButton = within(document.body).getByRole('button', {
        name: 'Close modal',
      })
      await waitFor(() => expect(closeButton).toHaveFocus())
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
