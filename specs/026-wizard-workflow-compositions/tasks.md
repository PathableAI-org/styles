# Tasks: Structured Wizard and Guided Workflow Compositions

**Input**: Design documents from `/specs/026-wizard-workflow-compositions/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Build compilation and selective-import verification are required per FR-027 and FR-028. Visual verification via Storybook stories is required per FR-026.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 - Staff Completes a Multi-Step Wizard Form (Priority: P1)](#phase-3-user-story-1---staff-completes-a-multi-step-wizard-form-priority-p1)
- [Phase 4: User Story 2 - Staff Completes a Structured Workflow/Session (Priority: P1)](#phase-4-user-story-2---staff-completes-a-structured-workflowsession-priority-p1)
- [Phase 5: User Story 3 - Developer Integrates Compositions (Priority: P2)](#phase-5-user-story-3---developer-integrates-compositions-priority-p2)
- [Phase 6: User Story 4 - Developer Divides Long Forms (Priority: P3)](#phase-6-user-story-4---developer-divides-long-forms-priority-p3)
- [Phase 7: Polish & Cross-Cutting Concerns](#phase-7-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- SCSS components: `packages/styles/src/pathable-component-wrappers/{name}.scss`
- Stories: `packages/styles/src/stories/structured-workflow/{Name}.stories.js`
- Tests: `packages/styles/test/{name}.scss`
- Build: `cd packages/styles && pnpm build`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing project is in a known-good state before adding new files.

- [ ] T001 Run `pnpm build` in `packages/styles/` and verify the existing build compiles cleanly with no errors

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T002 [P] Add CSS custom properties for wizard and workflow panel tokens in `packages/styles/src/_components-custom-properties.scss` — add `--pathable-wizard-max-width`, `--pathable-wizard-gap`, `--pathable-workflow-panel-max-width`, `--pathable-workflow-panel-gap`, `--pathable-workflow-panel-prompt-bg`, `--pathable-save-status-font-size`, `--pathable-save-status-icon-size` with USWDS-derived defaults per `contracts/index.md`. Use `uswds-core` functions (`units()`, `type-scale()`, `color()`) for all values. Also emit `--usa-*` equivalents.

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Staff Completes a Multi-Step Wizard Form (Priority: P1) 🎯 MVP

**Goal**: A staff member can navigate a multi-step wizard with step context, page heading, form content area, validation feedback, and action footer. The composition renders correctly on desktop and mobile.

**Independent Test**: Render a multi-step form layout with step indicator, page heading, form content area, and action footer, then verify that navigation action positions are correct, step states are distinguishable without color, and mobile viewport shows compact step summary.

### Implementation for User Story 1

- [ ] T003 [P] [US1] Create wizard page layout SCSS in `packages/styles/src/pathable-component-wrappers/pathable-wizard.scss` — define `.pathable-wizard` container, `.pathable-wizard__heading`, `.pathable-wizard__content`, `.pathable-wizard__mobile-summary` (visible <768px with "Step N of M" text), `.pathable-wizard__validation` and `.pathable-wizard__validation--visible`/`--hidden` states. Use `@use 'uswds-core' as *` for spacing from `--pathable-wizard-gap`. Reuse existing `.pathable-step-indicator` for step context. Include media query for mobile compact summary at 768px breakpoint. Ensure step states are distinguishable without color (text labels + structural cues per FR-002).
- [ ] T004 [P] [US1] Create wizard action footer SCSS in `packages/styles/src/pathable-component-wrappers/pathable-wizard-actions.scss` — define `.pathable-wizard__actions` with documented positions: Save & Exit (low emphasis, left), Back (base/secondary, left of center), Continue (primary, right, hidden on final step), Submit (primary, right, visible only on final step). Use existing `.pathable-button` variants (`--save`, `--continue`, `--low-emphasis`). Ensure touch targets meet minimum size. On mobile viewports, use a 2-column layout: Back left, Continue/Submit right full-height.
- [ ] T005 [US1] Create Wizard Storybook stories in `packages/styles/src/stories/structured-workflow/Wizard.stories.js` — include `Default` (3-step desktop wizard with step indicator, heading, content region, action footer), `Mobile` (same wizard at <768px with compact step summary), `ValidationError` (validation summary visible with error list and focus guidance note). Use synthetic fixture data only. Title: `Structured Workflow/Wizard`. Tags: `['autodocs']`. Follow existing story patterns (see `packages/styles/src/stories/components/Communication/StepIndicator.stories.js` for step indicator reference).

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Verify by: (1) importing `pathable-wizard` and `pathable-wizard-actions` in a test file and compiling, (2) opening Storybook and verifying wizard stories render correctly.

---

## Phase 4: User Story 2 - Staff Completes a Structured Workflow/Session (Priority: P1) 🎯 MVP

**Goal**: A staff member can use a structured workflow panel with context header, objective, prompt/instruction, observation/note input, progress/save-status region, and completion actions. The panel supports loading, saving, saved, offline, validation-error, and completed visual states.

**Independent Test**: Render a workflow composition with context header, objective, prompt/instruction, note input, progress indicator, and actions, then verify spacing, visual distinction between prompt and entered text, and all six state-specific CSS modifiers render distinct visual treatments.

### Implementation for User Story 2

- [ ] T006 [P] [US2] Create workflow panel SCSS in `packages/styles/src/pathable-component-wrappers/pathable-workflow-panel.scss` — define `.pathable-workflow-panel` container with flexbox column layout, `.pathable-workflow-panel__context-header`, `__objective`, `__current-activity`, `__prompt` (distinct background using `--pathable-workflow-panel-prompt-bg`), `__input` (standard surface treatment), `__status` region, and `__actions`. Use `@use 'uswds-core' as *` for spacing from `--pathable-workflow-panel-gap`. Define all six state modifier classes: `--loading` (skeleton/spinner), `--saving` (saving indicator), `--saved` (checkmark + "Saved"), `--offline` (offline banner), `--validation-error` (error count), `--completed` (completion summary). All states MUST communicate via text/icon in addition to color (FR-019). Ensure long prompts and notes do not overflow (FR-022) via `overflow-y: auto` with max-height. Handle empty regions gracefully (hide or collapse `__objective` and `__current-activity` when empty using `:empty` selector).
- [ ] T007 [P] [US2] Create save-status indicator SCSS in `packages/styles/src/pathable-component-wrappers/pathable-save-status.scss` — define `.pathable-save-status` as a standalone inline indicator with states: `--loading`, `--saving`, `--saved`, `--offline`, `--error`, `--idle`. Each state shows both an icon and a text label. Use `--pathable-save-status-font-size` for font sizing. The `--idle` state is hidden by default (`display: none`).
- [ ] T008 [US2] Create WorkflowPanel Storybook stories in `packages/styles/src/stories/structured-workflow/WorkflowPanel.stories.js` — include `Default` (idle state with context header, objective, prompt, input, actions), `Loading` (skeleton/spinner), `Saving` (saving indicator), `Saved` (saved confirmation), `Offline` (offline banner), `ValidationError` (error state), `Completed` (completion summary), `LongPrompt` (verifying overflow behavior), `Mobile` (compact viewport). Use synthetic fixture data only. Title: `Structured Workflow/Workflow Panel`. Tags: `['autodocs']`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Verify by: (1) importing `pathable-workflow-panel` and `pathable-save-status` selectively, (2) opening Storybook and verifying all workflow panel stories render correctly.

---

## Phase 5: User Story 3 - Developer Integrates Compositions (Priority: P2)

**Goal**: Developers can import the styles selectively or as an all-in-one bundle. Both strategies compile without errors.

**Independent Test**: Import composition styles selectively (individual component imports) and as an all-in-one bundle, then verify that both strategies compile without errors and selective imports do not introduce classes from unrelated components.

### Implementation for User Story 3

- [ ] T009 [P] [US3] Create structured workflow bundle SCSS in `packages/styles/src/pathable-component-wrappers/pathable-structured-workflow.scss` — forwards all four composition partials: `pathable-wizard`, `pathable-wizard-actions`, `pathable-workflow-panel`, `pathable-save-status`. Follow the pattern of existing bundle files (e.g., `pathable-dashboard.scss`, `pathable-layout-composition.scss`).
- [ ] T010 [P] [US3] Update `packages/styles/src/pathable-component-wrappers/pathable-all.scss` — add `@forward 'pathable-structured-workflow';` after the existing `@forward 'pathable-sticky-panel';` line (alphabetically positioned in the composition bundles section).
- [ ] T011 [P] [US3] Update `packages/styles/test/selective-import.scss` — add selective import test entries for the new components following the existing pattern, verifying that individual imports compile without introducing unrelated classes.
- [ ] T012 [US3] Run `pnpm build` in `packages/styles/` and verify the build compiles successfully with both selective imports and all-in-one imports (FR-027, FR-028). Verify the compiled `dist/styles.css` contains `.pathable-wizard`, `.pathable-workflow-panel`, and `.pathable-save-status` classes.
- [ ] T013 [US3] Add Storybook stories for remaining state variants — verify `Wizard.stories.js` and `WorkflowPanel.stories.js` include desktop, mobile, validation-error, offline, and completed examples per FR-026. Add any missing story variants.

**Checkpoint**: All three user stories should now be independently functional and compilable.

---

## Phase 6: User Story 4 - Developer Divides Long Forms (Priority: P3)

**Goal**: Developers can divide long forms within a wizard step into clearly titled sections without excessive nested card containers.

**Independent Test**: Render a long form with multiple titled sections inside a wizard step and verify that each section has a clear heading and does not require nested card containers.

### Implementation for User Story 4

- [ ] T014 [US4] Add `.pathable-wizard__section` heading styles in `packages/styles/src/pathable-component-wrappers/pathable-wizard.scss` — define a lightweight section heading (`.pathable-wizard__section`) with a clear title using existing typography tokens (`--pathable-font-size-lg`, `--pathable-font-weight-bold`) and optional bottom border or spacing. Sections should not require wrapping in additional card containers (FR-009). Add a `WizardLongForm` story variant in `Wizard.stories.js` demonstrating a step with 3+ titled sections.

**Checkpoint**: All four user stories now complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [ ] T015 [P] Add sensitive data display guidance — update Storybook story descriptions in `Wizard.stories.js` and `WorkflowPanel.stories.js` with a note: "**Sensitive data**: This composition is designed for staff workflows that may display participant or program information. Minimize displayed data to only what is necessary for the current task. Avoid placing sensitive data in decorative examples." Verify all stories use synthetic fixture data only (no real names, PII, or program identifiers) per FR-023, FR-024, FR-025.
- [ ] T016 [P] Run accessibility verification — manually verify: (1) step indicator states are distinguishable without color (text labels + icons) in `pathable-wizard.scss`, (2) status indicators include text labels in addition to color in `pathable-workflow-panel.scss` and `pathable-save-status.scss`, (3) touch targets meet minimum size (44x44 CSS pixels) for all action buttons in `pathable-wizard-actions.scss`, (4) layout is usable at 200% zoom via browser testing, (5) layout does not break with on-screen keyboard visible (no fixed-position elements that would obscure input areas). Fix any violations found.
- [ ] T017 Run final build verification — `pnpm build` in `packages/styles/` compiles cleanly. Run acceptance criteria audit against all 15 criteria from issue #35. Verify all Storybook stories render without errors. Confirm `test/selective-import.scss` passes selective import verification.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — run first to establish baseline
- **Foundational (Phase 2)**: Depends on Setup completion — custom properties must exist before components reference them
- **US1 - Wizard (Phase 3)**: Depends on Phase 2 completion — no dependency on US2
- **US2 - Workflow Panel (Phase 4)**: Depends on Phase 2 completion — no dependency on US1
- **US3 - Integration (Phase 5)**: Depends on US1 and US2 completion (bundle must exist before it can be forwarded and tested)
- **US4 - Long Form Sections (Phase 6)**: Depends on US1 completion (extending wizard partial)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — No dependencies on other stories
- **User Story 2 (P1)**: Can start after Phase 2 — No dependencies on other stories
- **User Story 3 (P2)**: Can start after User Story 1 and 2 — Bundle depends on all partials existing
- **User Story 4 (P3)**: Can start after User Story 1 — Extends wizard SCSS

### Within Each User Story

- SCSS partials before Storybook stories
- Individual components before bundle files
- Bundle files before build verification
- Core implementation before polish/verification

### Parallel Opportunities

- T002 and T003 and T006 and T007 can all run in parallel (different files, no dependencies)
- T003/T004 (wizard SCSS) can run in parallel with T006/T007 (workflow SCSS)
- T005 (wizard stories) depends on T003/T004 but can run alongside T008 (workflow stories)
- T009, T010, T011 can run in parallel
- T015 and T016 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch SCSS partials for the wizard together:
Task: "Create wizard page layout SCSS in pathable-wizard.scss"
Task: "Create wizard action footer SCSS in pathable-wizard-actions.scss"
```

