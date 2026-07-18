import { HTMLAttributes, ReactNode } from 'react'

interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function ButtonGroup({
  children,
  className,
  ...rest
}: ButtonGroupProps) {
  const classes = ['pathable-button-group', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}
