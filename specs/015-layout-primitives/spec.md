# Feature Specification: Compositional Layout Primitives and Semantic Surfaces

**Feature Branch**: `015-layout-primitives`

**Created**: 2026-07-10

**Status**: Draft

**Input**: "Add compositional layout primitives and semantic surfaces — a set of PathAble layout primitives and semantic surface styles that can be composed into complete pages without requiring consumers to reconstruct complex grid combinations or invent one-off spacing rules."

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing)
- [Requirements](#requirements)
- [Success Criteria](#success-criteria)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Build a Page with Named Layout Primitives (Priority: P1)

As a consumer of the styles package, I want to build a complete page layout by composing small, single-responsibility layout primitives (container, stack, cluster, split, card grid, sidebar layout, sticky panel) rather than manually wiring USWDS grid classes and ad hoc spacing.

**Why this priority**: This is the core value — eliminating manual layout reconstruction. Without these primitives, every consumer must reimplement the same patterns.

**Independent Test**: Can be tested by composing a full page using each primitive once and verifying that all sections render in the correct positions at both mobile and desktop widths.

**Acceptance Scenarios**:

1. **Given** a consumer has a page with a header, main content area, and sidebar, **When** they compose it using the container, sidebar-layout, stack, and split primitives, **Then** the page renders with the correct visual hierarchy at all responsive breakpoints.
2. **Given** a consumer applies the card-grid primitive to a list of items, **When** the viewport is resized from desktop to mobile, **Then** the grid gracefully transitions from multiple columns to a single column without cards becoming unreasonably narrow.

---

### User Story 2 - Apply Semantic Surface Styles (Priority: P1)

As a consumer, I want to apply named surface styles (base, raised, inset, interactive, brand, inverse) to containers so that visual hierarchy is conveyed through semantic tokens rather than raw color, border, and shadow declarations.

**Why this priority**: Semantic surfaces are the foundation for visual depth and interactive states across all pages.

**Independent Test**: Can be tested by applying each surface variant to a simple block element and verifying the visual distinction between levels.

**Acceptance Scenarios**:

1. **Given** a consumer places two cards using raised and inset surfaces side by side, **When** viewed on the page, **Then** the raised surface appears elevated and the inset surface appears recessed, and both are visually distinguishable without excessive shadowing.
2. **Given** an interactive surface variant receives keyboard focus, **When** the user tabs to it, **Then** it shows a visible focus-visible or focus-within indicator distinct from its resting state.

---

### User Story 3 - Responsive Split and Sidebar Layouts (Priority: P2)

As a consumer, I want the split and sidebar-layout primitives to collapse to a logical stacked order on small screens so that content maintains its reading order without manual responsive overrides.

**Why this priority**: Responsive behavior is critical for mobile users, and getting it wrong (e.g., sidebar appearing above content on mobile) creates a poor experience. Consumers should not need to add their own responsive CSS.

**Independent Test**: Can be tested by placing content blocks A and B in a sidebar layout on desktop, then verifying that the DOM reading order is preserved when stacked on mobile.

**Acceptance Scenarios**:

1. **Given** a sidebar layout with main content followed by a secondary panel in DOM order, **When** viewed on a screen narrower than the collapse breakpoint, **Then** the panels stack in DOM order and the secondary panel does not visually overlap or obscure the primary content.
2. **Given** a split layout with two regions of equal importance, **When** the screen narrows, **Then** the regions stack in a logical order without content clipping.

---

### User Story 4 - Sticky Panel with Safe Fallback (Priority: P2)

As a consumer, I want the sticky-panel primitive to stick on large viewports but safely become static when the viewport is too short or narrow, so that focused content is never obscured.

**Why this priority**: Poor sticky behavior (content hidden behind a stuck panel) is a common accessibility failure.

**Independent Test**: Can be tested by placing a sticky panel in a sidebar layout and verifying it sticks on a tall desktop viewport but becomes static on a short or narrow viewport.

**Acceptance Scenarios**:

1. **Given** a consumer places a sticky-panel in a sidebar, **When** the viewport is tall enough (height exceeds panel height plus a reasonable threshold), **Then** the panel sticks as the page scrolls.
2. **Given** the same sticky panel, **When** the viewport is too short for the panel to fit without overlapping content, **Then** the panel renders as a static block and does not obscure any focused element.

---

### User Story 5 - Compose Nested Surfaces (Priority: P3)

As a consumer, I want to nest one surface inside another (e.g., a raised card inside an inset panel) and have both remain visually distinguishable without excessive shadows or contrast loss.

**Why this priority**: Nested surfaces are common in real UIs (e.g., a card inside a sidebar section). This ensures the design system handles the composability case gracefully.

**Independent Test**: Can be tested by nesting a raised surface inside an inset surface and verifying that both are distinguishable and the nested surface does not inherit unwanted parent styling.

**Acceptance Scenarios**:

1. **Given** a raised surface placed inside an inset surface, **When** rendered, **Then** both surfaces remain visually distinguishable.
2. **Given** three nested surface levels, **When** rendered, **Then** each level has a clear visual boundary and the deepest level does not appear overly shadowed or flat.

---

### Edge Cases

- What happens when a cluster of controls overflows its container? Does it wrap gracefully?
- What happens when a card grid contains fewer items than would fill one row? Does the grid remain left-aligned?
- How does an interactive surface behave when nested inside another interactive surface (double focus-within)?
- How does the split layout behave when one region is empty?
- What happens to surfaces in forced-colors / high-contrast mode — are boundaries preserved?
- What happens when a stack receives only one child element (no siblings to space)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a `pathable-container` primitive that supports standard content width, wide content width, and full-width constrained gutters, centered horizontally.
- **FR-002**: The system MUST provide a `pathable-stack` primitive that controls vertical flow between child elements using token-based spacing variants.
- **FR-003**: The system MUST provide a `pathable-cluster` primitive that creates a wrapping horizontal layout suitable for controls, tags, and action buttons, with configurable gutter spacing.
- **FR-004**: The system MUST provide a `pathable-split` primitive that creates a responsive two-region layout with configurable ratio, alignment, and collapsible behavior.
- **FR-005**: The system MUST provide a `pathable-card-grid` primitive that creates an auto-fitting grid layout suitable for cards and tiles, transitioning from multiple columns to one column without unreasonably narrow columns.
- **FR-006**: The system MUST provide a `pathable-sidebar-layout` primitive that positions a primary content area alongside a secondary sidebar, collapsing to stacked on small screens while preserving DOM reading order.
- **FR-007**: The system MUST provide a `pathable-sticky-panel` primitive that optionally sticks on large viewports and becomes static when the viewport is too short or narrow to prevent content obscuring.
- **FR-008**: The system MUST provide the following `pathable-surface` variants: base, raised, inset, interactive, brand, and inverse — each establishing visual hierarchy through semantic backgrounds, borders, radii, and elevation.
- **FR-009**: All spacing, widths, radii, borders, colors, and elevation values MUST use public PathAble design tokens.
- **FR-010**: No primitive or surface variant MAY impose product-specific content styling (e.g., font family, heading sizes, content colors).
- **FR-011**: Interactive surfaces MUST expose visible hover, focus-visible/focus-within, active, and disabled states where applicable.
- **FR-012**: All primitives and surface variants MUST remain usable at 200% browser zoom.
- **FR-013**: The system MUST preserve surface boundary distinctions in forced-colors / high-contrast mode.
- **FR-014**: Non-essential transitions MUST be removed when the user prefers reduced motion.
- **FR-015**: Selective imports and the all-in-one entry point for these primitives MUST both compile successfully.
- **FR-016**: Named container width variants MUST be documented with recommended use cases.
- **FR-017**: Each primitive MUST have exactly one clearly documented layout responsibility.

### Key Entities

- **Container**: A centered layout wrapper that constrains content width with configurable maximum widths (standard, wide, full-width with gutters).
- **Stack**: A vertical flow layout that adds consistent spacing between adjacent child elements using token-based spacing values.
- **Cluster**: A horizontal wrapping layout that groups related items (tags, buttons, controls) with even spacing between elements.
- **Split**: A two-region responsive layout that arranges content side by side on large screens and stacks vertically on small screens.
- **Card Grid**: An auto-fill grid layout that distributes items into columns that automatically adjust count based on available container width.
- **Sidebar Layout**: A two-region layout with a primary content area and a secondary sidebar that collapses below the primary content on small screens.
- **Sticky Panel**: A layout region that uses sticky positioning on large viewports but falls back to static positioning when the viewport would cause content overlap.
- **Surface**: A semantic visual container style that conveys depth through token-driven backgrounds, borders, border-radius, and elevation (shadow) without hardcoded color values.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Consumers can compose a complete page layout using only the provided primitives without writing custom spacing or grid CSS.
- **SC-002**: All primitives and surface variants are responsive and usable across viewport widths from 320px through 2560px with no content overflow or unreasonably narrow columns (card grid minimum column width is documented).
- **SC-003**: All primitives remain functional and surfaces remain visually distinguishable at 200% browser zoom.
- **SC-004**: Interactive surface states (hover, focus, active, disabled) are all visually distinct from one another and from the resting state.
- **SC-005**: All spacing, color, elevation, and radius values reference public design tokens — zero hardcoded values.
- **SC-006**: At least one Storybook story exists per primitive showing both its independent usage and at least one nested composition.
- **SC-007**: Forced-colors mode preserves visible boundaries between all adjacent surface variants.
- **SC-008**: Reduced-motion preference removes all non-essential transitions (animations related to hover/focus state changes are considered essential).

## Assumptions

- The existing USWDS layout grid and layout-oriented wrappers remain as-is and are not deprecated by this feature; these primitives are additive.
- Public PathAble design tokens exist and cover the needed spacing, width, color, elevation, radius, and border values.
- Consumers will import these primitives selectively (e.g., only the primitives they use) or via a bundled all-in-one entry point.
- Storybook stories will be created for each primitive; the story infrastructure already exists.
- The feature targets framework-neutral SCSS — no framework-specific components (React, Vue, etc.) are in scope.
- Application routing, responsive navigation behavior, and domain-specific dashboard/workflow components are explicitly out of scope.
- Nested surfaces must remain distinguishable without accumulating excessive shadow levels — reasonable limits apply (max 3 nesting levels before visual degradation is acceptable).