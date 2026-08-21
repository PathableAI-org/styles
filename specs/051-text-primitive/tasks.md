# Tasks: Text Primitive

**Input**: Design documents from `specs/051-text-primitive/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-api.md, quickstart.md

**Tests**: The feature specification explicitly requests unit tests (FR-021–FR-027) and Storybook stories (FR-028–FR-032), so test/story tasks ARE included in each user-story phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational (Blocking Prerequisites)](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 - Style Text with Semantic Roles (Priority: P1)](#phase-3-user-story-1---style-text-with-semantic-roles-priority-p1-mvp)
- [Phase 4: User Story 2 - Communicate Text Meaning with Tone (Priority: P1)](#phase-4-user-story-2---communicate-text-meaning-with-tone-priority-p1)
- [Phase 5: User Story 3 - Render as Another Text Element (Priority: P2)](#phase-5-user-story-3---render-as-another-text-element-priority-p2)
- [Phase 6: User Story 4 - Compose with Native Props, Class Names, and Refs (Priority: P2)](#phase-6-user-story-4---compose-with-native-props-class-names-and-refs-priority-p2)
- [Phase 7: User Story 5 - Support Assistive and Reading Scenarios (Priority: P3)](#phase-7-user-story-5---support-assistive-and-reading-scenarios-priority-p3)
- [Phase 8: Polish & Cross-Cutting Concerns](#phase-8-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 1](#parallel-example-user-story-1)
- [Implementation Strategy](#implementation-strategy)
- [Notes](#notes)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions
- Tasks modifying the SAME file run sequentially (no [P])

## Path Conventions

- **Monorepo library**: `packages/styles/...`, `packages/react/...` (see plan.md)
- Stories: `packages/react/src/stories/components/Text/Text.stories.tsx`
- Tests: `packages/react/src/components/Text/__tests__/Text.test.tsx`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify the environment and baseline before any changes

- [ ] T001 Verify baseline: run `pnpm install` (if needed), `pnpm --filter @pathableai/styles build`, and `pnpm --filter @pathableai/react test:unit` to confirm a green workspace before changing files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The `pathable-text` SCSS contract and additive tokens in `packages/styles` MUST exist before ANY user story can be implemented. The React wrapper only maps to verified classes.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T002 Create `packages/styles/src/pathable-component-wrappers/pathable-text.scss` with the base `.pathable-text` class (sets `font-family: var(--pathable-font-body)`, `color: var(--pathable-text-color, var(--pathable-color-text))`, and token-driven font-size/line-height/weight via per-role custom properties) and the variant modifiers `.pathable-text--body` (→ body-md 16/24), `.pathable-text--small` (→ body-sm 14/20), `.pathable-text--caption` (→ caption-md 12/16). All values MUST resolve to `--pathable-*` tokens — no literal `px` in the contract. (See research.md Decision 1 & 2.)
- [ ] T003 Extend `packages/styles/src/pathable-component-wrappers/pathable-text.scss` with tone modifiers `.pathable-text--tone-default` → `var(--pathable-color-text)`, `.pathable-text--tone-muted` → `var(--pathable-color-text-muted)`, `.pathable-text--tone-danger` → `var(--pathable-color-danger)`, `.pathable-text--tone-success` → `var(--pathable-color-text-success)`. (Same file as T002, sequential.)
- [ ] T004 [P] Add `@forward 'pathable-text';` to `packages/styles/src/pathable-component-wrappers/pathable-typography.scss` so the contract is exported through the typography bundle (which is forwarded by `pathable-all.scss` → `_index.scss` → `index.scss`).
- [ ] T005 [P] Add additive line-height tokens to `packages/styles/src/_typography.scss` in the `$typography-tokens` map (dual `--pathable-font-line-height-body-sm` ≈ 1.43 for `small` and `--pathable-font-line-height-caption-md` ≈ 1.33 for `caption`; `--pathable-font-line-height-body` 1.5 already exists for `body`). Do NOT modify existing token entries.
- [ ] T006 [P] Add `--pathable-color-text-success` to `packages/styles/src/_semantic.scss` (deep jade value vetted to pass WCAG AA ≥ 4.5:1 on `--pathable-color-surface`). Additive only; the existing brand `--pathable-color-success` remains untouched.
- [ ] T007 Run `pnpm --filter @pathableai/styles build` and `pnpm --filter @pathableai/styles lint:styles && lint:tokens`; verify compiled output contains `.pathable-text`, the variant/tone modifiers, and the new tokens, with no lint or token violations.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel (US1/US2 share the component file and must sequence between phases).

---

## Phase 3: User Story 1 - Style Text with Semantic Roles (Priority: P1) 🎯 MVP

**Goal**: A developer renders `<Text variant="body|small|caption">` and gets a correctly styled text element with the right typography class (source: `pathable-text.scss`).

**Story tests**: Spec FR-021 (each variant → correct class), FR-007 (default `p`), FR-013 (class merge order), FR-015 (no wrapper).

### Tests & Skills

- [ ] T008 [P] [US1] Create `packages/react/src/components/Text/Text.tsx` with `TextVariant` type (`'body' | 'small' | 'caption'`), local `TEXT_VARIANT_CLASS` record mapping to `pathable-text--{variant}`, and a `TextInner`/`forwardRef` component that renders `pathable-text` base class + variant modifier via `mergeClasses()` (order: base → variant → consumer `className`). Default rendered element is `p`.
- [ ] T009 [P] [US1] Write unit tests in `packages/react/src/components/Text/__tests__/Text.test.tsx` covering: default render produces a single `<p class="pathable-text">`; each variant maps to the correct modifier class (`pathable-text--body|small|caption`); `className` when passed; remains as a single root node (no extra elements). Follow existing Stack test conventions (`@testing-library/react`, `classList` helper).
- [ ] T010 [US1] Export `Text` and its types from `packages/react/src/index.ts` (`export { Text } ...` and `export type { TextProps, TextVariant, TextTone } from './components/Text/Text.js'` — add `TextTone` after US2, or export it initially as the type is defined in Text.tsx).
- [ ] T011 [US1] Create `packages/react/src/stories/components/Text/Text.stories.tsx` with `Meta` (autodocs, `argTypes` for `variant`, `tone`, `as`, `className`), a `Default` story (`<Text>Example</Text>`), and a `Body` story `<Text variant="body">…</Text>`. Deterministic, synthetic copy.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Communicate Text Meaning with Tone (Priority: P1)

**Goal**: A developer `<Text tone="muted|danger|success|default">` receives the correct semantic tone class from `pathable-text--tone-*`.

**Story**: Spec FR-022 (each tone → correct class), FR-010 (validated union).

- [ ] T012 [P] [US2] Extend `packages/react/src/components/Text/Text.tsx` with `tone?: TextTone` (`'default' | 'muted' | 'danger' | 'success'`), `TEXT_TONE_CLASS` record, and merge the tone class after the variant class in `mergeClasses` (order: base → variant → tone → consumer `className`). `tone="default"` explicitly emits `pathable-text--tone-default` (deterministic).
- [ ] T013 [P] [US2] Add tone tests to `packages/react/src/components/Text/__tests__/Text.test.tsx`: each tone maps to the right modifier; variant+tone combination yields both classes in order; omitted tone yields no tone class.
- [ ] T014 [US2] Add `SmallMuted` story (`<Text variant="small" tone="muted">`) and `CaptionDanger` story (`<Text variant="caption" tone="danger">`) to `packages/react/src/stories/components/Text/Text.stories.tsx` (FR-029, FR-030).

**Checkpoint**: User Stories 1 AND 2 work independently.

---

## Phase 5: User Story 3 - Transform as Another Text Element (Priority: P2)

**Goal**: `<Text as="span|label|figcaption">` renders the selected element with typography/tone classes, and native props are restricted to that element (generic polymorphic typing, FR-012).

- [ ] T015 [P] [US3] Implement generic polymorphic typing in `packages/react/src/components/Text/Text.tsx` per data-model.md Decision 5: `TextOwnProps` (variant/tone/children/className) and `TextProps<C extends keyof React.JSX.IntrinsicElements = 'p'> = TextOwnProps & Omit<React.ComponentPropsWithRef<C>, keyof TextOwnProps | 'color'>`, with an inner generic `Text<C>` that casts `as ?? 'p'` to `React.ElementType` and ref overload to `ForwardedRef<Element>`.
- [ ] T016 [P] [US3] Add tests to `packages/react/src/components/Text/__tests__/Text.test.tsx`: `as="span"` renders `<span>`; `as="label"` accepts `htmlFor` (renders `for`); `as="figcaption"` renders `<figcaption>`; type-level check that `htmlFor` on default `p` is a TypeScript error (FR-023).
- [ ] T017 [US3] Add an `AsSemanticElements` story to `packages/react/src/stories/components/Text/Text.stories.tsx` showing `p`, `span`, `label` (with `htmlFor`), and `figcaption` outputs.

**Checkpoint**: User Stories 1–3 independently functional.

---

## Phase 6: User Story 4 - Compose with Native Props, Class Names, and Refs (Priority: P2)

**Goal**: `className` composition, native props, ref forwarding, and SSR purity (FR-013/014/015/017/025/027).

- [ ] T018 [P] [US4] Add tests to `packages/react/src/components/Text/__tests__/Text.test.tsx`: consumer `className` always appears last (FR-013/25); `ref` forwarding returns the DOM element with correct tag matching `as` (FR-024); no wrapper/DOM node between root and children (FR-025).
- [ ] T019 [P] [US4] Add an SSR-purity test to `packages/react/src/components/Text/__tests__/Text.test.tsx` using `renderToString`/`renderToStaticMarkup` from `react-dom/server` verifying the class string and markup are identical across renders for a representative prop combination (FR-017/FR-027).
- [ ] T020 [US4] Extend `packages/react/src/stories/components/Text/Text.stories.tsx` with a composition story (e.g., a `ParagraphWithMeta` or `InlineWithProps`) demonstrating native props + `className` composition with a ref showcase if practical. Ensure it stays deterministic.

**Checkpoint**: User Stories 1–4 functional; component is production-composition ready.

---

## Phase 7: User Story 5 - Support Assistive and Reading Scenarios (Priority: P3)

**Goal**: Document and validate accessibility obligations for all supported variant/tone combinations (SC-006, SC-007).

- [ ] T021 [P] [US5] Record contrast evidence in the feature branch: compute and document WCAG AA contrast ratios for `default` (#00365c), `muted` (#015a76), `danger` (#dc3545), and `success` (new text-success token) on `--pathable-color-surface`, confirming each ≥ 4.5:1; document that the `success` tone uses the AA-safe text token (capture in `research.md`/quickstart evidence; reference the decision in a comment in `_semantic.scss`).
- [ ] T022 [US5] Verify rendered accessibility in the React Storybook: run `pnpm --filter @pathable/storybook-react build-storybook` and `pnpm --filter @pathable/storybook-react test-storybook` (or root `pnpm test:storybook-react`); ensure NO `Text` stories appear in `skipA11yStoryIds`/`colorContrastExceptionStoryIds` in `apps/storybook-react/.storybook/test-runner.js` (Constitution X, quickstart a11y check).

**Checkpoint**: All user stories complete; accessibility evidence gathered.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Full validation, docs, and cross-cutting checks

- [ ] T023 [P] Run build + type + package checks: `pnpm --filter @pathableai/styles build`, `pnpm --filter @pathableai/react build`, `pnpm --filter @pathableai/react exec tsc --noEmit`, `pnpm --filter @pathableai/react check:package`, `pnpm --filter @pathableai/react check:types` — all must pass.
- [ ] T024 [P] Run the full unit suite with the primitive regression pattern: `pnpm --filter @pathableai/react test:unit -- --testPathPattern="Text|Grid|Stack|Inline|Cluster|Container"` — all must pass.
- [ ] T025 [P] Run root quality gates: `pnpm lint` (eslint, stylelint, markdownlint, prettier check, token lint) — must pass with ZERO warnings; fix findings without disabling/suppressing any rule.
- [ ] T026 Execute the manual and automated checks in `specs/051-text-primitive/quickstart.md` (SCSS contract content check, manual DOM inspection, forced-colors spot-check, server-compat `server-render` check) and record results.
- [ ] T027 Update `docs/plans/semantic-react/09-text-primitive.md` Status line from `NOT STARTED` to `DONE`, and record the audit/evidence notes (which SCSS contracts support which roles/tones, contrast+forced-colors evidence).
- [ ] T028 Final review: `git status`/`git diff` — confirm no new lint suppressions, no unintended changes, and everything ready for merge.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — baseline verification only
- **Foundational (Phase 2)**: Depends on Setup; BLOCKS all user stories (SCSS contract must exist first per Constitution I)
- **US1 (P1)**: After Foundational
- **US2 (P1)**: After Foundational + US1 (extends `Text.tsx`)
- **US3 (P2)**: After US1 (generic typing in `Text.tsx`)
- **US4 (P2)**: After US1/US2/US3 (compose features)
- **US5 (P3)**: After Stories phase (US1–US4) built for a11y verification
- **Polish (Final)**: Depends on all user stories

### User Story Dependencies

- **US1 (P1 MVP)**: Can start after Foundational (Phase 2) — no story deps
- **US2 (P1)**: Depends on US1 (`Text.tsx`)
- **US3 (P2)**: Depends on US1 (`Text.tsx`)
- **US4 (P2)**: Depends on US1/US2/US3
- **US5 (P3)**: Depends on US1/US2/US3/US4 stories

### Within Each User Story

- Tests requested (FR-021..FR-027) are included; write tests in the same story phase before the matching behavior where practical (TDD), ensuring they FAIL before implementation and PASS after
- The contract (`contracts/component-api.md`) is the source of truth for class merge order and SSR contract
- `Text.tsx` is SHARED across US1–US4; tasks within the same phase running on it must remain sequential (no parallel edits to the same file)

### Parallel Opportunities

- Phase 2 SCSS tasks T004/T005/T006 are [P] (different files/modules)
- Within US1: T008/T009/T010 are [P] (component, tests, export) — T011 (stories) sequential on stories file
- US2: T012/T013 parallel; T014 sequential (stories)
- US3: T015/T016 parallel; then T017
- US4: T018/T019 parallel; T020 sequential (stories)
- US5: T021/T022 parallel
- Polish: T022–T025 parallel; T026–T027 sequential after

---

## Parallel Example: User Story 1

```bash
# Launch tests and component together (different files):
Task: "Create Text.tsx (T008)"
Task: "Write Text.test.tsx tests (T009)"

