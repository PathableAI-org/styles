import { Fragment, HTMLAttributes, isValidElement, ReactNode } from 'react'

export interface BottomNavItem {
  label: string
  icon: ReactNode
  href: string
  active?: boolean
}

export type ContentWidth = 'standard' | 'wide'
export type MobileNavigation = 'bottom' | 'shared'

const DEFAULT_NAVIGATION_LABEL = 'Primary'
const DEFAULT_SKIP_LINK_TEXT = 'Skip to main content'

const CONTENT_WIDTH_CLASS: Record<ContentWidth, string> = {
  standard: 'pathable-app-shell__content--standard',
  wide: 'pathable-app-shell__content--wide',
}

function hasContent(value: unknown): boolean {
  return value !== null && value !== undefined && value !== false
}

function hasAccessibleContent(value: ReactNode): boolean {
  if (typeof value === 'string') return Boolean(value.trim())
  if (typeof value === 'number') return true
  if (Array.isArray(value)) return value.some(hasAccessibleContent)
  if (!isValidElement(value)) return false

  const props = value.props as {
    'aria-label'?: unknown
    alt?: unknown
    children?: ReactNode
  }
  if (
    [props['aria-label'], props.alt].some(
      (label) => typeof label === 'string' && Boolean(label.trim()),
    )
  ) {
    return true
  }
  if (hasAccessibleContent(props.children)) return true

  return value.type !== Fragment && typeof value.type !== 'string'
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
  mainProps?: Omit<
    HTMLAttributes<HTMLElement>,
    'children' | 'dangerouslySetInnerHTML'
  >
  navigationLabel?: string
  skipLinkText?: ReactNode
  mobileNavigation?: MobileNavigation
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
  mainProps,
  navigationLabel = DEFAULT_NAVIGATION_LABEL,
  skipLinkText = DEFAULT_SKIP_LINK_TEXT,
  mobileNavigation = 'bottom',
  ...rest
}: AppShellProps) {
  const runtimeMainAttributes = {
    ...mainProps,
  } as HTMLAttributes<HTMLElement>
  delete runtimeMainAttributes.children
  delete runtimeMainAttributes.dangerouslySetInnerHTML
  const {
    className: mainClassName,
    id: requestedMainId,
    ...mainAttributes
  } = runtimeMainAttributes
  const normalizedMainId =
    typeof requestedMainId === 'string' ? requestedMainId.trim() : ''
  const mainId =
    normalizedMainId && !/\s/u.test(normalizedMainId)
      ? normalizedMainId
      : 'main-content'
  const resolvedNavigationLabel =
    typeof navigationLabel === 'string' && navigationLabel.trim()
      ? navigationLabel.trim()
      : DEFAULT_NAVIGATION_LABEL
  const resolvedSkipLinkText = hasAccessibleContent(skipLinkText)
    ? skipLinkText
    : DEFAULT_SKIP_LINK_TEXT
  const sidebarClass = [
    'pathable-app-shell__sidebar',
    sidebarFixed && 'pathable-app-shell__sidebar--fixed',
  ]
    .filter(Boolean)
    .join(' ')

  const contentClass = [
    'pathable-app-shell__content',
    CONTENT_WIDTH_CLASS[contentWidth],
    mainClassName,
  ]
    .filter(Boolean)
    .join(' ')

  const rootClass = [
    'pathable-app-shell',
    mobileNavigation === 'shared' && 'pathable-app-shell--shared-navigation',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClass} {...rest}>
      <a className="pathable-skipnav" href={`#${mainId}`}>
        {resolvedSkipLinkText}
      </a>

      {hasContent(notification) ? (
        <div className="pathable-app-shell__notification">{notification}</div>
      ) : null}

      <aside className={sidebarClass}>
        {hasContent(sidebarBrand) ? (
          <div className="pathable-app-shell__brand">{sidebarBrand}</div>
        ) : null}

        {hasContent(sidebarNav) ? (
          <nav
            className="pathable-app-shell__nav"
            aria-label={resolvedNavigationLabel}
          >
            {sidebarNav}
          </nav>
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

      <main {...mainAttributes} id={mainId} className={contentClass}>
        {children}
      </main>

      {mobileNavigation !== 'shared' &&
      bottomNavItems &&
      bottomNavItems.length > 0 ? (
        <nav
          className="pathable-bottom-navigation"
          aria-label={resolvedNavigationLabel}
        >
          {bottomNavItems.map((item) => {
            const itemClass = [
              'pathable-bottom-navigation__item',
              item.active && 'pathable-bottom-navigation__item--active',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <a
                key={item.href}
                className={itemClass}
                href={item.href}
                aria-current={item.active ? ('page' as const) : undefined}
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>
      ) : null}
    </div>
  )
}
