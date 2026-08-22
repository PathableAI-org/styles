# Tasks: Heading Primitive

**Input**: Design documents from `specs/052-heading-primitive/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-api.md, quickstart.md

**Tests**: The feature specification explicitly requests unit tests (spec FR-020, FR-021, FR-022) and Storybook stories (FR-020, FR-021), so test and story tasks ARE included in each user-story phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Stories 1 & 2 - Render Semantic Heading Levels (Priority: P1)](#phase-3-user-stories-1--2---render-semantic-heading-levels-priority-p1-mvp)
- [Phase 4: User Story 3 - Visual Level Diverges from Document Level (Priority: P2)](#phase-4-user-story-3---visual-level-diverges-from-document-level-priority-p2)
- [Phase 5: User Story 4 - Heading Is Always a Heading Element (Priority: P1)](#phase-5-user-story-4---heading-is-always-a-heading-element-priority-p1)
- [Phase 6: User Story 5 - Ref Forwarding and Class Composition (Priority: P2)](#phase-6-user-story-5---ref-forwarding-and-class-composition-priority-p2)
- [Phase 7: User Story 6 - Accessibility Compliance (Priority: P1)](#phase-7-user-story-6---accessibility-compliance-priority-p1)
- [Phase 8: Polish & Cross-Cutting Concerns](#phase-8-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: Foundational Phase](#parallel-example-foundational-phase)
- [Implementation Strategy](#implementation-strategy)
- [Notes](#notes)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions
- Tasks modifying the SAME file run sequentially (no [P])

## Path Conventions

- **Monorepo library**: `packages/styles/...`, `packages/react/...` (see plan.md)
- Stories: `packages/react/src/stories/components/Heading/Heading.stories.tsx`
- Tests: `packages/react/src/components/Heading/__tests__/Heading.test.tsx`
- Component: `packages/react/src/components/Heading/Heading.tsx`
- SCSS contract: `packages/styles/src/pathable-component-wrappers/pathable-heading.scss`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify the environment and baseline before any changes

- [ ] T001 Verify baseline: run `pnpm install` (if needed), `pnpm --filter @pathableai/styles build`, and `pnpm --filter @pathableai/react test:unit` to confirm a green workspace before changing files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The `pathable-heading` SCSS contract in `packages/styles` MUST exist before ANY user story can be implemented. The React wrapper only maps to verified SCSS classes.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T002 Create `packages/styles/src/pathable-component-wrappers/pathable-heading.scss` with the base `.pathable-heading` class (sets `color: var(--pathable-color-text)`, `margin: 0`) and level modifiers `.pathable-heading--level-1` through `.pathable-heading--level-6`. Level 1 uses display-lg scale (Fredoka, 32px via `--pathable-font-size-display-lg`, weight 400). Levels 2–4 use heading-lg/md/sm scales (Poppins, `--pathable-font-size-heading-lg/md/sm`, weight `--pathable-font-weight-bold`). Levels 5–6 use body-md/sm sizes (Nunito, `--pathable-font-size-body-md/sm`, weight `--pathable-font-weight-bold`). All values MUST resolve to `--pathable-*` tokens — no literal px/rem/hex values. Refer to data-model.md mapping table and research.md Decision 1/2/8.

- [ ] T003 [P] Add `@forward 'pathable-heading';` to `packages/styles/src/pathable-component-wrappers/pathable-typography.scss` so the contract is exported through the typography bundle (which is forwarded by `pathable-all.scss` → `_index.scss` → `index.scss`).

- [ ] T004 Run `pnpm --filter @pathableai/styles build` and `pnpm --filter @pathableai/styles lint:styles`; verify compiled output contains `.pathable-heading` and all six `.pathable-heading--level-{N}` modifiers, with no lint violations.

**Checkpoint**: Foundation ready — user story implementation can now begin. US3/US5 depend on US1 (`Heading.tsx`); US4 is type-level only.

---

## Phase 3: User Stories 1 & 2 - Render Semantic Heading Levels (Priority: P1) 🎯 MVP

**Goal**: A developer renders `<Heading level={1..6}>` and gets a correctly styled heading element with the right semantic level and visual style class.

**Story tests**: Spec FR-005 (Heading exported), FR-006 (level prop controls element), FR-009 (class merge order), FR-012 (no wrapper), FR-013 (SSR identical), FR-014 (HeadingLevel type), FR-015 (class resolver).

### Implementation for US1/US2

- [ ] T005 [P] [US1] Create `packages/react/src/components/Heading/Heading.tsx` with `HeadingLevel` type (`1 | 2 | 3 | 4 | 5 | 6`), a local `HEADING_LEVEL_CLASS` record mapping each level to `pathable-heading--level-{N}`, and a `HeadingInner`/`forwardRef` component that renders the HTML heading element determined by `level` (e.g., `level={2}` → `<h2>`) with classes merged via `mergeClasses()` (order: `pathable-heading` base → `pathable-heading--level-{level}` modifier → consumer `className`). `level` is required with no default. Follow the `Text` component pattern (`Text.tsx`).

- [ ] T006 [P] [US1] Write unit tests in `packages/react/src/components/Heading/__tests__/Heading.test.tsx` covering: each `level` (1–6) renders the correct HTML element (`h1`–`h6`); each `level` applies the correct modifier class (`pathable-heading--level-{N}`); default render has both base class and level modifier; `children` renders inside the heading element; no wrapper DOM elements (single root node). Follow existing suite patterns (`@testing-library/react`, `classList` helper).

- [ ] T007 [US1] Export `Heading` and its types from `packages/react/src/index.ts` (`export { Heading } ...` and `export type { HeadingProps, HeadingLevel } from './components/Heading/Heading.js'`).

- [ ] T008 [US1] Create `packages/react/src/stories/components/Heading/Heading.stories.tsx` with `Meta` (autodocs, `argTypes` for `level`, `visualLevel`, `className`), a `Level1` story, a `Level2` story, and an `AllLevels` showcase story showing all six levels. Deterministic, synthetic copy.

**Checkpoint**: At this point, User Stories 1 & 2 should be fully functional and testable independently. All six heading levels render correctly.

---

## Phase 4: User Story 3 - Visual Level Diverges from Document Level (Priority: P2)

**Goal**: A developer passes `<Heading level={3} visualLevel={2}>` to get an `h3` element (document semantics) with the heading-2 visual style class (visual hierarchy).

**Story**: Spec FR-007 (visualLevel prop).

### Implementation for US3

- [ ] T009 [P] [US3] Extend `packages/react/src/components/Heading/Heading.tsx` with `visualLevel?: HeadingLevel` prop. When `visualLevel` is provided, the HTML element is `h{level}` but the CSS modifier class is `.pathable-heading--level-{visualLevel}`. When omitted, the modifier class defaults to `level`. The class resolution becomes: `pathable-heading--level-{visualLevel ?? level}`.

- [ ] T010 [P] [US3] Add `visualLevel` tests to `packages/react/src/components/Heading/__tests__/Heading.test.tsx`: `level={3} visualLevel={2}` renders `<h3>` with class `pathable-heading--level-2`; `visualLevel` omitted → modifier class matches `level`; `visualLevel` = `level` → same output as omitting it; `visualLevel` out of range is blocked by TS types at compile time.

- [ ] T011 [US3] Add `VisualLevelDivergence` story to `packages/react/src/stories/components/Heading/Heading.stories.tsx`: `<Heading level={3} visualLevel={2}>` demonstrating the h3-in-h2-style scenario. Include a brief description in story docs explaining that `level` controls semantics and `visualLevel` controls only the visual style.

**Checkpoint**: User Stories 1–3 independently functional.

---

## Phase 5: User Story 4 - Heading Is Always a Heading Element (Priority: P1)

**Goal**: TypeScript types ensure Heading cannot render as a non-heading element. No `as` prop is accepted.

**Story**: Spec FR-008 (no as prop).

### Implementation for US4

- [ ] T012 [P] [US4] Verify `packages/react/src/components/Heading/Heading.tsx` does not accept an `as` prop in its type signature. The component's element is always `h{level}`, typed via a simple mapping from `level` to the JSX intrinsic element. No polymorphic generic — unlike `Text`, Heading has no `as` override.

- [ ] T013 [P] [US4] Add type-level verification to `packages/react/src/components/Heading/__tests__/Heading.test.tsx`: confirm `<Heading level={1} as="div" />` is a TypeScript compile error (use `@ts-expect-error` directive with a comment explaining the expected error); confirm all rendered elements are always `h1`–`h6` (already covered by T006, but add explicit assertion that `querySelector('div')` returns null for any Heading instance).

**Checkpoint**: User Stories 1–4 functional; Heading API is semantically correct with no element-escape hatch.

---

## Phase 6: User Story 5 - Ref Forwarding and Class Composition (Priority: P2)

**Goal**: `ref` forwarding, native HTML attribute forwarding, and `className` composition work correctly.

**Story**: Spec FR-010 (ref forwarding), FR-011 (native attributes), FR-009 (class merge order), FR-013 (SSR identical).

### Implementation for US5

- [ ] T014 [P] [US5] Add ref forwarding and native attribute tests to `packages/react/src/components/Heading/__tests__/Heading.test.tsx`: `ref.current` is the rendered heading DOM element with correct `tagName`; `className="my-custom"` appears after design-system classes in the class list (`pathable-heading pathable-heading--level-2 my-custom`); native attributes like `id`, `data-testid`, `hidden` are forwarded to the heading element.

- [ ] T015 [P] [US5] Add an SSR-purity test to `packages/react/src/components/Heading/__tests__/Heading.test.tsx` using `renderToString`/`renderToStaticMarkup` from `react-dom/server` verifying the class string and markup are identical across renders for a representative prop combination (`level={2}` and `level={3} visualLevel={2}`).

- [ ] T016 [US5] Add a `WithCustomClass` story to `packages/react/src/stories/components/Heading/Heading.stories.tsx` showing `className` composition (e.g., `<Heading level={2} className="custom-style">`).

**Checkpoint**: User Stories 1–5 functional; component is production-composition ready.

---

## Phase 7: User Story 6 - Accessibility Compliance (Priority: P1)

**Goal**: Document and validate accessibility obligations for all heading levels (FR-016 through FR-019).

**Story**: Contrast, semantic exposure, forced-colors, and zoom behavior.

### Implementation for US6

- [ ] T017 [P] [US6] Record contrast evidence: compute and document WCAG AA contrast ratios for `--pathable-color-text` (#00365c) on `--pathable-color-surface` (#ffffff) — confirmed 12.48:1 from the Text primitive audit — verifying all heading levels meet ≥ 4.5:1. Document in a comment in `pathable-heading.scss` and reference in `specs/052-heading-primitive/research.md`.

- [ ] T018 [US6] Verify rendered accessibility in the React Storybook: run `pnpm --filter @pathableai/react storybook` and `pnpm --filter @pathableai/react test:storybook-react`; ensure NO `Heading` stories appear in `skipA11yStoryIds` or `colorContrastExceptionStoryIds` in `apps/storybook-react/.storybook/test-runner.js`. All heading stories must pass automated axe checks. No a11y rule exceptions.

- [ ] T019 [P] [US6] Verify heading semantics: run the axe DevTools or Accessibility Insights check on Storybook heading stories; confirm each heading has correct `role="heading"` and the appropriate heading level (implicit from the `h1`–`h6` element — no explicit `aria-level` attribute is needed or expected); confirm no ARIA role override is applied; verify forced-colors mode distinguishes headings by size/weight (spot-check in browser DevTools Rendering tab with `forced-colors: active`).

**Checkpoint**: All user stories complete; accessibility evidence gathered.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Full validation, docs, and cross-cutting checks

- [ ] T020 [P] Run build + type + package checks: `pnpm --filter @pathableai/styles build`, `pnpm --filter @pathableai/react build`, `pnpm --filter @pathableai/react exec tsc --noEmit`, `pnpm --filter @pathableai/react check:package`, `pnpm --filter @pathableai/react check:types` — all must pass.

- [ ] T021 [P] Run the full unit suite with the primitive regression pattern: `pnpm --filter @pathableai/react test:unit -- --testPathPattern="Heading|Text|Grid|Stack|Inline|Cluster|Container"` — all must pass.

- [ ] T022 [P] Run root quality gates: `pnpm lint` (eslint, stylelint, markdownlint, prettier check, token lint) — must pass with ZERO warnings; fix findings without disabling/suppressing any rule.

- [ ] T023 Execute the manual and automated checks in `specs/052-heading-primitive/quickstart.md` (SCSS contract content check, manual DOM inspection, forced-colors spot-check, server-compat `server-render` check, type-check compile errors) and record results.

- [ ] T024 Update `docs/plans/semantic-react/10-heading-primitive.md` Status line from `NOT STARTED` to `DONE`, and record the audit/evidence notes (SCSS contract, level mapping, contrast evidence).

- [ ] T025 Final review: `git status`/`git diff` — confirm no new lint suppressions, no unintended changes, and everything ready for merge.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — baseline verification only
- **Foundational (Phase 2)**: Depends on Setup; BLOCKS all user stories (SCSS contract must exist first per Constitution I)
- **US1/US2 (P1)**: After Foundational
- **US3 (P2)**: After US1/US2 (`Heading.tsx` must exist)
- **US4 (P1)**: After US1/US2 (`Heading.tsx` type verification)
- **US5 (P2)**: After US1/US2/US3 (compose features)
- **US6 (P1)**: After stories exist (US1/US2/US3 built)
- **Polish (Final)**: Depends on all user stories

### User Story Dependencies

- **US1/US2 (P1 MVP)**: Can start after Foundational (Phase 2) — no story deps
- **US3 (P2)**: Depends on US1/US2 (`Heading.tsx`)
- **US4 (P1)**: Can start alongside US1/US2 (type-level work on same file), but tests depend on component existing
- **US5 (P2)**: Depends on US1/US2/US3
- **US6 (P1)**: Depends on stories from US1/US2/US3

### Within Each User Story

- The contract (`contracts/component-api.md`) is the source of truth for class merge order, prop types, and rendered output
- `Heading.tsx` is SHARED across US1/US3 — edit it sequentially
- `Heading.test.tsx` is SHARED across all stories — append tests sequentially
- `Heading.stories.tsx` is SHARED across stories — append stories sequentially

### Parallel Opportunities

- Phase 2: T002/T003 are sequential (T003 can run in parallel with T002 since different files, but both must complete before T004)
- Within US1/US2: T005/T006/T007/T008 can largely run in parallel (component, tests, export, stories are separate files). T007 must run after T005 (import path). T008 (stories) is independent.
- US3: T009/T010 parallel; T011 sequential (same stories file)
- US4: T012/T013 parallel
- US5: T014/T015 parallel; T016 sequential (same stories file)
- US6: T017/T018 can be prepared in parallel; T018 waits for story build
- Polish: T020–T022 parallel; T023–T025 sequential after

---

## Parallel Example: Foundational Phase

```bash
# After T002 creates pathable-heading.scss:
Task: "Add @forward to pathable-typography.scss (T003)"

