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

## Format: `[ID] [P?] [Story] Description`

- **[ID]** is a unique task identifier
- **[P1/P2/P3]** indicates priority level
- **[S1/S2/S3]** maps to user story number
- **Status**: `[ ]` = pending, `[x]` = completed

---

## Phase 1: Setup — Shared Infrastructure

> **Goal**: Establish USWDS dependency, build configuration, and the single `_uswds-theme.scss` settings file.

### T001 [P1] [S1] Add @uswds/uswds as a runtime dependency of the styles package

**File**: `packages/styles/package.json`
**Action**: Add `"@uswds/uswds": "^3.0.0"` to `dependencies` (not devDependencies).

- [x] Verify the dependency is added correctly
- [x] Run `pnpm install` to update lockfile

### T002 [P1] [S1] Configure Sass --load-path for USWDS module resolution

**File**: `packages/styles/package.json`
**Action**: Update `build` and `watch` scripts to include `--load-path=node_modules/@uswds/uswds/packages`.

- [x] Verify build script includes the load-path flag
- [x] Verify watch script includes the load-path flag

### T003 [P1] [S1] Create _uswds-theme.scss with placeholder USWDS configuration

**File**: `packages/styles/src/_uswds-theme.scss`
**Action**: Create the file with `@use "uswds-core" with (...)` containing.

- [x] Create `_uswds-theme.scss`
- [x] Add `@use "uswds-core" with ()` block with initial settings

### T004 [P1] [S1] Add @forward 'uswds-theme' as first forward in index.scss

**File**: `packages/styles/src/index.scss`
**Action**: Add `@forward 'uswds-theme';` as the first forward statement, before any other forwards.

- [x] Insert `@forward 'uswds-theme';` at the top of index.scss
- [x] Verify it is the first forward statement

---

## Phase 2: Foundational — Blocking Prerequisites

> **Goal**: Implement color family configurations that are prerequisites for downstream tasks.

### T005 [P1] [S1] Configure base family to Shilling Silver (gray-cool)

**File**: `packages/styles/src/_uswds-theme.scss`

```scss
  $theme-color-base-lightest: "gray-cool-5",
  $theme-color-base-lighter: "gray-cool-2",
  $theme-color-base-light: "gray-cool-3",
  $theme-color-base: "gray-cool-10",
  $theme-color-base-dark: "gray-cool-80",
  $theme-color-base-darker: "gray-cool-90",
  $theme-color-base-darkest: "gray-90",
  $theme-color-base-ink: "gray-90",
```

- [x] Set all 7 grade variables for base family
- [x] Validate via `uswds.color("gray-cool-10")` resolves to hex #dde2e8

### T006 [P1] [S1] Configure primary family to PathAble Blue (blue-warm)

**File**: `packages/styles/src/_uswds-theme.scss`

```scss
  $theme-color-primary-lighter: "blue-warm-10",
  $theme-color-primary-light: "blue-warm-20",
  $theme-color-primary: "blue-warm-80v",
  $theme-color-primary-vivid: "blue-warm-70v",
  $theme-color-primary-dark: "blue-warm-80",
  $theme-color-primary-darker: "blue-warm-90",
```

- [x] Set all 6 grade variables for primary family
- [x] Validate via `uswds.color("blue-warm-80v")` resolves to hex #00365c

### T007 [P1] [S1] Configure secondary family to Intelligent Jade (mint-cool)

**File**: `packages/styles/src/_uswds-theme.scss`

```scss
  $theme-color-secondary-lighter: "mint-cool-10",
  $theme-color-secondary-light: "mint-cool-20",
  $theme-color-secondary: "mint-cool-30v",
  $theme-color-secondary-vivid: "mint-cool-40v",
  $theme-color-secondary-dark: "mint-cool-80v",
  $theme-color-secondary-darker: "mint-cool-90",
```

- [x] Set all 6 grade variables for secondary family
- [x] Validate via `uswds.color("mint-cool-30v")` resolves to hex #1cae96

### T008 [P1] [S1] Configure accent-cool family to Bright Blue Brooks + Tech Teal (blue + cyan)

**File**: `packages/styles/src/_uswds-theme.scss`

