# 12 — Surface Primitive

Status: NOT STARTED → change to DONE when complete

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 4 and Suggested Slice 12

## Scope

Implement `Surface`, only if real code and design evidence justifies it. `Surface` coordinates foreground, background, border, elevation, and focus treatment into a single semantic prop. It is NOT simply a typed alias for `background-color`.

## Precondition

Before implementation begins, at least two concrete application use cases must demonstrate repeated, coordinated surface behavior that cannot be served by `Box` with `className`. This precondition must be documented in the implementation branch. If no such evidence exists, this feature is cancelled and its number is skipped.

## Includes (contingent on precondition)

- Implement a `Surface` component exported from `@pathable/react` with:
  - A `variant` prop (`"default"`, `"subtle"`, `"primary"`, others verified from SCSS) that selects coordinated foreground, background, border, and focus-ring classes. The `variant` value type is the `SurfaceTone` union from the shared tone vocabulary defined in [11](./11-semantic-colors-tones.md); `variant` is chosen over `tone` because the prop selects an entire coordinated surface treatment (background, border, elevation, focus), not a single text or border color.
  - Support for the shared border-tone vocabulary from [11](./11-semantic-colors-tones.md) via a `borderTone` prop.
  - Optional `elevation` prop mapping to verified elevation/shadow utility classes.
  - Optional `borderTone` prop from the shared border-tone vocabulary.
- Default rendered element is `div`, with an `as` prop.
- Support sizing and external-spacing props from shared capability interfaces.
- Merge resolved surface classes, native element props, consumer `className`, and ref forwarding.
- Unit-test: each variant maps to the correct coordinated set of classes; elevation and border tone combine correctly; ref/as behavior; no wrapper elements.
- Add Storybook stories demonstrating each supported variant.

## Excludes

- Raw color, background, or border-color props.
- Arbitrary box-shadow values.

## Dependencies

- [01 — Semantic Utility Type System and Class Resolvers](./01-semantic-prop-foundation.md)
- [04 — Box Primitive](./04-box-primitive.md)
- [11 — Semantic Color and Tone Model](./11-semantic-colors-tones.md)

## DONE Means

Either:

- The precondition is NOT met: this feature is **CANCELLED**, the file status is updated to CANCELLED, and a brief rationale is recorded here. Nothing ships.

Or:

- `Surface` is exported from `@pathable/react`.
- Every supported `variant` maps to a verified SCSS contract covering foreground, background, border, and focus.
- Elevation and border tone (if included) map to verified classes.
- Unit tests confirm coordinated class output for each variant.
- Storybook stories exist and render.
- Server/client output is identical.
- CI passes.
