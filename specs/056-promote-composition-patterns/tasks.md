# Tasks: Promote Repeated Composition Patterns into Higher-Level Primitives

**Input**: Design documents from `/specs/056-promote-composition-patterns/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Unit tests are required by the feature specification (FR-012). Storybook interaction tests for a11y (FR-018).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format: `[ID] [P?] [Story] Description`](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup (Verify Existing Infrastructure)](#phase-1-setup-verify-existing-infrastructure)
- [Phase 2: Foundational (Shared Export Registration)](#phase-2-foundational-shared-export-registration)
- [Phase 3: User Story 1 — CardGrid (Priority: P1) 🎯 MVP](#phase-3-user-story-1--cardgrid-priority-p1--mvp)
- [Phase 4: User Story 2 — Page (Priority: P2)](#phase-4-user-story-2--page-priority-p2)
- [Phase 5: User Story 3 — SidebarLayout (Priority: P3)](#phase-5-user-story-3--sidebarlayout-priority-p3)
- [Phase 6: User Story 4 — FormStack (Priority: P4)](#phase-6-user-story-4--formstack-priority-p4)
- [Phase 7: User Story 5 — SplitLayout (Priority: P5)](#phase-7-user-story-5--splitlayout-priority-p5)
- [Phase 8: Polish & Cross-Cutting Concerns](#phase-8-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 1 (CardGrid)](#parallel-example-user-story-1-cardgrid)
- [Implementation Strategy](#implementation-strategy)
- [Notes](#notes)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **React package source**: `packages/react/src/components/{ComponentName}/`
- **Storybook stories**: `packages/react/src/stories/components/{ComponentName}/`
- **Public exports**: `packages/react/src/index.ts`
- All paths are relative to the repository root

---

## Phase 1: Setup (Verify Existing Infrastructure)

**Purpose**: Confirm that all required SCSS contracts and existing primitives are available before building promoted components

- [x] T001 Verify all required SCSS contracts exist: `pathable-cluster`, `pathable-surface`, `pathable-sidebar-layout`, `pathable-split`, `pathable-stack`, `pathable-card-grid`, `pathable-sticky-panel`, `pathable-container`, `pathable-form-group` in `packages/styles/src/pathable-component-wrappers/`
- [x] T002 Verify existing layout primitives (`Container`, `Stack`, `Inline`, `Cluster`, `Surface`) are exported and importable from `packages/react/src/index.ts`
- [x] T003 Verify internal resolvers (`mergeClasses`, sizing, spacing, alignment) are available in `packages/react/src/internal/resolvers/`
- [x] T004 [P] Run `pnpm --filter @pathable/react build` and `pnpm --filter @pathable/react test:unit` to confirm existing projects pass clean

**Checkpoint**: Infrastructure ready — all SCSS contracts and primitives confirmed. Proceed to Foundational phase.

---

## Phase 2: Foundational (Shared Export Registration)

**Purpose**: Prepare the shared public API barrel file for new component exports

**⚠️ CRITICAL**: The export barrel must follow the existing pattern in `packages/react/src/index.ts` before components can be consumed publicly.

- [x] T005 Review existing export pattern in `packages/react/src/index.ts` (component + type export pairs, `.js` extension imports, alphabetical ordering) for reference

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 — CardGrid (Priority: P1) 🎯 MVP

**Goal**: A developer can render a responsive card grid using `CardGrid` with cluster (flex-wrap) or auto-fit (CSS Grid) mode, eliminating manual `Cluster` + `Surface` boilerplate.

**Independent Test**: Render `CardGrid` with child cards in both variants, verify `pathable-cluster`/`pathable-card-grid` and `pathable-surface` class presence, confirm responsive wrapping at narrow viewport in Storybook.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create `CardGrid` component in `packages/react/src/components/CardGrid/CardGrid.tsx` with `variant` (`cluster` | `auto-fit`), `gap`, `as`, `className`, `children` props per `contracts/component-api.md`
- [x] T007 [P] [US1] Create `CardGrid` unit tests in `packages/react/src/components/CardGrid/__tests__/CardGrid.test.tsx` covering: default render, cluster mode classes, auto-fit mode classes, gap modifiers (both scales), empty children, custom className, `as` polymorphic, SSR parity
- [x] T008 [US1] Create `CardGrid` Storybook stories in `packages/react/src/stories/components/CardGrid/CardGrid.stories.tsx` (CSF 3 format) with: Playground, ClusterMode, AutoFitMode, NarrowViewport, Composition (cluster of Surface cards), migration guide docs

**Checkpoint**: `CardGrid` component is fully functional, tested, and documented. Can be independently validated.

---

## Phase 4: User Story 2 — Page (Priority: P2)

**Goal**: A developer can scaffold a full page layout using `Page` which composes `Container` for width constraint and `Stack` for vertical spacing, eliminating manual `Container` + `Stack` boilerplate.

**Independent Test**: Render `Page` with child sections, verify `pathable-container` width constraint and `pathable-stack` vertical spacing. Confirm `<main>` landmark and responsive behavior.

### Implementation for User Story 2

- [x] T009 [P] [US2] Create `Page` component in `packages/react/src/components/Page/Page.tsx` composing `Container` + `Stack` with `size`, `gap`, `as` (default `"main"`), `className`, `children` props per `contracts/component-api.md`
- [x] T010 [P] [US2] Create `Page` unit tests in `packages/react/src/components/Page/__tests__/Page.test.tsx` covering: default render with `<main>` + `pathable-container` + `pathable-stack`, size variants (`standard`/`wide`/`full`), gap modifiers, single child, empty children, custom className, `as` polymorphic, SSR parity
- [x] T011 [US2] Create `Page` Storybook stories in `packages/react/src/stories/components/Page/Page.stories.tsx` (CSF 3 format) with: Playground, StandardWidth, WideWidth, FullWidth, NarrowViewport, Composition (page with header + sections), migration guide docs

**Checkpoint**: `Page` component is fully functional, tested, and documented. US1 + US2 both work independently.

---

## Phase 5: User Story 3 — SidebarLayout (Priority: P3)

**Goal**: A developer can create a two-column sidebar + main content layout using `SidebarLayout` with typed props for ratio, sidebar position, and sticky behavior, replacing raw `pathable-sidebar-layout` CSS classes on `<div>` elements.

**Independent Test**: Render `SidebarLayout` with main and sidebar children, verify `<main>` + `<aside>` landmarks, `pathable-sidebar-layout` ratio classes, sticky behavior, and responsive collapse at 1023px.

### Implementation for User Story 3

- [x] T012 [P] [US3] Create `SidebarLayout` component in `packages/react/src/components/SidebarLayout/SidebarLayout.tsx` with `ratio`, `sidebarFirst`, `sidebarSticky`, `className`, `children` props per `contracts/component-api.md`
- [x] T013 [P] [US3] Create `SidebarLayout` unit tests in `packages/react/src/components/SidebarLayout/__tests__/SidebarLayout.test.tsx` covering: default render with `<main>` + `<aside>`, ratio modifiers (`1-1`/`2-1`/`3-1`/`4-1`), `sidebarFirst` DOM order, sticky panel wrapper, empty sidebar fallback, custom className, SSR parity
- [x] T014 [US3] Create `SidebarLayout` Storybook stories in `packages/react/src/stories/components/SidebarLayout/SidebarLayout.stories.tsx` (CSF 3 format) with: Playground, Ratio2to1, Ratio1to1, SidebarFirst, StickySidebar, NarrowViewport (1023px collapse), Composition (settings page layout), a11y interaction test for landmarks, migration guide docs

**Checkpoint**: `SidebarLayout` component is fully functional, tested, and documented. US1+US2+US3 all work independently.

---

## Phase 6: User Story 4 — FormStack (Priority: P4)

**Goal**: A developer can build a vertically-stacked form using `FormStack` with consistent spacing, an optional max-width constraint, and `<form>` semantics by default.

**Independent Test**: Render `FormStack` with `FormGroup` children, verify `<form>` element, `pathable-stack` classes with gap, and max-width constraint.

### Implementation for User Story 4

- [x] T015 [P] [US4] Create `FormStack` component in `packages/react/src/components/FormStack/FormStack.tsx` composing `Stack` with `gap`, `maxWidth`, `as` (default `"form"`), `className`, `children` props per `contracts/component-api.md`
- [x] T016 [P] [US4] Create `FormStack` unit tests in `packages/react/src/components/FormStack/__tests__/FormStack.test.tsx` covering: default render as `<form>` with `pathable-stack`, gap modifiers, maxWidth variants (`tablet`/`content`/undefined), non-FormGroup children, empty form, custom className, `as` polymorphic, SSR parity
- [x] T017 [US4] Create `FormStack` Storybook stories in `packages/react/src/stories/components/FormStack/FormStack.stories.tsx` (CSF 3 format) with: Playground, WithFormGroups, MaxWidthTablet, MaxWidthContent, FullWidth, NarrowViewport, Composition (contact form), migration guide docs

**Checkpoint**: `FormStack` component is fully functional, tested, and documented. US1-US4 all work independently.

---

## Phase 7: User Story 5 — SplitLayout (Priority: P5)

**Goal**: A developer can create a two-column side-by-side layout using `SplitLayout` with configurable ratios, alignment, and responsive stacking at narrow viewports.

**Independent Test**: Render `SplitLayout` with two child panels, verify `pathable-split` ratio and align classes, and confirm responsive collapse at 1023px.

### Implementation for User Story 5

- [x] T018 [P] [US5] Create `SplitLayout` component in `packages/react/src/components/SplitLayout/SplitLayout.tsx` with `ratio`, `align`, `as`, `className`, `children` props per `contracts/component-api.md`
- [x] T019 [P] [US5] Create `SplitLayout` unit tests in `packages/react/src/components/SplitLayout/__tests__/SplitLayout.test.tsx` covering: default render with `pathable-split`, ratio modifiers (`1-1`/`1-2`/`2-1`/`1-3`), align variants (`center`/`start`/`end`/`stretch`), single child, empty children, custom className, `as` polymorphic, SSR parity
- [x] T020 [US5] Create `SplitLayout` Storybook stories in `packages/react/src/stories/components/SplitLayout/SplitLayout.stories.tsx` (CSF 3 format) with: Playground, Ratio2to1, AlignStretch, AlignStart, NarrowViewport (1023px collapse), Composition (hero section), migration guide docs

**Checkpoint**: All five user story components are fully functional, tested, and documented.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Register exports, run CI validation, and verify all cross-cutting requirements

- [x] T021 Register `CardGrid`, `Page`, `SidebarLayout`, `FormStack`, `SplitLayout` exports (component + type) in `packages/react/src/index.ts` following alphabetical ordering and existing `.js` import convention
- [x] T022 Run `pnpm --filter @pathable/react typecheck` and fix any type errors
- [x] T023 [P] Run `pnpm lint` and `pnpm format --check` across all new files; fix any lint/format issues
- [x] T024 [P] Run `pnpm --filter @pathable/react test:unit` and verify all new + existing tests pass
- [ ] T025 Run `pnpm --filter @pathable/react storybook:build` (or equivalent) to verify stories compile without errors
- [ ] T026 [P] Run automated accessibility validation on Storybook stories for all five primitives; fix any violations
- [x] T027 [P] Verify no new SCSS files were created via `git diff --stat origin/main... -- packages/styles/src/pathable-component-wrappers/` (SC-007)
- [x] T028 Run full CI gates per `quickstart.md`: lint, format, typecheck, build, test:unit

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS user stories only for the final export step (T021)
- **User Stories (Phases 3–7)**: All five user stories are **fully independent** — they can proceed in any order
  - Each story creates its own component, test, and story files with zero cross-story dependencies
  - Only the export registration (T021 in Polish phase) is shared
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (CardGrid, P1)**: Independent — depends only on existing primitives (`Cluster`, `Surface`)
- **User Story 2 (Page, P2)**: Independent — depends only on existing primitives (`Container`, `Stack`)
- **User Story 3 (SidebarLayout, P3)**: Independent — relies on `pathable-sidebar-layout` SCSS classes directly
- **User Story 4 (FormStack, P4)**: Independent — depends only on existing primitives (`Stack`)
- **User Story 5 (SplitLayout, P5)**: Independent — relies on `pathable-split` SCSS classes directly

### Within Each User Story

- Component file (`.tsx`) and test file (`.test.tsx`) can be created in parallel (different files)
- Storybook stories depend on the component being functional
- All three files must exist before the story's checkpoint

### Parallel Opportunities

- **Phase 1**: T001, T002, T003, T004 can all run in parallel (verification tasks)
- **Phases 3–7**: All five user stories can be implemented in parallel by different developers
- **Within each story**: Component and test files marked [P] can be created in parallel
- **Phase 8**: T023, T024, T026, T027 can run in parallel (different validation commands)

---

## Parallel Example: User Story 1 (CardGrid)

```bash
# Launch component and tests together:
Task: "Create CardGrid component in packages/react/src/components/CardGrid/CardGrid.tsx"
Task: "Create CardGrid unit tests in packages/react/src/components/CardGrid/__tests__/CardGrid.test.tsx"

