# Tasks: Fix Modal Backdrop

**Input**: Design documents from `/specs/247-fix-modal-backdrop/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md,
data-model.md, contracts/modal-open-presentation.md, quickstart.md

**Tests**: Included — FR-010 and
`contracts/modal-open-presentation.md` require automated React interaction/unit coverage
for shell open/absent and `closeOnBackdropClick` false/true; styles Storybook play
coverage for PathAble-only open.

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
- [Parallel Example: User Story 1](#parallel-example-user-story-1)
- [Implementation Strategy](#implementation-strategy)
- [Notes](#notes)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Every task includes the exact file path it touches

## Path Conventions

- Styles: `packages/styles/src/pathable-component-wrappers/pathable-modal.scss`,
  `packages/styles/src/stories/components/Communication/Modal.stories.ts`,
  `packages/styles/BRAND_RULES.md`, `packages/styles/AGENTS.md`
- React: `packages/react/src/components/Modal/Modal.tsx`,
  `packages/react/src/stories/components/Communication/Modal.stories.tsx`,
  `packages/react/README.md`
- Contract reference: `specs/247-fix-modal-backdrop/contracts/modal-open-presentation.md`

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

**Independent Test**: Open styles Modal open fixture (PathAble-only, no USWDS JS) and
React Modal `Open` story; confirm backdrop + centered dialog on both.

### Implementation for User Story 1

- [ ] T004 [US1] Update styles open fixture markup in
      `packages/styles/src/stories/components/Communication/Modal.stories.ts` to the
      required PathAble-only shell
      (`.pathable-modal-wrapper.is-visible` → `.pathable-modal-overlay` →
      `.pathable-modal.usa-modal` dialog with content/heading/footer); keep
      `verifyDialogName` / close-button play checks
- [ ] T005 [P] [US1] Replace styles Modal story docs that claim the overlay comes only
      from USWDS JS in
      `packages/styles/src/stories/components/Communication/Modal.stories.ts`
      parameters.docs.description
- [ ] T006 [US1] Update React portal in
      `packages/react/src/components/Modal/Modal.tsx` so when `open` is true it
      portals dual-class shell
      (`.pathable-modal-wrapper.usa-modal-wrapper.is-visible` →
      `.pathable-modal-overlay.usa-modal-overlay` →
      `.pathable-modal.usa-modal` dialog); keep `ref`, ARIA, `onKeyDown`, and
      `...rest` on the **dialog**; keep `return null` when `!open`
- [ ] T007 [US1] Confirm React `Open` story in
      `packages/react/src/stories/components/Communication/Modal.stories.tsx` shows
      backdrop + centered dialog with default args (`open: true`)

**Checkpoint**: US1 open presentation works for styles PathAble-only and React dual-class

---

## Phase 4: User Story 2 - React Owns Open/Closed Transition (Priority: P1)

**Goal**: Single React `Modal` owns open/closed transition, preserves Escape/focus/scroll,
and exposes `closeOnBackdropClick` (default `false`).

**Independent Test**: Toggle open/closed from a trigger; overlay click does not dismiss
by default; with `closeOnBackdropClick={true}`, overlay click calls `onClose` and
dialog-content clicks do not; Escape/Tab/close still work.

### Tests for User Story 2

- [ ] T008 [P] [US2] Add or extend React Storybook play coverage in
      `packages/react/src/stories/components/Communication/Modal.stories.tsx` to assert
      wrapper/overlay (or dialog contained in overlay) when open and those shell nodes
      absent when closed (`OpenCloseBehavior` and/or dedicated plays)
- [ ] T009 [P] [US2] Add React interaction coverage in
      `packages/react/src/stories/components/Communication/Modal.stories.tsx` (and/or
      co-located unit tests under `packages/react/src/components/Modal/`) for
      `closeOnBackdropClick` default `false`: overlay click does **not** call `onClose`
- [ ] T010 [P] [US2] Add React interaction coverage in
      `packages/react/src/stories/components/Communication/Modal.stories.tsx` (and/or
      co-located unit tests) for `closeOnBackdropClick={true}`: overlay click calls
      `onClose`; click inside dialog content does not
- [ ] T011 [US2] Confirm existing Escape / Tab / close plays in
      `packages/react/src/stories/components/Communication/Modal.stories.tsx`
      (`EscapeCloses`, `TabContainment`, `OpenCloseBehavior`) still pass after the
      shell change

### Implementation for User Story 2

- [ ] T012 [US2] Add `closeOnBackdropClick?: boolean` (default `false`) to
      `packages/react/src/components/Modal/Modal.tsx`; when `true`, overlay click calls
      `onClose` and dialog clicks stop propagation; styles remain non-interactive
- [ ] T013 [US2] Preserve body scroll lock, focus restore, Escape, and Tab trap behavior
      in `packages/react/src/components/Modal/Modal.tsx` across open/close with the new
      shell (no regression vs pre-shell behavior)

**Checkpoint**: US2 transition + backdrop-click prop are verified automatically

---

## Phase 5: User Story 3 - Documented Package APIs Need No Extra Ad-Hoc Shell (Priority: P2)

**Goal**: Public docs describe styles-owned classes and React API (including
`closeOnBackdropClick`) without requiring undocumented consumer CSS.

**Independent Test**: Follow styles and React documented Modal usage; open presentation
works without ad-hoc overlay CSS.

### Implementation for User Story 3

- [ ] T014 [P] [US3] Catalogue PathAble wrapper/overlay classes (and dual-class notes)
      in `packages/styles/BRAND_RULES.md` and `packages/styles/AGENTS.md` if those
      tables list public Modal classes
- [ ] T015 [P] [US3] Update React Modal docs in `packages/react/README.md` (and story
      component description in
      `packages/react/src/stories/components/Communication/Modal.stories.tsx`) for
      dual-class shell on open, `closeOnBackdropClick` default/behavior, and no
      consumer overlay CSS
- [ ] T016 [US3] Add changelog/migration note for portal DOM shape
      `wrapper → overlay → dialog` and removing temporary consumer overlay CSS (package
      CHANGELOG or release notes path used by this monorepo for `@pathableai/styles` /
      `@pathableai/react`)

**Checkpoint**: Docs match `contracts/modal-open-presentation.md`

---

## Phase 6: User Story 4 - Open State Is Reviewable in Storybook (Priority: P2)

**Goal**: Named open fixtures in both Storybooks are discoverable and protect backdrop +
placement via visual regression.

**Independent Test**: Reviewers find styles and React open Modal stories in under one
minute and see backdrop + dialog; visual fixtures cover those opens.

### Implementation for User Story 4

- [ ] T017 [P] [US4] Name/document the styles open Modal fixture for discoverability in
      `packages/styles/src/stories/components/Communication/Modal.stories.ts` (stable
      export name + docs so it serves as visual-regression fixture)
- [ ] T018 [P] [US4] Confirm React `Open` (and existing `Narrow` / `LongContent` open
      stories) in
      `packages/react/src/stories/components/Communication/Modal.stories.tsx` remain
      deterministic visual-regression fixtures for backdrop + placement
- [ ] T019 [US4] Verify Storybook a11y addon / rendered checks report no new violations
      for styles and React Modal open stories; keep ARIA on the dialog; do not broaden
      existing `jsx-a11y` exceptions in
      `packages/react/src/components/Modal/Modal.tsx`

**Checkpoint**: US4 review/visual gates satisfied

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Gates across packages

- [ ] T020 [P] Run lint for affected packages (`pnpm --filter @pathableai/styles lint`,
      `pnpm --filter @pathableai/react lint`) and fix findings without disabling rules
- [ ] T021 [P] Run typecheck for `@pathableai/react` and fix findings
- [ ] T022 Build and exercise styles + React Storybooks in their own contexts; confirm
      composition does not hide independent failures
- [ ] T023 Walk `specs/247-fix-modal-backdrop/quickstart.md` validation steps
      (compiled-CSS grep, open fixtures, backdrop-click checks, interaction stories)
- [ ] T024 Review visual-regression snapshots for styles open + React `Open`; approve
      only intentional backdrop/centering changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories
- **US1 (Phase 3)**: Depends on Foundational — MVP open presentation
- **US2 (Phase 4)**: Depends on US1 React portal (T006) — prop + interaction on shell
- **US3 (Phase 5)**: Depends on Foundational; can start after T004/T006 for accurate docs
- **US4 (Phase 6)**: Depends on US1 stories (T004/T007); can parallel US3 after those
- **Polish (Phase 7)**: Depends on desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: After Foundational — no other story deps
- **US2 (P1)**: After US1 React portal exists
- **US3 (P2)**: Docs; best after US1/US2 API settles
- **US4 (P2)**: Story/visual polish on US1 fixtures

### Parallel Opportunities

- T005 parallel with T004 after markup approach is clear (same file — usually sequential)
- T008, T009, T010 can be authored in parallel once T012 lands (or fail-first then implement)
- T014, T015 parallel in US3
- T017, T018 parallel in US4
- T020, T021 parallel in Polish

---

## Parallel Example: User Story 2

```bash
# After T012 (prop) exists, launch coverage tasks together:
Task: "Shell open/absent plays in packages/react/.../Modal.stories.tsx"
Task: "closeOnBackdropClick false coverage in Modal.stories.tsx / unit tests"
Task: "closeOnBackdropClick true coverage in Modal.stories.tsx / unit tests"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup
2. Phase 2 Foundational (styles SCSS + dist grep) — CRITICAL
3. Phase 3 US1 (styles open fixture + React dual-class portal)
4. **STOP and VALIDATE**: PathAble-only styles open + React Open show backdrop
5. Continue US2 for prop/interaction, then US3/US4, then Polish

### Incremental Delivery

1. Setup + Foundational → open CSS in `dist`
2. US1 → visual open works (MVP for #246)
3. US2 → transition + `closeOnBackdropClick` verified
4. US3 → docs/migration
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
- Commit after each task or logical group
- Validate via `specs/247-fix-modal-backdrop/quickstart.md`
