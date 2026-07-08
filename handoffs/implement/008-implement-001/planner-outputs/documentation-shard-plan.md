# Documentation Capability — Shard Plan

**Vertical Capability**: documentation
**Feature**: 008-storybook-documentation
**Run ID**: 008-implement-001
**Planner ID**: planner-documentation-01

## Dependency Graph

```
S01 (Setup) ──→ S02 (Foundational) ──┬──→ S03 (US1 Basic Components)
                                       ├──→ S04 (US1 Form Controls + Layout)
                                       ├──→ S05 (US1 Navigation)
                                       ├──→ S06 (US1 Communication)
                                       ├──→ S07 (US2 Utilities)
                                       ├──→ S08 (US3 Theme)
                                       │
                  All S03-S08 ────────→ S09 (Polish & Verification)
```

- S01: No dependencies — can start immediately
- S02: Depends on S01 — needs directories created, deps installed
- S03–S08: Depend on S02 — need `.storybook/` config and `dist/styles.css` built
  - Can all run in parallel with each other (no cross-file dependencies)
- S09: Depends on S03–S08 — needs all story files and theme config in place

---

## Shard S01-documentation-01: Setup

| Field | Value |
|-------|-------|
| **shard_id** | `S01-documentation-01` |
| **task_ids** | `T001`, `T002`, `T003`, `T004` |
| **lifecycle_stage** | `setup` |
| **depends_on** | _(none — can start immediately)_ |
| **receipt_path** | `handoffs/implement/008-implement-001/S01-documentation-01/results/receipt.json` |

### Tasks

| ID | Description |
|----|-------------|
| T001 | Install Storybook dependencies in `packages/styles/package.json` via `pnpm add -D storybook @storybook/html-vite @storybook/addon-docs @storybook/manager-api @storybook/theming` |
| T002 | Create `.storybook/` directory at `packages/styles/.storybook/` |
| T003 | Create `src/stories/components/` directory structure at `packages/styles/src/stories/components/` with subdirectories: `Basic/`, `FormControls/`, `Navigation/`, `Communication/`, `Layout/` |
| T004 | Create `src/stories/utilities/` directory at `packages/styles/src/stories/utilities/` |

### Allowed Read Paths

- `packages/styles/package.json`
- `specs/008-storybook-documentation/context-index.json`

### Allowed Write Paths

- `packages/styles/package.json` (add devDependencies)
- `packages/styles/.storybook/` (created directory)
- `packages/styles/src/stories/components/Basic/` (created directory)
- `packages/styles/src/stories/components/FormControls/` (created directory)
- `packages/styles/src/stories/components/Navigation/` (created directory)
- `packages/styles/src/stories/components/Communication/` (created directory)
- `packages/styles/src/stories/components/Layout/` (created directory)
- `packages/styles/src/stories/utilities/` (created directory)
- `handoffs/implement/008-implement-001/S01-documentation-01/results` (receipt)

### Validation Commands

```bash
cd packages/styles && pnpm list storybook @storybook/html-vite @storybook/addon-docs
test -d packages/styles/.storybook
test -d packages/styles/src/stories/components/Basic
test -d packages/styles/src/stories/utilities
```

### Forbidden Actions

- edit `tasks.md`
- edit `packages/styles/src/pathable-component-wrappers/`
- edit `packages/styles/src/_uswds-theme.scss`
- dispatch workers

---

## Shard S02-documentation-01: Foundational (Blocks All Stories)

| Field | Value |
|-------|-------|
| **shard_id** | `S02-documentation-01` |
| **task_ids** | `T005`, `T006`, `T007` |
| **lifecycle_stage** | `foundational` |
| **depends_on** | `S01-documentation-01` |
| **receipt_path** | `handoffs/implement/008-implement-001/S02-documentation-01/results/receipt.json` |

### Tasks

| ID | Description |
|----|-------------|
| T005 | Create `packages/styles/.storybook/main.js` with `@storybook/html-vite` framework, `@storybook/addon-docs` addon, stories glob `../src/stories/**/*.stories.js`, and `docs: { autodocs: true }` |
| T006 | Create `packages/styles/.storybook/preview.js` with `import '../dist/styles.css'` and control matchers for color/date |
| T007 | Update `packages/styles/package.json` scripts to add `"storybook": "storybook dev -p 6006"` and `"build-storybook": "storybook build"` |

### Allowed Read Paths

