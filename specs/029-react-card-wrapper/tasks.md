# Tasks: React Card Wrapper

**Input**: Design documents from `/specs/029-react-card-wrapper/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Formal test files are not requested in the specification. Validation tasks are included for build, Storybook, package contents, and contract evidence.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 - Render Basic Card Content (P1)](#phase-3-user-story-1---render-basic-card-content-p1)
- [Phase 4: User Story 2 - Use Card Variants (P2)](#phase-4-user-story-2---use-card-variants-p2)
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
- **Feature artifacts**: `specs/029-react-card-wrapper/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the exact source contract and package surfaces before implementation.

- [ ] T001 Review `packages/styles/src/pathable-component-wrappers/pathable-card.scss`, `packages/styles/src/stories/components/Basic/Card.stories.js`, and `specs/029-react-card-wrapper/contracts/props.md` to confirm the supported `Card` presentations and record any mismatch as a blocker in `specs/029-react-card-wrapper/tasks.md`
- [ ] T002 Inspect `packages/react/src/components/Button/Button.jsx`, `packages/react/src/components/button-group/ButtonGroup.jsx`, and `packages/react/src/index.js` to mirror the existing component, PropTypes, class composition, and export conventions for `Card`
- [ ] T003 [P] Inspect `packages/react/src/stories/components/Basic/Button.stories.jsx` and `packages/react/src/stories/components/Basic/ButtonGroup.stories.jsx` to mirror React Storybook naming, controls, and documentation conventions for `Card`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create shared component structure and contract mapping that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Create `packages/react/src/components/Card/Card.jsx` with exported `Card`, root `pathable-card` class composition, `className` passthrough, rest prop passthrough, and PropTypes matching `specs/029-react-card-wrapper/contracts/props.md`
- [ ] T005 Add `export { Card } from './components/Card/Card.jsx'` to `packages/react/src/index.js` while preserving existing `Button` and `ButtonGroup` exports
- [ ] T006 Add shared class mapping in `packages/react/src/components/Card/Card.jsx` for `presentation` values `base`, `media`, `flag`, `header-first`, and `workflow`, ensuring every mapped class exists in `packages/styles/src/pathable-component-wrappers/pathable-card.scss`
- [ ] T007 Add structural rendering helpers inside `packages/react/src/components/Card/Card.jsx` for title, body, footer, media, metadata, status, and actions regions using only existing `pathable-card*` classes from `packages/styles/src/pathable-component-wrappers/pathable-card.scss`

**Checkpoint**: Foundation ready - user story implementation can now begin in priority order.

---

## Phase 3: User Story 1 - Render Basic Card Content (Priority: P1)

**Goal**: Product developers can render a basic Pathable Card with title, body, optional footer, and custom class names.

**Independent Test**: Render `Card` with title and children and verify it presents the same basic card structure and visual treatment as the existing `packages/styles` card contract.

### Implementation for User Story 1

- [ ] T008 [US1] Implement base title, children, footer, className, and rest-prop rendering in `packages/react/src/components/Card/Card.jsx` for `CASE-CARD-POS-001` and `CASE-CARD-ALT-001`
- [ ] T009 [US1] Ensure missing-title and missing-body branches in `packages/react/src/components/Card/Card.jsx` omit empty card regions while preserving valid supplied content for `CASE-CARD-ALT-001`
- [ ] T010 [US1] Add `Default`, `WithFooter`, `WithoutTitle`, and `CustomClassName` stories to `packages/react/src/stories/components/Basic/Card.stories.jsx` covering `CASE-CARD-POS-001` and `CASE-CARD-ALT-001`
- [ ] T011 [US1] Update `packages/react/README.md` with basic `Card` import and usage examples covering title, children, footer, and `className` from `specs/029-react-card-wrapper/quickstart.md`
- [ ] T012 [US1] Run `pnpm --filter @pathable/react build` and capture the successful command output as validation evidence for `SC-001` and `CASE-CARD-POS-001`

