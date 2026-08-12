import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
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

**Underlying elements**: Two labelled visible text inputs, two hidden ISO value inputs, and an accessible calendar dialog rendered with native buttons and table markup.

**Behavior**: React owns the calendar state, range validation, keyboard navigation, focus restoration, and status messaging. A separate \`@pathableai/styles/js\` import is not required.`,
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
      canvas.getByRole('combobox', { name: 'Start date' }),
    ).toHaveValue('03/10/2026')
    await expect(
      canvas.getByRole('combobox', { name: 'End date' }),
    ).toHaveValue('03/18/2026')
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
      canvas.getByRole('combobox', { name: 'Start date' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('combobox', { name: 'End date' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Toggle start date calendar' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Toggle end date calendar' }),
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
      canvas.getByRole('combobox', { name: 'Start date' }),
    ).toBeRequired()
    await expect(
      canvas.getByRole('combobox', { name: 'End date' }),
    ).toBeRequired()
  },
}

export const CalendarSelection: Story = {
  args: {
    onRangeChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('combobox', { name: 'Start date' })

    await step('opens the start calendar', async () => {
      await userEvent.click(start)
      await expect(
        canvas.getByRole('dialog', { name: 'Start date calendar' }),
      ).toBeVisible()
    })

    await step('selects a new start date', async () => {
      await userEvent.click(
        canvas.getByRole('button', { name: 'Thursday, March 12, 2026' }),
      )
      await expect(start).toHaveValue('03/12/2026')
      await expect(start).toHaveFocus()
      await expect(
        canvas.getByRole('button', { name: 'Toggle start date calendar' }),
      ).toHaveAttribute('aria-expanded', 'false')
      await expect(args.onRangeChange).toHaveBeenCalledWith({
        startDate: '2026-03-12',
        endDate: '2026-03-18',
      })
      await expect(args.onRangeChange).toHaveBeenCalledTimes(1)
    })
  },
}

export const CalendarLayout: Story = {
  args: {
    minDate: '2025-01-01',
    maxDate: '2027-12-31',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('renders dates in seven table columns', async () => {
      await userEvent.click(
        canvas.getByRole('button', { name: 'Toggle start date calendar' }),
      )

      const calendar = canvas.getByRole('dialog', {
        name: 'Start date calendar',
      })
      const rows = within(calendar).getAllByRole('row')
      const cells = within(rows[1]).getAllByRole('cell')
      const firstCellTop = cells[0].getBoundingClientRect().top

      await expect(cells).toHaveLength(7)
      for (const cell of cells) {
        await expect(window.getComputedStyle(cell).display).toBe('table-cell')
        await expect(cell.getBoundingClientRect().top).toBeCloseTo(
          firstCellTop,
          1,
        )
      }
    })

    await step('aligns navigation controls in five cells', async () => {
      const controls = [
        canvas.getByRole('button', { name: 'Navigate back one year' }),
        canvas.getByRole('button', { name: 'Navigate back one month' }),
        canvas.getByRole('button', { name: 'March. Select month' }),
        canvas.getByRole('button', { name: 'Navigate forward one month' }),
        canvas.getByRole('button', { name: 'Navigate forward one year' }),
      ]
      const cells = controls.map((control) => control.parentElement)
      const row = cells[0]?.parentElement

      await expect(new Set(cells).size).toBe(5)
      for (const [index, cell] of cells.entries()) {
        await expect(cell).not.toBeNull()
        await expect(cell?.parentElement).toBe(row)
        await expect(
          window.getComputedStyle(cell as HTMLElement).flexGrow,
        ).toBe(index === 2 ? '4' : '1')
      }
    })

    await step('serves calendar navigation icons', async () => {
      const previousMonth = canvas.getByRole('button', {
        name: 'Navigate back one month',
      })
      const backgroundImage =
        window.getComputedStyle(previousMonth).backgroundImage
      const iconUrl = backgroundImage
        .match(/url\((?:"([^"]+)"|'([^']+)'|([^"')]+))\)/u)
        ?.slice(1)
        .find(Boolean)

      await expect(iconUrl).toBeDefined()
      const response = await fetch(iconUrl as string)
      await expect(response.ok).toBe(true)
      await expect(response.headers.get('content-type')).toContain(
        'image/svg+xml',
      )
      await expect(await response.text()).toContain('<svg')
    })
  },
}

export const CalendarReplacesDraft: Story = {
  args: {
    onRangeChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('combobox', { name: 'Start date' })
    const end = canvas.getByRole('combobox', { name: 'End date' })

    await userEvent.click(start)
    await userEvent.clear(start)
    await userEvent.type(start, '03/20/2026')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Thursday, March 12, 2026' }),
    )

    await expect(start).toHaveValue('03/12/2026')
    await expect(end).toHaveValue('03/18/2026')
    await expect(args.onRangeChange).toHaveBeenCalledTimes(1)
    await expect(args.onRangeChange).toHaveBeenCalledWith({
      startDate: '2026-03-12',
      endDate: '2026-03-18',
    })
  },
}

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('combobox', { name: 'Start date' })
    const toggle = canvas.getByRole('button', {
      name: 'Toggle start date calendar',
    })

    await userEvent.click(toggle)
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
    const end = canvas.getByRole('combobox', { name: 'End date' })

    await userEvent.click(end)
    await expect(
      canvas.getByRole('button', { name: 'Monday, March 9, 2026' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Thursday, March 19, 2026' }),
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
    const start = canvas.getByRole('combobox', { name: 'Start date' })

    await userEvent.click(start)
    await userEvent.clear(start)
    await userEvent.type(start, '13/40/2026')
    await expect(start).toHaveValue('13/40/2026')
    await userEvent.keyboard('{Enter}')

    await expect(
      canvas.getByRole('combobox', { name: 'Start date' }),
    ).toHaveAttribute('aria-invalid', 'true')
    await expect(
      canvas.getByText('Please enter a valid date'),
    ).toHaveTextContent('Please enter a valid date')
  },
}

export const InvalidDraftPreserved: Story = {
  args: {
    onRangeChange: fn(),
  },
  render: (args) => (
    <div>
      <DateRangePicker {...args} />
      <button type="button">Outside control</button>
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('combobox', { name: 'Start date' })

    await userEvent.click(start)
    await userEvent.clear(start)
    await userEvent.type(start, '13/40/2026')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Outside control' }),
    )
    await userEvent.click(canvas.getByRole('combobox', { name: 'End date' }))

    await expect(start).toHaveValue('13/40/2026')
    await expect(start).toHaveAttribute('aria-invalid', 'true')
    await userEvent.keyboard('{Escape}')
    await expect(start).toHaveAttribute('aria-invalid', 'true')
    await userEvent.click(canvas.getByRole('combobox', { name: 'End date' }))
    await userEvent.click(
      canvas.getByRole('button', { name: 'Thursday, March 19, 2026' }),
    )
    await expect(args.onRangeChange).not.toHaveBeenCalled()
    await expect(start).toHaveValue('13/40/2026')
  },
}

