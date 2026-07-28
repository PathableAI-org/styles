import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
import { Radio } from '../../../components/Radio/Radio'

const meta = {
  title: 'Components/Form Controls/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A native radio control for selecting exactly one option from a related group. It owns the accessible label structure and maps the PathAble radio input, label, and optional description classes.

**When to use**: Use Radio when users must choose exactly one option from a small, visible set. Give every option in a group the same \`name\` and compose the group inside a fieldset with a legend.

**When not to use**: Do not use Radio when users may select multiple options; use Checkbox instead. Do not use it for a long list of choices better represented by a native select.

**Underlying element**: Native \`<input type="radio">\` nested inside a \`<label>\`. The wrapper does not manage selected state, validation, or form submission.

**Accessibility**: The required \`children\` prop supplies the visible accessible label. Use \`aria-describedby\` for external hints or validation messages. Native arrow-key navigation and Space selection remain browser-managed.

**Supported styling**: The wrapper exposes the default PathAble radio contract only. The source \`pathable-radio--tile\` story reference is not exposed because that modifier is not implemented by the owning stylesheet contract.`,
      },
    },
  },
  argTypes: {
    children: {
      control: { type: 'text' },
      description: 'Visible label text and accessible name for the radio.',
    },
    description: {
      control: { type: 'text' },
      description: 'Optional supporting text rendered inside the radio label.',
    },
    defaultChecked: {
      control: { type: 'boolean' },
      description:
        'Initial selected state for an uncontrolled radio. Use checked and onChange for controlled state.',
    },
    disabled: {
      control: { type: 'boolean' },
      description:
        'Prevents interaction and form submission. Explain the reason for disabling the choice nearby.',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Marks the radio as required for native form validation.',
    },
    name: {
      control: { type: 'text' },
      description:
        'Native group name. Radios with the same name form one mutually exclusive group.',
    },
    value: {
      control: { type: 'text' },
      description: 'Native value submitted when the radio is selected.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional class names appended to the root label after the PathAble radio class.',
    },
  },
  args: {
    children: 'Moderate progress',
    name: 'progress',
    value: 'moderate',
  },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  render: () => (
    <fieldset>
      <legend>Employment goal progress</legend>
      <Radio name="default-progress" value="significant">
        Significant progress
      </Radio>
      <Radio name="default-progress" value="moderate">
        Moderate progress
      </Radio>
      <Radio name="default-progress" value="none">
        No change
      </Radio>
    </fieldset>
  ),
}

export const Selected: Story = {
  args: {
    children: 'Moderate progress',
    defaultChecked: true,
    name: 'selected-progress',
    value: 'moderate',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Archived progress option',
    disabled: true,
    name: 'disabled-progress',
    value: 'archived',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio', {
      name: 'Archived progress option',
    })

    await expect(radio).toBeDisabled()
    await userEvent.tab()
    await expect(radio).not.toHaveFocus()
  },
}

export const WithDescription: Story = {
  render: () => (
    <Radio
      name="notification-frequency"
      value="weekly"
      description="A short summary is sent every Monday."
    >
      Weekly summary
    </Radio>
  ),
}

export const Invalid: Story = {
  render: () => (
    <div>
      <Radio
        name="employment-goal"
        value="job-search"
        required
        aria-invalid="true"
        aria-describedby="employment-goal-error"
      >
        Job search skills
      </Radio>
      <p id="employment-goal-error" role="alert">
        Select an employment goal before continuing.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio', { name: 'Job search skills' })

    await expect(radio).toHaveAttribute('aria-invalid', 'true')
    await expect(radio).toHaveAttribute(
      'aria-describedby',
      'employment-goal-error',
    )
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Select an employment goal before continuing.',
    )
  },
}

function ControlledRadioStory() {
  const [value, setValue] = useState('moderate')

  return (
    <fieldset>
      <legend>Controlled goal progress</legend>
      <Radio
        name="controlled-progress"
        value="significant"
        checked={value === 'significant'}
        onChange={(event) => setValue(event.target.value)}
      >
        Significant progress
      </Radio>
      <Radio
        name="controlled-progress"
        value="moderate"
        checked={value === 'moderate'}
        onChange={(event) => setValue(event.target.value)}
      >
        Moderate progress
      </Radio>
    </fieldset>
  )
}

export const Controlled: Story = {
  render: () => <ControlledRadioStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const significant = canvas.getByRole('radio', {
      name: 'Significant progress',
    })
    const moderate = canvas.getByRole('radio', { name: 'Moderate progress' })

    await expect(moderate).toBeChecked()
    await userEvent.click(significant)
    await expect(significant).toBeChecked()
    await expect(moderate).not.toBeChecked()
  },
}

export const KeyboardNavigation: Story = {
  render: () => (
    <fieldset>
      <legend>Keyboard goal progress</legend>
      <Radio name="keyboard-progress" value="significant" defaultChecked>
        Significant progress
      </Radio>
      <Radio name="keyboard-progress" value="moderate">
        Moderate progress
      </Radio>
      <Radio name="keyboard-progress" value="none">
        No change
      </Radio>
    </fieldset>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const significant = canvas.getByRole('radio', {
      name: 'Significant progress',
    })
    const moderate = canvas.getByRole('radio', { name: 'Moderate progress' })

    await userEvent.click(significant)
    await expect(significant).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(moderate).toBeChecked()
    await expect(moderate).toHaveFocus()
  },
}

export const LongContent: Story = {
  render: () => (
    <Radio
      name="long-pathway"
      value="integrated"
      description="This description explains how the selection affects the participant's coaching plan and can wrap across multiple lines without changing native radio behavior."
    >
      Integrated employment coaching, employer partnership planning, and
      workplace communication preparation
    </Radio>
  ),
}

export const Narrow: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <Radio name="narrow-pathway" value="transportation">
      Transportation planning and workplace readiness coordination
    </Radio>
  ),
}

export const FieldsetComposition: Story = {
  render: () => (
    <fieldset>
      <legend>Employment goal progress</legend>
      <p id="progress-hint">
        Select the option that best describes progress since the last session.
      </p>
      <Radio
        name="field-progress"
        value="significant"
        aria-describedby="progress-hint"
      >
        Significant progress
      </Radio>
      <Radio
        name="field-progress"
        value="moderate"
        aria-describedby="progress-hint"
        defaultChecked
      >
        Moderate progress
      </Radio>
      <Radio
        name="field-progress"
        value="none"
        aria-describedby="progress-hint"
      >
        No change
      </Radio>
    </fieldset>
  ),
}
