# Tasks: Storybook Workflow-Context Refinement

**Input**: Design documents from `/specs/013-storybook-workflow-refinement/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual visual review in Storybook is the primary verification method. No automated tests are requested for this feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: All source files live under `packages/styles/src/`
- Story files under `packages/styles/src/stories/`
- SCSS files under `packages/styles/src/` and `packages/styles/src/pathable-component-wrappers/`

## Table of Contents

- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 - Component Stories Reflect Disability-Employment Workflows (P1)](#phase-3-user-story-1---component-stories-reflect-disability-employment-workflows-priority-p1--mvp)
- [Phase 4: User Story 4 - Fix Nunito Font Fallback (P2)](#phase-4-user-story-4---fix-nunito-font-fallback-priority-p2)
- [Phase 5: User Story 2 - Every Story Documents Its Interaction Model (P2)](#phase-5-user-story-2---every-story-documents-its-interaction-model-priority-p2)
- [Phase 6: User Story 3 - Add Workflow-Intent Button Variant Aliases (P3)](#phase-6-user-story-3---add-workflow-intent-button-variant-aliases-priority-p3)
- [Phase 7: User Story 5 - Clarify Brand Custom Property Public API (P3)](#phase-7-user-story-5---clarify-brand-custom-property-public-api-priority-p3)
- [Phase 8: Polish & Cross-Cutting Concerns](#phase-8-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Execution Examples](#parallel-execution-examples)
- [Implementation Strategy](#implementation-strategy)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify the development environment is ready for implementation

- [x] T001 Verify `pnpm install` is up to date and `pnpm storybook` starts without errors

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational blocking prerequisites exist for this feature. The `@pathable/styles` package is fully scaffolded and all infrastructure (pnpm workspace, Storybook, SCSS compilation, stylelint) is already in place.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Read `contracts/index.md` to understand the standardized Interaction Model annotation format, button variant mapping table, deprecation map, and story workflow copy contract — these are the reference contracts for all subsequent tasks

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Component Stories Reflect Disability-Employment Workflows (Priority: P1) 🎯 MVP

**Goal**: Replace generic placeholder copy in Header, Banner, Combo Box, and Modal stories with Pathable/CoachBridge disability-employment workflow content

**Independent Test**: Open each affected story in Storybook and verify all visible text uses product-specific terminology from the contracts copy contract

### Implementation for User Story 1

- [x] T003 [P] [US1] Update Header story navigation labels
- [x] T004 [P] [US1] Update Banner story copy
- [x] T005 [P] [US1] Update Combo Box story options
- [x] T006 [P] [US1] Update Modal story copy

**Checkpoint**: At this point, User Story 1 should be fully functional

---

## Phase 4: User Story 4 - Fix Nunito Font Fallback (Priority: P2)

- [x] T007 [US4] Fix `$pathable-font-body` fallback

**Checkpoint**: At this point, User Story 4 is complete.

---

## Phase 5: User Story 2 - Every Story Documents Its Interaction Model (Priority: P2)

**Goal**: Add a standardized Interaction Model section to every Storybook story, accurately documenting whether each component is CSS-only, requires USWDS JS, requires app-owned state, or is not yet behavior-complete

**Independent Test**: Open any component story's Docs tab and confirm it contains the Interaction Model section with correct classification matching the interaction model contract in `contracts/index.md`

### Implementation for User Story 2

- [x] T008 [P] [US2] Add Interaction Model annotation to all brand stories
- [x] T009 [P] [US2] Add Interaction Model annotation to Basic component stories
- [x] T010 [P] [US2] Add Interaction Model annotation to Communication component stories
- [x] T011 [P] [US2] Add Interaction Model annotation to Form Control component stories
- [x] T012 [P] [US2] Add Interaction Model annotation to Layout component stories
- [x] T013 [P] [US2] Add Interaction Model annotation to Navigation component stories
- [x] T014 [P] [US2] Add Interaction Model annotation to Utilities stories
- [x] T015 [P] [US2] For every story marked "Requires USWDS JS", add detailed USWDS JS behaviors documentation

**Checkpoint**: At this point, User Story 2 is complete. Browse to any component story in Storybook Docs tab and verify the Interaction Model section appears with correct classification.

---

## Phase 6: User Story 3 - Add Workflow-Intent Button Variant Aliases (Priority: P3)

**Goal**: Add workflow-intent semantic alias classes to `pathable-button.scss` and show them in the Button story

**Independent Test**: Inspect `pathable-button.scss` for the five new classes, then open Storybook Button story to verify each renders correctly

### Implementation for User Story 3

- [x] T016 [P] [US3] Add `.pathable-button--save` class
- [x] T017 [P] [US3] Add `.pathable-button--continue` class
- [x] T018 [P] [US3] Add `.pathable-button--review` class
- [x] T019 [US3] Add `.pathable-button--destructive` class
- [x] T020 [P] [US3] Add `.pathable-button--low-emphasis` class
- [x] T021 [US3] Add Storybook examples for all five workflow-intent button variants
- [x] T022 [US3] Run `pnpm build` and verify compiled CSS contains the five new variant classes

**Checkpoint**: At this point, User Story 3 is complete. Open Storybook Button story and verify all five workflow-intent variants render with correct colors and labels.

---

## Phase 7: User Story 5 - Clarify Brand Custom Property Public API (Priority: P3)

**Goal**: Add deprecation annotations to `_colors.scss` designating the `--pathable-brand-*` prefixed names as the canonical API and marking the short names as deprecated

**Independent Test**: Read `_colors.scss` and verify each short-name property has a deprecation comment pointing to its replacement; verify `BRAND_RULES.md` documents the naming convention

### Implementation for User Story 5

- [x] T023 [US5] Remove legacy short-name brand CSS custom properties from `:root` in `_colors.scss` (`--pathable-blue`, `--intelligent-jade`, `--bright-blue-brooks`, `--tech-teal`, `--lived-in-lime`, `--shilling-silver`) — keep only canonical `--pathable-brand-*` equivalents
- [x] T030 [US5] Run `pnpm build` and verify no compilation errors

**Checkpoint**: At this point, User Story 5 is complete. `rg '--pathable-brand-' packages/styles/src/_colors.scss` should show only the 6 canonical properties. `pnpm build` must succeed.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and build validation

- [x] T031 [P] Run `pnpm build` and confirm no compilation errors
- [x] T032 [P] Run `pnpm stylelint` and confirm no new linting errors
- [x] T033 Run the full quickstart validation checklist from `specs/013-storybook-workflow-refinement/quickstart.md` — verify story copy, interaction models, font fallback, button variants, and deprecation annotations
- [ ] T034 Start Storybook with `pnpm storybook`, open each affected story, and take screenshots confirming visual styling is unchanged (only copy/labels updated) — manual visual review in browser

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately (verify environment)
- **Foundational (Phase 2)**: No true blocking prerequisites — read contracts for reference
- **User Stories (Phase 3–7)**: All can proceed independently without blocking each other
  - US1 (P1) — workflow copy: touches only Header, Banner, Combo Box, Modal stories
  - US4 (P2) — font fallback: touches only `_typography.scss`
  - US2 (P2) — interaction models: touches all ~42 story files
  - US3 (P3) — button variants: touches `pathable-button.scss` and `Button.stories.js`
  - US5 (P3) — deprecation: touches only `_colors.scss`
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories
- **User Story 4 (P2)**: No dependencies on other stories
- **User Story 2 (P2)**: No dependencies on other stories
- **User Story 3 (P3)**: No dependencies on other stories
- **User Story 5 (P3)**: No dependencies on other stories

### Stories With NO Cross-Story Conflicts

- `Header.stories.js` — touched by US1 only
- `Banner.stories.js` — touched by US1 + US2 (safe: different sections of the file)
- `ComboBox.stories.js` — touched by US1 + US2 (safe: different sections of the file)
- `Modal.stories.js` — touched by US1 + US2 (safe: different sections of the file)
- `Button.stories.js` — touched by US2 + US3 (safe: different exports)
- `_colors.scss` — touched by US5 only
- `_typography.scss` — touched by US4 only
- `pathable-button.scss` — touched by US3 only

### Parallel Opportunities

- All tasks marked [P] can run in parallel — they touch different files
- All 5 user stories can be worked on in parallel (no file conflicts between them)
- Within US2: T008–T015 all touch different story files and can run in parallel
- Within US3: T016–T018 and T020 touch `pathable-button.scss` but are different classes — can be parallelized as separate additions to the same file
- Within US5: T024–T029 all touch `_colors.scss` on different lines — can be parallelized

---

## Parallel Execution Examples

```bash
# Launch all User Stories in parallel (they touch different files):
Task: "US1 — Update Header, Banner, Combo Box, Modal story copy"
Task: "US4 — Fix $pathable-font-body fallback in _typography.scss"
Task: "US2 — Add Interaction Model annotations to all story files (T008–T015)"
Task: "US3 — Add workflow-intent button variants to pathable-button.scss and Button.stories.js"
Task: "US5 — Add deprecation annotations to _colors.scss"
```

```bash
# Launch all US2 story-file annotations in parallel (T008–T014 all touch different files):
Task: "T008 — Brand stories Interaction Model"
Task: "T009 — Basic component stories Interaction Model"
Task: "T010 — Communication component stories Interaction Model"
Task: "T011 — Form Control component stories Interaction Model"
Task: "T012 — Layout component stories Interaction Model"
Task: "T013 — Navigation component stories Interaction Model"
Task: "T014 — Utilities stories Interaction Model"
Task: "T015 — Add USWDS JS behavior details for JS-requiring stories"
```

```bash
# Launch all button variant classes in parallel:
Task: "T016 — .pathable-button--save class"
Task: "T017 — .pathable-button--continue class"
Task: "T018 — .pathable-button--review class"
Task: "T019 — .pathable-button--destructive class"
Task: "T020 — .pathable-button--low-emphasis class"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify environment)
2. Complete Phase 2: Foundational (read contracts)
3. Complete Phase 3: User Story 1 (workflow copy for Header, Banner, Combo Box, Modal)
4. **STOP and VALIDATE**: Open Storybook and verify all four stories show Pathable/CoachBridge content
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Phase 1–2 → Foundation ready
2. Add User Story 1 → Test in Storybook → Deploy/Demo (MVP!)
3. Add User Story 4 (font fix, 1 line change) → Test → Deploy/Demo
4. Add User Story 2 (interaction models) → Test → Deploy/Demo
5. Add User Story 3 (button variants) → Test → Deploy/Demo
6. Add User Story 5 (deprecation annotations) → Test → Deploy/Demo
7. Each increment adds value without breaking previous ones

### Parallel Team Strategy

With multiple developers:

1. One developer handles US1 (4 story updates)
2. One developer handles US4 + US5 (SCSS changes, ~2 files)
3. One developer handles US2 (~42 story file annotations)
4. One developer handles US3 (button SCSS + story example)
5. All can work simultaneously — absolutely no file conflicts between any pair

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- All verification is manual via Storybook visual review (no automated test framework)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
