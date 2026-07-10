# Implementation Plan: Reusable Interaction States, Icon Conventions, and Compact Controls

**Branch**: `024-interaction-icons-controls` | **Date**: 2026-07-10 | **Spec**: [`spec.md`](./spec.md)

**Input**: Feature specification from `/specs/016-interaction-icons-controls/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

Add a set of SCSS interaction-state mixins, an accessible icon-button component, a segmented/toggle-button control, and icon tile/status-icon conventions to the `@pathable/styles` package. These patterns follow the existing pathable-component-wrapper pattern: new SCSS files under `src/pathable-component-wrappers/`, bundled via `pathable-interaction-controls` bundle package forwarded from `pathable-all.scss`. All spacing, color, elevation, and radius values use existing PathAble design tokens. No new runtime dependencies are introduced.

## Technical Context

**Language/Version**: SCSS via Dart Sass (`sass` npm package, as configured in `@pathable/styles`)

**Primary Dependencies**: `@uswds/uswds@^3.13.0` (existing peer dependency); no new dependencies

**Storage**: N/A — this feature produces compiled CSS only

**Testing**: Storybook visual stories (`apps/storybook` — HTML stories using `@storybook/html-vite`) + Playwright for accessibility/compliance verification

**Target Platform**: Browser (all modern browsers supporting CSS Grid, Flexbox, Custom Properties, `position: sticky`, `prefers-reduced-motion`, and `forced-colors`)

**Project Type**: SCSS styles library (`@pathable/styles`) — part of a pnpm monorepo

**Performance Goals**: Zero runtime cost; compiled CSS only (no JS). CSS output must not exceed approximately 15KB uncompressed for all new patterns combined.

**Constraints**:
- No JavaScript runtime dependencies
- Must compile with Dart Sass (no LibSass/node-sass)
- Must work at 200% browser zoom
- Must respect `prefers-reduced-motion` and `forced-colors`
- All values must reference PathAble design tokens (CSS custom properties), never hardcoded
- Icon button and segmented control must provide accessible focus rings visible on all surface types (base, brand, inverse)
- Segmented control keyboard navigation must follow ARIA radio group or toggle button patterns
- Loading states must be CSS-only (no JS timing or state management)

**Scale/Scope**: 4-5 new SCSS files (interaction-state mixins, icon-button, segmented-control, icon-tile + icon conventions documentation), 1 bundle package update, 1 entry-point update, approximately 8-10 story files

**NEEDS CLARIFICATION**: None — Issue 30 provided sufficient detail for all design decisions. See [research.md](./research.md) for resolved unknowns.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate 1: CSS Custom Properties Are the Runtime Contract (Principle I)
**Status: PASS** — All new styling will reference existing `--pathable-*` CSS custom properties (spacing, color, elevation, radius, focus ring). No raw values in output.

### Gate 2: SCSS Is an Authoring and Extension Layer (Principle II)
**Status: PASS** — New patterns follow the established pattern: SCSS source files produce CSS output. Interaction states will use SCSS mixins (authoring-time abstraction) that compile to standard CSS selectors.

### Gate 3: pnpm Workspaces Structure (Principle III)
**Status: PASS** — All changes remain inside `packages/styles`. No new workspace packages needed.

### Gate 4: First Implementation Slice Is Narrow (Principle IV)
**Status: PASS** — This is an additive feature within the existing `@pathable/styles` package. No new packages, no framework components.

### Gate 5: Published Artifacts Must Be Reliable (Principle V)
**Status: PASS** — SCSS source will be included in the existing entry point; compiled CSS output will include new patterns automatically via the existing `sass` build command.

### Gate 6: Token Naming Must Be Semantic and Stable (Principle VI)
**Status: PASS** — All new styling uses existing semantic tokens (`--pathable-color-surface`, `--pathable-color-focus-ring`, `--pathable-color-border`, `--elevation-*`, `--radius-*`, `--space-*`, etc.). No new custom properties are required beyond what already exists.

### Gate 7: Design Source Alignment Matters (Principle VII)
**Status: PASS** — No new tokens are being added that could diverge from Figma. Existing tokens referenced are already aligned.

### Gate 8: Accessibility Is Part of Token Quality (Principle VIII)
**Status: PASS — WITH JUSTIFICATION** — The spec requires `forced-colors` boundary preservation (FR-019), `prefers-reduced-motion` transitions removal (FR-018), visible focus rings on all surface types (FR-017), WCAG AA contrast for disabled content (FR-004), and correct ARIA semantics for segmented controls (FR-014, FR-016). Icon-only controls require accessible names in all examples. These exceed baseline accessibility expectations.

### Gate 9: Framework Independence Comes First (Principle IX)
**Status: PASS** — Pure SCSS/CSS. No framework dependencies. Framework-specific components explicitly out of scope (see Assumptions in spec).

### Gate 10: Documentation Is a First-Class Package Concern (Principle X)
**Status: PASS** — Each pattern has a clearly documented responsibility. Icon sizes and alignment rules are documented (FR-006). Decorative vs. meaningful icon conventions are documented (FR-007). Storybook stories show each pattern independently and in integration.

### Gate 11: Versioning and Release Discipline (Principle XI)
**Status: PASS** — Additive changes (new patterns, no removals/renames). This is a minor version bump — new functionality with backward compatibility.

### Gate 12: R/M/U/O Scope Granularity
**Status: PASS**
- M (Module): `@pathable/styles` package — the hard outer boundary
- U (Unit): Each SCSS file (interaction-state mixins, icon-button, segmented-control, icon-tile) is a unit
- O (Operation): Individual class definitions, token references, and responsive/accessibility variants within each file

### Gate 13: Architecture SSOT Compliance
**Status: PASS** — SSOT artifacts created: `data-model.md`, `contracts/contracts.md`, `research.md`. No contradictions with existing SSOT content.

### Post-Design Re-Evaluation (Phase 1 Complete)

All gates re-checked after Phase 1 design. No changes required — design artifacts comply with all constitution principles. Research resolved all unknowns. Data model accurately reflects the CSS class API. Contracts document the public interface clearly.

## Project Structure

### Documentation (this feature)

```text
specs/016-interaction-icons-controls/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/styles/src/pathable-component-wrappers/
├── _index.scss                               # Forwarding entry point (existing)
├── pathable-all.scss                         # Aggregates all bundle packages (existing — update)
├── pathable-interaction-controls.scss        # NEW bundle: forwards all new interaction/control files
├── pathable-interaction-states.scss          # NEW: mixins for hover, focus, selected, pressed, disabled, loading
├── pathable-icon-button.scss                 # NEW: compact icon button with appearance variants
├── pathable-segmented-control.scss           # NEW: segmented / toggle-button group
├── pathable-icon-tile.scss                   # NEW: square and circular icon container
└── ... (existing files unchanged)

