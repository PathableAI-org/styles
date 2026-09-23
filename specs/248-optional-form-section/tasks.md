# Tasks: Optional Form Section

**Input**: Design documents from `specs/248-optional-form-section/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Required by the specification for disclosure state, keyboard/focus,
form behavior, SSR/hydration, accessibility, responsive states, and package
consumption. Implementation and validation are complete; all tasks below are
checked.

## Phase 1: Setup (Shared Styles Contract)

**Purpose**: Establish framework-neutral classes and deterministic static
semantic examples before React implementation.

- [x] T001 Add the `pathable-optional-form-section` root, heading, button, content, focus, wrapping, disclosure-indicator, hidden, and forced-colors class contract without animation in `packages/styles/src/pathable-component-wrappers/pathable-optional-form-section.scss`
- [x] T002 Forward the OptionalFormSection stylesheet from `packages/styles/src/pathable-component-wrappers/pathable-form-controls.scss`
- [x] T003 Add deterministic Collapsed, Expanded, NestedFormGroup, NestedFieldset, LongContent, Narrow, IncreasedText, and ForcedColors static stories matching `contracts/semantic-markup.md` in `packages/styles/src/stories/components/FormControls/OptionalFormSection.stories.ts`
- [x] T004 Register the required fixed Styles stories in `packages/styles/scripts/storybook-coverage.mjs` and the canonical visual/quality story lists in `packages/styles/scripts/test-visual.mjs` and `packages/styles/scripts/quality-gates.mjs`

---

## Phase 2: Foundational (React Public Surface)

**Purpose**: Create the type-safe semantic skeleton, stable relationships, and
public export required by every user story.

**Critical**: Complete this phase after the shared Styles contract and before
story-specific behavior.

- [x] T005 Define `OptionalFormSectionHeadingLevel` and `OptionalFormSectionProps`, including required string heading/level/children and controlled/uncontrolled props, in `packages/react/src/components/OptionalFormSection/OptionalFormSection.tsx`
- [x] T006 Implement the neutral root `div`, dynamic `h2`-`h6`, native `button type="button"`, labelled content region, non-empty-heading guard, and `useId` relationships in `packages/react/src/components/OptionalFormSection/OptionalFormSection.tsx`
- [x] T007 Apply only the shared `pathable-optional-form-section` classes, forward root div attributes, and exclude `details`, Accordion, disabled, animation, validation, and issue #235 coupling in `packages/react/src/components/OptionalFormSection/OptionalFormSection.tsx`
- [x] T008 Export `OptionalFormSection`, `OptionalFormSectionProps`, and `OptionalFormSectionHeadingLevel` from `packages/react/src/index.ts`

**Checkpoint**: The Styles contract and React semantic skeleton compile and
expose the API in `contracts/component-api.md`.

---

## Phase 3: User Story 1 - Reveal Optional Form Fields (Priority: P1) MVP

**Goal**: Let a person reveal and collapse optional fields with native pointer
and keyboard behavior while preserving focus and avoiding form submission.

**Independent Test**: Render a collapsed section in a form, activate its button
with pointer, Enter, and Space, and verify visible/reachable content, synchronized
relationships, button focus, and zero submit events.

### Tests for User Story 1

- [x] T009 [P] [US1] Add heading-level, empty/whitespace-heading, initial state, semantic relationship, and multiple-instance ID tests in `packages/react/src/components/OptionalFormSection/__tests__/OptionalFormSection.test.tsx`
- [x] T010 [P] [US1] Add pointer, Enter, Space, focus-retention, collapsed tab-order, and non-submission tests using accessible queries in `packages/react/src/components/OptionalFormSection/__tests__/OptionalFormSection.test.tsx`

### Implementation for User Story 1

- [x] T011 [US1] Implement uncontrolled initialization and native button toggling with synchronized `aria-expanded` and content `hidden` state in `packages/react/src/components/OptionalFormSection/OptionalFormSection.tsx`
- [x] T012 [US1] Keep the disclosure button focused and rely on native button keyboard/click behavior without custom keydown emulation in `packages/react/src/components/OptionalFormSection/OptionalFormSection.tsx`
- [x] T013 [US1] Add fixed Collapsed, Expanded, keyboard, pointer, non-submission, LongContent, Narrow, IncreasedText, and ForcedColors React stories in `packages/react/src/stories/components/FormControls/OptionalFormSection.stories.tsx`

**Checkpoint**: User Story 1 independently provides the accessible disclosure
shell and is the MVP.

---

## Phase 4: User Story 2 - Preserve Optional Responses (Priority: P2)

**Goal**: Preserve nested field identity, values, grouping, and native form
participation across collapse and collapsed submission.

**Independent Test**: Enter values in ordinary controls, a FormGroup, and a
fieldset; collapse/reopen and submit in both states; verify identical retained
successful values and unchanged nested semantics.

### Tests for User Story 2

- [x] T014 [P] [US2] Add descendant mount-identity and input/select/checkbox value-retention tests across repeated toggles in `packages/react/src/components/OptionalFormSection/__tests__/OptionalFormSection.test.tsx`
- [x] T015 [P] [US2] Add expanded-versus-collapsed `FormData` submission, FormGroup, fieldset/legend, and nested association tests in `packages/react/src/components/OptionalFormSection/__tests__/OptionalFormSection.test.tsx`

### Implementation for User Story 2

- [x] T016 [US2] Always render the same child subtree and toggle only the content container's native `hidden` attribute in `packages/react/src/components/OptionalFormSection/OptionalFormSection.tsx`
- [x] T017 [US2] Verify the component does not clone, disable, rename, clear, serialize, validate, or focus nested controls in `packages/react/src/components/OptionalFormSection/OptionalFormSection.tsx`
- [x] T018 [US2] Add NestedFormGroup, NestedFieldset, RetainedValues, and CollapsedSubmit executable stories in `packages/react/src/stories/components/FormControls/OptionalFormSection.stories.tsx`

**Checkpoint**: User Story 2 independently proves that collapse is presentation
only and does not alter form responses.

---

## Phase 5: User Story 3 - Integrate Controlled Disclosure State (Priority: P3)

**Goal**: Let an application own expansion while preserving the same semantic,
focus, and child-retention contract.

**Independent Test**: Supply controlled state, activate the button, verify the
requested inverse state callback without an immediate visual change, then update
the prop and verify the section follows it; separately verify uncontrolled
`defaultExpanded` and ten distinct instances.

### Tests for User Story 3

- [x] T019 [P] [US3] Add controlled authority, requested-next-state callback, and prop-update tests in `packages/react/src/components/OptionalFormSection/__tests__/OptionalFormSection.test.tsx`
- [x] T020 [P] [US3] Add `defaultExpanded`, callback ordering, ten-instance uniqueness, SSR markup, and hydration parity tests in `packages/react/src/components/OptionalFormSection/__tests__/OptionalFormSection.test.tsx`

### Implementation for User Story 3

- [x] T021 [US3] Implement `expanded !== undefined` controlled precedence and requested inverse-state notifications in `packages/react/src/components/OptionalFormSection/OptionalFormSection.tsx`
- [x] T022 [US3] Preserve uncontrolled state across parent rerenders and hydration while keeping controlled renders prop-authoritative in `packages/react/src/components/OptionalFormSection/OptionalFormSection.tsx`
- [x] T023 [US3] Add Controlled, DefaultExpanded, MultipleInstances, and SSR-stable React stories with deterministic state owners in `packages/react/src/stories/components/FormControls/OptionalFormSection.stories.tsx`

**Checkpoint**: All three user stories are independently testable and preserve a
single public semantic contract.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete executable documentation, application-owned validation
guidance, release metadata, and published-consumer proof.

- [x] T024 Add Storybook metadata covering semantic intent, heading-level selection, form submission, validation ownership, misuse of Accordion/details, no disabled/animation behavior, and `client-ssr` classification in `packages/react/src/stories/components/FormControls/OptionalFormSection.stories.tsx`
- [x] T025 Document imports, props, controlled/uncontrolled examples, collapsed submission, application-owned invalid-field reveal, and React 18/19 support in `packages/react/README.md`
- [x] T026 [P] Update form-component selection and accessibility guidance for OptionalFormSection in `packages/react/agent-guidance/pathable-react/SKILL.md`
- [x] T027 [P] Add OptionalFormSection to inherent `client-ssr` component guidance in `packages/react/agent-guidance/pathable-react/references/server-and-client.md`
- [x] T028 [P] Add a minor `@pathableai/styles` and `@pathableai/react` release note for issue #236 in `.changeset/<generated-name>.md`
- [x] T029 Validate Styles/React lint, typecheck, unit/build/package checks, both Storybooks, axe, coverage, quality, visual, server audit, agent guidance, changesets, React 18/19 packed consumers, Markdown, formatting, and diff whitespace using `specs/248-optional-form-section/quickstart.md`
- [x] T030 Confirm the issue #236 implementation and package diff contains no issue #235 dependency or unrelated FilterableOptionList changes using `specs/248-optional-form-section/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: Starts immediately and establishes Styles-first ownership.
- **Phase 2**: Depends on Phase 1's class and semantic contract.
- **User Story 1**: Depends on Phase 2 and forms the MVP.
- **User Story 2**: Depends on User Story 1's disclosure shell.
- **User Story 3**: Depends on User Story 1's state transition; its tests can be
  prepared alongside User Story 2.
