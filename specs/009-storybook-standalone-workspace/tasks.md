# Tasks: Storybook Standalone Workspace

**Input**: Design documents from `/Users/jake/Documents/GitHub/styles/specs/009-storybook-standalone-workspace/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: No tests included — not requested in feature specification

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Workspace root**: `apps/storybook/`
- **Storybook config**: `apps/storybook/.storybook/`
- **CI workflows**: `.github/workflows/`
- **Root config**: `package.json`, `pnpm-workspace.yaml`, `.gitignore`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the new workspace directory structure and package manifest

- [x] T001 Create apps/storybook/ directory structure
- [x] T002 Create apps/storybook/package.json with name `@pathable/storybook`, private: true, type: "module", scripts (storybook, build-storybook, build), and devDependencies (storybook, @storybook/html-vite, @storybook/addon-docs, @fontsource/fredoka, @fontsource/nunito, @fontsource/montserrat, @fontsource/poppins) and dependencies (@pathable/styles: workspace:*)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Dependencies and configuration that MUST be complete before user stories can be verified

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Verify pnpm-workspace.yaml already matches `apps/storybook` via the `apps/*` glob (no change needed, but confirm)
- [x] T004 [P] Add `storybook-static` entry to root `.gitignore`
- [x] T005 Run `pnpm install` from root to resolve new workspace dependencies and update lockfile

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Developer Runs Storybook Documentation Locally (Priority: P1) 🎯 MVP

**Goal**: Create the Storybook configuration files in the new workspace and add root-level docs scripts so developers can run `pnpm docs` to browse component documentation

**Independent Test**: Run `pnpm docs` from the repo root and verify the Storybook dev server starts on `localhost:6006` with all 40+ stories rendering correctly

### Implementation for User Story 1

- [x] T006 [P] [US1] Create apps/storybook/.storybook/main.js with framework (html-vite), stories glob referencing `../../packages/styles/src/stories/**/*.stories.js` (from apps/storybook/), addons (addon-docs), docs.autodocs: true, and viteFinal for production base path `/styles/`
- [x] T007 [P] [US1] Create apps/storybook/.storybook/preview.js importing styles from `@pathable/styles/dist/styles.css` with control matchers
- [x] T008 [P] [US1] Create apps/storybook/.storybook/manager.js with Pathable branded theme (PathAble Blue, Intelligent Jade, Nunito font) using `storybook/manager-api` and `storybook/theming` (consolidated v10 API)
- [x] T009 [P] [US1] Create apps/storybook/.storybook/manager-head.html loading Google Fonts (Fredoka, Nunito)
- [x] T010 [US1] Add `docs` and `build:docs` scripts to root `package.json` filtering to @pathable/storybook
- [x] T011 [US1] Verify `pnpm build:docs` produces a static site with 126 stories in `apps/storybook/storybook-static/`

**Checkpoint**: At this point, User Story 1 should be fully functional — `pnpm build:docs` works locally

---

## Phase 4: User Story 2 - Storybook Deploys to GitHub Pages on Main Push (Priority: P1)

**Goal**: Update CI/CD workflows to build and deploy the new Storybook workspace to GitHub Pages, replacing the old Astro/Starlight docs site

**Independent Test**: Push a change to main and verify the GitHub Pages site at `https://pathableai-org.github.io/styles` updates with the Storybook output

### Implementation for User Story 2

- [x] T012 [US2] Update `.github/workflows/docs-deploy.yml` to build `@pathable/storybook` instead of `@pathable/docs`, upload `apps/storybook/storybook-static` instead of `apps/docs/dist`, and add a step to create `.nojekyll` in the static output
- [x] T013 [US2] Update `.github/workflows/docs-ci.yml` to build `@pathable/storybook` instead of `@pathable/docs` for PR verification
- [x] T014 [US2] Verify `pnpm build:docs` produces a valid static site in `apps/storybook/storybook-static/`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work — local dev and CI deploy

---

## Phase 5: User Story 3 - Future-Ready: Multi-Framework Documentation (Priority: P3)

**Goal**: Clean up old storybook dependencies from `packages/styles` and ensure the workspace structure supports future React/Vue story additions without reorganization

**Independent Test**: Verify the workspace has capacity for React or Vue framework presets without restructuring, and no remaining Storybook traces in `packages/styles`

### Implementation for User Story 3

- [x] T015 [P] [US3] Remove `storybook` and `build-storybook` scripts from `packages/styles/package.json`
- [x] T016 [P] [US3] Remove storybook devDependencies (storybook, @storybook/html-vite, @storybook/addon-docs, @storybook/manager-api, @storybook/theming) from `packages/styles/package.json`
- [x] T017 [US3] Remove old `.storybook/` directory from `packages/styles/` and run `pnpm install` to update lockfile

**Checkpoint**: All user stories complete — workspace is clean and future-ready

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup

- [x] T018 Remove `build` script from `apps/docs/package.json` so `pnpm -r build` doesn't attempt to rebuild legacy docs
- [x] T019 Run `pnpm build`, `pnpm lint:styles`, and `pnpm format` to verify no regressions — all pass
- [x] T020 Execute quickstart.md validation checklist — all items verified

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P1 → P3)
  - US1 must complete before US2 (local verification before deploy)
  - US3 can be done in parallel with US2 or after
- **Polish (Phase 6)**: Depends on all user stories being complete

### Within Each User Story

- Config files marked [P] can be created in parallel
- Story-specific setup before verification
- Story complete before moving to next priority

### Parallel Opportunities

- All Phase 2 tasks marked [P] can run in parallel
- T006-T009 (Storybook config files) can all be created in parallel
- T012 and T013 (CI workflow updates) can run in parallel
- T015 and T016 (package.json cleanup in packages/styles) can run in parallel
- US3 can be worked on in parallel with US2 by different team members