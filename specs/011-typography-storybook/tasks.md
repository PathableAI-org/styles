# Tasks: Typography Storybook Section

**Input**: Design documents from `specs/011-typography-storybook/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Not included — not requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Phase 1: Setup (Cleanup Infrastructure)](#phase-1-setup-cleanup-infrastructure)
- [Phase 2: User Story 1 - Designers Validate Typography Usage (P1) MVP](#phase-2-user-story-1---designers-validate-typography-usage-p1-mvp)
- [Phase 3: User Story 2 - Developers See Long-Text Examples (P2)](#phase-3-user-story-2---developers-see-long-text-examples-p2)
- [Phase 4: User Story 3 - Developers Identify Typography Violations (P3)](#phase-4-user-story-3---developers-identify-typography-violations-p3)
- [Phase 5: Polish & Cross-Cutting Concerns](#phase-5-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

All source paths are relative to the repository root at `/Users/jake/Documents/GitHub/styles/`.

- **Design tokens package**: `packages/styles/src/`
- **Brand stories**: `packages/styles/src/stories/brand/`
- **Storybook config**: `apps/storybook/.storybook/`

---

## Phase 1: Setup (Cleanup Infrastructure)

**Purpose**: Remove the temporary FEEDBACK.md file from git tracking. No project initialization needed — the repository is already set up.

- [ ] T001 Remove FEEDBACK.md from git tracking with `git rm FEEDBACK.md`

---

## Phase 2: User Story 1 - Designers Validate Typography Usage (P1) 🎯 MVP

**Goal**: A designer can open Storybook, navigate to Brand / Typography, and see all four font roles (Fredoka heading, Montserrat alternate heading, Poppins subheading, Nunito body) displayed with typeface sample, font family declaration, weight, and usage description — plus the full typography scale (display-lg through caption-md) with font size, line height, and weight.

**Independent Test**: Open Storybook at `http://localhost:6006`, navigate to Brand / Typography. Confirm four font role cards are displayed: Fredoka Regular heading, Montserrat Bold alternate heading, Poppins Bold subheading, Nunito Regular body — each with font-family, weight, and usage text. Scroll to confirm all 10 type scale tokens are listed with font size, line height, and weight values matching `_typography.scss`.

### Implementation for User Story 1

- [ ] T002 [US1] Create `packages/styles/src/stories/brand/Typography.stories.js` with export default `{ title: 'Brand/Typography', tags: ['autodocs'] }` following the same pattern as `ColorUsage.stories.js`
- [ ] T003 [US1] Add font role data constants for all four roles (heading/fredoka/400, alternate-heading/montserrat/700, subheading/poppins/700, body/nunito/400) referencing `--pathable-font-*` CSS custom properties as the source of truth
- [ ] T004 [US1] Implement font role card section in the render template showing each role with a large text sample, font-family declaration, weight badge, USWDS role tag, and usage description — styled with inline styles matching the ColorUsage story convention
- [ ] T005 [US1] Add typography scale data constants for all 10 scale tokens (display-lg through caption-md) with their font size, line height, font weight, and CSS custom property references (`--pathable-font-size-*`, `--ui-*`)
- [ ] T006 [US1] Implement type scale table section in the render template showing all 10 tokens with name, font size, line height, font weight, and CSS custom property — using a hand-coded `<table>` matching the ColorUsage table styling convention
- [ ] T007 [US1] Add fallback font stack display to font role cards so developers can see the `system-ui, sans-serif` or `system-ui, serif` fallbacks for each role

**Checkpoint**: At this point, User Story 1 should be fully functional. Open Storybook, navigate to Brand / Typography, and confirm all font roles and type scale tokens are visible and correctly rendered.

---

## Phase 3: User Story 2 - Developers See Long-Text Examples (P2)

**Goal**: A developer implementing a workflow page can open the Brand / Typography story and see long-text examples demonstrating body text readability at both body-md (16px) and body-lg (18px) sizes in Nunito with correct line height.

**Independent Test**: Open the Brand / Typography story, scroll to the long-text examples section. Confirm there is a paragraph of Nunito body text at body-md size (16px, line-height 1.5) and a paragraph of Nunito body text at body-lg size (18px, line-height 1.5).

### Implementation for User Story 2

- [ ] T008 [P] [US2] Add long-text example data constants to `packages/styles/src/stories/brand/Typography.stories.js` with sample paragraphs at body-md and body-lg sizes referencing `--pathable-font-body`, `--pathable-font-size-body-md`, `--pathable-font-size-body-lg`, and `--pathable-font-line-height-body`
- [ ] T009 [US2] Implement the long-text examples section in the render template of `packages/styles/src/stories/brand/Typography.stories.js` showing body-md and body-lg paragraphs with their size label, font family tag, and line height annotation — styled with inline styles matching the ColorUsage story convention

