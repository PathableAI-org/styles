# Implementation Plan: Brand Color Fidelity & Token Architecture

**Branch**: `010-brand-color-fidelity` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/home/jake/PathableAI/styles/specs/010-brand-color-fidelity/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)
- [Phase 0: Research & Unknowns](#phase-0-research--unknowns)
- [Phase 1: Design & Artifacts](#phase-1-design--artifacts)

## Summary

This feature addresses three areas identified in the FEEDBACK.md assessment of the design system's brand fidelity as of spec 009:

1. **Brand Color Fidelity** — Emit exact brand hex values as `--pathable-brand-*` CSS custom properties alongside the existing USWDS-mapped `--pathable-*` tokens, making the perceptual difference (ΔE) between brand and mapped values explicit in the compiled CSS.

2. **Token Architecture Expansion** — Add 10+ new semantic color tokens covering action roles (`--pathable-color-action-primary-*`, `--pathable-color-action-secondary-*`), status roles (`--pathable-color-status-*-*`), and workflow states (`--pathable-color-workflow-*`), providing a foundation for workflow-first UI components without hardcoding colors.

3. **Brand / Color Usage Storybook Page** — Create a new Storybook documentation page under a "Brand" section that surfaces exact brand colors, USWDS mapping with ΔE, expanded semantic tokens, approved pairings, and failed "do not use" pairings with contrast warnings.

## Technical Context

**Language/Version**: SCSS via Dart Sass (`sass` ^1.86.3), JavaScript (ES module) for Storybook stories

**Primary Dependencies**: `@uswds/uswds` (USWDS token mapping), `sass` (SCSS compilation), `@storybook/html-vite` (Storybook framework)

**Storage**: N/A — no runtime data storage; all changes are build-time SCSS compilation and static documentation

**Testing**: Build verification (`pnpm build` in `packages/styles`), visual inspection in Storybook dev server (`pnpm docs`), CSS custom property inspection in compiled output

**Target Platform**: Browser (CSS custom properties emitted in `dist/styles.css`); Storybook dev server (localhost:6006) and static build

**Project Type**: Design token/SCSS package (`packages/styles`) + Storybook documentation page

**Performance Goals**: No specific performance targets — token additions are pure CSS custom properties with negligible runtime cost

**Constraints**:
- All existing semantic tokens (`--pathable-color-bg`, `--pathable-color-surface`, `--pathable-color-text`, etc.) MUST retain their names and values (backward compatibility)
- Brand color name aliases (e.g., `--pathable-blue`, `--intelligent-jade`) MUST be preserved
- The `_colors.scss` and `_semantic.scss` file structure MUST be preserved — new tokens added to existing files
- Brand color names (Intelligent Jade, PathAble Blue, etc.) MUST be preserved in all documentation
- New semantic tokens MUST use the existing USWDS-mapped color values, not exact brand hex values
- The Storybook page MUST follow the existing HTML story format (`.stories.js`)

**Scale/Scope**: 3 source files modified (2 SCSS + 1 Storybook), ~13 new CSS custom properties, 1 new Storybook documentation page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle Review

| Principle | Relevance | Assessment |
|-----------|-----------|------------|
| I. CSS Custom Properties Are the Runtime Contract | **High** | This feature directly adds new CSS custom properties (`--pathable-brand-*`, `--pathable-color-action-*`, `--pathable-color-status-*`, `--pathable-color-workflow-*`). All new tokens are emitted as CSS variables in the published `dist` output. ✅ |
| II. SCSS Is an Authoring and Extension Layer | **High** | New tokens are added to existing SCSS partials (`_colors.scss`, `_semantic.scss`). Every Sass variable produces a corresponding CSS custom property. ✅ |
| III. pnpm Workspaces Structure the Repository | Low | No workspace structure changes. |
| IV. First Implementation Slice Is Narrow | Low | Not the first implementation slice. |
| V. Published Artifacts Must Be Reliable | **Medium** | Token additions are minor (non-breaking). Build output (`dist/styles.css`) must be verified after changes. ✅ |
| VI. Token Naming Must Be Semantic and Stable | **High** | New tokens follow the established `--pathable-color-{category}-{role}-{property}` semantic convention. Brand fidelity tokens use `--pathable-brand-{name}` to clearly distinguish from USWDS-mapped tokens. ✅ |
| VII. Design Source Alignment Matters | **Medium** | Exact brand hex values must match the brand book. The FEEDBACK.md identifies this as a gap. The `--pathable-brand-*` namespace makes the exact values available while preserving the USWDS-mapped values for application consumption. ✅ |
| VIII. Accessibility Is Part of Token Quality | **High** | New status and workflow tokens must be paired with appropriate contrast. The Brand / Color Usage page documents contrast warnings for problematic pairings. ✅ |
| IX. Framework Independence Comes First | **Medium** | Token changes are framework-independent (pure CSS custom properties). The Storybook page is a documentation concern, not a framework dependency. ✅ |
| X. Documentation Is a First-Class Package Concern | **Medium** | The Brand / Color Usage page advances documentation coverage. ✅ |
| XI. Versioning and Release Discipline | **Medium** | Token additions are minor changes. Brand value fixes (same name, corrected hex) may be patch changes. ✅ |

### Stack & Dependency Constraint Check

| Constraint | Status |
|------------|--------|
| pnpm as package manager | ✅ Followed — no changes to workspace structure |
| Dart Sass via `sass` npm package | ✅ Unchanged — `sass` ^1.86.3 remains in `packages/styles` |
| Zero runtime dependencies | ✅ New tokens are pure CSS custom properties; no runtime dependencies added |
| Node version range declared | ✅ No changes needed |

### R/M/U/O Scope

- **M** (Module): `packages/styles` SCSS source — the brand color and semantic token definitions
- **U** (Unit): `_colors.scss` (brand color tokens), `_semantic.scss` (semantic tokens), Brand / Color Usage Storybook page
- **O** (Operation): Exact hex values, CSS custom property names, token values, Storybook HTML content

### Gate Decision: PASS

No constitution violations. The feature aligns with the CSS custom properties contract (Principle I), follows semantic naming conventions (Principle VI), supports accessibility concerns (Principle VIII), and remains framework-independent (Principle IX).

### Post-Design Re-Evaluation: PASS

All Phase 1 design artifacts (research.md, data-model.md, contracts/contracts.md, quickstart.md) have been generated and comply with the constitution:

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. CSS Custom Properties Are the Runtime Contract | ✅ | All new tokens emit CSS custom properties in `:root` blocks |
| II. SCSS Is an Authoring and Extension Layer | ✅ | SCSS variables in `_colors.scss` and `_semantic.scss` produce corresponding CSS custom properties |
| III. pnpm Workspaces | ✅ | No workspace structure changes |
| V. Published Artifacts Must Be Reliable | ✅ | Token additions are non-breaking; build verification documented in quickstart.md |
| VI. Token Naming Must Be Semantic and Stable | ✅ | `--pathable-brand-*`, `--pathable-color-action-*`, `--pathable-color-status-*`, `--pathable-color-workflow-*` follow semantic convention |
| VII. Design Source Alignment Matters | ✅ | Exact brand hex values match BRAND_RULES.md; USWDS mapping tradeoff documented |
| VIII. Accessibility Is Part of Token Quality | ✅ | All text token pairs verified for WCAG AA contrast compliance in research.md |
| IX. Framework Independence Comes First | ✅ | Pure CSS custom properties; no framework dependency |
| X. Documentation Is a First-Class Package Concern | ✅ | Brand / Color Usage Storybook page planned |
| XI. Versioning and Release Discipline | ✅ | Token additions are minor changes; backward compatible |

## Project Structure

### Documentation (this feature)

```text
specs/010-brand-color-fidelity/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
packages/styles/src/
├── _colors.scss                  # Modified: add --pathable-brand-* exact hex values
├── _semantic.scss                # Modified: add action, status, workflow tokens
└── stories/
    ├── brand/                    # NEW: Brand documentation section
    │   └── ColorUsage.stories.js # NEW: Brand / Color Usage page
    ├── components/...            # Unchanged
    └── utilities/...             # Unchanged
```

**Structure Decision**: The Storybook "Brand" section is a new directory at `packages/styles/src/stories/brand/`, following the existing section-based organization (components/, utilities/). The Brand / Color Usage page is a single `.stories.js` file, following the existing HTML story pattern. Token changes are additive to existing SCSS files.

## Complexity Tracking

No constitution violations to justify. The feature is additive and backward-compatible.

## Phase 0: Research & Unknowns

The spec has no [NEEDS CLARIFICATION] markers. However, the following unknowns should be resolved through research:

1. What exact hex values should be used for each new semantic token? The spec defines token names and categories but not specific color values for each new token.
2. What are the contrast ratios for the problematic brand pairings (Intelligent Jade on white, Bright Blue Brooks on white, Lived-In Lime on light backgrounds)?
3. What is the best approach for the Storybook Brand / Color Usage page — inline HTML in the story file, or a separate HTML template?

### Research Output

See [research.md](./research.md) for consolidated findings.

## Phase 1: Design & Artifacts

### Data Model

See [data-model.md](./data-model.md) for the token data model.

### Quickstart

See [quickstart.md](./quickstart.md) for getting started guide.

### Contracts

The contracts directory contains:
- CSS custom property naming conventions and patterns
- Contrast ratio documentation for approved and failed pairings
- Token value assignments for all new semantic tokens

See [contracts/](./contracts/) for details.

### Agent Context Update

After Phase 1 design artifacts are generated, the agent context script will be executed to reference the new plan.