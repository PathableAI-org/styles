# Tasks: Resource Discovery Card, Filter Bar, and Guided Wayfinder Patterns

**Input**: Design documents from `/specs/019-resource-discovery-patterns/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks are generated. This feature produces CSS-class-based visual patterns. Verification is via Storybook visual stories and manual inspection against the contracts and quickstart.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 - Browse Resources in a Card Grid](#phase-3-user-story-1---browse-resources-in-a-card-grid-priority-p1--mvp)
- [Phase 4: User Story 2 - Filter, Search, and Sort Resources](#phase-4-user-story-2---filter-search-and-sort-resources-priority-p1)
- [Phase 5: User Story 3 - Guided Wayfinder for Complex Choices](#phase-5-user-story-3---guided-wayfinder-for-complex-choices-priority-p2)
- [Phase 6: User Story 4 - Empty, Loading, and Error States](#phase-6-user-story-4---empty-loading-and-error-states-for-resource-lists-priority-p3)
- [Phase 7: Polish & Cross-Cutting Concerns](#phase-7-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 1](#parallel-example-user-story-1)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **SCSS source**: `packages/styles/src/pathable-component-wrappers/`
- **Stories**: `packages/styles/src/stories/discovery/`
- All paths are relative to repository root.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization — create bundle package, update entry point

- [ ] T001 Create `pathable-discovery.scss` bundle package at `packages/styles/src/pathable-component-wrappers/pathable-discovery.scss` that forwards all four new pattern files
- [ ] T002 Add `@forward 'pathable-discovery'` to `packages/styles/src/pathable-component-wrappers/pathable-all.scss`
- [ ] T003 [P] Create story directory structure at `packages/styles/src/stories/discovery/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: None — existing project infrastructure (SCSS compilation, Storybook tooling, design token system) is already in place and requires no new setup.

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Browse Resources in a Card Grid (Priority: P1) 🎯 MVP

**Goal**: Resource card pattern with grid and list layout support, all required regions, interactive hover/focus-within states, and independent secondary action focus.

**Independent Test**: Can be tested by rendering a set of resource cards in a `pathable-card-grid` and verifying that each card displays media/icon, title, provider, summary, badges, metadata, rating, source, and a primary link, and that the secondary action (if present) receives an independent focus state.

### Implementation for User Story 1

- [ ] T004 [P] [US1] Create `pathable-resource-card.scss` at `packages/styles/src/pathable-component-wrappers/pathable-resource-card.scss` with container styles for grid and list layout variants (`.pathable-resource-card--grid`, `.pathable-resource-card--list`)
- [ ] T005 [P] [US1] Add card region styles (media, title, provider, summary, badges, metadata, rating, source, link, action) to `pathable-resource-card.scss`
- [ ] T006 [US1] Add interactive hover/focus-within emphasis (`.pathable-resource-card--interactive`) referencing existing `--pathable-surface-*` and `--elevation-*` tokens
- [ ] T007 [US1] Add secondary action sibling positioning so the action button sits outside the primary link element with independent focus state
- [ ] T008 [US1] Add `--pathable-resource-card-summary-lines` clamp, `--pathable-resource-card-media-width`, `--pathable-resource-card-media-height` overridable custom properties
- [ ] T009 [US1] Add forced-colors mode boundary preservation and reduced-motion support
- [ ] T010 [US1] Add no-image fallback styling (`.pathable-resource-card--no-image`) and has-action modifier padding adjustment (`.pathable-resource-card--has-action`)
- [ ] T011 [P] [US1] Create `ResourceCard.stories.js` at `packages/styles/src/stories/discovery/ResourceCard.stories.js` with Default, Grid, List, Interactive, WithAction, NoImage, and Sparse-content examples
- [ ] T012 [US1] Verify all card variations compile without errors via `pnpm build` and render correctly in Storybook

**Checkpoint**: At this point, the resource card should be fully functional and testable independently. Resource cards can be dropped into any grid or list layout.

