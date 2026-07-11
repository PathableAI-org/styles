# Implementation Plan: App Feedback Patterns

**Branch**: `018-app-feedback-patterns` | **Date**: 2026-07-11 | **Spec**: [`spec.md`](./spec.md)

**Input**: Feature specification from `/specs/018-app-feedback-patterns/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

Add a coherent set of application feedback patterns to the `@pathable/styles` package: toast notifications (informational, progress, success, warning, error), inline loading indicators, skeleton placeholders (text, avatar, card, table-row), empty states (no-data, no-results, setup-required, completed), and page-level error patterns (compact panel and full-page). Each pattern follows the existing pathable-component-wrapper pattern with new SCSS files, bundle integration, and Storybook stories. All styling uses existing PathAble design tokens. No JavaScript runtime dependencies.

## Technical Context

**Language/Version**: SCSS via Dart Sass (`sass` npm package, as configured in `@pathable/styles`)

**Primary Dependencies**: `@uswds/uswds@^3.13.0` (existing peer dependency); no new dependencies

**Storage**: N/A — this feature produces compiled CSS only

**Testing**: Storybook visual stories (`packages/styles/src/stories/`) + Playwright for accessibility/compliance verification (forced-colors, prefers-reduced-motion, zoom)

**Target Platform**: Browser (all modern browsers supporting CSS animations, `@media (prefers-reduced-motion: no-preference)`, `@media (forced-colors: active)`, `[role]` attribute selectors, and stacking context management)

**Project Type**: SCSS styles library (`@pathable/styles`) — part of a pnpm monorepo

**Performance Goals**: Zero runtime cost; compiled CSS only (no JS). CSS output for all patterns combined must not exceed approximately 15KB uncompressed.

**Constraints**:
- No JavaScript runtime dependencies
- Must compile with Dart Sass (no LibSass/node-sass)
- Must work at 200% browser zoom and narrow mobile widths
- Must respect `prefers-reduced-motion`, `forced-colors`, and stacking contexts
- All values must reference PathAble design tokens (CSS custom properties), never hardcoded
- Toast region must not overlap primary navigation or critical controls
- Skeleton dimensions must approximate final content dimensions to reduce layout shift
- Decorative icons must be hidden from assistive technology (`aria-hidden="true"`)
- Framework-neutral — no toast queues, timers, retry logic, or async state management
- Each pattern must support selective imports and all-in-one import

**Scale/Scope**: 5 new SCSS files (toast, loading, skeleton, empty-state, page-error), 1 bundle package update, 2 entry-point updates, approximately 8-10 story files

**NEEDS CLARIFICATION**: None — Issue #32 and the existing codebase provided sufficient detail. See [research.md](./research.md) for resolved unknowns.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate 1: CSS Custom Properties Are the Runtime Contract
**Status: PASS** — All new styling will reference existing `--pathable-*` CSS custom properties (spacing, color, elevation, radius, font). No raw values in output.

### Gate 2: SCSS Is an Authoring and Extension Layer
**Status: PASS** — New patterns follow the established pattern: SCSS source files produce CSS output. Feedback patterns are authored in SCSS, compile to standard CSS class selectors.

### Gate 3: pnpm Workspaces Structure
**Status: PASS** — All changes remain inside `packages/styles`. No new workspace packages needed.

### Gate 4: First Implementation Slice Is Narrow
**Status: PASS** — This is an additive feature within the existing `@pathable/styles` package. No new packages, no framework components.

### Gate 5: Published Artifacts Must Be Reliable
**Status: PASS** — SCSS source will be included in the existing entry point; compiled CSS output will include new patterns automatically via the existing `sass` build command.

### Gate 6: Token Naming Must Be Semantic and Stable
**Status: PASS** — All new styling uses existing semantic tokens (`--pathable-color-surface`, `--pathable-color-bg`, `--pathable-color-text`, `--pathable-color-text-muted`, `--pathable-color-border`, `--pathable-color-focus-ring`, `--pathable-color-accent`, `--elevation-*`, `--radius-*`, `--space-*`, etc.). No new custom properties are required beyond what already exists.

### Gate 7: Design Source Alignment Matters
**Status: PASS** — No new tokens are being added that could diverge from Figma. Existing tokens referenced are already aligned.

### Gate 8: Accessibility Is Part of Token Quality
**Status: PASS — WITH JUSTIFICATION** — The spec requires forced-colors mode boundary preservation (FR-015), role-based semantic distinctions (FR-003 with `role="status"` vs `role="alert"`), decorative icons hidden from assistive tech (FR-014), prefers-reduced-motion for skeleton animations (FR-009), color contrast for all states, and 200% zoom readability (FR-005). These exceed baseline accessibility expectations.

### Gate 9: Framework Independence Comes First
**Status: PASS** — Pure SCSS/CSS. No framework dependencies. No toast queues, timers, or async state management (see Assumptions in spec).

### Gate 10: Documentation Is a First-Class Package Concern
**Status: PASS** — Each feedback pattern has documented CSS custom properties, modifier classes, and usage guidance. Storybook stories show each variant, mobile viewports, long text examples, and multiple stacked toasts.

### Gate 11: Versioning and Release Discipline
**Status: PASS** — Additive changes (new patterns, no removals/renames). This is a minor version bump — new functionality with backward compatibility.

### Gate 12: R/M/U/O Scope Granularity
**Status: PASS**
- M (Module): `@pathable/styles` package — the hard outer boundary
- U (Unit): Each SCSS file (toast, loading, skeleton, empty-state, page-error) is a unit
- O (Operation): Individual class definitions, token references, variant modifiers, and responsive/accessibility variants within each file

### Gate 13: Architecture SSOT Compliance
**Status: PASS** — SSOT artifacts created: `data-model.md`, `contracts/contracts.md`, `research.md`. No contradictions with existing SSOT content.

### Post-Design Re-Evaluation (Phase 1 Complete)

All gates re-checked after Phase 1 design. No changes required — design artifacts comply with all constitution principles.

## Project Structure

### Documentation (this feature)

```text
specs/018-app-feedback-patterns/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── contracts.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
packages/styles/src/pathable-component-wrappers/
├── pathable-communication.scss              # Bundle package (existing — update to add new forwards)
├── pathable-toast.scss                      # NEW: toast notification region + individual toast
├── pathable-loading.scss                    # NEW: inline spinner + status text
├── pathable-skeleton.scss                   # NEW: skeleton placeholder shapes
├── pathable-empty-state.scss                # NEW: empty state variants
├── pathable-page-error.scss                 # NEW: page-level error patterns
├── pathable-all.scss                        # All-in-one entry point (existing — update)
└── ... (existing files unchanged)

