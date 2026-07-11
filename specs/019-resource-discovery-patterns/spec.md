# Feature Specification: Resource Discovery Card, Filter Bar, and Guided Wayfinder Patterns

**Feature Branch**: `019-resource-discovery-patterns`

**Created**: 2026-07-11

**Status**: Draft

**Input**: Issue #33 — Add resource discovery card, filter bar, and guided wayfinder patterns

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browse Resources in a Card Grid (Priority: P1)

As a user browsing a directory of available resources, I want to see each resource presented as a card showing a thumbnail or category icon, title, provider, short description, category and status metadata, so that I can quickly scan and compare resources without opening each one.

**Why this priority**: The resource card is the fundamental building block of any discovery experience. Without it, users have no consistent way to understand what is available.

**Independent Test**: Can be tested by rendering a set of resource cards in a grid layout and verifying that each card displays its media/icon region, title, provider, summary, badges, metadata, rating, source attribution, and a primary link.

**Acceptance Scenarios**:

1. **Given** a set of resources to display, **When** rendered as cards, **Then** each card contains these regions in consistent positions: media/icon area, title, provider, short summary, category/status badges, metadata line, optional rating, source attribution, a primary link, and an optional secondary action.
2. **Given** a card grid layout, **When** the viewport is wide enough, **Then** cards arrange in a multi-column grid; when the viewport is narrow, cards stack in a single column.
3. **Given** a card in a horizontal list layout, **When** rendered, **Then** the media region appears beside rather than above the content region.
4. **Given** a card whose primary area is clickable, **When** a user hovers over or tabs to the card, **Then** the card shows a visible emphasis treatment (elevation or background change) consistent with existing interactive-surface patterns.
5. **Given** a card with a secondary action (e.g., save/favorite), **When** a user tabs through the card, **Then** the secondary control receives its own independent focus state and is interactable without activating the primary card link.

---

### User Story 2 — Filter, Search, and Sort Resources (Priority: P1)

As a user looking for specific resources, I want to search by keyword, filter by facets (category, status, provider), sort the results, and see a count of matching results so that I can narrow down a large set of resources efficiently.

**Why this priority**: Filtering and searching are the primary mechanisms users rely on to navigate large collections. Without a filter bar, users must scroll through all resources to find what they need.

**Independent Test**: Can be tested by rendering a filter bar alongside a resource grid and verifying that all controls (search input, facet dropdowns or checkboxes, sort select, result count, active filter pills, and clear-all) are present and functional in appearance.

**Acceptance Scenarios**:

1. **Given** a resource directory page, **When** the page renders, **Then** a filter bar is displayed combining a search input, facet controls, a sort control, a result count, active filter pills, and a clear-all action.
2. **Given** a user has applied filters, **When** the filters are active, **Then** each active filter is shown as a removable pill with a dismiss control that has a visible focus state and an accessible label.
3. **Given** multiple active filters, **When** the pills exceed the available width, **Then** the filter controls wrap to the next line without causing horizontal page overflow.
4. **Given** a user on a narrow screen, **When** viewing the filter bar, **Then** the controls stack vertically or expose a clear trigger for an implementation-provided filter drawer — the page content does not overflow horizontally.
5. **Given** search results change, **When** the result count updates, **Then** the count text is announced to assistive technology.

---

### User Story 3 — Guided Wayfinder for Complex Choices (Priority: P2)

As a user who is unsure what resource to choose or how to describe what I need, I want a guided wayfinder panel that asks me approachable questions (e.g., who am I helping, what outcome do I need) so that I can discover relevant resources without knowing the taxonomy in advance.

**Why this priority**: The wayfinder transforms complex, jargon-heavy resource selection into a conversational flow. It is a secondary entry point (after direct browsing) but essential for less technical users.

**Independent Test**: Can be tested by rendering the wayfinder panel with two or more question groups, verifying the introductory icon region, heading, explanatory text, labeled controls, and a primary action button are present, and that on narrow screens the controls collapse to a single column.

