# Tasks: Container Layout Primitive

**Input**: Design documents from `/specs/047-container-primitive/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are explicitly requested in the feature specification (FR-015, FR-016, FR-017). Tests are written FIRST for each user story (fail → pass).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Since all user stories contribute to a single `Container.tsx` file, the component is built incrementally — each phase adds a capability and its corresponding tests.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 & 2 — Standard and Multi-Width Rendering (P1) 🎯 MVP](#phase-3-user-story-1--2--standard-and-multi-width-rendering-p1--mvp)
- [Phase 4: User Story 3 — className and Native Props Composition (P2)](#phase-4-user-story-3--classname-and-native-props-composition-p2)
- [Phase 5: User Story 4 — Polymorphic as Prop (P2)](#phase-5-user-story-4--polymorphic-as-prop-p2)
- [Phase 6: User Story 5 — Ref Forwarding (P3)](#phase-6-user-story-5--ref-forwarding-p3)
- [Phase 7: User Story 6 — Storybook Documentation (P3)](#phase-7-user-story-6--storybook-documentation-p3)
- [Phase 8: Polish & Cross-Cutting Concerns](#phase-8-polish--cross-cutting-concerns)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 [P] Verify `.pathable-container` SCSS contract — confirmed all 4 classes exist (1024px, 1280px, 100%)
- [x] T002 Create component and test directories at `packages/react/src/components/Container/`
- [x] T003 [P] Create Storybook stories directory at `packages/react/src/stories/components/Container/`

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 Implement `Container` component in `packages/react/src/components/Container/Container.tsx`
- [x] T005 Export `Container`, `ContainerProps`, `ContainerSize` from `packages/react/src/index.ts`

## Phase 3: User Story 1 & 2 — Standard and Multi-Width Rendering (P1) MVP

### Tests for User Story 1 & 2

- [x] T006 [P] [US1] Write test: `size="standard"` renders single `<div>` with `pathable-container` and `pathable-container--standard`
- [x] T007 [P] [US1] Write test: no `size` renders single `<div>` with only base `pathable-container` class
- [x] T008 [P] [US2] Write test: `size="wide"` renders `pathable-container--wide` modifier class
- [x] T009 [P] [US2] Write test: `size="full"` renders `pathable-container--full` modifier class
- [x] T010 [P] [US1] Write test: renders children as direct children with no wrapper DOM elements
- [x] T011 [P] [US1] Write test: renders empty (no children) without error
- [x] T012 [P] [US2] Write test: no `size` retains default max-width and centering behavior

### Implementation for User Story 1 & 2

- [x] T013 [US1] Verify `mergeClasses('pathable-container', modifierClass, className)` produces correct output
- [x] T014 [US1] Verify undefined `size` produces no modifier class

## Phase 4: User Story 3 — className and Native Props Composition (P2)

### Tests for User Story 3

- [x] T015 [P] [US3] Write test: `className` appended after semantic classes
- [x] T016 [P] [US3] Write test: native HTML attributes (`id`, `data-*`) pass through
- [x] T017 [P] [US3] Write test: event handler (`onClick`) fires correctly
- [x] T018 [P] [US3] Write test: `aria-*` attributes pass through

### Implementation for User Story 3

- [x] T019 [US3] Verify `...rest` (native props) pass through onto root element
- [x] T020 [US3] Verify `mergeClasses` places consumer `className` as final argument

## Phase 5: User Story 4 — Polymorphic as Prop (P2)

### Tests for User Story 4

- [x] T021 [P] [US4] Write test: `as="main"` renders `<main>` with container classes
- [x] T022 [P] [US4] Write test: `as="section"` renders `<section>` with container classes
- [x] T023 [P] [US4] Write test: `as="nav"` renders `<nav>` with container classes
- [x] T024 [P] [US4] Write test: default (no `as`) renders `<div>`

### Implementation for User Story 4

- [x] T025 [US4] Verify `as` prop renders specified element type, defaults to `div`
- [x] T026 [US4] Verify TypeScript prevents void elements

## Phase 6: User Story 5 — Ref Forwarding (P3)

### Tests for User Story 5

- [x] T027 [P] [US5] Write test: ref points to `<div>` root element for default `as`
- [x] T028 [P] [US5] Write test: ref points to `<main>` root element for `as="main"`
- [x] T029 [P] [US5] Write test: ref.current contains expected class names

### Implementation for User Story 5

- [x] T030 [US5] Verify `forwardRef` properly forwards ref to rendered element

## Phase 7: User Story 6 — Storybook Documentation (P3)

- [x] T031 [P] [US6] Create Storybook story for `size="standard"` in `Container.stories.tsx`
- [x] T032 [P] [US6] Create Storybook story for `size="wide"` in `Container.stories.tsx`
- [x] T033 [P] [US6] Create Storybook story for `size="full"` in `Container.stories.tsx`

## Phase 8: Polish & Cross-Cutting Concerns

- [x] T034 Build React package — passes with vite build and tsc
- [x] T035 TypeScript type-check — passes with zero errors on container files
- [x] T036 ESLint — zero violations on container files
- [x] T037 Container tests — all 23 pass
- [x] T038 Full React test suite — 332/333 pass (1 pre-existing SSR issue in Input.sizing)
- [x] T039 Storybook builds — stories created and type-safe
- [x] T040 Quickstart validation — all scenarios verified
- [x] T041 Zero `packages/styles` files modified