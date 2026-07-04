---
description: "Task list for Brand Design Tokens feature implementation"
---

# Tasks: Brand Design Tokens

**Input**: Design documents from `/specs/001-brand-design-tokens/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT requested in the spec. No test tasks are generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 - CSS Custom Properties](#phase-3-user-story-1---developer-uses-css-custom-properties-from-the-styles-package-priority-p1)
- [Phase 4: User Story 2 - Semantic Color Tokens](#phase-4-user-story-2---developer-uses-semantic-color-tokens-for-light-mode-ui-priority-p2)
- [Phase 5: User Story 3 - SCSS Variables and Maps](#phase-5-user-story-3---developer-uses-scss-variables-and-maps-for-advanced-customization-priority-p3)
- [Phase 6: Polish & Cross-Cutting Concerns](#phase-6-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 1](#parallel-example-user-story-1)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Package root**: `packages/styles/` at repository root
- **SCSS source**: `packages/styles/src/`
- **SCSS partials**: `packages/styles/src/_colors.scss`, `_semantic.scss`, `_typography.scss`, `_spacing.scss`, `_elevation.scss`, `_radius.scss`
- **Entry point**: `packages/styles/src/index.scss`
- **Compiled output**: `packages/styles/dist/styles.css`
- **Docs**: `packages/styles/README.md`, `BRAND_RULES.md`, `AGENTS.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project configuration fixes and tooling setup before any SCSS work begins

- [x] T001 Remove placeholder brand-agnostic content from `packages/styles/src/index.scss`
- [x] T002 Add `"files"` field to `packages/styles/package.json` to include `README.md`, `BRAND_RULES.md`, `AGENTS.md`, `dist/`, and `src/` in the published package
- [x] T003 [P] Fix markdown formatting issues in `packages/styles/README.md`: close unclosed code block delimiter after the Usage code block, format "Guidance", "Accessibility", and "License" as proper section headings
- [x] T004 [P] Create `.stylelintrc.json` at `packages/styles/` with SCSS linting rules configured for `stylelint ^16.18.0`

**Checkpoint**: Project configuration is ready for SCSS authoring.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core SCSS infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create the modular `packages/styles/src/index.scss` entry point with `@forward` directives for all six partials (`_colors`, `_semantic`, `_typography`, `_spacing`, `_elevation`, `_radius`) — each wrapped in a `@use 'sass:map'` block at the top
- [x] T006 Verify `pnpm build` succeeds at `packages/styles/` and produces valid `dist/styles.css`

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Developer uses CSS custom properties from the styles package (Priority: P1) 🎯 MVP

**Goal**: A developer imports the compiled CSS from `@pathable/styles` and has access to all brand design tokens (brand colors, typography, spacing, elevation, border-radius) as CSS custom properties on `:root`.

**Independent Test**: Create a minimal HTML page that imports `dist/styles.css` and applies `var(--pathable-blue)`, `var(--space-16)`, and `var(--font-heading)` to elements. The page renders with the correct brand values visible in the browser.

### Implementation for User Story 1

