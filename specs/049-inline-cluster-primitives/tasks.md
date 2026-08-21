# Tasks: Inline and Cluster Layout Primitives

**Input**: Design documents from `/specs/049-inline-cluster-primitives/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Unit tests are included per the feature spec (FR-022 through FR-028 require them). Storybook stories are included per the feature spec (FR-029 through FR-031 require them).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup & Styles Foundation](#phase-1-setup--styles-foundation)
- [Phase 2: User Story 1 — Inline Gap](#phase-2-user-story-1--inline-gap-p1-mvp)
- [Phase 3: User Story 2 — Cluster Gap](#phase-3-user-story-2--cluster-gap-p1)
- [Phase 4: User Story 3 — Align & Justify](#phase-4-user-story-3--align--justify-p2)
- [Phase 5: User Story 4 — Sizing & Spacing](#phase-5-user-story-4--sizing--spacing-p2)
- [Phase 6: User Story 5 — Polymorphic as Prop](#phase-6-user-story-5--polymorphic-as-prop-p3)
- [Phase 7: User Story 6 — className & Ref Forwarding](#phase-7-user-story-6--classname--ref-forwarding-p3)
- [Phase 8: User Story 7 — Storybook Documentation](#phase-8-user-story-7--storybook-documentation-p3)
- [Phase 9: Polish & Cross-Cutting Concerns](#phase-9-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: Phase 1 Styles](#parallel-example-phase-1-styles)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **SCSS source**: `packages/styles/src/pathable-component-wrappers/`
- **React components**: `packages/react/src/components/{ComponentName}/`
- **React tests**: `packages/react/src/components/{ComponentName}/__tests__/`
- **Storybook stories**: `packages/react/src/stories/components/{ComponentName}/`

---

## Phase 1: Setup & Styles Foundation

**Purpose**: Create the SCSS contracts that both React components depend on. These are blocking prerequisites per constitution — SCSS contracts must exist in `packages/styles` before React wrappers are exposed.

**⚠️ CRITICAL**: No React component work can begin until this phase is complete.

- [x] T001 Create Inline SCSS contract in `packages/styles/src/pathable-component-wrappers/pathable-inline.scss` with `.pathable-inline` base class (`display: flex; flex-direction: row; gap: var(--pathable-inline-gap, var(--space-16))`) and four gap modifier classes (`.pathable-inline--gap-sm` = `var(--space-8)`, `--gap-md` = `var(--space-16)`, `--gap-lg` = `var(--space-24)`, `--gap-xl` = `var(--space-32)`)
- [x] T002 Add `--gap-xl` modifier to `packages/styles/src/pathable-component-wrappers/pathable-cluster.scss` with `--pathable-cluster-gap: var(--space-24)` and add `--align-baseline` modifier with `--pathable-cluster-align: baseline`
- [x] T003 Add `@forward 'pathable-inline'` to `packages/styles/src/pathable-component-wrappers/pathable-layout-composition.scss`
- [x] T004 Build the styles package and verify Inline and updated Cluster classes appear in CSS output: `pnpm --filter @pathable/styles build`

**Checkpoint**: SCSS foundation ready — React component implementation can now begin.

---

## Phase 2: User Story 1 — Inline Gap (P1) 🎯 MVP

**Goal**: Deliver `<Inline gap="sm">` — a horizontal non-wrapping flex container with token-based spacing between children.

**Independent Test**: Render `<Inline gap="sm"><span>A</span><span>B</span></Inline>`, inspect the DOM, and verify a single root element with the correct Inline base class and gap modifier class, no wrapper elements, and child content preserved in document order.

### Tests for User Story 1

> **NOTE: Write these tests FIRST — ensure they FAIL before implementing Inline.tsx**

- [x] T005 [P] [US1] Write unit tests for Inline gap behavior in `packages/react/src/components/Inline/__tests__/Inline.test.tsx`: base render (`.pathable-inline` class, single root `<div>`, `flex-direction: row`, no wrapper), each gap value maps to correct modifier class (`--gap-sm` → `.pathable-inline--gap-sm`, etc.), omitted gap produces base class only without gap modifier

### Implementation for User Story 1

- [x] T006 [US1] Implement Inline component (gap-only, no align/justify/sizing yet) in `packages/react/src/components/Inline/Inline.tsx` following the Stack pattern: inner function + `forwardRef`, `InlineGap` type, `INLINE_GAP_CLASS` record, `mergeClasses('pathable-inline', gapClass, className)`
- [x] T007 [US1] Export Inline component and types from `packages/react/src/index.ts`: `export { Inline } from './components/Inline/Inline.js'` and `export type { InlineProps, InlineGap } from './components/Inline/Inline.js'`
- [x] T008 [US1] Verify US1 tests pass: `pnpm --filter @pathable/react test -- --testPathPattern="Inline"`

**Checkpoint**: `<Inline gap="sm">` renders a horizontal non-wrapping flex container with correct gap class and no wrappers.

---

## Phase 3: User Story 2 — Cluster Gap (P1)

**Goal**: Deliver `<Cluster gap="sm">` — a wrapping horizontal flex container where children flow onto new lines when space is constrained.

**Independent Test**: Render `<Cluster gap="sm"><span>A</span><span>B</span><span>C</span></Cluster>` in a constrained container, inspect the DOM, and verify `flex-wrap: wrap` behavior with the correct gap class.

### Tests for User Story 2

- [x] T009 [P] [US2] Write unit tests for Cluster gap behavior in `packages/react/src/components/Cluster/__tests__/Cluster.test.tsx`: base render (`.pathable-cluster` class, single root `<div>`, `flex-wrap: wrap`, no wrapper), each gap value maps to correct modifier class (`--gap-sm` → `.pathable-cluster--gap-sm`, `--gap-md`, `--gap-lg`, `--gap-xl`), omitted gap produces base class only

### Implementation for User Story 2

- [x] T010 [US2] Implement Cluster component (gap-only, no align/sizing yet) in `packages/react/src/components/Cluster/Cluster.tsx` following the Stack pattern: inner function + `forwardRef`, `ClusterGap` type, `CLUSTER_GAP_CLASS` record, `mergeClasses('pathable-cluster', gapClass, className)`
- [x] T011 [US2] Export Cluster component and types from `packages/react/src/index.ts`: `export { Cluster } from './components/Cluster/Cluster.js'` and `export type { ClusterProps, ClusterGap } from './components/Cluster/Cluster.js'`
- [x] T012 [US2] Verify US2 tests pass: `pnpm --filter @pathable/react test -- --testPathPattern="Cluster"`

**Checkpoint**: `<Cluster gap="sm">` renders a wrapping horizontal flex container with correct gap class and no wrappers.

---

## Phase 4: User Story 3 — Align & Justify (P2)

**Goal**: Add `align` prop to both Inline and Cluster, and `justify` prop to Inline.

**Independent Test**: Render `<Inline align="center" justify="between">` and verify correct alignment and justification classes on the root element. Render `<Cluster align="start">` and verify correct alignment class.

### Tests for User Story 3

- [x] T013 [P] [US3] Add align/justify tests to `packages/react/src/components/Inline/__tests__/Inline.test.tsx`: each align value maps to correct class (via `alignItemsClass`), each justify value maps to correct class (via `justifyContentClass`), omitted align/justify produces no utility classes, TypeScript rejects invalid align/justify values
- [x] T014 [P] [US3] Add align tests to `packages/react/src/components/Cluster/__tests__/Cluster.test.tsx`: each align value maps to correct SCSS modifier class (`.pathable-cluster--align-start`, `--align-center`, `--align-end`, `--align-stretch`, `--align-baseline`), omitted align produces no modifier class (SCSS default `center` takes effect), TypeScript rejects invalid align values

### Implementation for User Story 3

- [x] T015 [US3] Add `align` and `justify` props to Inline in `packages/react/src/components/Inline/Inline.tsx`: import `alignItemsClass`, `justifyContentClass`, add props to `InlineProps`, resolve classes before consumer `className` in `mergeClasses` call
- [x] T016 [US3] Add `align` prop to Cluster in `packages/react/src/components/Cluster/Cluster.tsx`: define `CLUSTER_ALIGN_CLASS` record mapping AlignItems values to `.pathable-cluster--align-{value}` modifier classes, resolve before consumer `className` in `mergeClasses` call
- [x] T017 [US3] Verify all US3 tests pass

**Checkpoint**: Both components accept `align`; Inline accepts `justify`; classes map correctly.

---

## Phase 5: User Story 4 — Sizing & Spacing (P2)

**Goal**: Add sizing (`width`, `maxWidth`) and spacing (`margin`, `marginX`, `marginY`, directional) props from the shared capability system to both components.

**Independent Test**: Render `<Inline width="full" maxWidth="desktop" marginX="auto" gap="sm">` and verify sizing and spacing classes on the root element.

### Tests for User Story 4

- [x] T018 [P] [US4] Add sizing/spacing tests to Inline tests: width, maxWidth, marginX, margin, marginY, marginTop, marginBottom each map to correct utility classes; combined sizing+spacing+gap+align all on same root element; omitted sizing/spacing produce no utility classes; padding props are type-blocked
- [x] T019 [P] [US4] Add sizing/spacing tests to Cluster tests: same coverage as Inline (width, maxWidth, all margin variants, combined, omitted, padding type-blocked)

### Implementation for User Story 4

- [x] T020 [US4] Add sizing and spacing to Inline in `packages/react/src/components/Inline/Inline.tsx`: import `widthClass`, `maxWidthClass`, margin resolver functions; extend `InlineProps` with `Omit<SizingProps & SpacingProps, 'padding' | 'paddingX' | 'paddingY'>` with `@deprecated never` on padding props; resolve sizing/spacing classes before consumer `className`
- [x] T021 [US4] Add sizing and spacing to Cluster in `packages/react/src/components/Cluster/Cluster.tsx`: same pattern as Inline — import resolvers, extend props interface with padding exclusions, resolve in mergeClasses
- [x] T022 [US4] Verify all US4 tests pass
- [x] T023 [US4] Add SSR parity tests to both Inline and Cluster test files: render with `renderToString` for key prop combinations (gap+align+justify+sizing), verify server output matches client output

**Checkpoint**: Both components accept sizing and spacing props; test coverage includes combined props and SSR parity.

---

## Phase 6: User Story 5 — Polymorphic as Prop (P3)

**Goal**: Support `as` prop on both components for semantic HTML element overrides.

**Independent Test**: Render `<Inline as="nav" gap="sm">` and verify `<nav>` element output. Render `<Cluster as="ul" gap="sm"><li>A</li></Cluster>` and verify `<ul>` output.

### Tests for User Story 5

- [x] T024 [P] [US5] Add `as` prop tests to Inline tests: `as="section"`, `as="nav"`, omitted `as` defaults to `<div>`
- [x] T025 [P] [US5] Add `as` prop tests to Cluster tests: `as="ul"` with `<li>` children, `as="section"`, omitted `as` defaults to `<div>`

### Implementation for User Story 5

- [x] T026 [US5] Verify Inline already has `as` support from the polymorphic pattern established in US1 (inner function destructures `as`, `const Component = as ?? 'div'`, `<Component ...>`). If not, add it now following the Container pattern.
- [x] T027 [US5] Verify Cluster already has `as` support from US2. If not, add it now.
- [x] T028 [US5] Verify all US5 tests pass

**Checkpoint**: Both components render the correct element for each `as` value.

---

## Phase 7: User Story 6 — className & Ref Forwarding (P3)

**Goal**: Verify consumer `className` appends correctly after component classes, and ref forwarding works for all `as` values.

**Independent Test**: Render `<Inline gap="sm" className="my-inline">` and verify class order. Pass a ref and verify it references the root element.

### Tests for User Story 6

- [x] T029 [P] [US6] Add className composition tests to Inline tests: class ordering (base → gap → align/justify → sizing → spacing → consumer className), consumer className appears last
- [x] T030 [P] [US6] Add className composition tests to Cluster tests: class ordering (base → gap → align → sizing → spacing → consumer className)
- [x] T031 [P] [US6] Add ref forwarding tests to Inline tests: ref to default `<div>`, ref to `<section>` via `as="section"`
- [x] T032 [P] [US6] Add ref forwarding tests to Cluster tests: ref to default `<div>`, ref to `<ul>` via `as="ul"`
- [x] T033 [P] [US6] Add edge case tests to both test files: empty children renders root element correctly, native HTML attributes (`id`, `data-*`, `aria-*`) pass through, wrapper element between component and children (becomes sole flex child — document as correct CSS behavior)

### Implementation for User Story 6

- [x] T034 [US6] Verify class ordering in both Inline.tsx and Cluster.tsx: ensure `mergeClasses` call places consumer `className` as the final argument after all resolved component classes
- [x] T035 [US6] Verify ref forwarding in both components: confirm `forwardRef<HTMLElement, Props>(InnerFn)` pattern passes ref to the root `<Component>` element
- [x] T036 [US6] Verify all US6 tests pass

**Checkpoint**: Consumer className composes correctly, ref forwarding works, edge cases covered.

---

## Phase 8: User Story 7 — Storybook Documentation (P3)

**Goal**: Add Storybook stories for Inline and Cluster demonstrating each supported gap value, alignment/justification combinations, wrapping behavior, and nested layouts.

**Independent Test**: Open Inline and Cluster Storybook stories and verify each supported configuration renders correctly.

### Implementation for User Story 7

- [x] T037 [P] [US7] Create Inline Storybook stories in `packages/react/src/stories/components/Inline/Inline.stories.tsx`: Default story (no props, 3 children), one story per gap value (GapSmall, GapMedium, GapLarge, GapExtraLarge), AlignCenter story, AlignStart story, JustifyBetween story, FullWidthCentered story (combined width/maxWidth/marginX), NestedLayout story (Inline inside Stack)
- [x] T038 [P] [US7] Create Cluster Storybook stories in `packages/react/src/stories/components/Cluster/Cluster.stories.tsx`: Default story (no props, 3 children), one story per gap value (GapSmall, GapMedium, GapLarge, GapExtraLarge), AlignStart story, AlignCenter story, ResponsiveWrapping story (constrained container showing items wrapping to new lines), NestedLayout story (Cluster inside Container)
- [x] T039 [US7] Verify Storybook builds and stories render: `pnpm --filter @pathable/react build-storybook`

**Checkpoint**: Storybook documentation complete with all required stories; stories pass automated checks.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, CI verification, and agent context update.

- [x] T040 Build the full React package: `pnpm --filter @pathable/react build`
- [x] T041 Run full test suite: `pnpm --filter @pathable/react test`
- [x] T042 Run CI gates: lint, type-check, and format check — ensure no new suppressions
- [x] T043 Update `AGENTS.md` agent context between `<!-- SPECKIT START -->` and `<!-- SPECKIT END -->` markers to point to `specs/049-inline-cluster-primitives/plan.md` with Inline/Cluster context summary

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Styles Foundation)**: No dependencies — can start immediately. BLOCKS Phase 2–9.
- **Phase 2 (US1: Inline Gap)**: Depends on Phase 1 (SCSS must be built). No dependency on Phase 3.
- **Phase 3 (US2: Cluster Gap)**: Depends on Phase 1. Independent of Phase 2.
- **Phase 4 (US3: Align & Justify)**: Depends on Phase 2 (Inline exists) and Phase 3 (Cluster exists).
- **Phase 5 (US4: Sizing & Spacing)**: Depends on Phase 2 + 3. Independent of Phase 4 in file terms but logically depends on components existing with basic props.
- **Phase 6 (US5: as Prop)**: Depends on Phase 2 + 3. Usually already built as part of the base component pattern.
- **Phase 7 (US6: className & Ref)**: Depends on Phase 2 + 3. Validates existing patterns; may not require new implementation code.
- **Phase 8 (US7: Storybook)**: Depends on Phase 2–7 (all props must exist for stories).
- **Phase 9 (Polish)**: Depends on all prior phases.

### Within Each Phase

- Tests BEFORE implementation (TDD: write failing tests first)
- Implementation files before export registration
- Verify tests pass after implementation

### Parallel Opportunities

- **Phase 1**: T001, T002, T003 can be created concurrently (separate files), but T004 (build) must run after all three
- **Phase 2 + 3**: Entirely independent — Inline and Cluster can be developed in parallel
- **Phase 4**: T013 and T014 (tests for both components), T015 and T016 (implementations for both components) can run in parallel
- **Phase 5**: T018 and T019 (tests), T020 and T021 (implementations)
- **Phase 6**: T024 and T025 (tests)
- **Phase 7**: T029–T033 (all tests) can run in parallel
- **Phase 8**: T037 and T038 (both Storybook files) can be created in parallel

---

## Parallel Example: Phase 1 Styles

```bash
# Create all three SCSS files concurrently (different files, no dependencies between them):
Task: "Create Inline SCSS contract in packages/styles/src/pathable-component-wrappers/pathable-inline.scss"
Task: "Add --gap-xl and --align-baseline to packages/styles/src/pathable-component-wrappers/pathable-cluster.scss"
Task: "Add @forward 'pathable-inline' to packages/styles/src/pathable-component-wrappers/pathable-layout-composition.scss"
# Then build: pnpm --filter @pathable/styles build
```

## Parallel Example: Phase 2 + 3 (Inline and Cluster in Parallel)

```bash
# After Phase 1 completes, Inline (Phase 2) and Cluster (Phase 3) can be developed simultaneously:
# Developer A: Inline
Task: "T005 Write Inline gap tests"
Task: "T006 Implement Inline.tsx (gap only)"
Task: "T007 Export Inline from index.ts"
Task: "T008 Verify Inline tests pass"

