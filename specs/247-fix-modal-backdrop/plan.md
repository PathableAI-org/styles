# Implementation Plan: Fix Modal Backdrop

**Branch**: `247-fix-modal-backdrop` | **Date**: 2026-09-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/247-fix-modal-backdrop/spec.md`

**Note**: Filled by `/speckit-plan`. Research decisions are in [research.md](./research.md).

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

Fix Modal open presentation so a dimmed full-viewport backdrop and centered dialog
appear when open, without consumer CSS. `packages/styles` owns PathAble wrapper/overlay
classes and content-order CSS; `packages/react` `Modal` portals that shell when `open`
is true, keeps unmount-on-close, and preserves focus/Escape/scroll behavior. Styles and
React Storybooks each expose a deterministic open fixture for review and visual
regression. See [research.md](./research.md).

## Technical Context

**Language/Version**: SCSS (Dart Sass via styles build) + TypeScript 5.x / React 19 in
`packages/react` (peer `^18 || ^19`).

**Primary Dependencies**: `@pathableai/styles` (USWDS modal styles via existing
`usa-modal` forward/`@extend`); `@pathableai/react` consumes styles CSS at package
entry; Storybook + `@pathable/storybook-contracts` for dialog name checks.

**Storage**: N/A

**Testing**: Styles Storybook play tests; React Storybook interaction tests + existing
portal/`getByRole` patterns; package lint (`eslint` + `jsx-a11y`, `--max-warnings=0`),
typecheck, build; visual regression on open fixtures.

**Target Platform**: Published `@pathableai/styles` and `@pathableai/react` for browser
(and React SSR-safe closed path: `null` when `!open` / no `document`).

**Project Type**: Design-system library (styles + React wrapper) in a pnpm monorepo.

**Performance Goals**: Negligible — one portal tree when open; no animation required
beyond existing USWDS wrapper transition (honor `prefers-reduced-motion` already in
USWDS CSS).

**Constraints**: Styles owns all new Modal classes/CSS; React must not invent overlay
classes; dual `.usa-modal` + `.pathable-modal` on dialog; no USWDS modal JS required for
React; no lint suppressions; closed styles component optional.

**Scale/Scope**: `pathable-modal.scss` (+ possibly BRAND_RULES row for wrapper/overlay),
styles Modal stories/docs, React `Modal.tsx` + Modal stories/docs; no new public React
prop API required.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- **Pass**: Changes start in `packages/styles` (`pathable-modal.scss`, styles Modal
  stories/docs, BRAND_RULES if new class names are listed). `packages/react` `Modal`
  then emits the styles-owned shell. No wrapper-only visual invention.
- **Pass**: React component remains `Modal` ↔ styles `modal` / `.pathable-modal`
  naming. New shell classes are styles `pathable-modal-*` companions, not a new React
  component name.
- **Pass**: React preserves dialog semantics, a11y behavior, and applies styles class
  contracts (including dual-class on the dialog).

### Consumer and Publishable Validation

- **Pass**: React already imports `@pathableai/styles` CSS at entry; open shell styles
  ship with that CSS—no extra consumer import.
- **Pass**: No required public prop API break; markup inside the portal changes
  additively for open presentation. Document class contract updates in styles/React
  docs. Run existing `check:package` / typecheck gates for touched packages.

### Validation Gates

- **Pass**: Plan uses package lint, typecheck, build, Storybook/interaction tests, and
  visual regression. No lint disablement, silent exclusions, or warning-only theater.

### Story and Interaction Requirements

- **Pass**: Styles: named open story with wrapper+overlay+dialog. React: existing
  `Open` plus interaction stories (`EscapeCloses`, `TabContainment`, `OpenCloseBehavior`)
  updated for shell presence. Accessible queries; deterministic synthetic content.

### Accessibility

- **Pass**: Keep `role="dialog"`, `aria-modal`, labelled close, Escape/focus trap in
  React; styles open markup remains a static accessible dialog. No broad a11y rule
  disablement (existing Modal `jsx-a11y` exception on dialog keydown stays
  human-owned—do not expand it).

### Responsive and Resilient States

- **Pass**: Retain React `Narrow` / `LongContent` stories; styles open fixture should
  remain usable at narrow widths. Reduced-motion already on USWDS wrapper transition;
  forced-colors: keep overlay distinguishable (no redesign beyond current tokens).

### Visual Regression

- **Pass**: Styles open story and React `Open` are visual fixtures for backdrop +
  placement (FR-011 / SC-005).

### Documentation Surface Ownership

- **Pass**: Canonical class/markup contract = styles Storybook + `pathable-modal.scss`
  (+ BRAND_RULES). React README/story docs describe applying that contract via `open`.

### Cross-Framework Impact

- **Pass**: Styles Storybook and React Storybook both build/test independently after
  changes.

### Post-design re-check

- Phase 1 contracts (`contracts/modal-open-presentation.md`) and data-model align with
  styles-first shell + React portal emission. No constitution violations requiring
  Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/247-fix-modal-backdrop/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── modal-open-presentation.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
packages/styles/
├── src/pathable-component-wrappers/pathable-modal.scss
├── src/stories/components/Communication/Modal.stories.ts
└── BRAND_RULES.md                    # if wrapper/overlay classes are catalogued

packages/react/
├── src/components/Modal/Modal.tsx
├── src/stories/components/Communication/Modal.stories.tsx
└── README.md                         # Modal row / usage notes if needed
```

**Structure Decision**: Dual-package library change—styles SCSS + stories first, then
React portal markup/stories. No new packages or apps.

## Complexity Tracking

> No constitution violations requiring justification.
