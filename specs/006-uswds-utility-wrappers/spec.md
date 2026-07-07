# Feature Specification: USWDS Utility Wrappers

**Feature Branch**: `006-uswds-utility-wrappers`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User description: "create wrappers for the utility classes from uswds (https://designsystem.digital.gov/utilities/) and update apps/docs to use these classes where appropriate. there should be --pathable* versions of all the --usa* and unprefixed utility classes should should be prefixed with pathable*"

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Docs Site Uses PathAble Utility Classes Instead of Ad-Hoc CSS (Priority: P1)

A developer maintaining the PathAble documentation site (`apps/docs`) needs to style a component with common layout patterns like padding, margins, background colors, and typography. Instead of writing ad-hoc CSS rules in component `<style>` blocks and `custom.css`, the developer can apply `.pathable-*` utility classes directly in their Astro templates. This reduces duplication, makes the docs codebase more consistent, and ensures all spacing, color, and typography values come from the canonical token source.

**Why this priority**: This is the primary value of the feature — the utility classes exist to be consumed. The docs site is the first consumer and the highest-impact place to demonstrate the value of utility-based styling.

**Independent Test**: An Astro component in `apps/docs` that previously used custom CSS for padding, background color, and margin can be rewritten to use only `.pathable-bg-surface`, `.pathable-padding-4`, and `.pathable-margin-top-2` classes, with the rendered result visually identical when inspected in browser DevTools.

**Acceptance Scenarios**:

1. **Given** the compiled `dist/styles.css` from `@pathable/styles`, **When** a developer inspects the file, **Then** it contains `.pathable-*` utility classes for at least the background-color, color, padding, margin, display, and font-family utility modules.
2. **Given** a docs component that previously used `class="sidebar-content"` with ad-hoc CSS, **When** it is refactored to `class="pathable-bg-surface pathable-padding-4 pathable-font-body"`, **Then** the visual rendering is identical.

---

### User Story 2 - Developer Adds PathAble Utility Classes to New Project (Priority: P2)

A developer starts a new project using `@pathable/styles` and wants to quickly prototype a layout using utility-first CSS. They see that the bundled stylesheet includes `.pathable-bg-primary`, `.pathable-text-base`, `.pathable-padding-2`, `.pathable-display-flex`, and other common utilities, matching the USWDS utility API they already know. They can build layouts directly in HTML without writing any custom CSS for common styling patterns.

**Why this priority**: Demonstrates the value of `@pathable/styles` as a standalone utility framework. Developers familiar with USWDS can adopt PathAble utilities with minimal learning curve.

**Independent Test**: A developer creates an HTML page that imports `dist/styles.css` and uses only `.pathable-*` utility classes (e.g., `<div class="pathable-bg-primary pathable-padding-4 pathable-text-white">Hello</div>`). The page renders with correct PathAble brand colors and spacing.

**Acceptance Scenarios**:

1. **Given** a new HTML page importing `@pathable/styles/dist/styles.css`, **When** a `<div class="pathable-bg-primary pathable-padding-4">` element is rendered, **Then** it has a background matching the PathAble Blue brand color and 16px of padding on all sides.
2. **Given** the same page, **When** a `<p class="pathable-text-base pathable-font-body">` element is rendered, **Then** it uses the Nunito body font in the base text color.
3. **Given** a responsive layout need, **When** a developer applies `pathable-display-flex pathable-flex-align-center pathable-padding-y-2`, **Then** the element renders as a flex container with centered alignment and 8px vertical padding.

---

### User Story 3 - CSS Custom Property Dual Naming for Utility Tokens (Priority: P3)

A consumer of `@pathable/styles` uses CSS custom properties directly (not utility classes) and expects the same dual-naming convention already established for typography (`--pathable-font-*` and `--usa-font-*`). Utility-related CSS custom properties should also be available under both namespaces so that consumers can reference them by either PathAble or USWDS naming conventions.

**Why this priority**: Consistency with the existing dual-naming pattern (FR-008 from typography) is important for API coherence, but adds less standalone value than the utility classes themselves.

**Independent Test**: A developer inspects the compiled CSS and finds that utility-related values (spacing tokens, color tokens exposed as utility output) are available under both `--pathable-*` and `--usa-*` namespaces in the `:root` block.

**Acceptance Scenarios**:

1. **Given** the compiled `dist/styles.css`, **When** the `:root` block is inspected, **Then** each utility-related value has both a `--pathable-*` and a `--usa-*` CSS custom property.
2. **Given** a CSS file using `--pathable-bg-primary` and `--usa-bg-primary`, **When** a browser renders an element using either property, **Then** both resolve to the same hex value.

---

### Edge Cases

