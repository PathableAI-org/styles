import { Input } from '../../../components/Input/Input'
import { Label } from '../../../components/Label/Label'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'

const meta = {
  title: 'Components/Form Controls/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `An accessible form label that associates visible text with a native form control. It wraps a native \`<label>\` element with the \`.pathable-label\` class and forwards standard label attributes.

**When to use**: Use Label to provide a visible accessible name for an associated form control. Set \`htmlFor\` to the control's \`id\`, or place the control inside the label.

**When not to use**: Do not use Label as a heading, helper text, validation message, or action control. Use the appropriate semantic element or PathAble wrapper for those purposes.

**Underlying element**: Native \`<label>\`. The wrapper does not create or manage the associated form control.

**Accessibility**: Every form control should have an accessible name. Prefer a visible Label with a matching \`htmlFor\` and control \`id\`; use \`aria-describedby\` for supporting hints or validation messages rather than putting all instructions in the label.`,
      },
    },
  },
  argTypes: {
    children: {
      control: { type: 'text' },
      description:
        'Visible text or inline content naming the associated control.',
    },
    htmlFor: {
      control: { type: 'text' },
      description: 'The id of the associated form control.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble label class.',
    },
  },
  args: {
    children: 'Participant name',
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  render: () => (
    <div>
      <Label htmlFor="email-address">Email address</Label>
      <Input id="email-address" name="email" type="email" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email address' })
    const label = canvas.getByText('Email address')

    await expect(label).toHaveClass('pathable-label')
    await expect(label).toHaveAttribute('for', 'email-address')
    await expect(input).toHaveAttribute('id', 'email-address')
  },
}

export const FormComposition: Story = {
  render: () => (
    <form aria-label="Participant details">
      <Label htmlFor="participant-name">Participant name</Label>
      <Input id="participant-name" name="participantName" type="text" />
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Participant name' })
    const label = canvas.getByText('Participant name')

    await expect(input).toHaveAttribute('id', 'participant-name')
    await expect(label).toHaveAttribute('for', 'participant-name')
  },
}

export const RichContent: Story = {
  render: () => (
    <Label>
      Session <strong>date</strong>
    </Label>
  ),
}

export const CustomAttributes: Story = {
  render: () => (
    <Label
      id="custom-field-label"
      className="custom-label"
      data-testid="custom-label"
    >
      Custom field
    </Label>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const label = canvas.getByText('Custom field')

    await expect(label).toHaveClass('pathable-label', 'custom-label')
    await expect(label).toHaveAttribute('id', 'custom-field-label')
    await expect(label).toHaveAttribute('data-testid', 'custom-label')
  },
}

export const EmptyContent: Story = {
  render: () => <Label />,
}

export const LongContent: Story = {
  args: {
    children:
      'Participant employment goal and preferred coaching pathway for the next session',
  },
}

export const Narrow: Story = {
  args: {
    children: 'Preferred communication method',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
