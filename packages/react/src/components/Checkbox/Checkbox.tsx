import type { InputHTMLAttributes, ReactNode } from 'react'

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'className' | 'type'
> & {
  children: ReactNode
  description?: ReactNode
  className?: string
}

const ROOT_CLASS = 'pathable-checkbox'
const INPUT_CLASS = 'pathable-checkbox__input'
const LABEL_CLASS = 'pathable-checkbox__label'
const DESCRIPTION_CLASS = 'pathable-checkbox__label-description'

export function Checkbox({
  children,
  className,
  description,
  ...inputProps
}: CheckboxProps) {
  const rootClassName = `${ROOT_CLASS} ${className || ''}`.trim()

  return (
    <label className={rootClassName}>
      <input className={INPUT_CLASS} type="checkbox" {...inputProps} />
      <span className={LABEL_CLASS}>
        {children}
        {description !== undefined && description !== null ? (
          <span className={DESCRIPTION_CLASS}>{description}</span>
        ) : null}
      </span>
    </label>
  )
}
