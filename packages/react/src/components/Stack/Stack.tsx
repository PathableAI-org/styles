import React, { ReactNode, ElementType, forwardRef } from 'react'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'
import { alignItemsClass } from '../../internal/resolvers/alignment.js'
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

export type StackGap = 'sm' | 'md' | 'lg' | 'xl'

const STACK_GAP_CLASS: Record<StackGap, string> = {
  sm: 'pathable-stack--gap-sm',
  md: 'pathable-stack--gap-md',
  lg: 'pathable-stack--gap-lg',
  xl: 'pathable-stack--gap-xl',
}

export interface StackProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    SizingProps,
    SpacingProps {
  as?: ElementType
  gap?: StackGap
  align?: AlignItems
  children?: ReactNode
  className?: string
}

function StackInner(
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
  }: StackProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const Component = as ?? 'div'
  const gapClass = gap != null ? STACK_GAP_CLASS[gap] : undefined

  const classes = mergeClasses(
    'pathable-stack',
    gapClass,
    alignItemsClass(align),
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

export const Stack = forwardRef<HTMLElement, StackProps>(StackInner)
