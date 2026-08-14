# Feature Specification: React Dashboard Header Wrapper

**Feature Branch**: `037-react-dashboard-header`

**Created**: 2026-08-14

**Status**: Draft

**Input**: User description: "Use speckit-specify to create a feature that creates a react version of the Dashboard Header component in the styles package. When creating the storybook entry, there should be a new Dashboard section in the React storybook to mirror the styles storybook structure."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Render a dashboard page header in React (Priority: P1)

A developer building a React application needs a page header for an operational
dashboard that shows a page title, an optional description, and action buttons.
Instead of hand-writing the `pathable-dashboard-header` markup, they use a
`DashboardHeader` React component that renders the same semantic structure and
appearance the design system already defines.

**Why this priority**: This is the core deliverable. Without a React component
there is nothing to consume, and the header is the entry point of every
dashboard page.

**Independent Test**: Can be fully tested by rendering `DashboardHeader` with a
title, a description, and actions, and confirming the resulting page exposes a
heading, description text, and operable action controls in the correct regions.

**Acceptance Scenarios**:

1. **Given** a consumer renders `DashboardHeader` with a title and actions, **When** the page is displayed, **Then** the title is exposed as the page's primary heading and the actions appear beside the title.
2. **Given** a consumer renders `DashboardHeader` with a description, **When** the page is displayed, **Then** the description appears below the title row.
3. **Given** a consumer renders `DashboardHeader` without optional regions (no breadcrumb, context, description, or actions), **When** the page is displayed, **Then** the title still renders correctly and no empty regions are shown.

---

### User Story 2 - Render breadcrumb and status context (Priority: P2)

A developer needs to show navigational breadcrumbs and a status/context label
(such as "Active · Q4 2026") above and beside the title, matching the existing
design-system contract.

**Why this priority**: Breadcrumb and context are commonly used but optional;
the title-only case is more fundamental and must work first.

**Independent Test**: Can be fully tested by rendering `DashboardHeader` with a
breadcrumb and a context label and confirming both render in their intended
positions.

**Acceptance Scenarios**:

1. **Given** a consumer provides breadcrumb items, **When** the page is displayed, **Then** the breadcrumb renders above the title with each item separated appropriately.
2. **Given** a consumer provides a context label, **When** the page is displayed, **Then** the context label renders beside the title.

---

### User Story 3 - Render variant and responsive states (Priority: P3)

A developer needs the header to adapt to dense (compact) layouts, stacked
layouts, long titles, and narrow/mobile viewports without layout breakage.

**Why this priority**: These are refinement states. The primary header works
first; variant and responsive robustness follow.

**Independent Test**: Can be fully tested by rendering the compact and stacked
variants, a long title, and a mobile viewport, and confirming each renders
without overflow or lost content.

**Acceptance Scenarios**:

1. **Given** a consumer enables the compact variant, **When** the page is displayed, **Then** the header uses reduced padding and spacing.
2. **Given** a consumer enables the stacked variant, **When** the page is displayed, **Then** the actions stack below the title rather than sitting beside it.
3. **Given** the title is very long, **When** the page is displayed, **Then** the title wraps without overflowing the header.
4. **Given** a narrow (mobile) viewport, **When** the page is displayed, **Then** actions stack below the title and the header remains usable.

---

### Edge Cases

- What happens when the title is empty or missing? The title is required; the
  component must always render a primary heading for page orientation.
- What happens when actions are present but no title is provided? The title
  remains the anchor of the layout, so this must still render predictably.
- What happens with a very long unbroken title string at a narrow width? Text
  must wrap rather than overflow the container.
- What happens when many action buttons are supplied? Actions wrap onto
  additional lines rather than overflowing.
- What happens with a long breadcrumb trail on a narrow viewport? The
  breadcrumb must not force horizontal overflow.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A `DashboardHeader` React component MUST wrap the existing
  `pathable-dashboard-header` styles contract owned by `packages/styles`
  (source: `pathable-dashboard-header.scss`). The component MUST NOT define any
  new visual contract, token, or component-class behavior.
- **FR-002**: `DashboardHeader` MUST render the semantic structure of the
  styles contract, including a primary page heading (`h1`) for the title and
  correctly ordered regions for breadcrumb, context, description, and actions.
- **FR-003**: The component MUST expose the title as a required prop rendered
  as the page's primary heading.
