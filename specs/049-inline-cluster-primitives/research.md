# Research: Inline and Cluster Layout Primitives

**Feature**: Inline and Cluster Layout Primitives
**Date**: 2026-08-20
**Purpose**: Resolve all design decisions before Phase 1 contracts and data model

## Decision 1: Inline SCSS Contract Design

**Decision**: Create a new `pathable-inline.scss` following the Stack SCSS pattern — CSS custom property `--pathable-inline-gap` with modifier classes that override it. No alignment modifiers in SCSS.

**Rationale**:
- `pathable-stack.scss` uses the pattern: base class sets `gap: var(--pathable-stack-gap, fallback)`, modifier classes override `--pathable-stack-gap`. This is the established convention for layout primitive gap control.
- `pathable-cluster.scss` uses the same CSS custom property pattern for gap. Inline should be consistent.
- Keeping alignment out of the Inline SCSS contract (relying on the existing utility class system) follows the Stack pattern and avoids duplicating alignment logic in SCSS.

**Alternatives considered**:
- **Build alignment into Inline SCSS like Cluster**: Cluster bakes alignment into its SCSS (`--pathable-cluster-align` with `--align-*` modifiers). This would create two different alignment strategies in the same feature, making the codebase harder to understand. Rejected in favor of consistency with Stack.
- **No gap modifier at all — use utility classes for gap**: The `.pathable-flex-align-*` utilities exist for alignment, but there are no equivalent `.pathable-gap-*` utilities. The gap modifier approach is already proven by Stack and Cluster. Rejected because it would require creating new gap utilities or accepting inline styles.

## Decision 2: Inline Alignment Strategy — Utility Classes

**Decision**: Inline's `align` prop maps to existing `.pathable-flex-align-{value}` utility classes via `alignItemsClass()`. Inline's `justify` prop maps to existing `.pathable-flex-justify-{value}` utility classes via `justifyContentClass()`.

**Rationale**:
- `alignItemsClass()` and `justifyContentClass()` already exist in `packages/react/src/internal/resolvers/alignment.ts` and are ready to use.
- Stack already uses `alignItemsClass()` for its `align` prop (Stack excludes `justifyContent` from scope).
- Using the external utility classes means no alignment-related CSS custom properties or modifier classes in the Inline SCSS contract — keeping it focused on gap control only.
- The utility classes work identically on any element — there is no behavioral difference between applying them to a pathable component vs. a generic `div`.

**Alternatives considered**:
- **Build alignment into Inline SCSS like Cluster**: Would create two alignment patterns in the same feature (Cluster uses SCSS modifiers; Inline uses utility classes). Since Cluster's SCSS already exists with alignment built-in, changing Cluster's approach would be a breaking SCSS change out of scope for this feature.
- **Create a separate Inline-alignment SCSS pattern**: Would add unnecessary complexity. The utility class approach is simpler and already proven.

## Decision 3: Cluster Alignment Strategy — Use Existing SCSS Modifiers

**Decision**: Cluster's `align` prop maps to `.pathable-cluster--align-{value}` modifier classes from the existing `pathable-cluster.scss` contract.

**Rationale**:
- The `.pathable-cluster--align-start`, `--align-center`, `--align-end`, and `--align-stretch` modifiers already exist in the SCSS contract.
- The base `.pathable-cluster` class defaults `align-items` to `center` via `--pathable-cluster-align`, which differs from the browser default (`stretch`). Using the SCSS modifiers preserves this default behavior.
- Changing Cluster to use utility classes instead of SCSS modifiers would be a breaking CSS change to the existing contract — the SCSS custom property defaults would conflict with utility class overrides.
- There is no `--align-baseline` modifier in the Cluster SCSS. Adding it is a small, backward-compatible SCSS addition.

**Decision for baseline alignment**: Add a `.pathable-cluster--align-baseline` modifier to the Cluster SCSS contract so the React component can support all five AlignItems values from the shared type system.

## Decision 4: Cluster Gap Scale Expansion

**Decision**: Add a `.pathable-cluster--gap-xl` modifier to `pathable-cluster.scss` with `--pathable-cluster-gap: var(--space-24)`.

**Rationale**:
- The spec requires both Inline and Cluster to support the same gap scale: `"sm"`, `"md"`, `"lg"`, `"xl"`. Cluster currently has only `--gap-sm`, `--gap-md`, `--gap-lg`.
- Stack's `--gap-xl` uses `var(--space-32)`. However, Cluster is designed for tighter grouping (tags, chips, buttons). Using `var(--space-24)` for Cluster's `--gap-xl` is more appropriate:
  - Cluster `--gap-sm` = `space-4` (4px) vs Stack `--gap-sm` = `space-8` (8px)
  - Cluster `--gap-md` = `space-8` (8px) vs Stack `--gap-md` = `space-16` (16px)
  - Cluster `--gap-lg` = `space-16` (16px) vs Stack `--gap-lg` = `space-24` (24px)
  - Cluster `--gap-xl` = `space-24` (24px) vs Stack `--gap-xl` = `space-32` (32px)
- The named semantic scale (`"sm"`, `"md"`, `"lg"`, `"xl"`) is the public API; the actual pixel values are handled by each component's SCSS contract. This is documented in the spec (FR-006).

