# Tasks: React Dashboard Overview Composition Page

**Input**: Design documents from `/specs/040-react-dashboard-overview/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

This feature adds a single **pattern/composition story file** to the React
Storybook. Because the artifact is one new `.stories.tsx` file composed from
existing primitives, the "user story" phases map to the three deterministic
states the story must expose (`Populated`, `Loading`, `Empty`) plus a mobile
view, rather than to distinct backend modules. Interaction coverage (`play`
tests) is required by the Storybook standard and spec FR-008, so story-level
test tasks ARE included.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Foundational: Representative Fixtures](#foundational-representative-fixtures)
- [Phase 2: User Story 1 - Populated Overview (P1)](#phase-2-user-story-1---populated-overview-p1)
- [Phase 3: User Story 2 - Loading State (P2)](#phase-3-user-story-2---loading-state-p2)
- [Phase 4: User Story 3 - Empty State (P3)](#phase-4-user-story-3---empty-state-p3)
- [Phase 5: Mobile / Narrow Viewport](#phase-5-mobile--narrow-viewport)
- [Phase 6: Polish & Cross-Cutting Concerns](#phase-6-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 1](#parallel-example-user-story-1)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- The new story file lives at `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx`.
- Fixtures content is defined inline within the story file (no new source modules).
- Existing stories for reference: `packages/react/src/stories/dashboard/DashboardHeader.stories.tsx`, `packages/react/src/stories/dashboard/ActivityList.stories.tsx`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the React Storybook and packages build, and lock the reference contract.

- [X] T001 Confirm `@pathableai/styles` build is current: run `pnpm --filter @pathableai/styles build` and verify `packages/styles/dist/styles.css` exists
- [X] T002 [P] Confirm the React package builds: run `pnpm --filter @pathableai/react build`
- [X] T003 [P] Review the styles `Dashboard Overview` reference (`packages/styles/src/stories/dashboard/DashboardOverview.stories.ts`) and note the exact classes/labels for `Populated`, `Loading`, and `Empty`

**Checkpoint**: Foundation ready - implementation can begin.

---

## Foundational: Representative Fixtures

**Purpose**: Deterministic fixture data (KPI cards, activity items) used by the story states. These live inline in the story file; no new modules.

- [X] T004 Define an inline `kpiCard` helper and populated card list in `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx` (values/labels/trends: Active Participants 1,247 ↑, Placement Rate 86% ↑, New Enrollments 342 ↓, Partner Organizations 28 –) using `.pathable-kpi-grid` / `.pathable-kpi-card` / `__value` / `__label` / `__trend` with `data-trend` and visible `.pathable-kpi-card__trend-label`
- [X] T005 [P] Define deterministic activity fixture items (completed + in-progress with `statusLabel`, context, date, owner) matching the styles `Populated` activity list in `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx`

**Checkpoint**: Fixture data ready for the states.

---

## Phase 2: User Story 1 - Populated Overview (P1) 🎯 MVP

**Goal**: Render the composed dashboard overview page: header + KPI grid + grouped activity list, matching the styles `Dashboard Overview` `Populated` state.

**Independent Test**: Open the React Storybook → `Dashboard/Dashboard Overview` → `Populated`. Verify the header (`h1` "Employment Pathways", breadcrumb, "Active · Q4 2026", Export + Add Program buttons, description), the 4 KPI cards, and the grouped activity list render with the same layout as the styles story.

### Interaction test for User Story 1 (required: spec FR-008)

- [X] T006 [US1] Add a `play` function on the `Populated` story that verifies an action button is keyboard-focusable and activates on Enter/Space (the `Add Program` `Button`), using `getByRole` and `fn()`, in `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx`

### Implementation for User Story 1

- [X] T007 [US1] Add story `meta` (title `Dashboard/Dashboard Overview`, `tags: ['autodocs']`, docs description explaining the pattern-story intent) in `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx`
- [X] T008 [US1] Add a `Populated` story composing `DashboardHeader` (breadcrumb + actions via `Button`), the KPI grid from T004, and the grouped `ActivityList` from T005, in `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx` (depends on T004, T005, T007)

**Checkpoint**: `Populated` renders correctly and is independently testable.

---

## Phase 3: User Story 2 - Loading State (P2)

**Goal**: Render the composed page in a loading presentation (header with "Loading dashboard data..." description + placeholder loading KPI cards).

**Independent test**: Story `Loading` renders the header title "Employment Pathways" with loading copy and 3 `.pathable-kpi-card--loading` cards with `aria-hidden` placeholders and no text values.

### Implementation for User Story 2

- [X] T009 [US2] Add a `Loading` story in `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx` composing `DashboardHeader` (title + `description="Loading dashboard data..."`) and 3 `.pathable-kpi-card--loading` cards (extend the T004 helper with a `loading` flag)
- [X] T010 [US2] Verify the loading KPI cards have `aria-hidden="true"` and no accessible text, in `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx`

**Checkpoint**: `Loading` is independently testable.

---

## Phase 4: User Story 3 - Empty State (P3)

**Goal**: Render the empty overview (header with "no data" description + action, unavailable KPI values, and an empty activity table).

**Independent test**: Story `Empty`. It shows the "No program data available yet." description + `Add Program` action, unavailable `N/A` KPI cards, and a `pathable-table--empty` table with "No recent activity."

### Implementation for User Story 3

- [X] T011 [US3] Add an `Empty` story in `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx` composing `DashboardHeader` (title + "No program data available yet." + a `Button` action), `pathable-kpi-card--unavailable` cards, and a `Table` with an empty message, in the same story file
- [X] T012 [US3] Ensure the `Empty` story has exactly one `h1` and native action button semantics, in `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx`

**Checkpoint**: `Empty` is independently testable.

---

## Phase 5: Mobile / Narrow Viewport

**Goal**: Verify the composed page wraps/stacks at a narrow viewport without horizontal overflow.

- [X] T013 Add a `Mobile` story (viewport `mobile1`) composing the `Populated` content in `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx`
- [X] T014 [P] Run `pnpm --filter @pathableai/react typecheck` and `pnpm --filter @pathableai/react lint` to verify the story file is type-safe and lint-clean

**Checkpoint**: Responsive behavior verified.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across the whole story file and CI gates.

- [X] T015 Run `pnpm test:storybook-react` (builds styles + react, runs test-runner + a11y) and fix any findings in `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx`
- [X] T016 [P] Confirm story determinism: no dates, random values, or network calls anywhere in `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx`
- [X] T017 [P] Verify no `packages/styles` changes, no new React component/export, and no new dependencies were introduced
- [X] T018 [P] Run `pnpm check:format` to ensure the story file is prettier-formatted

---

## Dependencies & Execution Order

### Task Dependencies

- **Phase 1 (T001–T003)**: No dependencies; verifies buildability of prerequisites.
- **Foundational (T004–T005)**: Fixture data; T004 and T005 are `[P]`-parallel. Must complete before `Populated`.
- **User Story 1 (T006–T008)**: T008 depends on T004, T005, T007.
- **User Story 2 (T009–T010)**: Depends on T004 fixtures; independent of US1.
- **User Story 3 (T011–T012)**: Independent.
- **Mobile (T013–T014)**: Depends on US1 fixtures/structure.
- **Polish (T015–T018)**: Depends on all previous.

### Within Each Story

- Fixtures → state story → state semantics/a11y verification.

### Parallel Opportunities

- T002 || T003 (Phase 1)
- T004 || T005 (Foundational fixtures)
- T008 depends on T004/T005/T007
- After Phase 1 + Foundational complete, implement US2/US3/US5 in parallel if capacity allows (different story exports, same file — see atomicity note)
- T016, T017, T018 (Polish) are `[P]`

---

## Parallel Example: User Story 1

```bash
# Parallel primitives (foundational fixtures):
Task: "T004 Define populated KPI card list (grid + trend) in DashboardOverview.stories.tsx"
Task: "T005 Define activity fixture items in DashboardOverview.stories.tsx"

