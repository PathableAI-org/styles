import React, { ReactNode, ElementType, forwardRef } from 'react'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'

export type FormStackGap = 'sm' | 'md' | 'lg' | 'xl'
export type FormStackMaxWidth = 'tablet' | 'content'

const GAP_CLASS: Record<FormStackGap, string> = {
  sm: 'pathable-stack--gap-sm',
  md: 'pathable-stack--gap-md',
  lg: 'pathable-stack--gap-lg',
  xl: 'pathable-stack--gap-xl',
}

const MAX_WIDTH_CLASS: Record<FormStackMaxWidth, string> = {
  tablet: 'pathable-maxw-tablet',
  content: 'pathable-maxw-desktop',
}

export interface FormStackProps extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'color'
> {
  gap?: FormStackGap
  maxWidth?: FormStackMaxWidth
  as?: ElementType
  className?: string
  children?: ReactNode
}

function FormStackInner(
  {
    gap = 'md',
    maxWidth,
    as,
    children,
    className = '',
    ...rest
  }: FormStackProps,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  const Component = as ?? 'form'
  const maxWidthClass = maxWidth != null ? MAX_WIDTH_CLASS[maxWidth] : undefined

  const classes = mergeClasses(
    'pathable-stack',
    GAP_CLASS[gap],
    maxWidthClass,
    className,
  )

  return (
    <Component className={classes} ref={ref} {...rest}>
      {children}
    </Component>
  )
}

export const FormStack = forwardRef<HTMLFormElement, FormStackProps>(
  FormStackInner,
)
