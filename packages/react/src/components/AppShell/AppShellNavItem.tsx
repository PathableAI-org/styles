import { AnchorHTMLAttributes, ReactNode } from 'react'

export interface AppShellNavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  href: string
  active?: boolean
}

export function AppShellNavItem({
  children,
  className = '',
  active = false,
  ...rest
}: AppShellNavItemProps) {
  const classes = [
    'pathable-app-shell__nav-item',
    active && 'pathable-app-shell__nav-item--active',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <a
      className={classes}
      {...rest}
      aria-current={active ? ('page' as const) : undefined}
    >
      {children}
    </a>
  )
}
