# Feature Specification: React Desktop Shell Wrapper

**Feature Branch**: `035-react-desktop-shell-wrapper`

**Created**: 2026-08-13

**Status**: Draft

**Input**: User description: "Create the React version of the Desktop Shell component"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Render a Desktop Application Shell with Sidebar (Priority: P1)

A product developer using the React wrapper package can render a Pathable application
shell with a persistent sidebar containing brand, primary navigation, and account
context without manually assembling the underlying design-system class structure.

**Why this priority**: The desktop application shell with sidebar is the primary
navigation structure for operational tools. A React wrapper that composes
sidebar regions declaratively eliminates class-structure errors and provides the
foundation upon which all other shell features depend.

**Independent Test**: Can be fully tested by rendering the wrapper's AppShell
component with a sidebar containing brand content, three navigation items, and
account context, then verifying the result presents the same structural regions
and visual treatment as the existing `packages/styles` app shell contract.

**Acceptance Scenarios**:

1. **Given** a developer imports `AppShell` from the React wrapper package,
   **When** they render it with sidebar brand, navigation, and account regions,
   **Then** users see a styled Pathable application shell with those regions
   in the expected order and layout.
2. **Given** the AppShell renders a navigation item marked as active,
   **When** inspected, **Then** the active item is clearly differentiated using
   color, weight, and an inset border marker consistent with the
   `packages/styles` active-nav contract.
3. **Given** the AppShell is configured with fixed sidebar positioning,
   **When** the main content scrolls, **Then** the sidebar remains visible
   without covering the main content area.
4. **Given** the AppShell renders with standard content width,
   **When** inspected, **Then** the main content respects the standard
   max-width and predictable gutters defined by the styles contract.

---

### User Story 2 - Render a Mobile Shell with Top Bar (Priority: P1)

A product developer using the React wrapper package can render a Pathable
application shell that displays a compact top bar and optional bottom navigation
on narrow viewports, without writing separate mobile markup.

**Why this priority**: Mobile navigation is critical for field staff using
tablets and phones. The wrapper must surface the responsive behavior of the
existing styles contract so the shell automatically switches between the desktop
sidebar layout and the mobile top-bar layout.

**Independent Test**: Can be tested by rendering the AppShell on a narrow
viewport (< 1024px) with a top bar title and optional bottom navigation bar,
then verifying the desktop sidebar is hidden and the mobile regions are visible.

**Acceptance Scenarios**:

1. **Given** a narrow viewport (< 1024px), **When** the AppShell is rendered
   with a top bar title, **Then** the desktop sidebar is hidden and a compact
   top bar is visible with the title.
2. **Given** a narrow viewport with bottom navigation items, **When** rendered,
   **Then** each destination appears as an icon-and-label pair and the active
   destination uses color plus another cue.
3. **Given** a device with a home indicator, **When** the bottom navigation
   renders, **Then** it includes safe-area padding so content is not obscured.
4. **Given** a narrow viewport, **When** the AppShell contains both a top bar
   and bottom navigation, **Then** the main content scrolls between them
   without being hidden behind either fixed bar.

---

### User Story 3 - Accessible Shell with Skip Link and Focus Order (Priority: P2)

As a keyboard user, I want the React application shell to include a skip link
and maintain logical focus order across breakpoints, so that I can navigate the
tool efficiently with assistive technology.

**Why this priority**: Accessibility of the shell affects every page within
the application. A missing skip link forces keyboard users to tab through all
navigation before reaching content on every page load.

**Independent Test**: Can be tested by pressing Tab immediately after rendering
the AppShell and verifying a visible skip link appears targeting the main
content region. Verify that Tab order follows DOM order on both desktop and
mobile viewports.

**Acceptance Scenarios**:

1. **Given** the AppShell is rendered, **When** a keyboard user presses Tab
   immediately after page load, **Then** a visible skip link is the first
   focusable element and targets the main content region.
2. **Given** the AppShell is viewed on a desktop viewport, **When** the focus
   order is inspected, **Then** it follows the sidebar DOM order (brand →
   navigation → account context) before entering the main content region.
3. **Given** the AppShell is viewed on a mobile viewport, **When** the focus
   order is inspected, **Then** it follows the top bar → main content → bottom
   navigation order, and no fixed region covers focused elements.

---

### User Story 4 - Compose Shell with Wrapped Navigation Items (Priority: P3)

A product developer can use a dedicated `AppShellNavItem` sub-component from
the React wrapper to render navigation items that receive the correct class
structure and active-state cues without manually applying BEM class names.

**Why this priority**: Navigation items are the most error-prone part of the
shell markup — developers must combine the base class, active modifier, and
`aria-current` attribute correctly. A sub-component reduces the risk of
inconsistent active-state communication.

**Independent Test**: Can be tested by rendering `AppShellNavItem` components
inside the AppShell's navigation region and verifying each item receives the
correct classes and active-state treatment.

**Acceptance Scenarios**:

1. **Given** a developer renders an `AppShellNavItem` with an active flag,
   **When** inspected, **Then** the rendered DOM element has the active modifier
   class and the `aria-current="page"` attribute.
2. **Given** a developer renders an `AppShellNavItem` without an active flag,
   **When** inspected, **Then** the rendered DOM element has only the base nav
   item class.
3. **Given** a developer provides additional class names to `AppShellNavItem`,
   **When** the item renders, **Then** those class names are preserved while
   the Pathable nav item styling remains present.

---

### User Story 5 - Install Wrapper Without Extra Style Setup (Priority: P3)

A product developer can install and use the React wrapper package's AppShell
component without adding a separate application-level styles import.

**Why this priority**: The package constitution requires wrapper packages to
carry the styles contract through their dependency graph and entrypoints, so
consumers get the expected visual result from the wrapper alone.

**Independent Test**: Can be tested by installing the wrapper package in a
consumer context, importing `AppShell`, and verifying the shell renders with
Pathable styling without any additional styles package import by the consumer.

**Acceptance Scenarios**:

1. **Given** a consumer installs only the React wrapper package, **When** they
   import and render `AppShell`, **Then** the required app shell styling is
   available through the wrapper package.
2. **Given** a package-content check is reviewed, **When** the React wrapper
   package contents are inspected, **Then** the AppShell export and required
   transitive styles dependency are present.

---

### Edge Cases

- What happens when no navigation items are provided? The navigation region
  should be absent — no empty nav element rendered.
- What happens when the sidebar contains many navigation items that overflow
  the viewport? The sidebar should scroll independently.
- What happens when no bottom navigation items are provided? No empty bottom
  bar should be rendered.
- What happens when no account context is provided? The account region should
  be absent from the sidebar.
- What happens at 200% browser zoom? All fixed regions should remain usable
  and content should not be obscured.
- What happens in forced-colors mode? Navigation boundaries and active state
  indicators must remain visible.
- What happens when a consumer passes additional class names to the shell or
  its regions? Class names should be merged rather than replaced.
- What happens when a consumer passes additional HTML attributes to the shell
  or its regions? Attributes should be spread onto the appropriate DOM element.
- What happens when a product has more than five primary destinations? Shared
  navigation keeps the complete sidebar destination set available in a
  horizontally scrollable mobile row without rendering a duplicate landmark.
- What happens when a consumer changes the main landmark ID? The skip link must
  derive its target from that ID and preserve server-rendered output.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The React wrapper package MUST expose a component named
  `AppShell`, matching the CamelCase form of the equivalent
  `packages/styles` `pathable-app-shell` component name with the `pathable`
  prefix removed.

- **FR-002**: The `AppShell` component MUST map to the existing
  `packages/styles` app shell contract (`pathable-app-shell-layout.scss`) rather
  than defining wrapper-only visual styling.

- **FR-003**: The `AppShell` component MUST expose documented sub-regions for:
  sidebar brand, primary navigation, account or organization context, mobile
  top bar title, mobile bottom navigation, main content area, and a global
  notification layer.

- **FR-004**: The sidebar region MUST support both sticky positioning (default)
  and fixed positioning, controllable via a prop, without covering the main
  content area.

- **FR-005**: The main content area MUST support configurable standard and wide
  max-widths, controlled via a prop that maps to the existing
  `pathable-app-shell__content--standard` and `pathable-app-shell__content--wide`
  modifier classes.

- **FR-006**: The wrapper MUST expose a sub-component named `AppShellNavItem`
  that renders an anchor element with the correct `pathable-app-shell__nav-item`
  class, optional active modifier, and `aria-current="page"` when active.

- **FR-007**: The mobile top bar MUST remain hidden on desktop viewports
  (≥ 1024px) and visible on narrow viewports (< 1024px), consistent with the
  existing styles contract.

- **FR-008**: The mobile bottom navigation MUST support up to five primary
  destinations, each displayed as an icon-and-label pair, and MUST include
  safe-area padding via `env(safe-area-inset-bottom)`.

- **FR-009**: The AppShell MUST include a visible skip link as the first
  focusable element, targeting the main content region.

- **FR-010**: Focus order MUST follow DOM order across all breakpoints, and
  fixed regions MUST NOT cover focused content.

- **FR-011**: Active navigation items MUST be differentiated using color plus
  at least one additional cue: weight change, border indicator, inset marker,
  or background shape — consistent with the existing styles contract.

- **FR-012**: The AppShell component MUST respect forced-colors mode and
  reduced-motion preferences through the existing styles contract, and the
  wrapper MUST NOT introduce behavior that overrides these accessibility
  preferences.

- **FR-013**: The React wrapper package MUST make the required Pathable app
  shell styling available to consumers without requiring a separate consumer
  import of `@pathable/styles`.

- **FR-014**: The feature MUST include consumer-facing documentation or stories
  showing: basic desktop shell usage, mobile shell usage, sidebar variants
  (fixed vs. sticky), content width variants (standard vs. wide), and at
  least one realistic composition (e.g., operational dashboard shell).

