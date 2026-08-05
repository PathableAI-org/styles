import {
  useId,
  useRef,
  useState,
  useEffect,
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
type CalendarView = 'date' | 'month' | 'year'

interface CalendarProps {
  readonly side: DateSide
  readonly calendarId: string
  readonly hidden: boolean
  readonly focusActiveDate: boolean
  readonly month: Date
  readonly activeDate: string
  readonly selectedStart: string
  readonly selectedEnd: string
  readonly minDate?: string
  readonly maxDate?: string
  readonly onMonthChange: (month: Date) => void
  readonly onActiveDateChange: (date: string) => void
  readonly view: CalendarView
  readonly onViewChange: (view: CalendarView) => void
  readonly onSelectDate: (date: string) => void
  readonly onClose: () => void
  readonly locale: string
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
const STATUS_CLASS =
  'pathable-sr-only pathable-date-picker__status usa-date-picker__status'
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
const YEAR_SELECTION_CLASS =
  'pathable-date-picker__calendar__year-selection usa-date-picker__calendar__year-selection'
const MONTH_PICKER_CLASS =
  'pathable-date-picker__calendar__month-picker usa-date-picker__calendar__month-picker'
const YEAR_PICKER_CLASS =
  'pathable-date-picker__calendar__year-picker usa-date-picker__calendar__year-picker'
const MONTH_CLASS =
  'pathable-date-picker__calendar__month usa-date-picker__calendar__month'
const MONTH_FOCUSED_CLASS =
  'pathable-date-picker__calendar__month--focused usa-date-picker__calendar__month--focused'
const MONTH_SELECTED_CLASS =
  'pathable-date-picker__calendar__month--selected usa-date-picker__calendar__month--selected'
const YEAR_CLASS =
  'pathable-date-picker__calendar__year usa-date-picker__calendar__year'
const YEAR_FOCUSED_CLASS =
  'pathable-date-picker__calendar__year--focused usa-date-picker__calendar__year--focused'
const YEAR_SELECTED_CLASS =
  'pathable-date-picker__calendar__year--selected usa-date-picker__calendar__year--selected'
const PREVIOUS_YEAR_CHUNK_CLASS =
  'pathable-date-picker__calendar__previous-year-chunk usa-date-picker__calendar__previous-year-chunk'
const NEXT_YEAR_CHUNK_CLASS =
  'pathable-date-picker__calendar__next-year-chunk usa-date-picker__calendar__next-year-chunk'

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

function lastDayOfMonth(date: Date) {
  return addDays(
    createDate(date.getUTCFullYear(), date.getUTCMonth() + 1, 1),
    -1,
  )
}

function constrainDate(date: Date, minValue?: string, maxValue?: string) {
  const minDate = parseISODate(minValue)
  const maxDate = parseISODate(maxValue)
  if (minDate && date < minDate) return minDate
  if (maxDate && date > maxDate) return maxDate
  return date
}

function isWithinRange(value: string, start?: string, end?: string) {
  return Boolean(start && end && value > start && value < end)
}

function getCalendarDays(month: Date) {
  const first = firstDayOfWeek(firstDayOfMonth(month))
  return Array.from({ length: 42 }, (_, index) => addDays(first, index))
}

function accessibleDateLabel(value: string, locale: string) {
  const date = parseISODate(value)
  return date
    ? new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        timeZone: 'UTC',
        weekday: 'long',
        year: 'numeric',
      }).format(date)
    : value
}

