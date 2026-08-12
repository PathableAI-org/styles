import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

export type HeaderNavItemAttributes = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'href'
>

export type HeaderNavItem = {
  readonly id: string
  readonly content: ReactNode
  readonly href: string
  readonly attributes?: HeaderNavItemAttributes
}

export type HeaderProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  readonly brand: ReactNode
  readonly brandHref: string
  readonly items: readonly HeaderNavItem[]
  readonly menuLabel?: string
  readonly closeLabel?: string
  readonly navigationLabel?: string
}

const ROOT_CLASSES =
  'pathable-header pathable-header--basic usa-header usa-header--basic'

export function Header({
  brand,
  brandHref,
  items,
  menuLabel = 'Menu',
  closeLabel = 'Close navigation',
  navigationLabel = 'Primary navigation',
  className,
  ...rest
}: HeaderProps) {
  return (
    <>
      <div className="pathable-overlay usa-overlay" />
      <header
        {...rest}
        className={[ROOT_CLASSES, className].filter(Boolean).join(' ')}
      >
        <div className="pathable-nav-container usa-nav-container">
          <div className="pathable-navbar usa-navbar">
            <div className="pathable-logo usa-logo">
              <em className="pathable-logo__text usa-logo__text">
                <a href={brandHref}>{brand}</a>
              </em>
            </div>
            <button type="button" className="pathable-menu-btn usa-menu-btn">
              {menuLabel}
            </button>
          </div>
          <nav className="pathable-nav usa-nav" aria-label={navigationLabel}>
            <button
              type="button"
              className="pathable-nav__close usa-nav__close"
              aria-label={closeLabel}
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4l-6.3 6.31-1.41-1.42L9.17 12l-6.29-6.29 1.41-1.42 6.3 6.31 6.3-6.31 1.41 1.42Z"
                />
              </svg>
            </button>
            <ul className="pathable-nav__primary usa-nav__primary usa-accordion">
              {items.map((item) => {
                const { className: linkClassName, ...attributes } =
                  item.attributes ?? {}

                return (
                  <li
                    key={item.id}
                    className="pathable-nav__primary-item usa-nav__primary-item"
                  >
                    <a
                      {...attributes}
                      href={item.href}
                      className={['usa-nav-link', linkClassName]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <span>{item.content}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}
