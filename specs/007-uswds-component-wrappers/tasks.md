# Tasks: USWDS Component Wrappers

**Input**: Design documents from `/specs/007-uswds-component-wrappers/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/scss-interface.md

**Tests**: No test framework tasks requested. Verification is via compiled CSS inspection and visual regression.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1 - Core Component Wrappers P1](#phase-3-user-story-1---core-component-wrappers-priority-p1)
- [Phase 4: User Story 1 - Extended Component Wrappers P1](#phase-4-user-story-1---extended-component-wrappers-priority-p1)
- [Phase 5: User Story 2 - Bundle Packages P2](#phase-5-user-story-2---bundle-packages-priority-p2)
- [Phase 6: User Story 2 - Package Entry Points P2](#phase-6-user-story-2---package-entry-points-priority-p2)
- [Phase 7: User Story 3 - Docs Site Refactoring P3](#phase-7-user-story-3---docs-site-refactoring-priority-p3)
- [Phase 8: Polish](#phase-8-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Examples](#parallel-examples)
- [Implementation Strategy](#implementation-strategy)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure and update entry points for component wrappers

- [x] T001 Create `packages/styles/src/pathable-component-wrappers/` directory
- [x] T002 [P] Update `packages/styles/src/index.scss` to forward component wrapper files (individual forwards, commented for selective import)
- [x] T003 [P] Create `packages/styles/src/_components-custom-properties.scss` with the `:root` block for dual `--pathable-{component}-{property}` / `--usa-{component}-{property}` emission

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Component custom properties and wrapper template that MUST be complete before any user story can begin

- [x] T004 Create `packages/styles/src/_components-custom-properties.scss` with dual CSS custom properties for key component tokens (button border-radius/padding, alert padding, card border-radius, form spacing, etc.)
- [x] T005 Add `@forward '_components-custom-properties';` to `packages/styles/src/index.scss`
- [x] T006 Update `packages/styles/src/index.scss` with `@forward 'pathable-component-wrappers';` to enable all-component import

**Checkpoint**: Foundation ready — component wrapper SCSS files can now be created

---

## Phase 3: User Story 1 - Core Component Wrappers (Priority: P1)

**Goal**: Developers can use `.pathable-*` component classes for the most commonly used USWDS components. The compiled `dist/styles.css` contains `.pathable-button`, `.pathable-alert`, `.pathable-card`, etc. that resolve to identical styles as `.usa-*` equivalents.

**Independent Test**: Create an HTML page with `<button class="pathable-button">` and `<div class="pathable-card">`. Inspect computed styles — they match `.usa-button` and `.usa-card` respectively.

### Component Wrappers — Batch 1: Layout & Navigation

All tasks in this batch are [P] (can run in parallel — each is an independent file):

- [x] T007 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-breadcrumb.scss` — wraps `.usa-breadcrumb`
- [x] T008 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-button.scss` — wraps `.usa-button`, `.usa-button--accent-cool`, `.usa-button--accent-warm`, `.usa-button--outline`, `.usa-button--inverse`, `.usa-button--base`, `.usa-button--secondary`, `.usa-button--big`, `.usa-button--unstyled`
- [x] T009 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-button-group.scss` — wraps `.usa-button-group`
- [x] T010 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-card.scss` — wraps `.usa-card`, `.usa-card__container`, `.usa-card__header`, `.usa-card__body`, `.usa-card__footer`, `.usa-card__heading`, `.usa-card__media`, `.usa-card__media-exdent`, `.usa-card--flag`, `.usa-card--header-first`
- [x] T011 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-footer.scss` — wraps `.usa-footer`, `.usa-footer--slim`, `.usa-footer__primary-section`, `.usa-footer__secondary-section`, `.usa-footer__nav`, `.usa-footer__return-to-top`, `.usa-footer__primary-content`, `.usa-footer__secondary-content`, `.usa-footer__contact-heading`, `.usa-footer__contact-info`, `.usa-footer__address`, `.usa-footer__logo-heading`, `.usa-footer__big-section`, `.usa-footer__slim-section`, `.usa-footer__social-links`, `.usa-footer__social-link`, `.usa-footer__identifier-heading`
- [x] T012 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-header.scss` — wraps `.usa-header`, `.usa-header--basic`, `.usa-header--extended`, `.usa-header--megamenu` (JS-driven)
- [x] T013 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-icon.scss` — wraps `.usa-icon`
- [x] T014 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-identifier.scss` — wraps `.usa-identifier`, `.usa-identifier__section`, `.usa-identifier__container`, `.usa-identifier__logos`, `.usa-identifier__logo`, `.usa-identifier__identity`, `.usa-identifier__required-links`, `.usa-identifier__required-links-list`, `.usa-identifier__usagov`, `.usa-identifier__metadata`
- [x] T015 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-link.scss` — wraps `.usa-link`, `.usa-link--external`, `.usa-link--alt`
- [x] T016 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-list.scss` — wraps `.usa-list`
- [x] T017 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-media-block.scss` — wraps `.usa-media-block`, `.usa-media-block__img`, `.usa-media-block__body`
- [x] T018 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-nav.scss` — wraps `.usa-nav`, `.usa-nav__primary`, `.usa-nav__submenu`, `.usa-nav__secondary`, `.usa-nav__secondary-links` (JS-driven)
- [x] T019 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-pagination.scss` — wraps `.usa-pagination`, `.usa-pagination__item`, `.usa-pagination__link`, `.usa-pagination__arrow`
- [x] T020 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-sidenav.scss` — wraps `.usa-sidenav`, `.usa-sidenav__item`, `.usa-sidenav__sublist`
- [x] T021 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-skipnav.scss` — wraps `.usa-skipnav`
- [x] T022 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-table.scss` — wraps `.usa-table`, `.usa-table--borderless`, `.usa-table--compact`, `.usa-table--striped`

### Component Wrappers — Batch 2: Communication & Info

All tasks in this batch are [P]:

- [x] T023 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-accordion.scss` — wraps `.usa-accordion`, `.usa-accordion__heading`, `.usa-accordion__button`, `.usa-accordion__content` (JS-driven)
- [x] T024 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-alert.scss` — wraps `.usa-alert`, `.usa-alert--info`, `.usa-alert--warning`, `.usa-alert--error`, `.usa-alert--success`, `.usa-alert--emergency`, `.usa-alert--slim`, `.usa-alert__body`, `.usa-alert__text`, `.usa-alert__heading`
- [x] T025 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-banner.scss` — wraps `.usa-banner`, `.usa-banner__header`, `.usa-banner__button`, `.usa-banner__content`, `.usa-banner__guidance`, `.usa-banner__lock-image` (JS-driven)
- [x] T026 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-collection.scss` — wraps `.usa-collection`, `.usa-collection__item`, `.usa-collection__heading`, `.usa-collection__body`, `.usa-collection__meta`, `.usa-collection__image`
- [x] T027 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-graphic-list.scss` — wraps `.usa-graphic-list`, `.usa-graphic-list__heading`, `.usa-graphic-list__description`
- [x] T028 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-hero.scss` — wraps `.usa-hero`, `.usa-hero__callout`, `.usa-hero__heading`
- [x] T029 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-icon-list.scss` — wraps `.usa-icon-list`, `.usa-icon-list__item`, `.usa-icon-list__icon`, `.usa-icon-list__content`
- [x] T030 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-modal.scss` — wraps `.usa-modal`, `.usa-modal__content`, `.usa-modal__heading`, `.usa-modal__footer`, `.usa-modal__close` (JS-driven)
- [x] T031 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-process-list.scss` — wraps `.usa-process-list`, `.usa-process-list__item`, `.usa-process-list__heading`
- [x] T032 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-prose.scss` — wraps `.usa-prose`
- [x] T033 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-site-alert.scss` — wraps `.usa-site-alert`, `.usa-site-alert--info`, `.usa-site-alert--warning`, `.usa-site-alert--emergency`, `.usa-site-alert--slim` (JS-driven)
- [x] T034 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-step-indicator.scss` — wraps `.usa-step-indicator`, `.usa-step-indicator__header`, `.usa-step-indicator__segment`, `.usa-step-indicator__segment-label`, `.usa-step-indicator__segment-count`, `.usa-step-indicator__body`, `.usa-step-indicator__body-text`
- [x] T035 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-summary-box.scss` — wraps `.usa-summary-box`, `.usa-summary-box__heading`, `.usa-summary-box__body`, `.usa-summary-box__link`
- [x] T036 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-tag.scss` — wraps `.usa-tag`, `.usa-tag--big`
- [x] T037 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-tooltip.scss` — wraps `.usa-tooltip` (JS-driven)