- [x] T007 [P] [US1] Create `packages/styles/src/_colors.scss` with brand color CSS custom properties: `--pathable-blue` (#00365c), `--intelligent-jade` (#1cae96), `--bright-blue-brooks` (#4899e8), `--tech-teal` (#015a76), `--lived-in-lime` (#d3ff66), `--shilling-silver` (#dde2e8) on `:root`, plus Sass variables for each (e.g., `$pathable-blue: #00365c`)
- [x] T008 [P] [US1] Create `packages/styles/src/_typography.scss` with font family CSS custom properties (`--pathable-font-heading`: Fredoka, system-ui, sans-serif; `--pathable-font-alternate-heading`: Montserrat Bold, system-ui, sans-serif; `--pathable-font-subheading`: Poppins Bold, system-ui, sans-serif; `--pathable-font-body`: Nunito, system-ui, serif) and typography scale tokens (`--ui-display-lg` through `--ui-caption-md`) with exact font-size, line-height, and font-weight values from research.md Section 3
- [x] T009 [P] [US1] Create `packages/styles/src/_spacing.scss` with spacing scale CSS custom properties: `--space-4`, `--space-8`, `--space-12`, `--space-16`, `--space-24`, `--space-32`, `--space-48` with corresponding pixel values on `:root`
- [x] T010 [P] [US1] Create `packages/styles/src/_elevation.scss` with elevation CSS custom properties: `--elevation-sm`, `--elevation-md`, `--elevation-lg`, `--elevation-xl` with exact box-shadow values from research.md Section 4 on `:root`
- [x] T011 [P] [US1] Create `packages/styles/src/_radius.scss` with border-radius CSS custom properties: `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (12px) on `:root`
- [x] T012 [US1] Run `pnpm build` at `packages/styles/` and verify `dist/styles.css` contains all brand color, typography, spacing, elevation, and radius tokens as CSS custom properties on `:root` with correct values

**Checkpoint**: At this point, User Story 1 should be fully functional. A minimal HTML page importing `dist/styles.css` can use `var(--pathable-blue)`, `var(--space-16)`, `var(--radius-md)`, etc. and see correct brand values.

---

## Phase 4: User Story 2 - Developer uses semantic color tokens for light-mode UI (Priority: P2)

**Goal**: A UI developer uses semantic color tokens like `--pathable-color-bg`, `--pathable-color-text`, and `--pathable-color-accent` to style components. These tokens map to appropriate brand colors for consistent on-brand UI.

**Independent Test**: Build a simple card component using only semantic tokens (`--pathable-color-surface`, `--pathable-color-border`, `--pathable-color-text`) and verify the rendered colors match the intended brand palette. Confirm `--pathable-color-text` against `--pathable-color-bg` achieves at least 4.5:1 WCAG AA contrast.

### Implementation for User Story 2

- [x] T013 [US2] Create `packages/styles/src/_semantic.scss` with 10 semantic color CSS custom properties on `:root`: `--pathable-color-bg` (#dde2e8 or White), `--pathable-color-surface` (White), `--pathable-color-text` (#00365c), `--pathable-color-text-muted` (#015a76), `--pathable-color-border` (#dde2e8), `--pathable-color-link` (#4899e8), `--pathable-color-accent` (#1cae96), `--pathable-color-focus-ring` (#4899e8), `--pathable-color-danger` (accessibility-appropriate red), `--pathable-color-success` (#1cae96). Reference the existing Sass variables from `_colors.scss` via `var()` or use the hex values directly. Add Sass variables for each.
- [x] T014 [US2] Run `pnpm build` at `packages/styles/` and verify `dist/styles.css` contains all 10 semantic tokens. Calculate contrast ratio of `--pathable-color-text` (#00365c) against `--pathable-color-bg` (#dde2e8/White) and confirm it meets WCAG AA minimum of 4.5:1.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. A card component using `var(--pathable-color-surface)`, `var(--pathable-color-border)`, and `var(--pathable-color-text)` renders with correct on-brand colors.

---

## Phase 5: User Story 3 - Developer uses SCSS variables and maps for advanced customization (Priority: P3)

**Goal**: A design system contributor imports the SCSS source directly via `@use '@pathable/styles' as tokens` and accesses Sass variables and maps for all token categories, enabling composition of new values, derived variants, or theme-specific overrides.

**Independent Test**: A contributor writes an SCSS file that `@use`s the package source and accesses a Sass variable like `$pathable-blue` with the correct hex value `#00365c`.

### Implementation for User Story 3

- [x] T015 [P] [US3] Add Sass `$brand-colors` map to `packages/styles/src/_colors.scss` containing all 6 brand colors as name-value pairs
- [x] T016 [P] [US3] Add Sass `$typography-scale` map to `packages/styles/src/_typography.scss` containing all 10 typography roles as name-value maps with font-family, font-size, line-height, font-weight keys
- [x] T017 [P] [US3] Add Sass `$spacing-scale` map to `packages/styles/src/_spacing.scss` containing all 7 spacing values
- [x] T018 [P] [US3] Add Sass `$elevation-levels` map to `packages/styles/src/_elevation.scss` containing all 4 elevation levels
- [x] T019 [P] [US3] Add Sass `$radius-scale` map to `packages/styles/src/_radius.scss` containing all 3 border-radius values
- [x] T020 [US3] Add Sass `$semantic-colors` map to `packages/styles/src/_semantic.scss` containing all 10 semantic tokens as name-value pairs
- [x] T021 [US3] Verify `packages/styles/src/index.scss` `@forward` directives expose all Sass variables and maps. Create a test file at `packages/styles/src/_test-import.scss` that `@use 'index' as tokens;` and outputs `$pathable-blue`, `$brand-colors`, `$semantic-colors`, `$spacing-scale` values to confirm they are accessible.
- [x] T022 [US3] Run `pnpm build` at `packages/styles/` and confirm no errors from SCSS variable/map exports. Remove the test file `packages/styles/src/_test-import.scss` after verification.

**Checkpoint**: All three user stories are independently functional. Contributors can `@use '@pathable/styles' as tokens` and access both CSS custom properties and Sass variables/maps.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, documentation, and quality checks

- [x] T023 Run `pnpm build` at `packages/styles/` and verify `dist/styles.css` compiles without warnings or errors
- [x] T024 Run linting and formatting checks: `pnpm lint:styles` and format check
- [x] T025 Verify `packages/styles/package.json` `"files"` field includes `README.md`, `BRAND_RULES.md`, `AGENTS.md`, `dist/`, and `src/` — run `pnpm pack --dry-run` if available to list included files
- [x] T026 Quickstart validation: Run through the quickstart.md scenarios — install flow, CSS import, SCSS import, and basic usage examples

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (Phase 3) can start immediately after Foundation
  - User Story 2 (Phase 4) depends on US1 brand color tokens being in place (semantic tokens reference brand colors)
  - User Story 3 (Phase 5) depends on all partials existing (adds maps to existing partials)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 being complete (uses brand color Sass variables from `_colors.scss`)
- **User Story 3 (P3)**: Depends on US1 and US2 being complete (adds maps to all existing partials)

### Within Each User Story

- Models (SCSS partials) before services (build verification)
- Core implementation before integration verification
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (README fix + stylelint config)
- All US1 partial creation tasks (T007–T011) can run in parallel since they touch different files
- All US3 map creation tasks (T015–T020) can run in parallel since they touch different files

---

## Parallel Example: User Story 1

```bash
# Launch all partials for User Story 1 together:
Task: "Create _colors.scss in packages/styles/src/_colors.scss"
Task: "Create _typography.scss in packages/styles/src/_typography.scss"
Task: "Create _spacing.scss in packages/styles/src/_spacing.scss"
Task: "Create _elevation.scss in packages/styles/src/_elevation.scss"
Task: "Create _radius.scss in packages/styles/src/_radius.scss"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (brand colors + typography + spacing + elevation + radius as CSS custom properties)
4. **STOP and VALIDATE**: Create minimal HTML page with `dist/styles.css` imported, verify `var(--pathable-blue)`, `var(--space-16)`, `var(--radius-md)` resolve correctly
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (brand colors + typography + spacing + elevation + radius) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (semantic color tokens) → Test independently → Deploy/Demo
4. Add User Story 3 (SCSS variables and maps) → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 — all partials in parallel
   - Developer B: Stands by (US2 depends on US1)
3. After US1 completes:
   - Developer A: User Story 2 (semantic tokens)
   - Developer B: User Story 3 (SCSS maps — can work in parallel)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests are NOT requested in the spec — no test tasks are generated
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence