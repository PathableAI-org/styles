import type { HTMLAttributes } from 'react'

export type FormGroupProps = HTMLAttributes<HTMLDivElement>

const BASE_CLASS = 'pathable-form-group'

export function FormGroup({ children, className, ...rest }: FormGroupProps) {
  const combinedClassName = `${BASE_CLASS} ${className || ''}`.trim()

  return (
    <div className={combinedClassName} {...rest}>
      {children}
    </div>
  )
}
