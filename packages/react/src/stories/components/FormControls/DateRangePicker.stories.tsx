import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'

import { Button } from '../../../components/Button/Button'
import {
  DateRangePicker,
  type DateRangePickerProps,
} from '../../../components/DateRangePicker/DateRangePicker'

const DEFAULT_ARGS: DateRangePickerProps = {
  startLabel: 'Start date',
  endLabel: 'End date',
  defaultStartDate: '2026-03-10',
  defaultEndDate: '2026-03-18',
  minDate: '2026-03-01',
  maxDate: '2026-03-31',
  defaultMonth: '2026-03-01',
  startInputProps: { id: 'start-date', name: 'startDate' },
  endInputProps: { id: 'end-date', name: 'endDate' },
}

const meta = {
  title: 'Components/Form Controls/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A two-field date range control with React-owned calendars, ISO form values, and range-aware date constraints.

**When to use**: Use DateRangePicker when users need to choose a bounded start and end date for a reporting period, booking window, or other time range. Provide clear labels and explain the expected date format.

**When not to use**: Do not use DateRangePicker for a single date, a time-only value, or an unbounded free-form date description. Use DatePicker, a time input, or a text input instead.

**Underlying elements**: Two labelled visible text inputs, two hidden ISO value inputs, and an accessible calendar application rendered with native buttons and table markup.

**Behavior**: React owns the calendar state, range validation, keyboard navigation, focus restoration, and status messaging. A separate \`@pathable/styles/js\` import is not required.`,
      },
    },
  },
  argTypes: {
    startLabel: {
      control: { type: 'text' },
      description: 'Visible accessible label for the start-date field.',
    },
    endLabel: {
      control: { type: 'text' },
      description: 'Visible accessible label for the end-date field.',
    },
    startDate: {
      control: { type: 'text' },
      description:
        'Controlled ISO start date. Use with endDate and onRangeChange.',
    },
    endDate: {
      control: { type: 'text' },
      description:
        'Controlled ISO end date. Use with startDate and onRangeChange.',
    },
    defaultStartDate: {
      control: { type: 'text' },
      description: 'Initial uncontrolled ISO start date.',
    },
    defaultEndDate: {
      control: { type: 'text' },
      description: 'Initial uncontrolled ISO end date.',
    },
    minDate: {
      control: { type: 'text' },
      description: 'Inclusive ISO lower bound applied to both dates.',
    },
    maxDate: {
      control: { type: 'text' },
      description: 'Inclusive ISO upper bound applied to both dates.',
    },
    defaultMonth: {
      control: { type: 'text' },
      description:
        'Initial ISO month/date used when no selected date is available.',
    },
    startInputProps: {
      control: { type: 'object' },
      description:
        'Native attributes for the start-date input and hidden form value.',
    },
    endInputProps: {
      control: { type: 'object' },
      description:
        'Native attributes for the end-date input and hidden form value.',
    },
    onRangeChange: {
      action: 'rangeChange',
      description: 'Called with the selected ISO start and end values.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional root class names appended after the PathAble classes.',
    },
  },
  args: DEFAULT_ARGS,
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Start date' }),
    ).toHaveValue('03/10/2026')
    await expect(canvas.getByRole('textbox', { name: 'End date' })).toHaveValue(
      '03/18/2026',
    )
  },
}

export const Empty: Story = {
  args: { defaultStartDate: '', defaultEndDate: '' },
}

export const Disabled: Story = {
  args: {
    startInputProps: {
      id: 'disabled-start',
      name: 'disabledStart',
      disabled: true,
    },
    endInputProps: { id: 'disabled-end', name: 'disabledEnd', disabled: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Start date' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('textbox', { name: 'End date' }),
    ).toBeDisabled()
    for (const input of canvasElement.querySelectorAll(
      'input[type="hidden"]',
    )) {
      await expect(input).toBeDisabled()
    }
  },
}

export const Required: Story = {
  args: {
    startInputProps: {
      id: 'required-start',
      name: 'requiredStart',
      required: true,
    },
    endInputProps: { id: 'required-end', name: 'requiredEnd', required: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Start date' }),
    ).toBeRequired()
    await expect(
      canvas.getByRole('textbox', { name: 'End date' }),
    ).toBeRequired()
  },
}