export const CalendarViews: Story = {
  args: {
    defaultStartDate: '',
    defaultEndDate: '',
    minDate: '2026-01-01',
    maxDate: '2027-12-31',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('combobox', { name: 'Start date' })

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

export const PickerKeyboardFocus: Story = {
  args: {
    minDate: '2026-01-01',
    maxDate: '2026-12-31',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('button', {
      name: 'Toggle start date calendar',
    })

    await userEvent.click(toggle)
    await userEvent.click(
      canvas.getByRole('button', { name: 'March. Select month' }),
    )
    await expect(
      canvas.getByRole('button', { name: 'March', exact: true }),
    ).toHaveFocus()

    await userEvent.keyboard('{ArrowLeft}{Enter}')
    await expect(
      canvas.getByRole('button', { name: 'Sunday, February 1, 2026' }),
    ).toHaveFocus()
  },
}

export const CalendarViewEscape: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('combobox', { name: 'Start date' })
    const toggle = canvas.getByRole('button', {
      name: 'Toggle start date calendar',
    })

    await userEvent.click(toggle)
    await userEvent.click(
      canvas.getByRole('button', { name: 'March. Select month' }),
    )
    await userEvent.keyboard('{Escape}')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(start).toHaveFocus()

    await userEvent.click(toggle)
    await userEvent.click(
      canvas.getByRole('button', { name: '2026. Select year' }),
    )
    await userEvent.keyboard('{Escape}')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(start).toHaveFocus()
  },
}

export const InteriorYearConstraint: Story = {
  args: {
    defaultStartDate: '',
    defaultEndDate: '',
    minDate: '2026-06-15',
    maxDate: '2026-06-20',
    defaultMonth: '2026-06-01',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle start date calendar' }),
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'June. Select month' }),
    )
    await userEvent.click(canvas.getByRole('button', { name: 'June' }))
    await userEvent.click(
      canvas.getByRole('button', { name: '2026. Select year' }),
    )

    await expect(
      canvas.getByRole('button', { name: '2026' }),
    ).not.toBeDisabled()
    await expect(canvas.getByRole('button', { name: '2025' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: '2027' })).toBeDisabled()
  },
}

