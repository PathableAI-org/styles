# Tasks: Semantic Color and Tone Model

**Input**: Design documents from `specs/053-semantic-color-tones/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/tone-vocabulary.md, quickstart.md

**Tests**: The feature specification explicitly requests unit tests (spec FR-017 through FR-020) for tone-to-class mapping, runtime fallback, and server purity, so test tasks ARE included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 - Request Meaning Instead of Palette Values (Priority: P1)](#phase-3-user-story-1---request-meaning-instead-of-palette-values-priority-p1-mvp)
- [Phase 4: User Story 2 - Text Adopts the Shared Tone Vocabulary (Priority: P1)](#phase-4-user-story-2---text-adopts-the-shared-tone-vocabulary-priority-p1)
- [Phase 5: User Story 4 - Shared TypeScript Types Exist for Consumers (Priority: P2)](#phase-5-user-story-4---shared-typescript-types-exist-for-consumers-priority-p2)
- [Phase 6: User Story 3 - Every Tone Role Is Grounded in a Verified Contract (Priority: P2)](#phase-6-user-story-3---every-tone-role-is-grounded-in-a-verified-contract-priority-p2)
- [Phase 7: User Story 5 - Contrast and Forced-Colors Behavior Is Evidenced (Priority: P3)](#phase-7-user-story-5---contrast-and-forced-colors-behavior-is-evidenced-priority-p3)
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
- Internal type layer: `packages/react/src/internal/resolvers/`
- Component: `packages/react/src/components/Text/Text.tsx`
- Tests: `packages/react/src/internal/resolvers/__tests__/tone.test.ts`
- Vocabulary contract: `specs/053-semantic-color-tones/contracts/tone-vocabulary.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify the environment and baseline before any changes

- [x] T001 Verify baseline: run `pnpm install` (if needed), `pnpm --filter @pathableai/styles build`, and `pnpm --filter @pathableai/react test:unit -- --testPathPattern="Text|tone"` to confirm a green workspace before changing files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shared `tone.ts` internal type module MUST exist before any user story can be implemented. `Text` (US2) imports `TextTone` from it, and every story's tests depend on `textToneClass`.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Create `packages/react/src/internal/resolvers/tone.ts` defining the three shared tone type unions and the pure `textToneClass` resolver:

  - `export type TextTone = 'default' | 'muted' | 'danger' | 'success'`
  - `export type SurfaceTone = 'default' | 'subtle' | 'primary'`
  - `export type BorderTone = 'default' | 'danger'`
  - `const TEXT_TONE_CLASS` record mapping each `TextTone` to its class:
    - `default` → `pathable-text--tone-default`
    - `muted` → `pathable-text--tone-muted`
    - `danger` → `pathable-text--tone-danger`
    - `success` → `pathable-text--tone-success`
  - `export function textToneClass(value?: string | null): string | undefined` — returns the mapped class for a valid `TextTone`, `undefined` for `null`/`undefined`/unknown strings (runtime fallback).

  Include doc comments on each type recording the tone → SCSS source → token mapping, and mark `SurfaceTone`/`BorderTone` as tracked gaps (see research.md Decisions 1–4 and `contracts/tone-vocabulary.md`). No browser globals; pure deterministic lookup (mirror the existing `colorTone.ts` `textColorClass` pattern).

- [x] T003 [P] Re-export the tone types from `packages/react/src/internal/resolvers/types.ts`: add `import type { TextTone, SurfaceTone, BorderTone } from './tone.js'` and add matching `export type { ... } from './tone.js'` lines (follow the existing `BackgroundColor`/`TextColor` pattern in that file).

- [x] T004 [P] Re-export the tone types and resolver from the internal barrel `packages/react/src/internal/resolvers/index.ts`: add `TextTone`, `SurfaceTone`, `BorderTone` to the type-export block (from `./types.js`) and add `export { textToneClass } from './tone.js'` to the function-export block (alongside `backgroundColorClass`/`textColorClass`).

**Checkpoint**: Foundation ready — `TextTone`, `SurfaceTone`, `BorderTone`, and `textToneClass` are importable from the internal barrel. User story implementation can begin.

---

## Phase 3: User Story 1 - Request Meaning Instead of Palette Values (Priority: P1) 🎯 MVP

**Goal**: A developer can request a semantic tone (`danger`, `muted`) and confirm it resolves to a deterministic design-system class — never a palette value. The canonical vocabulary document and mapping tests prove this.