- `packages/styles/package.json`
- `specs/008-storybook-documentation/context-index.json`
- `specs/008-storybook-documentation/quickstart.md`
- `specs/008-storybook-documentation/data-model.md`

### Allowed Write Paths

- `packages/styles/.storybook/main.js`
- `packages/styles/.storybook/preview.js`
- `packages/styles/package.json` (add storybook scripts)
- `handoffs/implement/008-implement-001/S02-documentation-01/results` (receipt)

### Validation Commands

```bash
test -f packages/styles/.storybook/main.js && grep -q '@storybook/html-vite' packages/styles/.storybook/main.js
test -f packages/styles/.storybook/preview.js && grep -q 'styles.css' packages/styles/.storybook/preview.js
grep -q '"storybook"' packages/styles/package.json
```

### Forbidden Actions

- edit `tasks.md`
- edit `packages/styles/src/` (any SCSS source)
- dispatch workers

---

## Shard S03-documentation-01: US1 Basic Components

| Field | Value |
|-------|-------|
| **shard_id** | `S03-documentation-01` |
| **task_ids** | `T008`, `T009`, `T010`, `T011`, `T012`, `T013`, `T014` |
| **lifecycle_stage** | `us1_components` |
| **depends_on** | `S02-documentation-01` |
| **receipt_path** | `handoffs/implement/008-implement-001/S03-documentation-01/results/receipt.json` |

### Tasks

| ID | Description |
|----|-------------|
| T008 | Create `packages/styles/src/stories/components/Basic/Button.stories.js` with Default, AccentCool, AccentWarm, Outline, Inverse, Base, Secondary, Big, and Unstyled stories |
| T009 | Create `packages/styles/src/stories/components/Basic/ButtonGroup.stories.js` with Default and Segmented stories |
| T010 | Create `packages/styles/src/stories/components/Basic/Card.stories.js` with Default Card, Media Card, and Card with variants |
| T011 | Create `packages/styles/src/stories/components/Basic/Link.stories.js` with Default, External, and Nav link stories |
| T012 | Create `packages/styles/src/stories/components/Basic/List.stories.js` with Unordered, Ordered, and unstyled list stories |
| T013 | Create `packages/styles/src/stories/components/Basic/Tag.stories.js` with Default and Big tag stories |
| T014 | Create `packages/styles/src/stories/components/Basic/Table.stories.js` with Default, Borderless, Compact, and Striped table stories |

### Allowed Read Paths

- `specs/008-storybook-documentation/context-index.json`
- `specs/008-storybook-documentation/contracts/story-interface.md`
- `specs/008-storybook-documentation/data-model.md`
- `specs/008-storybook-documentation/quickstart.md`
- `packages/styles/dist/styles.css` (exists, built during S02)

### Allowed Write Paths

- `packages/styles/src/stories/components/Basic/Button.stories.js`
- `packages/styles/src/stories/components/Basic/ButtonGroup.stories.js`
- `packages/styles/src/stories/components/Basic/Card.stories.js`
- `packages/styles/src/stories/components/Basic/Link.stories.js`
- `packages/styles/src/stories/components/Basic/List.stories.js`
- `packages/styles/src/stories/components/Basic/Tag.stories.js`
- `packages/styles/src/stories/components/Basic/Table.stories.js`
- `handoffs/implement/008-implement-001/S03-documentation-01/results` (receipt)

### Validation Commands

```bash
for f in Button ButtonGroup Card Link List Tag Table; do test -f "packages/styles/src/stories/components/Basic/${f}.stories.js" && echo "${f}_OK"; done
grep -q 'pathable-button' packages/styles/src/stories/components/Basic/Button.stories.js
grep -q 'autodocs' packages/styles/src/stories/components/Basic/Button.stories.js
```

### Forbidden Actions

- edit `tasks.md`
- edit SCSS source files
- edit `.storybook/` config files
- dispatch workers

---

## Shard S04-documentation-01: US1 Form Controls + Layout

| Field | Value |
|-------|-------|
| **shard_id** | `S04-documentation-01` |
| **task_ids** | `T015`, `T016`, `T017`, `T018`, `T019`, `T020`, `T021`, `T022`, `T037`, `T038` |
| **lifecycle_stage** | `us1_components` |
| **depends_on** | `S02-documentation-01` |
| **receipt_path** | `handoffs/implement/008-implement-001/S04-documentation-01/results/receipt.json` |

### Tasks

