import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'

import { Button } from '../../../components/Button/Button'
import {
  ComboBox,
  type ComboBoxOption,
} from '../../../components/ComboBox/ComboBox'

const OPTIONS: readonly ComboBoxOption[] = [
  { value: 'job-search', label: 'Job search skills' },
  { value: 'interview', label: 'Interview preparation' },
  { value: 'workplace', label: 'Workplace communication' },
  { value: 'transportation', label: 'Transportation planning' },
]

const LONG_OPTIONS: readonly ComboBoxOption[] = [
  {
    value: 'integrated-employment',
    label:
      'Integrated employment coaching and employer partnership development',
  },
  {
    value: 'workplace-readiness',
    label: 'Workplace readiness, communication, and self-advocacy preparation',
  },
  {
    value: 'independent-living',
    label: 'Independent living skills and transportation planning coordination',
  },
]

const meta = {
  title: 'Components/Form Controls/ComboBox',
  component: ComboBox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A searchable single-choice form control that keeps a native select as its form-value source while presenting a keyboard-accessible combobox and listbox.

**When to use**: Use ComboBox when users need to choose one value from a longer, known list and filtering will make the choice faster. Provide a concise visible label and meaningful option labels.

**When not to use**: Do not use ComboBox for free-form values, multiple selections, or a short list that users should compare at a glance. Use Input, Select, Radio, or Checkbox as appropriate.

**Behavior**: The React wrapper owns filtering, list visibility, active-option state, keyboard navigation, selection, reset-on-blur, and status announcements. It does not require a separate \`@pathableai/styles/js\` import.

**Accessibility**: The visible input has the \`combobox\` role and controls a labelled \`listbox\`. Arrow keys move through options, Enter selects, Escape resets, and the native select retains the submitted value. Use \`inputProps.aria-describedby\` for hints or validation messages.`,
      },
    },
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Visible label for the combobox input.',
    },
    options: {
      control: { type: 'object' },
      description:
        'Available single-choice options. Empty values are reserved for the native placeholder option.',
    },
    selectProps: {
      control: { type: 'object' },
      description:
        'Native select attributes, including id, name, required, disabled, value, defaultValue, and onChange.',
    },
    inputProps: {
      control: { type: 'object' },
      description:
        'Attributes for the visible input, including placeholder and aria-describedby.',
    },
    disableFiltering: {
      control: { type: 'boolean' },
      description:
        'Shows all options while typing instead of filtering the option list.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional class names appended after the PathAble ComboBox classes.',
    },
  },
  args: {
    label: 'Employment goal',
    options: OPTIONS,
    selectProps: { id: 'employment-goal', name: 'employmentGoal' },
    inputProps: { placeholder: 'Search employment goals' },
  },
} satisfies Meta<typeof ComboBox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Employment goal' })
    const nativeSelect = canvasElement.querySelector('select')

    await expect(input).toHaveAttribute('aria-expanded', 'false')
    await expect(input).toHaveAttribute('aria-autocomplete', 'list')
    if (!nativeSelect) throw new Error('Expected the native select control')
    await expect(nativeSelect).toHaveClass('pathable-sr-only')
  },
}

export const Selected: Story = {
  args: {
    selectProps: {
      id: 'selected-goal',
      name: 'selectedGoal',
      defaultValue: 'interview',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('combobox', { name: 'Employment goal' }),
    ).toHaveValue('Interview preparation')
  },
}

export const Disabled: Story = {
  args: {
    selectProps: {
      id: 'archived-goal',
      name: 'archivedGoal',
      disabled: true,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Employment goal' })

    await expect(input).toBeDisabled()
    await userEvent.tab()
    await expect(input).not.toHaveFocus()
  },
}

export const Required: Story = {
  args: {
    selectProps: {
      id: 'required-goal',
      name: 'requiredGoal',
      required: true,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('combobox', { name: 'Employment goal' }),
    ).toBeRequired()
  },
}

export const KeyboardSelection: Story = {
  args: {
    selectProps: { id: 'keyboard-goal', name: 'keyboardGoal' },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Employment goal' })

    await step('focuses the input', async () => {
      await userEvent.tab()
      await expect(input).toHaveFocus()
    })

    await step('filters with typed text', async () => {
      await userEvent.type(input, 'inter')
      await expect(
        canvas.getByRole('option', { name: 'Interview preparation' }),
      ).toBeVisible()
    })

    await step('selects the active option with Enter', async () => {
      await userEvent.keyboard('{ArrowDown}{Enter}')
      await expect(input).toHaveValue('Interview preparation')
      await expect(input).toHaveAttribute('aria-expanded', 'false')
    })
  },
}

export const EscapeResets: Story = {
  args: {
    selectProps: {
      id: 'resettable-goal',
      name: 'resettableGoal',
      defaultValue: 'job-search',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Employment goal' })

    await userEvent.click(input)
    await userEvent.keyboard('{ControlOrMeta}A')
    await userEvent.type(input, 'unknown')
    await userEvent.keyboard('{Escape}')

    await expect(input).toHaveValue('Job search skills')
    await expect(input).toHaveAttribute('aria-expanded', 'false')
  },
}

export const NoResults: Story = {
  args: {
    selectProps: { id: 'no-results-goal', name: 'noResultsGoal' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Employment goal' })

    await userEvent.click(input)
    await userEvent.type(input, 'not a goal')

    await expect(canvas.getByText('No results found')).toBeVisible()
    await expect(canvas.getByRole('status')).toHaveTextContent('No results.')
  },
}

export const LongOptions: Story = {
  args: {
    label: 'Employment support pathway',
    options: LONG_OPTIONS,
    selectProps: { id: 'support-pathway', name: 'supportPathway' },
  },
}

export const Narrow: Story = {
  args: {
    label: 'Narrow layout employment goal',
    selectProps: { id: 'narrow-goal', name: 'narrowGoal' },
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const CustomAttributes: Story = {
  args: {
    className: 'custom-combo-box',
    'aria-describedby': 'combo-box-hint',
    'data-state': 'ready',
    inputProps: {
      'aria-describedby': 'combo-box-hint',
    },
    selectProps: { id: 'custom-goal', name: 'customGoal' },
  },
  render: (args) => (
    <div>
      <ComboBox {...args} />
      <p id="combo-box-hint">Choose the goal that best matches this visit.</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Employment goal' })
    const root = input.parentElement

    await expect(root).toHaveClass('pathable-combo-box', 'custom-combo-box')
    await expect(root).toHaveAttribute('data-state', 'ready')
    await expect(input).toHaveAttribute('aria-describedby', 'combo-box-hint')
  },
}

export const FormComposition: Story = {
  render: () => (
    <form aria-label="Save employment goal">
      <ComboBox
        label="Employment goal"
        options={OPTIONS}
        selectProps={{ id: 'form-goal', name: 'formGoal', required: true }}
      />
      <Button type="submit">Save goal</Button>
    </form>
  ),
}
