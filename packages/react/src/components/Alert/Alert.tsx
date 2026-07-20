import { HTMLAttributes, ReactNode } from 'react'

type AlertStatus = 'info' | 'success' | 'warning' | 'error' | 'emergency'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  status?: AlertStatus
  slim?: boolean
  heading?: ReactNode
  children?: ReactNode
  role?: string
}

const STATUS_CLASS: Record<AlertStatus, string> = {
  info: 'pathable-alert--info',
  success: 'pathable-alert--success',
  warning: 'pathable-alert--warning',
  error: 'pathable-alert--error',
  emergency: 'pathable-alert--emergency',
}

const VALID_STATUSES = new Set(Object.keys(STATUS_CLASS))

export function Alert({
  status = 'info',
  slim = false,
  heading,
  children,
  className = '',
  role = 'alert',
  ...rest
}: AlertProps) {
  const statusClass = VALID_STATUSES.has(status)
    ? STATUS_CLASS[status]
    : STATUS_CLASS.info
  const slimClass = slim ? 'pathable-alert--slim' : ''

  const classes = ['pathable-alert', statusClass, slimClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} role={role} {...rest}>
      <div className="pathable-alert__body">
        {heading && <h3>{heading}</h3>}
        {children}
      </div>
    </div>
  )
}
