import { Select } from '../../../components/Select/Select'
import { Button } from '../../../components/Button/Button'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'

const options = (
  <>
    <option value="">Select a goal</option>
    <option value="job-search">Job search skills</option>
    <option value="interview">Interview preparation</option>
    <option value="workplace">Workplace communication</option>
    <option value="transportation">Transportation planning</option>
  </>
)

const meta = {
  title: 'Components/Form Controls/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A native single- or multiple-choice form control for selecting a value from a defined set of options. It wraps the native \`<select>\` element with the \`.pathable-select\` class.

**When to use**: When users need to choose one or more values from a known, bounded list. Provide a clear label and a meaningful default or prompt option.

**When not to use**: Do not use Select for a short list where visible options are easier to compare, or when users need to enter a value that is not in a predefined list. Consider a radio group or a text input instead.

**Underlying element**: Native \`<select>\`.

**Controlled/uncontrolled**: Select is a native form control. Consumers manage its value with standard \`value\`, \`defaultValue\`, and event-handler props.

**Accessibility**: Consumers must provide an accessible name through a visible associated label or an appropriate ARIA label. Use \`aria-describedby\` for hints or validation messages. The first option should provide useful guidance and should not silently submit as a real value when a choice is required.`,
      },
    },
  },
  argTypes: {
    children: {
      control: 'none',
      description:
        'Option elements that define the available values. Keep option labels concise and meaningful.',
    },
    multiple: {
      control: { type: 'boolean' },
      description:
        'Allows users to select more than one option. Provide instructions and use an appropriate size for multiple selections.',
    },
    size: {
      control: { type: 'number', min: 1 },
      description:
        'Number of visible options for a multiple select. Native single selects should generally omit this prop.',
    },
    disabled: {
      control: { type: 'boolean' },
      description:
        'Prevents interaction and form submission for this control. Explain the reason for disabling the field nearby.',
    },
    required: {
      control: { type: 'boolean' },
      description:
        'Marks the field as required for native form validation. The label should communicate the requirement as well.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble select class.',
    },
    defaultValue: {
      control: { type: 'text' },
      description:
        'Initial uncontrolled value. Use value and onChange when the application owns the value state.',
    },
  },
  args: {
    'aria-label': 'Employment goal',
    children: options,
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  render: () => (
    <label htmlFor="employment-goal">
      Employment goal
      <Select id="employment-goal" name="employmentGoal">
        {options}
      </Select>
    </label>
  ),
}

export const Multiple: Story = {
  render: () => (
    <label htmlFor="coaching-supports">
      Coaching supports addressed
      <Select
        id="coaching-supports"
        name="coachingSupports"
        multiple
        size={4}
        aria-describedby="coaching-supports-hint"
      >
        <option value="job-readiness">Job readiness practice</option>
        <option value="workplace">Workplace communication</option>
        <option value="employer">Employer follow-up</option>
        <option value="transportation">Transportation planning</option>
      </Select>
      <span id="coaching-supports-hint">
        Select all supports addressed in this session.
      </span>
    </label>
  ),
}

export const WithHint: Story = {
  render: () => (
    <div>
      <label htmlFor="participant-goal">Participant employment goal</label>
      <p id="participant-goal-hint">
        Select the primary employment goal for this session.
      </p>
      <Select
        id="participant-goal"
        name="participantGoal"
        aria-describedby="participant-goal-hint"
      >
        {options}
      </Select>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Archived employment goal',
    disabled: true,
    defaultValue: 'job-search',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox', {
      name: 'Archived employment goal',
    })

    await expect(select).toBeDisabled()
    await userEvent.tab()
    await expect(select).not.toHaveFocus()
  },
}

export const Required: Story = {
  args: {
    'aria-label': 'Required employment goal',
    required: true,
  },
}

export const CustomAttributes: Story = {
  args: {
    id: 'custom-select',
    name: 'customSelect',
    'aria-label': 'Custom select',
    'data-testid': 'custom-select',
    className: 'custom-select-class',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox', { name: 'Custom select' })

    await expect(select).toHaveClass('pathable-select', 'custom-select-class')
    await expect(select).toHaveAttribute('name', 'customSelect')
  },
}

export const KeyboardSelection: Story = {
  render: () => (
    <label htmlFor="keyboard-goal">
      Keyboard employment goal
      <Select id="keyboard-goal" name="keyboardGoal">
        {options}
      </Select>
    </label>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox', {
      name: 'Keyboard employment goal',
    })

    await userEvent.tab()
    await expect(select).toHaveFocus()
    await userEvent.selectOptions(select, 'interview')
    await expect(select).toHaveValue('interview')
  },
}

export const LongOptions: Story = {
  render: () => (
    <label htmlFor="long-options">
      Employment support pathway
      <Select id="long-options" name="supportPathway">
        <option value="">Select a support pathway</option>
        <option value="integrated-employment">
          Integrated employment coaching and employer partnership development
        </option>
        <option value="workplace-readiness">
          Workplace readiness, communication, and self-advocacy preparation
        </option>
        <option value="independent-living">
          Independent living skills and transportation planning coordination
        </option>
      </Select>
    </label>
  ),
}

export const Narrow: Story = {
  args: {
    'aria-label': 'Narrow layout employment goal',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/** FullWidth demonstrates the `width="full"` semantic sizing prop,
 *  which replaces manual `className="pathable-width-full"` usage.
 *  The class is applied to the root `<select>` element — no wrapper is introduced. */
export const FullWidth: Story = {
  args: {
    'aria-label': 'Full-width employment goal',
    width: 'full',
  },
}

export const FormComposition: Story = {
  render: () => (
    <form aria-label="Save employment goal">
      <label htmlFor="form-goal">Employment goal</label>
      <Select id="form-goal" name="formGoal" required>
        {options}
      </Select>
      <Button type="submit">Save goal</Button>
    </form>
  ),
}
