# Implementation Plan: USWDS Typography Settings

**Branch**: `005-typography-settings` | **Date**: 2026-07-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-typography-settings/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

The `@pathable/styles` package has existing typography tokens (`$pathable-font-*` SCSS variables and `--pathable-font-*` CSS custom properties) in `_typography.scss` with hardcoded font stacks. The color settings (003-wrap-uswds-theme) already configured USWDS `$theme-color-*` tokens. This feature adds a typography settings layer that configures USWDS `$theme-font-*`, type scale, and font weight tokens with values derived from the PathAble brand guide, then exposes dual `--pathable-font-*` and `--usa-font-*` CSS custom properties so consumers can reference typography values under either naming convention.

## Technical Context

**Language/Version**: SCSS via Dart Sass (`sass` ^1.86.3 already in use), USWDS v3.x (already a dependency from 003-wrap-uswds-theme)

**Primary Dependencies**:
- `uswds` v3.x (existing runtime dependency from color settings work)
- `sass` (existing dev dependency)

**Storage**: N/A — design token package, no runtime data storage

**Testing**: Manual visual verification via USWDS component rendering; font rendering verified by inspecting computed styles in browser DevTools.

**Target Platform**: Web browsers — compiled CSS consumed by any modern browser

**Project Type**: SCSS design token library wrapping a government design system

**Performance Goals**: Minimal compiled output increase (~5-15KB for @font-face rules and type scale variables)

**Constraints**:
- Compiled `dist/styles.css` MUST NOT include USWDS component styles (only token configurations)
- Zero additional runtime JS dependencies
- Existing `$pathable-font-*` and `--pathable-font-*` public API MUST remain backward compatible
- USWDS v3.x already installed as a dependency — no new npm packages needed

**Scale/Scope**: Single package (`packages/styles`) in a pnpm monorepo, extending the existing `_uswds-theme.scss` pattern with typography overrides

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Applicable Principles

| Principle | Relevance | Compliance |
|-----------|-----------|------------|
| **I. CSS Custom Properties Are the Runtime Contract** | FR-008 requires dual `--pathable-font-*` and `--usa-font-*` CSS custom properties. USWDS typography tokens are SCSS variables resolved at compile time. | ✅ COMPLIANT — FR-008 explicitly requires the CSS custom properties as the runtime contract. Both naming conventions satisfy Principle I. |
| **II. SCSS Is an Authoring and Extension Layer** | USWDS `$theme-font-*` tokens are SCSS variables that do not emit `--theme-font-*` CSS custom properties. | ✅ COMPLIANT — The dual `--pathable-font-*` / `--usa-font-*` custom properties provide the runtime CSS contract. SCSS is used as the authoring layer to generate these. |
| **III. pnpm Workspaces** | Changes scoped to `packages/styles`. | ✅ COMPLIANT |
| **V. Published Artifacts Must Be Reliable** | `dist/styles.css` will include @font-face rules, USWDS typography tokens, and the dual CSS custom properties. | ✅ COMPLIANT |
| **VI. Token Naming Must Be Semantic and Stable** | `--pathable-font-heading`, `--usa-font-body`, etc. are semantic and follow established conventions. | ✅ COMPLIANT |
| **VIII. Accessibility Is Part of Token Quality** | `$theme-respect-user-font-size` remains `true` (respects browser font size preferences). Readable fallback stacks are defined. | ✅ COMPLIANT |
| **IX. Framework Independence** | No application framework dependency added. | ✅ COMPLIANT |
| **X. Documentation Is a First-Class Package Concern** | quickstart.md will document the dual variable naming, font self-hosting setup, and verification steps. | ✅ COMPLIANT |
| **XI. Versioning and Release Discipline** | New tokens are additive (minor version bump). Existing tokens preserved. | ✅ COMPLIANT |

### Gate Evaluation

| Gate | Status |
|------|--------|
| No unjustified constitution violations | ✅ All principles in compliance — see table above |
| All [NEEDS CLARIFICATION] markers resolved | ✅ No markers in spec |
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
specs/005-typography-settings/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 — USWDS typography setting mappings
├── data-model.md        # Phase 1 — entity model for typography tokens
├── quickstart.md        # Phase 1 — setup and usage guide
├── contracts/
│   └── scss-interface.md # SCSS interface contracts for typography
└── tasks.md             # Phase 2 (/speckit-tasks output - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/styles/
├── package.json              # Unchanged (USWDS already a dependency)
├── AGENTS.md                 # Update with typography token rules and dual naming convention
├── BRAND_RULES.md            # Update with USWDS typography token references
├── src/
│   ├── index.scss            # Add @use of new typography settings partial
│   ├── _uswds-theme.scss     # UPDATE: add typography overrides alongside existing color overrides (OR)
│   ├── _uswds-theme-typography.scss  # NEW: separate typography settings partial
│   ├── _typography.scss      # UPDATE: add --usa-font-* aliases; optionally alias SCSS vars to USWDS tokens
│   ├── _colors.scss          # Unchanged
│   ├── _semantic.scss        # Unchanged
│   ├── _spacing.scss         # Unchanged
│   ├── _elevation.scss       # Unchanged
│   └── _radius.scss          # Unchanged
└── dist/
    └── styles.css            # Rebuilt output
