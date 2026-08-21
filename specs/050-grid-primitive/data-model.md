# Data Model: Grid Layout Primitive

**Feature**: Grid Layout Primitive
**Date**: 2026-08-21

## Overview

The `Grid` component has a simple data model: typed prop values map to CSS class names via lookup tables. There are no data entities, state transitions, or persisted data. This document describes the type design, class-mapping tables, and the prop-to-class resolution flow.

## Entities

### Grid (React Component)

A CSS Grid layout component in `@pathable/react` that arranges children in a multi-column grid with token-based spacing.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `as` | `ElementType` | No | Semantic HTML element to render (default: `"div"`) |
| `cols` | `GridCols = 2 \| 3 \| 4` | No | Number of equal-width columns. Maps to `.pathable-grid--cols-{n}`. No column constraint when omitted (single-column CSS Grid default). |
| `gap` | `GridGap = 'sm' \| 'md' \| 'lg' \| 'xl'` | No | Uniform spacing between grid cells. Maps to `.pathable-grid--gap-{size}`. Defaults to `md` (16px) via SCSS custom property when omitted. |
| `columnGap` | `GridGap` | No | Horizontal spacing between columns. Maps to `.pathable-grid--column-gap-{size}`. Overrides gap for column axis. |
| `rowGap` | `GridGap` | No | Vertical spacing between rows. Maps to `.pathable-grid--row-gap-{size}`. Overrides gap for row axis. |
| `align` | `AlignItems = 'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | No | Vertical alignment of items within grid rows. Maps to `.pathable-grid--align-{value}` SCSS modifier. Defaults to `stretch` (CSS Grid browser default) when omitted. |
| `width` | `Width = 'auto' \| 'full'` | No | Width via `.pathable-width-{value}` utility class |
| `maxWidth` | `MaxWidth = 'mobile' \| 'mobile-lg' \| 'tablet' \| 'desktop'` | No | Max-width via `.pathable-maxw-{value}` utility class |
| `margin` | `MarginScale` | No | All-side margin via `.pathable-margin-{value}` |
| `marginX` | `MarginScale` | No | Horizontal margin via `.pathable-margin-x-{value}` |
| `marginY` | `SpacingScale` | No | Vertical margin via `.pathable-margin-y-{value}` |
| `marginTop` | `SpacingScale` | No | Top margin via `.pathable-margin-top-{value}` |
| `marginBottom` | `SpacingScale` | No | Bottom margin via `.pathable-margin-bottom-{value}` |
| `className` | `string` | No | Consumer CSS class(es) appended after all component classes |
| `children` | `ReactNode` | No | Content to lay out in a grid |
| `ref` | `ForwardedRef<HTMLElement>` | No (via forwardRef) | DOM reference to root element |

**Invariants**:
- Renders exactly one DOM element (no wrappers)
- `display: grid` is fixed; no prop to override
- Only immediate children participate in the grid layout; grandchildren are unaffected
- Columns use `1fr` equal-width units; no fractional or mixed column widths
- No named grid lines, grid areas, or subgrid

**Excluded props** (type-blocked or absent):
- `justify` — horizontal grid alignment (justify-items/justify-content) not in scope
- `padding`, `paddingX`, `paddingY` — typed as `never` with `@deprecated` JSDoc
- `gridTemplateColumns`, `gridTemplateRows`, `gridArea` — full CSS Grid language excluded
- `minWidth` — not in current `SizingProps` capability interface
- All typography, color, tone, display, visibility props — not applicable to layout primitives

**Invalid input handling**:
- Invalid `cols` value at runtime: `GRID_COLS_CLASS[cols]` returns `undefined`, the class is silently omitted. TypeScript prevents this at compile time.
- Invalid `gap`, `columnGap`, or `rowGap` at runtime: lookup returns `undefined`, class is silently omitted.
- Invalid `align` value at runtime: `GRID_ALIGN_CLASS[align]` returns `undefined`, the class is silently omitted.
- Void element for `as`: React warns at runtime but does not crash. Stricter type constraint would require type-level check not currently implemented.

### `.pathable-grid` SCSS Contract (New)

| Property | Value |
|----------|-------|
| File | `packages/styles/src/pathable-component-wrappers/pathable-grid.scss` |
| Base class | `.pathable-grid` |
| Base behavior | `display: grid; column-gap: var(--pathable-grid-column-gap, var(--pathable-grid-gap, var(--space-16))); row-gap: var(--pathable-grid-row-gap, var(--pathable-grid-gap, var(--space-16))); align-items: var(--pathable-grid-align, stretch)` |
| Column modifiers | `.pathable-grid--cols-2` (repeat 2, 1fr), `--cols-3` (repeat 3, 1fr), `--cols-4` (repeat 4, 1fr) |
| Gap modifiers | `.pathable-grid--gap-sm` (8px), `--gap-md` (16px default), `--gap-lg` (24px), `--gap-xl` (32px) |
| Column gap modifiers | `.pathable-grid--column-gap-sm` (8px), `--column-gap-md` (16px), `--column-gap-lg` (24px), `--column-gap-xl` (32px) |
| Row gap modifiers | `.pathable-grid--row-gap-sm` (8px), `--row-gap-md` (16px), `--row-gap-lg` (24px), `--row-gap-xl` (32px) |
| Alignment modifiers | `.pathable-grid--align-start`, `--align-center`, `--align-end`, `--align-stretch`, `--align-baseline` |
| Registration | Added to `pathable-layout-composition.scss` via `@forward 'pathable-grid'` |

## Types

### Cols Prop

```typescript
export type GridCols = 2 | 3 | 4
```

Numeric literal union. Each value maps to a BEM modifier class suffix.

### Cols Class Map

```typescript
const GRID_COLS_CLASS: Record<GridCols, string> = {
  2: 'pathable-grid--cols-2',
  3: 'pathable-grid--cols-3',
  4: 'pathable-grid--cols-4',
}
```

### Gap Prop

```typescript
type GridGap = 'sm' | 'md' | 'lg' | 'xl'
```

String literal union. Each value maps to a BEM modifier class suffix.

### Gap Class Map

```typescript
const GRID_GAP_CLASS: Record<GridGap, string> = {
  sm: 'pathable-grid--gap-sm',
  md: 'pathable-grid--gap-md',
  lg: 'pathable-grid--gap-lg',
  xl: 'pathable-grid--gap-xl',
}
```

### Column Gap Class Map

```typescript
const GRID_COLUMN_GAP_CLASS: Record<GridGap, string> = {
  sm: 'pathable-grid--column-gap-sm',
  md: 'pathable-grid--column-gap-md',
  lg: 'pathable-grid--column-gap-lg',
  xl: 'pathable-grid--column-gap-xl',
}
```

### Row Gap Class Map

```typescript
const GRID_ROW_GAP_CLASS: Record<GridGap, string> = {
  sm: 'pathable-grid--row-gap-sm',
  md: 'pathable-grid--row-gap-md',
  lg: 'pathable-grid--row-gap-lg',
  xl: 'pathable-grid--row-gap-xl',
}
```

### Align Prop

Reuses the existing `AlignItems` type from `internal/resolvers/alignment.ts`:

```typescript
type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
```

### Align Class Map

```typescript
const GRID_ALIGN_CLASS: Record<AlignItems, string> = {
  start: 'pathable-grid--align-start',
  center: 'pathable-grid--align-center',
  end: 'pathable-grid--align-end',
  stretch: 'pathable-grid--align-stretch',
  baseline: 'pathable-grid--align-baseline',
}
```

Note: The Grid uses its own SCSS modifier classes for alignment, not the `alignItemsClass` resolver (which produces `.pathable-flex-align-*` utility classes). A local mapping record is used instead.

### Sizing and Spacing Props

Reused from existing capability interfaces:

```typescript
interface SizingProps {
  width?: 'auto' | 'full'
  maxWidth?: 'mobile' | 'mobile-lg' | 'tablet' | 'desktop'
}

