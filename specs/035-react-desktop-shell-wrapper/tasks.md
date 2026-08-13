# Tasks: React Desktop Shell Wrapper

**Input**: Design documents from `/specs/035-react-desktop-shell-wrapper/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/props.md, quickstart.md

**Tests**: Interaction tests for keyboard accessibility are explicitly requested (spec FR-015, SC-005). Unit tests are not required.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 — Desktop Shell with Sidebar (P1) 🎯 MVP](#phase-3-user-story-1--desktop-shell-with-sidebar-p1)
- [Phase 4: User Story 2 — Mobile Shell (P1)](#phase-4-user-story-2--mobile-shell-p1)
- [Phase 5: User Story 3 — Accessible Shell (P2)](#phase-5-user-story-3--accessible-shell-p2)
- [Phase 6: User Story 4 — Wrapped Nav Items (P3)](#phase-6-user-story-4--wrapped-nav-items-p3)
- [Phase 7: User Story 5 — Transitive Styles (P3)](#phase-7-user-story-5--transitive-styles-p3)
- [Phase 8: Polish & Cross-Cutting](#phase-8-polish--cross-cutting)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Implementation Strategy](#implementation-strategy)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify the existing React package is ready for the new component

- [x] T001 Verify packages/styles is built: `pnpm build` in `packages/styles/`
- [x] T002 [P] Create component directory at `packages/react/src/components/AppShell/`
- [x] T003 [P] Create stories directory at `packages/react/src/stories/components/AppShell/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core component scaffolding that all user stories build upon

⚠️ **CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Define TypeScript types (`AppShellProps`, `ContentWidth`, `BottomNavItem`) in `packages/react/src/components/AppShell/AppShell.tsx` per contracts/props.md
- [x] T005 Scaffold the `AppShell` function component skeleton with props destructuring and root `<div className="pathable-app-shell">` wrapper in `packages/react/src/components/AppShell/AppShell.tsx`

**Checkpoint**: Component scaffold ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Desktop Shell with Sidebar (P1) 🎯 MVP

**Goal**: Render a Pathable application shell with a persistent sidebar containing brand, primary navigation, and account context.

**Independent Test**: Render `<AppShell sidebarBrand={...} sidebarNav={...} sidebarAccount={...}>`. Verify DOM contains `<aside class="pathable-app-shell__sidebar">` with brand, nav, and account regions in correct order.

### Implementation for User Story 1

- [x] T006 [US1] Implement sidebar `<aside>` with brand, nav, and account regions in `packages/react/src/components/AppShell/AppShell.tsx`
- [x] T007 [US1] Implement `sidebarFixed` prop: add `pathable-app-shell__sidebar--fixed` modifier when true in `packages/react/src/components/AppShell/AppShell.tsx`
- [x] T008 [US1] Implement `contentWidth` prop: apply `pathable-app-shell__content--standard` (default) or `pathable-app-shell__content--wide` in `packages/react/src/components/AppShell/AppShell.tsx`
- [x] T009 [US1] Implement `className` merging and `...rest` attribute spreading on the root div in `packages/react/src/components/AppShell/AppShell.tsx`
- [x] T010 [US1] Add empty-state guards: omit brand, nav, account, notification regions when props are empty/undefined in `packages/react/src/components/AppShell/AppShell.tsx`
- [x] T011 [US1] Add `export { AppShell } from './components/AppShell/AppShell.js'` to `packages/react/src/index.ts`

**Checkpoint**: Desktop shell with sidebar renders correctly with all optional regions and modifier props

---

## Phase 4: User Story 2 — Mobile Shell (P1)

**Goal**: Display a compact top bar and optional bottom navigation on narrow viewports without separate mobile markup.

**Independent Test**: Render `<AppShell topBarTitle="MyApp" bottomNavItems={[...]}>` at viewport < 1024px. Verify sidebar hidden, top bar visible, bottom nav with correct item structure.

### Implementation for User Story 2

