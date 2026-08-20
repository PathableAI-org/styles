# Implementation Plan: Inline and Cluster Layout Primitives

**Branch**: `049-inline-cluster-primitives` | **Date**: 2026-08-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/049-inline-cluster-primitives/spec.md`

## Summary

Add two new React layout primitives (`Inline` and `Cluster`) to `@pathable/react` that arrange children in the horizontal axis. `Inline` renders a non-wrapping row; `Cluster` renders a wrapping row for items that flow to new lines. Both consume SCSS contracts from `@pathable/styles`, with `Inline` requiring a new SCSS contract and `Cluster` consuming the existing `.pathable-cluster` contract (with a gap-scale expansion).

## Technical Context

**Language/Version**: TypeScript 5.x, React 18+
**Primary Dependencies**: `@pathable/styles` (workspace), React, existing shared resolver infrastructure
**Storage**: N/A — no data persistence
**Testing**: Vitest + @testing-library/react for unit tests; Storybook for visual/contract stories
**Target Platform**: Web (browser + SSR), React components in `@pathable/react`
**Project Type**: Design-system component library (monorepo, pnpm workspaces)
**Performance Goals**: Zero measurable overhead vs plain CSS; no extra DOM nodes; SSR-identical output
**Constraints**: No new SCSS package dependencies; no lint suppressions; no wrapper DOM elements; established polymorphic + resolver patterns only
**Scale/Scope**: Two new components (Inline, Cluster), one new SCSS file (pathable-inline), ~1 SCSS change (cluster gap expansion)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. @pathable/styles Is the Authoritative Workspace

- [x] **PASS** — The `.pathable-cluster` SCSS contract already exists in `packages/styles`. A new `pathable-inline.scss` will be created in `packages/styles` before the React wrapper is exposed. No wrapper-only styling. Both React components consume existing SCSS contracts.

### II. CSS Custom Properties Are the Runtime Contract

- [x] **PASS** — Inline will follow the same CSS custom property pattern as Stack/Cluster: a `--pathable-inline-gap` property with fallback, overridden by modifier classes.

### III. SCSS Is an Authoring / Extension Layer

- [x] **PASS** — New Inline SCSS follows the established pattern (CSS custom properties with modifier overrides). No Sass-only token surfaces.

### IV. Wrapper Packages Preserve Semantic and Visual Parity

- [x] **PASS** — Components map to SCSS contracts. React naming follows PascalCase convention (Inline, Cluster). No visual-style duplication. Props map to verified SCSS classes. One exception: Inline's `align` and `justify` props use existing utility classes (`.pathable-flex-align-*`, `.pathable-flex-justify-*`) rather than SCSS-specific modifiers, consistent with the Stack pattern.

### V. Consumer Imports Must Be Complete

- [x] **PASS** — `@pathable/react` imports `@pathableai/styles` at its entrypoint, so Inline/Cluster consumers receive CSS automatically.

### X. Accessibility Is a Release Requirement

- [x] **PASS** — These are pure CSS layout containers; no interactive behavior. Semantic `as` prop supports landmarks. Static JSX linting will pass (no interactive children). Stories will pass rendered accessibility checks.

### XIV. Storybook Stories Are Executable Contracts

- [x] **PASS** — Stories planned for each gap value, alignment/justification combinations, wrapping behavior, and nested layouts. Deterministic fixtures.

### XV. Responsive and Inclusive States Are First-Class

- [x] **PASS** — Cluster's wrapping behavior is inherently responsive. Edge cases covered: empty children, overflow, constrained containers, SSR parity.

### Gate Result

**ALL GATES PASS** — No constitution violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/049-inline-cluster-primitives/
├── spec.md             # Feature specification
├── plan.md             # This file
├── research.md         # Phase 0: design decisions and tradeoffs
├── data-model.md       # Phase 1: entity definitions and prop contracts
├── contracts/          # Phase 1: component and CSS contracts
│   ├── inline-scss-contract.md
│   ├── cluster-scss-contract.md
│   ├── component-contracts.md
│   └── cluster-gap-expansion.md
└── quickstart.md       # Phase 1: validation scenarios
```

### Source Code (repository root)

```text
packages/styles/src/pathable-component-wrappers/
├── pathable-inline.scss               # NEW: Inline SCSS contract
├── pathable-cluster.scss              # MODIFY: add --gap-xl modifier
├── pathable-stack.scss                # (reference only)
└── pathable-layout-composition.scss   # MODIFY: add @forward 'pathable-inline'

packages/react/src/
├── index.ts                           # MODIFY: add Inline/Cluster exports
├── components/
│   ├── Inline/
│   │   ├── Inline.tsx                 # NEW: Inline component
│   │   └── __tests__/
│   │       └── Inline.test.tsx        # NEW
│   ├── Cluster/
│   │   ├── Cluster.tsx                # NEW: Cluster component
│   │   └── __tests__/
│   │       └── Cluster.test.tsx       # NEW
│   └── Stack/Stack.tsx                # (reference pattern)
└── stories/
    └── components/
        ├── Inline/
        │   └── Inline.stories.tsx     # NEW
        └── Cluster/
            └── Cluster.stories.tsx    # NEW
```

**Structure Decision**: Follow the Stack component's directory layout: component source, test directory, and story directory each in their own folder. No barrel `index.ts` in component directories — exports go through `packages/react/src/index.ts`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — this section is empty.

## Design Artifacts

- Internal object design: `./class-diagram.md` — N/A (no internal objects beyond React component types)
- Service sequences: `./contracts/sequences.md` — N/A (no async/sequential flows)
- Behavior draft: `./behavior/bdd.draft.feature` — N/A (no complex interactions)
- BDD contracts: `./contracts/bdd/` — N/A
- Expected UIF contracts: `./contracts/uif/` — N/A
- Data model: `./data-model.md`
- Interface contracts: `./contracts/`
- Validation path: `./quickstart.md`

## Visual fidelity navigation

- Visual validation decisions: `./research.md`
- Visual interaction contracts: `./contracts/uif/` and `./contracts/behavior/` — N/A (no interaction behavior)
- Visual flow sequences: `./contracts/sequences.md` — N/A
- Visual proof execution: `./quickstart.md`