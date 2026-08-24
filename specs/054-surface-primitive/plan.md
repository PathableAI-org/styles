# Implementation Plan: Surface Primitive

**Branch**: `054-surface-primitive` | **Date**: 2026-08-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/054-surface-primitive/spec.md`

## Summary

Implement the `Surface` semantic visual-container primitive — a React component
that coordinates foreground, background, border, elevation, and focus treatment
into a single `variant` prop (`default | subtle | primary`, the shared
`SurfaceTone`), with optional `borderTone` (`default | danger`) and `elevation`
(`sm | md | lg | xl`) refinements. The component is justified by a conditional
precondition: it ships only because concrete application compositions
repeatedly consume the coordinated `pathable-surface` treatment.

**Technical approach**: The shared `SurfaceTone`/`BorderTone` types already
exist (feature 11), but their SCSS contracts were recorded as tracked gaps.
This feature closes those gaps in `packages/styles` by extending
`pathable-surface.scss` with tone-role, elevation, and border-tone modifiers
grounded in existing semantic tokens (no new tokens), then adds a `Surface`
React component that follows the established polymorphic primitive pattern
(`Stack`/`Container`/`Card`): `div` default, `as` prop, ref forwarding,
`mergeClasses` composition, shared `SizingProps` + external `SpacingProps`,
no wrapper nodes, and pure resolvers with deterministic server/client output.
`research.md` records the precondition evidence and reconciles the shared tone
vocabulary with the legacy depth variants as two distinct axes.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 19 (peer `^18 || ^19`)

**Primary Dependencies**: `@pathableai/styles` (workspace protocol), `@pathableai/react` (this package), Vitest, Storybook

**Storage**: N/A

**Testing**: Vitest (`test:unit`), Storybook interaction tests (`test:storybook-react`), server-compatibility check, `publint`/`attw` package checks

**Target Platform**: Web — server-side rendering (Next.js/Remix-compatible) and client-side hydration

**Project Type**: Monorepo library — `packages/react` extends `packages/styles`

**Performance Goals**: No measurable impact — component resolves a class string at render time with no extra DOM nodes

**Constraints**: Zero browser dependencies in class resolution; deterministic server/client output; no raw `color`/`background`/`borderColor` props; no arbitrary `box-shadow` (elevation limited to verified `--elevation-*` steps); no internal padding (external spacing only); no wrapper DOM elements; source-first sequencing (`packages/styles` contract before wrapper exposure); `SurfaceTone`/`BorderTone` stay internal while `Surface`/`SurfaceProps` are public

**Scale/Scope**: 1 modified SCSS file (`pathable-surface.scss` — add tone/elevation/border modifiers), 1 new React component (`Surface`), 3 props (`variant`, `borderTone`, `elevation`) + `as`/sizing/spacing, ~3 small pure resolvers, ~80 lines of component code, ~150 lines of test code, ~5 Storybook stories

**Unknowns**: None. `research.md` resolves the spec's open questions:
- Precondition evidence → met (three concrete application composition families repeat the coordinated treatment) — Decision 0.
- Tone vs. depth-variant reconciliation → two-axis model (`variant` tone role + `elevation` depth + `borderTone` boundary) — Decision 1.
- `primary` token mapping → `--pathable-color-accent` + `--pathable-color-on-accent` — Decision 3.
- Border-tone contract existence → does not exist; create `pathable-surface--border-*` — Decision 4.
- Elevation source → existing `--elevation-*` steps — Decision 5.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- **PASS** — Changes touch `packages/styles` first (new tone/elevation/border modifiers on the existing `pathable-surface.scss` contract), then the `packages/react` wrapper. No wrapper-only styling; every `Surface` prop value maps to a verified styles contract.
- **PASS** — The React `Surface` name is the CamelCase form of the `pathable-surface` styles contract (constitution naming parity).
- **PASS** — The component preserves the shared package's semantic HTML (a single semantic element), accessibility behavior (forced-colors outline fallbacks, visible focus for interactive treatment), class contracts, design tokens, and intended visual behavior.

### Consumer and Publishable Validation

- **PASS** — `@pathableai/react` imports `@pathableai/styles` at its entry point; consumers receive the compiled `pathable-surface` CSS automatically.
- **PASS** — Public API is type-safe: `variant`/`borderTone` typed from the shared unions, `elevation` from a literal union, `as` polymorphic.
- **PASS** — Plan includes package-content validation (`check:package` via publint, `check:types` via attw) as quality gates.
- **PASS** — No breaking changes: additive SCSS modifiers + a new component export; the legacy depth variants remain unchanged.

### Validation Gates

- **PASS** — Plan identifies lint (ESLint JS, stylelint SCSS, markdownlint), formatting (prettier), typecheck (`tsc --noEmit`), build (styles + react), unit tests, Storybook build/tests, token lint, package checks.
- **PASS** — No lint suppression/disable/weakening; root and per-package lint run with `--max-warnings=0`.
- **PASS** — Files are not excluded from applicable validators.
- **PASS** — No warning-only configurations proposed.

### Story and Interaction Requirements

- **PASS** — Deterministic named stories: one per `variant`, plus `elevation` and `borderTone` combination stories; no Playground-only coverage.
- **PASS** — `Surface` is non-interactive by default; focus treatment (focus-visible ring) is covered for the interactive treatment.
- **PASS** — Story tests use accessible queries (`getByRole`, `getByText`) and deterministic content (no dates/random/network).
- **PASS** — Story docs explain semantic intent, usage guidance, misuse warnings, and accessibility obligations.

### Accessibility

- **PASS** — All three variants meet WCAG AA for normal text (`default` 12.48:1, `subtle` ~9.6:1, `primary` ~5.5:1); evidence recorded in `research.md`.
- **PASS** — Static JSX a11y linting and rendered axe checks are both represented.
- **PASS** — Forced-colors outline fallbacks and reduced-motion handling carried into the new modifiers.
- **PASS** — No broad a11y rule disablement; stories use synthetic, non-sensitive copy.

### Responsive and Resilient States

- **PASS** — `Surface` inherits sizing/spacing capabilities; content wraps within constrained containers; no overflow introduced.
- **PASS** — Keyboard focus visibility preserved for interactive surfaces; forced-colors considered; reduced motion honored.
- **PASS** — Loading/empty/error/disabled/read-only states are not part of the non-interactive `Surface` contract (deferred to consumers).

### Visual Regression

- **PASS** — Stable variant/elevation/borderTone stories serve as deterministic visual-regression fixtures protecting tokens, spacing, radius, focus, and state presentation.
- **PASS** — Serialized DOM snapshots are not treated as a complete substitute for browser-rendered validation.

### Documentation Surface Ownership

- **PASS** — Storybook is the exhaustive component catalog; the `pathable-surface.scss` contract is the CSS source of truth; `research.md` records the precondition + reconciliation decisions; this spec/plan is the canonical requirements/design source.

### Cross-Framework Impact

- **PASS** — The `pathable-surface` contract is framework-neutral in `packages/styles`; the React Storybook builds/tests independently. No cross-framework runtime dependency.

### Complexity Tracking

- **PASS** — No constitution violations. Two deliberate design decisions (two-axis reconciliation; new tone modifiers alongside legacy depth variants) are recorded below.

### Gate Result

**ALL GATES PASS** — No constitution violations. Proceed to Phase 1 (complete).

## Complexity Tracking

- **Two-axis surface model (tone role vs. depth variant)**: `variant` (SurfaceTone) is the semantic *tone* axis; `elevation` is the *depth* axis; `borderTone` is the *boundary* axis. The legacy `pathable-surface--{base|raised|inset|interactive|brand|inverse}` depth variants conflate these axes and remain in `packages/styles` for raw-class consumers, while the new tone/elevation/border modifiers formalize the semantic vocabulary. This is more surface area than a single modifier family, but it is the only way to honor the shared `SurfaceTone`/`BorderTone` vocabulary without redefining the legacy depth semantics or inventing a fork.

- **New tone modifiers alongside existing depth modifiers**: The new `pathable-surface--tone-*`/`--elevation-*`/`--border-*` modifiers resolve to the same semantic tokens as the legacy variants (no new tokens, no forked values), but they are a second key over the same `pathable-surface` base. This is accepted to preserve backward compatibility with the heavily-used depth variants; a future refactor could consolidate them, tracked outside this feature.

## Project Structure

### Documentation (this feature)

```text
specs/054-surface-primitive/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: precondition evidence + SCSS audit + decisions
├── data-model.md        # Phase 1: prop-to-class mapping and type design
├── quickstart.md        # Phase 1: Validation guide
├── contracts/           # Phase 1: Component interface contract
│   └── component-api.md
├── checklists/          # Specification quality checklists
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
packages/styles/src/
└── pathable-component-wrappers/
    └── pathable-surface.scss             # MODIFY: add tone/elevation/border modifiers

