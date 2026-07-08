# Tasks: Storybook Documentation

**Input**: Design documents from `/specs/008-storybook-documentation/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ (all loaded)

**Tests**: No test tasks are included — FR-009 explicitly prohibits test runners, visual regression tests, interaction tests, or test-related addons. This is documentation only.

**Organization**: Tasks are grouped by user story. No tests in this feature.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create directory structure

- [x] T001 Install Storybook dependencies in `packages/styles/package.json` via `pnpm add -D storybook @storybook/html-vite @storybook/addon-docs @storybook/manager-api @storybook/theming`
- [x] T002 [P] Create `.storybook/` directory at `packages/styles/.storybook/`
- [x] T003 [P] Create `src/stories/components/` directory structure at `packages/styles/src/stories/components/` with subdirectories: `Basic/`, `FormControls/`, `Navigation/`, `Communication/`, `Layout/`
- [x] T004 [P] Create `src/stories/utilities/` directory at `packages/styles/src/stories/utilities/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Storybook configuration that MUST be complete before any component or utility stories can render

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create `packages/styles/.storybook/main.js` with `@storybook/html-vite` framework, `@storybook/addon-docs` addon, stories glob `../src/stories/**/*.stories.js`, and `docs: { autodocs: true }`
- [x] T006 Create `packages/styles/.storybook/preview.js` with `import '../dist/styles.css'` and control matchers for color/date
- [x] T007 Update `packages/styles/package.json` scripts to add `"storybook": "storybook dev -p 6006"` and `"build-storybook": "storybook build"`

**Checkpoint**: Run `pnpm build && pnpm storybook` from `packages/styles/` — Storybook should start but show no stories yet

---

## Phase 3: User Story 1 — Developer Browsing Component Documentation (Priority: P1) 🎯 MVP

**Goal**: Create a `.stories.js` file for each `pathable-*` component wrapper, organized into functional categories, so developers can browse documentation for each component.

**Independent Test**: Run `pnpm storybook` from `packages/styles/`, navigate to the Components section, and see documentation pages for Button, Alert, Accordion, Card, Breadcrumb, form inputs, Table, Tag, Modal, and at least 25 components total.

### Basic Components

- [x] T008 [P] [US1] Create `packages/styles/src/stories/components/Basic/Button.stories.js` with Default, AccentCool, AccentWarm, Outline, Inverse, Base, Secondary, Big, and Unstyled stories
- [x] T009 [P] [US1] Create `packages/styles/src/stories/components/Basic/ButtonGroup.stories.js` with Default and Segmented stories
- [x] T010 [P] [US1] Create `packages/styles/src/stories/components/Basic/Card.stories.js` with Default Card, Media Card, and Card with variants
- [x] T011 [P] [US1] Create `packages/styles/src/stories/components/Basic/Link.stories.js` with Default, External, and Nav link stories
- [x] T012 [P] [US1] Create `packages/styles/src/stories/components/Basic/List.stories.js` with Unordered, Ordered, and unstyled list stories
- [x] T013 [P] [US1] Create `packages/styles/src/stories/components/Basic/Tag.stories.js` with Default and Big tag stories
- [x] T014 [P] [US1] Create `packages/styles/src/stories/components/Basic/Table.stories.js` with Default, Borderless, Compact, and Striped table stories

### Form Controls

- [x] T015 [P] [US1] Create `packages/styles/src/stories/components/FormControls/Checkbox.stories.js` with Default Checkbox and Tile checkbox variants
- [x] T016 [P] [US1] Create `packages/styles/src/stories/components/FormControls/ComboBox.stories.js` with JS-driven note and static HTML example
- [x] T017 [P] [US1] Create `packages/styles/src/stories/components/FormControls/DatePicker.stories.js` with JS-driven note and static HTML example
- [x] T018 [P] [US1] Create `packages/styles/src/stories/components/FormControls/DateRangePicker.stories.js` with JS-driven note and static HTML example
- [x] T019 [P] [US1] Create `packages/styles/src/stories/components/FormControls/Input.stories.js` with Text, Password, Email, and Search input variants
- [x] T020 [P] [US1] Create `packages/styles/src/stories/components/FormControls/Radio.stories.js` with Default Radio and Tile radio variants
- [x] T021 [P] [US1] Create `packages/styles/src/stories/components/FormControls/Select.stories.js` with Default and multiple-select option variants
- [x] T022 [P] [US1] Create `packages/styles/src/stories/components/FormControls/Textarea.stories.js` with Default and textarea in form context

### Navigation Components

