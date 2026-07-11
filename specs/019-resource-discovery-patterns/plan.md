# Implementation Plan: Resource Discovery Card, Filter Bar, and Guided Wayfinder Patterns

**Branch**: `019-resource-discovery-patterns` | **Date**: 2026-07-11 | **Spec**: [`spec.md`](./spec.md)

**Input**: Feature specification from `/specs/019-resource-discovery-patterns/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

Add a coherent set of resource discovery patterns to the `@pathable/styles` package: resource cards (grid and horizontal-list layouts with media, title, provider, summary, badges, metadata, rating, source, primary link, and optional secondary action), a composite filter bar (search, facets, sort, result count, active-filter pills, clear-all), and a guided wayfinder panel (introductory icon, heading, explanatory text, labeled question groups, and primary action). Each pattern follows the existing pathable-component-wrapper pattern with new SCSS files, bundle integration, and Storybook stories. All styling uses existing PathAble design tokens. No JavaScript runtime dependencies.

## Technical Context

**Language/Version**: SCSS via Dart Sass (`sass` npm package, as configured in `@pathable/styles`)

**Primary Dependencies**: `@uswds/uswds@^3.13.0` (existing peer dependency); no new dependencies. Patterns reference existing `--pathable-*` CSS custom properties and the existing `pathable-surface` / `pathable-interaction-states` patterns for card and panel behavior.

**Storage**: N/A — this feature produces compiled CSS only

**Testing**: Storybook visual stories (`packages/styles/src/stories/`) + Playwright for accessibility/compliance verification (forced-colors, 200% zoom, keyboard navigation)

**Target Platform**: Browser (all modern browsers supporting CSS grid, `@media (forced-colors: active)`, attribute selectors, and `:focus-visible` / `:focus-within`)

**Project Type**: SCSS styles library (`@pathable/styles`) — part of a pnpm monorepo

**Performance Goals**: Zero runtime cost; compiled CSS only (no JS). CSS output for all patterns combined must not exceed approximately 12KB uncompressed.

**Constraints**:
- No JavaScript runtime dependencies
- Must compile with Dart Sass (no LibSass/node-sass)
- Must work at 200% browser zoom and narrow mobile widths
- Must respect `forced-colors` and stacking contexts
- All values must reference PathAble design tokens (CSS custom properties), never hardcoded
- Secondary action controls must be siblings of the primary card link (never nested) with independent focus states
- Active filter pills must have visible dismiss controls with accessible labels
- Filter controls must wrap without horizontal page overflow
- Wayfinder defaults must not force a selection before the user understands choices
- Framework-neutral — no search, filtering, persistence, save behavior, or routing
- Each pattern must support selective imports and all-in-one import

**Scale/Scope**: 4 new SCSS files (resource-card, filter-bar, filter-pill, wayfinder), 1 new bundle package (pathable-discovery), 1 entry-point update, approximately 6-8 story files

**NEEDS CLARIFICATION**: None — all 3 unknowns resolved during Phase 0 research (see [research.md](./research.md)).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate 1: CSS Custom Properties Are the Runtime Contract
**Status: PASS** — All new styling will reference existing `--pathable-*` CSS custom properties (spacing, color, elevation, radius, font). No raw values in output.

### Gate 2: SCSS Is an Authoring and Extension Layer
**Status: PASS** — New patterns follow the established pattern: SCSS source files produce CSS output. Discovery patterns are authored in SCSS, compile to standard CSS class selectors.

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
**Status: PASS — WITH JUSTIFICATION** — The spec requires forced-colors mode boundary preservation (FR-016), independent focus states for secondary actions (FR-005), accessible labels on filter pills (FR-008), programmatic announcement guidance for result-count changes (FR-012), decorative icons hidden from assistive tech (FR-013), and 200% zoom readability (FR-016). These exceed baseline accessibility expectations.

### Gate 9: Framework Independence Comes First
**Status: PASS** — Pure SCSS/CSS. No framework dependencies. No search, filtering, persistence, or routing (see Non-goals in Issue #33).

### Gate 10: Documentation Is a First-Class Package Concern
**Status: PASS** — Each discovery pattern has documented CSS custom properties, modifier classes, and usage guidance. Storybook stories show each variant, populated/sparse/loading/empty examples.

### Gate 11: Versioning and Release Discipline
**Status: PASS** — Additive changes (new patterns, no removals/renames). This is a minor version bump — new functionality with backward compatibility.

### Gate 12: R/M/U/O Scope Granularity
**Status: PASS**
- M (Module): `@pathable/styles` package — the hard outer boundary
- U (Unit): Each SCSS file (resource-card, filter-bar, filter-pill, wayfinder) is a unit
- O (Operation): Individual class definitions, token references, variant modifiers, and responsive/accessibility variants within each file

### Gate 13: Architecture SSOT Compliance
**Status: PASS** — SSOT artifacts will be created: `data-model.md`, `contracts/contracts.md`, `research.md`. No contradictions with existing SSOT content.

### Post-Design Re-Evaluation (Phase 1 Complete)

All gates re-checked after Phase 1 design. No changes required — design artifacts comply with all constitution principles:

| Gate | Status | Notes |
|------|--------|-------|
| Gate 1 (CSS Custom Properties) | PASS | All token references use existing `--pathable-*` properties |
| Gate 2 (SCSS Authoring Layer) | PASS | New SCSS files follow established pattern |
| Gate 3 (pnpm Workspaces) | PASS | Changes scoped to `packages/styles` only |
| Gate 4 (Narrow First Slice) | PASS | Additive, no new packages |
| Gate 5 (Published Artifacts) | PASS | New files bundled via existing build |
| Gate 6 (Semantic Tokens) | PASS | No new custom properties needed |
| Gate 7 (Design Source Alignment) | PASS | No new tokens to diverge |
| Gate 8 (Accessibility) | PASS | Spec covers force-colors, zoom, independent focus states, accessible labels |
| Gate 9 (Framework Independence) | PASS | Pure SCSS, no JS, no framework dependencies |
| Gate 10 (Documentation) | PASS | Contracts, sequences, quickstart, and data model documented |
| Gate 11 (Versioning) | PASS | Additive minor changes |
| Gate 12 (R/M/U/O Scope) | PASS | M: @pathable/styles; U: 4 SCSS files |
| Gate 13 (Architecture SSOT) | PASS | SSOT artifacts created, no contradictions with existing content |

## Project Structure

### Documentation (this feature)

```text
specs/019-resource-discovery-patterns/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── contracts.md     # Public CSS class API contract
│   └── sequences.md     # Visual state transition sequences
└── checklists/
    └── requirements.md  # Pre-planning quality checklist
