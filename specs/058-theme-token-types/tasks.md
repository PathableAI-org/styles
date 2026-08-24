# Tasks: Theme Token Types and Vocabulary

**Input**: Design documents from `/specs/058-theme-token-types/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included — the spec explicitly requires unit tests for the mapping function (FR-009, SC-003).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 — Type-Safe Theme Color Override (P1)](#phase-3-user-story-1--type-safe-theme-color-override-p1)
- [Phase 4: User Story 2 — CamelCase-to-Kebab-Case Mapping (P2)](#phase-4-user-story-2--camelcasetokebabcase-mapping-p2)
- [Phase 5: User Story 4 — Build-Time Token Synchronization Check (P2)](#phase-5-user-story-4--buildtime-token-synchronization-check-p2)
- [Phase 6: User Story 3 — Public Tone and Elevation Type Exports (P3)](#phase-6-user-story-3--public-tone-and-elevation-type-exports-p3)
- [Phase 7: Polish & Cross-Cutting Concerns](#phase-7-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story Tasks](#parallel-example-user-story-tasks)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the new module directory structure

- [ ] T001 Create the directory `packages/react/src/theme/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core vocabularies and the mapping function — all user stories depend on these

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 Create `packages/react/src/theme/tokens.ts` with the `THEME_COLOR_KEYS` `as const` array (25 camelCase keys: `bg`, `surface`, `text`, `textMuted`, `border`, `link`, `accent`, `focusRing`, `danger`, `success`, `textSuccess`, `actionPrimaryBg`, `actionPrimaryText`, `actionSecondaryBg`, `actionSecondaryText`, `statusSuccessBg`, `statusSuccessText`, `statusWarningBg`, `statusWarningText`, `statusDangerBg`, `statusDangerText`, `workflowActive`, `workflowComplete`, `workflowBlocked`, `onAccent`), the derived `ThemeColorKey` and `ThemeColors` mapped types, the `ThemeConfig` interface (`{ colors: ThemeColors }`), a precomputed `THEME_COLOR_TOKEN_MAP` (`Record<ThemeColorKey, string>`) derived from the keys via camelCase→kebab-case transform with `--pathable-color-` prefix, and the pure `themeColorToken(value?: string | null): string | undefined` function that returns `undefined` for nullish/unknown inputs and the CSS property name otherwise
- [ ] T003 Create `packages/react/src/theme/index.ts` barrel re-exporting `THEME_COLOR_KEYS`, `ThemeColorKey`, `ThemeColors`, `ThemeConfig`, `THEME_COLOR_TOKEN_MAP`, and `themeColorToken` from `./tokens.js`

**Checkpoint**: Theme vocabulary module is ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Type-Safe Theme Color Override (P1) 🎯 MVP

**Goal**: Consumers can import `ThemeColors` and `ThemeConfig` from `@pathableai/react`, get autocomplete for all 25 keys, and receive compile-time errors for invalid keys

**Independent Test**: Run `pnpm --filter @pathableai/react typecheck` — a consumer writing `const overrides: Partial<ThemeColors> = { accent: '#7c3aed' }` compiles; `{ accentColour: '#7c3aed' }` fails

### Implementation for User Story 1

- [ ] T004 [US1] Export `ThemeColors` and `ThemeConfig` from `packages/react/src/index.ts` via `./theme/index.js`
- [ ] T005 [US1] Run `pnpm --filter @pathableai/react typecheck` and verify `ThemeColors` exports 25 accessible keys with autocomplete, invalid keys produce compile-time errors, and `ThemeConfig` accepts a `colors: ThemeColors` field

**Checkpoint**: Type-safe theme color vocabulary is public and type-checks

---

## Phase 4: User Story 2 — CamelCase-to-Kebab-Case Mapping (P2)

**Goal**: Consumers can call `themeColorToken()` with a `ThemeColors` key and receive the corresponding `--pathable-color-*` CSS custom property name; nullish/unknown inputs return `undefined`

**Independent Test**: Run `pnpm --filter @pathableai/react test:unit` — all 25 keys map correctly, edge cases return `undefined`

### Implementation for User Story 2

