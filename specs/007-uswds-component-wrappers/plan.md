# Implementation Plan: USWDS Component Wrappers

**Branch**: `007-uswds-component-wrappers` | **Date**: 2026-07-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-uswds-component-wrappers/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

The `@pathable/styles` package currently provides `.pathable-*` utility classes and dual `--pathable-*` / `--usa-*` CSS custom properties for USWDS theme tokens. This feature extends that dual-naming pattern to all USWDS components: each `.usa-{component}` class gains a `.pathable-{component}` equivalent, organized into a package system mirroring USWDS packages. Consumers can import individual component wrappers, bundle packages, or the full set. The `apps/docs` site is then refactored to replace `.usa-*` class references with `.pathable-*` equivalents wherever feasible.

The wrapping uses SCSS `@extend` — `.pathable-button { @extend .usa-button; }` — which produces minimal CSS output and guarantees 100% style fidelity. Each component is wrapped in a dedicated `_pathable-{component}.scss` partial, collected into a `pathable-component-wrappers/` directory with a SCSS package entry point structure.

## Technical Context

**Language/Version**: SCSS via Dart Sass (`sass` ^1.86.3), USWDS v3.x

**Primary Dependencies**:

- `uswds` v3.x (existing runtime dependency from 003-wrap-uswds-theme)
- `sass` (existing dev dependency)

**Storage**: N/A — design token and component package, no runtime data storage

**Testing**: Compiled CSS inspection for class generation; visual regression check on docs site pages using before/after browser comparison

**Target Platform**: Web browsers — compiled CSS consumed by any modern browser

**Target Project Type**: SCSS design token library wrapping USWDS components, plus a documentation site

**Performance Goals**: The all-components entry point adds under 100 KB gzip to `dist/styles.css` (matching USWDS all-components output efficiency). Individual component imports add under 20 KB gzip each.

**Constraints**:

- Compiled `dist/styles.css` MUST include only components that are explicitly @forwarded
- Zero additional runtime JS dependencies
- `.pathable-*` classes MUST resolve to the same computed styles as `.usa-*` equivalents
- USWDS JavaScript that references `.usa-*` classes internally must not break — the DOM still gets `.usa-*` classes on JS-driven components where JS selects by class
- All existing `--pathable-*`, `--usa-*`, `--space-*`, `--elevation-*`, `--radius-*` CSS custom properties MUST remain backward compatible
- Build command load path `--load-path=node_modules/@uswds/uswds/packages` already configured and sufficient
- Components disabled via theme configuration MUST NOT generate wrappers

**Scale/Scope**: Three workspace packages — `packages/styles` (new `pathable-component-wrappers/` directory + `index.scss` forwards), `apps/docs` (refactor `.usa-*` to `.pathable-*` in templates), and the component package entry points themselves

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Applicable Principles

