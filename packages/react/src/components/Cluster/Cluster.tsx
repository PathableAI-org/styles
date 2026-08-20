import React, { ReactNode, ElementType, forwardRef } from 'react'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'
import { widthClass, maxWidthClass } from '../../internal/resolvers/sizing.js'
import {
  marginAllClass,
  marginXClass,
  marginYClass,
  marginTopClass,
  marginBottomClass,
} from '../../internal/resolvers/spacing.js'
import type {
  SizingProps,
  SpacingProps,
  AlignItems,
} from '../../internal/resolvers/types.js'

export type ClusterGap = 'sm' | 'md' | 'lg' | 'xl'

const CLUSTER_GAP_CLASS: Record<ClusterGap, string> = {
  sm: 'pathable-cluster--gap-sm',
  md: 'pathable-cluster--gap-md',
  lg: 'pathable-cluster--gap-lg',
  xl: 'pathable-cluster--gap-xl',
}

const CLUSTER_ALIGN_CLASS: Record<AlignItems, string> = {
  start: 'pathable-cluster--align-start',
  center: 'pathable-cluster--align-center',
  end: 'pathable-cluster--align-end',
  stretch: 'pathable-cluster--align-stretch',
  baseline: 'pathable-cluster--align-baseline',
}

export interface ClusterProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    Omit<SizingProps & SpacingProps, 'padding' | 'paddingX' | 'paddingY'> {
  as?: ElementType
  gap?: ClusterGap
  align?: AlignItems
  children?: ReactNode
  className?: string
  /** @deprecated Cluster does not support internal padding. */
  padding?: never
  /** @deprecated Cluster does not support internal padding. */
  paddingX?: never
  /** @deprecated Cluster does not support internal padding. */
  paddingY?: never
}

function ClusterInner(
  {
    as,
    gap,
    align,
    children,
    className = '',
    width,
    maxWidth,
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    ...rest
  }: ClusterProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const Component = as ?? 'div'
  const gapClass = gap != null ? CLUSTER_GAP_CLASS[gap] : undefined
  const alignClass = align != null ? CLUSTER_ALIGN_CLASS[align] : undefined

  const classes = mergeClasses(
    'pathable-cluster',
    gapClass,
    alignClass,
    widthClass(width),
    maxWidthClass(maxWidth),
    marginAllClass(margin),
    marginXClass(marginX),
    marginYClass(marginY),
    marginTopClass(marginTop),
    marginBottomClass(marginBottom),
    className,
  )

  return (
    <Component className={classes} ref={ref} {...rest}>
      {children}
    </Component>
  )
}

export const Cluster = forwardRef<HTMLElement, ClusterProps>(ClusterInner)
