import React, { ReactNode, forwardRef } from 'react'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'
import { textToneClass } from '../../internal/resolvers/tone.js'
import type { TextTone } from '../../internal/resolvers/tone.js'

export type { TextTone } from '../../internal/resolvers/tone.js'

export type TextVariant = 'body' | 'small' | 'caption'

const TEXT_VARIANT_CLASS: Record<TextVariant, string> = {
  body: 'pathable-text--body',
  small: 'pathable-text--small',
  caption: 'pathable-text--caption',
}

export interface TextOwnProps {
  variant?: TextVariant
  tone?: TextTone
  children?: ReactNode
  className?: string
}

export type TextProps<C extends React.ElementType = 'p'> = TextOwnProps & {
  as?: C
} & Omit<React.ComponentPropsWithoutRef<C>, keyof TextOwnProps | 'color' | 'as'>

const TextInner = <C extends React.ElementType = 'p'>(
  { as, variant, tone, children, className = '', ...rest }: TextProps<C>,
  ref: React.ForwardedRef<Element>,
) => {
  const Component = (as ?? 'p') as React.ElementType
  const classes = mergeClasses(
    'pathable-text',
    variant ? TEXT_VARIANT_CLASS[variant] : undefined,
    tone ? textToneClass(tone) : undefined,
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