export const BoundaryYearFocus: Story = {
  args: {
    defaultStartDate: '',
    defaultEndDate: '',
    minDate: '2026-01-01',
    maxDate: '2027-06-20',
    defaultMonth: '2026-12-01',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle start date calendar' }),
    )
    await userEvent.click(
      canvas.getByRole('button', { name: '2026. Select year' }),
    )
    await userEvent.click(canvas.getByRole('button', { name: '2027' }))

    await expect(
      canvas.getByRole('button', { name: /January 1, 2027$/ }),
    ).toHaveFocus()
  },
}

export const ControlledBlur: Story = {
  args: {
    onRangeChange: fn(),
  },
  render: (args) => {
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
          onRangeChange={(value) => {
            args.onRangeChange?.(value)
            setRange(value)
          }}
          minDate="2026-03-01"
          maxDate="2026-03-31"
          defaultMonth="2026-03-01"
          startInputProps={{ id: 'controlled-start', name: 'controlledStart' }}
          endInputProps={{ id: 'controlled-end', name: 'controlledEnd' }}
        />
        <button type="button">Outside control</button>
        <p>Selected start: {range.startDate}</p>
      </div>
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('combobox', { name: 'Start date' })

    await userEvent.click(start)
    await userEvent.clear(start)
    await userEvent.type(start, '03/12/2026')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Outside control' }),
    )

    await expect(start).toHaveValue('03/12/2026')
    await expect(canvas.getByText('Selected start: 2026-03-12')).toBeVisible()
    await expect(args.onRangeChange).toHaveBeenCalledTimes(1)
    await expect(args.onRangeChange).toHaveBeenCalledWith({
      startDate: '2026-03-12',
      endDate: '2026-03-18',
    })
  },
}

export const ControlledPropSync: Story = {
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
          defaultMonth="2026-03-01"
          startInputProps={{ id: 'sync-start', name: 'syncStart' }}
          endInputProps={{ id: 'sync-end', name: 'syncEnd' }}
        />
        <button
          type="button"
          onClick={() =>
            setRange({ startDate: '2026-04-20', endDate: '2026-04-28' })
          }
        >
          Update date range
        </button>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('combobox', { name: 'Start date' })

    await userEvent.click(start)
    await userEvent.clear(start)
    await userEvent.type(start, '03/12/2026')
    await userEvent.keyboard('{Escape}')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Update date range' }),
    )

    await expect(start).toHaveValue('04/20/2026')
    await expect(
      canvas.getByRole('combobox', { name: 'End date' }),
    ).toHaveValue('04/28/2026')
    await expect(
      canvasElement.querySelector('input[name="syncStart"][type="hidden"]'),
    ).toHaveValue('2026-04-20')
    await expect(
      canvasElement.querySelector('input[name="syncEnd"][type="hidden"]'),
    ).toHaveValue('2026-04-28')

    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle start date calendar' }),
    )
    await expect(
      canvas.getByRole('button', { name: /April 20, 2026$/ }),
    ).toHaveFocus()
  },
}

export const DirtyFieldPreserved: Story = {
  args: {
    onRangeChange: fn(),
  },
  render: (args) => {
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
          onRangeChange={(value) => {
            args.onRangeChange?.(value)
            setRange(value)
          }}
          minDate="2026-03-01"
          maxDate="2026-03-31"
          defaultMonth="2026-03-01"
          startInputProps={{ id: 'dirty-start', name: 'dirtyStart' }}
          endInputProps={{ id: 'dirty-end', name: 'dirtyEnd' }}
        />
        <p>
          Current range: {range.startDate} to {range.endDate || 'not selected'}
        </p>
      </div>
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('combobox', { name: 'Start date' })
    const end = canvas.getByRole('combobox', { name: 'End date' })

    await userEvent.click(start)
    await userEvent.clear(start)
    await userEvent.type(start, '03/20/2026')
    await userEvent.click(end)

    await expect(start).toHaveValue('03/20/2026')
    await expect(
      canvas.getByText('Current range: 2026-03-20 to not selected'),
    ).toBeVisible()
    await expect(end).toHaveValue('')
    await expect(
      canvasElement.querySelector('input[name="dirtyStart"][type="hidden"]'),
    ).toHaveValue('2026-03-20')
    await expect(
      canvasElement.querySelector('input[name="dirtyEnd"][type="hidden"]'),
    ).toHaveValue('')
    await expect(args.onRangeChange).toHaveBeenCalledTimes(1)
  },
}

export const NoOpBlur: Story = {
  args: {
    onRangeChange: fn(),
  },
  render: (args) => (
    <div>
      <DateRangePicker {...args} />
      <button type="button">Outside control</button>
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole('combobox', { name: 'Start date' })
    await userEvent.click(start)
    await userEvent.clear(start)
    await userEvent.type(start, '03/10/2026')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Outside control' }),
    )

    await expect(args.onRangeChange).not.toHaveBeenCalled()
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
    const start = canvas.getByRole('combobox', { name: 'Start date' })
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
