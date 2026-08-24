# Feature Specification: Promote Repeated Composition Patterns into Higher-Level Primitives

**Feature Branch**: `056-promote-composition-patterns`

**Created**: 2026-08-24

**Status**: Draft

**Input**: User description: "Promote repeated, proven composition patterns identified in the application layout audit (slice 13) into higher-level Pathable-specific primitives in `@pathable/react`. Each candidate is promoted only if it has stable semantics, demonstrated value across multiple features or applications, and clear ownership of child constraints, responsive behavior, landmarks, focus order, and accessibility requirements."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Render a Responsive Card Grid (Priority: P1)

A developer building a listing page, dashboard, or catalog needs to display a responsive, wrapping grid of card-like surfaces with consistent spacing. Instead of manually composing `Cluster` and `Surface` with boilerplate CSS class combinations, they use a single `CardGrid` component that handles wrapping, gap, and visual treatment out of the box.

**Why this priority**: The `Cluster → Surface` card grid is the single most repeated pattern in the audit (10 files), and the CSS auto-fit `CardGrid` variant appears in 4 additional files. Together they represent the most impactful composition to promote. Every application that shows lists of items — dashboards, search results, resource browsers — needs this pattern.

**Independent Test**: Create a `CardGrid` component, import it, pass a collection of child cards, and verify the rendered DOM uses the existing `pathable-cluster`/`pathable-card-grid` and `pathable-surface` SCSS contracts without raw utility CSS strings. Storybook stories show responsive wrapping at narrow and wide viewports.

**Acceptance Scenarios**:

1. **Given** a `CardGrid` with `gap="md"` and child `Card` elements, **When** rendered at desktop width, **Then** cards display in a row with `1.5rem` gap between them, each card uses the `pathable-surface` visual contract.
2. **Given** a `CardGrid` at narrow viewport, **When** content exceeds available width, **Then** cards wrap to the next row and remain evenly spaced.
3. **Given** a `CardGrid` with `variant="auto-fit"`, **When** rendered, **Then** cards auto-fill the row using `pathable-card-grid` CSS Grid behavior, wrapping when minimum card width is reached.
4. **Given** a `CardGrid` with no children, **When** rendered, **Then** the component renders an empty container without extra DOM clutter or error.

---

### User Story 2 — Scaffold a Full Page Layout (Priority: P2)

A developer starting a new page needs a width-constrained content area with consistent vertical spacing between page sections. Instead of manually wrapping a `Container` around a `Stack`, they use a `Page` component that composes both primitives with sensible defaults.

**Why this priority**: The `Container → Stack` page shell pattern appeared in 12 files — the highest individual frequency. Page scaffolding is needed in every application screen. By eliminating manual `Container` + `Stack` boilerplate, this primitive ensures visual consistency across all pages.

**Independent Test**: Render a `Page` with child content, verify the DOM uses `pathable-container` for width constraint and `pathable-stack` for vertical spacing. Confirm width-responsive behavior at desktop, tablet, and narrow viewports.

**Acceptance Scenarios**:

1. **Given** a `Page` with `size="desktop"` and child sections, **When** rendered, **Then** content is width-constrained via `pathable-container` and sections are vertically spaced via `pathable-stack`.
2. **Given** a `Page` with `size="standard"`, **When** rendered at tablet viewport, **Then** content adjusts to the standard max-width.
3. **Given** a `Page` with `gap="4"`, **When** rendered, **Then** child sections have `1rem` vertical gap between them.
4. **Given** a `Page` with a single child, **When** rendered, **Then** the layout still renders correctly without collapsing.

---

### User Story 3 — Display a Sidebar Alongside Main Content (Priority: P3)

A developer building a settings page, resource detail view, or navigation-heavy screen needs a persistent sidebar alongside the main content area. Instead of managing raw CSS classes (`pathable-sidebar-layout`, `pathable-sidebar-layout--ratio-2-1`, `pathable-sticky-panel`) on generic `<div>` elements, they use a `SidebarLayout` component with typed props for ratio, sidebar position, and sticky behavior.

**Why this priority**: This pattern appeared in 6 files and is critical for navigation-heavy layouts. Current consumers rely entirely on raw CSS classes on `<div>` elements — a typed React component with semantic HTML (`<main>` and `<aside>`) provides better accessibility and developer experience.

**Independent Test**: Render a `SidebarLayout` with sidebar and main content children, verify the DOM uses `pathable-sidebar-layout` classes, semantic `<main>` and `<aside>` elements, and sticky behavior works during scroll.