**Alternatives considered**:
- **Use `var(--space-32)` to match Stack exactly**: The semantic gap scale values are intentionally component-specific. Stack is for vertical page layout; Cluster is for tight inline groupings. Different pixel values are appropriate.
- **Not adding `--gap-xl` and only supporting 3 gap values**: The spec explicitly requires 4 gap values for both components. Rejected.

## Decision 5: Cluster `justify` Prop — Exclude from Scope

**Decision**: Cluster does not receive a `justify` prop. This follows the original feature brief which lists cross-axis alignment for Cluster but not inline-axis justification.

**Rationale**:
- Cluster's wrapping behavior interacts non-trivially with `justify-content`. Justifying wrapped rows (e.g., `justify-content: space-between`) produces different visual results depending on how many items end up on the last row, which can look unintentional.
- The original feature brief includes alignment for Cluster but not justification. The spec (FR-009) assigns `justify` only to Inline.
- Inline is the canonical non-wrapping horizontal layout — it is the natural home for `justify-content` since all items remain on one row.
- If justification is needed for a Cluster, developers can pass it via `className` or wrap the Cluster in an element with a justification utility class.

## Decision 6: `row-gap` Prop for Cluster — Exclude from Scope

**Decision**: Cluster does not receive a separate `row-gap` prop. The `gap` prop controls both horizontal and vertical spacing.

**Rationale**:
- The original feature brief mentions a row-gap prop for Cluster, but the spec defers this to planning evaluation (Assumption #10).
- The Cluster SCSS contract uses a single `gap` property (not `row-gap` / `column-gap` separately). Adding separate row-gap control would require SCSS contract changes beyond adding a modifier.
- The CSS `gap` shorthand (`gap: 12px`) is equivalent to `row-gap: 12px; column-gap: 12px`, which is appropriate for Cluster's use case of evenly-spaced wrapping items.
- If separate row-gap control is needed in practice, it can be added in a follow-up feature with matching SCSS contract changes.

## Decision 7: Inline SCSS Gap Scale Values

**Decision**: Inline's gap scale uses the same pixel values as Stack — `var(--space-8)` through `var(--space-32)`.

```scss
// pathable-inline.scss gap modifier values:
--gap-sm: var(--space-8)
--gap-md: var(--space-16)    // default
--gap-lg: var(--space-24)
--gap-xl: var(--space-32)
```

**Rationale**:
- Inline is the horizontal counterpart to Stack — both are non-wrapping single-axis layout primitives. Using the same pixel scale creates visual consistency between vertical and horizontal layouts.
- Cluster uses a tighter scale because wrapping layouts need smaller gaps to avoid looking sparse. Non-wrapping layouts can use wider gaps.
- The default (`--gap-md` = `var(--space-16)`) matches Stack's default.

**Alternatives considered**:
- **Use Cluster's tighter scale for Inline**: Would make Inline look cramped for page-level navigation or toolbar layouts where items need more breathing room.
- **Use different values**: A custom Inline scale would create a third gap axis to document and reason about. Consistency with Stack is the simplest choice.

## Decision 8: SCSS Registration and Forwarding

**Decision**: Add `@forward 'pathable-inline'` to `pathable-layout-composition.scss` (the bundle that already forwards pathable-stack, pathable-cluster, and other layout composition primitives).

**Rationale**:
- `pathable-stack` and `pathable-cluster` are already forwarded from `pathable-layout-composition.scss`. Inline belongs in the same layout composition bundle.
- The bundle is forwarded from `pathable-all.scss` → `_index.scss`, so consumers importing the all-in-one entrypoint will receive Inline automatically.

## Decision 9: Component File Organization

**Decision**: Create separate `Inline/Inline.tsx` and `Cluster/Cluster.tsx` files with their own `__tests__/` directories. No shared code extraction between the two components.

**Rationale**:
- Stack is a single file (`Stack/Stack.tsx`). Even though Inline and Cluster share the gap scale concept, the actual gap class mapping differs (`pathable-stack--gap-*` vs `pathable-cluster--gap-*` vs `pathable-inline--gap-*`). Extracting a shared gap resolver would add indirection for negligible deduplication.
- Both components share the same import pattern (resolvers from `../../internal/resolvers/`), but this is standard across all layout primitives.
- Keeping them in separate files preserves the established one-component-per-directory convention.

## Decision 10: Gap Typing

**Decision**: Each component defines its own `Gap` type locally (e.g., `ClusterGap`, `InlineGap`), following the Stack pattern where `StackGap` is defined in `Stack.tsx`.

**Rationale**:
- Stack defines `StackGap` locally. Inline and Cluster should follow the same pattern.
- The gap type values are identical (`'sm' | 'md' | 'lg' | 'xl'`), but the actual class mappings differ per component. A shared type would obscure the component-specific nature of the gap mapping.

## Summary of SCSS Changes Required

| File | Change | Rationale |
|------|--------|-----------|
| `pathable-inline.scss` | **CREATE** | New SCSS contract for Inline: `flex-direction: row`, gap via CSS custom property, 4 gap modifier classes |
| `pathable-cluster.scss` | **MODIFY** | Add `--gap-xl` modifier (`var(--space-24)`), add `--align-baseline` modifier |
| `pathable-layout-composition.scss` | **MODIFY** | Add `@forward 'pathable-inline'` |

No other SCSS changes needed. No changes to `_utilities.scss`, `pathable-stack.scss`, or any existing component wrappers.