interface SpacingProps {
  margin?: MarginScale
  marginX?: MarginScale
  marginY?: SpacingScale
  marginTop?: SpacingScale
  marginBottom?: SpacingScale
}
```

Where `SpacingScale` = `'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '15'` and `MarginScale` = `SpacingScale | 'auto'`.

### Component Props Interface

```typescript
export interface GridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    Omit<SizingProps & SpacingProps, 'padding' | 'paddingX' | 'paddingY'> {
  as?: ElementType
  cols?: GridCols
  gap?: GridGap
  columnGap?: GridGap
  rowGap?: GridGap
  align?: AlignItems
  children?: ReactNode
  className?: string
  /** @deprecated Grid does not support internal padding. */
  padding?: never
  /** @deprecated Grid does not support internal padding. */
  paddingX?: never
  /** @deprecated Grid does not support internal padding. */
  paddingY?: never
}
```

**Design decisions**:
- `SizingProps` and `SpacingProps` are included via intersection, providing compile-time validation for sizing and margin values.
- Internal padding props (`padding`, `paddingX`, `paddingY`) are marked as `never` with `@deprecated` JSDoc to prevent their use while providing a clear deprecation message in the IDE.
- The `color` prop is omitted from `HTMLAttributes` because it's a legacy HTML attribute, not a design-system token.
- `AlignItems` type is imported from `internal/resolvers/alignment.ts` for consistency with other layout primitives, but mapped via a local `GRID_ALIGN_CLASS` record rather than the `alignItemsClass` resolver.
- The `as` prop defaults to `'div'` via `const Component = as ?? 'div'` inside the component.
- `GridCols` and `GridGap` are exported types for consumer use.

