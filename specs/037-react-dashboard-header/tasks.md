# Tasks: React Dashboard Header Wrapper

**Input**: Design documents from `specs/037-react-dashboard-header/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/props.md, quickstart.md

**Tests**: The feature specification requires Storybook interaction tests (FR-013) and rendered accessibility checks (FR-016) as part of the component contract. These are embedded `play` tests inside the story file — there is no separate unit-test suite requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1](#phase-3-user-story-1---render-a-dashboard-page-header-priority-p1--mvp)
- [Phase 4: User Story 2](#phase-4-user-story-2---render-breadcrumb-and-status-context-priority-p2)
- [Phase 5: User Story 3](#phase-5-user-story-3---render-variant-and-responsive-states-priority-p3)
- [Phase 6: Polish & Cross-Cutting Concerns](#phase-6-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 1](#parallel-example-user-story-1)
- [Implementation Strategy](#implementation-strategy)
- [Notes](#notes)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a React wrapper feature in a pnpm workspace. All source changes live under `packages/react/`:

- Component: `packages/react/src/components/<Name>/<Name>.tsx`
- Story: `packages/react/src/stories/<section>/<Name>.stories.tsx`
- Barrel export: `packages/react/src/index.ts`

No `packages/styles` source changes — the owning contract already exists.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the workspace is ready; no new dependencies or project scaffolding needed.

- [X] T001 Verify repository dependencies are installed and `packages/styles` is built by running `pnpm install` and `pnpm build` from the repo root; confirm `packages/react` imports resolve

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core component and export that MUST exist before any user story's stories can render.

**⚠️ CRITICAL**: No user story story-work can begin until this phase is complete.

- [X] T002 Verify the owning styles contract exists at `packages/styles/src/pathable-component-wrappers/pathable-dashboard-header.scss` and is compiled into `@pathableai/styles` dist; confirm no new SCSS is required
- [X] T003 Verify `packages/react/src/index.ts` imports `@pathableai/styles` as a side-effect so consumers receive transitive CSS (Principle V)
- [X] T004 Create the `DashboardHeader` component in `packages/react/src/components/DashboardHeader/DashboardHeader.tsx` implementing the props contract from `contracts/props.md` (required `title` rendered as `h1`; optional `breadcrumb`, `context`, `description`, `actions`; `compact`/`stacked` boolean modifiers mapping to `pathable-dashboard-header--compact`/`--stacked`; `className` merge and `...rest` spread). Ensure empty optional regions are omitted
- [X] T005 Add `export { DashboardHeader } from './components/DashboardHeader/DashboardHeader.js'` and `export type { DashboardHeaderProps } from './components/DashboardHeader/DashboardHeader.js'` to `packages/react/src/index.ts`

**Checkpoint**: Component exists and is exported; all stories can now render against it.

---

## Phase 3: User Story 1 - Render a dashboard page header (Priority: P1) 🎯 MVP

**Goal**: A developer can render a dashboard page header with a title, description, and action controls via `DashboardHeader`.

**Independent Test**: Render `DashboardHeader` with `title`, `description`, and `actions`; confirm the page exposes an `h1` title, description text, and operable action buttons in the correct regions.

### Implementation for User Story 1

- [X] T006 [US1] Create the story file `packages/react/src/stories/dashboard/DashboardHeader.stories.tsx` with `satisfies Meta<typeof DashboardHeader>`, `title: 'Dashboard/Dashboard Header'`, `tags: ['autodocs']`, a semantic component description (when to use / when not to use), argTypes with controls, and a `Playground` story
- [X] T007 [US1] Add a `Default` story in `packages/react/src/stories/dashboard/DashboardHeader.stories.tsx` rendering a full header (breadcrumb + title + context + description + two `Button` actions) with deterministic content
- [X] T008 [US1] Add a `WithoutActions` story rendering title + context + description with no `actions` prop
- [X] T009 [US1] Add a `ManyActions` story rendering four or more action buttons to exercise wrapping
- [X] T010 [US1] Add a keyboard-interaction `play` test story (e.g., `ActionKeyboardActivation`) using `getByRole` and `@storybook/test` that tabs to the first action button and verifies Enter/Space activation fires the `fn()` spy

**Checkpoint**: User Story 1 is functional and independently verifiable — title, description, and actions render with keyboard-operable controls.

---

## Phase 4: User Story 2 - Render breadcrumb and status context (Priority: P2)

**Goal**: A developer can show breadcrumb and context/status content above and beside the title.

**Independent Test**: Render `DashboardHeader` with `breadcrumb` and `context`; confirm both render in their intended positions.

### Implementation for User Story 2

- [X] T011 [US2] Add a `BreadcrumbAndContext` story in `packages/react/src/stories/dashboard/DashboardHeader.stories.tsx` rendering `breadcrumb` (links/spans) and `context` content, verifying `pathable-dashboard-header__breadcrumb` and `__context` elements appear in the DOM
- [X] T012 [US2] Add a `play` test in `packages/react/src/stories/dashboard/DashboardHeader.stories.tsx` (or extend an existing story) asserting the breadcrumb links are reachable by keyboard and the context text is exposed to the accessibility tree

**Checkpoint**: User Stories 1 AND 2 both work; breadcrumb and context regions render correctly.

---

## Phase 5: User Story 3 - Render variant and responsive states (Priority: P3)

**Goal**: A developer can use compact/stacked variants and the header holds up under long titles and narrow viewports.

**Independent Test**: Render `compact`, `stacked`, a long title, and a mobile viewport; confirm each renders without overflow or lost content.

### Implementation for User Story 3

- [X] T013 [US3] Add a `Compact` story in `packages/react/src/stories/dashboard/DashboardHeader.stories.tsx` with `compact` prop and a `play` test asserting `pathable-dashboard-header--compact` is applied
- [X] T014 [US3] Add a `Stacked` story in `packages/react/src/stories/dashboard/DashboardHeader.stories.tsx` with `stacked` prop and a `play` test asserting `pathable-dashboard-header--stacked` is applied
- [X] T015 [US3] Add a `LongTitle` story in `packages/react/src/stories/dashboard/DashboardHeader.stories.tsx` with a long unbroken title to exercise wrapping
- [X] T016 [US3] Add a `Mobile` story in `packages/react/src/stories/dashboard/DashboardHeader.stories.tsx` using the `mobile1` viewport parameter, confirming actions stack below the title without horizontal overflow

**Checkpoint**: All user stories functional; variants and responsive behavior covered.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation gates and package/consumer verification.

- [X] T017 Run `pnpm lint` in `packages/react` (`eslint src --max-warnings=0`); fix all findings at source without disabling rules, adding ignore entries, or reducing severity
- [X] T018 Run `pnpm typecheck` in `packages/react`; confirm no type errors
- [X] T019 Run `pnpm build` in `packages/react`; confirm `vite build` and `tsc -p tsconfig.build.json` succeed and declarations are generated
- [X] T020 Run `pnpm check:package` (`publint`) and `pnpm check:types` (`attw`) in `packages/react`; then `pnpm pack --dry-run` to confirm the published package includes transitive `@pathableai/styles` CSS
- [X] T021 Run `pnpm test:storybook-react`; confirm all story tests pass and the a11y addon reports no violations on stable stories (Playground exempt)
- [X] T022 Run the validation scenarios in `specs/037-react-dashboard-header/quickstart.md` and confirm each expected outcome, especially VS-04 (new `Dashboard` Storybook section)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup; T004 → T005 (barrel depends on component); BLOCKS all user stories
- **User Stories (Phases 3–5)**: All depend on Foundational (T004/T005)
- **Polish (Phase 6)**: Depends on all desired user stories

### User Story Dependencies

- **User Story 1 (P1)**: Depends on T004/T005 (component + export). No dependencies on US2/US3.
- **User Story 2 (P2)**: Depends on T004/T005 and the story file from T006. Regions already supported by the component — story coverage only.
- **User Story 3 (P3)**: Depends on T004/T005 and the story file from T006. Modifiers already supported by the component — story coverage only.

### Within Each User Story

- Story file meta (T006) before named story exports
- Fixed named stories before interaction `play` tests (tests assert on rendered stories)
- Story complete before moving to next priority

### Parallel Opportunities

- Setup/foundational verification tasks (T001–T003) touch different files and can run in parallel
- The component (T004) and barrel (T005) are sequential (T005 depends on T004)
- Once T004–T006 are complete, the named-story tasks within a phase are quick sequential edits to the same story file; the three user-story phases themselves can be split across developers (they only add named exports to the shared story file — coordinate to avoid conflicts)

---

## Parallel Example: User Story 1

```bash
# After Foundational (component + export) and story meta exist, the named stories
# are additive edits to one file — implement sequentially to avoid conflicts:
Task: "Add a Default story in .../DashboardHeader.stories.tsx"
Task: "Add a WithoutActions story in .../DashboardHeader.stories.tsx"
Task: "Add a ManyActions story in .../DashboardHeader.stories.tsx"
Task: "Add a keyboard-interaction play test story in .../DashboardHeader.stories.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002–T005) — CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T006–T010)
4. **STOP and VALIDATE**: render `DashboardHeader` with title/description/actions and verify keyboard activation
5. Optionally run Phase 6 gates (T017–T021) to confirm a shippable MVP

