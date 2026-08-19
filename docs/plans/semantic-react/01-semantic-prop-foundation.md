# 01 — Semantic Utility Type System and Class Resolvers

Status: NOT STARTED → change to DONE when complete

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 1 and Suggested Slice 1

## Scope

Establish the internal type system and pure resolver layer that maps typed semantic React prop values to verified `@pathable/styles` CSS classes. This feature creates the shared foundation that every downstream component feature consumes; no component API changes ship here.

## Includes

- Inventory public utility families in `@pathable/styles` (token source files, emitted utility classes) and record findings in a short capability-inventory document within `packages/react`.
- Group verified utilities into named semantic capabilities: sizing, spacing, display, alignment, visibility, flex/grid participation, typography, and color/tone.
- Record gaps where a desired semantic role does not yet have an authoritative SCSS contract.
- Define shared TypeScript value types (e.g. `Width`, `MaxWidth`, `SpacingScale`) and capability interfaces (e.g. `SizingProps`, `SpacingProps`, `DisplayProps`).
- Implement pure, deterministic internal resolvers that map each typed value to a verified class name (e.g. `widthClass('full')` → `'pathable-width-full'`).
- Define and test a consistent class-merging order: required component/primitive classes → resolved semantic classes → consumer `className`.
- Define a conflict policy document covering what happens when multiple props target the same class space.
- Unit-test every supported prop-to-class mapping (happy path, invalid/omitted values, edge cases).
- Confirm resolvers have zero browser dependencies (no `window`, `document`, or DOM APIs) so server/client output is identical.
- Add a `className` escape-hatch note in package-level documentation.

## Excludes

- Changing any public React component API.
- Adding new components.
- Modifying SCSS or CSS output.
- Storybook stories or Storybook-driven tests.

## Dependencies

- None (this is the foundation).

## DONE Means

- All listed TypeScript types, interfaces, and resolvers exist under `packages/react/src/` in an internal directory (not a public export).
- Every resolver has a unit test covering valid values, undefined/null/omitted, bad values, and edge cases.
- The inventory document and gap list are checked into source.
- The class-merging order is documented and tested.
- No browser-only globals are referenced in resolver code (verified by a lint rule or test).
- CI passes.