**Acceptance Scenarios**:

1. **Given** a `SidebarLayout` with `ratio="2-1"`, **When** rendered, **Then** the main column is twice as wide as the sidebar, using the `pathable-sidebar-layout--ratio-2-1` CSS modifier.
2. **Given** a `SidebarLayout` with `sidebarFirst`, **When** rendered at narrow viewport, **Then** the sidebar appears before main content in DOM order.
3. **Given** a `SidebarLayout` with a sticky sidebar child, **When** the page scrolls, **Then** the sidebar remains visible via `pathable-sticky-panel`.
4. **Given** `SidebarLayout` is inspected for accessibility, **When** a screen reader encounters it, **Then** the `<main>` region is programmatically distinguishable from `<aside>` via ARIA landmarks.

---

### User Story 4 — Build a Vertical Form with Consistent Spacing (Priority: P4)

A developer building a settings form or data-entry screen needs to stack form fields vertically with consistent spacing. Instead of manually composing `Stack` with `gap="4"` and wrapping each field in a `FormGroup`, they use a `FormStack` component that provides form-specific defaults (gap, max-width, `<form>` semantics) out of the box.

**Why this priority**: The `Stack → FormGroup` pattern appeared in 8 files. Consistent form spacing is essential for professional-looking applications. A dedicated `FormStack` eliminates guesswork around optimal field spacing and provides an `<form>` container by default.

**Independent Test**: Render a `FormStack` with form fields, verify it renders as `<form>` element with consistent vertical gap between fields. Confirm Storybook stories show forms at desktop and narrow widths.

**Acceptance Scenarios**:

1. **Given** a `FormStack` with `gap="4"`, **When** rendered, **Then** form fields have `1rem` vertical spacing between them.
2. **Given** a `FormStack` with `maxWidth="tablet"`, **When** rendered, **Then** the form is constrained to a readable maximum width.
3. **Given** a `FormStack` containing `FormGroup` children with labels and inputs, **When** rendered, **Then** each field label is properly associated with its input via `pathable-form-group` and `pathable-label` SCSS contracts.
4. **Given** a `FormStack` without a `maxWidth` prop, **When** rendered, **Then** the form uses a reasonable default maximum width appropriate for form readability.

---

### User Story 5 — Lay Out Two Columns Side-by-Side (Priority: P5)

A developer creating a hero section, comparison panel, or call-to-action layout needs two proportional columns displayed side-by-side. Instead of using raw `pathable-split` CSS classes, they use a `SplitLayout` component that manages column ratios, alignment, and responsive stacking.

**Why this priority**: The `Split` pattern appeared in 5 files. While less frequent than card grids or page scaffolding, it serves a distinct layout need (explicit two-column semantics with stretch alignment) that is not met by `Cluster` or `Inline`.

**Independent Test**: Render a `SplitLayout` with two child panels, verify the DOM uses `pathable-split` and `pathable-split--align-stretch` CSS classes, and columns stack vertically at narrow viewports.

**Acceptance Scenarios**:

1. **Given** a `SplitLayout` with two child panels, **When** rendered at desktop width, **Then** the panels display side-by-side in equal-width columns using `pathable-split`.
2. **Given** a `SplitLayout` with `align="stretch"`, **When** one panel has more content than the other, **Then** both panels stretch to the same height via `pathable-split--align-stretch`.
3. **Given** a `SplitLayout` at narrow viewport, **When** columns cannot fit side-by-side, **Then** panels stack vertically.
4. **Given** a `SplitLayout` with only one child, **When** rendered, **Then** the single panel fills available width without layout breakage.

---

### Edge Cases

- What happens when a promoted primitive receives zero children? Each primitive must render an empty, valid container without causing layout collapse.
- What happens when a `CardGrid` receives children that are not card-shaped (e.g., inline text, buttons)? The grid must not impose card-specific styling on non-card children — only the wrapper layout (gap, wrapping behavior) should apply.
- What happens when `SidebarLayout` is rendered without a sidebar child? The main content should fill 100% width gracefully.
- What happens when a `Page` or `CardGrid` is nested inside another `Page`? Nested `Page` usage is undefined — behavior should be documented but not actively prevented.
- How does `SplitLayout` handle extremely long, unbreakable content in one panel (e.g., a long URL or code block)? Content must not overflow its column container.
- What happens when a `FormStack` wraps children that are not `FormGroup` elements (e.g., raw text, icons, custom components)? The stack must apply vertical spacing uniformly without assuming child structure.
- How does each primitive behave with forced colors or high-contrast mode? Visual boundaries (borders, separators) must remain perceivable.

