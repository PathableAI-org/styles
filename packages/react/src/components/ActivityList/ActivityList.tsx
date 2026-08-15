import { Fragment, useId } from 'react'
import type {
  ElementType,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react'

export type ActivityListDensity = 'default' | 'compact' | 'comfortable'

export type ActivityStatus =
  'completed' | 'in-progress' | 'pending' | 'cancelled'

export type ActivityStatusValue =
  ActivityStatus | (string & Record<never, never>)

export type ActivityItemAttributes = Readonly<
  Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'>
>

export type ActivityGroupAttributes = Readonly<
  Omit<HTMLAttributes<HTMLDivElement>, 'aria-labelledby' | 'children' | 'role'>
>

export type ActivityItem = {
  readonly id: string
  readonly title: ReactNode
  readonly context: ReactNode
  readonly date: ReactNode
  readonly owner: ReactNode
  readonly status: ActivityStatusValue
  readonly statusLabel: string
  readonly actions?: ReactNode
  readonly attributes?: ActivityItemAttributes
}

export type ActivityGroup = {
  readonly id: string
  readonly heading: ReactNode
  readonly items: readonly ActivityItem[]
  readonly attributes?: ActivityGroupAttributes
}

type FlatActivityListContent = {
  readonly items: readonly ActivityItem[]
  readonly groups?: never
}

type GroupedActivityListContent = {
  readonly groups: readonly ActivityGroup[]
  readonly items?: never
}

export type ActivityListProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'role'
> & {
  readonly density?: ActivityListDensity
  readonly emptyContent?: ReactNode
  readonly groupHeadingLevel?: 2 | 3 | 4 | 5 | 6
} & (FlatActivityListContent | GroupedActivityListContent)

const ROOT_CLASS = 'pathable-activity-list'
const ROW_CLASS = 'pathable-activity-row'

function combineClassNames(
  ...classNames: readonly (string | undefined)[]
): string {
  return classNames.filter(Boolean).join(' ')
}

function hasActionContent(actions: ReactNode | undefined): boolean {
  return actions !== undefined && actions !== null && actions !== false
}

function renderActivityItem(item: ActivityItem): ReactElement {
  const { className, ...rowAttributes } = item.attributes ?? {}

  return (
    <div
      key={item.id}
      {...rowAttributes}
      className={combineClassNames(ROW_CLASS, className)}
      role="listitem"
    >
      <span
        className="pathable-activity-row__status"
        data-status={item.status}
        aria-hidden="true"
      />
      <span className="pathable-activity-row__status-text">
        {item.statusLabel}
      </span>
      <div className="pathable-activity-row__body">
        <p className="pathable-activity-row__title">{item.title}</p>
        <p className="pathable-activity-row__context">{item.context}</p>
      </div>
      <span className="pathable-activity-row__date">{item.date}</span>
      <span className="pathable-activity-row__owner">
        <span className="pathable-activity-row__owner-text">{item.owner}</span>
      </span>
      {hasActionContent(item.actions) ? (
        <div className="pathable-activity-row__actions">{item.actions}</div>
      ) : null}
    </div>
  )
}

function densityClassName(
  density: ActivityListDensity | undefined,
): string | undefined {
  return density === 'compact' || density === 'comfortable'
    ? `${ROOT_CLASS}--${density}`
    : undefined
}

function renderEmptyList(
  rootAttributes: Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'>,
  className: string | undefined,
  density: ActivityListDensity | undefined,
  emptyContent: ReactNode,
): ReactElement {
  return (
    <div
      {...rootAttributes}
      className={combineClassNames(
        ROOT_CLASS,
        densityClassName(density),
        `${ROOT_CLASS}--empty`,
        className,
      )}
    >
      {emptyContent === undefined ? null : (
        <div className={`${ROOT_CLASS}__empty`}>{emptyContent}</div>
      )}
    </div>
  )
}

export function ActivityList(props: ActivityListProps): ReactElement {
  const generatedId = useId()

  if (props.groups !== undefined) {
    const {
      groups,
      density,
      emptyContent,
      groupHeadingLevel = 3,
      className,
      ...rootAttributes
    } = props

    const renderedGroups = groups.filter((group) => group.items.length > 0)
    if (renderedGroups.length === 0) {
      return renderEmptyList(rootAttributes, className, density, emptyContent)
    }

    const Heading = `h${groupHeadingLevel}` as ElementType

    return (
      <div
        {...rootAttributes}
        className={combineClassNames(
          ROOT_CLASS,
          densityClassName(density),
          className,
        )}
      >
        {renderedGroups.map((group, index) => {
          const headingId = `${generatedId}-activity-group-${index}`
          const { className: groupClassName, ...groupAttributes } =
            group.attributes ?? {}
          return (
            <Fragment key={group.id}>
              <Heading
                id={headingId}
                className={`${ROOT_CLASS}__group-heading`}
              >
                {group.heading}
              </Heading>
              <div
                {...groupAttributes}
                className={combineClassNames(ROOT_CLASS, groupClassName)}
                role="list"
                aria-labelledby={headingId}
              >
                {group.items.map(renderActivityItem)}
              </div>
            </Fragment>
          )
        })}
      </div>
    )
  }

  const {
    items,
    density,
    emptyContent,
    groupHeadingLevel: _groupHeadingLevel,
    className,
    ...rootAttributes
  } = props

  if (items.length === 0) {
    return renderEmptyList(rootAttributes, className, density, emptyContent)
  }

  return (
    <div
      {...rootAttributes}
      className={combineClassNames(
        ROOT_CLASS,
        densityClassName(density),
        className,
      )}
      role="list"
    >
      {items.map(renderActivityItem)}
    </div>
  )
}