## Parallel Example: User Story 2

```bash
# Launch SCSS partials for the workflow panel together:
Task: "Create workflow panel SCSS in pathable-workflow-panel.scss"
Task: "Create save-status indicator SCSS in pathable-save-status.scss"
```

## Parallel Example: Integration Phase

```bash
# Launch bundle, all-forward, and test updates together:
Task: "Create structured workflow bundle in pathable-structured-workflow.scss"
Task: "Update pathable-all.scss to forward the new bundle"
Task: "Update test/selective-import.scss with new component selectors"
```

---

## Implementation Strategy

### MVP First (User Stories 1 and 2)

Both User Story 1 and User Story 2 are P1 and have no cross-dependencies, so they can be implemented in parallel:

1. Complete Phase 1: Setup (verify baseline build)
2. Complete Phase 2: Foundational (component custom properties)
3. Complete Phase 3: User Story 1 (wizard) AND Phase 4: User Story 2 (workflow panel) — in parallel
4. **STOP and VALIDATE**: Test both stories independently via Storybook
5. Continue with Phase 5: User Story 3 (integration/bundle)
6. Continue with Phase 6: User Story 4 (long form sections)
7. Complete Phase 7: Polish & cross-cutting

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP delivers wizard!)
3. Add User Story 2 → Test independently → Deploy/Demo (MVP delivers workflow panel!)
4. Add User Story 3 → Verify selective and all-in-one imports compile
5. Add User Story 4 → Verify long-form sectioning works
6. Complete Polish

### Parallel Team Strategy

With two developers:

1. Both complete Setup + Foundational together
2. Developer A: Phase 3 (Wizard SCSS + Stories)
3. Developer B: Phase 4 (Workflow Panel SCSS + Stories)
4. Merge both, then Developer A continues with Phase 5 (Integration) and Phase 6 (Long Form)
5. Developer B handles Phase 7 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All new SCSS must use `@use 'uswds-core' as *` and USWDS functions (never hardcode values)
- All new CSS classes must follow the `.pathable-{component}` BEM naming convention
- All Storybook stories must use synthetic data only
- No runtime JavaScript or state management is introduced