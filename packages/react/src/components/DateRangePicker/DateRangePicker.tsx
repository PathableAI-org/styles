import {
  useId,
  useRef,
  useState,
  type ChangeEventHandler,
  type FocusEvent,
  type FocusEventHandler,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
} from 'react'

import {
  DatePickerCalendar,
  type CalendarView,
} from '../../internal/date-picker/DatePickerCalendar'
import {
  constrainDate,
  firstDayOfMonth,
  formatDisplayDate,
  parseDisplayDate,
  parseISODate,
  toISODate,
} from '../../internal/date-picker/dateUtils'

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
type DirtySides = Record<DateSide, boolean>

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
const STATUS_CLASS =
  'pathable-sr-only pathable-date-picker__status usa-date-picker__status'
const DATE_RANGE_CLASS =
  'pathable-date-picker__calendar__date--range-date usa-date-picker__calendar__date--range-date'
const DATE_RANGE_START_CLASS =
  'pathable-date-picker__calendar__date--range-date-start usa-date-picker__calendar__date--range-date-start'
const DATE_RANGE_END_CLASS =
  'pathable-date-picker__calendar__date--range-date-end usa-date-picker__calendar__date--range-date-end'
const DATE_WITHIN_RANGE_CLASS =
  'pathable-date-picker__calendar__date--within-range usa-date-picker__calendar__date--within-range'

const INVALID_DATE_MESSAGE = 'Please enter a valid date'

