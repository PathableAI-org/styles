# 04 — Box Primitive

Status: NOT STARTED → change to DONE when complete

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 3 and Suggested Slice 4

## Scope

Implement `Box`, the lowest-level generic React adapter for Pathable layout utilities. `Box` covers cases where an author needs an HTML element but no more specific Pathable component expresses its purpose. Built on the shared type system and resolvers from [01](./01-semantic-prop-foundation.md).

## Includes

- Implement a `Box` component exported from `@pathable/react`.
- Default rendered element is `div`.
- Support a polymorphic `as` prop (e.g. `as="main"`, `as="section"`, `as="article"`, `as="nav"`, `as="form"`).
- Expose approved shared layout capabilities: sizing (`width`, `maxWidth`, `minWidth`), external spacing (`margin`, `marginX`, `marginY`, directional margins), internal spacing (`padding`, `paddingX`, `paddingY`, directional padding), and display/visibility utilities.
- Merge native element props (passed through for the selected element), resolved semantic classes, and consumer `className` using the order from [01](./01-semantic-prop-foundation.md).
- Forward refs correctly through the polymorphic element.
- Produce deterministic, server-renderable output — no browser-only resolution.
- Unit-test: class merging, native props passthrough, ref forwarding, element selection via `as`, and absence of extra DOM nodes.
- Add Storybook stories demonstrating common `Box` usage patterns.
- Document that `Box` should replace an element the author already needs, not become a universal wrapper.

## Excludes

- `asChild` composition model.
- Typography, tone, or color props — `Box` is a layout primitive, not a text or surface primitive.
- Layout-relationship props (`gap`, direction, alignment) — those belong to `Stack`, `Inline`, `Grid`, etc.

## Dependencies

- [01 — Semantic Utility Type System and Class Resolvers](./01-semantic-prop-foundation.md)

## DONE Means

- `Box` is exported from `@pathable/react`.
- `<Box as="main" width="full" maxWidth="desktop" marginX="auto" paddingX="4">` renders exactly one `<main>` element with the expected classes and no children wrapping.
- `<Box>` (no props) renders a plain `<div>`.
- Polymorphic typing restricts `as` to valid HTML elements and correctly narrows which native props are accepted per element.
- Ref forwarding works correctly (ref points to the rendered DOM element).
- Unit tests cover the combinations above plus edge cases (invalid `as`, missing props, class conflicts).
- Storybook stories exist and render.
- Server/client output is identical for all covered prop combinations.
- CI passes.