# Developer B: Cluster (parallel with A)
Task: "T009 Write Cluster gap tests"
Task: "T010 Implement Cluster.tsx (gap only)"
Task: "T011 Export Cluster from index.ts"
Task: "T012 Verify Cluster tests pass"
```

---

## Implementation Strategy

### MVP First (Phase 1 + 2)

1. Complete Phase 1: Styles Foundation (SCSS contracts)
2. Complete Phase 2: User Story 1 (Inline with gap)
3. **STOP and VALIDATE**: `<Inline gap="sm">` renders correctly, tests pass
4. This is a shippable MVP — the Inline primitive with gap control

### Incremental Delivery

1. Phase 1 (Styles) → Foundation ready
2. Phase 2 (Inline gap) → Test independently → Inline MVP!
3. Phase 3 (Cluster gap) → Test independently → Cluster MVP!
4. Phase 4 (Align & Justify) → Both components gain alignment
5. Phase 5 (Sizing & Spacing) → Both components participate in parent layouts
6. Phase 6–7 (as, className, ref) → Standard React contracts verified
7. Phase 8 (Storybook) → Documentation complete
8. Phase 9 (Polish) → CI passes, context updated

### Parallel Team Strategy

With two developers after Phase 1:

1. Developer A: Inline (Phase 2 → 4 → 6)
2. Developer B: Cluster (Phase 3 → 4 → 6)
3. Developer A or B: Storybook (Phase 8) once both components have all props