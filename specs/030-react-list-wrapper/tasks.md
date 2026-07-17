# Tasks: React List Wrapper

**Input**: Design documents from `/specs/030-react-list-wrapper/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Formal test files are not requested in the specification. Validation tasks are included for build, Storybook, package contents, and contract evidence.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 - Render Basic List Content (P1)](#phase-3-user-story-1---render-basic-list-content-p1)
- [Phase 4: User Story 2 - Choose Documented List Presentation (P2)](#phase-4-user-story-2---choose-documented-list-presentation-p2)
- [Phase 5: User Story 3 - Install Wrapper Without Extra Style Setup (P3)](#phase-5-user-story-3---install-wrapper-without-extra-style-setup-p3)
- [Phase 6: Polish & Cross-Cutting Concerns](#phase-6-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Examples](#parallel-examples)
- [Implementation Strategy](#implementation-strategy)
- [Notes](#notes)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **React wrapper package**: `packages/react/src/`
- **React package docs**: `packages/react/README.md`
- **React Storybook stories**: `packages/react/src/stories/`
- **Feature artifacts**: `specs/030-react-list-wrapper/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the exact source contract and package surfaces before implementation.

- [X] T001 Review `packages/styles/src/pathable-component-wrappers/pathable-list.scss`, `packages/styles/src/stories/components/Basic/List.stories.js`, and `specs/030-react-list-wrapper/contracts/props.md` to confirm supported `List` presentations and record any mismatch as a blocker in `specs/030-react-list-wrapper/tasks.md`
- [X] T002 Inspect `packages/react/src/components/Button/Button.jsx`, `packages/react/src/components/button-group/ButtonGroup.jsx`, `packages/react/src/components/Card/Card.jsx`, and `packages/react/src/index.js` to mirror existing component, PropTypes, class composition, rest-prop, and export conventions for `List`
- [X] T003 [P] Inspect `packages/react/src/stories/components/Basic/Button.stories.jsx`, `packages/react/src/stories/components/Basic/ButtonGroup.stories.jsx`, and `packages/react/src/stories/components/Basic/Card.stories.jsx` to mirror React Storybook naming, controls, and documentation conventions for `List`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create shared component structure and contract mapping that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Create `packages/react/src/components/List/List.jsx` with exported `List`, root `pathable-list` class composition, `className` passthrough, rest prop passthrough, and PropTypes matching `specs/030-react-list-wrapper/contracts/props.md`
- [X] T005 Add `export { List } from './components/List/List.jsx'` to `packages/react/src/index.js` while preserving the existing styles import and existing `Button`, `ButtonGroup`, and `Card` exports
- [X] T006 Add presentation mapping in `packages/react/src/components/List/List.jsx` for `presentation` values `unordered`, `ordered`, and `unstyled`, ensuring every mapped class or documented pattern is supported by `packages/styles/src/stories/components/Basic/List.stories.js`
- [X] T007 Add item normalization helpers in `packages/react/src/components/List/List.jsx` for primitive node items and object items with `content`, `key`, `className`, and `attributes` fields from `specs/030-react-list-wrapper/data-model.md`

**Checkpoint**: Foundation ready - user story implementation can now begin in priority order.

---

## Phase 3: User Story 1 - Render Basic List Content (Priority: P1)

**Goal**: Product developers can render a basic Pathable List with multiple items, preserved order, rich content, custom class names, and safe root attributes.

**Independent Test**: Render `List` with multiple items and verify it presents the same list structure and visual treatment as the existing `packages/styles` list contract.

### Implementation for User Story 1