# Then:
Task: "Build and verify styles (T004)"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: baseline verification
2. Complete Phase 2: SCSS contract (CRITICAL — blocks all)
3. Complete Phase 3: User Stories 1 & 2 (`Heading` component + all 6 levels + level stories)
4. **STOP and VALIDATE**:
   ```bash
   pnpm --filter @pathableai/react test:unit -- --testPathPattern="Heading"
   pnpm --filter @pathableai/styles build
   pnpm --filter @pathableai/react build
   ```
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → foundation ready
2. Add US1/US2 (core heading component + all levels) → test → demo (MVP!)
3. Add US3 (visualLevel) → test → demo
4. Add US4 (type safety: no as prop) → verify types
5. Add US5 (ref/className/SSR) → test → demo
6. Add US6 (a11y evidence) → validate
7. Polish (lint, gates, docs DONE)

### Parallel Team Strategy

- Foundation (Phase 2) built by one owner
- Once done: Developer A continues US1/US2 (Heading.tsx), Developer B prepares tests/stories in parallel
- US4 and US6 can be worked on while US1/US2 is being built (type-level and a11y research tasks)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to user story for traceability
- `Heading.tsx` does NOT use generic polymorphic typing — unlike `Text`, there is no `as` prop. Element is always `h{level}`.
- Do NOT edit `packages/styles/src/_uswds-theme.scss` or any existing token values — the SCSS contract references existing `--pathable-*` tokens only
- Token lint `packages/styles/scripts/lint-tokens.mjs` and stylelint `src/**/*.scss` must pass; no lint rule disabling allowed (Constitution + `.cursor/rules/lint-discipline`)
- Keep the SCSS contract free of hardcoded values; reference `--pathable-*` tokens
- `level` prop is REQUIRED — no default. TypeScript catches missing `level` at compile time.
- `visualLevel` is OPTIONAL — when omitted, visual style matches `level`.
- No `tone`, `variant`, `color`, `fontSize`, `fontWeight`, `lineHeight`, or `fontFamily` props — these belong to `Text` or are escape hatches via `style`/`className`.
- CSS is NOT loaded via the component — it flows through `@pathableai/styles` which `@pathableai/react` imports at its entrypoint.
- Commit after each logical group or story.