**Acceptance Scenarios**:

1. **Given** a user lands on a resource discovery page, **When** the wayfinder panel is present, **Then** it displays as a friendly raised panel containing: an introductory decorative icon, a heading, explanatory text, two or more labeled question groups, and a prominent result action.
2. **Given** a user has not yet interacted with the wayfinder, **When** the panel renders, **Then** no selection is forced — defaults are neutral and the user can understand the choices before making a selection.
3. **Given** a narrow viewport, **When** the wayfinder renders, **Then** question groups and controls stack vertically in a single column without horizontal overflow.

---

### User Story 4 — Empty, Loading, and Error States for Resource Lists (Priority: P3)

As a user encountering a resource view with no results, loading data, or an error, I want to see appropriate non-data states so that I am not left confused about what is happening.

**Why this priority**: Empty and error states prevent user abandonment. They are the third most important scenario after the primary happy paths.

**Independent Test**: Can be tested by rendering the resource grid with no data (empty results after filtering) and verifying the empty-state placeholder is shown with guidance, and by rendering a loading state that shows skeleton placeholders approximating card dimensions.

**Acceptance Scenarios**:

1. **Given** a filter combination returns no resources, **When** the results area renders, **Then** an empty-result state is displayed explaining that no matching resources were found.
2. **Given** the system is loading resources, **When** the content area renders, **Then** skeleton placeholders matching card dimensions are shown until the real content loads.
3. **Given** a full resource list is displayed, **When** rendered with all items present, **Then** the populated state is shown with no empty or loading overrides.

### Edge Cases

- What happens when a resource card has no image/thumbnail? A category icon fallback or monogram placeholder is shown in the media region.
- What happens when a resource has no rating? The rating region is hidden or shows a "not yet rated" indicator.
- What happens when a resource has no price or status? The status badge region is hidden or shows a neutral default.
- What happens when a resource description is extremely long? The description is clamped to a consistent number of lines without hiding the title or status.
- What happens when a user applies every available filter simultaneously? Filter pills wrap without overflow and individual pills remain removable.
- What happens when a filter produces zero results after having results? The result count transitions to zero and the empty state replaces the grid.
- What happens when the wayfinder has all questions answered but the user wants to restart? A reset or start-over action should be available.
- How does a secondary action control interact when the card itself is a link? The secondary control must be a sibling of the link, not nested inside it, to avoid nested-interactive-element violations.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The resource card pattern MUST support both grid layout (media above content) and horizontal list layout (media beside content).
- **FR-002**: Each resource card MUST provide distinct regions for: media/icon, title, provider, short summary, category/status badges, metadata, rating, source attribution, primary link, and an optional secondary action.
- **FR-003**: Card title and status information MUST remain fully visible at all times — long descriptions MUST use a controlled clamp without truncating critical identifying content.
- **FR-004**: Interactive cards MUST expose consistent hover and focus-within visual treatment, equivalent to the project's existing interactive-surface conventions.
- **FR-005**: Secondary action controls (e.g., save/favorite) MUST be siblings of the primary card link element and MUST have an independent, visible focus state — they MUST NOT be nested inside the primary link.
- **FR-006**: The system MUST document fallback appearance for: missing image, missing rating, missing price or status, and missing source metadata.
- **FR-007**: The filter bar MUST combine the following controls into a single cohesive region: search input, facet controls (e.g., checkboxes, dropdowns, or chips), sort control, result count display, active-filter pills, and a clear-all control.
- **FR-008**: Active filter pills MUST each have a visible dismiss control with a focus state and an accessible label.
- **FR-009**: Filter bar controls MUST wrap to additional lines without causing horizontal page overflow.
- **FR-010**: On narrow screens, filter controls MUST stack vertically or provide a visible trigger for an implementation-provided filter drawer.
- **FR-011**: The documentation MUST recommend URL-based state synchronization for search query, filters, sort order, and pagination.
- **FR-012**: Changes to the result count MUST include guidance for programmatic announcement to assistive technology (e.g., `aria-live` region).
- **FR-013**: The guided wayfinder MUST include: an introductory decorative icon hidden from assistive technology, a heading, explanatory text, two or more labeled question groups, and a prominent primary action.
- **FR-014**: Wayfinder controls MUST collapse to a single column on narrow screens.
- **FR-015**: Wayfinder default states MUST NOT force a selection before the user has had an opportunity to understand the choices.
- **FR-016**: All discovery patterns MUST function correctly at 200% zoom and in forced-colors mode without loss of information or interactive boundaries.
- **FR-017**: The visual documentation suite MUST include examples for each pattern in populated, sparse (minimal content), loading, and empty-result states.
- **FR-018**: The system MUST support both selective imports (individual patterns imported independently) and an all-in-one import mechanism, and both MUST compile without errors or naming conflicts.
- **FR-019**: The save/favorite secondary action MUST remain visually and functionally distinct from the card's primary link at all interactive states (rest, hover, focus, active).

