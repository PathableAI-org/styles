# Research: App Feedback Patterns

**Created**: 2026-07-11

**Purpose**: Resolve design unknowns identified during planning before proceeding to data model and contract definitions.

## Toast Position and Stacking Strategy

**Decision**: Fixed-position container at top-right of the viewport with configurable inset overrides.

**Rationale**: Top-right placement is a widely recognized convention for toast notifications that avoids overlapping primary navigation (typically top-left or left sidebar in app shells). The toast region uses `position: fixed` with `inset-block-start` / `inset-inline-end` defaulting to `--pathable-space-8` (or equivalent spacing token). Consumers can override via `--pathable-toast-inset-block-start` and `--pathable-toast-inset-inline-end` CSS custom properties. Toasts stack in reverse order (newest at the top) using `flex-direction: column-reverse` within the region. Each toast has `z-index` managed by the region container rather than individual toasts.

**Alternatives considered**:
- **Bottom-right**: Common in mobile-first designs but conflicts with bottom navigation patterns (spec 017).
- **Top-left**: Conflicts with sidebar navigation and skip-link placement.
- **Center overlay**: Too intrusive for transient notifications.

## Skeleton Animation Approach

**Decision**: CSS `@keyframes shimmer` using a linear gradient sweep across a pseudo-element.

**Rationale**: The shimmer effect is a lightweight, purely CSS animation that requires no JS. Keyframes sweep a semi-transparent white gradient from left to right over a neutral base background color. Animation is gated behind `@media (prefers-reduced-motion: no-preference)` to stop for users who prefer reduced motion. Duration of approximately 1.5-2 seconds per cycle creates a noticeable-but-not-distracting pulse.

**Alternatives considered**:
- **Pulse opacity**: Simpler but less visually informative about loading progress.
- **CSS-only vs JS-driven animation**: Pure CSS chosen to maintain zero-runtime-cost constraint.

## Empty State Illustration Style

**Decision**: Optional decorative SVG slot with `aria-hidden="true"`; default is text-only layout.

**Rationale**: Text-only layouts are simpler to maintain and more accessible (no decorative images to manage). An optional slot allows product teams to add branded illustrations without coupling the pattern to any specific illustration system. The default layout uses centered text, a large heading icon (via the existing icon system, also `aria-hidden`), and a clear call-to-action button or link.

**Alternatives considered**:
- **Mandatory illustration adds maintenance burden and coupling.**
- **Inline SVG default would bloat the CSS and lock in art direction.**

## Bundle Organization Across Existing Packages

**Decision**: Toast, loading, and skeleton are communication-oriented patterns grouped under the existing `pathable-communication.scss` bundle. Empty-state and page-error are standalone files within the existing `pathable-all.scss` entry point.

**Rationale**: The `pathable-communication` bundle already exists for alert, banner, and similar notification patterns. Adding toast, loading, and skeleton there is semantically consistent. Empty states and page errors are presentation/layout patterns better suited as standalone imports. Selective imports work naturally: `@forward 'pathable-toast'` for toasts alone, or `@forward 'pathable-communication'` for the group.

**Alternatives considered**:
- **New `pathable-feedback.scss` bundle**: Adds unnecessary complexity; existing bundles suffice.
- **All patterns in a single file**: Violates selective-import requirement (FR-017).

## Forced-Colors Mode for Status Boundaries

**Decision**: Apply `outline` or `border` that uses `CanvasText` via a `@media (forced-colors: active)` query. Status icons use `forced-color-adjust: auto` (default) to allow system color mapping.

**Rationale**: In forced-colors mode, background colors are removed and replaced with system colors. Status boundaries (e.g., error red vs success green) become invisible without explicit borders or text content. Applying a forced-colors-mode-only outline using `CanvasText` ensures each toast/error/state is visually bounded. Icons that carry status meaning (checkmark, warning) rely on their text label equivalents for semantic meaning; icons remain decorative with `aria-hidden="true"`.

**Alternatives considered**:
- **Relying on icon shapes alone fails when icons use `currentColor` that maps to a single system color.**
- **Custom forced-colors palette tokens over-engineer what a simple border solves.**

## Toast Dismiss and Action Controls

**Decision**: Visual styles for dismiss (close button) and action (link/button) controls. No auto-dismiss timers, no dismiss-on-click-outside behavior — these are consumer/framework concerns.

**Rationale**: The design system provides the visual pattern only. Dismiss controls get a close icon button styled via existing button patterns. Action controls get a styled link or button within the toast body. Both are optional — consumers decide which toasts need which controls. The CSS provides `--pathable-toast--dismissible` and `--pathable-toast--has-action` modifier classes for styling adjustments (e.g., padding when a close button is present).

**Alternatives considered**:
- **Auto-dismiss timers require JS and violate the framework-neutral principle.**

## Loading Indicator Size and Placement

**Decision**: Inline loading indicator uses a 24px spinner SVG (via existing icon system) with optional status text to its right. The spinner and text are wrapped in a flex row container. A `--large` modifier provides a 40px spinner for page-level loading.

**Rationale**: 24px matches the standard icon size in the design system. A flex row keeps the spinner aligned with status text. The large modifier accommodates page-level or section-level loading without introducing a separate component. The status text uses existing `pathable-typography` body text styles.

**Alternatives considered**:
- **Standalone spinner (no text) fails to communicate what is loading (accessibility concern).**
- **Centered full-page loader would duplicate the page-error loading state; kept inline.**

## Existing Pattern Audit

No existing toast, loading indicator, skeleton, empty state, or page-error patterns were found in the codebase. The `pathable-error-message.scss` component wraps USWDS error message styling for field-level validation — this is distinct from the page-level error patterns being created here. The `pathable-alert.scss` component is a static alert banner, not a transient notification. No pre-existing patterns conflict with or duplicate the proposed feedback patterns.