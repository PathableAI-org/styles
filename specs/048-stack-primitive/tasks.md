# Tasks: Stack Layout Primitive

**Input**: Design documents from `/specs/048-stack-primitive/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are explicitly required by the spec (FR-019 through FR-023). All test tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Since the `Stack` component is a single file, incremental development adds props and test coverage per story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup](#phase-1-setup)
- [Phase 2: Foundational (Component Skeleton)](#phase-2-foundational-component-skeleton)
- [Phase 3: User Story 1 - Stack Children Vertically with a Gap (P1) 🎯 MVP](#phase-3-user-story-1---stack-children-vertically-with-a-gap-p1--mvp)
- [Phase 4: User Story 2 - Align Children Horizontally (P2)](#phase-4-user-story-2---align-children-horizontally-p2)
- [Phase 5: User Story 3 - Sizing and External Spacing (P2)](#phase-5-user-story-3---sizing-and-external-spacing-p2)
- [Phase 6: User Story 4 - Override Rendered Element (P3)](#phase-6-user-story-4---override-rendered-element-p3)
- [Phase 7: User Story 5 - Consumer className Composition (P3)](#phase-7-user-story-5---consumer-classname-composition-p3)
- [Phase 8: User Story 6 - Ref Forwarding (P3)](#phase-8-user-story-6---ref-forwarding-p3)
- [Phase 9: User Story 7 - Storybook Documentation (P3)](#phase-9-user-story-7---storybook-documentation-p3)
- [Phase 10: Polish & Export](#phase-10-polish--export)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Component**: `packages/react/src/components/Stack/`
- **Tests**: `packages/react/src/components/Stack/__tests__/`
- **Stories**: `packages/react/src/stories/components/Stack/`
- **Resolvers**: `packages/react/src/internal/resolvers/` (read-only — no changes)
- **Barrel**: `packages/react/src/index.ts`

---

## Phase 1: Setup

**Purpose**: Create the component directory structure

- [x] T001 Create directory structure: `packages/react/src/components/Stack/` and `packages/react/src/components/Stack/__tests__/` and `packages/react/src/stories/components/Stack/`

---

## Phase 2: Foundational (Component Skeleton)

**Purpose**: Create the minimal Stack component that renders a `<div>` with the base `.pathable-stack` class. This is the foundation that all user stories build upon.

**⚠️ CRITICAL**: No user story work can begin until the component skeleton exists.

- [x] T002 Implement Stack component skeleton with base class `pathable-stack`, default `div` element, and children passthrough in `packages/react/src/components/Stack/Stack.tsx`

**Checkpoint**: A `<Stack />` renders `<div class="pathable-stack"></div>`. Ready to add props per user story.

---

## Phase 3: User Story 1 - Stack Children Vertically with a Gap (P1) 🎯 MVP

**Goal**: Developers can wrap children in `<Stack gap="sm">` and receive vertical stacking with token-based spacing. The `gap` prop maps to `.pathable-stack--gap-{sm,md,lg,xl}` modifier classes. No `gap` prop uses the default `--space-16` gap from the CSS custom property.

**Independent Test**: Render `<Stack gap="sm"><span>A</span><span>B</span></Stack>`, inspect the DOM, and verify a single root element with classes `pathable-stack pathable-stack--gap-sm` containing both `<span>` children with no intermediate wrappers.

**Related FRs**: FR-001, FR-004, FR-005, FR-006, FR-012, FR-013, FR-019, FR-021

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T003 [US1] Add test for base render (no props) verifying single root `<div>` with `pathable-stack` class and no wrapper elements in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`
- [x] T004 [US1] Add tests for each `gap` value (`sm`, `md`, `lg`, `xl`) verifying correct `pathable-stack--gap-{value}` modifier class on root element in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`
- [x] T005 [US1] Add test for missing `gap` prop verifying only base `pathable-stack` class (no gap modifier) in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`
- [x] T006 [US1] Add test for children rendering in document order with no wrapper between Stack and children in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`

### Implementation for User Story 1

- [x] T007 [US1] Define `StackGap` type (`'sm' | 'md' | 'lg' | 'xl'`) and `STACK_GAP_CLASS` record mapping each gap value to its modifier class in `packages/react/src/components/Stack/Stack.tsx`
- [x] T008 [US1] Add `gap` prop to `StackProps` interface and wire gap class resolution in `mergeClasses` call order (base → gap modifier → className) in `packages/react/src/components/Stack/Stack.tsx`

**Checkpoint**: `<Stack gap="sm">` renders with correct gap class. All gap tests pass.

---

## Phase 4: User Story 2 - Align Children Horizontally (P2)

**Goal**: Developers pass `<Stack align="center">` and children are center-aligned horizontally within the stack. The `align` prop uses the existing `alignItemsClass` resolver to map values to `.pathable-flex-align-{value}` utility classes.

**Independent Test**: Render `<Stack gap="sm" align="center"><span>A</span></Stack>`, inspect DOM, and verify the root element carries both `pathable-stack pathable-stack--gap-sm` and `pathable-flex-align-center`.

**Related FRs**: FR-007, FR-008, FR-020

### Tests for User Story 2 ⚠️

- [x] T009 [US2] Add tests for each `align` value (`start`, `center`, `end`, `stretch`, `baseline`) verifying correct `pathable-flex-align-{value}` utility class on root element in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`
- [x] T010 [US2] Add test for missing `align` prop verifying no alignment utility class is applied in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`

### Implementation for User Story 2

- [x] T011 [US2] Import `AlignItems` type and `alignItemsClass` resolver from `internal/resolvers/alignment.js` in `packages/react/src/components/Stack/Stack.tsx`
- [x] T012 [US2] Add `align` prop (typed as `AlignItems`) to `StackProps` and wire `alignItemsClass(align)` into `mergeClasses` call after gap modifier in `packages/react/src/components/Stack/Stack.tsx`

**Checkpoint**: `<Stack align="center">` applies correct alignment utility class. All align tests pass.

---

## Phase 5: User Story 3 - Sizing and External Spacing (P2)

**Goal**: Developers pass `width="full"`, `maxWidth="desktop"`, `marginX="auto"` and the component applies the corresponding verified sizing and spacing utility classes to the root element.

**Independent Test**: Render `<Stack width="full" maxWidth="desktop" marginX="auto"><span>A</span></Stack>`, inspect DOM, and verify `pathable-stack pathable-width-full pathable-maxw-desktop pathable-margin-x-auto` all on the single root element.

**Related FRs**: FR-009, FR-010

### Tests for User Story 3 ⚠️

- [x] T013 [US3] Add tests for `width` and `maxWidth` props verifying correct `pathable-width-{value}` and `pathable-maxw-{value}` utility classes in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`
- [x] T014 [US3] Add tests for `margin`, `marginX`, `marginY`, `marginTop`, `marginBottom` props verifying correct `pathable-margin-{n}` utility classes in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`
- [x] T015 [US3] Add test verifying combined gap + align + sizing + spacing props all produce correct classes on single root element in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`
- [x] T016 [US3] Add test for SSR parity: server-rendered output matches client-rendered output for a full prop combination in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`

### Implementation for User Story 3

- [x] T017 [US3] Import `SizingProps`, `SpacingProps` types and `widthClass`, `maxWidthClass`, `marginAllClass`, `marginXClass`, `marginYClass`, `marginTopClass`, `marginBottomClass` resolvers in `packages/react/src/components/Stack/Stack.tsx`
- [x] T018 [US3] Extend `StackProps` to extend `SizingProps` and `SpacingProps`, destructure sizing/spacing props, and wire resolvers into `mergeClasses` call after alignment utility in `packages/react/src/components/Stack/Stack.tsx`

**Checkpoint**: `<Stack width="full" maxWidth="desktop" marginX="auto">` applies all utility classes. SSR output matches client.

---

## Phase 6: User Story 4 - Override Rendered Element (P3)

**Goal**: Developers pass `as="section"` and the component renders a `<section>` element with all stack classes, following the polymorphic pattern established by `Container`.

**Independent Test**: Render `<Stack as="section" gap="sm"><span>A</span></Stack>` and verify the output is a `<section>` element with the stack classes.

**Related FRs**: FR-002, FR-003, FR-015

### Tests for User Story 4 ⚠️

- [x] T019 [US4] Add tests for `as` prop (`as="section"`, `as="nav"`, `as="ol"`) verifying correct element tag and stack classes present in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`
- [x] T020 [US4] Add test for `as="ol"` with `<li>` children verifying list semantics are preserved in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`
- [x] T021 [US4] Add test for native HTML attribute passthrough (`id`, `data-test`, `aria-label`) on the root element in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`

