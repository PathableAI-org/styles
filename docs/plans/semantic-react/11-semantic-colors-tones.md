# 11 — Semantic Color and Tone Model

Status: DONE

## Audit Notes (implementation evidence)

- SCSS contract (text tones, verified): `packages/styles/src/pathable-component-wrappers/pathable-text.scss` (feature 09). Tone modifiers `pathable-text--tone-default|muted|danger|success` resolve to `--pathable-color-text`, `--pathable-color-text-muted`, `--pathable-color-danger`, `--pathable-color-text-success` — no literal hex in the contract.
- Vocabulary + decisions: `specs/053-semantic-color-tones/research.md` (canonical tone → SCSS source → resolved class / gap table, plus contrast evidence).
- Types added (internal layer): `packages/react/src/internal/resolvers/tone.ts` defines `TextTone` (`default|muted|danger|success`), `SurfaceTone` (`default|subtle|primary`), `BorderTone` (`default|danger`), and the pure `textToneClass` resolver. Re-exported through `types.ts` and `index.ts` (internal barrel). `TextTone` remains publicly re-exported through `Text`'s API; `SurfaceTone`/`BorderTone`/`textToneClass` stay internal-only.
- `Text` migration: `packages/react/src/components/Text/Text.tsx` now consumes the shared `TextTone` type and `textToneClass` resolver (removed inline union + map); `TextTone` remains a public re-export for compatibility. Rendered tone classes are byte-for-byte unchanged.
- Surface/border tones: **tracked gaps** (no `pathable-surface--tone-*` / border-tone contract exists). `SurfaceTone` gap owned by feature 12 (`Surface`), with the `primary` token mapping (`--pathable-color-accent` vs `--pathable-color-action-primary-bg`) unresolved; `BorderTone` gap has no owner yet.
- Contrast (WCAG AA normal text on `--pathable-color-surface` #ffffff): default 12.48:1, muted 7.71:1, danger 4.53:1, success 5.27:1 — all PASS (re-recorded from feature 09). Forced-colors: tone classes resolve to semantic tokens; color is never the sole signal.

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
