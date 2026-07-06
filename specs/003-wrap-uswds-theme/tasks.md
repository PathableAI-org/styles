# Tasks: USWDS Theme Wrapper

**Input**: Design documents from `/specs/003-wrap-uswds-theme/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No explicit test tasks generated — this feature uses manual visual verification per the plan.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1](#phase-3-user-story-1---developers-use-uswds-components-with-brand-matched-styling-priority-p1)
- [Phase 4: User Story 2](#phase-4-user-story-2---designers-verify-brand-alignment-in-uswds-components-priority-p2)
- [Phase 5: User Story 3](#phase-5-user-story-3---upstream-uswds-updates-integrate-without-breaking-brand-colors-priority-p3)
- [Phase 6: Polish](#phase-6-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization — add USWDS dependency and configure the Sass build pipeline

- [x] T001 Add `@uswds/uswds` (v3.x latest stable) as a runtime dependency in `packages/styles/package.json`
- [x] T002 [P] Update build script in `packages/styles/package.json` to include `--load-path=node_modules/@uswds/uswds/packages` in the Sass command
- [x] T003 [P] Install updated dependencies via `pnpm install` at repository root
- [x] T004 Verify the package builds successfully after dependency installation by running `pnpm build` in `packages/styles/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the single USWDS theme settings file (`_uswds-theme.scss`) with all token mappings. This is the core of the feature — everything else depends on it.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create `packages/styles/src/_uswds-theme.scss` with `@use "uswds-core" with (...)` block containing ALL theme color family mappings from `research.md` Decision D2 (all grades for primary/blue-warm, secondary/mint-cool, accent-cool/blue, accent-warm/green-warm, base/gray-cool families)
- [x] T006 Add state token configuration to `_uswds-theme.scss` — error, warning, success, info, disabled tokens using system tokens from `research.md` Decision D4
- [x] T007 Add link color and focus color configuration to `_uswds-theme.scss` — `$theme-link-color`, `$theme-link-visited-color`, `$theme-focus-color`
- [x] T008 Set all unused grades to `false` in `_uswds-theme.scss` — explicitly set the 8 grades listed in `research.md` Decision D5
- [x] T009 Verify `_uswds-theme.scss` compiles without errors by building `packages/styles/dist/styles.css`

**Checkpoint**: Foundation ready — USWDS theme token configuration is in place and compiling.

---

## Phase 3: User Story 1 - Developers use USWDS components with brand-matched styling (Priority: P1) 🎯 MVP

**Goal**: Brand color SCSS variables and CSS custom properties reference USWDS theme tokens. The existing `$pathable-*` and `--pathable-*` API remains unchanged.

**Independent Test**: Import `dist/styles.css` and a USWDS component separately. A `.usa-button--primary` element should render with PathAble Blue. Utility classes like `.bg-primary` or `.text-secondary` should match brand colors.

### Implementation for User Story 1

