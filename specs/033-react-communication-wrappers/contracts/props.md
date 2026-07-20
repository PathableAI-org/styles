# Props Contract: React Communication Wrappers

## Shared Rules

- Every root retains its required `pathable-*` base class.
- Consumer `className`, valid root attributes, `aria-*`, `data-*`, and handlers
  are preserved.
- Public optional values are closed unions; unsupported runtime values resolve
  to the documented default and never become arbitrary classes.
- Rich content uses `ReactNode`; identifiers and item arrays are type-safe.

## `Accordion`

| Prop | Type | Required | Default | Contract |
| --- | --- | --- | --- | --- |
| `items` | `AccordionItem[]` | Yes | none | Ordered headings and panels. |
| `expandedIds` | `string[]` | No | uncontrolled | Controlled expanded identifiers. |
| `defaultExpandedIds` | `string[]` | No | `[]` | Initial uncontrolled state. |
| `allowMultiple` | `boolean` | No | `false` | Allows more than one open panel. |
| `onExpandedChange` | `(ids: string[]) => void` | No | none | Reports resolved state. |
| `className`, `...rest` | valid div attributes | No | empty | Preserved on root. |

`AccordionItem` contains `id`, `heading`, `content`, and optional `disabled`.
The root uses `pathable-accordion`; headings, buttons, and panels use the four
implemented subelement classes. No border-box presentation is exposed.

## `Alert`

| Prop | Type | Required | Default | Contract |
| --- | --- | --- | --- | --- |
| `status` | `'info' \| 'success' \| 'warning' \| 'error' \| 'emergency'` | No | `'info'` | Adds one implemented status modifier. |
| `slim` | `boolean` | No | `false` | Adds the implemented slim modifier. |
| `heading` | `ReactNode` | No | none | Rendered before body content. |
| `children` | `ReactNode` | No | none | Preserved in the Alert body. |
| `role` | valid div role | No | `'alert'` | Consumer may override announcement semantics. |
| `className`, `...rest` | valid div attributes | No | empty | Preserved on root. |

Only `pathable-alert`, one status modifier, `pathable-alert--slim`, and
`pathable-alert__body` are emitted.

## `Banner`

| Prop | Type | Required | Default | Contract |
| --- | --- | --- | --- | --- |
| `summary` | `ReactNode` | Yes | none | Disclosure-control content. |
| `children` | `ReactNode` | No | none | Supporting details. |
| `expanded` | `boolean` | No | uncontrolled | Controlled disclosure state. |
| `defaultExpanded` | `boolean` | No | `false` | Initial uncontrolled state. |
| `onExpandedChange` | `(expanded: boolean) => void` | No | none | Reports resolved state. |
| `id` | `string` | No | stable generated value | Relationship prefix. |
| `className`, `...rest` | valid section attributes | No | empty | Preserved on root. |

The control uses `pathable-banner__button`, content uses
`pathable-banner__content`, and expanded/hidden state remains synchronized.
Banner does not dismiss itself.

## `Modal`

| Prop | Type | Required | Default | Contract |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | Yes | none | Controlled visibility. |
| `onClose` | `() => void` | Yes | none | Requests consumer-owned close. |
| `title` | `ReactNode` | Yes | none | Accessible dialog title. |
| `description` | `ReactNode` | No | none | Optional description. |
| `children` | `ReactNode` | No | none | Dialog body content. |
| `footer` | `ReactNode` | No | none | Action content. |
| `closeLabel` | `string` | No | `'Close modal'` | Accessible close name. |
| `initialFocusRef` | `RefObject<HTMLElement>` | No | none | Preferred initial focus. |
| `className`, `...rest` | valid div attributes | No | empty | Preserved on dialog root where valid. |

An open Modal renders through a body portal using the implemented root, content,
heading, footer, and close classes. It manages dialog naming, modal semantics,
Escape, Tab containment, scroll locking, and focus restoration.

## `ProcessList`

| Prop | Type | Required | Default | Contract |
| --- | --- | --- | --- | --- |
| `items` | `ProcessItem[]` | Yes | none | Ordered process content. |
| `className`, `...rest` | valid ordered-list attributes | No | empty | Preserved on root. |

`ProcessItem` contains `id`, `heading`, and `body`. The wrapper emits only the
implemented root, item, and heading classes; body content remains semantic
consumer content without an invented class.

## `SiteAlert`

| Prop | Type | Required | Default | Contract |
| --- | --- | --- | --- | --- |
| `status` | `'default' \| 'info' \| 'emergency'` | No | `'default'` | Adds one implemented modifier when selected. |
| `slim` | `boolean` | No | `false` | Adds the implemented slim modifier. |
| `heading` | `ReactNode` | No | none | Rendered before body content. |
| `children` | `ReactNode` | No | none | Preserved notice content. |
| `role` | valid div role | No | `'alert'` | Consumer may override announcement semantics. |
| `className`, `...rest` | valid div attributes | No | empty | Preserved on root. |

Warning, dismissal, and absent body/heading/text classes are not exposed.

## `StepIndicator`

| Prop | Type | Required | Default | Contract |
| --- | --- | --- | --- | --- |
| `steps` | `Step[]` | Yes | none | Ordered labels with stable identifiers. |
| `currentStep` | `number` | No | none | One-based current position. |
| `heading` | `ReactNode` | No | none | Optional overall progress heading. |
| `className`, `...rest` | valid div attributes | No | empty | Preserved on root. |

`Step` contains `id` and `label`. Valid current position derives completed,
current, and upcoming states. Invalid or absent position produces no invented
current state.

## `SummaryBox`

| Prop | Type | Required | Default | Contract |
| --- | --- | --- | --- | --- |
| `heading` | `ReactNode` | No | none | Optional summary heading. |
| `children` | `ReactNode` | No | none | Rich text, links, and inline content. |
| `className`, `...rest` | valid div attributes | No | empty | Preserved on root. |

The wrapper emits the implemented root, heading, and text classes. Consumer
links remain operable and may use the existing link class explicitly.
