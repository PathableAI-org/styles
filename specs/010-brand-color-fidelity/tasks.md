# Tasks: Brand Color Fidelity & Token Architecture

**Input**: Design documents from `/specs/010-brand-color-fidelity/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No test tasks — this feature is a CSS/SCSS and documentation change. Verification is via build output inspection and Storybook visual review.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Table of Contents

- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 3: User Story 1 - Brand Color Fidelity Tokens (Priority: P1)](#phase-3-user-story-1---brand-color-fidelity-tokens-priority-p1)
- [Phase 4: User Story 2 - Expanded Semantic Token Architecture (Priority: P1)](#phase-4-user-story-2---expanded-semantic-token-architecture-priority-p1)
- [Phase 5: User Story 3 - Brand / Color Usage Storybook Page (Priority: P2)](#phase-5-user-story-3---brand--color-usage-storybook-page-priority-p2)
- [Phase 6: Polish & Cross-Cutting Concerns](#phase-6-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Examples](#parallel-examples)
- [Implementation Strategy](#implementation-strategy)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the directory structure for the new Brand Storybook section

- [ ] T001 Create `packages/styles/src/stories/brand/` directory for the new Brand Storybook section

---

## Phase 3: User Story 1 - Brand Color Fidelity Tokens (Priority: P1) 🎯 MVP

**Goal**: Design system maintainer can verify exact brand hex values are emitted as CSS custom properties alongside USWDS-mapped values

**Independent Test**: Run `pnpm build` in `packages/styles`, then `rg '--pathable-brand-' dist/styles.css` — all six brand colors must appear with their exact hex values (`#00365c`, `#1cae96`, `#4899e8`, `#015a76`, `#d3ff66`, `#dde2e8`)

### Implementation for User Story 1

- [ ] T002 [P] [US1] Add exact brand hex values as SCSS variables and `--pathable-brand-*` CSS custom properties in `packages/styles/src/_colors.scss`: `--pathable-brand-pathable-blue: #00365c`, `--pathable-brand-intelligent-jade: #1cae96`, `--pathable-brand-bright-blue-brooks: #4899e8`, `--pathable-brand-tech-teal: #015a76`, `--pathable-brand-lived-in-lime: #d3ff66`, `--pathable-brand-shilling-silver: #dde2e8`
- [ ] T003 [US1] Add `$brand-exact-colors` SCSS map in `packages/styles/src/_colors.scss` with all six exact brand hex values for programmatic access
- [ ] T004 [US1] Build and verify: run `cd packages/styles && pnpm build` and confirm `dist/styles.css` contains all six `--pathable-brand-*` tokens with correct exact hex values

**Checkpoint**: At this point, User Story 1 should be fully functional — the compiled CSS emits exact brand hex values under the `--pathable-brand-*` namespace. All existing tokens remain unchanged.

---

## Phase 4: User Story 2 - Expanded Semantic Token Architecture (Priority: P1) 🎯 MVP

**Goal**: Component developer can use action, status, and workflow semantic color tokens instead of hardcoding colors

**Independent Test**: Run `pnpm build` in `packages/styles`, then grep for `--pathable-color-action-`, `--pathable-color-status-`, and `--pathable-color-workflow-` in `dist/styles.css` — all 13 new tokens must be present with correct values

### Implementation for User Story 2

- [ ] T005 [P] [US2] Add action role tokens to `packages/styles/src/_semantic.scss`: `--pathable-color-action-primary-bg: #162e51`, `--pathable-color-action-primary-text: #ffffff`, `--pathable-color-action-secondary-bg: #1dc2ae`, `--pathable-color-action-secondary-text: #162e51` — with SCSS variables, map entry, CSS custom property, and role comment
- [ ] T006 [P] [US2] Add status role tokens to `packages/styles/src/_semantic.scss`: `--pathable-color-status-success-bg: #1dc2ae`, `--pathable-color-status-success-text: #162e51`, `--pathable-color-status-warning-bg: #f5a623`, `--pathable-color-status-warning-text: #162e51`, `--pathable-color-status-danger-bg: #dc3545`, `--pathable-color-status-danger-text: #ffffff` — with SCSS variables, map entry, CSS custom property, and role comment
- [ ] T007 [P] [US2] Add workflow state tokens to `packages/styles/src/_semantic.scss`: `--pathable-color-workflow-active: #58b4ff`, `--pathable-color-workflow-complete: #1dc2ae`, `--pathable-color-workflow-blocked: #dc3545` — with SCSS variables, map entry, CSS custom property, and role comment
- [ ] T008 [US2] Build and verify backward compatibility: run `cd packages/styles && pnpm build` and confirm all 10 existing semantic tokens (`--pathable-color-bg`, `--pathable-color-surface`, `--pathable-color-text`, `--pathable-color-text-muted`, `--pathable-color-border`, `--pathable-color-link`, `--pathable-color-accent`, `--pathable-color-focus-ring`, `--pathable-color-danger`, `--pathable-color-success`) retain their original values

**Checkpoint**: At this point, User Story 2 should be fully functional — the compiled CSS contains 13 new semantic tokens plus all 10 existing tokens unchanged.

---

## Phase 5: User Story 3 - Brand / Color Usage Storybook Page (Priority: P2)