---

## Phase 4: User Story 2 — Filter, Search, and Sort Resources (Priority: P1)

**Goal**: Composite filter bar with search, facets, sort, result count, removable active-filter pills, and clear-all control. Responsive stacking on narrow screens.

**Independent Test**: Can be tested by rendering a filter bar with multiple active filters and verifying each pill has a removable dismiss with visible focus, pills wrap without overflow, and the bar collapses to stacked layout below the desktop breakpoint.

### Implementation for User Story 2

- [ ] T013 [P] [US2] Create `pathable-filter-pill.scss` at `packages/styles/src/pathable-component-wrappers/pathable-filter-pill.scss` with pill container, label, and dismiss button styles
- [ ] T014 [US2] Add visible focus state on pill dismiss button and accessible dismiss-button sizing (minimum 44px touch target)
- [ ] T015 [P] [US2] Create `pathable-filter-bar.scss` at `packages/styles/src/pathable-component-wrappers/pathable-filter-bar.scss` with flex row layout for search, facets, sort, count, filters, and clear regions
- [ ] T016 [US2] Add responsive stacking below 1024px: controls wrap vertically without horizontal overflow
- [ ] T017 [US2] Add `--has-filters` and `--drawer-mode` modifier classes to filter bar
- [ ] T018 [US2] Add forced-colors mode boundary preservation and reduced-motion support
- [ ] T019 [P] [US2] Create `FilterPill.stories.js` at `packages/styles/src/stories/discovery/FilterPill.stories.js` with Default, Focused, and Multiple-pills examples
- [ ] T020 [P] [US2] Create `FilterBar.stories.js` at `packages/styles/src/stories/discovery/FilterBar.stories.js` with Default, HasFilters, DrawerMode, and Wrapped-filters examples
- [ ] T021 [US2] Verify all filter bar and pill variations compile via `pnpm build` and render in Storybook

**Checkpoint**: At this point, User Story 1 AND 2 should both work independently and be composable.

---

## Phase 5: User Story 3 — Guided Wayfinder for Complex Choices (Priority: P2)

**Goal**: Guided wayfinder panel with decorative icon, heading, explanatory text, two or more labeled question groups (fieldset/legend), primary action button, and single-column collapse on narrow screens.

**Independent Test**: Can be tested by rendering the wayfinder panel with two question groups and verifying the icon, heading, text, controls, and action are present, and that controls collapse to single column below 1024px.

### Implementation for User Story 3

- [ ] T022 [P] [US3] Create `pathable-wayfinder.scss` at `packages/styles/src/pathable-component-wrappers/pathable-wayfinder.scss` with container styles using raised surface treatment (reference existing `pathable-surface--raised` patterns)
- [ ] T023 [US3] Add wayfinder region styles: icon (`aria-hidden="true"`), heading, explanatory text, questions flex row container, individual question-group column, question label, question controls, and action button
- [ ] T024 [US3] Add responsive single-column collapse below 1024px for question groups
- [ ] T025 [US3] Add forced-colors mode boundary preservation and reduced-motion support
- [ ] T026 [P] [US3] Create `Wayfinder.stories.js` at `packages/styles/src/stories/discovery/Wayfinder.stories.js` with Default (two questions), Single-question, and Mobile-narrow examples
- [ ] T027 [US3] Verify wayfinder compiles via `pnpm build` and renders in Storybook

**Checkpoint**: All three user stories should now be independently functional and composable.

---

## Phase 6: User Story 4 — Empty, Loading, and Error States for Resource Lists (Priority: P3)

**Goal**: Integration examples showing resource grid with empty-result state (using existing `.pathable-empty-state--no-results`), loading state (using existing `.pathable-skeleton`), and populated state.

**Independent Test**: Can be tested by rendering the resource grid with no data and verifying the empty-state placeholder is shown, and by rendering with skeleton placeholders approximating card dimensions.

### Implementation for User Story 4

