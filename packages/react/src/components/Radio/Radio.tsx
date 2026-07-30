import type { InputHTMLAttributes, ReactNode } from 'react'

export type RadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'className' | 'type'
> & {
  children: ReactNode
  description?: ReactNode
  className?: string
}

const ROOT_CLASS = 'pathable-radio'
const INPUT_CLASS = 'pathable-radio__input'
const LABEL_CLASS = 'pathable-radio__label'
const DESCRIPTION_CLASS = 'pathable-radio__label-description'

export function Radio({
  children,
  className,
  description,
  ...inputProps
}: RadioProps) {
  const rootClassName = `${ROOT_CLASS} ${className || ''}`.trim()

  return (
    <label className={rootClassName}>
      <input className={INPUT_CLASS} type="radio" {...inputProps} />
      <span className={LABEL_CLASS}>
        {children}
        {description !== undefined && description !== null ? (
          <span className={DESCRIPTION_CLASS}>{description}</span>
        ) : null}
      </span>
    </label>
  )
}
