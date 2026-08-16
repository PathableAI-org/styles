# Tasks: Component Test Infrastructure

**Input**: Design documents from `/specs/041-component-test-infra/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/runner.md

**Tests**: This feature does not request dedicated TDD-style test tasks. Each
user story's implementation tasks are themselves the executable validation,
matched to the story's Independent Test criterion. The target-aware runner and
evidence report are validated end-to-end via `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 - Record the Accordion Capability Manifest (P1)](#phase-3-user-story-1---record-the-accordion-capability-manifest-p1)
- [Phase 4: User Story 2 - Provide One Shared Validation Path (P1)](#phase-4-user-story-2---provide-one-shared-validation-path-p1)
- [Phase 5: User Story 3 - Run Consistent Target Lifecycle (P2)](#phase-5-user-story-3---run-consistent-target-lifecycle-p2)
- [Phase 6: User Story 4 - Report Evidence Without Overstating It (P2)](#phase-6-user-story-4---report-evidence-without-overstating-it-p2)
- [Phase 7: User Story 5 - Retire the Pilot Only After Equivalence (P3)](#phase-7-user-story-5---retire-the-pilot-only-after-equivalence-p3)
- [Phase 8: Polish & Cross-Cutting Concerns](#phase-8-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 2](#parallel-example-user-story-2)
- [Implementation Strategy](#implementation-strategy)
- [Notes](#notes)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a pnpm ESM monorepo. New shared contract code lives under
`packages/storybook-contracts/`; repository-root tooling lives under
`scripts/`; the Styles catalog lives under `packages/styles/src/stories/`. Paths
below follow the plan.md structure.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create the private `packages/storybook-contracts` workspace package with a `package.json` (`private: true`, explicit `exports`, `type: module`), `tsconfig.json`, minimal `README.md`, and a stub `src/` dir
- [ ] T002 [P] Register `packages/storybook-contracts` so `apps/storybook` can import it via the existing `packages/*` workspace glob in `pnpm-workspace.yaml` (no new glob needed)
- [ ] T003 [P] Add package scripts `lint`, `format`, and `typecheck` in `packages/storybook-contracts/package.json` that reuse the root ESLint/Prettier/TypeScript tooling
- [ ] T004 [P] Add one shared type for a structural test interface (e.g. `StructuralElement`) exported from `packages/storybook-contracts/src/index.ts`; it must not reference React, Storybook renderer types, CSS selectors, or package internals

**Checkpoint**: `pnpm --filter @pathable/storybook-contracts lint` and `typecheck` pass and the package is importable without adding files to any publishable package.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Create the Accordion capability manifest at `packages/storybook-contracts/src/accordion/manifest.ts` listing the six initial shared capabilities (keyboard-enter, keyboard-space, single-open, panel-association, panel-availability, focus-retention) with `scope: 'shared'` and `state: 'initial'`
- [ ] T006 In `packages/storybook-contracts/src/accordion/manifest.ts`, mark controlled/uncontrolled props, callbacks, refs, and server-rendering as package-specific (outside shared scope)
- [ ] T007 [P] In `packages/storybook-contracts/src/accordion/manifest.ts`, mark disabled-item and multiple-open behavior as `state: 'unresolved'` shared scope (deferred until `packages/styles` exposes the same promise)
- [ ] T008 [P] Create `packages/storybook-contracts/src/accordion/types.ts` with the shared fixture and capability types referenced by the manifest and the helpers
- [ ] T009 [P] Add a unit guard test (in `packages/storybook-contracts/test/` or a `src/*.test.ts`) asserting the manifest lists exactly the six initial shared capabilities and bounds the shared fixture set
- [ ] T010 [P] Verify the manifest against `specs/036-accordion-behavior-contract/` and the Styles and React Accordion stories by adding a reconciliation note to `packages/storybook-contracts/src/accordion/README.md`; no current shared assertion is dropped

**Checkpoint**: Foundation ready - the manifest and types underpin all user stories; US1 through US5 can begin.

---

## Phase 3: User Story 1 - Record the Accordion Capability Manifest (P1)

**Goal**: A single reviewable Accordion capability manifest records the shared,
observable contract and its evidence boundary, reconciling the Cucumber pilot,
Styles fixtures, React stories, and component documentation.

**Independent Test**: Review the manifest alongside the existing Cucumber
Accordion feature and both Accordion stories; confirm no currently-supported
shared assertion is missing.

### Implementation for User Story 1

- [ ] T011 [US1] Add a rendered-stories reconciliation pass to `packages/storybook-contracts/src/accordion/README.md` confirming the manifest covers Enter expansion, Space collapse, single-open, disclosure-to-panel association, panel availability, and focus retention as observed in `apps/storybook` and `apps/storybook-react`
- [ ] T012 [US1] Document in `packages/storybook-contracts/src/accordion/README.md` that controlled/uncontrolled props, callbacks, refs, and server-rendering remain package-specific and are excluded from the shared contract
- [ ] T013 [US1] Document in `packages/storybook-contracts/src/accordion/README.md` that disabled and multiple-open behavior are unresolved shared scope until the Styles package documents the same promise
- [ ] T014 [US1] Add a link/note from the Styles Accordion story `packages/styles/src/stories/components/Communication/Accordion.stories.ts` to the capability manifest so the two surfaces stay consistent

**Checkpoint**: US1 delivers the reviewable manifest; the manifest alone is a
self-contained, independently testable artifact.

---

## Phase 4: User Story 2 - Provide One Shared Validation Path (P1)

**Goal**: A renderer-neutral helper per capability is authored once and proven
by the Styles catalog via a focused, Styles-only command, without coupling
packages to the same renderer or public API.

**Independent Test**: Inspect the helpers and the Styles Accordion stories;
confirm the helpers exercise only accessible roles, user actions, and observable
outcomes, and that a Styles-only command passes without building or starting the
React Storybook.

### Implementation for User Story 2

- [ ] T015 [P] [US2] Create `packages/storybook-contracts/src/accordion/verifyEnterExpandsDisclosure.ts` exercising keyboard activation and asserting the expanded state via accessible queries and observable semantics
- [ ] T016 [P] [US2] Create `packages/storybook-contracts/src/accordion/verifySpaceCollapsesDisclosure.ts` exercising Space activation and asserting the collapsed state
- [ ] T017 [P] [US2] Create `packages/storybook-contracts/src/accordion/verifySingleOpenBehavior.ts` asserting that activating a second disclosure closes the first
- [ ] T018 [P] [US2] Create `packages/storybook-contracts/src/accordion/verifyDisclosurePanelAssociation.ts` asserting the disclosure resolves to its associated panel (generated IDs may vary)
- [ ] T019 [P] [US2] Create `packages/storybook-contracts/src/accordion/verifyPanelAvailability.ts` asserting the panel is available only when expanded (e.g. `hidden` when collapsed)
- [ ] T020 [P] [US2] Create `packages/storybook-contracts/src/accordion/verifyFocusRetention.ts` asserting focus stays on the disclosure after activation
- [ ] T021 [US2] Export all helpers and the manifest from `packages/storybook-contracts/src/index.ts` with explicit named exports
- [ ] T022 [US2] Add deterministic, named Accordion `play` stories in `packages/styles/src/stories/components/Communication/Accordion.stories.ts` (collapsed and initially expanded) that call the shared helpers while the catalog imports the built public `@pathableai/styles/js` behavior
- [ ] T023 [US2] Add a runtime-initialized assertion to each Styles Accordion `play` story in `packages/styles/src/stories/components/Communication/Accordion.stories.ts` that fails with target/story/capability context instead of silently skipping
- [ ] T024 [US2] Add a focused `test:storybook-styles` script in `package.json` that runs the Styles target without building or starting the React Storybook
- [ ] T025 [US2] Verify `pnpm test:storybook-styles` passes from a clean checkout and that `scripts/test-storybook.sh apps/storybook 6006` (the pre-consolidation Styles path) is no longer required to prove the helpers

**Checkpoint**: US2 delivers a working Styles-only shared-validation path. This
is the MVP slice.

---

## Phase 5: User Story 3 - Run Consistent Target Lifecycle (P2)

**Goal**: One target-aware runner owns build → serve → ready → test → report →
cleanup per registered target, with `styles` registered first, and consolidates
the duplicated shell/Cucumber/CI lifecycle logic.

**Independent Test**: Exercise success, test-failure, unavailable-port,
unavailable-catalog, SIGINT, and SIGTERM paths; confirm no owned browser or
server process remains after any.

### Implementation for User Story 3

- [ ] T026 [US3] Create `scripts/test-storybook.mjs` as the target-aware runner with explicit target metadata (workspace, build commands, static dir, port, capabilities, fixtures) and direct `/iframe.html` story URLs
- [ ] T027 [US3] Register the `styles` target in `scripts/test-storybook.mjs` (or a `scripts/targets.mjs` module) first, with the existing `behavior-contracts/targets.mjs` capability/fixture set ported over
- [ ] T028 [US3] Implement bounded readiness (30s) and server lifecycle in `scripts/test-storybook.mjs`, treating unknown targets, occupied ports, missing build output, and missing stories as hard failures
- [ ] T029 [US3] Implement labeled per-target results and terminal pass/fail in `scripts/test-storybook.mjs` so a skipped/missing/unregistered target is a failure, never hidden by a green aggregate
- [ ] T030 [US3] Add `SIGINT`/`SIGTERM` handlers and owned-process cleanup to `scripts/test-storybook.mjs` across success, failure, and interruption
- [ ] T031 [US3] Wire `test:storybook-styles` to `scripts/test-storybook.mjs styles` in `package.json`; keep `test:storybook-react` package-specific; redefine `test:storybook` as the documented aggregate
- [ ] T032 [US3] Replace the duplicate server lifecycle in `.github/workflows/ci-full.yml` with a call to `scripts/test-storybook.mjs`, removing the inline build/serve/wait/cleanup YAML for the styles target
- [ ] T033 [US3] Delete `scripts/test-storybook.sh` only after `scripts/test-storybook.mjs` covers both the styles and package-specific lifecycle uses
- [ ] T034 [US3] Add lifecycle negative-path validation (per `quickstart.md`) covering test failure, occupied port, missing build output, SIGINT, and SIGTERM with zero owned processes remaining

**Checkpoint**: US3 delivers a single runner replacing the duplicated lifecycle
logic; styles and package-specific targets run through it sequentially.

---

## Phase 6: User Story 4 - Report Evidence Without Overstating It (P2)

**Goal**: Evidence reporting separates deterministic state fixtures, executable
behavior-contract adoption, and automated accessibility execution, with Axe
exceptions scoped to the narrowest story-level registry entry rather than
catalog-wide exclusions.

**Independent Test**: Read the Accordion report; confirm it names the Styles
story, each covered capability, its Axe execution, and any exception, while
treating a story ID as distinct from behavior coverage and never labeling an
aggregate as WCAG certification.

### Implementation for User Story 4

- [ ] T035 [US4] Create `scripts/accessibility-exceptions.mjs` as a shared, reviewable registry scoped to target, story, and rule with rationale and tracking reference
- [ ] T036 [US4] Convert the existing Styles catalog-wide Axe exclusions in `apps/storybook/.storybook/` to the narrowest story-level exceptions in the registry, without broadening failures to make the refactor pass
- [ ] T037 [US4] Create `scripts/storybook-evidence-report.mjs` reporting three separate measures: deterministic fixtures, executable contract adoption, and automated Axe execution
- [ ] T038 [US4] Make the report distinguish story presence from capability coverage and include any exception from the registry for the Accordion story
- [ ] T039 [US4] Ensure no report/aggregate output is labeled WCAG certification; keep visual smoke and manual keyboard/focus/assistive-technology review as separate evidence in `scripts/storybook-evidence-report.mjs`
- [ ] T040 [US4] Run the Accordion report and verify it lists the Styles story (`--default` and `--initially-expanded`), six covered capabilities, Axe execution, and any exceptions

**Checkpoint**: US4 delivers honest, separated evidence for the Accordion story,
independently reviewable from the runner.

---

## Phase 7: User Story 5 - Retire the Pilot Only After Equivalence (P3)

**Goal**: Remove the duplicate top-level Accordion Cucumber pilot only after the
new Styles validation produces equivalent evidence, keeping the pilot green and
independently runnable in the meantime.

**Independent Test**: Compare the new Styles `play` results with every existing
Cucumber scenario and confirm equivalence before the pilot's feature, steps,
custom runner, Cucumber dependency, and duplicate CI job are removed, and
confirm no other feature depends on them.

### Implementation for User Story 5

- [ ] T041 [US5] Compare the new Styles `play` results against the three existing scenarios in `behavior-contracts/features/accordion.feature` and record equivalence in `specs/041-component-test-infra/research.md` (or a dedicated equivalence note)
- [ ] T042 [US5] Confirm no other feature or CI job depends on `behavior-contracts/` (search `.github/` and `package.json` scripts) before removal
- [ ] T043 [US5] Delete `behavior-contracts/features/accordion.feature`, `behavior-contracts/steps/`, `behavior-contracts/support/`, `behavior-contracts/cucumber.mjs`, `behavior-contracts/run.mjs`, and `behavior-contracts/targets.mjs` after equivalence is accepted
- [ ] T044 [US5] Remove `@cucumber/cucumber` from root `package.json` devDependencies and update `pnpm-lock.yaml`
- [ ] T045 [US5] Remove the duplicate pilot CI job in `.github/workflows/ci-full.yml` that invokes the Cucumber runner
- [ ] T046 [US5] Update `docs/testing/` so commands, paths, failure behavior, and the Styles-first rule match the implemented system
- [ ] T047 [US5] Add an architecture record (in `docs/testing/` or `specs/041-component-test-infra/research.md`) explaining why direct Storybook helpers are the default and when Gherkin would still be justified

**Checkpoint**: US5 fully retires the pilot only after equivalence; until then,
`pnpm test:contracts:styles` remains green and independently runnable.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T048 [P] Run `pnpm pack --dry-run` on `@pathableai/styles` and `@pathableai/react` and confirm `packages/storybook-contracts` adds no file to either publishable payload
- [ ] T049 [P] Update `docs/testing/tooling-and-structure.md` to remove the obsolete `packages/storybook-contracts/` proposal ambiguity now that the package exists
- [ ] T050 Run the full `quickstart.md` validation end-to-end from a clean checkout
- [ ] T051 Run `pnpm lint`, `pnpm typecheck`, and `git diff --check` and fix any findings
- [ ] T052 Final review: confirm no React story, catalog, or component changed in Phase 1

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - creates the manifest/types on which all stories depend
- **User Story 1 (Phase 3)**: Depends on Foundational - completes and documents the manifest
- **User Story 2 (Phase 4)**: Depends on Foundational - implements helpers and Styles proof; independent of US1 but shares the manifest
- **User Story 3 (Phase 5)**: Depends on Foundational - can start after setup; consolidates the runner
- **User Story 4 (Phase 6)**: Depends on Foundational and works best after US2/US3 (runner + Styles proof exist) for a meaningful report
- **User Story 5 (Phase 7)**: Depends on US2 (equivalence target), US3 (runner), and US4 (evidence) being green
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependency on other stories
- **User Story 2 (P1)**: Can start after Foundational - MVP; is the equivalence baseline for US5
- **User Story 3 (P2)**: Can start after Foundational - may run independently of US1/US2 authoring but the Styles target must exist
- **User Story 4 (P2)**: Depends on US2/US3 for runner results and Style proof
- **User Story 5 (P3)**: Depends on equivalence (US2), runner (US3), and reporting (US4)

### Within Each User Story

- Types/capabilities are defined in Foundational before story authoring
- Helpers (US2) before Styles `play` stories before the focused command
- Runner lifecycle before CI consolidation before negative-path validation
- Registry before conversion before report generation

### Parallel Opportunities

- Phase 1 tasks T002-T004 are independent
- Phase 2 manifest and types tasks are independent
- US2 helper tasks T015-T020 are independent and can run in parallel
- US3 lifecycle, signal, and registry tasks are independent within the story
- US1 and US2 can proceed in parallel after Foundational
- US3 and US4 can proceed in parallel after Foundational (though US4 benefits from US3)

---

## Parallel Example: User Story 2

```bash
# Launch all Accordion helpers together:
Task: "Create verifyEnterExpandsDisclosure.ts"
Task: "Create verifySpaceCollapsesDisclosure.ts"
Task: "Create verifySingleOpenBehavior.ts"
Task: "Create verifyDisclosurePanelAssociation.ts"
Task: "Create verifyPanelAvailability.ts"
Task: "Create verifyFocusRetention.ts"
```

```bash
# Then wire the focused Styles path (depends on the helpers):
Task: "Add play stories + runtime-init assertion in Accordion.stories.ts"
Task: "Wire --filter build + test:storybook-styles in package.json"
```

---

## Implementation Strategy

### MVP First (User Story 2 Only)

1. Complete Phase 1: Setup (storybook-contracts package)
2. Complete Phase 2: Foundational (manifest + types)
3. Complete Phase 4: User Story 2 (helpers + Styles `play` proof + `test:storybook-styles`)
4. **STOP and VALIDATE**: `pnpm test:storybook-styles` passes from a clean checkout
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → package and manifest
2. Add User Story 1 → manifest documented/reconciled
3. Add User Story 2 → Styles-only shared validation (MVP)
4. Add User Story 3 → consolidated target-aware runner
5. Add User Story 4 → honest evidence reporting
6. Add User Story 5 → retire the pilot (only after equivalence)

### Parallel Team Strategy

- Team completes Setup + Foundational together
- Once Foundational is done:
  - Developer A: User Story 1 (manifest)
  - Developer B: User Story 2 (helpers + Styles proof)
  - Developer C: User Story 3 (runner)
- Later: User Story 4 (reporting) then User Story 5 (pilot retirement)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to the spec.md user story
- US1 and US2 are both P1; US2 is the suggested MVP slice
- US5 makes no code change until equivalence is accepted; the pilot stays runnable
- Avoid React catalog/code changes in Phase 1 - they are Phase 2 of the refactor
- Commit after each task or logical group
- Run `quickstart.md` at each major checkpoint