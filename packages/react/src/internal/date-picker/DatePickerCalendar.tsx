import { useEffect, useRef, type KeyboardEvent } from 'react'

import {
  addDays,
  addMonths,
  addMonthsPreservingDay,
  addYears,
  addYearsPreservingDay,
  createDate,
  firstDayOfMonth,
  firstDayOfWeek,
  lastDayOfMonth,
  parseISODate,
  toISODate,
} from './dateUtils'

export type CalendarView = 'date' | 'month' | 'year'

interface DatePickerCalendarProps {
  readonly calendarId: string
  readonly calendarLabel: string
  readonly hidden: boolean
  readonly focusActiveDate: boolean
  readonly month: Date
  readonly activeDate: string
  readonly selectedDates: readonly string[]
  readonly minDate?: string
  readonly maxDate?: string
  readonly getDateClassName?: (date: string) => string
  readonly onMonthChange: (month: Date) => void
  readonly onActiveDateChange: (date: string) => void
  readonly view: CalendarView
  readonly onViewChange: (view: CalendarView) => void
  readonly onSelectDate: (date: string) => void
  readonly onClose: () => void
  readonly locale: string
}

const CALENDAR_CLASS =
  'pathable-date-picker__calendar usa-date-picker__calendar'
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

export function DatePickerCalendar({
  calendarId,
  calendarLabel,
  hidden,
  focusActiveDate,
  month,
  activeDate,
  selectedDates,
  minDate,
  maxDate,
  getDateClassName,
  onMonthChange,
  onActiveDateChange,
  view,
  onViewChange,
  onSelectDate,
  onClose,
  locale,
}: DatePickerCalendarProps) {
  const days = getCalendarDays(month)
  const calendarRef = useRef<HTMLDivElement>(null)
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

  const isDisabled = (value: string) =>
    Boolean((minDate && value < minDate) || (maxDate && value > maxDate))

  const isMonthDisabled = (value: Date) => {
    const first = toISODate(firstDayOfMonth(value))
    const last = toISODate(lastDayOfMonth(value))
    return Boolean((minDate && last < minDate) || (maxDate && first > maxDate))
  }

  const isYearDisabled = (year: number) =>
    Array.from({ length: 12 }, (_, monthIndex) =>
      isMonthDisabled(createDate(year, monthIndex, 1)),
    ).every(Boolean)

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
    let nextMonth = firstDayOfMonth(value)
    if (isMonthDisabled(nextMonth) && !isYearDisabled(value.getUTCFullYear())) {
      const availableMonth = Array.from({ length: 12 }, (_, monthIndex) =>
        createDate(value.getUTCFullYear(), monthIndex, 1),
      ).find((candidate) => !isMonthDisabled(candidate))
      if (availableMonth) nextMonth = availableMonth
    }
    onMonthChange(nextMonth)
    onActiveDateChange(firstAvailableDate(nextMonth))
  }

  const handlePickerKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    columns: number,
    count: number,
    getValue: (index: number) => Date,
    valueIsDisabled: (value: Date) => boolean,
  ) => {
    let nextIndex: number | null = null

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = index - 1
        break
      case 'ArrowRight':
        nextIndex = index + 1
        break
      case 'ArrowUp':
        nextIndex = index - columns
        break
      case 'ArrowDown':
        nextIndex = index + columns
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = count - 1
        break
      default:
        return
    }

    if (nextIndex === null || nextIndex < 0 || nextIndex >= count) {
      event.preventDefault()
      return
    }

    const nextValue = getValue(nextIndex)
    if (valueIsDisabled(nextValue)) {
      event.preventDefault()
      return
    }

    onActiveDateChange(toISODate(nextValue))
    event.preventDefault()
  }

  useEffect(() => {
    if (!hidden && focusActiveDate) activeButtonRef.current?.focus()
  }, [activeDate, focusActiveDate, hidden, month, view])

  useEffect(() => {
    const calendar = calendarRef.current
    if (!calendar) return

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        onClose()
        event.preventDefault()
      }
    }

    calendar.addEventListener('keydown', handleEscape)
    return () => calendar.removeEventListener('keydown', handleEscape)
  }, [onClose])

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
        next = event.shiftKey
          ? addYearsPreservingDay(current, -1)
          : addMonthsPreservingDay(current, -1)
        break
      case 'PageDown':
        next = event.shiftKey
          ? addYearsPreservingDay(current, 1)
          : addMonthsPreservingDay(current, 1)
        break
      case 'Enter':
      case ' ':
        onSelectDate(activeDate)
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
        <div className={`${CELL_CLASS} ${CENTER_CELL_CLASS}`}>
          <button
            type="button"
            className={PREVIOUS_YEAR_CLASS}
            aria-label="Navigate back one year"
            disabled={isYearDisabled(month.getUTCFullYear() - 1)}
            onClick={() => changeMonth(addYears(month, -1))}
          />
        </div>
        <div className={`${CELL_CLASS} ${CENTER_CELL_CLASS}`}>
          <button
            type="button"
            className={PREVIOUS_MONTH_CLASS}
            aria-label="Navigate back one month"
            disabled={isMonthDisabled(addMonths(month, -1))}
            onClick={() => changeMonth(addMonths(month, -1))}
          />
        </div>
        <div className={`${CELL_CLASS} ${MONTH_LABEL_CLASS}`}>
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
        </div>
        <div className={`${CELL_CLASS} ${CENTER_CELL_CLASS}`}>
          <button
            type="button"
            className={NEXT_MONTH_CLASS}
            aria-label="Navigate forward one month"
            disabled={isMonthDisabled(addMonths(month, 1))}
            onClick={() => changeMonth(addMonths(month, 1))}
          />
        </div>
        <div className={`${CELL_CLASS} ${CENTER_CELL_CLASS}`}>
          <button
            type="button"
            className={NEXT_YEAR_CLASS}
            aria-label="Navigate forward one year"
            disabled={isYearDisabled(month.getUTCFullYear() + 1)}
            onClick={() => changeMonth(addYears(month, 1))}
          />
        </div>
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
                const isSelected = selectedDates.includes(value)
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
                  getDateClassName?.(value),
                ]
                  .filter(Boolean)
                  .join(' ')

                return (
                  <td key={value}>
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
                const isActive =
                  parseISODate(activeDate)?.getUTCFullYear() ===
                    value.getUTCFullYear() &&
                  parseISODate(activeDate)?.getUTCMonth() ===
                    value.getUTCMonth()
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
                      onFocus={() => onActiveDateChange(toISODate(value))}
                      onKeyDown={(event) =>
                        handlePickerKeyDown(
                          event,
                          monthIndex,
                          3,
                          12,
                          (index) =>
                            createDate(month.getUTCFullYear(), index, 1),
                          isMonthDisabled,
                        )
                      }
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
                        const isActive =
                          parseISODate(activeDate)?.getUTCFullYear() === year

                        return (
                          <td key={year} className={CELL_CLASS}>
                            <button
                              ref={isActive ? activeButtonRef : undefined}
                              type="button"
                              className={[
                                YEAR_CLASS,
                                isActive ? YEAR_FOCUSED_CLASS : '',
                                isSelected ? YEAR_SELECTED_CLASS : '',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                              aria-pressed={isSelected}
                              disabled={isYearDisabled(year)}
                              tabIndex={isActive ? 0 : -1}
                              onFocus={() =>
                                onActiveDateChange(toISODate(value))
                              }
                              onKeyDown={(event) =>
                                handlePickerKeyDown(
                                  event,
                                  row * 3 + column,
                                  3,
                                  12,
                                  (index) =>
                                    createDate(
                                      yearStart + index,
                                      month.getUTCMonth(),
                                      1,
                                    ),
                                  (date) =>
                                    isYearDisabled(date.getUTCFullYear()),
                                )
                              }
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
      ref={calendarRef}
      id={calendarId}
      className={CALENDAR_CLASS}
      role="dialog"
      aria-label={calendarLabel}
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
