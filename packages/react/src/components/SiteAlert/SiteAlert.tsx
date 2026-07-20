import { HTMLAttributes, ReactNode } from 'react'

type SiteAlertStatus = 'default' | 'info' | 'emergency'

interface SiteAlertProps extends HTMLAttributes<HTMLDivElement> {
  status?: SiteAlertStatus
  slim?: boolean
  heading?: ReactNode
  children?: ReactNode
  role?: string
}

const STATUS_CLASS: Record<string, string> = {
  default: '',
  info: 'pathable-site-alert--info',
  emergency: 'pathable-site-alert--emergency',
}

const VALID_STATUSES = new Set(Object.keys(STATUS_CLASS))

export function SiteAlert({
  status = 'default',
  slim = false,
  heading,
  children,
  className = '',
  role = 'alert',
  ...rest
}: SiteAlertProps) {
  const statusClass = VALID_STATUSES.has(status)
    ? STATUS_CLASS[status]
    : STATUS_CLASS.default
  const slimClass = slim ? 'pathable-site-alert--slim' : ''

  const classes = ['pathable-site-alert', statusClass, slimClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} role={role} {...rest}>
      {heading && <h3>{heading}</h3>}
      {children}
    </div>
  )
}
