# Tasks: Fix Modal Backdrop

**Input**: Design documents from `/specs/247-fix-modal-backdrop/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md,
data-model.md, contracts/modal-open-presentation.md, quickstart.md

**Tests**: Included — FR-010 and
`contracts/modal-open-presentation.md` require automated React interaction/unit coverage
for shell open/absent, focus/scroll restore, and `closeOnBackdropClick` false/true;
styles Storybook play coverage for PathAble-only open (including CSS-only proof path).

**Organization**: Styles-owned open shell is Foundational (blocks all stories). User
stories then add PathAble-only open proof + React dual-class portal (US1), React
transition/`closeOnBackdropClick` (US2), docs/migration (US3), and Storybook/visual
fixtures (US4).

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1](#phase-3-user-story-1---open-modal-shows-overlay-and-centered-dialog-priority-p1-mvp)
- [Phase 4: User Story 2](#phase-4-user-story-2---react-owns-openclosed-transition-priority-p1)
- [Phase 5: User Story 3](#phase-5-user-story-3---documented-package-apis-need-no-extra-ad-hoc-shell-priority-p2)
- [Phase 6: User Story 4](#phase-6-user-story-4---open-state-is-reviewable-in-storybook-priority-p2)
- [Phase 7: Polish](#phase-7-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 3](#parallel-example-user-story-3)
- [Implementation Strategy](#implementation-strategy)
- [Notes](#notes)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Every task includes the exact file path it touches

## Path Conventions

- Styles: `packages/styles/src/pathable-component-wrappers/pathable-modal.scss`,
  `packages/styles/src/stories/components/Communication/Modal.stories.ts`,
  `packages/styles/BRAND_RULES.md`, `packages/styles/AGENTS.md`,
  `packages/styles/README.md`
- Storybook apps / preview: `apps/storybook/.storybook/preview.js` (keeps global
  `@pathableai/styles/js`), isolated CSS-only Modal config under
  `apps/storybook/.storybook-modal-css/` (no styles/js),
  `apps/storybook-react/.storybook/preview.js`
- Visual/coverage/geometry gates: `packages/styles/scripts/quality-gates.mjs`,
  `packages/styles/scripts/storybook-coverage.mjs`,
  `packages/styles/scripts/test-visual.mjs`, plus Modal geometry runner/script
  added by this feature (e.g. `scripts/test-modal-open-geometry.mjs` or equivalent
  under `packages/styles/scripts/`)
- React: `packages/react/src/components/Modal/Modal.tsx`,
  `packages/react/src/stories/components/Communication/Modal.stories.tsx`,
  `packages/react/src/components/Modal/` (unit tests),
  `packages/react/README.md`
- Release: `.changeset/` (Changesets for `@pathableai/styles` + `@pathableai/react`)
- Contract: `specs/247-fix-modal-backdrop/contracts/modal-open-presentation.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the working environment is ready.

- [ ] T001 Confirm branch `247-fix-modal-backdrop` is checked out and run `pnpm install`
      at the repo root so styles and react workspace dependencies are present

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Styles-owned Modal open shell CSS — constitution requires the styles
contract before React emits it.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 Add PathAble open-shell classes in
      `packages/styles/src/pathable-component-wrappers/pathable-modal.scss`:
      `.pathable-modal-wrapper` / `.pathable-modal-overlay` (via `@extend` of USWDS
      counterparts where safe) **plus** explicit `.pathable-modal-wrapper.is-visible`
      (and overlay geometry) so PathAble-only markup works without USWDS compound
      `@extend` gaps; after `@extend`, set `.pathable-modal__content { flex-direction:
      column; }`
- [ ] T003 Build `@pathableai/styles` and verify compiled CSS contains
      `.pathable-modal-wrapper.is-visible` and PathAble overlay rules (e.g. `rg
      "pathable-modal-wrapper\\.is-visible|pathable-modal-overlay"
      packages/styles/dist`) per `specs/247-fix-modal-backdrop/quickstart.md`

**Checkpoint**: PathAble-only open CSS exists in `dist`; React work may begin

---

## Phase 3: User Story 1 - Open Modal Shows Overlay and Centered Dialog (Priority: P1) 🎯 MVP

**Goal**: Styles PathAble-only open markup and React `open={true}` both show a dimmed
full-viewport backdrop and centered dialog with correct title→body→footer order.

**Independent Test**: Open styles Modal open fixture (PathAble-only CSS proof) and
React Modal `Open` / no-JS mount check; confirm backdrop + centered dialog on both.

### Implementation for User Story 1