### Implementation for User Story 4

- [x] T022 [US4] Add `as?: ElementType` prop to `StackProps`, implement `const Component = as ?? 'div'` pattern, and wrap with `forwardRef<HTMLElement, StackProps>` following Container's polymorphic pattern in `packages/react/src/components/Stack/Stack.tsx`

**Checkpoint**: `<Stack as="section">` renders a `<section>`. All `as` tests pass.

---

## Phase 7: User Story 5 - Consumer className Composition (P3)

**Goal**: Developers pass `className="custom"` and the consumer class appears last in the class string after all component and utility classes.

**Independent Test**: Render `<Stack gap="sm" className="my-stack">` and verify the root element's class string contains `pathable-stack`, `pathable-stack--gap-sm`, and `my-stack` in that relative order.

**Related FRs**: FR-011

### Tests for User Story 5 ⚠️

- [x] T023 [US5] Add test for `className` prop verifying consumer class appears last in the class string after all component classes in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`
- [x] T024 [US5] Add test for class merge order verifying the documented order: base → gap → align → sizing → spacing → consumer className in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`

### Implementation for User Story 5

- [x] T025 [US5] Verify `className` is passed as the last argument to `mergeClasses` (this should already be in place from Phase 2 skeleton; confirm correct position) in `packages/react/src/components/Stack/Stack.tsx`