## Requirements *(mandatory)*

### Functional Requirements

**Build from existing primitives**:

- **FR-001**: Each promoted primitive MUST be composed from existing lower-level primitives (`Container`, `Stack`, `Inline`, `Cluster`, `Grid`, `Box`, `Surface`) and system props — not raw `pathable-*` CSS utility strings applied to generic `<div>` elements.
- **FR-002**: Each promoted primitive MUST use the existing SCSS contracts from `packages/styles` for visual presentation. No new SCSS contracts may be introduced unless a gap is explicitly identified and documented.
- **FR-003**: The `Box` and `Grid` primitives MUST be implemented and available in `@pathable/react` before higher-level composition primitives that depend on them are built.

**Component contracts**:

- **FR-004**: Each promoted primitive MUST specify ownership of: responsive behavior (when columns stack, when items wrap), ARIA landmarks/roles where applicable, heading level integration, focus order, and child constraints (what type of children are expected).
- **FR-005**: Each promoted primitive MUST preserve the ability to override via a `className` prop for consumer-specific styling.
- **FR-006**: Each promoted primitive MUST support an `as` polymorphic prop where safe (allowing consumers to change the root HTML element) — unless changing the element would break semantics or accessibility (e.g., a `<main>` landmark MUST NOT be overridden to a `<div>`).

**Primitive-specific requirements**:

- **FR-007**: `CardGrid` MUST support both `cluster` mode (wrapping flex-based card grid composing `Cluster → Surface`) and `auto-fit` mode (CSS Grid-based auto-filling card grid using `pathable-card-grid`). Both modes MUST accept the same child Card elements and apply consistent visual treatment.
- **FR-008**: `Page` MUST compose `Container` for width constraint and `Stack` for vertical section spacing. It MUST accept a `size` prop mapped to `Container` sizes (e.g., `desktop`, `standard`) and a `gap` prop mapped to `Stack` gap tokens.
- **FR-009**: `SidebarLayout` MUST render `<main>` for main content and `<aside>` for sidebar content with appropriate ARIA landmarks. It MUST accept a `ratio` prop (e.g., `1-1`, `2-1`, `3-1`), a `sidebarFirst` prop for DOM ordering, and support sticky sidebar behavior via composition with the existing `pathable-sticky-panel` class.
- **FR-010**: `FormStack` MUST render as a `<form>` element by default and compose `Stack` for vertical spacing with a form-appropriate default gap. It MUST accept a `maxWidth` prop to constrain form readability (e.g., `tablet`, `content`).
- **FR-011**: `SplitLayout` MUST compose `pathable-split` CSS classes for two-column layout and support `align` variants (e.g., `stretch`). At narrow viewports, columns MUST stack vertically.

**Testing and documentation**:

- **FR-012**: Each promoted primitive MUST have unit tests confirming it renders the expected HTML structure, CSS classes, and slot/content behavior.
- **FR-013**: Each promoted primitive MUST have Storybook stories demonstrating the component in isolation and in representative compositions.
- **FR-014**: Each promoted primitive MUST have a migration guide (in Storybook or embedded documentation) showing before (ad-hoc raw class composition) and after (new primitive) usage.
- **FR-015**: Server-side rendering and client-side rendering outputs MUST be identical for each promoted primitive.

**Accessibility**:

- **FR-016**: Landmark regions (`<main>`, `<aside>`, `<nav>`) used by promoted primitives MUST be exposed to assistive technology via appropriate ARIA roles where the HTML element alone is insufficient.
- **FR-017**: Each primitive MUST NOT introduce keyboard trap, focus order disruption, or visible focus indicator removal.
- **FR-018**: Static JSX accessibility linting and rendered accessibility tests MUST pass for all promoted primitives. Narrow story-level exceptions require documented justification.

**Responsive and resilient states**:

- **FR-019**: Each primitive MUST handle narrow/mobile layouts (columns stack, grids remain usable, content does not overflow).
- **FR-020**: Each primitive MUST handle long or localized-looking content without layout breakage.
- **FR-021**: Each primitive MUST support `prefers-reduced-motion` by not animating layout changes or transitions when the user prefers reduced motion.

