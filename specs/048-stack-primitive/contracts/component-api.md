# Component Interface Contracts: Stack

## Component API Contract

### Public Export

```typescript
// packages/react/src/index.ts
export { Stack } from './components/Stack/Stack.js'
export type { StackProps, StackGap } from './components/Stack/Stack.js'
```

### Package Entry

The `Stack` component is accessible from the `@pathable/react` package root:

```typescript
import { Stack } from '@pathable/react'
import type { StackProps, StackGap } from '@pathable/react'
```

### Component Signature

```typescript
export const Stack: React.ForwardRefExoticComponent<
  StackProps & React.RefAttributes<HTMLElement>
>
```

### Props

```typescript
export type StackGap = 'sm' | 'md' | 'lg' | 'xl'

export interface StackProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    SizingProps,
    SpacingProps {
  as?: React.ElementType
  gap?: StackGap
  align?: AlignItems
  children?: React.ReactNode
  className?: string
}
```

Where `SizingProps` and `SpacingProps` are imported from the internal capability system:

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

type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
```

## HTML Output Contract

### Default Render

```tsx
<Stack />
```

```html
<div class="pathable-stack"></div>
```

### With Gap

```tsx
<Stack gap="sm">
  <span>A</span>
  <span>B</span>
</Stack>
```

```html
<div class="pathable-stack pathable-stack--gap-sm">
  <span>A</span>
  <span>B</span>
</div>
```

### With Gap and Alignment

```tsx
<Stack gap="lg" align="center">
  <span>A</span>
  <span>B</span>
</Stack>
```

```html
<div class="pathable-stack pathable-stack--gap-lg pathable-flex-align-center">
  <span>A</span>
  <span>B</span>
</div>
```

### With Sizing and Spacing

```tsx
<Stack gap="md" width="full" maxWidth="desktop" marginX="auto">
  <span>A</span>
</Stack>
```

```html
<div class="pathable-stack pathable-stack--gap-md pathable-width-full pathable-maxw-desktop pathable-margin-x-auto">
  <span>A</span>
</div>
```

### With as Prop

```tsx
<Stack as="section" gap="sm">
  <span>A</span>
</Stack>
```

```html
<section class="pathable-stack pathable-stack--gap-sm">
  <span>A</span>
</section>
```

### With Consumer className

```tsx
<Stack gap="md" className="content-section">
  <span>A</span>
</Stack>
```

```html
<div class="pathable-stack pathable-stack--gap-md content-section">
  <span>A</span>
</div>
```

### With Ref Forwarding

```tsx
const ref = useRef<HTMLElement>(null)
<Stack ref={ref} gap="sm" />
// ref.current instanceof HTMLDivElement === true
// ref.current.className includes "pathable-stack"
```

### With as and Ref

```tsx
const ref = useRef<HTMLElement>(null)
<Stack as="section" ref={ref} gap="sm" />
// ref.current instanceof HTMLElement === true
// ref.current.tagName === "SECTION"
```

## Class Merge Order Contract

The `class` attribute on the root element MUST contain classes in this relative order:

1. `pathable-stack` (always present)
2. `pathable-stack--gap-{value}` (if `gap` prop is set)
3. `pathable-flex-align-{value}` (if `align` prop is set)
4. `pathable-width-{value}` (if `width` prop is set)
5. `pathable-maxw-{value}` (if `maxWidth` prop is set)
6. `pathable-margin-{n}` (if `margin` prop is set)
7. `pathable-margin-x-{n}` (if `marginX` prop is set)
8. `pathable-margin-y-{n}` (if `marginY` prop is set)
9. `pathable-margin-top-{n}` (if `marginTop` prop is set)
10. `pathable-margin-bottom-{n}` (if `marginBottom` prop is set)
11. Consumer `className` value (if provided)

No other classes MUST appear. No wrapper elements MUST exist between the root element and children.

## SSR Contract

For all supported prop combinations, the DOM output (element tag, class attribute string, child structure) MUST be identical when rendered server-side and client-side. No browser-only resolution or hydration may modify the class string or element structure.

## Scope Boundaries

### Included in Stack

- Vertical flex layout (`flex-direction: column`) via `.pathable-stack`
- Token-based gap between children via `.pathable-stack--gap-{sm,md,lg,xl}`
- Cross-axis child alignment via `.pathable-flex-align-{start,center,end,stretch,baseline}`
- Sizing: `width`, `maxWidth` via `SizingProps`
- External spacing: `margin`, `marginX`, `marginY`, `marginTop`, `marginBottom` via `SpacingProps`
- Polymorphic `as` element selection
- Ref forwarding
- Consumer `className` composition
- Native HTML attribute passthrough (id, data-*, aria-*, event handlers)

### Excluded from Stack

- `justifyContent` / `justify` prop (belongs to a future feature)
- Internal padding (`padding`, `paddingX`, `paddingY`)
- Typography props (variant, tone, fontFamily, fontWeight)
- Color/tone props
- Display/visibility props
- Flex/grid child participation props (flex, flexGrow, flexShrink)
- `minWidth` (not in current `SizingProps`)
- Wrapping behavior (Inline/Cluster)
- Grid columns (Grid)
- Recursive nesting controls