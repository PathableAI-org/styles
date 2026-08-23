# Implementation Plan: Semantic Color and Tone Model

**Branch**: `053-semantic-color-tones` | **Date**: 2026-08-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/053-semantic-color-tones/spec.md`

## Summary

Formalize the shared semantic color/tone vocabulary that `Text` (09), future `Surface` (12), and other primitives consume, grounding each tone role in a verified `@pathable/styles` SCSS contract. The feature delivers: (1) a tone vocabulary document recording each tone role, its SCSS source, and its resolved class name(s) or a tracked gap; (2) shared internal TypeScript types `TextTone`, `SurfaceTone`, and `BorderTone` in the `packages/react/src/internal/resolvers` type layer; and (3) migration of `Text`'s inline `tone` union onto the shared `TextTone` type with no change to rendered classes.

**Technical approach**: The audit in `research.md` confirms the text tone contract already exists (`pathable-text.scss`, feature 09), so no new SCSS is required for text. Surface and border tone *tokens* exist (`--pathable-color-surface`, `--pathable-color-bg`, `--pathable-color-accent`, `--pathable-color-border`, `--pathable-color-danger`) but no `pathable-surface--tone-*` / border-tone contract exists — the existing `pathable-surface.scss` models *depth variants* (`base`, `raised`, `inset`, `interactive`, `brand`, `inverse`), not tone roles. Those are recorded as tracked gaps owned by feature 12 (`Surface`) rather than invented here. The React-side work is a single new internal type module plus a one-line `Text.tsx` change.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 19 (peer `^18 || ^19`)

**Primary Dependencies**: `@pathableai/styles` (workspace protocol), `@pathableai/react` (this package), Vitest, Storybook

**Storage**: N/A

**Testing**: Vitest (`test:unit`) — internal resolver/type tests plus the existing `Text` component test suite

**Target Platform**: Web — server-side rendering (Next.js/Remix-compatible) and client-side hydration

**Project Type**: Monorepo library — `packages/react` extends `packages/styles`

**Performance Goals**: No measurable impact — component resolves a class string at render time; type changes are erased at compile time

**Constraints**: Zero browser dependencies in class resolution; deterministic server/client output; shared tone types remain internal (not part of the public `@pathable/react` export surface); source-first sequencing (`packages/styles` contract before wrapper exposure); no new React components; no wrapper DOM elements

**Scale/Scope**: 1 new internal type module (`tone.ts`) plus `types.ts`/`index.ts` re-export edits, 1 modified React component (`Text.tsx` — import shared type), ~40 lines of test code, 1 vocabulary document (in `research.md` + code comments). No new SCSS files, no new tokens, no new components.

**Unknowns**: None. `research.md` resolves the spec's open questions:
- Whether a text tone contract exists → it does (`pathable-text.scss`); only the type location changes (Decision 2).
- Whether surface/border tone contracts exist → they do not; tracked as gaps owned by feature 12 (Decision 3).
- Where the shared tone types live → new `tone.ts` module in `internal/resolvers/`, distinct from the existing utility color types in `colorTone.ts` (Decisions 1, 4).
- Contrast/forced-colors evidence → text tones already verified in feature 09; surface/border deferred with the gap (Decision 5).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- **PASS** — No new visual behavior is introduced. Text tone classes already exist in `packages/styles` (`pathable-text.scss`). The React change only re-homes the `TextTone` type and updates the import. Surface/border tone contracts are explicitly deferred to feature 12 rather than invented in a wrapper.
- **PASS** — No new React component, rename, or wrapper styling. `Text` preserves its semantic HTML, class contracts, design tokens, and visual behavior.
- **PASS** — React naming parity is unaffected (no component is added or renamed).

### Consumer and Publishable Validation

- **PASS** — No package-entrypoint, dependency-graph, or asset changes. `Text` continues to import `@pathableai/styles` transitively as before.
- **PASS** — The shared tone types remain internal (per spec FR-014), so the public `@pathable/react` export surface and generated declarations are unchanged; `Text`'s public `tone` prop type is preserved (same union values).
- **PASS** — No breaking changes to public APIs, markup, CSS, or package exports.

### Validation Gates

- **PASS** — Plan identifies lint (ESLint JS, stylelint SCSS, markdownlint), formatting (prettier), typecheck (`tsc --noEmit`), build (styles + react), and unit tests. No SCSS changes in this feature, so stylelint/token-lint impact is nil.
- **PASS** — No lint suppression/disable/weakening is proposed; `--max-warnings=0` is maintained.
- **PASS** — Files are not excluded from applicable validators.
- **PASS** — No warning-only configurations are proposed.

### Story and Interaction Requirements

- **PASS** — No rendered component UI changes. Existing `Text` stories are unaffected; no new stories are required (this feature changes types and documentation only).

### Accessibility

- **PASS** — No visual changes; text tone contrast and forced-colors behavior are already verified (feature 09: default 12.48:1, muted 7.71:1, danger 4.53:1, success 5.27:1, all WCAG AA on `--pathable-color-surface`). This evidence is re-recorded in the vocabulary document.
- **PASS** — Surface/border tone accessibility obligations are deferred with their tracked gaps (no contract → no rendered output to regress).

### Responsive and Resilient States

- **PASS** — No rendered UI change; deterministic server/client output is preserved because the type move is compile-time-only and the resolver is pure.

### Visual Regression

- **PASS** — No design tokens or rendered UI change. No new visual-regression fixtures are required.

### Documentation Surface Ownership

- **PASS** — The canonical tone vocabulary (tone → SCSS source → resolved class / gap) lives in `research.md` and is mirrored as doc comments in the `tone.ts` type module. The SCSS source remains the authoritative contract. Storybook is not a documentation surface for this feature (no component change).

### Cross-Framework Impact

- **PASS** — No `packages/styles` change. The text tone contract is already framework-neutral and consumed by the React wrapper. No cross-framework Storybook verification is required.

### Complexity Tracking

- **PASS** — No constitution violations. Two deliberate decisions (surface/border as tracked gaps; new internal type module) are recorded below.

### Gate Result

**ALL GATES PASS** — No constitution violations. Proceed to Phase 1.

## Complexity Tracking

- **Surface and border tones defined as types but deferred as SCSS gaps**: `SurfaceTone` (`default`, `subtle`, `primary`) and `BorderTone` (`default`, `danger`) are defined in the internal type layer now so the shared vocabulary is fixed, but their SCSS contracts are recorded as tracked gaps owned by feature 12 (`Surface`) and future boundary work. This avoids inventing `pathable-surface--tone-*` / border-tone CSS before a consuming primitive exists and before the "tone vs. depth-variant" reconciliation (the existing `pathable-surface` uses `base`/`raised`/`inset`/`brand`/`inverse`) is resolved in the `Surface` feature. The alternative — creating tone contracts now — would risk an orphaned API that feature 12 redefines.

- **New internal type module `tone.ts` separate from `colorTone.ts`**: The existing `colorTone.ts` models *flat utility* color classes (`pathable-bg-*`, `pathable-text-*`) via `BackgroundColor`/`TextColor`. The tone vocabulary is a *semantic BEM role* concept (`pathable-text--tone-*`). Keeping them in separate modules prevents a naming collision between the existing `TextColor` and the new `TextTone` and keeps the "utility color" and "semantic tone" concepts distinct, at the cost of one extra file.

## Project Structure

### Documentation (this feature)

```text
specs/053-semantic-color-tones/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: SCSS/token audit + tone vocabulary + decisions
├── data-model.md        # Phase 1: Tone type entities and mapping model
├── quickstart.md        # Phase 1: Validation guide
├── contracts/           # Phase 1: Tone vocabulary interface contract
│   └── tone-vocabulary.md
├── checklists/          # Specification quality checklists
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
packages/react/src/internal/resolvers/
├── tone.ts                              # NEW: TextTone/SurfaceTone/BorderTone + textToneClass
├── types.ts                             # MODIFY: re-export the new tone types
├── index.ts                             # MODIFY: re-export tone types + textToneClass
└── __tests__/
    └── tone.test.ts                     # NEW: tone-to-class mapping + type-value tests

packages/react/src/components/Text/
└── Text.tsx                             # MODIFY: import shared TextTone (remove inline union)

packages/styles/src/
└── (no change — text tone contract already exists; surface/border are tracked gaps)
```

**Structure Decision**: Add a dedicated `tone.ts` module alongside the existing resolver modules, following the one-module-per-capability convention established by feature 01 (`sizing.ts`, `spacing.ts`, `colorTone.ts`, etc.). The `TextTone` mapping is a constant lookup table in `tone.ts`. `Text.tsx` imports the shared type from the internal barrel instead of declaring it inline. `SurfaceTone`/`BorderTone` are type-only declarations in the same module (their resolvers land in feature 12), documented as gaps in `research.md`.

## Design Artifacts

- Research decisions + tone vocabulary: `./research.md`
- Internal object design: `./data-model.md`
- Interface contracts: `./contracts/tone-vocabulary.md`
- Validation path: `./quickstart.md`
