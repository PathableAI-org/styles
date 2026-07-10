# Tasks: Reusable Interaction States, Icon Conventions, and Compact Controls

**Input**: Design documents from `/specs/016-interaction-icons-controls/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks included — this feature produces compiled CSS verified visually via Storybook stories.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- All SCSS files under `packages/styles/src/pathable-component-wrappers/`
- All story files under `packages/styles/src/stories/interaction-controls/`

## Table of Contents

- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 2: User Story 1 - Interaction States Foundation](#phase-2-user-story-1---interaction-states-foundation-priority-p1-mvp)
- [Phase 3: User Story 2 - Accessible Icon Button](#phase-3-user-story-2---accessible-icon-button-priority-p1)
- [Phase 4: User Story 3 - Segmented Control](#phase-4-user-story-3---segmented-control-priority-p2)
- [Phase 5: User Story 4 - Icon Tiles and Status Icons](#phase-5-user-story-4---icon-tiles-and-status-icons-priority-p2)
- [Phase 6: Polish & Cross-Cutting Concerns](#phase-6-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the bundle infrastructure that links all new patterns into the existing SCSS build chain.

- [x] T001 Create new bundle forwarder file at `packages/styles/src/pathable-component-wrappers/pathable-interaction-controls.scss` that forwards the 4 individual pattern files (interaction-states, icon-button, segmented-control, icon-tile) using `@forward` statements
- [x] T002 Update `packages/styles/src/pathable-component-wrappers/pathable-all.scss` to add `@forward 'pathable-interaction-controls';` so the new bundle is included in the all-in-one entry point

**Checkpoint**: The import chain exists — `pathable-all.scss` forwards `pathable-interaction-controls` which forwards all new pattern files. Individual files don't exist yet, so compilation will fail until Phase 2 onward.

---

## Phase 2: User Story 1 - Interaction States Foundation (Priority: P1) 🎯 MVP

**Goal**: Consumers can apply shared interaction-state mixins (hover, focus-visible, focus-within, active, selected, pressed, disabled, loading) to any custom element without reimplementing focus rings, pressed shadows, or disabled styling.

**Independent Test**: Apply the `interaction-states` mixin to a plain `<div>` with cursor:pointer. Verify all eight states (rest, hover, focus-visible, focus-within, active, selected, pressed, disabled, loading) are each visually distinct and match existing button/surface conventions.

### Implementation for User Story 1

- [x] T003 Create `packages/styles/src/pathable-component-wrappers/pathable-interaction-states.scss` with a `state-hover` mixin (elevation increase from `--elevation-sm` to `--elevation-md` via `box-shadow`, background shift using `--pathable-color-bg`), a `state-focus` mixin (`outline: 2px solid var(--pathable-color-focus-ring)` with `outline-offset: 2px` on `&:focus-visible` and `&:focus-within`), and a combined `interaction-states` mixin that emits all state styles
- [x] T004 [P] [US1] Add `state-active` mixin (drops elevation to `--elevation-none` or `var(--elevation-sm)`) and `state-pressed` mixin (distinct from active: uses a momentary `box-shadow` inset + border color shift, no border change) to `pathable-interaction-states.scss`
- [x] T005 [P] [US1] Add `state-selected` mixin in `pathable-interaction-states.scss` emitting `&.is-selected, &[aria-selected="true"]` with a `2px solid` border using `--pathable-color-border`, a background tint via `--pathable-color-surface`, and an increased font weight — distinguishable from hover/focus by the permanent border/weight change rather than elevation
- [x] T006 [P] [US1] Add `state-disabled` mixin in `pathable-interaction-states.scss` emitting `&:disabled, &[aria-disabled="true"]` with `opacity: 0.5`, `cursor: default`, and suppressed hover/focus/active responses (overriding all interaction state changes)
- [x] T007 [P] [US1] Add `state-loading` mixin in `pathable-interaction-states.scss` emitting `&.is-loading` with `pointer-events: none`, `cursor: wait`, and a CSS-only spinner via `::after` pseudo-element (border-based spinning ring, `animation` that respects `prefers-reduced-motion`, no layout shift — pseudo-element absolutely positioned matching the element's dimensions)
- [x] T008 [US1] Add accessibility media queries to `pathable-interaction-states.scss`: `@media (forced-colors: active)` block replacing `outline-color` with `Highlight` system color on focus, and `@media (prefers-reduced-motion: reduce)` block removing animation on loading spinner
- [x] T009 [P] [US1] Create Storybook story at `packages/styles/src/stories/interaction-controls/InteractionStates.stories.js` showing a custom element (a simple card `<div>`) with the `interaction-states` mixin applied, demonstrating all eight states with toggle controls for selected, disabled, and loading

**Checkpoint**: At this point, the interaction-states SCSS exists with all 8 state mixins and a combined mixin. A consumer can make any element interactive with one `@include`. Storybook verifies all states visually.

---

## Phase 3: User Story 2 - Accessible Icon Button (Priority: P1)

**Goal**: Consumers can use a compact icon-button component (bare, subtle, bordered, inverse, destructive appearances) for common actions like close, save, menu, notification, and overflow, with consistent sizing, accessible naming, and proper touch targets.

**Independent Test**: Render icon buttons in all five appearance variants with a single SVG icon. Verify the default size is 44px square, focus ring visible on tab, compact (32px) and large (52px) sizes render, `--circle` modifier produces a circle, and destructive variant uses danger tokens.

### Implementation for User Story 2

- [x] T010 Create `packages/styles/src/pathable-component-wrappers/pathable-icon-button.scss` with `.pathable-icon-button` base class: fixed `width` and `height` via `var(--pathable-icon-button-size, 44px)`, `display: inline-flex`, `align-items: center`, `justify-content: center`, `border-radius: var(--radius-sm)`, `cursor: pointer`, and a `transition` for background/border/box-shadow. Include the `interaction-states` mixin for hover, focus-visible, focus-within, active, disabled, and loading states. Expose `--pathable-icon-button-size` and `--pathable-icon-button-icon-size` CSS custom properties.
- [x] T011 [P] [US2] Add appearance variant classes to `pathable-icon-button.scss`:
  - `.pathable-icon-button--bare`: transparent background, no border
  - `.pathable-icon-button--subtle`: `var(--pathable-color-bg)` background, no border
  - `.pathable-icon-button--bordered`: transparent background, `1px solid var(--pathable-color-border)` border
  - `.pathable-icon-button--inverse`: `var(--pathable-color-text)` background, `color: var(--pathable-color-surface)`
  - `.pathable-icon-button--destructive`: transparent background, `color: var(--pathable-color-danger)` icon color, hover fills with danger bg
- [x] T012 [P] [US2] Add size modifier classes to `pathable-icon-button.scss`: `.pathable-icon-button--compact` (32px, icon size 16px), default (44px, icon size 20px — base class), `.pathable-icon-button--large` (52px, icon size 24px). Add `.pathable-icon-button--circle` modifier (`border-radius: 50%`)
- [x] T013 [US2] Add accessibility media queries to `pathable-icon-button.scss`: `@media (forced-colors: active)` block ensuring focus outlines use `Highlight` system color and all appearance variants retain visible boundaries, and `@media (prefers-reduced-motion: reduce)` block removing non-essential transitions
- [x] T014 [P] [US2] Create Storybook story at `packages/styles/src/stories/interaction-controls/IconButton.stories.js` showing all five appearance variants, all three sizes, the `--circle` modifier, and a bare icon button on brand and inverse surfaces demonstrating focus ring visibility

**Checkpoint**: Icon button component exists with all appearance variants, sizes, circle modifier, and accessibility support. Storybook demonstrates each variant visually.

---

## Phase 4: User Story 3 - Segmented Control (Priority: P2)

**Goal**: Consumers can use a segmented-control component for presenting short sets of mutually exclusive or independently toggleable options with correct ARIA semantics and keyboard navigation support.

**Independent Test**: Render a three-option single-select segmented control. Verify selected option is visually distinct via background + border + weight, arrow key semantics are supported, and multi-select variant allows independent toggling.

### Implementation for User Story 3

- [x] T015 Create `packages/styles/src/pathable-component-wrappers/pathable-segmented-control.scss` with `.pathable-segmented-control` base class: `display: inline-flex`, `gap: var(--pathable-segmented-control-gap, var(--space-2))`, `border-radius: var(--pathable-segmented-control-radius, var(--radius-md))`, `background: var(--pathable-color-bg)`, `padding: var(--space-2)`. The container uses the background as the "track" and segments are individual buttons. Expose `--pathable-segmented-control-radius` and `--pathable-segmented-control-gap` CSS custom properties.
- [x] T016 [US3] Add `.pathable-segmented-control__option` class in `pathable-segmented-control.scss`: `display: inline-flex`, `align-items: center`, `justify-content: center`, `padding: var(--space-2) var(--space-4)`, `border-radius: calc(var(--pathable-segmented-control-radius, var(--radius-md)) - var(--space-2))`, `border: 2px solid transparent`, `background: transparent`, `cursor: pointer`. Apply the `state-focus`, `state-disabled`, and `state-hover` mixins. Add `.pathable-segmented-control__option--selected` class with `background: var(--pathable-color-surface)`, `border-color: var(--pathable-color-border)`, `font-weight: 700` — three signals for distinguishability (FR-015).
- [x] T017 [US3] Add `.pathable-segmented-control--multi` variant class that removes radiogroup assumptions (same visual but documentation clarifies `aria-pressed` usage) and `.pathable-segmented-control--vertical` class (flex column orientation with full-width segments) to `pathable-segmented-control.scss`
- [x] T018 [US3] Add accessibility media queries to `pathable-segmented-control.scss`: `@media (forced-colors: active)` block using `Highlight` for selected segment boundary (2px solid border) and focus outline; `@media (prefers-reduced-motion: reduce)` removing transitions
- [x] T019 [P] [US3] Create Storybook story at `packages/styles/src/stories/interaction-controls/SegmentedControl.stories.js` showing single-select with 3 options, multi-select with 3 options, a vertical variant, a disabled segment variant, and a single-option edge case (renders as static indicator)

**Checkpoint**: Segmented control component exists with both single-select and multi-select modes, vertical orientation, and accessibility support. Storybook demonstrates each variant.

---

## Phase 5: User Story 4 - Icon Tiles and Status Icons (Priority: P2)

**Goal**: Consumers can use standard icon tiles (square and circular) and status icon conventions so that decorative and meaningful icons have consistent sizing, alignment, and accessibility guidance.

**Independent Test**: Render a square icon tile and a circular icon tile side by side, each containing an SVG icon. Verify they are the same size with consistent padding, icon centered within, and semantic surface/foreground tokens applied.

### Implementation for User Story 4

- [x] T020 Create `packages/styles/src/pathable-component-wrappers/pathable-icon-tile.scss` with `.pathable-icon-tile` base class: `display: inline-flex`, `align-items: center`, `justify-content: center`, `width: var(--pathable-icon-tile-size, 44px)`, `height: var(--pathable-icon-tile-size, 44px)`, `border-radius: var(--radius-sm)`, `background: var(--pathable-color-bg)`, `color: var(--pathable-color-text)`. The inner `.pathable-icon` should be sized via `var(--pathable-icon-tile-icon-size, 20px)` using `width` and `height`. Expose `--pathable-icon-tile-size`, `--pathable-icon-tile-icon-size`, and `--pathable-icon-tile-padding` CSS custom properties.
- [x] T021 [P] [US4] Add modifier classes to `pathable-icon-tile.scss`: `.pathable-icon-tile--circle` (`border-radius: 50%`), `.pathable-icon-tile--compact` (32px tile, 16px icon), `.pathable-icon-tile--large` (52px tile, 24px icon). Add token-based foreground color variants for status: `.pathable-icon-tile--success` (uses success/green token), `.pathable-icon-tile--error` (uses `--pathable-color-danger`), `.pathable-icon-tile--warning` (uses amber/warning token), `.pathable-icon-tile--info` (uses `--pathable-color-link`).
- [x] T022 [US4] Add documentation comments to `pathable-icon-tile.scss` header describing decorative vs. meaningful icon accessibility conventions (per FR-007): decorative icons should use `aria-hidden="true"` on the icon tile, meaningful icons should use `role="img"` with `aria-label` on the SVG element
- [x] T023 [P] [US4] Create Storybook story at `packages/styles/src/stories/interaction-controls/IconTile.stories.js` showing square and circular tiles, all three sizes, status color variants, and an inline icon-with-text alignment demonstration
- [x] T024 [US4] Create Storybook story at `packages/styles/src/stories/interaction-controls/Integration.stories.js` showing a complete composition: icon buttons inside a surface container, segmented control for view switching, and icon tiles as status indicators — demonstrating all four stories working together

**Checkpoint**: Icon tile component exists with square/circular shapes, three sizes, and status color variants. Integration story demonstrates full composition.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify build integrity, accessibility, and edge cases across all new patterns.

- [x] T025 Run `pnpm build` from repo root and verify that both selective imports (`@forward 'pathable-icon-button'` etc.) and the all-in-one entry point (`pathable-all.scss`) compile without errors
- [x] T026 Run Storybook build for `apps/storybook` (port 6006) and verify all 5 new stories render correctly with no console errors
- [x] T027 Verify all new patterns enforce the "no product-specific content styling" constraint (FR-010) — scan each new SCSS file for `font-family`, `font-size` (on content), `line-height`, `color` (on arbitrary text), or any property that would style content instead of layout/state. Fix any violations by removing the offending declaration.
- [x] T028 Validate that no hardcoded values exist in any new SCSS file — every color, spacing, radius, and elevation value must reference a `var(--pathable-*)` or `var(--elevation-*)` or `var(--radius-*)` or `var(--space-*)` CSS custom property. Replace any raw values found.
- [x] T029 Add documentation comments to each new SCSS file header: description of the pattern, its responsibility per spec, list of CSS custom properties with defaults, and usage examples (following the existing wrapper pattern seen in `pathable-surface.scss` and `pathable-button.scss`).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. Must complete before any other phase because the bundle forwarder must exist.
- **US1 (Phase 2)**: Depends on Phase 1 (bundle forwarder). All T003–T008 tasks can be [P]arallel within the phase.
- **US2 (Phase 3)**: Depends on Phase 1 + US1 (icon button must consume interaction-state mixins from T003–T008).
- **US3 (Phase 4)**: Depends on Phase 1 + US1 (segmented control uses state-focus and state-selected from US1).
- **US4 (Phase 5)**: Depends on Phase 1 only (icon tile is standalone, no dependency on interaction states).
- **Polish (Phase 6)**: Depends on all phases completing.

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories — can start immediately after Setup.
- **US2 (P1)**: Depends on US1 (interaction states for hover/focus/active/disabled/loading).
- **US3 (P2)**: Depends on US1 (interaction states for focus and selected).
- **US4 (P2)**: No dependencies on other stories — can start immediately after Setup.

### Parallel Opportunities

- All US1 tasks marked [P] (T003–T008) can run in parallel within their sub-groups (mixins are independent files within the same SCSS file, but since they're all in one file they must be merged sequentially. T003 is the base file; T004–T007 append mixins to it)
- All US2 tasks marked [P] (T010–T014) — T010 is the base file, T011–T012 are modifier additions within the same file, so sequential within the file but T014 (story) is independent
- US4 (Phase 5) has no dependencies on US2/US3 — can be worked on simultaneously with them
- Storybook stories ([P]) are independent of each other within each phase
- Polish tasks marked [P] (T025, T027, T028, T029) can run in parallel once all other phases are complete

### Execution Strategy

With a single developer, recommended order:
1. Phase 1 (Setup) — T001, T002
2. Phase 2 (US1) — T003–T009 (this is the MVP)
3. Phase 3 (US2) — T010–T014
4. Phase 5 (US4) — T020–T024 (can be done before or alongside US3)
5. Phase 4 (US3) — T015–T019
6. Phase 6 (Polish) — T025–T029

With multiple developers:
- Developer A: Phase 1 + Phase 2 (US1 — MVP: interaction states)
- Developer B: Phase 5 (US4 — icon tiles, standalone)
- Developer C: Phase 3 (US2 — icon button, after US1 ready) + Phase 4 (US3 — segmented control, after US1 ready)
- Then all: Phase 6 (Polish) together

---

## Parallel Example

```bash
# Phase 1 (Setup):
Task: "Create bundle forwarder pathable-interaction-controls.scss"
Task: "Update pathable-all.scss with new forward"

