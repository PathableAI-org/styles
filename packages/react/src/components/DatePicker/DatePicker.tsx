import {
  useEffect,
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

export type DatePickerInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'children'
  | 'defaultValue'
  | 'id'
  | 'name'
  | 'onChange'
  | 'pattern'
  | 'type'
  | 'value'
> & {
  readonly id?: string
  readonly name?: string
  readonly onChange?: ChangeEventHandler<HTMLInputElement>
}

export interface DatePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> {
  readonly label: ReactNode
  readonly inputProps?: DatePickerInputProps
  readonly date?: string
  readonly defaultDate?: string
  readonly minDate?: string
  readonly maxDate?: string
  readonly defaultMonth?: string
  readonly onDateChange?: (date: string) => void
}

const ROOT_CLASS = 'pathable-date-picker usa-date-picker'
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

const INVALID_DATE_MESSAGE = 'Please enter a valid date'

export function DatePicker({
  label,
  inputProps = {},
  date,
  defaultDate = '',
  minDate,
  maxDate,
  defaultMonth,
  onDateChange,
  className,
  onBlur: consumerOnBlur,
  ...rootProps
}: DatePickerProps) {
  const generatedId = useId()
  const inputId = inputProps.id ?? generatedId
  const labelId = `${inputId}-label`
  const calendarId = `${inputId}-calendar`
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [internalDate, setInternalDate] = useState(defaultDate)
  const selectedDate = date ?? internalDate
  const initialMonth =
    parseISODate(defaultMonth) ??
    parseISODate(selectedDate) ??
    parseISODate(minDate) ??
    firstDayOfMonth(new Date())
  const [calendarMonth, setCalendarMonth] = useState(
    firstDayOfMonth(initialMonth),
  )
  const [activeDate, setActiveDate] = useState(
    selectedDate || toISODate(initialMonth),
  )
  const [isOpen, setIsOpen] = useState(false)
  const [focusCalendar, setFocusCalendar] = useState(false)
  const [calendarView, setCalendarView] = useState<CalendarView>('date')
  const [draftText, setDraftText] = useState(formatDisplayDate(selectedDate))
  const [isDirty, setIsDirty] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const locale =
    typeof document !== 'undefined' && document.documentElement.lang
      ? document.documentElement.lang
      : 'en-US'
  const {
    id: _id,
    name,
    form,
    className: inputClassName,
    disabled = false,
    readOnly = false,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    onClick,
    'aria-invalid': consumerAriaInvalid,
    'aria-labelledby': consumerAriaLabelledBy,
    ...nativeInputProps
  } = inputProps
  const rootClassName = [
    ROOT_CLASS,
    INITIALIZED_CLASS,
    isOpen ? ACTIVE_CLASS : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const inputClassNames = [EXTERNAL_INPUT_CLASS, inputClassName]
    .filter(Boolean)
    .join(' ')
  const inputValue =
    isDirty || isInvalid ? draftText : formatDisplayDate(selectedDate)
  const dateIsInvalid = (value: string) =>
    Boolean(
      value &&
      (!parseISODate(value) ||
        (minDate && value < minDate) ||
        (maxDate && value > maxDate)),
    )
  const selectedDateIsInvalid = dateIsInvalid(selectedDate)
  const inputIsInvalid = isInvalid || selectedDateIsInvalid
  const effectiveDate = isDirty ? parseDraft(draftText) : selectedDate
  const closedCalendarDate =
    parseISODate(selectedDate) ?? parseISODate(defaultMonth) ?? initialMonth
  const displayedMonth = isOpen
    ? calendarMonth
    : firstDayOfMonth(closedCalendarDate)
  const displayedActiveDate = isOpen
    ? activeDate
    : toISODate(closedCalendarDate)

  useEffect(() => {
    if (!isDirty) {
      inputRef.current?.setCustomValidity(
        selectedDateIsInvalid ? INVALID_DATE_MESSAGE : '',
      )
    }
  }, [isDirty, selectedDateIsInvalid])

  function parseDraft(text: string) {
    if (!text) return ''

    const parsedDate = parseDisplayDate(text)
    const value = parsedDate ? toISODate(parsedDate) : ''
    const violatesBounds = Boolean(
      value && ((minDate && value < minDate) || (maxDate && value > maxDate)),
    )
    return !value || violatesBounds ? null : value
  }

  const applyDate = (nextDate: string) => {
    const committedDate = date === undefined ? nextDate : selectedDate
    inputRef.current?.setCustomValidity(
      dateIsInvalid(committedDate) ? INVALID_DATE_MESSAGE : '',
    )
    if (date === undefined) setInternalDate(nextDate)
    setDraftText(formatDisplayDate(nextDate))
    setIsDirty(false)
    setIsInvalid(false)
    if (nextDate !== selectedDate) onDateChange?.(nextDate)
  }

  const commitDraft = () => {
    const nextDate = isDirty ? parseDraft(draftText) : selectedDate
    if (nextDate === null || dateIsInvalid(nextDate)) {
      inputRef.current?.setCustomValidity(INVALID_DATE_MESSAGE)
      setIsInvalid(true)
      return false
    }

    applyDate(nextDate)
    return true
  }

  const restoreCommittedDate = () => {
    inputRef.current?.setCustomValidity(
      selectedDateIsInvalid ? INVALID_DATE_MESSAGE : '',
    )
    setDraftText(formatDisplayDate(selectedDate))
    setIsDirty(false)
    setIsInvalid(false)
  }

  const openCalendar = (shouldFocusCalendar = false) => {
    if (disabled || readOnly) return

    const draftDate = isDirty ? parseDraft(draftText) : selectedDate
    const nextDate = constrainDate(
      parseISODate(draftDate ?? undefined) ??
        parseISODate(selectedDate) ??
        parseISODate(defaultMonth) ??
        initialMonth,
      minDate,
      maxDate,
    )
    setCalendarMonth(firstDayOfMonth(nextDate))
    setActiveDate(toISODate(nextDate))
    setCalendarView('date')
    setFocusCalendar(shouldFocusCalendar)
    setIsOpen(true)
  }

  const closeCalendar = (restoreFocus = false) => {
    commitDraft()
    setFocusCalendar(false)
    setIsOpen(false)
    setCalendarView('date')
    if (restoreFocus) inputRef.current?.focus()
  }

  const cancelAndClose = (restoreFocus = false) => {
    restoreCommittedDate()
    setFocusCalendar(false)
    setIsOpen(false)
    setCalendarView('date')
    if (restoreFocus) inputRef.current?.focus()
  }

  const selectDate = (value: string) => {
    if (readOnly) {
      cancelAndClose(true)
      return
    }
    if ((minDate && value < minDate) || (maxDate && value > maxDate)) return

    applyDate(value)
    setFocusCalendar(false)
    setIsOpen(false)
    setCalendarView('date')
    inputRef.current?.focus()
  }

  const handleRootBlur: FocusEventHandler<HTMLDivElement> = (event) => {
    consumerOnBlur?.(event)
    const nextTarget = event.relatedTarget
    if (!nextTarget || !rootRef.current?.contains(nextTarget)) {
      commitDraft()
      setFocusCalendar(false)
      setIsOpen(false)
      setCalendarView('date')
    }
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange?.(event)
    if (readOnly) return

    const nextText = event.currentTarget.value
    event.currentTarget.setCustomValidity(
      nextText && parseDraft(nextText) === null ? INVALID_DATE_MESSAGE : '',
    )
    setDraftText(nextText)
    setIsDirty(true)
    setIsInvalid(false)
  }

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    onFocus?.(event)
  }

  const handleClick: MouseEventHandler<HTMLInputElement> = (event) => {
    onClick?.(event)
    if (!event.defaultPrevented && !isOpen) openCalendar()
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    if (event.key === 'Escape') {
      cancelAndClose()
      event.preventDefault()
      return
    }
    if (event.key === 'Enter') {
      if (!commitDraft()) event.preventDefault()
    }
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
      <label className="pathable-label" htmlFor={inputId} id={labelId}>
        {label}
      </label>
      <div className={WRAPPER_CLASS}>
        <input
          {...nativeInputProps}
          ref={inputRef}
          id={inputId}
          className={inputClassNames}
          type="text"
          form={form}
          value={inputValue}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder ?? 'MM/DD/YYYY'}
          pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
          role="combobox"
          aria-labelledby={[labelId, consumerAriaLabelledBy]
            .filter(Boolean)
            .join(' ')}
          aria-haspopup="dialog"
          aria-controls={calendarId}
          aria-expanded={isOpen}
          aria-invalid={inputIsInvalid || consumerAriaInvalid || undefined}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={handleFocus}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className={BUTTON_CLASS}
          aria-label="Toggle date calendar"
          aria-haspopup="dialog"
          aria-controls={calendarId}
          aria-expanded={isOpen}
          disabled={disabled || readOnly}
          onClick={() => {
            if (isOpen) {
              closeCalendar(true)
              return
            }
            openCalendar(true)
          }}
        />
        <DatePickerCalendar
          calendarId={calendarId}
          calendarLabel="Date calendar"
          month={displayedMonth}
          focusActiveDate={isOpen && focusCalendar}
          activeDate={displayedActiveDate}
          selectedDates={effectiveDate ? [effectiveDate] : []}
          minDate={minDate}
          maxDate={maxDate}
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
          onClose={() => cancelAndClose(true)}
          locale={locale}
          hidden={!isOpen}
        />
        <div className={STATUS_CLASS} role="status" aria-live="polite">
          {inputIsInvalid ? INVALID_DATE_MESSAGE : null}
        </div>
      </div>
      <input
        className={INTERNAL_INPUT_CLASS}
        type="hidden"
        disabled={disabled}
        form={form}
        name={name}
        value={selectedDateIsInvalid ? '' : selectedDate}
        readOnly
      />
    </div>
  )
}
