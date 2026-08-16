import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
} from 'react'

export type SegmentedControlOrientation = 'horizontal' | 'vertical'

export type SegmentedControlButtonAttributes = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'aria-checked'
  | 'aria-pressed'
  | 'children'
  | 'className'
  | 'disabled'
  | 'onClick'
  | 'role'
  | 'type'
>

export type SegmentedControlOption = {
  readonly value: string
  readonly label: ReactNode
  readonly icon?: ReactNode
  readonly disabled?: boolean
  readonly className?: string
  readonly attributes?: SegmentedControlButtonAttributes
}

type SegmentedControlBaseProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> & {
  readonly orientation?: SegmentedControlOrientation
}

export type SegmentedControlSingleProps = SegmentedControlBaseProps & {
  readonly mode?: 'single'
  readonly options: readonly SegmentedControlOption[]
  readonly value: string
  readonly onValueChange?: (value: string) => void
}

export type SegmentedControlMultiProps = SegmentedControlBaseProps & {
  readonly mode: 'multi'
  readonly options: readonly SegmentedControlOption[]
  readonly values: readonly string[]
  readonly onValuesChange?: (values: readonly string[]) => void
}

export type SegmentedControlProps =
  SegmentedControlSingleProps | SegmentedControlMultiProps

const ROOT_CLASS = 'pathable-segmented-control'
const MULTI_CLASS = 'pathable-segmented-control--multi'
const VERTICAL_CLASS = 'pathable-segmented-control--vertical'
const OPTION_CLASS = 'pathable-segmented-control__option'
const SELECTED_CLASS = 'pathable-segmented-control__option--selected'
const OPTION_SELECTOR = '[data-segmented-control-option="true"]'

function getRootClassName({
  className,
  mode,
  orientation,
}: {
  readonly className?: string
  readonly mode: 'single' | 'multi'
  readonly orientation: SegmentedControlOrientation
}) {
  return [
    ROOT_CLASS,
    mode === 'multi' ? MULTI_CLASS : '',
    orientation === 'vertical' ? VERTICAL_CLASS : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

function getOptionClassName(className: string | undefined, selected: boolean) {
  return [OPTION_CLASS, selected ? SELECTED_CLASS : '', className]
    .filter(Boolean)
    .join(' ')
}

function getNextArrowDirection(key: string): 1 | -1 | 0 {
  if (key === 'ArrowRight' || key === 'ArrowDown') {
    return 1
  }

  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    return -1
  }

  return 0
}

function handleSingleKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  onValueChange: ((value: string) => void) | undefined,
) {
  const direction = getNextArrowDirection(event.key)

  if (direction === 0) {
    return
  }

  const buttons = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>(OPTION_SELECTOR),
  )
  const enabledButtons = buttons.filter((button) => !button.disabled)

  if (enabledButtons.length === 0) {
    return
  }

  event.preventDefault()

  const activeElement = event.currentTarget.ownerDocument.activeElement
  const checkedButton = enabledButtons.find(
    (button) => button.getAttribute('aria-checked') === 'true',
  )
  const currentButton = enabledButtons.includes(
    activeElement as HTMLButtonElement,
  )
    ? (activeElement as HTMLButtonElement)
    : (checkedButton ?? enabledButtons[0])
  const currentIndex = enabledButtons.indexOf(currentButton)
  const nextButton =
    enabledButtons[
      (currentIndex + direction + enabledButtons.length) % enabledButtons.length
    ]
  const nextValue = nextButton.dataset.segmentedControlValue

  if (nextValue) {
    onValueChange?.(nextValue)
  }

  nextButton.focus()
}

function renderOptionContent(option: SegmentedControlOption) {
  return (
    <>
      {option.icon}
      <span style={option.icon ? { marginLeft: 4 } : undefined}>
        {option.label}
      </span>
    </>
  )
}

function SegmentedControlSingle({
  options,
  value,
  onValueChange,
  orientation = 'horizontal',
  className,
  ...rest
}: SegmentedControlSingleProps) {
  const enabledOptions = options.filter((option) => !option.disabled)
  const selectedEnabled = enabledOptions.some(
    (option) => option.value === value,
  )
  const fallbackTabValue = selectedEnabled ? value : enabledOptions[0]?.value

  return (
    <div
      {...rest}
      className={getRootClassName({ className, mode: 'single', orientation })}
      role="radiogroup"
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      tabIndex={-1}
      onKeyDown={(event) => {
        rest.onKeyDown?.(event)
        if (!event.defaultPrevented) {
          handleSingleKeyDown(event, onValueChange)
        }
      }}
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            {...option.attributes}
            key={option.value}
            type="button"
            className={getOptionClassName(option.className, selected)}
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            tabIndex={option.value === fallbackTabValue ? 0 : -1}
            data-segmented-control-option="true"
            data-segmented-control-value={option.value}
            onClick={() => {
              if (!option.disabled) {
                onValueChange?.(option.value)
              }
            }}
          >
            {renderOptionContent(option)}
          </button>
        )
      })}
    </div>
  )
}

function SegmentedControlMulti({
  options,
  values,
  onValuesChange,
  orientation = 'horizontal',
  className,
  ...rest
}: SegmentedControlMultiProps) {
  return (
    <div
      {...rest}
      className={getRootClassName({ className, mode: 'multi', orientation })}
      role="group"
    >
      {options.map((option) => {
        const selected = values.includes(option.value)
        return (
          <button
            {...option.attributes}
            key={option.value}
            type="button"
            className={getOptionClassName(option.className, selected)}
            aria-pressed={selected}
            disabled={option.disabled}
            data-segmented-control-option="true"
            data-segmented-control-value={option.value}
            onClick={() => {
              if (option.disabled) {
                return
              }

              onValuesChange?.(
                selected
                  ? values.filter((item) => item !== option.value)
                  : [...values, option.value],
              )
            }}
          >
            {renderOptionContent(option)}
          </button>
        )
      })}
    </div>
  )
}

export function SegmentedControl(props: SegmentedControlProps) {
  if (props.mode === 'multi') {
    return <SegmentedControlMulti {...props} />
  }

  return <SegmentedControlSingle {...props} />
}
