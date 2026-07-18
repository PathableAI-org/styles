import { HTMLAttributes, ReactNode } from 'react'

type TagSize = 'default' | 'big'

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  size?: TagSize
  children?: ReactNode
}

const SIZE_CLASS: Record<TagSize, string> = {
  default: '',
  big: 'pathable-tag--big',
}

export function Tag({
  size = 'default',
  children,
  className = '',
  ...rest
}: TagProps) {
  const modifier = Object.prototype.hasOwnProperty.call(SIZE_CLASS, size)
    ? SIZE_CLASS[size]
    : undefined

  const classes = ['pathable-tag', modifier, className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  )
}