function isWithinRange(value: string, start?: string, end?: string) {
  return Boolean(start && end && value > start && value < end)
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
  const [dirtySides, setDirtySides] = useState<DirtySides>({
    start: false,
    end: false,
  })
  const [invalidSide, setInvalidSide] = useState<DateSide | null>(null)
  const locale =
    typeof document !== 'undefined' && document.documentElement.lang
      ? document.documentElement.lang
      : 'en-US'

  const startInputId = `${startId}-label`
  const endInputId = `${endId}-label`
  const rootClassName = [ROOT_CLASS, className].filter(Boolean).join(' ')
  const closedCalendarDate =
    parseISODate(selectedStart) ?? parseISODate(selectedEnd) ?? initialMonth
  const displayedMonth = openSide
    ? calendarMonth
    : firstDayOfMonth(closedCalendarDate)
  const displayedActiveDate = openSide
    ? activeDate
    : toISODate(closedCalendarDate)

  const applyRange = (nextStart: string, nextEnd: string) => {
    if (startDate === undefined) setInternalStartDate(nextStart)
    if (endDate === undefined) setInternalEndDate(nextEnd)
    setDraftText({
      start: formatDisplayDate(nextStart),
      end: formatDisplayDate(nextEnd),
    })
    setDirtySides({ start: false, end: false })
    setInvalidSide(null)
    if (nextStart !== selectedStart || nextEnd !== selectedEnd) {
      onRangeChange?.({ startDate: nextStart, endDate: nextEnd })
    }
  }

  const parseDraft = (text: string) => {
    if (!text) return ''

    const date = parseDisplayDate(text.trim())
    const value = date ? toISODate(date) : ''
    const violatesBounds = Boolean(
      value && ((minDate && value < minDate) || (maxDate && value > maxDate)),
    )

    return !value || violatesBounds ? null : value
  }

  const getEffectiveValue = (side: DateSide) => {
    const selectedValue = side === 'start' ? selectedStart : selectedEnd
    if (!dirtySides[side]) return selectedValue

    const parsedValue = parseDraft(draftText[side])
    return parsedValue === null ? selectedValue : parsedValue
  }

  const commitDraft = (side: DateSide) => {
    const selectedValue = side === 'start' ? selectedStart : selectedEnd
    const value = dirtySides[side] ? parseDraft(draftText[side]) : selectedValue
    if (value === null) {
      setInvalidSide(side)
      return false
    }

    const otherSide: DateSide = side === 'start' ? 'end' : 'start'
    if (dirtySides[otherSide] && parseDraft(draftText[otherSide]) === null) {
      setInvalidSide(otherSide)
      return false
    }

    let nextStart = getEffectiveValue('start')
    let nextEnd = getEffectiveValue('end')
    if (side === 'start') {
      nextStart = value
      if (nextStart && nextEnd && nextEnd < nextStart) nextEnd = ''
    } else {
      if (nextStart && value && value < nextStart) {
        setInvalidSide(side)
        return false
      }
      nextEnd = value
    }

    applyRange(nextStart, nextEnd)
    return true
  }

  const commitDrafts = () => {
    const nextStart = dirtySides.start
      ? parseDraft(draftText.start)
      : selectedStart
    if (nextStart === null) {
      setInvalidSide('start')
      return false
    }

    const nextEnd = dirtySides.end ? parseDraft(draftText.end) : selectedEnd
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
    const value = getEffectiveValue(side)
    const otherValue =
      side === 'end' ? getEffectiveValue('start') : getEffectiveValue('end')
    const nextDate = constrainDate(
      parseISODate(value) ?? parseISODate(defaultMonth) ?? initialMonth,
      side === 'end' ? otherValue || minDate : minDate,
      side === 'start' ? otherValue || maxDate : maxDate,
    )
    setCalendarMonth(firstDayOfMonth(nextDate))
    setActiveDate(toISODate(nextDate))
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

    const otherSide: DateSide = openSide === 'start' ? 'end' : 'start'
    if (dirtySides[otherSide] && parseDraft(draftText[otherSide]) === null) {
      setInvalidSide(otherSide)
      return
    }

    const currentStart = getEffectiveValue('start')
    const currentEnd = getEffectiveValue('end')
    const disabled = Boolean(
      (minDate && value < minDate) ||
      (maxDate && value > maxDate) ||
      (openSide === 'start' && currentEnd && value > currentEnd) ||
      (openSide === 'end' && currentStart && value < currentStart),
    )
    if (disabled) return

    const nextStart = openSide === 'start' ? value : currentStart
    const nextEnd = openSide === 'end' ? value : currentEnd
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
    const effectiveStart = getEffectiveValue('start')
    const effectiveEnd = getEffectiveValue('end')
    const inputRef = isStart ? startInputRef : endInputRef
    const inputLabelId = isStart ? startInputId : endInputId
    const {
      id: _id,
      name,
      form,
      className: inputClassName,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      onClick,
      ...rest
    } = props
    const isInvalid = invalidSide === side
    const inputValue =
      dirtySides[side] || invalidSide === side
        ? draftText[side]
        : formatDisplayDate(value)
    const lowerBounds = [minDate, side === 'end' ? effectiveStart : '']
      .filter(Boolean)
      .sort()
    const upperBounds = [maxDate, side === 'start' ? effectiveEnd : '']
      .filter(Boolean)
      .sort()
    const calendarMinDate = lowerBounds[lowerBounds.length - 1]
    const calendarMaxDate = upperBounds[0]

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      const nextValue = event.currentTarget.value
      setDraftText((current) => ({ ...current, [side]: nextValue }))
      setDirtySides((current) => ({ ...current, [side]: true }))
      setInvalidSide((current) => (current === side ? null : current))
      onChange?.(event)
    }

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      onBlur?.(event)
      if (
        event.relatedTarget === startInputRef.current ||
        event.relatedTarget === endInputRef.current
      ) {
        commitDraft(side)
      }
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
        setDirtySides((current) => ({ ...current, [side]: false }))
        setInvalidSide((current) => (current === side ? null : current))
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

    const getDateClassName = (dateValue: string) =>
      [
        isWithinRange(dateValue, effectiveStart, effectiveEnd)
          ? `${DATE_RANGE_CLASS} ${DATE_WITHIN_RANGE_CLASS}`
          : '',
        dateValue === effectiveStart ? DATE_RANGE_START_CLASS : '',
        dateValue === effectiveEnd ? DATE_RANGE_END_CLASS : '',
      ]
        .filter(Boolean)
        .join(' ')

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
            pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
            role="combobox"
            aria-labelledby={inputLabelId}
            aria-haspopup="dialog"
            aria-controls={calendarId}
            aria-expanded={openSide === side}
            aria-invalid={isInvalid || undefined}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className={BUTTON_CLASS}
            aria-label={`Toggle ${isStart ? 'start' : 'end'} date calendar`}
            aria-haspopup="dialog"
            aria-controls={calendarId}
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
          <DatePickerCalendar
            calendarId={calendarId}
            calendarLabel={`${isStart ? 'Start' : 'End'} date calendar`}
            month={displayedMonth}
            focusActiveDate={openSide === side && focusCalendar}
            activeDate={displayedActiveDate}
            selectedDates={[effectiveStart, effectiveEnd]}
            minDate={calendarMinDate}
            maxDate={calendarMaxDate}
            getDateClassName={getDateClassName}
            view={calendarView}
            onViewChange={(view) => {
              setCalendarView(view)
              setFocusCalendar(true)
            }}
            onMonthChange={(month) => {
              setCalendarMonth(firstDayOfMonth(month))
              setFocusCalendar(true)
            }}
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
