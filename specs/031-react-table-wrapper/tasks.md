# Tasks: React Table Wrapper

**Input**: Design documents from `/specs/031-react-table-wrapper/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Formal test files are not requested. Validation tasks cover package
builds, Storybook, package contents, semantic markup, accessibility attributes,
and source-contract mapping.

**Organization**: Tasks are grouped by user story so each increment can be
implemented and validated independently.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1](#phase-3-user-story-1---render-semantic-table-content-p1)
- [Phase 4: User Story 2](#phase-4-user-story-2---choose-a-documented-table-presentation-p2)
- [Phase 5: User Story 3](#phase-5-user-story-3---use-the-wrapper-without-extra-style-setup-p3)
- [Phase 6: Polish](#phase-6-polish--cross-cutting-concerns)
- [Dependencies](#dependencies--execution-order)
- [Parallel Examples](#parallel-examples)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it affects different files and has no
  dependency on an incomplete task.
- **[Story]**: Maps the task to US1, US2, or US3.
- Every task includes an exact repository-relative file path.

## Path Conventions

- **Owning styles contract**: `packages/styles/src/`
- **React component package**: `packages/react/src/`
- **React package documentation**: `packages/react/README.md`
- **React Storybook**: `packages/react/src/stories/`
- **Feature artifacts**: `specs/031-react-table-wrapper/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the source contract and existing wrapper conventions before
editing implementation files.

