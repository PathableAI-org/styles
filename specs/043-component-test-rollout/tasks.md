# Tasks: Component Test Rollout

**Input**: Design documents from `/specs/043-component-test-rollout/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/rollout-ledger.md, contracts/helper-taxonomy.md

**Tests**: This feature does not request dedicated TDD-style test tasks. Each
user story's implementation tasks are themselves the executable validation,
matched to the story's Independent Test criterion. Components are proven through
their Styles Storybook `play` functions, the focused runner, and the evidence
report as defined in `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story. The rollout ledger is provisioned in
Foundational (it underpins all stories) and closed out in User Story 6.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 - Stateful Keyboard and Focus (Wave A) (P1)](#phase-3-user-story-1---stateful-keyboard-and-focus-wave-a-p1)
- [Phase 4: User Story 2 - Native and Custom Form Controls (Wave B) (P1)](#phase-4-user-story-2---native-and-custom-form-controls-wave-b-p1)
- [Phase 5: User Story 3 - Navigation, Collections, and Activation (Wave C) (P2)](#phase-5-user-story-3---navigation-collections-and-activation-wave-c-p2)
- [Phase 6: User Story 4 - Status, Feedback, Progress (Wave D) (P2)](#phase-6-user-story-4---status-feedback-progress-wave-d-p2)
- [Phase 7: User Story 5 - Visual and Composition-Led (Wave E) (P3)](#phase-7-user-story-5---visual-and-composition-led-wave-e-p3)
- [Phase 8: User Story 6 - Rollout Ledger (P1)](#phase-8-user-story-6---rollout-ledger-p1)
- [Phase 9: Polish & Cross-Cutting Concerns](#phase-9-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 1 (Wave A)](#parallel-example-user-story-1-wave-a)
- [Implementation Strategy](#implementation-strategy)
- [Notes](#notes)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a pnpm ESM monorepo. Shared renderer-neutral contract code lives under
`packages/storybook-contracts/`; repository-root tooling under `scripts/`; the
Styles component catalog under `packages/styles/src/stories/`. Each component is
proven in place in its existing `.stories.ts` file. Paths below follow
`plan.md` and `data-model.md`.

Per the plan, components in a wave are proven one at a time (`FR-003`);
parallel (`[P]`) tasks are limited to components that share only
non-overlapping infrastructure and cannot overwrite each other's fixtures or
output.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the Phase 1/2 baseline that Phase 3 builds on is present
and green. No new workspace package is created.

- [ ] T001 Verify the private `packages/storybook-contracts` workspace package
      builds (`pnpm --filter @pathable/storybook-contracts build`) and exports
      the Accordion manifest/six helpers from `src/index.ts` unchanged
- [ ] T002 [P] Verify `scripts/test-storybook.mjs` registers the `styles` (first)
      and `react` targets and that `pnpm test:storybook-styles` passes from the
      current clean checkout (no React build)
- [ ] T003 [P] Verify `scripts/storybook-evidence-report.mjs` produces the
      Accordion report with the three separate measures and the
      `scripts/accessibility-exceptions.mjs` registry is loadable

**Checkpoint**: The Phase 1/2 baseline is green and importable; Phase 3 can
begin.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Provision the rollout ledger and shared-capability taxonomy modules
that every wave story depends on. No component proof can be recorded without the
ledger.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create the rollout ledger module at
      `packages/storybook-contracts/src/rollout/rollout.ts` with a
      `RolloutEntry[]` covering every component target in
      `packages/styles/src/stories/components/` (wave A–E, category
      `shared`/`styles-only`, status `not-started`) per
      `contracts/rollout-ledger.md`
- [ ] T005 [P] Define the `RolloutEntry`, `CapabilityRef`, `FixtureRef`, and
      `DownstreamAdoption` types (with `wave`, `category`, `status`) in
      `packages/storybook-contracts/src/rollout/types.ts` per `data-model.md`
- [ ] T006 [P] Create the shared-capability group directories and a minimal
      exported index `packages/storybook-contracts/src/{disclosure,overlay,composite-widget,focus}/index.ts` per `contracts/helper-taxonomy.md`
- [ ] T007 Export the rollout ledger and capability-group indices from
      `packages/storybook-contracts/src/index.ts` with explicit named exports so
      `scripts/storybook-evidence-report.mjs` can read them
- [ ] T008 [P] Add a narrow per-component/wave filter to
      `scripts/test-storybook.mjs` (`--filter <story-id-prefix>`) that preserves
      the runtime-initialized assertion and target/story/capability failure
      context (`FR-015`)
- [ ] T009 [P] Update `scripts/storybook-evidence-report.mjs` to read the rollout
      ledger and report per-component (not just Accordion) three separate
      measures: deterministic fixtures, executable contract adoption, automated
      Axe — never labeled WCAG certification

**Checkpoint**: Ledger and taxonomy are importable, the runner filters narrowly,
and the evidence report is ledger-aware. Wave stories can now be proven and
recorded.

---

## Phase 3: User Story 1 - Stateful Keyboard and Focus (Wave A) (P1)

**Goal**: Prove the components with the highest risk of false confidence from
static checks — modal, banner, combo box, date picker, date-range picker, header,
sidenav, search — via reusable disclosure, overlay, composite-widget, and focus
helpers, one component at a time.

**Why this priority**: These carry the most interaction and focus behavior;
static Axe gives the least reliable signal, so proving them first both de-risks
the highest-value behavior and produces the reusable helpers later waves build
on.

**Independent Test**: For each stateful focus-bearing component, run its
Styles-interaction proof against the shared validators and confirm every named
starting fixture, its keyboard/focus obligations, and its disabled/invalid/
containment states are covered before Wave B begins.

### Wave A: Modal (disclosure/overlay/focus helpers)

- [ ] T010 [US1] Add deterministic Modal fixtures (closed, open) to
      `packages/styles/src/stories/components/Communication/Modal.stories.ts`
- [ ] T011 [P] [US1] Create `verifyOpenCloseViaTrigger` overlay helper in
      `packages/storybook-contracts/src/overlay/verifyOpenCloseViaTrigger.ts`
- [ ] T012 [P] [US1] Create `verifyAccessibleName` and `verifyEscapeClosesOverlay`
      overlay helpers in `packages/storybook-contracts/src/overlay/`
- [ ] T013 [P] [US1] Create `verifyInitialFocusPlaced`,
      `verifyFocusContainedWhileOpen`, `verifyFocusRestoredOnClose` focus helpers
      in `packages/storybook-contracts/src/focus/`
- [ ] T014 [US1] Export the new overlay/focus helpers from
      `packages/storybook-contracts/src/index.ts`
- [ ] T015 [US1] Add fixed Modal `play` stories in
      `packages/styles/src/stories/components/Communication/Modal.stories.ts`
      calling the overlay/focus helpers with a runtime-initialized assertion
- [ ] T016 [US1] Record Modal in the rollout ledger
      (`packages/storybook-contracts/src/rollout/rollout.ts`) as
      `styles-proven` after the focused run passes, and add its fixture/capability
      refs

### Wave A: Banner and Header (disclosure helpers)

- [ ] T017 [P] [US1] Create `verifyDisclosureTogglesPressingButton` disclosure
      helper in `packages/storybook-contracts/src/disclosure/`
- [ ] T018 [P] [US1] Add deterministic Banner fixtures + fixed `play` stories
      calling the disclosure helper in
      `packages/styles/src/stories/components/Communication/Banner.stories.ts`
- [ ] T019 [P] [US1] Add deterministic Header fixtures + fixed `play` stories
      covering responsive navigation disclosure in
      `packages/styles/src/stories/components/Navigation/Header.stories.ts`
- [ ] T020 [P] [US1] Add deterministic Sidenav fixtures + fixed `play` stories
      covering disclosure, current state, and focus in
      `packages/styles/src/stories/components/Navigation/Sidenav.stories.ts`
- [ ] T021 [US1] Record Banner, Header, and Sidenav in the rollout ledger
      (`packages/storybook-contracts/src/rollout/rollout.ts`) as `styles-proven`

### Wave A: ComboBox, DatePicker, DateRangePicker (composite-widget/overlay)

- [ ] T022 [P] [US1] Create `verifyOptionNavigable`, `verifyOptionSelectable`,
      `verifyEscapeClosesListbox` composite-widget helpers in
      `packages/storybook-contracts/src/composite-widget/`
- [ ] T023 [P] [US1] Add ComboBox fixtures (default, disabled, invalid) + fixed
      `play` for label, entry, option navigation/selection, Escape in
      `packages/styles/src/stories/components/FormControls/ComboBox.stories.ts`
- [ ] T024 [P] [US1] Add DatePicker fixtures + fixed `play` covering
      input/calendar synchronization, keyboard navigation, and validation in
      `packages/styles/src/stories/components/FormControls/DatePicker.stories.ts`
- [ ] T025 [P] [US1] Add DateRangePicker fixtures + fixed `play` covering range
      rules and focus return in
      `packages/styles/src/stories/components/FormControls/DateRangePicker.stories.ts`
- [ ] T026 [US1] Record ComboBox, DatePicker, and DateRangePicker in the rollout
      ledger as `styles-proven`

### Wave A: Search

- [ ] T027 [P] [US1] Add Search fixtures + fixed `play` covering label, entry,
      submission, and responsive disclosure where supported in
      `packages/styles/src/stories/components/Navigation/Search.stories.ts`
- [ ] T028 [US1] Record Search in the rollout ledger as `styles-proven`

**Checkpoint**: All Wave A components are Styles-proven and recorded; the
disclosure/overlay/composite-widget/focus helpers exist for later waves. Wave B
can begin.

---

## Phase 4: User Story 2 - Native and Custom Form Controls (Wave B) (P1)

**Goal**: Prove the native and custom form controls — check box, radio button,
select, text input, text area — through accessible labeling, entry/selection,
keyboard operation, and disabled/required/invalid/hint/error association, keeping
framework-controlled state package-specific.

**Independent Test**: Run each form control's Styles proof against the shared
validators and confirm accessible labeling and error association are validated
for every named state, with framework-controlled state left to package-specific
tests.

- [ ] T029 [P] [US2] Create form-control helpers
      `verifyAccessibleLabel`, `verifyRequiredInvalidAssociation`,
      `verifyHintErrorAssociation` in `packages/storybook-contracts/src/` (a
      single capability per helper) and export from `src/index.ts`
- [ ] T030 [US2] Add Checkbox fixtures (default, disabled, required, invalid,
      with hint/error) + fixed `play` in
      `packages/styles/src/stories/components/FormControls/Checkbox.stories.ts`
- [ ] T031 [US2] Add Radio fixtures + fixed `play` for grouping/labeling and
      keyboard selection in
      `packages/styles/src/stories/components/FormControls/Radio.stories.ts`
- [ ] T032 [US2] Add Select fixtures + fixed `play` for label, option
      selection, and error association in
      `packages/styles/src/stories/components/FormControls/Select.stories.ts`
- [ ] T033 [P] [US2] Add Input fixtures + fixed `play` for label, entry,
      required/invalid, and error association in
      `packages/styles/src/stories/components/FormControls/Input.stories.ts`
- [ ] T034 [P] [US2] Add Textarea fixtures + fixed `play` for label, entry, and
      error association in
      `packages/styles/src/stories/components/FormControls/Textarea.stories.ts`
- [ ] T035 [US2] Record Checkbox, Radio, Select, Input, and Textarea in the
      rollout ledger as `styles-proven`, and note framework-controlled state
      remains package-specific (no shared `capabilities` for it)

**Checkpoint**: All Wave B components are Styles-proven and recorded. Wave C can
begin.

---

## Phase 5: User Story 3 - Navigation, Collections, and Activation (Wave C) (P2)

**Goal**: Prove activation, current-page, bypass, grouping, caption/header, and
collection semantics for buttons, button groups, links, pagination, breadcrumbs,
skip navigation, tables, and lists, without inventing interaction tests for
purely static structures.

**Independent Test**: For each navigation, collection, or activation component,
run its Styles proof and confirm the applicable semantics are validated and that
no interaction test is manufactured for a purely static structure.

- [ ] T036 [P] [US3] Create activation/semantics helpers
      `verifyActivatesOnActivation`, `verifyCurrentPageSemantics`,
      `verifyCollectionGrouping` in `packages/storybook-contracts/src/` and
      export from `src/index.ts`
- [ ] T037 [P] [US3] Add Button and ButtonGroup fixtures + fixed `play` (or a
      documented decision the structure is static) in
      `packages/styles/src/stories/components/Basic/Button.stories.ts` and
      `packages/styles/src/stories/components/Basic/ButtonGroup.stories.ts`
- [ ] T038 [P] [US3] Add Link fixtures + fixed `play` for activation semantics in
      `packages/styles/src/stories/components/Basic/Link.stories.ts`
- [ ] T039 [P] [US3] Add Pagination fixtures + fixed `play` for current-page
      semantics in `packages/styles/src/stories/components/Navigation/Pagination.stories.ts`
- [ ] T040 [P] [US3] Add Breadcrumb fixtures + fixed `play` for navigation
      landmark/current semantics in
      `packages/styles/src/stories/components/Navigation/Breadcrumb.stories.ts`
- [ ] T041 [P] [US3] Add Skipnav fixtures + fixed `play` for bypass behavior in
      `packages/styles/src/stories/components/Navigation/Skipnav.stories.ts`
- [ ] T042 [P] [US3] Add Table fixtures + fixed `play` for headers/captions/
      grouping semantics in `packages/styles/src/stories/components/Basic/Table.stories.ts`
- [ ] T043 [P] [US3] Add List fixtures + fixed `play` for collection/grouping
      semantics in `packages/styles/src/stories/components/Basic/List.stories.ts`
- [ ] T044 [US3] Ensure no purely static structure in Wave C received a
      manufactured interaction helper (audit
      `packages/styles/src/stories/components/Basic/`) and record the
      components in the rollout ledger as `styles-proven`

**Checkpoint**: All Wave C components are proven and recorded. Wave D can begin.

---

## Phase 6: User Story 4 - Status, Feedback, Progress (Wave D) (P2)

**Goal**: Prove roles, names, live/status exposure where promised, meaningful
content, dismissal where supported, and current/progress state for alerts, site
alerts, toasts, page errors, loading states, skeletons, process lists, step
indicators, summary boxes, and empty states, keeping manual announcement quality
as a separate review item.

**Independent Test**: For each status/feedback/progress component, run its Styles
proof and confirm its role, accessible name, live/status exposure, meaningful
content, dismissal, and current/progress state are validated where applicable,
with manual announcement quality recorded separately.

- [ ] T045 [P] [US4] Create status helpers `verifyLiveStatusRegion`,
      `verifyDismissible`, `verifyProgressState` in
      `packages/storybook-contracts/src/` and export from `src/index.ts`
- [ ] T046 [P] [US4] Add Alert and SiteAlert fixtures + fixed `play` for role,
      name, and live/status exposure in
      `packages/styles/src/stories/components/Communication/Alert.stories.ts` and
      `.SiteAlert.stories.ts`
- [ ] T047 [P] [US4] Add Toast and PageError fixtures + fixed `play` for
      dismissal and content in
      `packages/styles/src/stories/components/Feedback/Toast.stories.ts` and
      `.PageError.stories.ts`
- [ ] T048 [P] [US4] Add Loading and Skeleton fixtures + fixed `play` for
      live/status and state in
      `packages/styles/src/stories/components/Feedback/Loading.stories.ts` and
      `.Skeleton.stories.ts`
- [ ] T049 [P] [US4] Add ProcessList, StepIndicator, and SummaryBox fixtures +
      fixed `play` for progress/current state in
      `packages/styles/src/stories/components/Communication/ProcessList.stories.ts`,
      `.StepIndicator.stories.ts`, and `.SummaryBox.stories.ts`
- [ ] T050 [P] [US4] Add EmptyState fixtures + fixed `play` for role and
      meaningful content in
      `packages/styles/src/stories/components/Feedback/EmptyState.stories.ts`
- [ ] T051 [US4] Record React-aware Wave D components in the rollout ledger as
      `styles-proven`, and flag manual announcement quality as separate evidence
      (never an automated conformance label, `FR-011`)

**Checkpoint**: All Wave D components are Styles-proven and recorded; live/status
announcement quality is explicitly separated. Wave E can begin.

---

## Phase 7: User Story 5 - Visual and Composition-Led (Wave E) (P3)

**Goal**: Prove visual and composition-led components — card, tag, media block,
icon, and any remaining interaction-control/application-shell/dashboard/
discovery/structured-workflow/recipe surfaces — through deterministic states,
semantics, viewport/content pressure, and accessibility, promoting a pattern to
a shared contract only when another package exposes the same user-facing promise.

**Independent Test**: For each visual or composition-led component, run its proof
and confirm deterministic states, semantics, viewport/content pressure, and
accessibility are validated, and that a pattern is elevated to a shared contract
only when a downstream package exposes the same promise.

- [ ] T052 [P] [US5] Add Card, Tag, and MediaBlock fixtures + fixed `play` (or
      documented static) for semantics and content pressure in
      `packages/styles/src/stories/components/Basic/Card.stories.ts`,
      `.Tag.stories.ts`, and `packages/styles/src/stories/components/Layout/MediaBlock.stories.ts`
- [ ] T053 [P] [US5] Add Icon fixtures + fixed `play` for accessible naming and
      presentational decoupling in
      `packages/styles/src/stories/components/Layout/Icon.stories.ts`
- [ ] T054 [US5] Complete Styles-only evidence for interaction-control surfaces
      (SegmentedControl, IconButton, IconTile, Integration, InteractionStates)
      as fixtures with deterministic states/semantics/Axe in
      `packages/styles/src/stories/interaction-controls/`
- [ ] T055 [US5] Complete Styles-only evidence for application-shell, dashboard,
      discovery, structured-workflow, and recipe surfaces as fixtures with
      viewport/content pressure + Axe in
      `packages/styles/src/stories/{app-shell,dashboard,discovery,layout-composition,marketing-patterns,recipes,structured-workflow}`
- [ ] T056 [US5] Record every Wave E surface in the rollout ledger as
      `styles-only` (empty `capabilities`/`downstream`), and promote to a shared
      contract only if a downstream package exposes the same user-facing promise
      (`FR-013`)

**Checkpoint**: All Wave E surfaces are Styles-only-proven and recorded, with no
shared contract promoted without a downstream promise.

---

## Phase 8: User Story 6 - Rollout Ledger (P1)

**Goal**: The rollout ledger is authoritative and complete: it records each
component's Styles proof before any downstream adoption, reflects a
one-component-at-a-time order per wave, and feeds the evidence report without
conflating story presence, capability coverage, or Axe.

**Why this priority**: The rollout spans dozens of components over an extended
period; the ledger is what makes Styles-proven-before-adoption auditable and is
the plan's completion criterion.

**Independent Test**: Read the ledger; confirm each `shared` component is
`styles-proven` (or `adopted`) with a capability and no component claims
conformance without a green focused run, and that no pure `styles-only` surface
is reported as shared adoption.

- [ ] T057 [US6] Ensure every component in
      `packages/styles/src/stories/components/` and every styles-only surface in
      the Wave E list is present exactly once in
      `packages/storybook-contracts/src/rollout/rollout.ts`, with a valid
      `wave`, `category`, `status`, `storyId`, and fixture/capability refs
- [ ] T058 [P] [US6] Enforce ledger invariants in
      `packages/storybook-contracts/src/rollout/` (e.g. a `validate()` guard):
      `shared` ⇒ non-empty `capabilities`; `adopted` ⇒ `styles-proven` exists; a
      `not-started` component must not be reported as proven
- [ ] T059 [US6] Make `scripts/storybook-evidence-report.mjs` fail when a ledger
      entry claims `styles-proven`/`adopted` with no green focused run, and when
      a `styles-only` entry is shown as shared adoption
- [ ] T060 [US6] Confirm the evidence report lists, per component, the three
      separate measures and any accessibility exception from
      `scripts/accessibility-exceptions.mjs`, and never labels an aggregate as
      WCAG certification
- [ ] T061 [US6] Update `docs/testing/` (commands, paths, failure behavior,
      Styles-first rule, and the rollout ledger) to match the implemented system

**Checkpoint**: The ledger is authoritative and auditable end-to-end; the
evidence report and `docs/testing/` reflect it.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T062 [P] Run `pnpm pack --dry-run` on `@pathableai/styles` and
      `@pathableai/react` and confirm `packages/storybook-contracts` (ledger +
      helpers) adds no file to either publishable payload
- [ ] T063 Run the full `quickstart.md` validation end-to-end from a clean
      checkout, exercising the focused per-component Styles loop, the ledger
      report, and the conformance proofs
- [ ] T064 [P] Run lifecycle negative-path validation (per `quickstart.md`) for
      the `--filter` runner change covering test failure, occupied port, missing
      build, SIGINT, and SIGTERM with zero owned processes remaining
- [ ] T065 Run `pnpm lint`, `pnpm typecheck`, `git diff --check` and fix any
      findings
- [ ] T066 [P] Run `pnpm test:visual` for any fixture or rendered-state change
      introduced by the rollout and update snapshots only after review
- [ ] T067 Run `pnpm test:next-consumer` when publishable package code, exports,
      or dependency boundaries change
- [ ] T068 Final review: confirm no visual contract, token, or wrapper package
      was introduced, and that shared helpers never accept React props, renderer
      context types, CSS selectors, or package internals

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — confirms the Phase 1/2 baseline
- **Foundational (Phase 2)**: Depends on Setup — provisions the ledger and
  capability-group modules that every wave story depends on; BLOCKS all user
  stories
- **User Stories (Phase 3+)**: Depend on Foundational completion; run in wave/
  priority order
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (Wave A, P1)**: Starts after Foundational; proves the reusable
  helpers later waves build on. MVP slice.
- **User Story 2 (Wave B, P1)**: Starts after Foundational; benefits from the
  composite-widget helpers Wave A introduced but is independently testable.
- **User Story 3 (Wave C, P2)**: Starts after Foundational; independent, uses
  activation/semantics helpers.
- **User Story 4 (Wave D, P2)**: Starts after Foundational; independent, uses
  status/progress helpers.
- **User Story 5 (Wave E, P3)**: Starts after Foundational; Styles-only
  evidence, no shared promotion without a downstream promise.
- **User Story 6 (Ledger, P1)**: Depends on the other stories recording their
  results (the ledger is provisioned in Foundational, closed out last).

### Within Each User Story

- Ledger/taxonomy scaffolded in Foundational before story authoring
- Helpers (one capability each) before Styles `play` stories before ledger
  status update
- One component at a time per wave (`FR-003`); `[P]` tasks limited to
  non-overlapping components
- Component proof (focused Styles run) before rollout-ledger `styles-proven`

### Parallel Opportunities

- Phase 2 tasks T004–T009 are independent where marked `[P]`
- Wave A helper authoring (T011–T013, T017, T022) is parallel across
  capability groups
- Components within a wave are `[P]` only when their fixtures/outputs cannot
  overwrite each other (per `FR-003`)
- Wave B, C, D, and E can each proceed after Foundational in parallel if staffed;
  sequentially otherwise

---

## Parallel Example: User Story 1 (Wave A)

```bash
# Launch the reusable capability-group helpers together (non-overlapping):
Task: "Create overlay helpers (verifyOpenCloseViaTrigger, verifyEscapeClosesOverlay)"
Task: "Create focus helpers (verifyInitialFocusPlaced, verifyFocusContainedWhileOpen)"
Task: "Create composite-widget helpers (verifyOptionNavigable, verifyOptionSelectable)"
```

```bash
# Then prove one component at a time; export helpers + record in ledger:
Task: "Add Modal fixtures + fixed play + runtime-init assertion in Modal.stories.ts"
Task: "Export overlay/focus helpers from src/index.ts"
Task: "Record Modal as styles-proven in rollout.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (baseline green)
2. Complete Phase 2: Foundational (ledger + capability taxonomy + narrow filter)
3. Complete Phase 3: User Story 1 (Wave A stateful keyboard/focus helpers + Modal
   first-component proof)
4. **STOP and VALIDATE**: `pnpm test:storybook-styles --filter
   components-communication-modal` passes and the ledger records Modal as
   `styles-proven`
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → ledger and taxonomy provisioned
2. Add User Story 1 → Wave A proven + reusable helpers (MVP)
3. Add User Story 2 → Wave B form controls proven
4. Add User Story 3 → Wave C navigation/collections proven
5. Add User Story 4 → Wave D status/feedback/progress proven
6. Add User Story 5 → Wave E visual/composition Styles-only evidence
7. Add User Story 6 → ledger authoritative + docs updated
8. Each wave adds value without breaking prior waves

### Parallel Team Strategy

- Team completes Setup + Foundational together
- Once Foundational is done:
  - Developer A: User Story 1 (Wave A + reusable helpers)
  - Developer B: User Story 2 (Wave B form controls)
  - Developer C: User Story 3 (Wave C navigation)
- Later: User Story 4 (status/progress), then User Story 5 (visual/composition),
  then User Story 6 (ledger close-out)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to the spec.md user story
- US1 (Wave A) is the suggested MVP slice; its reusable helpers unlock later waves
- Components are proven one at a time per wave (`FR-003`); parallel work is
  limited to non-overlapping components
- Styles-only surfaces stay `styles-only` unless a downstream package exposes the
  same promise (`FR-013`)
- Manual keyboard/focus review and manual announcement quality remain separate
  evidence; no automated aggregate is labeled WCAG certification
- Avoid React catalog/code changes in this feature except component-by-component
  adoption after a Styles proof + isolation guard (Phase 2 precedent)
- Commit after each task or logical group
- Run `quickstart.md` at each major checkpoint