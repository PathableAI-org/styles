# Feature Specification: React Card Wrapper

**Feature Branch**: `029-react-card-wrapper`

**Created**: 2026-07-16

**Status**: Draft

**Input**: User description: "Create the packages/react version of the card component"
    10|
## User Scenarios & Testing *(mandatory)*

### User Story 1 - Render Basic Card Content (Priority: P1)

A product developer using the React wrapper package can render a Pathable card
with heading, body content, and optional footer content without manually
assembling the underlying design-system class structure.

**Why this priority**: Basic card rendering is the minimum useful wrapper
    20|experience and proves the React package can expose the existing card design
contract without creating a separate visual system.

**Independent Test**: Can be fully tested by rendering the wrapper's Card
component with a heading and body content, then verifying the result presents
the same basic card structure and visual treatment as the existing
`packages/styles` card contract.

**Acceptance Scenarios**:

    30|1. **Given** a developer imports `Card` from the React wrapper package, **When**
   they render it with a title and children, **Then** users see a styled
   Pathable card with the title and body content in the expected order.
2. **Given** a card includes footer content, **When** the card renders, **Then**
   the footer appears as a distinct card region after the body content.
3. **Given** a developer provides additional class names for project-specific
   composition, **When** the card renders, **Then** those class names are
   preserved while the Pathable card styling remains present.

---
    40|
### User Story 2 - Use Card Variants (Priority: P2)

A product developer can request the documented card variants from the React
wrapper package, including media, flag, header-first, and workflow card
presentations, so common Pathable card patterns remain available through the
wrapper.

**Why this priority**: The existing styles package card contract includes more
than the base card. Wrapper users need those documented variants to avoid
    50|falling back to hand-authored class names.

**Independent Test**: Can be tested by rendering one card for each documented
variant and confirming each output maps to the corresponding existing
`packages/styles` card presentation.

**Acceptance Scenarios**:

1. **Given** a developer renders a media card, **When** media and body content
   are supplied, **Then** the card presents media and body regions consistently
    60|   with the existing card contract.
2. **Given** a developer renders a workflow card, **When** heading, metadata,
   status, body, and action content are supplied, **Then** the card presents the
   Pathable workflow card treatment without requiring wrapper-only styling.
3. **Given** a developer requests a documented card variant, **When** the card
   renders, **Then** the variant maps to an existing `packages/styles` card
   class, modifier, or documented pattern.

---

    70|### User Story 3 - Install Wrapper Without Extra Style Setup (Priority: P3)

A product developer can install and use the React wrapper package's Card
component without adding a separate application-level styles import.

**Why this priority**: The package constitution requires wrapper packages to
carry the styles contract through their dependency graph and entrypoints, so
consumers get the expected visual result from the wrapper alone.

**Independent Test**: Can be tested by installing the wrapper package in a
    80|consumer context, importing `Card`, and verifying the card renders with
Pathable styling without any additional styles package import by the consumer.

**Acceptance Scenarios**:

1. **Given** a consumer installs only the React wrapper package, **When** they
   import and render `Card`, **Then** the required card styling is available
   through the wrapper package.
2. **Given** a package-content check is reviewed, **When** the React wrapper
   package contents are inspected, **Then** the Card export and required
    90|   transitive styles dependency are present.

### Edge Cases

- What happens when a card has no heading? The card still renders valid body
  content without creating an empty heading region.
- What happens when a card has no body content? The card renders only supplied
  regions and does not create misleading empty content.
- What happens when both media and workflow presentation are requested? The
  feature treats documented combinations as valid only when the underlying
   100|  `packages/styles` card contract supports the combined presentation.
- How does the card handle long titles or body content? Content wraps or
  truncates according to the existing card contract without overflowing the
  card boundary.
- How does the card behave with interactive content inside it? Focus and
  interaction affordances remain accessible and do not conflict with the
  existing card contract.

## Requirements *(mandatory)*

   110|### Functional Requirements

- **FR-001**: The React wrapper package MUST expose a component named `Card`,
  matching the CamelCase form of the equivalent `packages/styles`
  `pathable-card` component name with the `pathable` prefix removed.
- **FR-002**: The `Card` component MUST map to the existing `packages/styles`
  card contract rather than defining wrapper-only visual styling.
- **FR-003**: The `Card` component MUST support basic card content with a title,
  body content, optional footer content, and optional additional class names.
- **FR-004**: The `Card` component MUST support documented card presentations
   120|  that already exist in the styles contract, including media, flag,
  header-first, and workflow card usage.
- **FR-005**: The `Card` component MUST preserve consumer-provided content and
  accessible attributes needed for headings, links, actions, media, and
  focusable workflow cards.
- **FR-006**: The React wrapper package MUST make the required Pathable card
  styling available to consumers without requiring a separate consumer import
  of `@pathable/styles`.
- **FR-007**: The feature MUST include consumer-facing documentation or examples
  showing basic card usage, at least one variant, and the workflow card pattern.
   130|- **FR-008**: The feature MUST verify that the wrapper package can be installed
  and used with the `Card` export and its required transitive styling assets.
- **FR-009**: The feature MUST NOT introduce new card variants, tokens, visual
  semantics, or accessibility behavior that are absent from the owning
  `packages/styles` card contract.
- **FR-010**: The feature MUST NOT disable, weaken, skip, or silence lint checks
  to complete the wrapper work.

### Key Entities *(include if feature involves data)*

   140|- **Card**: A reusable content container exposed by the React wrapper package
  that maps to the existing `pathable-card` styles contract.
- **Card Region**: A supplied part of the card, such as heading, body, media,
  footer, metadata, status, or action content.
- **Card Presentation**: A documented card treatment from the styles contract,
  such as base, media, flag, header-first, or workflow.

## Success Criteria *(mandatory)*

### Measurable Outcomes
   150|
- **SC-001**: A developer can create a basic Pathable card from the React
  wrapper package in under 5 minutes using the documented example.
- **SC-002**: 100% of documented Card presentations in this feature map to an
  existing `packages/styles` card class, modifier, or documented pattern.
- **SC-003**: A consumer package-content check confirms the Card export and
  required transitive styling dependency are present before the feature is
  considered complete.
- **SC-004**: Documentation or examples cover at least three card use cases:
  basic content, a variant with media or layout treatment, and the workflow
   160|  card pattern.
- **SC-005**: No review finding identifies wrapper-only styling, missing
  transitive styling, or a component naming mismatch against the constitution's
  React naming parity rule.

## Assumptions

- The owning styles contract already exists as `pathable-card` in
  `packages/styles`, including base, media, flag, header-first, and workflow
  presentations.
   170|- The React wrapper component name is `Card` because `pathable-card` becomes
  `Card` after removing the `pathable` prefix and converting to CamelCase.
- This feature wraps, not extends, the existing card contract; it does not add new visual
  variants or change the underlying card styles.
- Provider design evidence is not required because the request targets an
  existing repository-owned styles contract rather than a new design-derived
  visual surface.
