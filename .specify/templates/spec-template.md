# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.

  ## Design-system and visual work

  For visual/design-system work, requirements must name the owning
  `packages/styles` source contract before naming framework wrappers. A wrapper
  package requirement must state how the wrapper automatically imports or
  packages the required `@pathable/styles` CSS, fonts, icons, JavaScript
  helpers, and assets for normal consumer use. A `packages/react` component
  requirement must name the React component as the CamelCase form of the
  equivalent `packages/styles` component name with any `pathable` prefix
  removed. Wrapper components must preserve the shared package's semantic HTML,
  accessibility behavior, class contracts, design tokens, and intended visual
  behavior.

  ## Storybook and interaction requirements

  When the feature affects rendered component UI, requirements should identify
  the meaningful supported component states that need deterministic, named
  stories. For interactive components, requirements should describe the
  critical observable keyboard and focus behavior that interaction tests must
  verify. Stories must use accessible queries (`getByRole`, `getByLabelText`)
  and avoid implementation details. Stories must be deterministic — no dates,
  random values, or live network calls.

  ## Accessibility requirements

  When the feature affects rendered UI, markup, or component behavior,
  requirements should describe the expected accessible behavior: appropriate
  ARIA roles, keyboard accessibility, disabled state communication, focus
  visibility, and any color-contrast obligations. Static JSX accessibility
  linting and rendered accessibility testing are complementary — both must be
  addressed. Broad a11y rule disablement is not permitted; narrow story-level
  exceptions require documented justification.

  ## Responsive and resilient state requirements

  When the feature affects rendered UI, requirements should call out
  narrow/mobile behavior, long-content handling, constrained containers,
  increased text size, keyboard focus visibility, high-contrast or
  forced-colors behavior, reduced motion, and state presentations (loading,
  empty, error, disabled, read-only) when these are part of the component
  contract.

  ## Visual regression requirements

  When the feature affects rendered component UI or design tokens, requirements
  should identify the stable stories that serve as visual-regression fixtures.
  Visual checks protect design tokens, typography, spacing, responsive
  behavior, focus indicators, overflow, wrapping, icon alignment, and state
  presentation.

  ## Lint and validation

  Requirements must not ask agents to disable, weaken, skip, or silence lint
  checks. Only explicit human maintainer approval may authorize a narrow
  lint-rule bypass. Files must not be silently excluded from their applicable
  validator merely to make CI pass. Warning-only configurations must not create
  the appearance of enforcement.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

*Example of marking unclear requirements:*

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- [Assumption about target users, e.g., "Users have stable internet connectivity"]
- [Assumption about scope boundaries, e.g., "Mobile support is out of scope for v1"]
- [Assumption about data/environment, e.g., "Existing authentication system will be reused"]
- [Dependency on existing system/service, e.g., "Requires access to the existing user profile API"]
