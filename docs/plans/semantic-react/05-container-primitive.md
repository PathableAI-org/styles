# 05 — Container Primitive

Status: NOT STARTED → change to DONE when complete

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 3 and Suggested Slice 5

## Scope

Implement `Container`, a layout primitive that establishes a constrained page-width region. `Container` standardizes the common "centered content with a max-width and horizontal page-gutter padding" pattern into a single semantic prop.

## Includes

- Implement a `Container` component exported from `@pathable/react`.
- Default rendered element is `div`, with an `as` prop for semantic overrides.
- Expose a `size` prop with named values backed by verified maximum-width utilities or semantic classes from `@pathable/styles` (e.g. `"desktop"`, `"tablet"`, `"content"`, `"full"`).
- Apply consistent horizontal page padding (`paddingX`) appropriate to the container role, based on SCSS contract verification.
- Ensure `Container` is full-width by default (constrained only by its `size`).
- Support external margin props (`marginX="auto"` for centering is automatic; `margin` overrides where sensible).
- Merge resolved classes, native element props, consumer `className`, and ref forwarding using the same established patterns from [04](./04-box-primitive.md).
- Unit-test: each `size` value maps to the correct max-width class, centering and padding classes are present, no wrapper element exists, ref forwarding works.
- Add Storybook stories for `<Container size="desktop">`, `<Container size="tablet">`, and each supported size value.

## Excludes

- Arbitrary `maxWidth` as an override on `Container` — the `size` enum expresses the pattern; `Box` with `maxWidth` covers custom cases.
- Typography, color, tone props.
- Child-layout relationship props.
- Responsive breakpoint props unless explicitly specified and SCSS-supported.

## Dependencies

- [01 — Semantic Utility Type System and Class Resolvers](./01-semantic-prop-foundation.md)
- [04 — Box Primitive](./04-box-primitive.md) (reference for polymorphic patterns)

## DONE Means

- `Container` is exported from `@pathable/react`.
- `<Container size="desktop">` renders a centered, max-width-constrained `div` with horizontal padding and no child wrappers.
- Every named `size` value maps to a verified SCSS utility class.
- Unit tests confirm class output, ref forwarding, and `as` behavior.
- Storybook stories exist and render for each size.
- Server/client output is identical.
- CI passes.