- [ ] T028 [US4] Add resource-grid empty-result example styles in `pathable-resource-card.scss` for when resource cards are hidden (empty state replaces grid)
- [ ] T029 [US4] Add resource-grid loading skeleton example styles — card-sized skeleton blocks that match `.pathable-resource-card` dimensions
- [ ] T030 [P] [US4] Create `ResourceStates.stories.js` at `packages/styles/src/stories/discovery/ResourceStates.stories.js` with Populated, Loading (skeleton placeholders), Empty (no results), and Sparse (minimal cards) examples

**Checkpoint**: All four user stories should now be independently functional and composable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Pattern-wide improvements, documentation updates, and final validation.

- [ ] T031 [P] Run `pnpm build` and verify no compilation errors; confirm `dist/styles.css` includes all new discovery pattern classes
- [ ] T032 [P] Run quickstart.md validation checklist items
- [ ] T033 Update plan.md post-design re-evaluation to confirm all gates pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: No blocking prerequisites — existing infrastructure is sufficient
- **User Stories (Phase 3+)**: All depend on Setup completion
  - US1 and US2 are independent (P1) — can proceed in parallel
  - US3 (P2) is independent of US1/US2 — can proceed in parallel
  - US4 (P3) depends on US1 (resource card) being available for integration examples
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup — no dependencies on other stories
- **User Story 2 (P1)**: Can start after Setup — no dependencies on other stories
- **User Story 3 (P2)**: Can start after Setup — no dependencies on other stories
- **User Story 4 (P3)**: Depends on US1 (resource card dimension and class structure needed for skeleton/empty examples)

### Within Each User Story

- SCSS file creation before story file creation
- Core layout before responsive variants
- Standard states before accessibility variants (forced-colors, reduced-motion)
- Story verification via `pnpm build` before moving to next story

### Parallel Opportunities

- T003 (story directory) is independent of T001-T002 — can run in parallel
- All tasks within a user story marked [P] can run in parallel
- US1, US2, and US3 can be worked on in parallel by different developers (no file conflicts — each pattern is a separate SCSS file)
- Story files within each user story run in parallel with SCSS implementation
- T031 and T032 in final phase can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all SCSS implementation tasks together:
Task: "Create pathable-resource-card.scss with grid/list layout at packages/styles/src/pathable-component-wrappers/pathable-resource-card.scss"
Task: "Add card region styles (media, title, provider, summary, badges, metadata, rating, source, link, action)"

# Launch remaining implementation:
Task: "Add interactive hover/focus-within emphasis"
Task: "Add secondary action sibling positioning"

# Launch story creation alongside SCSS:
Task: "Create ResourceCard.stories.js with Default, Grid, List, Interactive, WithAction, NoImage, Sparse"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 3: User Story 1 (Resource Card)
3. **STOP and VALIDATE**: Test resource card independently — verify all regions, layouts, and interactive states
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Phase 1: Setup
2. Add US1 (Resource Card) → Test independently → Deploy/Demo (MVP!)
3. Add US2 (Filter Bar + Filter Pill) → Test independently → Deploy/Demo
4. Add US3 (Wayfinder) → Test independently → Deploy/Demo
5. Add US4 (States) → Test independently → Deploy/Demo
6. Each story adds value without breaking previous patterns

### Parallel Team Strategy

With multiple developers:

1. Developer A: US1 (Resource Card) — 9 tasks
2. Developer B: US2 (Filter Bar + Filter Pill) — 9 tasks
3. Developer C: US3 (Wayfinder) — 6 tasks
4. One developer handles Phase 1 Setup first (3 tasks), then moves to US4 (3 tasks)
5. All patterns are independent SCSS files — zero file conflicts

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- `pnpm build` must succeed after each logical group of tasks
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All SCSS values MUST reference existing `--pathable-*` CSS custom properties — no hardcoded values
- Secondary action MUST be a DOM sibling of the primary link, not nested inside it (FR-005)