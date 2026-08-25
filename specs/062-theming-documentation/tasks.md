# Tasks: Theming Documentation and End-to-End Validation

**Input**: Design documents from `specs/062-theming-documentation/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are explicitly required — the rendered end-to-end test is a core deliverable (US1). Other stories are documentation artifacts validated by review and existing gates.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup](#phase-1-setup)
- [Phase 2: User Story 1 - End-to-end partial theme resolution (P1)](#phase-2-user-story-1---end-to-end-proof-that-a-partial-theme-resolves-colors-priority-p1)
- [Phase 3: User Story 2 - Backward compatibility (P1)](#phase-3-user-story-2---backward-compatibility-no-provider-means-identical-rendering-priority-p1)
- [Phase 4: User Story 3 - Token vocabulary reference (P2)](#phase-4-user-story-3---discover-what-each-token-controls-priority-p2)
- [Phase 5: User Story 4 - Consumer guide (P2)](#phase-5-user-story-4---follow-a-short-guide-to-override-extend-and-choose-a-path-priority-p2)
- [Phase 6: User Story 5 - Parent acceptance criteria close-out (P3)](#phase-6-user-story-5---every-parent-acceptance-criterion-is-closed-out-priority-p3)
- [Phase 7: Polish and Cross-Cutting Concerns](#phase-7-polish-and-cross-cutting-concerns)
- [Dependencies and Execution Order](#dependencies-and-execution-order)
- [Parallel Example: User Story 1 + User Story 3](#parallel-example-user-story-1--user-story-3)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Docs**: `docs/theming/` (new directory, canonical documentation surface per constitution XII)
- **Storybook stories**: `packages/react/src/stories/components/theme/`
- **Test runner**: `apps/storybook-react/.storybook/test-runner.js`
- **Package READMEs**: `packages/react/README.md`, `packages/styles/README.md`
- No `packages/styles` or `packages/react` runtime source is modified (FR-015)

---

## Phase 1: Setup

**Purpose**: Create the documentation directory and verify existing infrastructure.

- [X] T001 Create `docs/theming/` directory (all three docs artifacts will live here per plan.md § Project Structure)

---

## Phase 2: User Story 1 - End-to-end proof that a partial theme resolves colors (Priority: P1)

**Goal**: Add a deterministic Storybook story rendering `AppShell` under a partial `ThemeProvider` theme, and wire browser-executed assertions proving overridden tokens resolve to provided values, unspecified tokens resolve to defaults, and overrides are scoped to the provider subtree.

**Why this priority**: This is the decisive correctness evidence for the entire theming series. Without a working rendered proof, the documented API is not trustworthy.

**Independent Test**: Run `pnpm test:storybook-react` — the new story renders, its browser assertions pass, and a11y checks pass.

### Implementation for User Story 1

- [X] T002 [US1] Add `AppShellUnderPartialTheme` story in `packages/react/src/stories/components/theme/ThemeProvider.stories.tsx` — renders React `AppShell` wrapped in `<ThemeProvider theme={brand}>` where `brand = createTheme({ colors: { accent: '#7c3aed', actionPrimaryBg: '#7c3aed' } })`. Use deterministic synthetic content, no dates/randomness/network. Include a sibling element outside the provider subtree to enable scoping assertion (FR-008). The story must include a `parameters.docs.description` explaining its intent as a partial-theme resolution proof.
- [X] T003 [US1] Wire browser-executed assertion in `apps/storybook-react/.storybook/test-runner.js` keyed to the new story id (`components-themeprovider--app-shell-under-partial-theme`). Assert: (a) overridden tokens resolve to `#7c3aed` via `getComputedStyle(el).getPropertyValue('--pathable-color-accent')` (FR-006), (b) unspecified tokens resolve to defaults via `getComputedStyle(el).getPropertyValue('--pathable-color-text')` equals `#00365c` (FR-007), (c) element inside provider subtree resolves override while sibling outside resolves default (FR-008), (d) `ThemeProvider` with `defaultTheme` renders children with no wrapper element (backward-compat supplement). Use semantic selectors (role/label/visible text) over `data-testid` where possible. For tokens with no convenient rendered consumer, inspect the provider wrapper's inline custom property and document the limitation in a comment.
- [X] T004 [US1] Run `pnpm build --filter @pathableai/styles` and `pnpm build --filter @pathableai/react`, then `pnpm test:storybook-react` to confirm the new story renders, all browser assertions pass, a11y checks pass, and the story does not appear in the a11y-exception lists already present in `test-runner.js`.

