import type { InputHTMLAttributes } from 'react'
import {
  SizingProps,
  widthClass,
  maxWidthClass,
} from '../../internal/resolvers/index.js'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'width' | 'maxWidth'
> &
  SizingProps

export function Input({
  width,
  maxWidth,
  className,
  children: _children,
  ...rest
}: InputProps & { children?: never }) {
  const classes = mergeClasses(
    'pathable-input',
    widthClass(width),
    maxWidthClass(maxWidth),
    className,
  )

  return <input className={classes} {...rest} />
}
