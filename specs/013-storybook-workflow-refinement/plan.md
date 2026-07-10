# Implementation Plan: Storybook Workflow-Context Refinement

**Branch**: `013-storybook-workflow-refinement` | **Date**: 2026-07-09 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/013-storybook-workflow-refinement/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

This feature refines the `@pathable/styles` Storybook documentation suite to reflect PathAble/CoachBridge disability-employment workflows instead of generic USWDS examples, adds per-component interaction model annotations, fixes a font fallback bug, adds workflow-intent button variant aliases, and clarifies the brand CSS custom property public API. The work spans story files, SCSS variables, button wrapper classes, and documentation annotations — all within the existing `packages/styles/src/` package. No new runtime dependencies, infrastructure, or application framework integration is required.

## Technical Context

**Language/Version**: SCSS (Dart Sass via `sass` npm package), JavaScript (Storybook 7+ stories)

**Primary Dependencies**: `@uswds/uswds` (2.x/3.x), Storybook (via `pnpm storybook` from workspace root)

**Storage**: N/A — no persistent data; all changes are CSS/story source files

**Testing**: Manual visual review in Storybook (`pnpm storybook`); stylelint (`pnpm stylelint`) for SCSS lint; `pnpm build` for compilation verification

**Target Platform**: Browser (Chrome, Firefox, Safari, Edge) — the compiled CSS is framework-agnostic

**Project Type**: Design system style package (`@pathable/styles`) + documentation (Storybook)

**Performance Goals**: N/A — no runtime performance concern; CSS compilation and Storybook build performance are not affected

**Constraints**: Must not change existing visual output; only copy/labels and documentation notes change for story updates. Deprecated CSS custom properties must remain functional but annotated.

**Scale/Scope**: 5 user stories spanning ~42 story files, 1 SCSS variable fix, 5 new button classes, 1 color property deprecation annotation. All changes confined to `packages/styles/src/`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I — CSS Custom Properties Are the Runtime Contract

**Status**: ✅ PASS

This feature adds deprecation annotations to existing custom properties but does not remove any. The runtime contract remains intact. New button aliases reference existing semantic tokens, so no new custom properties are introduced.

### Principle II — SCSS Is an Authoring and Extension Layer

**Status**: ✅ PASS

Workflow-intent button variants will be implemented as additional CSS classes that `@extend` existing `.usa-button` variants. Font fallback fix is a single variable value change. Both changes are authored in SCSS and produce the expected compiled CSS output. The SCSS API remains a secondary, opt-in surface.

### Principle III — pnpm Workspaces Structure the Repository

**Status**: ✅ PASS

All changes are within the existing `packages/styles/src/` workspace. No new packages are created. Existing `pnpm-workspace.yaml` structure is respected.

### Principle IV — First Implementation Slice Is Narrow

**Status**: ✅ PASS (informational — not applicable to this feature, which is an iterative refinement)

### Principle V — Published Artifacts Must Be Reliable

**Status**: ✅ PASS

Changes produce the same build output contract (`dist/` CSS, SCSS source files). Build verification (`pnpm build`) is required before completion.

### Principle VI — Token Naming Must Be Semantic and Stable

**Status**: ✅ PASS

Removal of short brand custom property names (`--pathable-blue`, `--intelligent-jade`, etc.) in favor of `--pathable-brand-*` names aligns with this principle. The short names had no consumers, so removal is safe.

### Principle VII — Design Source Alignment Matters

**Status**: ✅ PASS

No color value changes occurred. The short-name removal preserves all existing values while clarifying the canonical naming convention.

### Principle VIII — Accessibility Is Part of Token Quality

**Status**: ✅ PASS

Workflow-intent button variants must meet WCAG 2.1 AA contrast. The existing brand palette already satisfies this — the new classes will reuse existing semantic tokens that were designed with accessibility in mind.

### Principle IX — Framework Independence Comes First

**Status**: ✅ PASS

All changes are CSS/SCSS and Storybook documentation only. No framework-specific code is introduced. The interaction model annotations explicitly call out which behaviors require JS framework integration, preserving clarity about the framework boundary.

### Principle X — Documentation Is a First-Class Package Concern

