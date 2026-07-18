# Feature Specification: React Link and Tag Wrappers

**Feature Branch**: `032-react-link-tag-wrappers`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "Create a feature to add the link and tag components to the packages/react workspace"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Render an Accessible Link (Priority: P1)

A product developer can render a Pathable-styled link from the React wrapper
package while preserving the destination, content, native link behavior, and
consumer-provided accessibility information.

**Why this priority**: Links are a primary navigation primitive, and preserving
their native meaning and behavior is essential for a useful wrapper.

**Independent Test**: Render a Link with visible content and a destination,
activate it with pointer and keyboard input, and verify that it retains native
link semantics, the supplied content, and the Pathable link treatment.

**Acceptance Scenarios**:

1. **Given** a developer imports `Link` from the React wrapper package, **When**
   they provide content and a destination, **Then** users receive a native link
   with the supplied content, destination, and Pathable presentation.
2. **Given** a developer supplies accessible naming, relationship, language,
   tracking, or event attributes, **When** the Link renders, **Then** those
   valid attributes and behaviors are preserved.
3. **Given** a developer identifies a destination as external, **When** the
   Link renders, **Then** the existing external-link treatment is applied
   without silently changing navigation behavior or security attributes.

---

### User Story 2 - Render a Tag (Priority: P2)

A product developer can render concise categorical or status text with the
existing Pathable tag presentation, including its documented larger size,
without manually assembling design-system class names.

**Why this priority**: Tags are a common companion to links and content cards,
and the wrapper should expose the full implemented styles contract consistently.

**Independent Test**: Render Tag once at the default size and once at the big
size, then verify that both preserve supplied content and map to the matching
existing Pathable treatments.

**Acceptance Scenarios**:

1. **Given** a developer imports `Tag` and supplies text or rich inline content,
   **When** the Tag renders, **Then** the content appears with the default
   Pathable tag presentation.
2. **Given** a developer selects the big size, **When** the Tag renders, **Then**
   the existing big tag treatment is applied without changing the content.
3. **Given** a developer supplies additional class names or valid attributes,
   **When** the Tag renders, **Then** they are preserved alongside the required
   Pathable tag treatment.

---

### User Story 3 - Use Both Wrappers Without Extra Style Setup (Priority: P3)

A product developer can install the React wrapper package and use both Link and
Tag without adding a separate application-level styles import.

**Why this priority**: Wrapper consumers should receive the established styles
contract through the package they chose to install.

**Independent Test**: Install the React wrapper package in a consumer context,
import and render Link and Tag, and verify that all in-scope presentations are
available without an additional styles-package import by the consumer.

**Acceptance Scenarios**:

1. **Given** a consumer installs only the React wrapper package, **When** they
   import and render Link and Tag, **Then** the required styling is available
   through the wrapper package.
2. **Given** the published package contents are inspected, **When** readiness is
   assessed, **Then** both public exports and the required transitive styling
   contract are present.

### Edge Cases

- Empty Link or Tag content is not replaced with invented visible text; the
  consumer remains responsible for providing an accessible name where needed.
- Link preserves consumer-controlled navigation attributes and does not infer
  a new browsing context, relationship value, download behavior, or destination.
- An unsupported Link treatment falls back to the default presentation and
  does not emit an undocumented modifier class.
- An unsupported Tag size falls back to the default size and does not emit an
  undocumented modifier class.
- Rich inline content, icons, long labels, and localized text remain intact and
  follow the wrapping behavior of the owning styles contract.
- Additional consumer class names remain present without replacing the required
  Link or Tag base class.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The React wrapper package MUST expose components named `Link` and
  `Tag`, matching the CamelCase forms of the owning `packages/styles`
  `pathable-link` and `pathable-tag` contracts after removing the `pathable`
  prefix.
- **FR-002**: Link MUST render a native link element and preserve supplied
  content, destination, valid attributes, event behavior, data attributes,
  accessibility attributes, and additional class names.
- **FR-003**: Link MUST always retain the existing `pathable-link` base
  treatment.
- **FR-004**: Link MUST support the implemented default and external
  presentations from the owning styles contract.
- **FR-005**: Selecting the external Link presentation MUST apply only the
  existing `pathable-link--external` modifier and MUST NOT infer or override
  navigation target, relationship, or security attributes.
- **FR-006**: An absent or unsupported Link presentation MUST use the default
  treatment without adding an undocumented modifier.
- **FR-007**: Tag MUST preserve supplied inline content, valid attributes, data
  attributes, accessibility attributes, and additional class names.
- **FR-008**: Tag MUST always retain the existing `pathable-tag` base treatment.
- **FR-009**: Tag MUST support the implemented default and big sizes from the
  owning styles contract.
- **FR-010**: An absent or unsupported Tag size MUST use the default treatment
  without adding an undocumented modifier.
- **FR-011**: Link and Tag MUST map only to classes implemented by their owning
  `packages/styles` contracts and MUST NOT introduce wrapper-only styles,
  tokens, visual treatments, or interaction behavior.
- **FR-012**: The React wrapper package MUST make the required Pathable Link and
  Tag styling available without requiring consumers to import
  `@pathable/styles` separately.
- **FR-013**: Consumer-facing documentation or examples MUST demonstrate the
  default and external Link presentations and the default and big Tag sizes.
- **FR-014**: Package readiness evidence MUST confirm both public exports and
  their required transitive styling contract are available to consumers.
- **FR-015**: The feature MUST NOT disable, weaken, skip, or silence lint checks.

### Key Entities *(include if feature involves data)*

- **Link**: A native navigation element exposed by the React wrapper package
  and mapped to the existing `pathable-link` styles contract.
- **Link Presentation**: The default or external visual treatment; it affects
  presentation only and does not determine navigation behavior.
- **Tag**: A concise inline label exposed by the React wrapper package and
  mapped to the existing `pathable-tag` styles contract.
- **Tag Size**: The default or big treatment defined by the owning styles
  contract.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can render both a Pathable Link and Tag from the React
  wrapper package in under 5 minutes using the documented examples.
- **SC-002**: 100% of presentations and sizes exposed by this feature map to an
  implemented class in the owning `packages/styles` Link or Tag contract.
- **SC-003**: Documentation or examples cover all four in-scope treatments:
  default Link, external Link, default Tag, and big Tag.
- **SC-004**: All acceptance tests preserve supplied content and valid consumer
  attributes with no wrapper-generated content loss or navigation changes.
- **SC-005**: A consumer package-content check confirms both public exports and
  the required transitive styling contract before the feature is complete.
- **SC-006**: Review finds zero wrapper-only styles, undocumented modifier
  classes, component naming mismatches, or lint bypasses.

## Assumptions

- The owning source contracts already exist as `pathable-link` and
  `pathable-tag` in `packages/styles`.
- The React component names are `Link` and `Tag` because the source contract
  names lose the `pathable` prefix and become CamelCase.
- The implemented Link scope consists of default and external presentations.
  A navigation-link Storybook example references `pathable-link--nav`, but that
  modifier is not present in the owning source contract and is excluded until
  it is separately defined and validated there.
- The implemented Tag scope consists of default and big sizes.
- Link remains a native navigation element. Tag is a non-interactive inline
  label by default and does not become a button, link, dismiss control, or
  selectable filter through this feature.
- This feature wraps existing contracts and does not require new design
  evidence or changes to `packages/styles`.
- The feature involves no authentication, persistence, regulated data, or
  external data exchange.