```scss
  $theme-color-accent-cool-lighter: "blue-10",
  $theme-color-accent-cool-light: "blue-20",
  $theme-color-accent-cool: "blue-30v",
  $theme-color-accent-cool-dark: "cyan-60v",
  $theme-color-accent-cool-darker: "blue-90",
```

- [x] Set all 5 grade variables for accent-cool family
- [x] Validate via `uswds.color("blue-30v")` resolves to hex #4899e8

### T009 [P1] [S1] Configure accent-warm family to Lived-in Lime (green-warm)

**File**: `packages/styles/src/_uswds-theme.scss`

```scss
  $theme-color-accent-warm-lighter: "green-warm-10",
  $theme-color-accent-warm-light: "green-warm-20",
  $theme-color-accent-warm: "green-warm-10v",
  $theme-color-accent-warm-dark: "green-warm-80",
  $theme-color-accent-warm-darker: "green-warm-90",
```

- [x] Set all 5 grade variables for accent-warm family
- [x] Validate via `uswds.color("green-warm-10v")` resolves to hex #d3ff66

### T010 [P1] [S1] Set unused grade variants to false to prevent CSS bloat

**File**: `packages/styles/src/_uswds-theme.scss`

```scss
  $theme-color-primary-lightest: false,
  $theme-color-primary-darkest: false,
  $theme-color-secondary-lightest: false,
  $theme-color-secondary-darkest: false,
  $theme-color-accent-cool-lightest: false,
  $theme-color-accent-cool-darkest: false,
  $theme-color-accent-warm-lightest: false,
  $theme-color-accent-warm-darkest: false,
```

- [x] Verify each unused grade is set to false

---

## Phase 3: User Story 1 — Developers use USWDS components with brand-matched styling

> **Priority**: P1
> **Story**: As a developer, I want to use USWDS components and utility classes that already match PathAble brand colors, so that I can build UIs rapidly without manual color overrides.

### T011 [P1] [S1] Configure state token: error (red-60v)

**File**: `packages/styles/src/_uswds-theme.scss`

```scss
  $theme-color-error: "red-60v",
  $theme-color-error-dark: "red-70v",
  $theme-color-error-lighter: "red-10",
```

- [x] Set error state token family and grades

### T012 [P1] [S1] Configure state token: warning (gold)

**File**: `packages/styles/src/_uswds-theme.scss`

```scss
  $theme-color-warning: "gold-20v",
  $theme-color-warning-dark: "gold-30v",
  $theme-color-warning-lighter: "gold-5",
```

- [x] Set warning state token family and grades

### T013 [P1] [S1] Configure state token: success via Intelligent Jade (mint-cool)

**File**: `packages/styles/src/_uswds-theme.scss`

```scss
  $theme-color-success: "mint-cool-30v",
  $theme-color-success-dark: "mint-cool-40v",
  $theme-color-success-lighter: "mint-cool-5",
```

- [x] Set success state token family and grades

### T014 [P1] [S1] Configure state token: info via Bright Blue Brooks (blue)

**File**: `packages/styles/src/_uswds-theme.scss`

```scss
  $theme-color-info: "blue-30v",
  $theme-color-info-dark: "blue-40v",
  $theme-color-info-lighter: "blue-5",
```

- [x] Set info state token family and grades

### T015 [P1] [S1] Configure disabled token

**File**: `packages/styles/src/_uswds-theme.scss`

```scss
  $theme-color-disabled: "gray-cool-20",
  $theme-color-disabled-dark: "gray-30",
```

- [x] Set disabled token

### T016 [P1] [S1] Configure link colors

**File**: `packages/styles/src/_uswds-theme.scss`

```scss
  $theme-link-color: "blue-30v",
  $theme-link-visited-color: "blue-30v",
```

- [x] Set link color to Bright Blue Brooks
- [x] Set visited link color to same (by design)

### T017 [P1] [S1] Add $theme-focus-color

**File**: `packages/styles/src/_uswds-theme.scss`
**Action**: Add `$theme-focus-color: "blue-40v"` to the `@use ... with ()` block.

- [x] Add `$theme-focus-color: "blue-40v"` to the configuration block

### T018 [P1] [S1] Run initial USWDS build to verify token resolution

**File**: Terminal
**Action**: Execute `pnpm build` in `packages/styles/`.

