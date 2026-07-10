# Feature Specification: Storybook Workflow-Context Refinement

**Feature Branch**: `013-storybook-workflow-refinement`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: "Storybook workflow-context refinement: Replace generic Storybook component copy with Pathable/CoachBridge workflow examples, add per-story interaction model notes, fix Nunito serif fallback to sans-serif, decide status of short brand custom properties"

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Component Stories Reflect Disability-Employment Workflows (Priority: P1)

As a product designer or engineer building PathAble/CoachBridge interfaces, I want all Storybook component examples to use realistic disability-employment workflow labels and copy so that I can immediately see how each component fits into participant profiles, coaching sessions, support activities, compliance artifact review, goal progress, and approval workflows.

**Why this priority**: The primary purpose of this styles package is to serve PathAble/CoachBridge products. Generic USWDS examples undermine that purpose, making it harder for engineers and agents to choose the right component and apply it correctly in context.

**Independent Test**: A reviewer can open each affected Storybook story and verify that all visible text (labels, headings, options, button text, placeholder copy) uses Pathable/CoachBridge workflow terminology instead of generic placeholder text.

**Acceptance Scenarios**:

1. **Given** the Header story, **When** I view it in Storybook, **Then** the navigation items use product-specific labels (e.g., "Participants", "Coaching Sessions", "Support Activities", "Compliance") instead of "Nav Item 1", "Nav Item 2".
2. **Given** the Banner story, **When** I view it in Storybook, **Then** the banner copy reflects Pathable-relevant contexts (e.g., coaching session reminders, compliance notifications, goal milestones) instead of USWDS-native government website copy.
3. **Given** the Combo Box story, **When** I view it in Storybook, **Then** the options use realistic data (e.g., participant names, support activity types, goal categories) instead of "Option 1", "Option 2", "Option 3".
4. **Given** the Modal story, **When** I view it in Storybook, **Then** the modal title and body copy reflect product workflows (e.g., "Add Support Activity", "Confirm Goal Approval", "Edit Coaching Note") instead of "Modal Title" and generic confirm/cancel.
5. **Given** any affected story, **When** I inspect the rendered component, **Then** visual styling is unchanged from the current USWDS theme and brand rules (only copy and context labels are updated).

---

### User Story 2 - Every Story Documents Its Interaction Model (Priority: P2)

As an engineer integrating these components into CoachBridge (which uses Vue/Nuxt), I want each story to include explicit notes about the component's interaction model so that I know whether it is CSS-only, requires USWDS JavaScript, requires app-owned state, or is not yet behavior-complete.

**Why this priority**: Several stories already note that USWDS JavaScript is needed, but the information is not systematic. Without clear interaction-model documentation, engineers risk assuming the SCSS wrapper provides behavior, validation, and focus management that the wrapper does not supply.

**Independent Test**: A reviewer can verify that each affected story includes a standardized interaction-model section in its documentation, and that the content accurately reflects the component's actual behavior requirements.

**Acceptance Scenarios**:

1. **Given** any component story, **When** I view its documentation section in Storybook, **Then** it includes a clearly labeled "Interaction Model" section with one of the following values: "CSS-only", "Requires USWDS JS", "Requires app-owned state", or "Not yet behavior-complete".
2. **Given** a component story marked "Requires USWDS JS", **When** I read the notes, **Then** it explicitly states that consumers should import `@pathable/styles/js` and describes what behaviors the JS provides.
3. **Given** a component story marked "Requires app-owned state", **When** I read the notes, **Then** it describes what state the consuming application must manage (e.g., open/closed, selected values, validation errors).

---

### User Story 3 - Add Workflow-Intent Button Variant Aliases (Priority: P3)

As an AI coding agent or engineer building PathAble UI, I want button wrappers to include workflow-intent semantic aliases (e.g., `--save`, `--continue`, `--review`, `--destructive`, `--low-emphasis`) so that I can choose buttons based on user intent rather than needing to understand the underlying USWDS variant system.