### Component Wrappers — Batch 3: Form Controls

All tasks in this batch are [P]:

- [x] T038 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-character-count.scss` — wraps `.usa-character-count` (JS-driven)
- [x] T039 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-checkbox.scss` — wraps `.usa-checkbox`, `.usa-checkbox__input`, `.usa-checkbox__label`
- [x] T040 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-checklist.scss` — wraps `.usa-checklist`
- [x] T041 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-combo-box.scss` — wraps `.usa-combo-box` (JS-driven)
- [x] T042 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-date-picker.scss` — wraps `.usa-date-picker` (JS-driven)
- [x] T043 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-date-range-picker.scss` — wraps `.usa-date-range-picker` (JS-driven)
- [x] T044 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-error-message.scss` — wraps `.usa-error-message`
- [x] T045 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-fieldset.scss` — wraps `.usa-fieldset`
- [x] T046 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-file-input.scss` — wraps `.usa-file-input` (JS-driven)
- [x] T047 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-form.scss` — wraps `.usa-form`
- [x] T048 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-form-group.scss` — wraps `.usa-form-group`
- [x] T049 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-hint.scss` — wraps `.usa-hint`
- [x] T050 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-input.scss` — wraps `.usa-input`
- [x] T051 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-input-mask.scss` — wraps `.usa-input-mask` (JS-driven)
- [x] T052 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-input-prefix-suffix.scss` — wraps `.usa-input-prefix-suffix`, `.usa-input-prefix`, `.usa-input-suffix`
- [x] T053 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-label.scss` — wraps `.usa-label`
- [x] T054 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-legend.scss` — wraps `.usa-legend`
- [x] T055 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-memorable-date.scss` — wraps `.usa-memorable-date`
- [x] T056 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-radio.scss` — wraps `.usa-radio`, `.usa-radio__input`, `.usa-radio__label`
- [x] T057 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-range.scss` — wraps `.usa-range`
- [x] T058 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-search.scss` — wraps `.usa-search`, `.usa-search--big`, `.usa-search--small`
- [x] T059 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-select.scss` — wraps `.usa-select`
- [x] T060 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-textarea.scss` — wraps `.usa-textarea`
- [x] T061 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-time-picker.scss` — wraps `.usa-time-picker` (JS-driven)
- [x] T062 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-validation.scss` — wraps `.usa-validation` (JS-driven)

### Component Wrappers — Batch 4: Layout & Utility Components

All tasks in this batch are [P]:

- [x] T063 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-embed-container.scss` — wraps `.usa-embed-container`
- [x] T064 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-in-page-navigation.scss` — wraps `.usa-in-page-nav` (JS-driven)
- [x] T065 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-language-selector.scss` — wraps `.usa-language-selector` (JS-driven)
- [x] T066 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-layout-grid.scss` — wraps `.grid-container`, `.grid-row`, `.grid-col`, `.grid-gap` layout classes with `.pathable-` prefix
- [x] T067 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-section.scss` — wraps `.usa-section`, `.usa-section--dark`

