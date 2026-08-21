# Data Model: Inline and Cluster Layout Primitives

**Feature**: Inline and Cluster Layout Primitives
**Date**: 2026-08-20

## Entities

### Inline (React Component)

A horizontal, non-wrapping flex layout component in `@pathable/react`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `as` | `ElementType` | No | Semantic HTML element to render (default: `"div"`) |
| `gap` | `InlineGap = 'sm' \| 'md' \| 'lg' \| 'xl'` | No | Spacing scale between children. Maps to `.pathable-inline--gap-{value}`. No gap modifier when omitted (CSS custom property default). |
| `align` | `AlignItems = 'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | No | Cross-axis alignment via `.pathable-flex-align-{value}` utility class. No class when omitted. |
| `justify` | `JustifyContent = 'start' \| 'center' \| 'end' \| 'between' \| 'around'` | No | Inline-axis distribution via `.pathable-flex-justify-{value}` utility class. No class when omitted. |
| `width` | `Width = 'auto' \| 'full'` | No | Width via `.pathable-width-{value}` utility class |
| `maxWidth` | `MaxWidth = 'mobile' \| 'mobile-lg' \| 'tablet' \| 'desktop'` | No | Max-width via `.pathable-maxw-{value}` utility class |
| `margin` | `MarginScale` | No | All-side margin via `.pathable-margin-{value}` |
| `marginX` | `MarginScale` | No | Horizontal margin via `.pathable-margin-x-{value}` |
| `marginY` | `SpacingScale` | No | Vertical margin via `.pathable-margin-y-{value}` |
| `marginTop` | `SpacingScale` | No | Top margin via `.pathable-margin-top-{value}` |
| `marginBottom` | `SpacingScale` | No | Bottom margin via `.pathable-margin-bottom-{value}` |
| `className` | `string` | No | Consumer CSS class(es) appended after all component classes |
| `children` | `ReactNode` | No | Content to lay out horizontally |
| `ref` | `ForwardedRef<HTMLElement>` | No (via forwardRef) | DOM reference to root element |

**Invariants**:
- Renders exactly one DOM element (no wrappers)
- `flex-direction: row` is fixed; no prop to override
- `flex-wrap: nowrap` is implicit (no wrap); children overflow the container if too wide

**Excluded props** (type-blocked):
- `padding`, `paddingX`, `paddingY` — typed as `never` with `@deprecated` JSDoc
- All layout-relationship props belonging to other primitives (no stacking, no grid, no wrapping)

### Cluster (React Component)

A wrapping horizontal flex layout component in `@pathable/react`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `as` | `ElementType` | No | Semantic HTML element to render (default: `"div"`) |
| `gap` | `ClusterGap = 'sm' \| 'md' \| 'lg' \| 'xl'` | No | Spacing scale between children and rows. Maps to `.pathable-cluster--gap-{value}`. No gap modifier when omitted (CSS custom property default). |
| `align` | `AlignItems = 'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | No | Cross-axis alignment of items within each wrapped row. Maps to `.pathable-cluster--align-{value}` SCSS modifier. Defaults to `center` when omitted (via SCSS custom property default). |
| `width` | `Width = 'auto' \| 'full'` | No | Width via `.pathable-width-{value}` |
| `maxWidth` | `MaxWidth = 'mobile' \| 'mobile-lg' \| 'tablet' \| 'desktop'` | No | Max-width via `.pathable-maxw-{value}` |
| `margin` | `MarginScale` | No | All-side margin via `.pathable-margin-{value}` |
| `marginX` | `MarginScale` | No | Horizontal margin via `.pathable-margin-x-{value}` |
| `marginY` | `SpacingScale` | No | Vertical margin via `.pathable-margin-y-{value}` |
| `marginTop` | `SpacingScale` | No | Top margin via `.pathable-margin-top-{value}` |
| `marginBottom` | `SpacingScale` | No | Bottom margin via `.pathable-margin-bottom-{value}` |
| `className` | `string` | No | Consumer CSS class(es) appended after all component classes |
| `children` | `ReactNode` | No | Content to lay out horizontally with wrapping |
| `ref` | `ForwardedRef<HTMLElement>` | No (via forwardRef) | DOM reference to root element |