- [x] T010 `packages/styles/src/_colors.scss` — Add `@use "uswds-core" as uswds;` at the top of the file
- [x] T011 [P] [US1] Replace `$pathable-blue: #00365c` with `$pathable-blue: uswds.color("blue-warm-80v");` and update the `$brand-colors` map value accordingly in `packages/styles/src/_colors.scss`
- [x] T012 [P] [US1] Replace `$intelligent-jade: #1cae96` with `$intelligent-jade: uswds.color("mint-cool-30v");` and update the `$brand-colors` map accordingly in `packages/styles/src/_colors.scss`
- [x] T013 [P] [US1] Replace `$bright-blue-brooks: #4899e8` with `$bright-blue-brooks: uswds.color("blue-30v");` and update the `$brand-colors` map accordingly in `packages/styles/src/_colors.scss`
- [x] T014 [P] [US1] Replace `$tech-teal: #015a76` with `$tech-teal: uswds.color("cyan-60v");` and update the `$brand-colors` map accordingly in `packages/styles/src/_colors.scss`
- [x] T015 [P] [US1] Replace `$lived-in-lime: #d3ff66` with `$lived-in-lime: uswds.color("green-warm-10v");` and update the `$brand-colors` map accordingly in `packages/styles/src/_colors.scss`
- [x] T016 [P] [US1] Replace `$shilling-silver: #dde2e8` with `$shilling-silver: uswds.color("gray-cool-10");` and update the `$brand-colors` map accordingly in `packages/styles/src/_colors.scss`
- [x] T017 Update `packages/styles/src/_semantic.scss` — Add `@use "uswds-core" as uswds;` at the top of the file
- [x] T018 [P] [US1] Update `$pathable-color-text` in `_semantic.scss` to reference `uswds.color("blue-warm-80v")` (aliasStatus: MUST)
- [x] T019 [P] [US1] Update `$pathable-color-text-muted` in `_semantic.scss` to reference `uswds.color("cyan-60v")` (aliasStatus: MUST)
- [x] T020 [P] [US1] Update `$pathable-color-link` in `_semantic.scss` to reference `uswds.color("blue-30v")` (aliasStatus: MUST)
- [x] T021 [P] [US1] Update `$pathable-color-accent` in `_semantic.scss` to reference `uswds.color("mint-cool-30v")` (aliasStatus: MUST)
- [x] T022 [P] [US1] Update `$pathable-color-focus-ring` in `_semantic.scss` to reference `uswds.color("blue-40v")` (aliasStatus: MUST)
- [x] T023 [P] [US1] Update `$pathable-color-success` in `_semantic.scss` to reference `uswds.color("mint-cool-30v")` (aliasStatus: MUST)
- [x] T024 [P] [US1] Optionally update `$pathable-color-bg` in `_semantic.scss` to reference `uswds.color("gray-cool-10")` (aliasStatus: SHOULD)
- [x] T025 [P] [US1] Optionally update `$pathable-color-border` in `_semantic.scss` to reference `uswds.color("gray-cool-10")` (aliasStatus: SHOULD)
- [x] T026 Update `packages/styles/src/index.scss` — Add `@forward "uswds-theme";` as the first forward statement, before all existing forwards. Do NOT add `@forward "uswds"` (tokens-only per FR-006).
- [x] T027 Rebuild `packages/styles/dist/styles.css` via `pnpm build` and verify compilation succeeds without errors
- [x] T028 Verify backward compatibility — confirm `dist/styles.css` still contains `--pathable-blue`, `--pathable-color-text`, and all other `--pathable-*` CSS custom properties
- [x] T029 Verify tokens-only output — confirm `dist/styles.css` does NOT contain `.usa-` prefixed component classes (verify no USWDS component styles leaked in)
- [x] T030 Verify brand-to-USWDS mapping — confirm `dist/styles.css` contains the USWDS system token hex values mapped to brand colors (e.g., `#162e51` for PathAble Blue, `#1dc2ae` for Intelligent Jade)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Designers verify brand alignment in USWDS components (Priority: P2)

**Goal**: USWDS state tokens (error, warning, success, info) and focus indicators resolve to the matching semantic token values. Hover/active states use USWDS built-in calculations with visual review.

**Independent Test**: Render USWDS components with state modifiers (`.usa-alert--error`, `.usa-input--success`) alongside `@pathable/styles`. The error border color should match `#dc3545`, success should match Intelligent Jade, and focus rings should use Bright Blue Brooks.

### Implementation for User Story 2

- [x] T031 [P] [US2] Visually verify that USWDS error state components (`.usa-alert--error`, `.usa-input--error`) render with the error color `#dc3545` (via `red-60v` USWDS token)
- [x] T032 [P] [US2] Visually verify that USWDS success state components (`.usa-alert--success`, `.usa-input--success`) render with Intelligent Jade (`#1cae96` / `mint-cool-30v`)
- [x] T033 [P] [US2] Visually verify that USWDS focus indicators render with Bright Blue Brooks (`#4899e8` / `blue-40v`)
- [x] T034 [US2] Visually review dark-primary (PathAble Blue) hover states on USWDS primary buttons — if USWDS darkening produces a near-black color, override the hover grade with an explicitly chosen brand-aligned color
- [x] T035 [US2] Visually verify WCAG AA contrast on common text-on-background pairs (e.g., PathAble Blue text on Shilling Silver background, white text on PathAble Blue background)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Upstream USWDS updates integrate without breaking brand colors (Priority: P3)

**Goal**: The USWDS version can be bumped with confidence — the single settings file pattern ensures all brand colors are derived from USWDS theme tokens.

**Independent Test**: Bump USWDS version in `package.json`, rebuild, and verify all `$theme-color-*` assignments remain intact. Only `_uswds-theme.scss` needs review.

### Implementation for User Story 3

- [x] T036 [P] [US3] Create documentation comments in `_uswds-theme.scss` that explain each theme family mapping (which brand color maps to which family and grade)
- [x] T037 [P] [US3] Add a comment block at the top of `_uswds-theme.scss` with upgrade instructions: "To upgrade USWDS: bump version in package.json, rebuild, verify no unexpected color changes. Only this file needs review."
- [x] T038 [US3] Verify FR-008 compliance — confirm that ALL USWDS theme color overrides are scoped exclusively within `_uswds-theme.scss` and no overrides exist in any other file

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation updates, backward compatibility verification, and final build checks.

