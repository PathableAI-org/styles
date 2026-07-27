import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  Key,
  LiHTMLAttributes,
  ReactNode,
} from 'react'

export type BreadcrumbItemAttributes = Omit<
  LiHTMLAttributes<HTMLLIElement>,
  'aria-current' | 'children' | 'className'
>

export type BreadcrumbLinkAttributes = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'className' | 'href'
>

export interface BreadcrumbItem {
  content: ReactNode
  href?: string
  current?: boolean
  key?: Key
  className?: string
  attributes?: BreadcrumbItemAttributes
  linkClassName?: string
  linkAttributes?: BreadcrumbLinkAttributes
}

export interface BreadcrumbProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'children'
> {
  items?: BreadcrumbItem[]
}

const ROOT_CLASS = 'pathable-breadcrumb'
const LIST_CLASS = 'pathable-breadcrumb__list'
const ITEM_CLASS = 'pathable-breadcrumb__list-item'
const LINK_CLASS = 'pathable-breadcrumb__link'

export function Breadcrumb({
  items = [],
  className,
  ...rest
}: BreadcrumbProps) {
  const rootClassName = [ROOT_CLASS, className].filter(Boolean).join(' ')

  return (
    <nav className={rootClassName} {...rest}>
      <ol className={LIST_CLASS}>
        {items.map((item, index) => {
          const itemClassName = [ITEM_CLASS, item.className]
            .filter(Boolean)
            .join(' ')
          const isCurrent = item.current === true

          return (
            <li
              key={item.key ?? index}
              className={itemClassName}
              aria-current={isCurrent ? 'page' : undefined}
              {...item.attributes}
            >
              {isCurrent || !item.href ? (
                item.content
              ) : (
                <a
                  className={[LINK_CLASS, item.linkClassName]
                    .filter(Boolean)
                    .join(' ')}
                  href={item.href}
                  {...item.linkAttributes}
                >
                  {item.content}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
