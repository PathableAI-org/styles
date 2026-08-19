# 02 — Card Adopts Sizing and Spacing Props

Status: NOT STARTED → change to DONE when complete

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 2 and Suggested Slice 2

## Scope

Use the shared type system and resolvers from [01](./01-semantic-prop-foundation.md) to add selected sizing and external-spacing props to the `Card` component. This is the architectural proof point: if `Card` accepts typed semantic props, maps them to existing CSS classes, preserves its public markup, and behaves identically during server and client rendering, the core approach is validated.

## Includes

- Add `width`, `maxWidth`, `margin`, `marginX`, `marginY`, and directional margin props to `Card`'s public API.
- Merge resolved classes with `Card`'s existing component classes and consumer `className` using the merge order established in [01](./01-semantic-prop-foundation.md).
- Ensure `Card` applies all semantic classes to the same root `div` it already owns — no extra wrapper element is introduced.
- Preserve existing ref forwarding, native element props, server rendering behavior, and accessibility.
- Add unit and/or component tests proving supported props affect the owned root element (class presence, correct values) and introduce no DOM wrapper.
- Add Storybook examples showing `<Card width="full" />`, `<Card maxWidth="tablet" marginX="auto" />`, and similar common patterns.
- Add a Storybook story that exercises the runtime initialisation contract from `packages/storybook-contracts` if one exists for rendering verification.

## Excludes

- Internal padding props on `Card`.
- Typography, color, display, visibility, or layout-participation props.
- Retrofitting any component other than `Card`.
- Layout primitives (`Box`, `Container`, etc.).

## Dependencies

- [01 — Semantic Utility Type System and Class Resolvers](./01-semantic-prop-foundation.md)

## DONE Means

- `Card`'s TypeScript interface includes the imported sizing and spacing capability interfaces.
- A component test confirms `<Card maxWidth="tablet" marginX="auto" />` renders exactly one root element with the expected classes and no child wrapper.
- Storybook stories for the new props render and pass any automated Storybook contract checks.
- Server-rendered output matches client-rendered output for all new prop combinations.
- CI passes.
