import { HTMLAttributes, isValidElement, ReactNode } from 'react'

type ListPresentation = 'unordered' | 'ordered' | 'unstyled'

interface ListItemObject {
  content: ReactNode
  key?: string | number
  className?: string
  attributes?: Record<string, unknown>
}

type ListItem = ReactNode | ListItemObject

interface ListProps extends HTMLAttributes<
  HTMLUListElement | HTMLOListElement
> {
  presentation?: ListPresentation
  items?: ListItem[]
  children?: ReactNode
}

const PRESENTATION_CLASS: Record<ListPresentation, string> = {
  unordered: '',
  ordered: '',
  unstyled: 'usa-list--unstyled',
}

function resolvePresentation(presentation: string): ListPresentation {
  return Object.prototype.hasOwnProperty.call(PRESENTATION_CLASS, presentation)
    ? (presentation as ListPresentation)
    : 'unordered'
}

function isListItemObject(item: unknown): item is ListItemObject {
  return (
    item !== null &&
    typeof item === 'object' &&
    !Array.isArray(item) &&
    !isValidElement(item)
  )
}

function getItemKey(item: ListItem, index: number): string | number {
  if (isListItemObject(item)) {
    return item.key ?? index
  }
  return index
}

function getItemContent(item: ListItem): ReactNode {
  if (isListItemObject(item)) {
    return item.content
  }
  return item
}

function getItemProps(item: ListItem): Record<string, unknown> {
  if (isListItemObject(item)) {
    const { className, attributes = {} } = item
    return { ...attributes, className }
  }
  return {}
}

export function List({
  presentation = 'unordered',
  items,
  children,
  className = '',
  ...rest
}: ListProps) {
  const resolvedPresentation = resolvePresentation(presentation)
  const Element = resolvedPresentation === 'ordered' ? 'ol' : 'ul'
  const classes = [
    'pathable-list',
    PRESENTATION_CLASS[resolvedPresentation],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Element className={classes} {...rest}>
      {hasItems(items) &&
        items.map((item: ListItem, index: number) => {
          const content = getItemContent(item)
          const itemProps = getItemProps(item)
          return (
            <li key={getItemKey(item, index)} {...itemProps}>
              {content}
            </li>
          )
        })}
      {children}
    </Element>
  )
}

function hasItems<T>(items: T[] | undefined): items is T[] {
  return Array.isArray(items) && items.length > 0
}
