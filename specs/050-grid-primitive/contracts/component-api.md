# Component Interface Contracts: Grid

## Component API Contract

### Public Export

```typescript
// packages/react/src/index.ts
export { Grid } from './components/Grid/Grid.js'
export type { GridProps, GridCols } from './components/Grid/Grid.js'
```

### Package Entry

The `Grid` component is accessible from the `@pathable/react` package root:

```typescript
import { Grid } from '@pathable/react'
import type { GridProps, GridCols } from '@pathable/react'
```

### Component Signature

```typescript
export const Grid: React.ForwardRefExoticComponent<
  GridProps & React.RefAttributes<HTMLElement>
>
```

### Props

```typescript
export type GridCols = 2 | 3 | 4

export interface GridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    Omit<SizingProps & SpacingProps, 'padding' | 'paddingX' | 'paddingY'> {
  as?: React.ElementType
  cols?: GridCols
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  columnGap?: 'sm' | 'md' | 'lg' | 'xl'
  rowGap?: 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  children?: React.ReactNode
  className?: string
  /** @deprecated Grid does not support internal padding. */
  padding?: never
  /** @deprecated Grid does not support internal padding. */
  paddingX?: never
  /** @deprecated Grid does not support internal padding. */
  paddingY?: never
}
```

Where `SizingProps` (`width`, `maxWidth`) and `SpacingProps` (margin props, excluding padding) are imported from the internal capability system.

## HTML Output Contract

### Default Render (No Props)

```tsx
<Grid />
```

```html
<div class="pathable-grid"></div>
```

### With Columns

```tsx
<Grid cols={2}>
  <div>Item 1</div>
  <div>Item 2</div>
</Grid>
```

```html
<div class="pathable-grid pathable-grid--cols-2">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### With Columns and Gap

```tsx
<Grid cols={3} gap="lg">
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
</Grid>
```

```html
<div class="pathable-grid pathable-grid--cols-3 pathable-grid--gap-lg">
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
</div>
```

### With Columns, Gap, and Alignment

```tsx
<Grid cols={4} gap="md" align="center">
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
</Grid>
```

```html
<div class="pathable-grid pathable-grid--cols-4 pathable-grid--gap-md pathable-grid--align-center">
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
</div>
```

### With Separate Column and Row Gap

```tsx
<Grid cols={2} columnGap="lg" rowGap="sm">
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
</Grid>
```

```html
<div class="pathable-grid pathable-grid--cols-2 pathable-grid--column-gap-lg pathable-grid--row-gap-sm">
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
</div>
```

### With Gap Shorthand Overridden by Axis Props

```tsx
<Grid cols={3} gap="md" columnGap="lg" rowGap="sm">
  <div>A</div>
  <div>B</div>
  <div>C</div>
</Grid>
```

```html
<div class="pathable-grid pathable-grid--cols-3 pathable-grid--gap-md pathable-grid--column-gap-lg pathable-grid--row-gap-sm">
  <div>A</div>
  <div>B</div>
  <div>C</div>
</div>
```

CSS cascade: `--pathable-grid-column-gap: var(--space-24)` takes precedence over `--pathable-grid-gap: var(--space-16)` for the column axis. Row gap similarly uses `--pathable-grid-row-gap: var(--space-8)`.

### With Sizing and Spacing

```tsx
<Grid cols={2} gap="md" width="full" maxWidth="desktop" marginX="auto">
  <div>A</div>
  <div>B</div>
</Grid>
```

```html
<div class="pathable-grid pathable-grid--cols-2 pathable-grid--gap-md pathable-width-full pathable-maxw-desktop pathable-margin-x-auto">
  <div>A</div>
  <div>B</div>
</div>
```

### With as Prop

```tsx
<Grid as="section" cols={2} gap="sm">
  <div>A</div>
  <div>B</div>
</Grid>
```

```html
<section class="pathable-grid pathable-grid--cols-2 pathable-grid--gap-sm">
  <div>A</div>
  <div>B</div>
