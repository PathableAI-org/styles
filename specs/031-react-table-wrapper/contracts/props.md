# Props Contract: React Table Wrapper

## `Table` Component

| Prop | Type | Required | Default | Description | Contract Mapping |
|------|------|----------|---------|-------------|------------------|
| `presentation` | `'default' \| 'borderless' \| 'compact' \| 'striped'` | No | `'default'` | Selects a documented basic table presentation. | Maps to the base class and, when selected, one existing modifier. |
| `children` | `ReactNode` | No | `undefined` | Native table content composed by the consumer. | Preserved unchanged inside the root table. |
| `className` | `string` | No | `''` | Additional root table classes. | Appended without replacing `pathable-table`. |
| `...rest` | valid table attributes | No | `{}` | Standard table, event, `aria-*`, and `data-*` attributes. | Forwarded to the root table element. |

## Class Mapping

| Resolved presentation | Required class output |
|-----------------------|-----------------------|
| `default` | `pathable-table` |
| `borderless` | `pathable-table pathable-table--borderless` |
| `compact` | `pathable-table pathable-table--compact` |
| `striped` | `pathable-table pathable-table--striped` |
| unsupported value | `pathable-table` |

## Behavioral Rules

- The wrapper renders a native table root.
- Consumer children remain in their supplied order and retain native semantics.
- Consumer class names are additive.
- Unsupported presentations fall back to default and never become arbitrary
  class names.
- The wrapper does not manage columns, rows, sorting, selection, pagination,
  loading, empty-state content, row actions, or responsive containers.
- Consumers need no separate `@pathable/styles` import for normal package use.
