# Tasks: Grid Layout Primitive

**Input**: Design documents from `specs/050-grid-primitive/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED per the feature specification (FR-021 through FR-027).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational — SCSS Contract (Blocking Prerequisites)](#phase-2-foundational--scss-contract-blocking-prerequisites)
- [Phase 3: User Story 1 — Multi-Column Grid (Priority: P1) 🎯 MVP](#phase-3-user-story-1--multi-column-grid-priority-p1--mvp)
- [Phase 4: User Story 2 — Grid Spacing (Priority: P1)](#phase-4-user-story-2--grid-spacing-priority-p1)
- [Phase 5: User Story 3 — Grid Alignment (Priority: P2)](#phase-5-user-story-3--grid-alignment-priority-p2)
- [Phase 6: User Story 4 — Sizing & Spacing Props (Priority: P2)](#phase-6-user-story-4--sizing--spacing-props-priority-p2)
- [Phase 7: User Story 5 — Polymorphic as & Ref (Priority: P3)](#phase-7-user-story-5--polymorphic-as--ref-priority-p3)
- [Phase 8: Storybook Stories](#phase-8-storybook-stories)
- [Phase 9: Polish & Cross-Cutting Concerns](#phase-9-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 1 & 2](#parallel-example-user-story-1--2)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **SCSS source**: `packages/styles/src/pathable-component-wrappers/`
- **React components**: `packages/react/src/components/Grid/`
- **React tests**: `packages/react/src/components/Grid/__tests__/`
- **React exports**: `packages/react/src/index.ts`
- **Storybook stories**: `packages/react/src/stories/components/Grid/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure and verify prerequisites

- [ ] T001 Create component directory structure: `packages/react/src/components/Grid/` and `packages/react/src/components/Grid/__tests__/`
- [ ] T002 [P] Create Storybook directory structure: `packages/react/src/stories/components/Grid/`

---

## Phase 2: Foundational — SCSS Contract (Blocking Prerequisites)

**Purpose**: Create the `pathable-grid` SCSS contract in `packages/styles` before any React wrapper work begins

**⚠️ CRITICAL**: No React component work can begin until the SCSS contract exists per Constitution Principle IV

- [ ] T003 Create `pathable-grid.scss` in `packages/styles/src/pathable-component-wrappers/pathable-grid.scss` with base `.pathable-grid` class (`display: grid`), column modifier classes (`--cols-2`, `--cols-3`, `--cols-4` with `grid-template-columns: repeat(n, 1fr)`), gap modifier classes (`--gap-sm/md/lg/xl` using CSS custom property `--pathable-grid-gap` with `var(--space-8/16/24/32)`), column-gap modifier classes (`--column-gap-sm/md/lg/xl` using `--pathable-grid-column-gap`), row-gap modifier classes (`--row-gap-sm/md/lg/xl` using `--pathable-grid-row-gap`), and alignment modifier classes (`--align-start/center/end/stretch/baseline` using `--pathable-grid-align`) per research.md Decision 1 and Decision 4
- [ ] T004 Add `@forward 'pathable-grid'` to `packages/styles/src/pathable-component-wrappers/pathable-layout-composition.scss` per research.md Decision 9
- [ ] T005 Build and verify SCSS output: run `pnpm --filter @pathable/styles build` and confirm `packages/styles/dist/pathable-component-wrappers/pathable-grid.css` contains all modifier classes

**Checkpoint**: SCSS contract ready — React component implementation can now begin

---

## Phase 3: User Story 1 — Multi-Column Grid (Priority: P1) 🎯 MVP

**Goal**: Developers can arrange child elements into 2, 3, or 4 equal-width CSS Grid columns using a `cols` prop

