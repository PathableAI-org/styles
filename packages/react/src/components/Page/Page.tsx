import React, { ReactNode, ElementType, forwardRef } from 'react'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'

export type PageSize = 'standard' | 'wide' | 'full'
export type PageGap = 'sm' | 'md' | 'lg' | 'xl'

const SIZE_CLASS: Record<PageSize, string> = {
  standard: 'pathable-container--standard',
  wide: 'pathable-container--wide',
  full: 'pathable-container--full',
}

const GAP_CLASS: Record<PageGap, string> = {
  sm: 'pathable-stack--gap-sm',
  md: 'pathable-stack--gap-md',
  lg: 'pathable-stack--gap-lg',
  xl: 'pathable-stack--gap-xl',
}

export interface PageProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'color'
> {
  size?: PageSize
  gap?: PageGap
  as?: ElementType
  className?: string
  children?: ReactNode
}

function PageInner(
  {
    size = 'standard',
    gap = 'md',
    as,
    children,
    className = '',
    ...rest
  }: PageProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const Component = as ?? 'main'
  const containerClasses = mergeClasses(
    'pathable-container',
    SIZE_CLASS[size],
    className,
  )
  const stackClasses = mergeClasses('pathable-stack', GAP_CLASS[gap])

  return (
    <Component className={containerClasses} ref={ref} {...rest}>
      <div className={stackClasses}>{children}</div>
    </Component>
  )
}

export const Page = forwardRef<HTMLElement, PageProps>(PageInner)