packages/styles/src/stories/
└── interaction-controls/                     # NEW story directory
    ├── InteractionStates.stories.js
    ├── IconButton.stories.js
    ├── SegmentedControl.stories.js
    ├── IconTile.stories.js
    └── Integration.stories.js                # Integration story showing icon button inside surface
```

**Structure Decision**: New patterns get their own bundle package (`pathable-interaction-controls.scss`) rather than being added to existing bundles. The icon tile and icon button extend the existing icon concept without modifying `pathable-icon.scss` (which wraps USWDS `usa-icon`). Keeping them separate makes selective imports clearer and maintains backward compatibility.

## Complexity Tracking

No constitution violations to justify. All gates pass cleanly.

### Unknown Resolution Plan

The following unknowns from Technical Context need Phase 0 research:

1. **Loading state in pure CSS** — research CSS-only loading indicator approaches (pseudo-element spinner, animated border, toggled icon visibility) and recommend a pattern that prevents layout shift
2. **Default icon sizes for icon button and icon tiles** — research USWDS icon sizing conventions and WCAG touch target minimums to recommend compact/default/large sizes
3. **Segmented control keyboard accessibility** — research ARIA radio-group and toggle-button patterns to document the correct role, keyboard navigation, and state management expectations
4. **Selected + pressed distinguishability** — research patterns for distinguishing selected (persistent) from pressed (momentary) states using shape, border, weight, or icon in addition to color