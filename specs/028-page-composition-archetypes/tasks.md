# Tasks: Page Composition Archetypes

**Input**: Design documents from `/specs/028-page-composition-archetypes/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks are generated — tests are limited to Storybook a11y checks and manual verification, which are described in each story's acceptance criteria.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 - Marketing Landing Page Composition (Priority P1)](#phase-3-user-story-1---marketing-landing-page-composition-priority-p1)
- [Phase 4: User Story 2 - Resource Directory Page Composition (Priority P1)](#phase-4-user-story-2---resource-directory-page-composition-priority-p1)
- [Phase 5: User Story 3 - Operational Dashboard Composition (Priority P2)](#phase-5-user-story-3---operational-dashboard-composition-priority-p2)
- [Phase 6: User Story 4 - Structured Workflow Composition (Priority P2)](#phase-6-user-story-4---structured-workflow-composition-priority-p2)
- [Phase 7: Polish & Cross-Cutting Concerns](#phase-7-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Story files**: `packages/styles/src/stories/marketing-patterns/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

No setup tasks needed — the `packages/styles` project, Storybook configuration, and all required SCSS component wrappers already exist. The `stories/marketing-patterns/` directory already contains example stories to follow as templates.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

No foundational tasks needed — all patterns required by these compositions (headers, footers, bento grids, chip rails, decorative backgrounds, screenshot frames, text highlights, layout compositions, navigation, discovery components, dashboard components, structured workflow components, form controls, communication components, empty states, buttons, typography) are already implemented and available in the published `packages/styles` bundle.

**Checkpoint**: Foundation ready — all four user stories can be implemented independently and in parallel.

---

## Phase 3: User Story 1 - Marketing Landing Page Composition (Priority: P1) 🎯 MVP

**Goal**: Create a Storybook story showing a marketing landing page with site header, hero (eyebrow/headline/copy/CTA buttons), audience/values row, alternating feature sections with screenshot frames, statistic cards, CTA band, and footer — all using only public CSS classes.

**Independent Test**: Render the MarketingLandingPage story in Storybook at desktop and mobile viewports; confirm all sections render with correct layout, no horizontal overflow, and pass keyboard focus order.

### Implementation for User Story 1

- [ ] T001 [P] [US1] Create MarketingLandingPage.stories.js with story metadata (title, tags, parameters, documentation links) in `packages/styles/src/stories/marketing-patterns/MarketingLandingPage.stories.js`
- [ ] T002 [US1] Implement desktop variant `Desktop` export — compose site header, hero section (eyebrow, headline, copy, primary/secondary CTA using pathable-button), audience/values row using pathable-cluster, alternating feature sections with pathable-screenshot-frame images and pathable-text-highlight, statistics cards using pathable-card in a bento-grid layout, decorative backgrounds via pathable-decorative-bg, CTA band, and pathable-footer
- [ ] T003 [US1] Implement mobile variant `Mobile` export — same sections as Desktop but tested and adjusted for 320px viewport; sections stack vertically, hero CTA buttons wrap, feature images reflow, statistics cards fill width

---

## Phase 4: User Story 2 - Resource Directory Page Composition (Priority: P1)

**Goal**: Create a Storybook story showing a searchable resource directory with search-led hero, guided wayfinder, filter bar with active-filter pills, result count/sorting, resource-card grid, empty-results fallback, and pagination.

**Independent Test**: Render the ResourceDirectory story at desktop and mobile viewports; confirm all structural regions render, the empty-results variant displays a clear message, and filter/grid sections stack appropriately on mobile.

### Implementation for User Story 2

- [ ] T004 [P] [US2] Create ResourceDirectory.stories.js with story metadata (title, tags, parameters, documentation links) in `packages/styles/src/stories/marketing-patterns/ResourceDirectory.stories.js`
- [ ] T005 [US2] Implement `Populated` variant — compose search-led hero with pathable-search, pathable-wayfinder, pathable-filter-bar with pathable-filter-pill chips (2-3 active filters), result count heading, sort controls, resource-card grid using pathable-resource-card (6-9 cards), and pathable-pagination
- [ ] T006 [US2] Implement `EmptyResults` variant — same structure but resource-card grid replaced with pathable-empty-state fallback showing clear message and suggested action
- [ ] T007 [US2] Implement mobile variant `Mobile` — same sections at 320px; filter bar stacks, cards go full-width, pagination collapses

---

## Phase 5: User Story 3 - Operational Dashboard Composition (Priority: P2)

**Goal**: Create a Storybook story showing an operational dashboard with responsive app shell, sidebar navigation, dashboard header, KPI cards, activity list, schedule section, responsive table, toast notification, loading/empty states, and mobile bottom navigation.

**Independent Test**: Render the OperationalDashboard story at desktop and mobile viewports; confirm loading skeleton displays, populated data renders, empty state shows messaging, table scrolls horizontally on mobile, and bottom navigation is visible.

### Implementation for User Story 3

