# Public Component API Contract

## Exports

```ts
export type OptionalFormSectionHeadingLevel = 2 | 3 | 4 | 5 | 6

export interface OptionalFormSectionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  readonly heading: string
  readonly headingLevel: OptionalFormSectionHeadingLevel
  readonly children: ReactNode
  readonly expanded?: boolean
  readonly defaultExpanded?: boolean
  readonly onExpandedChange?: (expanded: boolean) => void
}
```

The package root exports `OptionalFormSection`,
`OptionalFormSectionProps`, and `OptionalFormSectionHeadingLevel`.

## Defaults

| Prop | Default |
| ---- | ------- |
| `defaultExpanded` | `false` |

`heading` and `headingLevel` are required and have no defaults. There is no
disabled, animated, validation, or clear-on-collapse prop in v1.

## Heading Rules

- `heading` must be a string containing at least one non-whitespace character.
- Invalid headings fail fast with a descriptive error before ambiguous markup
  is returned.
- `headingLevel` selects `h2`, `h3`, `h4`, `h5`, or `h6` and is not inferred.
- The heading contains one native button whose text is exactly `heading`.

## State Rules

- `expanded !== undefined` selects controlled mode; otherwise state initializes
  from `defaultExpanded`.
- In uncontrolled mode, activation stores the inverse effective state and calls
  `onExpandedChange` with that next boolean.
- In controlled mode, activation calls `onExpandedChange` with the requested
  inverse state but does not change rendered state until `expanded` changes.
- Pointer, Enter, and Space use native button activation. No custom keydown
  emulation is added.
- The disclosure button is `type="button"`, so activation never submits an
  ancestor form.

## Content and Form Rules

- `children` render once inside the content region in both states.
- Collapsed content uses the native `hidden` attribute. It is not conditionally
  removed, made `inert`, or wrapped in a disabled fieldset.
- Nested fields retain their values and component state across toggles.
- Successful nested controls retain their names and submit while collapsed
  under normal HTML successful-control rules.
- The component does not clear values, create mirror inputs, rewrite names,
  infer associations, inspect validity, reveal errors, or move focus to fields.
- Applications own validation and must expand the section before attempting to
  review or focus a hidden invalid field.

## Attribute Forwarding

- Remaining `div` attributes, including `id`, `className`, `aria-*`, `data-*`,
  and applicable event handlers, are forwarded to the root `div`.
- Component-owned classes precede consumer `className`.
- Root `id` does not replace the component's opaque generated button/content
  relationship IDs.
- Consumer root event handlers compose through ordinary event bubbling; the
  component does not synthesize root click or keyboard handling.

## Rendering Contract

- Storybook classification: `client-ssr`.
- Initial server output includes the heading, button, content, generated
  relationships, and correct initial `hidden` state.
- IDs remain stable through hydration and unique across multiple instances,
  including instances with the same heading.
- Consumers using React Server Components place the component and any
  controlled state owner below a client boundary.

## Explicit Non-Goals

- General page-content accordion behavior.
- `details`/`summary` rendering or use of `Accordion`.
- A disabled disclosure state.
- Animation.
- Validation policy, error-summary integration, or automatic expansion.
- Product-specific labels, catalog behavior, or dependency on issue #235.
