import type { FormHTMLAttributes } from 'react'

export type FormProps = FormHTMLAttributes<HTMLFormElement>

const BASE_CLASS = 'pathable-form'

export function Form({ children, className, ...rest }: FormProps) {
  const combinedClassName = `${BASE_CLASS} ${className || ''}`.trim()

  return (
    <form className={combinedClassName} {...rest}>
      {children}
    </form>
  )
}