- [ ] T006 [P] [US2] Create `packages/react/src/theme/__tests__/tokens.test.ts` with vitest tests covering `themeColorToken` for all 25 `THEME_COLOR_KEYS` (happy path asserting exact `--pathable-color-*` output per the mapping table in `specs/058-theme-token-types/data-model.md`) and edge cases (`null` returns `undefined`, `undefined` returns `undefined`, unrecognized strings like `'accentColour'` return `undefined`). Follow existing conventions in `packages/react/src/internal/resolvers/__tests__/tone.test.ts`
- [ ] T007 [US2] Export `themeColorToken` from `packages/react/src/index.ts` via `./theme/index.js`
- [ ] T008 [US2] Run `pnpm --filter @pathableai/react test:unit` and verify all mapping function tests pass with 100% key coverage

**Checkpoint**: Mapping function is tested and publicly exported

---

## Phase 5: User Story 4 — Build-Time Token Synchronization Check (P2)

**Goal**: Adding/removing a `--pathable-color-*` token in SCSS without updating `THEME_COLOR_KEYS` causes `pnpm lint:tokens` to fail with a descriptive message naming the mismatched token

**Independent Test**: Temporarily add a token to `_semantic.scss` without updating `THEME_COLOR_KEYS` → `pnpm lint:tokens` exits non-zero; revert and verify it passes

### Implementation for User Story 4

- [ ] T009 [US4] Add `checkThemeTokenSync()` function to `packages/styles/scripts/lint-tokens.mjs` that reuses the existing `parseScssMap()` to read the 25 `--pathable-color-*` tokens from `_semantic.scss` `$semantic-colors`, reads `packages/react/src/theme/tokens.ts` (resolved relative to `STYLES_ROOT`), regex-extracts the `THEME_COLOR_KEYS` single-quoted string literals, normalizes TS keys to kebab-case, diffs the sets, and on mismatch logs descriptive names (missing SCSS tokens by kebab name, extraneous TS keys by camelCase name) then exits non-zero. If the react theme file is absent or unparseable, exit non-zero with a clear error
- [ ] T010 [US4] Wire `checkThemeTokenSync()` into the `main()` flow of `packages/styles/scripts/lint-tokens.mjs` so it runs under the existing `pnpm lint:tokens` command (no new scripts or root `package.json` changes)
- [ ] T011 [US4] Run `pnpm lint:tokens` and verify the sync check passes with exit code 0 when all 25 keys match; then temporarily add an extraneous key to `THEME_COLOR_KEYS` (e.g. `'accentColour'`), run `pnpm lint:tokens`, confirm it fails non-zero naming `accentColour`, and revert the temporary edit

**Checkpoint**: Token drift between SCSS and TypeScript is caught automatically at lint time

---

## Phase 6: User Story 3 — Public Tone and Elevation Type Exports (P3)

**Goal**: Consumers can import `TextTone`, `SurfaceTone`, `BorderTone`, and `SurfaceElevation` from `@pathableai/react` without duplicate-export errors

**Independent Test**: Run `pnpm --filter @pathableai/react typecheck` — all four types import from the package entry point and reject values outside their defined unions

### Implementation for User Story 3

- [ ] T012 [US3] Remove `TextTone` from the `Text` component barrel export line in `packages/react/src/index.ts` (change `export type { TextProps, TextTone, TextVariant } from './components/Text/Text.js'` to `export type { TextProps, TextVariant } from './components/Text/Text.js'`). The `Text.tsx` file itself must not change — its own `export type { TextTone }` on line 6 is preserved
- [ ] T013 [US3] Add `export type { TextTone, SurfaceTone, BorderTone } from './internal/resolvers/tone.js'` to `packages/react/src/index.ts`
- [ ] T014 [US3] Add `export type { SurfaceElevation } from './internal/resolvers/surface.js'` to `packages/react/src/index.ts`
- [ ] T015 [US3] Run `pnpm --filter @pathableai/react typecheck` and verify all four tone/elevation types (`TextTone`, `SurfaceTone`, `BorderTone`, `SurfaceElevation`) resolve from the package entry point without duplicate-export TypeScript errors and reject values outside their defined unions

**Checkpoint**: All tone and elevation types are publicly importable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Full-stack validation of all changes