packages/styles/src/stories/
├── toast/                                   # NEW story directory
│   └── Toast.stories.js
├── loading/
│   └── Loading.stories.js
├── skeleton/
│   └── Skeleton.stories.js
├── empty-state/
│   └── EmptyState.stories.js
└── page-error/
    └── PageError.stories.js
```

**Structure Decision**: Each feedback pattern is an independent SCSS file to support selective imports. The existing `pathable-communication.scss` bundle package will forward the new toast, loading, and skeleton files (since these are communication-oriented patterns). The existing `pathable-all.scss` entry point already forwards `pathable-communication` and will automatically include the new patterns.

## Complexity Tracking

No constitution violations to justify. All gates pass cleanly.

### Unknown Resolution Plan

All unknowns resolved during Phase 0 research (see [research.md](./research.md)):

1. **Toast position and stacking strategy** — resolved: fixed-position container at top-right using `--pathable-toast-inset-block-start` / `--pathable-toast-inset-inline-end` overridable custom properties
2. **Toast auto-dismiss visual treatment** — resolved: visual styling only (no timers); consumers add timers in their framework layer
3. **Skeleton animation approach** — resolved: CSS `@keyframes shimmer` with a linear gradient sweep
4. **Empty state illustration style** — resolved: optional decorative SVG slot with `aria-hidden="true"`, default is text-only layout
5. **Bundle organization across existing packages** — resolved: toast, loading, skeleton grouped under `pathable-communication`; empty-state and page-error each standalone within `pathable-all`
6. **Forced-colors mode for status boundaries** — resolved: apply `outline` or `border` that uses `CanvasText` via forced-colors media query; status icons use `forced-color-adjust: auto` for system color mapping