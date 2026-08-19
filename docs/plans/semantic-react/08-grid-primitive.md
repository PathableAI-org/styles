# 08 — Grid Primitive

Status: NOT STARTED → change to DONE when complete

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 3 and Suggested Slice 8

## Scope

Implement `Grid`, a layout primitive for design-system-approved column and gap patterns. `Grid` intentionally does not expose the full CSS Grid language; it expresses the project's standard grid layouts as semantic props.

## Includes

- Implement a `Grid` component exported from `@pathable/react`.
- Default rendered element is `div`, with an `as` prop.
- Support a constrained set of column configurations tied to the project's grid system (e.g. `cols={2}`, `cols={3}`, `cols={4}`, or named grid templates verified against SCSS).
- Expose a `gap` prop from the shared spacing scale, with separate `columnGap` and `rowGap` where the SCSS contract supports it.
- Expose alignment props where the SCSS contract provides grid-specific alignment utilities.
- Support sizing and external-spacing props from shared capability interfaces.
- Merge resolved classes, native element props, consumer `className`, and ref forwarding using established patterns.
- Unit-test: correct grid class per column configuration, gap values map correctly, no child wrappers, ref/as behavior works.
- Component test verifies that immediate children (not grandchildren) participate in the grid.
- Add Storybook stories: `<Grid cols={2} gap="4">`, `<Grid cols={3} gap="2">`, and mixed-content examples.

## Excludes

- Full CSS Grid language (arbitrary `grid-template-columns`, `grid-template-rows`, `grid-area`, named grid lines).
- Responsive column counts — unless the SCSS contract explicitly supports responsive grid utilities and their API semantics have been specified.
- Masonry or subgrid behavior.
- Typography, color, tone props.

## Dependencies

- [01 — Semantic Utility Type System and Class Resolvers](./01-semantic-prop-foundation.md)
- [04 — Box Primitive](./04-box-primitive.md)
- [06 — Stack Primitive](./06-stack-primitive.md) (shared `gap` scale)

## DONE Means

- `Grid` is exported from `@pathable/react`.
- `<Grid cols={2} gap="4">` renders a CSS Grid container with the correct column and gap classes.
- Every supported column count maps to a verified SCSS utility class.
- Unit and component tests confirm grid classes, gap values, alignment, ref/as, and no child wrapping.
- Storybook stories exist and render.
- Server/client output is identical.
- CI passes.