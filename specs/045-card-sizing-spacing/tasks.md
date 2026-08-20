# Tasks: Card Sizing and Spacing Props

**Input**: Design documents from `specs/045-card-sizing-spacing/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — the spec and plan require component tests proving supported props affect the owned root element, no wrappers introduced, and className composition order.

**Organization**: Tasks are grouped by user story to enable independent testing of each story. Card implementation is in the Foundational phase since it's a single-file change shared by all stories.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a monorepo package change within `packages/react`:

```text
packages/react/src/
├── components/Card/
│   ├── Card.tsx                         # Implementation (modified)
│   └── __tests__/
│       └── Card.sizingSpacing.test.tsx  # Component tests (new)
├── internal/resolvers/
│   └── spacing.ts                       # Resolver (modified: add auto)
└── stories/components/Basic/
    └── Card.stories.tsx                 # Stories (modified)
```

---

## Phase 1: Setup (Prerequisites)

**Purpose**: Verify the foundation (slice 01) is in place and styles are built

- [x] T001 Verify `packages/react/src/internal/resolvers/` contains working `SizingProps`, `SpacingProps`, `widthClass`, `maxWidthClass`, `marginAllClass`, `marginXClass`, `marginYClass`, `marginTopClass`, `marginBottomClass`, and `mergeClasses`. If not present or incomplete, report blocker — the semantic-prop foundation (slice 01) must be complete first.
- [x] T002 [P] Run `pnpm --filter @pathable/styles build` to ensure required CSS utility classes (`pathable-width-*`, `pathable-maxw-*`, `pathable-margin-*`) are present in dist output.
- [x] T003 [P] Run `pnpm --filter @pathable/react build` to confirm the React package builds cleanly from its current state before any changes.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add `auto` support to margin resolvers and implement all semantic prop support in Card. All user stories depend on this phase.

**⚠️ CRITICAL**: No user story test/story work can begin until this phase is complete.

- [x] T004 Add `'auto'` to the `MARGIN_MAP` and `MARGIN_X_MAP` constant objects in `packages/react/src/internal/resolvers/spacing.ts`, mapping to `'pathable-margin-auto'` and `'pathable-margin-x-auto'` respectively. Do NOT add `auto` to `MARGIN_Y_MAP`, `MARGIN_TOP_MAP`, or `MARGIN_BOTTOM_MAP` — `auto` only applies to full and horizontal margin.
- [x] T005 Extend the `SpacingScale` type (or introduce a separate `MarginScale`) in `packages/react/src/internal/resolvers/spacing.ts` so that `marginAllClass` and `marginXClass` accept `'auto'` while maintaining type safety. Update the resolver barrel `packages/react/src/internal/resolvers/index.ts` if a new type is exported.
- [x] T006 Update existing resolver unit tests in `packages/react/src/internal/resolvers/__tests__/spacing.test.ts` to cover `auto` for `marginAllClass` and `marginXClass`, and confirm `auto` is rejected for `marginYClass`, `marginTopClass`, `marginBottomClass`.
- [x] T007 In `packages/react/src/components/Card/Card.tsx`, import `SizingProps`, `SpacingProps`, `widthClass`, `maxWidthClass`, `marginAllClass`, `marginXClass`, `marginYClass`, `marginTopClass`, `marginBottomClass` from the internal resolver barrel, and import `mergeClasses` from `../../internal/resolvers/mergeClasses`.
- [x] T008 Extend the `CardProps` interface in `packages/react/src/components/Card/Card.tsx` to extend `SizingProps` and `SpacingProps` in addition to the existing `Omit<HTMLAttributes<HTMLDivElement>, 'title'>`.
- [x] T009 Destructure the new semantic props (`width`, `maxWidth`, `margin`, `marginX`, `marginY`, `marginTop`, `marginBottom`) from the Card props in `packages/react/src/components/Card/Card.tsx` so they are separated from `...rest`.
- [x] T010 Replace Card's manual class concatenation (the `const classes = ['pathable-card', presentationClass, className].filter(Boolean).join(' ')` pattern in BOTH return branches) with a `mergeClasses()` call following the documented order: `'pathable-card'` → presentation class → resolved semantic classes → consumer `className`. Per the conflict policy, call directional margin resolvers AFTER shorthand margin resolvers (e.g., `marginAllClass(margin)` before `marginTopClass(marginTop)`). Use a single `const classes = mergeClasses(...)` variable shared by both return branches.
- [x] T011 [P] Verify that both Card render branches (workflow and non-workflow) in `packages/react/src/components/Card/Card.tsx` use the same `classes` variable on the root `<div>`. The Card's internal DOM structure must not change — only the root element's class attribute gains semantic classes.

**Checkpoint**: Foundation ready — Card now accepts `width`, `maxWidth`, `margin`, `marginX`, `marginY`, `marginTop`, `marginBottom` props. User story test/story implementation can now begin.

---

## Phase 3: User Story 1 - Apply Width and Max-Width Constraints to a Card (Priority: P1) 🎯 MVP

**Goal**: Prove that `<Card width="full" />` and `<Card maxWidth="tablet" />` render the correct CSS classes on the root element with no extra wrappers, and that server/client output is identical.

**Independent Test**: Render `<Card width="full" maxWidth="tablet" />` and verify the root element carries `pathable-width-full` and `pathable-maxw-tablet` classes with no extra wrapper DOM elements.

### Tests for User Story 1

- [x] T012 [P] [US1] Create component test file `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx` with a describe block for "Sizing props (US1)".
- [x] T013 [P] [US1] Add test: `<Card width="full" />` renders root `<div>` with `pathable-width-full` class and exactly one root element (no wrapper children) in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T014 [P] [US1] Add test: `<Card width="auto" />` renders root with `pathable-width-auto` class in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T015 [P] [US1] Add test: `<Card maxWidth="tablet" />` renders root with `pathable-maxw-tablet` class in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T016 [P] [US1] Add test: `<Card maxWidth="desktop" />` renders root with `pathable-maxw-desktop` class in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T017 [P] [US1] Add test: `<Card width="full" maxWidth="tablet" />` renders root with both `pathable-width-full` and `pathable-maxw-tablet` classes in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T018 [US1] Add test: Card with no sizing props renders identically to current behavior (no unexpected classes, existing `pathable-card` class preserved, no DOM structure change) in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T019 [US1] Add test: Card ref forwarding still works when sizing props are present — `ref.current` points to root `<div>` in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.

### Stories for User Story 1

- [x] T020 [P] [US1] Add `Sizing` story: `<Card width="full" />` — full-width card fixture in `packages/react/src/stories/components/Basic/Card.stories.tsx`.
- [x] T021 [P] [US1] Add `MaxWidthTablet` story: `<Card maxWidth="tablet" />` — tablet-constrained card fixture in `packages/react/src/stories/components/Basic/Card.stories.tsx`.
- [x] T022 [P] [US1] Add `MaxWidthDesktop` story: `<Card maxWidth="desktop" />` — desktop-constrained card fixture in `packages/react/src/stories/components/Basic/Card.stories.tsx`.

**Checkpoint**: Width and max-width props are proven through tests and stories. Card constrains its width without wrappers.

---

## Phase 4: User Story 2 - Apply External Spacing to a Card (Priority: P2)

**Goal**: Prove that `<Card marginX="auto" />`, `<Card marginY="4" />`, and `<Card marginTop="2" marginBottom="6" />` render the correct margin classes on the root element.

**Independent Test**: Render `<Card marginX="auto" marginBottom="4" />` and verify the root element carries `pathable-margin-x-auto` and `pathable-margin-bottom-4` classes.

### Tests for User Story 2

- [x] T023 [P] [US2] Add test: `<Card marginX="auto" />` renders root with `pathable-margin-x-auto` class in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T024 [P] [US2] Add test: `<Card marginX="4" />` renders root with `pathable-margin-x-4` class in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T025 [P] [US2] Add test: `<Card marginY="4" />` renders root with `pathable-margin-y-4` class in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T026 [P] [US2] Add test: `<Card margin="2" />` renders root with `pathable-margin-2` class in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T027 [P] [US2] Add test: `<Card marginTop="2" marginBottom="6" />` renders root with both `pathable-margin-top-2` and `pathable-margin-bottom-6` classes in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T028 [US2] Add test: When both `margin="2"` and `marginTop="4"` are specified, both classes appear in the output and `marginTop` class appears AFTER `margin` class (directional wins on cascade) in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T029 [US2] Add test: `<Card maxWidth="tablet" marginX="auto" />` renders exactly one root element with both classes and no child wrapper in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.

### Stories for User Story 2

- [x] T030 [P] [US2] Add `Centered` story: `<Card maxWidth="tablet" marginX="auto" />` — centered, constrained card fixture in `packages/react/src/stories/components/Basic/Card.stories.tsx`.
- [x] T031 [P] [US2] Add `WithMargins` story: `<Card marginTop="4" marginBottom="8" />` — directional margin fixture in `packages/react/src/stories/components/Basic/Card.stories.tsx`.
- [x] T032 [US2] Add a composition story showing `<Card maxWidth="tablet" marginX="auto" />` inside a parent container to demonstrate the centering pattern visually in `packages/react/src/stories/components/Basic/Card.stories.tsx`.

**Checkpoint**: External spacing props are proven through tests and stories. Card participates in layout with typed margin props.

---

## Phase 5: User Story 3 - Consumer className Composes Correctly with Semantic Props (Priority: P3)

**Goal**: Prove that consumer `className` appends after semantic classes and that all three class sources (required, semantic, consumer) appear in correct order.

**Independent Test**: Render `<Card width="full" className="my-custom" />` and verify the root element's class string contains `pathable-card`, `pathable-width-full`, and `my-custom` in that relative order.

### Tests for User Story 3

- [x] T033 [P] [US3] Add test: `<Card width="full" className="my-custom" />` root element class attribute contains `pathable-card`, `pathable-width-full`, and `my-custom` in that relative order in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T034 [P] [US3] Add test: `<Card maxWidth="desktop" className="my-app-card" />` root element class attribute contains both `pathable-maxw-desktop` and `my-app-card` in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T035 [P] [US3] Add test: `<Card marginX="auto" className="center-card" />` root element class attribute contains both `pathable-margin-x-auto` and `center-card` in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T036 [US3] Add test: Card with only `className` and no semantic props renders identically to current behavior (backward compatibility) in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.
- [x] T037 [US3] Add server-rendering test: Use `renderToString` from `react-dom/server` to render `<Card width="full" marginX="auto" className="my-custom" />` and verify the output matches client-rendered HTML (same classes, same order, same DOM structure) in `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`.

### Stories for User Story 3

- [x] T038 [US3] Add `WithCustomClass` story: `<Card width="full" className="custom-card" />` — demonstrates className composition fixture in `packages/react/src/stories/components/Basic/Card.stories.tsx`.

**Checkpoint**: Class composition is proven — semantic props and consumer `className` compose correctly in the documented order.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation gates, existing behavior preservation, and final verification

- [x] T039 Run all Card component tests: `pnpm --filter @pathable/react test -- --run packages/react/src/components/Card/` and confirm all pass (existing + new).
- [x] T040 Run all resolver unit tests: `pnpm --filter @pathable/react test -- --run packages/react/src/internal/resolvers/` and confirm no regressions.
- [x] T041 Run TypeScript type check: `pnpm --filter @pathable/react tsc --noEmit` and fix any type errors.
- [x] T042 Run ESLint on modified files: `pnpm --filter @pathable/react lint` and fix all findings without disabling, weakening, or skipping rules.
- [x] T043 Run Prettier on modified files: `pnpm --filter @pathable/react format:check` and format if needed.
- [x] T044 Run `pnpm --filter @pathable/react build` to confirm the React package builds with the Card changes.
- [x] T045 Verify Storybook builds and renders Card stories: `pnpm --filter @pathable/react storybook` (smoke test) OR `pnpm test:storybook` if the Storybook test runner is configured. Confirm no a11y violations are introduced on Card stories.
- [x] T046 [P] Verify existing Card behavior is preserved: all existing presentations (base, media, flag, header-first, workflow) continue to render with their expected classes and structure — run existing Card stories to confirm.
- [x] T047 Follow the quickstart.md validation guide at `specs/045-card-sizing-spacing/quickstart.md` to confirm all validation scenarios pass end-to-end.
- [x] T048 Run `pnpm pack --dry-run` for `packages/react` (or equivalent package-content check) to confirm the built package still exports Card and its types correctly.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) — independent from US1
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) — independent from US1 and US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — independent test: width/max-width classes only
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — independent test: margin classes only. Depends on T004-T006 (auto margin support in resolvers)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — independent test: class merge order. No dependency on US1 or US2

### Parallel Opportunities

- All Phase 1 tasks (T001, T002, T003) are independent and can run in parallel
- Within Phase 2, T004-T006 (resolver auto support) are sequential among themselves but T011 (verify both branches) is independent
- Once Phase 2 completes, Phase 3, 4, and 5 can start in parallel
- Within each story phase, all test tasks marked [P] can run in parallel
- Within each story phase, all story tasks marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup — verify foundation exists
2. Complete Phase 2: Foundational — implement all props in Card + auto margin support
3. Complete Phase 3: User Story 1 — prove width/max-width works
4. **STOP and VALIDATE**: Width/max-width constraint is proven, stories render, no wrappers
5. This is a viable MVP — developers can constrain Card width with typed props

### Incremental Delivery

1. Setup + Foundational (T001-T011) → Card accepts all props
2. Add US1 tests/stories (T012-T022) → Width constraint proven (MVP!)
3. Add US2 tests/stories (T023-T032) → Margin spacing proven
4. Add US3 tests/stories (T033-T038) → Class composition proven
5. Polish (T039-T048) → All gates pass, ready to merge
6. Each story adds proven capability without breaking previous stories

---

## Notes

- [P] tasks = different files or independent test cases within same file
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable — the implementation is shared (Phase 2), the proof is per-story
- All component tests go in one file (`Card.sizingSpacing.test.tsx`) to keep them together; each story phase adds its set of tests
- All stories go in the existing `Card.stories.tsx` file; each story phase adds its set of stories
- Avoid: disabling, weakening, skipping, or silencing lint checks
- Avoid: adding wrapper DOM elements — all semantic classes apply to the existing root `<div>`
- The Card's two render branches (workflow and non-workflow) must both receive the new semantic props on their root
- Server-rendered output matches client-rendered output — resolvers are pure, so this is guaranteed by design; T037 proves it