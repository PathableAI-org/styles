import { Input } from '../../../components/Input/Input'
import { Hint } from '../../../components/Hint/Hint'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'

const meta = {
  title: 'Components/Form Controls/Hint',
  component: Hint,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Supplemental form guidance for explaining expected input, format, or context. It wraps a native \`<span>\` with the \`.pathable-hint\` class and forwards standard span attributes.

**When to use**: Use Hint for concise instructions that help someone complete a form control. Give it an \`id\` and connect the control with \`aria-describedby\` when the guidance describes that control.

**When not to use**: Do not use Hint for validation errors, urgent announcements, or general status messages. Use ErrorMessage or the appropriate feedback pattern instead.

**Underlying element**: Native \`<span>\`. The wrapper does not manage form state, validation, or live-region announcements.

**Accessibility**: Keep guidance specific and concise. Associate it with the related control through \`aria-describedby\`; do not rely on visual placement alone to establish the relationship.`,
      },
    },
  },
  argTypes: {
    children: {
      control: { type: 'text' },
      description:
        'Supplemental guidance for completing the associated control.',
    },
    id: {
      control: { type: 'text' },
      description:
        'Stable identifier referenced by a control through aria-describedby.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble hint class.',
    },
  },
  args: {
    children: 'Use the format shown in the example.',
  },
} satisfies Meta<typeof Hint>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    children: 'Select the primary employment goal for this session.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const hint = canvas.getByText(
      'Select the primary employment goal for this session.',
    )

    await expect(hint).toHaveClass('pathable-hint')
  },
}

export const FormComposition: Story = {
  render: () => (
    <div>
      <label htmlFor="participant-goal">Participant employment goal</label>
      <Hint id="participant-goal-hint">
        Select the primary employment goal for this session.
      </Hint>
      <Input
        id="participant-goal"
        name="participantGoal"
        aria-describedby="participant-goal-hint"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', {
      name: 'Participant employment goal',
    })
    const hint = canvas.getByText(
      'Select the primary employment goal for this session.',
    )

    await expect(input).toHaveAttribute(
      'aria-describedby',
      'participant-goal-hint',
    )
    await expect(hint).toHaveAttribute('id', 'participant-goal-hint')
    await expect(hint).toHaveClass('pathable-hint')
  },
}

export const RichContent: Story = {
  render: () => (
    <Hint>
      Include the <strong>primary</strong> goal and the expected completion
      date.
    </Hint>
  ),
}

export const CustomAttributes: Story = {
  render: () => (
    <Hint id="custom-hint" className="custom-hint" data-testid="custom-hint">
      Provide the context needed to complete this field.
    </Hint>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const hint = canvas.getByText(
      'Provide the context needed to complete this field.',
    )

    await expect(hint).toHaveClass('pathable-hint', 'custom-hint')
    await expect(hint).toHaveAttribute('id', 'custom-hint')
    await expect(hint).toHaveAttribute('data-testid', 'custom-hint')
  },
}

export const EmptyContent: Story = {
  render: () => <Hint />,
}

export const LongContent: Story = {
  args: {
    children:
      'Enter the participant funding authorization number exactly as it appears on the eligibility record, including all letters, numbers, and punctuation.',
  },
}

export const Narrow: Story = {
  args: {
    children: 'Use the participant identifier format ABC-123.',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