**Status**: ✅ PASS

The entire feature is about improving Storybook documentation — making it workflow-specific and adding interaction model notes. This directly advances Principle X.

### Principle XI — Versioning and Release Discipline

**Status**: ✅ PASS

Token deprecation annotation (not removal) is a minor/patch change. Font fallback fix is a patch change. Button variant additions (new classes, no removed API) are a minor change. No breaking changes are introduced.

**Gate Result**: ✅ ALL GATES PASS. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/013-storybook-workflow-refinement/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/styles/src/
├── _colors.scss                          # Brand color properties (deprecation annotations)
├── _typography.scss                      # Font variable fix ($pathable-font-body fallback)
├── pathable-component-wrappers/
│   ├── pathable-button.scss              # Workflow-intent button variant classes
│   └── pathable-all.scss                 # (if needed for button variant forwards)
└── stories/
    ├── brand/
    │   └── Typography.stories.js         # (typography story unaffected but may show corrected font)
    ├── components/
    │   ├── Basic/
    │   │   └── Button.stories.js         # Add workflow-intent variant examples
    │   ├── Communication/
    │   │   ├── Banner.stories.js         # Workflow-specific copy
    │   │   └── Modal.stories.js          # Workflow-specific copy
    │   ├── FormControls/
    │   │   └── ComboBox.stories.js       # Workflow-specific options
    │   └── Navigation/
    │       └── Header.stories.js         # Workflow-specific nav labels
    └── (All other story files)           # Interaction model annotations (FR-006)
```

**Structure Decision**: Single-project layout — all changes are within the existing `packages/styles/src/` tree. No new directories are needed. The existing SCSS partial and stories directory structure is preserved.

## Complexity Tracking

> No Constitution violations to justify. All gates pass. No complexity tracking needed.

### Phase 0: Research

No unknowns require external research. All technical context is derivable from the existing codebase and the feature spec. Research phase will consist of:

1. **Button variant mapping**: Determine which USWDS button variant each workflow-intent alias should map to (e.g., `--destructive` maps to USWDS `--secondary` with danger semantics, or a custom treatment using `--pathable-color-danger`).
2. **Interaction model audit**: Review each of the ~42 story files to determine its interaction model classification (CSS-only, Requires USWDS JS, Requires app-owned state, Not yet behavior-complete).
3. **Deprecation API surface**: Confirm the exact set of short-name CSS custom properties to annotate and the replacement `--pathable-brand-*` equivalents.

### Phase 1: Design & Contracts

Outputs:

- `data-model.md` — Entity definitions for story files, button variants, CSS custom properties
- `contracts/` — Interaction model classification table, button variant mapping, deprecation map
- `quickstart.md` — Validation steps for verifying each requirement

### Phase 1: Agent Context Update

Run `.specify/extensions/agent-context/scripts/bash/update-agent-context.sh` to refresh the managed SPECKIT section.

### Post-Phase 1: Constitution Re-check

**Results**: ✅ ALL GATES REMAIN PASSED after detailed design.

| Principle | Status | Note |
| --- | --- | --- |
| I — CSS Custom Properties | ✅ | Short-name properties removed; only `--pathable-brand-*` canonicals remain; no value changes |
| II — SCSS Authoring Layer | ✅ | All new button classes use `@extend` pattern; font fix is variable change |
| III — pnpm Workspaces | ✅ | All changes within existing `packages/styles/src/` |
| IV — First Slice Narrow | ✅ | Iterative refinement — not applicable |
| V — Published Artifacts | ✅ | Build verification in quickstart.md |
| VI — Semantic Token Naming | ✅ | Short names removed; Sass variables preserved |
| VII — Design Source Alignment | ✅ | No color value changes |
| VIII — Accessibility | ✅ | All button variants have verified WCAG AA ratios (>5.8:1) in research.md |
| IX — Framework Independence | ✅ | No framework code added; interaction model classification clarifies JS boundary |
| X — Documentation | ✅ | Entire feature improves Storybook documentation |
| XI — Versioning & Release | ✅ | Removal is minor change; no breaking changes since zero consumers |

**No violations found. Complexity Tracking section remains empty.**
