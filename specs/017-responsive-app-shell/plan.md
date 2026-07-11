# Implementation Plan: Responsive Application Shell Pattern

**Branch**: `017-responsive-app-shell` | **Date**: 2026-07-11 | **Spec**: [`spec.md`](./spec.md)

**Input**: Feature specification from `/specs/017-responsive-app-shell/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

Add a framework-neutral responsive application shell pattern to the `@pathable/styles` package: a CSS Grid layout with a persistent desktop sidebar, a compact mobile top bar, an optional mobile bottom navigation (≤5 destinations), and a configurable main content area. The shell follows the existing pathable-component-wrapper pattern: new SCSS files under `src/pathable-component-wrappers/`, bundled via a new bundle forwarder (`pathable-app-shell.scss` with `pathable-bottom-navigation.scss`) and integrated into the navigation bundle. All spacing, color, elevation, and radius values use existing PathAble design tokens. No JavaScript runtime dependencies.

## Technical Context

**Language/Version**: SCSS via Dart Sass (`sass` npm package, as configured in `@pathable/styles`)

**Primary Dependencies**: `@uswds/uswds@^3.13.0` (existing peer dependency); no new dependencies

**Storage**: N/A — this feature produces compiled CSS only

**Testing**: Storybook visual stories (`packages/styles/src/stories/`) + Playwright for accessibility/compliance verification

**Target Platform**: Browser (all modern browsers supporting CSS Grid, `env(safe-area-inset-bottom)`, `@media (forced-colors: active)`, `prefers-reduced-motion`, and `dvh` units)

**Project Type**: SCSS styles library (`@pathable/styles`) — part of a pnpm monorepo

**Performance Goals**: Zero runtime cost; compiled CSS only (no JS). CSS output must not exceed approximately 8KB uncompressed for all new patterns combined.

**Constraints**:
- No JavaScript runtime dependencies
- Must compile with Dart Sass (no LibSass/node-sass)
- Must work at 200% browser zoom and narrow landscape heights
- Must respect `prefers-reduced-motion`, `forced-colors`, and `env(safe-area-inset-bottom)`
- All values must reference PathAble design tokens (CSS custom properties), never hardcoded
- Focus order must follow DOM order across all breakpoints
- Active navigation must use color + at least one additional cue (weight, border, marker, shape)
- Shell must be framework-neutral — no routing, authentication, or authorization logic

**Scale/Scope**: 2 new SCSS files (app-shell, bottom-navigation), 1 bundle package update, 1 navigation bundle update, 1 entry-point update, approximately 4-5 story files

**NEEDS CLARIFICATION**: None — Issue #31 and the existing codebase provided sufficient detail for all design decisions. See [research.md](./research.md) for resolved unknowns.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate 1: CSS Custom Properties Are the Runtime Contract
**Status: PASS** — All new styling will reference existing `--pathable-*` CSS custom properties (spacing, color, elevation, radius). No raw values in output.

### Gate 2: SCSS Is an Authoring and Extension Layer
**Status: PASS** — New patterns follow the established pattern: SCSS source files produce CSS output. Shell layout is authored in SCSS, compiles to standard CSS class selectors.

### Gate 3: pnpm Workspaces Structure
**Status: PASS** — All changes remain inside `packages/styles`. No new workspace packages needed.

### Gate 4: First Implementation Slice Is Narrow
**Status: PASS** — This is an additive feature within the existing `@pathable/styles` package. No new packages, no framework components.

### Gate 5: Published Artifacts Must Be Reliable
**Status: PASS** — SCSS source will be included in the existing entry point; compiled CSS output will include new patterns automatically via the existing `sass` build command.

### Gate 6: Token Naming Must Be Semantic and Stable
**Status: PASS** — All new styling uses existing semantic tokens (`--pathable-color-surface`, `--pathable-color-bg`, `--pathable-color-text`, `--pathable-color-border`, `--pathable-color-focus-ring`, `--elevation-*`, `--radius-*`, `--space-*`, etc.). No new custom properties are required beyond what already exists.

### Gate 7: Design Source Alignment Matters
**Status: PASS** — No new tokens are being added that could diverge from Figma. Existing tokens referenced are already aligned.

### Gate 8: Accessibility Is Part of Token Quality
**Status: PASS — WITH JUSTIFICATION** — The spec requires forced-colors mode boundary preservation (FR-011), visible focus rings (FR-008, FR-009), WCAG AA contrast, active-state multi-cue differentiation (FR-007), skip link support, and safe-area padding for mobile devices. These exceed baseline accessibility expectations.

### Gate 9: Framework Independence Comes First
**Status: PASS** — Pure SCSS/CSS. No framework dependencies. Framework-specific components explicitly out of scope (see Assumptions in spec).

### Gate 10: Documentation Is a First-Class Package Concern
**Status: PASS** — Each shell region has documented CSS custom properties, modifier classes, and usage guidance. Storybook stories show desktop, tablet, and mobile examples with both short and long navigation labels.

### Gate 11: Versioning and Release Discipline
**Status: PASS** — Additive changes (new patterns, no removals/renames). This is a minor version bump — new functionality with backward compatibility.

### Gate 12: R/M/U/O Scope Granularity
**Status: PASS**
- M (Module): `@pathable/styles` package — the hard outer boundary
- U (Unit): Each SCSS file (app-shell, bottom-navigation) is a unit
- O (Operation): Individual class definitions, token references, and responsive/accessibility variants within each file

### Gate 13: Architecture SSOT Compliance
**Status: PASS** — SSOT artifacts created: `data-model.md`, `contracts/contracts.md`, `research.md`. No contradictions with existing SSOT content.

### Post-Design Re-Evaluation (Phase 1 Complete)

All gates re-checked after Phase 1 design. No changes required — design artifacts comply with all constitution principles. Research resolved all unknowns. Data model accurately reflects the CSS class API. Contracts document the public interface clearly.

## Project Structure

### Documentation (this feature)

```text
specs/017-responsive-app-shell/
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
├── _index.scss                               # Forwarding entry point (existing)
├── pathable-all.scss                         # Aggregates all bundle packages (existing — unchanged)
├── pathable-navigation.scss                  # Bundle package (existing — update to add new forwards)
├── pathable-app-shell.scss                   # NEW bundle: forwards app shell + bottom navigation
├── pathable-app-shell-layout.scss            # NEW: responsive shell layout (sidebar, top bar, content)
├── pathable-bottom-navigation.scss           # NEW: mobile bottom navigation bar
└── ... (existing files unchanged)

