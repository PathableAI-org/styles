# Feature Specification: USWDS Component Wrappers

**Feature Branch**: `007-uswds-component-wrappers`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User description: "We have been wrapping uswds such that our package provides ---pathable-* and pathable* tokens and classes for each usa* ad --usa* that uswds provides. Create similar wrappers for each component: https://designsystem.digital.gov/components/overview/ This should provide a package system similar to https://designsystem.digital.gov/components/packages/ . Also update the apps/docs to use these components wherever appropriate"

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Applies PathAble-Prefixed Component Classes (Priority: P1)

A developer using `@pathable/styles` wants to build a page with USWDS-style components (accordion, button, alert, banner, etc.) but prefers to use the `.pathable-*` naming convention established by the existing utility and token wrappers. They can import the component wrappers they need and use classes like `.pathable-accordion`, `.pathable-button`, `.pathable-alert` instead of `.usa-accordion`, `.usa-button`, `.usa-alert`. Each `.pathable-*` class resolves to the same visual outcome as the corresponding `.usa-*` class, and component-level CSS custom properties are available under both `--pathable-*` and `--usa-*` namespaces.

**Why this priority**: This is the core value of the feature — providing consistent `.pathable-*` naming for all USWDS components, completing the dual-naming pattern already established for tokens and utilities. Every consumer of the package benefits from a single, self-consistent class naming convention.

**Independent Test**: A developer creates an HTML page that imports `@pathable/styles` and uses a `.pathable-button` class on a `<button>` element alongside `.pathable-alert` and `.pathable-accordion` classes on their respective elements. All components render with the same visual styles as their `.usa-*` equivalents when inspected in browser DevTools.

**Acceptance Scenarios**:

1. **Given** the compiled `dist/styles.css` from `@pathable/styles`, **When** a developer inspects the file, **Then** it contains `.pathable-*` class definitions for at minimum the most commonly used USWDS components (accordion, alert, banner, breadcrumb, button, button-group, card, checkbox, footer, form, header, icon, identifier, input, link, modal, pagination, process-list, prose, radio, search, select, side-navigation, site-alert, step-indicator, summary-box, table, tag, textarea, tooltip).
2. **Given** a `<button class="pathable-button">` element rendered in a browser, **When** the developer inspects the computed styles, **Then** they match the styles of a `<button class="usa-button">` element using the same PathAble theme configuration.
3. **Given** the CSS custom properties in `:root`, **When** inspected, **Then** each component-level CSS variable has both a `--pathable-{component}-{property}` and `--usa-{component}-{property}` equivalent.

---

### User Story 2 - Selective Component Import via Package System (Priority: P2)

A developer wants to use only a few PathAble-wrapped components (e.g., just `.pathable-button`, `.pathable-alert`, and `.pathable-banner`) without importing all 47 component wrappers. They can use a package-based import system, similar to USWDS packages, to import only the component wrappers their project needs. This reduces the final compiled CSS size and compile time compared to importing the full component library.

**Why this priority**: The USWDS package system is a well-established pattern that reduces CSS bloat. Supporting selective imports makes `@pathable/styles` viable for production projects where bundle size matters. This is higher value than the docs refactoring (P3) because it affects all consumers, not just the docs site.

**Independent Test**: A developer creates a SCSS entry point that imports only `pathable-accordion` and `pathable-button` component wrappers. The compiled CSS contains `.pathable-accordion` and `.pathable-button` classes but does NOT contain `.pathable-alert`, `.pathable-footer`, or any other component classes that were not imported.

**Acceptance Scenarios**:

1. **Given** a SCSS file that imports only the `pathable-button` component wrapper, **When** compiled, **Then** the output contains `.pathable-button` styles but no `.pathable-accordion` or `.pathable-alert` styles.
2. **Given** a SCSS file that imports the `pathable-form-controls` bundle package, **When** compiled, **Then** the output contains styles for all form-control components (checkbox, combo-box, date-picker, file-input, input, radio, range, select, textarea, time-picker).
3. **Given** a SCSS file that imports both individual components and bundles, **When** compiled, **Then** shared dependencies (e.g., `pathable-icon` used by both accordion and alert) are included only once.

---

### User Story 3 - Docs Site Uses PathAble-Prefixed Components (Priority: P3)

