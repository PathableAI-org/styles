# Tasks: Component Brand Refinement

**Input**: Design documents from `specs/012-component-brand-refinement/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No tests are required for this feature — it is a pure SCSS/styles/Storybook feature with visual verification via the a11y addon and manual inspection.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **P**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- All changes scoped to `packages/styles/src/`
- SCSS wrappers in `packages/styles/src/pathable-component-wrappers/`
- Storybook stories in `packages/styles/src/stories/`

## Table of Contents

- [Phase 1: Setup (Foundational SCSS Pattern)](#phase-1-setup-foundational-scss-pattern)
- [Phase 2: User Story 1 - Branded Button Layer (P1)](#phase-2-user-story-1---branded-button-layer-p1)
- [Phase 3: User Story 2 - Workflow Card Pattern (P1)](#phase-3-user-story-2---workflow-card-pattern-p1)
- [Phase 4: User Story 3 - Form Workflow Examples (P2)](#phase-4-user-story-3---form-workflow-examples-p2)
- [Phase 5: User Story 4 - Semantic Alert Patterns (P2)](#phase-5-user-story-4---semantic-alert-patterns-p2)
- [Phase 6: User Story 5 - Navigation Workflow Stories (P3)](#phase-6-user-story-5---navigation-workflow-stories-p3)
- [Phase 7: Polish & Cross-Cutting Concerns](#phase-7-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Implementation Strategy](#implementation-strategy)

---

## Phase 1: Setup (Foundational SCSS Pattern)

**Purpose**: Establish the SCSS opinion layer pattern used across all component wrappers, so downstream tasks follow a consistent approach

- [ ] T001 Create a shared SCSS partial for brand opinion mixins at `packages/styles/src/pathable-component-wrappers/_brand-opinion.scss` with comment header documenting the pattern: import `uswds-core`, use `@extend` for base, then override with `--pathable-*` CSS custom properties
- [ ] T002 [P] Add `.pathable-button--primary` class alias in `packages/styles/src/pathable-component-wrappers/pathable-button.scss` that extends `@extend .usa-button--primary` (creates an explicit primary variant for consumers who want to be semantic)

**Checkpoint**: Brand opinion SCSS pattern established and ready for use by all component tasks.

---

## Phase 2: User Story 1 - Branded Button Layer (Priority: P1) 🎯 MVP

**Goal**: Add Pathable-specific brand colors to all button variants so buttons consistently express brand identity with correct contrast.

**Independent Test**: View all button variants in Storybook — each variant should use brand-approved colors (PathAble Blue primary, Intelligent Jade secondary, Bright Blue Brooks accent-cool) and pass WCAG AA contrast when checked with the a11y addon.

### Implementation for User Story 1

- [ ] T003 [P] [US1] Add brand opinion overrides to `packages/styles/src/pathable-component-wrappers/pathable-button.scss`: set `.pathable-button` default to `--pathable-color-action-primary-bg` (PathAble Blue) background with `--pathable-color-action-primary-text` (white) foreground
- [ ] T004 [P] [US1] Add brand opinion overrides for `.pathable-button--secondary` in `packages/styles/src/pathable-component-wrappers/pathable-button.scss`: set background to `--pathable-color-action-secondary-bg` (Intelligent Jade) with foreground to `--pathable-color-action-secondary-text` (PathAble Blue text)
- [ ] T005 [P] [US1] Add brand opinion overrides for `.pathable-button--accent-cool` in `packages/styles/src/pathable-component-wrappers/pathable-button.scss`: set background to `--pathable-color-link` (Bright Blue Brooks) with dark/PathAble Blue foreground for contrast
- [ ] T006 [P] [US1] Add brand opinion overrides for `.pathable-button--base` in `packages/styles/src/pathable-component-wrappers/pathable-button.scss`: set background to `--pathable-color-bg` (Shilling Silver) with `--pathable-color-text` (PathAble Blue) foreground
- [ ] T007 [P] [US1] Update `packages/styles/src/stories/components/Basic/Button.stories.js` to add a "Workflow: Primary CTA" story showing a primary button with a Pathable-specific label (e.g., "Save Session Note")
- [ ] T008 [P] [US1] Add a "Workflow: Secondary Action" story in `packages/styles/src/stories/components/Basic/Button.stories.js` showing a secondary button with a label like "Add Intervention"
- [ ] T009 [P] [US1] Add a "Workflow: Tertiary Action" story in `packages/styles/src/stories/components/Basic/Button.stories.js` showing an accent-cool button with a label like "View Details"
- [ ] T010 [US1] Run `pnpm build` from repository root and verify no build errors; run `pnpm storybook` and verify all button variants render correctly with no a11y contrast violations

**Checkpoint**: At this point, all button variants use brand-approved colors and pass WCAG AA contrast. The button layer is independently testable in Storybook.

---

## Phase 3: User Story 2 - Workflow Card Pattern (Priority: P1)

**Goal**: Add a `.pathable-card--workflow` modifier to express Pathable's brand identity through cards with Shilling Silver/white surface, PathAble Blue heading, Intelligent Jade status signals, and Bright Blue Brooks links.

**Independent Test**: View the card component in Storybook — the new "Workflow Card" story should show a card with all specified visual properties (surface, heading, status, link/action, metadata, spacing, focus state) and no a11y violations.

### Implementation for User Story 2

- [ ] T011 [P] [US2] Add `.pathable-card--workflow` modifier class in `packages/styles/src/pathable-component-wrappers/pathable-card.scss` with: white surface (`--pathable-color-surface`), PathAble Blue heading (`--pathable-color-text`), optional Intelligent Jade status signal (`--pathable-color-accent`), Bright Blue Brooks links (`--pathable-color-link`), muted metadata (`--pathable-color-text-muted`), focus-within outline using `--pathable-color-focus-ring`
- [ ] T012 [US2] Update `packages/styles/src/stories/components/Basic/Card.stories.js` to add a "Workflow Card" story that renders a card with: heading, optional status signal (Intelligent Jade left border), body text, a metadata row (e.g., "Last updated: Today, 2:30 PM"), and an action link
- [ ] T013 [US2] Add a "Workflow Card: With Status" story in `packages/styles/src/stories/components/Basic/Card.stories.js` showing a card with an Intelligent Jade status indicator (e.g., left border or badge) communicating positive state
- [ ] T014 [US2] Run `pnpm build` and verify no errors; view Card stories in Storybook and confirm a11y addon passes

**Checkpoint**: At this point, the workflow card modifier is functional and independently testable alongside the button layer.

---

## Phase 4: User Story 3 - Form Workflow Examples (Priority: P2)

**Goal**: Add Pathable-specific workflow pattern examples to form component stories in Storybook, demonstrating session notes, participant goals, intervention checklists, progress signals, compliance fields, and supervisor comments.

**Independent Test**: View the form component stories in Storybook — at least 6 workflow-specific examples should exist with correct branding, and error states should include human-readable recovery guidance.

### Implementation for User Story 3

- [ ] T015 [US3] Add "Workflow: Session Note" story in `packages/styles/src/stories/components/FormControls/Textarea.stories.js` with a labeled textarea and hint text: "Document the key observations, interventions, and progress from this session."
- [ ] T016 [US3] Add "Workflow: Participant Goal Selector" story in `packages/styles/src/stories/components/FormControls/Select.stories.js` with a labeled select listing goals like "Improve communication", "Reduce anxiety", "Build daily routines"
- [ ] T017 [US3] Add "Workflow: Intervention Checklist" story in `packages/styles/src/stories/components/FormControls/Checkbox.stories.js` with checkboxes for interventions (e.g., "CBT exercise", "Mindfulness practice", "Behavior tracking")
- [ ] T018 [US3] Add "Workflow: Progress Signal Picker" story in `packages/styles/src/stories/components/FormControls/Radio.stories.js` with radio buttons for progress levels (e.g., "Significant progress", "Moderate progress", "No change", "Needs adjustment")
- [ ] T019 [US3] Add "Workflow: Required Compliance Field (with error state)" story in `packages/styles/src/stories/components/FormControls/Input.stories.js` showing a required field ("Medicaid ID") with an error state that includes human-readable recovery guidance via `.pathable-error-message`
- [ ] T020 [US3] Add "Workflow: Supervisor Approval Comment" story in `packages/styles/src/stories/components/FormControls/Textarea.stories.js` with a labeled textarea and hint: "Add your supervisory comments and recommendations."
- [ ] T021 [US3] Run `pnpm build` and verify no errors; view all new form stories in Storybook and confirm a11y addon passes

**Checkpoint**: At this point, form workflow examples are complete and independently testable in Storybook.

---

## Phase 5: User Story 4 - Semantic Alert Patterns (Priority: P2)

**Goal**: Add Pathable-specific semantic alert examples to the alert component stories, covering compliance blocks, missing evidence, draft notes, supervisor approvals, successful generation, and connectivity warnings.

**Independent Test**: View the alert stories in Storybook — at least 6 semantic alert examples should exist with correct status colors, appropriate contrast (dark text on success/warning, white text on error/emergency), and no a11y violations.

### Implementation for User Story 4

- [ ] T022 [P] [US4] Add "Workflow: Compliance Blocking Issue" story in `packages/styles/src/stories/components/Communication/Alert.stories.js` using `.pathable-alert--error` with text: "This participant's documentation is incomplete. Please review the missing items before proceeding."
- [ ] T023 [P] [US4] Add "Workflow: Missing Required Evidence" story using `.pathable-alert--warning` with text: "Required evidence for session #482 has not been submitted. 3 items are overdue."
- [ ] T024 [P] [US4] Add "Workflow: Draft Note Not Submitted" story using `.pathable-alert--warning` with text: "You have an unsaved draft note for participant J. Doe. Would you like to continue editing?"
- [ ] T025 [P] [US4] Add "Workflow: Supervisor Approval Needed" story using `.pathable-alert--info` with text: "Session note #1023 is ready for supervisor review. Approvals pending: 2."
- [ ] T026 [P] [US4] Add "Workflow: Successful Artifact Generation" story using `.pathable-alert--success` with text: "Progress note for participant K. Smith has been generated and saved successfully."
- [ ] T027 [P] [US4] Add "Workflow: Sync/Connectivity Warning" story using `.pathable-alert--warning` with text: "Unable to sync changes. Your work is saved locally and will sync when connection is restored."
- [ ] T028 [US4] Run `pnpm build` and verify no errors; view all new alert stories in Storybook and confirm a11y addon passes

**Checkpoint**: At this point, semantic alert examples are complete and independently testable in Storybook.

---

## Phase 6: User Story 5 - Navigation Workflow Stories (Priority: P3)

**Goal**: Add Pathable staff workflow navigation items to navigation component stories (sidenav, nav, etc.) reflecting real product labels like "Today's Sessions", "Participants", "Approvals", "Reports", "Templates", "Settings".

**Independent Test**: View navigation stories in Storybook — navigation items should reflect Pathable staff workflow labels, be keyboard accessible, and have visible focus states.

### Implementation for User Story 5

- [ ] T029 [P] [US5] Update `packages/styles/src/stories/components/Navigation/Sidenav.stories.js` to replace generic "Parent link/Child link" items with Pathable workflow items: "Today's Sessions" (with `aria-current="page"`), "Participants" (with sub-items "All Participants", "Add Participant"), "Approvals", "Reports", "Templates", "Settings"
- [ ] T030 [P] [US5] Update `packages/styles/src/stories/components/Navigation/Breadcrumb.stories.js` to use Pathable workflow labels (e.g., "Home / Participants / J. Doe / Session Notes")
- [ ] T031 [US5] Check keyboard navigation on all updated navigation stories — verify Tab/Enter navigation and visible focus states
- [ ] T032 [US5] Run `pnpm build` and verify no errors; confirm all navigation stories render correctly in Storybook with a11y addon passing

**Checkpoint**: Navigation workflow examples are complete and independently testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and consistency pass across all changes

- [ ] T033 [P] Run `pnpm build` from repository root and confirm zero build errors
- [ ] T034 [P] Run `pnpm storybook` and manually verify all updated stories render correctly across all 5 component areas
- [ ] T035 [P] Run the Storybook a11y addon on every new/modified story and confirm no WCAG AA contrast violations
- [ ] T036 [P] Verify consistency: confirm all new story titles follow existing conventions (`Components/`, `Components/Communication/`, etc.) and all SCSS follows existing `@extend` + CSS custom property patterns
- [ ] T037 Verify the `FEEDBACK.md` file is removed from git tracking (per spec assumptions)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **User Stories 1-5 (Phases 2-6)**: All depend on Phase 1 completion
  - Phases 2-6 are independent of each other and can proceed in parallel
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 Branded Button Layer (P1)**: Can start after Phase 1 — no dependencies on other stories
- **US2 Workflow Card Pattern (P1)**: Can start after Phase 1 — no dependencies on other stories
- **US3 Form Workflow Examples (P2)**: Can start after Phase 1 — no dependencies on other stories
- **US4 Semantic Alert Patterns (P2)**: Can start after Phase 1 — no dependencies on other stories
- **US5 Navigation Workflow Stories (P3)**: Can start after Phase 1 — no dependencies on other stories

### Within Each User Story

- SCSS wrapper modifications first, then Storybook story updates, then build/verify

### Parallel Opportunities

- **Phase 1 tasks**: T001 and T002 are independent — can run in parallel
- **Phases 2-6**: ALL user stories can run in parallel since they modify different files (different SCSS wrappers and different story files)
- **Within each phase**: [P]-marked tasks are independent and can run in parallel
- **Polish Phase 7**: T033, T034, T035, T036 are independent — can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all SCSS wrapper modifications for buttons together:
Task: T003 Add brand overrides to primary button in pathable-button.scss
Task: T004 Add brand overrides to secondary button in pathable-button.scss
Task: T005 Add brand overrides to accent-cool button in pathable-button.scss
Task: T006 Add brand overrides to base button in pathable-button.scss

# Launch all Storybook story additions for buttons together:
Task: T007 Add "Workflow: Primary CTA" story in Button.stories.js
Task: T008 Add "Workflow: Secondary Action" story in Button.stories.js
Task: T009 Add "Workflow: Tertiary Action" story in Button.stories.js
```