**Independent Test**: Render `<Grid cols={3}>` with three child items and verify the output is a CSS Grid container with `pathable-grid--cols-3` class and immediate children participate in the grid

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T006 [P] [US1] Test default render (no props) renders single `<div>` with `pathable-grid` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T007 [P] [US1] Test `cols={2}` applies `pathable-grid--cols-2` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T008 [P] [US1] Test `cols={3}` applies `pathable-grid--cols-3` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T009 [P] [US1] Test `cols={4}` applies `pathable-grid--cols-4` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T010 [P] [US1] Test no `cols` produces only base class (no column modifier) in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T011 [P] [US1] Test SSR output matches client output for `cols={2}` in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`

### Implementation for User Story 1

- [ ] T012 [US1] Implement `Grid` component in `packages/react/src/components/Grid/Grid.tsx` with `forwardRef<HTMLElement, GridProps>`, default `<div>` rendering, base `pathable-grid` class, `cols` prop using local `GRID_COLS_CLASS` record (`{ 2: 'pathable-grid--cols-2', 3: 'pathable-grid--cols-3', 4: 'pathable-grid--cols-4' }`), and `mergeClasses()` for class composition following the Stack component pattern
- [ ] T013 [US1] Add `Grid` export and type exports (`GridProps`, `GridCols`) to `packages/react/src/index.ts` following the established pattern (see Stack/Inline/Cluster barrel entries)

**Checkpoint**: Grid can render with columns — basic multi-column layouts work

---

## Phase 4: User Story 2 — Grid Spacing (Priority: P1)

**Goal**: Developers control gap spacing between grid cells using a `gap` prop with design-system tokens, plus optional `columnGap` and `rowGap` for independent axis control

**Independent Test**: Render `<Grid cols={2} gap="lg">` and verify the gap CSS class matches the design system's large gap token

### Tests for User Story 2 ⚠️

- [ ] T014 [P] [US2] Test `gap="sm"` applies `pathable-grid--gap-sm` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T015 [P] [US2] Test `gap="md"` applies `pathable-grid--gap-md` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T016 [P] [US2] Test `gap="lg"` applies `pathable-grid--gap-lg` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T017 [P] [US2] Test `gap="xl"` applies `pathable-grid--gap-xl` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T018 [P] [US2] Test no `gap` produces only base class (no gap modifier) in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T019 [P] [US2] Test `columnGap="lg"` applies `pathable-grid--column-gap-lg` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T020 [P] [US2] Test `rowGap="sm"` applies `pathable-grid--row-gap-sm` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T021 [P] [US2] Test combined `gap="md"` with `columnGap="lg"` and `rowGap="sm"` applies all three classes in correct order in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`

### Implementation for User Story 2

- [ ] T022 [US2] Add `gap` prop, `GridGap` type (`'sm' | 'md' | 'lg' | 'xl'`), `GRID_GAP_CLASS` record, `columnGap` and `rowGap` props with `GRID_COLUMN_GAP_CLASS` and `GRID_ROW_GAP_CLASS` records to `packages/react/src/components/Grid/Grid.tsx` per data-model.md gap mapping tables
- [ ] T023 [US2] Add gap/columnGap/rowGap class resolution to the `mergeClasses()` call in `Grid.tsx` at positions 3-5 per research.md Decision 12 class merge order

**Checkpoint**: Grid spacing works — gap, columnGap, and rowGap all map to correct SCSS classes

---

## Phase 5: User Story 3 — Grid Alignment (Priority: P2)

**Goal**: Developers control vertical alignment of grid items (start, center, end, stretch, baseline) using an `align` prop

**Independent Test**: Render `<Grid cols={3} align="center">` with items of different heights and verify all items are vertically centered within their row

### Tests for User Story 3 ⚠️

