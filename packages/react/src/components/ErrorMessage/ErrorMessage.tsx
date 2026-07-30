import type { HTMLAttributes, ReactNode } from 'react'

export type ErrorMessageProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children'
> & {
  children: ReactNode
}

const BASE_CLASS = 'pathable-error-message'

export function ErrorMessage({
  children,
  className,
  ...rest
}: ErrorMessageProps) {
  const combinedClassName = `${BASE_CLASS} ${className || ''}`.trim()

  return (
    <span className={combinedClassName} {...rest}>
      {children}
    </span>
  )
}