**Invariants**:
- Renders exactly one DOM element (no wrappers)
- `flex-wrap: wrap` is fixed; no prop to override
- `flex-direction: row` is implicit (row is the flex default)
- `gap` is a single shorthand (applies to both row-gap and column-gap); no separate row-gap prop
- `align` uses SCSS modifier classes (not utility classes), matching the existing SCSS contract

**Excluded props** (type-blocked):
- `justify` — wrapping behavior interacts non-trivially with justify-content; excluded from initial scope
- `padding`, `paddingX`, `paddingY` — typed as `never` with `@deprecated` JSDoc
- All layout-relationship props belonging to other primitives

### `.pathable-inline` SCSS Contract (New)

| Property | Value |
|----------|-------|
| File | `packages/styles/src/pathable-component-wrappers/pathable-inline.scss` |
| Base class | `.pathable-inline` |
| Base behavior | `display: flex; flex-direction: row; gap: var(--pathable-inline-gap, var(--space-16))` |
| Gap modifiers | `.pathable-inline--gap-sm` (8px), `--gap-md` (16px default), `--gap-lg` (24px), `--gap-xl` (32px) |
| Alignment | No SCSS alignment — uses external `.pathable-flex-align-*` / `.pathable-flex-justify-*` utility classes |
| Registration | Added to `pathable-layout-composition.scss` via `@forward 'pathable-inline'` |

### `.pathable-cluster` SCSS Contract (Modified)

| Property | Value |
|----------|-------|
| File | `packages/styles/src/pathable-component-wrappers/pathable-cluster.scss` |
| Changes | Add `--gap-xl` modifier (`var(--space-24)`); add `--align-baseline` modifier (`baseline`) |
| Existing base behavior | Unchanged: `display: flex; flex-wrap: wrap; gap: var(--pathable-cluster-gap, var(--space-8)); align-items: var(--pathable-cluster-align, center)` |

### Class Composition Order

```
[base-class] [gap-modifier] [align-class] [justify-class] [sizing-classes] [spacing-classes] [consumer-className]
```

Where:
- `base-class`: `pathable-inline` or `pathable-cluster`
- `gap-modifier`: e.g., `pathable-inline--gap-sm` or `pathable-cluster--gap-sm` (omitted when gap is undefined)
- `align-class`: For Inline: `.pathable-flex-align-{value}` (utility). For Cluster: `.pathable-cluster--align-{value}` (SCSS modifier).
- `justify-class`: For Inline only: `.pathable-flex-justify-{value}` (utility)
- `sizing-classes`: `.pathable-width-{value}`, `.pathable-maxw-{value}` (omitted when undefined)
- `spacing-classes`: `.pathable-margin-{value}`, `.pathable-margin-x-{value}`, etc. (omitted when undefined)
- `consumer-className`: passed directly as the last argument

All classes on a single root element. No wrapper DOM elements.

## Relationships

- **Inline ↔ Stack**: Both are non-wrapping single-axis layout primitives. Inline is horizontal (`flex-direction: row`); Stack is vertical (`flex-direction: column`). Inline adds `justify` prop (inline-axis distribution); Stack does not.
- **Inline ↔ Cluster**: Inline is non-wrapping; Cluster wraps. Inline supports `justify` (inline-axis distribution); Cluster does not. Both share the same gap scale API shape (`'sm' | 'md' | 'lg' | 'xl'`) but map to different SCSS contracts with different pixel values.
- **Cluster ↔ Stack**: Both consume SCSS component wrappers. Cluster has alignment in SCSS; Stack uses alignment utility classes. Cluster has `flex-wrap: wrap`; Stack does not.
- **All ↔ Utility System**: All three (Inline, Cluster, Stack) consume sizing and spacing from the shared `SizingProps`/`SpacingProps` capability interfaces and use `mergeClasses()` for class composition.
- **All ↔ Polymorphic Pattern**: All three follow the established `Container` polymorphic pattern (`as` prop, `forwardRef`, single root element).