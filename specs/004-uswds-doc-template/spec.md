# Feature Specification: USWDS Documentation Page Template for Astro Docs

**Feature Branch**: `004-uswds-doc-template`

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "the USWDS website has a template for documentation pages: https://designsystem.digital.gov/templates/documentation-page/ our packages/styles package wraps uswds and we should be able to use all the uswds components. I want the astro docs in apps/docs to end up looking like this page. That does not mean use the template exactly, instead look at the template and its html and think about how to idomatically implement the same result in astro. You MUST use styles from our package/styles both for consistency and because that is how we will test the styles package. You MAY use usa-* classes if pathable-* equivalents are not yet exposed."

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Developer browses documentation with USWDS-inspired layout (Priority: P1)

As a developer reading the Pathable Styles documentation site, I want to see a clean, USWDS-inspired layout with a top navigation bar, a hierarchical side navigation, and well-structured prose content, so that I can quickly find and absorb information about the design system.

**Why this priority**: The visual presentation of the docs site is the primary deliverable — it validates that the `@pathable/styles` tokens render correctly and provides a professional experience for all visitors.

**Independent Test**: Can be fully tested by navigating to any documentation page and verifying the layout structure: top nav bar with section links, left sidebar with hierarchical page navigation, main content area with styled prose, and a footer.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to any documentation page, **When** the page loads, **Then** the page displays a fixed top navigation bar containing the Pathable Styles logo/title and links to top-level sections (Getting Started, Foundations, For Agents, Roadmap).
2. **Given** a visitor on a desktop-width viewport, **When** viewing a documentation page, **Then** the page shows a left sidebar with hierarchical navigation reflecting the current page's section and subsections.
3. **Given** a visitor on a mobile-width viewport, **When** viewing a documentation page, **Then** the page hides the left sidebar behind a menu toggle, and the content fills the full width.
4. **Given** any documentation page, **When** the page renders, **Then** the main content area uses prose styling (readable max-width, appropriate heading sizes, body text sizing) consistent with the `--pathable-*` tokens from `@pathable/styles`.

---

### User Story 2 — Developer verifies USWDS token output through component rendering (Priority: P1)

As a developer maintaining `@pathable/styles`, I want to see the USWDS theme tokens rendered in real Astro components on the docs site, so that I can visually verify that the token mappings produce the expected brand colors and typography.

**Why this priority**: The docs site serves as the primary test surface for the styles package. Rendering components with `@pathable/styles` tokens exercises the entire build pipeline from SCSS compilation to browser rendering.

**Independent Test**: Can be tested by inspecting the rendered docs page and confirming that the header background uses the surface token value, the text uses the text token value, accent elements (links, active states) use the accent token value, and the typography matches the Pathable font stack.

**Acceptance Scenarios**:

1. **Given** the docs site is built, **When** a page renders, **Then** the page background uses `--pathable-color-bg`, the header/surface areas use `--pathable-color-surface`, and body text uses `--pathable-color-text`.
2. **Given** a link is rendered on any docs page, **When** the link appears, **Then** its color matches `--pathable-color-link` (Bright Blue Brooks).
3. **Given** the nav bar renders, **When** inspecting the active nav item, **Then** its accent/indicator color matches `--pathable-color-accent` (Intelligent Jade).
4. **Given** any page with `usa-*` utility classes (e.g., `.bg-primary`, `.text-base`), **When** the page renders, **Then** those utilities resolve to the PathAble-branded USWDS theme colors configured in `_uswds-theme.scss`.

---

### User Story 3 — Maintainer validates responsive layout (Priority: P2)

As a maintainer, I want the docs site to be responsive across device sizes, adapting the USWDS grid layout idiomatically for mobile, tablet, and desktop viewports.

**Why this priority**: Responsive design is a core expectation of any documentation site. The USWDS template uses a three-column layout on desktop (sidebar + content + right TOC) that collapses to a single column on mobile.

**Independent Test**: Can be tested by resizing the browser viewport and verifying that the sidebar hides on mobile, content fills the full width, and the nav adapts appropriately.

**Acceptance Scenarios**:

1. **Given** a viewport narrower than desktop breakpoint, **When** viewing a docs page, **Then** the side navigation is hidden behind a hamburger/menu toggle, and the main content spans the full viewport width.
2. **Given** a desktop-width viewport, **When** viewing a docs page, **Then** the side navigation is visible as a left column, and the main content area has a constrained readable width.
3. **Given** any viewport size, **When** content is long enough to scroll, **Then** the header and horizontal nav remain fixed at the top.

---

### Edge Cases