**Checkpoint**: Core 35+ component wrapper files exist. Run `pnpm build` in `packages/styles/` and verify `.pathable-*` classes appear in compiled `dist/styles.css`.

---

## Phase 4: User Story 1 - Extended Component Wrappers (Priority: P1)

**Goal**: Complete remaining component wrappers for full coverage

All tasks in this batch are [P]:

- [x] T068 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-site-title.scss` — wraps `.usa-site-title`
- [x] T069 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-paragraph.scss` — wraps `.usa-paragraph`
- [x] T070 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-content.scss` — wraps `.usa-content`
- [x] T071 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-dark-background.scss` — wraps `.usa-dark-background`
- [x] T072 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-display.scss` — wraps `.usa-display`
- [x] T073 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-intro.scss` — wraps `.usa-intro`
- [x] T074 [P] [US1] Create `packages/styles/src/pathable-component-wrappers/pathable-layout-docs.scss` — forwards `.usa-layout-docs` styles

**Checkpoint**: All component wrapper files exist. Verify `dist/styles.css` contains at least 40 `.pathable-*` component class definitions.

---

## Phase 5: User Story 2 - Bundle Packages (Priority: P2)

**Goal**: Developers can selectively import component wrappers via bundle packages, reducing compiled CSS size.

**Independent Test**: Create a SCSS file that imports only `pathable-form-controls` bundle. Compile and verify the output contains form-related components but NOT navigation or communication components.

