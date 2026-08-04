import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  Key,
  ReactElement,
} from 'react'

export type PaginationAnchorAttributes = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'aria-current' | 'children' | 'href'
>

export type PaginationPageItem = {
  readonly key: Key
  readonly type: 'page'
  readonly page: number
  readonly href: string
  readonly attributes?: PaginationAnchorAttributes
}

export type PaginationOverflowItem = {
  readonly key: Key
  readonly type: 'overflow'
}

export type PaginationItem = PaginationPageItem | PaginationOverflowItem

export type PaginationLink = {
  readonly href: string
  readonly label?: string
  readonly attributes?: PaginationAnchorAttributes
}

export interface PaginationProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'children'
> {
  readonly items: readonly PaginationItem[]
  readonly currentPage: number
  readonly previous?: PaginationLink
  readonly next?: PaginationLink
}

const ROOT_CLASS = 'pathable-pagination'
const LIST_CLASS = 'pathable-pagination__list'
const ITEM_CLASS = 'pathable-pagination__item'
const LINK_CLASS = 'pathable-pagination__link'
const ARROW_CLASS = 'pathable-pagination__arrow'
const OVERFLOW_CLASS = 'pathable-pagination__overflow'
const CURRENT_CLASS = 'usa-current'

const ARROW_PATH = {
  previous: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  next: 'M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z',
} as const

const ARROW_LABEL = {
  previous: 'Previous page',
  next: 'Next page',
} as const

type PaginationDirection = keyof typeof ARROW_PATH

function PaginationArrow({
  direction,
  link,
}: {
  readonly direction: PaginationDirection
  readonly link: PaginationLink
}): ReactElement {
  const { className, ...anchorAttributes } = link.attributes ?? {}
  const label =
    link.label ?? link.attributes?.['aria-label'] ?? ARROW_LABEL[direction]
  const linkClassName = [LINK_CLASS, className].filter(Boolean).join(' ')

  return (
    <li className={`${ITEM_CLASS} ${ARROW_CLASS}`}>
      <a
        {...anchorAttributes}
        className={linkClassName}
        href={link.href}
        aria-label={label}
      >
        <svg
          className="pathable-icon"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-hidden="true"
          focusable="false"
        >
          <path d={ARROW_PATH[direction]} />
        </svg>
        <span className="pathable-sr-only">{label}</span>
      </a>
    </li>
  )
}

export function Pagination({
  items,
  currentPage,
  previous,
  next,
  className,
  ...rest
}: PaginationProps): ReactElement {
  const rootClassName = [ROOT_CLASS, className].filter(Boolean).join(' ')

  return (
    <nav className={rootClassName} {...rest}>
      <ul className={LIST_CLASS}>
        {previous ? (
          <PaginationArrow direction="previous" link={previous} />
        ) : null}
        {items.map((item) => {
          switch (item.type) {
            case 'page': {
              const { className: linkClassName, ...anchorAttributes } =
                item.attributes ?? {}
              const isCurrent = item.page === currentPage
              const classes = [
                LINK_CLASS,
                isCurrent ? CURRENT_CLASS : '',
                linkClassName,
              ]
                .filter(Boolean)
                .join(' ')
              const label =
                item.attributes?.['aria-label'] ?? `Page ${item.page}`

              return (
                <li key={item.key} className={ITEM_CLASS}>
                  <a
                    {...anchorAttributes}
                    className={classes}
                    href={item.href}
                    aria-label={label}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {item.page}
                  </a>
                </li>
              )
            }
            case 'overflow':
              return (
                <li
                  key={item.key}
                  className={`${ITEM_CLASS} ${OVERFLOW_CLASS}`}
                >
                  <span aria-hidden="true">…</span>
                  <span className="pathable-sr-only">Additional pages</span>
                </li>
              )
            default: {
              const exhaustiveItem: never = item
              return exhaustiveItem
            }
          }
        })}
        {next ? <PaginationArrow direction="next" link={next} /> : null}
      </ul>
    </nav>
  )
}
