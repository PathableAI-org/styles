# Feature Specification: Typography Storybook Section

**Feature Branch**: `021-typography-storybook`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: "The FEEDBACK.md file is a temporary file that should not be tracked in git. It contains an assessment of the repository as of spec 009 and how well it represents our brand according to our brand book. This feedback identifies a few areas of improvement that we are going to work on in separate features. This feature will add the typography section to storybook that the feedback recommends, along with any cleanup or improvements to the associated semantic / design tokens."

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Designers Validate Typography Usage (Priority: P1)

A designer wants to verify that the PathAble design system's typography is being used correctly across the product. They open Storybook and navigate to a dedicated Brand / Typography section that shows each font role (heading, alternate heading, subheading, body text) with its correct typeface, weight, and size. They can visually confirm that the system matches the brand book.

**Why this priority**: The feedback identifies typography as a key brand fidelity gap — the current Typography Utilities story only shows font-family utility classes, not the full brand typography system. This is the primary value of the feature.

**Independent Test**: Can be tested by opening Storybook, navigating to Brand / Typography, and visually confirming that the four font roles (Fredoka heading, Montserrat alternate heading, Poppins subheading, Nunito body) are displayed with correct typeface, weight, and size samples.

**Acceptance Scenarios**:

1. **Given** Storybook is running, **When** a user navigates to the Brand section, **Then** there is a "Typography" story listed under the Brand category.
2. **Given** the Brand / Typography story is open, **When** the page renders, **Then** each of the four font roles (Fredoka heading, Montserrat alternate heading, Poppins subheading, Nunito body) is displayed with a sample of the typeface, its font family declaration, weight, and intended usage description.
3. **Given** the Brand / Typography story is open, **When** viewing the type scale section, **Then** all typography scale tokens (display-lg, heading-lg, heading-md, heading-sm, body-lg, body-md, body-sm, label-md, label-sm, caption-md) are shown with their font size, line height, and font weight.

---

### User Story 2 - Developers See Long-Text Examples (Priority: P2)

A developer implementing a workflow page needs to verify that body text renders correctly at the expected size and line height. They open the Typography story and see a long-text example showing Nunito body text at the standard body-md size with correct line height, so they can visually confirm readability.

**Why this priority**: The feedback specifically calls out long text examples as a needed addition. This validates the body text configuration in a realistic context.

**Independent Test**: Can be tested by opening the Brand / Typography story and verifying that a long-text example section exists showing body text at the standard size with correct line height and font family.

**Acceptance Scenarios**:

1. **Given** the Brand / Typography story is open, **When** viewing the long text examples section, **Then** there is a paragraph of body text rendered in Nunito at the body-md size (16px, line-height 1.5).
2. **Given** the Brand / Typography story is open, **When** viewing the long text examples section, **Then** there is a paragraph of body text rendered in Nunito at the body-lg size (18px, line-height 1.5).

---

### User Story 3 - Developers Identify Typography Violations (Priority: P3)

A developer is reviewing a PR that adds typography styles. They open the Typography story and see a "Do Not Use — Typography Violations" section that demonstrates common brand violations: using heading typefaces for long text, centering body text blocks longer than 3 lines, formatting body text in all caps, and crowding text. This helps them catch violations during code review.

**Why this priority**: The feedback recommends violation examples. This is valuable for brand enforcement but is lower priority than the core typography showcase.

**Independent Test**: Can be tested by opening the Brand / Typography story and verifying that a violations section exists showing at least 3 of the documented typography violations with explanatory labels.

**Acceptance Scenarios**:

1. **Given** the Brand / Typography story is open, **When** viewing the violations section, **Then** there is a demo of Fredoka used for long body text with a "Do not use heading typeface for long text" label.
2. **Given** the Brand / Typography story is open, **When** viewing the violations section, **Then** there is a demo of centered body text longer than 3 lines with a "Do not center long body text" label.
3. **Given** the Brand / Typography story is open, **When** viewing the violations section, **Then** there is a demo of body text in all caps with a "Do not format body text in all caps" label.