- [x] T023 [P] [US1] Create `packages/styles/src/stories/components/Navigation/Breadcrumb.stories.js` with Default breadcrumb wrapping example
- [x] T024 [P] [US1] Create `packages/styles/src/stories/components/Navigation/Header.stories.js` with JS-driven note and basic header HTML
- [x] T025 [P] [US1] Create `packages/styles/src/stories/components/Navigation/Pagination.stories.js` with Default pagination examples
- [x] T026 [P] [US1] Create `packages/styles/src/stories/components/Navigation/Search.stories.js` with Default and Big search variants
- [x] T027 [P] [US1] Create `packages/styles/src/stories/components/Navigation/Sidenav.stories.js` with Default side navigation structure
- [x] T028 [P] [US1] Create `packages/styles/src/stories/components/Navigation/Skipnav.stories.js` with Default skipnav link

### Communication Components

- [x] T029 [P] [US1] Create `packages/styles/src/stories/components/Communication/Accordion.stories.js` with JS-driven note and static accordion HTML structure, showing border-box variants and sub-elements (heading, button, content)
- [x] T030 [P] [US1] Create `packages/styles/src/stories/components/Communication/Alert.stories.js` with Info, Warning, Error, Success, Emergency, and Slim variant stories
- [x] T031 [P] [US1] Create `packages/styles/src/stories/components/Communication/Banner.stories.js` with JS-driven note and static banner HTML with sub-elements
- [x] T032 [P] [US1] Create `packages/styles/src/stories/components/Communication/Modal.stories.js` with JS-driven note and static modal HTML structure with overlay and dialog sub-elements
- [x] T033 [P] [US1] Create `packages/styles/src/stories/components/Communication/ProcessList.stories.js` with Default process list step examples
- [x] T034 [P] [US1] Create `packages/styles/src/stories/components/Communication/SiteAlert.stories.js` with JS-driven note and Info, Warning, Emergency, and Slim variants
- [x] T035 [P] [US1] Create `packages/styles/src/stories/components/Communication/StepIndicator.stories.js` with Default step indicator example
- [x] T036 [P] [US1] Create `packages/styles/src/stories/components/Communication/SummaryBox.stories.js` with Default summary box example

### Layout Components

- [x] T037 [P] [US1] Create `packages/styles/src/stories/components/Layout/Icon.stories.js` with example icon grid showing pathable-icon usage
- [x] T038 [P] [US1] Create `packages/styles/src/stories/components/Layout/MediaBlock.stories.js` with Default media block layout example

**Checkpoint**: At this point, a developer can run `pnpm storybook` from `packages/styles/` and see at least 28 component documentation pages in the Components section, each rendering with PathAble styles

---

## Phase 4: User Story 2 — Developer Browsing Utility Class Documentation (Priority: P2)

**Goal**: Create a `.stories.js` file for each `pathable-*` utility group so developers can browse available values, class patterns, and responsive breakpoints.

**Independent Test**: Run `pnpm storybook` from `packages/styles/`, navigate to the Utilities section, and see pages for Background Colors, Text Colors, Spacing, Display, Typography, Border, Flex & Alignment, Width & Max Width, and Text Alignment.

- [x] T039 [P] [US2] Create `packages/styles/src/stories/utilities/BackgroundColors.stories.js` with a grid showing all `.pathable-bg-*` values (primary, base, surface, accent, link, focus-ring, danger, success, transparent) as color swatches
- [x] T040 [P] [US2] Create `packages/styles/src/stories/utilities/TextColors.stories.js` with a grid showing all `.pathable-text-*` values (base, primary, muted, accent, link, white) as text swatches
- [x] T041 [P] [US2] Create `packages/styles/src/stories/utilities/Spacing.stories.js` with examples of `.pathable-padding-*` and `.pathable-margin-*` classes showing values 0-10 and 15, plus responsive breakpoint note
- [x] T042 [P] [US2] Create `packages/styles/src/stories/utilities/Display.stories.js` with examples of `.pathable-display-*` values (flex, block, inline, inline-block, none) and responsive variant documentation
- [x] T043 [P] [US2] Create `packages/styles/src/stories/utilities/TypographyUtilities.stories.js` with examples of `.pathable-font-family-*` and `.pathable-text-*` (font-weight) classes
- [x] T044 [P] [US2] Create `packages/styles/src/stories/utilities/Border.stories.js` with examples of `.pathable-border-*` (0-5) and `.pathable-border-radius-*` (sm, md, lg) classes
- [x] T045 [P] [US2] Create `packages/styles/src/stories/utilities/FlexAlignment.stories.js` with examples of `.pathable-flex-*`, `.pathable-flex-align-*`, and `.pathable-flex-justify-*` classes with visual alignment demonstrations
- [x] T046 [P] [US2] Create `packages/styles/src/stories/utilities/Width.stories.js` with examples of `.pathable-width-*` (full, auto) and `.pathable-maxw-*` (mobile, mobile-lg, tablet, desktop) classes
- [x] T047 [P] [US2] Create `packages/styles/src/stories/utilities/TextAlignment.stories.js` with examples of `.pathable-text-*` (center, left, right) classes and responsive variant documentation