- [x] T012 [US2] Implement mobile top bar `<header className="pathable-app-shell__topbar">` with `<span className="pathable-app-shell__topbar-title">` in `packages/react/src/components/AppShell/AppShell.tsx`
- [x] T013 [US2] Implement bottom navigation rendering from `bottomNavItems` prop: `<nav className="pathable-bottom-navigation" aria-label="Primary">` with items in `packages/react/src/components/AppShell/AppShell.tsx`
- [x] T014 [US2] Handle empty bottom nav: omit `<nav>` when `bottomNavItems` is empty/undefined in `packages/react/src/components/AppShell/AppShell.tsx`
- [x] T015 [US2] Add `aria-current="page"` + modifier class on active bottom nav items; `aria-hidden="true"` on icons in `packages/react/src/components/AppShell/AppShell.tsx`

**Checkpoint**: Mobile shell with top bar and bottom navigation renders correctly

---

## Phase 5: User Story 3 — Accessible Shell (P2)

**Goal**: Include a skip link and maintain logical focus order across breakpoints.

**Independent Test**: Press Tab after render — verify skip link appears targeting `#main-content`. Storybook interaction test confirms focus order.

### Implementation for User Story 3

- [x] T016 [US3] Render skip link `<a className="pathable-skipnav" href="#main-content">Skip to main content</a>` as first child of root div in `packages/react/src/components/AppShell/AppShell.tsx`
- [x] T017 [US3] Ensure `<main>` element has `id="main-content"` for skip link targeting in `packages/react/src/components/AppShell/AppShell.tsx`
- [x] T018 [US3] Implement `notification` prop: render `<div className="pathable-app-shell__notification">` after skip link, omit when empty in `packages/react/src/components/AppShell/AppShell.tsx`

**Checkpoint**: Skip link focusable, notification region functional, focus order correct

---

## Phase 6: User Story 4 — Wrapped Nav Items (P3)

**Goal**: Provide `AppShellNavItem` sub-component with correct class structure and active-state cues.

**Independent Test**: Render `<AppShellNavItem href="/home" active>Home</AppShellNavItem>`. Verify `<a class="pathable-app-shell__nav-item pathable-app-shell__nav-item--active" href="/home" aria-current="page">Home</a>`.

### Implementation for User Story 4

- [x] T019 [P] [US4] Implement `AppShellNavItem` component in `packages/react/src/components/AppShell/AppShellNavItem.tsx` per contracts/props.md
- [x] T020 [US4] Add `export { AppShellNavItem } from './components/AppShell/AppShellNavItem.js'` to `packages/react/src/index.ts`

**Checkpoint**: AppShellNavItem renders correct BEM classes for active and inactive states

---

## Phase 7: User Story 5 — Transitive Styles (P3)

**Goal**: Verify consumers can use AppShell without a separate styles import.

**Independent Test**: `pnpm pack --dry-run` confirms transitive `@pathableai/styles` CSS in package output.

### Implementation for User Story 5

- [x] T021 [US5] Verify barrel `packages/react/src/index.ts` includes `import '@pathableai/styles'` side-effect (already present, confirm no regression)
- [x] T022 [US5] Build the React package: `cd packages/react && pnpm build`
- [x] T023 [US5] Verify package contents: `cd packages/react && pnpm pack --dry-run` — confirm styles CSS in output
- [x] T024 [US5] Run lint: `cd packages/react && pnpm lint` — verify zero errors, zero warnings
- [x] T025 [US5] Run typecheck: `cd packages/react && pnpm typecheck` — verify no type errors

**Checkpoint**: Package builds, passes lint, passes typecheck, includes transitive styles

---

## Phase 8: Polish & Cross-Cutting

**Purpose**: Storybook stories, interaction tests, and final validation

### Stories

