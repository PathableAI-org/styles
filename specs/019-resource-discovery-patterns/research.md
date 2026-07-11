# Research: Resource Discovery Card, Filter Bar, and Guided Wayfinder Patterns

**Created**: 2026-07-11

**Feature**: Resource Discovery Patterns

## Unknown 1: Resource Card Secondary Action Pattern

**Context**: The spec requires that secondary action controls (e.g., save/favorite) be siblings of the primary card link element and have an independent focus state — they must not be nested inside the primary link.

**Decision**: Use a card container with `:focus-within` for the interactive hover/focus treatment on the primary region, while the primary link and secondary action button are direct child siblings. The primary link spans the card's main content region; the secondary action is positioned via CSS (absolutely or flexbox) in the corner or edge of the card, outside the link's DOM scope but visually within the card boundary.

**Rationale**:
- This avoids nested interactive elements (a link inside a link or button inside a link), which is an HTML spec violation.
- The existing `pathable-surface--interactive` pattern already uses `:focus-within` for card-level focus treatment, providing a proven precedent in the codebase.
- Users can tab to the primary link, then tab independently to the secondary action — each receives its own visible focus state.

**Alternatives considered**:
- *Nesting the action inside the link*: HTML spec violation for interactive elements; screen readers may not discover nested controls.
- *JavaScript event delegation on the card*: Violates the framework-neutral constraint (no JS).
- *Using `tabindex` on the card itself*: Would make the entire card a single tab stop, preventing independent access to the secondary action.

## Unknown 2: Filter-Bar Responsive Breakpoint Approach

**Context**: The spec requires filter controls to stack or expose a drawer trigger on narrow screens, without horizontal overflow.

**Decision**: Use the existing `desktop` breakpoint (1024px) as the threshold where all controls are inline in a single row. Below 1024px, the filter bar transitions to a stacked layout:
- Search input remains visible and full-width
- Facet controls, sort, and active-filter pills stack vertically below search
- An optional `.pathable-filter-bar--drawer-trigger` modifier class exposes a trigger button that consumers can use to toggle an implementation-provided filter drawer (the drawer itself is consumer-implemented per Non-goals)
- Active-filter pills remain visible and removable at all breakpoints (they are the most critical for user awareness)

**Rationale**:
- The existing codebase uses the `desktop` breakpoint (1024px) consistently for layout mode switches (see `pathable-split`, `pathable-sidebar-layout`, etc.).
- Keeping search and active-filter pills always visible follows established responsive patterns (e.g., `pathable-app-shell-layout`).
- The drawer trigger approach gives consumers flexibility without requiring the library to implement drawer behavior (consistent with the non-goals in Issue #33).

**Alternatives considered**:
- *Single breakpoint below mobile-lg (480px)*: Too aggressive — filter bars become unusably cramped between 480px and 1024px.
- *Hamburger-style collapse for all controls*: Hides too much information; users need to see active filters at all widths.
- *Horizontal scroll*: Violates the no-horizontal-overflow constraint.

## Unknown 3: Wayfinder Question-Group Layout

**Context**: The spec requires a guided wayfinder panel with two or more labeled question groups that collapses to a single column on narrow screens.

**Decision**: Each question group is a vertical stack of labeled controls (radio buttons, checkboxes, or any choice input). Multiple question groups are arranged in a horizontal row on wide screens (using the `desktop` breakpoint at 1024px) and collapse to a single vertical column below that breakpoint. The wayfinder's introductory region (icon, heading, explanatory text) sits above the question groups. The primary action button sits below all groups.

**Rationale**:
- Horizontal arrangement of question groups at wide widths creates a natural "conversation" flow: "Who are you helping?" → "What do you need?"
- Single-column collapse at narrow widths is consistent with `pathable-split` and `pathable-sidebar-layout` patterns.
- Each group being a vertical stack within itself ensures choice labels are readable regardless of width.
- The existing `pathable-stack` layout component provides the vertical gap pattern.

**Alternatives considered**:
- *Question groups as tabs or accordions*: Hides choices from the user, contradicting the spec's requirement that defaults not force a selection before the user understands choices.
- *Multi-column grid within each question group*: Too complex for the simple choice presentation the wayfinder is intended for.
- *Questions always stacked vertically*: Wastes horizontal space on wide screens and makes the wayfinder feel longer than necessary.