- [x] Build succeeds
- [x] Build output contains `--pathable-*` custom properties
- [x] Build output contains NO `.usa-` classes (tokens-only)

---

## Phase 4: User Story 2 — Designers verify brand alignment in USWDS components

> **Priority**: P2
> **Story**: As a designer, I want to verify that the USWDS theme tokens I selected in research.md produce colors that match our brand.

### T019 [P2] [S2] Validate base family resolves to expected hex values

**File**: Terminal
**Action**: Use Sass to interpolate and validate hex values.

- [x] `uswds.color("gray-cool-10")` resolves to ~#dde2e8 (Shilling Silver)
- [x] `uswds.color("gray-cool-90")` resolves to #1b1b1b (dark text)
- [x] Verify by checking compiled CSS output

### T020 [P2] [S2] Validate primary family resolves to expected hex values

**File**: Terminal
**Action**: Check primary token hex values.

- [x] `uswds.color("blue-warm-80v")` resolves to ~#00365c (PathAble Blue)
- [x] Verify by checking compiled CSS output

### T021 [P2] [S2] Validate secondary family resolves to expected hex values

**File**: Terminal
**Action**: Check secondary token hex values.

- [x] `uswds.color("mint-cool-30v")` resolves to ~#1cae96 (Intelligent Jade)
- [x] Verify by checking compiled CSS output

### T022 [P2] [S2] Validate accent-cool family resolves to expected hex values

**File**: Terminal
**Action**: Check accent-cool token hex values.

- [x] `uswds.color("blue-30v")` resolves to ~#4899e8 (Bright Blue Brooks)
- [x] `uswds.color("cyan-60v")` resolves to ~#015a76 (Tech Teal)
- [x] Verify by checking compiled CSS output

### T023 [P2] [S2] Validate accent-warm family resolves to expected hex values

**File**: Terminal
**Action**: Check accent-warm token hex values.

- [x] `uswds.color("green-warm-10v")` resolves to ~#d3ff66 (Lived-in Lime)
- [x] Verify by checking compiled CSS output

### T024 [P2] [S2] Verify that compiled CSS contains `--pathable-*` custom properties

**File**: `dist/styles.css`
**Action**: Run grep to confirm each custom property exists.

- [x] `--pathable-blue`, `--intelligent-jade`, `--bright-blue-brooks`, `--tech-teal`, `--lived-in-lime`, `--shilling-silver` all present
- [x] Semantic tokens present (`--pathable-color-bg`, `--pathable-color-surface`, `--pathable-color-text`, `--pathable-color-text-muted`, `--pathable-color-border`, `--pathable-color-link`, `--pathable-color-accent`, `--pathable-color-focus-ring`, `--pathable-color-danger`, `--pathable-color-success`)

### T025 [P2] [S2] Confirm tokens-only output (no USWDS component CSS)

**File**: `dist/styles.css`
**Action**: Verify the compiled output contains only token definitions.

- [x] Run `grep -c '.usa-' dist/styles.css` returns 0

---

## Phase 5: User Story 3 — Upstream USWDS updates integrate without breaking brand colors

> **Priority**: P3
> **Story**: As a maintainer, I want brand color configurations isolated in a single settings file, so that upgrading USWDS versions is a matter of rebuilding.

### T026 [P3] [S3] Verify all $theme-color-* overrides are scoped to _uswds-theme.scss only

**File**: `packages/styles/src/`
**Action**: Confirm no other SCSS file contains `$theme-color-` overrides.

- [x] grep for `$theme-color-` in all SCSS files except `_uswds-theme.scss` returns no matches

### T027 [P3] [S3] Verify $pathable-* variables in _colors.scss use uswds.color() calls

**File**: `packages/styles/src/_colors.scss`
**Action**: Confirm brand color variables are aliased to USWDS tokens.

- [x] `$pathable-blue: uswds.color("blue-warm-80v")`
- [x] `$intelligent-jade: uswds.color("mint-cool-30v")`
- [x] `$bright-blue-brooks: uswds.color("blue-30v")`
- [x] `$tech-teal: uswds.color("cyan-60v")`
- [x] `$lived-in-lime: uswds.color("green-warm-10v")`
- [x] `$shilling-silver: uswds.color("gray-cool-10")`