- [ ] T008 [P] [US3] Create OperationalDashboard.stories.js with story metadata (title, tags, parameters, documentation links) in `packages/styles/src/stories/marketing-patterns/OperationalDashboard.stories.js`
- [ ] T009 [US3] Implement `Loading` variant — compose app shell with pathable-skeleton placeholders in KPI grid, activity list, table, and schedule regions
- [ ] T010 [US3] Implement `Populated` variant — compose app shell with pathable-app-shell (sidebar nav desktop / bottom nav mobile), pathable-dashboard-header, pathable-kpi-grid (4 KPI cards), pathable-activity-list, pathable-schedule-item (3 items), responsive pathable-table with pathable-table-modifiers, positioned pathable-toast example
- [ ] T011 [US3] Implement `Empty` variant — same shell but with pathable-empty-state in main content regions
- [ ] T012 [US3] Implement mobile variant `Mobile` — app shell switches to bottom navigation, table scrolls horizontally, sections stack vertically

---

## Phase 6: User Story 4 - Structured Workflow Composition (Priority: P2)

**Goal**: Create a Storybook story showing a guided multi-step process with participant/record context, step indicator, objective/prompt, form entry area, save status, validation summary, navigation actions, and completed state.

**Independent Test**: Render the StructuredWorkflow story at desktop and mobile viewports; confirm the in-progress state shows form inputs and step indicator, the completed state shows success confirmation, and navigation between steps is visually represented.

### Implementation for User Story 4

- [ ] T013 [P] [US4] Create StructuredWorkflow.stories.js with story metadata (title, tags, parameters, documentation links) in `packages/styles/src/stories/marketing-patterns/StructuredWorkflow.stories.js`
- [ ] T014 [US4] Implement `InProgress` variant — compose pathable-record-header for context, pathable-step-indicator (3-4 steps with current step highlighted), pathable-workflow-panel with objective text, form controls (pathable-input, pathable-textarea, pathable-select), pathable-save-status indicator, pathable-summary-box for validation errors, and previous/next/complete buttons
- [ ] T015 [US4] Implement `Completed` variant — same structure but step indicator shows all steps complete, panel shows success confirmation message, and optional next-actions buttons
- [ ] T016 [US4] Implement mobile variant `Mobile` — step indicator wraps or collapses, form controls go full-width, validation summary stacks

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility verification, documentation, and quality checks that apply across all archetypes.

- [ ] T017 [P] Add archetype selection documentation to quickstart.md — ensure each story file's `parameters.docs.description.story` links to the relevant component and pattern documentation
- [ ] T018 [P] Review each story at 200% browser zoom — confirm no content overlap or truncation; fix any layout issues found
- [ ] T019 [P] Review each story with `prefers-reduced-motion` enabled — confirm decorative animations are suppressed
- [ ] T020 [P] Review each story in forced-colors/high-contrast mode — confirm content is readable and interactive elements distinguishable; document limitations if found
- [ ] T021 [P] Verify keyboard focus order follows visual reading order for each story — ensure fixed headers/sidebars/toasts do not obscure focused content
- [ ] T022 Run automated Storybook accessibility checks on all four archetype stories — confirm zero violations reported

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — all infrastructure already exists
- **Foundational (Phase 2)**: No dependencies — all patterns already exist
- **User Stories (Phase 3-6)**: Each story is fully independent — no dependencies between them
- **Polish (Phase 7)**: Depends on all user stories being complete (T017-T021 can start after Phase 3; T022 requires all stories)

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories — can start immediately
- **User Story 2 (P1)**: No dependencies on other stories — can start immediately
- **User Story 3 (P2)**: No dependencies on other stories — can start immediately
- **User Story 4 (P2)**: No dependencies on other stories — can start immediately

### Within Each User Story

- Story metadata (title, tags, parameters) before variant implementations
- Core implementation (desktop/populated) before mobile variant
- Story complete before moving to next

### Parallel Opportunities

- **T001, T004, T008, T013**: All four story file creation tasks can run in parallel
- **T002-T003, T005-T007, T009-T012, T014-T016**: Each story's implementation tasks are sequential within the story but fully parallel across stories
- **T017-T021**: All polish tasks can run in parallel once their respective stories exist
- **T022**: Must run last after all stories and polish fixes are complete

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1 (Marketing Landing Page)
2. **STOP and VALIDATE**: Render MarketingLandingPage in Storybook, verify all sections, pass a11y checks
3. Deploy/demo if ready

### Incremental Delivery

1. Add Marketing Landing Page → Test independently → Deploy/Demo (MVP!)
2. Add Resource Directory → Test independently → Deploy/Demo
3. Add Operational Dashboard → Test independently → Deploy/Demo
4. Add Structured Workflow → Test independently → Deploy/Demo
5. Run cross-cutting accessibility polish across all four → Finalize
6. Each archetype adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Developer A: User Story 1 (Marketing Landing Page) — T001, T002, T003
2. Developer B: User Story 2 (Resource Directory) — T004, T005, T006, T007
3. Developer C: User Story 3 (Operational Dashboard) — T008, T009, T010, T011, T012
4. Developer D: User Story 4 (Structured Workflow) — T013, T014, T015, T016
5. Polish team: T017-T022 (after all stories exist)

All four stories can be developed entirely in parallel since they share no files or dependencies.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- All stories use CSF 3 format with string-template `render` functions — see existing stories like `packages/styles/src/stories/marketing-patterns/DecorativeBackground.stories.js` for reference
- Use `placehold.co` for placeholder images (existing project convention)
- Use synthetic content only — no real personal or sensitive information
- No raw hex colors, arbitrary spacing, or one-off inline CSS values
- Commit after completing each story to allow independent deployment