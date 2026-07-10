# Feature Specification: Reusable Interaction States, Icon Conventions, and Compact Controls

**Feature Branch**: `024-interaction-icons-controls`

**Created**: 2026-07-10

**Status**: Draft

**Input**: "Define reusable interaction-state contract and compact control styles that can be reused by custom PathAble patterns instead of reimplementing hover, focus, selected, pressed, loading, and disabled behavior in every component."

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add Interaction States to Any Element (Priority: P1)

As a consumer building a custom interactive pattern (e.g., a clickable card or toggle), I want to reuse shared interaction-state SCSS mixins or utility classes so that hover, focus-visible, focus-within, active, selected, pressed, loading, and disabled states look and behave consistently without reimplementing focus rings, pressed shadows, or disabled styling in every component.

**Why this priority**: This is the core value — eliminating duplicated state handling. Without shared states, every custom component must independently reproduce the same hover, focus, pressed, selected, loading, and disabled patterns, leading to visual drift and maintenance burden.

**Independent Test**: Can be tested by applying the interaction-state mixin or class to a plain `<div>` and verifying that all eight states (rest, hover, focus-visible, focus-within, active, pressed, selected, disabled) are each visually distinct and match the existing button/surface interaction conventions.

**Acceptance Scenarios**:

1. **Given** a custom component uses the shared interaction-state mixin, **When** the user hovers over it, **Then** the element shows a subtle emphasis (elevation increase or background shift) consistent with existing button hover behavior.
2. **Given** the same component receives keyboard focus, **When** the user tabs to it, **Then** it displays a visible focus-visible ring using the `--pathable-color-focus-ring` token, equally prominent to the hover state.
3. **Given** the element enters a selected state, **When** the user activates a selection toggle, **Then** the selected state is distinguishable from hover, focus, and pressed states via a combination of shape, border, icon, or weight in addition to color.
4. **Given** the element enters a disabled state, **When** rendered, **Then** content remains legible at WCAG AA contrast and the element does not imply interactivity (no hover/focus responses).
5. **Given** the element enters a loading state, **When** a long-running action is in progress, **Then** duplicate activation is prevented and the layout remains stable (no reflow when the loading indicator appears or disappears).

---

### User Story 2 - Add an Accessible Icon Button (Priority: P1)

As a consumer, I want a compact icon-button component (bare, subtle, bordered, inverse, destructive appearances) so that common actions like close, save, menu, notification, and overflow have consistent sizing, accessible naming, and proper touch targets.

**Why this priority**: Icon buttons are the most frequently used atomic control across applications. Without a shared component, every team creates inconsistent sizing, missing focus rings, and inaccessible icon-only controls.

**Independent Test**: Can be tested by rendering icon buttons in each appearance variant with a single SVG icon. Verify the control is a uniform square or circle, has a visible focus ring on tab, and meets the minimum touch-target requirement.

**Acceptance Scenarios**:

1. **Given** an icon button rendered on the page, **When** inspected, **Then** it is a compact square (or circular for `--circle` modifier) target with a size appropriate to its variant (compact: 32px, default: 44px, large: 52px).
2. **Given** an icon button with no visible text label, **When** checked by an accessibility tool, **Then** it has an accessible name (via `aria-label`, `aria-labelledby`, or `title`).
3. **Given** a bare icon button (no visible background), **When** it receives keyboard focus, **Then** it displays a focus ring that is visible against any background surface (base, brand, inverse).
4. **Given** a destructive icon button, **When** rendered, **Then** it uses appropriate danger signaling color tokens and the hover/focus states remain consistent with other destructive patterns.
5. **Given** an inverse icon button placed on a dark background, **When** rendered, **Then** its colors invert to remain legible against the dark surface.

---

### User Story 3 - Use a Segmented / Toggle-Button Control (Priority: P2)

As a consumer, I want a segmented-control component for presenting short sets of mutually exclusive or independently toggleable options (e.g., text size, list/grid view, timeframe selection) so that related controls are grouped compactly with correct ARIA semantics.

**Why this priority**: Segmented controls are a common UI pattern with specific accessibility requirements (correct role, keyboard navigation, selected state signaling). Without a shared component, teams use ad-hoc button groups or radio-button lists that lack the intended visual compactness.

**Independent Test**: Can be tested by rendering a three-option single-select segmented control and verifying: keyboard arrow navigation, visible selected state, and that the control does not resemble a select dropdown. Also test a multi-select variant with two toggleable options.

**Acceptance Scenarios**:

1. **Given** a single-select segmented control with three options, **When** the user navigates with arrow keys, **Then** focus moves between segments and the selected option updates following radio-group keyboard semantics.
2. **Given** a multi-select (toggle-button) segmented control, **When** the user clicks an unselected option, **Then** it becomes selected without deselecting other options.
3. **Given** a segmented control on a base surface, **When** inspected, **Then** the selected segment(s) are visually distinct from unselected segments using a combination of background, border, and weight (not color alone).
4. **Given** any segmented control, **When** a segment is focused, **Then** it displays a visible focus ring.
5. **Given** a segmented control with more than 5 options, **When** rendered, **Then** it gracefully wraps or scrolls (recommendation: max 5 visible options in a single row).

---

### User Story 4 - Use Icon Tiles and Status Icons (Priority: P2)

As a consumer, I want standard icon tiles (square and circular) and status icon conventions so that decorative and meaningful icons have consistent sizing, alignment, and accessibility guidance.

**Why this priority**: Icons appear throughout PathAble applications in inconsistent sizes and alignment. Standardizing icon presentation ensures visual harmony and clarifies accessibility expectations for decorative vs. meaningful icons.

**Independent Test**: Can be tested by rendering a square icon tile and a circular icon tile side by side, each containing an SVG icon, and verifying they are the same size with consistent padding and the icon is centered within the tile.

**Acceptance Scenarios**:

1. **Given** an icon tile with a decorative SVG icon, **When** rendered, **Then** the icon is centered inside the tile, the tile uses semantic surface and foreground tokens, and the icon has `aria-hidden="true"`.
2. **Given** a status icon conveying meaning (e.g., success, error, warning), **When** rendered, **Then** it uses `role="img"` with an accessible label via `aria-label`.
3. **Given** an inline icon next to text, **When** the text size changes, **Then** the icon size scales proportionally or uses a documented fixed size, and the icon's vertical alignment matches the text baseline.
4. **Given** a circular icon tile (avatar-style), **When** inspected, **Then** it uses `border-radius: 50%` and the icon remains centered within the circle.

---

### Edge Cases