- What happens when a page has no sidebar navigation (e.g., the splash/home page)? The sidebar should be hidden entirely, and the content should fill the full layout width.
- What happens when the browser window is extremely narrow (under 320px)? Navigation items should collapse or wrap without horizontal overflow.
- What happens when a visitor uses a screen reader? All navigation landmarks should have proper ARIA labels, and skip-to-content links should be present.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The docs site MUST use `@pathable/styles/dist/styles.css` as its primary stylesheet, consuming all `--pathable-*` CSS custom properties for colors, typography, spacing, elevation, and border-radius.
- **FR-002**: The page layout MUST follow the USWDS documentation template structure: fixed top header with brand logo and primary navigation, optional left sidebar with hierarchical page navigation, main content area with prose-optimized styling, and a site footer.
- **FR-003**: The top header bar MUST contain the Pathable Styles brand/logo link and horizontal navigation links to the top-level sections (Getting Started, Foundations, For Agents, Roadmap), mirroring the USWDS basic header pattern.
- **FR-004**: The side navigation MUST support hierarchical (multi-level) page links styled to match the USWDS side navigation (`usa-sidenav`) visual pattern, using `--pathable-*` tokens for colors and spacing.
- **FR-005**: The main content area MUST use prose-optimized typography — headings styled with `--pathable-font-heading` and body text with `--pathable-font-body`, with appropriate sizing hierarchy and readable line lengths.
- **FR-006**: The docs site MAY use USWDS utility and component classes (`.usa-*`) for layout elements where `--pathable-*` equivalents do not yet exist, either by loading USWDS styles or by authoring equivalent CSS.
- **FR-007**: The layout MUST be responsive: on desktop, show sidebar alongside content as a two-column layout; on mobile, hide sidebar behind a toggle and use full-width content.
- **FR-008**: The footer MUST mirror the USWDS medium footer pattern, with a "return to top" link, primary links section, and secondary contact/social section, all styled using `--pathable-*` tokens.
- **FR-009**: The Starlight table of contents (right sidebar) SHOULD be preserved as an additional navigation aid on desktop, adjusting its position to account for the top header and horizontal nav.
- **FR-010**: All custom page regions (header, navigation, sidebar, footer) MUST use `--pathable-*` CSS custom properties for colors, spacing, and typography rather than hardcoded values, to ensure consistency with the styles package.
- **FR-011**: A skip-to-main-content navigation link MUST be present at the top of every page, using `--pathable-color-focus-ring` for focus visibility.

### Key Entities

- **Page Layout**: The overall page structure composed of header, sidebar, main content, and footer regions.
- **Horizontal Navigation / Primary Nav**: The top navigation bar with links to top-level doc sections, styled like the USWDS basic header.
- **Side Navigation / Sidebar**: The hierarchical page tree nav, styled like the USWDS side navigation component.
- **Content Prose**: The main body area with typography styling (headings, paragraphs, lists, code) using Pathable fonts and tokens.
- **Footer**: The site footer with links and branding, styled like the USWDS medium footer pattern.
- **Header Brand / Logo**: The Pathable Styles identity element in the top header, styled similarly to the USWDS logo block.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every documentation page renders with the correct layout structure: fixed header, horizontal nav, optional sidebar, main content area, and footer — verified by inspection across 3+ pages.
- **SC-002**: All `--pathable-*` tokens used in custom components (color, typography, spacing) resolve to their expected values, confirmed by inspecting computed styles in browser DevTools. Zero hardcoded color or spacing values in component styles.
- **SC-003**: The page layout adapts correctly at the USWDS standard breakpoints (mobile < 640px, tablet 640-1024px, desktop > 1024px) — sidebar visibility, nav wrapping, and content width all behave as expected.
- **SC-004**: A new visitor can identify the current page's location in the documentation hierarchy at a glance, via the active state in both the top nav (current section) and the side nav (current page and parent).
- **SC-005**: The docs site build completes without errors, and the rendered pages use the Pathable brand fonts for headings and body text in the USWDS-inspired layout.

## Assumptions

- The `@pathable/styles` package provides only token CSS (`--pathable-*` custom properties) and does not include USWDS component or utility classes. To render USWDS-style navigation and layout elements, the docs site will need to either: (a) import USWDS component CSS separately, or (b) implement equivalent styles using `--pathable-*` tokens. This feature assumes approach (b) — implementing custom Astro components styled with `--pathable-*` tokens — is the primary strategy, with `.usa-*` classes used sparingly only where no `--pathable-*` equivalent exists.
- Government-specific elements from the USWDS template (`.usa-banner`, `.usa-identifier`) are NOT included in this implementation. The Pathable Styles docs are a commercial design system documentation site, not a government website, and these elements would be misleading and irrelevant.
- The Starlight table of contents (right sidebar) will be preserved as-is. The feature focuses on the page frame (header, sidebar, content, footer) rather than the TOC position.
- The existing search functionality will be preserved in the header area, adapted to match the USWDS basic header visual pattern.
- The existing site configuration changes are in-progress and this feature builds upon them — the framework is already configured to allow custom page layout components.
- PathAble's brand fonts are expected to be available for use in the docs site. If they are not yet loaded, this feature may need to add them as a prerequisite.