**Why this priority**: The feedback notes that agents are much more likely to choose `--save` or `--review` correctly than `--accent-cool`. This improves safety and consistency in agent-generated UI.

**Independent Test**: A developer can inspect the button wrapper SCSS and verify the new variant classes exist, then load Storybook to confirm each renders with the correct visual treatment.

**Acceptance Scenarios**:

1. **Given** the button wrapper SCSS file, **When** I search for workflow-intent class names, **Then** `.pathable-button--save`, `.pathable-button--continue`, `.pathable-button--review`, `.pathable-button--destructive`, and `.pathable-button--low-emphasis` all exist.
2. **Given** any workflow-intent button variant, **When** I view it in Storybook, **Then** it renders with a visually appropriate treatment that does not violate the brand color rules or accessibility contrast requirements.
3. **Given** an existing USWDS button variant, **When** I use a workflow-intent alias, **Then** it maps to the correct underlying USWDS variant (e.g., `--destructive` maps to the destructive/error color treatment).

---

### User Story 4 - Fix Nunito Font Fallback (Priority: P2)

As a developer consuming `@pathable/styles` in a product, I want the body font stack to end with `sans-serif` instead of `serif` so that fallback rendering is visually compatible with Nunito, which is itself a rounded sans-serif typeface.

**Why this priority**: This is a straightforward bug fix. The current `serif` fallback creates a jarring visual mismatch in environments where Nunito fails to load.

**Independent Test**: A developer can inspect the `$pathable-font-body` Sass variable and confirm the value ends with `sans-serif`.

**Acceptance Scenarios**:

1. **Given** the typography settings file, **When** I read the `$pathable-font-body` variable, **Then** its value ends with `sans-serif` instead of `serif`.
2. **Given** the Storybook typography examples, **When** I inspect rendered body text, **Then** the font-family stack reflects the corrected fallback.

---

### User Story 5 - Clarify Brand Custom Property Public API (Priority: P3)

As a consumer of `@pathable/styles`, I want clear documentation about which CSS custom properties are part of the public API and which are legacy aliases, so that I know which properties to use in new code and which are deprecated.

**Why this priority**: The feedback identified that `_colors.scss` currently emits both un-prefixed brand custom properties (`--pathable-blue`) and newer prefixed primitives (`--pathable-brand-pathable-blue`). Without explicit guidance, consumers may use the wrong ones.

**Independent Test**: A developer can read the `_colors.scss` file and/or BRAND_RULES.md and find a clear statement about which properties are the canonical API, plus a deprecation notice for the legacy aliases.

**Acceptance Scenarios**:

1. **Given** the `_colors.scss` file, **When** I read the comments and variable declarations, **Then** there is a clear statement designating either the short names or the prefixed names as the public API.
2. **Given** the deprecated property names, **When** I inspect them, **Then** they are annotated with a deprecation comment directing consumers to the replacement.
3. **Given** the BRAND_RULES.md or README documentation, **When** I read the section on CSS custom properties, **Then** it documents the canonical property names and notes any legacy aliases.

---

### Edge Cases

