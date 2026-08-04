import {
  useId,
  useRef,
  useState,
  type ChangeEventHandler,
  type FocusEvent,
  type FocusEventHandler,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
} from 'react'

export interface DateRangeValue {
  readonly startDate: string
  readonly endDate: string
}

export type DateRangeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'id' | 'name' | 'onChange' | 'type' | 'value'
> & {
  readonly id?: string
  readonly name?: string
  readonly onChange?: ChangeEventHandler<HTMLInputElement>
}

export interface DateRangePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> {
  readonly startLabel: ReactNode
  readonly endLabel: ReactNode
  readonly startInputProps?: DateRangeInputProps
  readonly endInputProps?: DateRangeInputProps
  readonly startDate?: string
  readonly endDate?: string
  readonly defaultStartDate?: string
  readonly defaultEndDate?: string
  readonly minDate?: string
  readonly maxDate?: string
  readonly defaultMonth?: string
  readonly onRangeChange?: (value: DateRangeValue) => void
}

type DateSide = 'start' | 'end'

interface CalendarProps {
  readonly side: DateSide
  readonly calendarId: string
  readonly hidden: boolean
  readonly month: Date
  readonly activeDate: string
  readonly selectedStart: string
  readonly selectedEnd: string
  readonly minDate?: string
  readonly maxDate?: string
  readonly onMonthChange: (month: Date) => void
  readonly onActiveDateChange: (date: string) => void
  readonly onSelectDate: (date: string) => void
  readonly onClose: () => void
}

const ROOT_CLASS = 'pathable-date-range-picker usa-date-range-picker'
const DATE_PICKER_CLASS = 'pathable-date-picker usa-date-picker'
const INITIALIZED_CLASS =
  'pathable-date-picker--initialized usa-date-picker--initialized'
const ACTIVE_CLASS = 'pathable-date-picker--active usa-date-picker--active'
const WRAPPER_CLASS = 'pathable-date-picker__wrapper usa-date-picker__wrapper'
const EXTERNAL_INPUT_CLASS =
  'pathable-date-picker__external-input usa-date-picker__external-input pathable-input pathable-input--date'
const INTERNAL_INPUT_CLASS =
  'pathable-date-picker__internal-input usa-date-picker__internal-input'
const BUTTON_CLASS = 'pathable-date-picker__button usa-date-picker__button'
const CALENDAR_CLASS =
  'pathable-date-picker__calendar usa-date-picker__calendar'
const STATUS_CLASS = 'pathable-date-picker__status usa-date-picker__status'
const TABLE_CLASS =
  'pathable-date-picker__calendar__table usa-date-picker__calendar__table'
const ROW_CLASS =
  'pathable-date-picker__calendar__row usa-date-picker__calendar__row'
const CELL_CLASS =
  'pathable-date-picker__calendar__cell usa-date-picker__calendar__cell'
const CENTER_CELL_CLASS =
  'pathable-date-picker__calendar__cell--center-items usa-date-picker__calendar__cell--center-items'
const MONTH_LABEL_CLASS =
  'pathable-date-picker__calendar__month-label usa-date-picker__calendar__month-label'
const DAY_OF_WEEK_CLASS =
  'pathable-date-picker__calendar__day-of-week usa-date-picker__calendar__day-of-week'
const DATE_CLASS =
  'pathable-date-picker__calendar__date usa-date-picker__calendar__date'
const DATE_FOCUSED_CLASS =
  'pathable-date-picker__calendar__date--focused usa-date-picker__calendar__date--focused'
const DATE_SELECTED_CLASS =
  'pathable-date-picker__calendar__date--selected usa-date-picker__calendar__date--selected'
const DATE_PREVIOUS_CLASS =
  'pathable-date-picker__calendar__date--previous-month usa-date-picker__calendar__date--previous-month'
const DATE_CURRENT_CLASS =
  'pathable-date-picker__calendar__date--current-month usa-date-picker__calendar__date--current-month'
const DATE_NEXT_CLASS =
  'pathable-date-picker__calendar__date--next-month usa-date-picker__calendar__date--next-month'
const DATE_RANGE_CLASS =
  'pathable-date-picker__calendar__date--range-date usa-date-picker__calendar__date--range-date'
const DATE_RANGE_START_CLASS =
  'pathable-date-picker__calendar__date--range-date-start usa-date-picker__calendar__date--range-date-start'
