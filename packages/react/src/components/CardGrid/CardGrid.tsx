import React, { ReactNode, ElementType, forwardRef } from 'react'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'

export type CardGridVariant = 'cluster' | 'auto-fit'

export type CardGridClusterGap = 'sm' | 'md' | 'lg' | 'xl'
export type CardGridAutoGap = 'sm' | 'md' | 'lg'

const CLUSTER_GAP_CLASS: Record<CardGridClusterGap, string> = {
  sm: 'pathable-cluster--gap-sm',
  md: 'pathable-cluster--gap-md',
  lg: 'pathable-cluster--gap-lg',
  xl: 'pathable-cluster--gap-xl',
}

const AUTO_GAP_CLASS: Record<CardGridAutoGap, string> = {
  sm: 'pathable-card-grid--gap-sm',
  md: 'pathable-card-grid--gap-md',
  lg: 'pathable-card-grid--gap-lg',
}

export interface CardGridProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'color'
> {
  variant?: CardGridVariant
  gap?: CardGridClusterGap | CardGridAutoGap
  as?: ElementType
  className?: string
  children?: ReactNode
}

function CardGridInner(
  {
    variant = 'cluster',
    gap,
    as,
    children,
    className = '',
    ...rest
  }: CardGridProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const Component = as ?? 'div'

  if (variant === 'auto-fit') {
    const gapVal = (gap as CardGridAutoGap | undefined) ?? 'md'
    const classes = mergeClasses(
      'pathable-card-grid',
      AUTO_GAP_CLASS[gapVal],
      className,
    )
    return (
      <Component className={classes} ref={ref} {...rest}>
        {children}
      </Component>
    )
  }

  // cluster mode: uses pathable-cluster flex-wrap layout
  const gapVal = (gap as CardGridClusterGap | undefined) ?? 'md'
  const classes = mergeClasses(
    'pathable-cluster',
    CLUSTER_GAP_CLASS[gapVal],
    className,
  )

  return (
    <Component className={classes} ref={ref} {...rest}>
      {children}
    </Component>
  )
}

export const CardGrid = forwardRef<HTMLElement, CardGridProps>(CardGridInner)
