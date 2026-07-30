import type { FieldsetHTMLAttributes } from 'react'

export type FieldsetProps = FieldsetHTMLAttributes<HTMLFieldSetElement>

const BASE_CLASS = 'pathable-fieldset'

export function Fieldset({ children, className, ...rest }: FieldsetProps) {
  const combinedClassName = `${BASE_CLASS} ${className || ''}`.trim()

  return (
    <fieldset className={combinedClassName} {...rest}>
      {children}
    </fieldset>
  )
}