# Assemble:
Task: "T007 Add story meta (title/tags/docs) in DashboardOverview.stories.tsx"
Task: "T006 Add play interaction test (keyboard focus + Enter/Space) on Populated"
Task: "T008 Compose Populated story (header + KPI + activity) in DashboardOverview.stories.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup): builds clean.
2. Complete Foundational (fixtures): T004, T005.
3. Complete User Story 1: T007 (meta), T008 (Populated), T006 (interaction).
4. **STOP and VALIDATE**: `Populated` + keyboard test, run `test:storybook` on the single story.
5. Return the single `Populated` story into the React storybook as the MVP.

### Incremental Delivery (all states)

1. Setup + Foundational → foundation ready.
2. Add User Story 1 (`Populated`) → independent test → demo.
3. Add User Story 2 (`Loading`) → independent test.
4. Add User Story 3 (`Empty`) → independent test.
5. Add `Mobile` → responsive validation.
6. Polish (a11y/format/gates) → final.

### Parallel Team Strategy (if staffed)

1. Team: Phase 1 Setup + Foundational (T004/T005).
2. Once fixtures ready:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Integrate: assemble the single story file; one author merges all states to avoid conflicts.

### Implementation / atomicity note

Because all states live in the SAME `DashboardOverview.stories.tsx` file, the
tasks are split by state for clarity/responsibility, but the file must be
assembled atomically at the end (Polish). This avoids disk-write conflicts
during parallel development.

---

## Notes

- **Purpose**: Verify the React Storybook mirrors the styles `Dashboard Overview` (sections, headers, labels, layout).
- **[P] tasks** touch a different artifact; where every state lives in the same file, `[P]` is restricted to genuinely fully independent work to avoid same-file write conflicts.
- **Story labels** map as: T006/T007/T008 [US1], T009/T010 [US2], T011/T012 [US3]. Setup (T001–T005) and Polish (T015–T018) carry no story label.
- Commit after each task or logical group.
- All tasks follow the checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`.