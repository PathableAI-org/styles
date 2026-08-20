# Tasks: Container Layout Primitive

**Input**: Design documents from `/specs/047-container-primitive/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are explicitly requested in the feature specification (FR-015, FR-016, FR-017). Tests are written FIRST for each user story (fail → pass).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Since all user stories contribute to a single `Container.tsx` file, the component is built incrementally — each phase adds a capability and its corresponding tests.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 & 2 — Standard and Multi-Width Rendering (P1) 🎯 MVP](#phase-3-user-story-1--2--standard-and-multi-width-rendering-p1--mvp)
- [Phase 4: User Story 3 — className and Native Props Composition (P2)](#phase-4-user-story-3--classname-and-native-props-composition-p2)
- [Phase 5: User Story 4 — Polymorphic as Prop (P2)](#phase-5-user-story-4--polymorphic-as-prop-p2)
- [Phase 6: User Story 5 — Ref Forwarding (P3)](#phase-6-user-story-5--ref-forwarding-p3)
- [Phase 7: User Story 6 — Storybook Documentation (P3)](#phase-7-user-story-6--storybook-documentation-p3)
- [Phase 8: Polish & Cross-Cutting Concerns](#phase-8-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 1 & 2](#parallel-example-user-story-1--2)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **React components**: `packages/react/src/components/<Component>/`
- **Tests**: `packages/react/src/components/<Component>/__tests__/`
- **Stories**: `packages/react/src/stories/components/<Component>/`
- **Internal utilities**: `packages/react/src/internal/resolvers/`
- **Barrel export**: `packages/react/src/index.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the component directory structure and verify the SCSS contract is available and correct.

- [ ] T001 [P] Verify the `.pathable-container` SCSS contract in `packages/styles/src/pathable-component-wrappers/pathable-container.scss` — confirm that `.pathable-container`, `.pathable-container--standard`, `.pathable-container--wide`, and `.pathable-container--full` exist with the expected max-width values (1024px, 1280px, 100%)
- [ ] T002 Create the component directory `packages/react/src/components/Container/` and the test directory `packages/react/src/components/Container/__tests__/`
- [ ] T003 [P] Create the Storybook stories directory `packages/react/src/stories/components/Container/`

**Checkpoint**: Directories exist. SCSS contract verified. Ready to build the component.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the Container component with its core type definitions, local class resolver, and the barrel export. This is the skeleton that all user stories build upon.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Implement the `Container` component with type-safe `size` prop, local `CONTAINER_SIZE_CLASS` map, `mergeClasses` integration, and `React.forwardRef` wrapper in `packages/react/src/components/Container/Container.tsx`
- [ ] T005 Export `Container`, `ContainerProps`, and `ContainerSize` from the React package barrel file `packages/react/src/index.ts`

**Checkpoint**: Foundation ready — Container component exists with size prop, class merging, and ref forwarding. User story implementation (tests first) can now begin.

---

## Phase 3: User Story 1 & 2 — Standard and Multi-Width Rendering (P1) 🎯 MVP

**Goal**: The Container renders a single root element with correct container classes for each size value. `size="standard"` applies `pathable-container--standard`, `size="wide"` applies `pathable-container--wide`, `size="full"` applies `pathable-container--full`, and no `size` applies only the base `pathable-container` class. No wrapper elements exist.

**Independent Test**: Render `<Container size="standard">Content</Container>` and verify it renders a single `<div>` with classes `pathable-container pathable-container--standard`, containing child content with no extra wrappers.

### Tests for User Story 1 & 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T006 [P] [US1] Write test: `size="standard"` renders a single `<div>` with `pathable-container` and `pathable-container--standard` classes in `packages/react/src/components/Container/__tests__/Container.test.tsx`
- [ ] T007 [P] [US1] Write test: no `size` prop renders a single `<div>` with only the `pathable-container` base class (no modifier) in `packages/react/src/components/Container/__tests__/Container.test.tsx`
- [ ] T008 [P] [US2] Write test: `size="wide"` renders `pathable-container--wide` modifier class in `packages/react/src/components/Container/__tests__/Container.test.tsx`
- [ ] T009 [P] [US2] Write test: `size="full"` renders `pathable-container--full` modifier class in `packages/react/src/components/Container/__tests__/Container.test.tsx`
- [ ] T010 [P] [US1] Write test: Container with `size="standard"` renders children as direct children with no wrapper DOM elements in `packages/react/src/components/Container/__tests__/Container.test.tsx`
- [ ] T011 [P] [US1] Write test: Container with `size="standard"` renders empty (no children) without error in `packages/react/src/components/Container/__tests__/Container.test.tsx`
- [ ] T012 [P] [US2] Write test: no `size` prop retains the default max-width (base class without modifier) and centering behavior in `packages/react/src/components/Container/__tests__/Container.test.tsx`

### Implementation for User Story 1 & 2

