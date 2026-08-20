# Tasks: Form Controls and Button Adopt Sizing Props

**Input**: Design documents from `specs/046-form-control-button-sizing/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED — the feature spec (FR-014) mandates component tests confirming correct class output and absence of wrapper elements.

**Organization**: Tasks are grouped by component within each user story. Each story's implementation spans all 4 components.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify prerequisites and ensure the foundation is ready

- [ ] T001 Verify `@pathable/styles` build output includes `pathable-width-full`, `pathable-width-auto`, and `pathable-maxw-{mobile,mobile-lg,tablet,desktop}` classes; run `pnpm --filter @pathable/styles build`
- [ ] T002 Verify the semantic-prop resolver layer exports `widthClass`, `maxWidthClass`, and `mergeClasses` from `packages/react/src/internal/resolvers/index.ts` and they are importable from component code
- [ ] T003 Verify the existing Card sizing test at `packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx` passes as a regression check — run `pnpm --filter @pathable/react test -- --run packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx`

**Checkpoint**: Foundation verified — resolver layer and CSS class contracts confirmed ready. No new resolver code or styles changes needed.

---

## Phase 2: Foundational — Component Markup Audit

**Purpose**: Confirm root elements and class construction patterns for each target component before modification

**⚠️ CRITICAL**: This audit validates assumptions before any component code is changed

- [ ] T004 [P] Audit `Button` markup at `packages/react/src/components/Button/Button.tsx` — confirm root element is `<button type="button">`, class construction uses `[].filter(Boolean).join(' ')`, note that ref forwarding is not currently used, and confirm no wrapper elements exist
- [ ] T005 [P] Audit `Input` markup at `packages/react/src/components/Input/Input.tsx` — confirm root element is `<input>`, class construction uses template literal with `.trim()`, note `children` is explicitly rejected via `_children` discard
- [ ] T006 [P] Audit `Select` markup at `packages/react/src/components/Select/Select.tsx` — confirm root element is `<select>`, class construction uses template literal with `.trim()`, children render `<option>` elements as passed
- [ ] T007 [P] Audit `Textarea` markup at `packages/react/src/components/Textarea/Textarea.tsx` — confirm root element is `<textarea>`, class construction uses template literal with `.trim()`, note `children` is explicitly rejected

**Checkpoint**: Markup audit complete — all 4 components confirmed safe for sizing-prop addition. No composite or multi-root components in scope.

---

## Phase 3: User Story 1 — Set Full-Width on a Form Control (Priority: P1) 🎯 MVP

**Goal**: Add `width` and `maxWidth` semantic sizing props to all 4 components (`Button`, `Input`, `Select`, `Textarea`). Developers can pass `width="full"` and `maxWidth="tablet"` as typed props with autocompletion.

**Independent Test**: Render `<Input width="full" />` and verify the root `<input>` element carries the `pathable-width-full` class with no additional wrapper DOM element. All existing component behavior is preserved.

### Tests for User Story 1

- [ ] T008 [P] [US1] Create `Button.sizing.test.tsx` at `packages/react/src/components/Button/__tests__/Button.sizing.test.tsx` — cover: width="full" → `pathable-width-full`, width="auto" → `pathable-width-auto`, maxWidth="tablet" → `pathable-maxw-tablet`, maxWidth="desktop" → `pathable-maxw-desktop`, both props together, single root element, class order, SSR parity with `renderToString`
- [ ] T009 [P] [US1] Create `Input.sizing.test.tsx` at `packages/react/src/components/Input/__tests__/Input.sizing.test.tsx` — cover: same test categories as Button, plus verify `children` rejection preserved
- [ ] T010 [P] [US1] Create `Select.sizing.test.tsx` at `packages/react/src/components/Select/__tests__/Select.sizing.test.tsx` — cover: same test categories, plus verify children (`<option>` elements) render correctly with sizing classes
- [ ] T011 [P] [US1] Create `Textarea.sizing.test.tsx` at `packages/react/src/components/Textarea/__tests__/Textarea.sizing.test.tsx` — cover: same test categories, plus verify `children` rejection preserved

### Implementation for User Story 1 — Button

- [ ] T012 [US1] Extend `ButtonProps` with `SizingProps` in `packages/react/src/components/Button/Button.tsx` — add `import { SizingProps } from '../../internal/resolvers/types'` and `import { mergeClasses, widthClass, maxWidthClass } from '../../internal/resolvers'`, then change `interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>` to also extend `SizingProps`
- [ ] T013 [US1] Destructure `width` and `maxWidth` from props in `packages/react/src/components/Button/Button.tsx` — extract `width`, `maxWidth` alongside existing destructured props (`children`, `variant`, `size`, `className`, `...rest`); do not spread them as native HTML attributes
- [ ] T014 [US1] Replace manual class construction with `mergeClasses` in `packages/react/src/components/Button/Button.tsx` — change from `[].filter(Boolean).join(' ')` to `mergeClasses('pathable-button', variantClass, sizeClass, widthClass(width), maxWidthClass(maxWidth), className)`

### Implementation for User Story 1 — Input

- [ ] T015 [US1] Extend `InputProps` with `SizingProps` in `packages/react/src/components/Input/Input.tsx` — add imports for `SizingProps`, `mergeClasses`, `widthClass`, `maxWidthClass` from the internal resolvers; change the type definition to `export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'children'> & SizingProps`
- [ ] T016 [US1] Destructure `width` and `maxWidth` from props in `packages/react/src/components/Input/Input.tsx` — extract alongside `className`, `children: _children`, `...rest`
- [ ] T017 [US1] Replace template-literal class construction with `mergeClasses` in `packages/react/src/components/Input/Input.tsx` — change from `` `${BASE_CLASS} ${className || ''}`.trim() `` to `mergeClasses('pathable-input', widthClass(width), maxWidthClass(maxWidth), className)`

### Implementation for User Story 1 — Select

- [ ] T018 [US1] Extend `SelectProps` with `SizingProps` in `packages/react/src/components/Select/Select.tsx` — add imports for `SizingProps`, `mergeClasses`, `widthClass`, `maxWidthClass`; change the type definition to extend `SizingProps`
- [ ] T019 [US1] Destructure `width` and `maxWidth` from props in `packages/react/src/components/Select/Select.tsx` — extract alongside `children`, `className`, `...rest`
- [ ] T020 [US1] Replace template-literal class construction with `mergeClasses` in `packages/react/src/components/Select/Select.tsx` — change from `` `${BASE_CLASS} ${className || ''}`.trim() `` to `mergeClasses('pathable-select', widthClass(width), maxWidthClass(maxWidth), className)`

### Implementation for User Story 1 — Textarea

- [ ] T021 [US1] Extend `TextareaProps` with `SizingProps` in `packages/react/src/components/Textarea/Textarea.tsx` — add imports for `SizingProps`, `mergeClasses`, `widthClass`, `maxWidthClass`; change the type definition to extend `SizingProps`
- [ ] T022 [US1] Destructure `width` and `maxWidth` from props in `packages/react/src/components/Textarea/Textarea.tsx` — extract alongside `className`, `children: _children`, `...rest`
- [ ] T023 [US1] Replace template-literal class construction with `mergeClasses` in `packages/react/src/components/Textarea/Textarea.tsx` — change from `` `${BASE_CLASS} ${className || ''}`.trim() `` to `mergeClasses('pathable-textarea', widthClass(width), maxWidthClass(maxWidth), className)`

**Checkpoint**: At this point, all 4 components accept `width` and `maxWidth` semantic props. Run tests (`pnpm --filter @pathable/react test -- --run packages/react/src/components/*/__tests__/*.sizing.test.tsx`) to verify correct class output and no wrapper elements.

---

## Phase 4: User Story 2 — Constrain Maximum Width (Priority: P2)

**Goal**: Confirm `maxWidth` prop works correctly across all components, enabling responsive-width forms where controls expand but don't exceed comfortable reading widths.

**Independent Test**: Render `<Button maxWidth="tablet" />` and verify the root element carries the `pathable-maxw-tablet` class. Render `<Select width="full" maxWidth="desktop" />` and verify both classes appear on the single root element.

**Note**: Implementation is complete from Phase 3 (US1 already added both `width` and `maxWidth`). This phase verifies and extends test coverage for `maxWidth`-specific scenarios.

### Tests for User Story 2

- [ ] T024 [P] [US2] Add `maxWidth`-specific test cases to `packages/react/src/components/Button/__tests__/Button.sizing.test.tsx` — cover all `MaxWidth` values: `mobile`, `mobile-lg`, `tablet`, `desktop`, and combined `width="full" maxWidth="tablet"`
- [ ] T025 [P] [US2] Add `maxWidth`-specific test cases to `packages/react/src/components/Input/__tests__/Input.sizing.test.tsx` — verify `<Input maxWidth="desktop" />` renders `pathable-maxw-desktop`, and `<Input width="full" maxWidth="mobile-lg" />` renders both classes
- [ ] T026 [P] [US2] Add `maxWidth`-specific test cases to `packages/react/src/components/Select/__tests__/Select.sizing.test.tsx` — verify `<Select width="full" maxWidth="desktop" />` renders both classes with no wrapper
- [ ] T027 [P] [US2] Add `maxWidth`-specific test cases to `packages/react/src/components/Textarea/__tests__/Textarea.sizing.test.tsx` — verify `<Textarea maxWidth="mobile-lg" />` renders `pathable-maxw-mobile-lg`

**Checkpoint**: At this point, `maxWidth` is fully covered with component tests across all 4 components. Both `width` and `maxWidth` props work individually and combined.

---

## Phase 5: User Story 3 — Consumer className Composes with Semantic Props (Priority: P2)

**Goal**: Ensure consumer `className` composes correctly with semantic sizing classes in the documented merge order across all components.

**Independent Test**: Render `<Button width="full" className="my-custom" />` and verify the root element's class string contains `pathable-button`, `pathable-width-full`, and `my-custom` in that relative order.

**Note**: `mergeClasses` already enforces the correct order. This phase adds explicit test assertions for the composition contract.

### Tests for User Story 3

- [ ] T028 [P] [US3] Add className composition tests to `packages/react/src/components/Button/__tests__/Button.sizing.test.tsx` — verify `<Button width="full" className="my-custom" />` class order: `pathable-button` before `pathable-width-full` before `my-custom`; verify `<Button className="my-custom" />` (no sizing) renders with `pathable-button` and `my-custom`
- [ ] T029 [P] [US3] Add className composition tests to `packages/react/src/components/Input/__tests__/Input.sizing.test.tsx` — verify `<Input maxWidth="tablet" className="form-input" />` includes both `pathable-maxw-tablet` and `form-input`
- [ ] T030 [P] [US3] Add className composition tests to `packages/react/src/components/Select/__tests__/Select.sizing.test.tsx` — verify class order in combined sizing + consumer className scenario
- [ ] T031 [P] [US3] Add className composition tests to `packages/react/src/components/Textarea/__tests__/Textarea.sizing.test.tsx` — verify class order with combined sizing + className

**Checkpoint**: ClassName composition contract verified across all 4 components. Consumer classes always appear last.

---

## Phase 6: User Story 4 — Documentation and Capability Matrix (Priority: P3)

**Goal**: Add Storybook sizing stories for each component and record support status in the capability matrix so developers can discover and understand the new props.

**Independent Test**: Open each component's Storybook and find a story demonstrating `width="full"`. Open the capability matrix and verify each component has `width` and `maxWidth` marked as supported.

### Storybook Stories

- [ ] T032 [P] [US4] Add `FullWidth` story to `packages/react/src/stories/components/Basic/Button.stories.tsx` — render `<Button width="full">Full Width Button</Button>` with a description explaining the prop replaces manual `className="pathable-width-full"` usage; add `width` and `maxWidth` to the `argTypes` object
- [ ] T033 [P] [US4] Add `FullWidth` story to `packages/react/src/stories/components/FormControls/Input.stories.tsx` — render `<Input width="full" placeholder="Full width input" />` with description
- [ ] T034 [P] [US4] Add `FullWidth` story to `packages/react/src/stories/components/FormControls/Select.stories.tsx` — render `<Select width="full">...</Select>` with description
- [ ] T035 [P] [US4] Add `FullWidth` story to `packages/react/src/stories/components/FormControls/Textarea.stories.tsx` — render `<Textarea width="full" placeholder="Full width textarea" />` with description

### Capability Matrix

- [ ] T036 [US4] Create or update component semantic-prop capability matrix in `packages/react/docs/` — add entries for Button, Input, Select, and Textarea with `width` and `maxWidth` columns marked as supported. Reference the existing `capability-inventory.md` CSS class inventory for the underlying class contracts. Document that `minWidth` is not yet supported (no CSS utility class exists).

### Storybook Validation

- [ ] T037 [US4] Verify Storybook a11y addon reports no new violations for the FullWidth sizing stories on Button, Input, Select, and Textarea; run `pnpm test:storybook` to confirm automated contract checks pass

**Checkpoint**: Documentation complete. Developers can discover sizing props in Storybook and the capability matrix. All stories render correctly and pass a11y/contract checks.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, regression checks, and CI readiness

- [ ] T038 Run the full component test suite: `pnpm --filter @pathable/react test` — confirm all new sizing tests and existing tests pass with no regressions
- [ ] T039 Run static accessibility linting (`eslint-plugin-jsx-a11y`) on modified component source files — verify no new findings; fix any violations without disabling rules
- [ ] T040 Run TypeScript type-check: `pnpm --filter @pathable/react tsc --noEmit` — verify no type errors
- [ ] T041 Run ESLint with `--max-warnings=0` on the React package — verify clean output
- [ ] T042 Run `pnpm --filter @pathable/react build` — verify the React package builds successfully
- [ ] T043 Run `pnpm --filter @pathable/styles build` — verify styles package builds successfully (unchanged, but confirm no regression)
- [ ] T044 Run `pnpm test:storybook` at root — verify all Storybook interaction and contract tests pass
- [ ] T045 Run quickstart validation scenarios from `specs/046-form-control-button-sizing/quickstart.md` — verify all end-to-end scenarios described in the quickstart work correctly
- [ ] T046 Verify server-rendered output matches client-rendered output for all new prop combinations on all 4 components — confirm SSR parity using `renderToString` in test assertions (already covered in component tests; re-verify)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) — BLOCKS US2, US3, US4
- **User Story 2 (Phase 4)**: Depends on US1 (Phase 3) — extends test coverage on already-implemented props
- **User Story 3 (Phase 5)**: Depends on US1 (Phase 3) — adds className composition tests on already-implemented components
- **User Story 4 (Phase 6)**: Depends on US1 (Phase 3) — Storybook stories and capability matrix require working components
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories — implements the core sizing props on all 4 components
- **US2 (P2)**: Depends on US1 — the `maxWidth` prop is already added in US1; this phase only adds test coverage
- **US3 (P2)**: Depends on US1 — className composition uses already-implemented `mergeClasses` calls
- **US4 (P3)**: Depends on US1 — Storybook stories and capability matrix require working components

### Within Each User Story

- Tests MUST be written BEFORE implementation (T008–T011 written before T012–T023)
- Within US1, component implementations can be done in any order: Button → Input → Select → Textarea (or in parallel)
- Test files (T008–T011) are fully parallelizable — all test different component files

### Parallel Opportunities

- **Phase 1**: All 3 tasks can run in parallel (different concerns)
- **Phase 2**: All 4 audit tasks can run in parallel (different components)
- **Phase 3 tests**: T008, T009, T010, T011 can all run in parallel (different test files)
- **Phase 3 component implementations**: T012–T014 (Button), T015–T017 (Input), T018–T020 (Select), T021–T023 (Textarea) — once tests are written, all 4 components can be implemented in parallel
- **Phase 4 tests**: T024–T027 all parallel
- **Phase 5 tests**: T028–T031 all parallel
- **Phase 6 stories**: T032–T035 all parallel (different story files)

---

## Parallel Example: User Story 1 — All Components

```bash
# Step 1: Launch all test files simultaneously
Task: "Create Button.sizing.test.tsx"
Task: "Create Input.sizing.test.tsx"
Task: "Create Select.sizing.test.tsx"
Task: "Create Textarea.sizing.test.tsx"

# Step 2: Once tests are ready, implement all components in parallel
Task: "Implement sizing props on Button (T012–T014)"
Task: "Implement sizing props on Input (T015–T017)"
Task: "Implement sizing props on Select (T018–T020)"
Task: "Implement sizing props on Textarea (T021–T023)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (audit markup)
3. Write tests for US1 (T008–T011)
4. Implement Button sizing (T012–T014) → test independently
5. Implement Input sizing (T015–T017) → test independently
6. Implement Select sizing (T018–T020) → test independently
7. Implement Textarea sizing (T021–T023) → test independently
8. **STOP and VALIDATE**: Run all sizing tests, verify `width="full"` works on all components
9. Build and type-check pass — MVP is deliverable

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 (all components with sizing) → Test → **MVP!**
3. Add US2 (maxWidth test coverage) → Test → Increment
4. Add US3 (className composition) → Test → Increment
5. Add US4 (Storybook + docs) → Test → Full feature complete
6. Polish → CI passes → Ready to merge

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. One developer writes all test files (T008–T011)
3. Once tests are ready, split component implementation:
   - Developer A: Button (T012–T014) + Button tests (T024, T028)
   - Developer B: Input (T015–T017) + Input tests (T025, T029)
   - Developer C: Select (T018–T020) + Select tests (T026, T030)
   - Developer D: Textarea (T021–T023) + Textarea tests (T027, T031)
4. Developer E: Storybook stories (T032–T035) + capability matrix (T036)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests must be written BEFORE implementation and verified to FAIL initially
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: adding visual behavior only inside a wrapper package before the corresponding `packages/styles` contract exists
- Avoid: disabling, weakening, skipping, or silencing lint checks
- The Card component (slice 02) at `packages/react/src/components/Card/Card.tsx` is the reference implementation — follow its pattern for `mergeClasses` usage, `SizingProps` extension, and test structure
- All sizing resolvers (`widthClass`, `maxWidthClass`) and `mergeClasses` are already implemented and tested — no resolver changes needed
- The `renders without crash` test must verify the root element's tag name matches the expected HTML element (e.g., `root.tagName` is `BUTTON`, `INPUT`, `SELECT`, or `TEXTAREA`) to confirm no wrapper element is introduced