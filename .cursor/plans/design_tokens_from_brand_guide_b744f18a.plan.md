---
name: Design tokens from brand guide
overview: Create a feature specification for adding PathAble brand design tokens to the styles package
todos:
  - id: speckit-specify
    content: "Run speckit.specify workflow: create feature branch (+ short-name 'brand-design-tokens'), write spec to .specify/features/###-brand-design-tokens/spec.md"
    status: completed
isProject: false
---

# Plan: Design Token Specification (Step 1 only)

## Overview

Run the `/speckit.specify` workflow to create a feature branch and write a specification for adding the PathAble brand design tokens — extracted from the 2026 Brand Book (PDF) and the Figma "PathAble Design System" foundations page — to the `@pathable/styles` package.

This plan covers only Step 1 (the specification phase). Implementation, build, and commit are deferred.

## Data Extracted from Sources

### From Brand Book (PDF) and Figma — Brand Colors (Confirmed)

| Name | Hex | RGB | Pantone |
|------|-----|-----|---------|
| Intelligent Jade | `#1cae96` | (28, 174, 150) | 3272 C |
| PathAble Blue | `#00365c` | (0, 54, 92) | 541 C |
| Bright Blue Brooks | `#4899e8` | (72, 153, 232) | 2727 C |
| Tech Teal | `#015a76` | (1, 90, 118) | 3025 C |
| Lived-In Lime | `#d3ff66` | (211, 255, 102) | 388 C |
| Shilling Silver | `#dde2e8` | (221, 226, 232) | 656 C |

### From Brand Book — Typography

| Role | Font | Weight |
|------|------|--------|
| Headings | Fredoka | Regular |
| Alternative Headings | Poppins | Bold |
| Subheadings | Montserrat | Bold |
| Body Text | Nunito | Regular |

### From Figma (node `26:2`) — Semantic Token Categories

`color/bg/default`, `color/bg/card`, `color/bg/muted`, `color/text/primary`, `color/text/muted`, `color/action/primary`, `color/action/accent`, `color/action/link`, `color/border/default`, `color/feedback/destructive`, `color/feedback/success`, `color/brand/primary`

### From Figma (node `26:93`) — Elevation

`elevation/sm`, `elevation/md`, `elevation/lg`, `elevation/xl`

### From Figma (node `26:105`) — Spacing Scale

`space/4` (4px), `space/8` (8px), `space/12` (12px), `space/16` (16px), `space/24` (24px), `space/32` (32px), `space/48` (48px)

### From Figma (node `26:129`) — Typography Scale

`ui/display/lg`, `ui/heading/lg`/`md`/`sm`, `ui/body/lg`/`md`/`sm`, `ui/label/md`/`sm`, `ui/caption/md`

## Existing Codebase State

- **Package**: `packages/styles` (`@pathable/styles`) — currently 4 placeholder SCSS variables and 2 sample components
- **Constitution**: References `packages/design-tokens` (name mismatch with actual `packages/styles`)
- **Stack**: SCSS-only (Dart Sass), zero runtime dependencies, pnpm monorepo
- **Init options**: sequential branch numbering, no timestamp

## Execution Step

### 1. Run `/speckit.specify` to create the feature specification

1. Generate short name: `brand-design-tokens`
2. Run `.specify/scripts/bash/create-new-feature.sh "$ARGUMENTS" --json --short-name "brand-design-tokens" "Add PathAble brand design tokens to the styles package"`
3. Load `.specify/templates/spec-template.md` for the spec structure
4. Write the specification to the `SPEC_FILE` path returned by the script, covering:
   - **User Stories**:
     - P1: Developer imports `@pathable/styles` and gets all brand color, typography, spacing, elevation, and border-radius tokens as CSS custom properties
     - P2: Developer references semantic color tokens for light-mode UI
     - P3: Developer uses SCSS variables and maps from the package for advanced customization
   - **Requirements**:
     - FR-001: Export CSS custom properties for all 6 brand colors
     - FR-002: Export CSS custom properties for 12 semantic color tokens (light mode)
     - FR-003: Export CSS custom properties for font families + typography scale
     - FR-004: Export CSS custom properties for spacing scale (7 values)
     - FR-005: Export CSS custom properties for elevation (4 levels)
     - FR-006: Export CSS custom properties for border-radius
     - FR-007: SCSS source modularized with partials per token category
     - FR-008: Build compiles successfully to `dist/styles.css`
   - **Success Criteria**: All tokens compile, package is importable, CI passes
5. Generate the spec quality checklist at `FEATURE_DIR/checklists/requirements.md`
6. Validate the spec against the checklist; resolve any issues (max 3 `[NEEDS CLARIFICATION]` markers if needed)
7. Report completion with branch name and spec file path

## Key Decisions / Assumptions

- **Package name**: Use `packages/styles` (existing name), not `packages/design-tokens`
- **Dark mode**: V1 spec covers light-mode only; dark-mode swatches exist in Figma but will be marked as future scope
- **Typography exact sizes**: Will note in spec that precise font-size/line-height values need confirmation from Figma text layer properties
- **Elevation values**: Spec will use generic levels (sm/md/lg/xl) without prescribing exact box-shadow values
- The script will be run with `--json` flag for parseable output and **no** `--number` flag (auto-detected)