**Checkpoint**: Consumer `className` always appears last in class string. Class merge order tests pass.

---

## Phase 8: User Story 6 - Ref Forwarding (P3)

**Goal**: Developers pass a `ref` and it points directly to the rendered root DOM element, regardless of the `as` prop value.

**Independent Test**: Pass `React.createRef()` to `<Stack gap="sm">` and verify `ref.current` points to the root DOM element carrying the stack classes.

**Related FRs**: FR-014

### Tests for User Story 6 ⚠️

- [x] T026 [US6] Add test for ref forwarding verifying `ref.current` is the root `<div>` DOM element with `pathable-stack` class in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`
- [x] T027 [US6] Add test for ref forwarding with `as="section"` verifying `ref.current` is the `<section>` element in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`

### Implementation for User Story 6

- [x] T028 [US6] Verify `forwardRef` is correctly wired — the `ref` parameter is passed to `<Component ref={ref}>` (this should already be in place from T022; confirm correct wiring) in `packages/react/src/components/Stack/Stack.tsx`

**Checkpoint**: `ref.current` works correctly for both default `div` and `as` overrides.

---

## Phase 9: User Story 7 - Storybook Documentation (P3)

**Goal**: Storybook has stories for each gap value, alignment combination, and a nested layout example. All stories are deterministic and pass accessibility checks.

**Independent Test**: Open Stack's Storybook stories and verify each supported gap value and alignment combination renders correctly.

**Related FRs**: FR-024

### Implementation for User Story 7

- [x] T029 [P] [US7] Add deterministic Storybook story for default Stack (no props) showing vertical stacking layout in `packages/react/src/stories/components/Stack/Stack.stories.tsx`
- [x] T030 [P] [US7] Add deterministic Storybook stories for each `gap` value (`sm`, `md`, `lg`, `xl`) with visible child blocks to demonstrate spacing in `packages/react/src/stories/components/Stack/Stack.stories.tsx`
- [x] T031 [P] [US7] Add deterministic Storybook stories for alignment combinations (`align="center"`, `align="start"`) with varied-width children in `packages/react/src/stories/components/Stack/Stack.stories.tsx`
- [x] T032 [US7] Add deterministic Storybook story for nested layout (Stack inside Container, or Stack with mixed child content) demonstrating real-world composition in `packages/react/src/stories/components/Stack/Stack.stories.tsx`

**Checkpoint**: All Stack stories render in Storybook. A11y checks pass.

---

## Phase 10: Polish & Export

**Purpose**: Finalize exports, run validation, ensure CI readiness.

