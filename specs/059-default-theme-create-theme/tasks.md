# Tasks: Default Theme and createTheme

**Input**: Design documents from `/specs/059-default-theme-create-theme/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included — the spec explicitly requires unit tests for `defaultTheme`, `createTheme`, and the color validator (FR-012, SC-001–SC-006).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 — Complete Default Theme (P1)](#phase-3-user-story-1--complete-default-theme-p1)
- [Phase 4: User Story 2 — Partial Overrides via createTheme (P1)](#phase-4-user-story-2--partial-overrides-via-createtheme-p1)
- [Phase 5: User Story 3 — Validation with Descriptive, Call-Time Errors (P2)](#phase-5-user-story-3--validation-with-descriptive-calltime-errors-p2)
- [Phase 6: User Story 4 — Pure, Deterministic, and Non-Mutating Behavior (P2)](#phase-6-user-story-4--pure-deterministic-and-nonmutating-behavior-p2)
- [Phase 7: User Story 5 — Build-Time Sync (P2)](#phase-7-user-story-5--buildtime-sync-p2)
- [Phase 8: Polish & Cross-Cutting Concerns](#phase-8-polish--crosscutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story Tasks](#parallel-example-user-story-tasks)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4 from spec.md; US5 = the P2 build-time sync requirement)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify the environment state this feature builds on. No new infrastructure is created — feature 058 already established `packages/react/src/theme/` (plan.md Project Structure).

- [ ] T001 Confirm `packages/react/src/theme/` and the barrel `packages/react/src/theme/index.ts` exist and export the feature-058 vocabulary (`THEME_COLOR_KEYS`, `themeColorToken`, `ThemeColorKey`, `ThemeColors`, `ThemeConfig`), and confirm `packages/styles/src/_semantic.scss` defines all 25 `$semantic-colors` entries from the `data-model.md` value table — the two sources this feature derives from

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The internal color validator — a dependency-free value check that `createTheme` needs before US2–US4 can be functionally complete.

**⚠️ CRITICAL**: No user story work can be completed until this phase is complete.

- [ ] T002 Create `packages/react/src/theme/color.ts` with the internal pure predicate `export function isValidCssColor(value: unknown): value is string` — rejects non-strings (`null`, `undefined`, numbers, booleans, objects, arrays, functions), empty/whitespace-only strings, and (after trimming surrounding whitespace) accepts only: hex `#rgb` / `#rgba` / `#rrggbb` / `#rrggbbaa`; `rgb()`/`rgba()` and `hsl()`/`hsla()` in both comma and modern space syntax with optional alpha; `hwb()` comma/space syntax; and the frozen lowercase `Set` of the 148 CSS named-color keywords including `transparent`. Pure, deterministic, and NO DOM/browser globals (per `contracts/color-validation.md` and `research.md` §3 — modern color functions like `lab()`, `lch()`, `oklch()`, `color()`, `color-mix()` are intentionally rejected)

**Checkpoint**: The value validator is ready — user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Complete Default Theme (P1) 🎯 MVP

**Goal**: Consumers can import `defaultTheme` from `@pathableai/react` and receive the complete 25-token default color set, each value byte-for-byte matching `_semantic.scss` (e.g. `accent === '#1cae96'`, `bg === '#dde2e8'`, `text === '#00365c'`).

**Independent Test**: Run `pnpm --filter @pathableai/react test:unit` — the `defaultTheme` suite asserts exactly 25 tokens matching the authoritative table; run `pnpm --filter @pathableai/react typecheck` — all exit 0.

### Tests for User Story 1 ⚠️

> **NOTE: Write the test FIRST, ensure it FAILS before implementation** (test file is new; importing a not-yet-existing `defaultTheme` fails vitest resolution)

