import React, { ReactNode, forwardRef } from 'react'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'

export type TextVariant = 'body' | 'small' | 'caption'

export type TextTone = 'default' | 'muted' | 'danger' | 'success'

const TEXT_VARIANT_CLASS: Record<TextVariant, string> = {
  body: 'pathable-text--body',
  small: 'pathable-text--small',
  caption: 'pathable-text--caption',
}

const TEXT_TONE_CLASS: Record<TextTone, string> = {
  default: 'pathable-text--tone-default',
  muted: 'pathable-text--tone-muted',
  danger: 'pathable-text--tone-danger',
  success: 'pathable-text--tone-success',
}

export interface TextOwnProps {
  variant?: TextVariant
  tone?: TextTone
  children?: ReactNode
  className?: string
}

export type TextProps<C extends React.ElementType = 'p'> = TextOwnProps &
  Omit<React.ComponentPropsWithoutRef<C>, keyof TextOwnProps | 'color'>

const TextInner = <C extends React.ElementType = 'p'>(
  {
    as,
    variant,
    tone,
    children,
    className = '',
    ...rest
  }: TextProps<C> & { as?: C },
  ref: React.ForwardedRef<Element>,
) => {
  const Component = (as ?? 'p') as React.ElementType
  const classes = mergeClasses(
    'pathable-text',
    variant ? TEXT_VARIANT_CLASS[variant] : undefined,
    tone ? TEXT_TONE_CLASS[tone] : undefined,
    className,
  )
  return (
    <Component ref={ref} className={classes} {...rest}>
      {children}
    </Component>
  )
}

export const Text = forwardRef(TextInner) as unknown as <
  C extends React.ElementType = 'p',
>(
  props: TextProps<C> & { as?: C } & React.RefAttributes<Element>,
) => React.ReactElement | null