**Checkpoint**: At this point, User Stories 1 AND 2 should both work. Open Storybook, navigate to Brand / Typography, scroll through to verify font roles, type scale, and long-text examples.

---

## Phase 4: User Story 3 - Developers Identify Typography Violations (P3)

**Goal**: A developer reviewing a PR can open the Brand / Typography story and see a "Do Not Use — Typography Violations" section demonstrating at least 3 common brand violations with explanatory labels.

**Independent Test**: Open the Brand / Typography story, scroll to the violations section. Confirm there are at least 3 violation demos: (1) Fredoka used for long text — labeled "Do not use heading typeface for long text", (2) centered body text longer than 3 lines — labeled "Do not center long body text", (3) body text in all caps — labeled "Do not format body text in all caps".

### Implementation for User Story 3

- [ ] T010 [P] [US3] Add typography violation data constants to `packages/styles/src/stories/brand/Typography.stories.js` for at least 3 violations: heading-for-long-text, centered-long-body, body-all-caps (each with name, description, and BRAND_RULES.md rule reference)
- [ ] T011 [US3] Implement the violations section in the render template of `packages/styles/src/stories/brand/Typography.stories.js` showing each violation as a demo card with the violating text rendered, a red "Do Not Use" header, and a label explaining the brand rule — following the same "failed pairings" red-section styling from ColorUsage.stories.js

**Checkpoint**: All user stories should now be independently functional. Full Brand / Typography story is complete with font roles, type scale, long-text examples, and violations.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Build verification, Storybook validation, and ensuring existing stories are unaffected.

- [ ] T012 Build `packages/styles` with `cd packages/styles && pnpm build` to verify SCSS compiles without errors
- [ ] T013 Start Storybook with `cd apps/storybook && pnpm storybook` and verify Brand / Typography story renders correctly alongside existing Brand / Color Usage story
- [ ] T014 Verify existing stories are unaffected: confirm Brand / Color Usage, Utilities / Typography, and a sample component story (e.g., Button) all render correctly
- [ ] T015 Verify FEEDBACK.md is no longer tracked with `git ls-files FEEDBACK.md` (should produce no output)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **US1 (Phase 2)**: No dependencies on other phases — can start after Setup
- **US2 (Phase 3)**: Depends on US1 completion (adds sections to same `Typography.stories.js` file)
- **US3 (Phase 4)**: Depends on US2 completion (adds sections to same `Typography.stories.js` file)
- **Polish (Phase 5)**: Depends on all user stories being complete

### Within Each User Story

All tasks within a single US phase target the same file (`Typography.stories.js`). Data constants tasks are marked [P] and can be done independently, but the render template tasks must follow after data is available.

| Phase | Tasks | Can Parallelize? |
|-------|-------|-----------------|
| Phase 1 (Setup) | T001 | Single task |
| Phase 2 (US1) | T002-T007 | T002 first (create file), then T003/T005/T007 in parallel, then T004/T006 in parallel |
| Phase 3 (US2) | T008-T009 | T008 then T009 (sequential within same file) |
| Phase 4 (US3) | T010-T011 | T010 then T011 (sequential within same file) |
| Phase 5 (Polish) | T012-T015 | T012/T013/T015 in parallel, T014 after Storybook starts |

### Parallel Opportunities

- T003, T005, T007 can run in parallel (all add data constants to the same file — merge carefully)
- T004, T006 can run in parallel (both add render sections — merge carefully into template string)
- T008, T001 run in parallel (different files)
- T010, T001 run in parallel (different files)
- T012, T013, T015 can run in parallel (independent verification tasks)

---

## Parallel Example: User Story 1

```bash
# Launch data constant additions together (different sections of the same file):
Task: "Add font role data constants to Typography.stories.js"
Task: "Add type scale data constants to Typography.stories.js"
Task: "Add fallback font stack display to Typography.stories.js"
```

```bash
# Launch render sections together (different sections of the template):
Task: "Implement font role card section in render template"
Task: "Implement type scale table section in render template"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Remove FEEDBACK.md
2. Complete Phase 2: User Story 1 (font roles + type scale)
3. **STOP and VALIDATE**: Open Storybook, confirm Brand / Typography story shows font roles and type scale
4. Deploy/demo if ready — this is the MVP

### Incremental Delivery

1. Phase 1 + Phase 2 → Typography story with font roles and type scale (MVP)
2. Add Phase 3 → Long-text examples added to the story
3. Add Phase 4 → Violations section added to the story
4. Add Phase 5 → Verification and polish

### Single-File Strategy

All three user stories modify the same file (`Typography.stories.js`). Implement sequentially within each story:
- First add data constants (the arrays of typography role/scale/violation objects)
- Then add the render template section that uses them
- This ensures each story's section is self-contained and independently testable