export const CalendarSelection: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('textbox', { name: 'Start date' })

    await step('opens the start calendar', async () => {
      await userEvent.click(start)
      await expect(
        canvas.getByRole('application', { name: 'Start date calendar' }),
      ).toBeVisible()
    })

    await step('selects a new start date', async () => {
      await userEvent.click(
        canvas.getByRole('button', { name: 'March 12, 2026' }),
      )
      await expect(start).toHaveValue('03/12/2026')
      await expect(start).toHaveFocus()
    })
  },
}

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('textbox', { name: 'Start date' })

    await userEvent.click(start)
    await expect(
      canvas.getByRole('button', { name: 'Tuesday, March 10, 2026' }),
    ).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}{Enter}')

    await expect(start).toHaveValue('03/11/2026')
  },
}

export const RangeConstraints: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const end = canvas.getByRole('textbox', { name: 'End date' })

    await userEvent.click(end)
    await expect(
      canvas.getByRole('button', { name: 'March 9, 2026' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'March 19, 2026' }),
    ).not.toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Navigate back one month' }),
    ).toBeDisabled()
  },
}

export const InvalidText: Story = {
  args: { defaultStartDate: '', defaultEndDate: '' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('textbox', { name: 'Start date' })

    await userEvent.click(start)
    await userEvent.type(start, '13/40/2026')
    await userEvent.keyboard('{Enter}')

    await expect(start).toHaveAttribute('aria-invalid', 'true')
    await expect(
      canvas.getByText('Please enter a valid date'),
    ).toHaveTextContent('Please enter a valid date')
  },
}

export const CalendarViews: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('textbox', { name: 'Start date' })

    await userEvent.click(start)
    await userEvent.click(
      canvas.getByRole('button', { name: 'March. Select month' }),
    )
    await userEvent.click(canvas.getByRole('button', { name: 'February' }))
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

export const ControlledBlur: Story = {
  render: () => {
    const [range, setRange] = useState({
      startDate: '2026-03-10',
      endDate: '2026-03-18',
    })

    return (
      <div>
        <DateRangePicker
          startLabel="Start date"
          endLabel="End date"
          startDate={range.startDate}
          endDate={range.endDate}
          onRangeChange={setRange}
          minDate="2026-03-01"
          maxDate="2026-03-31"
          defaultMonth="2026-03-01"
          startInputProps={{ id: 'controlled-start', name: 'controlledStart' }}
          endInputProps={{ id: 'controlled-end', name: 'controlledEnd' }}
        />
        <button type="button">Outside control</button>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('textbox', { name: 'Start date' })

    await userEvent.click(start)
    await userEvent.clear(start)
    await userEvent.type(start, '03/12/2026')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Outside control' }),
    )

    await expect(start).toHaveValue('03/12/2026')
  },
}

export const LongLabels: Story = {
  args: {
    startLabel: 'Start date for the employment coaching reporting period',
    endLabel: 'End date for the employment coaching reporting period',
  },
}

export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

export const CustomAttributes: Story = {
  args: {
    className: 'custom-date-range',
    'aria-describedby': 'range-hint',
    'data-state': 'draft',
    startInputProps: {
      id: 'custom-start',
      name: 'customStart',
      'aria-describedby': 'range-hint',
    },
    endInputProps: {
      id: 'custom-end',
      name: 'customEnd',
      'aria-describedby': 'range-hint',
    },
  },
  render: (args) => (
    <div>
      <DateRangePicker {...args} />
      <p id="range-hint">Choose the dates included in this report.</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('textbox', { name: 'Start date' })
    const root = start.closest('.pathable-date-range-picker')

    await expect(root).toHaveClass('custom-date-range')
    await expect(root).toHaveAttribute('data-state', 'draft')
    await expect(start).toHaveAttribute('aria-describedby', 'range-hint')
  },
}

export const FormComposition: Story = {
  render: () => (
    <form aria-label="Filter employment records">
      <DateRangePicker
        startLabel="Report start"
        endLabel="Report end"
        defaultMonth="2026-03-01"
        minDate="2026-01-01"
        maxDate="2026-12-31"
        startInputProps={{
          id: 'report-start',
          name: 'reportStart',
          required: true,
        }}
        endInputProps={{ id: 'report-end', name: 'reportEnd', required: true }}
      />
      <Button type="submit">Apply date range</Button>
    </form>
  ),
}