**Checkpoint**: The rendered end-to-end test passes — overridden tokens resolve to provided values, unspecified tokens fall through to defaults, and overrides stay scoped.

---

## Phase 3: User Story 2 - Backward compatibility: no provider means identical rendering (Priority: P1)

**Goal**: Verify and document that rendering with no `ThemeProvider` is identical to the pre-theming state. No new fixtures are created; this is evidenced by existing gates.

**Why this priority**: Backward compatibility is a release gate. The theming work is only safe to ship if the no-theme path is provably unchanged.

**Independent Test**: Run `pnpm test:visual` and `pnpm test:storybook-react` — all canonical no-Provider stories pass visual smoke and contract checks identically to the pre-theming baseline.

### Implementation for User Story 2

- [X] T005 [US2] Run `pnpm test:visual` on the no-provider path — confirm all canonical stories pass visual smoke at three viewports with no regressions. Record the result as backward-compat evidence.
- [X] T006 [US2] Run `pnpm test:storybook-react` on the no-provider path — confirm all story contract and a11y checks pass identically to the pre-theming baseline. Record the result as backward-compat evidence.

**Checkpoint**: Backward compatibility is verified — the no-provider rendering path is confirmed identical to the pre-theming state by existing gates.

---

## Phase 4: User Story 3 - Discover what each token controls (Priority: P2)

**Goal**: Create the token vocabulary reference (`docs/theming/token-vocabulary.md`) — a single table mapping every `ThemeColors` key to its CSS custom property, default value, and plain-language role.

**Why this priority**: Discoverability is a core deliverable. Without a complete vocabulary reference, consumers must reverse-engineer the compiled stylesheet or the theme type to learn what they can override.

**Independent Test**: Read the reference and confirm it lists all 25 public color tokens with property, default value, and role. Cross-reference with `defaultTheme.colors` to confirm no omissions and no invented tokens.

### Implementation for User Story 3

- [X] T007 [US3] Create token vocabulary reference at `docs/theming/token-vocabulary.md` per contract `contracts/token-vocabulary.md`. Include one markdown table with columns: Key (camelCase `ThemeColors` key), CSS Custom Property (`--pathable-color-*` in kebab-case), Default Value (lowercase hex from `defaultTheme.colors`), and Role (plain-language description of what each token controls). All 25 keys in `THEME_COLOR_KEYS` order (authoritative order in `packages/react/src/theme/tokens.ts`). Key-to-property mapping must match the existing `THEME_COLOR_TOKEN_MAP` (feature 058 `contracts/theme-types.md`). Add an introductory section explaining what this reference is and linking to the consumer guide.
- [X] T008 [US3] Verify vocabulary completeness and accuracy — run `pnpm lint:tokens` to confirm the 25-key set hasn't drifted, then spot-check that every `defaultTheme.colors` key appears exactly once in the table with the correct hex value and CSS property per `contracts/token-vocabulary.md` accuracy invariants.

**Checkpoint**: The token vocabulary reference is complete (25/25 keys) and accurate — zero omissions, zero invented tokens, default values match `defaultTheme`.

---

## Phase 5: User Story 4 - Follow a short guide to override, extend, and choose a path (Priority: P2)

**Goal**: Create the consumer guide (`docs/theming/consumer-guide.md`) — three sections showing how to override with `createTheme` + `ThemeProvider`, extend `defaultTheme` directly, and choose between import paths.

**Why this priority**: The typed API is only as useful as the guidance that explains how to use it. This guide is the primary "how to use it" artifact for consumers.

**Independent Test**: A developer can follow the guide to produce a working override with no hand-written CSS, extend `defaultTheme`, and determine which import path fits their situation.

### Implementation for User Story 4