const DATE_RANGE_END_CLASS =
  'pathable-date-picker__calendar__date--range-date-end usa-date-picker__calendar__date--range-date-end'
const DATE_WITHIN_RANGE_CLASS =
  'pathable-date-picker__calendar__date--within-range usa-date-picker__calendar__date--within-range'
const PREVIOUS_YEAR_CLASS =
  'pathable-date-picker__calendar__previous-year usa-date-picker__calendar__previous-year'
const PREVIOUS_MONTH_CLASS =
  'pathable-date-picker__calendar__previous-month usa-date-picker__calendar__previous-month'
const NEXT_YEAR_CLASS =
  'pathable-date-picker__calendar__next-year usa-date-picker__calendar__next-year'
const NEXT_MONTH_CLASS =
  'pathable-date-picker__calendar__next-month usa-date-picker__calendar__next-month'
const MONTH_SELECTION_CLASS =
  'pathable-date-picker__calendar__month-selection usa-date-picker__calendar__month-selection'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const INVALID_DATE_MESSAGE = 'Please enter a valid date'

function createDate(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(2000, 0, 1))
  date.setUTCFullYear(year, month, day)
  return date
}

function parseISODate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null

  const [year, month, day] = value.split('-').map(Number)
  const date = createDate(year, month - 1, day)
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : null
}

