# Tasks: Accordion Behavior Contract Pilot

**Input**: Design documents from `/specs/036-accordion-behavior-contract/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/runner.md, quickstart.md

**Tests**: Browser-executed conformance is the feature. Tasks follow a
test-first sequence: define the shared scenarios and assertions before wiring
the target runner and fixtures that make them pass.

**Organization**: Tasks are grouped by user story so the canonical contract,
target conformance, and routine validation remain independently reviewable.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1](#phase-3-user-story-1---define-accordion-behavior-once-priority-p1-mvp)
- [Phase 4: User Story 2](#phase-4-user-story-2---verify-independent-implementations-priority-p2)
- [Phase 5: User Story 3](#phase-5-user-story-3---run-conformance-in-normal-validation-priority-p3)
- [Phase 6: Polish](#phase-6-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it changes a different file with no
  dependency on unfinished work.
- **[Story]**: Maps a task to its specification user story.
- Every task names its concrete repository path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish top-level tooling and root commands without changing a
package's production dependencies.

- [x] T001 Add `@cucumber/cucumber` as a root development dependency in `package.json` and `pnpm-lock.yaml`
- [x] T002 Create the top-level contract directory and contributor overview in `behavior-contracts/README.md`
- [x] T003 [P] Configure Cucumber feature and ESM support discovery in `behavior-contracts/cucumber.mjs`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the shared target and browser lifecycle abstractions needed
by every scenario.

**⚠️ CRITICAL**: No user story can execute until this phase is complete.

- [x] T004 Define required capabilities, target metadata, fixture mappings, and validation in `behavior-contracts/targets.mjs`
- [x] T005 Implement per-scenario target, page, fixture navigation, and disclosure resolution state in `behavior-contracts/support/world.mjs`
- [x] T006 Implement shared browser launch, isolated context setup, teardown, and cleanup hooks in `behavior-contracts/support/hooks.mjs`

**Checkpoint**: Cucumber can create a browser world for a validated target and
resolve a package-specific story from a shared fixture name.

---

## Phase 3: User Story 1 - Define Accordion Behavior Once (Priority: P1) 🎯 MVP

**Goal**: Store one readable executable definition for the three shared
Accordion rules and their observable outcomes.

**Independent Test**: Parse the feature with Cucumber and verify all steps are
defined using framework-neutral names, accessible roles, keyboard actions,
ARIA state, associated-panel availability, and focus.

### Tests for User Story 1

- [x] T007 [US1] Write the three traceable readable Accordion scenarios in `behavior-contracts/features/accordion.feature`
- [x] T008 [US1] Implement fixture, keyboard, disclosure-state, panel-availability, and focus step definitions in `behavior-contracts/steps/accordion.steps.mjs`

### Implementation for User Story 1

- [x] T009 [US1] Validate the feature has exactly three scenarios and no undefined, pending, or package-specific steps through `behavior-contracts/cucumber.mjs`

**Checkpoint**: One canonical contract describes Enter expansion, Space
collapse, and single-open behavior without framework implementation details.

---

## Phase 4: User Story 2 - Verify the Initial Implementation (Priority: P2)

**Goal**: Supply styles fixtures, prove the reference implementation conforms,
and defer framework registration without modifying React.

**Independent Test**: Run all discovered features against the styles Storybook,
observe three passing scenarios, and confirm the feature diff contains no React
component, story, or catalog changes.

### Tests for User Story 2

- [x] T010 [P] [US2] Add deterministic collapsed and initially-expanded styles fixtures in `packages/styles/src/stories/components/Communication/Accordion.stories.ts`
- [x] T011 [P] [US2] Confirm React components, stories, and catalog configuration remain outside this feature's diff

### Implementation for User Story 2

- [x] T012 [US2] Keep framework targets, including React, explicitly deferred in `behavior-contracts/README.md`
- [x] T013 [US2] Register the styles fixture story IDs, capabilities, build prerequisites, static directory, and port in `behavior-contracts/targets.mjs`
- [x] T014 [US2] Execute the styles Cucumber target and correct any shared-contract or fixture mismatch in `behavior-contracts/`

**Checkpoint**: The reference implementation produces three passing
conformance results and React remains unchanged and unregistered.

---

## Phase 5: User Story 3 - Run Conformance in Normal Validation (Priority: P3)

**Goal**: Give contributors and CI one reliable command that owns target build,
serve, readiness, execution, reporting, and cleanup.

**Independent Test**: Run the aggregate command from a clean checkout and
verify target-labelled results, nonzero propagation on failure, bounded
readiness, and no remaining owned server or browser processes.

### Tests for User Story 3

- [x] T015 [US3] Define runner preflight, readiness, child failure, signal, and cleanup expectations in `behavior-contracts/README.md`

### Implementation for User Story 3

- [x] T016 [US3] Implement sequential build, static-server readiness, Cucumber invocation, target-labelled output, signal handling, and cleanup in `behavior-contracts/run.mjs`
- [x] T017 [US3] Add general aggregate and styles-only contract scripts in `package.json` and enforce the general command under a component-neutral job in `.github/workflows/ci-full.yml`
- [x] T018 [US3] Verify unknown targets and missing fixture/capability registrations fail with actionable target context through `behavior-contracts/run.mjs`

**Checkpoint**: Local and CI-compatible commands discover every feature, run
every registered target, and clean up owned processes.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Reconcile documentation, validators, and complete repository
evidence before publication.

- [x] T019 [P] Document implementation ownership, Gherkin consumption, target registration, exclusions, and manual-review limits in `behavior-contracts/README.md`
- [x] T020 Verify lint coverage includes all `behavior-contracts/**/*.mjs` files in `eslint.config.js`
- [x] T021 Run focused validation commands from `specs/036-accordion-behavior-contract/quickstart.md`
- [x] T022 Run `pnpm lint`, `pnpm typecheck`, `pnpm test:storybook`, `pnpm test:next-consumer`, and `git diff --check origin/main`
- [x] T023 Reconcile the implementation with `specs/036-accordion-behavior-contract/spec.md`, `plan.md`, `contracts/runner.md`, and mark all completed tasks in `specs/036-accordion-behavior-contract/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately.
- **Foundational (Phase 2)**: Depends on root dependency and directory setup.
- **US1 (Phase 3)**: Depends on the world and hook interfaces; supplies the
  test-first contract.