- [ ] T004 [US1] Update styles open fixture markup in
      `packages/styles/src/stories/components/Communication/Modal.stories.ts` to the
      required PathAble-only shell
      (`.pathable-modal-wrapper.is-visible` → `.pathable-modal-overlay` →
      `.pathable-modal.usa-modal` dialog with content/heading/footer); keep
      `verifyDialogName` / close-button plays **and** assert
      `.pathable-modal-wrapper.is-visible` + `.pathable-modal-overlay` are present
- [ ] T005 [US1] Provide an **isolated CSS-only Modal Storybook config** under
      `apps/storybook/.storybook-modal-css/` (preview imports styles CSS/SCSS only —
      **no** `@pathableai/styles/js`) that loads the Communication/Modal open story from
      `packages/styles/src/stories/components/Communication/Modal.stories.ts`. Keep
      default `apps/storybook/.storybook/preview.js` importing `@pathableai/styles/js`
      so Accordion/Banner `pnpm test:storybook-styles` stays green. Add root script
      `test:storybook-modal-css` (build/serve that config + run Modal open plays). Do
      **not** remove the global styles/js import as the FR-009 proof.
- [ ] T006 [US1] Rewrite styles Modal docs in
      `packages/styles/src/stories/components/Communication/Modal.stories.ts`
      `parameters.docs.description`: remove “overlay from USWDS JS only”; document
      wrapper → overlay → inner dialog structure; state open presentation is
      CSS-driven with static `.is-visible`
- [ ] T007 [US1] Update React portal in
      `packages/react/src/components/Modal/Modal.tsx` so when `open` is true it
      portals dual-class shell
      (`.pathable-modal-wrapper.usa-modal-wrapper.is-visible` →
      `.pathable-modal-overlay.usa-modal-overlay` →
      `.pathable-modal.usa-modal` dialog); keep `ref`, ARIA, `onKeyDown`, and
      `...rest` on the **dialog**; keep `return null` when `!open`
- [ ] T008 [US1] Confirm React `Open` story in
      `packages/react/src/stories/components/Communication/Modal.stories.tsx` shows
      backdrop + centered dialog with `open: true`
- [ ] T009 [US1] Add a React unit/integration test under
      `packages/react/src/components/Modal/` that mounts `Modal` with styles CSS and
      **without** importing `@pathableai/styles/js`, asserting wrapper/overlay/dialog
      shell when `open={true}` (proves no USWDS modal-JS dependency for React open)

**Checkpoint**: US1 open presentation works for styles PathAble-only CSS proof and
React dual-class portal (Storybook + no-JS mount)

---

## Phase 4: User Story 2 - React Owns Open/Closed Transition (Priority: P1)

**Goal**: Single React `Modal` owns open/closed transition, preserves Escape/focus/scroll,
and exposes `closeOnBackdropClick` (default `false`).

**Independent Test**: Controlled open/close from a trigger; shell absent when closed;
scroll and focus restored; overlay click does not dismiss by default; with
`closeOnBackdropClick={true}`, overlay click calls `onClose` and dialog-content clicks
do not; Escape/Tab/close still work.

### Implementation for User Story 2

- [ ] T010 [US2] Add `closeOnBackdropClick?: boolean` (default `false`) to
      `packages/react/src/components/Modal/Modal.tsx`; when `true`, overlay click calls
      `onClose`; dialog click must `stopPropagation` **and compose** with any consumer
      `onClick` forwarded via `...rest` (do not overwrite); styles remain non-interactive
- [ ] T011 [US2] Preserve body scroll lock, focus restore, Escape, and Tab trap behavior
      in `packages/react/src/components/Modal/Modal.tsx` across open/close with the new
      shell (no regression vs pre-shell behavior)

### Tests for User Story 2

> Implement T010/T011 first (or write failing tests then implement). Sequential edits to
> the same story/test files — do **not** mark same-file tasks `[P]`.

- [ ] T012 [US2] Add a controlled open/close play or unit test in
      `packages/react/src/stories/components/Communication/Modal.stories.tsx` and/or
      `packages/react/src/components/Modal/` that toggles `open` true→false (trigger
      button), asserts wrapper/overlay present when open and **absent** when closed,
      and asserts body scroll + focus restore to the trigger (FR-010 / SC-003)
- [ ] T013 [US2] Add coverage in `packages/react/src/components/Modal/` (preferred) or
      `packages/react/src/stories/components/Communication/Modal.stories.tsx` for
      `closeOnBackdropClick` default `false`: overlay click does **not** call `onClose`
- [ ] T014 [US2] Add coverage in `packages/react/src/components/Modal/` (preferred) or
      `packages/react/src/stories/components/Communication/Modal.stories.tsx` for
      `closeOnBackdropClick={true}`: overlay click calls `onClose`; click inside dialog
      content does not; consumer `onClick` on dialog still runs when composed
