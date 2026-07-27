import type { AnchorHTMLAttributes } from 'react'

export type SkipnavProps = AnchorHTMLAttributes<HTMLAnchorElement>

const BASE_CLASS = 'pathable-skipnav'

export function Skipnav({ className, children, ...rest }: SkipnavProps) {
  const combinedClassName = `${BASE_CLASS} ${className || ''}`.trim()

  return (
    <a className={combinedClassName} {...rest}>
      {children}
    </a>
  )
}
