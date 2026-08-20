import type { TextareaHTMLAttributes } from 'react'
import {
  SizingProps,
  widthClass,
  maxWidthClass,
} from '../../internal/resolvers/index.js'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'

export type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'children'
> &
  SizingProps

export function Textarea({
  width,
  maxWidth,
  className,
  children: _children,
  ...rest
}: TextareaProps & { children?: never }) {
  const classes = mergeClasses(
    'pathable-textarea',
    widthClass(width),
    maxWidthClass(maxWidth),
    className,
  )

  return <textarea className={classes} {...rest} />
}
