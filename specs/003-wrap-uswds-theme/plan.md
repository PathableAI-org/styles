# Implementation Plan: USWDS Theme Wrapper

**Branch**: `003-wrap-uswds-theme` | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-wrap-uswds-theme/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

The `@pathable/styles` package currently defines 6 brand colors and 10 semantic tokens as SCSS variables and CSS custom properties with hardcoded hex values. This feature adds USWDS v3.x as a dependency, creates a USWDS theme settings file that configures all 5 USWDS theme color families (base, primary, secondary, accent-warm, accent-cool) with USWDS system tokens corresponding to PathAble brand colors, and rewrites existing `_colors.scss` brand color variables to alias USWDS `$theme-color-*` variables. The compiled output remains tokens-only (no USWDS component styles).

## Technical Context

**Language/Version**: SCSS via Dart Sass (`sass` ^1.86.3 already in use), USWDS v3.x (latest stable)

**Primary Dependencies**:
- `uswds` v3.x (new runtime dependency)
- `sass` (existing dev dependency)

**Storage**: N/A — design token package, no runtime data storage

**Testing**: Manual visual verification via USWDS component rendering; contrast verification via USWDS built-in grade system. No formal visual regression testing.

**Target Platform**: Web browsers — compiled CSS consumed by any modern browser

**Project Type**: SCSS design token library wrapping a government design system

**Performance Goals**: Minimal compiled output increase (~50-100KB from USWDS system tokens only)

**Constraints**:
- Compiled `dist/styles.css` MUST NOT include USWDS component styles
- Zero additional runtime JS dependencies
- Existing `$pathable-*` and `--pathable-*` public API MUST remain backward compatible
- Dart Sass requirement already met (^1.86.3 > USWDS v3.x minimum of 1.42.1)

**Scale/Scope**: Single package (`packages/styles`) in a pnpm monorepo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Applicable Principles

| Principle | Relevance | Compliance |
|-----------|-----------|------------|
| **I. CSS Custom Properties Are the Runtime Contract** | The package's public contract is compiled CSS. USWDS theme tokens are SCSS variables ($-prefixed) resolved at compile time, not CSS custom properties. | ✅ COMPLIANT — `--pathable-*` custom properties preserved. USWDS tokens are internal SCSS config baked into compiled values. |
| **II. SCSS Is an Authoring and Extension Layer** | USWDS theme tokens ($theme-color-*) do not emit `--theme-color-*` CSS custom properties. | ⚠️ Documented in Complexity Tracking — acceptable because the `--pathable-*` CSS custom property contract is preserved. |
| **III. pnpm Workspaces** | USWDS added as a dependency of `packages/styles`. | ✅ COMPLIANT |
| **V. Published Artifacts Must Be Reliable** | `dist/styles.css` must include USWDS token output. | ✅ COMPLIANT |
| **VIII. Accessibility Is Part of Token Quality** | USWDS's grade-based contrast system improves accessibility. | ✅ COMPLIANT |
| **IX. Framework Independence** | USWDS is a CSS framework, not an app framework. | ✅ COMPLIANT |
| **XI. Versioning and Release Discipline** | Changing `$pathable-*` from hardcoded hex to aliases may shift values slightly. | ⚠️ Documented in Complexity Tracking — close mapping and documentation mitigates this. |

### Gate Evaluation

| Gate | Status |
|------|--------|
| No unjustified constitution violations | ⚠️ Two potential violations — see Complexity Tracking for justification |
| All [NEEDS CLARIFICATION] markers resolved | ✅ All 5 clarifications from `/speckit-clarify` resolved |
| Feature spec is internally consistent | ✅ Verified |
| Constitution read and checked | ✅ Loaded from `.specify/memory/constitution.md` |

**GATE PASSED** — proceed to Phase 0.

### Post-Design Re-Check

*Completed after Phase 1 artifacts generated.*

- [x] No design decision contradicts ratified principles
- [x] data-model.md does not duplicate constitution text
- [x] contracts/scss-interface.md complies with SCSS-as-authoring-layer principle
- [x] Complexity Tracking justifications remain valid

## Project Structure

### Documentation (this feature)

```text
specs/003-wrap-uswds-theme/
├── plan.md              # This file
├── spec.md              # Feature specification with 5 clarifications
├── research.md          # Phase 0 — USWDS system token mappings
├── data-model.md        # Phase 1 — entity model for color tokens
├── quickstart.md        # Phase 1 — setup and usage guide
├── contracts/
│   └── scss-interface.md # SCSS interface contracts
└── tasks.md             # Phase 2 (/speckit-tasks output)
```

### Source Code (repository root)

