# Implementation Plan: Promote Repeated Composition Patterns into Higher-Level Primitives

**Branch**: `056-promote-composition-patterns` | **Date**: 2026-08-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/056-promote-composition-patterns/spec.md`

## Summary

Promote five repeated, proven composition patterns identified in the application layout audit (slice 13) into higher-level React primitives in `@pathable/react`. Each primitive is built from existing lower-level primitives (`Container`, `Stack`, `Inline`, `Cluster`, `Surface`) and maps to existing `packages/styles` SCSS contracts. The five components, ranked by priority: `CardGrid` (P1), `Page` (P2), `SidebarLayout` (P3), `FormStack` (P4), `SplitLayout` (P5).

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x, SCSS (Dart Sass)

**Primary Dependencies**:
- `@pathable/styles` — existing SCSS contracts for `pathable-cluster`, `pathable-surface`, `pathable-sidebar-layout`, `pathable-split`, `pathable-stack`, `pathable-card-grid`, `pathable-sticky-panel`, `pathable-container`, `pathable-form-group`
- `packages/react` — existing layout primitives: `Container`, `Stack`, `Inline`, `Cluster`, `Surface`
- `packages/react/internal/resolvers` — `mergeClasses`, `sizingClass`, `spacingClass`, `alignmentClass`, `flexClass`, `displayClass`

**Storage**: New component files at `packages/react/src/components/{CardGrid,Page,SidebarLayout,FormStack,SplitLayout}/`, each with colocated `__tests__/` directory and corresponding Storybook stories at `packages/react/src/stories/components/{CardGrid,Page,SidebarLayout,FormStack,SplitLayout}/`.

**Testing**: Vitest + React Testing Library + `react-dom/server` for SSR parity. Storybook interaction tests via `storybook/test` for keyboard/focus/landmark behavior. No snapshot testing — SSR parity serves as the deterministic output contract.

**Target Platform**: React 18 consumers. Components are SSR-safe and hydrate identically.

**Project Type**: Library — new components exported from `@pathable/react`.

**Performance Goals**: Each primitive adds at most one wrapper `<div>` beyond its composed sub-primitives. No runtime layout calculations — all layout behavior is CSS-driven via existing SCSS contracts.

**Constraints**:
- No new SCSS contracts unless a gap is explicitly identified and documented (FR-002).
- `Box` and `Grid` primitives are not yet implemented. The composition primitives will use the existing available primitives (`Container`, `Stack`, `Inline`, `Cluster`, `Surface`) and apply `pathable-*` CSS classes directly where `Box`/`Grid` would otherwise be used (see decision in research.md).
- All components must follow existing naming, prop surface, and testing patterns established by `Container`/`Stack`/`Cluster`/`Surface`.

**Scale/Scope**: 5 new components, each ~100-200 LOC. 5 unit test suites. 5 Storybook story files with at least 2 stories each (isolation + composition). 5 migration guides embedded in Storybook docs.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. @pathable/styles Is the Authoritative Workspace

- Every promoted primitive maps to existing SCSS contracts in `packages/styles`. No new visual contracts are introduced. The SCSS contracts (`pathable-cluster`, `pathable-surface`, `pathable-sidebar-layout`, `pathable-split`, `pathable-stack`, `pathable-card-grid`, `pathable-sticky-panel`, `pathable-container`, `pathable-form-group`) already exist and are exported through `packages/styles`.
- ✅ **Gate passed**.

### II. CSS Custom Properties Are the Runtime Contract

- All primitives rely on CSS custom properties (`--pathable-*-gap`, `--pathable-*-ratio`, etc.) defined by existing SCSS contracts. No runtime dependency on a CSS preprocessor is introduced.
- ✅ **Gate passed**.

### III. SCSS Is an Authoring and Extension Layer

- No SCSS source is modified or added. Existing `pathable-layout-composition.scss` bundle already forwards all needed contracts.
- ✅ **Gate passed**.

### IV. Wrapper Packages Preserve Semantic and Visual Parity

- Each new React component preserves the shared package's semantic HTML (e.g., `SidebarLayout` renders `<main>` + `<aside>`, `FormStack` renders `<form>`), class contracts (`pathable-*` class names, BEM modifiers), design tokens, and intended visual behavior.
- Component names follow the CamelCase convention: `pathable-card-grid` → `CardGrid`, `pathable-sidebar-layout` → `SidebarLayout`, `pathable-split` → `SplitLayout`.
- ✅ **Gate passed**.

### V. Consumer Imports Must Be Complete

- New components are exported from `packages/react/src/index.ts`, which already imports `@pathable/styles` compiled CSS at the public entrypoint. Consumers do not need a separate `@pathable/styles` import.
- ✅ **Gate passed**.

### VI. pnpm Workspaces Structure the Repository

- No new packages. New component files live within the existing `packages/react` workspace.
- ✅ **Gate passed**.

### VII. Published Artifacts Must Be Reliable

- Components are type-safe with exported prop types. Public API changes are additive (new exports).
- ✅ **Gate passed**.

### VIII–IX. Token Naming / Design Source Alignment

- Not directly affected. No new tokens or Figma divergence.
- ✅ **Gate passed**.

### X. Accessibility Is a Release Requirement

- Each primitive has specific accessibility requirements:
  - `SidebarLayout`: `<main>` + `<aside>` landmarks
  - `FormStack`: `<form>` semantics, label-input association preserved
  - `Page`: `<main>` landmark
  - `CardGrid`/`SplitLayout`: no landmark obligations, but must not interfere with existing focus order
- Static JSX a11y linting and rendered Storybook a11y checks apply.
- ✅ **Gate passed**.

### XI. Framework Independence Comes from @pathable/styles

- The SCSS contracts are framework-neutral. The React components are framework-specific adapters — no styles package change required.
- ✅ **Gate passed**.

### XII. Documentation Surfaces Have Distinct Responsibilities

- **Storybook**: Exhaustive component catalog with isolation stories, composition stories, and migration guides.
- **Spec/plan**: Feature-specific requirements and implementation decisions (this document).
- No Astro docs or README changes required at this stage.
- ✅ **Gate passed**.

### XIII. Versioning and Release Discipline

- Changes are additive (new component exports). No breaking changes to existing public APIs, markup, CSS, or exports.
- ✅ **Gate passed**.

### XIV. Storybook Stories Are Executable Component Contracts

- Each primitive will have deterministic named stories for key states. Stories will use accessible queries for interaction tests. Migration guides will be embedded in Storybook docs.
- ✅ **Gate passed**.

### XV. Responsive and Inclusive States Are First-Class

- `CardGrid`: responsive wrapping (narrow viewport story)
- `SidebarLayout`: single-column collapse at 1023px (narrow story)
- `SplitLayout`: column stacking at 1023px (narrow story)
- `Page`/`FormStack`: width-constrained, long-content handling
- `prefers-reduced-motion` support where applicable
- ✅ **Gate passed**.

### XVI. Framework Storybooks Must Remain Independently Valid

- New React stories live in `packages/react/src/stories/`. They will be composed into any primary catalog.
- ✅ **Gate passed**.

### Validation & Quality Gates

- Linting, formatting, type-checking, build, test, and a11y gates must pass. No lint suppressions.
- ✅ **Gate required — enforcement during implementation**.

### Complexity Tracking

No constitution violations. This section is intentionally empty.

## Project Structure

### Documentation (this feature)

```
specs/056-promote-composition-patterns/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output — Box/Grid strategy, gap-scale decisions, SCSS mapping
├── data-model.md        # Phase 1 output — component prop-to-class mappings
├── contracts/           # Phase 1 output — component API contracts
├── quickstart.md        # Phase 1 output — validation/run guide
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (to be created in implementation)

```
packages/react/src/components/
├── CardGrid/
│   ├── CardGrid.tsx
│   └── __tests__/CardGrid.test.tsx
├── Page/
│   ├── Page.tsx
│   └── __tests__/Page.test.tsx
├── SidebarLayout/
│   ├── SidebarLayout.tsx
│   └── __tests__/SidebarLayout.test.tsx
├── FormStack/
│   ├── FormStack.tsx
│   └── __tests__/FormStack.test.tsx
└── SplitLayout/
    ├── SplitLayout.tsx
    └── __tests__/SplitLayout.test.tsx

packages/react/src/stories/components/
├── CardGrid/
│   └── CardGrid.stories.tsx
├── Page/
│   └── Page.stories.tsx
├── SidebarLayout/
│   └── SidebarLayout.stories.tsx
├── FormStack/
│   └── FormStack.stories.tsx
└── SplitLayout/
    └── SplitLayout.stories.tsx
```

**Structure Decision**: New components follow the existing flat `components/` directory convention. No new `Layout/` category folder — layout primitives are intermixed with all other components, consistent with how `Container`, `Stack`, `Inline`, `Cluster`, and `Surface` are organized today.

## Complexity Tracking

No constitution violations. This section is intentionally empty.