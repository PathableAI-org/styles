# Public Component API Contract

## Exports

```ts
export interface FilterableOption {
  readonly id: string
  readonly label: string
  readonly description?: ReactNode
  readonly meta?: ReactNode
  readonly disabled?: boolean
}

export type FilterableOptionPredicate = (
  option: FilterableOption,
  query: string,
) => boolean

export interface FilterableOptionListProps
  extends Omit<
    FieldsetHTMLAttributes<HTMLFieldSetElement>,
    | 'children'
    | 'dangerouslySetInnerHTML'
    | 'defaultValue'
    | 'onChange'
    | 'value'
  > {
  readonly children?: never
  readonly dangerouslySetInnerHTML?: never
  readonly legend: ReactNode
  readonly options: readonly FilterableOption[]
  readonly values?: readonly string[]
  readonly defaultValues?: readonly string[]
  readonly onValuesChange?: (values: readonly string[]) => void
  readonly filterable?: boolean
  readonly filterMode?: 'client' | 'external'
  readonly query?: string
  readonly defaultQuery?: string
  readonly onQueryChange?: (query: string) => void
  readonly filterOption?: FilterableOptionPredicate
  readonly filterLabel?: ReactNode
  readonly filterPlaceholder?: string
  readonly name?: string
  readonly emptyMessage?: ReactNode
  readonly noMatchesMessage?: ReactNode
}
```

The package root exports `FilterableOptionList`, `FilterableOption`,
`FilterableOptionListProps`, and `FilterableOptionPredicate`.

## Defaults

| Prop | Default |
| ---- | ------- |
| `filterable` | `true` |
| `filterMode` | `'client'` |
| `defaultValues` | `[]` |
| `defaultQuery` | `''` |
| `filterLabel` | `'Filter options'` |
| `emptyMessage` | `'No options available.'` |
| `noMatchesMessage` | `'No matches.'` |

## Selection Rules

- `values !== undefined` selects controlled mode; otherwise state starts from
  `defaultValues`.
- Duplicate values are normalized to their first occurrence.
- Toggling an enabled option reports the complete next unique value array.
- Controlled mode does not mutate internal selection in response to a toggle.
- Uncontrolled mode updates internal state before notifying.
- IDs absent from `options` remain retained, counted, and submitted.
- A disabled fieldset or disabled option ignores selection attempts.

## Query Rules

- `query !== undefined` selects controlled query mode; otherwise state starts
  from `defaultQuery`.
- Client mode applies `filterOption` when supplied; otherwise it compares the
  trimmed lower-case query with the lower-case option label.
- External mode never filters `options`; `onQueryChange` lets the consumer
  replace results.
- `filterOption` is invalid in external mode and should be documented and typed
  as a client-mode concern where practical.
- `filterable={false}` omits the filter and renders all supplied options.

## Form Rules

- When `name` is supplied, render one hidden successful control per selected
  unique ID.
- Visual checkboxes do not carry `name`, preventing duplicate submission.
- Form reset restores uncontrolled default values and default query. Restoring
  an uncontrolled query reports `defaultQuery` through `onQueryChange`.
- Controlled values and query remain authoritative after native reset.
- Group-required validation is not part of this API.

## Attribute Forwarding

- Remaining fieldset attributes, including `id`, `className`, `disabled`,
  `form`, `aria-*`, and `data-*`, are forwarded to the root fieldset.
- `children` and `dangerouslySetInnerHTML` are rejected because the component
  owns the fieldset content.
- Component-owned event handling must compose with rather than silently replace
  relevant consumer handlers.
- Component-owned classes precede consumer `className`.

## Rendering Contract

- Storybook classification: `client-ssr`.
- Initial server output is meaningful and hydration-stable.
- Consumers using React Server Components place the component and its stateful
  owner under a client boundary.