**Checkpoint**: At this point, a developer can browse 9 utility documentation pages in the Utilities section

---

## Phase 5: User Story 3 — Storybook Uses PathAble Theme (Priority: P2)

**Goal**: Customize the Storybook manager chrome with PathAble brand colors and typography so the sidebar, toolbar, and documentation UI feel consistent with the PathAble brand.

**Independent Test**: Open Storybook and verify the sidebar uses PathAble Blue (`#00365c`) for active navigation items, headings render in Fredoka, body text renders in Nunito, and the toolbar shows "Pathable Styles" as the brand title.

- [x] T048 Create `packages/styles/.storybook/manager.js` with custom PathAble theme using `@storybook/theming` `create()` — set `brandTitle: "Pathable Styles"`, `colorPrimary: "#00365c"`, `colorSecondary: "#1cae96"`, `fontBase: "'Nunito', system-ui, sans-serif"`, `barBg: "#00365c"`, and other brand tokens from data-model.md StorybookTheme entity
- [x] T049 Create `packages/styles/.storybook/manager-head.html` with Google Fonts preconnect and stylesheet links for Fredoka and Nunito fonts so the custom theme fonts render in the Storybook manager UI

**Checkpoint**: Storybook UI chrome now uses PathAble brand colors and fonts

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify everything works end-to-end

- [x] T050 Run `pnpm build` from `packages/styles/` to ensure `dist/styles.css` compiles successfully
- [x] T051 Run `pnpm storybook` from `packages/styles/` and verify Storybook starts on `http://localhost:6006` without errors
- [x] T052 Verify no test-related addons or configurations exist — check `packages/styles/.storybook/main.js` addons array and `packages/styles/package.json` for test dependencies (FR-009 compliance check)
- [x] T053 ✅ Verify all component stories only reference `pathable-*` classes (no `.usa-*` class references) and JS-driven components include the USWDS JS dependency note (FR-012 compliance check) — 21 `.usa-*` references found and fixed in Header, Search, Pagination, Sidenav stories. Re-verified: 0 remaining.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion. Each component story [P] task is independent and can be done in parallel.
- **User Story 2 (Phase 4)**: Depends on Foundational completion. Each utility story [P] task is independent and can be done in parallel. No dependency on US1.
- **User Story 3 (Phase 5)**: Depends on Foundational completion. Independent from US1/US2.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) — No dependencies on other stories

### Within Each User Story

- All tasks within US1 marked [P] are independent — can be done in any order
- All tasks within US2 marked [P] are independent — can be done in any order
- US3 has 2 sequential tasks (manager.js depends on manager-head.html conceptually but they can be done together)

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks can run in parallel (T005, T006, T007)
- Once Foundational phase completes, US1, US2, and US3 can all start in parallel since they have no dependencies on each other
- Within US1, all 31 component story tasks can run in parallel (each is a separate file)
- Within US2, all 9 utility story tasks can run in parallel (each is a separate file)
- Within US3, T048 and T049 can run in parallel

## Parallel Example: User Story 1

```bash
# Launch all Basic component stories in parallel:
Task: "Create Button.stories.js at packages/styles/src/stories/components/Basic/Button.stories.js"
Task: "Create Card.stories.js at packages/styles/src/stories/components/Basic/Card.stories.js"
Task: "Create Tag.stories.js at packages/styles/src/stories/components/Basic/Tag.stories.js"
Task: "Create Table.stories.js at packages/styles/src/stories/components/Basic/Table.stories.js"

# Launch all Form Control stories in parallel:
Task: "Create Checkbox.stories.js at packages/styles/src/stories/components/FormControls/Checkbox.stories.js"
Task: "Create Input.stories.js at packages/styles/src/stories/components/FormControls/Input.stories.js"
Task: "Create Radio.stories.js at packages/styles/src/stories/components/FormControls/Radio.stories.js"
Task: "Create Select.stories.js at packages/styles/src/stories/components/FormControls/Select.stories.js"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Component Documentation)
4. **STOP and VALIDATE**: Run `pnpm build && pnpm storybook` — all component pages render
5. Deliver MVP

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Component docs) → Test independently → **MVP complete!**
3. Add User Story 3 (Theme) or User Story 2 (Utilities) → Test independently
4. Remaining story → Polish

### Parallel Team Strategy

With multiple developers:

1. Developer A: Phase 1 + Phase 2 (Setup + Foundational)
2. Once Foundational is done, fan out:
   - Developer A: Basic components + Theme
   - Developer B: Form Controls + Layout components
   - Developer C: Navigation + Communication components
   - Developer D: Utilities (all 9)

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- This feature has NO tests — all verification is done by running `pnpm storybook` and visually inspecting the documentation pages
- Each user story is independently completable and testable
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- FR-009 mandates zero test runners or test-related addons; do not install `@storybook/addon-interactions`, `@storybook/test`, `@storybook/jest`, or similar packages