| ID | Description |
|----|-------------|
| T015 | Create `packages/styles/src/stories/components/FormControls/Checkbox.stories.js` with Default Checkbox and Tile checkbox variants |
| T016 | Create `packages/styles/src/stories/components/FormControls/ComboBox.stories.js` with JS-driven note and static HTML example |
| T017 | Create `packages/styles/src/stories/components/FormControls/DatePicker.stories.js` with JS-driven note and static HTML example |
| T018 | Create `packages/styles/src/stories/components/FormControls/DateRangePicker.stories.js` with JS-driven note and static HTML example |
| T019 | Create `packages/styles/src/stories/components/FormControls/Input.stories.js` with Text, Password, Email, and Search input variants |
| T020 | Create `packages/styles/src/stories/components/FormControls/Radio.stories.js` with Default Radio and Tile radio variants |
| T021 | Create `packages/styles/src/stories/components/FormControls/Select.stories.js` with Default and multiple-select option variants |
| T022 | Create `packages/styles/src/stories/components/FormControls/Textarea.stories.js` with Default and textarea in form context |
| T037 | Create `packages/styles/src/stories/components/Layout/Icon.stories.js` with example icon grid showing pathable-icon usage |
| T038 | Create `packages/styles/src/stories/components/Layout/MediaBlock.stories.js` with Default media block layout example |

**Note**: T016 (ComboBox), T017 (DatePicker), T018 (DateRangePicker) are JS-driven components — stories MUST include USWDS JavaScript dependency note per FR-012 and the story-interface.md contract.

### Allowed Read Paths

- `specs/008-storybook-documentation/context-index.json`
- `specs/008-storybook-documentation/contracts/story-interface.md`
- `specs/008-storybook-documentation/data-model.md`
- `specs/008-storybook-documentation/quickstart.md`

### Allowed Write Paths

- `packages/styles/src/stories/components/FormControls/Checkbox.stories.js`
- `packages/styles/src/stories/components/FormControls/ComboBox.stories.js`
- `packages/styles/src/stories/components/FormControls/DatePicker.stories.js`
- `packages/styles/src/stories/components/FormControls/DateRangePicker.stories.js`
- `packages/styles/src/stories/components/FormControls/Input.stories.js`
- `packages/styles/src/stories/components/FormControls/Radio.stories.js`
- `packages/styles/src/stories/components/FormControls/Select.stories.js`
- `packages/styles/src/stories/components/FormControls/Textarea.stories.js`
- `packages/styles/src/stories/components/Layout/Icon.stories.js`
- `packages/styles/src/stories/components/Layout/MediaBlock.stories.js`
- `handoffs/implement/008-implement-001/S04-documentation-01/results` (receipt)

### Validation Commands

```bash
test -f packages/styles/src/stories/components/FormControls/Checkbox.stories.js && echo 'Checkbox_OK'
test -f packages/styles/src/stories/components/FormControls/ComboBox.stories.js && echo 'ComboBox_OK'
test -f packages/styles/src/stories/components/Layout/Icon.stories.js && echo 'Icon_OK'
test -f packages/styles/src/stories/components/Layout/MediaBlock.stories.js && echo 'MediaBlock_OK'
grep -q 'USWDS JavaScript' packages/styles/src/stories/components/FormControls/ComboBox.stories.js
```

### Forbidden Actions

- edit `tasks.md`
- edit SCSS source files
- edit `.storybook/` config files
- dispatch workers

---

## Shard S05-documentation-01: US1 Navigation Components

| Field | Value |
|-------|-------|
| **shard_id** | `S05-documentation-01` |
| **task_ids** | `T023`, `T024`, `T025`, `T026`, `T027`, `T028` |
| **lifecycle_stage** | `us1_components` |
| **depends_on** | `S02-documentation-01` |
| **receipt_path** | `handoffs/implement/008-implement-001/S05-documentation-01/results/receipt.json` |

### Tasks

| ID | Description |
|----|-------------|
| T023 | Create `packages/styles/src/stories/components/Navigation/Breadcrumb.stories.js` with Default breadcrumb wrapping example |
| T024 | Create `packages/styles/src/stories/components/Navigation/Header.stories.js` with JS-driven note and basic header HTML |
| T025 | Create `packages/styles/src/stories/components/Navigation/Pagination.stories.js` with Default pagination examples |
| T026 | Create `packages/styles/src/stories/components/Navigation/Search.stories.js` with Default and Big search variants |
| T027 | Create `packages/styles/src/stories/components/Navigation/Sidenav.stories.js` with Default side navigation structure |
| T028 | Create `packages/styles/src/stories/components/Navigation/Skipnav.stories.js` with Default skipnav link |

