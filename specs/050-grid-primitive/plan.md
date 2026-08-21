# Implementation Plan: Grid Layout Primitive

**Branch**: `050-grid-primitive` | **Date**: 2026-08-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/050-grid-primitive/spec.md`

## Summary

Implement the `Grid` React component — a layout primitive that renders a CSS Grid container with design-system-approved column configurations and token-based spacing. It consumes a new `pathable-grid` SCSS contract from `@pathable/styles` that provides column modifier classes (`--cols-2`, `--cols-3`, `--cols-4`), gap modifier classes (`--gap-sm`, `--gap-md`, `--gap-lg`, `--gap-xl`), and grid-specific alignment modifier classes. The Grid component exposes a `cols` prop (2, 3, or 4), a `gap` prop from the shared spacing scale, an `align` prop, and sizing/external-spacing props from the shared capability system. The component follows the polymorphic `as` and ref-forwarding pattern established by Stack, Inline, and Cluster.

**Technical approach**: Two changes in `packages/styles` (a new `pathable-grid.scss` SCSS file and a `@forward` entry in `pathable-layout-composition.scss`), followed by one new React component file at `packages/react/src/components/Grid/Grid.tsx`. The `cols` prop uses a local column-to-class record. The `gap` prop uses a local gap-to-class record. The `align` prop uses a local align-to-class record mapping to Grid SCSS modifier classes. Sizing and spacing props use the existing `widthClass`, `maxWidthClass`, and `margin*Class` resolvers. Class composition uses `mergeClasses`. All classes on the single root element — no wrapper DOM elements.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 19

**Primary Dependencies**: `@pathable/styles` (workspace protocol), `@pathable/react` (this package), Vitest, Storybook

**Storage**: N/A

**Testing**: Vitest (component tests), Storybook interaction tests

**Target Platform**: Web — server-side rendering (Next.js/Remix-compatible) and client-side hydration

**Project Type**: Monorepo library — `packages/react` extends `packages/styles`

**Performance Goals**: No measurable impact — component resolves a class string at render time with no extra DOM nodes

**Constraints**: Zero browser dependencies in resolver code; deterministic server/client output; no extra wrapper DOM elements; no full CSS Grid language exposure; no responsive column counts; no masonry/subgrid; no typography, color, tone, display, or visibility props

**Scale/Scope**: 1 new SCSS file (`pathable-grid.scss`), 1 SCSS modification (`pathable-layout-composition.scss`), 1 new component (`Grid`), 3 new props (`cols`, `gap`, `align`), 2 optional props (`columnGap`, `rowGap`), 7 existing props shared via `SizingProps`/`SpacingProps`, ~60 lines of component code, ~120 lines of test code

**Unknowns**: Whether the SCSS contract should support separate `columnGap`/`rowGap` (FR-009 is a MAY requirement). This will be resolved in Phase 0 research.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. @pathable/styles Is the Authoritative Workspace

- [x] **PASS** — The new `pathable-grid.scss` SCSS contract will be created in `packages/styles/src/pathable-component-wrappers/` before the React wrapper is exposed. The contract covers column configurations, gap modifiers, and alignment modifiers. No wrapper-only styling. The React component consumes only SCSS classes.

### II. CSS Custom Properties Are the Runtime Contract

- [x] **PASS** — The `pathable-grid` contract will use CSS custom properties for gap control (`--pathable-grid-gap`) with modifier class overrides, following the established pattern from Stack and Inline. Column templates and alignment will use standard CSS Grid properties with modifier overrides.

### III. SCSS Is an Authoring and Extension Layer

- [x] **PASS** — New Grid SCSS follows the established pattern: CSS custom properties with modifier overrides. No Sass-only token surfaces. No `$`-prefixed variables that shadow the CSS custom property contract.

### IV. Wrapper Packages Preserve Semantic and Visual Parity

- [x] **PASS** — The React `Grid` component maps to the SCSS `pathable-grid` contract. Naming follows PascalCase convention (removing `pathable` prefix). Props map to verified SCSS modifier classes. No visual-style duplication. The SCSS contract must exist and be exported from `packages/styles` before the React wrapper is added.

### V. Consumer Imports Must Be Complete

- [x] **PASS** — `@pathable/react` imports `@pathable/styles` at its entrypoint. Grid consumers receive CSS automatically. No separate import required.

### VI. pnpm Workspaces Structure the Repository

- [x] **PASS** — Workspace boundaries respected. SCSS changes in `packages/styles`; React changes in `packages/react`.

### VII. Published Artifacts Must Be Reliable

- [x] **PASS** — The new `pathable-grid` SCSS is compiled as part of the existing `@pathable/styles` build pipeline. Build is reproducible via `pnpm build`. React build includes the Grid component in its dist output.

### VIII. Token Naming Must Be Semantic and Stable

- [x] **PASS** — CSS custom property naming follows the `--pathable-grid-{concept}` convention. Classes use the `pathable-grid--{modifier}` BEM pattern consistent with other layout primitives.

### IX. Design Source Alignment Matters

- [x] **PASS** — Column counts (2, 3, 4) are derived from existing grid patterns in the codebase (KPI grid, bento grid). Gap scale aligns with the design system's spacing tokens. No Figma divergence expected — this is a layout primitive, not a visual component.

### X. Accessibility Is a Release Requirement

- [x] **PASS** — Grid is a pure CSS layout container with no interactive behavior. The `as` prop supports semantic landmarks. Static JSX linting will pass. Storybook stories will pass rendered accessibility checks. No ARIA roles to communicate — Grid solely governs visual layout. Keyboard and focus behavior are inherited from child content.

### XI. Framework Independence Comes from @pathable/styles

- [x] **PASS** — The `pathable-grid` SCSS contract is framework-neutral and defined in `packages/styles`. The React `Grid` component is a thin adapter consuming that contract. Future Vue, Svelte, or other framework wrappers would consume the same SCSS classes.

### XII. Documentation Surfaces Have Distinct Responsibilities

- [x] **PASS** — Storybook is the exhaustive catalog for Grid stories. This spec/plan is the canonical requirements and design source. The SCSS contract in `packages/styles` is the source of truth for CSS behavior.

### XIII. Versioning and Release Discipline

- [x] **PASS** — Additive change: new SCSS file in `packages/styles`, new component in `packages/react`. No breaking changes. Minor version bump appropriate.

### XIV. Storybook Stories Are Executable Component Contracts

- [x] **PASS** — Deterministic stories planned for each column count (2, 3, 4) with gap and alignment variations. A Controls/Playground story supports exploration but does not substitute for fixed regression stories. Stories use accessible queries where applicable. No uncontrolled randomness, dates, or network dependencies.

### XV. Responsive and Inclusive States Are First-Class

- [x] **PASS** — Grid is inherently responsive: columns shrink proportionally to fit constrained containers. Edge cases covered: zero children, invalid column counts, nested grids, long content. Grid has no loading, empty, error, disabled, or read-only states — it is purely a layout container. Responsive column counts are explicitly excluded per the spec; responsive behavior relies on CSS Grid's natural proportional column sizing.

### XVI. Framework Storybooks Must Remain Independently Valid

- [x] **PASS** — Grid stories are in the React Storybook which builds and tests independently. No cross-framework story dependencies.

### Gate Result

**ALL GATES PASS** — No constitution violations. Proceed to Phase 0.

## Complexity Tracking

- **New SCSS contract required**: Unlike Stack (which consumed an existing contract) and Cluster (which consumed an existing contract with minor additions), Grid requires creating a new `pathable-grid.scss` from scratch. This is consistent with Inline (which also required a new SCSS contract). The new contract follows the same CSS custom property + modifier pattern established by Stack, Inline, and Cluster.

- **Grid alignment via SCSS modifiers**: Grid uses SCSS modifier classes for alignment (like Cluster) rather than utility classes (like Stack/Inline). FR-004 explicitly requires grid-specific alignment modifiers in the SCSS contract. Using the same pattern as Cluster is appropriate because Grid is a distinct layout model from Flexbox, and having self-contained SCSS alignment classes keeps the contract cohesive.

- **`columnGap`/`rowGap` as optional props**: FR-009 is a MAY requirement (not MUST). If the SCSS contract supports separate axis gap control, the React component will expose `columnGap` and `rowGap`. This adds complexity to the gap resolution logic but is gated on SCSS contract support.

## Project Structure

### Documentation (this feature)

```text
specs/050-grid-primitive/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: SCSS contract design and resolver reuse analysis
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
packages/styles/src/pathable-component-wrappers/
├── pathable-grid.scss                 # NEW: Grid SCSS contract
└── pathable-layout-composition.scss   # MODIFY: add @forward 'pathable-grid'

packages/react/src/
├── index.ts                           # MODIFY: add Grid export
├── components/
│   └── Grid/
│       ├── Grid.tsx                   # NEW: Component implementation
│       └── __tests__/
│           └── Grid.test.tsx          # NEW: Component tests
└── stories/
    └── components/
        └── Grid/
            └── Grid.stories.tsx       # NEW: Storybook stories
```

**Structure Decision**: Follow the established one-component-per-directory convention (same as Stack, Container, Inline, Cluster). The `cols`, `gap`, and `align` class mappings are local constants within the component file. No new resolver modules needed. Tests are co-located. Stories follow the existing story directory structure. SCSS changes go in `packages/styles` with the other component wrapper files.

## Design Artifacts

- Research decisions: `./research.md`
- Internal object design: `./data-model.md`
- Interface contracts: `./contracts/`
- Validation path: `./quickstart.md`