- [X] T008 [US1] Implement item-driven unordered list rendering in `packages/react/src/components/List/List.jsx` for `items`, item order, rich item content, and object item attributes from `specs/030-react-list-wrapper/contracts/props.md`
- [X] T009 [US1] Implement `children`, empty-list, `className`, and rest-attribute behavior in `packages/react/src/components/List/List.jsx` without rendering misleading placeholder items
- [X] T010 [US1] Add `Default`, `RichItems`, `Empty`, and `CustomClassName` stories to `packages/react/src/stories/components/Basic/List.stories.jsx` covering basic content, rich content, empty-list behavior, and root class composition
- [X] T011 [US1] Update `packages/react/README.md` with `List` import and basic unordered usage examples covering `items`, rich content, `className`, and root attributes from `specs/030-react-list-wrapper/quickstart.md`
- [X] T012 [US1] Run `pnpm --filter @pathable/react build` and capture the successful command output as validation evidence for `SC-001` and basic `List` rendering in `specs/030-react-list-wrapper/quickstart.md`

**Checkpoint**: User Story 1 is independently usable and demonstrable as the MVP.

---

## Phase 4: User Story 2 - Choose Documented List Presentation (Priority: P2)

**Goal**: Product developers can choose unordered, ordered, and unstyled list presentations through the React wrapper without hand-authoring Pathable list class names.

**Independent Test**: Render one list for each documented presentation and confirm each output maps to the corresponding existing `packages/styles` list presentation.

### Implementation for User Story 2

- [X] T013 [US2] Implement `presentation="ordered"` root element and class behavior in `packages/react/src/components/List/List.jsx`, preserving item sequence for ordered content
- [X] T014 [US2] Implement `presentation="unstyled"` class behavior in `packages/react/src/components/List/List.jsx`, mapping only to the documented unstyled presentation from `packages/styles/src/stories/components/Basic/List.stories.js`
- [X] T015 [US2] Ensure unsupported `presentation` values in `packages/react/src/components/List/List.jsx` fall back to documented unordered output without introducing wrapper-only styling
- [X] T016 [US2] Add `Ordered`, `Unstyled`, and `UnsupportedPresentationFallback` stories to `packages/react/src/stories/components/Basic/List.stories.jsx` covering all documented presentations and invalid-scope behavior
- [X] T017 [US2] Update `packages/react/README.md` with ordered and unstyled `List` examples matching `specs/030-react-list-wrapper/quickstart.md`
- [X] T018 [US2] Run `pnpm --filter @pathable/storybook-react build-storybook` and capture the successful command output as validation evidence for `SC-002`, `SC-004`, and documented list presentations in `specs/030-react-list-wrapper/quickstart.md`

**Checkpoint**: User Stories 1 and 2 both work independently and remain inside the existing styles contract.

---

## Phase 5: User Story 3 - Install Wrapper Without Extra Style Setup (Priority: P3)

**Goal**: Consumers can install and use `List` from the React wrapper package without importing `@pathable/styles` separately in application code.

**Independent Test**: Install or inspect the wrapper package output, import `List`, and verify the List export and required transitive style dependency are present.

### Implementation for User Story 3

- [X] T019 [US3] Verify `packages/react/src/index.js` imports `@pathable/styles/dist/styles.css` once and exports `List`, then update `packages/react/src/index.js` if either contract is missing
- [X] T020 [US3] Verify `packages/react/package.json` keeps `@pathable/styles` as a runtime dependency and exposes package output needed for `List` consumers, then update `packages/react/package.json` if package-content validation requires it
- [X] T021 [US3] Update `packages/react/README.md` to state that consumers import `List` from `@pathable/react` and do not need a separate application import of `@pathable/styles`
- [X] T022 [US3] Run `pnpm --filter @pathable/react build` and `npm --cache /tmp/pathable-npm-cache pack --dry-run` from `packages/react`, then capture successful command output as package-content evidence for `SC-003` and `specs/030-react-list-wrapper/quickstart.md`

**Checkpoint**: All user stories are independently functional and package-consumer evidence exists.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, formatting, and review across all user stories.

