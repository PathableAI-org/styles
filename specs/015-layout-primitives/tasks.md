# Tasks: Compositional Layout Primitives and Semantic Surfaces

**Input**: Design documents from `/specs/015-layout-primitives/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks included — this feature produces compiled CSS verified visually via Storybook stories.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- All SCSS files under `packages/styles/src/pathable-component-wrappers/`
- All story files under `packages/styles/src/stories/layout-composition/`

## Table of Contents

- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 2: User Story 1 - Build a Page with Named Layout Primitives](#phase-2-user-story-1---build-a-page-with-named-layout-primitives-priority-p1-mvp)
- [Phase 3: User Story 2 - Apply Semantic Surface Styles](#phase-3-user-story-2---apply-semantic-surface-styles-priority-p1)
- [Phase 4: User Story 3 - Responsive Split and Sidebar Layouts](#phase-4-user-story-3---responsive-split-and-sidebar-layouts-priority-p2)
- [Phase 5: User Story 4 - Sticky Panel with Safe Fallback](#phase-5-user-story-4---sticky-panel-with-safe-fallback-priority-p2)
- [Phase 6: User Story 5 - Compose Nested Surfaces](#phase-6-user-story-5---compose-nested-surfaces-priority-p3)
- [Phase 7: Polish & Cross-Cutting Concerns](#phase-7-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the bundle infrastructure that links all new primitives into the existing SCSS build chain.

- [ ] T001 Create new bundle forwarder file at `packages/styles/src/pathable-component-wrappers/pathable-layout-composition.scss` that forwards the 8 individual primitive files (container, stack, cluster, split, card-grid, sidebar-layout, sticky-panel, surface) using `@forward` statements
- [ ] T002 Update `packages/styles/src/pathable-component-wrappers/pathable-all.scss` to add `@forward 'pathable-layout-composition';` so the new bundle is included in the all-in-one entry point

**Checkpoint**: The import chain exists — `pathable-all.scss` forwards `pathable-layout-composition` which forwards all new primitive files. Individual files don't exist yet, so compilation will fail until Phase 2 onward.

---

## Phase 2: User Story 1 - Build a Page with Named Layout Primitives (Priority: P1) 🎯 MVP

**Goal**: Consumers can compose a full page layout using container, stack, cluster, and card-grid primitives without writing custom spacing or grid CSS.

**Independent Test**: Create an HTML page using container, stack, cluster, and card-grid together. Verify at desktop width: container is centered, stack children have consistent vertical gap, cluster items wrap horizontally, card grid shows 3 columns. At mobile: all layouts are single column, no horizontal overflow.

### Implementation for User Story 1

- [ ] T003 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-container.scss` with `.pathable-container` base class (width 100%, max-width, margin-inline auto, padding-inline via token) plus modifiers `.pathable-container--standard` (1024px), `.pathable-container--wide` (1280px), and `.pathable-container--full` (100% width with constrained gutters). Reference `--space-24` token for default gutter, expose `--pathable-container-max-width` and `--pathable-container-gutter-x` CSS custom properties.
- [ ] T004 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-stack.scss` with `.pathable-stack` base class (flex column, gap via `--pathable-stack-gap` defaulting to `var(--space-16)`) plus gap modifier classes: `--gap-sm` (var(--space-8)), `--gap-md` (var(--space-16)), `--gap-lg` (var(--space-24)), `--gap-xl` (var(--space-32)). Expose `--pathable-stack-gap` CSS custom property.
- [ ] T005 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-cluster.scss` with `.pathable-cluster` base class (flex wrap, gap via `--pathable-cluster-gap` defaulting to `var(--space-8)`, align-items via `--pathable-cluster-align` defaulting to center) plus gap and align modifier classes. Gap: `--gap-sm` (var(--space-4)), `--gap-md` (var(--space-8)), `--gap-lg` (var(--space-16)). Align: `--align-start`, `--align-center`, `--align-end`, `--align-stretch`.
- [ ] T006 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-card-grid.scss` with `.pathable-card-grid` base class (CSS Grid with `repeat(auto-fill, minmax(min(100%, var(--pathable-card-grid-min-width, 300px)), 1fr))`, gap via `--pathable-card-grid-gap` defaulting to `var(--space-24)`) plus gap modifier classes: `--gap-sm` (var(--space-16)), `--gap-md` (var(--space-24)), `--gap-lg` (var(--space-32)). Expose `--pathable-card-grid-min-width` and `--pathable-card-grid-gap` CSS custom properties.
- [ ] T007 [P] [US1] Create Storybook story at `packages/styles/src/stories/layout-composition/Container.stories.js` showing `.pathable-container` with all three width variants (standard, wide, full) and nested content demonstrating centered behavior at both desktop and mobile widths.
- [ ] T008 [P] [US1] Create Storybook story at `packages/styles/src/stories/layout-composition/Stack.stories.js` showing `.pathable-stack` with all gap variants, nested elements demonstrating consistent spacing, and a single-child edge case.
- [ ] T009 [P] [US1] Create Storybook story at `packages/styles/src/stories/layout-composition/Cluster.stories.js` showing `.pathable-cluster` with gap and align variants, tags/buttons as children, and an overflow wrap demonstration.
- [ ] T010 [P] [US1] Create Storybook story at `packages/styles/src/stories/layout-composition/CardGrid.stories.js` showing `.pathable-card-grid` with 3, 5, and 1 card items demonstrating auto-fill column calculation and single-row alignment. Include gap variants. Verify cards never go narrower than 300px.

**Checkpoint**: At this point, container, stack, cluster, and card-grid primitives exist as SCSS files with Storybook verification. A consumer can build a basic page layout. Compilation with `pnpm build` should succeed.

---

## Phase 3: User Story 2 - Apply Semantic Surface Styles (Priority: P1)

**Goal**: Consumers can apply named surface styles (base, raised, inset, interactive, brand, inverse) that convey visual hierarchy through semantic tokens rather than raw declarations.

**Independent Test**: Place six blocks side by side, each using a different surface variant. Verify raised appears elevated (shadow), inset appears recessed (internal shadow), interactive shows focus ring on tab, brand has accent background, inverse has dark background. Distinguishability holds at 200% zoom.

### Implementation for User Story 2

- [ ] T011 [P] [US2] Create `packages/styles/src/pathable-component-wrappers/pathable-surface.scss` with `.pathable-surface` base class (position relative, border-radius via `--pathable-surface-border-radius` defaulting to `var(--radius-md)`, transition via `--pathable-surface-transition-duration` defaulting to 0.2s). Implement all six variant modifiers:
  - `.pathable-surface--base`: transparent background, `1px solid var(--pathable-color-border)` border, no elevation
  - `.pathable-surface--raised`: `var(--pathable-color-surface)` background, `var(--elevation-md)` box-shadow
  - `.pathable-surface--inset`: `var(--pathable-color-bg)` background, `inset var(--elevation-sm)` box-shadow
  - `.pathable-surface--interactive`: `var(--pathable-color-surface)` background, `2px solid transparent` border, `var(--elevation-sm)` box-shadow, cursor pointer
  - `.pathable-surface--brand`: `var(--pathable-color-accent)` background, `var(--elevation-md)` box-shadow
  - `.pathable-surface--inverse`: `var(--pathable-color-text)` background, `var(--elevation-md)` box-shadow
- [ ] T012 [US2] Add interactive states to `pathable-surface.scss`: implement `:hover` (elevation increases to `var(--elevation-md)` on `--interactive`), `:focus-visible` (`outline: 2px solid var(--pathable-color-focus-ring)` with `outline-offset: 2px`), `:focus-within` (same focus ring), `:active` (elevation drops), and `:disabled` / `[aria-disabled="true"]` (reduced opacity, no hover change) selectors.
- [ ] T013 [US2] Add accessibility media queries to `pathable-surface.scss`: `@media (forced-colors: active)` block adding outline to all surface variants for boundary visibility, and `@media (prefers-reduced-motion: reduce)` block removing transition on all surfaces (hover/focus state changes are considered essential and preserved).
- [ ] T014 [P] [US2] Create Storybook story at `packages/styles/src/stories/layout-composition/Surface.stories.js` showing all six surface variants side by side, interactive surface in all states (rest, hover, focus-visible, active, disabled), and a forced-colors mode note.

**Checkpoint**: All six surface variants work with interactive states and accessibility support. Storybook demonstrates each variant visually.

---

## Phase 4: User Story 3 - Responsive Split and Sidebar Layouts (Priority: P2)

**Goal**: Consumers can use split and sidebar-layout primitives that collapse to a logical stacked order on small screens while preserving DOM reading order.

**Independent Test**: Create a split layout with A/B content blocks on desktop, then resize below 1024px. A should stack above B (preserving DOM order). Repeat with sidebar-layout — sidebar content should appear below main content on mobile.

### Implementation for User Story 3

- [ ] T015 [P] [US3] Create `packages/styles/src/pathable-component-wrappers/pathable-split.scss` with `.pathable-split` base class (CSS Grid, two-column via `--pathable-split-ratio` defaulting to `1fr 1fr`, gap via `--pathable-split-gap` defaulting to `var(--space-24)`, align-items via `--pathable-split-align` defaulting to center). Implement ratio modifier classes: `--ratio-1-1`, `--ratio-1-2`, `--ratio-2-1`, `--ratio-1-3`. Implement align modifier classes: `--align-start`, `--align-center`, `--align-end`, `--align-stretch`. Add `@media (max-width: 1023px)` block collapsing to single column. Expose `--pathable-split-ratio`, `--pathable-split-gap`, `--pathable-split-align` CSS custom properties.
- [ ] T016 [P] [US3] Create `packages/styles/src/pathable-component-wrappers/pathable-sidebar-layout.scss` with `.pathable-sidebar-layout` base class (CSS Grid, two-column via `--pathable-sidebar-ratio` defaulting to `3fr 1fr`, gap via `--pathable-sidebar-gap` defaulting to `var(--space-24)`). Implement ratio modifier classes: `--ratio-3-1`, `--ratio-2-1`, `--ratio-4-1`. Implement `.pathable-sidebar-layout--sidebar-first` modifier (reverses column order to `1fr 3fr`). Add `@media (max-width: 1023px)` block collapsing both variants to single column, preserving DOM reading order. Expose `--pathable-sidebar-ratio` and `--pathable-sidebar-gap` CSS custom properties.
- [ ] T017 [P] [US3] Create Storybook story at `packages/styles/src/stories/layout-composition/Split.stories.js` showing all ratio and align variants, desktop vs mobile states via viewport resizing, and an empty-region edge case.
- [ ] T018 [P] [US3] Create Storybook story at `packages/styles/src/stories/layout-composition/SidebarLayout.stories.js` showing both default and sidebar-first variants, content with realistic layout (main text + sidebar widget), and responsive collapse behavior.

**Checkpoint**: Split and sidebar-layout primitives exist with responsive behavior verified in Storybook. DOM reading order is preserved on collapse.

---

## Phase 5: User Story 4 - Sticky Panel with Safe Fallback (Priority: P2)

**Goal**: Consumers can use sticky-panel primitive that sticks on large viewports but becomes static when the viewport is too short or narrow, preventing content obscuring.

**Independent Test**: Place a sticky-panel inside a sidebar-layout on a tall viewport (>600px). Verify it sticks when scrolling. Reduce viewport height below 600px — panel should become static. Apply `--static` modifier — panel should be static regardless.

### Implementation for User Story 4

- [ ] T019 Create `packages/styles/src/pathable-component-wrappers/pathable-sticky-panel.scss` with `.pathable-sticky-panel` base class (`position: sticky`, `top: var(--pathable-sticky-panel-top, var(--space-24))`). Implement `.pathable-sticky-panel--static` modifier (`position: static`). Add `@media (max-height: 599px)` block disabling sticky (position: static). Expose `--pathable-sticky-panel-top` CSS custom property.
- [ ] T020 Create Storybook story at `packages/styles/src/stories/layout-composition/StickyPanel.stories.js` showing sticky panel inside a sidebar-layout with tall viewport (scroll container to demonstrate stickiness) and a short viewport note. Include the `--static` modifier variant.

**Checkpoint**: Sticky-panel works at tall viewports and safely falls back to static at short viewports.

---

## Phase 6: User Story 5 - Compose Nested Surfaces (Priority: P3)

**Goal**: Consumers can nest surfaces inside other surfaces (e.g., raised card inside inset panel) and both remain visually distinguishable without excessive shadows.

**Independent Test**: Place a raised surface inside an inset surface. Verify the raised surface has a visible shadow against the inset background, and the inset surface shows its internal shadow boundary. The nest depth of 3 should still be distinguishable per spec assumptions.

### Implementation for User Story 5

- [ ] T021 [P] [US5] Create Storybook story at `packages/styles/src/stories/layout-composition/NestedComposition.stories.js` showing a complete page composition using all primitives: container → stack → (split + sidebar-layout + card-grid). Inside the composition, demonstrate nested surfaces: raised card inside inset sidebar, interactive surface inside raised card. Verify at both desktop and mobile widths.

**Note**: User Story 5 validation is primarily visual/compositional. The core surface SCSS already handles nesting correctly via the implementations in Phase 3 (transparent backgrounds, cumulative shadows handled by independent elevation values). The Storybook story provides visual proof.

**Checkpoint**: Full page composition story exists demonstrating all primitives and surfaces working together.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify build integrity, accessibility, and edge cases across all primitives.

- [ ] T022 Run `pnpm build` from repo root and verify that both selective imports (`@forward 'pathable-container'` etc.) and the all-in-one entry point (`pathable-all.scss`) compile without errors
- [ ] T023 Run Storybook build for `apps/storybook` (port 6006) and verify all 9 new stories render correctly with no console errors
- [ ] T024 Verify all primitives enforce the "no product-specific content styling" constraint (FR-010) — scan each new SCSS file for `font-family`, `font-size`, `color` (on content/text), `line-height`, `margin` (on children), or any property that would style content instead of layout. Fix any violations by removing the offending declaration.
- [ ] T025 Validate that no hardcoded values exist in any new SCSS file — every color, spacing, radius, and elevation value must reference a `var(--pathable-*)` or `var(--space-*)` or `var(--radius-*)` or `var(--elevation-*)` CSS custom property. Replace any raw values found.
- [ ] T026 Add documentation comments to each new SCSS file header (following the existing wrapper pattern): description of the primitive, its layout responsibility per FR-017, list of CSS custom properties with defaults, and recommended use cases for container width variants per FR-016.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. Must complete before any other phase because the bundle forwarder must exist.
- **US1 (Phase 2)**: Depends on Phase 1 (bundle forwarder). All T003–T006 tasks are [P]arallel.
- **US2 (Phase 3)**: Depends on Phase 1 only. Independent of US1. T011 is foundational (surface SCSS), T012–T013 depend on T011.
- **US3 (Phase 4)**: Depends on Phase 1 only. T015 and T016 are [P]arallel. Independent of US1/US2.
- **US4 (Phase 5)**: Depends on Phase 1 only. Independent of other stories.
- **US5 (Phase 6)**: Depends on Phase 3 (surfaces must exist for nesting). T021 is the primary task.
- **Polish (Phase 7)**: Depends on all phases completing. Tasks can run after the relevant user stories are done.

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories — can start immediately after Setup.
- **US2 (P1)**: No dependencies on other stories — can start immediately after Setup.
- **US3 (P2)**: No dependencies on other stories — can start immediately after Setup.
- **US4 (P2)**: No dependencies on other stories — can start immediately after Setup.
- **US5 (P3)**: Depends on US2 (surfaces must exist for nesting composition).

### Parallel Opportunities

- All US1 tasks marked [P] (T003–T006, T007–T010) can run in parallel — they create independent files that don't import each other
- All US2 tasks within the same file (T012, T013) must run sequentially after T011
- All US3 tasks marked [P] (T015, T016, T017, T018) can run in parallel
- Phases 2–5 (US1, US2, US3, US4) can be worked on simultaneously by different developers
- Storybook stories ([P]) are independent of each other within each phase

### Execution Strategy

With a single developer, recommended order:
1. Phase 1 (Setup) — T001, T002
2. Phase 2 (US1) — all tasks (this is the MVP)
3. Phase 3 (US2) — all tasks
4. Phase 4 (US3) — all tasks
5. Phase 5 (US4) — all tasks
6. Phase 6 (US5) — all tasks
7. Phase 7 (Polish) — all tasks

With multiple developers:
- Developer A: Phase 1 + Phase 2 (US1 — MVP)
- Developer B: Phase 3 (US2)
- Developer C: Phase 4 (US3) + Phase 5 (US4)
- Then all: Phase 6 + Phase 7 together

---

## Parallel Example: User Story 1

```bash
# Launch all SCSS file creations for US1 in parallel:
Task: "Create pathable-container.scss"
Task: "Create pathable-stack.scss"
Task: "Create pathable-cluster.scss"
Task: "Create pathable-card-grid.scss"

