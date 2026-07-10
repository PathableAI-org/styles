# Implementation Plan: Compositional Layout Primitives and Semantic Surfaces

**Branch**: `023-layout-primitives` | **Date**: 2026-07-10 | **Spec**: [`spec.md`](./spec.md)

**Input**: Feature specification from `/specs/015-layout-primitives/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

Add a set of SCSS layout primitives (container, stack, cluster, split, card-grid, sidebar-layout, sticky-panel) and semantic surface variants (base, raised, inset, interactive, brand, inverse) to the `@pathable/styles` package. These primitives follow the existing pathable-component-wrapper pattern: new SCSS files under `src/pathable-component-wrappers/`, bundled via a new `pathable-layout-composition` bundle package forwarded from `pathable-all.scss`. All spacing, color, elevation, and radius values use existing PathAble design tokens. No new runtime dependencies are introduced.

## Technical Context

**Language/Version**: SCSS via Dart Sass (`sass` npm package, as configured in `@pathable/styles`)

**Primary Dependencies**: `@uswds/uswds@^3.13.0` (existing peer dependency); no new dependencies

**Storage**: N/A — this feature produces compiled CSS only

**Testing**: Storybook visual stories (`apps/storybook` — HTML stories using `@storybook/html-vite`) + Playwright for accessibility/compliance verification

**Target Platform**: Browser (all modern browsers supporting CSS Grid, Flexbox, Custom Properties, `position: sticky`, `prefers-reduced-motion`, and `forced-colors`)

**Project Type**: SCSS styles library (`@pathable/styles`) — part of a pnpm monorepo

**Performance Goals**: Zero runtime cost; compiled CSS only (no JS). CSS output must not exceed approximately 15KB uncompressed for all new primitives combined.

**Constraints**:
- No JavaScript runtime dependencies
- Must compile with Dart Sass (no LibSass/node-sass)
- Must work at 200% browser zoom
- Must respect `prefers-reduced-motion` and `forced-colors`
- All values must reference PathAble design tokens (CSS custom properties), never hardcoded
- Must follow existing wrapper pattern: `@use 'uswds-core' as *;` then `@extend` if wrapping USWDS; stand-alone CSS for primitives that have no USWDS equivalent (stack, cluster, split, card-grid are pure CSS Grid/Flexbox)

**Scale/Scope**: 8 new SCSS files (7 primitives + 1 bundle forwarder), 1 bundle package update, 1 entry-point update, approximately 12 story files

**NEEDS CLARIFICATION**:
1. Card grid minimum column width (or minimum card width) not specified in the issue or spec — this affects the `auto-fill` / `auto-fit` grid template columns value
2. Collapse breakpoint for split and sidebar layouts — not specified; needs a specific viewport width (or token)
3. Sticky panel viewport height threshold for disabling sticky behavior — not specified; needs a defined ratio or pixel value

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate 1: CSS Custom Properties Are the Runtime Contract (Principle I)
**Status: PASS** — All primitive styling will reference existing `--pathable-*` CSS custom properties (spacing, elevation, radius, semantic colors). No raw values in output.

### Gate 2: SCSS Is an Authoring and Extension Layer (Principle II)
**Status: PASS** — Primitives follow the established pattern: SCSS source files produce CSS output. Sass variables are used only for internal organization where needed.

### Gate 3: pnpm Workspaces Structure (Principle III)
**Status: PASS** — All changes remain inside `packages/styles`. No new workspace packages needed.

### Gate 4: First Implementation Slice Is Narrow (Principle IV)
**Status: PASS** — This is an additive feature within the existing `@pathable/styles` package. No new packages, no framework components.

### Gate 5: Published Artifacts Must Be Reliable (Principle V)
**Status: PASS** — SCSS source will be included in the existing entry point; compiled CSS output will include new primitives automatically via the existing `sass` build command.

### Gate 6: Token Naming Must Be Semantic and Stable (Principle VI)
**Status: PASS** — All new styling uses existing semantic tokens (`--space-*`, `--elevation-*`, `--radius-*`, `--pathable-color-surface`, etc.). No new custom properties are required beyond what already exists.

### Gate 7: Accessibility Is Part of Token Quality (Principle VIII)
**Status: PASS — WITH JUSTIFICATION** — The spec requires `forced-colors` boundary preservation, `prefers-reduced-motion` transitions removal, and 200% zoom support. Interactive surfaces expose focus-visible/focus-within states. Sticky panel has viewport-height guard. These exceed baseline accessibility expectations.

### Gate 8: Framework Independence Comes First (Principle IX)
**Status: PASS** — Pure SCSS/CSS. No framework dependencies.

### Gate 9: Documentation Is a First-Class Concern (Principle X)
**Status: PASS** — Each primitive has a clearly documented responsibility (FR-017). Container widths are documented with recommended use cases (FR-016). Storybook stories show each primitive independently and in nested composition.

### Gate 10: Versioning and Release Discipline (Principle XI)
**Status: PASS** — Additive changes (new primitives, no removals/renames). This is a minor version bump — new functionality with backward compatibility.

### Gate 11: R/M/U/O Scope Granularity
**Status: PASS**
- M (Module): `@pathable/styles` package — the hard outer boundary
- U (Unit): Each SCSS wrapper file (container, stack, cluster, split, card-grid, sidebar-layout, sticky-panel, surface) is a unit
- O (Operation): Individual class definitions, token references, and responsive variants within each file

### Gate 12: Architecture SSOT Compliance
**Status: PASS** — SSOT artifacts created: `data-model.md`, `contracts/contracts.md`, `research.md`. No contradictions with existing SSOT content.

### Post-Design Re-Evaluation (Phase 1 Complete)

All gates re-checked after Phase 1 design. No changes required — design artifacts comply with all constitution principles. Research resolved all three unknowns (card grid min width, collapse breakpoint, sticky height threshold). Data model accurately reflects the CSS class API. Contracts document the public interface clearly.

## Project Structure

### Documentation (this feature)

```text
specs/015-layout-primitives/
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
├── pathable-layout.scss                      # Existing layout bundle (update if layout primitives added)
├── pathable-layout-composition.scss          # NEW bundle: forwards all new layout primitives
├── pathable-container.scss                   # NEW
├── pathable-stack.scss                       # NEW
├── pathable-cluster.scss                     # NEW
├── pathable-split.scss                       # NEW
├── pathable-card-grid.scss                   # NEW
├── pathable-sidebar-layout.scss              # NEW
├── pathable-sticky-panel.scss                # NEW
├── pathable-surface.scss                     # NEW
└── ... (existing files unchanged)