- **Polish**: Depends on all implemented user stories.
- **Issue #235**: No phase depends on issue #235, its branch, or its API.

### User Story Dependencies

- **US1**: No dependency beyond foundational work.
- **US2**: Uses US1 toggling but independently proves persistence and form data.
- **US3**: Uses US1's effective-state model and can proceed in parallel with US2
  after that model stabilizes.

### Parallel Opportunities

- T003 can proceed while T001 is drafted after class names are agreed.
- T009 and T010 are parallel semantic and interaction test groups.
- T014 and T015 are parallel retention and form-composition test groups.
- T019 and T020 are parallel state-control and rendering-stability test groups.
- T026, T027, and T028 touch independent guidance/release files.

## Parallel Example: User Story 2

```text
Task T014: Descendant identity and value-retention tests
Task T015: FormData and nested semantic composition tests
```

## Implementation Strategy

### MVP First

1. Complete the shared Styles contract and React foundation.
2. Complete User Story 1 with uncontrolled native-button disclosure.
3. Validate semantics, pointer/keyboard behavior, focus, and non-submission.
4. Add persistence/form behavior and controlled integration without changing the
   public markup contract.

### Incremental Delivery

1. Styles-first static contract.
2. Semantic React shell and exports.
3. Uncontrolled disclosure MVP.
4. Always-mounted fields and collapsed submission.
5. Controlled state, SSR, and multiple-instance guarantees.
6. Stories, docs, guidance, release metadata, and full validation.

## Format Validation

All tasks are initially unchecked and use the required checkbox, sequential task
ID, optional parallel marker, user-story label where applicable, actionable
description, and exact file path.
