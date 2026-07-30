import type { LabelHTMLAttributes, ReactNode } from 'react'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children?: ReactNode
}

const BASE_CLASS = 'pathable-label'

export function Label({ children, className, ...rest }: LabelProps) {
  const combinedClassName = `${BASE_CLASS} ${className || ''}`.trim()

  return (
    <label className={combinedClassName} {...rest}>
      {children}
    </label>
  )
}