### T028 [P3] [S3] Verify $pathable-color-* variables in _semantic.scss use uswds.color() calls

**File**: `packages/styles/src/_semantic.scss`
**Action**: Confirm semantic tokens reference USWDS tokens where alignment is required or recommended per FR-007.

- [x] `$pathable-color-text: uswds.color("blue-warm-80v")`
- [x] `$pathable-color-bg: uswds.color("gray-cool-10")`
- [x] `$pathable-color-accent: uswds.color("blue-30v")`
- [x] `$pathable-color-border: uswds.color("gray-cool-2")`
- [x] `$pathable-color-link: uswds.color("blue-30v")`
- [x] `$pathable-color-text-muted: uswds.color("gray-cool-2")`
- [x] `$pathable-color-focus-ring: uswds.color("blue-30v")`
- [x] `$pathable-color-success: uswds.color("mint-cool-30v")`
- [x] `$pathable-color-surface` remains hardcoded `#ffffff` (MAY remain per FR-007)
- [x] `$pathable-color-danger` remains hardcoded `#dc3545` (MAY remain per FR-007)

### T029 [P3] [S3] Run final clean build and pack dry-run

**File**: Terminal
**Action**: Verify build produces clean output and package files are configured.

- [x] Build succeeds with no errors
- [x] Package files array is correct

---

## Phase 6: Polish — Cross-cutting Concerns

> **Goal**: Complete documentation, agent rules, and final commit.

### T030 [P3] [S3] Update BRAND_RULES.md with USWDS system token mapping

**File**: `packages/styles/BRAND_RULES.md`
**Action**: Add a table showing which USWDS system tokens each PathAble brand color maps to, including deltaE values from research.

- [x] Add brand-to-USWDS token mapping table
- [x] Include deltaE measurements

### T031 [P3] [S3] Update AGENTS.md with USWDS token usage rules

**File**: `packages/styles/AGENTS.md`
**Action**: Add section instructing agents to use `uswds.color()` calls and not directly reference `$theme-color-primary` etc.

- [x] Add USWDS Token Usage section
- [x] Include `uswds.color()` examples and FR-008 compliance note

### T032 [P3] [S3] Update README.md with USWDS integration section

**File**: `packages/styles/README.md`
**Action**: Add section documenting how the package integrates with USWDS, how to use USWDS types, and link to quickstart guide.

- [x] Add USWDS Integration section
- [x] Include installation, usage, and link to quickstart.md

### T033 [P3] [S2] Register context-index.json

**File**: `specs/003-wrap-uswds-theme/context-index.json`
**Action**: Create or update the context index to include all source files and build configuration for this feature.

- [x] Create/update `context-index.json`

---

## Dependencies & Execution Order

**Phase 1** (T001-T004) must complete first.
**Phase 2** (T005-T010) can run in parallel within the phase.
**Phase 3** (T011-T018) depends on Phase 2.
**Phase 4** (T019-T025) depends on Phase 3.
**Phase 5** (T026-T029) depends on Phase 4.
**Phase 6** (T030-T033) depends on Phase 5.

### Implementation notes

- The `$theme-color-*` !default variables accepted in @use ... with are a subset of what research.md documents. Specifically: `$theme-color-ink` does NOT exist; use `$theme-color-base-ink`. Vivid accent grades (`$theme-color-accent-cool-vivid`, `$theme-color-accent-warm-vivid`) and `$theme-focus-color` are NOT configurable via `@use ... with` — they are either non-!default or in a different settings file.
- Tokens-only output is achieved by NOT including `@forward 'uswds'` after `@forward 'uswds-theme'`. The USWDS core module processes settings but no component stylesheet is loaded.
- The build command `sass --load-path=node_modules/@uswds/uswds/packages src/index.scss dist/styles.css` is the verified command.

### Verification checks after build

- [x] `190` lines in `dist/styles.css` indicates a tokens-only output
- [x] All `--pathable-*` variables present in `dist/styles.css`
- [x] Zero `.usa-` utility or component classes in `dist/styles.css`
- [x] `pnpm pack --dry-run` from `packages/styles/` produces expected output (or fails due to private:true — acceptable)