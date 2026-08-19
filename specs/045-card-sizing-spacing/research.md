# Research: Card Sizing and Spacing Props

**Feature**: specs/045-card-sizing-spacing
**Date**: 2026-08-19

## Decision 1: Resolve `marginX="auto"` / margin auto values

**Decision**: Add `auto` to the margin resolver maps in `packages/react/src/internal/resolvers/spacing.ts`.

**Rationale**: The feature specification and parent architecture plan repeatedly cite `marginX="auto"` as a primary use case (centering a Card within a layout). However, the current `SpacingScale` type is defined as `keyof typeof PADDING_MAP`, which only includes numeric scale values `'0'` through `'15'`. The margin resolver maps (`MARGIN_MAP`, `MARGIN_X_MAP`, etc.) also lack an `auto` entry.

Investigation confirmed that `@pathable/styles` does not emit `pathable-margin-x-auto` or equivalent margin-auto utility classes. The CSS `margin-inline: auto` centering pattern is used in component-specific SCSS (e.g., `pathable-container`, `pathable-wizard`) rather than as a general utility.

The approach is:
1. Extend the `SpacingScale` type to include `'auto'` (or create a separate `MarginScale` that extends `SpacingScale` with `'auto'`)
2. Add `auto: 'pathable-margin-x-auto'` (for marginX only) or add `auto` to all margin maps
3. Only `marginX` and `margin` benefit from `auto` in practice; directional margins (`marginTop`, `marginBottom`) with `auto` have no meaningful centering effect

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| Leave `auto` out of this slice; defer to a future feature | The spec and architecture plan make `marginX="auto"` a primary acceptance scenario. Deferring it would mean the feature doesn't deliver the promised centering pattern. |
| Add auto to all margin maps uniformly | `marginTop="auto"` and `marginBottom="auto"` behave differently from `marginX="auto"` — they push an element to the bottom/top of a flex container, which is less commonly needed on Card. Adding `auto` only to `margin` and `marginX` maps is more intentional. |
| Generate margin-auto CSS in `packages/styles` | This would require a SCSS utility change in a separate feature, delaying this slice. Since this is an architectural proof point, resolver-side handling is sufficient. |

## Decision 2: Card adopts `mergeClasses` utility

**Decision**: Replace Card's manual class concatenation with the `mergeClasses` utility from `packages/react/src/internal/resolvers/mergeClasses.ts`.

**Rationale**: Card currently assembles classes manually:

```typescript
const classes = ['pathable-card', presentationClass, className]
  .filter(Boolean)
  .join(' ')
```

This does not follow the documented merge order (required → semantic → consumer) required by the conflict resolution policy. The `mergeClasses` utility enforces this order and filters empty/null/undefined values. Adopting it ensures Card follows the same class-merging contract as all future components.

The refactored call will be:

```typescript
const classes = mergeClasses(
  'pathable-card',          // required component class
  presentationClass,         // presentation variant class
  widthClass(width),         // resolved semantic classes...
  maxWidthClass(maxWidth),
  marginAllClass(margin),
  marginXClass(marginX),
  marginYClass(marginY),
  marginTopClass(marginTop),
  marginBottomClass(marginBottom),
  className,                 // consumer className
)
```

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| Keep manual `.filter(Boolean).join(' ')` | Duplicates logic, does not enforce merge order, inconsistent with other components that will adopt semantic props. |
| Create Card-specific merge helper | Unnecessary abstraction; `mergeClasses` is already the shared utility. |

## Decision 3: Conflict resolution for shorthand vs directional margin props

**Decision**: Follow the existing conflict policy from `packages/react/src/internal/resolvers/conflictPolicy.md` — resolve directional props AFTER shorthand props in the `mergeClasses` call.

**Rationale**: The conflict policy defines that directional props appear later in `mergeClasses` arguments, letting CSS cascade handle precedence. When both `margin` and `marginTop` are specified, `marginAllClass(margin)` is called first, then `marginTopClass(...)` — the directional class appears later in the output and wins on equal specificity.

No new policy needed; the existing policy applies directly.

## Decision 4: Card test strategy

**Decision**: Add a focused component test file `Card.sizingSpacing.test.tsx` covering:
1. Class presence for each supported prop
2. No extra wrapper DOM elements
3. Class merge order (component → semantic → consumer)
4. Server rendering consistency (use `renderToString` from `react-dom/server`)
5. Ref forwarding preserved
6. Native props (id, data-*, aria-*) passthrough preserved

**Rationale**: The spec requires component-level proof that semantic props affect the root element without introducing wrappers. The existing resolver unit tests cover prop-to-class mapping; component tests verify integration. React Testing Library with `render` and `renderToString` provides both client and server rendering paths.

## Decision 5: Storybook story scope

**Decision**: Add 3–4 deterministic Card stories:
1. `<Card width="full" />` — full-width card
2. `<Card maxWidth="tablet" marginX="auto" />` — centered, constrained card
3. `<Card marginTop="4" marginBottom="8" />` — directional spacing
4. A composition story showing Card inside a Container with spacing

Plus optionally a story exercising the runtime-initialization contract from `packages/storybook-contracts` if one exists for rendering verification.

**Rationale**: These stories cover the primary use cases: width constraint, centering, and margin control. They are deterministic (no dates, random values, network calls).