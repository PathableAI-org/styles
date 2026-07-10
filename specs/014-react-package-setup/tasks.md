# Tasks: React Package Workspace Setup

**Input**: Design documents from `specs/014-react-package-setup/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are requested in this feature specification — BDD acceptance scenarios are defined in quickstart.md and formalized in contracts/.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

All paths are relative to the repository root unless otherwise noted.

```
packages/react/src/components/Button/Button.jsx
packages/react/src/index.js
packages/react/package.json
packages/react/README.md
apps/storybook-react/.storybook/main.js
apps/storybook-react/.storybook/preview.js
apps/storybook-react/package.json
apps/storybook/.storybook/main.js      # modified (add refs config)
specs/014-react-package-setup/quickstart.md  # used for validation
```

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the directory structures for both new workspace packages

- [x] T001 Create `packages/react/` directory structure with `src/components/Button/`, `src/stories/`, `src/stories/components/Basic/` subdirectories
- [x] T002 [P] Create `apps/storybook-react/` directory structure with `.storybook/` subdirectory

**Checkpoint**: Both workspace directories exist and are ready for configuration files.

---

## Phase 2: US-1 + US-2 — Package Setup and Button Component (Priority: P1) 🎯 MVP

**Goal**: Create the `@pathable/react` package with a Button component that bundles CSS from `@pathable/styles`. Consumers can install `@pathable/react` and get styled components without separately installing `@pathable/styles`.

**Independent Test**: A developer can add `@pathable/react` as a dependency, import `{ Button }`, render `<Button>Click Me</Button>`, and verify the rendered button has the `pathable-button` CSS class with the children text.

### Implementation for US-1 + US-2

- [x] T003 [US1] Create `packages/react/package.json` with name `@pathable/react`, `@pathable/styles` as a dependency, `react` and `react-dom` as peer dependencies, and a `build` script
- [x] T004 [P] [US1] Configure the React package build system — add a `vite.config.js` (or use esbuild config) at `packages/react/vite.config.js` for library mode JSX compilation
- [x] T005 [P] [US2] Implement the Button component at `packages/react/src/components/Button/Button.jsx` — renders a native `<button>` with the `pathable-button` CSS class, accepts only `children` prop
- [x] T006 [US2] Create the package entry point at `packages/react/src/index.js` that imports `@pathable/styles/dist/styles.css` and re-exports `Button` from `./components/Button/Button`
- [x] T007 [US1] Build the `@pathable/react` package — run `pnpm --filter @pathable/react build` and verify the `dist/` output includes the compiled JS and the imported CSS
- [x] T008 [US1] Verify the dependency chain — confirm `@pathable/styles` appears in `packages/react/node_modules` after install and is a runtime (not dev) dependency

**Checkpoint**: `@pathable/react` builds successfully. A consumer project can install it and render a Button with `pathable-button` class.

---

## Phase 3: US-4 — Standalone React Storybook (Priority: P2)

**Goal**: Developers can run a standalone Storybook for the React package on port 6007 to develop React components in isolation.

**Independent Test**: Run `pnpm --filter @pathable/storybook-react storybook`, navigate to `http://localhost:6007`, find the Button story, and verify it renders with the `pathable-button` CSS class.

### Implementation for US-4