**Goal**: Designer can verify brand compliance by viewing the Brand / Color Usage page in Storybook, including exact brand colors, USWDS mapping, semantic tokens, approved pairings, and failed pairings

**Independent Test**: Start Storybook with `pnpm docs` from root, navigate to "Brand / Color Usage" section, and confirm it contains: six brand color swatches with ΔE, USWDS mapping table, semantic token reference, approved pairings table, and "do not use" warnings

### Implementation for User Story 3

- [ ] T009 [P] [US3] Create Brand / Color Usage Storybook page at `packages/styles/src/stories/brand/ColorUsage.stories.js` with title `Brand/Color Usage` — include intro section with mapping tradeoff statement, six brand color swatches with exact hex, USWDS token, mapped hex, and ΔE values
- [ ] T010 [P] [US3] Add semantic tokens section to ColorUsage.stories.js showing all token categories (general, action, status, workflow) with token names, resolved values, and role descriptions
- [ ] T011 [P] [US3] Add color pairings section to ColorUsage.stories.js with approved pairings table (foreground, background, ratio, level) and failed pairings table with "do not use" warnings and contrast ratio information
- [ ] T012 [US3] Verify Storybook renders correctly: start `pnpm docs` from root, navigate to Brand / Color Usage, and confirm all five content areas render without errors

**Checkpoint**: At this point, all three user stories should be complete. The Storybook Brand / Color Usage page documents all brand colors, tokens, and pairings.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, documentation updates, and quality checks

- [ ] T013 [P] Run full build and verify no regressions: `cd packages/styles && pnpm build` then `pnpm lint:styles` to confirm SCSS lint passes
- [ ] T014 [P] Verify all existing component stories render correctly by starting Storybook and spot-checking component stories across all categories (Basic, Communication, FormControls, Layout, Navigation, Utilities)
- [ ] T015 Verify FEEDBACK.md is not tracked in git: confirm `git status` does not show FEEDBACK.md (it should be gitignored or untracked)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **User Story 1 (Phase 3)**: No dependencies on other stories — can start immediately after Setup
- **User Story 2 (Phase 4)**: No dependencies on other stories — can start immediately after Setup
- **User Story 3 (Phase 5)**: Depends on User Story 1 AND User Story 2 being complete (the Brand / Color Usage page documents both brand fidelity tokens and semantic tokens)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies — can start immediately after Setup
- **User Story 2 (P1)**: No dependencies — can start immediately after Setup
- **User Story 3 (P2)**: Depends on US1 and US2 — documents the tokens from both stories

### Within Each User Story

- Tasks are ordered by file ownership within each story
- [P] tasks within a story can run in parallel (different files or different sections of the same file)
- Build verification is always the last task in each story

### Parallel Opportunities

- US1 and US2 can be executed in parallel (different files: `_colors.scss` vs `_semantic.scss`)
- Within US2: T005, T006, T007 can run in parallel (different sections of `_semantic.scss`)
- Within US3: T009, T010, T011 can run in parallel (different sections of the same `.stories.js` file, but careful merge needed)
- Polish tasks T013 and T014 can run in parallel

## Parallel Examples

### User Story 1 + User Story 2 (both P1, can run in parallel)

```bash
# Launch US1 and US2 together:
Task: "Add brand fidelity tokens to _colors.scss" (T002, T003)
Task: "Add action role tokens to _semantic.scss" (T005)
Task: "Add status role tokens to _semantic.scss" (T006)
Task: "Add workflow state tokens to _semantic.scss" (T007)
```

### Within User Story 3

```bash
# Launch all Brand / Color Usage page sections together:
Task: "Create ColorUsage.stories.js intro + brand swatches" (T009)
Task: "Add semantic tokens section to ColorUsage.stories.js" (T010)
Task: "Add color pairings section to ColorUsage.stories.js" (T011)
```

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup
2. Complete Phase 3: User Story 1 (brand fidelity tokens)
3. Complete Phase 4: User Story 2 (expanded semantic tokens)
4. **STOP and VALIDATE**: Build output verification — both P1 stories are independently testable by inspecting compiled CSS
5. Deliver token expansion as first increment

### Incremental Delivery

1. Complete Setup → Directory structure ready
2. Add User Story 1 (brand fidelity tokens) → Test independently via `rg '--pathable-brand-' dist/styles.css` → MVP increment
3. Add User Story 2 (expanded semantic tokens) → Test independently via `rg '--pathable-color-action-' dist/styles.css` → MVP increment
4. Add User Story 3 (Brand / Color Usage page) → Test independently via Storybook visual review → Full feature
5. Complete Polish → Final verification

### Parallel Team Strategy

With multiple developers:

1. Developer A: Phase 3 (User Story 1 — `_colors.scss`)
2. Developer B: Phase 4 (User Story 2 — `_semantic.scss`)
3. Both complete in parallel since they target different files
4. Once both are done: Developer C: Phase 5 (User Story 3 — Storybook page)
5. Developer A or B: Phase 6 (Polish)

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **No test tasks**: this feature is a SCSS/CSS token expansion and documentation change — verification is via build output inspection and Storybook visual review
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Total tasks: 15 (T001–T015)
- US1: 3 tasks (T002–T004)
- US2: 4 tasks (T005–T008)
- US3: 4 tasks (T009–T012)
