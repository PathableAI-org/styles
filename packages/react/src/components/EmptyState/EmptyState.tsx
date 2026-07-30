import { cloneElement } from 'react'
import type { HTMLAttributes, ReactElement, ReactNode } from 'react'

export type EmptyStateVariant =
  'no-data' | 'no-results' | 'setup-required' | 'completed'

type EmptyStateIcon = ReactElement<{
  className?: string
  'aria-hidden'?: boolean
}>

type EmptyStateAction = ReactElement<{
  className?: string
}>

export interface EmptyStateProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  variant?: EmptyStateVariant
  icon?: EmptyStateIcon
  heading: ReactNode
  body: ReactNode
  action?: EmptyStateAction
}

const VARIANT_CLASS: Record<EmptyStateVariant, string> = {
  'no-data': 'pathable-empty-state--no-data',
  'no-results': 'pathable-empty-state--no-results',
  'setup-required': 'pathable-empty-state--setup-required',
  completed: 'pathable-empty-state--completed',
}

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ')
}

function resolveVariant(variant: string): EmptyStateVariant {
  return Object.prototype.hasOwnProperty.call(VARIANT_CLASS, variant)
    ? (variant as EmptyStateVariant)
    : 'no-data'
}

export function EmptyState({
  variant = 'no-data',
  icon,
  heading,
  body,
  action,
  className = '',
  ...rest
}: EmptyStateProps) {
  const resolvedVariant = resolveVariant(variant)
  const classes = [
    'pathable-empty-state',
    VARIANT_CLASS[resolvedVariant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const decoratedIcon = icon
    ? cloneElement(icon, {
        className: mergeClassNames(
          'pathable-empty-state__icon',
          icon.props.className,
        ),
        'aria-hidden': true,
      })
    : null

  const decoratedAction = action
    ? cloneElement(action, {
        className: mergeClassNames(
          'pathable-empty-state__action',
          action.props.className,
        ),
      })
    : null

  return (
    <div className={classes} {...rest}>
      {decoratedIcon}
      <h2 className="pathable-empty-state__heading">{heading}</h2>
      <p className="pathable-empty-state__body">{body}</p>
      {decoratedAction}
    </div>
  )
}