- [x] T009 [US4] Create `apps/storybook-react/package.json` with name `@pathable/storybook-react`, `@storybook/react-vite` as a dev dependency, `@pathable/react` as a dependency, and `storybook` script
- [x] T010 [US4] Create `apps/storybook-react/.storybook/main.js` with `@storybook/react-vite` framework and stories glob pointing to `../../../packages/react/src/stories/**/*.stories.jsx`
- [x] T011 [P] [US4] Create `apps/storybook-react/.storybook/preview.js` that imports the compiled CSS from `@pathable/styles/dist/styles.css` (or from `@pathable/react`'s entry point) so stories render with styles
- [x] T012 [US4] Create the Button story at `packages/react/src/stories/components/Basic/Button.stories.jsx` with a single default story that renders `<Button>Click Me</Button>`
- [x] T013 [US4] Start the React Storybook and verify it runs on port 6007 with the Button story rendering correctly

**Checkpoint**: The standalone React Storybook is accessible on port 6007 and displays the Button story with PathAble styling.

---

## Phase 4: US-3 — Storybook Composition (Priority: P2)

**Goal**: The main Storybook on port 6006 includes React Button stories from the React Storybook via Storybook composition, visible in a unified sidebar.

**Independent Test**: Start both Storybooks, open the main Storybook on port 6006, verify a "React" section appears in the sidebar with the Button story. Then stop the React Storybook and verify the section shows as unavailable without crashing.

### Implementation for US-3

- [x] T014 [US3] Update `apps/storybook/.storybook/main.js` to add a `refs` configuration pointing to `http://localhost:6007` for the React Storybook
- [x] T015 [US3] Start both Storybooks and verify the main Storybook sidebar includes a "React" section with the Button story
- [x] T016 [US3] With the React Storybook stopped, verify the main Storybook sidebar shows "React" as unavailable and the main Storybook does not crash or produce console errors

**Checkpoint**: Storybook composition works — React stories appear in the main Storybook, with graceful degradation when the composed instance is unavailable.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final validation

- [x] T017 [P] Create `packages/react/README.md` with installation and usage instructions for consuming applications
- [x] T018 Run all validation paths from `specs/014-react-package-setup/quickstart.md` to verify the feature end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **US-1 + US-2 (Phase 2)**: Depends on Setup completion — this is the MVP
- **US-4 (Phase 3)**: Depends on US-1 + US-2 (needs `@pathable/react` package built)
- **US-3 (Phase 4)**: Depends on US-4 (needs React Storybook running for composition)
- **Polish (Phase 5)**: Depends on all phases

### User Story Dependencies

- **US-1 + US-2 (P1)**: Can start after Phase 1 — no dependencies on other stories
- **US-4 (P2)**: Depends on US-1 + US-2 being complete (needs the built package)
- **US-3 (P2)**: Depends on US-4 being complete (needs the React Storybook URL for composition ref)

### Within Each Phase

- Directory structure before config files
- Package config before component implementation
- Component before story
- Storybook before composition

### Parallel Opportunities

- T001 and T002 (Phase 1) can run in parallel
- T004 and T005 (Phase 2) can run in parallel
- T011 (Phase 3) can run in parallel with T009/T010 (same phase, different files)
- T017 (Phase 5) can run in parallel with T018

---

## Parallel Example: Phase 2 (US-1 + US-2)

```bash
# Launch package.json and component creation together:
Task: "Create packages/react/package.json" (T003)
Task: "Create vite.config.js" (T004)
Task: "Implement Button component" (T005)

# After those complete, create entry point and build:
Task: "Create index.js entry point" (T006)
Task: "Build the package" (T007)
Task: "Verify dependency chain" (T008)
```

---

## Implementation Strategy

### MVP First (Phase 1 + Phase 2)

1. Complete Phase 1: Setup (create directories)
2. Complete Phase 2: US-1 + US-2 (package + Button component)
3. **STOP and VALIDATE**: Test the package builds and a consumer can use it
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup → Foundation ready
2. Add US-1 + US-2 → Test independently → Deploy/Demo (MVP!)
3. Add US-4 (standalone React Storybook) → Test independently → Deploy/Demo
4. Add US-3 (composition) → Test independently → Deploy/Demo
5. Polish → Final validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup together
2. Once Setup is done:
   - Developer A: US-1 + US-2 (package + Button)
   - Developer B: waits for US-1 + US-2, then US-4 (React Storybook)
   - Developer C: waits for US-4, then US-3 (composition)
3. Stories complete and integrate independently
