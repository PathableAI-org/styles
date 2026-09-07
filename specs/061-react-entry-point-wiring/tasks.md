# Tasks: React Entry Point Wiring

**Input**: Design documents from `/specs/061-react-entry-point-wiring/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: This feature does not require new test files — the spec and plan name only existing gates (vitest, Storybook contract gate, `publint`, `attw`, packed-consumer check) as validation. Tasks reference those existing gates as verification steps rather than new test-writing tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup](#phase-1-setup)
- [Phase 2: Foundational](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 (P1)](#phase-3-user-story-1---themeprovider-driven-consumer-priority-p1--mvp)
- [Phase 4: User Story 2 (P1)](#phase-4-user-story-2---default-consumer-path-priority-p1)
- [Phase 5: User Story 3 (P2)](#phase-5-user-story-3---theme-subpath-consumer-priority-p2)
- [Phase 6: User Story 4 (P2)](#phase-6-user-story-4---documentation--breaking-change-priority-p2)
- [Phase 7: User Story 5 (P3)](#phase-7-user-story-5---published-package-validation-priority-p3)
- [Phase 8: Polish & Cross-Cutting Concerns](#phase-8-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Examples](#parallel-examples)
- [Implementation Strategy](#implementation-strategy)
- [Notes](#notes)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Monorepo package `@pathableai/react` → `packages/react/`
- Monorepo package `@pathableai/styles` → `packages/styles/`
- Changesets → `.changeset/`
- Feature spec artifacts → `specs/061-react-entry-point-wiring/`

---

## Phase 1: Setup

**Purpose**: Confirm the starting state and ensure dependencies are available before any code change.

- [X] T001 Verify current entry-point state: read `packages/react/src/index.ts` and confirm it contains the single side-effect import `import '@pathableai/styles'` plus the comment "Retain the styles package's public CSS entry as a consumer-visible side effect"
- [X] T002 [P] Verify current build config: read `packages/react/vite.config.ts` and confirm `rollupOptions.external` currently lists the exact string `'@pathableai/styles'` (not a regex)
- [X] T003 [P] Install workspace dependencies with `pnpm install` from the repository root

**Checkpoint**: Starting state is understood and dependencies are installed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Confirm the `@pathableai/styles` structural subpaths this feature depends on already exist and are buildable. This MUST be complete before any react-package change is validated.

**⚠️ CRITICAL**: The react entry-point change consumes `@pathableai/styles/components` and `@pathableai/styles/utilities`; without these subpaths built, the react build and all verifications fail.

- [X] T004 Verify the styles subpath contract: read `packages/styles/package.json` and confirm the `exports` map contains `"./components": "./dist/components.css"`, `"./utilities": "./dist/utilities.css"`, `".": "./dist/styles.css"`, and `"./theme": "./dist/theme-default.css"` (do NOT modify)
- [X] T005 Build the styles package with `pnpm --filter @pathableai/styles build` and confirm it emits `dist/components.css` and `dist/utilities.css`

**Checkpoint**: Foundation ready — the structural subpaths exist and are compiled; react-package work can proceed.

---

## Phase 3: User Story 1 - ThemeProvider-driven consumer (Priority: P1) 🎯 MVP

**Goal**: `@pathableai/react` imports only structural layers so a `ThemeProvider` consumer renders with only provider-supplied tokens and no cascade-order conflict.

**Independent Test**: Render an app wrapped in `ThemeProvider` with custom tokens, importing no default theme stylesheet, and confirm rendered custom properties come exclusively from the provider. Validated by the existing vitest `ThemeProvider` suite plus a manual `dist/index.js` inspection.

### Implementation for User Story 1

- [X] T006 [P] [US1] Edit `packages/react/src/index.ts` to replace `import '@pathableai/styles'` with `import '@pathableai/styles/components'` and `import '@pathableai/styles/utilities'`, and update the comment to state the package now imports only structural layers (not the default theme token layer)
- [X] T007 [P] [US1] Edit `packages/react/vite.config.ts` to replace the exact external string `'@pathableai/styles'` with the regex `/^@pathableai\/styles(\/|$)/` in `rollupOptions.external`
- [X] T008 [US1] Build the react package with `pnpm --filter @pathableai/react build` (depends on T006, T007)
- [X] T009 [US1] Inspect `packages/react/dist/index.js` and confirm it begins with `import "@pathableai/styles/components";` and `import "@pathableai/styles/utilities";`, contains no `import "@pathableai/styles";` (root), and emits no bundled `.css` asset
- [X] T010 [US1] Run `pnpm --filter @pathableai/react test:unit` and confirm the existing `ThemeProvider` unit tests pass (provider-only token rendering, no interleaved default tokens)

**Checkpoint**: The react entry point is structurally independent of the default theme token layer; provider-driven rendering is verified.

---

## Phase 4: User Story 2 - Default consumer path (Priority: P1)

**Goal**: `@pathableai/react` + `import '@pathableai/styles'` renders identically to today (full default token layer).

**Independent Test**: Compare before/after rendered output for the default-path consumer; the existing React Storybook stories (which load the full styles path at the application boundary) are the regression fixture.

### Implementation for User Story 2

- [ ] T011 [US2] Run the React Storybook contract gate `pnpm test:storybook-react` and confirm the default-path stories render identically (no visual or structural regressions)

**Checkpoint**: The mainstream default consumer path is confirmed backward-compatible.

---

## Phase 5: User Story 3 - Theme-subpath consumer (Priority: P2)

**Goal**: `@pathableai/react` + `import '@pathableai/styles/theme'` continues to render default tokens.

**Independent Test**: Confirm the theme-subpath consumer path renders default tokens identically to today.

### Implementation for User Story 3

- [ ] T012 [US3] Verify the theme-subpath consumer path renders default tokens: confirm `packages/styles/package.json` still maps `"./theme"` to `dist/theme-default.css` and run `pnpm --filter @pathable/storybook-react storybook` to confirm no regression in theme-subpath rendering (depends on T008)

**Checkpoint**: The theme-subpath consumer path is confirmed intact (FR-004, FR-007).

---

## Phase 6: User Story 4 - Documentation & breaking change (Priority: P2)

**Goal**: Documentation states the exact stylesheet import for each supported path and explicitly warns about the breaking change.

**Independent Test**: Reading `packages/react/README.md` and the changeset confirms the required import for default, theme-subpath, and provider-driven paths, plus the explicit breaking-change note.

### Implementation for User Story 4

- [X] T013 [P] [US4] Update `packages/react/README.md` to document the three consumer paths (provider-driven: react import only; default: react + `import '@pathableai/styles'`; theme-subpath: react + `import '@pathableai/styles/theme'`) and add an explicit breaking-change note for consumers who previously relied on the react package's implicit default-theme side-effect import
- [X] T014 [P] [US4] Create a changeset file `.changeset/react-entry-point-wiring.md` recording the breaking change for `@pathableai/react` (frontmatter `'@pathableai/react': patch`, summary describing the structural-subpath entry-point change and the migration instruction to add `import '@pathableai/styles'` or `@pathableai/styles/theme` to retain default tokens)

**Checkpoint**: All supported consumer paths are documented and the breaking change is explicitly recorded.

---

## Phase 7: User Story 5 - Published package validation (Priority: P3)

**Goal**: The published react package resolves the new structural subpaths with zero package-content/build failures.

**Independent Test**: `publint`, `attw`, the styles pack dry-run, and the packed Next.js consumer check all pass.

### Implementation for User Story 5

- [X] T015 [P] [US5] Run `pnpm --filter @pathableai/react check:package` (`publint --pack false`) and confirm zero failures for the react package exports/entry points
- [X] T016 [P] [US5] Run `pnpm --filter @pathableai/react check:types` (`attw --pack --profile esm-only`) and confirm zero type-resolution failures
- [X] T017 [P] [US5] Run `pnpm --filter @pathableai/styles pack --dry-run` and confirm the styles tarball still contains `dist/components.css` and `dist/utilities.css` with the `exports` map intact
- [X] T018 [US5] Run `pnpm test:next-consumer` and confirm the generated Next.js consumer installs the packed packages and renders (transitive-installability evidence)

**Checkpoint**: The published package is validated as publishable with the new structural subpath imports.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Full quality gates and cross-cutting verification that span all stories.

- [X] T019 [P] Run `pnpm --filter @pathableai/react lint` (eslint, `--max-warnings=0`) and `pnpm --filter @pathableai/react typecheck` and confirm both pass
- [X] T020 [P] Run `pnpm lint:tokens` and confirm the token vocabulary is untouched (FR-008)
- [X] T021 [P] Run `pnpm test:storybook-react-server` and confirm the server-compatibility audit reports no new findings
- [ ] T022 Run the `quickstart.md` validation path end-to-end (`specs/061-react-entry-point-wiring/quickstart.md`) and confirm all sections exit `0`

**Checkpoint**: All quality gates pass; the feature is complete.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all react-package changes.
- **User Stories (Phase 3+)**: All depend on Foundational (Phase 2) completion.
  - US1 is the core code change and must land first (its build produces the artifact the other stories verify).
  - US2 and US3 (backward-compat verification) depend on the US1 build (T008) and can run in parallel with each other.
  - US4 (docs) is independent of the runtime change and can proceed once US1's exact import strings are decided (after T006).
  - US5 (package validation) depends on the US1 build (T008).
- **Polish (Phase 8)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational. No dependencies on other stories. Produces the changed `dist/index.js` that US2/US3/US5 verify.
- **User Story 2 (P1)**: Depends on US1 build (T008). Independently testable via `test:storybook-react`.
- **User Story 3 (P2)**: Depends on US1 build (T008). Independently testable via Storybook.
- **User Story 4 (P2)**: Depends only on US1 import decision (T006). Independently testable by reading docs.
- **User Story 5 (P3)**: Depends on US1 build (T008). Independently testable via package checks.

### Within Each User Story

- US1: entry-point edit and build-config edit are independent (parallel) → build → inspect output → unit tests.
- Other stories: single verification/implementation steps in dependency order.

### Parallel Opportunities

- Setup: T002 and T003 are independent of T001 and each other.
- US1: T006 (`src/index.ts`) and T007 (`vite.config.ts`) touch different files and run in parallel.
- US2 vs US3: T011 and T012 run in parallel after the build.
- US4: T013 (`README.md`) and T014 (`.changeset/`) touch different files and run in parallel.
- US5: T015, T016, T017 are independent package checks and run in parallel; T018 follows.
- Polish: T019, T020, T021 are independent gates and run in parallel.

---

## Parallel Examples

### User Story 1

```bash
# Independent edits (different files):
Task: "Edit packages/react/src/index.ts (T006)"
Task: "Edit packages/react/vite.config.ts (T007)"