All tasks in this batch are [P] (each is an independent bundle file):

- [x] T075 [P] [US2] Create `packages/styles/src/pathable-component-wrappers/pathable-form-controls.scss` — forwards: pathable-character-count, pathable-checkbox, pathable-combo-box, pathable-date-picker, pathable-date-range-picker, pathable-error-message, pathable-fieldset, pathable-file-input, pathable-form, pathable-form-group, pathable-hint, pathable-input, pathable-input-mask, pathable-input-prefix-suffix, pathable-label, pathable-legend, pathable-memorable-date, pathable-radio, pathable-range, pathable-select, pathable-textarea, pathable-time-picker, pathable-validation
- [x] T076 [P] [US2] Create `packages/styles/src/pathable-component-wrappers/pathable-typography.scss` — forwards: pathable-content, pathable-dark-background, pathable-display, pathable-intro, pathable-link, pathable-list, pathable-paragraph, pathable-prose
- [x] T077 [P] [US2] Create `packages/styles/src/pathable-component-wrappers/pathable-navigation.scss` — forwards: pathable-breadcrumb, pathable-header, pathable-in-page-navigation, pathable-nav, pathable-pagination, pathable-search, pathable-sidenav, pathable-skipnav
- [x] T078 [P] [US2] Create `packages/styles/src/pathable-component-wrappers/pathable-layout.scss` — forwards: pathable-embed-container, pathable-layout-docs, pathable-layout-grid, pathable-media-block, pathable-section
- [x] T079 [P] [US2] Create `packages/styles/src/pathable-component-wrappers/pathable-communication.scss` — forwards: pathable-accordion, pathable-alert, pathable-banner, pathable-card, pathable-collection, pathable-graphic-list, pathable-hero, pathable-icon, pathable-icon-list, pathable-identifier, pathable-modal, pathable-process-list, pathable-site-alert, pathable-step-indicator, pathable-summary-box, pathable-table, pathable-tag, pathable-tooltip

**Checkpoint**: 5 bundle package files exist. Verify selective import works.

---

## Phase 6: User Story 2 - Package Entry Points (Priority: P2)

**Goal**: Provide the all-components entry point and update `index.scss` for the complete package system