**Note**: T024 (Header) is JS-driven — story MUST include USWDS JavaScript dependency note.

### Allowed Read Paths

- `specs/008-storybook-documentation/context-index.json`
- `specs/008-storybook-documentation/contracts/story-interface.md`
- `specs/008-storybook-documentation/data-model.md`
- `specs/008-storybook-documentation/quickstart.md`

### Allowed Write Paths

- `packages/styles/src/stories/components/Navigation/Breadcrumb.stories.js`
- `packages/styles/src/stories/components/Navigation/Header.stories.js`
- `packages/styles/src/stories/components/Navigation/Pagination.stories.js`
- `packages/styles/src/stories/components/Navigation/Search.stories.js`
- `packages/styles/src/stories/components/Navigation/Sidenav.stories.js`
- `packages/styles/src/stories/components/Navigation/Skipnav.stories.js`
- `handoffs/implement/008-implement-001/S05-documentation-01/results` (receipt)

### Validation Commands

```bash
for f in Breadcrumb Header Pagination Search Sidenav Skipnav; do test -f "packages/styles/src/stories/components/Navigation/${f}.stories.js" && echo "${f}_OK"; done
grep -q 'USWDS JavaScript' packages/styles/src/stories/components/Navigation/Header.stories.js
```

### Forbidden Actions

- edit `tasks.md`
- edit SCSS source files
- edit `.storybook/` config files
- dispatch workers

---

## Shard S06-documentation-01: US1 Communication Components

| Field | Value |
|-------|-------|
| **shard_id** | `S06-documentation-01` |
| **task_ids** | `T029`, `T030`, `T031`, `T032`, `T033`, `T034`, `T035`, `T036` |
| **lifecycle_stage** | `us1_components` |
| **depends_on** | `S02-documentation-01` |
| **receipt_path** | `handoffs/implement/008-implement-001/S06-documentation-01/results/receipt.json` |

### Tasks

| ID | Description |
|----|-------------|
| T029 | Create `packages/styles/src/stories/components/Communication/Accordion.stories.js` with JS-driven note and static accordion HTML structure, showing border-box variants and sub-elements |
| T030 | Create `packages/styles/src/stories/components/Communication/Alert.stories.js` with Info, Warning, Error, Success, Emergency, and Slim variant stories |
| T031 | Create `packages/styles/src/stories/components/Communication/Banner.stories.js` with JS-driven note and static banner HTML with sub-elements |
| T032 | Create `packages/styles/src/stories/components/Communication/Modal.stories.js` with JS-driven note and static modal HTML structure with overlay and dialog sub-elements |
| T033 | Create `packages/styles/src/stories/components/Communication/ProcessList.stories.js` with Default process list step examples |
| T034 | Create `packages/styles/src/stories/components/Communication/SiteAlert.stories.js` with JS-driven note and Info, Warning, Emergency, and Slim variants |
| T035 | Create `packages/styles/src/stories/components/Communication/StepIndicator.stories.js` with Default step indicator example |
| T036 | Create `packages/styles/src/stories/components/Communication/SummaryBox.stories.js` with Default summary box example |

**Note**: T029 (Accordion), T031 (Banner), T032 (Modal), T034 (SiteAlert) are JS-driven — stories MUST include USWDS JavaScript dependency note.

### Allowed Read Paths

- `specs/008-storybook-documentation/context-index.json`
- `specs/008-storybook-documentation/contracts/story-interface.md`
- `specs/008-storybook-documentation/data-model.md`
- `specs/008-storybook-documentation/quickstart.md`

### Allowed Write Paths

- `packages/styles/src/stories/components/Communication/Accordion.stories.js`
- `packages/styles/src/stories/components/Communication/Alert.stories.js`
- `packages/styles/src/stories/components/Communication/Banner.stories.js`
- `packages/styles/src/stories/components/Communication/Modal.stories.js`
- `packages/styles/src/stories/components/Communication/ProcessList.stories.js`
- `packages/styles/src/stories/components/Communication/SiteAlert.stories.js`
- `packages/styles/src/stories/components/Communication/StepIndicator.stories.js`
- `packages/styles/src/stories/components/Communication/SummaryBox.stories.js`
- `handoffs/implement/008-implement-001/S06-documentation-01/results` (receipt)

### Validation Commands

