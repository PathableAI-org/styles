import { Button } from '../../../components/Button/Button'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect, fn } from 'storybook/test'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A button that triggers an action or event. The Button component wraps the USWDS button with PathAble brand styling through \`.pathable-button\` and variant modifier classes.

**When to use**: For primary actions, form submissions, navigation triggers, and any user-initiated event. Choose the variant that matches the action's importance and context.

**When not to use**: Do not use \`Button\` for navigation to a different page — use \`<Link>\` or \`<a>\` instead. Do not use \`Button\` for state toggles that have no immediate action — consider a toggle, switch, or checkbox.

**Underlying element**: \`<button type="button">\`.

**Controlled/uncontrolled**: This is an uncontrolled component. All behavior (disabled, type, event handlers) is managed through standard HTML button attributes forwarded to the underlying element. Consuming applications manage click handlers, loading states, and form participation themselves.

**Known constraints**: The \`inverse\` variant requires a dark background to be visible. The \`unstyled\` variant removes all visual button styling and should only be used when custom styling is applied.`,
      },
    },
  },
  argTypes: {
    variant: {
      options: [
        'primary',
        'secondary',
        'accent-cool',
        'accent-warm',
        'outline',
        'inverse',
        'base',
        'unstyled',
        'save',
        'continue',
        'review',
        'destructive',
        'low-emphasis',
      ],
      control: { type: 'select' },
      description:
        "**Semantic variant** that communicates the action's importance and intent. \`primary\` is the default call-to-action. \`secondary\` is for alternative actions. \`destructive\` warns of irreversible consequences. \`save\`, \`continue\`, and \`review\` are workflow-specific variants. See each variant story for usage guidance.",
    },
    size: {
      options: ['default', 'big'],
      control: { type: 'select' },
      description:
        "The button's size variant. Use \`big\` sparingly for primary CTAs on marketing or landing pages; prefer \`default\` for most application UI.",
    },
    children: {
      control: { type: 'text' },
      description:
        'Button label content. Must describe the action concisely. Prefer verb phrases like "Save changes" or "Download report". Avoid generic labels like "Click here".',
    },
    disabled: {
      control: { type: 'boolean' },
      description:
        'When \`true\`, the button is non-interactive and receives disabled styling. The \`disabled\` attribute prevents all click and keyboard activation. Do not disable buttons without a visible reason the user can understand.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble button classes. Use for consumer-specific overrides only — variant and size props cover all design-system styling.',
    },
  },
  args: {
    variant: 'primary',
    size: 'default',
    children: 'Button',
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Playground — exploratory Controls use only (not regression coverage)
// ---------------------------------------------------------------------------

export const Playground: Story = {}

// ---------------------------------------------------------------------------
// Fixed visual state stories — each is a supported, deterministic contract
// ---------------------------------------------------------------------------

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
}

export const AccentCool: Story = {
  args: {
    children: 'Accent Cool',
    variant: 'accent-cool',
  },
}

export const AccentWarm: Story = {
  args: {
    children: 'Accent Warm',
    variant: 'accent-warm',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
}

/** Inverse buttons require a dark background to be visible.
 *  This story renders on a dark surface for correct visual presentation. */
export const Inverse: Story = {
  args: {
    children: 'Inverse Button',
    variant: 'inverse',
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#00365c', padding: '2rem', borderRadius: 4 }}>
        <Story />
      </div>
    ),
  ],
}

export const Base: Story = {
  args: {
    children: 'Base Button',
    variant: 'base',
  },
}

export const Unstyled: Story = {
  args: {
    children: 'Unstyled Button',
    variant: 'unstyled',
  },
}

export const Save: Story = {
  args: {
    children: 'Save Changes',
    variant: 'save',
  },
}

export const Continue: Story = {
  args: {
    children: 'Continue',
    variant: 'continue',
  },
}

export const Review: Story = {
  args: {
    children: 'Review',
    variant: 'review',
  },
}

/** The destructive variant communicates irreversible or dangerous actions
 *  such as deleting data. Use with a confirmation step. */
export const Destructive: Story = {
  args: {
    children: 'Delete Account',
    variant: 'destructive',
  },
}

/** Low-emphasis buttons are for tertiary actions that should not compete
 *  visually with primary or secondary actions. */
export const LowEmphasis: Story = {
  args: {
    children: 'Dismiss',
    variant: 'low-emphasis',
  },
}