**Story tests**: Spec FR-001 (vocabulary document), FR-002 (theme-independent), FR-003 (deterministic), FR-004 (text tone roles), FR-017 (tone→class mapping), FR-018 (runtime fallback), FR-019 (server purity).

### Implementation for US1

- [x] T005 [P] [US1] Finalize the canonical tone vocabulary in `specs/053-semantic-color-tones/contracts/tone-vocabulary.md`: confirm the three type unions, the `textToneClass` resolver contract table (each input → class, `null`/`undefined`/unknown → `undefined`), the class merge order, and the full tone → SCSS source → resolved class / gap mapping (text VERIFIED; surface/border GAP). Ensure it matches `research.md` "Tone Vocabulary (canonical record)" exactly — no unverified tone advertised without a documented gap.

- [x] T006 [P] [US1] Write `packages/react/src/internal/resolvers/__tests__/tone.test.ts` covering `textToneClass`: each valid `TextTone` maps to its correct class (`default`→`pathable-text--tone-default`, `muted`→`...muted`, `danger`→`...danger`, `success`→`...success`); `undefined` and `null` return `undefined`; an invalid string (e.g. `'red-600'` or `'unknown'`) returns `undefined` (runtime fallback). Follow the `colorTone.test.ts` pattern (`describe`/`it`/`expect`, `forEach` over value/expected pairs).

**Checkpoint**: User Story 1 complete — the tone vocabulary is documented and the text tone mapping is verified independently of any component.

---

## Phase 4: User Story 2 - Text Adopts the Shared Tone Vocabulary (Priority: P1)

**Goal**: `Text`'s `tone` prop is typed from the shared `TextTone` union instead of an inline union, with no change to rendered tone classes.

**Story tests**: Spec FR-015 (Text consumes shared TextTone), FR-016 (no surface/border tone on Text), FR-020 (Text behavior unchanged).

### Implementation for US2

- [x] T007 [US2] Update `packages/react/src/components/Text/Text.tsx` to consume the shared type and resolver: remove the inline `export type TextTone = 'default' | 'muted' | 'danger' | 'success'` declaration and the local `TEXT_TONE_CLASS` map; import `TextTone` and `textToneClass` from `../../internal/resolvers/index.js` (or the module directly); use `textToneClass(tone)` in the `mergeClasses(...)` call in place of the local map lookup. Preserve the exact class merge order (`pathable-text` → variant → tone → consumer `className`) and the public `TextTone` type re-export (if `Text.tsx` re-exported it, keep `export type { TextTone }` re-exporting from the internal layer so consumers that imported it from `Text` remain valid). No other prop/behavior changes.

- [x] T008 [P] [US2] Run and verify the existing `Text` tests are unchanged and green: `pnpm --filter @pathableai/react test:unit -- --testPathPattern="Text"`. If any `Text` test imported `TextTone` from the component path, update the import to the internal barrel. Confirm the rendered class output for `tone="default|muted|danger|success"` is byte-for-byte identical to before (no regression per FR-020).

**Checkpoint**: User Stories 1 & 2 complete — `Text` now consumes the shared tone vocabulary with identical rendered output.

---

## Phase 5: User Story 4 - Shared TypeScript Types Exist for Consumers (Priority: P2)

**Goal**: Component authors can import `TextTone`, `SurfaceTone`, `BorderTone` from the internal layer; each union has the agreed values. `SurfaceTone`/`BorderTone`/`textToneClass` stay internal while `TextTone` remains public via `Text`.

**Story tests**: Spec FR-011 (TextTone), FR-012 (SurfaceTone), FR-013 (BorderTone), FR-014 (internal, not public).

### Implementation for US4

- [x] T009 [P] [US4] Add type-level assertions to `packages/react/src/internal/resolvers/__tests__/tone.test.ts` using Vitest's `expectTypeOf` (from `vitest`): `expectTypeOf<'default' | 'muted' | 'danger' | 'success'>().toEqualTypeOf<TextTone>()`; similarly for `SurfaceTone` and `BorderTone`. Import the types from `../tone`. Do NOT use `@ts-expect-error` (repo lint-discipline rule prohibits it without human approval); compile-time rejection of out-of-union values is the union type's inherent behavior, verified by `tsc --noEmit` in the Polish phase.

- [x] T010 [US4] Verify the public/internal boundary: confirm `packages/react/src/index.ts` exports `TextTone` only via the `Text` API re-export (for compatibility) and does NOT export `SurfaceTone`, `BorderTone`, or `textToneClass` (grep the public entry point). Record the finding in `specs/053-semantic-color-tones/research.md` (Decision 4 / FR-014).

