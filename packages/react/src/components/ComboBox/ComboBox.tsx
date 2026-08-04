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
  type SelectHTMLAttributes,
} from 'react'

export interface ComboBoxOption {
  readonly value: string
  readonly label: string
  readonly disabled?: boolean
}

export type ComboBoxSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'children' | 'className'
>

export type ComboBoxInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'defaultValue' | 'id' | 'onChange' | 'type' | 'value'
>

export interface ComboBoxProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> {
  readonly label: ReactNode
  readonly options: readonly ComboBoxOption[]
  readonly selectProps?: ComboBoxSelectProps
  readonly inputProps?: ComboBoxInputProps
  readonly disableFiltering?: boolean
}

const ROOT_CLASS = 'pathable-combo-box usa-combo-box'
const PRISTINE_CLASS = 'pathable-combo-box--pristine usa-combo-box--pristine'
const INPUT_CLASS = 'pathable-combo-box__input usa-combo-box__input'
const SELECT_CLASS = 'pathable-combo-box__select usa-combo-box__select'
const CLEAR_INPUT_CLASS =
  'pathable-combo-box__clear-input usa-combo-box__clear-input'
const CLEAR_INPUT_WRAPPER_CLASS =
  'pathable-combo-box__clear-input__wrapper usa-combo-box__clear-input__wrapper'
const SEPARATOR_CLASS =
  'pathable-combo-box__input-button-separator usa-combo-box__input-button-separator'
const TOGGLE_LIST_CLASS =
  'pathable-combo-box__toggle-list usa-combo-box__toggle-list'
const TOGGLE_LIST_WRAPPER_CLASS =
  'pathable-combo-box__toggle-list__wrapper usa-combo-box__toggle-list__wrapper'
const LIST_CLASS = 'pathable-combo-box__list usa-combo-box__list'
const LIST_OPTION_CLASS =
  'pathable-combo-box__list-option usa-combo-box__list-option'
const LIST_OPTION_FOCUSED_CLASS =
  'pathable-combo-box__list-option--focused usa-combo-box__list-option--focused'
const LIST_OPTION_SELECTED_CLASS =
  'pathable-combo-box__list-option--selected usa-combo-box__list-option--selected'
const NO_RESULTS_CLASS =
  'pathable-combo-box__list-option--no-results usa-combo-box__list-option--no-results'
const STATUS_CLASS = 'pathable-combo-box__status pathable-sr-only'
const LABEL_CLASS = 'pathable-label'

const firstEnabledIndex = (options: readonly ComboBoxOption[]) =>
  options.findIndex((option) => !option.disabled)

