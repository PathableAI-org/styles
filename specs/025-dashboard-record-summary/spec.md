# Feature Specification: Dashboard Overview and Record-Summary Patterns

**Feature Branch**: `025-dashboard-record-summary`
**Created**: 2026-07-11
**Status**: Draft
**Input**: Issue #34 — Add dashboard overview and record-summary patterns

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dashboard Page Header with KPIs (Priority: P1)

As a developer building an operational dashboard, I want a reusable dashboard header that combines the page title, contextual information, status indicators, and action buttons, along with a KPI grid that displays key metrics, so that I can quickly assemble a consistent dashboard overview without writing custom layout CSS.

**Why this priority**: The dashboard header and KPI grid form the top-of-page foundation for any dashboard view. Every dashboard needs them, and they establish the visual rhythm for all downstream patterns.

**Independent Test**: Can be fully tested by rendering a dashboard header with title, description, and two action buttons, plus a KPI grid with four metric cards showing values, labels, and trends. Delivers the core dashboard overview experience.

**Acceptance Scenarios**:

1. **Given** a dashboard page, **When** the header renders, **Then** it shows a page title, a concise description, and optional context or status, with primary and secondary action regions.
2. **Given** a dashboard header with actions, **When** viewed on a narrow screen, **Then** actions stack cleanly below the title in a single column.
3. **Given** a dashboard page, **When** the KPI grid renders, **Then** each metric card displays an emphasized value and a label explaining what the value represents.
4. **Given** a KPI card with a trend, **When** the trend is positive or negative, **Then** it includes both a directional icon or text indicator *and* a color cue (never relying on color alone).
5. **Given** a KPI grid, **When** the container width changes, **Then** the grid adapts from one to four columns based on available space.
6. **Given** a KPI card with a very large metric value, **When** the value exceeds the card width, **Then** it wraps or truncates without overflowing the card boundary.
7. **Given** a KPI card in an unavailable state, **When** rendered, **Then** it displays an appropriate placeholder or dash in place of the value.
8. **Given** a KPI card in a loading state, **When** rendered, **Then** it shows a skeleton placeholder to indicate data is being fetched.

---

### User Story 2 - Record Header for People, Organizations, and Resources (Priority: P1)

As a developer building a record detail or summary page, I want a record header that supports an avatar, logo, or category icon; primary identity; secondary metadata; status badges; and actions, so that I can consistently present any person, organization, service, or resource type.

**Why this priority**: Record headers are the second most common dashboard element after the page header. They appear on every profile, detail, and summary page, making them a core building block.

**Independent Test**: Can be fully tested by rendering a record header with an avatar image, name, two metadata items, a status badge, and a primary action button.

**Acceptance Scenarios**:

1. **Given** a record detail page, **When** the record header renders, **Then** it supports an image, avatar, logo, or category icon, with a defined fallback when no image is provided.
2. **Given** a record header, **When** rendered, **Then** it displays primary identity information, secondary detail metadata, status badges, a primary action, and an overflow-actions slot.
3. **Given** a record header with a long identity name, **When** the viewport is narrow, **Then** the identity wraps without clipping and metadata stacks below.

---

### User Story 3 - Activity and Task List (Priority: P2)

As a developer building a task or activity feed, I want a reusable activity-list pattern with rows that show status, title, context, date or due time, owner, and optional actions, so that I can present time-based activity streams or task lists consistently.

**Why this priority**: Activity and task lists are important secondary patterns used in dashboard bodies, case-management pages, and summary views.

**Independent Test**: Can be fully tested by rendering an activity list with three rows, each showing a status indicator, title, date, owner, and a trailing action button, plus a second group with a different date heading.

**Acceptance Scenarios**:

1. **Given** an activity list, **When** rendered, **Then** each row displays a status indicator, a title, contextual information, a date or time, an owner or participant, and optional trailing actions.
2. **Given** an activity list, **When** items belong to different dates or statuses, **Then** they are visually grouped under section headings.
3. **Given** an activity list, **When** the density preference is compact, **Then** rows have tighter vertical spacing; when comfortable, rows have more generous padding.

---

### User Story 4 - Schedule and Appointment Items (Priority: P2)

As a developer building a scheduling or appointment view, I want a schedule-item pattern that shows date/time, title, context, location, time zone, status, and actions, so that I can present calendar events or appointments with consistent styling.

**Why this priority**: Schedule items are a common dashboard and detail-page pattern that must handle distinct visual states (cancelled, completed, tentative, upcoming).