- [X] T023 [P] Run `pnpm lint:js` and fix findings in `packages/react/src/components/List/List.jsx` and `packages/react/src/stories/components/Basic/List.stories.jsx` without disabling, weakening, skipping, or silencing lint rules
- [X] T024 [P] Run `pnpm check:format` and apply formatting to `packages/react/src/components/List/List.jsx`, `packages/react/src/stories/components/Basic/List.stories.jsx`, and `packages/react/README.md` if needed
- [X] T025 Run the quickstart validation paths from `specs/030-react-list-wrapper/quickstart.md` against `packages/react/README.md`, `packages/react/src/index.js`, and `packages/react/src/stories/components/Basic/List.stories.jsx`, then capture command output or review notes as evidence for `SC-001` through `SC-005`
- [X] T026 Review boundary compliance across `specs/030-react-list-wrapper/spec.md`, `specs/030-react-list-wrapper/contracts/props.md`, `packages/react/src/components/List/List.jsx`, and `packages/styles/src/pathable-component-wrappers/pathable-list.scss`, confirming scope stays within React wrapper `List` and the existing `packages/styles` list contract
- [X] T027 Review visual consistency across `packages/react/src/stories/components/Basic/List.stories.jsx`, `packages/styles/src/stories/components/Basic/List.stories.js`, and `specs/030-react-list-wrapper/checklists/behavior-testability.md`, confirming list presentations remain satisfied without wrapper-only styling
- [X] T028 Review package-consumer evidence across `packages/react/package.json`, `packages/react/src/index.js`, and `npm --cache /tmp/pathable-npm-cache pack --dry-run` output from `packages/react`, confirming no separate consumer-side `@pathable/styles` import is required

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks user story work.
- **User Story 1 (Phase 3)**: Depends on Foundational completion - MVP.
- **User Story 2 (Phase 4)**: Depends on User Story 1 because presentation rendering builds on the base List component.
- **User Story 3 (Phase 5)**: Depends on User Stories 1 and 2 because package output must include the final List export and examples.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: MVP and required before presentation-specific work.
- **User Story 2 (P2)**: Builds on the base `List` component from US1.
- **User Story 3 (P3)**: Verifies final package output after `List` and presentations are exported.

### Within Each User Story

- Component implementation before stories and README updates.
- Stories before Storybook build validation.
- Export and dependency checks before package-content validation.
- Validation evidence before final review.

### Parallel Opportunities

- T003 can run in parallel with T001 and T002.
- T023 and T024 can run in parallel after implementation files exist.
- T026, T027, and T028 can be reviewed in parallel after validation evidence is captured.

---

## Parallel Examples

### User Story 1

```bash
Task: "Update packages/react/README.md basic List examples after List props are implemented"
Task: "Add packages/react/src/stories/components/Basic/List.stories.jsx basic stories after List props are implemented"
```

### Polish

```bash
Task: "Run pnpm lint:js and fix List-related findings"
Task: "Run pnpm check:format and format List-related files"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup and Phase 2 foundational component shell.
2. Complete Phase 3 so `List` supports unordered item rendering, rich content, empty lists, `className`, and rest props.
3. Validate with `pnpm --filter @pathable/react build`.
4. Stop and review the MVP before presentation expansion.

### Incremental Delivery

1. Add base `List` support and basic documentation.
2. Add documented list presentations and Storybook examples.
3. Verify package export, transitive styling, and package contents.
4. Finish lint, formatting, quickstart, visual, and package-consumer review.

### Parallel Team Strategy

With multiple developers:

1. One developer confirms source contract and creates the List component shell.
2. One developer prepares Storybook stories after the component props are available.
3. One developer updates documentation and package-consumer validation after exports are in place.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks.
- [US1], [US2], and [US3] labels map tasks to independently testable user stories.
- Do not edit `specs/030-react-list-wrapper/spec.md`, `specs/030-react-list-wrapper/contracts/props.md`, or readiness checklists to make implementation pass; report a blocker if the contracts are wrong.
- Do not disable, weaken, skip, or silence lint rules. Fix the underlying issue or report the lint conflict as a blocker.
