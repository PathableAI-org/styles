# Feature Specification: Brand Design Tokens

**Feature Branch**: `001-brand-design-tokens`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User description: "Add PathAble brand design tokens to the styles package, extracted from the 2026 Brand Book PDF and Figma design system foundations page."

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)
- [Clarifications](#clarifications)

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Developer uses CSS custom properties from the styles package (Priority: P1)

A developer working on a PathAble web application imports the compiled CSS from `@pathable/styles` and immediately has access to all brand design tokens as CSS custom properties. The developer can reference colors, typography, spacing, elevation, and border-radius values directly in their stylesheets without needing to install any additional tools or frameworks.

**Why this priority**: This is the primary consumption path defined in the design system constitution. CSS custom properties are the runtime contract of the styles package. Without this, the package delivers no value.

**Independent Test**: A developer can create a minimal HTML page that imports `dist/styles.css` and applies `var(--pathable-blue)`, `var(--space-16)`, and `var(--font-heading)` to elements. The page renders with the correct brand values visible in the browser.

**Acceptance Scenarios**:

1. **Given** a fresh project with `@pathable/styles` installed, **When** a developer imports `dist/styles.css` into their application, **Then** all brand color tokens are available as CSS custom properties on `:root`.
2. **Given** the styles CSS is loaded, **When** a developer uses `var(--pathable-blue)` as a CSS value, **Then** the resolved value is `#00365c` (PathAble Blue).
3. **Given** the styles CSS is loaded, **When** a developer uses `var(--space-16)` as a CSS value, **Then** the resolved value is `16px`.
4. **Given** the styles CSS is loaded, **When** a developer uses `var(--radius-md)` as a CSS value, **Then** the resolved value matches the brand border-radius.

---

### User Story 2 - Developer uses semantic color tokens for light-mode UI (Priority: P2)

A UI developer building a PathAble application surface uses semantic color tokens like `--pathable-color-bg`, `--pathable-color-text`, and `--pathable-color-accent` to style components. These tokens map to the appropriate brand colors so that backgrounds, text, interactive elements, borders, and feedback indicators are consistently on-brand.

**Why this priority**: Semantic tokens are the recommended consumption pattern for application UI. They provide meaningful names that survive brand color changes without rewriting application styles.

**Independent Test**: A developer can build a simple card component using only semantic tokens (`--pathable-color-surface`, `--pathable-color-border`, `--pathable-color-text`) and verify the rendered colors match the intended brand palette.

**Acceptance Scenarios**:

1. **Given** the styles CSS is loaded, **When** a developer applies `var(--pathable-color-bg)` as a background color, **Then** the resolved value is the light-mode default background color.
2. **Given** the styles CSS is loaded, **When** a developer applies `var(--pathable-color-text)` to text, **Then** the resolved value provides sufficient contrast against the default background.
3. **Given** the styles CSS is loaded, **When** a developer applies `var(--pathable-color-accent)` to a highlight element, **Then** the resolved value is a brand-appropriate accent color.
4. **Given** the styles CSS is loaded, **When** a developer applies `var(--pathable-color-danger)` to an error message, **Then** the resolved value is visually appropriate for error states.

---

### User Story 3 - Developer uses SCSS variables and maps for advanced customization (Priority: P3)

A design system contributor wants to extend the styles package by importing the SCSS source directly. They use `@use '@pathable/styles/src' as tokens` to access Sass variables and maps for all tokens, enabling them to compose new values, derive variants, or generate theme-specific overrides.

**Why this priority**: SCSS is an authoring and extension layer per the constitution, not the primary consumption path. This serves advanced consumers and internal package composition.

**Independent Test**: A contributor can write an SCSS file that `@use`s the package source and accesses a Sass variable like `$color-brand-primary` with the correct hex value.

**Acceptance Scenarios**:

1. **Given** the SCSS source is imported via `@use`, **When** a consumer references a Sass variable for a brand color, **Then** the variable contains the correct hex value from the brand guide.
2. **Given** the SCSS source is imported, **When** a consumer uses a Sass map of spacing values, **Then** the map contains all spacing scale entries with correct pixel values.

---

### Edge Cases

- What happens when a consumer imports the CSS but their application defines conflicting custom properties on `:root`? (CSS cascade order applies; consumer overrides take precedence via standard specificity)
- How does the package handle environments where Google Fonts (Fredoka, Nunito, Montserrat, Poppins) are not loaded? (Font-family fallbacks are included in each font token)
- What happens if a future brand color update changes a hex value? (Only the token definition file needs updating; downstream consumers using semantic tokens are unaffected)
- What if the content in README.md, BRAND_RULES.md, or AGENTS.md drifts from the shipped token values? (Documentation is authoritive for brand rules but tokens in compiled CSS are the runtime source of truth; discrepancies should be filed as issues)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The package MUST export CSS custom properties for each brand color using its lowercase-kebab name: `--pathable-blue` (`#00365c`), `--intelligent-jade` (`#1cae96`), `--bright-blue-brooks` (`#4899e8`), `--tech-teal` (`#015a76`), `--lived-in-lime` (`#d3ff66`), and `--shilling-silver` (`#dde2e8`).
- **FR-002**: The package MUST export the following 10 semantic color tokens for light mode:
  - `--pathable-color-bg`: default page background
  - `--pathable-color-surface`: card/surface background
  - `--pathable-color-text`: primary text color
  - `--pathable-color-text-muted`: secondary / muted text color
  - `--pathable-color-border`: default border color
  - `--pathable-color-link`: link text color
  - `--pathable-color-accent`: accent / highlight color
  - `--pathable-color-focus-ring`: focus indicator ring color
  - `--pathable-color-danger`: destructive / error feedback color
  - `--pathable-color-success`: success / positive feedback color
- **FR-003**: The package MUST export CSS custom properties for font family tokens covering headings (`--pathable-font-heading`: Fredoka Regular), alternate headings (`--pathable-font-alternate-heading`: Montserrat Bold), subheadings (`--pathable-font-subheading`: Poppins Bold), and body text (`--pathable-font-body`: Nunito Regular).
- **FR-004**: The package MUST export CSS custom properties for a typography scale covering the following roles and values (confirmed from Figma text layer properties):
  - `ui/display/lg`: Fredoka Regular, 32px / 40px line-height
  - `ui/heading/lg`: Poppins Bold, 24px / 32px line-height
  - `ui/heading/md`: Poppins Bold, 20px / 28px line-height
  - `ui/heading/sm`: Poppins Bold, 18px / 24px line-height
  - `ui/body/lg`: Nunito Regular, 18px / 28px line-height
  - `ui/body/md`: Nunito Regular, 16px / 24px line-height
  - `ui/body/sm`: Nunito Regular, 14px / 20px line-height
  - `ui/label/md`: Nunito SemiBold (600), 14px / 20px line-height
  - `ui/label/sm`: Nunito SemiBold (600), 12px / 16px line-height
  - `ui/caption/md`: Nunito Regular, 12px / 16px line-height
- **FR-005**: The package MUST export CSS custom properties for a spacing scale with values for 4px, 8px, 12px, 16px, 24px, 32px, and 48px.
- **FR-006**: The package MUST export CSS custom properties for elevation with 4 levels using the following box-shadow values (confirmed from Figma effect properties):
  - `sm`: `0px 1px 2px 0px rgba(0, 54, 92, 0.12)` (PathAble Blue at 12% opacity)
  - `md`: `0px 4px 8px 0px rgba(0, 54, 92, 0.16)` (PathAble Blue at 16% opacity)
  - `lg`: `0px 8px 16px -2px rgba(0, 54, 92, 0.20)` (PathAble Blue at 20% opacity)
  - `xl`: `0px 12px 24px -4px rgba(0, 54, 92, 0.24)` (PathAble Blue at 24% opacity)
- **FR-007**: The package MUST export CSS custom properties for border-radius values including sm, md, and lg.
- **FR-008**: The SCSS source MUST be organized into modular partials with one partial per token category (colors, typography, spacing, elevation, radius, semantic colors).
- **FR-009**: The build script MUST compile all SCSS source into a single `dist/styles.css` file without errors.
- **FR-010**: Typography font-family tokens MUST include web-safe fallback fonts after the primary brand font.
- **FR-011**: The README.md, BRAND_RULES.md, and AGENTS.md files in `packages/styles/` MUST be included in the distributed package so that downstream projects can reference them in their agent configuration.
- **FR-012**: Structural and formatting issues in README.md, BRAND_RULES.md, and AGENTS.md MUST be corrected without changing any content. Known issues include: missing code block closing delimiter in README.md (around the Usage example), and inconsistent heading formatting in README.md (Guidance, Accessibility, License rendered as bare text instead of headings).

### Key Entities

- **Brand Color**: A named color value from the PathAble brand guide with a canonical hex value and CSS custom property name (e.g., `--pathable-blue`). Represents the fundamental brand palette.
- **Semantic Token**: A named CSS custom property that maps a functional role (background, text, link, accent, etc.) to a brand color value. Semantic tokens are the recommended consumption path for UI development.
- **Spacing Token**: A named CSS custom property representing a fixed pixel value in the spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px). Used for margins, padding, and layout gaps.
- **Typography Token**: A set of CSS custom properties including font-family (with fallbacks), font-size, line-height, and font-weight for each role in the typography scale.
- **Elevation Token**: A named CSS custom property containing a box-shadow value at a defined level (sm, md, lg, xl).
- **Radius Token**: A named CSS custom property containing a border-radius pixel value.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All brand color tokens, semantic tokens, typography tokens, spacing tokens, elevation tokens, and radius tokens defined in the requirements compile successfully into `dist/styles.css` without warnings or errors.
- **SC-002**: A consumer can import the compiled CSS file and reference every token as a CSS custom property via `var(--token-name)` with the correct brand value resolving.
- **SC-003**: The package build completes in under 10 seconds on a standard development machine.
- **SC-004**: No runtime dependencies are added to the package (zero-runtime-dependency constraint from constitution).
- **SC-005**: CSS custom properties for semantic color tokens pass WCAG AA contrast checks against their intended background tokens for normal text (minimum 4.5:1 contrast ratio). For example, `--pathable-color-text` against `--pathable-color-bg` MUST achieve at least 4.5:1.
- **SC-006**: README.md, BRAND_RULES.md, and AGENTS.md are included in the published package so downstream consumers can access them.
- **SC-007**: README.md renders correctly as markdown with no broken code blocks or unformatted section headings.

## Assumptions

- The existing `packages/styles` directory name (`styles`) is used as-is rather than renaming to `design-tokens` — renaming is a separate concern.
- `packages/styles` is the broader package workspace that will eventually include component styles, mixins, and other reusable SCSS beyond just design tokens. The current feature covers only the design token foundation; future features will add components and other artifacts within the same package.
- Dark-mode semantic token values exist in the Figma design system but are out of scope for V1. Only light-mode semantic tokens will be implemented.
- Typography scale font-size and line-height values were confirmed from Figma text layer properties (see FR-004).
- Elevation box-shadow values were confirmed from Figma effect properties (see FR-006).
- The package is consumed by web applications using modern browsers that support CSS custom properties (no IE11 support).
- Token values are static and do not derive from other tokens at the CSS custom property layer (each token resolves directly to a concrete value).
- README.md, BRAND_RULES.md, and AGENTS.md define the authoritative brand rule content. The spec defers to them on brand usage guidance. Only structural/formatting fixes are in scope; no content changes.
- The `package.json` may need a `"files"` field to ensure README.md, BRAND_RULES.md, and AGENTS.md are included in the published package.

## Clarifications

### Session 2026-07-04

- Q: The `COLOR_AND_TYPOGRAPHY_RULES.md` file (authoritative) defines alternate heading as Montserrat Bold and subheading as Poppins Bold, whereas the spec originally had these swapped. What is the correct mapping? → A: The rules file is authoritative. FR-003 updated: alternate headings = Montserrat Bold, subheadings = Poppins Bold.
- Q: Do the Figma-derived typography scale fonts (FR-004) contradict the rules file? → A: No. Figma's `ui/heading/*` with Poppins Bold maps to the Subheading role in the rules file (Poppins Bold). Figma's `ui/display/lg` with Fredoka Regular maps to the Heading role (Fredoka Regular). Body tokens (Nunito Regular) and extended tokens (label, caption with Nunito SemiBold/Regular) enhance without contradicting.
- Q: What CSS custom property names should be used for brand color tokens and semantic tokens? → A: Brand color tokens use lowercase-kebab names: `--pathable-blue`, `--intelligent-jade`, `--bright-blue-brooks`, `--tech-teal`, `--lived-in-lime`, `--shilling-silver`. Semantic tokens use shorter names with a `--pathable-` prefix: `--pathable-color-bg`, `--pathable-color-surface`, `--pathable-color-text`, `--pathable-color-text-muted`, `--pathable-color-border`, `--pathable-color-link`, `--pathable-color-accent`, `--pathable-color-focus-ring`, `--pathable-color-danger`, `--pathable-color-success`. The prior 12-token scheme with deeper nesting (e.g., `--color-bg-default`, `--color-action-primary`) is replaced by this 10-token scheme.
- Q: The three new package files (README.md, BRAND_RULES.md, AGENTS.md) consistently use a `--pathable-` prefix on semantic tokens. This contradicts the previously-clarified unprefixed naming. Which is correct? → A: The package files are authoritative. Semantic tokens now use `--pathable-` prefix throughout. FR-002, User Story 2, and SC-005 updated accordingly.