**Checkpoint**: User Story 1 is independently usable and demonstrable as the MVP.

---

## Phase 4: User Story 2 - Use Card Variants (Priority: P2)

**Goal**: Product developers can request documented card presentations through the React wrapper without hand-authoring Pathable card class names.

**Independent Test**: Render one card for each documented presentation and confirm each output maps to the corresponding existing `packages/styles` card presentation.

### Implementation for User Story 2

- [ ] T013 [US2] Implement `presentation="media"` and `media` region behavior in `packages/react/src/components/Card/Card.jsx`, mapping only to existing media card structure from `packages/styles/src/stories/components/Basic/Card.stories.js`
- [ ] T014 [US2] Implement `presentation="flag"` and `presentation="header-first"` class mapping in `packages/react/src/components/Card/Card.jsx`, using only existing `pathable-card--flag` and `pathable-card--header-first` modifiers from `packages/styles/src/pathable-component-wrappers/pathable-card.scss`
- [ ] T015 [US2] Implement `presentation="workflow"` regions in `packages/react/src/components/Card/Card.jsx` for title, metadata, status, body, and actions using existing workflow card classes from `packages/styles/src/pathable-component-wrappers/pathable-card.scss`
- [ ] T016 [US2] Ensure unsupported or combined presentation/content cases in `packages/react/src/components/Card/Card.jsx` degrade to documented base or supported presentation output without introducing wrapper-only styling for `CASE-CARD-VAL-001` and `CASE-CARD-NEG-001`
- [ ] T017 [US2] Add `Media`, `Flag`, `HeaderFirst`, `Workflow`, and `WorkflowWithStatus` stories to `packages/react/src/stories/components/Basic/Card.stories.jsx` covering `CASE-CARD-POS-002`, `CASE-CARD-VAL-001`, and `VIS-CARD-002`
- [ ] T018 [US2] Update `packages/react/README.md` with media and workflow card examples matching `specs/029-react-card-wrapper/quickstart.md`
- [ ] T019 [US2] Run `pnpm --filter @pathable/storybook-react build-storybook` and capture the successful command output as validation evidence for `SC-002`, `SC-004`, and `VIS-CARD-002`

**Checkpoint**: User Stories 1 and 2 both work independently and remain inside the existing styles contract.

---

## Phase 5: User Story 3 - Install Wrapper Without Extra Style Setup (Priority: P3)

**Goal**: Consumers can install and use `Card` from the React wrapper package without importing `@pathable/styles` separately in application code.

**Independent Test**: Install or inspect the wrapper package output, import `Card`, and verify the Card export and required transitive style dependency are present.

### Implementation for User Story 3

- [ ] T020 [US3] Verify `packages/react/src/index.js` imports `@pathable/styles/dist/styles.css` once and exports `Card`, then update the file if either contract is missing for `CASE-CARD-POS-003`
- [ ] T021 [US3] Verify `packages/react/package.json` keeps `@pathable/styles` as a runtime dependency and exposes package output needed for `Card` consumers, then update the file if package-content validation requires it
- [ ] T022 [US3] Update `packages/react/README.md` to state that consumers import `Card` from `@pathable/react` and do not need a separate application import of `@pathable/styles`
- [ ] T023 [US3] Run `pnpm --filter @pathable/react build` and `pnpm --filter @pathable/react pack --dry-run`, then capture the successful command output as package-content evidence for `SC-003` and `CASE-CARD-POS-003`

**Checkpoint**: All user stories are independently functional and package-consumer evidence exists.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, formatting, and review across all user stories.

