import React, { ReactNode, ElementType, forwardRef } from 'react'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'

export type SplitRatio = '1-1' | '1-2' | '2-1' | '1-3'
export type SplitAlign = 'center' | 'start' | 'end' | 'stretch'

const RATIO_CLASS: Record<SplitRatio, string> = {
  '1-1': 'pathable-split--ratio-1-1',
  '1-2': 'pathable-split--ratio-1-2',
  '2-1': 'pathable-split--ratio-2-1',
  '1-3': 'pathable-split--ratio-1-3',
}

const ALIGN_CLASS: Record<SplitAlign, string> = {
  center: 'pathable-split--align-center',
  start: 'pathable-split--align-start',
  end: 'pathable-split--align-end',
  stretch: 'pathable-split--align-stretch',
}

export interface SplitLayoutProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'color'
> {
  ratio?: SplitRatio
  align?: SplitAlign
  as?: ElementType
  className?: string
  children: ReactNode
}

function SplitLayoutInner(
  {
    ratio = '1-1',
    align = 'center',
    as,
    children,
    className = '',
    ...rest
  }: SplitLayoutProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const Component = as ?? 'div'

  const classes = mergeClasses(
    'pathable-split',
    RATIO_CLASS[ratio],
    ALIGN_CLASS[align],
    className,
  )

  return (
    <Component className={classes} ref={ref} {...rest}>
      {children}
    </Component>
  )
}

export const SplitLayout = forwardRef<HTMLElement, SplitLayoutProps>(
  SplitLayoutInner,
)
