# Quickstart Validation: React Dashboard Header Wrapper

**Feature**: 037-react-dashboard-header
**Date**: 2026-08-14

## Prerequisites

- Node.js 18+
- pnpm 9+
- Repository cloned and dependencies installed: `pnpm install`
- `packages/styles` built: `pnpm build` (from root)

## Validation Scenarios

These scenarios prove the `DashboardHeader` React wrapper works end-to-end. Run
each scenario and verify the expected outcome before considering the feature
complete.

### VS-01: Full Header Renders Correct BEM Structure

**Purpose**: Verify the full header (breadcrumb, context, description, actions) renders with correct semantic and BEM structure.

**Setup**: Render `DashboardHeader` with `title`, `breadcrumb`, `context`, `description`, and `actions`.

**Expected DOM structure** (verify in Storybook or browser DevTools):
- Root: `<div class="pathable-dashboard-header">`
- Breadcrumb: `<div class="pathable-dashboard-header__breadcrumb">`
- Row: `<div class="pathable-dashboard-header__row">` containing:
  - `<h1 class="pathable-dashboard-header__title">`
  - `<span class="pathable-dashboard-header__context">`
  - `<div class="pathable-dashboard-header__actions">`
- Description: `<p class="pathable-dashboard-header__description">`

**Command**: `pnpm docs:react` (opens React Storybook on port 6007)

---

### VS-02: Title-Only Render Omits Empty Regions

**Purpose**: Verify optional regions are omitted when not provided.

**Setup**: Render `DashboardHeader` with only `title`.

**Expected**:
- `<h1 class="pathable-dashboard-header__title">` is present.
- No `__breadcrumb`, `__context`, `__description`, or `__actions` elements in the DOM.

---

### VS-03: Compact and Stacked Modifiers

**Purpose**: Verify modifier props apply the correct classes.

**Setup**: Render `DashboardHeader` with `compact` and, separately, `stacked`.

**Expected**:
- `compact` → root has `pathable-dashboard-header--compact`.
- `stacked` → root has `pathable-dashboard-header--stacked`.

---

### VS-04: New `Dashboard` Storybook Section

**Purpose**: Verify the React Storybook exposes the component under a top-level `Dashboard` section.

**Setup**: Open React Storybook (`pnpm docs:react`).

**Expected**:
- A `Dashboard` section appears in the sidebar (not under `Components`).
- It contains a `Dashboard Header` entry whose stories render the header states.

---

### VS-05: Keyboard Focus and Activation of Actions

**Purpose**: Verify action controls in the header are keyboard-reachable and operable.

**Setup**: Render `DashboardHeader` with action buttons. Use the Storybook interaction test or manual keyboard testing.

**Steps**:
1. Tab into the first action button.
2. Press Enter (and Space) to activate.

**Expected**:
- The first action button receives visible keyboard focus.
- Enter/Space activates the button (verified by the interaction test's `fn()` spy).

---

### VS-06: Mobile Viewport Stacks Actions

**Purpose**: Verify actions stack below the title on narrow viewports.

**Setup**: Open the `Mobile` story or set the Storybook viewport to 375px.

**Expected**:
- The title and actions render without horizontal overflow.
- Actions appear below the title (CSS `flex-direction: column` at ≤640px from the styles contract).

---

### VS-07: Exported from Barrel

**Purpose**: Verify `DashboardHeader` is exported from the package barrel.

**Steps**: Inspect `packages/react/src/index.ts`.

**Expected**:
- Contains `export { DashboardHeader } from './components/DashboardHeader/DashboardHeader.js'`.
- Contains a corresponding type export for `DashboardHeaderProps`.

---

### VS-08: TypeScript Build and Package Contents

**Purpose**: Verify the wrapper builds without type errors and packages transitive styles.

**Steps**:
1. `cd packages/react && pnpm build`
2. `pnpm pack --dry-run`

**Expected**:
- `vite build` and `tsc -p tsconfig.build.json` succeed.
- Package output includes the required CSS from `@pathableai/styles`.

---

### VS-09: Lint and Accessibility Gates Pass

**Purpose**: Verify the wrapper passes lint and rendered accessibility checks.

**Commands**:
- `cd packages/react && pnpm lint`
- `pnpm test:storybook-react`

**Expected**:
- ESLint passes with zero warnings/errors; no rules disabled or weakened.
- All stable-story tests pass, including keyboard interaction tests.
- No automated accessibility violations on stable stories (Playground exempt).
