# Tasks: Filterable Option List

**Input**: Design documents from `specs/064-filterable-option-list/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Required by the specification for state, filtering, accessibility,
forms, SSR/hydration, Storybook interaction, and package consumption.

## Phase 1: Setup (Shared Styles Contract)

**Purpose**: Establish the framework-neutral class and static story contract before React implementation.

- [x] T001 Add the `pathable-filterable-option-list` class contract in `packages/styles/src/pathable-component-wrappers/pathable-filterable-option-list.scss`
- [x] T002 Forward the new form-control stylesheet from `packages/styles/src/pathable-component-wrappers/pathable-form-controls.scss`
- [x] T003 Add deterministic static state stories in `packages/styles/src/stories/components/FormControls/FilterableOptionList.stories.ts`
- [x] T004 Register required fixed Styles stories in `packages/styles/scripts/storybook-coverage.mjs` and applicable visual/quality manifests

---

## Phase 2: Foundational (React Public Surface)

**Purpose**: Create the public types, semantic skeleton, export, and composite-field registration required by every user story.

**Critical**: Complete this phase before story-specific behavior.

- [x] T005 Define option, filtering, and props contracts in `packages/react/src/components/FilterableOptionList/FilterableOptionList.tsx`
- [x] T006 Implement fieldset, legend, filter, status, list, option details, and stable ID markup in `packages/react/src/components/FilterableOptionList/FilterableOptionList.tsx`
- [x] T007 Register FilterableOptionList as a FormGroup composite in `packages/react/src/components/FilterableOptionList/FilterableOptionList.tsx`
- [x] T008 Export FilterableOptionList and public types from `packages/react/src/index.ts`
- [x] T009 Add FormGroup composite ambiguity regression coverage in `packages/react/src/components/FormGroup/__tests__/FormGroup.test.tsx`

**Checkpoint**: Shared styles and the React semantic skeleton compile and expose the intended public API.

---

## Phase 3: User Story 1 - Filter and Select Catalog Options (Priority: P1) MVP

**Goal**: Locally filter a long catalog and select multiple options without losing hidden selections.

**Independent Test**: Filter dozens of options, select with pointer and Space,
change and clear the query, and verify visible results, focus, total selection,
disabled behavior, and hidden-selection retention.

### Tests for User Story 1

- [x] T010 [P] [US1] Add local filtering, query, empty, no-match, disabled, and status tests in `packages/react/src/components/FilterableOptionList/__tests__/FilterableOptionList.test.tsx`
- [x] T011 [P] [US1] Add uncontrolled selection, ordering, deduplication, hidden-selection, and invalid-ID tests in `packages/react/src/components/FilterableOptionList/__tests__/FilterableOptionList.test.tsx`

### Implementation for User Story 1

- [x] T012 [US1] Implement controlled/uncontrolled query and default/custom client matching in `packages/react/src/components/FilterableOptionList/FilterableOptionList.tsx`
- [x] T013 [US1] Implement uncontrolled selection transitions, stable deduplication, invalid-ID validation, and hidden-selection retention in `packages/react/src/components/FilterableOptionList/FilterableOptionList.tsx`
- [x] T014 [US1] Implement one visible polite status and distinct empty/no-match output in `packages/react/src/components/FilterableOptionList/FilterableOptionList.tsx`
- [x] T015 [US1] Complete scroll, wrapping, details, metadata, status, empty, disabled, narrow, increased-text, and forced-color styling in `packages/styles/src/pathable-component-wrappers/pathable-filterable-option-list.scss`

**Checkpoint**: The component independently delivers accessible local filtering and uncontrolled multi-selection.

---

## Phase 4: User Story 2 - Integrate Product-Owned Data and Filtering (Priority: P2)

**Goal**: Let applications own values, query, and externally filtered result sets while retaining absent selections.

**Independent Test**: Supply controlled query and values, replace options after
query callbacks, and verify no double filtering, immutable complete callback
payloads, retained absent IDs, and total counts.

### Tests for User Story 2

- [x] T016 [P] [US2] Add controlled selection and callback immutability/order tests in `packages/react/src/components/FilterableOptionList/__tests__/FilterableOptionList.test.tsx`
- [x] T017 [P] [US2] Add external filtering, controlled query, custom predicate, result replacement, and absent-selection tests in `packages/react/src/components/FilterableOptionList/__tests__/FilterableOptionList.test.tsx`

### Implementation for User Story 2

- [x] T018 [US2] Implement controlled selection and query precedence in `packages/react/src/components/FilterableOptionList/FilterableOptionList.tsx`
- [x] T019 [US2] Implement external filtering mode and consumer predicate behavior in `packages/react/src/components/FilterableOptionList/FilterableOptionList.tsx`

**Checkpoint**: Applications can integrate local policy or remote result sets without a separate interaction shell.

---

## Phase 5: User Story 3 - Submit and Understand the Selection Accessibly (Priority: P3)

**Goal**: Provide complete accessible descriptions, announcements, native form values, reset behavior, and SSR/hydration stability.

**Independent Test**: Render descriptions and metadata in a form, filter selected
options out, submit and reset, then verify names, descriptions, one status
channel, exact repeated values, restored defaults, SSR output, and hydration.

### Tests for User Story 3

- [x] T020 [P] [US3] Add accessible name, description, metadata, status, and multiple-instance ID tests in `packages/react/src/components/FilterableOptionList/__tests__/FilterableOptionList.test.tsx`
- [x] T021 [P] [US3] Add hidden-selection form submission, disabled submission, and native reset tests in `packages/react/src/components/FilterableOptionList/__tests__/FilterableOptionList.test.tsx`
- [x] T022 [P] [US3] Add SSR and hydration parity tests in `packages/react/src/components/FilterableOptionList/__tests__/FilterableOptionList.test.tsx`

### Implementation for User Story 3

- [x] T023 [US3] Implement description/meta relationships and collision-free generated IDs in `packages/react/src/components/FilterableOptionList/FilterableOptionList.tsx`
- [x] T024 [US3] Implement exact repeated hidden form values and native reset synchronization in `packages/react/src/components/FilterableOptionList/FilterableOptionList.tsx`

**Checkpoint**: The component has a complete accessible form and rendering contract.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete executable documentation, guidance, release metadata, and published-consumer proof.

- [x] T025 Add React Playground and fixed behavior/state stories with `client-ssr` classification in `packages/react/src/stories/components/FormControls/FilterableOptionList.stories.tsx`
- [x] T026 Add browser interaction coverage for filtering, Space toggling, focus, retained selections, status, form submit, and reset in `packages/react/src/stories/components/FormControls/FilterableOptionList.stories.tsx`
- [x] T027 Document API, usage boundaries, filtering modes, form behavior, and accessibility in `packages/react/README.md`
- [x] T028 Update component selection and accessibility guidance in `packages/react/agent-guidance/pathable-react/SKILL.md`
- [x] T029 Add FilterableOptionList to inherent client behavior guidance in `packages/react/agent-guidance/pathable-react/references/server-and-client.md`
- [x] T030 Add a minor `@pathableai/react` and `@pathableai/styles` release note in `.changeset/`
- [x] T031 Validate styles, React tests/build/types/package, both Storybooks, browser/axe, visual/coverage/quality, server audit, agent guidance, changeset, and packed consumers using `specs/064-filterable-option-list/quickstart.md`
- [x] T032 Rebase the stacked branch onto `main` after PR #243 lands and verify the final issue #235 diff contains no unrelated predecessor commits

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: Starts immediately and establishes Styles-first ownership.
- **Phase 2**: Depends on Phase 1's class and semantic contract.
- **User Story 1**: Depends on Phase 2 and forms the MVP.
- **User Story 2**: Depends on User Story 1's state primitives.
- **User Story 3**: Depends on User Story 1's selection model; its tests can be prepared alongside User Story 2.
- **Polish**: Depends on all implemented user stories.
- **Final rebase**: Depends on PR #243 landing and is not required for local implementation on the stacked branch.

### User Story Dependencies

- **US1**: No dependency beyond foundational work.
- **US2**: Extends US1 state and filtering, but remains independently testable through controlled examples.
- **US3**: Uses US1 selection state and can proceed in parallel with US2 after the selection model stabilizes.

### Parallel Opportunities

- T003 can proceed while T001 is drafted once class names are agreed.
- T010 and T011 are parallel test groups before T012-T015.
- T016 and T017 are parallel controlled/external test groups.
- T020, T021, and T022 are parallel accessibility, form, and rendering test groups.
- T027, T028, T029, and T030 touch independent documentation/release files.

## Parallel Example: User Story 3

```text
Task T020: Accessible relationships and ID tests
Task T021: Form submission and reset tests
Task T022: SSR and hydration tests
```

## Implementation Strategy

### MVP First

1. Complete the shared Styles contract and React foundation.
2. Complete User Story 1 with local filtering and uncontrolled selection.
3. Validate unit, keyboard, and static visual behavior.
4. Continue with external control and form integration without redesigning the core.

### Incremental Delivery

1. Styles-first static contract.
2. Semantic React shell and exports.
3. Local filtering and selection MVP.
4. Controlled and external integration.
5. Accessible form, reset, and rendering guarantees.
6. Stories, docs, guidance, release metadata, and full validation.

## Format Validation

All tasks use the required checkbox, sequential task ID, optional parallel marker,
user-story label where applicable, actionable description, and exact file path.
