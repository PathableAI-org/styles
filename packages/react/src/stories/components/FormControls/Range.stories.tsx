import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button } from '../../../components/Button/Button'
import { FormGroup } from '../../../components/FormGroup/FormGroup'
import { Hint } from '../../../components/Hint/Hint'
import { Label } from '../../../components/Label/Label'
import { Range } from '../../../components/Range/Range'

const meta = {
  title: 'Components/Form Controls/Range',
  component: Range,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A native numeric slider for choosing one value from a bounded interval. Range wraps \`<input type="range">\` with the \`.pathable-range\` class and forwards supported native input attributes.

**When to use**: Use Range when an approximate numeric choice within known minimum and maximum values is more useful than entering an exact number, such as session duration, volume, or intensity.

**When not to use**: Do not use Range when users must enter or compare an exact value, when the valid interval is unknown, or for choosing a date interval. Use a number input, Select, or DateRangePicker instead.

**Underlying element**: Native \`<input type="range">\`. The \`type\` is fixed and cannot be overridden.

**Controlled/uncontrolled**: Use \`value\` with \`onChange\` for controlled state or \`defaultValue\` for an uncontrolled slider. The browser owns clamping, stepping, keyboard interaction, validation, and form submission.

**Accessibility**: Provide a visible associated label whenever possible. Communicate the current value visually when the slider's numeric value is not self-explanatory, and use \`aria-valuetext\` when assistive technology needs a human-readable value such as "45 minutes."`,
      },
    },
  },
  argTypes: {
    min: {
      control: { type: 'number' },
      description:
        'Inclusive native lower bound. Choose a meaningful value and keep it consistent with max and step.',
    },
    max: {
      control: { type: 'number' },
      description:
        'Inclusive native upper bound. Use a bounded interval users can understand.',
    },
    step: {
      control: { type: 'text' },
      description:
        'Native increment between valid values. Use a positive number for discrete values or "any" for continuous values.',
    },
    defaultValue: {
      control: { type: 'number' },
      description:
        'Initial uncontrolled value. Use value and onChange when the application owns the current value.',
    },
    value: {
      control: { type: 'number' },
      description:
        'Consumer-controlled current value. Pair with onChange to update application state.',
    },
    disabled: {
      control: { type: 'boolean' },
      description:
        'Prevents pointer and keyboard interaction and excludes the control from form submission.',
    },
    name: {
      control: { type: 'text' },
      description: 'Native form field name used when the slider is submitted.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble range class.',
    },
    'aria-label': {
      control: { type: 'text' },
      description:
        'Accessible name when no visible associated label is available. Prefer a visible Label for normal forms.',
    },
    'aria-valuetext': {
      control: { type: 'text' },
      description:
        'Human-readable current value when the numeric value alone does not communicate its meaning.',
    },
  },
  args: {
    min: 15,
    max: 120,
    step: 15,
    defaultValue: 60,
    disabled: false,
    name: 'sessionDuration',
    'aria-label': 'Session duration in minutes',
    onChange: fn(),
  },
} satisfies Meta<typeof Range>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  render: (args) => (
    <div>
      <Label htmlFor="default-session-duration">
        Session duration in minutes
      </Label>
      <Range {...args} id="default-session-duration" aria-label={undefined} />
    </div>
  ),
}

export const BoundsAndStep: Story = {
  render: () => (
    <div>
      <Label htmlFor="support-intensity">Support intensity</Label>
      <Hint id="support-intensity-hint">
        Choose a level from 1 (light) to 5 (intensive).
      </Hint>
      <Range
        id="support-intensity"
        name="supportIntensity"
        min={1}
        max={5}
        step={1}
        defaultValue={3}
        aria-describedby="support-intensity-hint"
      />
    </div>
  ),
}

export const Continuous: Story = {
  render: () => (
    <div>
      <Label htmlFor="continuous-volume">Playback volume</Label>
      <Range
        id="continuous-volume"
        name="volume"
        min={0}
        max={1}
        step="any"
        defaultValue={0.5}
      />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Archived session duration',
    defaultValue: 45,
    disabled: true,
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)
    const slider = canvas.getByRole('slider', {
      name: 'Archived session duration',
    })

    await step('exposes the native disabled state', async () => {
      await expect(slider).toBeDisabled()
      await expect(slider).toHaveValue('45')
    })

    await step('does not receive focus or change', async () => {
      await userEvent.click(slider)
      await userEvent.tab()
      await userEvent.keyboard('{ArrowRight}')
      await expect(slider).not.toHaveFocus()
      await expect(slider).toHaveValue('45')
      await expect(args.onChange).not.toHaveBeenCalled()
    })
  },
}

export const CustomAttributes: Story = {
  args: {
    id: 'custom-range',
    name: 'customRange',
    min: 0,
    max: 10,
    step: 2,
    defaultValue: 4,
    'aria-label': 'Custom range',
    'data-field-kind': 'range',
    className: 'custom-range-class',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const slider = canvas.getByRole('slider', { name: 'Custom range' })

    await expect(slider).toHaveAttribute('type', 'range')
    await expect(slider).toHaveClass('pathable-range', 'custom-range-class')
    await expect(slider).toHaveAttribute('id', 'custom-range')
    await expect(slider).toHaveAttribute('name', 'customRange')
    await expect(slider).toHaveAttribute('min', '0')
    await expect(slider).toHaveAttribute('max', '10')
    await expect(slider).toHaveAttribute('step', '2')
    await expect(slider).toHaveAttribute('data-field-kind', 'range')
  },
}

export const PointerFocus: Story = {
  args: {
    'aria-label': 'Pointer-adjusted duration',
    defaultValue: 60,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const slider = canvas.getByRole('slider', {
      name: 'Pointer-adjusted duration',
    })

    await userEvent.click(slider)
    await expect(slider).toHaveFocus()
  },
}

export const KeyboardInteraction: Story = {
  args: {
    min: 0,
    max: 100,
    step: 10,
    defaultValue: 50,
    'aria-label': 'Keyboard-adjusted percentage',
    onChange: fn(),
    onKeyDown: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)
    const slider = canvas.getByRole('slider', {
      name: 'Keyboard-adjusted percentage',
    })

    await step('receives keyboard focus', async () => {
      await userEvent.tab()
      await expect(slider).toHaveFocus()
    })

    await step('forwards native slider key events', async () => {
      await userEvent.keyboard('{ArrowRight}')
      await userEvent.keyboard('{ArrowLeft}')
      await expect(args.onKeyDown).toHaveBeenCalledTimes(2)
      await expect(slider).toHaveValue('50')
    })
  },
}

function ControlledRangeStory() {
  const [value, setValue] = useState(3)

  return (
    <div>
      <Label htmlFor="controlled-range">Support intensity</Label>
      <Range
        id="controlled-range"
        name="supportIntensity"
        min={1}
        max={5}
        value={value}
        onChange={(event) => setValue(event.currentTarget.valueAsNumber)}
        aria-valuetext={`${value} of 5`}
      />
      <output id="controlled-range-value" htmlFor="controlled-range">
        {value} of 5
      </output>
      <Button
        type="button"
        onClick={() => setValue((current) => Math.min(current + 1, 5))}
      >
        Increase intensity
      </Button>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledRangeStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const slider = canvas.getByRole('slider', { name: 'Support intensity' })

    await userEvent.click(
      canvas.getByRole('button', { name: 'Increase intensity' }),
    )
    await expect(slider).toHaveValue('4')
    await expect(canvas.getByText('4 of 5')).toBeVisible()
  },
}

export const Narrow: Story = {
  render: () => (
    <div>
      <Label htmlFor="narrow-range">Preferred weekly support hours</Label>
      <Range
        id="narrow-range"
        name="weeklySupportHours"
        min={1}
        max={40}
        defaultValue={10}
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

function PreferencesForm() {
  const [duration, setDuration] = useState(45)

  return (
    <form
      aria-label="Session preferences"
      onSubmit={(event) => event.preventDefault()}
    >
      <FormGroup>
        <Label htmlFor="session-duration">Session duration</Label>
        <Hint id="session-duration-hint">
          Choose a duration from 15 to 120 minutes.
        </Hint>
        <Range
          id="session-duration"
          name="sessionDuration"
          min={15}
          max={120}
          step={15}
          value={duration}
          onChange={(event) => setDuration(event.currentTarget.valueAsNumber)}
          aria-describedby="session-duration-hint"
          aria-valuetext={`${duration} minutes`}
        />
        <output id="session-duration-value" htmlFor="session-duration">
          {duration} minutes
        </output>
      </FormGroup>
      <Button type="submit">Save preferences</Button>
    </form>
  )
}

export const FormComposition: Story = {
  render: () => <PreferencesForm />,
}