- [X] T009 [US4] Create consumer guide at `docs/theming/consumer-guide.md` per contract `contracts/consumer-guide.md`. Include exactly three sections in order: (1) Override a few colors with `createTheme` + `ThemeProvider` — show the `brand` example with the explanation that `createTheme` deep-merges with `defaultTheme` and unspecified tokens fall through (FR-003). (2) Extend `defaultTheme` directly — show the spread pattern `{ ...defaultTheme, colors: { ...defaultTheme.colors, accent: '#7c3aed' } }` (FR-004). (3) Choose between the default import and the provider-driven path — present the three-path table (Default, Theme subpath, Provider-driven) with import syntax, default-token behavior, and when-to-use guidance (FR-005). Every example must use only exported, already-published APIs. No hand-written CSS in any example. Link to `token-vocabulary.md` for the full token list. Reference but do not duplicate the runtime API contracts from features 058–061.

**Checkpoint**: The consumer guide covers all three scenarios — override, extend, and choose-a-path — with no hand-written CSS.

---

## Phase 6: User Story 5 - Every parent acceptance criterion is closed out (Priority: P3)

**Goal**: Create the acceptance-verification record (`docs/theming/acceptance-verification.md`) checking off all 11 parent-plan acceptance criteria with evidence pointers.

**Why this priority**: The parent plan's acceptance criteria are the contract for the entire series. Closing them out is a completeness requirement that depends on artifacts from earlier stories.

**Independent Test**: Review the verification record and confirm every parent acceptance criterion is marked satisfied or explicitly addressed, with evidence for each.

### Implementation for User Story 5

- [X] T010 [US5] Create acceptance-verification record at `docs/theming/acceptance-verification.md` per data-model § 4. List each of the 11 parent-plan acceptance criteria from `docs/plans/react-theming.md` with status ("satisfied" or "addressed") and evidence pointer (a gate command, a contract, a story, or a compile-failure assertion). Include: (FR-011) compile-failure assertion for invalid token keys, (FR-012) `defaultTheme`/token-list export verification, (FR-013) tone-type imports (`TextTone`, `SurfaceTone`, `BorderTone`) from public entry point, (FR-014) structural-subpath import independence, plus the 7 criteria evidenced by earlier stories (US1 rendered test, US2 backward compat, existing gates).
- [X] T011 [US5] Run cross-cutting verification gates to confirm FR-011/FR-013/FR-014 evidence is current: `pnpm --filter @pathableai/react typecheck`, `pnpm --filter @pathableai/react check:types`, `pnpm test:next-consumer`.

**Checkpoint**: All 11 parent-plan acceptance criteria are checked off with evidence in the verification record.

---

## Phase 7: Polish and Cross-Cutting Concerns

**Purpose**: Cross-link documentation from package READMEs and run full quality gates.

- [X] T012 [P] Add theming docs cross-link to `packages/react/README.md` — add a "Theming" section (or extend the existing import-path section) linking to `docs/theming/consumer-guide.md` and `docs/theming/token-vocabulary.md` as the canonical theming documentation per constitution XII.
- [X] T013 [P] Add theming docs cross-link to `packages/styles/README.md` — add a "Theming" section linking to `docs/theming/consumer-guide.md` and `docs/theming/token-vocabulary.md` as the canonical theming documentation per constitution XII.
- [X] T014 Run full quality gates: `pnpm lint` (js + styles + markdownlint on new docs + tokens + format), `pnpm typecheck`, `pnpm test:storybook-react`, `pnpm test:visual`. All must exit 0 per SC-006.
- [X] T015 Run quickstart validation — execute steps from `quickstart.md` §1–§7 to confirm all gates and manual checks pass end-to-end.

---

## Dependencies and Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **User Story 1 (Phase 2)**: No dependencies on other user stories. Requires `packages/styles` and `packages/react` to build (existing infrastructure).
- **User Story 2 (Phase 3)**: No dependencies. Uses existing gates — can run in parallel with US1.
- **User Story 3 (Phase 4)**: No dependencies on other user stories. Can run in parallel with US1/US2/US4.
- **User Story 4 (Phase 5)**: No dependencies on other user stories. Can run in parallel with US1/US2/US3.
- **User Story 5 (Phase 6)**: Depends on US1 (rendered test evidence), US2 (backward compat evidence), US3 (vocabulary), and US4 (consumer guide) being complete — it cites their artifacts as evidence.
- **Polish (Phase 7)**: Depends on all user stories being complete. T012/T013 can run in parallel.