- [ ] T024 [P] Run `pnpm lint:js` and fix findings in `packages/react/src/components/Card/Card.jsx` and `packages/react/src/stories/components/Basic/Card.stories.jsx` without disabling, weakening, skipping, or silencing lint rules
- [ ] T025 [P] Run `pnpm check:format` and apply formatting to `packages/react/src/components/Card/Card.jsx`, `packages/react/src/stories/components/Basic/Card.stories.jsx`, and `packages/react/README.md` if needed
- [ ] T026 Run the quickstart validation paths from `specs/029-react-card-wrapper/quickstart.md` against `packages/react/README.md`, `packages/react/src/index.js`, and `packages/react/src/stories/components/Basic/Card.stories.jsx`, then capture command output or review notes as evidence for `SC-001` through `SC-005`
- [ ] T027 Review boundary compliance across `specs/029-react-card-wrapper/spec.md`, `specs/029-react-card-wrapper/contracts/props.md`, `packages/react/src/components/Card/Card.jsx`, and `packages/styles/src/pathable-component-wrappers/pathable-card.scss`, confirming scope stays within React wrapper `Card` and existing `packages/styles` card contract
- [ ] T028 Review visual consistency across `packages/react/src/stories/components/Basic/Card.stories.jsx`, `packages/styles/src/stories/components/Basic/Card.stories.js`, and `specs/029-react-card-wrapper/checklists/behavior-testability.md`, confirming `VIS-CARD-001` through `VIS-CARD-003` remain satisfied without wrapper-only styling
- [ ] T029 Review package-consumer evidence across `packages/react/package.json`, `packages/react/src/index.js`, and `pnpm --filter @pathable/react pack --dry-run` output, confirming no separate consumer-side `@pathable/styles` import is required

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks user story work.
- **User Story 1 (Phase 3)**: Depends on Foundational completion - MVP.
- **User Story 2 (Phase 4)**: Depends on User Story 1 because variant rendering builds on the base Card component.
- **User Story 3 (Phase 5)**: Depends on User Stories 1 and 2 because package output must include the final Card export and examples.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: MVP and required before variant-specific work.
- **User Story 2 (P2)**: Builds on the base `Card` component from US1.
- **User Story 3 (P3)**: Verifies final package output after `Card` and variants are exported.

### Within Each User Story

- Component implementation before stories and README updates.
- Stories before Storybook build validation.
- Export and dependency checks before package-content validation.
- Validation evidence before final review.

### Parallel Opportunities

- T003 can run in parallel with T001 and T002.
- T024 and T025 can run in parallel after implementation files exist.
- T027, T028, and T029 can be reviewed in parallel after validation evidence is captured.

---

## Parallel Examples

### User Story 1

```bash
Task: "Update packages/react/README.md basic Card examples after Card props are implemented"
Task: "Add packages/react/src/stories/components/Basic/Card.stories.jsx basic stories after Card props are implemented"
```

### Polish

```bash
Task: "Run pnpm lint:js and fix Card-related findings"
Task: "Run pnpm check:format and format Card-related files"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup and Phase 2 foundational component shell.
2. Complete Phase 3 so `Card` supports basic title, body, footer, className, and rest props.
3. Validate with `pnpm --filter @pathable/react build`.
4. Stop and review the MVP before variant expansion.

### Incremental Delivery

1. Add base `Card` support and basic documentation.
2. Add documented card presentations and Storybook examples.
3. Verify package export, transitive styling, and package contents.
4. Finish lint, formatting, quickstart, visual, and package-consumer review.

### Parallel Team Strategy

With multiple developers:

1. One developer confirms source contract and creates the Card component shell.
2. One developer prepares Storybook stories after the component props are available.
3. One developer updates documentation and package-consumer validation after exports are in place.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks.
- [US1], [US2], and [US3] labels map tasks to independently testable user stories.
- Do not edit `specs/029-react-card-wrapper/spec.md`, `specs/029-react-card-wrapper/contracts/props.md`, or readiness checklists to make implementation pass; report a blocker if the contracts are wrong.
- Do not disable, weaken, skip, or silence lint rules. Fix the underlying issue or report the lint conflict as a blocker.
