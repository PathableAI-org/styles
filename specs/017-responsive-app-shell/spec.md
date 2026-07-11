# Feature Specification: Responsive Application Shell Pattern

**Feature Branch**: `017-responsive-app-shell`

**Created**: 2026-07-11

**Status**: Draft

**Input**: User description: "Add a responsive application shell pattern for lightweight operational tools with persistent desktop navigation and a compact mobile experience, per issue #31."

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Desktop Application Shell with Sidebar (Priority: P1)

As an operational tool developer, I want a desktop application shell with a persistent sidebar containing brand identity, primary navigation, and account context, so that users can navigate between major tool sections without losing their place.

**Why this priority**: The desktop sidebar is the primary navigation structure for operational tools. Without it, every consuming application must invent its own sidebar layout, leading to inconsistent placement of brand, navigation, and account information.

**Independent Test**: Can be tested by rendering the shell with a sidebar containing a brand lockup, three navigation links, and an account summary. Verify the sidebar is fixed or sticky, the main content area has a configurable maximum width, and active navigation is differentiated by more than color alone.

**Acceptance Scenarios**:

1. **Given** the application shell is rendered on a desktop viewport (≥ 1024px), **When** inspected, **Then** a sidebar is visible on the left with dedicated regions for brand, primary navigation, and account context.
2. **Given** the sidebar contains navigation items, **When** one item is in an active state, **Then** the active item is clearly differentiated using a combination of color and at least one additional cue (weight, border, inset marker, or background shape).
3. **Given** the sidebar is configured as fixed, **When** the main content scrolls, **Then** the sidebar remains visible without covering the main content area.
4. **Given** the main content area, **When** inspected, **Then** it respects configurable standard and wide maximum widths and has predictable gutters.

---

### User Story 2 - Compact Mobile Navigation (Priority: P1)

As an operational tool user on a mobile device, I want a compact top bar with a visible page title and an optional bottom navigation bar with up to five destinations, so that I can navigate the application efficiently on a small screen.

**Why this priority**: Mobile navigation is critical for field staff using tablets and phones. Without a standard mobile shell, every tool must solve mobile navigation independently, creating inconsistent and often inaccessible mobile experiences.

**Independent Test**: Can be tested by rendering the shell on a narrow viewport (< 640px) with a top bar and a bottom navigation bar containing five icon-and-label items. Verify the top bar is visible without consuming excessive vertical space, the bottom bar has safe-area padding, and navigation labels remain readable at narrow widths.

**Acceptance Scenarios**:

1. **Given** a mobile viewport (< 640px), **When** the application shell is rendered, **Then** the desktop sidebar is hidden and a compact top bar is visible with a page title or brand identifier.
2. **Given** a mobile viewport with a bottom navigation bar containing five or fewer primary destinations, **When** rendered, **Then** each destination is displayed as an icon-and-label pair, and the active destination uses color plus another cue.
3. **Given** a device with a home indicator (notch), **When** the bottom navigation bar is rendered, **Then** it includes safe-area padding (`env(safe-area-inset-bottom)`) so content is not obscured.
4. **Given** a mobile viewport, **When** the application shell contains both a top bar and bottom navigation, **Then** the main content scrolls between them and is never hidden behind either fixed bar.

---

### User Story 3 - Accessible Shell with Skip Link and Focus Management (Priority: P2)

As a keyboard user, I want the application shell to include a skip link and maintain logical focus order across breakpoints, so that I can navigate the tool efficiently with assistive technology.

**Why this priority**: Accessibility of the shell affects every page within the application. A missing skip link forces keyboard users to tab through all navigation before reaching content on every page load.

**Independent Test**: Can be tested by pressing Tab immediately after page load and verifying a visible skip link appears targeting the main content region. Verify that Tab order follows DOM order on both desktop and mobile viewports.

**Acceptance Scenarios**:

1. **Given** the application shell is rendered, **When** a keyboard user presses Tab immediately after page load, **Then** a visible skip link is the first focusable element and targets the main content region.
2. **Given** the shell is viewed on a desktop viewport, **When** the focus order is inspected, **Then** it follows the sidebar DOM order (brand → navigation → account context) before entering the main content region.
3. **Given** the shell is viewed on a mobile viewport, **When** the focus order is inspected, **Then** it follows the top bar → main content → bottom navigation order (DOM order), and no fixed region covers focused elements.
4. **Given** any viewport, **When** a dialog or toast notification is open, **Then** it is not obscured by fixed navigation regions.

---

### User Story 4 - Status and Notification Overlay (Priority: P3)

As an application developer, I want a documented global status or notification layer region within the shell, so that I can surface system-level messages (maintenance alerts, connection status, global announcements) consistently across all tools.

**Why this priority**: Global messages are currently handled ad-hoc in each consuming application. A dedicated region in the shell reduces duplicated effort and ensures system-level messages are visible regardless of which tool surface is being viewed.

**Independent Test**: Can be tested by rendering the shell with a status banner at the top of the page and verifying it is visible above the main content on both desktop and mobile viewports without disrupting the layout.

**Acceptance Scenarios**:

1. **Given** a status or notification message is rendered in the shell's global layer, **When** viewed on any viewport, **Then** it is positioned above the main content (or overlaid) without being hidden behind fixed navigation.
2. **Given** a notification layer is present, **When** it contains interactive content (dismiss button, link), **Then** it is keyboard accessible and focusable.

---

### Edge Cases

- What happens when the sidebar contains many navigation items that overflow the viewport? (Should scroll independently.)
- How does the shell behave at 200% browser zoom? (All fixed regions should remain usable and content should not be obscured.)
- What happens at narrow landscape heights (e.g., 480px × 320px)? (Fixed bars should minimize vertical consumption or allow collapsing.)
- How does the shell perform when no bottom navigation items are provided? (Bottom bar should be absent — no empty bar rendered.)
- How does forced-colors mode affect navigation boundaries and active states? (Boundaries and active selection must remain visible.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The shell MUST expose documented regions for: sidebar, brand area, primary navigation, account or organization context, mobile header, mobile bottom navigation, main content area, and a global status or notification layer.
- **FR-002**: The desktop sidebar MUST support both fixed positioning (stays visible during scroll) and static document flow, without covering the main content area.
- **FR-003**: The main content area MUST have configurable maximum widths: a standard width and a wide width, controlled via CSS custom properties.
- **FR-004**: The mobile top bar MUST remain visible at the top of the viewport without consuming excessive vertical space (recommended maximum: 56px).
- **FR-005**: The mobile bottom navigation MUST support up to five primary destinations, each displayed as an icon-and-label pair.
- **FR-006**: The mobile bottom navigation MUST include safe-area padding using `env(safe-area-inset-bottom)` for devices with home indicators.
- **FR-007**: Active navigation items MUST be differentiated using color plus at least one additional cue: weight change, border indicator, inset marker, or background shape.
- **FR-008**: The shell MUST include a visible skip link as the first focusable element, targeting the main content region.
- **FR-009**: Focus order MUST follow DOM order across all breakpoints, and fixed regions MUST NOT cover focused content.
- **FR-010**: The shell MUST remain usable at 200% browser zoom and in narrow landscape viewport heights.
- **FR-011**: Forced-colors mode MUST preserve navigation boundaries and active state visibility.
- **FR-012**: The shell MUST be framework-neutral — no JavaScript, no routing, no authentication or authorization logic.
- **FR-013**: Selective imports (individual shell regions) and the combined layout-navigation bundle MUST compile without naming conflicts.
- **FR-014**: The sidebar navigation MUST support independent scrolling when content overflows the viewport.
- **FR-015**: The global notification or status layer MUST be positioned so it is not obscured by fixed navigation on any viewport.

### Key Entities

- **Application Shell**: The top-level layout wrapper that arranges sidebar, header, navigation, content, and overlay regions into a responsive grid or flex layout.
- **Sidebar**: A persistent vertical panel (desktop-only) containing brand lockup, primary navigation, and account context, optionally scrollable independently of the main content.
- **Mobile Top Bar**: A compact horizontal bar visible on narrow viewports, containing a brand or page title.
- **Mobile Bottom Navigation**: A fixed horizontal bar at the bottom of the viewport on narrow screens, containing up to five icon-and-label navigation destinations.
- **Main Content**: The primary content area positioned beside (desktop) or below (mobile) navigation elements, with configurable max-width.
- **Global Status Layer**: An optional overlay or banner region for system-level messages that must appear above all other shell regions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A consuming developer can create a fully functional application shell by writing only HTML markup and applying shell classes — no JavaScript required.
- **SC-002**: The shell renders correctly at three breakpoints: narrow (< 640px, mobile), medium (640px–1023px, tablet), and wide (≥ 1024px, desktop), with appropriate navigation patterns for each.
- **SC-003**: Active navigation items are distinguishable from inactive items using at least two sensory cues on all viewports.
- **SC-004**: Keyboard users can skip navigation and reach main content in one Tab press from page load.
- **SC-005**: The shell passes forced-colors mode testing with all navigation boundaries and active state indicators preserved.
- **SC-006**: The shell remains fully operable at 200% browser zoom with no content clipping or overlapping fixed regions.
- **SC-007**: The bottom navigation bar includes safe-area padding and icon-label pairs remain readable at the narrowest supported viewport width.
- **SC-008**: Storybook examples exist for desktop, tablet, and mobile viewports, with both short and long navigation labels demonstrated.

## Assumptions

- The existing `pathable-sidebar-layout.scss` and `pathable-container.scss` provide reference patterns for sidebar and container layouts that the application shell can build upon.
- Safe-area padding via `env(safe-area-inset-bottom)` is supported by target browsers and can be applied as a CSS custom property default.
- The skip link pattern should follow the same approach as the existing site-header skip navigation.
- Active navigation state is supplied by the consuming application via a CSS class (e.g., `aria-current="page"`) — the shell provides the style, not the logic.
- Framework-specific implementations (React shell, Vue shell, etc.) are explicitly out of scope — this feature covers only framework-neutral SCSS.
- Public PathAble design tokens (spacing, color, elevation, radius, breakpoints) cover the needs of the shell pattern — no new tokens need to be added.