- [ ] T003 [P] [US1] Create `packages/react/src/theme/__tests__/defaultTheme.test.ts` (alongside the existing `__tests__/tokens.test.ts`) with vitest tests asserting `Object.keys(defaultTheme.colors).length === 25` and each of the 25 values deep-equals the authoritative lowercase-`#rrggbb` table from `specs/059-default-theme-create-theme/data-model.md` "Canonical default value table" — including named spot-checks `accent === '#1cae96'`, `bg === '#dde2e8'`, `text === '#00365c'` (SC-001/SC-003), mirroring the existing `expected`-map pattern in `packages/react/src/theme/__tests__/tokens.test.ts`

### Implementation for User Story 1

- [ ] T004 [US1] Create `packages/react/src/theme/defaultTheme.ts` with `export const defaultTheme: ThemeConfig = { colors: { ... } }` — exactly 25 entries keyed by `THEME_COLOR_KEYS` (`bg: '#dde2e8'`, `surface: '#ffffff'`, `text: '#00365c'`, `textMuted: '#015a76'`, `border: '#dde2e8'`, `link: '#4899e8'`, `accent: '#1cae96'`, `focusRing: '#4497f5'`, `danger: '#dc3545'`, `success: '#1cae96'`, `textSuccess: '#0d7a63'`, `actionPrimaryBg: '#00365c'`, `actionPrimaryText: '#ffffff'`, `actionSecondaryBg: '#1cae96'`, `actionSecondaryText: '#001a33'`, `statusSuccessBg: '#1cae96'`, `statusSuccessText: '#001a33'`, `statusWarningBg: '#f5a623'`, `statusWarningText: '#001a33'`, `statusDangerBg: '#dc3545'`, `statusDangerText: '#ffffff'`, `workflowActive: '#4899e8'`, `workflowComplete: '#1cae96'`, `workflowBlocked: '#dc3545'`, `onAccent: '#001a33'`), each value copied verbatim from `$semantic-colors` in `packages/styles/src/_semantic.scss` (FR-001/FR-002)
- [ ] T005 [US1] Add `export { defaultTheme } from './defaultTheme.js'` to the barrel `packages/react/src/theme/index.ts` alongside the existing `./tokens.js` re-exports
- [ ] T006 [US1] Add `export { defaultTheme } from './theme/index.js'` to `packages/react/src/index.ts` (public entry point; consumers get defaults with no separate `@pathableai/styles` import — constitution V)
- [ ] T007 [US1] Run `pnpm --filter @pathableai/react test:unit && pnpm --filter @pathableai/react typecheck` — `defaultTheme.test.ts` passes with all 25 keys covered and the package type-checks

**Checkpoint**: The canonical default theme is public via `@pathableai/react` and its tests pass — deployable increment.

---

## Phase 4: User Story 2 — Partial Overrides via createTheme (P1)

**Goal**: Consumers call `createTheme({ colors: { accent: '#7c3aed' } })` and receive a theme with the override applied and the other 24 tokens at their defaults — deep merge, not whole-object replacement (FR-003/FR-004).

**Independent Test**: Run `pnpm --filter @pathableai/react test:unit` — single-token override preserves 24 defaults; multi-token override merges; full-config passthrough matches the input exactly.

### Tests for User Story 2 ⚠️

- [ ] T008 [P] [US2] Create `packages/react/src/theme/__tests__/createTheme.test.ts` with vitest tests for US2: single-token override (`createTheme({ colors: { accent: '#7c3aed' } })` → `accent` overridden, all 24 others deep-equal `defaultTheme` values), multi-token override (deep-merge, no whole-object replacement), full-config passthrough (exactly matches the provided config), and empty partial (`createTheme({})` deep-equals `defaultTheme`) — scenarios from `quickstart.md` §2 and `contracts/create-theme.md`; follow vitest conventions in `packages/react/src/theme/__tests__/tokens.test.ts`

### Implementation for User Story 2