# Phase 2 (US1) — sequential within SCSS file:
Task: "Create pathable-interaction-states.scss base with hover + focus mixins"
Task: "Add active + pressed mixins"
Task: "Add selected mixin"
Task: "Add disabled mixin"
Task: "Add loading mixin (CSS spinner)"
Task: "Add accessibility media queries"
Task: "Create InteractionStates.stories.js"

# Phase 4 (US4) — independent of US2/US3:
Task: "Create pathable-icon-tile.scss base"
Task: "Add size/shape/status modifiers"
Task: "Add documentation comments"
Task: "Create IconTile.stories.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: US1 — Interaction States (T003–T009)
3. **STOP and VALIDATE**: Verify `pnpm build` compiles. Open Storybook. Verify all 8 states render correctly.
4. MVP ready: Consumers can make any element interactive with shared state mixins.

### Incremental Delivery

1. Complete Setup + US1 → Shared interaction states (MVP)
2. Add US2 → Icon button component (compact action triggers)
3. Add US4 → Icon tiles and status icons (consistent icon containers)
4. Add US3 → Segmented control (compact option groups)
5. Add Polish → Build verification, documentation, edge case hardening

Each increment adds value without breaking previous increments.

---

## Notes

- [P] tasks = different files, no dependencies (within a single SCSS file, tasks are sequential; stories are independent)
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable via Storybook
- After each phase, run `pnpm build` to verify compilation
- Commit after each phase or logical task group
- SCSS files follow the existing pattern: no `@use 'uswds-core'` needed for pure CSS patterns (interaction-states, icon-button, segmented-control, icon-tile are pure CSS — use `var(--pathable-*)` / `var(--elevation-*)` / `var(--radius-*)` tokens directly)
- No new CSS custom properties need to be added to the token system — all referenced tokens already exist
- Interaction states use SCSS `@mixin` for authoring-time composition; follow the `pathable-surface.scss` pattern for nested selectors
- Loading spinner animation uses `@keyframes spin` with `transform: rotate()` — must respect `prefers-reduced-motion`