# Tasks: Expressive Marketing and Product-Presentation Patterns

**Input**: Design documents from `/specs/027-marketing-presentation-patterns/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Only selective import and lint tests — no separate test framework for a CSS-only feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: User Story 1 - Decorative Backgrounds (Priority: P1)](#phase-2-user-story-1---decorative-backgrounds-priority-p1)
- [Phase 3: User Story 2 - Screenshot Frames (Priority: P1)](#phase-3-user-story-2---screenshot-frames-priority-p1)
- [Phase 4: User Story 3 - Bento Grids (Priority: P2)](#phase-4-user-story-3---bento-grids-priority-p2)
- [Phase 5: User Story 4 - Chip Rails (Priority: P2)](#phase-5-user-story-4---chip-rails-priority-p2)
- [Phase 6: User Story 5 - Text Highlights (Priority: P3)](#phase-6-user-story-5---text-highlights-priority-p3)
- [Phase 7: Polish & Cross-Cutting Concerns](#phase-7-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Implementation Strategy](#implementation-strategy)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Global setup that all user stories depend on — CSS custom properties, bundle file, all-in-one registration, selective import test, and Storybook directory.

- [ ] T001 Add CSS custom properties for all five patterns in `packages/styles/src/_components-custom-properties.scss`
- [ ] T002 [P] Create bundle file `packages/styles/src/pathable-component-wrappers/pathable-marketing-patterns.scss` forwarding all five pattern partials
- [ ] T003 [P] Add `@forward 'pathable-marketing-patterns';` to `packages/styles/src/pathable-component-wrappers/pathable-all.scss`
- [ ] T004 [P] Add selective import test entries for all five pattern files in `packages/styles/test/selective-import.scss`
- [ ] T005 [P] Create Storybook story directory `packages/styles/src/stories/marketing-patterns/`

**Checkpoint**: Setup complete — CSS custom properties, bundle, all-in-one forwarding, test entries, and story directory ready. User story phases can proceed in parallel.

---

## Phase 2: User Story 1 - Decorative Backgrounds (Priority: P1) 🎯 MVP

**Goal**: Marketing staff can apply decorative background treatments (gradient, radial glow, subtle texture, organic shape) to page sections using modifier classes, with accessible defaults (hidden from a11y tree, contrast-preserving, reduced-motion support).

**Independent Test**: Apply `.pathable-decorative-bg--gradient`, `.pathable-decorative-bg--glow`, `.pathable-decorative-bg--texture`, and `.pathable-decorative-bg--organic` to containers and verify they render without reducing text contrast. Verify pseudo-elements are not announced by assistive technology. Verify `pathable-decorative-bg--animated` is disabled under `prefers-reduced-motion: reduce`.

### Implementation for User Story 1

- [ ] T006 [US1] Create decorative background SCSS partial at `packages/styles/src/pathable-component-wrappers/pathable-decorative-background.scss`
- [ ] T007 [P] [US1] Create DecorativeBackground Storybook stories at `packages/styles/src/stories/marketing-patterns/DecorativeBackground.stories.js` covering all four variants + animated variant

**Checkpoint**: Decorative backgrounds render correctly in all four variants with correct accessible behavior.

---

## Phase 3: User Story 2 - Screenshot Frames (Priority: P1)

**Goal**: Staff can display product screenshots inside intentionally framed containers (plain, browser, phone, dashboard) that elevate the image while preserving accessibility and responsiveness.

**Independent Test**: Render each frame variant (plain, browser, phone, dashboard) with a placeholder image and verify frame chrome renders correctly, intrinsic aspect ratio is preserved, captions display, hover lift is disabled under `prefers-reduced-motion`, and interactive triggers have visible keyboard focus.

### Implementation for User Story 2

- [ ] T008 [US2] Create screenshot frame SCSS partial at `packages/styles/src/pathable-component-wrappers/pathable-screenshot-frame.scss`
- [ ] T009 [P] [US2] Create ScreenshotFrame Storybook stories at `packages/styles/src/stories/marketing-patterns/ScreenshotFrame.stories.js` covering all four variants with captions, hover/lift, and lightbox trigger example

**Checkpoint**: Screenshot frames display correctly in all four variants with proper image scaling and accessible captions.

---

## Phase 4: User Story 3 - Bento Grids (Priority: P2)

**Goal**: Marketing staff can lay out product features in a bento-style grid with featured, standard, metric, and image tiles, maintaining logical DOM/tab order while achieving multi-span visual layouts.

**Independent Test**: Render a bento grid with 4-6 tiles of mixed types (featured, standard, metric, image) and verify visual spans do not alter DOM tab order. Verify grid collapses to single-column on a 320px viewport without overlapping or horizontal overflow.

### Implementation for User Story 3

- [ ] T010 [US3] Create bento grid SCSS partial at `packages/styles/src/pathable-component-wrappers/pathable-bento-grid.scss`
- [ ] T011 [P] [US3] Create BentoGrid Storybook stories at `packages/styles/src/stories/marketing-patterns/BentoGrid.stories.js` covering mixed tile types, responsive collapse, and edge cases (fewer tiles, all-same-type)

**Checkpoint**: Bento grid renders with correct visual spans, preserves DOM tab order, and collapses predictably on mobile.

---

## Phase 5: User Story 4 - Chip Rails (Priority: P2)

**Goal**: Staff can display horizontal chip rows with static overflow by default and an opt-in marquee variant that pauses on hover/focus and respects reduced-motion preferences.

**Independent Test**: Render a default chip rail (no marquee) and verify static overflow with no motion. Apply `--marquee` modifier and verify animation pauses on hover/focus. Verify animation stops under `prefers-reduced-motion: reduce`. Verify duplicated decorative content is hidden from assistive technology.

### Implementation for User Story 4

- [ ] T012 [US4] Create chip rail SCSS partial at `packages/styles/src/pathable-component-wrappers/pathable-chip-rail.scss`
- [ ] T013 [P] [US4] Create ChipRail Storybook stories at `packages/styles/src/stories/marketing-patterns/ChipRail.stories.js` covering static default, marquee variant, hover/focus pause, reduced-motion, and edge cases (few chips)

**Checkpoint**: Chip rail renders statically by default; marquee animation is opt-in and pauses/focuses/respects reduced-motion.

---

## Phase 6: User Story 5 - Text Highlights (Priority: P3)

**Goal**: Staff can apply branded text highlight treatments (marker, underline, soft-background) that remain readable when text wraps across multiple lines and work in forced-colors mode.

**Independent Test**: Apply each highlight variant to multi-line text and verify readability on wrap. Verify each variant is visually distinct. Verify forced-colors mode provides a documented fallback.

### Implementation for User Story 5

- [ ] T014 [US5] Create text highlight SCSS partial at `packages/styles/src/pathable-component-wrappers/pathable-text-highlight.scss`
- [ ] T015 [P] [US5] Create TextHighlight Storybook stories at `packages/styles/src/stories/marketing-patterns/TextHighlight.stories.js` covering all three variants, multi-line wrapping, forced-colors fallback display, and edge cases (small/large text)

**Checkpoint**: Text highlights render correctly on single and multi-line text, are visually distinct, and handle forced-colors mode.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Combined examples, build verification, and final quality checks.

- [ ] T016 [P] Create Combined Storybook story at `packages/styles/src/stories/marketing-patterns/Combined.stories.js` demonstrating layered usage and restraint (e.g., decorative background + screenshot frame on a page section, bento grid + text highlights in a feature section)
- [ ] T017 Verify full build compiles without errors via `pnpm build` in `packages/styles/`
- [ ] T018 [P] Verify selective import compilation via `pnpm exec sass --load-path=node_modules/@uswds/uswds/packages test/selective-import.scss test/selective-import.css` in `packages/styles/`

**Checkpoint**: Full build and selective imports compile cleanly. Combined stories demonstrate real-world usage.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. All tasks are independent [P] and can run in parallel.
- **User Stories (Phases 2-6)**: Depend on Setup completion only. No cross-story dependencies.
- **Polish (Phase 7)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories. Can start immediately after Setup.
- **User Story 2 (P1)**: No dependencies on other stories. Can start immediately after Setup.
- **User Story 3 (P2)**: No dependencies on other stories. Can start immediately after Setup.
- **User Story 4 (P2)**: No dependencies on other stories. Can start immediately after Setup.
- **User Story 5 (P3)**: No dependencies on other stories. Can start immediately after Setup.

### Within Each User Story

- SCSS implementation before Storybook stories.
- Each story is independently testable via `pnpm storybook`.
- The `[P]` marker on Storybook tasks means they can run in parallel with the SCSS for the same story (different files, no dependencies).

### Parallel Opportunities

- All Setup tasks (T001-T005) can run in parallel.
- All user story phases (Phases 2-6) can run entirely in parallel.
- Within each story, the SCSS partial and Storybook stories can run in parallel.
- Polish tasks (T016-T018) can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (CSS custom properties, bundle, all-in-one, test, story dir)
2. Complete Phase 2: User Story 1 (Decorative Background)
3. **STOP and VALIDATE**: Verify decorative backgrounds render in Storybook with all four variants
4. Build passes, selective import compiles

### Incremental Delivery

1. Complete Setup → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add combined examples and final polish
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Complete Setup tasks in parallel (T001-T005)
2. Once Setup is done:
   - Developer A: User Story 1 (Decorative Background)
   - Developer B: User Story 2 (Screenshot Frames)
   - Developer C: User Story 3 (Bento Grids)
   - Developer D: User Story 4 (Chip Rails)
   - Developer E: User Story 5 (Text Highlights)
3. All stories complete and combine independently into the bundle file

---

## Notes

- [P] tasks = different files, no dependencies
- [US1]-[US5] labels map tasks to specific user stories
- Each user story is independently completable and testable via Storybook
- No cross-file conflicts between user stories (each writes to different files)
- Build after each phase to verify compilation
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence