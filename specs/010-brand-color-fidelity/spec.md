# Feature Specification: Brand Color Fidelity & Token Architecture

**Feature Branch**: `010-brand-color-fidelity`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: "The FEEDBACK.md file is a temporary file that should not be tracked in git. It contains an assessment of the repository as of spec 009 and how well it represents our brand according to our brand book. This feedback identifies a few areas of improvement that we are going to work on in separate features. This feature should address the colors: fix the issues described in Main brand fidelity concerns and the token architecture feedback section. It should also add the recommended 'Brand / Color Usage' Storybook section."

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Design System Maintainer Documents Brand Color Fidelity (Priority: P1)

A design system maintainer or stakeholder wants to understand why the colors in Storybook differ from the official brand book. They need clear documentation of the exact brand hex values, their USWDS mapped equivalents, and the perceptual difference (ΔE) between them. This documentation is surfaced in Storybook so anyone comparing the two can understand the tradeoffs.

**Why this priority**: Brand fidelity is the core concern. Without explicit documentation of the brand-to-USWDS mapping, stakeholders may incorrectly conclude the design system does not represent the brand accurately. This is the foundation that the rest of the color work builds on.

**Independent Test**: Can be fully tested by viewing the Brand / Color Usage page in Storybook and confirming that all six brand colors are listed with their exact hex values, USWDS token names, mapped hex values, ΔE values, and a clear explanation of the mapping tradeoff.

**Acceptance Scenarios**:

1. **Given** the Storybook documentation site is running, **When** a user navigates to the Brand / Color Usage section, **Then** they see all six brand color names with their exact hex values, USWDS system token names, mapped hex values, and ΔE perceptual distances.
2. **Given** the Brand / Color Usage page is displayed, **When** a user reads the color fidelity section, **Then** they see an explicit statement that the design system preserves brand semantics through USWDS token mapping rather than exact brand reproduction.
3. **Given** a user views any component story, **When** they inspect the rendered colors, **Then** the colors match the USWDS mapped values documented in Brand / Color Usage (not the exact brand hex values).

---

### User Story 2 - Component Developer Uses Expanded Semantic Tokens (Priority: P1)

A component developer building Pathable workflow UI needs to use semantic color tokens for action buttons, status indicators, and workflow states. They should not need to hardcode colors or reference brand colors directly. The expanded semantic token set provides role-based tokens for actions, statuses, and workflow states.

**Why this priority**: The FEEDBACK.md identifies the current semantic token set as too small for real app UI. Expanded tokens are a prerequisite for building workflow components without hardcoding colors.

**Independent Test**: Can be fully tested by inspecting the emitted CSS custom properties from the `@pathable/styles` package and confirming that all new role-based semantic tokens are present with correct color values.

**Acceptance Scenarios**:

1. **Given** the `@pathable/styles` package is built, **When** a developer inspects the compiled CSS, **Then** they find action role tokens (`--pathable-color-action-primary-bg`, `--pathable-color-action-primary-text`, `--pathable-color-action-secondary-bg`, `--pathable-color-action-secondary-text`) with appropriate color values.
2. **Given** the `@pathable/styles` package is built, **When** a developer inspects the compiled CSS, **Then** they find status role tokens (`--pathable-color-status-success-bg`, `--pathable-color-status-success-text`, `--pathable-color-status-warning-bg`, `--pathable-color-status-warning-text`, `--pathable-color-status-danger-bg`, `--pathable-color-status-danger-text`) with appropriate color values.
3. **Given** the `@pathable/styles` package is built, **When** a developer inspects the compiled CSS, **Then** they find workflow state tokens (`--pathable-color-workflow-active`, `--pathable-color-workflow-complete`, `--pathable-color-workflow-blocked`) with appropriate color values.
4. **Given** the existing semantic tokens, **When** a developer checks for backward compatibility, **Then** all existing tokens (`--pathable-color-bg`, `--pathable-color-surface`, `--pathable-color-text`, etc.) remain unchanged in name and value.

---

### User Story 3 - Designer Reviews Brand Compliance in Storybook (Priority: P2)

A designer or brand stakeholder wants to verify that the design system's color usage aligns with the brand book. They visit the Storybook Brand / Color Usage section to see approved pairings, failed pairings, and contrast warnings. This gives them confidence that the design system respects brand guidelines.

**Why this priority**: Brand compliance is a quality gate. The Brand / Color Usage section makes compliance visible and verifiable without requiring a design audit of every component.

**Independent Test**: Can be fully tested by viewing the Brand / Color Usage page and confirming it contains approved pairings, contrast warnings, and an explicit "do not use" section for problematic combinations.

**Acceptance Scenarios**:

1. **Given** the Brand / Color Usage page in Storybook, **When** a user scrolls to the color pairings section, **Then** they see a table of approved foreground-background pairs with contrast ratio information.
2. **Given** the Brand / Color Usage page, **When** a user scrolls to the pairings section, **Then** they see explicitly flagged "do not use" pairings (e.g., Intelligent Jade on white with small text, Bright Blue Brooks on white with small text).
3. **Given** the Brand / Color Usage page, **When** a user views the semantic tokens section, **Then** they see each semantic token name, its resolved color value, and its intended role.

---

### Edge Cases