- What happens when an icon button is placed on an inverse surface? Does the focus ring remain visible?
- What happens when an interactive element is both selected and disabled? (Disabled should take precedence.)
- What happens when a segmented control receives only one option? (Should render as a single static indicator.)
- How does a loading state affect an icon button that is already disabled? (Loading implies disabled behavior.)
- What happens when an icon tile receives an oversized SVG (larger than the tile padding allows)? (Icon should scale down to fit.)
- How does a segmented control behave when all options are unselected in single-select mode? (At least one option should remain selected; consumers must provide a default.)
- How does forced-colors mode affect selected states in the segmented control? (Selected segments must preserve a visible boundary.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide reusable styling abstractions for interactive states: hover, focus-visible, focus-within, active, selected, pressed, disabled, and loading.
- **FR-002**: State styles MUST be consumable by custom patterns without copying component-specific selectors — a single mixin or class application should activate the full state behavior.
- **FR-003**: Selected and pressed states MUST use a combination of shape, border, icon, or weight changes in addition to color to ensure distinguishability without relying solely on color perception.
- **FR-004**: Disabled interactive elements MUST maintain WCAG AA contrast for text content and MUST suppress all hover, focus, and active responses.
- **FR-005**: Loading states MUST prevent duplicate activation (user cannot trigger the same action again while loading) and MUST reserve layout space equal to the resting state (no visible layout shift when the loading indicator appears or is removed).
- **FR-006**: The system MUST document standard icon sizes (compact, default, large) and inline alignment rules for icons used alongside text.
- **FR-007**: Decorative icons MUST carry `aria-hidden="true"` by convention; meaningful icons MUST use `role="img"` with a visible or `aria-label` accessible name.
- **FR-008**: The system MUST provide an icon tile pattern supporting both square and circular forms, using semantic surface and foreground tokens.
- **FR-009**: Icon tiles MUST have consistent internal padding that centers the icon within the tile regardless of icon size (up to the tile's padded boundary).
- **FR-010**: The system MUST provide a `pathable-icon-button` component with the following appearance variants: bare (no visible background, icon only), subtle (light background), bordered (outlined), inverse (dark surface), and destructive (danger signaling).
- **FR-011**: The icon button MUST support three size variants: compact (approximately 32px), default (44px — meeting minimum touch target), and large (52px).
- **FR-012**: The icon button MUST support an optional `--circle` modifier for circular targets.
- **FR-013**: The icon button MUST be framework-neutral — no JavaScript dependency.
- **FR-014**: The system MUST provide a `pathable-segmented-control` pattern supporting both single-select (radio group semantics) and multi-select (toggle button group semantics) usage.
- **FR-015**: The segmented control selected state MUST be distinguishable via a combination of background, border, and weight — not color alone.
- **FR-016**: The segmented control MUST support keyboard navigation: arrow keys for single-select, Tab for multi-select.
- **FR-017**: Focus rings on icon buttons and segmented controls MUST be visible on all background surfaces: base (light), brand (accent), and inverse (dark).
- **FR-018**: All transitions MUST respect `prefers-reduced-motion`.
- **FR-019**: Forced-colors mode MUST preserve selected and focused state boundaries for all new components.
- **FR-020**: All spacing, color, elevation, and radius values MUST reference public PathAble design tokens (CSS custom properties) — no hardcoded values.
- **FR-021**: Both selective imports and the all-in-one entry point for these new patterns MUST integrate without naming conflicts.

### Key Entities

- **Interaction State**: A named set of CSS declarations (hover, focus-visible, focus-within, active, selected, pressed, disabled, loading) that can be applied to any interactive element via SCSS mixin or utility class.
- **Icon Button**: A compact, square (or optionally circular) button that displays an SVG icon as its primary content, intended for single-action triggers (close, save, menu, notification, overflow).
- **Icon Tile**: A decorative container (square or circular) that holds an SVG icon with consistent padding and centering, using semantic tokens for background and foreground.
- **Segmented Control**: A grouped set of two to five option buttons that function as either a single-select (radio) or multi-select (toggle) control, rendered as a contiguous horizontal strip.
- **Status Icon**: An icon that conveys a specific meaning (success, error, warning, info, required) with an accessible label, distinguishable from purely decorative icons.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A custom element can be made fully interactive (hover, focus, active, selected, disabled, loading) by applying one reusable style abstraction — no additional element-specific CSS needed for state handling.
- **SC-002**: All eight interaction states are visually distinct from one another and from the resting state when viewed side by side.
- **SC-003**: Icon buttons render at exactly three documented sizes (compact ~32px, default 44px, large 52px) with all appearance variants, and the default size meets the 44px minimum touch-target requirement.
- **SC-004**: Icon buttons and segmented controls pass automated accessibility checks: visible focus ring on keyboard navigation, accessible names on all icon-only controls, correct ARIA roles (radio group / button group) on segmented controls.
- **SC-005**: Forced-colors mode preserves at least a 2px outline boundary on selected and focused states for all new components, with no state becoming invisible.
- **SC-006**: Reduced-motion preference removes all non-essential transitions (state-change transitions on focus, selected, and pressed are considered essential and preserved when they involve only border-color or outline changes).
- **SC-007**: Each interaction state, appearance variant, and combination is demonstrated in the project's visual documentation suite (equivalent to one isolated example per state, per component variant, and one integration composition).
- **SC-008**: Patterns can be used independently (selective import) or all at once (bundled import) without naming conflicts.

## Assumptions

- The existing `pathable-surface` SCSS file provides a reference pattern for interactive states (hover, focus-visible, focus-within, active, disabled) that can be extracted into shared mixins or utility classes rather than duplicated per-file.
- The existing `pathable-button` SCSS file provides a reference for button sizing, appearance variants, and token usage that the icon button and segmented control can align with.
- Public PathAble design tokens exist and cover the needed spacing, color, elevation, radius, and border values for all new components — no new tokens need to be added to the central token system.
- Interaction states will be delivered as reusable style abstractions that consumers apply to custom components (e.g., via shared include or forward), rather than requiring markup-level classes on every interactive element.
- Icon buttons will be pure CSS (no JavaScript) and assume the consumer provides the SVG icon markup and the accessible name attribute.
- The existing USWDS icon component (`.usa-icon` / `.pathable-icon`) provides the base SVG sizing pattern that icon buttons and icon tiles will build upon.
- Framework-specific components (React icon-button, Vue segmented-control, etc.) are explicitly out of scope — this feature covers only framework-neutral SCSS.
- Segmented controls are intended for short option sets (2–5 options); consumers needing long lists should use a native `<select>` element instead.
- Loading indicators within icon buttons will use a CSS-only approach (e.g., a toggled class that swaps icon visibility or adds a spinner via pseudo-element) since JavaScript-driven loading behavior is out of scope.