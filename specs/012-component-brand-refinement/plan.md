# Implementation Plan: Component Brand Refinement

**Branch**: `012-component-brand-refinement` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from specs/012-component-brand-refinement/spec.md

**Note**: This template is filled in by the `/speckit-plan` command.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

Apply Pathable-specific brand opinion to existing USWDS component wrappers (buttons, cards, forms, alerts, navigation) by adding SCSS opinion layers and corresponding Storybook workflow pattern stories. The semantic token layer already exists (`_semantic.scss` has action-primary-bg, action-secondary-bg, status, and workflow tokens) — the work is to wire them into the component wrappers and demonstrate them with real workflow examples.

## Technical Context

**Project Type**: Design system component library (SCSS package with Storybook documentation)

**Language/Tools**: SCSS (Dart Sass), CSS custom properties, Storybook (HTML stories)

**Primary Build Dependencies**: 
- `sass` (Dart Sass) — SCSS compilation
- USWDS v3.x component source modules (imported via @use in wrapper files)
- Storybook with @storybook/html-vite and a11y addon (already configured)

**Storage**: N/A — No data storage involved. This is a pure styles package.

**Testing**: 
- Storybook a11y addon (axe-core) for contrast and accessibility verification
- Visual inspection via Storybook stories
- No unit tests — this is a visual/styles-only feature

**Target Platform**: Web browsers — all WCAG-compatible browsers

**Performance Goals**: No performance implications — pure CSS additions with no runtime cost

**Constraints**:
- Existing `@extend .usa-*` wrapper pattern MUST be preserved
- All new styles MUST pass WCAG AA contrast (4.5:1 normal text, 3:1 large text)
- New CSS custom properties MUST follow `--pathable-*` naming convention
- Brand color approximations due to USWDS token mapping are an accepted tradeoff
- No framework-specific code (no Vue, React, etc.) — pure SCSS + CSS

**Scale/Scope**: 
- 5 component areas: buttons, cards, forms, alerts/communication, navigation
- ~15 new Storybook workflow story examples across all areas
- ~4 modified component wrapper SCSS files (pathable-button, pathable-card, pathable-alert, pathable-sidenav)
- All changes scoped to `packages/styles/src/`

**Key unknowns resolved**:
- The semantic token layer in `_semantic.scss` already defines `--pathable-color-action-primary-bg: #00365c`, `--pathable-color-action-primary-text: #ffffff`, `--pathable-color-action-secondary-bg: #1cae96` — these can be referenced directly
- Button variants already exist as modifiers (`.pathable-button--secondary`, `.pathable-button--accent-cool`, `.pathable-button--base`)
- Alert variants already exist (`.pathable-alert--info`, `.pathable-alert--warning`, `.pathable-alert--error`, `.pathable-alert--success`, `.pathable-alert--emergency`)
- Card components use BEM structure (`.pathable-card__container`, `__header`, `__body`, `__footer`, `__heading`)
- The existing `AGENTS.md` file documents both brand tokens and USWDS wrapper usage conventions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate 1 — CSS Custom Properties Contract (Principle I)
**Status**: PASS (no new published tokens needed — existing `--pathable-color-action-*`, `--pathable-color-status-*`, and `--pathable-color-workflow-*` CSS custom properties suffice)
**Rationale**: The feature adds component-level SCSS that references existing CSS custom properties. No new published token contract is introduced.

### Gate 2 — SCSS Authoring Layer (Principle II)
**Status**: PASS
**Rationale**: All modifications are to existing SCSS wrapper files that already follow the `@extend` + BEM pattern. New styles are added within this established architecture.

### Gate 3 — pnpm Workspaces (Principle III)
**Status**: PASS
**Rationale**: All changes are within `packages/styles/src/`. No new workspace packages are created. No workspace boundary crossings.

### Gate 4 — First Implementation Slice Narrow (Principle IV)
**Status**: PASS — this is not a first slice; the repo already has an established SCSS package structure
**Rationale**: Feature builds on an existing package, not bootstrapping.

### Gate 5 — Published Artifacts Reliable (Principle V)
**Status**: PASS
**Rationale**: The feature adds styles to component wrappers that are already compiled into the published CSS output. Build verification via `pnpm build` will confirm correctness.

### Gate 6 — Token Naming Semantic and Stable (Principle VI)
**Status**: PASS
**Rationale**: Component-level custom properties already follow the `--pathable-*` semantic convention. No new breaking-level tokens are introduced.

### Gate 7 — Accessibility Is Part of Token Quality (Principle VIII)
**Status**: PASS — feature explicitly requires WCAG AA contrast verification
**Rationale**: Every acceptance scenario requires contrast verification via the Storybook a11y addon. Edge cases include documenting contrast warnings for borderline color pairs.

### Gate 8 — Framework Independence (Principle IX)
**Status**: PASS
**Rationale**: All changes are SCSS/CSS-only within the `packages/styles` package. No framework imports, no Vue/React/component framework dependencies.

### Gate 9 — R/M/U/O Scope Granularity
**Status**: PASS

Scope breakdown:
- **M (Module/Capability)**: `packages/styles` — the entire styles package
- **U (Unit/Design Object)**: Individual component wrappers (pathable-button, pathable-card, pathable-alert, pathable-sidenav, form examples) and individual story files (.stories.js)
- **O (Operation/Detail)**: Specific CSS declarations within each wrapper, specific HTML templates within each story

### Gate Summary
All gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/012-component-brand-refinement/
├── plan.md              # This file
├── research.md          # Phase 0 — contrast ratios, USWDS variant mapping
├── data-model.md        # Phase 1 — component-to-brand mapping
├── quickstart.md        # Phase 1 — validation walkthrough
├── contracts/           # Phase 1 — story pattern contracts
│   ├── button-contracts.md
│   ├── card-contracts.md
│   ├── alert-contracts.md
│   ├── form-contracts.md
│   └── nav-contracts.md
└── checklists/
    └── requirements.md  # Spec quality checklist (completed)
```

### Source Code (repository root)

```text
packages/styles/src/
├── pathable-component-wrappers/
│   ├── pathable-button.scss          # MODIFY: add brand opinion layer
│   ├── pathable-card.scss            # MODIFY: add workflow card variant
│   ├── pathable-alert.scss           # MODIFY: add any brand-specific overrides
│   └── pathable-sidenav.scss         # MODIFY: any nav brand refinements
├── _components-custom-properties.scss # MAYBE: add workflow-card CSS custom properties
└── stories/
    ├── components/
    │   ├── Basic/
    │   │   ├── Button.stories.js      # MODIFY: add brand-approved button variants
    │   │   └── Card.stories.js        # MODIFY: add workflow card story
    │   ├── Communication/
    │   │   └── Alert.stories.js       # MODIFY: add semantic alert examples
    │   ├── FormControls/
    │   │   └── Input.stories.js       # MODIFY: add workflow form pattern examples
    │   └── Navigation/
    │       └── Sidenav.stories.js     # MODIFY: add workflow nav items
    └── brand/
        ├── ColorUsage.stories.js      # ALREADY EXISTS — may need contrast docs update
        └── Typography.stories.js      # ALREADY EXISTS
```

**Structure Decision**: Single project (DEFAULT) — all changes within `packages/styles/src/`. No new packages, workspaces, or build tools.

## Complexity Tracking

No constitution violations identified — this is low complexity.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none)    | —          | —                                    |