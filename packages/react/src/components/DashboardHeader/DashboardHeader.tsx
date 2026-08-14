import { Children } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

export interface DashboardHeaderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  /** The page title, rendered as the page's primary heading (required). */
  title: string

  /** Optional navigational breadcrumb content (links/spans). */
  breadcrumb?: ReactNode

  /** Optional status/context indicator shown beside the title. */
  context?: ReactNode

  /** Optional supporting description shown below the title row. */
  description?: ReactNode

  /** Optional action controls (e.g., Button components). */
  actions?: ReactNode

  /** Reduced padding and spacing variant. Default: false. */
  compact?: boolean

  /** Force actions to stack below the title. Default: false. */
  stacked?: boolean
}

function hasContent(value: ReactNode): boolean {
  return Children.toArray(value).some(
    (child) => typeof child !== 'string' || child.trim().length > 0,
  )
}

export function DashboardHeader({
  title,
  breadcrumb,
  context,
  description,
  actions,
  compact = false,
  stacked = false,
  className = '',
  ...rest
}: DashboardHeaderProps) {
  const rootClass = [
    'pathable-dashboard-header',
    compact && 'pathable-dashboard-header--compact',
    stacked && 'pathable-dashboard-header--stacked',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClass} {...rest}>
      {hasContent(breadcrumb) ? (
        <div className="pathable-dashboard-header__breadcrumb">
          {breadcrumb}
        </div>
      ) : null}

      <div className="pathable-dashboard-header__row">
        <h1 className="pathable-dashboard-header__title">{title}</h1>

        {hasContent(context) ? (
          <span className="pathable-dashboard-header__context">{context}</span>
        ) : null}

        {hasContent(actions) ? (
          <div className="pathable-dashboard-header__actions">{actions}</div>
        ) : null}
      </div>

      {hasContent(description) ? (
        <p className="pathable-dashboard-header__description">{description}</p>
      ) : null}
    </div>
  )
}
