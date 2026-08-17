# Tasks: React Accordion Contract Adoption

**Input**: Design documents from `/specs/042-react-accordion-contract/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/adoption.md

**Tests**: This feature does not request a separate TDD-style test suite. Each
user story's implementation tasks are the executable validation, matched to the
story's Independent Test criterion. The two deliberate conformance breaks
(break React toggle; break shared helper) are execution-time proofs in
`quickstart.md`, not committed code.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 - Proven Styles Contract Adopts in React (P1) 🎯 MVP](#phase-3-user-story-1---proven-styles-contract-adopts-in-react-p1--mvp)
- [Phase 4: User Story 2 - Isolate Native React Behavior (P1)](#phase-4-user-story-2---isolate-native-react-behavior-p1)
- [Phase 5: User Story 3 - Keep React-Specific Tests and Fixtures (P2)](#phase-5-user-story-3---keep-react-specific-tests-and-fixtures-p2)
- [Phase 6: User Story 4 - Register React as a Downstream Target (P2)](#phase-6-user-story-4---register-react-as-a-downstream-target-p2)
- [Phase 7: Polish & Cross-Cutting Concerns](#phase-7-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 1](#parallel-example-user-story-1)
- [Implementation Strategy](#implementation-strategy)
- [Notes](#notes)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a pnpm ESM monorepo. The React Accordion component lives under
`packages/react/src/components/Accordion/`, stories under
`packages/react/src/stories/components/Communication/`, the React Storybook
preview under `apps/storybook-react/.storybook/`, and the target-aware runner
at `scripts/test-storybook.mjs`. The **unchanged** shared helpers and
`StoryHarness` type live in `packages/storybook-contracts/`. Paths below
follow the plan.md structure.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the Phase 1 styles-first baseline exists and the React
adoption workspace is ready before any user story begins.

**This feature adds no new package.** Phase 1 is verification-only: confirm the
private `@pathable/storybook-contracts` package, its six Accordion helpers, and
the focused Styles command exist and pass, because US1-US4 all consume them
unchanged.

- [x] T001 Confirm `packages/storybook-contracts/` exports `StoryHarness` and the six Accordion helpers from `packages/storybook-contracts/src/index.ts` (they must be importable by the React Storybook)
- [x] T002 [P] Run `pnpm --filter @pathable/storybook-contracts lint` and `pnpm --filter @pathable/storybook-contracts typecheck` and confirm both pass, verifying no React-specific or renderer type leaks into the shared contract
- [x] T003 [P] Run `pnpm --filter @pathableai/styles build` and `pnpm test:storybook-styles` from a clean checkout and confirm the Styles baseline passes before any React adoption is trusted
- [x] T004 [P] Record the Phase 1 baseline (helper signatures, `StoryHarness` shape, and `scripts/test-storybook.mjs` `styles` target) in `specs/042-react-accordion-contract/research.md` so US1-US4 reference verified interfaces

**Checkpoint**: The shared contract and Styles baseline are verified green. React
adoption can begin.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Runtime isolation of the React Storybook from the Styles DOM
enhancement runtime for Accordion — the precondition for every trusted React
conformance result.

**⚠️ CRITICAL**: No user story work is trusted until this phase is complete,
because React conformance is meaningless while the Styles enhancement runtime
can decorate markup and mask a broken native implementation.

- [x] T005 Scope the Styles enhancement runtime out for Accordion in `apps/storybook-react/.storybook/preview.js` so the React Storybook does not load `@pathableai/styles/js` enhancement for Accordion stories (leave the import intact for stories that still need it)
- [x] T006 [P] Add a React Accordion isolation guard (e.g. a decorator or story-level check in `apps/storybook-react/.storybook/preview.js` or `packages/react/src/stories/components/Communication/Accordion.stories.tsx`) that fails if both the native React handler and the enhancement handler could own the same Accordion interaction
- [x] T007 [P] Add a short comment in `packages/react/src/components/Accordion/Accordion.tsx` documenting the isolation contract: React Accordion must be owned by its native handler, not the Styles enhancement runtime
- [x] T008 Confirm the React Accordion story renders and interacts through the native `packages/react/src/components/Accordion/Accordion.tsx` implementation with the enhancement runtime absent, and record which story/decorator mechanism was chosen in `specs/042-react-accordion-contract/research.md`

**Checkpoint**: React Accordion is isolated from the Styles enhancement runtime;
dual-ownership configurations fail the guard. US1-US4 conformance is now
trustworthy.

---

## Phase 3: User Story 1 - Proven Styles Contract Adopts in React (P1) 🎯 MVP

**Goal**: React Accordion stories invoke the **unchanged** shared helpers so the
same observable behavior is proven against an isolated native React
implementation.

**Independent Test**: Run the React Accordion stories against the unchanged
shared helpers and confirm they pass through the React package's own native
behavior without the Styles enhancement runtime loading for Accordion.

### Implementation for User Story 1

- [x] T009 [US1] Add deterministic, fixed React Accordion play stories in `packages/react/src/stories/components/Communication/Accordion.stories.tsx` (collapsed and initially expanded) that build a `StoryHarness` from `@storybook/test` (`within`, `userEvent`, `expect`, `canvasElement`) and call the unchanged helpers (e.g. `verifyEnterExpandsDisclosure`, `verifySpaceCollapsesDisclosure`)
- [x] T010 [P] [US1] Add play stories calling the remaining shared helpers (`verifySingleOpenBehavior`, `verifyDisclosurePanelAssociation`, `verifyPanelAvailability`, `verifyFocusRetention`) against the React Accordion in `packages/react/src/stories/components/Communication/Accordion.stories.tsx`
- [x] T011 [US1] Add a runtime-initialized assertion to each React Accordion `play` story in `packages/react/src/stories/components/Communication/Accordion.stories.tsx` that the React runtime has initialized before interaction and fails with target/story/capability context instead of silently skipping
- [x] T012 [US1] Verify the shared helpers are invoked **unchanged** (no edits under `packages/storybook-contracts/`) and that React use is limited to supplying the `StoryHarness` and disclosure names

**Checkpoint**: US1 delivers React Accordion conformance through unchanged shared
helpers. This is the MVP slice.

---

## Phase 4: User Story 2 - Isolate Native React Behavior (P1)

**Goal**: Confirm the React Accordion is an isolated native implementation, not
a decorated version passed through the Styles enhancement runtime, so React
conformance proves native behavior.

**Independent Test**: A guard fails if both the native React and the Styles
enhancement handler can own the same Accordion interaction, and the React
Storybook does not load the Styles enhancement runtime for Accordion. A broken
React toggle fails the React contract while the Styles contract remains green.

### Implementation for User Story 2

- [x] T013 [US2] Run the React Accordion `play` stories (from US1) and capture a passing result for the `react` target, confirming the isolation from Phase 2 holds during execution
- [x] T014 [US2] Deliberately break the React toggle in `packages/react/src/components/Accordion/Accordion.tsx` and verify the React contract fails while `pnpm test:storybook-styles` stays green; restore the code afterward (execution-time proof, not committed)
- [x] T015 [P] [US2] Confirm the isolation guard from Phase 2 fails an ambiguous-ownership configuration (both native React and enhancement handler able to act) rather than silently passing
- [x] T016 [US2] Document the isolation proof and the deliberate-break result in `specs/042-react-accordion-contract/research.md` (expected-conformance evidence, distinct from committed fixtures)

**Checkpoint**: US2 proves React conformance is native-only and that a broken
React implementation does not pass while Styles stays green.

---

## Phase 5: User Story 3 - Keep React-Specific Tests and Fixtures (P2)

**Goal**: Deterministic React fixtures match the shared initial states while
React-specific API behavior stays in separate React tests, never leaking into
the shared contract.

**Independent Test**: Determine deterministic React fixtures for the shared
initial states alongside separate React tests for controlled/uncontrolled state,
`onExpandedChange`, disabled props, refs, and server rendering.

### Implementation for User Story 3

- [x] T017 [US3] Confirm the React Accordion fixtures in `packages/react/src/stories/components/Communication/fixtures.tsx` and `Accordion.stories.tsx` (collapsed `Default`, initially expanded `InitiallyExpanded`) are deterministic and match the shared initial states used by the unchanged helpers
- [x] T018 [P] [US3] Add/adjust separate React tests for controlled state (`expandedIds`) in a React-specific test location (e.g. `packages/react/src/components/Accordion/Accordion.test.tsx`), keeping them out of the shared contract
- [x] T019 [P] [US3] Add/adjust separate React tests for uncontrolled state (`defaultExpandedIds`) and `onExpandedChange` in the same React-specific test location
- [x] T020 [P] [US3] Add/adjust separate React tests for disabled props and refs in the same React-specific test location
- [x] T021 [US3] Document server-rendering behavior of React Accordion in a React-specific test or note (e.g. a server-compat/SSR check) distinct from the shared contract, per `packages/react` conventions
- [x] T022 [US3] Confirm no React-specific API behavior (controlled/uncontrolled, `onExpandedChange`, disabled, refs, server-rendering) appears in `packages/storybook-contracts/` or any shared helper

**Checkpoint**: US3 keeps the shared/renderer-neutral contract clean; all
React-specific behavior lives in separate React tests that pass independently.

---

## Phase 6: User Story 4 - Register React as a Downstream Target (P2)

**Goal**: Register React as a downstream target in the target-aware runner and
aggregate reporting **only after** its isolated native implementation passes, so
React conformance is reported alongside Styles without masking a skipped or
unregistered target.

**Independent Test**: After the isolated React Accordion implementation passes,
add React as a downstream target to aggregate reporting and run the aggregate;
a broken shared helper fails both targets together.

### Implementation for User Story 4

- [x] T023 [US4] Add a `react` target to the registry in `scripts/test-storybook.mjs` (storybook Workspace `@pathable/storybook-react`, build commands, static output under `apps/storybook-react/`, dedicated port, the six shared capabilities, and the Accordion fixture→story-id map)
- [x] T024 [US4] Ensure the `react` target runs **strictly after** `styles` and reports a terminal pass/fail result; confirm unknown targets, occupied ports, missing builds/stories, and test failures remain hard failures in `scripts/test-storybook.mjs`
- [x] T025 [US4] Add the React isolation guard module (from Phase 2) to the React target's build/readiness flow so the runner does not exercise React conformance before isolation is verified
- [x] T026 [US4] Deliberately break the shared helper (e.g. in `packages/storybook-contracts/`) and verify both the `styles` and `react` targets fail together, proving shared ownership of the proof; restore the code afterward (execution-time proof, not committed)
- [x] T027 [US4] Run `pnpm test:storybook` (aggregate) and confirm it reports terminal pass/fail for both `styles` and `react` with no skipped/missing/unregistered target hidden by a green aggregate
- [x] T028 [US4] Update `package.json` so `test:storybook-react` documents/uses the `react` target through the runner (or is retained as package-specific) and the aggregate `test:storybook` description covers both targets

**Checkpoint**: US4 registers React as a downstream target in the shared runner
and aggregate, gated on isolated native conformance.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and end-to-end
validation.

- [x] T029 [P] Run `pnpm pack --dry-run` on `@pathableai/react` and confirm `packages/storybook-contracts` adds no file to the publishable payload (unchanged from Phase 1)
- [x] T030 [P] Run `pnpm lint`, `pnpm typecheck`, and `git diff --check` and fix any findings
- [x] T031 Run the full `quickstart.md` validation end-to-end from a clean checkout, including both conformance proofs (break React toggle; break shared helper), and record results
- [x] T032 Final review: confirm `packages/storybook-contracts/` and `packages/styles` were not modified during Phase 2 (Styles-target-first ownership preserved)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verifies the Phase 1 baseline exists
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user story conformance
- **User Story 1 (Phase 3)**: Depends on Foundational (isolation) - develops the conformance stories
- **User Story 2 (Phase 4)**: Depends on US1 stories existing - proves isolation/native-only
- **User Story 3 (Phase 5)**: Depends on Foundational - can run parallel to US1/US2
- **User Story 4 (Phase 6)**: Depends on US1 (stories), US2 (isolation proof), and Foundational (guard)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - MVP; no dependency on other stories
- **User Story 2 (P1)**: Depends on US1 play stories - proves the isolation is real
- **User Story 3 (P2)**: Can start after Foundational - independent of US1/US2
- **User Story 4 (P2)**: Depends on US1/US2 green - registers the react target

### Within Each User Story

- The isolation guard (Phase 2) is a hard prerequisite for US1-US4 conformance
- US1 develop helpers-invoking stories before US4 registers the target
- US2 proof depends on US1 stories
- US3 keeps React-specific scope separate throughout

### Parallel Opportunities

- Phase 1 verification tasks T002-T004 are independent
- Phase 2 guard/preview tasks T005-T007 are independent (touch different files)
- US1 play-story tasks T009-T010 can run after harness setup
- US2 and US3 can proceed in parallel after Foundational
- US4 depends on US1/US2 but its runner-registry task is independent of US3

---

## Parallel Example: User Story 1

```bash
# Foundation first (the harness the stories use):
Task: "Confirm StoryHarness in packages/storybook-contracts/src/index.ts"
Task: "Confirm styles baseline green (pnpm test:storybook-styles)"

