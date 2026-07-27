import type { ReactNode, SelectHTMLAttributes } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children?: ReactNode
}

const BASE_CLASS = 'pathable-select'

export function Select({ children, className, ...rest }: SelectProps) {
  const combinedClassName = `${BASE_CLASS} ${className || ''}`.trim()

  return (
    <select className={combinedClassName} {...rest}>
      {children}
    </select>
  )
}
