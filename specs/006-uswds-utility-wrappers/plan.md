# Implementation Plan: USWDS Utility Wrappers

**Branch**: `006-uswds-utility-wrappers` | **Date**: 2026-07-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-uswds-utility-wrappers/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

The `@pathable/styles` package currently provides CSS custom properties (tokens) but no utility classes. This feature adds a SCSS-based utility layer that generates `.pathable-*` CSS utility classes wrapping USWDS utility module values — background-color, color, padding, margin, display, font-family, font-weight, border, border-radius, flex, align-items, justify-content, width, max-width, and text-align. Each utility value is also emitted as dual `--pathable-*` / `--usa-*` CSS custom properties. The `apps/docs` site is then refactored to replace ad-hoc CSS rules with these utility classes, reducing duplication and aligning with USWDS utility patterns.

## Technical Context

**Language/Version**: SCSS via Dart Sass (`sass` ^1.86.3 already in use), USWDS v3.x (already a dependency from 003-wrap-uswds-theme)

**Primary Dependencies**:

- `uswds` v3.x (existing runtime dependency, utility `@use` `uswds-core` with theme config already present)
- `sass` (existing dev dependency)

**Storage**: N/A — design token package, no runtime data storage

**Testing**: Manual visual verification via compiled CSS inspection; docs site visual regression check via before/after browser comparison.

**Target Platform**: Web browsers — compiled CSS consumed by any modern browser

**Project Type**: SCSS design token library wrapping a government design system, plus a docs site consuming the tokens

**Performance Goals**: Compiled utility output under 50 KB gzip added to the existing `dist/styles.css`. Each individual utility module's output should be no larger than what USWDS itself would generate for the same set of enabled tokens.

**Constraints**:

- Compiled `dist/styles.css` MUST continue to NOT include USWDS component styles (only token configurations and now utility classes)
- Zero additional runtime JS dependencies
- All existing `--pathable-*`, `--usa-*`, `--space-*`, `--elevation-*`, `--radius-*` CSS custom properties MUST remain backward compatible
- USWDS v3.x already installed — no new npm packages needed
- Utility classes MUST respect disabled theme tokens (e.g., if a color grade is set to `false`, corresponding utility classes are not generated)
- The docs site refactor must produce zero visual regressions

**Scale/Scope**: Two workspace packages — `packages/styles` (new `_utilities.scss` partial + `index.scss` forward) and `apps/docs` (refactor custom.css and component `<style>` blocks to use utility classes). The utility partial generates classes, not component styles.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Applicable Principles

| Principle | Relevance | Compliance |
| ----------- | ----------- | ------------ |
| **I. CSS Custom Properties Are the Runtime Contract** | The feature emits dual `--pathable-*` / `--usa-*` CSS custom properties alongside utility classes. | ✅ COMPLIANT — Both the utility classes and the dual CSS custom properties provide the runtime CSS contract. No SCSS dependency for consumers. |
| **II. SCSS Is an Authoring and Extension Layer** | Utility classes are generated via SCSS maps and loops in a dedicated partial. | ✅ COMPLIANT — SCSS is used only as the generation mechanism. The output is compiled CSS. |
| **III. pnpm Workspaces** | Changes scoped to `packages/styles` and `apps/docs`. | ✅ COMPLIANT |
| **V. Published Artifacts Must Be Reliable** | `dist/styles.css` will include generated utility classes and dual custom properties. Build verified via `pnpm build`. | ✅ COMPLIANT |
| **VI. Token Naming Must Be Semantic and Stable** | `.pathable-bg-primary`, `.pathable-padding-4`, etc. follow semantic naming. Dual `--pathable-bg-primary` / `--usa-bg-primary` custom properties preserve backward compatibility. | ✅ COMPLIANT |
| **VIII. Accessibility Is Part of Token Quality** | Color utility classes derive from accessible PathAble brand color values. Focus and hover state variants inherit accessible token values. | ✅ COMPLIANT |
| **IX. Framework Independence Comes First** | Utility classes are pure CSS — no framework dependency required. Both Astro docs site and plain HTML consumers can use them. | ✅ COMPLIANT |
| **X. Documentation Is a First-Class Package Concern** | quickstart.md will document utility class naming, the dual custom property conventions, and the docs refactoring guide. | ✅ COMPLIANT |
| **XI. Versioning and Release Discipline** | Utility additions are additive (minor version bump). All existing tokens preserved. | ✅ COMPLIANT |