function Calendar({
  side,
  calendarId,
  hidden,
  focusActiveDate,
  month,
  activeDate,
  selectedStart,
  selectedEnd,
  minDate,
  maxDate,
  onMonthChange,
  onActiveDateChange,
  view,
  onViewChange,
  onSelectDate,
  onClose,
  locale,
}: CalendarProps) {
  const days = getCalendarDays(month)
  const activeButtonRef = useRef<HTMLButtonElement>(null)
  const monthFormatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    timeZone: 'UTC',
  })
  const today = new Date()
  const todayValue = toISODate(
    createDate(today.getFullYear(), today.getMonth(), today.getDate()),
  )
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    createDate(2023, 0, 1 + index),
  )
  const lowerBounds = [minDate, side === 'end' ? selectedStart : '']
    .filter(Boolean)
    .sort()
  const upperBounds = [maxDate, side === 'start' ? selectedEnd : '']
    .filter(Boolean)
    .sort()
  const lowerBound = lowerBounds[lowerBounds.length - 1]
  const upperBound = upperBounds[0]

  const isDisabled = (value: string) =>
    Boolean(
      (lowerBound && value < lowerBound) || (upperBound && value > upperBound),
    )

  const isMonthDisabled = (value: Date) => {
    const first = toISODate(firstDayOfMonth(value))
    const last = toISODate(lastDayOfMonth(value))
    return Boolean(
      (lowerBound && last < lowerBound) || (upperBound && first > upperBound),
    )
  }

  const isYearDisabled = (year: number) =>
    isMonthDisabled(createDate(year, 0, 1)) &&
    isMonthDisabled(createDate(year, 11, 1))

  const firstAvailableDate = (value: Date) => {
    const first = firstDayOfMonth(value)
    const last = lastDayOfMonth(value).getUTCDate()
    for (let day = 1; day <= last; day += 1) {
      const candidate = toISODate(
        createDate(value.getUTCFullYear(), value.getUTCMonth(), day),
      )
      if (!isDisabled(candidate)) return candidate
    }
    return toISODate(first)
  }

  const changeMonth = (value: Date) => {
    const nextMonth = firstDayOfMonth(value)
    onMonthChange(nextMonth)
    onActiveDateChange(firstAvailableDate(nextMonth))
  }

  useEffect(() => {
    if (!hidden && focusActiveDate) activeButtonRef.current?.focus()
  }, [activeDate, focusActiveDate, hidden, month, view])

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
      case 'Enter':
      case ' ':
        onSelectDate(activeDate)
        event.preventDefault()
        return
      case 'Escape':
        onClose()
        event.preventDefault()
        return
      default:
        return
    }

    const nextValue = toISODate(next)
    if (isDisabled(nextValue)) {
      event.preventDefault()
      return
    }
    onActiveDateChange(nextValue)
    onMonthChange(firstDayOfMonth(next))
    event.preventDefault()
  }

  const renderDateView = () => (
    <>
      <div className={ROW_CLASS}>
        <button
          type="button"
          className={PREVIOUS_YEAR_CLASS}
          aria-label="Navigate back one year"
          disabled={isYearDisabled(month.getUTCFullYear() - 1)}
          onClick={() => changeMonth(addYears(month, -1))}
        />
        <button
          type="button"
          className={PREVIOUS_MONTH_CLASS}
          aria-label="Navigate back one month"
          disabled={isMonthDisabled(addMonths(month, -1))}
          onClick={() => changeMonth(addMonths(month, -1))}
        />
        <span className={MONTH_LABEL_CLASS}>
          <button
            type="button"
            className={MONTH_SELECTION_CLASS}
            aria-label={`${monthFormatter.format(month)}. Select month`}
            onClick={() => onViewChange('month')}
          >
            {monthFormatter.format(month)}
          </button>
          <button
            type="button"
            className={YEAR_SELECTION_CLASS}
            aria-label={`${month.getUTCFullYear()}. Select year`}
            onClick={() => onViewChange('year')}
          >
            {month.getUTCFullYear()}
          </button>
        </span>
        <button
          type="button"
          className={NEXT_MONTH_CLASS}
          aria-label="Navigate forward one month"
          disabled={isMonthDisabled(addMonths(month, 1))}
          onClick={() => changeMonth(addMonths(month, 1))}
        />
        <button
          type="button"
          className={NEXT_YEAR_CLASS}
          aria-label="Navigate forward one year"
          disabled={isYearDisabled(month.getUTCFullYear() + 1)}
          onClick={() => changeMonth(addYears(month, 1))}
        />
      </div>
      <table className={TABLE_CLASS}>
        <thead>
          <tr>
            {weekdays.map((weekday) => (
              <th
                key={weekday.toISOString()}
                scope="col"
                className={DAY_OF_WEEK_CLASS}
                aria-label={new Intl.DateTimeFormat(locale, {
                  timeZone: 'UTC',
                  weekday: 'long',
                }).format(weekday)}
              >
                {new Intl.DateTimeFormat(locale, {
                  timeZone: 'UTC',
                  weekday: 'short',
                }).format(weekday)}
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
                      ref={isActive ? activeButtonRef : undefined}
                      type="button"
                      id={`${calendarId}-${value}`}
                      className={dateClassName}
                      aria-label={accessibleDateLabel(value, locale)}
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
    </>
  )

  const renderMonthView = () => (
    <div className={MONTH_PICKER_CLASS}>
      <table className={TABLE_CLASS} role="presentation">
        <tbody>
          {Array.from({ length: 4 }, (_, row) => (
            <tr key={row}>
              {Array.from({ length: 3 }, (_, column) => {
                const monthIndex = row * 3 + column
                const value = createDate(month.getUTCFullYear(), monthIndex, 1)
                const isSelected = monthIndex === month.getUTCMonth()
                const isActive = isSelected
                return (
                  <td key={monthIndex} className={CELL_CLASS}>
                    <button
                      ref={isActive ? activeButtonRef : undefined}
                      type="button"
                      className={[
                        MONTH_CLASS,
                        isActive ? MONTH_FOCUSED_CLASS : '',
                        isSelected ? MONTH_SELECTED_CLASS : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-pressed={isSelected}
                      disabled={isMonthDisabled(value)}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => {
                        changeMonth(value)
                        onViewChange('date')
                      }}
                    >
                      {monthFormatter.format(value)}
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

  const yearStart = month.getUTCFullYear() - (month.getUTCFullYear() % 12)
  const renderYearView = () => (
    <div className={YEAR_PICKER_CLASS}>
      <table className={TABLE_CLASS} role="presentation">
        <tbody>
          <tr>
            <td className={CELL_CLASS}>
              <button
                type="button"
                className={PREVIOUS_YEAR_CHUNK_CLASS}
                aria-label="Navigate back 12 years"
                disabled={isYearDisabled(yearStart - 1)}
                onClick={() =>
                  changeMonth(
                    createDate(yearStart - 12, month.getUTCMonth(), 1),
                  )
                }
              />
            </td>
            <td colSpan={3} className={CELL_CLASS}>
              <table className={TABLE_CLASS} role="presentation">
                <tbody>
                  {Array.from({ length: 4 }, (_, row) => (
                    <tr key={row}>
                      {Array.from({ length: 3 }, (_, column) => {
                        const year = yearStart + row * 3 + column
                        const value = createDate(year, month.getUTCMonth(), 1)
                        const isSelected = year === month.getUTCFullYear()
                        return (
                          <td key={year} className={CELL_CLASS}>
                            <button
                              ref={isSelected ? activeButtonRef : undefined}
                              type="button"
                              className={[
                                YEAR_CLASS,
                                isSelected ? YEAR_FOCUSED_CLASS : '',
                                isSelected ? YEAR_SELECTED_CLASS : '',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                              aria-pressed={isSelected}
                              disabled={isYearDisabled(year)}
                              tabIndex={isSelected ? 0 : -1}
                              onClick={() => {
                                changeMonth(value)
                                onViewChange('date')
                              }}
                            >
                              {year}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
            <td className={CELL_CLASS}>
              <button
                type="button"
                className={NEXT_YEAR_CHUNK_CLASS}
                aria-label="Navigate forward 12 years"
                disabled={isYearDisabled(yearStart + 12)}
                onClick={() =>
                  changeMonth(
                    createDate(yearStart + 12, month.getUTCMonth(), 1),
                  )
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )

  return (
    <div
      id={calendarId}
      className={CALENDAR_CLASS}
      role="application"
      aria-label={`${side === 'start' ? 'Start' : 'End'} date calendar`}
      hidden={hidden}
    >
      {view === 'date'
        ? renderDateView()
        : view === 'month'
          ? renderMonthView()
          : renderYearView()}
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
  const [focusCalendar, setFocusCalendar] = useState(false)
  const [calendarView, setCalendarView] = useState<CalendarView>('date')
  const [draftText, setDraftText] = useState({
    start: formatDisplayDate(selectedStart),
    end: formatDisplayDate(selectedEnd),
  })
  const [invalidSide, setInvalidSide] = useState<DateSide | null>(null)
  const locale =
    typeof document !== 'undefined' && document.documentElement.lang
      ? document.documentElement.lang
      : 'en-US'

  const startInputId = `${startId}-label`
  const endInputId = `${endId}-label`
  const rootClassName = [ROOT_CLASS, className].filter(Boolean).join(' ')

  const applyRange = (nextStart: string, nextEnd: string) => {
    if (startDate === undefined) setInternalStartDate(nextStart)
    if (endDate === undefined) setInternalEndDate(nextEnd)
    setDraftText({
      start: formatDisplayDate(nextStart),
      end: formatDisplayDate(nextEnd),
    })
    setInvalidSide(null)
    onRangeChange?.({ startDate: nextStart, endDate: nextEnd })
  }

  const parseDraft = (text: string) => {
    if (!text) {
      return ''
    }

    const date = parseDisplayDate(text)
    const value = date ? toISODate(date) : ''
    const violatesBounds = Boolean(
      value && ((minDate && value < minDate) || (maxDate && value > maxDate)),
    )

    return !value || violatesBounds ? null : value
  }

  const commitDraft = (side: DateSide) => {
    const value = parseDraft(draftText[side])
    if (value === null) {
      setInvalidSide(side)
      return false
    }

    let nextStart = selectedStart
    let nextEnd = selectedEnd
    if (side === 'start') {
      nextStart = value
      if (nextStart && nextEnd && nextEnd < nextStart) nextEnd = ''
    } else {
      if (selectedStart && value && value < selectedStart) {
        setInvalidSide(side)
        return false
      }
      nextEnd = value
    }

    applyRange(nextStart, nextEnd)
    return true
  }

  const commitDrafts = () => {
    const nextStart = parseDraft(draftText.start)
    if (nextStart === null) {
      setInvalidSide('start')
      return false
    }

    const nextEnd = parseDraft(draftText.end)
    if (nextEnd === null) {
      setInvalidSide('end')
      return false
    }

    const normalizedEnd =
      nextStart && nextEnd && nextEnd < nextStart ? '' : nextEnd
    applyRange(nextStart, normalizedEnd)
    return true
  }

  const openCalendar = (side: DateSide, shouldFocusCalendar = false) => {
    const value = side === 'start' ? selectedStart : selectedEnd
    const date = constrainDate(
      parseISODate(value) ?? parseISODate(defaultMonth) ?? initialMonth,
      side === 'end' ? selectedStart || minDate : minDate,
      side === 'start' ? selectedEnd || maxDate : maxDate,
    )
    setCalendarMonth(firstDayOfMonth(date))
    setActiveDate(toISODate(date))
    setDraftText((current) => ({
      ...current,
      [side]: formatDisplayDate(value),
    }))
    setInvalidSide(null)
    setCalendarView('date')
    setFocusCalendar(shouldFocusCalendar)
    setOpenSide(side)
  }

  const closeCalendar = (restoreFocus = false) => {
    const closingSide = openSide
    commitDrafts()
    setFocusCalendar(false)
    setOpenSide(null)
    setCalendarView('date')
    if (restoreFocus && closingSide) {
      requestAnimationFrame(() => {
        const input =
          closingSide === 'start' ? startInputRef.current : endInputRef.current
        input?.focus()
      })
    }
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

    const nextStart = openSide === 'start' ? value : selectedStart
    const nextEnd = openSide === 'end' ? value : selectedEnd
    applyRange(nextStart, nextEnd)
    setFocusCalendar(false)
    setOpenSide(null)
    setCalendarView('date')
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
      form,
      className: inputClassName,
      onChange,
      onFocus,
      onKeyDown,
      onClick,
      ...rest
    } = props
    const isInvalid = invalidSide === side
    const inputValue =
      openSide === side || invalidSide === side || draftText[side]
        ? draftText[side]
        : formatDisplayDate(value)

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      const nextValue = event.currentTarget.value
      setDraftText((current) => ({
        ...current,
        [side]: nextValue,
      }))
      setInvalidSide(null)
      onChange?.(event)
    }

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      onFocus?.(event)
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
        setFocusCalendar(false)
        setOpenSide(null)
        setCalendarView('date')
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
            form={form}
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
                closeCalendar(true)
                return
              }
              openCalendar(side, true)
            }}
          />
          <Calendar
            side={side}
            calendarId={calendarId}
            month={calendarMonth}
            focusActiveDate={openSide === side && focusCalendar}
            activeDate={activeDate}
            selectedStart={selectedStart}
            selectedEnd={selectedEnd}
            minDate={minDate}
            maxDate={maxDate}
            view={calendarView}
            onViewChange={setCalendarView}
            onMonthChange={(month) => setCalendarMonth(firstDayOfMonth(month))}
            onActiveDateChange={setActiveDate}
            onSelectDate={selectDate}
            onClose={() => closeCalendar(true)}
            locale={locale}
            hidden={openSide !== side}
          />
          <div className={STATUS_CLASS} role="status" aria-live="polite">
            {isInvalid ? INVALID_DATE_MESSAGE : null}
          </div>
        </div>
        <input
          className={INTERNAL_INPUT_CLASS}
          type="hidden"
          disabled={props.disabled}
          form={form}
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