- [ ] T024 [P] [US3] Test `align="start"` applies `pathable-grid--align-start` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T025 [P] [US3] Test `align="center"` applies `pathable-grid--align-center` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T026 [P] [US3] Test `align="end"` applies `pathable-grid--align-end` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T027 [P] [US3] Test `align="stretch"` applies `pathable-grid--align-stretch` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T028 [P] [US3] Test `align="baseline"` applies `pathable-grid--align-baseline` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T029 [P] [US3] Test no `align` produces no alignment modifier class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`

### Implementation for User Story 3

- [ ] T030 [US3] Add `align` prop using `AlignItems` type from `internal/resolvers/types.js` and `GRID_ALIGN_CLASS` record (`{ start: 'pathable-grid--align-start', center: 'pathable-grid--align-center', end: 'pathable-grid--align-end', stretch: 'pathable-grid--align-stretch', baseline: 'pathable-grid--align-baseline' }`) to `packages/react/src/components/Grid/Grid.tsx` per research.md Decision 3 and Decision 8
- [ ] T031 [US3] Add align class resolution to `mergeClasses()` at position 6 per class merge order

**Checkpoint**: Grid alignment works — all five align values map to correct SCSS modifier classes

---

## Phase 6: User Story 4 — Sizing & Spacing Props (Priority: P2)

**Goal**: Developers apply external spacing (margin) and sizing (width, maxWidth) to the Grid container using shared capability props

**Independent Test**: Render `<Grid cols={2} width="full" marginX="auto">` and verify the correct utility classes are applied

### Tests for User Story 4 ⚠️

- [ ] T032 [P] [US4] Test `width="full"` applies `pathable-width-full` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T033 [P] [US4] Test `maxWidth="desktop"` applies `pathable-maxw-desktop` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T034 [P] [US4] Test `margin="4"` applies `pathable-margin-4` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T035 [P] [US4] Test `marginX="auto"` applies `pathable-margin-x-auto` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T036 [P] [US4] Test `marginY="2"` applies `pathable-margin-y-2` class in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T037 [P] [US4] Test `marginTop="0"` and `marginBottom="5"` apply correct margin classes in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`

### Implementation for User Story 4

- [ ] T038 [US4] Add `SizingProps` (`width`, `maxWidth`) and `SpacingProps` (`margin`, `marginX`, `marginY`, `marginTop`, `marginBottom`) to `GridProps` interface via intersection with `Omit<SizingProps & SpacingProps, 'padding' | 'paddingX' | 'paddingY'>` in `packages/react/src/components/Grid/Grid.tsx` per research.md Decision 11
- [ ] T039 [US4] Add `padding`, `paddingX`, `paddingY` as `never` with `@deprecated` JSDoc in `GridProps` to prevent their use in `packages/react/src/components/Grid/Grid.tsx`
- [ ] T040 [US4] Add sizing and spacing resolver calls (`widthClass`, `maxWidthClass`, `marginAllClass`, `marginXClass`, `marginYClass`, `marginTopClass`, `marginBottomClass`) to `mergeClasses()` at positions 7-8 per class merge order in `packages/react/src/components/Grid/Grid.tsx`
- [ ] T041 [US4] Add imports for sizing and spacing resolvers from `../../internal/resolvers/sizing.js` and `../../internal/resolvers/spacing.js` to `packages/react/src/components/Grid/Grid.tsx`

**Checkpoint**: Grid participates in parent layout via margin and sizing utility classes

---

## Phase 7: User Story 5 — Polymorphic as & Ref (Priority: P3)

**Goal**: Developers can render Grid as a semantic HTML element (`<section>`, `<ul>`) and access the DOM element via ref

**Independent Test**: Render `<Grid as="section" cols={2}>` and verify the output is a `<section>` with the correct grid CSS classes

### Tests for User Story 5 ⚠️