# After component passes tests, create stories:
Task: "Create CardGrid Storybook stories in packages/react/src/stories/components/CardGrid/CardGrid.stories.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005)
3. Complete Phase 3: CardGrid (T006–T008)
4. Register CardGrid export (T021 from Phase 8)
5. **STOP and VALIDATE**: Run `pnpm --filter @pathable/react test:unit`, verify CardGrid stories in Storybook
6. CardGrid is independently deployable

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add CardGrid (US1) → Test independently → MVP ready
3. Add Page (US2) → Test independently → Two primitives live
4. Add SidebarLayout (US3) → Test independently → Three primitives live
5. Add FormStack (US4) → Test independently → Four primitives live
6. Add SplitLayout (US5) → Test independently → All five primitives live
7. Polish → Full CI validation → Feature complete

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done, each developer takes one user story:
   - Developer A: CardGrid (US1)
   - Developer B: Page (US2)
   - Developer C: SidebarLayout (US3)
   - Developer D: FormStack (US4)
   - Developer E: SplitLayout (US5)
3. After all stories complete, one developer handles Phase 8 (exports + CI)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable — no component imports another promoted primitive
- All five primitives compose only existing lower-level primitives (`Container`, `Stack`, `Cluster`, `Surface`) or apply `pathable-*` CSS classes directly
- No new SCSS contracts are introduced — every primitive uses existing `packages/styles` classes
- Gap scales are NOT uniform: `stack` (8/16/24/32), `card-grid` (16/24/32), `cluster` (4/8/16/24) — each component maps its own gap type per `research.md` Decision 2
- `SidebarLayout` and `SplitLayout` use CSS Grid SCSS contracts (`pathable-sidebar-layout`, `pathable-split`) directly since no typed React `Grid` primitive exists yet
- Commit after each task or logical group
- Stop at any checkpoint to validate the current story independently