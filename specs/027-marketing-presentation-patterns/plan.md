# Implementation Plan: Expressive Marketing and Product-Presentation Patterns

**Branch**: `027-marketing-presentation-patterns` | **Date**: 2026-07-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/027-marketing-presentation-patterns/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

Add five framework-neutral CSS compositions (decorative backgrounds, screenshot frames, bento grids, chip rails, and text highlights) and their Storybook documentation, enabling marketing staff to create polished, accessible public-facing pages without ad-hoc decorative CSS. Each composition follows existing project conventions: BEM naming, USWDS token consumption, dual `--pathable-*` / `--usa-*` custom properties, and selective import support.

## Technical Context

**Language/Version**: SCSS (Dart Sass via `sass` npm package)

**Primary Dependencies**: `@uswds/uswds` (USWDS token functions: `units()`, `type-scale()`, `color()`, `radius()`)

**Storage**: N/A — CSS-only feature; no data storage

**Testing**: Selective import compilation via `sass`; axe-playwright accessibility tests via Storybook test-runner

**Target Platform**: Web browsers (HTML/CSS rendering)

**Project Type**: Design-system SCSS library (part of `@pathable/styles` package)

**Performance Goals**: N/A — CSS patterns with no runtime JavaScript

**Constraints**: All decorative motion must be optional; static accessible presentation is the default; `prefers-reduced-motion` must be respected; forced-colors mode must be supported or have documented fallback

**Scale/Scope**: 5 new SCSS composition files + 5+ Storybook stories + bundle file + CSS custom properties + selective import tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Notes |
|-----------|-------|-------|
| I. CSS Custom Properties Are the Runtime Contract | ✅ PASS | New compositions will emit CSS-only output via SCSS compilation; no runtime dependencies |
| II. SCSS Is an Authoring and Extension Layer | ✅ PASS | Follows existing partial pattern with `@use 'uswds-core'` and BEM naming |
| III. pnpm Workspaces Structure the Repository | ✅ PASS | All additions within `packages/styles/` |
| IV. First Implementation Slice Is Narrow | ✅ PASS | Within-scope additions only; no framework components |
| V. Published Artifacts Must Be Reliable | ✅ PASS | Build via existing `pnpm build` pipeline |
| VI. Token Naming Must Be Semantic and Stable | ✅ PASS | Dual `--pathable-*` / `--usa-*` naming with semantic property names |
| VII. Design Source Alignment Matters | ✅ PASS | New compositions do not define base tokens; they consume existing USWDS tokens |
| VIII. Accessibility Is Part of Token Quality | ✅ PASS | All decorative patterns enforce accessibility: hidden from a11y tree, contrast-preserving, reduced-motion, forced-colors support |
| IX. Framework Independence Comes First | ✅ PASS | Pure CSS/HTML compositions; no framework-specific code |
| X. Documentation Is a First-Class Package Concern | ✅ PASS | Storybook stories serve as documentation per existing pattern |
| XI. Versioning and Release Discipline | ✅ PASS | Minor additions to existing package; no breaking changes |
| Change Scope Granularity (R/M/U/O) | ✅ PASS | U-level design objects map to concrete SCSS files |
| Architecture SSOT Boundary | ✅ PASS | All architecture decisions recorded in research.md and data-model.md |

**Result**: All gates pass. No complexity justification needed.

## Project Structure

### Documentation (this feature)

```text
specs/027-marketing-presentation-patterns/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── index.md         # Public CSS class + custom property contract
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/styles/src/
├── _components-custom-properties.scss   # [MODIFY] Add new CSS custom properties
├── pathable-component-wrappers/
│   ├── pathable-decorative-background.scss  # [CREATE] Decorative backgrounds
│   ├── pathable-screenshot-frame.scss       # [CREATE] Screenshot presentation frames
│   ├── pathable-bento-grid.scss             # [CREATE] Bento collection grid
│   ├── pathable-chip-rail.scss              # [CREATE] Chip rail with optional marquee
│   ├── pathable-text-highlight.scss         # [CREATE] Text highlight treatments
│   ├── pathable-marketing-patterns.scss     # [CREATE] Bundle file forwarding all five
│   └── pathable-all.scss                    # [MODIFY] Add new bundle forward
└── stories/
    └── marketing-patterns/
        ├── DecorativeBackground.stories.js  # [CREATE]
        ├── ScreenshotFrame.stories.js       # [CREATE]
        ├── BentoGrid.stories.js             # [CREATE]
        ├── ChipRail.stories.js              # [CREATE]
        ├── TextHighlight.stories.js         # [CREATE]
        └── Combined.stories.js              # [CREATE] Restraint/layering examples

packages/styles/test/
└── selective-import.scss  # [MODIFY] Add selective import test entries
```

**Structure Decision**: Single-package addition within existing `packages/styles/src/pathable-component-wrappers/` directory, following the established pattern for composition files. A new `marketing-patterns/` subdirectory under `stories/` groups all related stories. A new bundle file (`pathable-marketing-patterns.scss`) aggregates the five composition partials, following the pattern of `pathable-structured-workflow.scss`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations found. This section is intentionally blank.