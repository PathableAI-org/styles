# Feature Specification: USWDS Theme Wrapper

**Feature Branch**: `003-wrap-uswds-theme`

**Created**: 2026-07-05

**Status**: Draft

**Input**: User description: "Update the packages/styles library such that it wraps USWDS while setting the theme color tokens to values that correspond to our brand color rules"

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Clarifications](#clarifications)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developers use USWDS components with brand-matched styling (Priority: P1)

A developer working on a PathAble project wants to use a standard USWDS component (e.g., button, navigation, form input) and have it automatically render with the project's brand colors — no additional overrides needed.

**Why this priority**: This is the core value of the feature — making USWDS components production-ready with the PathAble brand identity out of the box.

**Independent Test**: Can be tested by importing a USWDS component (e.g., `usa-button`) into a page. The rendered component should use brand colors (e.g., PathAble Blue for primary actions, Intelligent Jade for secondary/success states) without any manual CSS overrides.

**Acceptance Scenarios**:

1. **Given** a fresh project importing `@pathable/styles`, **When** a developer uses a USWDS `usa-button--primary` class, **Then** the button background uses the PathAble Blue brand color or the primary theme token assigned to it.
2. **Given** a fresh project importing `@pathable/styles`, **When** a developer uses USWDS utility classes like `.text-primary` or `.bg-secondary`, **Then** the rendered colors match the corresponding brand color rules.
3. **Given** the package is built, **When** the compiled CSS is inspected, **Then** all USWDS theme color variables (`$theme-color-*`) that have explicit brand mappings are set to system tokens that correspond to PathAble brand colors. Theme tokens that have no brand mapping (e.g., unused grades set to `false`) are excluded. USWDS default values for unmapped tokens are expected and acceptable.

---

### User Story 2 - Designers verify brand alignment in USWDS components (Priority: P2)

A designer inspects a rendered USWDS component (e.g., alert banners, form validation states) in a development environment and confirms that interactive and state-driven colors (focus rings, error states, success states) match the project's semantic color tokens.

**Why this priority**: Design confidence in the implementation reduces back-and-forth and ensures the product feels cohesive.

**Independent Test**: Can be tested by rendering USWDS components with state modifiers (`.usa-alert--error`, `.usa-input--success`) and verifying the colors match the defined semantic tokens (danger, success, focus ring).

**Acceptance Scenarios**:

1. **Given** a USWDS form input with an error state, **When** the input renders, **Then** its border and error message color match the defined danger color (currently `#dc3545`).
2. **Given** a USWDS component in focus, **When** the focus ring is visible, **Then** the focus ring color matches the defined focus ring token (Bright Blue Brooks `#4899e8`).
3. **Given** a USWDS success alert, **When** it renders, **Then** its background and icon colors use the success color (Intelligent Jade `#1cae96`).

---

### User Story 3 - Upstream USWDS updates integrate without breaking brand colors (Priority: P3)

When the USWDS dependency is updated to a new minor or patch version, the project's compiled styles should still apply the correct brand colors without manual intervention.

**Why this priority**: Long-term maintainability and trust in the dependency — the team should not need to re-map brand colors on every USWDS version bump.

**Independent Test**: Can be tested by upgrading the USWDS package version in `package.json`, rebuilding, and verifying the theme color tokens still resolve to the expected system token values.

**Acceptance Scenarios**:

1. **Given** the project uses a specific USWDS version, **When** USWDS is upgraded to a compatible newer version, **Then** the theme color variable assignments remain intact.
2. **Given** the theme configuration is defined in a single settings file, **When** USWDS is updated, **Then** no brand color values change unless explicitly edited in that settings file.

---

### Edge Cases

- A developer attempts to use a USWDS component whose associated theme color token was set to `false` (unused): the component should fall back gracefully (e.g., to the base color family) rather than producing invalid CSS.
- A brand color (e.g., Lived-in Lime `#d3ff66`) has no close equivalent in the USWDS 24-color system palette: the closest matching system token should be used, and the discrepancy documented so designers are aware.
- The USWDS package is not yet installed as a dependency: the build should fail with a clear error message rather than silently producing broken output.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `packages/styles` package MUST add USWDS v3.x (latest stable) as a dependency and provide a settings layer that configures USWDS theme color tokens before the USWDS source is compiled.
- **FR-002**: The settings layer MUST define values for each of the five USWDS theme color families — `base`, `primary`, `secondary`, `accent-warm`, and `accent-cool` — using USWDS system color tokens that correspond to PathAble brand colors according to the following mapping:
  - **Primary family** → PathAble Blue (`#00365c`)
  - **Secondary family** → Intelligent Jade (`#1cae96`)
  - **Accent-cool family** → Bright Blue Brooks (`#4899e8`)
  - **Accent-warm family** → Lived-in Lime (`#d3ff66`)
  - **Base family** → Shilling Silver (`#dde2e8`) plus USWDS gray system tokens for the remaining neutral grades
  - **Tech Teal** (`#015a76`) has no dedicated theme family; it MUST be mapped to a specific grade within an existing family (e.g., a primary-dark or base-dark grade) and that assignment MUST be documented in the settings file.
- **FR-003**: At minimum, the following theme color grades MUST be configured per family (others may be left at USWDS defaults or set to `false`):
  - `base`: `lightest`, `lighter`, `light`, `base` (default), `dark`, `darker`, `darkest`, `ink`
  - `primary`: `lighter`, `light`, `base` (default), `vivid`, `dark`, `darker`
  - `secondary`: `lighter`, `light`, `base` (default), `vivid`, `dark`, `darker`
  - `accent-warm`: `lighter`, `light`, `base` (default), `dark`, `darker`
  - `accent-cool`: `lighter`, `light`, `base` (default), `dark`, `darker`
- **FR-004**: The existing brand color SCSS variables and CSS custom properties (defined in `_colors.scss` and `_semantic.scss`) MUST continue to be exported alongside the USWDS theme configuration, ensuring backward compatibility for consumers that reference `$pathable-*` variables or `--pathable-*` custom properties. Brand color variables (`$pathable-blue`, `$intelligent-jade`, etc. in `_colors.scss`) MUST reference the corresponding USWDS theme tokens (e.g., `$pathable-blue: $theme-color-primary`) so that a single value change propagates to both systems. Semantic/functional tokens (`$pathable-color-danger`, `$pathable-color-success`, etc. in `_semantic.scss`) SHOULD reference USWDS tokens where a suitable equivalent exists but MAY remain hardcoded where no good USWDS mapping is available. Full `--pathable-*` to `--uswds-*` aliasing at the CSS custom property level is out of scope for this feature.
- **FR-005**: USWDS state/utility color tokens (`error`, `warning`, `success`, `info`, `disabled`, `visited`) MUST be configured to match the existing semantic color tokens (danger → `#dc3545`, success → Intelligent Jade `#1cae96`, focus ring → Bright Blue Brooks `#4899e8`).
- **FR-006**: The compiled output CSS in `dist/styles.css` MUST include the configured USWDS theme tokens and system token variables alongside the existing PathAble brand and semantic tokens. USWDS component styles MUST NOT be compiled into the output; consumers who need USWDS components MUST add USWDS as their own dependency and import components separately.
- **FR-007**: The package MUST NOT change its public API — consumers importing `@pathable/styles` and using the existing `$pathable-*`, `--pathable-*` tokens should see no behavioral change.
- **FR-008**: USWDS theme token overrides MUST be scoped within a single configuration file/mixin so that future USWDS upgrades require editing only that file.

### Key Entities

- **USWDS System Color Token**: One of the 24 color families (e.g., `blue-warm-50v`, `gray-cool-10`) each with grades 5–90 that form the complete USWDS color palette. Theme tokens reference these by string name.
- **USWDS Theme Color Token**: A role-based color variable (e.g., `$theme-color-primary`, `$theme-color-base-lightest`) that defines the color of a functional area. Set to a system token string or `false`.
- **Brand Color**: One of the six PathAble brand colors (PathAble Blue, Intelligent Jade, Bright Blue Brooks, Tech Teal, Lived-in Lime, Shilling Silver) that must be mapped to the closest USWDS system token equivalents.
- **Semantic Color Token**: A functional color role (e.g., `$pathable-color-danger`, `$pathable-color-success`) that maps brand colors to UI contexts. These must remain consistent and also inform USWDS state tokens.
- **Settings File**: A single SCSS file that configures `$theme-color-*` variables before the `@use 'uswds-core'` import.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All six PathAble brand colors are assigned to at least one USWDS theme color token. A reviewer can trace each brand color to its USWDS system token equivalent in the settings file.
- **SC-002**: A consumer who adds `@pathable/styles` and imports USWDS components as a separate dependency can render common USWDS components (button, form input, alert) with PathAble brand colors appearing correctly — no additional CSS overrides beyond the two imports required.
- **SC-003**: WCAG AA contrast ratios are maintained or improved for all primary and secondary text-on-background combinations in the configured theme, leveraging USWDS's built-in accessible contrast system.
- **SC-004**: Existing consumers of `@pathable/styles` can upgrade without changing their usage — the `$pathable-*` SCSS variables and `--pathable-*` CSS custom properties remain unchanged.
- **SC-005**: The USWDS version can be bumped in `package.json` and a rebuild produces no unexpected color changes — only the settings file needs review.

## Clarifications

### Session 2026-07-05

- Q: Which USWDS theme color family does each PathAble brand color map to? → A: Primary family = PathAble Blue (#00365c), Secondary family = Intelligent Jade (#1cae96), Accent-cool family = Bright Blue Brooks (#4899e8), Base family = Shilling Silver (#dde2e8) plus the USWDS gray system tokens for remaining neutral grades, Accent-warm family = Lived-in Lime (#d3ff66). Tech Teal (#015a76) does not have a dedicated theme family — it will be mapped as a specific grade within an existing family (likely a primary or base dark grade) and documented in the settings file.
- Q: Should the compiled output include full USWDS component styles or only token definitions? → A: Tokens only — the compiled `dist/styles.css` will include USWDS theme/system token configuration plus the existing PathAble brand and semantic tokens. USWDS components will not be compiled into the output; consumers import USWDS components separately via their own USWDS dependency.
- Q: How should hover, active, and focus-visible states be handled for brand-colored elements? → A: Use USWDS built-in color calculations for hover/active states initially. During implementation, visually review outcomes for dark-primary (PathAble Blue) hover states; override specific grades with explicitly chosen brand-aligned colors only where review identifies visually unappealing results.
- Q: Which USWDS version should be targeted? → A: Latest stable USWDS v3.x.
- Q: How should existing $pathable-* SCSS variables be updated for backward compatibility? → A: Brand color variables ($pathable-blue, $intelligent-jade, etc. in _colors.scss) MUST reference corresponding $theme-color-* variables. Semantic/functional tokens ($pathable-color-danger, $pathable-color-success, etc. in _semantic.scss) SHOULD reference USWDS tokens where a suitable equivalent exists but MAY remain hardcoded where no good USWDS mapping is available (e.g., #dc3545 for danger).

## Assumptions

- The six PathAble brand colors will be mapped to the closest USWDS system tokens using a tool such as the CivicActions USWDS Color Tool, rather than requiring exact hex matches. Minor perceptual differences are acceptable and will be documented.
- The existing `_colors.scss` and `_semantic.scss` files will be preserved in full — no existing tokens will be removed, renamed, or altered.
- USWDS state tokens (`error`, `warning`, `success`, `info`) will reuse the existing semantic token values (e.g., `#dc3545` for danger/error, `#1cae96` for success) mapped to the closest USWDS system tokens.
- The `ink` theme token (used for text color) will be set to the PathAble Blue equivalent, as it is the current primary text color.
- Non-color USWDS theme tokens (typography, spacing, breakpoints) are out of scope for this feature and will continue to use their USWDS defaults.
- A future feature will expose a consistent `--pathable-*` CSS custom property interface that aliases to `--uswds-*` tokens in most cases. That future aliasing is NOT covered by this feature, but backward compatibility around the existing `$pathable-*` variable names should inform planning.
- USWDS will be installed as a `dependencies` (not `devDependencies`) entry in `packages/styles/package.json`.