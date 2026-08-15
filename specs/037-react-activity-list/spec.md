# Feature Specification: React Activity List Wrapper

**Feature Branch**: `038-react-activity-list`  
**Created**: 2026-08-15  
**Status**: Draft  
**Input**: User description: "Create a feature for adding the Dashboard > Activity List component to the react package"

## Table of Contents

- [Clarifications](#clarifications)
- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## Clarifications

### Session 2026-08-15

- Q: How should long content behave within Activity List rows? → A: Titles
  remain on one line and truncate with an ellipsis; other row text remains
  within the container's available width and height and truncates with an
  ellipsis at its display limit.
- Q: How must an activity status be communicated? → A: Its text label is
  both visibly displayed and available to assistive technology; color and
  shape may reinforce the status but do not replace its accessible text.
- Q: How must a group heading be associated with its activities? → A: The
  visible heading is visually adjacent to its rows, and the group container
  references that heading through `aria-labelledby`.
- Q: Does this feature include the shared source correction needed for status,
  date, and owner text? → A: Yes. The feature includes a narrow source-first
  correction for visible status text and date and owner truncation before the
  React wrapper consumes that contract.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Present Dashboard Activity (Priority: P1)

A product developer can present recent activity through the React package as a
scan-friendly list of rows containing status, title, context, date or time,
owner or participant, and optional actions, without manually assembling the
underlying design-system structure.

**Why this priority**: A populated activity list is the minimum useful
experience and gives dashboard users a consistent way to understand what
happened, when it happened, who was involved, and what they can do next.

**Independent Test**: Render three activity rows with different supplied
content and optional actions, then verify that users can identify every row's
status, title, context, time, owner, and available action in the supplied order.

**Acceptance Scenarios**:

1. **Given** a developer supplies several activity items, **When** the activity
   list is presented, **Then** users see the items in the supplied order with
   each item's status, title, contextual information, date or time, and owner
   or participant.
2. **Given** an activity item includes an action, **When** a keyboard, pointer,
   or touch user reaches that item, **Then** the action is available, visibly
   identifiable, and operable without changing the row's other content.
3. **Given** an activity item has no action, **When** the item is presented,
   **Then** the row remains complete and does not reserve a misleading empty
   action control.
4. **Given** activities have completed, in-progress, pending, and cancelled
   statuses, **When** they are presented together, **Then** every status remains
   visibly labeled and available to assistive technology without relying on
   color or shape alone.

---

### User Story 2 - Organize and Adapt the List (Priority: P2)

A product developer can organize activity under meaningful headings and choose
the documented default, compact, or comfortable density so the same component
works in dashboard summaries and more detailed activity views.

**Why this priority**: Grouping and density make longer activity streams easier
to scan while preserving the visual and semantic contract already established
for Dashboard > Activity List.

**Independent Test**: Present activities in two labeled groups at each
documented density, then verify that group relationships, item order, content,
and readable spacing remain intact.

**Acceptance Scenarios**:

1. **Given** activities grouped by date or status, **When** the list is
   presented, **Then** each group has a visible heading immediately adjacent to
   its items, its group container references that heading through
   `aria-labelledby`, and its items remain in the supplied order.
2. **Given** activities do not need grouping, **When** the list is presented,
   **Then** the items can appear as one list without an unnecessary heading.
3. **Given** a developer selects default, compact, or comfortable density,
   **When** the list is presented, **Then** spacing follows the corresponding
   existing Activity List treatment without changing content or semantics.
4. **Given** a narrow container, increased text size, or long content, **When**
   the activity list is presented, **Then** the layout remains within its
   container, titles remain on one line and truncate with an ellipsis, other
   row text truncates with an ellipsis at its available width or height, and
   focus indicators and actions remain available.

---

### User Story 3 - Handle Empty and Consumer Environments (Priority: P3)

A product developer can present a clear empty Activity List and can use the
component from the React package in server-rendered and browser-rendered
consumer experiences without separate design-system setup.

**Why this priority**: Empty data and consumer integration do not replace the
primary populated flow, but both are necessary for a reliable reusable package
component.

**Independent Test**: Present an empty list with consumer-provided guidance,
then install and render the packaged component in representative consumer
environments while verifying that meaningful output and required styling are
available without additional style setup.

**Acceptance Scenarios**:

1. **Given** there are no activity items, **When** the component is presented,
   **Then** users see the supplied empty-state message and no fabricated
   activity rows.
2. **Given** the component is rendered before browser scripting is available,
   **When** the initial output is inspected, **Then** all supplied activity
   content, group headings, statuses, and links remain meaningful and usable.
3. **Given** a consumer installs and imports only the React package, **When**
   the Activity List is presented, **Then** the established Pathable visual
   treatment is available without a separate styles-package import.

### Edge Cases

- When the item collection is empty, the component presents only the supplied
  empty-state content and does not create blank rows or headings.
- When a group is supplied with no items, the component omits the empty group
  rather than presenting a heading with no related activity.
- When titles, context, owner names, or group headings are long or
  localized-looking, titles remain on one line and truncate with an ellipsis,
  other row text truncates with an ellipsis at the container's available width
  or height, and the complete supplied text remains in the rendered document
  rather than existing only in a tooltip.
- When dates or times use different display formats, the component preserves
  the consumer's visible value and any supplied machine-readable or accessible
  description.
- When an item has an unfamiliar status, it receives a neutral presentation
  and visibly displays the supplied status label while exposing the same label
  to assistive technology, rather than implying one of the four documented
  meanings.
- When custom content includes links or buttons, focus order follows document
  order and visible focus is not clipped or hidden.
- When actions are unavailable, the component does not create inactive or
  unnamed controls.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The React package MUST expose a public component named
  `ActivityList`, matching the established Dashboard > Activity List design
  contract.
- **FR-002**: `ActivityList` MUST consume and preserve the authoritative
  Activity List visual, semantic, responsive, and accessibility contract after
  this feature's narrow source-first corrections for visible status text and
  date and owner truncation, rather than introduce wrapper-only styling or
  behavior.
- **FR-003**: `ActivityList` MUST accept a collection of activity items and
  present them in the supplied order.
- **FR-004**: Each activity item MUST support a title, contextual information,
  date or time, owner or participant, a status text label, and optional action
  content. The status text label MUST be visibly displayed and exposed to
  assistive technology.
- **FR-005**: `ActivityList` MUST support the documented completed,
  in-progress, pending, and cancelled statuses. Each presented status MUST
  display its text label and expose the same meaning to assistive technology;
  color and shape MAY reinforce the status but MUST NOT replace that text.
- **FR-006**: An unfamiliar status MUST visibly display and expose its supplied
  text label to assistive technology and use a neutral presentation without
  being silently converted to a documented status.
- **FR-007**: `ActivityList` MUST support ungrouped items and items grouped by
  date or status. Each grouped collection MUST have a visible heading
  immediately adjacent to its rows, and the group container MUST reference
  that heading through `aria-labelledby`.
- **FR-008**: Empty groups MUST NOT be presented.
- **FR-009**: `ActivityList` MUST support the existing default, compact, and
  comfortable density treatments without changing item meaning or order.
- **FR-010**: `ActivityList` MUST support a consumer-provided empty-state
  message when no activity items are available.
- **FR-011**: Optional item actions MUST remain visible and operable for
  keyboard, pointer, and touch users, and action visibility MUST NOT depend
  solely on hover.
- **FR-012**: The component MUST preserve consumer-provided accessible names,
  time descriptions, links, actions, additional attributes, and composition
  classes without removing the required Pathable treatment.
- **FR-013**: Long and localized-looking titles MUST remain on one line and
  truncate with an ellipsis at the available width. Other row text MUST remain
  within the container's available width and height and truncate with an
  ellipsis at its display limit. Truncation MUST NOT remove the complete
  supplied text from the rendered document or cause horizontal page overflow,
  clipped focus indicators, or unavailable actions.
- **FR-014**: Meaningful list content and actions MUST be present in the initial
  rendered output without requiring browser-only behavior.
- **FR-015**: The React package MUST make the required Activity List styling
  available without requiring consumers to install or import the styles
  package separately.
- **FR-016**: The public component interface and consumer-visible declarations
  MUST describe supported items, groups, statuses, densities, empty content,
  and extensibility without accepting undocumented visual variants.
- **FR-017**: The component catalog MUST include deterministic examples for a
  populated grouped list, every documented status, compact and comfortable
  density, a narrow viewport, long content, no actions, and an empty list.
- **FR-018**: Consumer guidance MUST explain item content, grouping, density,
  status labeling, optional actions, empty content, and accessibility
  responsibilities.
- **FR-019**: Packaged-consumer validation MUST confirm that the public
  `ActivityList` entry, consumer-visible declarations, and required transitive
  styling are available as consumers receive them.
- **FR-020**: This feature MUST NOT add new Activity List tokens, visual
  variants, data-fetching behavior, sorting, filtering, pagination, status
  transitions, or persistence.
- **FR-021**: This feature MUST NOT disable, weaken, exclude, skip, or silence
  applicable quality or accessibility checks.

### Key Entities

- **Activity List**: The reusable dashboard collection exposed by the React
  package. It contains ordered activity items, may contain visible groups, and
  has a selected density or an empty state.
- **Activity Item**: One event or task summary containing status, title,
  context, date or time, owner or participant, and optional action content.
- **Activity Group**: A visible heading and its ordered activity items,
  commonly organized by date or status. The heading is immediately adjacent to
  those items, and the group container references it through
  `aria-labelledby`.
- **Activity Status**: The readable state of an activity. Documented values are
  completed, in-progress, pending, and cancelled. Every value has a visibly
  displayed text label that is also available to assistive technology;
  unfamiliar values retain that label with neutral presentation.
- **Density**: The documented default, compact, or comfortable spacing
  treatment applied consistently across the list.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can create a populated Pathable Activity List with
  status, context, time, owner, and an optional action in under 10 minutes using
  the consumer guidance.
- **SC-002**: 100% of the documented statuses and densities exposed by this
  feature map to an existing Activity List treatment, with zero wrapper-only
  visual variants.
- **SC-003**: In catalog review, 100% of required fixed examples present the
  expected content at default and narrow widths, place every group heading
  immediately adjacent to its rows with a matching `aria-labelledby`
  relationship, apply the specified title and row-text truncation, and have no
  horizontal page overflow or clipped focus indicators.
- **SC-004**: In keyboard, pointer, and touch-equivalent review, 100% of
  supplied item actions remain discoverable and operable without relying on
  hover alone.
- **SC-005**: Automated accessibility review reports zero serious or critical
  violations for the required fixed examples, and every status has a visible
  text label with the same meaning available to assistive technology without
  relying on color or shape alone.
- **SC-006**: Initial-output verification finds 100% of supplied titles,
  contexts, dates or times, owners, status labels, group headings, and links
  without requiring browser scripting.
- **SC-007**: A packaged-consumer check confirms the Activity List entry,
  consumer-visible interface, and required styling are available with zero
  separate styles-package imports in consumer code.
- **SC-008**: At least four of five developers in a documentation review can
  identify how to create grouped, ungrouped, compact, comfortable, and empty
  Activity Lists without implementation assistance.

## Assumptions

- The existing Dashboard > Activity List contract is the authoritative source
  for visual design and supported states.
- The public component name is `ActivityList` because the existing
  `pathable-activity-list` name maps to CamelCase with the `pathable` prefix
  removed.
- The feature wraps the existing contract. Narrow source-layer corrections to
  make the required status text visibly displayed and to constrain date and
  owner text with ellipsis truncation are in scope and MUST precede the React
  wrapper; no new token, status meaning, or visual variant is introduced.
  Other changes to shared styles, tokens, or visual semantics remain outside
  scope unless a separate source-layer feature establishes them first.
- Status labels and other activity content are supplied by the consumer; the
  component does not infer business status, format dates, fetch data, or decide
  user permissions.
- Actions are consumer-supplied links or controls. The component arranges and
  preserves them but does not own their business behavior.
- Loading and error experiences are composed by consumers using existing
  feedback components and are not new Activity List variants in this feature.
- Examples use deterministic synthetic data and do not include sensitive or
  regulated information.