**Checkpoint**: User Stories 1–4 complete — shared types exist and are validated; `SurfaceTone`/`BorderTone`/`textToneClass` are internal, `TextTone` is public via `Text`.

---

## Phase 6: User Story 3 - Every Tone Role Is Grounded in a Verified Contract (Priority: P2)

**Goal**: A maintainer can consult the vocabulary and confirm every tone role resolves to a verified SCSS contract or a documented tracked gap.

**Story tests**: Spec FR-005 (surface roles), FR-006 (border roles), FR-007 (verified contract per role), FR-008 (gap recording).

### Implementation for US3

- [x] T011 [US3] Verify and finalize the gap records in `specs/053-semantic-color-tones/research.md` and `specs/053-semantic-color-tones/data-model.md`: confirm `SurfaceTone` (`default`/`subtle`/`primary`) is recorded as a tracked gap owned by feature 12 (`Surface`), with the unresolved `primary` token mapping noted (`--pathable-color-accent` vs `--pathable-color-action-primary-bg`); confirm `BorderTone` (`default`/`danger`) is recorded as a tracked gap with no owner. Confirm no gap advertises an unverified class. Cross-check against the actual `packages/styles/src/pathable-component-wrappers/pathable-surface.scss` (depth variants, not tone roles) and `packages/styles/src/_semantic.scss` (border/surface tokens exist) so the gap justifications are accurate.

**Checkpoint**: User Stories 1–5 complete — every advertised tone is grounded (verified contract or tracked gap).

---

## Phase 7: User Story 5 - Contrast and Forced-Colors Behavior Is Evidenced (Priority: P3)

**Goal**: Documented contrast and forced-colors evidence exists for every tone role; surface/border obligations are deferred with their gaps.

**Story tests**: Spec FR-021 (contrast evidence), FR-022 (forced-colors evidence).

### Implementation for US5

- [x] T012 [US5] Record/verify accessibility evidence in `specs/053-semantic-color-tones/research.md` (Decision 5): confirm text tone contrast ratios are present (default 12.48:1, muted 7.71:1, danger 4.53:1, success 5.27:1 — all WCAG AA ≥ 4.5:1 on `--pathable-color-surface`), confirm the forced-colors note is present (semantic tokens map through system colors; color is never the sole signal), and confirm surface/border contrast obligations are explicitly deferred to their tracked gaps. No `packages/styles` or rendered-UI change is introduced by this feature, so no new axe/contrast check is required.

**Checkpoint**: All user stories complete — accessibility evidence gathered for the tone vocabulary.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Full validation, docs, and cross-cutting checks

- [x] T013 [P] Run build + type checks: `pnpm --filter @pathableai/react build` and `pnpm --filter @pathableai/react exec tsc --noEmit` — must pass (confirms the internal re-exports and `Text` type migration compile cleanly).

- [x] T014 [P] Run the full resolver + primitive regression suite: `pnpm --filter @pathableai/react test:unit -- --testPathPattern="tone|Text|Heading|Grid|Stack|Inline|Cluster|Container"` — all must pass (tone resolver tests green; no regressions from the `Text` change).

- [x] T015 [P] Run root quality gates: `pnpm lint` (eslint, stylelint, markdownlint, prettier check, token lint) — must pass with ZERO warnings; fix findings without disabling/suppressing any rule. No SCSS changed in this feature, so stylelint/token-lint impact is nil but still run.

- [x] T016 Execute the checks in `specs/053-semantic-color-tones/quickstart.md`: tone types present in the internal layer, only `TextTone` public (via `Text`), `Text` imports the shared type, `tone`/`Text` unit tests pass, `purity` test passes, build succeeds. Record results.

- [x] T017 Update `docs/plans/semantic-react/11-semantic-colors-tones.md`: set Status `NOT STARTED` → `DONE`, and add Audit Notes mirroring the research findings (text tone contract verified from `pathable-text.scss`; `TextTone`/`SurfaceTone`/`BorderTone` types added in `internal/resolvers/tone.ts`; surface/border tones recorded as tracked gaps owned by feature 12 / future boundary work; contrast evidence).

