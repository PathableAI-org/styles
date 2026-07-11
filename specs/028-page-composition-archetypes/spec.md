# Feature Specification: Page Composition Archetypes

**Feature Branch**: `028-page-composition-archetypes`

**Created**: 2026-07-11

**Status**: Draft

**Input**: Add complete page-composition examples for common site archetypes (marketing landing page, searchable resource directory, operational dashboard, structured workflow) that demonstrate how public `packages/styles` APIs combine into coherent products.

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing)
- [Requirements](#requirements)
- [Success Criteria](#success-criteria)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Marketing Landing Page Composition (Priority: P1)

A marketing content creator wants to build a polished public-facing landing page using existing design-system patterns. They combine a site header, hero section with eyebrow text and CTA buttons, an audience/values row, alternating feature sections with screenshots, statistic cards, a call-to-action band, and a footer — all assembled from public CSS classes with no custom styling.

**Why this priority**: The marketing landing page is the most commonly requested archetype and demonstrates the widest range of composition skills. It validates the core value proposition of the pattern library.

**Independent Test**: Can be fully tested by rendering the landing-page Storybook story and confirming all sections render correctly across mobile and desktop viewports with keyboard navigation and accessible contrast.

**Acceptance Scenarios**:

1. **Given** the marketing landing page composition, **When** rendered in a browser, **Then** it includes site header, hero with eyebrow/headline/copy/primary-secondary actions, audience row, alternating feature sections with screenshots, statistic cards, CTA band, and footer
2. **Given** the marketing landing page, **When** viewed at 320px viewport width, **Then** all content remains readable and no horizontal overflow occurs
3. **Given** the marketing landing page, **When** keyboard-navigated, **Then** focus order follows visual reading order and no focus is trapped
4. **Given** the marketing landing page, **When** `prefers-reduced-motion` is enabled, **Then** all decorative motion is suppressed

---

### User Story 2 - Resource Directory Page Composition (Priority: P1)

A content manager wants to create a searchable resource directory. They assemble a search-led hero, guided wayfinder, filter bar with active-filter pills, result count and sorting controls, a resource-card grid, an empty-results fallback, and pagination — all from public CSS classes.

**Why this priority**: The resource directory is the second most common archetype and exercises the most interactive patterns (filters, search, pagination) while remaining purely presentational.

**Independent Test**: Can be tested by rendering the directory Storybook story and verifying all structural regions (search, filters, results grid, empty state, pagination) render correctly across viewports.

**Acceptance Scenarios**:

1. **Given** the resource directory composition, **When** rendered, **Then** it includes search-led hero, wayfinder, filter bar, active-filter pills, result count, sorting, resource-card grid, empty-results example, and pagination
2. **Given** the resource directory composition, **When** the empty-results state is shown, **Then** it displays a clear fallback message and suggested action
3. **Given** the resource directory composition, **When** rendered at mobile viewport, **Then** the filter bar and grid stack appropriately

---

### User Story 3 - Operational Dashboard Composition (Priority: P2)

An operations team member wants a dashboard view of system status and tasks. They assemble a responsive application shell, dashboard page header, KPI cards, activity/task list, schedule section, responsive table, toast notification, loading/empty states, and mobile bottom navigation — all from public CSS classes.

**Why this priority**: The dashboard archetype exercises data-dense layouts, loading states, and responsive table patterns. Important but slightly less common than landing and directory pages.

**Independent Test**: Can be tested by rendering the dashboard Storybook story and verifying all structural regions render with loading, populated, and empty state examples.

**Acceptance Scenarios**:

1. **Given** the operational dashboard composition, **When** rendered, **Then** it includes responsive app shell, header, KPI cards, activity list, schedule section, responsive table, toast example, loading/empty states, and mobile bottom nav
2. **Given** the dashboard, **When** loading state is shown, **Then** it displays skeleton or placeholder indicators
3. **Given** the dashboard, **When** rendered on mobile, **Then** bottom navigation is visible and the table scrolls horizontally

---

### User Story 4 - Structured Workflow Composition (Priority: P2)

A team member wants to guide a user through a multi-step process. They assemble participant/record context, a current-step indicator, objective and structured prompt, form/note entry area, save-status indicator, validation summary, previous/next/complete actions, and a completed-state example — all from public CSS classes.

**Why this priority**: The workflow archetype demonstrates form-like layouts and progress indicators. Important but less urgent than marketing and directory pages.

**Independent Test**: Can be tested by rendering the workflow Storybook story and verifying all step-related regions render correctly, including the completed state.

**Acceptance Scenarios**:

1. **Given** the structured workflow composition, **When** rendered, **Then** it includes participant context, step indicator, objective, form entry, save status, validation summary, navigation actions, and completed state
2. **Given** the workflow composition, **When** the completed state is shown, **Then** it displays a success confirmation and optional next actions

---

### User Story 5 - Accessibility & Responsiveness Verification (Priority: P3)

An accessibility reviewer needs to confirm each archetype meets project standards. They review all four compositions at 200% browser zoom, with reduced motion, in forced-colors mode, and verify automated Storybook accessibility checks pass.

**Why this priority**: Accessibility is a cross-cutting concern, not specific to a single archetype. The individual archetype stories must be built first before this verification can happen.

**Independent Test**: Can be tested by running automated a11y checks on each story and manually reviewing zoom/reduced-motion/forced-colors behavior.

**Acceptance Scenarios**:

1. **Given** each composition story, **When** automated accessibility checks run, **Then** no violations are reported
2. **Given** each composition, **When** viewed at 200% browser zoom, **Then** no content overlap or truncation occurs
3. **Given** each composition, **When** forced-colors mode is active, **Then** content remains readable and interactive elements are distinguishable

### Edge Cases

- What happens when the resource directory has zero results? An empty-results fallback with a suggested action is displayed.
- What happens when the dashboard has no data? Loading skeletons are shown initially, then empty-state messaging.
- What happens when the workflow validation fails? A validation summary with specific error messages is displayed.
- What happens when content exceeds available space in KPI cards or tables? Text truncation or horizontal scroll is applied gracefully.
- What happens with very long task lists, filter options, or step counts? Sections scroll independently within their region boundaries.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a marketing landing page composition showing site header, hero (eyebrow, headline, copy, primary/secondary CTA), audience row, alternating feature sections with screenshots, statistic cards, CTA band, and footer
- **FR-002**: System MUST provide a resource directory composition showing search-led hero, wayfinder, filter bar, active-filter pills, result count, sorting controls, resource-card grid, empty-results fallback, and pagination region
- **FR-003**: System MUST provide an operational dashboard composition showing responsive app shell, page header, KPI cards, activity/task list, schedule section, responsive table, toast example, loading state, empty state, and mobile bottom navigation
- **FR-004**: System MUST provide a structured workflow composition showing participant context, step indicator, objective, form/note entry, save status, validation summary, previous/next/complete actions, and completed state
- **FR-005**: Each composition MUST use only public CSS classes exported by `packages/styles` — no raw hex colors, arbitrary spacing values, or one-off component CSS
- **FR-006**: Each story MUST include both mobile and desktop viewport variants
- **FR-007**: Each story MUST include framework-neutral semantic HTML accessible alongside the story
- **FR-008**: Each composition MUST use synthetic placeholder content — no real personal or sensitive information
- **FR-009**: Each story MUST link to the component and pattern documentation it uses
- **FR-010**: System MUST include documentation explaining which archetype to start from and which patterns are optional
- **FR-011**: Fixed headers, sidebars, bottom navigation, and toast regions MUST NOT obscure focused content during keyboard navigation
- **FR-012**: Keyboard focus order MUST follow the visual and semantic reading order for each composition

### Key Entities

No data entities are involved. This feature produces presentation-layer HTML/CSS compositions with static synthetic content.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Four complete Storybook composition stories render without errors (marketing landing page, resource directory, operational dashboard, structured workflow)
- **SC-002**: Each composition passes automated Storybook accessibility checks with zero violations
- **SC-003**: Each composition renders without content overlap or truncation at 200% browser zoom
- **SC-004**: Each composition remains fully functional with `prefers-reduced-motion` enabled
- **SC-005**: Each composition maintains readable content and distinguishable interactive elements in forced-colors/high-contrast mode
- **SC-006**: Visual regression coverage includes at least one mobile (320px) and one desktop (1280px) viewport per archetype
- **SC-007**: Documentation exists explaining archetype selection and optional pattern usage
- **SC-008**: No composition contains raw hex colors, arbitrary spacing, or one-off custom CSS — only public API classes are used

## Assumptions

- All required base patterns (bento grids, chip rails, decorative backgrounds, text highlights, screenshot frames) are already implemented and available in `packages/styles`
- The existing USWDS token system provides sufficient color, spacing, and typography tokens for all four archetypes
- Storybook is already configured in the project with accessibility addon (a11y) and viewport addon active
- Compositions will use static synthetic content (placeholder images, lorem ipsum text, fake names/organizations) — no dynamic data fetching
- Mobile and desktop viewports are the primary responsive targets; tablet is implicitly covered
- No new SCSS component files are needed — archetypes compose existing public classes only
- Visual regression testing infrastructure exists or can be configured at the project level (not in this spec)