### Incremental Delivery

1. Setup + Foundational → component renders and is exported
2. Add US1 → title/description/actions + keyboard test → MVP
3. Add US2 → breadcrumb/context coverage
4. Add US3 → compact/stacked/long-title/mobile coverage
5. Polish → lint/typecheck/build/pack/a11y/quickstart

### Parallel Team Strategy

With multiple developers:

1. Together: Setup + Foundational
2. Once Foundational is done, one developer owns the story file end-to-end (all story exports live in a single file, so parallel edits risk conflicts); if desired, split as: Developer A authors story meta + US1, Developer B reviews US2/US3 story exports.

---

## Notes

- This feature adds no `packages/styles` change — the owning contract already exists (spec Assumptions, research D1/D5)
- No wrapper-only styling: every rendered class must map to a documented `pathable-dashboard-header*` BEM class (constitution IV)
- Story `title` is `Dashboard/Dashboard Header` to create a new top-level `Dashboard` section mirroring the styles Storybook (spec FR-010, research D7)
- No `date`/random/network content in stories (spec FR-012)
- Use accessible queries (`getByRole`, `getByText`) in interaction tests; avoid `getByTestId`/CSS selectors
- Do not disable, weaken, skip, or silence lint checks; fix findings or escalate (constitution Lint Enforcement)
- Playground/Controls stories are exploratory only — fixed named stories are the regression contract
