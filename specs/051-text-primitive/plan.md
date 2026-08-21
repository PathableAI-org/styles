# Implementation Plan: Text Primitive

**Branch**: `051-text-primitive` | **Date**: 2026-08-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/051-text-primitive/spec.md`

## Summary

Implement the `Text` typographic primitive — a React component that lets applications express semantic text roles (`body`, `small`, `caption`) and semantic tones (`default`, `muted`, `danger`, `success`) instead of raw font or palette values. It consumes a new `pathable-text` SCSS contract from `@pathable/styles` that formalizes typography role classes and tone classes backed by the existing typography scale and semantic color tokens. The component defaults to rendering a `<p>`, supports an `as` prop constrained to text-content elements (`p`, `span`, `label`, `figcaption`, …) with native props restricted to the selected element, forwards refs, and composes classes via `mergeClasses()`. No wrapper DOM elements; deterministic server/client output.

**Technical approach**: An additive SCSS contract in `packages/styles` (`pathable-text.scss`, plus token additions in `_typography.scss` and `_semantic.scss`, and a `@forward` in `pathable-typography.scss`), followed by one React component (`Text.tsx`) with a generic polymorphic type signature. The `variant` and `tone` props use local class-mapping records; no new resolver modules are needed. The audit in `research.md` confirms that the existing `body-md`/`body-sm`/`caption-md` typography scale and `--pathable-color-text*`/`-danger` tokens already support the roles; the only additive token work is a text-safe success color and per-role line-height tokens.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 19 (peer `^18 || ^19`)

**Primary Dependencies**: `@pathableai/styles` (workspace protocol, `@pathableai/styles` in package.json), `@pathableai/react` (this package), Vitest, Storybook

**Storage**: N/A

**Testing**: Vitest (`test:unit`), Storybook interaction tests (`test:storybook-react`), server-compatibility check (`test:storybook-react-server`)

**Target Platform**: Web — server-side rendering (Next.js/Remix-compatible) and client-side hydration

**Project Type**: Monorepo library — `packages/react` extends `packages/styles`

**Performance Goals**: No measurable impact — component resolves a class string at render time with no extra DOM nodes

**Constraints**: Zero browser dependencies in class resolution; deterministic server/client output; no extra wrapper DOM elements; `as` restricted to text-content elements with native props restricted to the selected element (FR-012); no raw font size/weight/line-height/font-family props (FR-016); no sizing/padding/margin/display props (FR-019); typography role system separate from heading/outline semantics (FR-020)

**Scale/Scope**: 1 new SCSS file (`pathable-text.scss`), 3 additive SCSS/token modifications (`pathable-typography.scss` forward, `_typography.scss` line-height tokens, `_semantic.scss` text-success token), 1 new React component (`Text`), 2 new props (`variant`, `tone`), 1 polymorphic prop (`as`), ~90 lines of component code, ~180 lines of test code

**Unknowns**: None. The audit in `research.md` resolved all spec ambiguities:
- Whether a `pathable-text` contract already exists → it does not; new contract required (Decision 1).
- Which typography scale entries map to `body`/`small`/`caption` → `body-md`/`body-sm`/`caption-md` (Decision 2).
- How the `success` tone can pass WCAG AA contrast → new `--pathable-color-text-success` token (Decision 4).
- How to type polymorphic native props restricted to the selected element → generic `TextProps<C>` per-element props (Decision 5).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- **PASS** — Changes touch `packages/styles` (new `pathable-text.scss` contract + additive token changes) first, then the `packages/react` wrapper. No wrapper-only styling. The React `Text` component name is the CamelCase form of the `pathable-text` styles contract (constitution naming parity).
- **PASS** — The React component preserves the shared package's semantic HTML (default `p`), accessibility behavior (tone classes resolve to verified contrast-safe tokens), class contracts, design tokens, and intended visual behavior.

### Consumer and Publishable Validation

- **PASS** — `@pathableai/react` imports `@pathableai/styles` at its entrypoint; consumers receive the compiled `pathable-text` CSS automatically.
- **PASS** — Public API is type-safe: generic polymorphic props restrict native props per selected element; `variant`/`tone` are validated unions.
- **PASS** — Plan includes package-content validation (`pnpm --filter @pathableai/react check:package` / `check:types`) as part of the quality gates.
- **PASS** — No breaking changes: new SCSS contract + additive tokens + new component export only.

### Validation Gates

- **PASS** — Plan identifies lint (ESLint JS, stylelint SCSS, markdownlint), formatting (prettier), typecheck (`tsc --noEmit`), build (styles + react), unit tests, Storybook build/tests, token lint, package checks.
- **PASS** — No lint suppression/disable/weakening is proposed; root `lint` and per-package `lint` run with `--max-warnings=0`.
- **PASS** — Files are not excluded from applicable validators.
- **PASS** — No warning-only configurations are proposed.

### Story and Interaction Requirements

- **PASS** — Deterministic named stories: `<Text variant="body">`, `<Text variant="small" tone="muted">`, `<Text variant="caption" tone="danger">`, plus a `default` (no-props) and a `tones` showcase story (FR-028/029/030).
- **PASS** — Text is non-interactive; no keyboard/focus behavior to cover.
- **PASS** — Story tests use accessible queries (`getByText`, `getByRole` for label element) and observable outcomes; stories are deterministic (no dates/random/network).
- **PASS** — Story docs explain semantic intent, usage guidance, misuse warnings (e.g., do not use `success` on non-surface backgrounds), and accessibility obligations (contrast evidence, forced-colors).

### Accessibility

- **PASS** — All supported tone tokens pass WCAG AA normal-text contrast on the default surface (verified in research.md); the `success` tone uses a new AA-safe token rather than the failing brand accent.
- **PASS** — Both static JSX a11y linting (eslint-plugin-jsx-a11y) and rendered axe checks (Storybook test-runner) are represented.
- **PASS** — Non-interactive component: no keyboard/focus/name behavior to cover; semantic element choice (`p`, `label`, `figcaption`) is the accessibility surface.
- **PASS** — No a11y rule disablement; contrast evidence recorded in the feature branch (research.md + quickstart).
- **PASS** — Stories use synthetic, non-sensitive copy.

### Responsive and Resilient States

- **PASS** — Text wraps naturally within constrained containers; no overflow introduced. Evaluated for narrow/mobile, long content, and increased text size (native browser reflow; `Text` adds no fixed constraints).
- **PASS** — Forced-colors/high-contrast behavior: tone classes rely on semantic tokens that map to system colors in forced-colors; color is never the sole signal (roles carry the semantics). Documented and validated in quickstart.
- **PASS** — Reduced motion: no animation in the component.
- **PASS** — Loading/empty/error/disabled/read-only states are not part of the Text primitive's contract (pure text rendering).

### Visual Regression

- **PASS** — Stable stories (`Body`, `SmallMuted`, `CaptionDanger`, `Tones`) serve as visual-regression fixtures protecting typography tokens, tone colors, wrapping, and overflow.
- **PASS** — Visual checks protect design tokens, typography, and wrapping behavior.
- **PASS** — Serialized DOM snapshots are not treated as a complete substitute for browser-rendered validation (quickstart includes computed-style checks).

### Documentation Surface Ownership

- **PASS** — Storybook is the exhaustive component catalog (stories + docs). The `pathable-text` SCSS contract in `packages/styles` is the source of truth for CSS behavior. This spec/plan is the canonical requirements/design source. Research.md records the audit evidence.

### Cross-Framework Impact

- **PASS** — The `pathable-text` SCSS contract is framework-neutral and defined in `packages/styles`. The React Storybook builds and tests independently (`test:storybook-react`). No cross-framework story dependencies.

### Complexity Tracking

- **PASS** — No constitution violations. Two intentional, documented design decisions that add slight complexity are recorded in Complexity Tracking below.

### Gate Result

**ALL GATES PASS** — No constitution violations. Proceed to Phase 1.

**Post-Phase-1 re-check**: The design (research.md, data-model.md, contracts/) introduces no new violations. In particular:
- The new `--pathable-color-text-success` token (Decision 4) strengthens rather than weakens Principle X (contrast obligation); it is additive, so Principle VIII is honored.
- The generic polymorphic typing (Decision 5) is a deliberate, documented deviation from the layout-primitive `ElementType` pattern to satisfy the spec's FR-012; it is recorded in Complexity Tracking with rationale.
- No wrapper-only styling is introduced; the `pathable-text` SCSS contract owns all visual behavior (Principle I/IV).
- The `Text` export name is the CamelCase form of `pathable-text` (Principle IV naming parity).
- Stories are deterministic and a11y-checked; no test-runner exception entries are added (Principles X/XIV).

## Complexity Tracking

- **New SCSS contract + additive tokens**: Unlike Stack (existing contract) and Cluster (existing contract with minor additions), `Text` requires creating `pathable-text.scss` and two small additive token changes (`_typography.scss` line-height tokens; `_semantic.scss` text-success token). This mirrors Inline/Grid (new contracts) and is required because no semantic typography role/tone classes exist today (verified by audit). All values derive from existing scale/token data — no new typographic or brand values beyond the AA-safe text-success color.

- **Generic polymorphic typing for `as`**: `Text` uses generic per-element props (`TextProps<C extends keyof JSX.IntrinsicElements>`) instead of the loose `ElementType` pattern used by layout primitives, to satisfy FR-012 ("MUST NOT accept props invalid for the selected element"). This is a deliberate deviation from the layout-primitive pattern justified by the plan's explicit polymorphic-native-prop requirement. The implementation casts the ref type and documents the constraint.

## Project Structure

### Documentation (this feature)

```text
specs/051-text-primitive/
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
│   ├── pathable-text.scss               # NEW: typography role/tone contract
│   ├── pathable-typography.scss         # MODIFY: add @forward 'pathable-text'
│   └── pathable-layout-composition.scss # (no change)
├── _typography.scss                     # MODIFY (additive): per-role line-height tokens
└── _semantic.scss                       # MODIFY (additive): --pathable-color-text-success

packages/react/src/
├── index.ts                             # MODIFY: add Text export
├── components/
│   └── Text/
│       ├── Text.tsx                     # NEW: Component implementation
│       └── __tests__/
│           └── Text.test.tsx            # NEW: Component tests
└── stories/
    └── components/
        └── Text/
            └── Text.stories.tsx         # NEW: Storybook stories
```

**Structure Decision**: Follow the one-component-per-directory convention (same as Stack, Container, Inline, Cluster, Grid). `variant`/`tone` class mappings are local constants within the component file. Tests are co-located. Stories follow the existing `src/stories/components/<Component>/` directory. SCSS changes live in `packages/styles/src/pathable-component-wrappers/` with the other primitive contracts, and token changes in the owning token partials.

## Design Artifacts

- Research decisions: `./research.md`
- Internal object design: `./data-model.md`
- Interface contracts: `./contracts/`
- Validation path: `./quickstart.md`