- **US2 (Phase 4)**: Depends on US1; makes the initially failing shared contract
  executable against both packages.
- **US3 (Phase 5)**: Depends on the initial target passing; packages lifecycle
  into stable contributor commands.
- **Polish (Phase 6)**: Depends on all user stories.

### User Story Dependencies

- **US1**: No dependency on package implementation edits after Foundation.
- **US2**: Uses US1's feature and shared steps.
- **US3**: Orchestrates the passing target runs from US2.

### Parallel Opportunities

- T003 can proceed alongside T002 after T001 starts.
- T010 and T011 inspect/update separate package story files.
- T019 can proceed while validator coverage is inspected in T020.
- Independent validation commands may run concurrently when they do not use
  the same Storybook ports or build output directories.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundation.
2. Write the shared Gherkin scenarios and steps.
3. Confirm they parse and fail before target fixtures/runners are complete.
4. Review the contract language before package integration.

### Incremental Delivery

1. Canonical contract → one reviewable shared behavior source.
2. Styles target → executable reference implementation evidence.
3. General aggregate launcher → repeatable local and CI workflow.
4. Future framework targets → separately scoped conformance evidence.
5. Full validation → PR-ready repository evidence.

## Notes

- Shared steps use roles, accessible names, ARIA relationships, visibility,
  and focus rather than PathAble CSS classes or test IDs.
- Existing Storybook `play` tests remain useful for package-specific APIs and
  interactive debugging; this feature does not generate replacements.
- Disabled and multiple-open behavior remain out of the shared pilot until
  their source ownership and parity are separately resolved.
