import type { HTMLAttributes, ReactNode } from 'react'

export type LoadingSize = 'default' | 'large'

export interface LoadingProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  readonly size?: LoadingSize
  readonly text?: ReactNode
}

const ROOT_CLASS = 'pathable-loading'
const LARGE_CLASS = 'pathable-loading--large'
const SPINNER_CLASS = 'pathable-loading__spinner'
const TEXT_CLASS = 'pathable-loading__text'

export function Loading({
  size = 'default',
  text,
  className,
  'aria-live': ariaLive = 'polite',
  ...rest
}: LoadingProps) {
  const sizeClass = size === 'large' ? LARGE_CLASS : ''
  const classes = [ROOT_CLASS, sizeClass, className].filter(Boolean).join(' ')

  return (
    <div {...rest} className={classes} aria-live={ariaLive}>
      <span className={SPINNER_CLASS} aria-hidden="true" />
      {text != null ? <span className={TEXT_CLASS}>{text}</span> : null}
    </div>
  )
}