- [x] T033 [P] Add Stack export (`export { Stack }`) and type exports (`export type { StackProps, StackGap }`) to barrel file `packages/react/src/index.ts`
- [x] T034 [P] Add component test verifying immediate-child layout contract: a wrapper div between Stack and intended children breaks the gap/alignment relationship in `packages/react/src/components/Stack/__tests__/Stack.test.tsx`
- [x] T035 Run `pnpm --filter @pathable/react build` and verify build succeeds with Stack in dist output
- [x] T036 Run `pnpm --filter @pathable/react lint` and verify no new lint errors
- [x] T037 Run full Stack test suite: `pnpm --filter @pathable/react test -- --testPathPattern="Stack"` and verify all tests pass
- [x] T038 Run `pnpm storybook` and verify Stack stories build and render without errors
- [x] T039 Run quickstart.md validation: verify all checklist items pass (build, tests, types, lint, stories, exports)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001) — BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Foundational (Phase 2) completion.
  - US1 (Phase 3) must complete first — it establishes the core component structure
  - US2-US6 can proceed in priority order (each adds to the existing component)
  - US7 (Storybook) can start after US1 is complete since it only needs the component to render
- **Polish (Phase 10)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories. MVP deliverable.
- **User Story 2 (P2)**: Depends on US1 — adds `align` prop to existing component.
- **User Story 3 (P2)**: Depends on US1 — adds sizing/spacing props. Independent of US2.
- **User Story 4 (P3)**: Depends on US1 — wraps component in `forwardRef`. Refactors the skeleton pattern.
- **User Story 5 (P3)**: No dependencies beyond US1 — verifies existing `className` wiring.
- **User Story 6 (P3)**: Depends on US4 — ref forwarding requires `forwardRef` wrapper.
- **User Story 7 (P3)**: Can start after US1 (needs at minimum the component with gap prop to render).

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Implementation follows tests
- Story complete when all tests in that phase pass

### Parallel Opportunities

- T029, T030, T031 (Storybook stories) can run in parallel — different stories, same file
- T033, T034 (export + final test) can run in parallel — different files
- US2 and US3 can be implemented in parallel after US1 is complete

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002)
3. Complete Phase 3: User Story 1 (T003-T008)
4. **STOP and VALIDATE**: Run Stack tests, verify `<Stack gap="sm">` renders correctly
5. Deploy/demo if ready — the component already delivers the core vertical stacking value

### Incremental Delivery

1. Complete Setup + Foundational → Component skeleton exists
2. Add User Story 1 → Gap prop works → Test independently (MVP!)
3. Add User Story 2 → Align prop works → Test independently
4. Add User Story 3 → Sizing/spacing works → Test independently
5. Add User Stories 4-6 → Polymorphism, className, ref → Test independently
6. Add User Story 7 → Storybook documentation complete
7. Polish → Export, build, CI verification

### Suggested Single-Developer Order

Since `Stack` is a single component file, the most efficient approach is:

1. T001: Create directories
2. T002: Component skeleton
3. Write ALL tests first (T003-T006, T009-T010, T013-T016, T019-T021, T023-T024, T026-T027): ~15 tests total
4. T007-T008, T011-T012, T017-T018, T022, T025, T028: Implement the full component
5. T029-T032: Write Storybook stories
6. T033-T034: Export and component test
7. T035-T039: Build, lint, test suite, Storybook, and quickstart validation

The full component implementation (T007-T028) can be done as a single cohesive pass since all test expectations are known upfront.

---

## Notes

- All existing resolvers (`alignItemsClass`, `widthClass`, `maxWidthClass`, `margin*Class`, `mergeClasses`) are consumed as-is — no changes to `packages/react/src/internal/resolvers/`.
- No changes to `packages/styles` — the `.pathable-stack` SCSS contract is consumed without modification.
- The `Container` component at `packages/react/src/components/Container/Container.tsx` is the reference for the polymorphic `as` pattern, `forwardRef`, and local class-record approach.
- The `mergeClasses` import path is `../../internal/resolvers/mergeClasses.js` (relative from `components/Stack/`).
- All resolver imports use `.js` extensions (ESM pattern in this codebase).
- No lint suppressions may be introduced (per workspace lint discipline rule).