## Prop-to-Class Resolution Flow

```text
Grid props
  │
  ├─ cols ─────────────► GRID_COLS_CLASS[cols] ───► "pathable-grid--cols-{n}" or undefined
  ├─ gap ──────────────► GRID_GAP_CLASS[gap] ─────► "pathable-grid--gap-{size}" or undefined
  ├─ columnGap ────────► GRID_COLUMN_GAP_CLASS[g] ► "pathable-grid--column-gap-{size}" or undefined
  ├─ rowGap ───────────► GRID_ROW_GAP_CLASS[g] ───► "pathable-grid--row-gap-{size}" or undefined
  ├─ align ────────────► GRID_ALIGN_CLASS[align] ─► "pathable-grid--align-{value}" or undefined
  ├─ width ────────────► widthClass(width) ───────► "pathable-width-{value}" or undefined
  ├─ maxWidth ─────────► maxWidthClass(maxWidth) ─► "pathable-maxw-{value}" or undefined
  ├─ margin ───────────► marginAllClass(margin) ──► "pathable-margin-{n}" or undefined
  ├─ marginX ──────────► marginXClass(marginX) ───► "pathable-margin-x-{n}" or undefined
  ├─ marginY ──────────► marginYClass(marginY) ───► "pathable-margin-y-{n}" or undefined
  ├─ marginTop ────────► marginTopClass(mt) ──────► "pathable-margin-top-{n}" or undefined
  ├─ marginBottom ─────► marginBottomClass(mb) ───► "pathable-margin-bottom-{n}" or undefined
  └─ className ────────► string (consumer-provided, passed through)
```

All resolved class strings (each either a string or `undefined`) are passed to `mergeClasses` in order, which filters out falsy values and joins with spaces.

### mergeClasses Call

```typescript
const classes = mergeClasses(
  'pathable-grid',                                   // 1. base class
  cols ? GRID_COLS_CLASS[cols] : undefined,          // 2. column modifier
  gap ? GRID_GAP_CLASS[gap] : undefined,             // 3. gap modifier (shorthand)
  columnGap ? GRID_COLUMN_GAP_CLASS[columnGap] : undefined, // 4. column gap
  rowGap ? GRID_ROW_GAP_CLASS[rowGap] : undefined,   // 5. row gap
  align ? GRID_ALIGN_CLASS[align] : undefined,       // 6. alignment modifier
  widthClass(width),                                  // 7. sizing utilities
  maxWidthClass(maxWidth),
  marginAllClass(margin),                             // 8. spacing utilities
  marginXClass(marginX),
  marginYClass(marginY),
  marginTopClass(marginTop),
  marginBottomClass(marginBottom),
  className,                                          // 9. consumer class (last)
)
```

## Component Structure

```typescript
function GridInner(
  {
    as,
    cols,
    gap,
    columnGap,
    rowGap,
    align,
    children,
    className = '',
    width,
    maxWidth,
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    ...rest
  }: GridProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const Component = as ?? 'div'
  const classes = mergeClasses(/* see above */)

  return (
    <Component className={classes} ref={ref} {...rest}>
      {children}
    </Component>
  )
}

export const Grid = forwardRef<HTMLElement, GridProps>(GridInner)
```

## Exports

Added to `packages/react/src/index.ts`:

```typescript
export { Grid } from './components/Grid/Grid.js'
export type { GridProps, GridCols } from './components/Grid/Grid.js'
```

## Test Data Model

