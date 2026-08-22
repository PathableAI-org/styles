# Implementation Plan: Heading Primitive

**Branch**: `052-heading-primitive` | **Date**: 2026-08-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/052-heading-primitive/spec.md`

## Summary

Implement the `Heading` typographic primitive — a React component that maps a semantic heading level (1–6) to both the correct HTML heading element (`h1`–`h6`) and the matching design-system heading style class. Supports an optional `visualLevel` prop for cases where document outline and visual hierarchy must diverge. Consumes a new `pathable-heading` SCSS contract from `@pathableai/styles` that formalizes heading level classes backed by the existing typography scale. The component renders exactly one heading element with no wrapper DOM nodes, forwards refs, and merges classes via `mergeClasses()`. Unlike `Text`, Heading does not accept an `as` prop — it is always a heading element.

**Technical approach**: A new SCSS contract in `packages/styles` (`pathable-heading.scss`, plus a `@forward` in `pathable-typography.scss`), followed by one React component (`Heading.tsx`) with a simple `level`-based type constraint. No new tokens are required — all heading levels resolve to existing `--pathable-*` CSS custom properties from the typography scale. The audit in `research.md` confirms no heading contract exists today; 13+ component wrappers duplicate heading typography inline.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 19 (peer `^18 || ^19`)

**Primary Dependencies**: `@pathableai/styles` (workspace protocol), `@pathableai/react` (this package), Vitest, Storybook

**Storage**: N/A

**Testing**: Vitest (`test:unit`), Storybook interaction tests (`test:storybook-react`), server-compatibility check (`test:storybook-react-server`)

**Target Platform**: Web — server-side rendering (Next.js/Remix-compatible) and client-side hydration

**Project Type**: Monorepo library — `packages/react` extends `packages/styles`

**Performance Goals**: No measurable impact — component resolves a class string at render time with no extra DOM nodes

**Constraints**: Zero browser dependencies in class resolution; deterministic server/client output; no extra wrapper DOM elements; no `as` prop (always a heading element `h1`–`h6`); no tone/color props; no raw font size/weight/line-height/font-family props; heading semantics separate from body text (`Text` primitive)

**Scale/Scope**: 1 new SCSS file (`pathable-heading.scss`), 1 SCSS modification (`pathable-typography.scss` @forward), 1 new React component (`Heading`), 2 props (`level` required, `visualLevel` optional), ~60 lines of component code, ~130 lines of test code

**Unknowns**: None. The audit in `research.md` resolved all spec ambiguities:
- Whether a `pathable-heading` contract already exists → it does not; new contract required (Decision 1).
- Level-to-scale mapping → 1=display-lg, 2=heading-lg, 3=heading-md, 4=heading-sm, 5=body-md bold, 6=body-sm bold (Decision 2).
- Font-family assignment → follows the typography scale: display-lg uses Fredoka, heading-lg/md/sm use Poppins, body-md/sm use Nunito (Decision 3).
- `level` default → required, no default (Decision 4).
- Polymorphic typing approach → discriminated element type based on `level` (Decision 7).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- **PASS** — Changes touch `packages/styles` (new `pathable-heading.scss` contract) first, then the `packages/react` wrapper. No wrapper-only styling. The React `Heading` component name is the CamelCase form of the `pathable-heading` styles contract (constitution naming parity).
- **PASS** — The React component preserves the shared package's semantic HTML (always `h1`–`h6`), accessibility behavior (native heading semantics), class contracts, design tokens, and intended visual behavior.

### Consumer and Publishable Validation

- **PASS** — `@pathableai/react` imports `@pathableai/styles` at its entrypoint; consumers receive the compiled `pathable-heading` CSS automatically.
- **PASS** — Public API is type-safe: `level` is a literal union type; `visualLevel` is an optional literal union; no loose types.
- **PASS** — Plan includes package-content validation (`pnpm --filter @pathableai/react check:package` / `check:types`) as part of the quality gates.
- **PASS** — No breaking changes: new SCSS contract + new component export only.

### Validation Gates

- **PASS** — Plan identifies lint (ESLint JS, stylelint SCSS, markdownlint), formatting (prettier), typecheck (`tsc --noEmit`), build (styles + react), unit tests, Storybook build/tests, token lint, package checks.
- **PASS** — No lint suppression/disable/weakening is proposed; root `lint` and per-package `lint` run with `--max-warnings=0`.
- **PASS** — Files are not excluded from applicable validators.
- **PASS** — No warning-only configurations are proposed.

### Story and Interaction Requirements

- **PASS** — Deterministic named stories: each level 1–6, `VisualLevelDivergence` (level=3 visualLevel=2), `AllLevels` showcase, `WithCustomClass`.
- **PASS** — Heading is non-interactive by default; no keyboard/focus behavior to cover beyond standard browser heading behavior.
- **PASS** — Story tests use accessible queries (`getByRole('heading')`, `getByText`) and observable outcomes; stories are deterministic (no dates/random/network).
- **PASS** — Story docs explain semantic intent, usage guidance, misuse warnings, and accessibility obligations.

### Accessibility

- **PASS** — All heading tokens meet WCAG AA contrast against the default surface. Headings use `--pathable-color-text` (12.48:1 on white), same as proven in the `Text` primitive audit.
- **PASS** — Both static JSX a11y linting (eslint-plugin-jsx-a11y) and rendered axe checks (Storybook test-runner) are represented.
- **PASS** — Native heading elements (`h1`–`h6`) provide correct semantics to assistive technology without ARIA role overrides.
- **PASS** — No a11y rule disablement; contrast evidence recorded in research.md + quickstart.
- **PASS** — Stories use synthetic, non-sensitive copy.

### Responsive and Resilient States

- **PASS** — Heading text wraps naturally within constrained containers; no overflow introduced.
- **PASS** — Forced-colors/high-contrast: headings are visually distinguishable by size/weight, not just color.
- **PASS** — Reduced motion: no animation in the component.
- **PASS** — Loading/empty/error/disabled/read-only states are not part of the Heading primitive's contract (pure text rendering).

### Visual Regression

- **PASS** — Stable stories (`Level1` through `Level6`, `VisualLevelDivergence`, `AllLevels`) serve as visual-regression fixtures protecting typography, spacing, and level-specific rendering.
- **PASS** — Visual checks protect typography, spacing, and text wrapping.
- **PASS** — Serialized DOM snapshots are not treated as a complete substitute for browser-rendered validation (quickstart includes computed-style checks).

### Documentation Surface Ownership

- **PASS** — Storybook is the exhaustive component catalog (stories + docs). The `pathable-heading` SCSS contract in `packages/styles` is the source of truth for CSS behavior. This spec/plan is the canonical requirements/design source. Research.md records the audit evidence.

### Cross-Framework Impact

- **PASS** — The `pathable-heading` SCSS contract is framework-neutral and defined in `packages/styles`. The React Storybook builds and tests independently. No cross-framework dependencies.

### Complexity Tracking

- **PASS** — No constitution violations. Two documented design decisions that add slight complexity are recorded below.

### Gate Result

**ALL GATES PASS** — No constitution violations. Proceed to Phase 1.

## Complexity Tracking

- **New SCSS contract with no new tokens**: Unlike `Text` (which needed additive line-height and color tokens), `Heading` maps all six levels to the existing typography scale without introducing new CSS custom properties. Level 5 and 6 fall back to bold body sizes, which is a pragmatic choice that avoids token proliferation. If future design refinement requires dedicated h5/h6 scale entries, that is a separate token feature.

- **Required `level` prop with no default**: Unlike `Text` (which defaults to `<p>`), `Heading` requires `level` explicitly. This is a deliberate constraint to enforce intentional heading-level selection — developers must think about document structure. The TypeScript compiler catches missing `level` at build time.

## Project Structure

### Documentation (this feature)

```text
specs/052-heading-primitive/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: SCSS audit + design decisions
├── data-model.md        # Phase 1: Prop-to-class mapping and type design
├── quickstart.md        # Phase 1: Validation guide
├── contracts/           # Phase 1: Component interface contracts
│   └── component-api.md
├── checklists/          # Specification quality checklists
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
packages/styles/src/
├── pathable-component-wrappers/
│   ├── pathable-heading.scss             # NEW: heading level contract
│   └── pathable-typography.scss          # MODIFY: add @forward 'pathable-heading'
└── _typography.scss                      # (no change — all tokens already exist)

packages/react/src/
├── index.ts                              # MODIFY: add Heading export
├── components/
│   └── Heading/
│       ├── Heading.tsx                   # NEW: Component implementation
│       └── __tests__/
│           └── Heading.test.tsx          # NEW: Component tests
└── stories/
    └── components/
        └── Heading/
            └── Heading.stories.tsx       # NEW: Storybook stories
```

**Structure Decision**: Follow the one-component-per-directory convention (same as `Text`, `Stack`, `Container`, `Inline`, `Cluster`, `Grid`). The level-to-class mapping is a constant lookup table within the component file. Tests are co-located. Stories follow `src/stories/components/Heading/`. The SCSS contract lives alongside other primitive contracts in `pathable-component-wrappers/`.

## Design Artifacts

- Research decisions: `./research.md`
- Internal object design: `./data-model.md`
- Interface contracts: `./contracts/`
- Validation path: `./quickstart.md`
