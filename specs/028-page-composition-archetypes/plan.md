# Implementation Plan: Page Composition Archetypes

**Branch**: `028-page-composition-archetypes` | **Date**: 2026-07-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/028-page-composition-archetypes/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

Create four framework-neutral Storybook page compositions (marketing landing page, resource directory, operational dashboard, structured workflow) that compose existing public CSS classes from `packages/styles` into coherent page archetypes. Each composition has mobile and desktop viewport variants, passes accessibility checks, and includes framework-neutral semantic HTML alongside the rendered story.

## Technical Context

**Language/Version**: CSS (no runtime language) plus existing SCSS (Dart Sass via `sass` npm package) — no new SCSS files needed

**Primary Dependencies**: None new beyond `@pathable/styles` own dependencies — composes existing public CSS classes only

**Storage**: N/A — CSS-only feature; no data storage

**Testing**: Storybook a11y addon (axe-core); manual review at 200% zoom, reduced motion, forced-colors mode; visual regression via existing project infrastructure

**Target Platform**: Web browsers (HTML/CSS rendering)

**Project Type**: Design-system SCSS library — Storybook documentation addition

**Performance Goals**: N/A — static CSS patterns with no runtime JavaScript

**Constraints**: All decorative motion must be optional; static accessible presentation is the default; `prefers-reduced-motion` must be respected; forced-colors mode must be supported or have documented fallback; no raw hex colors, arbitrary spacing, or one-off custom CSS

**Scale/Scope**: 4 new Storybook story files (each with mobile + desktop exports) + quickstart documentation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Notes |
|-----------|-------|-------|
| I. CSS Custom Properties Are the Runtime Contract | ✅ PASS | Compositions consume existing custom properties via public CSS classes; no new properties defined |
| II. SCSS Is an Authoring and Extension Layer | ✅ PASS | No new SCSS authored — compositions use existing compiled CSS output |
| III. pnpm Workspaces Structure the Repository | ✅ PASS | All additions within `packages/styles/` |
| IV. First Implementation Slice Is Narrow | ✅ PASS | Within-scope additions only; composes patterns from prior slices |
| V. Published Artifacts Must Be Reliable | ✅ PASS | Build via existing `pnpm build` pipeline; no build changes needed |
| VI. Token Naming Must Be Semantic and Stable | ✅ PASS | Compositions consume existing tokens; no new token definitions |
| VII. Design Source Alignment Matters | ✅ PASS | Compositions use existing USWDS-based tokens; no design-source conflicts |
| VIII. Accessibility Is Part of Token Quality | ✅ PASS | All compositions enforce accessibility: keyboard navigation, contrast, reduced-motion, forced-colors support |
| IX. Framework Independence Comes First | ✅ PASS | Pure CSS/HTML compositions in CSF 3 with string-template render functions |
| X. Documentation Is a First-Class Package Concern | ✅ PASS | Storybook stories serve as documentation per existing pattern; quickstart guide added |
| XI. Versioning and Release Discipline | ✅ PASS | Minor additions to existing package; no breaking changes |
| Change Scope Granularity (R/M/U/O) | ✅ PASS | U-level design objects map to Storybook story files |
| Architecture SSOT Boundary | ✅ PASS | All architecture decisions recorded in research.md and data-model.md |

**Result**: All gates pass. No complexity justification needed.

## Project Structure

### Documentation (this feature)

```text
specs/028-page-composition-archetypes/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output — resolved all unknowns
├── data-model.md        # Phase 1 output — composition structure model
├── quickstart.md        # Phase 1 output — archetype selection guide
├── contracts/           # Phase 1 output — public CSS class API contract
│   └── index.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/styles/src/stories/
└── marketing-patterns/
    ├── MarketingLandingPage.stories.js   # [CREATE] Landing page composition
    ├── ResourceDirectory.stories.js      # [CREATE] Resource directory composition
    ├── OperationalDashboard.stories.js   # [CREATE] Operational dashboard composition
    └── StructuredWorkflow.stories.js     # [CREATE] Structured workflow composition
```

**Structure Decision**: Stories live in the existing `marketing-patterns/` subdirectory under `stories/`, alongside the existing pattern stories (BentoGrid, ChipRail, DecorativeBackground, ScreenshotFrame, TextHighlight, Combined). No new SCSS files needed — all required public classes already exist. No bundle or import file modifications needed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations found. This section is intentionally blank.

## Design Artifacts

- Data model: `./data-model.md`
- Interface contracts: `./contracts/`
- Validation path: `./quickstart.md`

## Visual fidelity navigation

- Visual validation decisions: `./research.md`
- Visual proof execution: `./quickstart.md`