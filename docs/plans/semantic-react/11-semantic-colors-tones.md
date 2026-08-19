# 11 — Semantic Color and Tone Model

Status: NOT STARTED → change to DONE when complete

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 4 and Suggested Slice 11

## Scope

Define the shared semantic color and tone vocabulary for React consumers. This feature formalizes the tone roles that [09](./09-text-primitive.md), [10](./10-heading.md), and future components consume, ensuring they are grounded in verified SCSS contracts. It is primarily a specification and SCSS-alignment feature with light React-side integration work.

## Includes

- Audit existing SCSS color tokens, tone semantics, and token-to-meaning mappings in `@pathable/styles`. Record findings.
- Formalize a shared tone vocabulary document covering:
  - **Text tones:** `default`, `muted`, `danger`, `success`, and additional roles verified from the SCSS audit.
  - **Surface tones:** `default`, `subtle`, `primary`, and additional roles if SCSS contracts support them.
  - **Border tones:** `default`, `danger`, and additional validated boundary roles.
- For any tone without an authoritative SCSS contract, create the contract in `@pathable/styles` (or record as a gap with a tracking reference).
- Define shared TypeScript types (`TextTone`, `SurfaceTone`, `BorderTone`) in the internal type layer established by [01](./01-semantic-prop-foundation.md).
- Ensure tone classes are deterministic, theme-independent (applications request "danger", not "red-600"), and server-renderable.
- Update [09](./09-text-primitive.md)'s `tone` prop to consume the shared tone types if 09 shipped without the formalized tone vocabulary.
- Unit-test: each tone value maps to the correct class; invalid tones are rejected.
- Evaluate contrast and forced-colors behavior for every tone role.
- Document the tone vocabulary and its mapping to SCSS contracts.

## Excludes

- `Surface` component implementation — that is [12](./12-surface-primitive.md).
- Component-level tone adoption beyond `Text` (other components adopt tones in their own features).
- Palette-level color props (`color`, `background`, `borderColor`) — these remain escape hatches via `className` and `style`.

## Dependencies

- [01 — Semantic Utility Type System and Class Resolvers](./01-semantic-prop-foundation.md)
- [09 — Text Primitive](./09-text-primitive.md) (primary consumer; should be complete or in progress)

## DONE Means

- A tone vocabulary document exists recording each tone role, its SCSS source, and its resolved class name(s).
- Shared TypeScript types for `TextTone`, `SurfaceTone`, and `BorderTone` exist in the internal type layer.
- For every tone, either a verified SCSS contract exists or a tracked gap is recorded.
- `Text`'s `tone` prop consumes the shared types (updated if needed).
- Unit tests confirm tone-to-class mappings.
- Contrast and forced-colors evidence is documented.
- CI passes.