## Parallel Example: All User Stories (Phases 2-6)

```bash
# These all modify different files — can run simultaneously:
Task: Phase 2 — Button brand layer (pathable-button.scss + Button.stories.js)
Task: Phase 3 — Workflow card (pathable-card.scss + Card.stories.js)
Task: Phase 4 — Form patterns (Textarea.stories.js, Select.stories.js, Checkbox.stories.js, Radio.stories.js, Input.stories.js)
Task: Phase 5 — Alert patterns (Alert.stories.js)
Task: Phase 6 — Nav patterns (Sidenav.stories.js, Breadcrumb.stories.js)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: User Story 1 (Branded Button Layer)
3. **STOP and VALIDATE**: Test all button variants in Storybook with a11y addon
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Phase 1 → Foundation ready
2. Add US1 (Buttons) → Test independently → Deploy/Demo (MVP!)
3. Add US2 (Cards) → Test independently → Deploy/Demo
4. Add US3 (Forms) → Test independently → Deploy/Demo
5. Add US4 (Alerts) → Test independently → Deploy/Demo
6. Add US5 (Navigation) → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Developer completes Phase 1 first
2. Once Phase 1 is done:
   - Developer A: US1 (Buttons) + US4 (Alerts)
   - Developer B: US2 (Cards) + US5 (Navigation)
   - Developer C: US3 (Forms)
3. All 5 stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No test tasks — this is a visual/SCSS-only feature verified via Storybook a11y addon and manual inspection
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence