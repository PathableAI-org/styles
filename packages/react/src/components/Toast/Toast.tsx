import { cloneElement } from 'react'
import type {
  HTMLAttributes,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from 'react'

export type ToastVariant = 'info' | 'progress' | 'success' | 'warning' | 'error'

export type ToastRole = 'status' | 'alert'

export type ToastIcon = ReactElement<{
  className?: string
  'aria-hidden'?: boolean
}>

export type ToastAction = ReactElement<{
  className?: string
}>

export type ToastRegionProps = HTMLAttributes<HTMLDivElement>

export interface ToastProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'role'
> {
  readonly variant?: ToastVariant
  readonly message: ReactNode
  readonly icon?: ToastIcon
  readonly action?: ToastAction
  readonly dismissible?: boolean
  readonly dismissLabel?: string
  readonly onDismiss?: MouseEventHandler<HTMLButtonElement>
  readonly role?: ToastRole
}

const VARIANT_CLASS: Record<ToastVariant, string> = {
  info: 'pathable-toast--info',
  progress: 'pathable-toast--progress',
  success: 'pathable-toast--success',
  warning: 'pathable-toast--warning',
  error: 'pathable-toast--error',
}

const DEFAULT_ROLE: Record<ToastVariant, ToastRole> = {
  info: 'status',
  progress: 'status',
  success: 'status',
  warning: 'alert',
  error: 'alert',
}

const REGION_CLASS = 'pathable-toast__region'
const ROOT_CLASS = 'pathable-toast'
const ICON_CLASS = 'pathable-toast__icon'
const MESSAGE_CLASS = 'pathable-toast__message'
const ACTION_CLASS = 'pathable-toast__action'
const DISMISS_CLASS = 'pathable-toast__dismiss'

function resolveVariant(variant: string): ToastVariant {
  return Object.prototype.hasOwnProperty.call(VARIANT_CLASS, variant)
    ? (variant as ToastVariant)
    : 'info'
}

export function ToastRegion({
  className,
  children,
  ...rest
}: ToastRegionProps) {
  const classes = [REGION_CLASS, className].filter(Boolean).join(' ')

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}

export function Toast({
  variant = 'info',
  message,
  icon,
  action,
  dismissible = false,
  dismissLabel = 'Dismiss',
  onDismiss,
  role,
  className,
  ...rest
}: ToastProps) {
  const resolvedVariant = resolveVariant(variant)
  const decoratedIcon = icon
    ? cloneElement(icon, {
        className: [ICON_CLASS, icon.props.className].filter(Boolean).join(' '),
        'aria-hidden': true,
      })
    : null
  const decoratedAction = action
    ? cloneElement(action, {
        className: [ACTION_CLASS, action.props.className]
          .filter(Boolean)
          .join(' '),
      })
    : null
  const classes = [
    ROOT_CLASS,
    VARIANT_CLASS[resolvedVariant],
    dismissible ? 'pathable-toast--dismissible' : '',
    action ? 'pathable-toast--has-action' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      {...rest}
      className={classes}
      role={role ?? DEFAULT_ROLE[resolvedVariant]}
    >
      {decoratedIcon}
      <span className={MESSAGE_CLASS}>{message}</span>
      {decoratedAction}
      {dismissible ? (
        <button
          className={DISMISS_CLASS}
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  )
}
