# Feature Specification: Structured Wizard and Guided Workflow Compositions

**Feature Branch**: `026-wizard-workflow-compositions`
**Created**: 2026-07-11
**Status**: Draft
**Input**: User description: "create a feature to address issue #35. Ignore any recommended file names and focus on the behavior described and acceptance criteria"

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Staff Completes a Multi-Step Wizard Form (Priority: P1)

A staff member needs to complete a multi-step intake or registration process. The wizard clearly shows which step they are on, which steps they have completed, and what comes next. They can navigate forward and backward, see validation feedback, and submit the entire form at the final step.

**Why this priority**: The wizard composition is the primary interaction pattern. Delivering it first provides immediate value for any multi-step process, and it is the more common workflow in admin and staff tools.

**Independent Test**: Can be fully tested by rendering a multi-step form layout with step indicator, page heading, form content area, and action footer, then verifying that navigation actions and validation states render correctly without any state machine or routing.

**Acceptance Scenarios**:

1. **Given** a multi-step wizard with at least three steps, **When** a wizard is rendered, **Then** the current step, completed steps, and upcoming steps are all visually distinguishable without relying on color alone.
2. **Given** a wizard with a current step displayed, **When** the user navigates forward, **Then** the step indicator updates to show the previous step as completed and the next step as current.
3. **Given** a form with validation errors on the current step, **When** the user attempts to navigate forward, **Then** a validation summary is displayed and an accessible mechanism explains moving focus to the validation summary or page heading.
4. **Given** a wizard action footer, **When** rendered, **Then** it contains back, continue, save-and-exit, and (on the final step) final-submit actions in documented positions.
5. **Given** a wizard on a mobile viewport, **When** the step indicator would overflow, **Then** a compact current-step summary is displayed instead of the full horizontal stepper.

---

### User Story 2 - Staff Completes a Structured Workflow/Session (Priority: P1)

A staff member working with a person or record can see the current context (who or what they are working on), the objective, a structured prompt or instruction, an area to record observations or notes, a progress indicator, and completion actions. The layout is suitable for mobile-first use.

**Why this priority**: The workflow panel is equally critical and serves a complementary purpose to the wizard. Both are P1 because they address distinct use cases that together cover the core scope of the feature.

**Independent Test**: Can be fully tested by rendering a workflow composition with context header, objective, prompt/instruction, note input, progress indicator, and actions, then verifying spacing, visual distinction between prompt and entered text, and state-specific rendering (loading, saving, saved, offline, error, completed).

**Acceptance Scenarios**:

1. **Given** a workflow composition, **When** rendered, **Then** it includes a context header, objective, current activity, prompt/instruction region, observation/note input region, progress/save-status region, and completion action buttons.
2. **Given** a workflow with a prompt and user-entered notes, **When** both are displayed simultaneously, **Then** the prompt content and user-entered notes are visually distinct.
3. **Given** a workflow panel, **When** it is in a loading state, **Then** a loading indicator or skeleton is displayed.
4. **Given** a workflow panel, **When** it is in a saving state, **Then** a saving indicator is displayed.
5. **Given** a workflow panel, **When** save is complete, **Then** a "saved" confirmation is displayed.
6. **Given** a workflow panel, **When** the consuming application indicates an offline state, **Then** an offline banner or indicator is displayed.
7. **Given** a workflow panel, **When** validation errors are present, **Then** a validation-error state is displayed.
8. **Given** a workflow panel, **When** the workflow is marked as completed, **Then** a completion summary state is displayed.
9. **Given** a workflow panel, **When** any of the above states are displayed, **Then** the status is communicated through text or icons in addition to color.

---

### User Story 3 - Developer Integrates Compositions (Priority: P2)

A developer picks up these compositions and integrates them into an application. The compositions have clear visual and structural contracts with documented class names or selectors, usage examples, and stories covering desktop, mobile, validation-error, offline, and completed states.

**Why this priority**: Integration guidance and comprehensive documentation are necessary for adoption but are secondary to the core visual and structural contracts being correct.

**Independent Test**: Can be fully tested by importing the composition styles selectively (individual imports) and as an all-in-one import, then verifying that both strategies compile without errors and render correctly.

**Acceptance Scenarios**:

1. **Given** the composed styles, **When** imported selectively (individual component imports), **Then** the build compiles successfully.
2. **Given** the composed styles, **When** imported as an all-in-one bundle, **Then** the build compiles successfully.
3. **Given** Storybook stories for the compositions, **When** viewed, **Then** they include desktop, mobile, validation-error, offline, and completed examples.
4. **Given** documentation for the compositions, **When** read, **Then** it includes minimum-necessary display guidance for sensitive records and warns against placing sensitive data in decorative examples.
5. **Given** Storybook stories, **When** inspected, **Then** they use synthetic data only (no real person or record information).

---

### User Story 4 - Developer Divides Long Forms (Priority: P3)

A developer working with a long form can divide it into clearly titled sections without nesting those sections inside excessive card containers. The form structure remains clean and scannable.

**Why this priority**: This is a refinement of the wizard composition and is less critical than the core wizard and workflow patterns.

**Independent Test**: Can be fully tested by rendering a long form with multiple titled sections and verifying that each section has a clear heading and that cards are not unnecessarily nested.

**Acceptance Scenarios**:

1. **Given** a long form with multiple sections, **When** rendered, **Then** each section has a clear title heading.
2. **Given** a long form with multiple sections, **When** rendered in a wizard step, **Then** sections do not require excessive nested card containers to appear visually separated.

### Edge Cases