The PathAble documentation site (`apps/docs`) currently uses some USWDS classes directly and has ad-hoc component styling. After this feature, the docs site uses `.pathable-*` component classes wherever a matching component wrapper exists. This makes the docs site a self-consistent showcase of the PathAble component system, demonstrates real usage patterns, and eliminates direct `.usa-*` class references in docs templates.

**Why this priority**: The docs site is the package's primary consumer. Refactoring it to use `.pathable-*` component classes validates that the wrappers work correctly in a real application and demonstrates best practices to consumers. This is lower priority than the wrapper generation itself (P1, P2).

**Independent Test**: A developer inspects every `.astro` template in `apps/docs/src/` and finds zero remaining `.usa-*` class references — all are replaced with `.pathable-*` equivalents. The rendered docs pages are visually identical before and after the refactoring.

**Acceptance Scenarios**:

1. **Given** the `apps/docs` source files, **When** searched for `.usa-` class references, **Then** no `.usa-*` classes remain in component template `<style>` blocks or inline HTML classes (with the exception of USWDS JavaScript-driven components where renaming the class would break JS behavior).
2. **Given** the rendered docs site before and after the refactoring, **When** comparing screenshots of each page, **Then** there are zero visual regressions.
3. **Given** any ad-hoc CSS in docs components that duplicates a USWDS component style, **When** a matching `.pathable-*` wrapper exists, **Then** the ad-hoc CSS is removed and replaced with the component class.

---

### Edge Cases

