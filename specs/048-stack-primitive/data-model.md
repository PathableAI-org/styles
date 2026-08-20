# Data Model: Stack Layout Primitive

**Feature**: Stack Layout Primitive
**Date**: 2026-08-20

## Overview

The `Stack` component has a simple data model: typed prop values map to CSS class names via lookup tables and resolver functions. There are no data entities, state transitions, or persisted data. This document describes the type design, class-mapping tables, and the prop-to-class resolution flow.

## Types

### Gap Prop

```typescript
export type StackGap = 'sm' | 'md' | 'lg' | 'xl'
```

A string literal union. Each value maps directly to a BEM modifier class suffix.

### Gap Class Map

```typescript
const STACK_GAP_CLASS: Record<StackGap, string> = {
  sm: 'pathable-stack--gap-sm',
  md: 'pathable-stack--gap-md',
  lg: 'pathable-stack--gap-lg',
  xl: 'pathable-stack--gap-xl',
}
```

One-to-one mapping from prop value to SCSS modifier class.

### Align Prop

Reuses the existing `AlignItems` type from `internal/resolvers/alignment.ts`:

```typescript
type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
```

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

Note: `minWidth` is **not** included because it does not exist in the current `SizingProps` interface. Internal spacing props (`padding`, `paddingX`, `paddingY`) are excluded per the spec's scope boundary.

### Component Props Interface

```typescript
export interface StackProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    SizingProps,
    SpacingProps {
  as?: ElementType
  gap?: StackGap
  align?: AlignItems
  children?: ReactNode
  className?: string
}
```

**Design decisions**:

- `AlignItems` is included directly rather than via `AlignmentProps` because `AlignmentProps` also includes `justifyContent`, which `Stack` must not expose.
- `SizingProps` and `SpacingProps` are included via `extends` (intersection) rather than as separate optional props. This provides compile-time validation and autocomplete for the full value unions.
- The `color` prop is omitted from `HTMLAttributes` because it's a legacy HTML attribute, not a design-system token.
- The `as` prop defaults to `'div'` via `const Component = as ?? 'div'` inside the component.

## Prop-to-Class Resolution Flow

```text
Stack props
  │
  ├─ gap ─────────────► STACK_GAP_CLASS[gap] ─► "pathable-stack--gap-{value}" or undefined
  ├─ align ───────────► alignItemsClass(align) ─► "pathable-flex-align-{value}" or undefined
  ├─ width ───────────► widthClass(width) ─► "pathable-width-{value}" or undefined
  ├─ maxWidth ────────► maxWidthClass(maxWidth) ─► "pathable-maxw-{value}" or undefined
  ├─ margin ──────────► marginAllClass(margin) ─► "pathable-margin-{n}" or undefined
  ├─ marginX ─────────► marginXClass(marginX) ─► "pathable-margin-x-{n}" or undefined
  ├─ marginY ─────────► marginYClass(marginY) ─► "pathable-margin-y-{n}" or undefined
  ├─ marginTop ───────► marginTopClass(marginTop) ─► "pathable-margin-top-{n}" or undefined
  ├─ marginBottom ────► marginBottomClass(mb) ─► "pathable-margin-bottom-{n}" or undefined
  └─ className ───────► string (consumer-provided, passed through)
```

All resolved class strings (each either a string or `undefined`) are passed to `mergeClasses` in order, which filters out falsy values and joins with spaces.

### mergeClasses Call

```typescript
const classes = mergeClasses(
  'pathable-stack',                    // 1. base class
  gap ? STACK_GAP_CLASS[gap] : undefined,  // 2. gap modifier
  alignItemsClass(align),              // 3. alignment utility
  widthClass(width),                   // 4. sizing utilities
  maxWidthClass(maxWidth),
  marginAllClass(margin),              // 5. spacing utilities
  marginXClass(marginX),
  marginYClass(marginY),
  marginTopClass(marginTop),
  marginBottomClass(marginBottom),
  className,                           // 6. consumer class (last)
)
```

## Component Structure

```typescript
function StackInner(
  { as, gap, align, children, className = '',
    width, maxWidth,
    margin, marginX, marginY, marginTop, marginBottom,
    ...rest
  }: StackProps,
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

export const Stack = forwardRef<HTMLElement, StackProps>(StackInner)
```

## Exports

Added to `packages/react/src/index.ts`:

```typescript
export { Stack } from './components/Stack/Stack.js'
export type { StackProps, StackGap } from './components/Stack/Stack.js'
```

## Test Data Model

| Test Subject | Input | Expected Class(es) on Root |
|-------------|-------|---------------------------|
| Base (no props) | `<Stack />` | `pathable-stack` |
| gap="sm" | `<Stack gap="sm" />` | `pathable-stack pathable-stack--gap-sm` |
| gap="md" | `<Stack gap="md" />` | `pathable-stack pathable-stack--gap-md` |
| gap="lg" | `<Stack gap="lg" />` | `pathable-stack pathable-stack--gap-lg` |
| gap="xl" | `<Stack gap="xl" />` | `pathable-stack pathable-stack--gap-xl` |
| align="center" | `<Stack align="center" />` | `pathable-stack pathable-flex-align-center` |
| align="start" | `<Stack align="start" />` | `pathable-stack pathable-flex-align-start` |
| gap + align | `<Stack gap="sm" align="center" />` | `pathable-stack pathable-stack--gap-sm pathable-flex-align-center` |
| width="full" | `<Stack width="full" />` | `pathable-stack pathable-width-full` |
| maxWidth="desktop" | `<Stack maxWidth="desktop" />` | `pathable-stack pathable-maxw-desktop` |
| marginX="auto" | `<Stack marginX="auto" />` | `pathable-stack pathable-margin-x-auto` |
| className | `<Stack className="custom" />` | `pathable-stack custom` (custom last) |
| as="section" | `<Stack as="section" />` | rendered as `<section>`, classes present |
| ref forwarding | `ref` passed | `ref.current` is the DOM element |
| Empty children | `<Stack />` | Empty root element, no error |
| Server vs client | Any prop combination | Identical class string |

## Invalid Input Handling

- Invalid `gap` value at runtime: `STACK_GAP_CLASS[gap]` returns `undefined`, the class is silently omitted. TypeScript prevents this at compile time.
- Invalid `align` value at runtime: `alignItemsClass` returns `undefined`, the class is silently omitted. TypeScript prevents this at compile time.
- Void element for `as`: The polymorphic typing restricts `as` to `ElementType` broadly, but it's acceptable because the `children` prop is typed as `ReactNode` — void elements with children produce a React warning at runtime, not a crash. A stricter type constraint (excluding void elements) would require a type-level check not currently implemented in the codebase's polymorphic pattern.
- All resolvers handle `null` and `undefined` gracefully, returning `undefined` rather than throwing.