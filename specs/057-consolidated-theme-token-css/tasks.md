# Tasks: Consolidated Theme Token CSS and Granular Exports

**Input**: Design documents from `specs/057-consolidated-theme-token-css/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not applicable — no rendered UI or component contract changes. Validation is via lint, build, and parity checks.

**Organization**: Tasks are grouped by user story for independent implementation and testing.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Phase 1: Setup](#phase-1-setup)
- [Phase 2: Foundational](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 (P1)](#phase-3-user-story-1)
- [Phase 4: User Story 2 (P2)](#phase-4-user-story-2)
- [Phase 5: User Story 3 (P3)](#phase-5-user-story-3)
- [Phase 6: Polish](#phase-6-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Establish a parity baseline before any refactor.

- [x] T001 Run `pnpm --filter @pathableai/styles build` and record the current `dist/styles.css` as the parity baseline (no token value, name, or count may change).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extract the utility map so the utility token block and utility classes can be emitted separately. Blocks US2 (and transitively US3).

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Create `packages/styles/src/_utilities-config.scss` containing the extracted `$pathable-utility-breakpoints`, `$-spacing-tokens`, and `$pathable-utilities` map (no CSS output; `@use 'sass:map'` and `@use 'uswds-core' as uswds`).
- [x] T003 [P] Create `packages/styles/src/_utilities-tokens.scss` that `@use`s `sass:map`, `uswds-core`, and `_utilities-config`, and emits the `:root { @each ... }` dual `--pathable-{module}-{value}` / `--usa-{module}-{value}` token block (depends on T002).
- [x] T004 [P] Modify `packages/styles/src/_utilities.scss` to `@use '_utilities-config'` and remove its `:root` token block, keeping only the class generation (depends on T002).
- [x] T005 Modify `packages/styles/src/index.scss` to `@forward '_utilities-tokens'` alongside `@forward '_utilities'` so the combined output is preserved (depends on T003).

**Checkpoint**: `dist/styles.css` rebuilds to the parity baseline after the utility split.

---

## Phase 3: User Story 1 - Single Consolidated Color Token Block (Priority: P1) 🎯 MVP

**Goal**: Guarantee every `--pathable-color-*` declaration lives in exactly one `:root` block (authored in `_semantic.scss`) and enforce it so future drift fails CI.

**Independent Test**: Run `pnpm --filter @pathableai/styles lint:tokens`; the check passes when all `--pathable-color-*` declarations are in `_semantic.scss`'s single block and fails otherwise.

### Implementation for User Story 1

- [x] T006 [US1] Extend `packages/styles/scripts/lint-tokens.mjs` to scan each SCSS file's `:root` blocks and fail if any `--pathable-color-*` property is declared outside `_semantic.scss` or in more than one block.

**Checkpoint**: The single-`:root`-color-block invariant is enforced and passing.

---

## Phase 4: User Story 2 - Granular Component, Utility, and Theme Subpath Exports (Priority: P2)

**Goal**: Emit `dist/components.css`, `dist/utilities.css`, and `dist/theme-default.css` and expose them as subpaths while keeping `.` unchanged.

**Independent Test**: Import `@pathableai/styles/components`, `@pathableai/styles/utilities`, and `@pathableai/styles/theme`; each resolves to its new `dist/*.css` file, and the default `.` path is unchanged.

### Implementation for User Story 2

- [x] T007 [P] [US2] Create `packages/styles/src/theme-default.scss` forwarding `uswds-theme`, `_colors`, `_typography`, `_spacing`, `_elevation`, `_radius`, `_semantic`, `_utilities-tokens`, and `components-custom-properties`.
- [x] T008 [P] [US2] Create `packages/styles/src/utilities.scss` forwarding `uswds-theme` and `_utilities`.
- [x] T009 [P] [US2] Create `packages/styles/src/components.scss` forwarding `fonts`, `uswds-theme`, `pathable-component-wrappers`, and `usa-layout-grid/src/styles`.
- [x] T010 [US2] Update the `build` script in `packages/styles/package.json` to compile the three entry files to `dist/components.css`, `dist/utilities.css`, and `dist/theme-default.css` alongside `dist/styles.css`.
- [x] T011 [US2] Add `./components`, `./utilities`, and `./theme` subpaths to the `exports` map in `packages/styles/package.json`.

**Checkpoint**: The build emits all four files and the new subpaths resolve.

---

## Phase 5: User Story 3 - Backward-Compatible Default Import (Priority: P3)

**Goal**: Prove the default import and the split-file union are behaviorally identical to today.

**Independent Test**: Compare the token set and rule coverage of `components.css` + `utilities.css` + `theme-default.css` against `dist/styles.css`; they must match, and `dist/styles.css` must match the parity baseline.

### Implementation for User Story 3

- [x] T012 [US3] Rebuild and verify `dist/styles.css` matches the parity baseline from T001 (default import unchanged).
- [x] T013 [US3] Verify the union of `dist/components.css`, `dist/utilities.css`, and `dist/theme-default.css` reproduces `dist/styles.css` (compare the `--pathable-*` / `--usa-*` token set and component/utility class coverage).

**Checkpoint**: Default import parity and split-file equivalence are verified.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end validation of lint, build, and package contents.

- [x] T014 Run `pnpm --filter @pathableai/styles build` and confirm `dist/styles.css`, `dist/components.css`, `dist/utilities.css`, and `dist/theme-default.css` are all emitted.
- [x] T015 Run `pnpm --filter @pathableai/styles lint:tokens` and `pnpm --filter @pathableai/styles lint:styles` and fix any findings without disabling rules.
- [x] T016 Run `pnpm --filter @pathableai/styles pack --dry-run` and confirm the tarball includes the three new `dist/*.css` files and the `exports` map resolves each new subpath.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — establishes the baseline.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS US2/US3 (the split depends on the utility refactor).
- **US1 (Phase 3)**: Depends on Setup only; independent of the utility split.
- **US2 (Phase 4)**: Depends on Foundational.
- **US3 (Phase 5)**: Depends on US2 (needs the split files to verify).
- **Polish (Phase 6)**: Depends on US2 (and US3 verification).

### User Story Dependencies

- **US1 (P1)**: Independent — lint-only, can proceed in parallel with the utility split.
- **US2 (P2)**: Depends on Foundational (T002–T005).
- **US3 (P3)**: Depends on US2 output.

### Within Each User Story

- For US2, the three entry files (T007–T009) are independent and can be created in parallel; the build-script and exports changes (T010–T011) follow.
- No test-first tasks (no rendered UI/component contract changes).

### Parallel Opportunities

- T003 and T004 (both depend only on T002).
- T007, T008, T009 (independent entry files).
- US1 (T006) can run in parallel with the Foundational phase.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (baseline) and Phase 2 (utility split).
2. Complete Phase 3 (US1): the single-`:root`-color-block lint enforcement.
3. Validate with `pnpm --filter @pathableai/styles lint:tokens`.

### Incremental Delivery

1. Setup + Foundational → the utility refactor is in place and `styles.css` is unchanged.
2. US1 → the color-block invariant is enforced.
3. US2 → the three split files and subpath exports are produced.
4. US3 → parity and equivalence are verified.
5. Polish → lint, build, and pack validation all pass.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps a task to its user story for traceability.
- No token value, name, or count may change; the default `.` export is unchanged.
- The split files may carry USWDS settings documentation comments (harmless, comment-only) — do not strip them as that would alter the source-compiled output.
- Do not disable, weaken, skip, or silence any lint check.