packages/styles/src/stories/
└── app-shell/                                # NEW story directory
    ├── AppShell.stories.js                   # Desktop shell with sidebar + content
    ├── AppShellMobile.stories.js             # Mobile shell with top bar + bottom nav
    └── AppShellVariants.stories.js           # Long labels, wide content, fixed sidebar variants
```

**Structure Decision**: The app shell and bottom navigation are independent files (one for the full shell layout `pathable-app-shell-layout.scss`, one for bottom navigation `pathable-bottom-navigation.scss`) to support selective imports. A new bundle package `pathable-app-shell.scss` forwards both. The existing navigation bundle `pathable-navigation.scss` adds the new `pathable-app-shell` forward so consumers get shell patterns alongside other navigation patterns.

## Complexity Tracking

No constitution violations to justify. All gates pass cleanly.

### Unknown Resolution Plan

All unknowns resolved during Phase 0 research (see [research.md](./research.md)):

1. **CSS Grid layout approach** — resolved: CSS Grid with `grid-template-areas` for declarative region layout
2. **Sidebar width and scroll behavior** — resolved: 280px fixed width with independent scrolling
3. **Safe-area padding** — resolved: `env(safe-area-inset-bottom, 0px)` via CSS custom property
4. **Breakpoint strategy** — resolved: single breakpoint at 1024px matching existing project conventions
5. **Active nav differentiation** — resolved: inset left border (sidebar) or top marker (bottom nav) + font-weight + color
6. **Skip link integration** — resolved: reuse existing `pathable-skipnav` component
7. **Forced-colors mode** — resolved: follow established `pathable-surface.scss` pattern
8. **File organization** — resolved: two new SCSS files + bundle package, update navigation bundle