| Principle | Relevance | Compliance |
| ----------- | ----------- | ------------ |
| **I. CSS Custom Properties Are the Runtime Contract** | The feature emits dual `--pathable-{component}-{property}` / `--usa-{component}-{property}` CSS custom properties alongside component classes. | ✅ COMPLIANT — Both the component classes and the dual CSS custom properties provide the runtime CSS contract. No SCSS dependency for consumers. |
| **II. SCSS Is an Authoring and Extension Layer** | Component wrappers are generated via SCSS `@extend` and `@forward` in dedicated partials. | ✅ COMPLIANT — SCSS is used only as the wrapping mechanism. The output is compiled CSS. |
| **III. pnpm Workspaces** | Changes scoped to `packages/styles` and `apps/docs`. | ✅ COMPLIANT |
| **V. Published Artifacts Must Be Reliable** | `dist/styles.css` will include generated component wrappers when forwarded. Build verifiable via `pnpm build`. | ✅ COMPLIANT |
| **VI. Token Naming Must Be Semantic and Stable** | `.pathable-button`, `.pathable-alert`, etc. follow semantic naming. Dual `--pathable-{component}-{property}` / `--usa-{component}-{property}` custom properties preserve backward compatibility. | ✅ COMPLIANT |
| **VIII. Accessibility Is Part of Token Quality** | Component wrappers inherit all USWDS accessibility behaviors since they compile from the same source. Color contrast, focus indicators, and state styles are preserved. | ✅ COMPLIANT |
| **IX. Framework Independence Comes First** | Component wrappers are pure CSS — no framework dependency required. Both Astro docs site and plain HTML consumers can use them. | ✅ COMPLIANT |
| **X. Documentation Is a First-Class Package Concern** | quickstart.md will document the package system, component naming convention, import patterns, and the docs refactoring guide. | ✅ COMPLIANT |
| **XI. Versioning and Release Discipline** | Component wrapper additions are additive (minor version bump). All existing tokens and utilities preserved. | ✅ COMPLIANT |

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
specs/007-uswds-component-wrappers/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 — USWDS component wrapping research
├── data-model.md        # Phase 1 — entity model for component wrappers
├── quickstart.md        # Phase 1 — setup and usage guide
├── contracts/
│   └── scss-interface.md # SCSS interface contracts for component package system
└── tasks.md             # Phase 2 (/speckit-tasks output - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/styles/
├── package.json                                           # Unchanged
├── AGENTS.md                                              # Update with component naming rules
├── BRAND_RULES.md                                         # Update with component class references
├── src/
│   ├── index.scss                                         # UPDATE: add component wrapper imports
│   ├── pathable-component-wrappers/                       # NEW: component wrapper partials directory
│   │   ├── _index.scss                                    # NEW: forwards all component packages (all-in-one entry)
│   │   ├── pathable-accordion.scss                        # NEW: .pathable-accordion wrapper
│   │   ├── pathable-alert.scss                            # NEW: .pathable-alert wrapper
│   │   ├── pathable-banner.scss                           # NEW: .pathable-banner wrapper
│   │   ├── pathable-breadcrumb.scss                       # NEW: .pathable-breadcrumb wrapper
│   │   ├── pathable-button.scss                           # NEW: .pathable-button wrapper
│   │   ├── pathable-button-group.scss                     # NEW: .pathable-button-group wrapper
│   │   ├── pathable-card.scss                             # NEW: .pathable-card wrapper
│   │   ├── pathable-footer.scss                           # NEW: .pathable-footer wrapper
│   │   ├── pathable-form.scss                             # NEW: .pathable-form wrapper
│   │   ├── pathable-header.scss                           # NEW: .pathable-header wrapper
│   │   ├── ... (one .scss per component)                  # NEW: remaining component wrappers
│   │   └── pathable-tooltip.scss                          # NEW: .pathable-tooltip wrapper
│   ├── _uswds-theme.scss                                  # Unchanged
│   ├── _utilities.scss                                    # Unchanged
│   ├── _typography.scss                                   # Unchanged
│   ├── _colors.scss                                       # Unchanged
│   └── _semantic.scss                                     # Unchanged
└── dist/
    └── styles.css                                         # Rebuilt output — now includes component wrappers