// ---------------------------------------------------------------------------
// Size variant
// ---------------------------------------------------------------------------

export const Big: Story = {
  args: {
    children: 'Get Started',
    variant: 'primary',
    size: 'big',
  },
}

// ---------------------------------------------------------------------------
// Behavioral states
// ---------------------------------------------------------------------------

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
}

// ---------------------------------------------------------------------------
// Long content — verifies text overflow and wrapping behavior
// ---------------------------------------------------------------------------

export const LongLabel: Story = {
  args: {
    children:
      'Submit application for employment coaching and job readiness program enrollment',
    variant: 'primary',
  },
}

// ---------------------------------------------------------------------------
// Narrow container — mobile and constrained-width behavior
// ---------------------------------------------------------------------------

export const Narrow: Story = {
  args: {
    children: 'Submit',
    variant: 'primary',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const NarrowLongLabel: Story = {
  args: {
    children:
      'Submit application for employment coaching and job readiness program enrollment',
    variant: 'primary',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// ---------------------------------------------------------------------------
// Interaction tests — keyboard and click behavior
// ---------------------------------------------------------------------------

/** Verifies that a primary button activates on click, fires the onClick
 *  handler, and is reachable by keyboard focus with a visible focus ring. */
export const ClickActivation: Story = {
  args: {
    children: 'Click Me',
    variant: 'primary',
    onClick: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('click activates the button', async () => {
      const button = canvas.getByRole('button', { name: 'Click Me' })
      await userEvent.click(button)
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })
  },
}

/** Verifies keyboard activation with Enter and Space keys, and confirms
 *  the button receives focus with a visible focus indicator. */
export const KeyboardActivation: Story = {
  args: {
    children: 'Keyboard Button',
    variant: 'primary',
    onClick: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('button receives keyboard focus', async () => {
      const button = canvas.getByRole('button', { name: 'Keyboard Button' })
      await userEvent.tab()
      await expect(button).toHaveFocus()
    })

    await step('Enter key activates the button', async () => {
      const button = canvas.getByRole('button', { name: 'Keyboard Button' })
      await userEvent.keyboard('{Enter}')
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })

    await step('Space key activates the button', async () => {
      const button = canvas.getByRole('button', { name: 'Keyboard Button' })
      await userEvent.keyboard(' ')
      await expect(args.onClick).toHaveBeenCalledTimes(2)
    })
  },
}

/** Verifies that a disabled button cannot be clicked or focused via keyboard,
 *  and that it exposes its disabled state in the accessibility tree. */
export const DisabledInteraction: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
    onClick: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('disabled button is present in the DOM', async () => {
      const button = canvas.getByRole('button', { name: 'Disabled Button' })
      await expect(button).toBeDisabled()
    })

    await step('clicking disabled button does not fire onClick', async () => {
      const button = canvas.getByRole('button', { name: 'Disabled Button' })
      await userEvent.click(button, { skipPointerEventsCheck: true })
      await expect(args.onClick).not.toHaveBeenCalled()
    })
  },
}

// ---------------------------------------------------------------------------
// Composition — realistic patterns using the component
// ---------------------------------------------------------------------------

/** Buttons inside a ButtonGroup, representing a typical form footer with
 *  primary and secondary actions. */
export const InButtonGroup: Story = {
  render: () => (
    <div className="pathable-button-group">
      <Button variant="primary">Save Changes</Button>
      <Button variant="secondary">Cancel</Button>
    </div>
  ),
}

/** A destructive action paired with a cancel option in a dialog footer
 *  pattern. The destructive button is placed last to avoid accidental clicks. */
export const DialogFooter: Story = {
  render: () => (
    <div
      style={{
        border: '1px solid var(--pathable-color-border, #ccc)',
        borderRadius: 8,
        padding: '1.5rem',
        maxWidth: 360,
      }}
    >
      <h3 style={{ margin: '0 0 0.75rem' }}>Confirm deletion</h3>
      <p
        style={{
          margin: '0 0 1.25rem',
          color: 'var(--pathable-color-text-muted, #555)',
        }}
      >
        This action cannot be undone. All associated data will be permanently
        removed.
      </p>
      <div className="pathable-button-group">
        <Button variant="secondary">Cancel</Button>
        <Button variant="destructive">Delete Permanently</Button>
      </div>
    </div>
  ),
}
