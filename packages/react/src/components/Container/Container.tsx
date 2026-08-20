import React, { ReactNode, ElementType, forwardRef } from 'react'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'

export type ContainerSize = 'standard' | 'wide' | 'full'

const CONTAINER_SIZE_CLASS: Record<ContainerSize, string> = {
  standard: 'pathable-container--standard',
  wide: 'pathable-container--wide',
  full: 'pathable-container--full',
}

export interface ContainerProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'color'
> {
  as?: ElementType
  size?: ContainerSize
  children?: ReactNode
  className?: string
}

function ContainerInner(
  { as, size, children, className = '', ...rest }: ContainerProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const Component = as ?? 'div'
  const modifierClass = size ? CONTAINER_SIZE_CLASS[size] : undefined
  const classes = mergeClasses('pathable-container', modifierClass, className)

  return (
    <Component className={classes} ref={ref} {...rest}>
      {children}
    </Component>
  )
}

export const Container = forwardRef<HTMLElement, ContainerProps>(ContainerInner)