- What happens when prompts or user-entered notes are very long? Long prompts and long entered notes must not overflow the layout; overflow should be handled gracefully with scrolling or truncation as appropriate.
- How does the wizard behave when there is only one step? The composition should still render correctly (single-step wizard with no back navigation, continue becomes submit).
- How does the workflow panel behave when there is no objective or no current activity? Those regions should be gracefully hidden or collapsed without breaking layout.
- What happens when the viewport is very small (small phone with on-screen keyboard)? The layout must remain usable — action buttons and inputs should not be obscured.
- How does the workflow panel handle interrupted work contexts (e.g., autosave messaging)? The consuming application supplies the state; the composition must accommodate an autosave/save-status messaging region.
- What happens when the step indicator has many steps (10+)? The indicator should not overflow or break; a compact summary on mobile suffices.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Wizard composition MUST include a step-context region that communicates the current step, completed steps, and upcoming steps.
- **FR-002**: Current, completed, and upcoming steps MUST be distinguishable without relying on color alone (e.g., text labels, icons, underlines, or other non-color cues).
- **FR-003**: Wizard composition MUST include a semantic page heading.
- **FR-004**: Wizard composition MUST include a content or form region.
- **FR-005**: Wizard composition MUST include a validation-summary region.
- **FR-006**: Wizard composition MUST include an action footer with documented positions for back, continue, save-and-exit, and (on final step) final-submit actions.
- **FR-007**: Wizard composition MUST provide a compact mobile presentation of the current step when the full horizontal stepper would overflow the viewport.
- **FR-008**: Validation guidance MUST explain (via documentation or accessible structure) how focus should move to either the validation summary or the page heading after navigation.
- **FR-009**: Long forms MUST be dividable into clearly titled sections without requiring excessive nested card containers.
- **FR-010**: Workflow/session composition MUST include a context header region.
- **FR-011**: Workflow/session composition MUST include an objective region.
- **FR-012**: Workflow/session composition MUST include a current-activity region.
- **FR-013**: Workflow/session composition MUST include a prompt/instruction region.
- **FR-014**: Workflow/session composition MUST include an observation/note input region.
- **FR-015**: Workflow/session composition MUST include a progress/save-status region.
- **FR-016**: Workflow/session composition MUST include a completion actions region.
- **FR-017**: Prompt content and user-entered notes MUST be visually distinct.
- **FR-018**: Workflow panel MUST support loading, saving, saved, offline, validation-error, and completed visual states.
- **FR-019**: All status indicators MUST communicate status through text or icons in addition to color.
- **FR-020**: Primary interaction controls MUST meet minimum touch-target size requirements (industry standard size).
- **FR-021**: Composition layouts MUST remain usable on small phones, at 200% browser zoom, and with the on-screen keyboard present.
- **FR-022**: Long prompts and long entered notes MUST NOT overflow the layout; overflow MUST be handled gracefully.
- **FR-023**: Documentation MUST include minimum-necessary display guidance for sensitive records (e.g., avoid displaying personally identifiable information when not essential).
- **FR-024**: Documentation MUST warn against placing sensitive data in decorative examples.
- **FR-025**: Storybook stories MUST use synthetic data only — no real person, program, or session records.
- **FR-026**: Storybook stories MUST include desktop, mobile, validation-error, offline, and completed state examples for the compositions.
- **FR-027**: Selective (individual) imports of composition styles MUST compile without errors.
- **FR-028**: All-in-one bundle imports of composition styles MUST compile without errors.

### Key Entities *(include if feature involves data)*

- **Wizard Step**: Represents a single step in a multi-step form flow. Has state (current, completed, upcoming), a title, and may contain form fields and validation results.
- **Workflow Session**: Represents a structured staff interaction with a person or record. Contains context (who/what), objective, current activity, prompt/instruction, observations/notes, progress status, and completion state.
- **Status Indicator**: Represents the current state of a workflow or save operation (loading, saving, saved, offline, validation-error, completed).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Both the wizard composition and the workflow composition render correctly across small phone, large phone, tablet, and desktop viewports.
- **SC-002**: All 15 acceptance criteria from the original issue are satisfied without regression.
- **SC-003**: Wizard step indicators are distinguishable by non-color means (text labels, icons, or structural markers) in all three states (current, completed, upcoming).
- **SC-004**: All status states (loading, saving, saved, offline, validation-error, completed) are visually distinct and include text or icon labels in addition to color.
- **SC-005**: Documentation for the compositions is complete and includes sensitive-data display guidance and warnings, using synthetic data in all examples.
- **SC-006**: All Storybook examples render without errors and cover desktop, mobile, validation-error, offline, and completed states.
- **SC-007**: Both selective import and all-in-one import strategies compile successfully.

## Assumptions

- The consuming application is responsible for all workflow state management, routing, autosave logic, offline synchronization, and validation logic — the compositions define only visual and structural contracts.
- No specific program, service, participant, or session schema is defined; the compositions are schema-agnostic.
- The existing step indicator pattern in the design system is available for reuse within the wizard composition.
- Touch-target minimum size follows the industry standard as recommended by accessibility and mobile platform guidelines.
- The mobile breakpoint is assumed to be 768px or below for triggering the compact step summary; consuming applications may adjust this.
- The compositions ship visual and structural contracts only; no framework-specific components (React, Vue, etc.) are included in this slice.
- Styles are authored as discrete files that can be applied individually or as a combined set.
- Storybook serves as the development and documentation environment; stories use synthetic fixture data.
- Consumers may opt to use or omit save-and-exit functionality depending on their workflow requirements; the composition must accommodate both configurations.