### Gate Evaluation

| Gate | Status |
| ------ | -------- |
| No unjustified constitution violations | ✅ All principles in compliance — see table above |
| All [NEEDS CLARIFICATION] markers resolved | ✅ No markers in spec |
| Feature spec is internally consistent | ✅ Verified |
| Constitution read and checked | ✅ Loaded from `.specify/memory/constitution.md` |

**GATE PASSED** — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/006-uswds-utility-wrappers/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 — USWDS utility module research
├── data-model.md        # Phase 1 — entity model for utility wrappers
├── quickstart.md        # Phase 1 — setup and usage guide
├── contracts/
│   └── scss-interface.md # SCSS interface contracts for utility generation
└── tasks.md             # Phase 2 (/speckit-tasks output - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/styles/
├── package.json                  # Unchanged
├── AGENTS.md                     # Update with utility class naming rules
├── BRAND_RULES.md                # Update with utility class references
├── src/
│   ├── index.scss                # UPDATE: add @forward of new _utilities partial
│   ├── _uswds-theme.scss         # Unchanged (USWDS config already complete)
│   ├── _utilities.scss           # NEW: utility class generation partial
│   ├── _typography.scss          # Unchanged
│   ├── _colors.scss              # Unchanged
│   ├── _semantic.scss            # Unchanged
│   ├── _spacing.scss             # Unchanged
│   ├── _elevation.scss           # Unchanged
│   └── _radius.scss              # Unchanged
└── dist/
    └── styles.css                # Rebuilt output — now includes utility classes