packages/react/src/
├── index.ts                              # MODIFY: add Surface export
├── internal/resolvers/
│   ├── tone.ts                           # MODIFY: add surfaceToneClass + surfaceBorderToneClass
│   ├── surface.ts                        # NEW (or extend tone.ts): surfaceElevationClass + SurfaceElevation
│   ├── types.ts                          # MODIFY: re-export new resolver types if needed
│   └── __tests__/
│       └── surface.test.ts               # NEW: resolver-to-class mapping tests
├── components/
│   └── Surface/
│       ├── Surface.tsx                   # NEW: Component implementation
│       └── __tests__/
│           └── Surface.test.tsx          # NEW: Component tests
└── stories/
    └── components/
        └── Surface/
            └── Surface.stories.tsx       # NEW: Storybook stories
```

**Structure Decision**: Follow the one-component-per-directory convention
(`Text`, `Stack`, `Container`, `Card`, `Heading`). Tone/border-tone resolvers
extend the existing `internal/resolvers/tone.ts` (where `SurfaceTone`/
`BorderTone` already live); the elevation resolver and `SurfaceElevation` type
live in a new `internal/resolvers/surface.ts` (or co-locate in `tone.ts` —
finalized in tasks). The SCSS contract extends the existing
`pathable-surface.scss`. Stories follow `src/stories/components/Surface/`.

## Design Artifacts

- Research decisions + precondition evidence: `./research.md`
- Internal object design: `./data-model.md`
- Interface contracts: `./contracts/component-api.md`
- Validation path: `./quickstart.md`
