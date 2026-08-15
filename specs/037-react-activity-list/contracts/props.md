# Public Props Contract: React Activity List

## Exported Type Surface

```ts
import type { HTMLAttributes, ReactElement, ReactNode } from 'react'

export type ActivityListDensity = 'default' | 'compact' | 'comfortable'

export type ActivityStatus =
  | 'completed'
  | 'in-progress'
  | 'pending'
  | 'cancelled'

export type ActivityStatusValue =
  | ActivityStatus
  | (string & Record<never, never>)

export type ActivityItemAttributes = Readonly<
  Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'>
>

export type ActivityGroupAttributes = Readonly<
  Omit<
    HTMLAttributes<HTMLDivElement>,
    'aria-labelledby' | 'children' | 'role'
  >
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

export function ActivityList(props: ActivityListProps): ReactElement
```

## Input Rules

- Exactly one of `items` or `groups` is required.
- Item and group IDs are stable and unique within their collections; they are
  React keys and are not used directly as DOM IDs.
- `statusLabel` is a string and is the single visible and accessible source of
  status meaning.
- Title, context, date, and owner accept inline React content. Consumers may
  provide `<time dateTime="...">` inside `date`.
- Actions remain consumer-owned named links or controls.
- `groupHeadingLevel` defaults to 3 and changes semantics only, not styling.
- `emptyContent` is consumer-authored; no default product copy is synthesized.

## Class and DOM Mapping

### Flat mode

```html
<div class="pathable-activity-list" role="list">
  <div class="pathable-activity-row" role="listitem">
    <span
      class="pathable-activity-row__status"
      data-status="completed"
      aria-hidden="true"
    ></span>
    <span class="pathable-activity-row__status-text">Completed</span>
    <div class="pathable-activity-row__body">
      <p class="pathable-activity-row__title">...</p>
      <p class="pathable-activity-row__context">...</p>
    </div>
    <span class="pathable-activity-row__date">...</span>
    <span class="pathable-activity-row__owner">
      <span class="pathable-activity-row__owner-text">...</span>
    </span>
    <div class="pathable-activity-row__actions">...</div>
  </div>
</div>
```

The action container is omitted when `actions` is absent.

### Grouped mode

```html
<div class="pathable-activity-list">
  <h3 id="generated-group-heading" class="pathable-activity-list__group-heading">
    Today
  </h3>
  <div
    class="pathable-activity-list"
    role="list"
    aria-labelledby="generated-group-heading"
  >
    <div class="pathable-activity-row" role="listitem">...</div>
  </div>
</div>
```

- Each non-empty group produces one heading followed immediately by its named
  nested list.
- Empty groups produce no heading or list.
- The outer grouped visual container has no list role.

### Empty mode

```html
<div class="pathable-activity-list pathable-activity-list--empty">
  <div class="pathable-activity-list__empty">...</div>
</div>
```

Empty mode has no list role, heading, group, row, or fabricated message.

## Density Mapping

| Resolved value | Required root classes |
| --- | --- |
| `default` | `pathable-activity-list` |
| `compact` | `pathable-activity-list pathable-activity-list--compact` |
| `comfortable` | `pathable-activity-list pathable-activity-list--comfortable` |
| unsupported runtime value | `pathable-activity-list` |

The selected density modifier belongs on the outer root. Nested group lists
retain the base list class and inherit the outer density treatment so row
presentation remains uniform without duplicate modifier classes.

## Attribute Ownership

- Root, row, and group consumer classes are additive.
- Valid HTML, `aria-*`, `data-*`, and event attributes are preserved.
- The component owns required Pathable classes, `role="list"`,
  `role="listitem"`, group `aria-labelledby`, generated heading IDs, and the
  decorative marker's `aria-hidden` state.
- Consumer attribute spreads cannot replace those owned semantics.

## Status Mapping

| Supplied value | Marker result | Visible/accessibility result |
| --- | --- | --- |
| documented value | Matching existing source selector | Supplied `statusLabel` rendered once as text |
| unfamiliar value | Neutral base marker; supplied value remains in `data-status` | Supplied `statusLabel` rendered once as text |

The component never formats, localizes, infers, or converts a status.

## Server and Package Contract

- No client directive, browser global, state, effect, or owned event behavior.
- `useId` may generate hydration-stable group heading IDs.
- The root `@pathableai/react` entry exports the component and every public type
  above with `.js` source specifiers.
- The existing root side-effect import of `@pathableai/styles` remains the sole
  React package styling entrypoint.
