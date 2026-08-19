# 06 — Stack Primitive

Status: NOT STARTED → change to DONE when complete

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 3 and Suggested Slice 6

## Scope

Implement `Stack`, a layout primitive that defines a vertical stacking relationship among its immediate children. `Stack` replaces ad-hoc `flex-direction: column` utility strings with a semantic abstraction.

## Includes

- Implement a `Stack` component exported from `@pathable/react`.
- Default rendered element is `div`, with an `as` prop for semantic overrides (`section`, `nav`, `ol`, etc.).
- Establish a vertical flex layout (`flex-direction: column`) via a verified SCSS utility class.
- Expose a constrained `gap` prop backed by the spacing scale from `@pathable/styles`.
- Expose child-alignment props (e.g. alignment along the cross-axis) backed by verified alignment utilities.
- Support sizing and external-spacing props from the shared capability interfaces ([01](./01-semantic-prop-foundation.md)).
- Merge resolved classes, native element props, consumer `className`, and ref forwarding using established patterns from [04](./04-box-primitive.md).
- Unit-test: flex direction class is present, each `gap` value maps correctly, alignment classes apply, no wrapper beyond the single stacked element exists, children are not re-ordered or wrapped.
- Component test verifies immediate-child layout behavior: a wrapper between `Stack` and its intended children breaks the gap/alignment relationship.
- Add Storybook stories: `<Stack gap="4">`, `<Stack gap="6">`, aligned stacks, and nested layout examples.

## Excludes

- Wrapping behavior — that belongs to `Inline` and `Cluster` (see [07](./07-inline-cluster.md)).
- Grid behavior — that belongs to `Grid` (see [08](./08-grid.md)).
- Recursive `Stack` nesting controls or nested-gap overrides.
- Typography, color, tone props.

## Dependencies

- [01 — Semantic Utility Type System and Class Resolvers](./01-semantic-prop-foundation.md)
- [04 — Box Primitive](./04-box-primitive.md) (polymorphic patterns)

## DONE Means

- `Stack` is exported from `@pathable/react`.
- `<Stack gap="4">` renders a vertically-stacked flex container with the correct gap class and no child wrappers.
- Every supported `gap` value maps to a verified SCSS class.
- Unit and component tests confirm flex layout, `gap`, alignment, ref forwarding, and `as` behavior.
- Storybook stories exist and render.
- Server/client output is identical.
- CI passes.