- What happens when a component (e.g., Combo Box) requires JavaScript for full functionality but the Storybook story is rendered in a CSS-only documentation context? The stories should note the interaction model accurately.
- How should workflow-intent button aliases interact with USWDS variant overrides when both are applied to the same element? Should one take precedence?
- What if a consumer has already used the legacy short brand custom properties in production code? The deprecation strategy must account for backward compatibility during a transition period.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Header story MUST use Pathable/CoachBridge navigation labels (e.g., "Participants", "Coaching Sessions", "Support Activities", "Compliance") instead of "Site Title", "Nav Item 1", etc.
- **FR-002**: The Banner story MUST use Pathable-relevant contexts (coaching reminders, compliance notifications, goal milestones) instead of USWDS-native government website copy.
- **FR-003**: The Combo Box story MUST use realistic disability-employment workflow options (participant names, activity types, goal categories) instead of "Option 1", "Option 2", "Option 3".
- **FR-004**: The Modal story MUST use Pathable/CoachBridge workflow copy (e.g., "Add Support Activity", "Confirm Goal Approval") instead of "Modal Title" and generic confirm/cancel.
- **FR-005**: All affected stories MUST preserve existing visual styling and theming — only copy/labels and documentation notes may change.
- **FR-006**: Each component story MUST include a standardized "Interaction Model" section in its documentation with one of: "CSS-only", "Requires USWDS JS", "Requires app-owned state", or "Not yet behavior-complete".
- **FR-007**: Stories marked "Requires USWDS JS" MUST include a note that consumers should import `@pathable/styles/js` and describe what behaviors the JS provides.
- **FR-008**: The `$pathable-font-body` Sass variable MUST be updated so its font stack ends with `sans-serif` instead of `serif`.
- **FR-009**: The button wrapper MUST include workflow-intent semantic alias classes: `.pathable-button--save`, `.pathable-button--continue`, `.pathable-button--review`, `.pathable-button--destructive`, `.pathable-button--low-emphasis`.
- **FR-010**: Each workflow-intent button variant MUST map to an appropriate underlying USWDS or brand color treatment that satisfies WCAG 2.1 AA contrast requirements.
- **FR-011**: The `_colors.scss` file MUST declare whether the short un-prefixed brand custom properties or the newer `--pathable-brand-*` prefixed properties are the canonical public API.
- **FR-012**: Any deprecated brand custom properties MUST be annotated with a deprecation comment directing consumers to the replacement property.
- **FR-013**: The Button story in Storybook MUST include examples of each new workflow-intent variant with realistic labels (e.g., "Save Coaching Note", "Continue to Review", "Mark Complete", "Delete Activity", "Cancel").
- **FR-014**: Stories that require `@pathable/styles/js` MUST document the exact set of USWDS JavaScript behaviors the component depends on.

### Key Entities

- **Storybook stories**: Individual `.stories.js` files under `packages/styles/src/stories/` that demonstrate component usage.
- **Button wrapper variants**: CSS classes that extend `.usa-button` with PathAble-specific semantic opinions.
- **Brand CSS custom properties**: The `--pathable-*` and `--pathable-brand-*` CSS custom properties defined in `_colors.scss`.
- **Interaction model annotations**: Structured documentation notes identifying how much behavior each component wrapper provides.
- **Typography variables**: Sass variables (`$pathable-font-body`, etc.) that define the font stack.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All generic placeholder copy in Header, Banner, Combo Box, and Modal stories is replaced with Pathable/CoachBridge workflow-specific content.
- **SC-002**: Every component story in Storybook includes a standardized Interaction Model section that clearly documents its behavior requirements.
- **SC-003**: The `$pathable-font-body` variable value ends with `sans-serif`, confirmed by visual inspection and Sass compilation.
- **SC-004**: Five new workflow-intent button variant classes exist, each rendering with appropriate brand styling that meets WCAG 2.1 AA contrast.
- **SC-005**: A clear deprecation strategy for brand custom properties is documented in `_colors.scss` and/or `BRAND_RULES.md`, making the public API unambiguous.
- **SC-006**: An engineer unfamiliar with the codebase can open any component story and correctly determine, within 30 seconds, what behavior they need to provide.

## Assumptions

- Existing USWDS component wrappers (`.pathable-button`, etc.) remain structurally unchanged — only stories and documentation are updated.
- The Button story already contains workflow-specific labels ("Save Coaching Note", etc.); only workflow-intent variants need to be added to that story.
- The `$pathable-font-body` variable is the single source of truth for body font-family throughout the package.
- Brand color values themselves do not change — only the naming/aliasing conventions for CSS custom properties are addressed.
- The Storybook environment is running locally with `pnpm storybook` as defined in the project's root `package.json` scripts.
- Workflow-intent button aliases may be implemented as Sass mixins or additional classes that extend existing USWDS variants, at the implementer's discretion.
- The deprecation of short brand custom property names does not require removing them — only annotating them and directing consumers to the canonical names.