- [ ] T013 [US1] Verify `Container.tsx` applies `pathable-container` as the base class and uses `CONTAINER_SIZE_CLASS[size]` to resolve modifier class; confirm `mergeClasses('pathable-container', modifierClass, className)` produces correct output
- [ ] T014 [US1] Verify that when `size` is `undefined`, no modifier class is passed to `mergeClasses` and only `pathable-container` appears

**Checkpoint**: At this point, User Stories 1 and 2 are fully functional. Container renders at all three sizes (standard, wide, full) with correct classes, no wrapper elements, and children pass through. This is the MVP.

---

## Phase 4: User Story 3 — className and Native Props Composition (P2)

**Goal**: Consumer `className` is appended after Container classes. Native HTML attributes (`id`, `data-*`, `aria-*`, event handlers) pass through to the root element.

**Independent Test**: Render `<Container size="standard" className="page-wrapper" id="main-content">` and verify the `class` attribute contains `pathable-container pathable-container--standard page-wrapper` in that order, and `id="main-content"` is present.

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T015 [P] [US3] Write test: `className` is appended after Container's semantic classes (order: base, modifier, consumer) in `packages/react/src/components/Container/__tests__/Container.test.tsx`
- [ ] T016 [P] [US3] Write test: native HTML attributes (`id`, `data-*`) pass through to the root element in `packages/react/src/components/Container/__tests__/Container.test.tsx`
- [ ] T017 [P] [US3] Write test: event handler (`onClick`) is attached and fires correctly on the root element in `packages/react/src/components/Container/__tests__/Container.test.tsx`
- [ ] T018 [P] [US3] Write test: `aria-*` attributes pass through to the root element in `packages/react/src/components/Container/__tests__/Container.test.tsx`

### Implementation for User Story 3

- [ ] T019 [US3] Verify `Container.tsx` passes `...rest` (native props) onto the root element after `className` and `ref`; confirm `className` appears last in the class attribute string
- [ ] T020 [US3] Verify the `mergeClasses` call places consumer `className` as the final argument

**Checkpoint**: ClassName and native prop composition works correctly. All tests pass.

---

## Phase 5: User Story 4 — Polymorphic as Prop (P2)

**Goal**: The `as` prop renders a different HTML element (e.g., `<main>`, `<section>`, `<nav>`) with all Container classes applied. TypeScript constrains accepted native props to those valid for the selected element and prevents void elements.

**Independent Test**: Render `<Container as="main" size="standard">Page</Container>` and verify the output is a `<main>` element with the container classes.

### Tests for User Story 4 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T021 [P] [US4] Write test: `as="main"` renders a `<main>` element with container classes in `packages/react/src/components/Container/__tests__/Container.test.tsx`
- [ ] T022 [P] [US4] Write test: `as="section"` renders a `<section>` element with container classes in `packages/react/src/components/Container/__tests__/Container.test.tsx`
- [ ] T023 [P] [US4] Write test: `as="nav"` renders a `<nav>` element with container classes in `packages/react/src/components/Container/__tests__/Container.test.tsx`
- [ ] T024 [P] [US4] Write test: default (no `as`) renders a `<div>` element in `packages/react/src/components/Container/__tests__/Container.test.tsx`

### Implementation for User Story 4

- [ ] T025 [US4] Verify `Container.tsx` uses the generic polymorphic type pattern (`<T extends React.ElementType = 'div'>`) to render the element specified by `as`, defaulting to `div`
- [ ] T026 [US4] Verify TypeScript prevents void elements (e.g., `as="input"`) from being passed by constraining `children` in the type

**Checkpoint**: Polymorphic `as` rendering works correctly. Element types are properly constrained.

---

## Phase 6: User Story 5 — Ref Forwarding (P3)

**Goal**: A ref passed to `Container` points directly to the rendered root DOM element, regardless of the `as` prop value.

**Independent Test**: Pass a `React.createRef()` to `<Container size="standard">` and verify `ref.current` points to the `<div>` root element carrying the container classes.

### Tests for User Story 5 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T027 [P] [US5] Write test: ref forwarded to `<Container size="standard">` points to the `<div>` root element in `packages/react/src/components/Container/__tests__/Container.test.tsx`
- [ ] T028 [P] [US5] Write test: ref forwarded to `<Container as="main" size="wide">` points to the `<main>` root element in `packages/react/src/components/Container/__tests__/Container.test.tsx`
- [ ] T029 [P] [US5] Write test: ref.current contains the expected Container class names in `packages/react/src/components/Container/__tests__/Container.test.tsx`

### Implementation for User Story 5

- [ ] T030 [US5] Verify `Container.tsx` uses `React.forwardRef` with proper generic typing to forward the ref to the rendered element

**Checkpoint**: Ref forwarding works for default `<div>` and polymorphic `as` elements.

---

## Phase 7: User Story 6 — Storybook Documentation (P3)

**Goal**: Storybook contains Container stories for each supported `size` value, with deterministic fixtures.

**Independent Test**: Open Container's Storybook stories and verify each supported `size` value renders correctly.

### Implementation for User Story 6

