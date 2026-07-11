# Implementation Plan: Structured Wizard and Guided Workflow Compositions

**Branch**: `026-wizard-workflow-compositions` | **Date**: 2026-07-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/026-wizard-workflow-compositions/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

Add framework-neutral SCSS styles and Storybook documentation for two related but distinct composition patterns: a multi-step wizard (step indicator, form area, validation, action footer) and a structured workflow/session panel (context header, prompt/instruction, observation/note input, progress/save-status, completion actions). These compositions reuse existing `pathable-*` component wrappers (button, step-indicator, form, validation, surface, stack) and are delivered as new SCSS partials in the `@pathable/styles` package. No runtime JavaScript or state management is introduced.

## Technical Context

**Language/Version**: SCSS (Dart Sass via `sass` npm package, `^1.86.3`)

**Primary Dependencies**: 
- `@uswds/uswds` (^3.0.0) — provides `usa-step-indicator`, `usa-button`, `usa-form`, `usa-validation` and other USWDS component styles via `@use 'uswds-core' as *`
- Existing `pathable-*` component wrappers — the wizard and workflow compositions build on top of `pathable-button`, `pathable-step-indicator`, `pathable-form`, `pathable-form-group`, `pathable-validation`, `pathable-stack`, `pathable-cluster`, `pathable-split`, `pathable-surface`, and `pathable-sticky-panel`

**Storage**: N/A — this is a CSS-only package with no persistent state

**Testing**: 
- Build compilation verification via selective-import and all-in-one import tests
- Visual verification via Storybook stories (autodocs + manual composition stories)
- Existing pattern: `test/selective-import.scss` for selective import verification

**Target Platform**: Browser (all modern browsers supported by USWDS 3.x — evergreen Chrome, Firefox, Safari, Edge)

**Project Type**: CSS/SCSS design system package (`@pathable/styles`)

**Performance Goals**: No runtime performance impact — zero JavaScript, pure CSS. Compiled CSS output size is the primary concern; new compositions should be comparable in size to existing composition bundles (e.g., `pathable-layout-composition`).

**Constraints**: 
- Must not introduce runtime JavaScript or framework-specific code
- Must not introduce new runtime dependencies
- Must follow existing `pathable-*` class naming conventions (BEM with `pathable-{component}` namespace)
- Must support both selective import (`@forward 'pathable-component-wrappers/pathable-wizard'`) and all-in-one import (via `pathable-all.scss` and `_index.scss`)
- Must use USWDS design tokens (`uswds-core` SCSS functions) for spacing, color, and typography — never hardcode values
- Must follow the dual `--pathable-*` / `--usa-*` custom property convention for any new component-level tokens

**Scale/Scope**: Approximately 4-6 new SCSS partials, 2 new bundle forwarding files, 1 new Storybook stories directory, and updated index/all forwarding files.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I — CSS Custom Properties Are the Runtime Contract
- **Status**: ✅ No violation. The new compositions produce compiled CSS custom properties where needed. No Sass-only tokens.

### Principle II — SCSS Is an Authoring and Extension Layer
- **Status**: ✅ No violation. SCSS is used for authoring; Sass variables that represent published tokens produce `--pathable-*` CSS custom properties. Wrappers use `@use 'uswds-core' as *` and `@extend` for USWDS components.

### Principle III — pnpm Workspaces Structure the Repository
- **Status**: ✅ No violation. All additions stay within the existing `packages/styles` workspace.

### Principle IV — First Implementation Slice Is Narrow
- **Status**: ✅ No violation. Not applicable — this is not the initial bootstrap.

### Principle V — Published Artifacts Must Be Reliable
- **Status**: ✅ No violation. Build verification via `pnpm build` ensures compiled output. Selective-import test follows existing patterns.

### Principle VI — Token Naming Must Be Semantic and Stable
- **Status**: ✅ No violation. New CSS custom properties follow `--pathable-{component}-{property}` semantic naming.

### Principle VII — Design Source Alignment Matters
- **Status**: ✅ No violation. The wizard and workflow compositions are new structural patterns, not token changes. No Figma divergence concern.

### Principle VIII — Accessibility Is Part of Token Quality
- **Status**: ✅ No violation. All state indicators use text/icon labels in addition to color (FR-019). Touch targets meet minimum size (FR-020). Color-independent step indicator states (FR-002). Responsive/zoom resilient layout (FR-021).

### Principle IX — Framework Independence Comes First
- **Status**: ✅ No violation. Pure SCSS/CSS — no framework-specific code. JavaScript is explicitly out of scope.

### Principle X — Documentation Is a First-Class Package Concern
- **Status**: ✅ No violation. Storybook stories, README usage guidance, and synthetic data documentation are included in scope.

### Principle XI — Versioning and Release Discipline
- **Status**: ✅ No violation. New SCSS partials are additive (backward-compatible). No token removals or renames.

### Change Scope Granularity (R/M/U/O)
- **M**: `packages/styles` — the compositions live entirely in the styles workspace
- **U**: Wizard composition, workflow/session composition, save-status indicator — each independently importable
- **O**: Individual SCSS partials, CSS custom properties, Storybook story files, index/forwarding entry points

**Gate verdict**: ✅ Pass — no violations identified.

## Project Structure

### Documentation (this feature)

```text
specs/026-wizard-workflow-compositions/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── sequences.md     # Visual flow sequences
└── tasks.md             # Phase 2 output (not created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/styles/src/pathable-component-wrappers/
├── pathable-wizard.scss             # [NEW] Wizard page layout composition
├── pathable-wizard-actions.scss      # [NEW] Wizard action footer
├── pathable-workflow-panel.scss     # [NEW] Workflow/session panel composition
├── pathable-save-status.scss        # [NEW] Save/progress status indicator
├── pathable-structured-workflow.scss # [NEW] Bundle: forwards wizard + workflow + save-status
├── pathable-all.scss                # [MODIFIED] Add @forward 'pathable-structured-workflow'
├── _index.scss                      # [MODIFIED] Already forwards pathable-all — no change needed

packages/styles/src/stories/
├── structured-workflow/
│   ├── Wizard.stories.js            # [NEW] Wizard composition stories
│   └── WorkflowPanel.stories.js     # [NEW] Workflow panel composition stories

packages/styles/test/
├── selective-import.scss            # [MODIFIED] Add selective import test for new components
```

**Structure Decision**: Single project layout. All additions stay within `packages/styles/src/pathable-component-wrappers/` for SCSS and `packages/styles/src/stories/` for Storybook. This follows the exact same pattern as all existing composition bundles (e.g., `pathable-dashboard`, `pathable-layout-composition`).

## Complexity Tracking

> No constitution violations detected. Complexity tracking not required.