- [ ] T042 [P] [US5] Test `as="section"` renders `<section>` element with grid classes in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T043 [P] [US5] Test `as="ul"` with `<li>` children renders `<ul>` with grid classes in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T044 [P] [US5] Test no `as` defaults to `<div>` in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T045 [P] [US5] Test ref forwarding provides access to the root DOM element in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T046 [P] [US5] Test consumer `className` is merged and appears last in class string in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T047 [P] [US5] Test native HTML attributes (`id`, `data-*`) pass through to root element in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`

### Implementation for User Story 5

- [ ] T048 [US5] Ensure `as` prop with `ElementType` defaulting to `'div'` is in `GridProps` and `forwardRef<HTMLElement, GridProps>` pattern follows Stack/Inline/Cluster in `packages/react/src/components/Grid/Grid.tsx` (this should already be in place from T012 — verify and add `GridCols` export if missing)

**Checkpoint**: Grid supports semantic HTML elements and ref forwarding

---

## Phase 8: Storybook Stories

**Purpose**: Document Grid component with deterministic stories per FR-028–FR-032

- [ ] T049 [P] Create Storybook meta and 2-column story: `<Grid cols={2} gap="md">` with four child items in `packages/react/src/stories/components/Grid/Grid.stories.tsx`
- [ ] T050 [P] Add 3-column story: `<Grid cols={3} gap="lg">` with six child items in `packages/react/src/stories/components/Grid/Grid.stories.tsx`
- [ ] T051 [P] Add 4-column mixed-content story: `<Grid cols={4} gap="sm">` with varied content types in `packages/react/src/stories/components/Grid/Grid.stories.tsx`
- [ ] T052 [P] Add separate axis gap story: `<Grid cols={3} columnGap="xl" rowGap="sm">` demonstrating independent column/row gap in `packages/react/src/stories/components/Grid/Grid.stories.tsx`
- [ ] T053 [P] Add alignment story: `<Grid cols={2} gap="md" align="center">` with items of varying heights in `packages/react/src/stories/components/Grid/Grid.stories.tsx`
- [ ] T054 [P] Add Controls/Playground story with select controls for `cols`, `gap`, `align` in `packages/react/src/stories/components/Grid/Grid.stories.tsx`

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Validation, edge cases, and regression checks

- [ ] T055 Test component renders exactly one root element (no wrapper DOM nodes) for all prop combinations in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T056 Test immediate children participate in grid; grandchildren do not in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T057 Test edge cases: zero children, nested Grids, SSR parity for all supported props in `packages/react/src/components/Grid/__tests__/Grid.test.tsx`
- [ ] T058 Run linting: `pnpm --filter @pathable/styles lint` and `pnpm --filter @pathable/react lint` — fix any violations without suppressions
- [ ] T059 Run type-check: `pnpm --filter @pathable/react exec tsc --noEmit` — ensure no type errors
- [ ] T060 Run full layout primitive regression: `pnpm --filter @pathable/react test -- --testPathPattern="Grid|Stack|Inline|Cluster|Container|Box"` — ensure no regressions in existing primitives
- [ ] T061 Run `pnpm build` from root — verify both `@pathable/styles` and `@pathable/react` build successfully with new Grid component included
- [ ] T062 Run `pnpm --filter @pathable/react storybook` and verify all Grid stories render and pass accessibility checks
- [ ] T063 Validate against quickstart.md: follow the quickstart guide steps and confirm all expected outcomes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies — start immediately
- **Phase 2: Foundational (SCSS)**: Depends on Phase 1 — BLOCKS all user stories per Constitution IV
- **Phase 3: US1 (Columns)**: Depends on Phase 2 completion — first React component work
- **Phase 4: US2 (Gap)**: Depends on Phase 3 (extends the same component file, `Grid.tsx`)
- **Phase 5: US3 (Alignment)**: Depends on Phase 3 (extends the same component)
- **Phase 6: US4 (Sizing & Spacing)**: Depends on Phase 3 (extends the same component)
- **Phase 7: US5 (as & Ref)**: Depends on Phase 3 (extends the same component — ref/className/as are structural)
- **Phase 8: Storybook**: Depends on Phase 5–7 completion (needs all props for stories)
- **Phase 9: Polish**: Depends on all preceding phases complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories. The `Grid.tsx` file scaffold lays the foundation.
- **US2 (P1)**: Extends `Grid.tsx` from US1 — sequential within same file. The gap class records and mergeClasses additions modify existing component.
- **US3 (P2)**: Extends `Grid.tsx` — sequential after US1. Alignment adds a new local record and mergeClasses entry.
- **US4 (P2)**: Extends `Grid.tsx` and `GridProps` — sequential after US1. Uses shared resolver imports and type extensions.
- **US5 (P3)**: Largely validates existing patterns — sequential after US1. The `as` prop and `forwardRef` are established in US1's scaffold.

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Implementation tasks after tests for that story
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel (different directories)
- **Phase 2**: T003 → T004 → T005 are sequential (SCSS file → registration → build)
- **Phase 3 (US1)**: All test tasks (T006–T011) can run in parallel; T012 → T013 sequential
- **Phase 4 (US2)**: All test tasks (T014–T021) can run in parallel; T022 → T023 sequential
- **Phase 5 (US3)**: All test tasks (T024–T029) can run in parallel; T030 → T031 sequential
- **Phase 6 (US4)**: All test tasks (T032–T037) can run in parallel; T038 → T039 → T040 → T041 mostly sequential (same file)
- **Phase 7 (US5)**: All test tasks (T042–T047) can run in parallel
- **Phase 8 (Storybook)**: All story tasks (T049–T054) can run in parallel (different stories, same file)
- **Phase 9**: T058–T063 can run in parallel

---

## Parallel Example: User Story 1 & 2

```bash
# Phase 1 — Launch setup together:
Task: "T001 Create component directory structure"
Task: "T002 Create Storybook directory structure"

