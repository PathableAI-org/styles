# Quickstart Validation: React Desktop Shell Wrapper

**Feature**: 035-react-desktop-shell-wrapper
**Date**: 2026-08-13

## Prerequisites

- Node.js 18+
- pnpm 9+
- Repository cloned and dependencies installed: `pnpm install`
- `packages/styles` built: `pnpm build` (from root)

## Validation Scenarios

These scenarios prove the AppShell React wrapper works end-to-end. Run each scenario and verify the expected outcome before considering the feature complete.

### VS-01: Desktop Shell with Sidebar Regions

**Purpose**: Verify the basic desktop shell renders with all sidebar regions and correct BEM classes.

**Setup**: Import and render `AppShell` in a React context with sidebar content.

**Expected DOM structure** (verify in Storybook or browser DevTools):
- Root element: `<div class="pathable-app-shell">`
- Skip link: `<a class="pathable-skipnav" href="#main-content">Skip to main content</a>` is the first child
- Sidebar: `<aside class="pathable-app-shell__sidebar">`
  - Brand: `<div class="pathable-app-shell__brand">`
  - Nav: `<nav class="pathable-app-shell__nav">` containing `<a class="pathable-app-shell__nav-item">` children
  - Account: `<div class="pathable-app-shell__account">`
- Mobile top bar: `<header class="pathable-app-shell__topbar">` (hidden by CSS on desktop)
- Main content: `<main id="main-content" class="pathable-app-shell__content pathable-app-shell__content--standard">`

**Command**: `pnpm docs:react` (opens Storybook on port 6007)

---

### VS-02: Mobile Shell with Top Bar and Bottom Navigation

**Purpose**: Verify the shell switches to mobile layout on narrow viewports.

**Setup**: Render `AppShell` with `topBarTitle` and `bottomNavItems` props.

**Steps**:
1. Open Storybook
2. Set viewport to Mobile (375px) using Storybook viewport toolbar
3. Inspect the rendered DOM

**Expected**:
- Sidebar is hidden (`display: none` via CSS)
- Top bar: `<header class="pathable-app-shell__topbar">` is visible with `topBarTitle` text
- Bottom nav: `<nav class="pathable-bottom-navigation">` is visible with correct item structure
- Main content fills the viewport width

---

### VS-03: Fixed Sidebar Modifier

**Purpose**: Verify the `sidebarFixed` prop applies the correct modifier class.

**Setup**: Render `AppShell` with `sidebarFixed={true}`.

**Expected**:
- Sidebar has both classes: `class="pathable-app-shell__sidebar pathable-app-shell__sidebar--fixed"`

---

### VS-04: Wide Content Modifier

**Purpose**: Verify the `contentWidth` prop applies the correct modifier.

**Setup**: Render `AppShell` with `contentWidth="wide"`.

**Expected**:
- Main element has: `class="pathable-app-shell__content pathable-app-shell__content--wide"`

---

### VS-05: Skip Link Focus Visibility

**Purpose**: Verify the skip link is the first focusable element and becomes visible on focus.

**Setup**: Render `AppShell`. Use Storybook interaction test or manual keyboard test.

**Steps**:
1. Press Tab
2. Observe the skip link

**Expected**:
- Skip link becomes visible on Tab
- Skip link is the first element to receive focus
- Skip link targets `#main-content`

---

### VS-06: AppShellNavItem Active State

**Purpose**: Verify the nav item sub-component produces correct active markup.

**Setup**: Render `<AppShellNavItem href="/home" active>Home</AppShellNavItem>`.

**Expected DOM**:
```html
<a class="pathable-app-shell__nav-item pathable-app-shell__nav-item--active" href="/home" aria-current="page">Home</a>
```

---

### VS-07: Package Contents Verification

**Purpose**: Verify the wrapper package includes transitive styles.

**Steps**:
1. Build the React package: `cd packages/react && pnpm build`
2. Verify package contents: `pnpm pack --dry-run`

**Expected**:
- Build succeeds without errors
- Package output includes the required CSS from `@pathableai/styles`

---

### VS-08: TypeScript Build

**Purpose**: Verify the wrapper builds without type errors.

**Steps**: `cd packages/react && pnpm build`

**Expected**:
- `vite build` succeeds
- `tsc -p tsconfig.build.json` succeeds
- No type errors reported

---

### VS-09: Exported from Barrel

**Purpose**: Verify `AppShell` and `AppShellNavItem` are exported from the package barrel.

**Steps**: Inspect `packages/react/src/index.ts`.

**Expected**:
- Contains: `export { AppShell } from './components/AppShell/AppShell.js'`
- Contains: `export { AppShellNavItem } from './components/AppShell/AppShellNavItem.js'`

---

### VS-10: Accessibility Tests Pass

**Purpose**: Verify rendered accessibility checks pass on all stable stories.

**Command**: `pnpm test:storybook-react`

**Expected**:
- All story tests pass (including interaction tests for keyboard behavior)
- No automated accessibility violations on stable stories (Playground exempt)

---

### VS-11: Lint Passes

**Purpose**: Verify the wrapper passes all lint checks.

**Command**: `cd packages/react && pnpm lint`

**Expected**:
- ESLint passes with zero warnings and zero errors
- No lint rules disabled, weakened, or silenced