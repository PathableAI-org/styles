# Feature Specification: USWDS Typography Settings

**Feature Branch**: `005-typography-settings`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User description: "We have previously set the uswds color setting and now want to turn to the topography settings here: https://designsystem.digital.gov/documentation/settings/#typography-settings This should follow the same style as our color settings where we are exposing --pathable* and --usa* variables to support either case. The values of these settings should follow our brand guide"

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developers use USWDS components with brand-matched typography (Priority: P1)

A developer working on a PathAble project imports a standard USWDS component (e.g., accordion, alert, button) and sees it rendered with the project's brand fonts (Fredoka for headings, Nunito for body text, etc.) — no additional font declarations needed.

**Why this priority**: This is the core value of the feature — making USWDS components production-ready with PathAble brand typography out of the box, just as the color settings did for brand colors.

**Independent Test**: Can be tested by importing a USWDS component (e.g., `usa-accordion`) into a page. The component's heading should render in the heading font family (Fredoka) and its body text in the body font family (Nunito) without any additional CSS font-family declarations.

**Acceptance Scenarios**:

1. **Given** a fresh project importing `@pathable/styles`, **When** a developer uses a USWDS component with a heading, **Then** the heading renders in the brand heading typeface (Fredoka).
2. **Given** a fresh project importing `@pathable/styles`, **When** a developer uses a USWDS component with body text, **Then** the body text renders in the brand body typeface (Nunito).
3. **Given** a fresh project importing `@pathable/styles`, **When** a developer uses a USWDS button or UI element, **Then** the UI text renders in the brand UI typeface (Nunito or Poppins Bold as appropriate to the role).
4. **Given** the package is compiled, **When** the output CSS is inspected, **Then** USWDS typography role tokens (`heading`, `body`, `ui`, `code`, `alt`) are set to the brand font family tokens.

---

### User Story 2 - Designers verify type scale and hierarchy in USWDS components (Priority: P2)

A designer inspects a page built with USWDS components and confirms that heading sizes (h1–h6), body text size, and line-height follow the PathAble typography scale.

**Why this priority**: Design consistency across components prevents visual fragmentation and ensures the product feels cohesive.

**Independent Test**: Can be tested by rendering a page with all six heading levels (h1–h6) using USWDS prose styles and verifying the rendered font sizes match the PathAble type scale (32px for display, 24px for h1-equivalent, 20px for h2-equivalent, etc.).

**Acceptance Scenarios**:

1. **Given** USWDS prose content with headings, **When** rendered, **Then** h1 uses the heading font at the largest type scale (equivalent to the PathAble heading-lg or larger).
2. **Given** USWDS prose content with body paragraphs, **When** rendered, **Then** body text uses the body font at 16px-equivalent size (the PathAble body-md scale).
3. **Given** USWDS prose content, **When** rendered, **Then** line-height values follow the PathAble scale (e.g., 24px for 16px body text, 28px for 20px heading text).

---

### User Story 3 - Consumers reference --pathable-font-* and --usa-font-* CSS custom properties (Priority: P2)

A developer or designer working outside of SCSS wants to apply PathAble brand typography to a non-USWDS element. They should be able to use CSS custom properties to access the font family, size, and line-height values.

**Why this priority**: The dual `--pathable-*` / `--usa-*` variable pattern established by the color settings should be consistently available for typography, ensuring consumers can reference typography tokens regardless of whether they think in PathAble or USWDS naming conventions.

**Independent Test**: Can be tested by setting `font-family: var(--pathable-font-heading)` or `font-family: var(--usa-font-heading)` on any HTML element and verifying it resolves to the Fredoka font stack.

**Acceptance Scenarios**:

1. **Given** a page that loads `@pathable/styles`, **When** an element uses `var(--pathable-font-heading)`, **Then** it renders in the heading font family.
2. **Given** a page that loads `@pathable/styles`, **When** an element uses `var(--usa-font-heading)`, **Then** it renders in the same heading font family (same resolved value as `--pathable-font-heading`).
3. **Given** a page that loads `@pathable/styles`, **When** an element uses `var(--usa-font-size-h1)`, **Then** it resolves to the PathAble heading-lg font size.

---

### User Story 4 - Upstream USWDS typography changes integrate without breaking brand fonts (Priority: P3)

When the USWDS dependency is updated, the project's compiled styles should still apply the correct brand fonts and type scale.

**Why this priority**: Long-term maintainability — the USWDS typography system may add or change settings, but the PathAble overrides should remain stable.

**Independent Test**: Can be tested by upgrading the USWDS package version and rebuilding — the compiled output fonts should be unchanged from before the upgrade.