# Then add conformance stories (depends on the above):
Task: "Add deterministic fixed Accordion play stories calling unchanged helpers
        in packages/react/src/stories/components/Communication/Accordion.stories.tsx"
Task: "Add remaining-helper and runtime-initialized play stories
        in Accordion.stories.tsx"
```

```bash
# Parallel after isolation:
Task: "Add React-specific tests (controlled/uncontrolled, onExpandedChange, disabled, refs)"
Task: "Add react target to scripts/test-storybook.mjs"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify baseline)
2. Complete Phase 2: Foundational (isolation guard + preview)
3. Complete Phase 3: User Story 1 (conformance stories via unchanged helpers)
4. **STOP and VALIDATE**: React Accordion contract passes through native behavior
   with the enhancement runtime absent
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → isolated React runtime
2. Add User Story 1 → React contract conformance (MVP)
3. Add User Story 2 → native-only isolation proof
4. Add User Story 3 → React-specific scope kept separate
5. Add User Story 4 → downstream target registered in aggregate

### Parallel Team Strategy

- Team completes Setup + Foundational together (isolation is the gate)
- Once isolation is done:
  - Developer A: User Story 1 (conformance stories) then User Story 4 (target)
  - Developer B: User Story 2 (isolation proof) and User Story 3 (React-specific tests)
- Integrate: User Story 4 aggregate reporting

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to the spec.md user story
- US1 is the suggested MVP slice; US2-US4 build on it
- US1-US3 make no change to `packages/storybook-contracts/` or `packages/styles` — they adopt the unchanged helpers
- The deliberate conformance breaks (US2 T014, US4 T026) are execution-time proofs, not committed
- Commit after each task or logical group
- Run `quickstart.md` at each major checkpoint