- What happens if a brand color value is later updated? The documentation in Brand / Color Usage must be updated in tandem with the source of truth.
- How does the system handle tokens that reference the same color value (e.g., success and accent both using Intelligent Jade)? The documentation should make these relationships clear.
- What happens when a new semantic token is needed that isn't in the initial set? The token naming convention should be documented so new tokens follow the same pattern.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The design system MUST emit exact brand hex values as CSS custom properties (e.g., `--pathable-brand-pathable-blue: #00365c`, `--pathable-brand-intelligent-jade: #1cae96`, etc.) for all six brand colors, in addition to the existing USWDS-mapped tokens.
- **FR-002**: The `_colors.scss` file MUST be updated to expose both the USWDS-mapped values and the exact brand hex values, with clear naming to distinguish them.
- **FR-003**: The `_semantic.scss` file MUST be expanded to include action role tokens: `--pathable-color-action-primary-bg`, `--pathable-color-action-primary-text`, `--pathable-color-action-secondary-bg`, `--pathable-color-action-secondary-text`.
- **FR-004**: The `_semantic.scss` file MUST be expanded to include status role tokens: `--pathable-color-status-success-bg`, `--pathable-color-status-success-text`, `--pathable-color-status-warning-bg`, `--pathable-color-status-warning-text`, `--pathable-color-status-danger-bg`, `--pathable-color-status-danger-text`.
- **FR-005**: The `_semantic.scss` file MUST be expanded to include workflow state tokens: `--pathable-color-workflow-active`, `--pathable-color-workflow-complete`, `--pathable-color-workflow-blocked`.
- **FR-006**: All existing semantic tokens MUST retain their names and values. The expansion MUST be backward-compatible.
- **FR-007**: A new Storybook page MUST be created under a "Brand" section titled "Brand / Color Usage" that documents:
  - The six brand colors with exact hex values, USWDS token names, mapped hex values, and ΔE values.
  - A clear statement explaining the mapping tradeoff: the design system preserves brand semantics through USWDS token mapping, not exact brand reproduction.
  - The expanded semantic tokens organized by category (general, action, status, workflow).
  - Approved color pairings with contrast ratio information.
  - Failed or "do not use" pairings with contrast warnings.
- **FR-008**: The Brand / Color Usage page MUST visually demonstrate the color difference between exact brand hex values and USWDS mapped values (e.g., side-by-side swatches).
- **FR-009**: The brand color names MUST be preserved in all documentation (Intelligent Jade, PathAble Blue, Bright Blue Brooks, Tech Teal, Lived-In Lime, Shilling Silver).
- **FR-010**: The `_semantic.scss` file MUST document the intended role of each new token in comments.

### Key Entities

- **Brand Color Tokens (`_colors.scss`)**: The source of truth for brand color CSS custom properties. Currently emits USWDS-mapped values; will be expanded to also emit exact brand hex values under a `--pathable-brand-*` namespace.
- **Semantic Tokens (`_semantic.scss`)**: The source of truth for semantic color CSS custom properties. Currently includes general-purpose tokens; will be expanded to include action, status, and workflow role tokens.
- **Brand / Color Usage Storybook Page**: A new documentation page under a "Brand" Storybook section that serves as the visual reference for brand color fidelity, semantic tokens, and approved pairings.
- **Brand Color Mapping Table**: The documented relationship between each brand color, its exact hex value, its USWDS token, and its mapped hex value (currently in BRAND_RULES.md, now also surfaced in Storybook).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All six brand colors are emitted as both exact hex values (`--pathable-brand-*`) and USWDS-mapped values (`--pathable-*`), visible in the compiled CSS output.
- **SC-002**: The expanded semantic token set includes at least 10 new tokens (action, status, workflow) beyond the current 10 tokens, for a total of at least 20 semantic color tokens.
- **SC-003**: A Brand / Color Usage page exists in Storybook under a "Brand" section and covers all five content areas: exact brand colors, USWDS mapping, semantic tokens, approved pairings, and failed pairings.
- **SC-004**: A stakeholder can compare the Brand / Color Usage page against the brand book PDF and understand why colors differ, without needing to read source code.
- **SC-005**: All existing component stories continue to render with the same colors as before — no visual regressions from the token expansion.
- **SC-006**: The brand-to-USWDS mapping tradeoff is explicitly stated in the Brand / Color Usage page in plain language that non-technical stakeholders can understand.

## Assumptions

- The exact brand hex values will be emitted as a new `--pathable-brand-*` CSS custom property namespace (e.g., `--pathable-brand-pathable-blue`, `--pathable-brand-intelligent-jade`) to distinguish them from the USWDS-mapped `--pathable-*` tokens.
- The new semantic tokens will use the existing USWDS-mapped color values (not exact brand hex values), consistent with the current design system approach — the Brand / Color Usage page will document this choice.
- New action role tokens will use PathAble Blue for primary actions and Intelligent Jade or Bright Blue Brooks for secondary actions, consistent with the brand hierarchy rules.
- New status tokens will use Intelligent Jade for success, gold for warning, and the existing danger color for error, with appropriate background/text pairings.
- New workflow tokens will use semantically appropriate colors: active (PathAble Blue or Bright Blue Brooks), complete (Intelligent Jade), blocked (danger/warning).
- The Brand / Color Usage page will be an HTML Storybook story (not a MDX page), consistent with the existing story format.
- The existing `_colors.scss` and `_semantic.scss` file structure will be preserved — new tokens will be added to the existing files, not moved to separate files.
- Brand color name aliases (e.g., `--pathable-blue`, `--intelligent-jade`) will be preserved for backward compatibility.
