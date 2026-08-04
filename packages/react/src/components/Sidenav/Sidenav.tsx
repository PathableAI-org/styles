import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  ReactNode,
} from 'react'

export type SidenavItemAttributes = Readonly<
  Omit<
    LiHTMLAttributes<HTMLLIElement>,
    'aria-current' | 'children' | 'className'
  >
>

export type SidenavLinkAttributes = Readonly<
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'aria-current' | 'children' | 'className' | 'href'
  >
>

export type SidenavListAttributes = Readonly<
  Omit<HTMLAttributes<HTMLUListElement>, 'children' | 'className'>
>

export type SidenavItem = {
  readonly id: string
  readonly content: ReactNode
  readonly href?: string
  readonly children?: readonly SidenavItem[]
  readonly className?: string
  readonly attributes?: SidenavItemAttributes
  readonly linkClassName?: string
  readonly linkAttributes?: SidenavLinkAttributes
  readonly listClassName?: string
  readonly listAttributes?: SidenavListAttributes
}

export type SidenavProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  readonly items: readonly SidenavItem[]
  readonly currentId?: string
}

const ROOT_CLASS = 'pathable-sidenav'
const LIST_CLASS = 'pathable-sidenav__sublist'
const ITEM_CLASS = 'pathable-sidenav__item'
const CURRENT_CLASS = 'pathable-current'

function combineClassNames(
  ...classNames: readonly (string | undefined)[]
): string {
  return classNames.filter(Boolean).join(' ')
}

function findCurrentPath(
  items: readonly SidenavItem[],
  currentId: string | undefined,
): readonly number[] | undefined {
  if (currentId === undefined) {
    return undefined
  }

  for (const [index, item] of items.entries()) {
    if (item.id === currentId) {
      return [index]
    }

    if (item.children !== undefined) {
      const childPath = findCurrentPath(item.children, currentId)
      if (childPath !== undefined) {
        return [index, ...childPath]
      }
    }
  }

  return undefined
}

function renderItems(
  items: readonly SidenavItem[],
  currentPath: readonly number[] | undefined,
): ReactNode {
  return items.map((item, index) => {
    const isCurrent = currentPath?.length === 1 && currentPath[0] === index
    const childCurrentPath =
      currentPath?.[0] === index ? currentPath.slice(1) : undefined

    return (
      <li
        key={item.id}
        className={combineClassNames(ITEM_CLASS, item.className)}
        {...item.attributes}
      >
        {item.href === undefined ? (
          isCurrent ? (
            <span className={CURRENT_CLASS} aria-current="page">
              {item.content}
            </span>
          ) : (
            item.content
          )
        ) : (
          <a
            className={combineClassNames(
              isCurrent ? CURRENT_CLASS : undefined,
              item.linkClassName,
            )}
            href={item.href}
            aria-current={isCurrent ? 'page' : undefined}
            {...item.linkAttributes}
          >
            {item.content}
          </a>
        )}
        {item.children !== undefined && item.children.length > 0 ? (
          <ul
            className={combineClassNames(LIST_CLASS, item.listClassName)}
            {...item.listAttributes}
          >
            {renderItems(item.children, childCurrentPath)}
          </ul>
        ) : null}
      </li>
    )
  })
}

export function Sidenav({
  items,
  currentId,
  className,
  ...rest
}: SidenavProps) {
  const currentPath = findCurrentPath(items, currentId)

  return (
    <aside className={combineClassNames(ROOT_CLASS, className)} {...rest}>
      <ul className={LIST_CLASS}>{renderItems(items, currentPath)}</ul>
    </aside>
  )
}
