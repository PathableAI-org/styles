import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type IconButtonAppearance =
  'bare' | 'subtle' | 'bordered' | 'inverse' | 'destructive'

export type IconButtonSize = 'compact' | 'default' | 'large'
export type IconButtonShape = 'square' | 'circle'

type IconButtonAccessibleName =
  | {
      readonly 'aria-label': string
      readonly 'aria-labelledby'?: string
    }
  | {
      readonly 'aria-label'?: string
      readonly 'aria-labelledby': string
    }

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'aria-labelledby' | 'children'
> &
  IconButtonAccessibleName & {
    readonly appearance?: IconButtonAppearance
    readonly size?: IconButtonSize
    readonly shape?: IconButtonShape
    readonly children: ReactNode
  }

const ROOT_CLASS = 'pathable-icon-button'

const APPEARANCE_CLASS: Record<IconButtonAppearance, string> = {
  bare: 'pathable-icon-button--bare',
  subtle: 'pathable-icon-button--subtle',
  bordered: 'pathable-icon-button--bordered',
  inverse: 'pathable-icon-button--inverse',
  destructive: 'pathable-icon-button--destructive',
}

const SIZE_CLASS: Record<IconButtonSize, string> = {
  compact: 'pathable-icon-button--compact',
  default: '',
  large: 'pathable-icon-button--large',
}

const SHAPE_CLASS: Record<IconButtonShape, string> = {
  square: '',
  circle: 'pathable-icon-button--circle',
}

export function IconButton({
  appearance = 'bare',
  size = 'default',
  shape = 'square',
  type = 'button',
  className,
  children,
  ...rest
}: IconButtonProps) {
  const appearanceClass = Object.prototype.hasOwnProperty.call(
    APPEARANCE_CLASS,
    appearance,
  )
    ? APPEARANCE_CLASS[appearance]
    : APPEARANCE_CLASS.bare
  const sizeClass = Object.prototype.hasOwnProperty.call(SIZE_CLASS, size)
    ? SIZE_CLASS[size]
    : ''
  const shapeClass = Object.prototype.hasOwnProperty.call(SHAPE_CLASS, shape)
    ? SHAPE_CLASS[shape]
    : ''
  const classes = [
    ROOT_CLASS,
    appearanceClass,
    sizeClass,
    shapeClass,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button {...rest} type={type} className={classes}>
      {children}
    </button>
  )
}