export function ComboBox({
  label,
  options,
  selectProps = {},
  inputProps = {},
  disableFiltering = false,
  className,
  onBlur: consumerOnBlur,
  ...rootProps
}: ComboBoxProps) {
  const generatedId = useId()
  const {
    id = generatedId,
    defaultValue,
    value,
    disabled = false,
    required = false,
    onChange,
    ...nativeSelectProps
  } = selectProps
  const {
    className: inputClassName,
    onClick: consumerOnClick,
    onFocus: consumerOnFocus,
    onKeyDown: consumerOnKeyDown,
    placeholder,
    ...nativeInputProps
  } = inputProps
  const inputRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = `${id}-list`
  const labelId = `${id}-label`
  const [uncontrolledValue, setUncontrolledValue] = useState(
    value ?? defaultValue ?? '',
  )
  const selectedValue = value ?? uncontrolledValue
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  )
  const selectedLabel = selectedOption?.label ?? ''
  const [query, setQuery] = useState(selectedLabel)
  const [isPristine, setIsPristine] = useState(Boolean(selectedValue))
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const getVisibleOptions = (query: string, pristine = isPristine) => {
    const nonPlaceholderOptions = options.filter((option) => option.value)

    if (disableFiltering || pristine || !query.trim()) {
      return nonPlaceholderOptions
    }

    const normalizedQuery = query.trim().toLowerCase()
    return nonPlaceholderOptions.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    )
  }

  const visibleOptions = getVisibleOptions(query)
  const activeOption = visibleOptions[activeIndex]
  const rootClassName = [ROOT_CLASS, className].filter(Boolean).join(' ')
  const inputClasses = [INPUT_CLASS, inputClassName].filter(Boolean).join(' ')
  const rootStateClass = (isOpen ? isPristine : Boolean(selectedValue))
    ? PRISTINE_CLASS
    : ''
  const selectChangeHandler = onChange ?? (() => undefined)

  const dispatchChange = (nextValue: string) => {
    if (value === undefined) {
      setUncontrolledValue(nextValue)
    }

    const select = selectRef.current
    if (select) {
      select.value = nextValue
      select.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  const selectOption = (option: ComboBoxOption) => {
    if (option.disabled) return

    dispatchChange(option.value)
    setQuery(option.label)
    setIsPristine(true)
    setIsOpen(false)
    setActiveIndex(-1)
    inputRef.current?.focus()
  }

  const resetSelection = () => {
    setQuery(selectedLabel)
    setIsPristine(Boolean(selectedValue))
  }

  const openList = () => {
    if (disabled) return

    const nextQuery = selectedLabel
    const nextPristine = Boolean(selectedValue)
    const nextOptions = getVisibleOptions(nextQuery, nextPristine)
    setQuery(nextQuery)
    setIsPristine(nextPristine)
    const selectedIndex = nextOptions.findIndex(
      (option) => option.value === selectedValue,
    )
    setActiveIndex(
      selectedIndex >= 0 ? selectedIndex : firstEnabledIndex(nextOptions),
    )
    setIsOpen(true)
  }

  const moveActiveOption = (direction: 1 | -1) => {
    const nextOptions = getVisibleOptions(query)
    if (!nextOptions.length) return

    let nextIndex = activeIndex
    for (let count = 0; count < nextOptions.length; count += 1) {
      nextIndex += direction
      if (nextIndex < 0) nextIndex = nextOptions.length - 1
      if (nextIndex >= nextOptions.length) nextIndex = 0
      if (!nextOptions[nextIndex].disabled) {
        setActiveIndex(nextIndex)
        return
      }
    }
  }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const nextValue = event.currentTarget.value
    const nextOptions = getVisibleOptions(nextValue, false)

    setQuery(nextValue)
    setIsPristine(false)
    setIsOpen(true)
    setActiveIndex(firstEnabledIndex(nextOptions))
  }

  const handleInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    consumerOnKeyDown?.(event)
    if (event.defaultPrevented) return

    if (event.key === 'ArrowDown') {
      if (!isOpen) openList()
      moveActiveOption(1)
      event.preventDefault()
      return
    }

    if (event.key === 'ArrowUp') {
      if (!isOpen) openList()
      moveActiveOption(-1)
      event.preventDefault()
      return
    }

    if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
      resetSelection()
      event.preventDefault()
      return
    }

    if (event.key === 'Enter' && isOpen) {
      const exactMatch = visibleOptions.find(
        (option) => option.label.toLowerCase() === query.toLowerCase(),
      )
      const optionToSelect = activeOption ?? exactMatch
      if (optionToSelect) selectOption(optionToSelect)
      setIsOpen(false)
      event.preventDefault()
    }
  }

  const handleRootBlur: FocusEventHandler<HTMLDivElement> = (event) => {
    consumerOnBlur?.(event)
    const nextTarget = event.relatedTarget
    if (!nextTarget || !rootRef.current?.contains(nextTarget)) {
      setIsOpen(false)
      setActiveIndex(-1)
      resetSelection()
    }
  }

  const handleInputFocus = (event: FocusEvent<HTMLInputElement>) => {
    consumerOnFocus?.(event)
    openList()
  }

  const handleInputClick: MouseEventHandler<HTMLInputElement> = (event) => {
    consumerOnClick?.(event)
    if (!isOpen) openList()
  }

  const handleToggleClick = () => {
    if (isOpen) {
      setIsOpen(false)
      setActiveIndex(-1)
    } else {
      openList()
      inputRef.current?.focus()
    }
  }

  const handleClearClick = () => {
    dispatchChange('')
    setQuery('')
    setIsPristine(false)
    inputRef.current?.focus()
    if (!isOpen) {
      setActiveIndex(firstEnabledIndex(getVisibleOptions('', false)))
      setIsOpen(true)
    }
  }

  // The optional global USWDS bundle skips this React-owned subtree.
  return (
    <div
      {...rootProps}
      ref={rootRef}
      className={[rootClassName, rootStateClass].filter(Boolean).join(' ')}
      onBlur={handleRootBlur}
      data-disable-filtering={disableFiltering ? 'true' : undefined}
      data-react-owned="true"
    >
      <label className={LABEL_CLASS} htmlFor={id} id={labelId}>
        {label}
      </label>
      <select
        {...nativeSelectProps}
        ref={selectRef}
        id={`${id}-native`}
        className={SELECT_CLASS}
        value={selectedValue}
        disabled={disabled}
        required={required}
        aria-hidden="true"
        tabIndex={-1}
        onChange={selectChangeHandler}
      >
        <option value="" />
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <input
        {...nativeInputProps}
        ref={inputRef}
        id={id}
        className={inputClasses}
        type="text"
        role="combobox"
        value={isOpen ? query : selectedLabel}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        aria-labelledby={labelId}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-activedescendant={
          activeOption ? `${listId}-option-${activeIndex}` : undefined
        }
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onClick={handleInputClick}
        onKeyDown={handleInputKeyDown}
      />
      <span className={CLEAR_INPUT_WRAPPER_CLASS} tabIndex={-1}>
        <button
          type="button"
          className={CLEAR_INPUT_CLASS}
          aria-label="Clear the select contents"
          disabled={disabled || !(isOpen ? query : selectedLabel)}
          onClick={handleClearClick}
        >
          &nbsp;
        </button>
      </span>
      <span className={SEPARATOR_CLASS} aria-hidden="true">
        &nbsp;
      </span>
      <span className={TOGGLE_LIST_WRAPPER_CLASS} tabIndex={-1}>
        <button
          type="button"
          tabIndex={-1}
          className={TOGGLE_LIST_CLASS}
          aria-label="Toggle the dropdown list"
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={handleToggleClick}
        >
          &nbsp;
        </button>
      </span>
      <ul
        id={listId}
        className={LIST_CLASS}
        role="listbox"
        aria-labelledby={labelId}
        hidden={!isOpen}
      >
        {visibleOptions.length ? (
          visibleOptions.map((option, index) => {
            const optionId = `${listId}-option-${index}`
            const isActive = index === activeIndex
            const isSelected = option.value === selectedValue
            const optionClassName = [
              LIST_OPTION_CLASS,
              isActive ? LIST_OPTION_FOCUSED_CLASS : '',
              isSelected ? LIST_OPTION_SELECTED_CLASS : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <li
                key={option.value}
                id={optionId}
                className={optionClassName}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                aria-setsize={visibleOptions.length}
                aria-posinset={index + 1}
                tabIndex={-1}
                onMouseDown={(event) => event.preventDefault()}
                onMouseOver={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    selectOption(option)
                    event.preventDefault()
                  }
                }}
                onClick={() => selectOption(option)}
              >
                {option.label}
              </li>
            )
          })
        ) : (
          <li
            className={NO_RESULTS_CLASS}
            role="option"
            aria-disabled="true"
            aria-selected="false"
          >
            No results found
          </li>
        )}
      </ul>
      <div className={STATUS_CLASS} role="status" aria-live="polite">
        {isOpen
          ? visibleOptions.length
            ? `${visibleOptions.length} result${visibleOptions.length === 1 ? '' : 's'} available.`
            : 'No results.'
          : null}
      </div>
    </div>
  )
}
