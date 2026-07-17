# Props Contract: React List Wrapper

## `List` Component

The `List` component is the public React wrapper for the existing
`packages/styles` `pathable-list` contract.

| Prop | Type | Required | Default | Description | Contract Mapping |
|------|------|----------|---------|-------------|------------------|
| `presentation` | `'unordered' \| 'ordered' \| 'unstyled'` | No | `'unordered'` | Selects the documented Pathable list presentation. | Maps to existing `pathable-list` presentation classes or documented patterns. |
| `items` | `Array<ReactNode \| ListItemObject>` | No | `undefined` | Supplies ordered list item content for the wrapper to render. | Each item renders as a list item within the selected list semantics. |
| `children` | `ReactNode` | No | `undefined` | Allows consumer-provided composition when item-driven rendering is not enough. | Preserved inside the root list element without redefining visual semantics. |
| `className` | `string` | No | `''` | Adds consumer class names to the root list element. | Appended alongside `pathable-list`; never replaces the Pathable class. |
| `...rest` | valid root list attributes | No | `{}` | Allows safe `aria-*`, `data-*`, and standard list attributes. | Spread to the root list element. |

## `ListItemObject`

Item objects are optional for consumers who need item-level attributes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | `ReactNode` | Yes | Content rendered inside the list item. |
| `key` | `string \| number` | No | Stable identity for repeated item rendering. |
| `className` | `string` | No | Additional class names for the list item. |
| `attributes` | `object` | No | Safe item attributes such as `aria-*` or `data-*`. |

## Behavioral Rules

- `presentation='unordered'` renders unordered list semantics.
- `presentation='ordered'` renders ordered list semantics and preserves item
  sequence.
- `presentation='unstyled'` renders list semantics with the documented unstyled
  Pathable presentation.
- If `items` and `children` are both supplied, implementation must define a
  deterministic rendering order before coding and cover it in tests or stories.
- Unsupported presentation values must not create new visual semantics.
- Consumers must not need to import `@pathable/styles` separately for normal
  use.