- [x] T018 Final review: `git status`/`git diff` — confirm no new lint suppressions, no unintended changes to `packages/styles`, no public export of `SurfaceTone`/`BorderTone`/`textToneClass`, and everything ready for merge.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — baseline verification only
- **Foundational (Phase 2)**: Depends on Setup; BLOCKS all user stories (`tone.ts` must exist first)
- **US1 (P1)**: After Foundational (vocabulary finalize + resolver tests)
- **US2 (P1)**: After Foundational (`Text.tsx` imports `TextTone`); no dependency on US1
- **US4 (P2)**: After Foundational (type-level tests); no dependency on US1/US2
- **US3 (P2)**: After Foundational (gap record verification); independent of US1/US2/US4
- **US5 (P3)**: Independent documentation/evidence; can run any time after Foundational
- **Polish (Final)**: Depends on all user stories

### User Story Dependencies

- **US1 (P1 MVP)**: After Foundational — no story deps
- **US2 (P1)**: After Foundational — no story deps (uses `tone.ts` only)
- **US4 (P2)**: After Foundational — no story deps
- **US3 (P2)**: After Foundational — no story deps
- **US5 (P3)**: After Foundational — no story deps

All five stories are effectively independent once `tone.ts` exists; the only shared files are the internal `tone.ts`/`types.ts`/`index.ts` (created once in Foundational) and `research.md`/`data-model.md`/`contracts/tone-vocabulary.md` (documentation — edit sequentially).

### Within Each User Story

- `contracts/tone-vocabulary.md` is the source of truth for tone → class / gap mapping
- `tone.ts` is SHARED — created once in Foundational; only tests reference it after
- `tone.test.ts` is SHARED across US1 (mapping/fallback tests) and US4 (type-level assertions) — append sequentially
- `research.md` and `data-model.md` are SHARED documentation — edit sequentially

### Parallel Opportunities

- Phase 2: T003/T004 are [P] (different files: `types.ts` vs `index.ts`), both after T002
- US1: T005/T006 are [P] (different files: contract vs test)
- US2: T007 (Text.tsx) then T008 (verify); T007 must precede T008
- US4: T009/T010 are [P] (test file vs research.md), then T010's grep check
- US3, US5: single tasks, independent of each other
- Polish: T013/T014/T015 are [P]; T016–T018 sequential after

---

## Parallel Example: Foundational Phase

```bash
# After T002 creates tone.ts:
Task: "Re-export types from types.ts (T003)"
Task: "Re-export types + resolver from index.ts (T004)"   # parallel with T003
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: baseline verification
2. Complete Phase 2: `tone.ts` type module + re-exports (CRITICAL — blocks all)
3. Complete Phase 3: US1 (vocabulary + `textToneClass` mapping tests)
4. Complete Phase 4: US2 (`Text` adopts shared `TextTone`)
5. **STOP and VALIDATE**:
   ```bash
   pnpm --filter @pathableai/react test:unit -- --testPathPattern="tone|Text"
   pnpm --filter @pathableai/react build
   ```
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 (vocabulary + mapping tests) → test → demo (MVP!)
3. US2 (`Text` migration) → test → demo
4. US4 (type-level validation) → verify types
5. US3 (gap records) → verify grounding
6. US5 (a11y evidence) → verify evidence
7. Polish (build, lint, docs DONE)

### Parallel Team Strategy

- Foundation (Phase 2) built by one owner
- Once `tone.ts` exists, all five stories can proceed in parallel (US1 tests, US2 Text migration, US4 type assertions, US3 gap verification, US5 evidence) since they touch disjoint files except the shared documentation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to user story for traceability
- This feature introduces **NO SCSS changes, NO new tokens, and NO new components** — it is a type-relocation + vocabulary record. Do NOT edit `packages/styles/src/**` (see research.md Decision 3; surface/border tones are tracked gaps).
- `Text.tsx` must render byte-for-byte identical class output for all four tones after the migration (FR-020).
- `SurfaceTone`/`BorderTone` are type-only forward declarations — no resolvers until their SCSS contracts exist (feature 12).
- Do NOT use `@ts-expect-error` / `@ts-ignore` in tests (repo `.cursor/rules/lint-discipline.mdc` prohibits it without human approval); verify compile-time rejection via the union type + `tsc --noEmit`.
- `SurfaceTone`/`BorderTone` and `textToneClass` remain internal — do NOT export them from `packages/react/src/index.ts` (spec FR-014). `TextTone` stays public via the `Text` API re-export.
- Do not disable or suppress any lint rule; fix findings at the source (Constitution + lint-discipline rule).
- Commit after each logical group or story.