**Independent Test**: Can be fully tested by rendering four schedule items representing cancelled, completed, tentative, and upcoming states, verifying each is visually distinguishable without color alone.

**Acceptance Scenarios**:

1. **Given** a schedule item, **When** rendered, **Then** it displays date or time, title, contextual information, location, time zone, a status indicator, and action regions.
2. **Given** cancelled, completed, tentative, and upcoming schedule items, **When** viewed side by side, **Then** each state is distinguishable using a combination of icon, text, and visual treatment — never relying on color alone.
3. **Given** a schedule list with multiple items, **When** all items render, **Then** they present a scan-friendly, scannable layout.

---

### User Story 5 - Application-Oriented Table Behavior (Priority: P3)

As a developer using the existing table wrapper in an application context, I want documented guidance and modifier classes for sortable columns, selected rows, status cells, row actions, loading rows, empty rows, and responsive behavior, so that I can build consistent, accessible data tables without writing custom table logic.

**Why this priority**: The existing table wrapper already provides base styling. This story extends it with application-need modifiers and documentation rather than building something entirely new, making it the lowest priority.

**Independent Test**: Can be fully tested by rendering a table with a sortable column header, one selected row, a status cell, and a row action button, then verifying the table scrolls horizontally on narrow screens without clipping focus outlines.

**Acceptance Scenarios**:

1. **Given** a table with sortable columns, **When** rendered, **Then** sortable column headers include a visual indicator (e.g., arrow icon) and the proper `aria-sort` attribute guidance.
2. **Given** a table, **When** rows are selectable, **Then** a selected row has a distinct visual state.
3. **Given** a table with status cells, **When** rendered, **Then** status cells use text or icon indicators alongside any color cues.
4. **Given** a table with row actions, **When** the row is focused or hovered, **Then** action controls become visible.
5. **Given** a table in a loading state, **When** rendered, **Then** rows show skeleton placeholders.
6. **Given** a table with no data, **When** rendered, **Then** it displays an empty-state message spanning the full width.
7. **Given** a table in a narrow viewport, **When** content overflows horizontally, **Then** the table scrolls without clipping focus outlines or interactive elements.
8. **Given** a table in a responsive context, **When** documentation is consulted, **Then** it describes three strategies: horizontal scroll, priority-column reveal, and card transformation at narrow widths.

---

### Edge Cases

- What happens when a record header receives an image that fails to load? A fallback avatar or icon should display in place of the broken image.
- What happens when a KPI grid has only one metric card? It should span the full available width (single-column layout is valid).
- What happens when an activity list has zero items? An empty-state indicator or message should be available.
- What happens when a schedule item has no location or time zone? Those fields should be optional and hide gracefully without breaking the layout.
- What happens when a table has both sortable and non-sortable columns? Only sortable columns show the sort indicator.
- What happens when dashboard header breadcrumbs have many levels? They should wrap without horizontal overflow.
- What happens when action overflow in a record header exceeds available space? The overflow slot provides a mechanism for additional actions behind a menu.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Dashboard header MUST support page title, description, optional breadcrumb navigation, context or status indicator, and separate primary and secondary action regions.
- **FR-002**: Dashboard header actions MUST stack below the title in a single column on narrow viewports.
- **FR-003**: The page title in a dashboard header MUST be the semantic `h1` element.
- **FR-004**: KPI cards MUST support a numeric or text value, a descriptive label, optional comparison or trend indicator, optional icon, a loading state, and an unavailable (no-data) state.
- **FR-005**: KPI trend indicators MUST include a text label or directional icon cue in addition to any color, so that the direction is discernible without color perception.
- **FR-006**: KPI large values MUST wrap or truncate without visually overflowing the card boundary.
- **FR-007**: KPI grids MUST adapt from one to four columns based on available container width, with column transitions at reasonable breakpoints.
- **FR-008**: Record headers MUST support image, avatar, logo, or category-icon presentation with a defined fallback when no asset is provided.
- **FR-009**: Record headers MUST support metadata rows, status badges, a primary action button, and an overflow-actions slot for additional controls.
- **FR-010**: Activity and task list rows MUST display a status indicator, title, contextual metadata, a date or due time, an owner or participant, and optional trailing actions.
- **FR-011**: Activity lists MUST support grouping by date or by status, with visible section headings for each group.
- **FR-012**: Activity lists MUST support compact (tight spacing) and comfortable (generous spacing) density modes.
- **FR-013**: Schedule items MUST display date and time, title, contextual metadata, location, time zone, a status indicator, and action regions.
- **FR-014**: Schedule items MUST distinguish cancelled, completed, tentative, and upcoming states using a combination of icon, text, and visual treatment — never color alone.
- **FR-015**: Table modifiers MUST support sortable column headers with sort-direction indicators, selected row styling, status-themed cells, and row-action visibility on hover or focus.
- **FR-016**: Table loading states MUST display skeleton row placeholders; empty states MUST display a full-width empty message.
- **FR-017**: Table focus outlines MUST NOT be clipped by overflow containers when the table scrolls horizontally.
- **FR-018**: Responsive table documentation MUST describe three strategies: horizontal scroll, priority-column reveal, and card transformation at narrow widths.
- **FR-019**: All dashboard and record-summary patterns MUST preserve interactive boundaries and remain functional at 200% browser zoom.
- **FR-020**: All dashboard and record-summary patterns MUST respect forced-colors mode without losing visible state boundaries.
- **FR-021**: All patterns MUST support selective import (individual SCSS files) and all-in-one import via a bundle entry point.
- **FR-022**: All patterns MUST reference existing design tokens for spacing, color, typography, elevation, and radius — no hardcoded values.
- **FR-023**: All patterns MUST have zero JavaScript runtime dependencies — compiled CSS only.