- [ ] T015 [US2] Confirm existing Escape / Tab / close plays in
      `packages/react/src/stories/components/Communication/Modal.stories.tsx`
      (`EscapeCloses`, `TabContainment`) still pass after the shell change

**Checkpoint**: US2 transition + backdrop-click prop are verified automatically

---

## Phase 5: User Story 3 - Documented Package APIs Need No Extra Ad-Hoc Shell (Priority: P2)

**Goal**: Public docs describe styles-owned classes and React API (including
`closeOnBackdropClick`) without requiring undocumented consumer CSS.

**Independent Test**: Follow styles and React documented Modal usage; open presentation
works without ad-hoc overlay CSS.

### Implementation for User Story 3

- [ ] T016 [P] [US3] Update PathAble wrapper/overlay class catalogue (and dual-class
      notes) in `packages/styles/BRAND_RULES.md`, `packages/styles/AGENTS.md`
      (mandatory — both already list Modal), **and** public Modal open-shell guidance
      in `packages/styles/README.md` (FR-014)
- [ ] T017 [P] [US3] Update React Modal docs in `packages/react/README.md` (and story
      component description in
      `packages/react/src/stories/components/Communication/Modal.stories.tsx`) for
      dual-class shell on open, `closeOnBackdropClick` default/behavior, and no
      consumer overlay CSS
- [ ] T018 [US3] Add a Changeset under `.changeset/` covering `@pathableai/styles` and
      `@pathableai/react` with migration note for portal DOM shape
      `wrapper → overlay → dialog` and removing temporary consumer overlay CSS

**Checkpoint**: Docs match `contracts/modal-open-presentation.md`

---

## Phase 6: User Story 4 - Open State Is Reviewable in Storybook (Priority: P2)

**Goal**: Named open fixtures in both Storybooks are discoverable and protect backdrop +
placement (including narrow/long content) via visual regression.

**Independent Test**: Reviewers find styles and React open Modal stories in under one
minute and see backdrop + dialog; visual fixtures cover those opens.

### Implementation for User Story 4

- [ ] T019 [US4] Name/document the styles open Modal fixture for discoverability in
      `packages/styles/src/stories/components/Communication/Modal.stories.ts` (stable
      export name + docs) **and** add both styles **narrow** and **long-content** open
      fixtures in the same file (FR-013 — both required). Register those story IDs in
      `packages/styles/scripts/quality-gates.mjs` `CANONICAL_STORIES` and in
      `packages/styles/scripts/storybook-coverage.mjs` `EXPECTED_COVERAGE`. Add Modal
      **geometry** assertions (overlay covers viewport; dialog centered / not end-of-
      page) for the open fixture in the CSS-only harness plays and/or
      `scripts/test-modal-open-geometry.mjs` (or `packages/styles/scripts/`), wired as
      root `pnpm test:modal-open-geometry` (FR-011 / SC-005 — blank/overflow smoke alone
      is insufficient)
- [ ] T020 [US4] Tag React Modal open fixtures (`Open`, `Narrow`, `LongContent`) in
      `packages/react/src/stories/components/Communication/Modal.stories.tsx` with
      `behavior-contract` (meta or per-story) so `pnpm test:storybook-react` includes
      them under `STORYBOOK_TARGET=react`. Add **mandatory** React open geometry /
      visual assertions (Playwright layout or equivalent against
      `apps/storybook-react` static, included in `pnpm test:modal-open-geometry` or a
      dedicated React step) that fail if backdrop is missing or dialog is uncentered —
      do not treat interaction/a11y-only coverage as sufficient for FR-011 / SC-005
- [ ] T021 [US4] Verify Storybook a11y addon / rendered checks report no new violations
      for styles and React Modal open stories (`pnpm test:storybook-styles` /
      `pnpm test:storybook-react` a11y; CSS-only Modal harness as applicable); keep ARIA
      on the dialog; do not broaden existing `jsx-a11y` exceptions in
      `packages/react/src/components/Modal/Modal.tsx`

**Checkpoint**: US4 review/visual gates satisfied

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Gates across packages

- [ ] T022 [P] Run root `pnpm lint` (covers `lint:js`, styles, Markdown, tokens, and
      `check:format` per root `package.json`) and fix findings without disabling rules
- [ ] T023 Run `pnpm --filter @pathableai/react typecheck`,
      `pnpm --filter @pathableai/react check:types`,
      `pnpm --filter @pathableai/react check:package`, and
      `pnpm --filter @pathableai/react test:unit`; fix findings (unit suite must run
      after T009 / T012–T014 Modal coverage). **Serialize before T024** — do not run in
      parallel with the React package build