- [x] T026 [P] Create `AppShell.stories.tsx` meta with `satisfies Meta<typeof AppShell>`, `tags: ['autodocs']`, and component description in `packages/react/src/stories/components/AppShell/AppShell.stories.tsx`
- [x] T027 [P] Add `Playground` story with controls for all AppShell props in `packages/react/src/stories/components/AppShell/AppShell.stories.tsx`
- [x] T028 [P] Add `DesktopShell` story: sidebar with brand, 5 nav items (1 active), account context in `packages/react/src/stories/components/AppShell/AppShell.stories.tsx`
- [x] T029 [P] Add `MobileShell` story: topBarTitle, 4 bottomNavItems set with `parameters.viewport` at `mobile1` (375px) in `packages/react/src/stories/components/AppShell/AppShell.stories.tsx`
- [x] T030 [P] Add `FixedSidebar` story: `sidebarFixed={true}` with scrollable content in `packages/react/src/stories/components/AppShell/AppShell.stories.tsx`
- [x] T031 [P] Add `WideContent` story: `contentWidth="wide"` in `packages/react/src/stories/components/AppShell/AppShell.stories.tsx`
- [x] T032 [P] Add `LongNavLabels` story: sidebar with navigation items having long label text in `packages/react/src/stories/components/AppShell/AppShell.stories.tsx`
- [x] T033 [P] Add `NarrowViewport` story: mobile shell at 375px with all mobile regions in `packages/react/src/stories/components/AppShell/AppShell.stories.tsx`
- [x] T034 [P] Add `OperationalDashboard` composition story reusing existing dashboard shell markup from `packages/styles/src/stories/` in `packages/react/src/stories/components/AppShell/AppShell.stories.tsx`

### Interaction Tests

- [x] T035 Add `SkipLinkActivation` test: `userEvent.tab()` and `getByText('Skip to main content')` verify skip link becomes visible on Tab in `packages/react/src/stories/components/AppShell/AppShell.stories.tsx`
- [x] T036 Add `ActiveNavItemFocus` test: verify active nav item has `pathable-app-shell__nav-item--active` class and `aria-current="page"` in `packages/react/src/stories/components/AppShell/AppShell.stories.tsx`
- [x] T037 Add `ResponsiveLayoutSwitch` test: verify topbar visible at mobile viewport using `parameters.viewport` in `packages/react/src/stories/components/AppShell/AppShell.stories.tsx`

### Final Validation

- [x] T038 Run quickstart.md validation scenarios VS-01 through VS-11 from `specs/035-react-desktop-shell-wrapper/quickstart.md`
- [x] T039 Run Storybook tests: `pnpm test:storybook-react` — verify all interaction tests and accessibility checks pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — core desktop shell
- **US2 (Phase 4)**: Depends on US1 — extends same file (AppShell.tsx)
- **US3 (Phase 5)**: Depends on US2 — extends same file (AppShell.tsx)
- **US4 (Phase 6)**: Depends on Foundational — separate file, parallelizable with US1-US3
- **US5 (Phase 7)**: Depends on US1-US4 complete
- **Polish (Phase 8)**: Depends on all user stories complete

### User Story Dependencies

- **US1**: After Foundational. Core desktop shell component.
- **US2**: After US1. Extends same component file with mobile features.
- **US3**: After US2. Extends same component file with skip link and notification.
- **US4**: After Foundational. Separate file — can run parallel with US1-US3.
- **US5**: After all stories complete. Verification-only phase.

### Parallel Opportunities

- T002 ‖ T003 (different directories)
- T019 (US4) ‖ T006-T018 (US1-US3) — different files
- T027-T034 (stories) — all independent stories in same file
- T035-T037 (tests) — depend on stories existing first

---

## Implementation Strategy

### MVP First (US1 Only)

1. Setup + Foundational
2. US1: Desktop shell with sidebar
3. **STOP**: verify renders correctly — desktop MVP

### Incremental (Recommended)

1. Setup + Foundational
2. US1 → test → Desktop MVP
3. US2 → test → Responsive MVP
4. US3 → test → Accessible MVP
5. US4 → test → Complete API
6. US5 → verify → Release-ready
7. Phase 8 → stories/tests → Documentation complete

### Parallel Strategy

- Dev A: US1 → US2 → US3 (sequential, same file)
- Dev B: US4 (separate file, runs in parallel)
- Both: US5 + Phase 8

### Notes

- AppShell.tsx is the primary file; US1-US3 modify it sequentially
- AppShellNavItem.tsx is independent; develop in parallel
- Follow Card component pattern for prop handling
- Follow Button story pattern for Storybook conventions
- Every class name must map to a documented BEM class in `packages/styles`
- Do not disable, weaken, skip, or silence lint rules
- Commit after each phase or logical group