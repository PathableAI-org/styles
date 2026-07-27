import { cloneElement } from 'react'
import type { HTMLAttributes, ReactElement, ReactNode } from 'react'

export type PageErrorLayout = 'compact' | 'full-page'

export type PageErrorVariant = 'generic' | 'not-found' | 'access-restricted'

type PageErrorIcon = ReactElement<{
  className?: string
  'aria-hidden'?: boolean
}>

type PageErrorAction = ReactElement<{
  className?: string
}>

export interface PageErrorProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  layout?: PageErrorLayout
  variant?: PageErrorVariant
  icon?: PageErrorIcon
  heading: ReactNode
  body: ReactNode
  retry?: PageErrorAction
  nav?: PageErrorAction
}

const LAYOUT_CLASS: Record<PageErrorLayout, string> = {
  compact: 'pathable-page-error--compact',
  'full-page': 'pathable-page-error--full-page',
}

const VARIANT_CLASS: Record<PageErrorVariant, string> = {
  generic: '',
  'not-found': 'pathable-page-error--not-found',
  'access-restricted': 'pathable-page-error--access-restricted',
}

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ')
}

function resolveLayout(layout: string): PageErrorLayout {
  return Object.prototype.hasOwnProperty.call(LAYOUT_CLASS, layout)
    ? (layout as PageErrorLayout)
    : 'compact'
}

function resolveVariant(variant: string): PageErrorVariant {
  return Object.prototype.hasOwnProperty.call(VARIANT_CLASS, variant)
    ? (variant as PageErrorVariant)
    : 'generic'
}

export function PageError({
  layout = 'compact',
  variant = 'generic',
  icon,
  heading,
  body,
  retry,
  nav,
  className = '',
  ...rest
}: PageErrorProps) {
  const resolvedLayout = resolveLayout(layout)
  const resolvedVariant = resolveVariant(variant)
  const classes = [
    'pathable-page-error',
    LAYOUT_CLASS[resolvedLayout],
    VARIANT_CLASS[resolvedVariant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const decoratedIcon = icon
    ? cloneElement(icon, {
        className: mergeClassNames(
          'pathable-page-error__icon',
          icon.props.className,
        ),
        'aria-hidden': true,
      })
    : null

  const decoratedRetry = retry
    ? cloneElement(retry, {
        className: mergeClassNames(
          'pathable-page-error__retry',
          retry.props.className,
        ),
      })
    : null

  const decoratedNav = nav
    ? cloneElement(nav, {
        className: mergeClassNames(
          'pathable-page-error__nav',
          nav.props.className,
        ),
      })
    : null

  return (
    <div className={classes} {...rest}>
      {decoratedIcon}
      {resolvedLayout === 'full-page' ? (
        <h1 className="pathable-page-error__heading">{heading}</h1>
      ) : (
        <h2 className="pathable-page-error__heading">{heading}</h2>
      )}
      <p className="pathable-page-error__body">{body}</p>
      {decoratedRetry}
      {decoratedNav}
    </div>
  )
}