- **FR-004**: The component MUST support optional breadcrumb, context, and
  description regions that map to the corresponding
  `pathable-dashboard-header__breadcrumb`, `__context`, and `__description`
  classes, and MUST omit any region that is not provided.
- **FR-005**: The component MUST support an optional actions region that maps
  to `pathable-dashboard-header__actions` and accepts consumer-supplied action
  controls (such as the existing `Button` component).
- **FR-006**: The component MUST support the `compact` and `stacked` modifier
  variants, mapping to `pathable-dashboard-header--compact` and
  `pathable-dashboard-header--stacked` respectively.
- **FR-007**: The component MUST forward additional root attributes and class
  names without discarding the base `pathable-dashboard-header` class.
- **FR-008**: The component MUST be exported from the `packages/react` public
  entrypoint, and the entrypoint MUST continue to import `@pathable/styles`
  so consumers receive the required CSS, fonts, and assets automatically
  without a separate styles import.
- **FR-009**: The component name MUST follow React naming parity:
  `pathable-dashboard-header` → `DashboardHeader`.
- **FR-010**: The React Storybook MUST present the `DashboardHeader` stories
  under a new top-level `Dashboard` section (titled to mirror the styles
  Storybook's `Dashboard/Dashboard Header` entry), not under the existing
  `Components` hierarchy. This mirrors the `Dashboard` section already present
  in the styles Storybook.
- **FR-011**: The React Storybook MUST provide deterministic, named stories for
  each meaningful supported state, at minimum: default (full header with
  breadcrumb, context, description, and actions), without actions, many
  actions, compact, stacked, mobile/narrow viewport, and long title.
- **FR-012**: Stories MUST be deterministic — no live dates, random values, or
  network calls — and MUST use accessible queries for any interaction tests.
- **FR-013**: At least one interaction test MUST verify keyboard focus and
  activation behavior of the action controls in the header.
- **FR-014**: The header MUST preserve the accessibility behavior of the styles
  contract: a semantic primary heading, native button/link semantics for
  actions and breadcrumb links, and forced-colors and reduced-motion behavior
  inherited from the styles contract.
- **FR-015**: The header MUST preserve responsive behavior inherited from the
  styles contract: actions sit beside the title on wide screens and stack below
  it on narrow screens.
- **FR-016**: Automated rendered accessibility checks MUST pass for the stable
  stories, and static JSX accessibility linting MUST pass, without disabling or
  weakening any lint or a11y rule.

### Key Entities *(include if feature involves data)*

- **DashboardHeader**: A React component representing the dashboard page header
  region. Key attributes: `title` (required), `breadcrumb`, `context`,
  `description`, `actions`, `compact`, `stacked`.
- **Breadcrumb item**: A navigational step rendered above the title; attributes
  include link text and an optional destination.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A React consumer can render a dashboard page header by using the
  `DashboardHeader` component alone, with no hand-written
  `pathable-dashboard-header` markup and no separate `@pathable/styles` import.
- **SC-002**: Every supported state listed in FR-011 has a named, deterministic
  Storybook story that renders without layout overflow.
- **SC-003**: 100% of the stable dashboard-header stories pass automated
  rendered accessibility checks and static accessibility linting.
- **SC-004**: The React Storybook exposes a `Dashboard` section whose
  `Dashboard Header` entry is discoverable in the same way as the styles
  Storybook's `Dashboard/Dashboard Header` entry.
- **SC-005**: Keyboard and focus interaction tests verify that action controls
  in the header are reachable and operable by keyboard.
- **SC-006**: The React package builds and its Storybook tests pass
  independently (via the project's React Storybook build and test commands).

## Assumptions

- The owning styles contract `pathable-dashboard-header` is already implemented
  and published in `packages/styles`, so this feature adds a framework wrapper
  only and no new SCSS.
- The `Button` component already exported by `packages/react` is the intended
  way consumers provide action controls; the header itself does not reimplement
  buttons.
- The breadcrumb region accepts consumer-supplied content (text/links) rather
  than defining a new breadcrumb data model, consistent with the styles
  contract's markup.
- The context label is optional and is treated as presentational supporting
  text beside the title.
- The title is a required string; consumers are responsible for supplying
  meaningful, concise page titles.
- The React Storybook title convention mirrors the styles Storybook title
  (`Dashboard/Dashboard Header`), establishing a new top-level `Dashboard`
  section rather than nesting under `Components`.