- [ ] T009 [US2] Create `packages/react/src/theme/createTheme.ts` with the exported utility type `DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }` (co-located with its only consumer per `research.md` §5) and `export function createTheme(input: DeepPartial<ThemeConfig>): ThemeConfig` that (1) rejects non-plain-object input, (2) deep-merges `input` over `defaultTheme` into a fresh object via a small recursive `deepMerge` helper (`{ ...defaultTheme.colors, ...input.colors }` semantics, `research.md` §1 — never writes to `input` or `defaultTheme`), (3) validates presence of all 25 keys, (4) validates each value with `isValidCssColor` from `./color.js`. Throws plain `Error`s: non-object input → `createTheme: expected a plain object, received <type>`; missing token → `createTheme: missing required color token "<key>"`; invalid value → `createTheme: invalid color value for "<key>": <value>` (`research.md` §4)
- [ ] T010 [US2] Run `pnpm --filter @pathableai/react test:unit` — the `createTheme.test.ts` US2 suite passes (deep-merge, fall-through, passthrough) (SC-002)
- [ ] T011 [US2] Add `export { createTheme } from './createTheme.js'` and `export type { DeepPartial } from './createTheme.js'` (type needed in generated `.d.ts`) to the barrel `packages/react/src/theme/index.ts`; then add `export { createTheme }` and `export type { DeepPartial } from './theme/index.js'` to `packages/react/src/index.ts`
- [ ] T012 [US2] Run `pnpm --filter @pathableai/react typecheck` — `createTheme` and `DeepPartial` import from the package entry point and type-check in a consumer-style snippet (`createTheme({ colors: { accent: '#000' } })` compiles; `createTheme(42)` is a type error)

**Checkpoint**: The factory merges partial overrides over `defaultTheme` and is publicly importable.

---

## Phase 5: User Story 3 — Validation with Descriptive, Call-Time Errors (P2)

**Goal**: Mistakes are caught at call time with an error naming the offending token (FR-005/FR-006/FR-007).

**Independent Test**: Run `pnpm --filter @pathableai/react test:unit` — the validation suite triggers each documented error message exactly.

**Tests**: Added to the same `createTheme.test.ts` file created in US2 (separate describe block).

- [ ] T013 [P] [US3] Add a validation suite to `packages/react/src/theme/__tests__/createTheme.test.ts`: non-object inputs (`null`, `'text'`, `42`, `true`, `[]`, `() => {}`) throw `createTheme: expected a plain object, received <type>`; a full-`colors` override that omits a required key throws `createTheme: missing required color token "<key>"`; invalid values (`{ colors: { accent: 42 } }`, `{ colors: { accent: '#12' } }`, `{ colors: { accent: 'not-a-color' } }`) throw `createTheme: invalid color value for "<key>": <value>` — each asserted with `toThrow()` and the exact documented message (SC-004; `quickstart.md` §2)

### Implementation for User Story 3

- [ ] T014 [US3] Review the throw paths in `packages/react/src/theme/createTheme.ts` against the `contracts/create-theme.md` message table and align every message verbatim (no API/export change; `isValidCssColor` stays internal per `contracts/color-validation.md`)
- [ ] T015 [US3] Run `pnpm --filter @pathableai/react test:unit && pnpm --filter @pathableai/react typecheck` — the US3 validation suite passes with exact messages at call time (SC-004)

**Checkpoint**: All invalid inputs fail immediately with descriptive, token-naming errors.

---

## Phase 6: User Story 4 — Pure, Deterministic, and Non-Mutating Behavior (P2)

**Goal**: Sharing `defaultTheme` and reusing `createTheme` is side-effect free — no mutation, deterministic results, fully serializable plain-data output (FR-009/FR-010/FR-011).

**Independent Test**: Run `pnpm --filter @pathableai/react test:unit` — non-mutation (deep-equal before/after), determinism (two calls deep-equal), serializability (`JSON.parse(JSON.stringify(...))` round-trip) all pass.

**Test-only story**: purity guarantees are verified by tests; the implementation already produces fresh plain objects structurally (`research.md` §6–§7).

