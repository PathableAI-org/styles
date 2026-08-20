import { ButtonHTMLAttributes } from 'react'
import {
  SizingProps,
  widthClass,
  maxWidthClass,
} from '../../internal/resolvers/index.js'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent-cool'
  | 'accent-warm'
  | 'outline'
  | 'inverse'
  | 'base'
  | 'unstyled'
  | 'save'
  | 'continue'
  | 'review'
  | 'destructive'
  | 'low-emphasis'

type ButtonSize = 'default' | 'big'

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, SizingProps {
  variant?: ButtonVariant
  size?: ButtonSize
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'pathable-button--primary',
  secondary: 'pathable-button--secondary',
  'accent-cool': 'pathable-button--accent-cool',
  'accent-warm': 'pathable-button--accent-warm',
  outline: 'pathable-button--outline',
  inverse: 'pathable-button--inverse',
  base: 'pathable-button--base',
  unstyled: 'pathable-button--unstyled',
  save: 'pathable-button--save',
  continue: 'pathable-button--continue',
  review: 'pathable-button--review',
  destructive: 'pathable-button--destructive',
  'low-emphasis': 'pathable-button--low-emphasis',
}

export function Button({
  children,
  variant = 'primary',
  size = 'default',
  width,
  maxWidth,
  className,
  ...rest
}: ButtonProps) {
  const variantClass = VARIANT_CLASS[variant] || VARIANT_CLASS.primary
  const sizeClass = size === 'big' ? 'pathable-button--big' : ''

  const classes = mergeClasses(
    'pathable-button',
    variantClass,
    sizeClass,
    widthClass(width),
    maxWidthClass(maxWidth),
    className,
  )

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