apps/docs/
├── src/
│   ├── styles/
│   │   └── custom.css            # UPDATE: refactor to use utility classes
│   └── components/
│       ├── PageFrame.astro       # UPDATE: replace ad-hoc CSS with utility classes
│       ├── HorizontalNav.astro   # UPDATE: replace ad-hoc CSS with utility classes
│       ├── SkipNav.astro         # UPDATE: replace ad-hoc CSS with utility classes
│       └── DocFooter.astro       # UPDATE: replace ad-hoc CSS with utility classes
```

**Structure Decision**: Existing monorepo structure preserved. The new `_utilities.scss` partial is the sole source of utility class generation, following the same pattern as `_typography.scss` and other partials. Docs site refactoring replaces ad-hoc CSS with utility classes while preserving or eliminating component-level `<style>` blocks.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| ----------- | ------------ | ------------------------------------- |
| Dual naming (`.pathable-*` classes + `--pathable-*` / `--usa-*` custom properties) | Supports both utility-first consumers (using classes) and token-first consumers (using CSS custom properties), consistent with the existing typography dual-naming convention. | Single namespace would be simpler but would not support the dual PathAble/USWDS naming convention already established. |
| Utility generation loop over USWDS module maps | The utility classes need to resolve USWDS theme tokens (spacing, color, font tokens) to concrete values, which requires consuming USWDS SCSS functions within the generation logic. | Manually writing each utility class would be simpler but would not scale to 15+ modules and would diverge from the theme configuration. |
| Docs site refactoring spans 4-5 files | FR-005 requires 80% ad-hoc CSS replacement. Multiple component files need updates to avoid partial refactoring. | Refactoring only one file would leave 80% of ad-hoc CSS in place, failing the requirement. |

## Phase 0: Research & Discovery

The spec has no [NEEDS CLARIFICATION] markers and the technical context is well-understood from existing project knowledge. Research tasks focus on USWDS utility module integration specifics.

### Research Task R0-1: USWDS Utility Module SCSS API

Determine how to access USWDS utility module values from SCSS. Key questions:

- Does USWDS expose utility values via functions like `spacing(2)`, `color('primary')` that can be called from outside the utility module system?
- How does `uswds-core` expose spacing units, color values, and font tokens as SCSS functions?
- How do existing USWDS utility modules generate their classes internally?

**Approach**: Inspect the USWDS source in `node_modules/@uswds/uswds/packages/` to identify functions, mixins, or maps that can be reused by the PathAble utility wrapper partial without importing the full USWDS utility output.

### Research Task R0-2: Utility Class Naming Map

Map each required utility module (FR-001) to its USWDS class base and identify the PathAble prefix:

| USWDS Utility Module | USWDS Class Base | PathAble Class Base | Example PathAble Class |
| --------------------- | ------------------- | --------------------- | ---------------------- |
| background-color | `.bg-` | `.pathable-bg-` | `.pathable-bg-primary` |
| color | `.text-` | `.pathable-text-` | `.pathable-text-base` |
| padding | `.padding-` | `.pathable-padding-` | `.pathable-padding-4` |
| margin | `.margin-` | `.pathable-margin-` | `.pathable-margin-top-2` |
| display | `.display-` | `.pathable-display-` | `.pathable-display-flex` |
| font-family | `.font-family-` | `.pathable-font-family-` | `.pathable-font-family-heading` |
| font-weight | `.text-` | `.pathable-text-` | `.pathable-text-bold` |
| border | `.border-` | `.pathable-border-` | `.pathable-border-1` |
| border-radius | `.border-` | `.pathable-border-` | `.pathable-border-radius-sm` |
| flex | `.flex-` | `.pathable-flex-` | `.pathable-flex-1` |
| align-items | `.flex-` | `.pathable-flex-` | `.pathable-flex-align-center` |
| justify-content | `.flex-` | `.pathable-flex-` | `.pathable-flex-justify-center` |
| width | `.width-` | `.pathable-width-` | `.pathable-width-full` |
| max-width | `.maxw-` | `.pathable-maxw-` | `.pathable-maxw-mobile` |
| text-align | `.text-` | `.pathable-text-` | `.pathable-text-center` |

### Research Task R0-3: Value Token Resolution

Determine how each utility module resolves its values from the PathAble theme:

- Color utilities → resolve via `uswds.color('token-name')`
- Spacing utilities → resolve via `uswds.spacing('token-name')` or direct unit values
- Font utilities → resolve from `$theme-typeface-tokens` or compiled `--pathable-font-*` values
- Border utilities → resolve via USWDS border token functions

### Research Task R0-4: Responsive and State Variant Strategy

Research the USWDS responsive class naming convention (e.g., `.tablet:padding-2`) and state variants (e.g., `.hover:bg-primary`). Determine:

- Which breakpoints are enabled in the current theme config
- Which state variants are available for each utility module
- How to generate prefixed variants (e.g., `.tablet\:pathable-padding-2`)

### Research Task R0-5: Dual CSS Custom Property Emission Strategy

Determine the best approach for emitting dual `--pathable-*` / `--usa-*` CSS custom properties for utility values. Three options exist, matching the established typography pattern:

- Option A: Emit in `_utilities.scss` alongside utility class definitions
- Option B: Emit in a separate block within `_utilities.scss`
- Option C: Emit in the existing `:root` block via a shared map pattern

## Phase 1: Design & Contracts

### Prerequisites: research.md complete

#### 1. data-model.md

Formal entity definitions for:

- `UtilityModule` — name, USWDS class base, PathAble class prefix, value tokens, responsive/state settings
- `UtilityValueToken` — token name, resolved CSS value, USWDS function for resolution
- `DualCSSProperty` — `--pathable-{name}`, `--usa-{name}`, resolved value
- `ResponsiveBreakpoint` — breakpoint name, min-width in px, enabled/disabled state
- `StateVariant` — state name (hover/focus/active), CSS pseudo-class

#### 2. contracts/scss-interface.md

SCSS interface contract defining:

- What the `_utilities.scss` partial generates (utility classes + dual CSS custom properties)
- The SCSS pattern for adding a new utility module (map entry + loop pattern)
- The guaranteed public API (`.pathable-*` classes, `--pathable-*` / `--usa-*` custom properties)
- Relationship to existing `$pathable-*` and `--pathable-*` tokens
- How utility values resolve theme tokens

#### 3. quickstart.md

Usage guide covering:

- Basic CSS import usage with `.pathable-*` utility class examples
- Complete utility module reference table
- Responsive utility usage (e.g., `.tablet\:pathable-padding-4`)
- State variant usage (e.g., `.hover\:pathable-bg-primary`)
- SCSS customization path for advanced consumers
- Docs site refactoring guide (how to replace ad-hoc CSS with utility classes)
- Verifying utility output in compiled CSS

#### 4. Agent Context Update

Run agent context update script to register USWDS utility wrapper knowledge, naming conventions, and docs site refactoring patterns.

### Post-Design Constitution Re-Check

*Completed after Phase 1 artifacts generated.*

- [x] No design decision contradicts ratified principles
- [x] data-model.md does not duplicate constitution text
- [x] contracts/scss-interface.md complies with SCSS-as-authoring-layer principle
- [x] Complexity Tracking justifications remain valid
