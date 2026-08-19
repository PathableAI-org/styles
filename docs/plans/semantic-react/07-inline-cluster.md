# 07 — Inline and Cluster Primitives

Status: NOT STARTED → change to DONE when complete

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 3 and Suggested Slice 7

## Scope

Implement `Inline` and `Cluster`, two related layout primitives that arrange children in the horizontal (inline) axis. `Inline` creates a single row of evenly-spaced items. `Cluster` creates a wrapping row where items flow onto new lines when space is constrained.

## Includes

### Inline

- Renders a horizontal flex container (`flex-direction: row`) via verified SCSS utility classes.
- Expose a constrained `gap` prop (same spacing scale as [06](./06-stack-primitive.md)).
- Expose cross-axis alignment and inline-axis justification props backed by verified alignment utilities.
- Default rendered element is `div`, with an `as` prop.

### Cluster

- Renders a wrapping horizontal flex container via verified SCSS utility classes (e.g. `flex-wrap: wrap`).
- Expose constrained `gap` and row-gap props from the spacing scale.
- Expose cross-axis alignment for wrapped rows.
- Ensure wrapping behavior does not require fixed child widths; children size intrinsically and wrap naturally.

### Shared

- Both components support sizing and external-spacing props from the shared capability interfaces ([01](./01-semantic-prop-foundation.md)).
- Merge resolved classes, native element props, consumer `className`, and ref forwarding using established patterns from [04](./04-box-primitive.md).
- Unit-test: each component's distinguishing class (row, wrap) is present; `gap` values map correctly; alignment classes apply; no child wrappers.
- Add Storybook stories: `<Inline gap="2">`, `<Cluster gap="3">`, mixed-alignment cases, responsive wrapping visual examples.

## Excludes

- Vertical stacking — that belongs to `Stack` ([06](./06-stack-primitive.md)).
- Grid layout — that belongs to `Grid` ([08](./08-grid-primitive.md)).
- Typography, color, tone props.
- Custom breakpoint-based wrapping controls.

## Dependencies

- [01 — Semantic Utility Type System and Class Resolvers](./01-semantic-prop-foundation.md)
- [04 — Box Primitive](./04-box-primitive.md)
- [06 — Stack Primitive](./06-stack-primitive.md) (shared `gap` scale and patterns)

## DONE Means

- `Inline` and `Cluster` are exported from `@pathable/react`.
- `<Inline gap="2">` renders a horizontal non-wrapping flex container with correct gap.
- `<Cluster gap="3">` renders a wrapping horizontal flex container with correct gap.
- Every supported `gap` and alignment value maps to a verified SCSS class.
- Unit tests differentiate `Inline` (no-wrap) from `Cluster` (wrap) and confirm ref/as/class behavior.
- Storybook stories exist and render for both components.
- Server/client output is identical.
- CI passes.