- [ ] T031 [P] [US6] Create Storybook story for `Container` with `size="standard"` rendering centered, width-constrained content in `packages/react/src/stories/components/Container/Container.stories.tsx`
- [ ] T032 [P] [US6] Create Storybook story for `Container` with `size="wide"` rendering wider constrained content in `packages/react/src/stories/components/Container/Container.stories.tsx`
- [ ] T033 [P] [US6] Create Storybook story for `Container` with `size="full"` rendering full-bleed content in `packages/react/src/stories/components/Container/Container.stories.tsx`

**Checkpoint**: All Container stories render correctly in Storybook. Stories are deterministic fixtures.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verification that the complete feature passes all gates.

- [ ] T034 Build the React package with `pnpm --filter @pathable/react build` and verify no errors
- [ ] T035 Run TypeScript type-check with `tsc --noEmit` on the React package and verify no errors
- [ ] T036 Run ESLint on the Container files and verify no lint violations
- [ ] T037 Run all Container tests with `pnpm --filter @pathable/react test -- --testPathPattern="Container"` — all must pass
- [ ] T038 Run the full React test suite with `pnpm --filter @pathable/react test` — no regressions
- [ ] T039 Verify Storybook builds and all Container stories render without errors and pass a11y checks
- [ ] T040 Run quickstart.md validation scenarios and verify all 8 scenarios match expected outcomes
- [ ] T041 Verify no `packages/styles` files were modified (confirm zero SCSS changes)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–7)**: All depend on Foundational phase completion
  - Phases 3–7 proceed sequentially because they all modify the same `Container.tsx` file incrementally
  - Tests within each phase marked [P] can run in parallel
- **Polish (Phase 8)**: Depends on all user story phases complete

### User Story Dependencies

- **US1 & US2 (P1)**: Combined in Phase 3 — both touch the core `size` prop behavior and share test infrastructure. Start immediately after Foundational.
- **US3 (P2)**: Depends on US1/US2 (needs working component to add className/native prop composition tests). Can start after Phase 3.
- **US4 (P2)**: Depends on US1/US2 (needs working component to add `as` prop tests). Can start after Phase 3.
- **US5 (P3)**: Depends on US4 (ref forwarding with `as="main"` requires polymorphic support). Can start after Phase 5.
- **US6 (P3)**: Depends on US1–US5 (stories need full component behavior). Can start after Phase 6.

### Within Each User Story

- Tests MUST be written and FAIL before implementation verification
- All tests for a phase can run in parallel (marked [P])
- Verify implementation after all tests are written and failing

### Parallel Opportunities

- All Setup tasks (T001–T003) can run in parallel
- Within Phase 3: All 7 test tasks (T006–T012) can run in parallel
- Within Phase 4: All 4 test tasks (T015–T018) can run in parallel
- Within Phase 5: All 4 test tasks (T021–T024) can run in parallel
- Within Phase 6: All 3 test tasks (T027–T029) can run in parallel
- Within Phase 7: All 3 story tasks (T031–T033) can run in parallel
- Within Phase 8: T034, T035, T036, T039, T040, T041 can run in parallel after tests pass

---

## Parallel Example: User Story 1 & 2

```bash
# Launch all tests for User Story 1 & 2 together:
Task: "Write test: size='standard' renders a single <div> with pathable-container and pathable-container--standard classes"
Task: "Write test: no size prop renders a single <div> with only the pathable-container base class"
Task: "Write test: size='wide' renders pathable-container--wide modifier class"
Task: "Write test: size='full' renders pathable-container--full modifier class"
Task: "Write test: Container renders children as direct children with no wrapper DOM elements"
Task: "Write test: Container renders empty (no children) without error"
Task: "Write test: no size prop retains the default max-width and centering behavior"
```

---

## Implementation Strategy

### MVP First (US1 & US2 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T005)
3. Complete Phase 3: US1 & US2 Tests + Implementation (T006–T014)
4. **STOP and VALIDATE**: Verify `<Container size="standard">` renders correctly
5. Run `pnpm --filter @pathable/react test -- --testPathPattern="Container"` — all tests pass
6. This is the MVP — centered content region works at all three widths

### Incremental Delivery

1. Setup + Foundational → Component skeleton exists
2. Add US1 + US2 → Core size rendering works → MVP!
3. Add US3 → className/native props compose → Richer API
4. Add US4 → Polymorphic `as` prop → Semantic HTML support
5. Add US5 → Ref forwarding → Integration-ready
6. Add US6 → Storybook stories → Documented
7. Polish → CI green → Ready for merge

### Notes

- All tests within a phase are [P] (parallel) — they test different assertions on the same component and can be written simultaneously
- The implementation verification tasks (T013, T014, T019, T020, T025, T026, T030) confirm that the component code already satisfies the tests
- Since all user stories modify the same `Container.tsx`, parallel phase execution is not possible. Tests within each phase are parallelizable
- Container is a non-interactive layout primitive — no interaction tests, keyboard tests, or focus tests needed
- All stories use deterministic fixtures (static content, no dates, no network calls)