- [ ] T001 Review `packages/styles/src/pathable-component-wrappers/pathable-table.scss`, `packages/styles/src/stories/components/Basic/Table.stories.js`, and `specs/031-react-table-wrapper/contracts/props.md`, then record any mismatch as a blocker in `specs/031-react-table-wrapper/tasks.md`
- [ ] T002 Review `packages/react/src/components/List/List.jsx`, `packages/react/src/components/Card/Card.jsx`, and `packages/react/src/index.js` for component naming, PropTypes, class composition, rest-prop, and export conventions to follow in `packages/react/src/components/Table/Table.jsx`
- [ ] T003 [P] Review `packages/react/src/stories/components/Basic/List.stories.jsx` and `packages/react/src/stories/components/Basic/Card.stories.jsx` for controls and documentation conventions to follow in `packages/react/src/stories/components/Basic/Table.stories.jsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the bounded Table component and public export required by
all user stories.

**CRITICAL**: No user story work begins until this phase is complete.

- [ ] T004 Create `packages/react/src/components/Table/Table.jsx` with exported `Table`, native table root, `children`, `className`, remaining-prop forwarding, and PropTypes matching `specs/031-react-table-wrapper/contracts/props.md`
- [ ] T005 Add `export { Table } from './components/Table/Table.jsx'` to `packages/react/src/index.js` while preserving the single `@pathable/styles/dist/styles.css` import and all existing exports
- [ ] T006 Add bounded presentation resolution in `packages/react/src/components/Table/Table.jsx` for `default`, `borderless`, `compact`, and `striped`, including fallback to `default` for unsupported values

**Checkpoint**: The public Table shell exists and maps only to the owning source
contract.

---

## Phase 3: User Story 1 - Render Semantic Table Content (P1)

**Goal**: Developers can render consumer-composed captions, sections, rows,
cells, interactive descendants, and accessibility attributes in a styled native
table.

**Independent Test**: Render a default Table with caption, scoped headers,
multiple body rows, an interactive cell, custom class, and root attributes;
verify content order and semantics are unchanged and `pathable-table` is present.

### Implementation for User Story 1

- [ ] T007 [US1] Complete semantic child preservation in `packages/react/src/components/Table/Table.jsx` without synthesizing, reordering, padding, or discarding captions, sections, rows, or cells
- [ ] T008 [US1] Complete root attribute and additive class behavior in `packages/react/src/components/Table/Table.jsx` for handlers, `aria-*`, `data-*`, standard table attributes, and consumer `className`
- [ ] T009 [US1] Add `Default`, `RichCellContent`, `EmptyBody`, and `CustomAttributes` stories to `packages/react/src/stories/components/Basic/Table.stories.jsx` covering the US1 independent-test scenarios
- [ ] T010 [P] [US1] Add the basic `Table` import, semantic usage example, and core props documentation to `packages/react/README.md`
- [ ] T011 [US1] Run `pnpm --filter @pathable/react build` and document any blocker against the US1 validation section in `specs/031-react-table-wrapper/quickstart.md`
- [ ] T012 [US1] Inspect the rendered US1 stories from `packages/react/src/stories/components/Basic/Table.stories.jsx` and confirm caption, header scopes, row order, interactive content, custom class, and root attributes satisfy `specs/031-react-table-wrapper/contracts/props.md`

**Checkpoint**: User Story 1 is a complete, independently demonstrable MVP.

---

## Phase 4: User Story 2 - Choose a Documented Table Presentation (P2)

**Goal**: Developers can select default, borderless, compact, and striped table
presentations without hand-authoring Pathable modifier classes.

**Independent Test**: Render identical semantic content with all four
presentation values and one unsupported value; verify exact class mapping and
unchanged content.

### Implementation for User Story 2

- [ ] T013 [US2] Verify and finalize exact presentation-to-class mapping in `packages/react/src/components/Table/Table.jsx` against `packages/styles/src/pathable-component-wrappers/pathable-table.scss`
- [ ] T014 [US2] Ensure unsupported presentation values in `packages/react/src/components/Table/Table.jsx` resolve to only `pathable-table` and never generate arbitrary modifier classes
- [ ] T015 [US2] Add `Borderless`, `Compact`, `Striped`, and `UnsupportedPresentationFallback` stories to `packages/react/src/stories/components/Basic/Table.stories.jsx`
- [ ] T016 [P] [US2] Add presentation values, defaults, class-safe fallback behavior, and examples to the Table section in `packages/react/README.md`
- [ ] T017 [US2] Run `pnpm --filter @pathable/storybook-react build-storybook` and document any blocker against the US2 validation section in `specs/031-react-table-wrapper/quickstart.md`
- [ ] T018 [US2] Compare `packages/react/src/stories/components/Basic/Table.stories.jsx` with `packages/styles/src/stories/components/Basic/Table.stories.js` and confirm all four in-scope presentations satisfy SC-002 and SC-003 without wrapper-only styling

**Checkpoint**: User Stories 1 and 2 work independently and remain within the
basic source table contract.

---

## Phase 5: User Story 3 - Use the Wrapper Without Extra Style Setup (P3)

**Goal**: Consumers can import Table from `@pathable/react` and receive the
required Pathable table styles without a separate styles import.

**Independent Test**: Build and inspect the package, confirming the Table
export, built entrypoint, README, runtime styles dependency, and transitive
entrypoint import are present.

### Implementation for User Story 3

- [ ] T019 [US3] Verify the single transitive styles import and public Table export in `packages/react/src/index.js`, correcting only missing contract details in that file
- [ ] T020 [US3] Verify `@pathable/styles` remains a runtime dependency and package exports remain installable in `packages/react/package.json`, correcting only issues proven by package validation
- [ ] T021 [P] [US3] Document consumer installation, `Table` import, and no-extra-styles-import behavior in `packages/react/README.md`
- [ ] T022 [US3] Run `pnpm --filter @pathable/react build` and `npm --cache /tmp/pathable-npm-cache pack --dry-run` from `packages/react`, then verify the output against SC-005 and `specs/031-react-table-wrapper/quickstart.md`

**Checkpoint**: All three user stories are independently functional and package
consumer evidence exists.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete repository quality gates and final contract review.

- [ ] T023 [P] Run `pnpm lint:js` and fix Table-related findings in `packages/react/src/components/Table/Table.jsx` and `packages/react/src/stories/components/Basic/Table.stories.jsx` without disabling, weakening, skipping, or silencing lint rules
- [ ] T024 [P] Run `pnpm check:format` and format `packages/react/src/components/Table/Table.jsx`, `packages/react/src/stories/components/Basic/Table.stories.jsx`, and `packages/react/README.md` when required
- [ ] T025 Run every validation path in `specs/031-react-table-wrapper/quickstart.md` and record unresolved command or behavior failures in `specs/031-react-table-wrapper/tasks.md`
- [ ] T026 [P] Review `packages/react/src/components/Table/Table.jsx` against `specs/031-react-table-wrapper/spec.md`, `specs/031-react-table-wrapper/data-model.md`, and `specs/031-react-table-wrapper/contracts/props.md` for full FR-001 through FR-013 coverage
- [ ] T027 [P] Review `packages/react/src/stories/components/Basic/Table.stories.jsx` against `packages/styles/src/stories/components/Basic/Table.stories.js` and `specs/031-react-table-wrapper/checklists/behavior-testability.md` for semantic and visual contract parity
- [ ] T028 Review `packages/react/package.json`, `packages/react/src/index.js`, `packages/react/README.md`, and package dry-run output for naming, export, transitive styling, and publish-content compliance

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** has no dependencies.
- **Phase 2** depends on Phase 1 and blocks all user stories.
- **US1 / Phase 3** depends on Phase 2 and is the MVP.
- **US2 / Phase 4** depends on the Table shell from Phase 2; execute after US1
  in the recommended single-agent path to avoid conflicts in shared component
  and story files.
- **US3 / Phase 5** depends on the final export and documentation from US1 and
  US2 so package evidence reflects the complete component.
- **Phase 6** depends on all selected user stories.

### Task Dependencies

- T004 depends on T001 and T002.
- T005 and T006 depend on T004.
- T007 and T008 depend on T004 and T006.
- T009 depends on T007 and T008; T010 can run in parallel after the props
  contract is implemented.
- T011 and T012 depend on T007 through T010.
- T013 and T014 depend on T006; T015 depends on T013 and T014; T016 can run in
  parallel with T015.
- T017 and T018 depend on T015 and T016.
- T019 and T020 depend on T005; T021 can run in parallel once the final public
  API is stable; T022 depends on T019 through T021.
- T023 through T028 depend on completion of the selected story phases.

### Parallel Opportunities

- T003 can run in parallel with T001 and T002.
- T010 can run in parallel with T009 after component behavior exists.
- T016 can run in parallel with T015 after presentation mapping exists.
- T021 can run in parallel with package metadata review after the public API is
  stable.
- T023 and T024 can run in parallel.
- T026 and T027 can run in parallel after validation commands complete.

## Parallel Examples

### User Story 1

```text
Task T009: Add semantic Table Storybook scenarios.
Task T010: Add basic Table README usage and props documentation.
```

### User Story 2

```text
Task T015: Add four presentation and fallback stories.
Task T016: Document presentation values and examples.
```

### Polish

```text
Task T023: Run JavaScript lint and fix Table findings.
Task T024: Run formatting checks and format Table files.
```

## Implementation Strategy

### MVP First

1. Complete setup and foundational tasks T001-T006.
2. Complete US1 tasks T007-T012.
3. Stop and validate semantic rendering independently.

### Incremental Delivery

1. Deliver semantic default Table behavior as the MVP.
2. Add bounded basic presentations and Storybook coverage.
3. Verify package export, transitive styles, and installable contents.
4. Complete lint, formatting, quickstart, and contract reviews.

### Scope Guardrails

- Do not edit `packages/styles` unless implementation proves a genuine source
  contract defect and records it as a blocker first.
- Do not add wrapper-managed columns, rows, sorting, selection, pagination,
  loading, empty states, row actions, or responsive containers.
- Do not disable, weaken, skip, or silence lint rules.
- Do not alter feature contracts or checklists merely to make implementation
  pass; record a blocker when implementation and contract disagree.
