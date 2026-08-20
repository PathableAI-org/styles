# Data Model: Container Layout Primitive

**Feature**: Container Layout Primitive  
**Date**: 2026-08-20  

## Entity: Container

A React component that renders a centered, width-constrained content region.

### Type Model

```typescript
type ContainerSize = 'standard' | 'wide' | 'full'

type ContainerOwnProps<T extends React.ElementType> = {
  /** The HTML element to render. Defaults to 'div'. */
  as?: T
  /** The width constraint. Maps to `.pathable-container--{size}` modifier. */
  size?: ContainerSize
  /** Consumer className, appended after semantic classes. */
  className?: string
  /** Child content, rendered as direct children with no wrappers. */
  children?: React.ReactNode
}

type ContainerProps<T extends React.ElementType = 'div'> =
  ContainerOwnProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ContainerOwnProps<T>>
```

### Prop-to-Class Mapping

| Prop | Value | CSS Class | CSS Effect |
|------|-------|-----------|------------|
| `size` | `undefined` | `pathable-container` (base only) | Default 1024px max-width, centered, padded |
| `size` | `"standard"` | `pathable-container--standard` | 1024px max-width (explicit) |
| `size` | `"wide"` | `pathable-container--wide` | 1280px max-width |
| `size` | `"full"` | `pathable-container--full` | 100% max-width (full-bleed) |
| `as` | `"div"` (default) | — | Renders `<div>` |
| `as` | `"main"` | — | Renders `<main>` landmark |
| `as` | `"section"` | — | Renders `<section>` |
| `as` | `"nav"` | — | Renders `<nav>` landmark |

### Class Merge Order

```
pathable-container → pathable-container--{size} → consumer className
```

### Invariants

- Only one root DOM element is ever rendered
- No wrapper DOM elements are introduced
- Children are rendered as direct children of the root element
- Server and client output is identical (no browser-only resolution)
- `as` is restricted to container elements (no void elements)