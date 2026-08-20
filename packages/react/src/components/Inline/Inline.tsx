import React, { ReactNode, ElementType, forwardRef } from 'react'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'
import {
  alignItemsClass,
  justifyContentClass,
} from '../../internal/resolvers/alignment.js'
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
  JustifyContent,
} from '../../internal/resolvers/types.js'

export type InlineGap = 'sm' | 'md' | 'lg' | 'xl'

const INLINE_GAP_CLASS: Record<InlineGap, string> = {
  sm: 'pathable-inline--gap-sm',
  md: 'pathable-inline--gap-md',
  lg: 'pathable-inline--gap-lg',
  xl: 'pathable-inline--gap-xl',
}

export interface InlineProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    Omit<SizingProps & SpacingProps, 'padding' | 'paddingX' | 'paddingY'> {
  as?: ElementType
  gap?: InlineGap
  align?: AlignItems
  justify?: JustifyContent
  children?: ReactNode
  className?: string
  /** @deprecated Inline does not support internal padding. */
  padding?: never
  /** @deprecated Inline does not support internal padding. */
  paddingX?: never
  /** @deprecated Inline does not support internal padding. */
  paddingY?: never
}

function InlineInner(
  {
    as,
    gap,
    align,
    justify,
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
  }: InlineProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const Component = as ?? 'div'
  const gapClass = gap != null ? INLINE_GAP_CLASS[gap] : undefined

  const classes = mergeClasses(
    'pathable-inline',
    gapClass,
    alignItemsClass(align),
    justifyContentClass(justify),
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

export const Inline = forwardRef<HTMLElement, InlineProps>(InlineInner)