| Test Subject | Input | Expected Class(es) on Root |
|-------------|-------|---------------------------|
| Base (no props) | `<Grid />` | `pathable-grid` |
| cols=2 | `<Grid cols={2} />` | `pathable-grid pathable-grid--cols-2` |
| cols=3 | `<Grid cols={3} />` | `pathable-grid pathable-grid--cols-3` |
| cols=4 | `<Grid cols={4} />` | `pathable-grid pathable-grid--cols-4` |
| gap="sm" | `<Grid cols={2} gap="sm" />` | `pathable-grid pathable-grid--cols-2 pathable-grid--gap-sm` |
| gap="md" | `<Grid cols={2} gap="md" />` | `pathable-grid pathable-grid--cols-2 pathable-grid--gap-md` |
| gap="lg" | `<Grid cols={2} gap="lg" />` | `pathable-grid pathable-grid--cols-2 pathable-grid--gap-lg` |
| gap="xl" | `<Grid cols={2} gap="xl" />` | `pathable-grid pathable-grid--cols-2 pathable-grid--gap-xl` |
| columnGap | `<Grid cols={2} columnGap="lg" />` | `pathable-grid pathable-grid--cols-2 pathable-grid--column-gap-lg` |
| rowGap | `<Grid cols={2} rowGap="sm" />` | `pathable-grid pathable-grid--cols-2 pathable-grid--row-gap-sm` |
| gap + columnGap + rowGap | `<Grid cols={3} gap="md" columnGap="lg" rowGap="sm" />` | `pathable-grid pathable-grid--cols-3 pathable-grid--gap-md pathable-grid--column-gap-lg pathable-grid--row-gap-sm` |
| align="center" | `<Grid cols={2} align="center" />` | `pathable-grid pathable-grid--cols-2 pathable-grid--align-center` |
| align="start" | `<Grid cols={2} align="start" />` | `pathable-grid pathable-grid--cols-2 pathable-grid--align-start` |
| align="end" | `<Grid cols={2} align="end" />` | `pathable-grid pathable-grid--cols-2 pathable-grid--align-end` |
| align="stretch" | `<Grid cols={2} align="stretch" />` | `pathable-grid pathable-grid--cols-2 pathable-grid--align-stretch` |
| align="baseline" | `<Grid cols={2} align="baseline" />` | `pathable-grid pathable-grid--cols-2 pathable-grid--align-baseline` |
| width="full" | `<Grid cols={2} width="full" />` | `pathable-grid pathable-grid--cols-2 pathable-width-full` |
| maxWidth="desktop" | `<Grid cols={2} maxWidth="desktop" />` | `pathable-grid pathable-grid--cols-2 pathable-maxw-desktop` |
| marginX="auto" | `<Grid cols={2} marginX="auto" />` | `pathable-grid pathable-grid--cols-2 pathable-margin-x-auto` |
| className | `<Grid cols={2} className="custom" />` | `pathable-grid pathable-grid--cols-2 custom` (custom last) |
| as="section" | `<Grid as="section" cols={2} />` | rendered as `<section>`, classes present |
| ref forwarding | `ref` passed | `ref.current` is the DOM element |
| Empty children | `<Grid cols={2} />` | Empty root element, no error |
| Server vs client | Any prop combination | Identical class string |
| No cols (default) | `<Grid gap="sm" />` | `pathable-grid pathable-grid--gap-sm` (no column modifier) |

## Relationships

- **Grid ↔ Stack**: Both are structural layout primitives. Stack is single-axis vertical (flex-direction: column); Grid is multi-axis (CSS Grid with explicit columns). Both share the same gap pixel scale.
- **Grid ↔ Inline**: Inline is a non-wrapping horizontal flex layout. Grid is a multi-column grid. Different layout models, different domains.
- **Grid ↔ Cluster**: Cluster is a wrapping horizontal flex layout. Grid is a fixed-column grid. Both use SCSS modifier classes for alignment. Grid supports separate axis gap; Cluster uses a single gap shorthand.
- **Grid ↔ Utility System**: Grid consumes sizing and spacing from the shared `SizingProps`/`SpacingProps` capability interfaces and uses `mergeClasses()` for class composition — same pattern as all layout primitives.
- **Grid ↔ Polymorphic Pattern**: Grid follows the established polymorphic pattern (`as` prop, `forwardRef`, single root element) established by Container and used by all subsequent primitives.
- **Grid ↔ Design System Columns**: The supported column counts (2, 3, 4) align with existing grid patterns in the codebase — `pathable-kpi-grid` supports 2/3/4 columns, `pathable-bento-grid` uses 3-column layout. No other column counts are in use.