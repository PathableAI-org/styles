import { HTMLAttributes, ReactNode } from 'react'

export interface BottomNavItem {
  label: string
  icon: ReactNode
  href: string
  active?: boolean
}

export type ContentWidth = 'standard' | 'wide'

const CONTENT_WIDTH_CLASS: Record<ContentWidth, string> = {
  standard: 'pathable-app-shell__content--standard',
  wide: 'pathable-app-shell__content--wide',
}

function hasContent(value: unknown): boolean {
  return value !== null && value !== undefined && value !== false
}

export interface AppShellProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  children: ReactNode
  sidebarBrand?: ReactNode
  sidebarNav?: ReactNode
  sidebarAccount?: ReactNode
  sidebarFixed?: boolean
  topBarTitle?: string
  bottomNavItems?: BottomNavItem[]
  contentWidth?: ContentWidth
  notification?: ReactNode
}

export function AppShell({
  children,
  className = '',
  sidebarBrand,
  sidebarNav,
  sidebarAccount,
  sidebarFixed = false,
  topBarTitle,
  bottomNavItems,
  contentWidth = 'standard',
  notification,
  ...rest
}: AppShellProps) {
  const sidebarClass = [
    'pathable-app-shell__sidebar',
    sidebarFixed && 'pathable-app-shell__sidebar--fixed',
  ]
    .filter(Boolean)
    .join(' ')

  const contentClass = [
    'pathable-app-shell__content',
    CONTENT_WIDTH_CLASS[contentWidth],
  ].join(' ')

  const rootClass = ['pathable-app-shell', className].filter(Boolean).join(' ')

  return (
    <div className={rootClass} {...rest}>
      <a className="pathable-skipnav" href="#main-content">
        Skip to main content
      </a>

      {hasContent(notification) ? (
        <div className="pathable-app-shell__notification">{notification}</div>
      ) : null}

      <aside className={sidebarClass}>
        {hasContent(sidebarBrand) ? (
          <div className="pathable-app-shell__brand">{sidebarBrand}</div>
        ) : null}

        {hasContent(sidebarNav) ? (
          <nav className="pathable-app-shell__nav">{sidebarNav}</nav>
        ) : null}

        {hasContent(sidebarAccount) ? (
          <div className="pathable-app-shell__account">{sidebarAccount}</div>
        ) : null}
      </aside>

      <header className="pathable-app-shell__topbar">
        <span className="pathable-app-shell__topbar-title">
          {topBarTitle ?? ''}
        </span>
      </header>

      <main id="main-content" className={contentClass}>
        {children}
      </main>

      {bottomNavItems && bottomNavItems.length > 0 ? (
        <nav className="pathable-bottom-navigation" aria-label="Primary">
          {bottomNavItems.map((item, index) => {
            const itemClass = [
              'pathable-bottom-navigation__item',
              item.active && 'pathable-bottom-navigation__item--active',
            ]
              .filter(Boolean)
              .join(' ')

            const itemProps: Record<string, unknown> = {
              className: itemClass,
              href: item.href,
            }

            if (item.active) {
              itemProps['aria-current'] = 'page'
            }

            return (
              <a key={index} {...itemProps}>
                {item.icon}
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>
      ) : null}
    </div>
  )
}