```bash
for f in Accordion Alert Banner Modal ProcessList SiteAlert StepIndicator SummaryBox; do test -f "packages/styles/src/stories/components/Communication/${f}.stories.js" && echo "${f}_OK"; done
grep -q 'USWDS JavaScript' packages/styles/src/stories/components/Communication/Accordion.stories.js
grep -q 'USWDS JavaScript' packages/styles/src/stories/components/Communication/Modal.stories.js
```

### Forbidden Actions

- edit `tasks.md`
- edit SCSS source files
- edit `.storybook/` config files
- dispatch workers

---

## Shard S07-documentation-01: US2 Utilities

| Field | Value |
|-------|-------|
| **shard_id** | `S07-documentation-01` |
| **task_ids** | `T039`, `T040`, `T041`, `T042`, `T043`, `T044`, `T045`, `T046`, `T047` |
| **lifecycle_stage** | `us2_utilities` |
| **depends_on** | `S02-documentation-01` |
| **receipt_path** | `handoffs/implement/008-implement-001/S07-documentation-01/results/receipt.json` |

### Tasks

| ID | Description |
|----|-------------|
| T039 | Create `packages/styles/src/stories/utilities/BackgroundColors.stories.js` with a grid showing all `.pathable-bg-*` values (primary, base, surface, accent, link, focus-ring, danger, success, transparent) as color swatches |
| T040 | Create `packages/styles/src/stories/utilities/TextColors.stories.js` with a grid showing all `.pathable-text-*` values (base, primary, muted, accent, link, white) as text swatches |
| T041 | Create `packages/styles/src/stories/utilities/Spacing.stories.js` with examples of `.pathable-padding-*` and `.pathable-margin-*` classes showing values 0-10 and 15, plus responsive breakpoint note |
| T042 | Create `packages/styles/src/stories/utilities/Display.stories.js` with examples of `.pathable-display-*` values (flex, block, inline, inline-block, none) and responsive variant documentation |
| T043 | Create `packages/styles/src/stories/utilities/TypographyUtilities.stories.js` with examples of `.pathable-font-family-*` and `.pathable-text-*` (font-weight) classes |
| T044 | Create `packages/styles/src/stories/utilities/Border.stories.js` with examples of `.pathable-border-*` (0-5) and `.pathable-border-radius-*` (sm, md, lg) classes |
| T045 | Create `packages/styles/src/stories/utilities/FlexAlignment.stories.js` with examples of `.pathable-flex-*`, `.pathable-flex-align-*`, and `.pathable-flex-justify-*` classes with visual alignment demonstrations |
| T046 | Create `packages/styles/src/stories/utilities/Width.stories.js` with examples of `.pathable-width-*` (full, auto) and `.pathable-maxw-*` (mobile, mobile-lg, tablet, desktop) classes |
| T047 | Create `packages/styles/src/stories/utilities/TextAlignment.stories.js` with examples of `.pathable-text-*` (center, left, right) classes and responsive variant documentation |

### Allowed Read Paths

- `specs/008-storybook-documentation/context-index.json`
- `specs/008-storybook-documentation/contracts/story-interface.md`
- `specs/008-storybook-documentation/data-model.md`
- `specs/008-storybook-documentation/quickstart.md`

### Allowed Write Paths

- `packages/styles/src/stories/utilities/BackgroundColors.stories.js`
- `packages/styles/src/stories/utilities/TextColors.stories.js`
- `packages/styles/src/stories/utilities/Spacing.stories.js`
- `packages/styles/src/stories/utilities/Display.stories.js`
- `packages/styles/src/stories/utilities/TypographyUtilities.stories.js`
- `packages/styles/src/stories/utilities/Border.stories.js`
- `packages/styles/src/stories/utilities/FlexAlignment.stories.js`
- `packages/styles/src/stories/utilities/Width.stories.js`
- `packages/styles/src/stories/utilities/TextAlignment.stories.js`
- `handoffs/implement/008-implement-001/S07-documentation-01/results` (receipt)

### Validation Commands

```bash
test -f packages/styles/src/stories/utilities/BackgroundColors.stories.js && echo 'BackgroundColors_OK'
test -f packages/styles/src/stories/utilities/Spacing.stories.js && echo 'Spacing_OK'
test -f packages/styles/src/stories/utilities/FlexAlignment.stories.js && echo 'FlexAlignment_OK'
test -f packages/styles/src/stories/utilities/TextAlignment.stories.js && echo 'TextAlignment_OK'
grep -q 'pathable-bg-primary' packages/styles/src/stories/utilities/BackgroundColors.stories.js
```

