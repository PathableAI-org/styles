# Quickstart: Validate Promoted Composition Primitives

**Feature**: 056-promote-composition-patterns
**Date**: 2026-08-24

## Prerequisites

- Node.js 18+ and pnpm configured
- Repository cloned and dependencies installed (`pnpm install`)
- `packages/styles` built (`pnpm --filter @pathable/styles build`)

## Validation Scenarios

### 1. Verify SCSS Contracts Exist

```bash
# Confirm all required SCSS contracts are available
ls packages/styles/src/pathable-component-wrappers/pathable-cluster.scss
ls packages/styles/src/pathable-component-wrappers/pathable-surface.scss
ls packages/styles/src/pathable-component-wrappers/pathable-sidebar-layout.scss
ls packages/styles/src/pathable-component-wrappers/pathable-split.scss
ls packages/styles/src/pathable-component-wrappers/pathable-stack.scss
ls packages/styles/src/pathable-component-wrappers/pathable-card-grid.scss
ls packages/styles/src/pathable-component-wrappers/pathable-sticky-panel.scss
ls packages/styles/src/pathable-component-wrappers/pathable-container.scss
ls packages/styles/src/pathable-component-wrappers/pathable-form-group.scss
```

**Expected**: All files exist. No missing contracts.

### 2. Verify Existing Primitives Are Available

```bash
cat packages/react/src/index.ts | grep -E "export.*(Container|Stack|Inline|Cluster|Surface)"
```

**Expected**: Five layout primitives exported with their types.

### 3. Build and Run Unit Tests (After Implementation)

```bash
pnpm --filter @pathable/react test:unit
```

**Expected**: All tests pass, including the five new component test suites:
- `CardGrid.test.tsx` — verifies cluster and auto-fit modes, gap modifiers, child count
- `Page.test.tsx` — verifies Container → Stack composition, size variants, gap, SSR parity
- `SidebarLayout.test.tsx` — verifies `<main>`/`<aside>` rendering, ratio modifiers, sidebarFirst, sticky, SSR parity
- `FormStack.test.tsx` — verifies `<form>` default, gap, maxWidth, SSR parity
- `SplitLayout.test.tsx` — verifies ratio, align, two-child layout, SSR parity

### 4. Verify Storybook Stories Build

```bash
pnpm --filter @pathable/react storybook:build
# Or start dev server:
pnpm --filter @pathable/react storybook
```

**Expected**: Storybook builds without errors. Each primitive has:
- At least one isolation story (default props)
- At least one composition story (in context)
- A Narrow/Mobile story demonstrating responsive behavior

### 5. Run Accessibility Checks (After Implementation)

```bash
pnpm --filter @pathable/react test:storybook
# Or run the a11y addon interactively in Storybook
```

**Expected**: No axe-core violations on isolation or composition stories.

### 6. Verify Export Completeness

```bash
grep -E "CardGrid|Page[^E]|SidebarLayout|FormStack|SplitLayout" packages/react/src/index.ts
```

**Expected**: Each component and its props type is exported.

### 7. Verify No New SCSS Introduced

```bash
git diff --stat origin/main... -- packages/styles/src/pathable-component-wrappers/
```

**Expected**: No changes. Zero new or modified SCSS files.

### 8. Run Full CI Gates

```bash
pnpm lint
pnpm format --check
pnpm --filter @pathable/react typecheck
pnpm --filter @pathable/react build
pnpm --filter @pathable/react test:unit
```

**Expected**: All pass. No lint suppressions added.