**Exports and package compliance**:

- **FR-022**: Each promoted primitive MUST be exported from the `@pathable/react` package's public API.
- **FR-023**: `@pathable/react` MUST import the required `@pathable/styles` compiled CSS/assets automatically so consumers do not need a separate `@pathable/styles` import.
- **FR-024**: Each React component name MUST follow the CamelCase naming convention derived from the equivalent `pathable-*` component name (e.g., `CardGrid`, `SidebarLayout`, `Page`, `SplitLayout`, `FormStack`).

**CI and quality gates**:

- **FR-025**: All linting, formatting, type-checking, build, test, and accessibility gates MUST pass. Lint suppressions MUST NOT be added to bypass failures.

### Key Entities

- **CardGrid**: A layout primitive that renders a responsive grid of card surfaces. Two modes: Cluster-based wrapping flex grid and CSS Grid-based auto-fit grid. Uses `pathable-cluster` / `pathable-surface` or `pathable-card-grid` SCSS contracts depending on mode. Composes `Cluster`, `Surface`, or raw layout primitives as needed.
- **Page**: A page-level scaffold that composes `Container` (width constraint) and `Stack` (vertical spacing). Maps `size` to Container width variants and `gap` to Stack spacing tokens. Uses no new SCSS — pure React composition of existing primitives.
- **SidebarLayout**: A two-column layout with `<main>` and `<aside>` semantic regions. Supports configurable width ratios, sidebar-first DOM ordering, and sticky sidebar behavior. Uses `pathable-sidebar-layout` and `pathable-sticky-panel` SCSS contracts.
- **SplitLayout**: A two-column side-by-side layout for hero sections and panel comparisons. Supports stretch alignment and responsive stacking. Uses `pathable-split` SCSS contract.
- **FormStack**: A vertical form layout that renders as a `<form>` element and composes `Stack` with form-appropriate defaults. Accepts `FormGroup` children with labels and inputs. Uses `pathable-stack` and `pathable-form-group` SCSS contracts — no new CSS required.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Each promoted primitive renders correctly with the expected DOM structure, CSS classes, and semantic HTML elements across desktop, tablet, and narrow viewports.
- **SC-002**: Each promoted primitive passes automated accessibility validation without violations.
- **SC-003**: Each promoted primitive has at least one Storybook story demonstrating the component in isolation and at least one story showing it in a representative composition.
- **SC-004**: A developer can replace ad-hoc `Container` + `Stack` + raw CSS class combinations with the equivalent promoted primitive by following the migration guide, and the rendered output is visually indistinguishable from the ad-hoc approach for default configurations.
- **SC-005**: Each primitive renders identically regardless of rendering context (initial page load vs. interactive hydration) with the same props.
- **SC-006**: All promoted primitives are exported from `@pathable/react` and importable without a separate client-side `@pathable/styles` import.
- **SC-007**: No new SCSS contracts are introduced — every primitive uses existing `packages/styles` classes or pure composition of existing primitives.

## Assumptions

- The `Box` and `Grid` primitives (slices 4 and 8 of the React Semantic Primitives plan) are completed or will be completed before implementation begins. If they are not available, the higher-level primitives will compose existing layout primitives (`Cluster`, `Inline`, `Stack`, `Container`, `Surface`) where `Box`/`Grid` would otherwise be used.
- The audit findings in `docs/plans/semantic-react/audit-findings.md` are current and accurate. The list of patterns to promote is based on those findings and the prioritization established in `docs/plans/semantic-react/14-promote-composition-patterns.md`.
- The existing SCSS contracts (`pathable-cluster`, `pathable-surface`, `pathable-sidebar-layout`, `pathable-split`, `pathable-stack`, `pathable-card-grid`, `pathable-sticky-panel`, `pathable-form-group`) are stable and complete. No SCSS modifications are required for this feature.
- The existing React component `ButtonGroup` already fulfills the action-grouping pattern and is not duplicated here. The `AppShell` and `EmptyState` components are already promoted and are also not duplicated.
- Migration guides are documentation artifacts (Storybook stories or inline component docs), not separate migration scripts or codemods.
- "Promoted" primitives are new components that replace ad-hoc composition patterns; they do not modify or deprecate the underlying primitives (`Container`, `Stack`, `Cluster`, etc.) that compose them.
- External application repositories not accessible from this monorepo may contain additional patterns. This feature's candidate list is bounded by the audit scope described in `audit-findings.md`.