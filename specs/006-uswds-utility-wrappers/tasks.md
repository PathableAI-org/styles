# Tasks: USWDS Utility Wrappers

**Input**: Design documents from `/specs/006-uswds-utility-wrappers/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/scss-interface.md

**Tests**: Not requested by spec — manual visual verification via compiled CSS inspection and docs site before/after comparison.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1](#phase-3-user-story-1---docs-site-uses-pathable-utility-classes-instead-of-ad-hoc-css-priority-p1--mvp)
- [Phase 4: User Story 2](#phase-4-user-story-2---developer-adds-pathable-utility-classes-to-new-project-priority-p2)
- [Phase 5: User Story 3](#phase-5-user-story-3---css-custom-property-dual-naming-for-utility-tokens-priority-p3)
- [Phase 6: Polish](#phase-6-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example](#parallel-example-user-story-1)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify the existing build tooling is functional and the branch is ready for development.

- [x] T001 Verify that `packages/styles` builds cleanly with `pnpm build` before making changes
- [x] T002 Verify the docs site loads with `pnpm dev` in `apps/docs` before making changes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the `_utilities.scss` partial — the core utility class generation engine. This phase MUST be complete before any user story can proceed.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Implementation

- [x] T003 Create `packages/styles/src/_utilities.scss` with the configuration map for the following utility modules: background-color, color, padding, padding-x, padding-y, margin, margin-x, margin-y, margin-top, margin-bottom. Each module entry must include `class`, `property`, `values` map, `responsive` flag, and `state` variants list per the contract in `specs/006-uswds-utility-wrappers/contracts/scss-interface.md`. Values must resolve via `uswds.color()`, `uswds.units()`, and direct string literals per `research.md`.
- [x] T004 [P] Add the display, font-family, font-weight, border, border-radius, flex, align-items, justify-content, width, max-width, and text-align utility modules to `packages/styles/src/_utilities.scss`. Each module must follow the same configuration map pattern from T003.
- [x] T005 Implement the base class generation loop in `packages/styles/src/_utilities.scss` that iterates over all module definitions and emits `.pathable-{base}-{value} { property: value; }` rules for each value token.
- [x] T006 Implement the dual CSS custom property emission in a `:root` block in `packages/styles/src/_utilities.scss` using an `@each` loop that generates both `--pathable-{name}: {value}` and `--usa-{name}: {value}` for every utility value token, matching the pattern in `packages/styles/src/_typography.scss`.
- [x] T007 Update `packages/styles/src/index.scss` to forward the new `_utilities` partial, placing the forward after `_uswds-theme` and before `_semantic` in the dependency chain.
- [x] T008 Rebuild `packages/styles/dist/styles.css` via `pnpm build` in `packages/styles` and verify the compiled output contains `.pathable-bg-primary`, `.pathable-padding-4`, `.pathable-display-flex`, `.pathable-font-family-body`, and at least 10 additional `.pathable-*` utility classes from the configuration map.
- [x] T009 Verify compiled `dist/styles.css` by running `rg '--pathable-(bg|padding|text|display)-' dist/styles.css` and `rg '--usa-(bg|padding|text|display)-' dist/styles.css` to confirm both namespaces are present for utility value tokens.
- [x] T010 Verify the compiled CSS gzip size increase is under 50 KB by comparing `dist/styles.css` before and after the change.

**Checkpoint**: Foundation ready — utility classes exist in compiled CSS, dual CSS custom properties are present, and the build passes cleanly. User story implementation can now begin.

---

## Phase 3: User Story 1 - Docs Site Uses PathAble Utility Classes Instead of Ad-Hoc CSS (Priority: P1) 🎯 MVP

**Goal**: The `apps/docs` site replaces ad-hoc CSS rules in `custom.css` and component `<style>` blocks with `.pathable-*` utility classes, eliminating at least 80% of the ad-hoc declarations and reducing total custom CSS line count by at least 50%.

**Independent Test**: The `SkipNav.astro` component can be refactored to use `.pathable-bg-surface`, `.pathable-text-base`, `.pathable-font-body`, and `.pathable-focus-ring` classes, eliminating its entire `<style>` block while rendering identically in the browser.

### Implementation

- [x] T011 [US1] Refactor `apps/docs/src/components/SkipNav.astro` by replacing all CSS in its `<style>` block with inline `.pathable-*` utility classes and removing the `<style>` block entirely. Verify the skip link still appears on focus and functions correctly.
- [x] T012 [P] [US1] Refactor `apps/docs/src/styles/custom.css` by replacing ad-hoc CSS property declarations with `.pathable-*` utility classes applied in the corresponding Astro components. Target at least the following sections: scroll-padding, site-title, sidebar, footer, blockquotes, tables, and code blocks. Measure before/after line count reduction.
- [x] T013 [US1] Refactor `apps/docs/src/components/PageFrame.astro`'s `<style>` block by replacing ad-hoc CSS with `.pathable-*` utility classes. Target: layout padding, background colors, border properties, and spacing declarations that have a matching utility class.
- [x] T014 [US1] Refactor `apps/docs/src/components/HorizontalNav.astro`'s `<style>` block to use `.pathable-*` utility classes where possible (background, border, spacing, font-family). Preserve complex styling (position, z-index, transition animations) that cannot be replaced by utility classes.
- [x] T015 [P] [US1] Refactor `apps/docs/src/components/DocFooter.astro`'s `<style>` block to use `.pathable-*` utility classes (padding, border, font-family, text color). Preserve layout-specific rules (flex wrap, min-width, grid) that have no utility equivalent.
- [ ] T016 [US1] Verify zero visual regressions by running the docs site (`pnpm dev` in `apps/docs`) and visually comparing each page against a before-screenshot or the previous rendering, confirming all refactored components render identically.

**Checkpoint**: Docs site utility class refactoring complete. All pages render identically. Custom CSS line count reduced by at least 50%.

---

## Phase 4: User Story 2 - Developer Adds PathAble Utility Classes to New Project (Priority: P2)

**Goal**: All 15+ utility modules are fully functional with responsive breakpoint variants and state hover/focus variants. A developer familiar with USWDS can use `.pathable-*` utilities in a standalone project.

**Independent Test**: An HTML page importing `dist/styles.css` and using only `.pathable-*` utility classes renders correctly with matching PathAble brand colors, spacing, and typography.

### Implementation

- [x] T017 [US2] Add responsive breakpoint variants to `packages/styles/src/_utilities.scss` for enabled breakpoints (`mobile-lg: 480px`, `tablet: 640px`, `desktop: 1024px`). Generate `.{breakpoint}\:pathable-{base}-{value}` classes wrapped in `@media (min-width: ...)`. Target: padding, margin, display, and text-align modules first.
- [x] T018 [US2] Add hover and focus state variants to `packages/styles/src/_utilities.scss` for modules that support them. Generate `.{state}\:pathable-{base}-{value}` classes with `&:{state}` nesting. Target: background-color, color, border-color, and text-decoration modules.
- [x] T019 [US2] Rebuild `packages/styles/dist/styles.css` via `pnpm build` and verify responsive variants exist (e.g., `.tablet\:pathable-padding-4`, `.desktop\:pathable-display-flex`) and state variants exist (e.g., `.hover\:pathable-bg-primary`, `.focus\:pathable-border-2`).
- [x] T020 [US2] Create a test HTML page at `specs/006-uswds-utility-wrappers/test-utilities.html` that imports `packages/styles/dist/styles.css` and demonstrates at least one usage of each utility module including responsive and state variants. The page must render correctly when opened in a browser.

**Checkpoint**: All 15+ utility modules have responsive and state variants. Test HTML page renders correctly.

---

## Phase 5: User Story 3 - CSS Custom Property Dual Naming for Utility Tokens (Priority: P3)

**Goal**: Every utility token value is available as both `--pathable-{name}` and `--usa-{name}` CSS custom properties, verified by both code inspection and live browser test. This is already partially implemented in T006 but needs documentation and verification.

**Independent Test**: A developer inspects the compiled CSS and finds each utility value has both `--pathable-` and `--usa-` entries in the `:root` block, both resolving to the same value.

### Implementation

- [x] T021 [US3] Audit `packages/styles/src/_utilities.scss` to confirm every value in every utility module configuration map is emitted under both `--pathable-*` and `--usa-*` namespaces in the `:root` block. Add any missing entries.
- [x] T022 [P] [US3] Update `packages/styles/AGENTS.md` to document the dual CSS custom property naming convention for utility tokens (`.pathable-*` classes and `--pathable-*` / `--usa-*` custom properties).
- [x] T023 [P] [US3] Update `packages/styles/BRAND_RULES.md` to document the utility class naming convention and provide examples of `.pathable-*` class usage.
- [x] T024 [US3] Verify dual naming by running `rg '--(pathable|usa)-(bg|padding|text|display)-' packages/styles/dist/styles.css` and confirming each token appears under both namespaces.

**Checkpoint**: All utility values are verifiably dual-named. Agent and brand documentation updated.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, documentation, and validation.

- [x] T025 Run `pnpm build` in `packages/styles` one final time and verify zero build errors.
- [x] T026 Run `pnpm dev` in `apps/docs` and verify the docs site loads and renders without errors.
- [x] T027 Verify the checklist at `specs/006-uswds-utility-wrappers/checklists/requirements.md` against the implementation.
- [x] T028 Create a final size report comparing `dist/styles.css` before and after utility classes using `wc -c` on the uncompressed and gzipped files.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion (utility classes must exist in compiled CSS)
- **User Story 2 (Phase 4)**: Depends on Foundational completion — extends it with responsive/state variants. Can proceed in parallel with US1.
- **User Story 3 (Phase 5)**: Depends on Foundational completion (T006 already implements dual naming). Can proceed in parallel with US1 and US2, but best done after US2 to capture all modules.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — Independent of US1 and US2

### Within Each Phase

- Tasks marked [P] can run in parallel (different files, no interdependencies)
- Within each phase, tasks are ordered by dependency — later tasks in the same phase may depend on earlier ones

### Parallel Opportunities

- T003 and T004: The core config map and additional modules can be written in parallel
- T011–T015 (US1): All docs refactoring tasks can run in parallel since each targets a different file
- T022 and T023 (US3): AGENTS.md and BRAND_RULES.md updates can run in parallel
- US1, US2, US3 can all proceed in parallel once Foundational is complete

---

## Parallel Example: User Story 1

```bash
# Launch all docs refactoring tasks together:
Task: "Refactor SkipNav.astro in apps/docs/src/components/SkipNav.astro"
Task: "Refactor custom.css in apps/docs/src/styles/custom.css"
Task: "Refactor PageFrame.astro in apps/docs/src/components/PageFrame.astro"
Task: "Refactor HorizontalNav.astro in apps/docs/src/components/HorizontalNav.astro"
Task: "Refactor DocFooter.astro in apps/docs/src/components/DocFooter.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify build works)
2. Complete Phase 2: Foundational (create _utilities.scss)
3. Complete Phase 3: User Story 1 (refactor docs site)
4. **STOP and VALIDATE**: Docs site renders identically with utility classes
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Utility classes exist in compiled CSS
2. Add User Story 1 → Docs site refactored → Deploy/Demo (MVP!)
3. Add User Story 2 → Responsive/state variants + test HTML page → Deploy/Demo
4. Add User Story 3 → Dual naming audit + documentation → Deploy/Demo
5. Polish → Final verification and size report

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (docs site refactoring — 5 files, all parallel)
   - Developer B: User Story 2 (responsive/state variants + test page)
   - Developer C: User Story 3 (dual naming audit + agent docs)
3. All stories complete independently — Polish phase validates everything together

---

## Notes

- Task count: 28 total (6 per major phase on average)
- [P] tasks: 1 (T004), 1 (T012), 2 (T015, T022, T023 across stories) — 5 parallel opportunities
- Tests: Manual visual verification at each checkpoint (no automated test framework required by spec)
- Each phase produces a independently verifiable checkpoint
- US1 is the MVP — everything else builds on top
- After T006, the dual naming is already implemented; US3 is primarily an audit and documentation story