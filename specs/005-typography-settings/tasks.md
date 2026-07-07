# Tasks: USWDS Typography Settings

**Input**: Design documents from `/specs/005-typography-settings/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No formal test tasks included — verification is manual visual inspection and compiled CSS inspection per the quickstart guide.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **SCSS package**: `packages/styles/src/` is the source directory
- All tasks reference paths under `packages/styles/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project is ready for typography changes

**No tasks needed** — USWDS v3.x is already a dependency (from 003-wrap-uswds-theme), Dart Sass is already configured, and the build command already includes `--load-path=node_modules/@uswds/uswds/packages`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T001 Create `_fonts.scss` partial with `@font-face` rules for all four brand typefaces in `packages/styles/src/_fonts.scss`
  - Fredoka Regular (400), Nunito Regular (400) + SemiBold (600), Poppins Bold (700), Montserrat Bold (700)
  - Use `$theme-font-path` variable for the font path (defaults to `../fonts`)
  - Follow the exact pattern from research.md Decision D8

- [ ] T002 [P] Update `index.scss` to forward `_fonts.scss` before `_uswds-theme.scss` in `packages/styles/src/index.scss`
  - Order: `@forward "fonts";` then `@forward "uswds-theme";` then existing forwards
  - `@font-face` rules must be available before USWDS core is configured

- [ ] T003 [P] Add custom typeface token definitions to `_uswds-theme.scss` in `packages/styles/src/_uswds-theme.scss`
  - Add `$theme-typeface-tokens` map with entries for `fredoka`, `nunito`, `poppins`, `montserrat`
  - Each entry: `display-name`, `cap-height: 364px`, `stack` with full fallback chain
  - Follow research.md Decision D2 structure

- [ ] T004 [P] Configure font family type assignments and role assignments in `_uswds-theme.scss` in `packages/styles/src/_uswds-theme.scss`
  - Set `$theme-font-type-cond: false`, `$theme-font-type-icon: false`, `$theme-font-type-lang: false`
  - Set `$theme-font-type-mono: "roboto-mono"` (unchanged default)
  - Set `$theme-font-type-sans: "source-sans-pro"` (unchanged default — custom typefaces assigned via roles)
  - Set `$theme-font-type-serif: false` (not used)
  - Set `$theme-font-role-heading: "fredoka"`, `$theme-font-role-body: "nunito"`, `$theme-font-role-ui: "nunito"`, `$theme-font-role-code: "mono"`, `$theme-font-role-alt: "montserrat"`

**Checkpoint**: Foundation ready — brand fonts are configured in USWDS, role assignments are in place, and `@font-face` rules will be compiled. User story implementation can now begin.

---

## Phase 3: User Story 1 - Developers use USWDS components with brand-matched typography (Priority: P1) 🎯 MVP

**Goal**: USWDS components render with PathAble brand fonts (Fredoka for headings, Nunito for body/UI) without additional CSS font-family declarations.

**Independent Test**: Import a USWDS component (e.g., `usa-accordion`) into a page. The component's heading renders in Fredoka, body text renders in Nunito.

### Implementation for User Story 1

- [ ] T005 [US1] Configure body typography settings in `_uswds-theme.scss` in `packages/styles/src/_uswds-theme.scss`
  - Set `$theme-body-font-family: "body"`, `$theme-body-font-size: "sm"`, `$theme-body-line-height: 5`
  - Set `$theme-style-body-element: false` (preserve existing behavior)
  - Set `$theme-respect-user-font-size: true`

- [ ] T006 [US1] Build the package and verify brand fonts appear in USWDS components in `packages/styles/`
  - Run `pnpm build` and verify `rg "Fredoka" dist/styles.css`, `rg "Nunito" dist/styles.css`
  - Verify `rg "font-family-heading" dist/styles.css` shows Fredoka stack
  - Verify `rg "font-family-body" dist/styles.css` shows Nunito stack

**Checkpoint**: At this point, User Story 1 should be fully functional — USWDS components render with PathAble brand fonts.

---

## Phase 4: User Story 2 - Designers verify type scale and hierarchy in USWDS components (Priority: P2)

**Goal**: Heading sizes (h1–h6), body text size, and line-height follow the PathAble typography scale in USWDS prose content.

**Independent Test**: Render a page with all six heading levels using USWDS prose styles. Verify h1=24px, h2=18px, h3=18px, h4=16px, h5=14px, h6=12px, body=16px.

### Implementation for User Story 2

- [ ] T007 [P] [US2] Configure type scale theme tokens in `_uswds-theme.scss` in `packages/styles/src/_uswds-theme.scss`
  - Set `$theme-type-scale-3xs: 1` (12px), `$theme-type-scale-2xs: 3` (14px), `$theme-type-scale-xs: 4` (15px)
  - Set `$theme-type-scale-sm: 5` (16px), `$theme-type-scale-md: 7` (18px)
  - Set `$theme-type-scale-lg: 10` (24px), `$theme-type-scale-xl: 12` (32px)
  - Set `$theme-type-scale-2xl: 14` (40px), `$theme-type-scale-3xl: 15` (48px)
  - Follow research.md Decision D3 exact values

- [ ] T008 [P] [US2] Configure heading size tokens in `_uswds-theme.scss` in `packages/styles/src/_uswds-theme.scss`
  - Set `$theme-display-font-size: "xl"`, `$theme-h1-font-size: "lg"`, `$theme-h2-font-size: "md"`
  - Set `$theme-h3-font-size: "md"`, `$theme-h4-font-size: "sm"`, `$theme-h5-font-size: "2xs"`
  - Set `$theme-h6-font-size: "3xs"`, `$theme-body-font-size: "sm"`

- [ ] T009 [US2] Configure line-height, heading, and prose settings in `_uswds-theme.scss` in `packages/styles/src/_uswds-theme.scss`
  - Set `$theme-heading-line-height: 3` (1.35), `$theme-body-line-height: 5` (1.62)
  - Set `$theme-lead-font-family: "heading"`, `$theme-lead-font-size: "lg"`, `$theme-lead-line-height: 6`, `$theme-lead-measure: 6`
  - Set `$theme-prose-font-family: "body"`
  - Set `$theme-heading-margin-top: 1.5em`, `$theme-paragraph-margin-top: 1em`
  - Set `$theme-small-font-size: "2xs"`, `$theme-display-font-size: "xl"`

**Checkpoint**: At this point, User Story 2 should be functional — heading hierarchy and type scale match PathAble brand guide.

---

## Phase 5: User Story 3 - Consumers reference --pathable-font-* and --usa-font-* CSS custom properties (Priority: P2)

**Goal**: Dual `--pathable-font-*` and `--usa-font-*` CSS custom properties are available in compiled output, resolving to identical values.

**Independent Test**: Set `font-family: var(--pathable-font-heading)` and `font-family: var(--usa-font-heading)` on elements. Both resolve to the Fredoka font stack.

### Implementation for User Story 3

- [ ] T010 [P] [US3] Add `$typography-tokens` map and dual `@each` loop to `_typography.scss` in `packages/styles/src/_typography.scss`
  - Create a `$typography-tokens` map with entries for font-family, font-size, font-weight, and line-height tokens
  - Add an `@each` loop that emits both `--pathable-#{$name}` and `--usa-#{$name}` for each entry
  - Follow the contract defined in `contracts/scss-interface.md` Dual Naming Convention section
  - Ensure existing `--pathable-font-*` and `--ui-*` custom properties remain unchanged

- [ ] T011 [US3] Build and verify dual CSS custom properties in compiled output in `packages/styles/`
  - Run `pnpm build` and verify `rg "--pathable-font-heading" dist/styles.css`
  - Verify `rg "--usa-font-heading" dist/styles.css`
  - Verify both resolve to the same Fredoka font stack value

**Checkpoint**: All three user stories should now be independently functional.

---

## Phase 6: User Story 4 - Upstream USWDS typography changes integrate without breaking (Priority: P3)