- **FR-015**: The feature MUST include Storybook stories with interaction tests
  that verify keyboard accessibility: skip link visibility on Tab, active
  navigation item focus visibility, and responsive layout switching between
  desktop and mobile viewports.

- **FR-016**: The feature MUST verify that the wrapper package can be installed
  and used with the `AppShell` export and its required transitive styling assets.

- **FR-017**: The feature MUST NOT introduce new visual variants, tokens,
  visual semantics, layout regions, or accessibility behavior that are absent
  from the owning `packages/styles` app shell contract.

- **FR-018**: The feature MUST NOT disable, weaken, skip, or silence lint
  checks to complete the wrapper work.

- **FR-019**: The AppShell MUST accept native main-landmark attributes, merge a
  consumer class name with required content classes, and derive the skip-link
  target from a non-empty main landmark ID, defaulting invalid or missing IDs to
  `main-content`. Main-landmark attributes MUST NOT accept `children` or
  `dangerouslySetInnerHTML`; main content remains owned by AppShell children.

- **FR-020**: The AppShell MUST support consumer-provided skip-link content and
  an accessible navigation label, defaulting to `Skip to main content` and
  `Primary` respectively.

- **FR-021**: The AppShell MUST preserve the existing icon-and-label bottom
  navigation as the default mobile behavior.

- **FR-022**: The AppShell MUST offer an opt-in shared mobile navigation mode
  that renders one navigation landmark and keeps every sidebar destination
  available across breakpoints without JavaScript.

- **FR-023**: Shared mobile navigation MUST remain usable at viewport widths of
  320px and above without dropping destinations or obscuring main content.

- **FR-024**: The additive AppShell contract MUST produce equivalent client and
  server markup and be verified through a packed React 18 Next.js consumer.

### Key Entities

- **AppShell**: The top-level layout wrapper component that arranges sidebar,
  header, navigation, content, and overlay regions into a responsive grid
  layout, mapping to the existing `pathable-app-shell` styles contract.
- **Sidebar**: A persistent vertical panel (desktop-only) containing brand
  lockup, primary navigation, and account context, optionally fixed or sticky.
- **Mobile Top Bar**: A compact horizontal bar visible on narrow viewports,
  containing a brand or page title.
- **Mobile Bottom Navigation**: A fixed horizontal bar at the bottom of the
  viewport on narrow screens, containing up to five icon-and-label navigation
  destinations.
- **AppShellNavItem**: A navigation item sub-component that renders an anchor
  element with correct BEM classes and active-state attributes.
- **Main Content**: The primary content area positioned beside (desktop) or
  below (mobile) navigation elements, with configurable max-width.
- **Global Notification Layer**: An optional overlay or banner region for
  system-level messages positioned above all other shell regions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can create a fully functional application shell from
  the React wrapper package in under 10 minutes using the documented examples.
- **SC-002**: 100% of layout regions exposed by the AppShell React component
  map to an existing `pathable-app-shell__*` BEM element or modifier in the
  `packages/styles` contract.
- **SC-003**: A consumer package-content check confirms the AppShell export and
  required transitive styling dependency are present before the feature is
  considered complete.
- **SC-004**: Storybook documentation covers at least five shell configurations:
  desktop shell, mobile shell, fixed sidebar, wide content, and a realistic
  operational dashboard composition.
- **SC-005**: Interaction tests verify that the skip link becomes visible on
  first Tab press, active navigation items are distinguishable by more than
  color alone, and the shell switches layout at the expected breakpoint.
- **SC-006**: No review finding identifies wrapper-only styling, missing
  transitive styling, or a component naming mismatch against the constitution's
  React naming parity rule.
- **SC-007**: The wrapper passes automated rendered accessibility checks on all
  stable stories, with any story-level exceptions being narrow, documented,
  and limited to specific rules with justification.

## Assumptions

- The owning styles contract already exists as `pathable-app-shell` in
  `packages/styles`, including desktop sidebar layout, mobile top bar, mobile
  bottom navigation, fixed sidebar modifier, content width modifiers, and
  active nav item styles with forced-colors support.
- The React wrapper component name is `AppShell` because `pathable-app-shell`
  becomes `AppShell` after removing the `pathable` prefix and converting to
  CamelCase. The sub-component name is `AppShellNavItem` because
  `pathable-app-shell__nav-item` becomes `AppShellNavItem` under the same
  convention.
- This feature wraps, not extends, the existing app shell contract; it does
  not add new visual variants, layout regions, or change the underlying app
  shell styles.
- Provider design evidence is not required because the request targets an
  existing repository-owned styles contract rather than a new design-derived
  visual surface.
- The `pathable-skipnav` component class already exists in `packages/styles`
  and will be used by the AppShell wrapper for the skip link.
- The `pathable-bottom-navigation` component classes already exist in
  `packages/styles` and will be composed by the AppShell wrapper for the mobile
  bottom navigation bar.
- The existing `packages/react` package structure, build configuration, and
  Storybook setup are already established and this feature follows the same
  patterns as existing wrapper components (Card, Button, etc.).