- [x] T080 [P] [US2] Create `packages/styles/src/pathable-component-wrappers/pathable-all.scss` — forwards all individual component wrappers and all bundle packages
- [x] T081 [P] [US2] Create `packages/styles/src/pathable-component-wrappers/_index.scss` — forwards `pathable-all` (the all-in-one convenience entry)
- [x] T082 [P] [US2] Update `packages/styles/src/index.scss` to include `@forward 'pathable-component-wrappers';` if not already added in T006
- [x] T083 [US2] Run `pnpm build` in `packages/styles/` and verify compiled `dist/styles.css` contains all component wrappers
- [x] T084 [US2] Create a test SCSS file `packages/styles/test/selective-import.scss` that imports only `pathable-button` and verifies no other component classes appear in compiled output

**Checkpoint**: Package system complete. Selective import works, all-in-one import works, build succeeds.

---

## Phase 7: User Story 3 - Docs Site Refactoring (Priority: P3)

**Goal**: Replace `.usa-*` class references in `apps/docs` with `.pathable-*` equivalents, retaining both classes for JS-driven components where needed.

**Independent Test**: Search `apps/docs/src/` for `.usa-` class references — zero remain in component templates (with JS-driven exceptions documented).

- [x] T085 [P] [US3] Audit `apps/docs/src/styles/custom.css` for `.usa-*` class references — categorize as replaceable (non-JS) or dual-class (JS-driven)
- [x] T086 [P] [US3] Audit `apps/docs/src/components/PageFrame.astro` for `.usa-*` class references in `<style>` blocks and inline HTML classes
- [x] T087 [P] [US3] Audit `apps/docs/src/components/HorizontalNav.astro` for `.usa-*` class references
- [x] T088 [P] [US3] Audit `apps/docs/src/components/SkipNav.astro` for `.usa-*` class references
- [x] T089 [P] [US3] Audit `apps/docs/src/components/DocFooter.astro` for `.usa-*` class references
- [x] T090 [US3] Refactor `apps/docs/src/styles/custom.css` — replace all `.usa-*` with `.pathable-*`
- [x] T091 [P] [US3] Refactor `apps/docs/src/components/PageFrame.astro` — replace `.usa-*` with `.pathable-*`, add dual classes for JS-driven components
- [x] T092 [P] [US3] Refactor `apps/docs/src/components/HorizontalNav.astro` — replace `.usa-*` with `.pathable-*`, add dual classes for JS-driven components
- [x] T093 [P] [US3] Refactor `apps/docs/src/components/SkipNav.astro` — replace `.usa-*` with `.pathable-*`, add dual classes for JS-driven components
- [x] T094 [P] [US3] Refactor `apps/docs/src/components/DocFooter.astro` — replace `.usa-*` with `.pathable-*`, add dual classes for JS-driven components
- [x] T095 [US3] Run `pnpm build` in `apps/docs/` and verify zero build errors
- [x] T096 [US3] Run `rg '\.usa-' apps/docs/src/` and verify zero remaining `.usa-*` references (with documented JS-driven exceptions)

**Checkpoint**: Docs site fully migrated to `.pathable-*` component classes. Build succeeds.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Build verification, documentation, and final cleanup

- [x] T097 [P] Run `pnpm build` at workspace root and verify both packages compile without errors
- [x] T098 [P] Update `packages/styles/BRAND_RULES.md` with component wrapper naming convention section
- [x] T099 [P] Verify AGENTS.md component wrapper section is complete (should have been updated in Phase 1)
- [x] T100 Run final `rg '\.usa-'` across entire `apps/docs/src/` to confirm zero regressions (only comment references remain)
- [ ] T101 Final visual regression check — verify docs site renders identically before/after refactoring (manual check — requires viewing docs site in browser)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 — Core Wrappers (Phase 3-4)**: Depends on Phase 1-2 — no dependencies on other stories
- **User Story 2 — Bundles (Phase 5-6)**: Depends on US1 (Phase 3-4) wrappers existing — BLOCKS selective import testing
- **User Story 3 — Docs (Phase 7)**: Depends on US1 wrappers being compiled. May start once Phase 3 wrappers exist even before US2 bundles
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 1-2 — No dependencies on other stories
- **User Story 2 (P2)**: Can start after Phase 1-2 + Phase 3 (needs individual wrapper files to exist)
- **User Story 3 (P3)**: Can start after Phase 1-2 + Phase 3 (needs wrappers compiled so refactored docs site renders correctly)

