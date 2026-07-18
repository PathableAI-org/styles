import { AnchorHTMLAttributes, ReactNode } from 'react'

type LinkPresentation = 'default' | 'external'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  presentation?: LinkPresentation
  children?: ReactNode
}

const PRESENTATION_CLASS: Record<LinkPresentation, string> = {
  default: '',
  external: 'pathable-link--external',
}

export function Link({
  presentation = 'default',
  children,
  className = '',
  ...rest
}: LinkProps) {
  const modifier = Object.prototype.hasOwnProperty.call(
    PRESENTATION_CLASS,
    presentation,
  )
    ? PRESENTATION_CLASS[presentation]
    : undefined

  const classes = ['pathable-link', modifier, className]
    .filter(Boolean)
    .join(' ')

  return (
    <a className={classes} {...rest}>
      {children}
    </a>
  )
}
