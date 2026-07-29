import type { HTMLAttributes, ReactNode } from 'react'

export interface HintProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode
}

const BASE_CLASS = 'pathable-hint'

export function Hint({ children, className, ...rest }: HintProps) {
  const combinedClassName = `${BASE_CLASS} ${className || ''}`.trim()

  return (
    <span className={combinedClassName} {...rest}>
      {children}
    </span>
  )
}