- [ ] T024 Build `@pathableai/styles` and `@pathableai/react` **after T023**; confirm
      styles CSS entry used by React still includes Modal open-shell rules (consumer
      import / packaged CSS smoke check for FR-008)
- [ ] T025 Build Storybooks and run explicit package runners with pass/fail criteria:
      `pnpm --filter @pathable/storybook build-storybook`,
      `pnpm --filter @pathable/storybook-react build-storybook`,
      `pnpm test:storybook-styles` (must pass; Accordion/Banner unchanged),
      `pnpm test:storybook-modal-css` (must pass; PathAble-only open + geometry),
      `pnpm test:storybook-react` (must pass; behavior-contract-tagged Modal included);
      confirm composition does not hide independent failures
- [ ] T026 Walk `specs/247-fix-modal-backdrop/quickstart.md` validation steps
      (compiled-CSS grep, CSS-only Modal harness, React no-JS `test:unit`,
      `pnpm test:modal-open-geometry`, backdrop-click checks, package gates) and confirm
      each command exits 0
- [ ] T027 Run metric-based visual smoke for registered Modal IDs (`pnpm test:visual`,
      `pnpm quality-gates`) **and** require `pnpm test:modal-open-geometry` (styles CSS-
      only open + React open) to fail on missing overlay coverage or uncentered /
      end-of-page dialog. Do not treat blank/overflow-only smoke or interaction-only
      runners as sufficient for FR-011 / SC-005; there is no snapshot-diff baseline
      workflow — geometry assertions are the backdrop/centering gate

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories
- **US1 (Phase 3)**: Depends on Foundational — MVP open presentation
- **US2 (Phase 4)**: Depends on US1 React portal (T007) — prop + interaction on shell
- **US3 (Phase 5)**: Depends on Foundational; best after T007/T010 for accurate docs
- **US4 (Phase 6)**: Depends on US1 stories (T004/T008); can parallel US3 after those
- **Polish (Phase 7)**: Depends on desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: After Foundational — no other story deps
- **US2 (P1)**: After US1 React portal exists
- **US3 (P2)**: Docs/Changeset; best after US1/US2 API settles
- **US4 (P2)**: Story/visual polish on US1 fixtures

### Parallel Opportunities

- T016 and T017 (different files) after API settles
- T020 parallel with T019 only if different files are edited by different people
  carefully; prefer sequential when both touch story files
- T022 parallel with other polish only when not racing package builds
- T023 then T024 (serialized — React checks before React build)
- Do **not** parallelize T023 with T024

---

## Parallel Example: User Story 3

```bash
# Different files — safe to parallelize:
Task: "Update BRAND_RULES.md + AGENTS.md Modal shell catalogue"
Task: "Update packages/react/README.md Modal docs"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup
2. Phase 2 Foundational (styles SCSS + dist grep) — CRITICAL
3. Phase 3 US1 (styles open fixture + CSS-only proof + React dual-class portal + no-JS mount)
4. **STOP and VALIDATE**: PathAble-only styles open + React Open show backdrop
5. Continue US2 for prop/interaction, then US3/US4, then Polish

### Incremental Delivery

1. Setup + Foundational → open CSS in `dist`
2. US1 → visual open works (MVP for #246)
3. US2 → transition + `closeOnBackdropClick` verified
4. US3 → docs/Changeset
5. US4 + Polish → Storybook/visual/gates

---

## Notes

- [P] = different files, no dependencies on incomplete tasks
- [US#] maps to spec user stories
- Styles contract before React emission (constitution I/IV)
- Do not invent overlay classes only in React
- Do not disable, weaken, or silence lint rules
- Prefer accessible queries; class checks allowed for shell contract under test
- Canonical open visibility class is `.pathable-modal-wrapper.is-visible` (no alternate modifier)
- Default Storybook preview keeps `@pathableai/styles/js` — FR-009 proof is the
  isolated `apps/storybook/.storybook-modal-css/` harness (T005), not removing global JS
- React `open={false}` is always `return null` (unmount); optional closed fixtures are styles-only
- Storybook commands: `pnpm --filter @pathable/storybook storybook` and
  `pnpm --filter @pathable/storybook-react storybook`; runners:
  `pnpm test:storybook-styles`, `pnpm test:storybook-modal-css`,
  `pnpm test:storybook-react`, `pnpm test:modal-open-geometry`, `pnpm test:visual`,
  `pnpm quality-gates`, `pnpm storybook:coverage`
- Task IDs: T001–T027 (27 tasks)
- Commit after each task or logical group
- Validate via `specs/247-fix-modal-backdrop/quickstart.md`