### Key Entities

- **Resource Card**: A self-contained presentation unit for a single resource, containing media, title, provider, description, metadata badges, rating, source, a primary link, and an optional secondary action. Supports grid and horizontal list orientation.
- **Filter Bar**: A composite control region containing search input, facets, sort, result count, active-filter pills, and clear-all. Arranges controls in a single row on wide screens and stacks on narrow screens.
- **Active Filter Pill**: A removable chip representing one currently applied filter, with an accessible dismiss control and visible focus state.
- **Guided Wayfinder**: A raised panel that presents resource-discovery choices as natural-language questions. Contains an icon, heading, explanatory text, labeled controls, and a primary action. Collapses to single-column on narrow screens.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can use any single discovery pattern by importing its styles independently, without needing to include all patterns.
- **SC-002**: Resource cards display all required regions (media, title, provider, summary, badges, metadata, rating, source, link, optional secondary action) in both grid and list layouts without content overlap or overflow.
- **SC-003**: Active filter pills are individually removable via a focused dismiss control, and wrapping of pills does not cause horizontal page overflow at any viewport width between 320px and 1920px.
- **SC-004**: The guided wayfinder renders with all required elements (icon, heading, text, two or more question groups, primary action) at default widths and collapses to single-column at narrow widths without horizontal overflow.
- **SC-005**: All discovery patterns pass color-contrast checks, remain functional under forced-colors mode, and are operable at 200% zoom with no loss of visible state boundaries.
- **SC-006**: Empty, loading, and populated states are visually distinct and appear in the correct context — loading states precede content, empty states appear when no matches exist, and error states are not applicable to these presentational patterns.
- **SC-007**: Selective imports and all-in-one imports compile without naming conflicts, and each import path resolves to the expected styles.
- **SC-008**: Secondary action controls are focusable independently from the primary card link and receive a visible focus ring.

## Assumptions

- These patterns are framework-neutral visual styles — no JavaScript behavior for search, filtering, persistence, save behavior, or routing is included.
- No particular resource taxonomy is defined — category and status labels are consumer-supplied content.
- Decorative icons will use the project's existing icon system and will be hidden from assistive technology via `aria-hidden="true"`.
- Skeleton placeholders for loading states are defined separately (see App Feedback Patterns specification) and are referenced rather than redefined here.
- URL-based state management guidance follows existing project conventions for state synchronization.
- Accessibility requirements follow WCAG 2.1 Level AA as a baseline.
- Mobile breakpoints follow the project's existing responsive breakpoint definitions.
- Existing project tooling (Storybook, build system) is already configured and will be extended rather than introduced.
- The wayfinder is a decorative guidance panel — actual question logic, answer handling, and result computation are consumer-implemented.