# After build (T008) completes:
Task: "Inspect packages/react/dist/index.js (T009)"
Task: "Run @pathableai/react test:unit (T010)"   # can run once build is done
```

### Backward-compat verification (after the US1 build)

```bash
Task: "Run pnpm test:storybook-react (T011 / US2)"
Task: "Verify theme-subpath path via Storybook (T012 / US3)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (build the styles subpaths).
3. Complete Phase 3: User Story 1 — the entry-point edit + build-config externalization + build + unit-test verification.
4. **STOP and VALIDATE**: Inspect `packages/react/dist/index.js` for the two structural imports and confirm `test:unit` passes.

### Incremental Delivery

1. Setup + Foundational → structural subpaths confirmed.
2. Add US1 → build + unit tests → MVP delivered (provider-driven theming works).
3. Add US2 + US3 → backward-compat verified → default and theme paths confirmed.
4. Add US4 → documentation + changeset → migration path published.
5. Add US5 → package validation → publishability confirmed.
6. Polish → full gates green.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done, one developer owns the core US1 edit (T006/T007), while another can start US4 documentation (T013/T014) once the exact import strings are known.
3. After the US1 build (T008), US2 (T011), US3 (T012), and US5 (T015–T018) can be picked up in parallel.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps each task to its user story for traceability.
- No new test files are required; existing gates (vitest, Storybook contract, `publint`, `attw`, packed-consumer) are the validation surface.
- The `.changeset` bump level (`patch`) reflects the plan's "patch/minor changeset recording the breaking change"; the implementer should confirm the bump level against the repo's release policy before merging (see `.changeset/README.md`).
- Commit after each task or logical group; the repo's `after_tasks` auto-commit hook runs after this file is generated.
- Avoid: modifying `packages/styles` source, disabling lint/type checks, or adding new subpaths to the styles package.
