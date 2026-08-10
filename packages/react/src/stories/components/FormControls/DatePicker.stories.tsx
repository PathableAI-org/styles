import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { useState } from 'react'

import { Button } from '../../../components/Button/Button'
import {
  DatePicker,
  type DatePickerProps,
} from '../../../components/DatePicker/DatePicker'

const DEFAULT_ARGS: DatePickerProps = {
  label: 'Appointment date',
  defaultDate: '2026-03-10',
  minDate: '2026-03-01',
  maxDate: '2026-03-31',
  defaultMonth: '2026-03-01',
  inputProps: { id: 'appointment-date', name: 'appointmentDate' },
}

const meta = {
  title: 'Components/Form Controls/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A single-date form control with a labelled text input, an accessible calendar, and an ISO form value.

**When to use**: Use DatePicker when users need to choose one specific date and calendar context helps them make the choice. Provide a concise label and describe any important date limits.

**When not to use**: Do not use DatePicker for a date range, time selection, or an approximate free-form date. Use DateRangePicker, a time input, or a text input instead.

**Underlying elements**: A labelled visible text input, a hidden ISO value input, and a calendar dialog composed from native buttons and table markup.

**Behavior**: React owns text validation, calendar views, date constraints, keyboard navigation, focus restoration, and status messaging. The visible format is \`MM/DD/YYYY\` and the submitted value is ISO \`YYYY-MM-DD\`. A separate \`@pathable/styles/js\` import is not required.`,
      },
    },
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Visible accessible label for the date field.',
    },
    inputProps: {
      control: { type: 'object' },
      description:
        'Native attributes for the visible input and hidden ISO form value.',
    },
    date: {
      control: { type: 'text' },
      description: 'Controlled ISO date, such as 2026-03-10.',
    },
    defaultDate: {
      control: { type: 'text' },
      description: 'Initial uncontrolled ISO date.',
    },
    minDate: {
      control: { type: 'text' },
      description: 'Inclusive ISO lower bound for selectable dates.',
    },
    maxDate: {
      control: { type: 'text' },
      description: 'Inclusive ISO upper bound for selectable dates.',
    },
    defaultMonth: {
      control: { type: 'text' },
      description:
        'Initial ISO month/date used when no selected date is available.',
    },
    onDateChange: {
      action: 'dateChange',
      description: 'Called with the committed ISO date.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional root class names appended after the PathAble classes.',
    },
  },
  args: DEFAULT_ARGS,
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Appointment date' })
    const toggle = canvas.getByRole('button', {
      name: 'Toggle date calendar',
    })
    const root = input.closest('.pathable-date-picker')
    const hiddenInput = canvasElement.querySelector(
      'input[name="appointmentDate"][type="hidden"]',
    )

    await expect(input).toHaveValue('03/10/2026')
    await expect(hiddenInput).toHaveValue('2026-03-10')
    await expect(root).toHaveAttribute('data-react-owned', 'true')
    await expect(root).toHaveClass('pathable-date-picker--initialized')
    await expect(toggle).toHaveAttribute(
      'aria-controls',
      'appointment-date-calendar',
    )
    await expect(input).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(input).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.getAllByRole('combobox')).toHaveLength(1)
  },
}

export const Empty: Story = {
  args: { defaultDate: '' },
}

export const Disabled: Story = {
  args: {
    inputProps: {
      id: 'disabled-date',
      name: 'disabledDate',
      disabled: true,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Appointment date' })
    const toggle = canvas.getByRole('button', {
      name: 'Toggle date calendar',
    })

    await expect(input).toBeDisabled()
    await expect(toggle).toBeDisabled()
    await expect(
      canvasElement.querySelector('input[name="disabledDate"]'),
    ).toBeDisabled()
    await userEvent.click(toggle)
    await expect(
      canvas.queryByRole('dialog', { name: 'Date calendar' }),
    ).not.toBeInTheDocument()
  },
}

export const Required: Story = {
  args: {
    inputProps: {
      id: 'required-date',
      name: 'requiredDate',
      required: true,
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', {
        name: 'Appointment date',
      }),
    ).toBeRequired()
  },
}

export const ReadOnly: Story = {
  args: {
    inputProps: {
      id: 'readonly-date',
      name: 'readonlyDate',
      readOnly: true,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Appointment date' })
    const toggle = canvas.getByRole('button', {
      name: 'Toggle date calendar',
    })

    await expect(input).toHaveAttribute('readonly')
    await expect(toggle).toBeDisabled()
    await userEvent.click(input)
    await expect(
      canvas.queryByRole('dialog', { name: 'Date calendar' }),
    ).not.toBeInTheDocument()
  },
}

export const CalendarSelection: Story = {
  args: { onDateChange: fn() },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Appointment date' })

    await step('opens the calendar from the input', async () => {
      await userEvent.click(input)
      await expect(
        canvas.getByRole('dialog', { name: 'Date calendar' }),
      ).toBeVisible()
      await expect(
        canvas.getByRole('combobox', { name: 'Appointment date' }),
      ).toHaveAttribute('aria-expanded', 'true')
    })

    await step('selects and submits a new date', async () => {
      await userEvent.click(
        canvas.getByRole('button', { name: 'Thursday, March 12, 2026' }),
      )
      await expect(input).toHaveValue('03/12/2026')
      await expect(input).toHaveFocus()
      await expect(args.onDateChange).toHaveBeenCalledOnce()
      await expect(args.onDateChange).toHaveBeenCalledWith('2026-03-12')
      await expect(
        canvasElement.querySelector('input[name="appointmentDate"]'),
      ).toHaveValue('2026-03-12')
    })
  },
}

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Appointment date' })
    const toggle = canvas.getByRole('button', {
      name: 'Toggle date calendar',
    })

    await step(
      'opens from the keyboard and focuses the selected date',
      async () => {
        input.focus()
        await userEvent.tab()
        await expect(toggle).toHaveFocus()
        await userEvent.keyboard('{Enter}')
        await expect(
          canvas.getByRole('button', { name: 'Tuesday, March 10, 2026' }),
        ).toHaveFocus()
      },
    )

    await step('moves and selects with the keyboard', async () => {
      await userEvent.keyboard('{ArrowRight}{Enter}')
      await expect(input).toHaveValue('03/11/2026')
      await expect(input).toHaveFocus()
      await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })
  },
}

export const MinMaxConstraints: Story = {
  args: {
    minDate: '2026-03-10',
    maxDate: '2026-03-18',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle date calendar' }),
    )

    await expect(
      canvas.getByRole('button', { name: 'Monday, March 9, 2026' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Wednesday, March 18, 2026' }),
    ).not.toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Thursday, March 19, 2026' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Navigate back one month' }),
    ).toBeDisabled()
  },
}

export const InvalidText: Story = {
  args: { defaultDate: '', onDateChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Appointment date' })

    await userEvent.click(input)
    await userEvent.type(input, '02/30/2026')
    await userEvent.keyboard('{Enter}')

    await expect(input).toHaveValue('02/30/2026')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toBeInvalid()
    await expect(canvas.getByText('Please enter a valid date')).toBeVisible()
    await expect(args.onDateChange).not.toHaveBeenCalled()
  },
}

export const OutOfBoundsText: Story = {
  args: { defaultDate: '', onDateChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Appointment date' })

    await userEvent.click(input)
    await userEvent.type(input, '02/28/2026')
    await userEvent.keyboard('{Enter}')

    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toBeInvalid()
    await expect(args.onDateChange).not.toHaveBeenCalled()
  },
}

export const OutOfBoundsValue: Story = {
  args: {
    defaultDate: '2026-02-28',
    inputProps: {
      id: 'out-of-bounds-date',
      name: 'outOfBoundsDate',
    },
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', {
      name: 'Appointment date',
    })
    const hiddenInput = canvasElement.querySelector(
      'input[name="outOfBoundsDate"]',
    )

    await expect(input).toHaveValue('02/28/2026')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toBeInvalid()
    await expect(hiddenInput).toHaveValue('')
    await userEvent.type(input, '{Enter}')
    await expect(input).toBeInvalid()
  },
}

export const Clearing: Story = {
  args: { onDateChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Appointment date' })

    await userEvent.click(input)
    await userEvent.clear(input)
    await userEvent.keyboard('{Enter}')

    await expect(input).toHaveValue('')
    await expect(args.onDateChange).toHaveBeenCalledWith('')
    await expect(
      canvasElement.querySelector('input[name="appointmentDate"]'),
    ).toHaveValue('')
  },
}

export const PageNavigation: Story = {
  args: {
    minDate: '2025-01-01',
    maxDate: '2027-12-31',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle date calendar' }),
    )
    await userEvent.keyboard('{PageUp}')
    await expect(
      canvas.getByRole('button', { name: 'Tuesday, February 10, 2026' }),
    ).toHaveFocus()

    await userEvent.keyboard('{Shift>}{PageDown}{/Shift}')
    await expect(
      canvas.getByRole('button', { name: 'Wednesday, February 10, 2027' }),
    ).toHaveFocus()
  },
}

export const CalendarViews: Story = {
  args: {
    defaultDate: '',
    minDate: '2026-01-01',
    maxDate: '2027-12-31',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle date calendar' }),
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'March. Select month' }),
    )
    await expect(
      canvas.getByRole('button', { name: 'March', exact: true }),
    ).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}{Enter}')
    await expect(
      canvas.getByRole('button', { name: 'February. Select month' }),
    ).toBeVisible()

    await userEvent.click(
      canvas.getByRole('button', { name: '2026. Select year' }),
    )
    await userEvent.click(canvas.getByRole('button', { name: '2027' }))
    await expect(
      canvas.getByRole('button', { name: '2027. Select year' }),
    ).toBeVisible()
  },
}

export const EscapeRestoresValueAndFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Appointment date' })
    const toggle = canvas.getByRole('button', {
      name: 'Toggle date calendar',
    })

    await userEvent.click(input)
    await userEvent.clear(input)
    await userEvent.type(input, '03/20/2026')
    await userEvent.keyboard('{Escape}')
    await expect(input).toHaveValue('03/10/2026')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(toggle)
    const monthSelection = canvas.getByRole('button', {
      name: 'March. Select month',
    })
    monthSelection.focus()
    await expect(monthSelection).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await expect(input).toHaveFocus()
  },
}

export const Controlled: Story = {
  args: { onDateChange: fn() },
  render: (args) => {
    const [date, setDate] = useState('2026-03-10')

    return (
      <div>
        <DatePicker
          {...args}
          date={date}
          onDateChange={(value) => {
            args.onDateChange?.(value)
            setDate(value)
          }}
        />
        <p>Selected date: {date}</p>
      </div>
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Appointment date' })

    await userEvent.click(input)
    await userEvent.clear(input)
    await userEvent.type(input, '03/15/2026')
    await userEvent.keyboard('{Enter}')

    await expect(canvas.getByText('Selected date: 2026-03-15')).toBeVisible()
    await expect(args.onDateChange).toHaveBeenCalledWith('2026-03-15')
  },
}

export const ControlledPropSync: Story = {
  render: () => {
    const [date, setDate] = useState('2026-03-10')

    return (
      <div>
        <DatePicker
          label="Appointment date"
          date={date}
          defaultMonth="2026-03-01"
          inputProps={{ id: 'synced-date', name: 'syncedDate' }}
        />
        <button type="button" onClick={() => setDate('2026-04-20')}>
          Update date
        </button>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Appointment date' })

    await userEvent.click(canvas.getByRole('button', { name: 'Update date' }))
    await expect(input).toHaveValue('04/20/2026')
    await expect(
      canvasElement.querySelector('input[name="syncedDate"]'),
    ).toHaveValue('2026-04-20')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle date calendar' }),
    )
    await expect(
      canvas.getByRole('button', { name: /April 20, 2026$/ }),
    ).toHaveFocus()
  },
}

export const LongLabel: Story = {
  args: {
    label:
      'Appointment date for the annual employment coaching and support plan review',
  },
}

export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

export const VeryNarrowOpenCalendar: Story = {
  render: (args) => (
    <div style={{ width: 280 }}>
      <DatePicker {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle date calendar' }),
    )
    await expect(
      canvas.getByRole('dialog', { name: 'Date calendar' }),
    ).toBeVisible()
  },
}

export const CustomAttributes: Story = {
  args: {
    className: 'custom-date-picker',
    'data-state': 'scheduled',
    inputProps: {
      id: 'custom-date',
      name: 'customDate',
      className: 'custom-date-input',
      'aria-describedby': 'date-hint',
    },
  },
  render: (args) => (
    <div>
      <DatePicker {...args} />
      <p id="date-hint">Choose a weekday in March.</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', {
      name: 'Appointment date',
    })
    const root = input.closest('.pathable-date-picker')

    await expect(root).toHaveClass('custom-date-picker')
    await expect(root).toHaveAttribute('data-state', 'scheduled')
    await expect(input).toHaveClass('custom-date-input')
    await expect(input).toHaveAttribute('aria-describedby', 'date-hint')
  },
}

export const FormComposition: Story = {
  render: () => {
    const [submittedDate, setSubmittedDate] = useState('')

    return (
      <form
        aria-label="Schedule coaching appointment"
        onSubmit={(event) => {
          event.preventDefault()
          setSubmittedDate(
            String(new FormData(event.currentTarget).get('coachingDate') ?? ''),
          )
        }}
      >
        <p id="scheduling-hint">Appointments are available during March.</p>
        <DatePicker
          label="Coaching appointment"
          defaultDate="2026-03-10"
          minDate="2026-03-01"
          maxDate="2026-03-31"
          defaultMonth="2026-03-01"
          inputProps={{
            id: 'coaching-date',
            name: 'coachingDate',
            required: true,
            'aria-describedby': 'scheduling-hint',
          }}
        />
        <Button type="submit">Schedule appointment</Button>
        <p>Submitted date: {submittedDate || 'not submitted'}</p>
      </form>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', {
      name: 'Coaching appointment',
    })
    const submit = canvas.getByRole('button', {
      name: 'Schedule appointment',
    })

    await expect(input.checkValidity()).toBe(true)
    await userEvent.click(submit)
    await expect(canvas.getByText('Submitted date: 2026-03-10')).toBeVisible()
  },
}