# Launch all Storybook stories for US1 in parallel:
Task: "Create Container.stories.js"
Task: "Create Stack.stories.js"
Task: "Create Cluster.stories.js"
Task: "Create CardGrid.stories.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: US1 — Container, Stack, Cluster, Card Grid (T003–T010)
3. **STOP and VALIDATE**: Verify `pnpm build` compiles. Open Storybook. Verify each primitive renders correctly.
4. MVP ready: Consumers can build a basic page with centered container, vertical stacking, horizontal clusters, and auto-fitting card grid.

### Incremental Delivery

1. Complete Setup + US1 → Basic page layout primitives (MVP)
2. Add US2 → Semantic surface styling (visual hierarchy)
3. Add US3 → Responsive split/sidebar layouts (complex page structures)
4. Add US4 → Sticky panel support (accessibility-safe sticky)
5. Add US5 → Nested composition (full-page integration)
6. Add Polish → Build verification, documentation, edge case hardening

Each increment adds value without breaking previous increments.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable via Storybook
- After each phase, run `pnpm build` to verify compilation
- Commit after each phase or logical task group
- SCSS files follow the existing pattern: no `@use 'uswds-core'` needed for pure CSS primitives (container, stack, cluster, card-grid, split, sidebar-layout, sticky-panel are pure CSS Grid/Flexbox; only surface might reference USWDS tokens indirectly via CSS custom properties)
- No new CSS custom properties need to be added to the token system — all referenced tokens already exist