apps/docs/
├── src/
│   ├── styles/
│   │   └── custom.css                                     # UPDATE: refactor .usa-* to .pathable-*
│   └── components/
│       ├── PageFrame.astro                                # UPDATE: replace .usa-* with .pathable-*
│       ├── HorizontalNav.astro                            # UPDATE: replace .usa-* with .pathable-*
│       ├── SkipNav.astro                                  # UPDATE: replace .usa-* with .pathable-*
│       └── DocFooter.astro                                # UPDATE: replace .usa-* with .pathable-* (if any remain)
```

**Structure Decision**: Component wrappers live in a dedicated `pathable-component-wrappers/` directory within `packages/styles/src/`, one file per component. This keeps the wrapper partials separate from theme, token, and utility partials, satisfying FR-008. The package system uses SCSS `@forward` paths consistent with USWDS conventions and the existing build's load path.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| ----------- | ------------ | ------------------------------------- |
| One SCSS wrapper file per component (~47 files) | Each component needs its own `@forward` of the USWDS dependency chain plus `@extend` of the `.usa-*` class. | A single monolithic `_component-wrappers.scss` would be simpler but would prevent selective imports, violating FR-003 (package system with individual component import). |
| Dual naming (`.pathable-` classes + `--pathable-*` / `--usa-*` custom properties) | Supports both utility-first consumers (using classes) and token-first consumers (using CSS custom properties), consistent with the existing pattern. | Single namespace would be simpler but would not support the dual PathAble/USWDS naming convention already established. |
| Docs site refactoring across 4+ component files | FR-009 requires 80%+ `.usa-*` replacement across docs templates. Multiple component files need updates. | Refactoring only one file would leave 80% of `.usa-*` references in place, failing the requirement. |
| JS-driven component boundary handling | Some USWDS components select DOM nodes by `.usa-*` class names in JavaScript. CSS-only renaming would break interactivity. | Ignoring the JS boundary would break accordion, banner, combo-box, date-picker, and other interactive components. Documenting the boundary is necessary. |

## Phase 0: Research & Discovery

The spec has no [NEEDS CLARIFICATION] markers. Research tasks focus on the USWDS component wrapping approach and package system mechanics.

### Research Task R0-1: SCSS Wrapping Approach

Determine the optimal SCSS technique for creating `.pathable-*` wrappers that produce identical styles to `.usa-*` components.

**Options evaluated**:

| Option | Description | Pros | Cons |
| -------- | ------------- | ------ | ------ |
| A: `@extend` | `.pathable-button { @extend .usa-button; }` | Minimal output (selector grouping), 100% style fidelity, no maintenance burden if USWDS styles change | Requires `.usa-*` classes to be compiled in the same CSS output; `@extend` may produce longer selector lists |
| B: CSS copy | Manually duplicate `.usa-button` rules under `.pathable-button` | No dependency on USWDS source structure | Massive duplication, diverges from USWDS updates, violates FR-002 |
| C: `@mixin` wrap | Create SCSS mixins for wrapping | More flexible for customization | Adds complexity, not needed since FR-002 requires identical styles, not customization |

**Decision**: Option A (`@extend`). This is the simplest, most maintainable approach that guarantees 100% style fidelity. SCSS `@extend` compiles to comma-separated selectors (`.pathable-button, .usa-button { ... }`), so the output CSS is minimal. It also ensures that when USWDS component styles are updated, the `.pathable-*` versions automatically stay in sync.

**Dependency**: The `.usa-*` class must be present in the compiled output. This means each wrapper file must `@forward` the USWDS source (either the package `_index.scss` or the source `src/styles/`) and then `@extend` the class. USWDS `@forward` deduplication ensures shared dependencies are included only once.

### Research Task R0-2: Component-to-Package Mapping

Map each USWDS component to its corresponding PathAble wrapper name, dependency chain, and JS behavior.

The USWDS components directory at `node_modules/@uswds/uswds/packages/` contains:

- **Individual component packages**: `usa-accordion`, `usa-alert`, `usa-banner`, `usa-breadcrumb`, `usa-button`, `usa-button-group`, `usa-card`, `usa-character-count`, `usa-checkbox`, `usa-checklist`, `usa-collection`, `usa-combo-box`, `usa-content`, `usa-dark-background`, `usa-date-picker`, `usa-date-range-picker`, `usa-display`, `usa-embed-container`, `usa-error-message`, `usa-fieldset`, `usa-file-input`, `usa-footer`, `usa-form`, `usa-form-group`, `usa-graphic-list`, `usa-header`, `usa-hero`, `usa-hint`, `usa-icon`, `usa-icon-list`, `usa-identifier`, `usa-in-page-navigation`, `usa-input`, `usa-input-list`, `usa-input-mask`, `usa-input-prefix-suffix`, `usa-intro`, `usa-label`, `usa-language-selector`, `usa-layout-docs`, `usa-layout-grid`, `usa-legend`, `usa-link`, `usa-list`, `usa-media-block`, `usa-memorable-date`, `usa-modal`, `usa-nav`, `usa-pagination`, `usa-paragraph`, `usa-process-list`, `usa-prose`, `usa-radio`, `usa-range`, `usa-search`, `usa-section`, `usa-select`, `usa-sidenav`, `usa-site-alert`, `usa-site-title`, `usa-skipnav`, `usa-step-indicator`, `usa-summary-box`, `usa-table`, `usa-tag`, `usa-textarea`, `usa-time-picker`, `usa-tooltip`, `usa-type-line-length`, `usa-type-setting`, `usa-type-spacing`, `usa-validation`

- **Bundle packages**: `uswds`, `uswds-core`, `uswds-elements`, `uswds-fonts`, `uswds-form-controls`, `uswds-global`, `uswds-helpers`, `uswds-typography`, `uswds-utilities`

- **Utility-only packages (no `.usa-*` class wrappers needed)**: `uswds-core`, `uswds-elements`, `uswds-fonts`, `uswds-helpers`, `uswds-utilities`, `usa-fonts`, `usa-content`, `usa-dark-background`, `usa-display`, `usa-embed-container`, `usa-intro`, `usa-layout-docs`, `usa-paragraph`, `usa-section`, `usa-site-title`

- **JS-driven components** (where CSS-only rename may interact with JS): accordion, banner, combo-box, date-picker, date-range-picker, file-input, header, in-page-navigation, input-mask, modal, navigation, site-alert, tooltip, validation

### Research Task R0-3: Bundle Package Structure

Define the bundle packages that consumers can import for groups of related components:

| Bundle | Components |
| -------- | ----------- |
| `pathable-form-controls` | character-count, checkbox, combo-box, date-picker, date-range-picker, error-message, fieldset, file-input, form, form-group, hint, input, input-mask, input-prefix-suffix, label, legend, memorable-date, radio, range, select, textarea, time-picker |
| `pathable-typography` | content, dark-background, display, intro, link, list, paragraph, prose |
| `pathable-navigation` | breadcrumb, header, in-page-navigation, nav, pagination, search, sidenav, skipnav |
| `pathable-layout` | embed-container, layout-docs, layout-grid, media-block, section |
| `pathable-communication` | accordion, alert, banner, card, collection, graphic-list, hero, icon, icon-list, identifier, modal, process-list, site-alert, step-indicator, summary-box, table, tag, tooltip |
| `pathable-bundle-all` | All individual component wrappers |

### Research Task R0-4: CSS Custom Property Emission Strategy

Determine how to emit dual `--pathable-{component}-{property}` / `--usa-{component}-{property}` CSS custom properties for component-level styling values. The utility wrapper pattern (`_utilities.scss`) emits these via a `:root` loop over configuration maps. For components, the approach varies:

**Decision**: Component-level CSS custom properties will use the same `:root` block loop strategy as utilities, but in a dedicated `_components-custom-properties.scss` partial. This keeps the component custom property output separate and extensible. The map will contain component-level values like `--pathable-button-border-radius`, `--pathable-button-padding-x`, etc. — derived from USWDS theme functions.

## Phase 1: Design & Contracts

### Prerequisites: research.md complete

#### 1. data-model.md

Formal entity definitions for:

- `ComponentWrapper` — name, USWDS package name, PathAble class name, SCSS wrapper file, dependency chain
- `ComponentPackage` — importable SCSS entry point, list of forwarded component wrappers
- `BundlePackage` — named collection of component packages
- `DualComponentProperty` — `--pathable-{component}-{property}`, `--usa-{component}-{property}`, resolved value
- `JSDrivenComponent` — component name, class-name-referencing selectors in JS, workaround approach
- `WrapperGenerationStrategy` — `@extend` vs other, with rationale for each component

#### 2. contracts/scss-interface.md

SCSS interface contract defining:

- Component wrapper file format (SCSS partial pattern: import USWDS source + `@extend` class)
- Package entry point forward structure
- How shared dependencies deduplicate via SCSS module system
- The guaranteed public API (`.pathable-{component}` classes)
- JS boundary documentation: which components require `.usa-*` class retention

#### 3. quickstart.md

Usage guide covering:

- Basic CSS import usage with `.pathable-*` component classes
- Selective import via individual component packages
- Bundle package usage
- Import-all entry point
- Complete component-to-PathAble-class mapping reference table
- JS-interactive component handling (which components need `.usa-*` preserved and why)
- Docs site refactoring guide (how to replace `.usa-*` classes)
- Verifying component wrapper output in compiled CSS

#### 4. Agent Context Update

Run agent context update script to register USWDS component wrapper knowledge, naming conventions, and docs site refactoring patterns.

### Post-Design Constitution Re-Check

*Completed after Phase 1 artifacts generated.*

- [x] No design decision contradicts ratified principles
- [x] data-model.md does not duplicate constitution text
- [x] contracts/scss-interface.md complies with SCSS-as-authoring-layer principle
- [x] Complexity Tracking justifications remain valid
