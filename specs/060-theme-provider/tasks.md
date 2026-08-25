# Tasks: ThemeProvider Component

**Input**: Design documents from `specs/060-theme-provider/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md,
data-model.md, contracts/theme-provider.md, quickstart.md

**Tests**: Included — the spec's acceptance scenarios and the plan's validation gates explicitly
require unit tests (vitest + @testing-library/react + jest-dom) and Storybook stories.

**Organization**: Tasks are grouped by user story. `ThemeProvider` is a single atomic component
file shared by all three stories, so its implementation lives in the Foundational phase; each
user-story phase adds the test and story coverage that validates that story's acceptance scenarios
independently. Nesting precedence and the `colorScheme` no-op are free-by-architecture (full
25-token emission plus an inert prop), so those story phases add verification rather than new
implementation.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1](#phase-3-user-story-1---apply-a-partial-color-theme-to-a-page-priority-p1-mvp)
- [Phase 4: User Story 2](#phase-4-user-story-2---nest-branded-sections-within-a-default-themed-page-priority-p2)
- [Phase 5: User Story 3](#phase-5-user-story-3---toggle-between-color-schemes-at-runtime-priority-p3)
- [Phase 6: Polish](#phase-6-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 1](#parallel-example-user-story-1)
- [Implementation Strategy](#implementation-strategy)
- [Notes](#notes)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Every task includes the exact file path it touches.

## Path Conventions

- Source: `packages/react/src/**`; the component lives in the existing `theme/` module
  (`packages/react/src/theme/`).
- Tests are co-located in `packages/react/src/theme/__tests__/`.
- Stories live in `packages/react/src/stories/components/<Category>/`.
- Source imports use the ESM `.js` extension (matching `theme/index.ts` and `Container.tsx`);
  test imports are relative without an extension (matching `createTheme.test.ts`).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the working environment is ready.

- [X] T001 Confirm the `060-theme-provider` branch is checked out and run `pnpm install` at the repo root so `packages/react` dev dependencies (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`) are present.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shared `ThemeProvider` component, its props type, and its public exports. Every
user story depends on this phase.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 Create the `ThemeProvider` component plus the `ColorScheme` type and `ThemeProviderProps` interface in `packages/react/src/theme/ThemeProvider.tsx` — `forwardRef<HTMLElement, ThemeProviderProps>` with `as?: ElementType` defaulting to `'div'`, `theme?: ThemeConfig` defaulting to `defaultTheme`, and `colorScheme?: ColorScheme` as a documented no-op; emit all 25 `--pathable-color-*` custom properties from `theme.colors` via `THEME_COLOR_KEYS` and `THEME_COLOR_TOKEN_MAP` (from `tokens.ts`); return `children` with no wrapper when `theme.colors` key-wise equals `defaultTheme.colors`; otherwise render the wrapper with `ref`, `className`, and forwarded native props.
- [X] T003 [P] Re-export `ThemeProvider`, `ThemeProviderProps`, and `ColorScheme` from `packages/react/src/theme/index.ts`.
- [X] T004 [P] Re-export `ThemeProvider`, `ThemeProviderProps`, and `ColorScheme` from `packages/react/src/index.ts`.

**Checkpoint**: The component renders and is importable from `@pathableai/react`.

---

## Phase 3: User Story 1 - Apply a Partial Color Theme to a Page (Priority: P1) [MVP]

**Goal**: A consumer provides only the colors they want to override; the provider emits all 25
resolved tokens scoped to a wrapper, with defaults falling through for non-overridden tokens; when
the resolved theme equals the default, no wrapper element is added.

**Independent Test**: Wrap a section in `ThemeProvider` with a partial override, render components
that use the overridden tokens, and verify the overridden colors render inside the subtree while
defaults render outside; verify the no-wrapper path adds no DOM node.

### Tests for User Story 1

- [X] T005 [P] [US1] Create `packages/react/src/theme/__tests__/ThemeProvider.test.tsx` with emission + scoping tests: a partial theme via `createTheme({ colors: { accent: '#7c3aed', actionPrimaryBg: '#7c3aed' } })` renders a wrapper whose `style` carries `--pathable-color-accent` and `--pathable-color-action-primary-bg` set to `#7c3aed` and the remaining 23 tokens at `defaultTheme` values, and those custom properties appear only on the wrapper element.
- [X] T006 [US1] Add no-wrapper tests to `packages/react/src/theme/__tests__/ThemeProvider.test.tsx`: `theme={defaultTheme}` and an omitted `theme` render children with no wrapper element (assert no extra DOM node — FR-006 / SC-003).
- [X] T007 [US1] Add `as`/ref/native-prop forwarding tests to `packages/react/src/theme/__tests__/ThemeProvider.test.tsx`: `as="section"` renders a `<section>`; forwarded `id`, `aria-label`, `className`, and `ref` land on the wrapper (FR-005).

### Stories for User Story 1

- [X] T008 [P] [US1] Create `Default` and `PartialOverride` stories in `packages/react/src/stories/components/theme/ThemeProvider.stories.tsx` following existing story conventions (deterministic named stories, `satisfies Meta`, `tags: ['autodocs']`, semantic docs describing intent, resolve-partials-via-`createTheme` usage, and the wrapper/no-wrapper contract).

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Nest Branded Sections Within a Default-Themed Page (Priority: P2)

**Goal**: A nested provider's overrides win for its subtree via the CSS cascade; tokens not set at
an inner level fall through to the outer provider and ultimately to root defaults.

**Independent Test**: Render an outer default provider with an inner partial provider; verify inner
components resolve the inner overrides while outer components resolve the defaults.

### Tests for User Story 2

- [X] T009 [P] [US2] Add nesting-precedence tests to `packages/react/src/theme/__tests__/ThemeProvider.test.tsx`: an outer `defaultTheme` plus an inner partial provider emits the inner override value on the inner wrapper; three nested providers resolve the innermost value with fallthrough to middle, outer, and root defaults (FR-007).

### Stories for User Story 2

- [X] T010 [P] [US2] Create the `NestedBrandedSection` story in `packages/react/src/stories/components/theme/ThemeProvider.stories.tsx` (an inner provider within a default outer).

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Toggle Between Color Schemes at Runtime (Priority: P3)

**Goal**: The `colorScheme` prop is accepted without error as a forward-compatible hook; the
`"dark"` value is a documented no-op in this release.

**Independent Test**: Render with `colorScheme="light"` and `colorScheme="dark"`; both render
without error and produce the same token output.

### Tests for User Story 3

- [X] T011 [US3] Add `colorScheme` no-op tests to `packages/react/src/theme/__tests__/ThemeProvider.test.tsx`: `colorScheme="light"` and `colorScheme="dark"` both render without error, produce the same output, and the prop is not forwarded to the DOM (FR-008).

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Full validation gates and end-to-end verification per `quickstart.md`.

- [X] T012 Run the `packages/react` quality gates from `specs/060-theme-provider/quickstart.md` section 7: `pnpm --filter @pathableai/react lint`, `typecheck`, `test:unit`, and `build` — all must exit `0`.
- [X] T013 [P] Run `pnpm lint:tokens` to confirm the 25-key color vocabulary is unchanged (feature 058 guard).
- [X] T014 [P] Run publishable-validation from `specs/060-theme-provider/quickstart.md` section 8: `pnpm --filter @pathableai/react check:types` (attw) and `check:package` (publint).
- [X] T015 [P] Run the Storybook gates from `specs/060-theme-provider/quickstart.md` sections 5-6: `pnpm test:storybook-react` and `pnpm test:storybook-react-server`.
- [X] T016 Run the full `specs/060-theme-provider/quickstart.md` validation trace end-to-end and confirm every acceptance scenario is covered.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup — blocks all user stories.
- **User Stories (Phase 3-5)**: Depend on the Foundational component; run in priority order
  P1 → P2 → P3 (or in parallel if staffed).
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories.
- **User Story 2 (P2)**: Independent of US1; builds on the shared component; independently testable.
- **User Story 3 (P3)**: Independent; depends only on the shared component's `colorScheme` prop.

### Within Each User Story

- Tests first, then stories.
- Core emission/scoping assertions before no-wrapper and `as`/ref assertions.

### Parallel Opportunities

- T003 and T004 (re-exports in two separate files) can run in parallel.
- T005 (test file) and T008 (story file) can run in parallel.
- T009 (test file) and T010 (story file) can run in parallel.
- Polish gates T013, T014, and T015 are independent and parallelizable.

---

## Parallel Example: User Story 1

```bash
# Launch the test file and story file together (different files):
Task: "T005 [P] [US1] ... ThemeProvider.test.tsx"
Task: "T008 [P] [US1] ... ThemeProvider.stories.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (component + exports).
2. Complete Phase 3 (US1 tests + `Default`/`PartialOverride` stories).
3. STOP and VALIDATE: emission, scoping, and no-wrapper behavior.
4. Demo/deploy the partial-theme MVP.

### Incremental Delivery

1. Setup + Foundational → component importable from `@pathableai/react`.
2. User Story 1 → partial theme override works (MVP).
3. User Story 2 → nesting precedence verified.
4. User Story 3 → `colorScheme` no-op verified.
5. Polish gates → publishable and validated.

### Parallel Team Strategy

- One developer owns the shared component (Phase 2); once it lands, the US1/US2/US3 test and
  story tasks can be written in parallel by different developers against the same component.

---

## Notes

- `[P]` tasks write to different files and have no dependency on incomplete tasks.
- The component is atomic: nesting precedence and the `colorScheme` no-op are
  free-by-architecture (full 25-token emission plus an inert prop), so story phases add
  test/story coverage rather than new implementation.
- No lint, type-check, or test suppression is permitted (constitution + repo lint-discipline
  rule). Resolve root causes instead.
- Commit after each task or logical group.
- Every task is specific enough for an LLM to execute without additional context.