function toISODate(date: Date) {
  const year = String(date.getUTCFullYear()).padStart(4, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDisplayDate(value?: string) {
  const date = parseISODate(value)
  return date
    ? `${String(date.getUTCMonth() + 1).padStart(2, '0')}/${String(date.getUTCDate()).padStart(2, '0')}/${date.getUTCFullYear()}`
    : ''
}

function parseDisplayDate(value: string) {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null

  return parseISODate(`${match[3]}-${match[1]}-${match[2]}`)
}

function addDays(date: Date, amount: number) {
  const next = new Date(date.getTime())
  next.setUTCDate(next.getUTCDate() + amount)
  return next
}

function addMonths(date: Date, amount: number) {
  const next = createDate(date.getUTCFullYear(), date.getUTCMonth(), 1)
  next.setUTCMonth(next.getUTCMonth() + amount)
  return next
}

function addYears(date: Date, amount: number) {
  return createDate(date.getUTCFullYear() + amount, date.getUTCMonth(), 1)
}

function firstDayOfMonth(date: Date) {
  return createDate(date.getUTCFullYear(), date.getUTCMonth(), 1)
}

function firstDayOfWeek(date: Date) {
  return addDays(date, -date.getUTCDay())
}

function isWithinRange(value: string, start?: string, end?: string) {
  return Boolean(start && end && value > start && value < end)
}

function getCalendarDays(month: Date) {
  const first = firstDayOfWeek(firstDayOfMonth(month))
  return Array.from({ length: 42 }, (_, index) => addDays(first, index))
}

function accessibleDateLabel(value: string) {
  const date = parseISODate(value)
  return date
    ? `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
    : value
}

function Calendar({
  side,
  calendarId,
  hidden,
  month,
  activeDate,
  selectedStart,
  selectedEnd,
  minDate,
  maxDate,
  onMonthChange,
  onActiveDateChange,
  onSelectDate,
  onClose,
}: CalendarProps) {
  const days = getCalendarDays(month)
  const monthValue = `${MONTHS[month.getUTCMonth()]} ${month.getUTCFullYear()}`
  const today = new Date()
  const todayValue = toISODate(
    createDate(today.getFullYear(), today.getMonth(), today.getDate()),
  )

  const isDisabled = (value: string) =>
    Boolean(
      (minDate && value < minDate) ||
      (maxDate && value > maxDate) ||
      (side === 'start' && selectedEnd && value > selectedEnd) ||
      (side === 'end' && selectedStart && value < selectedStart),
    )

  const handleDateKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const current = parseISODate(activeDate)
    if (!current) return

    let next: Date | null = null
    switch (event.key) {
      case 'ArrowLeft':
        next = addDays(current, -1)
        break
      case 'ArrowRight':
        next = addDays(current, 1)
        break
      case 'ArrowUp':
        next = addDays(current, -7)
        break
      case 'ArrowDown':
        next = addDays(current, 7)
        break
      case 'Home':
        next = firstDayOfWeek(current)
        break
      case 'End':
        next = addDays(firstDayOfWeek(current), 6)
        break
      case 'PageUp':
        next = event.shiftKey ? addYears(current, -1) : addMonths(current, -1)
        break
      case 'PageDown':
        next = event.shiftKey ? addYears(current, 1) : addMonths(current, 1)
        break
      case 'Escape':
        onClose()
        event.preventDefault()
        return
      default:
        return
    }

    const nextValue = toISODate(next)
    onActiveDateChange(nextValue)
    onMonthChange(firstDayOfMonth(next))
    event.preventDefault()
  }

  return (
    <div
      id={calendarId}
      className={CALENDAR_CLASS}
      role="application"
      aria-label={`${side === 'start' ? 'Start' : 'End'} date calendar`}
      hidden={hidden}
    >
      <div className={ROW_CLASS}>
        <button
          type="button"
          className={PREVIOUS_YEAR_CLASS}
          aria-label="Navigate back one year"
          onClick={() => onMonthChange(addYears(month, -1))}
        />
        <button
          type="button"
          className={PREVIOUS_MONTH_CLASS}
          aria-label="Navigate back one month"
          onClick={() => onMonthChange(addMonths(month, -1))}
        />
        <span className={MONTH_LABEL_CLASS}>
          <button
            type="button"
            className={MONTH_SELECTION_CLASS}
            aria-label={`${monthValue}. Select month`}
            onClick={() => undefined}
          >
            {monthValue}
          </button>
        </span>
        <button
          type="button"
          className={NEXT_MONTH_CLASS}
          aria-label="Navigate forward one month"
          onClick={() => onMonthChange(addMonths(month, 1))}
        />
        <button
          type="button"
          className={NEXT_YEAR_CLASS}
          aria-label="Navigate forward one year"
          onClick={() => onMonthChange(addYears(month, 1))}
        />
      </div>
      <table className={TABLE_CLASS}>
        <thead>
          <tr>
            {WEEKDAYS.map((weekday) => (
              <th key={weekday} scope="col" className={DAY_OF_WEEK_CLASS}>
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, week) => (
            <tr key={week}>
              {days.slice(week * 7, week * 7 + 7).map((date) => {
                const value = toISODate(date)
                const isCurrentMonth =
                  date.getUTCFullYear() === month.getUTCFullYear() &&
                  date.getUTCMonth() === month.getUTCMonth()
                const isSelected =
                  value === selectedStart || value === selectedEnd
                const isStart = value === selectedStart
                const isEnd = value === selectedEnd
                const isActive = value === activeDate
                const dateClassName = [
                  DATE_CLASS,
                  isActive ? DATE_FOCUSED_CLASS : '',
                  isSelected ? DATE_SELECTED_CLASS : '',
                  isCurrentMonth
                    ? DATE_CURRENT_CLASS
                    : date < firstDayOfMonth(month)
                      ? DATE_PREVIOUS_CLASS
                      : DATE_NEXT_CLASS,
                  isWithinRange(value, selectedStart, selectedEnd)
                    ? `${DATE_RANGE_CLASS} ${DATE_WITHIN_RANGE_CLASS}`
                    : '',
                  isStart ? DATE_RANGE_START_CLASS : '',
                  isEnd ? DATE_RANGE_END_CLASS : '',
                ]
                  .filter(Boolean)
                  .join(' ')

                return (
                  <td
                    key={value}
                    className={`${CELL_CLASS} ${CENTER_CELL_CLASS}`}
                  >
                    <button
                      type="button"
                      id={`${calendarId}-${value}`}
                      className={dateClassName}
                      aria-label={accessibleDateLabel(value)}
                      aria-pressed={isSelected}
                      aria-current={value === todayValue ? 'date' : undefined}
                      disabled={isDisabled(value)}
                      tabIndex={isActive ? 0 : -1}
                      onFocus={() => onActiveDateChange(value)}
                      onKeyDown={handleDateKeyDown}
                      onClick={() => onSelectDate(value)}
                    >
                      {date.getUTCDate()}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DateRangePicker({
  startLabel,
  endLabel,
  startInputProps = {},
  endInputProps = {},
  startDate,
  endDate,
  defaultStartDate = '',
  defaultEndDate = '',
  minDate,
  maxDate,
  defaultMonth,
  onRangeChange,
  className,
  onBlur: consumerOnBlur,
  ...rootProps
}: DateRangePickerProps) {
  const generatedId = useId()
  const startId = startInputProps.id ?? `${generatedId}-start`
  const endId = endInputProps.id ?? `${generatedId}-end`
  const startCalendarId = `${startId}-calendar`
  const endCalendarId = `${endId}-calendar`
  const startInputRef = useRef<HTMLInputElement>(null)
  const endInputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [internalStartDate, setInternalStartDate] = useState(defaultStartDate)
  const [internalEndDate, setInternalEndDate] = useState(defaultEndDate)
  const selectedStart = startDate ?? internalStartDate
  const selectedEnd = endDate ?? internalEndDate
  const initialMonth =
    parseISODate(defaultMonth) ??
    parseISODate(selectedStart) ??
    parseISODate(selectedEnd) ??
    parseISODate(minDate) ??
    firstDayOfMonth(new Date())
  const [calendarMonth, setCalendarMonth] = useState(
    firstDayOfMonth(initialMonth),
  )
  const [activeDate, setActiveDate] = useState(
    selectedStart || selectedEnd || toISODate(initialMonth),
  )
  const [openSide, setOpenSide] = useState<DateSide | null>(null)
  const [draftText, setDraftText] = useState({
    start: formatDisplayDate(selectedStart),
    end: formatDisplayDate(selectedEnd),
  })
  const [invalidSide, setInvalidSide] = useState<DateSide | null>(null)

  const startInputId = `${startId}-label`
  const endInputId = `${endId}-label`
  const rootClassName = [ROOT_CLASS, className].filter(Boolean).join(' ')

  const updateRange = (side: DateSide, nextValue: string) => {
    let nextStart = selectedStart
    let nextEnd = selectedEnd

    if (side === 'start') {
      nextStart = nextValue
      if (nextStart && nextEnd && nextEnd < nextStart) nextEnd = ''
      if (startDate === undefined) setInternalStartDate(nextStart)
      if (endDate === undefined && nextEnd !== selectedEnd) {
        setInternalEndDate(nextEnd)
      }
    } else {
      nextEnd = nextValue
      if (endDate === undefined) setInternalEndDate(nextEnd)
    }

    setDraftText({
      start: formatDisplayDate(nextStart),
      end: formatDisplayDate(nextEnd),
    })
    setInvalidSide(null)
    onRangeChange?.({ startDate: nextStart, endDate: nextEnd })
  }

  const commitDraft = (side: DateSide) => {
    const text = draftText[side]
    if (!text) {
      updateRange(side, '')
      return
    }

    const date = parseDisplayDate(text)
    const value = date ? toISODate(date) : ''
    const violatesBounds = Boolean(
      value &&
      ((minDate && value < minDate) ||
        (maxDate && value > maxDate) ||
        (side === 'start' && selectedEnd && value > selectedEnd) ||
        (side === 'end' && selectedStart && value < selectedStart)),
    )

    if (!value || violatesBounds) {
      setInvalidSide(side)
      return
    }

    updateRange(side, value)
  }

  const openCalendar = (side: DateSide) => {
    const value = side === 'start' ? selectedStart : selectedEnd
    const date =
      parseISODate(value) ?? parseISODate(defaultMonth) ?? initialMonth
    setCalendarMonth(firstDayOfMonth(date))
    setActiveDate(value || toISODate(date))
    setDraftText((current) => ({
      ...current,
      [side]: formatDisplayDate(value),
    }))
    setInvalidSide(null)
    setOpenSide(side)
  }

  const closeCalendar = () => {
    commitDraft('start')
    commitDraft('end')
    setOpenSide(null)
  }

  const selectDate = (value: string) => {
    if (!openSide) return

    const disabled = Boolean(
      (minDate && value < minDate) ||
      (maxDate && value > maxDate) ||
      (openSide === 'start' && selectedEnd && value > selectedEnd) ||
      (openSide === 'end' && selectedStart && value < selectedStart),
    )
    if (disabled) return

    updateRange(openSide, value)
    setOpenSide(null)
    requestAnimationFrame(() => {
      const input =
        openSide === 'start' ? startInputRef.current : endInputRef.current
      input?.focus()
    })
  }

  const handleRootBlur: FocusEventHandler<HTMLDivElement> = (event) => {
    consumerOnBlur?.(event)
    const nextTarget = event.relatedTarget
    if (!nextTarget || !rootRef.current?.contains(nextTarget)) {
      closeCalendar()
    }
  }

  const renderInput = (
    side: DateSide,
    label: ReactNode,
    props: DateRangeInputProps,
  ) => {
    const isStart = side === 'start'
    const id = isStart ? startId : endId
    const calendarId = isStart ? startCalendarId : endCalendarId
    const value = isStart ? selectedStart : selectedEnd
    const inputRef = isStart ? startInputRef : endInputRef
    const inputLabelId = isStart ? startInputId : endInputId
    const {
      id: _id,
      name,
      className: inputClassName,
      onChange,
      onFocus,
      onKeyDown,
      onClick,
      ...rest
    } = props
    const isInvalid = invalidSide === side
    const inputValue =
      openSide === side ? draftText[side] : formatDisplayDate(value)

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      setDraftText((current) => ({
        ...current,
        [side]: event.currentTarget.value,
      }))
      setInvalidSide(null)
      onChange?.(event)
    }

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      onFocus?.(event)
      openCalendar(side)
    }

    const handleClick: MouseEventHandler<HTMLInputElement> = (event) => {
      onClick?.(event)
      if (openSide !== side) openCalendar(side)
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      if (event.key === 'Escape') {
        setDraftText((current) => ({
          ...current,
          [side]: formatDisplayDate(value),
        }))
        setInvalidSide(null)
        setOpenSide(null)
        event.preventDefault()
      }
      if (event.key === 'Enter') {
        commitDraft(side)
        event.preventDefault()
      }
    }

    return (
      <div
        className={`${DATE_PICKER_CLASS} ${
          isStart
            ? 'pathable-date-range-picker__range-start usa-date-range-picker__range-start'
            : 'pathable-date-range-picker__range-end usa-date-range-picker__range-end'
        } ${INITIALIZED_CLASS} ${openSide === side ? ACTIVE_CLASS : ''}`}
        data-react-owned="true"
        data-min-date={minDate}
        data-max-date={maxDate}
      >
        <label className="pathable-label" htmlFor={id} id={inputLabelId}>
          {label}
        </label>
        <div className={WRAPPER_CLASS}>
          <input
            {...rest}
            ref={inputRef}
            id={id}
            className={[EXTERNAL_INPUT_CLASS, inputClassName]
              .filter(Boolean)
              .join(' ')}
            type="text"
            value={inputValue}
            placeholder={props.placeholder ?? 'MM/DD/YYYY'}
            pattern="\\d{2}\\/\\d{2}\\/\\d{4}"
            aria-labelledby={inputLabelId}
            aria-controls={calendarId}
            aria-invalid={isInvalid || undefined}
            onChange={handleChange}
            onFocus={handleFocus}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className={BUTTON_CLASS}
            aria-label={`Toggle ${isStart ? 'start' : 'end'} date calendar`}
            aria-haspopup="dialog"
            aria-expanded={openSide === side}
            disabled={props.disabled}
            onClick={() => {
              if (openSide === side) {
                closeCalendar()
                return
              }
              openCalendar(side)
              inputRef.current?.focus()
            }}
          />
          <Calendar
            side={side}
            calendarId={calendarId}
            month={calendarMonth}
            activeDate={activeDate}
            selectedStart={selectedStart}
            selectedEnd={selectedEnd}
            minDate={minDate}
            maxDate={maxDate}
            onMonthChange={(month) => setCalendarMonth(firstDayOfMonth(month))}
            onActiveDateChange={setActiveDate}
            onSelectDate={selectDate}
            onClose={closeCalendar}
            hidden={openSide !== side}
          />
          <div className={STATUS_CLASS} role="status" aria-live="polite">
            {isInvalid ? INVALID_DATE_MESSAGE : null}
          </div>
        </div>
        <input
          className={INTERNAL_INPUT_CLASS}
          type="hidden"
          name={name}
          value={value}
          readOnly
        />
      </div>
    )
  }

  return (
    <div
      {...rootProps}
      ref={rootRef}
      className={rootClassName}
      onBlur={handleRootBlur}
      data-min-date={minDate}
      data-max-date={maxDate}
      data-react-owned="true"
    >
      {renderInput('start', startLabel, startInputProps)}
      {renderInput('end', endLabel, endInputProps)}
    </div>
  )
}