- [ ] T016 [P] [US4] Add a purity/determinism/serializability suite to `packages/react/src/theme/__tests__/createTheme.test.ts`: (a) `defaultTheme` and `input` are deeply unchanged after a call (snapshot with `JSON.parse(JSON.stringify(...))` before/after, since `defaultTheme` and input are plain data); (b) two calls with the same input return deep-equal results; (c) `JSON.parse(JSON.stringify(result))` deep-equals `result` (SC-005/SC-006; `quickstart.md` §3)
- [ ] T017 [US4] Run `pnpm --filter @pathableai/react test:unit` — the US4 suite passes (no mutation, deterministic, serializable)

**Checkpoint**: `createTheme` is proven pure, deterministic, and safe to share.

---

## Phase 7: User Story 5 — Build-Time Sync (P2)

**Goal**: `pnpm lint:tokens` fails with a descriptive error when a `defaultTheme` color value drifts from `$semantic-colors` in `packages/styles/src/_semantic.scss` (SC-001/FR-002; extends the feature-058 key-set sync check in the same script).

**Independent Test**: Temporarily change one default (e.g. `accent: '#111111'`) → `pnpm lint:tokens` exits non-zero naming `accent`; revert and confirm exit 0.

### Implementation for User Story 5

- [ ] T018 [P] [US5] Extend `packages/styles/scripts/lint-tokens.mjs` `main()` loop (alongside the existing checks) with a value-drift check that reads the 25 `colors` literal values from `packages/react/src/theme/defaultTheme.ts` (path resolved like the existing `tokens.ts` read in the same script) and the `$semantic-colors` map via `parseScssMap()`; compare each value and on mismatch log `defaultTheme value mismatch for "<token>": expected <scss>, found <ts>` and exit non-zero
- [ ] T019 [US5] Run `pnpm lint:tokens` — exit 0 with pristine `defaultTheme`; then temporarily edit `packages/react/src/theme/defaultTheme.ts` (e.g. `accent: '#111111'`), rerun `pnpm lint:tokens` and confirm exit 1 with the descriptive mismatch naming `accent`; revert the edit and confirm exit 0 again

**Checkpoint**: Value drift between SCSS and `defaultTheme` is caught at lint time.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Full-stack validation of the changed package, publishability of the new exports, and end-to-end scenario coverage.

- [ ] T020 [P] Run the full react-package validation chain plus the sync check: `pnpm --filter @pathableai/react lint && pnpm --filter @pathableai/react typecheck && pnpm --filter @pathableai/react test:unit && pnpm --filter @pathableai/react build && pnpm lint:tokens` — all exit 0, with no lint/type-check suppression anywhere
- [ ] T021 [P] Run publishable validation: `pnpm --filter @pathableai/react check:types && pnpm --filter @pathableai/react check:package` — `defaultTheme`, `createTheme`, and `DeepPartial` resolve through the entry point without attw/publint failures
- [ ] T022 Validate `specs/059-default-theme-create-theme/quickstart.md` end-to-end: the `defaultTheme` spot-checks (§1), `createTheme` merge/error scenarios (§2), purity/serializability suite (§3), `pnpm lint:tokens` regression (§4), quality gates (§5), and publishable checks (§6) all pass; confirm no feature-058 regression (`tokens.test.ts` still green)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately (verification only)
- **Foundational (Phase 2)**: Depends on Setup (T001) — provides `isValidCssColor` used by US2–US4
- **US1 (Phase 3)**: Depends on Foundational for full completion, but `defaultTheme` (T004) is data-only and can be written as soon as T001 confirms the SCSS table
- **US2 (Phase 4)**: Depends on T002 (`isValidCssColor`) and T004 (`defaultTheme` merge source)
- **US3 (Phase 5)**: Depends on T009 (the throws live in `createTheme.ts`); T013 (tests) can be prepared in parallel
- **US4 (Phase 6)**: Depends on T009 (uses `createTheme`); shares the `createTheme.test.ts` file with US2/US3 suites (extend sequentially)
- **US5 (Phase 7)**: Depends on T004 (`defaultTheme.ts` must exist for the value read)
- **Polish (Phase 8)**: Depends on all preceding phases

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — no cross-story dependency; MVP
- **User Story 2 (P1)**: Depends on Foundational + US1 (`defaultTheme`)
- **User Story 3 (P2)**: Depends on Foundational + US2 implementation (T009), but test authoring (T013) is parallelizable
- **User Story 4 (P2)**: Depends on US2; test-only
- **User Story 5 (P2)**: Depends on US1 (`defaultTheme.ts`) only — no dependency on US2–US4

