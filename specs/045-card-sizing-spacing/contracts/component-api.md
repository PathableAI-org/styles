# Interface Contracts: Card Sizing and Spacing Props

**Feature**: specs/045-card-sizing-spacing
**Date**: 2026-08-19

This feature does not introduce new external interfaces, APIs, or protocols. All changes are internal to the `Card` component's prop interface within `packages/react`.

## Component API Contract

### CardProps (extended)

```typescript
import { SizingProps, SpacingProps } from '../../internal/resolvers/types'

interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>,
    SizingProps,
    SpacingProps {
  title?: ReactNode
  footer?: ReactNode
  media?: ReactNode
  presentation?: CardPresentation
  metadata?: ReactNode
  status?: ReactNode
  actions?: ReactNode
}
```

### Contract Summary

| Aspect | Contract |
|---|---|
| Root element | Single `<div>` — no extra wrappers under any prop combination |
| Class merge order | `pathable-card` → presentation class → semantic classes → consumer `className` |
| Ref forwarding | Preserved, points to root `<div>` |
| Native props | Passthrough to root element (id, data-*, aria-*, event handlers) |
| SSR consistency | Deterministic — no browser-only globals in resolver code |
| Type safety | All new props have typed union values; TypeScript validates at build time |
| Accessibility | No change to existing ARIA roles, semantic HTML, or keyboard behavior |

### Breaking Changes

None. All existing props, behavior, and markup are preserved. New props are all optional.