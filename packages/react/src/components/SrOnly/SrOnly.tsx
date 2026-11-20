import type { HTMLAttributes, ReactNode } from 'react'

/**
 * Elements `SrOnly` can render. Each is a non-focusable text element: the
 * styles page forbids focusable content inside `pathable-sr-only`, because it
 * stays hidden when it receives focus.
 */
export type SrOnlyElement = 'span' | 'p' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface SrOnlyProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'tabIndex' | 'autoFocus' | 'contentEditable'
> {
  /** Element to render. Defaults to `span`. */
  as?: SrOnlyElement
  children?: ReactNode
}

const BASE_CLASS = 'pathable-sr-only'

export function SrOnly({
  as: Element = 'span',
  children,
  className,
  ...rest
}: SrOnlyProps) {
  const combinedClassName = `${BASE_CLASS} ${className || ''}`.trim()

  return (
    <Element className={combinedClassName} {...rest}>
      {children}
    </Element>
  )
}
