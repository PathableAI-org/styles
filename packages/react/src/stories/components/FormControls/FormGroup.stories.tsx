import { FormGroup } from '../../../components/FormGroup/FormGroup'
import { Input } from '../../../components/Input/Input'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'

const defaultChildren = (
  <>
    <label htmlFor="participant-name">Participant name</label>
    <Input id="participant-name" name="participantName" />
  </>
)

const meta = {
  title: 'Components/Form Controls/FormGroup',
  component: FormGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A visual wrapper for the content associated with one form control. It wraps a native \`<div>\` with the \`.pathable-form-group\` class and forwards standard div attributes.

**When to use**: Use FormGroup to apply PathAble form-group styling around a control, its label, and related hint or validation content.

**When not to use**: Do not use FormGroup as a semantic group for related controls or as a replacement for \`<fieldset>\`. It does not provide an accessible name, manage form state, or disable descendants.

**Underlying element**: Native \`<div>\`. The wrapper does not manage labels, values, validation, focus, or submission.

**Accessibility**: Provide an accessible name for each contained control with a visible associated \`<label>\` or an appropriate ARIA label. Associate hints and validation messages with the control through \`aria-describedby\`; use a native \`<fieldset>\` when controls need a shared group name.`,
      },
    },
  },
  argTypes: {
    children: {
      control: 'none',
      description:
        'A label, form control, and any related hint or validation content.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional class names appended after the PathAble form-group class.',
    },
    id: {
      control: { type: 'text' },
      description: 'Optional native div ID forwarded unchanged.',
    },
  },
  args: {
    children: defaultChildren,
  },
} satisfies Meta<typeof FormGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    children: defaultChildren,
  },
}

export const FormComposition: Story = {
  render: () => (
    <FormGroup>
      <label htmlFor="participant-email">Participant email</label>
      <Input
        id="participant-email"
        name="participantEmail"
        type="email"
        aria-describedby="participant-email-hint"
      />
      <p id="participant-email-hint">
        Use the address associated with the participant record.
      </p>
    </FormGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Participant email' })
    const hint = canvas.getByText(
      'Use the address associated with the participant record.',
    )
    const group = hint.parentElement

    await expect(group).toHaveClass('pathable-form-group')
    await expect(input).toHaveAttribute(
      'aria-describedby',
      'participant-email-hint',
    )
  },
}

export const ValidationComposition: Story = {
  render: () => (
    <FormGroup>
      <label htmlFor="invalid-email">Participant email</label>
      <Input
        id="invalid-email"
        name="participantEmail"
        type="email"
        defaultValue="not-an-email"
        aria-invalid="true"
        aria-describedby="invalid-email-error"
      />
      <p id="invalid-email-error" role="alert">
        Enter a valid email address.
      </p>
    </FormGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Participant email' })
    const error = canvas.getByRole('alert')

    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAttribute(
      'aria-describedby',
      'invalid-email-error',
    )
    await expect(error).toHaveTextContent('Enter a valid email address.')
  },
}

export const CustomAttributes: Story = {
  render: () => (
    <FormGroup
      id="participant-details"
      className="custom-form-group"
      data-testid="participant-details"
      title="Participant details"
    >
      <label htmlFor="custom-participant-name">Participant name</label>
      <Input id="custom-participant-name" name="participantName" />
    </FormGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const label = canvas.getByText('Participant name')
    const group = label.parentElement

    await expect(group).toHaveClass('pathable-form-group', 'custom-form-group')
    await expect(group).toHaveAttribute('id', 'participant-details')
    await expect(group).toHaveAttribute('data-testid', 'participant-details')
    await expect(group).toHaveAttribute('title', 'Participant details')
  },
}

export const EmptyContent: Story = {
  render: () => <FormGroup />,
}

export const LongContent: Story = {
  render: () => (
    <FormGroup>
      <label htmlFor="long-details">Participant employment details</label>
      <Input
        id="long-details"
        name="employmentDetails"
        aria-describedby="long-details-hint"
      />
      <p id="long-details-hint">
        Include the participant&apos;s employment goals, workplace support
        needs, communication preferences, and any other details that should be
        available during coaching follow-up.
      </p>
    </FormGroup>
  ),
}

export const Narrow: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <FormGroup>
      <label htmlFor="narrow-details">Workplace support details</label>
      <Input id="narrow-details" name="workplaceSupport" />
    </FormGroup>
  ),
}