```

**Structure Decision**: Existing monorepo structure preserved. Typography theme overrides will be added to `_uswds-theme.scss` (keeping all USWDS `@use ... with` configuration in a single file) or placed in a new `_uswds-theme-typography.scss` partial if the file becomes unwieldy. The choice will be made in Phase 0 research based on USWDS SCSS architecture constraints. `_typography.scss` will be updated to add `--usa-font-*` CSS custom property aliases that reference the same values as the existing `--pathable-font-*` variables.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Dual `--pathable-font-*` / `--usa-font-*` custom properties (Principle I/VI) require maintaining two sets of CSS variable names for the same values | Dual naming supports both PathAble consumers (using `--pathable-*`) and USWDS-native consumers (using `--usa-*`). The values are the same — only the names differ. | Single namespace would be simpler but would force consumers to choose between PathAble and USWDS naming conventions. The dual approach makes the package usable by both audiences without translation. |

## Phase 0: Research & Discovery

### Research Task R1: PathAble Brand Font Family → USWDS Role Mapping

Map each PathAble brand typeface to its closest USWDS family token and determine the correct custom source configuration:

| Brand Font | Weight | USWDS Role | Custom Font Stack Config Required? |
|---|---|---|---|
| Fredoka | Regular (400) | heading | Yes — not a built-in USWDS font |
| Montserrat | Bold (700) | alt | Yes — not a built-in USWDS font |
| Poppins | Bold (700) | _(subheading — may map to ui or alt role)_ | Yes — not a built-in USWDS font |
| Nunito | Regular (400), SemiBold (600) | body, ui | Yes — not a built-in USWDS font |
| ui-monospace, SFMono, etc. | — | code | No — falls back to USWDS Mono |

Determine:
- How to register custom typeface tokens via `$theme-typeface-tokens`
- How to configure `$theme-font-*-custom-src` for @font-face generation
- Whether Fredoka, Nunito, Montserrat, and Poppins can share a single `sans` family typeface token or need separate custom tokens

### Research Task R2: USWDS Type Scale to PathAble Scale Mapping

Determine the closest USWDS type scale token (`$theme-type-scale-*`) for each PathAble size:

| PathAble Token | Size | Closest USWDS Scale Token | USWDS px Equivalent |
|---|---|---|---|
| display-lg | 32px | TBD | TBD |
| heading-lg | 24px | TBD | TBD |
| heading-md | 20px | TBD | TBD |
| heading-sm / body-lg | 18px | TBD | TBD |
| body-md | 16px | TBD | TBD |
| body-sm / label-md | 14px | TBD | TBD |
| label-sm / caption-md | 12px | TBD | TBD |

Also map line-height values:
| PathAble Context | Line-Height | Closest USWDS Line-Height Token |
|---|---|---|
| display (32px) | 40px (1.25) | TBD |
| heading-lg (24px) | 32px (1.333) | TBD |
| body-lg (18px) | 28px (1.555) | TBD |
| body-md (16px) | 24px (1.5) | TBD |
| body-sm (14px) | 20px (1.428) | TBD |

### Research Task R3: USWDS Font Weight Token Configuration

Determine available USWDS weight tokens and whether custom weights need to be added:

| Brand Font | Required Weights | USWDS Weight Token | Custom? |
|---|---|---|---|
| Fredoka | 400 (Regular) | `$theme-font-weight-normal` | No — 400 is standard |
| Nunito | 400 (Regular) | `$theme-font-weight-normal` | No |
| Nunito | 600 (SemiBold) for labels | `$theme-font-weight-semibold` or custom | TBD |
| Poppins | 700 (Bold) | `$theme-font-weight-bold` | No |
| Montserrat | 700 (Bold) | `$theme-font-weight-bold` | No |

### Research Task R4: CSS Custom Property Duplication Strategy

Determine the best approach to emitting dual `--pathable-font-*` and `--usa-font-*` CSS custom properties:
- Option A: Duplicate declarations in `_typography.scss` (one set for `--pathable-*`, one for `--usa-*`)
- Option B: Use SCSS @each loop over a combined map to emit both sets
- Option C: `@extend` or `//# sourceMappingURL` approach

## Phase 1: Design & Contracts

### Prerequisites: research.md complete

#### 1. data-model.md

Formal entity definitions for:
- `BrandTypeface` — name, weight variants, USWDS family token assignment, custom source config
- `RoleFontToken` — role name (heading/body/ui/code/alt), backreference to BrandTypeface
- `TypeScaleMapping` — size name, px value, closest USWDS type-scale token
- `FontWeightMapping` — role context, weight name, numeric value, USWDS weight token
- `TypographyCustomProperty` — pathable name, usa name, resolved value

#### 2. contracts/scss-interface.md

SCSS interface contract defining:
- What the typography settings in `_uswds-theme.scss` configure
- How `_typography.scss` exports the dual CSS custom properties
- The guaranteed public API (`$pathable-font-*`, `--pathable-font-*`, `--usa-font-*` tokens)
- Relationship to existing `$pathable-font-*` variables

#### 3. quickstart.md

Usage guide covering:
- Font self-hosting: where to place font files and how to configure `$theme-font-path`
- Basic CSS import usage with `--pathable-font-*` and `--usa-font-*` examples
- SCSS customization path for advanced consumers
- Verifying typography output in compiled CSS

#### 4. Agent Context Update

Run agent context update script to register USWDS typography token knowledge and dual naming convention.

### Post-Design Constitution Re-Check

*After Phase 1 artifacts are generated, verify:*
- [ ] No design decision contradicts ratified principles
- [ ] data-model.md does not duplicate constitution text
- [ ] contracts/scss-interface.md complies with SCSS-as-authoring-layer principle
- [ ] Complexity Tracking justifications remain valid