### Within Each User Story

- Tests written FIRST and expected to FAIL before implementation (T003 before T004; T008 before T009; T013 before T014; T016 before T017)
- Implementation before export wiring (T004 → T005 → T006 in US1; T009 → T011 in US2)
- Same-file edits are sequential: `theme/index.ts` touched by T005 then T011; `src/index.ts` by T006 then T011; `createTheme.test.ts` by T008 then T013 then T016

### Parallel Opportunities

- **Initial**: T001 (Setup) and T002 (Foundational) run in parallel — different concerns
- **Test authoring**: T003 (US1) and T008 (US2) are different files — parallel
- **US1 implementation ∥ US5**: T004/T005/T006 (defaultTheme + barrels) parallel to T018 (US5 lint extension needs `defaultTheme.ts` only as the last step)
- **US3 tests ∥ US2 implementation**: T013 can be written as soon as T008 established the test file — same file, but US3 assertions only need predictable `createTheme` behavior (which T009 supplies)
- **US5 ∥ US2/US3/US4**: T018 touches only `lint-tokens.mjs` — completely independent once `defaultTheme.ts` exists
- **Polish parallel**: T020 ∥ T021 ∥ T022 (different checks)

---

## Parallel Example: User Story Tasks

```bash
# Immediately after Setup:
Task: T002 "Create isValidCssColor in packages/react/src/theme/color.ts"
Task: T003 [US1] "Create defaultTheme.test.ts"

# Once Foundational is done, run US1 implementation and US5 lint work in parallel:
Task: T004 [US1] "Create packages/react/src/theme/defaultTheme.ts"
Task: T018 [US5] "Extend lint-tokens.mjs to compare defaultTheme values"

# Test author parallelizing:
Task: T008 [US2] "Create createTheme.test.ts"
Task: T003 [US1] "Create defaultTheme.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002 — `isValidCssColor`)
3. Complete Phase 3: User Story 1 (T003–T007) — `defaultTheme` constant, tests, and public exports
4. **STOP and VALIDATE**: `pnpm --filter @pathableai/react test:unit && pnpm --filter @pathableai/react typecheck`
5. **Deployable increment**: consumers receive the canonical 25-token default set without hand-assembling values

### Incremental Delivery

1. Setup + Foundational → color validator ready
2. Add US1 → `defaultTheme` public (MVP)
3. Add US2 → `createTheme` with partial overrides
4. Add US3 → descriptive, call-time validation
5. Add US4 → purity/determinism/serializability proof
6. Add US5 → value drift caught at lint time
7. Polish → full gate suite, packaging checks, quickstart validation

### Parallel Team Strategy

With multiple developers (after Foundational):

- Developer A: User Story 1 (T003–T007) → MVP
- Developer B: User Story 2 (T008–T012), then US3 (T013–T015) and US4 (T016–T017) tests in `createTheme.test.ts`
- Developer C: User Story 5 (T018–T019) once `defaultTheme.ts` lands — fully independent files

### Key Reminders

- `isValidCssColor` is internal-only — never export it from `packages/react/src/index.ts` (public surface is `defaultTheme`, `createTheme`, `DeepPartial` only; `contracts/color-validation.md`)
- Error message strings are a contract — assert them verbatim (the three shapes in `contracts/create-theme.md`)
- `DeepPartial` lives in `createTheme.ts` and is type-exported for the `.d.ts` (research.md §5)
- `defaultTheme` values are copied from `_semantic.scss`, NOT generated or converted at build time (research.md §2)
- No new `package.json` scripts — US5 reuses the existing `pnpm lint:tokens` path (feature 058)
- No lint/type-check suppression anywhere — no `@ts-expect-error`, no `eslint-disable`, no rule relaxation (lint-discipline rule)