```text
packages/styles/
├── package.json              # Add "uswds" to dependencies
├── README.md                 # Update with USWDS integration docs
├── BRAND_RULES.md            # Update with USWDS token references
├── AGENTS.md                 # Update agent rules for USWDS tokens
├── src/
│   ├── index.scss            # Add @use 'uswds-core' with theme config
│   ├── _uswds-theme.scss     # NEW: USWDS theme token overrides
│   ├── _colors.scss          # UPDATE: alias $pathable-* to $theme-color-*
│   ├── _semantic.scss        # UPDATE: optionally alias to USWDS tokens
│   ├── _typography.scss      # Unchanged
│   ├── _spacing.scss         # Unchanged
│   ├── _elevation.scss       # Unchanged
│   └── _radius.scss          # Unchanged
└── dist/
    └── styles.css            # Rebuilt output
```

**Structure Decision**: Existing monorepo structure preserved. A single new `_uswds-theme.scss` partial in `src/` houses all USWDS `$theme-color-*` overrides. `index.scss` adds `@use 'uswds-core' with (...)` before forwarding existing partials.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| USWDS theme tokens ($theme-color-*) are SCSS variables, not CSS custom properties (Principle I/II) | USWDS uses SCSS variables for theme token configuration at compile time. The `--pathable-*` CSS custom property contract is preserved unchanged. | Forking USWDS to emit CSS custom properties is a maintenance burden. CSS output consumers get resolved color values; SCSS consumers can reference `$theme-color-*` directly. |
| Brand color values may shift when mapped to closest USWDS system tokens (Principle XI) | USWDS system tokens may not have exact hex matches. Minor perceptual differences (<5 delta E) are acceptable per spec Assumptions. | Keeping hardcoded hex values alongside USWDS tokens creates two diverging sources of truth. Documenting the delta in the settings file is the pragmatic approach. |

## Phase 0: Research & Discovery

### Research Task R1: Brand Color to USWDS System Token Mapping

Use the CivicActions USWDS Color Tool (https://civicactions.github.io/uswds-color-tool) to find the closest USWDS system token for each brand color:

| Brand Color | Hex | Target Theme Family | Closest USWDS System Token |
|-------------|-----|---------------------|---------------------------|
| PathAble Blue | `#00365c` | Primary | TBD |
| Intelligent Jade | `#1cae96` | Secondary | TBD |
| Bright Blue Brooks | `#4899e8` | Accent-cool | TBD |
| Lived-in Lime | `#d3ff66` | Accent-warm | TBD |
| Shilling Silver | `#dde2e8` | Base | TBD |
| Tech Teal | `#015a76` | (existing family grade) | TBD |

For each color, find the closest by hue/saturation/lightness in USWDS v3.x system palette. Identify appropriate lighter, darker, and vivid variants.

### Research Task R2: USWDS v3.x Theme Token Configuration API

Investigate the exact SCSS pattern for configuring theme tokens:

```scss
@use 'uswds-core' with (
  $theme-color-primary: 'blue-warm-60v',
  $theme-color-primary-dark: 'blue-warm-70v',
  // ...
);
```

Specific questions:
- How to set unused grades to `false`
- How to configure state tokens (`error`, `success`, etc.)
- Whether `@forward` works alongside `@use ... with`
- How to access `$theme-color-*` values in downstream SCSS for aliasing

### Research Task R3: Integration Pattern Verification

Verify:
- Dart Sass compatibility with USWDS v3.x `@use` syntax (confirmed: USWDS requires Dart Sass >=1.42.1, we have ^1.86.3)
- Whether `$pathable-blue: $theme-color-primary` resolves correctly when `$theme-color-primary` references a system token string (e.g., `"blue-warm-60v"`) resolved by USWDS's internal `color()` function
- Build order: theme config -> token definition -> aliased usage

### Research Task R4: Custom Settings File Architecture

Determine correct SCSS architecture:
- Should `@use 'uswds-core' with (...)` live in `index.scss` or a separate file?
- Does USWDS support `@use ... with` in a separate file forwarded to the main entrypoint?
- How to make theme token values accessible in other partials (`_colors.scss`, `_semantic.scss`)

## Phase 1: Design & Contracts

### Prerequisites: research.md complete

#### 1. data-model.md

Formal entity definitions for:
- `BrandColor` — hex, USWDS system token equivalent, theme family assignment
- `ThemeColorGrade` — grade name, USWDS system token, brand color
- `StateToken` — error, warning, success, info, disabled, visited
- `SemanticToken` — existing `$pathable-color-*` with alias status

#### 2. contracts/scss-interface.md

SCSS interface contract defining:
- What `_uswds-theme.scss` exports
- How `_colors.scss` consumes theme token values
- The guaranteed public API (`$pathable-*`, `--pathable-*` tokens)

#### 3. quickstart.md

Usage guide covering:
- Installation: `pnpm add @pathable/styles uswds`
- Basic compiled CSS import usage
- SCSS customization path
- Verifying brand color output

#### 4. Agent Context Update

Run agent context update script to register USWDS and new theme mapping knowledge.

### Post-Design Constitution Re-Check

*After Phase 1 artifacts are generated, verify:*
- [ ] No design decision contradicts ratified principles
- [ ] data-model.md does not duplicate constitution text
- [ ] contracts/scss-interface.md complies with SCSS-as-authoring-layer principle
- [ ] Complexity Tracking justifications remain valid