- [ ] T016 Run the complete validation chain: `pnpm --filter @pathableai/react lint && pnpm --filter @pathableai/react typecheck && pnpm --filter @pathableai/react test:unit && pnpm --filter @pathableai/react build && pnpm lint:tokens` — all must exit 0
- [ ] T017 [P] Run publishable-validation checks: `pnpm --filter @pathableai/react check:types && pnpm --filter @pathableai/react check:package`
- [ ] T018 Validate the scenarios described in `specs/058-theme-token-types/quickstart.md` all pass: type surface (§1), mapping function (§2), token sync (§3), and full quality gates (§4)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001) — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational
- **US2 (Phase 4)**: Depends on Foundational; exports depend on US1 (T007 depends on T004 establishing the export pattern for `./theme/index.js`)
- **US4 (Phase 5)**: Depends on Foundational (needs `tokens.ts` to exist for regex extraction) and US1 (needs `THEME_COLOR_KEYS` in its final form)
- **US3 (Phase 6)**: Depends on Foundational; can proceed independently of US1/US2/US4
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — no cross-story dependencies
- **User Story 2 (P2)**: Can start after Foundational — tests (T006) are independent; T007 (export) works best after T004 (US1 exports `ThemeColors`/`ThemeConfig`)
- **User Story 4 (P2)**: Can start after Foundational + US1 (needs `tokens.ts` file and stable key list)
- **User Story 3 (P3)**: Can start after Foundational — T012-T014 edit the same file (`index.ts`), so run sequentially within this story; no dependency on US1/US2/US4

### Within Each User Story

- Code changes before verification
- US2: Tests (T006) can be written in parallel with US1 exports (T004)
- US3: Run T012 → T013 → T014 sequentially (same file), then verify (T015)

### Parallel Opportunities

- T006 (US2 tests) can run in parallel with T004 (US1 exports in index.ts) — different files
- T017 (publishable checks) can run in parallel with T018 (quickstart validation) — different concerns
- US2 tests (T006) can start immediately after Foundational, while US1 exports are being done
- US3 and US4 can proceed in parallel after Foundational (different files)

---

## Parallel Example: User Story Tasks

```bash
# After Foundational phase completes, launch in parallel:
Task: T004 [US1] "Export ThemeColors and ThemeConfig from packages/react/src/index.ts"
Task: T006 [P] [US2] "Create packages/react/src/theme/__tests__/tokens.test.ts"

# Once T004 completes:
Task: T005 [US1] "Run pnpm --filter @pathableai/react typecheck"
Task: T007 [US2] "Export themeColorToken from packages/react/src/index.ts"

# US4 and US3 can run in parallel:
Task: T009 [US4] "Add checkThemeTokenSync() to packages/styles/scripts/lint-tokens.mjs"
Task: T012 [US3] "Remove TextTone from Text barrel in packages/react/src/index.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002–T003)
3. Complete Phase 3: User Story 1 (T004–T005)
4. **STOP and VALIDATE**: Run `pnpm --filter @pathableai/react typecheck` — ThemeColors and ThemeConfig are publicly available with type-safe autocomplete
5. This is a deployable increment: consumers can already write typed theme overrides

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Type-safe color vocabulary (MVP!)
3. Add US2 → Mapping function with tests
4. Add US4 → Automated SCSS↔TS sync check
5. Add US3 → Tone/elevation public exports
6. Polish → Full validation, publishable checks

### Parallel Team Strategy

With multiple developers (after Foundational completes):

- Developer A: User Story 1 (T004–T005)
- Developer B: User Story 2 tests (T006), then exports (T007–T008) after US1 exports established
- Developer C: User Story 4 (T009–T011) — can start alongside US1 since it only needs `tokens.ts` to exist
- Developer D: User Story 3 (T012–T015) — independent of US1/US2/US4

### Key Reminders

- `T006` [P] can start immediately after Foundational — different file from `index.ts`
- `T012` / `T013` / `T014` all modify `packages/react/src/index.ts` — run sequentially within US3
- `Text.tsx` line 6 (`export type { TextTone }`) stays unchanged — only the public barrel is modified
- `THEME_COLOR_KEYS` in `tokens.ts` is the single source of truth — the sync check regex-extracts from it, and `ThemeColors` derives from it
- No new `package.json` scripts — `checkThemeTokenSync()` is wired into the existing `pnpm lint:tokens` path
- No lint/type-check suppression anywhere — no `@ts-expect-error`, no `eslint-disable`, no rule relaxation