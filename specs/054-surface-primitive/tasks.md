# Tasks: Surface Primitive

**Input**: Design documents from `specs/054-surface-primitive/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-api.md

**Tests**: INCLUDED — the feature specification explicitly requires unit tests (FR-031–FR-035) and Storybook stories (FR-028–FR-029).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Phase 1: Setup — Precondition Gate (US7)](#phase-1-setup--precondition-gate-us7)
- [Phase 2: Foundational — SCSS Source Contract](#phase-2-foundational--scss-source-contract)
- [Phase 3: User Story 1 — Coordinated Treatment (P1)](#phase-3-user-story-1--coordinated-treatment-p1)
- [Phase 4: User Story 2 — Element / as / ref (P1)](#phase-4-user-story-2--element--as--ref-p1)
- [Phase 5: User Story 3 — Border Tone (P2)](#phase-5-user-story-3--border-tone-p2)
- [Phase 6: User Story 4 — Elevation (P2)](#phase-6-user-story-4--elevation-p2)
- [Phase 7: User Story 5 — Sizing / Spacing (P2)](#phase-7-user-story-5--sizing--spacing-p2)
- [Phase 8: User Story 6 — Accessibility (P1)](#phase-8-user-story-6--accessibility-p1)
- [Phase 9: Polish & Cross-Cutting Concerns](#phase-9-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 1](#parallel-example-user-story-1)
- [Implementation Strategy](#implementation-strategy)
- [Notes](#notes)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup — Precondition Gate (US7)

**Purpose**: Verify the conditional precondition (spec FR-001/FR-002) before any implementation. This phase serves User Story 7 (P1) — the feature ships only if at least two concrete application use cases demonstrate repeated coordinated surface behavior.

- [ ] T001 Verify the precondition: confirm `specs/054-surface-primitive/research.md` records at least two concrete application use cases of repeated, coordinated surface behavior, and record the go/no-go decision in the branch. If fewer than two use cases exist, mark the feature CANCELLED and stop — nothing ships.

---

## Phase 2: Foundational — SCSS Source Contract

**Purpose**: The owning `@pathableai/styles` contract MUST be extended before any `@pathableai/react` wrapper work (constitution source-first rule). All new modifiers live in one existing file, so these tasks are sequential on that file.

**⚠️ CRITICAL**: No React wrapper work can begin until this phase is complete.

- [ ] T002 Extend `packages/styles/src/pathable-component-wrappers/pathable-surface.scss` with tone-role modifiers `.pathable-surface--tone-default`, `.pathable-surface--tone-subtle`, `.pathable-surface--tone-primary`, resolving background to `--pathable-color-surface` / `--pathable-color-bg` / `--pathable-color-accent`, foreground to `--pathable-color-text` / `--pathable-color-on-accent`, and default border to `--pathable-color-border` / `--pathable-color-accent` — no literal hex/px/rem values.
- [ ] T003 Extend `packages/styles/src/pathable-component-wrappers/pathable-surface.scss` with elevation modifiers `.pathable-surface--elevation-sm`, `--md`, `--lg`, `--xl` resolving to the existing `--elevation-*` tokens.
- [ ] T004 Extend `packages/styles/src/pathable-component-wrappers/pathable-surface.scss` with border-tone modifiers `.pathable-surface--border-default` and `.pathable-surface--border-danger` resolving to `--pathable-color-border` / `--pathable-color-danger`.
- [ ] T005 Add `@media (forced-colors: active)` outline fallbacks and a `prefers-reduced-motion` transition guard for the new tone/elevation/border modifiers in `packages/styles/src/pathable-component-wrappers/pathable-surface.scss`.
- [ ] T006 Verify the surface contract is exported through the shared `@pathableai/styles` entrypoint and build it: run `pnpm --filter @pathableai/styles build` and confirm the compiled classes are present.

**Checkpoint**: Source contract ready — React wrapper implementation can now begin.

---

## Phase 3: User Story 1 — Coordinated Treatment (P1) 🎯 MVP

**Goal**: A developer renders `<Surface variant="...">` and receives a coordinated foreground/background/border/elevation treatment from a single semantic prop.

**Independent Test**: Render `<Surface variant="subtle">Panel</Surface>` and verify the DOM element carries `pathable-surface pathable-surface--tone-subtle`; unit tests verify each variant maps to its tone class.

### Implementation for User Story 1

- [ ] T007 [US1] Add a pure `surfaceToneClass()` resolver to `packages/react/src/internal/resolvers/tone.ts` mapping `default`/`subtle`/`primary` to `pathable-surface--tone-*` (return `undefined` for null/unknown).
- [ ] T008 [US1] Create the `Surface` component in `packages/react/src/components/Surface/Surface.tsx` with a `variant?: SurfaceTone` prop, rendering `<div className={mergeClasses('pathable-surface', surfaceToneClass(variant), className)}>` with children passthrough and no wrapper nodes.
- [ ] T009 [US1] Export `Surface` and its `SurfaceProps` type from `packages/react/src/index.ts`.
- [ ] T010 [US1] Add resolver tests for `surfaceToneClass` in `packages/react/src/internal/resolvers/__tests__/surface.test.ts`.
- [ ] T011 [US1] Add component tests for `variant`→class output in `packages/react/src/components/Surface/__tests__/Surface.test.tsx`.
- [ ] T012 [US1] Add one deterministic Storybook story per supported `variant` in `packages/react/src/stories/components/Surface/Surface.stories.tsx`.

**Checkpoint**: A minimal `Surface` with `variant` is fully functional and independently testable (MVP).

---

## Phase 4: User Story 2 — Element / as / ref (P1)

**Goal**: `Surface` renders a `div` by default, supports an `as` override, forwards refs, and produces exactly one DOM node with no wrapper.

**Independent Test**: Render `<Surface as="section" />` and assert a single `<section>`; attach a ref and assert `ref.current` is that element.

### Implementation for User Story 2

- [ ] T013 [US2] Add an `as?: ElementType` prop, `forwardRef` wrapping, and native attribute passthrough to `packages/react/src/components/Surface/Surface.tsx` (default `div`, no wrapper nodes).
- [ ] T014 [US2] Add component tests for `as` element selection, ref forwarding, native prop passthrough, class merge order, and single-DOM-node in `packages/react/src/components/Surface/__tests__/Surface.test.tsx`.

**Checkpoint**: The primitive's core element contract is complete.

---

## Phase 5: User Story 3 — Border Tone (P2)

**Goal**: A developer applies a semantic boundary (`borderTone="danger"`) on top of the variant treatment.

**Independent Test**: Render `<Surface variant="default" borderTone="danger">` and verify the element combines the tone class with `pathable-surface--border-danger`.

### Implementation for User Story 3

- [ ] T015 [US3] Add a pure `surfaceBorderToneClass()` resolver to `packages/react/src/internal/resolvers/tone.ts` mapping `default`/`danger` to `pathable-surface--border-*`.
- [ ] T016 [US3] Add a `borderTone?: BorderTone` prop to `packages/react/src/components/Surface/Surface.tsx` merged after the tone class.
- [ ] T017 [US3] Add resolver + component tests for `borderTone` combination in `packages/react/src/internal/resolvers/__tests__/surface.test.ts` and `packages/react/src/components/Surface/__tests__/Surface.test.tsx`.
- [ ] T018 [US3] Add a deterministic `borderTone` Storybook story in `packages/react/src/stories/components/Surface/Surface.stories.tsx`.

**Checkpoint**: `borderTone` is functional and independently testable.

---

## Phase 6: User Story 4 — Elevation (P2)

**Goal**: A developer controls depth via `elevation="md"` mapped to the verified `--elevation-*` steps (no arbitrary shadows).

**Independent Test**: Render `<Surface elevation="md">` and verify `pathable-surface--elevation-md`; verify an out-of-range value is a compile-time error.

### Implementation for User Story 4

- [ ] T019 [US4] Create `packages/react/src/internal/resolvers/surface.ts` with the `SurfaceElevation` type (`'sm' | 'md' | 'lg' | 'xl'`) and a pure `surfaceElevationClass()` resolver; re-export from `packages/react/src/internal/resolvers/index.ts`.
- [ ] T020 [US4] Add an `elevation?: SurfaceElevation` prop to `packages/react/src/components/Surface/Surface.tsx` merged after the tone class.
- [ ] T021 [US4] Add resolver + component tests for `elevation` combination in `packages/react/src/internal/resolvers/__tests__/surface.test.ts` and `packages/react/src/components/Surface/__tests__/Surface.test.tsx`.
- [ ] T022 [US4] Add a deterministic `elevation` Storybook story in `packages/react/src/stories/components/Surface/Surface.stories.tsx`.

**Checkpoint**: `elevation` is functional and independently testable.

---

## Phase 7: User Story 5 — Sizing / Spacing (P2)

**Goal**: A developer sizes and spaces a surface via shared capability props (`width`, `maxWidth`, `margin*`).

**Independent Test**: Render `<Surface width="full" marginX="auto">` and verify the resolved width/margin classes alongside the surface classes.

### Implementation for User Story 5

- [ ] T023 [US5] Extend `SurfaceProps` with `SizingProps` (`width`, `maxWidth`) and external `SpacingProps` (`margin`, `marginX`, `marginY`, `marginTop`, `marginBottom`) in `packages/react/src/components/Surface/Surface.tsx`, resolving via existing `widthClass`/`maxWidthClass`/`margin*Class`.
- [ ] T024 [US5] Add component tests for sizing/spacing class output in `packages/react/src/components/Surface/__tests__/Surface.test.tsx`.

**Checkpoint**: Shared sizing/spacing capability is functional.

---

## Phase 8: User Story 6 — Accessibility (P1)

**Goal**: Every supported surface variant meets WCAG AA contrast, stays distinguishable in forced-colors mode, and honors reduced motion.

**Independent Test**: Run axe on Surface stories (no new violations); confirm contrast + forced-colors + reduced-motion evidence is recorded in `research.md`.

### Implementation for User Story 6

- [ ] T025 [US6] Confirm per-variant contrast evidence (default 12.48:1, subtle ~9.6:1, primary ~5.5:1) and forced-colors/reduced-motion notes are recorded in `specs/054-surface-primitive/research.md` (spec FR-025/FR-026/FR-027); update if any ratio was left as "confirm during implementation".
- [ ] T026 [US6] Run static accessibility linting on `packages/react/src/components/Surface/Surface.tsx` and fix findings without disabling rules.
- [ ] T027 [US6] Verify the Storybook axe addon reports no new violations for Surface stories; document and justify any narrow, story-level exception.

**Checkpoint**: Accessibility obligations are verified and recorded.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Full validation gates and documentation that span all user stories.

- [ ] T028 Run lint, format, typecheck, and build for both packages (`pnpm build`, `pnpm --filter @pathableai/react lint`, `pnpm --filter @pathableai/react typecheck`), fixing findings without suppression or file exclusions.
- [ ] T029 [P] Run package-content validation (`pnpm --filter @pathableai/react check:package` and `check:types`) to confirm the `Surface` export and transitive `@pathableai/styles` import are publishable.
- [ ] T030 [P] Update `packages/react/src/stories/components/Surface/Surface.stories.tsx` metadata with semantic intent, usage guidance, misuse warnings, and accessibility obligations (canonical source: Storybook; derive/link package README).
- [ ] T031 Run the `specs/054-surface-primitive/quickstart.md` validation scenarios end-to-end and confirm expected outcomes.
- [ ] T032 Review visual-regression snapshots for the new Surface stories; approve intentional changes only — do not use snapshot approval to conceal regressions.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup / Precondition (Phase 1)**: No dependencies — gate must pass before anything else.
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all React wrapper stories.
- **User Stories (Phase 3+)**: All depend on Phase 2 completion. Phases 3–8 build on the single `Surface` component, so they proceed sequentially in priority order (P1 → P2).
- **Polish (Phase 9)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US7 (precondition)**: Satisfied by Phase 1 (T001); gates everything.
- **US1 (variant, P1)**: First React story; no dependency on other stories.
- **US2 (element/as/ref, P1)**: Extends the `Surface.tsx` created in US1; depends on US1's component shell existing.
- **US3 (borderTone, P2)**: Depends on US1/US2 (component + resolver patterns established).
- **US4 (elevation, P2)**: Depends on US1/US2; independent of US3.
- **US5 (sizing/spacing, P2)**: Depends on US1/US2; independent of US3/US4.
- **US6 (accessibility, P1)**: Validates all prior stories; runs last among stories.

### Within Each User Story

- SCSS (Phase 2) before resolvers; resolvers before component prop; component before tests; tests before stories where the test locks behavior.
- Story complete before moving to the next priority.

### Parallel Opportunities

- T010 (resolver tests) and T012 (stories) can run in parallel with T011 once the component exists (different files).
- US3, US4, and US5 each touch the same `Surface.tsx`/test/story files, so they are sequential to avoid same-file conflicts — but each can be implemented immediately after US2 by a different author if file edits are merged serially.
- T029 and T030 in Polish are different files and can run in parallel.

---

## Parallel Example: User Story 1

```bash
# After the Surface component exists (T008), launch independently:
Task: "T010 Add resolver tests for surfaceToneClass in packages/react/src/internal/resolvers/__tests__/surface.test.ts"
Task: "T011 Add component tests for variant→class output in packages/react/src/components/Surface/__tests__/Surface.test.tsx"
Task: "T012 Add variant stories in packages/react/src/stories/components/Surface/Surface.stories.tsx"
```

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1 (precondition gate) and Phase 2 (SCSS contract).
2. Complete Phase 3 (US1): `variant` + `surfaceToneClass` + export + tests + stories.
3. **STOP and VALIDATE**: `pnpm --filter @pathableai/react test:unit -- --testPathPattern="Surface"`.
4. Demo the variant stories in Storybook.

### Incremental Delivery

1. Setup + Foundational → source contract ready.
2. US1 (variant) → MVP.
3. US2 (as/ref) → complete primitive contract.
4. US3 (borderTone), US4 (elevation), US5 (sizing) → refinements.
5. US6 (a11y) → quality gates.
6. Polish → publishable.

### Parallel Team Strategy

With multiple developers after Phase 2 completes:

- Developer A: US1 + US2 (component core).
- Developer B: US3 + US4 resolvers/SCSS refinements (serialize file edits with A).
- Developer C: US5 + US6 verification.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps a task to its user story for traceability.
- All new SCSS modifiers resolve to existing `--pathable-*` / `--elevation-*` tokens — no new tokens, no literal values.
- `SurfaceTone` / `BorderTone` already exist in `tone.ts` (feature 11); this feature adds their resolvers and the `SurfaceElevation` type.
- Resolvers must be pure (no `window`/`document`); server/client output must be byte-identical.
- Avoid adding visual behavior only in the wrapper before the `packages/styles` contract exists (Phase 2 does the contract first).
- Do not disable, weaken, skip, or silence lint checks; fix findings or escalate for explicit human approval of a narrow bypass.
- Use fixed, deterministic regression stories — not Playground/Controls substitutes.
- Do not use serialized DOM snapshots as a complete substitute for browser-rendered visual/behavioral validation.