**Goal**: USWDS version upgrades do not change brand font values — only the single settings file needs review.

**Independent Test**: Upgrade the USWDS package version, rebuild, and verify no unexpected font family changes.

### Implementation for User Story 4

- [ ] T012 [US4] Add upgrade documentation comments to `_uswds-theme.scss` in `packages/styles/src/_uswds-theme.scss`
  - Add a header comment block documenting that ALL typography overrides are scoped in this file
  - Include upgrade instructions: "To upgrade USWDS: bump version in package.json, rebuild, verify no unexpected typography changes. Only this file needs review."
  - Follow the same pattern as the existing color settings header comments

**Checkpoint**: All user stories complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final verification

- [ ] T013 [P] Update AGENTS.md with USWDS typography token usage rules in `packages/styles/AGENTS.md`
  - Add section documenting the dual `--pathable-font-*` / `--usa-font-*` naming convention
  - Add rules for referencing typography tokens in SCSS

- [ ] T014 [P] Update BRAND_RULES.md with USWDS typography token references in `packages/styles/BRAND_RULES.md`
  - Add a "USWDS Typography Token Mapping" table showing each brand typeface's USWDS role assignment and custom typeface token
  - Document the type scale mapping table

- [ ] T015 [P] Final build and verification in `packages/styles/`
  - Run `pnpm build` and verify no compilation errors
  - Verify `rg "Fredoka" dist/styles.css`, `rg "Nunito" dist/styles.css`, `rg "Poppins" dist/styles.css`, `rg "Montserrat" dist/styles.css`
  - Verify `rg "--pathable-font-" dist/styles.css`, `rg "--usa-font-" dist/styles.css`
  - Verify that existing `--pathable-*` color tokens and `--ui-*` typography tokens are still present

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — already complete
- **Foundational (Phase 2)**: No dependencies — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 (P1) has no dependencies on other stories
  - US2 (P2) has no dependencies on other stories
  - US3 (P2) depends on US1 (uses `$pathable-font-*` variables from existing `_typography.scss`)
  - US4 (P3) depends on all other stories
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 3 (P2)**: Can start after US1 complete (uses `_typography.scss` variables)
- **User Story 4 (P3)**: Can start after all other stories complete

### Within Each User Story

- SCSS settings before build verification
- Build before verification
- Story complete before moving to next priority

### Parallel Opportunities

- All Foundational tasks marked [P] can run in parallel (T002, T003, T004)
- US1 and US2 can run in parallel once Foundational is complete
- All Polish tasks marked [P] can run in parallel (T013, T014, T015)

---

## Parallel Example: Foundational Phase

```bash
# Launch all foundational tasks together:
Task: "Create _fonts.scss with @font-face rules in packages/styles/src/_fonts.scss"
Task: "Update index.scss to forward _fonts.scss in packages/styles/src/index.scss"
Task: "Add custom typeface token definitions to _uswds-theme.scss in packages/styles/src/_uswds-theme.scss"
Task: "Configure font family type assignments and role assignments in _uswds-theme.scss in packages/styles/src/_uswds-theme.scss"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
2. Complete Phase 3: User Story 1 (body typography settings)
3. **STOP and VALIDATE**: Build and verify USWDS components render with brand fonts
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Foundational → Foundation ready (fonts compiled, roles assigned)
2. Add User Story 1 (body typography) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (type scale) → Test independently → Deploy/Demo
4. Add User Story 3 (dual CSS custom properties) → Test independently → Deploy/Demo
5. Add User Story 4 (documentation) → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (body typography)
   - Developer B: User Story 2 (type scale, line-height, prose)
3. Developer C: User Story 3 (dual CSS custom properties — after US1 is done)
4. Developer A or B: User Story 4 (documentation — after all stories done)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- All USWDS typography overrides go into `_uswds-theme.scss` (single file per FR-011)
- The `_fonts.scss` partial is separate because it contains `@font-face` rules, not USWDS theme configuration
- Build command: `pnpm build` runs `sass --load-path=node_modules/@uswds/uswds/packages src/index.scss dist/styles.css`
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently