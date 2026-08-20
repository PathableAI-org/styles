import type { ReactNode, SelectHTMLAttributes } from 'react'
import {
  SizingProps,
  widthClass,
  maxWidthClass,
} from '../../internal/resolvers/index.js'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>, SizingProps {
  children?: ReactNode
}

export function Select({
  width,
  maxWidth,
  children,
  className,
  ...rest
}: SelectProps) {
  const classes = mergeClasses(
    'pathable-select',
    widthClass(width),
    maxWidthClass(maxWidth),
    className,
  )

  return (
    <select className={classes} {...rest}>
      {children}
    </select>
  )
}