- **Components shared between packages**: Some USWDS components are dependencies of others (e.g., `usa-icon` is a dependency of `usa-accordion`, `usa-alert`, `usa-banner`, etc.). The package system must ensure shared dependencies are included only once in the compiled output, following the USWDS `@forward` deduplication behavior.
- **Components with JavaScript**: Some USWDS components (accordion, banner, combo box, date picker, etc.) require JavaScript for interactivity. The CSS wrapper classes can be renamed, but if the USWDS JS references `.usa-*` classes internally, renaming the CSS class alone would break JS-driven behavior. The wrapping approach must account for this mismatch.
- **Responsive and state variants in components**: Some components have responsive class variants (e.g., `usa-header` uses `usa-header--basic` modifiers) or state-based styles. These must be preserved in the `.pathable-*` equivalent.
- **Components with no direct `.usa-*` class**: A few USWDS packages (e.g., `uswds-core`, `uswds-fonts`) are utility packages with no component classes. These should have package entries but would have no `.pathable-*` class wrappers to generate.
- **Theme setting disabled components**: If a USWDS component is disabled via theme settings, its corresponding `.pathable-*` wrapper should not be generated.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `@pathable/styles` package MUST provide `.pathable-*` CSS class wrappers for each USWDS component on the components overview page (https://designsystem.digital.gov/components/overview/), covering at minimum the following components: accordion, alert, banner, breadcrumb, button, button-group, card, character-count, checkbox, collection, combo-box, date-picker, date-range-picker, embed-container, error-message, fieldset, file-input, footer, form, form-group, graphic-list, header, hero, hint, icon, icon-list, identifier, input, input-prefix-suffix, intro, label, layout-docs, layout-grid, legend, link, list, media-block, memorable-date, modal, nav, pagination, paragraph, process-list, prose, radio, range, search, section, select, sidenav, site-alert, site-title, skipnav, step-indicator, summary-box, table, tag, textarea, time-picker, tooltip, validation.
- **FR-002**: Each `.pathable-{component}` CSS class MUST resolve to the same computed styles as the corresponding `.usa-{component}` class when compiled with the same PathAble theme configuration.
- **FR-003**: The component wrappers MUST be organized into a package system where consumers can import individual component wrappers or bundle packages, mirroring the USWDS package system at https://designsystem.digital.gov/components/packages/.
- **FR-004**: The package system MUST include bundle packages that collect related component wrappers (e.g., `pathable-form-controls` for all form-related components, `pathable-typography` for typography-related components), matching USWDS bundle package groupings.
- **FR-005**: Component-level CSS custom properties MUST use the dual-naming convention: each property MUST be available as both `--pathable-{component}-{property}` and `--usa-{component}-{property}`, consistent with the existing token and utility wrapping pattern.
- **FR-006**: The package system MUST deduplicate shared dependencies — if two components share a dependency (e.g., both accordion and alert depend on icon), that dependency MUST be included only once in the compiled output.
- **FR-007**: When a USWDS component or its feature is disabled via theme configuration, the corresponding `.pathable-*` wrapper and CSS custom properties MUST NOT be generated.
- **FR-008**: The component wrappers MUST be defined in a dedicated source structure (e.g., a `components/` directory) with one file or subdirectory per component or package, maintaining clear separation from tokens, utilities, and theme configuration.
- **FR-009**: The `apps/docs` site MUST be updated to replace at least 80% of direct `.usa-*` class references in Astro templates and `<style>` blocks with equivalent `.pathable-*` component classes, provided a matching wrapper exists and the class rename does not break JavaScript-driven behavior.
- **FR-010**: The `apps/docs` site refactoring MUST produce zero visual regressions compared to the pre-refactoring appearance, verified by before/after comparison.
- **FR-011**: The package system MUST provide a documented entry point (e.g., `@import '@pathable/styles/component-wrappers'` or equivalent) that imports all component wrappers at once, as a convenience for consumers who want the full set.

### Key Entities

- **Component Wrapper**: A SCSS/CSS definition that provides a `.pathable-*` prefixed version of a USWDS component's `.usa-*` styles. For example, a wrapper for `usa-button` provides `.pathable-button` as an alias for `.usa-button`.
- **Component Package**: A discrete importable unit in the package system, corresponding to a single USWDS component (e.g., `pathable-button`, `pathable-accordion`) or a bundle of related components (e.g., `pathable-form-controls`).
- **Bundle Package**: A collection of individual component packages grouped by functional area (e.g., form controls, typography, navigation), matching USWDS bundle package conventions.
- **Dual-Named Component Property**: A CSS custom property emitted under both `--pathable-{component}-{property}` and `--usa-{component}-{property}` namespaces for component-level styling values.
- **USWDS JavaScript Boundary**: The constraint that USWDS JavaScript may reference `.usa-*` class names internally; renaming the CSS class without corresponding JS changes would break component behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 40 individual USWDS component packages and 5 bundle packages are available as `.pathable-*` wrappers in the compiled output, covering the majority of the 47 components on the USWDS overview page.
- **SC-002**: A developer can import a single component wrapper (e.g., only `pathable-button`) and produce compiled CSS containing only that component's styles, with a total compiled size increase of no more than 20 KB gzip per component.
- **SC-003**: The import-all entry point (all component wrappers) adds no more than 100 KB gzip to the compiled `dist/styles.css`, representing roughly the same efficiency as the USWDS all-components import.
- **SC-004**: At least 80% of `.usa-*` class references in `apps/docs/src/` are replaced with `.pathable-*` equivalents with zero visual regressions, verified by automated before/after page comparison.
- **SC-005**: A developer familiar with USWDS packages can identify the corresponding PathAble component package name within 30 seconds using a naming convention reference table, matching the established `.pathable-{component}` pattern.

## Assumptions

- The component wrapper approach follows the same CSS-class-renaming pattern as utility wrappers: SCSS-based generation that consumes USWDS component styles and re-exports them under the `.pathable-*` prefix.
- USWDS JavaScript behavior is NOT wrapped or modified. Components that require JS for interactivity (accordion, banner, combo box, date picker, etc.) will continue to reference `.usa-*` classes internally. Docs refactoring for these components will retain `.usa-*` classes where necessary for JS compatibility, using `.pathable-*` only for the CSS class where JS is not affected.
- The component wrapper source structure will live within `packages/styles/src/`, following the same organizational pattern as the existing `_utilities.scss`, `_typography.scss`, and other partials, rather than creating new workspace packages.
- The package system will use SCSS `@forward` for import paths, consistent with USWDS package conventions and the existing Sass module syntax already used in the project.
- The `apps/docs` site currently uses a mix of USWDS component classes directly (`.usa-*`) and PathAble classes (`.pathable-*`). The refactoring targets replacing the `.usa-*` references.
- Component wrappers that have no direct `.uswds-*` or `.usa-*` class output (e.g., `uswds-core`, `uswds-fonts`, `uswds-elements`, `uswds-helpers`) will have package entries in the import system but will forward the USWDS source without adding a `.pathable-*` class wrapper.