import { Input } from '../../../components/Input/Input'
import { Button } from '../../../components/Button/Button'
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'

const meta = {
  title: 'Components/Form Controls/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A single-line native form control for collecting short values such as names, email addresses, passwords, search terms, and identifiers. It wraps the native \`<input>\` element with the \`.pathable-input\` class and forwards standard input attributes unchanged.

**When to use**: Use Input for a single-line value. Choose the native \`type\` that matches the value and expected keyboard on supported devices.

**When not to use**: Do not use Input for multiline responses; use \`Textarea\` instead. Do not use placeholder text as the only accessible label or instruction.

**Underlying element**: Native \`<input>\`. The wrapper does not manage value state, validation, submission, or input type behavior.

**Accessibility**: Consumers must provide an accessible name through a visible associated \`<label>\` or an appropriate ARIA label. Use \`aria-describedby\` to associate hints or validation messages, and use \`aria-invalid\` when application validation identifies an error.`,
      },
    },
  },
  argTypes: {
    type: {
      options: [
        'text',
        'email',
        'password',
        'search',
        'tel',
        'url',
        'number',
        'date',
      ],
      control: { type: 'select' },
      description:
        'Native input type. Choose the type that matches the value and expected interaction; other native types are also forwarded.',
    },
    placeholder: {
      control: { type: 'text' },
      description:
        'Optional example text. Do not use placeholder text as the accessible label or as the only instruction.',
    },
    defaultValue: {
      control: { type: 'text' },
      description:
        'Initial uncontrolled value. Use value and onChange when the application owns the field state.',
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
        'Additional CSS class names appended after the PathAble input class.',
    },
  },
  args: {
    type: 'text',
    'aria-label': 'Participant name',
    placeholder: 'Enter participant name',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    id: 'participant-name',
    name: 'participantName',
    'aria-label': 'Participant name',
  },
}

export const Email: Story = {
  render: () => (
    <div>
      <label htmlFor="email-address">Email address</label>
      <Input
        id="email-address"
        name="email"
        type="email"
        placeholder="you@example.com"
      />
    </div>
  ),
}

export const Password: Story = {
  render: () => (
    <div>
      <label htmlFor="account-password">Password</label>
      <Input
        id="account-password"
        name="password"
        type="password"
        autoComplete="current-password"
      />
    </div>
  ),
}

export const Search: Story = {
  render: () => (
    <div>
      <label htmlFor="participant-search">Search participants</label>
      <Input
        id="participant-search"
        name="search"
        type="search"
        placeholder="Search participants"
      />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Archived participant name',
    disabled: true,
    defaultValue: 'Alex Morgan',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', {
      name: 'Archived participant name',
    })

    await expect(input).toBeDisabled()
    await userEvent.tab()
    await expect(input).not.toHaveFocus()
  },
}

export const ReadOnly: Story = {
  args: {
    'aria-label': 'Participant identifier',
    readOnly: true,
    defaultValue: 'participant-042',
  },
}

function ControlledInputStory() {
  const [value, setValue] = useState('participant-042')

  return (
    <div>
      <label htmlFor="controlled-participant-id">Participant identifier</label>
      <Input
        id="controlled-participant-id"
        name="participantId"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledInputStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', {
      name: 'Participant identifier',
    })

    await userEvent.clear(input)
    await userEvent.type(input, 'participant-099')
    await expect(input).toHaveValue('participant-099')
  },
}

export const Required: Story = {
  render: () => (
    <div>
      <label htmlFor="required-email">Email address</label>
      <Input id="required-email" name="email" type="email" required />
    </div>
  ),
}

export const Invalid: Story = {
  render: () => (
    <div>
      <label htmlFor="invalid-email">Email address</label>
      <Input
        id="invalid-email"
        name="email"
        type="email"
        defaultValue="not-an-email"
        aria-invalid="true"
        aria-describedby="invalid-email-error"
      />
      <p id="invalid-email-error" role="alert">
        Enter a valid email address.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email address' })

    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAttribute(
      'aria-describedby',
      'invalid-email-error',
    )
    const alert = canvas.getByRole('alert')
    await expect(alert).toBeVisible()
    await expect(alert).toHaveTextContent('Enter a valid email address.')
  },
}

export const CustomAttributes: Story = {
  args: {
    id: 'custom-input',
    name: 'customInput',
    'aria-label': 'Custom input',
    'data-testid': 'custom-input',
    className: 'custom-input-class',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Custom input' })

    await expect(input).toHaveClass('pathable-input', 'custom-input-class')
    await expect(input).toHaveAttribute('id', 'custom-input')
    await expect(input).toHaveAttribute('name', 'customInput')
  },
}

export const KeyboardInput: Story = {
  render: () => (
    <div>
      <label htmlFor="keyboard-input">Keyboard input</label>
      <Input id="keyboard-input" name="keyboardInput" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Keyboard input' })

    await userEvent.tab()
    await expect(input).toHaveFocus()
    await userEvent.type(input, 'Value entered with the keyboard.')
    await expect(input).toHaveValue('Value entered with the keyboard.')
  },
}

export const LongContent: Story = {
  args: {
    'aria-label': 'Long participant identifier',
    defaultValue:
      'participant-employment-coaching-progress-report-2026-07-27-042',
  },
}

export const Narrow: Story = {
  render: () => (
    <div>
      <label htmlFor="narrow-input">Search term</label>
      <Input
        id="narrow-input"
        name="searchTerm"
        type="search"
        placeholder="Search"
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/** FullWidth demonstrates the `width="full"` semantic sizing prop,
 *  which replaces manual `className="pathable-width-full"` usage.
 *  The class is applied to the root element — no wrapper is introduced. */
export const FullWidth: Story = {
  args: {
    'aria-label': 'Employer name',
    width: 'full',
    placeholder: 'Enter employer name',
  },
}

export const FormComposition: Story = {
  render: () => (
    <form aria-label="Participant details">
      <label htmlFor="participant-email">Participant email</label>
      <Input
        id="participant-email"
        name="participantEmail"
        type="email"
        required
        aria-describedby="participant-email-hint"
      />
      <p id="participant-email-hint">
        Use the address associated with the participant account.
      </p>
      <Button type="submit">Save participant</Button>
    </form>
  ),
}