- What happens when a USWDS utility value references a theme token that is set to `false`? The corresponding `.pathable-*` utility class should not be generated.
- How does the system handle utility modules that USWDS does not enable by default (e.g., `bottom`, `left`, `right`, `top`)? Only generate `.pathable-*` wrappers for enabled utility modules, matching the USWDS configuration in `_uswds-theme.scss`.
- What about responsive variants (e.g., `.tablet\:pathable-padding-4`)? Responsive variants should follow the same breakpoint configuration as USWDS utilities unless explicitly overridden.
- How are state variants handled (hover, focus, active)? State variants should be generated for utility modules where USWDS enables state variant output.
- How does the utility wrapper interact with USWDS's `!important` output? The `.pathable-*` utility classes should use the same `!important` flag as USWDS utilities for consistency.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `@pathable/styles` package MUST generate CSS utility classes prefixed with `.pathable-*` that wrap USWDS utility module values, covering at minimum the following utility modules: background-color, color, padding, margin, display, font-family, font-weight, border, border-radius, flex, align-items, justify-content, width, max-width, and text-align.
- **FR-002**: Each `.pathable-*` utility class MUST resolve to the same computed CSS value as the corresponding USWDS utility class, using the PathAble theme configuration defined in `_uswds-theme.scss`.
- **FR-003**: Each `.pathable-*` utility class MUST be generated from a single configuration source, so that adding or changing a token value automatically updates all class variants without manual edits.
- **FR-004**: CSS custom properties for utility values MUST follow the dual-naming convention: each value MUST be available as both `--pathable-{name}` and `--usa-{name}`, consistent with the existing typography token pattern.
- **FR-005**: The `apps/docs` site MUST be updated to replace at least 80% of its ad-hoc CSS rules (in `custom.css` and component `<style>` blocks) with equivalent `.pathable-*` utility classes, provided a matching utility class exists.
- **FR-006**: Responsive breakpoint variants for `.pathable-*` utilities MUST be available at the same screen-width thresholds that the PathAble theme configuration defines for USWDS utilities.
- **FR-007**: State variant classes (hover, focus, active) for `.pathable-*` utilities MUST be available for the same utility modules and in the same manner as the underlying USWDS utility settings allow.
- **FR-008**: The utility class definitions MUST be defined in a single, dedicated source file (not interleaved with other token or component definitions) to maintain a clear separation of concerns.
- **FR-009**: The `.pathable-*` utility classes MUST respect the same `!important` output setting as the underlying USWDS utilities, ensuring consistent override behavior.
- **FR-010**: When a USWDS utility module is disabled via theme configuration, its corresponding `.pathable-*` utility classes MUST NOT be generated, preventing unused CSS output.

### Key Entities

- **Utility Module**: A category of USWDS utility classes (e.g., "background-color", "padding", "margin") that generates a family of related CSS classes. Each module has a class base (e.g., `bg-`, `padding-`) and a set of values.
- **Utility Class**: A single CSS class generated by a utility module (e.g., `.bg-primary`, `.padding-4`). In this feature, the `.pathable-*` prefixed version (e.g., `.pathable-bg-primary`).
- **Dual-Named Custom Property**: A CSS custom property emitted under both the `--pathable-*` and `--usa-*` namespaces, following the pattern established by the typography tokens in `_typography.scss`.
- **Ad-Hoc CSS Rule**: A CSS rule in `apps/docs` that applies a single styling concern (padding, margin, color, background) inline in a component or custom stylesheet, which could be replaced by a utility class.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 15 USWDS utility modules are available as `.pathable-*` CSS classes in the compiled `dist/styles.css`, covering the most commonly used categories (spacing, color, typography, layout, display).
- **SC-002**: At least 80% of the existing ad-hoc CSS property declarations in `apps/docs/src/styles/custom.css` and component `<style>` blocks are replaced with `.pathable-*` utility class references, reducing the total custom CSS line count by at least 50%.
- **SC-003**: A developer with USWDS experience can add a new `.pathable-*` utility class to an HTML element and have it render correctly within 30 seconds of reading the utility API documentation.
- **SC-004**: The compiled `dist/styles.css` size increase from adding utility classes does not exceed 50 KB gzip (the USWDS utilities package is 198 KB uncompressed; the PathAble subset should be significantly smaller).
- **SC-005**: Zero regressions in the visual rendering of `apps/docs` pages after replacing ad-hoc CSS with utility classes, verified by before/after visual comparison.

## Assumptions

- Utility classes will be generated from the project's theme token values, not by duplicating USWDS utility class output. This keeps the generated CSS minimal — only including utility values that correspond to PathAble theme tokens.
- The `apps/docs` site currently uses Starlight/Astro with component-level styles and a single `custom.css`. Refactoring to utility classes will primarily target the `custom.css` file and the `PageFrame.astro`, `HorizontalNav.astro`, and `SkipNav.astro` components.
- Utility classes that reference color values (e.g., background-primary, text-base) will use the same PathAble brand color values already configured in the theme.
- Responsive and state variants will initially be available for the most commonly needed utility modules (spacing, display, text alignment) where they provide the most value for the docs site, with other modules added as needed.
- The utility definitions will be added as a new source file rather than modifying the theme configuration file, preserving the single-responsibility pattern of the existing source files.