</section>
```

### With Consumer className

```tsx
<Grid cols={3} gap="md" className="product-catalog">
  <div>A</div>
  <div>B</div>
  <div>C</div>
</Grid>
```

```html
<div class="pathable-grid pathable-grid--cols-3 pathable-grid--gap-md product-catalog">
  <div>A</div>
  <div>B</div>
  <div>C</div>
</div>
```

### With Ref Forwarding

```tsx
const ref = useRef<HTMLElement>(null)
<Grid ref={ref} cols={2} gap="sm" />
// ref.current instanceof HTMLDivElement === true
// ref.current.className includes "pathable-grid"
```

### With as and Ref

```tsx
const ref = useRef<HTMLElement>(null)
<Grid as="section" ref={ref} cols={2} gap="sm" />
// ref.current instanceof HTMLElement === true
// ref.current.tagName === "SECTION"
```

### No Columns (CSS Grid Default — Single Column)

```tsx
<Grid gap="sm">
  <div>A</div>
  <div>B</div>
</Grid>
```

```html
<div class="pathable-grid pathable-grid--gap-sm">
  <div>A</div>
  <div>B</div>
</div>
```

## Class Merge Order Contract

The `class` attribute on the root element MUST contain classes in this relative order:

1. `pathable-grid` (always present)
2. `pathable-grid--cols-{n}` (if `cols` prop is set)
3. `pathable-grid--gap-{size}` (if `gap` prop is set)
4. `pathable-grid--column-gap-{size}` (if `columnGap` prop is set)
5. `pathable-grid--row-gap-{size}` (if `rowGap` prop is set)
6. `pathable-grid--align-{value}` (if `align` prop is set)
7. `pathable-width-{value}` (if `width` prop is set)
8. `pathable-maxw-{value}` (if `maxWidth` prop is set)
9. `pathable-margin-{n}` (if `margin` prop is set)
10. `pathable-margin-x-{n}` (if `marginX` prop is set)
11. `pathable-margin-y-{n}` (if `marginY` prop is set)
12. `pathable-margin-top-{n}` (if `marginTop` prop is set)
13. `pathable-margin-bottom-{n}` (if `marginBottom` prop is set)
14. Consumer `className` value (if provided)

No other classes MUST appear. No wrapper elements MUST exist between the root element and children. Only immediate children participate in the grid layout.

## SSR Contract

For all supported prop combinations, the DOM output (element tag, class attribute string, child structure) MUST be identical when rendered server-side and client-side. No browser-only resolution or hydration may modify the class string or element structure.

## Scope Boundaries

### Included in Grid

- CSS Grid layout (`display: grid`) via `.pathable-grid`
- Column configurations for 2, 3, and 4 equal-width columns via `.pathable-grid--cols-{n}`
- Token-based uniform gap between cells via `.pathable-grid--gap-{sm,md,lg,xl}`
- Token-based separate column and row gap via `.pathable-grid--column-gap-{sm,md,lg,xl}` and `.pathable-grid--row-gap-{sm,md,lg,xl}`
- Vertical item alignment via `.pathable-grid--align-{start,center,end,stretch,baseline}`
- Sizing: `width`, `maxWidth` via `SizingProps`
- External spacing: `margin`, `marginX`, `marginY`, `marginTop`, `marginBottom` via `SpacingProps`
- Polymorphic `as` element selection
- Ref forwarding
- Consumer `className` composition
- Native HTML attribute passthrough (id, data-*, aria-*, event handlers)

### Excluded from Grid

- `justify` prop (horizontal grid alignment — justify-items/justify-content)
- Full CSS Grid language: `grid-template-columns`, `grid-template-rows`, `grid-area`, named grid lines
- Responsive column counts (until SCSS contract is extended)
- Masonry or subgrid behavior
- Internal padding (`padding`, `paddingX`, `paddingY`)
- Typography props (variant, tone, fontFamily, fontWeight)
- Color/tone props
- Display/visibility props
- `minWidth` (not in current `SizingProps`)