### User Story Dependencies

- **User Story 1 (P1)**: Independent — can start immediately.
- **User Story 2 (P1)**: Independent — can start immediately.
- **User Story 3 (P2)**: Independent — can start immediately.
- **User Story 4 (P2)**: Independent — can start immediately.
- **User Story 5 (P3)**: Depends on US1, US2, US3, US4 completion.

### Within Each User Story

- US1: T002 (story) → T003 (assertion) → T004 (verify). T002 and T003 can be worked on in parallel (different files) once the story id is agreed upon.
- US2: T005 and T006 (independent gate runs, can be parallel).
- US3: T007 (reference) → T008 (verify).
- US4: T009 (guide) — single task.
- US5: T010 (record) → T011 (verify cross-cutting gates).
- Polish: T012 and T013 (parallel), then T014 → T015.

### Parallel Opportunities

- **US1 + US3 + US4**: All independent — can be worked on simultaneously (different files: story vs. vocabulary doc vs. consumer guide doc).
- **US1 + US2**: Gate runs are independent of the story/assertion work.
- **T012 + T013**: Different README files — can run in parallel.
- All tasks within a phase marked [P] can run in parallel.

---

## Parallel Example: User Story 1 + User Story 3

```bash
# These can be worked on in parallel (different files, no dependencies):
Task: "Add AppShellUnderPartialTheme story in packages/react/src/stories/components/theme/ThemeProvider.stories.tsx"
Task: "Create token vocabulary reference at docs/theming/token-vocabulary.md"
Task: "Create consumer guide at docs/theming/consumer-guide.md"

# After story id is known, wire assertion in parallel with story authoring:
Task: "Wire browser-executed assertion in apps/storybook-react/.storybook/test-runner.js"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (T001 — create `docs/theming/`).
2. Complete Phase 2: User Story 1 (T002–T004 — rendered test + assertions).
3. Complete Phase 3: User Story 2 (T005–T006 — backward compat verification).
4. **STOP and VALIDATE**: Run `pnpm test:storybook-react` and `pnpm test:visual` — the partial-theme resolution proof passes and backward compat holds.
5. This is the MVP: the theming API is proven correct and safe to ship.

### Incremental Delivery

1. Setup (Phase 1) → Foundation ready.
2. Add User Story 1 → Partial theme resolution proved → MVP!
3. Add User Story 2 → Backward compat confirmed → Full safety evidence.
4. Add User Story 3 → Token vocabulary reference complete → Discoverable API.
5. Add User Story 4 → Consumer guide complete → Usable API.
6. Add User Story 5 → Parent criteria closed out → Completeness check.
7. Polish (Phase 7) → Docs cross-linked, gates green → Ship.

### Parallel Team Strategy

With multiple developers:

1. One developer completes Setup (T001).
2. Once setup is done:
   - Developer A: User Story 1 (Storybook story + browser assertions).
   - Developer B: User Story 3 (Token vocabulary reference).
   - Developer C: User Story 4 (Consumer guide).
3. Developer A also runs User Story 2 (backward compat gate verification).
4. After US1–US4 complete, any developer completes User Story 5 (verification record).
5. Polish: T012 and T013 in parallel, then final gate runs.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks within the same phase.
- [Story] label maps task to specific user story for traceability.
- No `packages/styles` or `packages/react` runtime source is modified — only docs, story files, and the test-runner config change (FR-015).
- The vocabulary reference derives default values from `defaultTheme.colors` (itself generated from SCSS `$semantic-colors`), so values cannot drift.
- `pnpm lint:tokens` already enforces the 25-key set between SCSS and TypeScript — use it as the completeness gate for the vocabulary.
- The new story must be deterministic (fixed colors, synthetic content, no dates/randomness/network per constitution XIV) and pass axe accessibility (constitution X).
- j sdom does not resolve CSS custom properties — the browser assertion via the Storybook test-runner (real Chromium) is required for color-resolution proof.
- Commit after each logical group (story completion or phase completion).
- Stop at any checkpoint to validate the story independently.