### Within Each User Story

- All component wrapper tasks within a batch are [P] (parallel) — each file is independent
- Bundle packages depend on individual wrapper files existing
- Docs refactoring tasks within a file are independent — can be parallelized

### Parallel Opportunities

- **Phase 3 (US1 Core)**: All 61 wrapper tasks can run in parallel (61 parallel subagents)
- **Phase 4 (US1 Extended)**: All 7 extended wrapper tasks can run in parallel
- **Phase 5 (US2 Bundles)**: All 5 bundle files can run in parallel
- **Phase 7 (US3 Docs)**: Audit tasks (T085-T089) can run in parallel; refactoring tasks (T090-T094) can run in parallel once audits complete
- **Phase 8**: T097-T099 can run in parallel

---

## Parallel Examples

### User Story 1 — Component Wrappers (Batch 1)

```bash
# Launch all core component wrappers in parallel:
Task: "Create pathable-breadcrumb.scss"
Task: "Create pathable-button.scss"
Task: "Create pathable-card.scss"
Task: "Create pathable-footer.scss"
Task: "Create pathable-header.scss"
Task: "Create pathable-identifier.scss"
Task: "Create pathable-link.scss"
# ... all 15+ batch 1 tasks
```

### User Story 2 — Bundle Packages

```bash
# Launch all bundle package files in parallel:
Task: "Create pathable-form-controls.scss"
Task: "Create pathable-typography.scss"
Task: "Create pathable-navigation.scss"
Task: "Create pathable-layout.scss"
Task: "Create pathable-communication.scss"
```

### User Story 3 — Docs Refactoring

```bash
# Launch all audit tasks in parallel:
Task: "Audit custom.css for .usa-* references"
Task: "Audit PageFrame.astro for .usa-* references"
Task: "Audit HorizontalNav.astro for .usa-* references"
Task: "Audit SkipNav.astro for .usa-* references"
Task: "Audit DocFooter.astro for .usa-* references"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (directory + index.scss update)
2. Complete Phase 2: Foundational (custom properties partial)
3. Complete Phase 3-4: User Story 1 (all component wrapper files)
4. Run `pnpm build` and verify compiled CSS contains `.pathable-*` classes
5. **STOP and VALIDATE**: Test US1 independently — compiled CSS should have 40+ `.pathable-*` component classes

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 (core wrappers) → Test independently (MVP! ~35 core components)
3. Add US1 (extended wrappers) → All ~60 components available
4. Add US2 (bundle packages) → Selective import works
5. Add US3 (docs refactoring) → Docs uses PathAble naming
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple agents:

1. Team completes Phase 1-2 together
2. Once foundational is done:
   - Agent A: US1 — batch 1 (layout & navigation wrappers) — 16 tasks
   - Agent B: US1 — batch 2 (communication wrappers) — 15 tasks
   - Agent C: US1 — batch 3 (form control wrappers) — 25 tasks
   - Agent D: US1 — batch 4 (layout/utility wrappers) — 5 tasks
3. After US1 wrappers exist:
   - Agent A: US2 bundles — 5 bundle files
   - Agent B: US3 docs — begin audit
   - Agent C: US3 docs — begin refactoring
4. Polish: any agent can run final verification

---

## Notes

- [P] tasks = different files, no dependencies — can run in parallel
- [US1], [US2], [US3] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Component wrapper files follow the `@extend` pattern documented in research.md and contracts/scss-interface.md
- JS-driven components (accordion, banner, combo-box, date-picker, date-range-picker, file-input, header, in-page-navigation, input-mask, modal, nav, site-alert, time-picker, tooltip, validation) must have the `.usa-*` docstring comment in their wrapper file noting the requirement
- Run `pnpm build` after each phase to verify compilation
- Stop at any checkpoint to validate story independently