# Phase 2 — Sequential SCSS:
Task: "T003 Create pathable-grid.scss"
Task: "T004 Add @forward to pathable-layout-composition.scss"
Task: "T005 Build and verify SCSS output"

# Phase 3 — Launch all US1 tests together:
Task: "T006 Test default render"
Task: "T007 Test cols=2"
Task: "T008 Test cols=3"
Task: "T009 Test cols=4"
Task: "T010 Test no cols"
Task: "T011 Test SSR parity"

# Phase 3 — Implement after tests fail:
Task: "T012 Implement Grid component"
Task: "T013 Add barrel exports"

# Phase 4 — Launch all US2 tests together:
Task: "T014 Test gap=sm" through "T021 Test combined gap+columnGap+rowGap"

# Phase 4 — Implement after tests fail:
Task: "T022 Add gap/columnGap/rowGap props and records"
Task: "T023 Add gap class resolution to mergeClasses"
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup
2. Complete Phase 2: SCSS Contract (CRITICAL — blocks all React work)
3. Complete Phase 3: US1 — Columns (Grid renders with `cols` prop)
4. Complete Phase 4: US2 — Gap (spacing between cells works)
5. **STOP and VALIDATE**: Render `<Grid cols={2} gap="md">` with child content — this is the core MVP
6. Build and verify in a test page or story

### Incremental Delivery

1. Complete Setup + SCSS → Foundation ready
2. Add US1 → Grid renders with columns → Deploy/Demo (visible layout!)
3. Add US2 → Gap works → Deploy/Demo (complete spacing)
4. Add US3 → Alignment works → Deploy/Demo (refined control)
5. Add US4 → Sizing/spacing props work → Deploy/Demo (compositional)
6. Add US5 → Polished API (as, ref, className) → Deploy/Demo
7. Add Storybook → Documentation complete
8. Add Polish → Production ready

### Single Developer Strategy

1. Phase 1 + 2 (Setup + SCSS)
2. Phase 3 tests → Phase 3 implementation (US1)
3. Phase 4 tests → Phase 4 implementation (US2)
4. Phase 5 tests → Phase 5 implementation (US3)
5. Phase 6 tests → Phase 6 implementation (US4)
6. Phase 7 tests → Phase 7 verification (US5)
7. Phase 8 (Storybook)
8. Phase 9 (Polish)

---

## Notes

- [P] tasks = different files or non-conflicting additions, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- The SCSS contract (Phase 2) is the critical blocking prerequisite — no React work before SCSS
- `Grid.tsx` is a single file shared across all React phases (US1–US5). Tests are in a single `Grid.test.tsx`. Implement sequentially within each story; tests for each story can be written in parallel.
- The `padding` props are type-blocked as `never` per research.md Decision 11
- Alignment uses `GRID_ALIGN_CLASS` local record (not `alignItemsClass` resolver) per research.md Decision 3
- Verify tests fail before implementing
- Commit after each phase
- Stop at any checkpoint to validate story independently
- All stories must be deterministic — no random values, dates, or network dependencies