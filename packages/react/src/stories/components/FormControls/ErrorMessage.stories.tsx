import { ErrorMessage } from '../../../components/ErrorMessage/ErrorMessage'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'

const meta = {
  title: 'Components/Form Controls/ErrorMessage',
  component: ErrorMessage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A field-level validation message for explaining how to correct an invalid or incomplete form value. It wraps a native \`<span>\` with the \`.pathable-error-message\` class and forwards standard span attributes.

**When to use**: Use ErrorMessage when a form control needs concise, human-readable recovery guidance. Associate it with the invalid control through \`aria-describedby\` and give it an \`id\`.

**When not to use**: Do not use ErrorMessage for page-level failures, general status announcements, or broad application alerts. Use PageError, Alert, or the appropriate feedback pattern instead.

**Underlying element**: Native \`<span>\`. The wrapper does not manage validation state or automatically announce the message.

**Announcement behavior**: Consumers choose whether a message should be announced with attributes such as \`role="alert"\` or \`aria-live\`. Plain inline messages remain non-announcing by default so validation timing stays application-controlled.

**Accessibility**: Provide specific recovery guidance, connect the message with \`aria-describedby\`, and use \`aria-invalid="true"\` on the associated control when validation identifies an error.`,
      },
    },
  },
  argTypes: {
    children: {
      control: { type: 'text' },
      description:
        'Human-readable recovery guidance. Explain what is wrong and how to correct it.',
    },
    id: {
      control: { type: 'text' },
      description:
        'Stable identifier referenced by the associated control through aria-describedby.',
    },
    role: {
      control: { type: 'text' },
      description:
        'Optional consumer-selected semantic role, such as alert. The wrapper does not add one automatically.',
    },
    'aria-live': {
      options: ['off', 'polite', 'assertive'],
      control: { type: 'select' },
      description:
        'Optional live-region behavior selected by the consuming validation flow.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble error-message class.',
    },
  },
  args: {
    children: 'Enter a valid email address.',
  },
} satisfies Meta<typeof ErrorMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    id: 'email-error',
    role: 'alert',
    children: 'Enter a valid email address.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const message = canvas.getByRole('alert')

    await expect(message).toHaveClass('pathable-error-message')
    await expect(message).toHaveAttribute('id', 'email-error')
    await expect(message).toHaveTextContent('Enter a valid email address.')
  },
}

export const Inline: Story = {
  args: {
    children: 'Choose a start date before continuing.',
  },
}

export const PoliteFieldMessage: Story = {
  args: {
    id: 'participant-id-error',
    role: 'status',
    'aria-live': 'polite',
    children: 'Use the participant ID format ABC-123.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const message = canvas.getByRole('status')

    await expect(message).toHaveAttribute('aria-live', 'polite')
  },
}

export const CustomAttributes: Story = {
  args: {
    id: 'custom-error-message',
    role: 'alert',
    className: 'custom-error-message',
    'data-testid': 'custom-error-message',
    children: 'Provide a recovery value for this field.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const message = canvas.getByRole('alert')

    await expect(message).toHaveClass(
      'pathable-error-message',
      'custom-error-message',
    )
    await expect(message).toHaveAttribute('id', 'custom-error-message')
    await expect(message).toHaveAttribute('data-testid', 'custom-error-message')
  },
}

export const LongContent: Story = {
  args: {
    id: 'long-error-message',
    role: 'alert',
    children:
      'Enter the participant funding authorization number exactly as it appears on the eligibility record, then review the value before submitting the form again.',
  },
}

export const Narrow: Story = {
  args: {
    id: 'narrow-error-message',
    role: 'alert',
    children: 'Enter a valid participant identifier.',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const FormComposition: Story = {
  render: () => (
    <form aria-label="Participant contact details">
      <label htmlFor="participant-email">Participant email</label>
      <input
        id="participant-email"
        name="participantEmail"
        className="pathable-input"
        type="email"
        defaultValue="not-an-email"
        aria-invalid="true"
        aria-describedby="participant-email-error"
      />
      <ErrorMessage id="participant-email-error" role="alert">
        Enter an email address in the format name@example.com.
      </ErrorMessage>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Participant email' })
    const message = canvas.getByRole('alert')

    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAttribute(
      'aria-describedby',
      'participant-email-error',
    )
    await expect(message).toHaveTextContent(
      'Enter an email address in the format name@example.com.',
    )
  },
}