# After T008/T009:
Task: "Export Text from index.ts (T010)"
Task: "Create Text.stories.tsx (T011)"
```

Similarly for US2: T012 (component) and T013 (tests) parallel, then T014 (stories).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: baseline verification
2. Complete Phase 2: SCSS contract + tokens (CRITICAL — blocks all)
3. Complete Phase 3: User Story 1 (`Text` base + variants + tests + Body story)
4. **STOP and VALIDATE**:
   ```bash
   pnpm --filter @pathableai/react test:unit -- --testPathPattern="Text"
   pnpm --filter @pathableai/styles build
   pnpm --filter @pathableai/react build
   ```
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → foundation ready
2. Add US1 (variants) → test → demo (MVP!)
3. Add US2 (tones) → test → demo (full P1)
4. Add US3 (as) → test → demo
5. Add US4 (composition/ref/SSR) → test → demo
6. Add US5 (a11y evidence) → validate
7. Polish (lint, gates, docs DONE)

### Parallel Team Strategy

- Foundation (Phase 2) built by one owner
- Once done: Developer A continues US1→US2 (Text.tsx serial), Developer B prepares stories/tests in parallel (stories/tests files independent)
- US5 can be owned by a single a11y reviewer after stories exist

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to user story for traceability
- Do NOT edit `packages/styles/src/_uswds-theme.scss`, `_utilities.scss`, or any existing token values — changes are strictly additive
- Token lint `packages/styles/scripts/lint-tokens.mjs` and stylelint `src/**/*.scss` must pass; no lint rule disabling allowed (Constitution + `.cursor/rules/lint-discipline`)
- Keep the SCSS contract free of hardcoded values; reference `--pathable-*` tokens
- Commit after each logical group or story (per repo convention; hooks auto-commit in later Speckit steps)