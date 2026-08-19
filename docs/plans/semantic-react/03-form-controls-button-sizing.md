# 03 — Form Controls and Button Adopt Sizing Props

Status: NOT STARTED → change to DONE when complete

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 2 and Suggested Slice 3

## Scope

Add `width="full"` (and other safe sizing props) to form controls (`TextInput`, `Select`, `TextArea`, etc.) and `Button`. These are the most commonly widened components in application code and benefit most from removing ad-hoc utility-class strings.

## Includes

- Audit current form-control and Button markup to confirm which root element receives sizing classes.
- Add `width` and `maxWidth` props (and `minWidth` where the styles contract supports it) to the following components:
  - `Button`
  - `TextInput`
  - `Select`
  - `TextArea`
  - Other form controls where sizing is safe (identified during audit).
- Merge resolved sizing classes with each component's existing classes and consumer `className` using the order from [01](./01-semantic-prop-foundation.md).
- No wrapper element is introduced on any component.
- Preserve existing ref forwarding, native element props, server rendering, and accessibility behavior.
- Add unit/component tests confirming correct class output and absence of wrapper elements.
- Add Storybook examples for `width="full"` on each component.
- Document which sizing props each component supports (capability matrix entry).

## Excludes

- Padding, margin, display, visibility, typography, or color props on these components.
- Layout primitives.
- Retrofitting components other than form controls and `Button`.

## Dependencies

- [01 — Semantic Utility Type System and Class Resolvers](./01-semantic-prop-foundation.md) (for types and resolvers)
- [02 — Card Adopts Sizing and Spacing Props](./02-card-sizing-spacing.md) (optional but recommended; proves the pattern first on a simpler component)

## DONE Means

- Every listed component accepts at minimum `width` and `maxWidth` via the shared capability interface.
- `width="full"` on a `Button`, `TextInput`, etc. produces the correct class on the owned root element with no wrapper.
- Component and Storybook tests pass for every component in the set.
- Capability matrix (versioned in `packages/react/`) records the support status of each component/prop.
- Server-rendered output matches client-rendered output for all new prop combinations.
- CI passes.