```

### Source Code (repository root)

```text
packages/styles/src/pathable-component-wrappers/
├── pathable-discovery.scss              # NEW bundle package: forwards resource-card, filter-bar, filter-pill, wayfinder
├── pathable-resource-card.scss          # NEW: resource card with grid/list layout support
├── pathable-filter-bar.scss             # NEW: composite filter bar (search, facets, sort, count, pills, clear)
├── pathable-filter-pill.scss            # NEW: removable active-filter pill with dismiss control
├── pathable-wayfinder.scss              # NEW: guided wayfinder panel with question groups
├── pathable-all.scss                    # All-in-one entry point (existing — add @forward 'pathable-discovery')
└── ... (existing files unchanged)

packages/styles/src/stories/
├── resource-card/                       # NEW story directory
│   └── ResourceCard.stories.js
├── filter-bar/                          # NEW story directory
│   └── FilterBar.stories.js
├── filter-pill/                         # NEW story directory
│   └── FilterPill.stories.js
└── wayfinder/                           # NEW story directory
    └── Wayfinder.stories.js
```

**Structure Decision**: Each discovery pattern is an independent SCSS file to support selective imports. A new bundle package `pathable-discovery.scss` will forward all four patterns. The existing `pathable-all.scss` entry point will add `@forward 'pathable-discovery'` to automatically include the new patterns.

## Complexity Tracking

No constitution violations to justify. All gates pass cleanly.

### Unknown Resolution Plan

All 3 unknowns resolved during Phase 0 research (see [research.md](./research.md)):

1. **Resource card secondary action pattern** — resolved: card container uses `:focus-within` for card-level emphasis; primary link and secondary action are sibling direct children (see research.md)
2. **Filter-bar responsive breakpoint approach** — resolved: `desktop` breakpoint (1024px) threshold; search and active pills always visible; `.pathable-filter-bar--drawer-mode` modifier for consumer-provided drawer trigger (see research.md)
3. **Wayfinder question-group layout** — resolved: question groups in horizontal row at wide widths, single-column below 1024px; each question group is a vertical stack of labeled controls (see research.md)