packages/styles/src/
└── index.scss                                # Existing — no changes needed (already forwards pathable-component-wrappers/)

apps/storybook/src/stories/
└── layout-composition/                       # NEW story directory
    ├── Container.stories.js
    ├── Stack.stories.js
    ├── Cluster.stories.js
    ├── Split.stories.js
    ├── CardGrid.stories.js
    ├── SidebarLayout.stories.js
    ├── StickyPanel.stories.js
    ├── Surface.stories.js
    └── NestedComposition.stories.js           # Integration story showing multiple primitives together
```

**Structure Decision**: New primitives get their own bundle package (`pathable-layout-composition.scss`) rather than being added to the existing `pathable-layout.scss` bundle. The existing layout bundle contains USWDS-extending wrappers (grid, section, media-block, embed-container, layout-docs). The new primitives are pure CSS composition patterns, not USWDS wrappers. Keeping them separate makes selective imports clearer and maintains backward compatibility.

## Complexity Tracking

No constitution violations to justify. All gates pass cleanly.

### Unknown Resolution Plan

The following unknowns from Technical Context need Phase 0 research:

1. **Card grid minimum column width** — research common card grid implementations and PathAble token spacing to recommend a default
2. **Split/sidebar collapse breakpoint** — research existing USWDS breakpoints used in the project and recommend a standard responsive threshold
3. **Sticky panel viewport height threshold** — research WCAG sticky-behavior guidance and common implementation patterns