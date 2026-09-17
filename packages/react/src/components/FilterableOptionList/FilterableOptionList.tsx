'use client'

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FieldsetHTMLAttributes,
  type ReactNode,
} from 'react'
import { registerFormGroupCompositeControl } from '../../internal/form-group-control.js'
import { Checkbox } from '../Checkbox/Checkbox.js'
import { Input } from '../Input/Input.js'
import { Label } from '../Label/Label.js'

export interface FilterableOption {
  readonly id: string
  readonly label: string
  readonly description?: ReactNode
  readonly meta?: ReactNode
  readonly disabled?: boolean
}

export type FilterableOptionPredicate = (
  option: FilterableOption,
  query: string,
) => boolean

export interface FilterableOptionListProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'children' | 'dangerouslySetInnerHTML' | 'defaultValue' | 'onChange' | 'value'
> {
  readonly children?: never
  readonly dangerouslySetInnerHTML?: never
  readonly legend: ReactNode
  readonly options: readonly FilterableOption[]
  readonly values?: readonly string[]
  readonly defaultValues?: readonly string[]
  readonly onValuesChange?: (values: readonly string[]) => void
  readonly filterable?: boolean
  readonly filterMode?: 'client' | 'external'
  readonly query?: string
  readonly defaultQuery?: string
  readonly onQueryChange?: (query: string) => void
  readonly filterOption?: FilterableOptionPredicate
  readonly filterLabel?: ReactNode
  readonly filterPlaceholder?: string
  readonly name?: string
  readonly emptyMessage?: ReactNode
  readonly noMatchesMessage?: ReactNode
}

const ROOT_CLASS = 'pathable-filterable-option-list'
const FIELDSET_CLASS = 'pathable-fieldset'

function unique(values: readonly string[]) {
  return Array.from(new Set(values))
}

function encodeOptionId(value: string) {
  return Array.from(value, (character) =>
    character.codePointAt(0)!.toString(36),
  ).join('-')
}

function validateOptions(options: readonly FilterableOption[]) {
  const ids = new Set<string>()

  for (const option of options) {
    if (!option.id.trim()) {
      throw new Error('FilterableOptionList option ids must be non-empty.')
    }
    if (!option.label.trim()) {
      throw new Error('FilterableOptionList option labels must be non-empty.')
    }
    if (ids.has(option.id)) {
      throw new Error(
        `FilterableOptionList option ids must be unique. Duplicate id: "${option.id}".`,
      )
    }
    ids.add(option.id)
  }
}