### Key Entities

- **Dashboard Header**: The top-of-page composition containing the page title, description, breadcrumbs, context/status, and action regions. Defines the visual identity and navigation context for the page.
- **KPI Card**: A single metric tile showing an emphasized value, an explanatory label, and optional trend/comparison, icon, loading, or unavailable state. Designed for grid layout.
- **Record Header**: A composite component that presents the identity of a person, organization, service, or resource, including an avatar/icon, name, metadata, status, and actions.
- **Activity Row**: A single line item in an activity or task list, showing status, title, context, date/time, owner, and optional actions. Can appear grouped under section headings.
- **Schedule Item**: An appointment or calendar event line item showing date/time, title, location, time zone, status, and actions, with distinct visual states for cancelled, completed, tentative, and upcoming statuses.
- **Table Modifier**: Extended styling and documentation for the existing table wrapper, adding sortable columns, selected rows, status cells, row actions, loading, empty, and responsive behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can use any single dashboard or record-summary pattern by importing only that pattern's styles independently, without including all patterns.
- **SC-002**: All dashboard and record-summary patterns compile without errors under the existing Dart Sass build, producing CSS output with no new custom properties or hardcoded values.
- **SC-003**: KPI grids render correctly at 1, 2, 3, and 4 columns depending on container width, with no visual overflow at any column count.
- **SC-004**: All patterns pass color-contrast checks, remain fully functional under forced-colors mode, and operate correctly at 200% browser zoom with no loss of visible state boundaries or interactive targets.
- **SC-005**: Storybook stories exist for each pattern covering at minimum: populated/default, loading, empty/unavailable, and mobile/narrow-viewport variants, plus long-label edge cases.
- **SC-006**: Selective import of any single pattern produces only the CSS for that pattern in the output; all-in-one import includes all patterns without conflict or duplication.
- **SC-007**: KPI trend indicators are visually identifiable through both color and non-color cues (text label or icon) in all supported states (positive, negative, neutral).
- **SC-008**: Schedule item states (cancelled, completed, tentative, upcoming) are each visually distinguishable using text or icon differentiation in addition to color.

## Assumptions

- The existing `@pathable/styles` build pipeline (Dart Sass via `sass` npm package) handles compilation of new SCSS files without configuration changes.
- The existing table wrapper (`pathable-table` or equivalent) already provides base table styling; this feature adds only modifier classes and documentation for application-level concerns.
- Design tokens for spacing, color, typography, elevation, and radius already exist in the codebase and are sufficient to style all new patterns — no new tokens are needed.
- The project's existing Storybook setup supports adding story files for each new pattern with no additional configuration.
- Dashboard and record-summary patterns do not require JavaScript runtime logic for search, filtering, sorting (beyond visual sort-indicator styling), scheduling logic, or data fetching.
- Consumer applications are responsible for implementing sorting, row selection, scheduling logic, breadcrumb generation, and data fetching — the styles package provides only visual presentation.
- All patterns target modern browsers supporting CSS grid, `@media (forced-colors: active)`, `:focus-visible`, `:focus-within`, and attribute selectors.