### Forbidden Actions

- edit `tasks.md`
- edit SCSS source files
- edit `.storybook/` config files
- dispatch workers

---

## Shard S08-documentation-01: US3 PathAble Theme

| Field | Value |
|-------|-------|
| **shard_id** | `S08-documentation-01` |
| **task_ids** | `T048`, `T049` |
| **lifecycle_stage** | `us3_theme` |
| **depends_on** | `S02-documentation-01` |
| **receipt_path** | `handoffs/implement/008-implement-001/S08-documentation-01/results/receipt.json` |

### Tasks

| ID | Description |
|----|-------------|
| T048 | Create `packages/styles/.storybook/manager.js` with custom PathAble theme using `@storybook/theming` `create()` — set `brandTitle: "Pathable Styles"`, `colorPrimary: "#00365c"`, `colorSecondary: "#1cae96"`, `fontBase: "'Nunito', system-ui, sans-serif"`, `barBg: "#00365c"`, and other brand tokens from data-model.md StorybookTheme entity |
| T049 | Create `packages/styles/.storybook/manager-head.html` with Google Fonts preconnect and stylesheet links for Fredoka and Nunito fonts so the custom theme fonts render in the Storybook manager UI |

### Allowed Read Paths

- `specs/008-storybook-documentation/context-index.json`
- `specs/008-storybook-documentation/data-model.md` (StorybookTheme entity)
- `specs/008-storybook-documentation/quickstart.md`
- `specs/008-storybook-documentation/contracts/story-interface.md`

### Allowed Write Paths

- `packages/styles/.storybook/manager.js`
- `packages/styles/.storybook/manager-head.html`
- `handoffs/implement/008-implement-001/S08-documentation-01/results` (receipt)

### Validation Commands

```bash
test -f packages/styles/.storybook/manager.js && echo 'manager_JS_OK'
test -f packages/styles/.storybook/manager-head.html && echo 'manager_head_HTML_OK'
grep -q 'Pathable Styles' packages/styles/.storybook/manager.js
grep -q 'Fredoka' packages/styles/.storybook/manager-head.html
grep -q 'Nunito' packages/styles/.storybook/manager-head.html
```

### Forbidden Actions

- edit `tasks.md`
- edit SCSS source files
- edit story files in `src/stories/`
- dispatch workers

---

## Shard S09-documentation-01: Polish & Verification

| Field | Value |
|-------|-------|
| **shard_id** | `S09-documentation-01` |
| **task_ids** | `T050`, `T051`, `T052`, `T053` |
| **lifecycle_stage** | `polish` |
| **depends_on** | `S03-documentation-01`, `S04-documentation-01`, `S05-documentation-01`, `S06-documentation-01`, `S07-documentation-01`, `S08-documentation-01` |
| **receipt_path** | `handoffs/implement/008-implement-001/S09-documentation-01/results/receipt.json` |

### Tasks

| ID | Description |
|----|-------------|
| T050 | Run `pnpm build` from `packages/styles/` to ensure `dist/styles.css` compiles successfully |
| T051 | Run `pnpm storybook` from `packages/styles/` and verify Storybook starts on `http://localhost:6006` without errors |
| T052 | Verify no test-related addons or configurations exist — check `packages/styles/.storybook/main.js` addons array and `packages/styles/package.json` for test dependencies (FR-009 compliance check) |
| T053 | Verify all component stories only reference `pathable-*` classes (no `.usa-*` class references) and JS-driven components include the USWDS JS dependency note (FR-012 compliance check) |

### Allowed Read Paths

- `packages/styles/package.json`
- `packages/styles/.storybook/main.js`
- `packages/styles/src/stories/` (all story files)
- `specs/008-storybook-documentation/context-index.json`
- `specs/008-storybook-documentation/contracts/story-interface.md`

### Allowed Write Paths

- `handoffs/implement/008-implement-001/S09-documentation-01/results` (receipt only — this shard validates, does not modify source)

### Validation Commands

```bash
cd packages/styles && pnpm build
cd packages/styles && timeout 15 pnpm storybook --ci
grep -q 'addon-docs' packages/styles/.storybook/main.js
! grep -q 'addon-interactions' packages/styles/.storybook/main.js
rg -l 'usa-' packages/styles/src/stories/ --type js | wc -l
```

### Forbidden Actions

- edit `tasks.md`
- edit any `.stories.js` files
- edit `.storybook/` config files
- edit SCSS source files
- edit `package.json`
- dispatch workers