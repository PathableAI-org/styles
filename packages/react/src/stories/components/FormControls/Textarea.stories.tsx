import { Textarea } from '../../../components/Textarea/Textarea'
import { Button } from '../../../components/Button/Button'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'

const meta = {
  title: 'Components/Form Controls/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A multiline text input for collecting free-form user responses. It wraps the native \`<textarea>\` element with the \`.pathable-textarea\` class.

**When to use**: For comments, notes, descriptions, messages, and other responses that may span multiple lines. Pair it with a visible \`<label>\` and, when needed, a hint or validation message.

**When not to use**: Do not use Textarea for a single-line value; use a text input instead. Do not use it for rich text editing without adding an appropriate editor and accessible editing model.

**Underlying element**: Native \`<textarea>\`.

**Controlled/uncontrolled**: Textarea is a native form control. Consumers manage its value with standard \`value\`, \`defaultValue\`, and event-handler props.

**Accessibility**: Consumers must provide an accessible name through a visible associated label or an appropriate ARIA label. Use \`aria-describedby\` to associate hints or validation messages. Disabled and read-only states should have a clear reason in the surrounding content.`,
      },
    },
  },
  argTypes: {
    rows: {
      control: { type: 'number', min: 1 },
      description: 'The visible number of text rows for the control.',
    },
    cols: {
      control: { type: 'number', min: 1 },
      description: 'The visible number of character columns for the control.',
    },
    placeholder: {
      control: { type: 'text' },
      description:
        'Optional example text. Do not use placeholder text as the accessible label or as the only instruction.',
    },
    disabled: {
      control: { type: 'boolean' },
      description:
        'Prevents interaction and form submission for this control. Explain the reason for disabling the field nearby.',
    },
    readOnly: {
      control: { type: 'boolean' },
      description:
        'Allows the value to be read and selected without permitting edits.',
    },
    required: {
      control: { type: 'boolean' },
      description:
        'Marks the field as required for native form validation. The label should communicate the requirement as well.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble textarea class.',
    },
    defaultValue: {
      control: { type: 'text' },
      description:
        'Initial uncontrolled value. Use value and onChange when the application owns the value state.',
    },
  },
  args: {
    'aria-label': 'Session notes',
    rows: 4,
    placeholder: 'Enter session notes',
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    id: 'session-notes',
    name: 'sessionNotes',
    'aria-label': 'Session notes',
  },
}

export const InForm: Story = {
  render: () => (
    <form aria-label="Coaching session note">
      <label htmlFor="session-note">Session note</label>
      <Textarea
        id="session-note"
        name="sessionNote"
        rows={6}
        placeholder="Document key observations and progress"
      />
    </form>
  ),
}

export const WithHint: Story = {
  render: () => (
    <div>
      <label htmlFor="supervisor-comment">Supervisor comment</label>
      <p id="supervisor-comment-hint">
        Add recommendations for the participant&apos;s next coaching session.
      </p>
      <Textarea
        id="supervisor-comment"
        name="supervisorComment"
        aria-describedby="supervisor-comment-hint"
        rows={5}
      />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Archived session notes',
    disabled: true,
    defaultValue: 'These notes are no longer editable.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox', {
      name: 'Archived session notes',
    })

    await expect(textarea).toBeDisabled()
    await userEvent.tab()
    await expect(textarea).not.toHaveFocus()
  },
}

export const ReadOnly: Story = {
  args: {
    'aria-label': 'Completed session notes',
    readOnly: true,
    defaultValue: 'The participant completed the agreed action plan.',
  },
}

export const Required: Story = {
  args: {
    'aria-label': 'Required follow-up note',
    required: true,
  },
}

export const CustomAttributes: Story = {
  args: {
    id: 'custom-textarea',
    name: 'customTextarea',
    'aria-label': 'Custom textarea',
    'data-testid': 'custom-textarea',
    className: 'custom-textarea-class',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox', { name: 'Custom textarea' })

    await expect(textarea).toHaveClass(
      'pathable-textarea',
      'custom-textarea-class',
    )
    await expect(textarea).toHaveAttribute('name', 'customTextarea')
  },
}

export const KeyboardInput: Story = {
  render: () => (
    <label htmlFor="keyboard-input">
      Keyboard input
      <Textarea id="keyboard-input" rows={4} />
    </label>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox', { name: 'Keyboard input' })

    await userEvent.tab()
    await expect(textarea).toHaveFocus()
    await userEvent.type(textarea, 'Notes entered with the keyboard.')
    await expect(textarea).toHaveValue('Notes entered with the keyboard.')
  },
}

export const LongContent: Story = {
  args: {
    'aria-label': 'Detailed progress notes',
    rows: 8,
    defaultValue:
      'The participant reviewed employment goals, identified two suitable roles, and agreed to complete the next application steps before the follow-up session.',
  },
}

export const Narrow: Story = {
  args: {
    'aria-label': 'Narrow layout notes',
    rows: 5,
    placeholder: 'Enter a note on a narrow screen',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const FormComposition: Story = {
  render: () => (
    <form aria-label="Save coaching note">
      <label htmlFor="coaching-note">Coaching note</label>
      <Textarea
        id="coaching-note"
        name="coachingNote"
        rows={6}
        required
        aria-describedby="coaching-note-hint"
      />
      <p id="coaching-note-hint">Include the agreed next action.</p>
      <Button type="submit">Save note</Button>
    </form>
  ),
}