export function FilterableOptionList({
  legend,
  options,
  values,
  defaultValues = [],
  onValuesChange,
  filterable = true,
  filterMode = 'client',
  query,
  defaultQuery = '',
  onQueryChange,
  filterOption,
  filterLabel = 'Filter options',
  filterPlaceholder,
  name,
  emptyMessage = 'No options available.',
  noMatchesMessage = 'No matches.',
  className,
  disabled = false,
  form,
  ...rest
}: FilterableOptionListProps) {
  validateOptions(options)

  const runtimeFieldsetAttributes = {
    ...rest,
  } as FieldsetHTMLAttributes<HTMLFieldSetElement>
  delete runtimeFieldsetAttributes.children
  delete runtimeFieldsetAttributes.dangerouslySetInnerHTML
  const generatedId = useId()
  const rootRef = useRef<HTMLFieldSetElement>(null)
  const [, setResetVersion] = useState(0)
  const [uncontrolledValues, setUncontrolledValues] = useState(() =>
    unique(defaultValues),
  )
  const [uncontrolledQuery, setUncontrolledQuery] = useState(defaultQuery)
  const selectedValues = unique(values ?? uncontrolledValues)
  const selectedIds = new Set(selectedValues)
  const currentQuery = query ?? uncontrolledQuery
  const normalizedQuery = currentQuery.trim().toLowerCase()
  const hasQuery = filterable && normalizedQuery.length > 0
  const rootClassName = [FIELDSET_CLASS, ROOT_CLASS, className]
    .filter(Boolean)
    .join(' ')
  const filterId = `${generatedId}-filter`

  const visibleOptions =
    !filterable || filterMode === 'external' || !hasQuery
      ? options
      : options.filter((option) =>
          filterOption
            ? filterOption(option, currentQuery)
            : option.label.toLowerCase().includes(normalizedQuery),
        )

  const empty = visibleOptions.length === 0
  const noMatches = empty && hasQuery
  const resultText = noMatches
    ? 'no matches'
    : empty
      ? 'no options available'
      : `${visibleOptions.length} ${visibleOptions.length === 1 ? 'match' : 'matches'}`
  const statusText = `${selectedValues.length} selected, ${resultText}`

  useEffect(() => {
    const ownerDocument = rootRef.current?.ownerDocument
    if (!ownerDocument) return
    let active = true

    const reset = (event: Event) => {
      if (event.target !== rootRef.current?.form) return

      queueMicrotask(() => {
        if (!active || event.defaultPrevented) return
        if (values === undefined) setUncontrolledValues(unique(defaultValues))
        if (query === undefined) {
          setUncontrolledQuery(defaultQuery)
          onQueryChange?.(defaultQuery)
        }
        if (values !== undefined || query !== undefined) {
          setResetVersion((version) => version + 1)
        }
      })
    }

    ownerDocument.addEventListener('reset', reset)
    return () => {
      active = false
      ownerDocument.removeEventListener('reset', reset)
    }
  }, [defaultQuery, defaultValues, form, onQueryChange, query, values])

  const changeQuery = (nextQuery: string) => {
    if (query === undefined) setUncontrolledQuery(nextQuery)
    onQueryChange?.(nextQuery)
  }

  const toggleOption = (option: FilterableOption) => {
    if (disabled || option.disabled) return

    const nextValues = selectedIds.has(option.id)
      ? selectedValues.filter((id) => id !== option.id)
      : [...selectedValues, option.id]

    if (values === undefined) setUncontrolledValues(nextValues)
    onValuesChange?.([...nextValues])
  }

  return (
    <fieldset
      {...runtimeFieldsetAttributes}
      ref={rootRef}
      className={rootClassName}
      disabled={disabled}
      form={form}
    >
      <legend className="pathable-legend">{legend}</legend>

      {filterable ? (
        <div className={`${ROOT_CLASS}__filter`}>
          <Label htmlFor={filterId}>{filterLabel}</Label>
          <Input
            id={filterId}
            className={`${ROOT_CLASS}__filter-input`}
            type="search"
            value={currentQuery}
            placeholder={filterPlaceholder}
            onChange={(event) => changeQuery(event.currentTarget.value)}
          />
        </div>
      ) : null}

      <p
        className={`${ROOT_CLASS}__status`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {statusText}
      </p>

      {empty ? (
        <p className={`${ROOT_CLASS}__empty`}>
          {noMatches ? noMatchesMessage : emptyMessage}
        </p>
      ) : (
        <ul className={`pathable-checkbox__list ${ROOT_CLASS}__options`}>
          {visibleOptions.map((option) => {
            const optionId = `${generatedId}-option-${encodeOptionId(option.id)}`
            const hasDetails =
              option.description !== undefined || option.meta !== undefined
            const detailsId = hasDetails ? `${optionId}-details` : undefined

            return (
              <li className={`${ROOT_CLASS}__option`} key={option.id}>
                <Checkbox
                  id={optionId}
                  checked={selectedIds.has(option.id)}
                  disabled={disabled || option.disabled}
                  aria-describedby={detailsId}
                  onChange={() => toggleOption(option)}
                >
                  {option.label}
                </Checkbox>
                {hasDetails ? (
                  <span className={`${ROOT_CLASS}__details`} id={detailsId}>
                    {option.description !== undefined ? (
                      <span className={`${ROOT_CLASS}__description`}>
                        {option.description}
                      </span>
                    ) : null}
                    {option.meta !== undefined ? (
                      <span className={`${ROOT_CLASS}__meta`}>
                        {option.meta}
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}

      {name
        ? selectedValues.map((selectedValue) => (
            <input
              key={selectedValue}
              type="hidden"
              name={name}
              value={selectedValue}
              form={form}
            />
          ))
        : null}
    </fieldset>
  )
}

registerFormGroupCompositeControl(FilterableOptionList)