---

### Edge Cases

- What happens when a custom font fails to load? The fallback font stack (system-ui, sans-serif or serif) should be visible in the story so developers can verify fallback behavior.
- How does the typography story behave when the viewport is very narrow? Text samples should wrap naturally and remain readable.
- What if Poppins (subheading) is not assigned to any USWDS role — the story should still show it as a design token since it's emitted as `--pathable-font-subheading`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Storybook MUST have a "Brand / Typography" story that displays all four PathAble font roles (Fredoka heading, Montserrat alternate heading, Poppins subheading, Nunito body text) with their typeface sample, font family declaration, weight, and intended usage.
- **FR-002**: The Brand / Typography story MUST display the full typography scale (display-lg through caption-md) with each token's font size, line height, and font weight.
- **FR-003**: The Brand / Typography story MUST include a long-text example section showing body text rendered at both body-md and body-lg sizes in Nunito.
- **FR-004**: The Brand / Typography story MUST include a typography violations section showing at least 3 documented brand violations (heading typeface for long text, centered long body text, body text in all caps).
- **FR-005**: The Brand / Typography story MUST reference the existing `--pathable-font-*` and `--ui-*` CSS custom properties as the source of truth for displayed values.
- **FR-006**: The Brand / Typography story MUST be organized under the existing "Brand" Storybook category, alongside the existing "Brand / Color Usage" story.
- **FR-007**: The existing `packages/styles/src/stories/utilities/TypographyUtilities.stories.js` file MUST remain in place as the "Utilities / Typography" story — the new Brand / Typography story is a separate, higher-level brand documentation story.
- **FR-008**: If any semantic typography tokens are missing from the existing token layer (e.g., `--pathable-typography-heading-font`, `--pathable-typography-body-size`), the system MUST add them as CSS custom properties in `_typography.scss` with appropriate role-based names.
- **FR-009**: The `FEEDBACK.md` file in the repository root MUST be removed from git tracking and/or deleted, since it is a temporary assessment file that should not be version-controlled.

### Key Entities

- **Typography Role**: A named font role in the PathAble brand system — heading (Fredoka Regular), alternate heading (Montserrat Bold), subheading (Poppins Bold), body text (Nunito Regular).
- **Typography Scale Token**: A named size in the type scale — display-lg (32px), heading-lg (24px), heading-md (20px), heading-sm (18px), body-lg (18px), body-md (16px), body-sm (14px), label-md (14px), label-sm (12px), caption-md (12px).
- **Semantic Typography Token**: A role-based CSS custom property that maps a typography concern (font, size, weight, line-height) to a named semantic role (e.g., `--pathable-typography-heading-font`, `--pathable-typography-body-size`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer or designer can open Storybook, navigate to "Brand / Typography", and see all four font roles displayed with correct typeface, weight, and intended usage — without needing to read any source code.
- **SC-002**: The Brand / Typography story shows every token in the typography scale (10 tokens: display-lg through caption-md) with its font size, line height, and weight.
- **SC-003**: Long-text examples demonstrate body text readability at both body-md and body-lg sizes with correct font family (Nunito) and line height.
- **SC-004**: At least 3 typography violations are visibly demonstrated with labels explaining why they violate brand rules.
- **SC-005**: The `FEEDBACK.md` file is no longer present in the repository (either deleted or git-ignored).

## Assumptions

- The existing Storybook setup (`@storybook/html-vite`, autodocs, a11y addon) is sufficient for the new story and does not require configuration changes.
- The new Brand / Typography story will be implemented as a `.stories.js` file alongside the existing Brand / Color Usage story at `packages/styles/src/stories/brand/`.
- The existing `_typography.scss` and `_semantic.scss` token definitions are the source of truth; any new semantic typography tokens will be added to `_typography.scss` and follow the dual-naming convention (`--pathable-*` and `--usa-*`).
- The FEEDBACK.md file is not needed for ongoing work and can be safely removed or git-ignored.
- No changes to the USWDS theme configuration (`_uswds-theme.scss`) are required for this feature.