**Acceptance Scenarios**:

1. **Given** the project uses a specific USWDS version, **When** USWDS is upgraded to a compatible newer version, **Then** the font family assignments remain intact.
2. **Given** all typography theme overrides are in a single settings file, **When** USWDS is updated, **Then** no brand font values change unless explicitly edited in that settings file.

---

### Edge Cases

- A consumer does not load the brand font files (Fredoka, Nunito, etc.) on their page: the fallback font stacks should safely degrade to system-ui, sans-serif, or serif as appropriate, so text remains readable.
- A brand font (e.g., Fredoka) is not available in all the weights USWDS expects: USWDS weights should be configured to only include the weights actually available for each font, and missing weights should not cause compilation errors.
- The font files are not yet hosted at the configured font path: the build should complete without errors (the fonts will simply not load at runtime until the assets are placed at the expected path).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `packages/styles` package MUST add a typography settings layer that configures USWDS typography theme settings (`$theme-font-*`, `$theme-type-scale-*`, `$theme-font-weight-*`, `$theme-body-*`, `$theme-h1-*` through `$theme-h6-*`, `$theme-heading-*`, and related typography tokens listed at https://designsystem.digital.gov/documentation/settings/#typography-settings) using values derived from the PathAble brand guide.

- **FR-002**: The following USWDS role-based font families MUST be configured to match PathAble brand fonts:
  - **body** role → Nunito (or the closest available USWDS sans family)
  - **heading** role → Fredoka (or the closest available family)
  - **ui** role → Nunito (matching body role for interface text)
  - **code** role → the existing PathAble monospace font stack
  - **alt** role → Montserrat Bold (alternate heading)

- **FR-003**: Custom font stacks MUST be configured for each font family so that the compiled CSS includes the complete fallback chain (e.g., `'Fredoka', system-ui, sans-serif`), consistent with the existing `$pathable-font-*` variables in `_typography.scss`.

- **FR-004**: Font weights MUST be configured to match what is available in the brand fonts and used by the brand guide:
  - Nunito: Regular (400) for body text
  - Fredoka: Regular (400) for headings
  - Poppins: Bold (700) for subheadings
  - Montserrat: Bold (700) for alternate headings
  - Additional weights (e.g., Nunito SemiBold 600 for labels) if the font files are available

- **FR-005**: The USWDS type scale tokens (`$theme-type-scale-*`) SHOULD be mapped so that the PathAble typography scale from `_typography.scss` has equivalent USWDS size token representations:
  - display-lg (32px) → 3xl or appropriate USWDS size token
  - heading-lg (24px) → appropriate USWDS size token
  - heading-md (20px) → appropriate USWDS size token  
  - heading-sm (18px) → appropriate USWDS size token
  - body-lg (18px) → appropriate USWDS size token
  - body-md (16px) → appropriate USWDS size token
  - body-sm (14px) → appropriate USWDS size token
  - label/caption (12px) → appropriate USWDS size token

- **FR-006**: Heading size tokens (`$theme-h1-font-size` through `$theme-h6-font-size`, `$theme-display-font-size`, `$theme-body-font-size`) MUST be configured so that h1–h6 headings and body text in USWDS prose content follow the hierarchy defined in the PathAble brand guide (headings most prominent, body text scaled down naturally).

- **FR-007**: The existing `$pathable-font-*` SCSS variables and `--pathable-font-*` CSS custom properties MUST continue to be exported. Where possible, they SHOULD alias the USWDS typography theme tokens so that a single change propagates to both systems. Where a direct alias is not possible (e.g., custom type scale values), the values may remain independently defined but MUST be consistent.

- **FR-008**: A dual set of CSS custom properties MUST be exposed in the compiled output:
  - `--pathable-font-*` for consumers using PathAble naming (e.g., `--pathable-font-heading`, `--pathable-font-body`, `--pathable-font-size-body-md`, `--pathable-font-weight-normal`)
  - `--usa-font-*` for consumers using USWDS-style naming (e.g., `--usa-font-heading`, `--usa-font-body`, `--usa-font-size-h1`, `--usa-font-weight-bold`)
  Both sets MUST resolve to the same underlying values.

- **FR-009**: Body typography settings (`$theme-body-font-family`, `$theme-body-font-size`, `$theme-body-line-height`, `$theme-style-body-element`) MUST be configured so that unstyled body text on a page consuming `@pathable/styles` renders in Nunito at the appropriate size and line-height.

- **FR-010**: USWDS prose settings (`$theme-prose-font-family`, `$theme-lead-*`, `$theme-heading-margin-top`, `$theme-paragraph-margin-top`) MUST be configured to follow PathAble brand guide typography rules (preserving breathing room around text, clear heading/body hierarchy).

- **FR-011**: All USWDS typography theme overrides MUST be scoped within a single configuration file so that future USWDS upgrades require editing only that file, consistent with the pattern established for color settings.

- **FR-012**: The compiled output CSS MUST NOT include duplicate or conflicting font-family declarations. Where both `_typography.scss` and the USWDS theme typography settings define the same values, a single source of truth must be chosen to avoid specificity conflicts.

### Key Entities

- **USWDS Font Family Token**: A type-based token (e.g., `sans`, `serif`, `mono`, `cond`, `icon`, `lang`) that maps to a specific typeface. Custom typeface tokens can be added via `$theme-typeface-tokens`.
- **USWDS Role-based Font Token**: A role-based token (e.g., `body`, `heading`, `ui`, `code`, `alt`) that references a font family token. These are used by components to determine what font to render.
- **USWDS Type Scale Token**: A unitless size token (e.g., `2`, `3`, `4`, `5`, `6`, `9`, `12`, `14`, `15`) that maps to a computed font-size value based on the root font size.
- **USWDS Font Weight Token**: A named weight token (e.g., `light`, `normal`, `bold`) that maps to a numeric font-weight value.
- **Brand Typeface**: One of the four PathAble brand typefaces (Fredoka, Montserrat Bold, Poppins Bold, Nunito) with specific weight and style variants as defined in the brand guide.
- **--pathable-font-* / --usa-font-* CSS Custom Properties**: Dual-named CSS custom properties that expose typography values (font-family, font-size, font-weight, line-height) to runtime CSS consumers.
- **Typography Settings File**: A single SCSS file that configures `$theme-font-*` and related typography settings before the `@use 'uswds-core'` import, following the pattern established by `_uswds-theme.scss` for color.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All four PathAble brand typefaces (Fredoka, Montserrat Bold, Poppins Bold, Nunito) are assigned to at least one USWDS role-based font token. A reviewer can trace each typeface to its USWDS role assignment in the typography settings file.
- **SC-002**: A consumer who adds `@pathable/styles` and imports USWDS components can render pages with PathAble brand fonts appearing correctly in components that use the `heading`, `body`, `ui`, and `code` roles — no additional font-family CSS declarations needed.
- **SC-003**: The rendered heading hierarchy (h1–h6) in USWDS prose content follows the PathAble type scale with clear size differentiation between each level.
- **SC-004**: The dual `--pathable-font-*` and `--usa-font-*` CSS custom properties are present in the compiled output. Both naming conventions resolve to identical values for equivalent tokens.
- **SC-005**: Existing consumers of `@pathable/styles` who reference `--pathable-font-*` CSS custom properties or `$pathable-font-*` SCSS variables see no breaking changes after upgrade.
- **SC-006**: The USWDS version can be bumped and a rebuild produces no unexpected typography changes — only the single typography settings file needs review.

## Assumptions

- Brand font files (Fredoka, Montserrat, Poppins, Nunito) will be self-hosted and made available at a configurable font path, matching the approach USWDS uses for its built-in fonts via `$theme-font-path`. USWDS will generate `@font-face` rules from the custom source declarations rather than requiring consumers to load fonts via an external CDN.
- The existing `$pathable-font-*` SCSS variables and `--pathable-font-*` CSS custom properties in `_typography.scss` will be preserved. The typography settings layer may add new aliased variables but will not remove or rename existing ones.
- The root font size (`$theme-respect-user-font-size`) will remain `true` (the USWDS default), respecting user browser font size preferences for accessibility.
- USWDS global content styles (`$theme-global-content-styles`, paragraph, link styles) will remain `false` as they currently are — this feature only configures typography settings, not global HTML element styling.
- Non-typography USWDS theme settings (colors, spacing, breakpoints) are out of scope for this feature and will continue to use their configured values from the existing color settings work.
- The PathAble brand type scale (32px display-lg, 24px heading-lg, 20px heading-md, 18px heading-sm/body-lg, 16px body-md, 14px body-sm, 12px label/caption) will be mapped to the closest USWDS type scale tokens. Minor differences between the mapped px values and the originals are acceptable and will be documented.
- Line-height values from the existing `_typography.scss` scale (e.g., 40px for display, 32px for heading-lg, 28px for body-lg, 24px for body-md, etc.) will be mapped to the closest USWDS line-height tokens.
- If a specific brand font weight is not available as a USWDS weight token (e.g., Nunito SemiBold 600), it will be documented and left at the closest available alternative.
