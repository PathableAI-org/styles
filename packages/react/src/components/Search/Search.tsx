import { useId } from 'react'
import type { FormHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

import { Button } from '../Button/Button'
import { Input } from '../Input/Input'

export type SearchSize = 'default' | 'big'

export type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'id' | 'type'
> & {
  readonly id?: string
}

export interface SearchProps extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'children' | 'role'
> {
  readonly size?: SearchSize
  readonly label: ReactNode
  readonly buttonLabel?: ReactNode
  readonly inputProps?: SearchInputProps
}

const ROOT_CLASS = 'pathable-search'
const BIG_CLASS = 'pathable-search--big'
const SCREEN_READER_ONLY_CLASS = 'pathable-sr-only'
const SUBMIT_TEXT_CLASS = 'usa-search__submit-text'

export function Search({
  size = 'default',
  label,
  buttonLabel = 'Search',
  inputProps = {},
  className,
  ...formProps
}: SearchProps) {
  const generatedInputId = useId()
  const { id = generatedInputId, ...nativeInputProps } = inputProps
  const rootClassName = [ROOT_CLASS, size === 'big' ? BIG_CLASS : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <form className={rootClassName} role="search" {...formProps}>
      <label className={SCREEN_READER_ONLY_CLASS} htmlFor={id}>
        {label}
      </label>
      <Input id={id} type="search" {...nativeInputProps} />
      <Button type="submit">
        <svg
          className="pathable-icon"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        {size === 'big' ? (
          <span className={SUBMIT_TEXT_CLASS} aria-hidden="true">
            {buttonLabel}
          </span>
        ) : null}
        <span className={SCREEN_READER_ONLY_CLASS}>{buttonLabel}</span>
      </Button>
    </form>
  )
}