- [x] T039 [P] Update `packages/styles/README.md` with USWDS integration documentation — include installation instructions (`pnpm add @pathable/styles @uswds/uswds`), usage examples, and link to quickstart.md
- [x] T040 [P] Update `packages/styles/BRAND_RULES.md` with USWDS system token references alongside hex values — add a mapping table showing each brand color, its USWDS system token, and deltaE value
- [x] T041 [P] Update `packages/styles/AGENTS.md` with USWDS token usage rules — agents must use `uswds.color("blue-warm-80v")` pattern when referencing brand colors in new SCSS
- [x] T042 Build and verify final `dist/styles.css` — confirm all existing `--pathable-*` CSS custom properties are present, all `$theme-color-*` tokens are configured, and no `.usa-` component styles leaked in
- [x] T043 Run `pnpm pack --dry-run` in `packages/styles/` to verify published package contents are correct (should include `dist/`, `src/`, README, BRAND_RULES, AGENTS)
- [x] T044 Commit all changes with a descriptive message

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — MUST be complete before _colors.scss/_semantic.scss updates (Phase 3)
- **US1 (Phase 3)**: Depends on Foundational completion — USWDS token config must exist before brand variables can alias it
- **US2 (Phase 4)**: Depends on Phase 3 completion — state tokens and brand colors must be configured before visual verification
- **US3 (Phase 5)**: Can start after Phase 2 — documentation of the settings file is independent of brand alias updates
- **Polish (Phase 6)**: Depends on all user story phases being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories — the core implementation
- **User Story 2 (P2)**: Depends on US1 (needs brand tokens and state tokens configured for visual verification)
- **User Story 3 (P3)**: Depends only on Phase 2 — documentation of the settings file can happen in parallel with Phase 3/4

### Within Phase 3 (US1)

- `_colors.scss` tasks (T011-T016) can all run in parallel (each is a single variable replacement)
- `_semantic.scss` tasks (T018-T025) can all run in parallel (each is a single variable update)
- T010 (add `@use` to _colors.scss) must precede T011-T016
- T017 (add `@use` to _semantic.scss) must precede T018-T025
- T026 (update `index.scss`) must happen after T001-T009 (settings file must exist)
- Build & verify tasks (T027-T030) require all US1 changes

### Parallel Opportunities

- T002 and T003 can run in parallel (build config + dependency install)
- T011-T016 (colors.scss variable updates) can all run in parallel
- T018-T025 (semantic.scss variable updates) can all run in parallel
- T031-T033 (US2 visual verification tasks) can run in parallel
- T036-T037 (US3 documentation tasks) can run in parallel
- T039-T041 (Polish documentation updates) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all brand color alias updates together:
Task: "T011 [P] [US1] Update $pathable-blue in _colors.scss"
Task: "T012 [P] [US1] Update $intelligent-jade in _colors.scss"
Task: "T013 [P] [US1] Update $bright-blue-brooks in _colors.scss"
Task: "T014 [P] [US1] Update $tech-teal in _colors.scss"
Task: "T015 [P] [US1] Update $lived-in-lime in _colors.scss"
Task: "T016 [P] [US1] Update $shilling-silver in _colors.scss"

# Launch all semantic token alias updates together:
Task: "T018 [P] [US1] Update $pathable-color-text in _semantic.scss"
Task: "T019 [P] [US1] Update $pathable-color-text-muted in _semantic.scss"
Task: "T020 [P] [US1] Update $pathable-color-link in _semantic.scss"
Task: "T021 [P] [US1] Update $pathable-color-accent in _semantic.scss"
Task: "T022 [P] [US1] Update $pathable-color-focus-ring in _semantic.scss"
Task: "T023 [P] [US1] Update $pathable-color-success in _semantic.scss"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T009) — **CRITICAL: blocks all stories**
3. Complete Phase 3: User Story 1 (T010-T030) — brand colors now resolve from USWDS
4. **STOP and VALIDATE**: Build, verify backward compatibility, verify brand → USWDS mapping
5. On to US2 or deploy if P1 alone is sufficient

### Incremental Delivery

1. Setup + Foundational → USWDS configured, building correctly
2. Add US1 (brand color aliases) → Test independently: existing `--pathable-*` unchanged, USWDS components get brand colors → **MVP!**
3. Add US2 (state token verification, hover review) → Design sign-off
4. Add US3 (settings file documentation) → Upgrade confidence
5. Polish → Documentation updated for consumers

### Notes

- No test framework tasks — manual visual verification per the feature plan
- The `uswds.color()` function call is the correct pattern (NOT `$theme-color-primary` which is a string)
- `--load-path=node_modules/@uswds/uswds/packages` is REQUIRED for Sass to resolve the `uswds-core` module
- All tasks assume the monorepo root at `/home/jake/PathableAI/styles/`
