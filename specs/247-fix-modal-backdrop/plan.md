# Implementation Plan: Fix Modal Backdrop

**Branch**: `247-fix-modal-backdrop` | **Date**: 2026-09-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/247-fix-modal-backdrop/spec.md`

**Note**: Filled by `/speckit-plan`. Research decisions are in [research.md](./research.md).

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Implementation Sequence](#implementation-sequence)
- [Complexity Tracking](#complexity-tracking)

## Summary

Fix Modal open presentation so a dimmed full-viewport backdrop and centered dialog
appear when open, without consumer CSS. `packages/styles` owns PathAble wrapper/overlay
classes with **explicit** `.pathable-modal-wrapper.is-visible` open CSS (PathAble-only
must work without USWDS JS) and content-order override
(`.pathable-modal__content { flex-direction: column; }`). `packages/react` `Modal`
portals the dual-class shell when `open` is true, keeps unmount-on-close, preserves
focus/Escape/scroll behavior, and exposes optional `closeOnBackdropClick` (default
`false`: backdrop visual-only; when `true`: overlay click → `onClose`, stop
propagation on dialog). Styles and React Storybooks each expose a deterministic open
fixture for review and visual regression. Changelog notes portal DOM shell change and
temporary consumer overlay CSS removal. See [research.md](./research.md) and
[contracts/modal-open-presentation.md](./contracts/modal-open-presentation.md).

## Technical Context

**Language/Version**: SCSS (Dart Sass via styles build) + TypeScript 5.x / React 19 in
`packages/react` (peer `^18 || ^19`).

**Primary Dependencies**: `@pathableai/styles` (USWDS modal styles via existing
`usa-modal` forward/`@extend`); `@pathableai/react` consumes styles CSS at package
entry; Storybook + `@pathable/storybook-contracts` for dialog name checks.

**Storage**: N/A

**Testing**: Styles Storybook play tests; React Storybook interaction tests + existing
portal/`getByRole` patterns; package lint (`eslint` + `jsx-a11y`, `--max-warnings=0`),
typecheck, build; visual regression on open fixtures; compiled-CSS grep for PathAble
open rules before styles sign-off.

**Target Platform**: Published `@pathableai/styles` and `@pathableai/react` for browser
(and React SSR-safe closed path: `null` when `!open` / no `document`).

**Project Type**: Design-system library (styles + React wrapper) in a pnpm monorepo.

**Performance Goals**: Negligible — one portal tree when open; no animation required
beyond existing USWDS wrapper transition (honor `prefers-reduced-motion` already in
USWDS CSS). Inherited USWDS z-index (`99999`) — document in styles Modal docs if
reviewers ask; no change by default.

**Constraints**: Styles owns all new Modal classes/CSS; React must not invent overlay
classes; dual `.usa-modal` + `.pathable-modal` on dialog; React dual-class on
wrapper/overlay companions; no USWDS modal JS required for React or for styles
PathAble-only open proof; no lint suppressions; closed styles component optional;
styles shell remains non-interactive.

**Scale/Scope**: `pathable-modal.scss` (+ BRAND_RULES / AGENTS dual-class tables if
wrapper/overlay names are public), styles Modal stories/docs (replace “overlay from
USWDS JS only” copy), React `Modal.tsx` + Modal stories/docs + `closeOnBackdropClick`
prop; changelog/migration note for portal DOM shape.

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
  contracts (including dual-class on the dialog and dual-class wrapper/overlay when
  portaling).
- **Pass (open-contract proof)**: Styles Storybook MUST prove PathAble-only open
  (`.pathable-modal-wrapper.is-visible` → overlay → dialog) with working backdrop
  without USWDS JS. React MUST emit the documented dual-class shell. Both are
  constitution I/IV pass criteria for this feature.

### Consumer and Publishable Validation

- **Pass**: React already imports `@pathableai/styles` CSS at entry; open shell styles
  ship with that CSS—no extra consumer import.
- **Pass**: Public prop surface adds optional `closeOnBackdropClick` (default `false`) —
  additive, backward-compatible. Markup inside the portal changes additively for open
  presentation (wrapper→overlay→dialog). Document class contract + DOM-shell changelog.
  Run existing `check:package` / typecheck gates for touched packages.

### Validation Gates

- **Pass**: Plan uses package lint, typecheck, build, Storybook/interaction tests,
  visual regression, and a compiled-CSS check that PathAble open rules exist in `dist`.
  No lint disablement, silent exclusions, or warning-only theater.

### Story and Interaction Requirements

- **Pass**: Styles: named open story with PathAble-only wrapper+overlay+dialog (no
  USWDS JS). React: existing `Open` plus interaction stories (`EscapeCloses`,
  `TabContainment`, `OpenCloseBehavior`) updated for shell presence when open and
  absence when closed. MUST include automated checks for `closeOnBackdropClick`
  default `false` and `true` (overlay vs dialog-content). Accessible queries for
  dialog; class checks for shell justified as the class contract under test.
  Deterministic synthetic content.

### Accessibility

- **Pass**: Keep `role="dialog"`, `aria-modal`, labelled close, Escape/focus trap in
  React; styles open markup remains a static accessible dialog. Keep `ref`, ARIA,
  `onKeyDown`, and `...rest` on the **dialog** (not wrapper/overlay). No broad a11y
  rule disablement (existing Modal `jsx-a11y` exception on dialog keydown stays
  human-owned—do not expand it).

### Responsive and Resilient States

- **Pass**: Retain React `Narrow` / `LongContent` stories as open-shell regression
  surfaces; styles open fixture should remain usable at narrow widths. Reduced-motion
  already on USWDS wrapper transition; forced-colors: keep overlay distinguishable
  (no redesign beyond current tokens).

### Visual Regression

- **Pass**: Styles open story and React `Open` are visual fixtures for backdrop +
  placement (FR-011 / SC-005). Name/document the styles open fixture so reviewers find
  it quickly.

### Documentation Surface Ownership

- **Pass**: Canonical class/markup contract = styles Storybook + `pathable-modal.scss`
  (+ BRAND_RULES / AGENTS if shell classes are public). React README/story docs describe
  applying that contract via `open` and document `closeOnBackdropClick`. Replace styles
  Storybook copy that claims overlay comes only from USWDS JS.

### Cross-Framework Impact

- **Pass**: Styles Storybook and React Storybook both build/test independently after
  changes.

### Post-design re-check

- Phase 1 contracts (`contracts/modal-open-presentation.md`) and data-model align with
  styles-first shell + React portal emission + PathAble-only CSS proof + dual-class
  React emission + `closeOnBackdropClick`. No constitution violations requiring
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
React portal markup/stories/prop. No new packages or apps.

## Implementation Sequence

Ordered work for `/speckit.tasks` and implementers (styles → verify → docs → React →
tests → release notes):

1. **`pathable-modal.scss`**: PathAble wrapper/overlay `@extend` **plus** explicit
   `.pathable-modal-wrapper.is-visible` (and overlay geometry) rules so PathAble-only
   open markup works without USWDS compound `@extend` gaps. Override
   `.pathable-modal__content { flex-direction: column; }` after `@extend`.
2. **Compiled CSS check**: Build styles; confirm `dist` contains
   `.pathable-modal-wrapper.is-visible` (and PathAble overlay) rules before signing
   off styles.
3. **Styles Storybook + docs**: Open fixture with PathAble-only shell + `.is-visible`
   (no USWDS JS). Replace “overlay from USWDS JS only” story copy. Update BRAND_RULES /
   AGENTS dual-class tables if wrapper/overlay names are public.
4. **React portal**: Emit dual-class shell (`pathable` + `usa` on wrapper/overlay;
   `.pathable-modal.usa-modal` on dialog). Keep `ref`, ARIA, `onKeyDown`, and `...rest`
   on the dialog. Add `closeOnBackdropClick` (default `false`); when true, overlay
   click → `onClose`, stop propagation on dialog. Styles remain non-interactive.
5. **Assertions + changelog**: Story plays assert shell presence when open and absence
   when closed; MUST cover `closeOnBackdropClick` false/true (overlay vs dialog-content);
   visual fixtures on styles open + React `Open`. Changelog/migration: portal DOM shape
   `wrapper → overlay → dialog`; remove temporary consumer overlay CSS after upgrade to
   avoid stacked dimmers.

## Complexity Tracking

> No constitution violations requiring justification.
