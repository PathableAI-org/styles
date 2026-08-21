# Quickstart: Grid Layout Primitive Validation

**Feature**: Grid Layout Primitive
**Date**: 2026-08-21

This guide describes how to validate that the `Grid` component and its SCSS contract work correctly. It covers build, test, and interactive verification steps.

## Prerequisites

- pnpm workspace with dependencies installed: `pnpm install`
- `packages/styles` built: `pnpm --filter @pathable/styles build`
- `packages/react` builds cleanly: `pnpm --filter @pathable/react build`

## Build Verification

```bash
# Build all packages (styles first, then react)
pnpm build

# Verify SCSS contract is compiled
ls -la packages/styles/dist/pathable-component-wrappers/pathable-grid.css

# Verify Grid is in the React build output
ls -la packages/react/dist/components/Grid/Grid.d.ts
ls -la packages/react/dist/components/Grid/Grid.js
```

**Expected**: Compiled CSS for `pathable-grid` exists. TypeScript declaration and compiled JS files for Grid exist in React dist.

### SCSS Contract Content Check

```bash
# Verify column modifier classes exist in compiled CSS
cat packages/styles/dist/pathable-component-wrappers/pathable-grid.css
```

**Expected output contains**:
- `.pathable-grid { display: grid; ... }`
- `.pathable-grid--cols-2 { grid-template-columns: repeat(2, 1fr); }`
- `.pathable-grid--cols-3 { grid-template-columns: repeat(3, 1fr); }`
- `.pathable-grid--cols-4 { grid-template-columns: repeat(4, 1fr); }`
- `.pathable-grid--gap-sm`, `--gap-md`, `--gap-lg`, `--gap-xl`
- `.pathable-grid--column-gap-sm`, `--column-gap-md`, `--column-gap-lg`, `--column-gap-xl`
- `.pathable-grid--row-gap-sm`, `--row-gap-md`, `--row-gap-lg`, `--row-gap-xl`
- `.pathable-grid--align-start`, `--align-center`, `--align-end`, `--align-stretch`, `--align-baseline`

## Unit and Component Tests

```bash
# Run all Grid tests
pnpm --filter @pathable/react test -- --testPathPattern="Grid"

# Run all layout primitive tests (regression check)
pnpm --filter @pathable/react test -- --testPathPattern="Grid|Stack|Inline|Cluster"
```

**Validated outcomes**:

| Test | What it proves |
|------|---------------|
| `cols={2}` → `pathable-grid--cols-2` | Column prop maps to modifier class |
| `cols={3}`, `cols={4}` | All column counts map correctly |
| `gap="sm"` → `pathable-grid--gap-sm` | Gap prop maps to modifier class |
| `gap="md"`, `gap="lg"`, `gap="xl"` | All gap values map correctly |
| `columnGap="lg"` → `pathable-grid--column-gap-lg` | Column gap prop maps correctly |
| `rowGap="sm"` → `pathable-grid--row-gap-sm` | Row gap prop maps correctly |
| `align="center"` → `pathable-grid--align-center` | Align prop maps to SCSS modifier |
| All 5 align values | Each align value maps correctly |
| `width="full"` → `pathable-width-full` | Sizing prop maps to utility class |
| `maxWidth="desktop"` → `pathable-maxw-desktop` | maxWidth prop maps correctly |
| `marginX="auto"` → `pathable-margin-x-auto` | Spacing prop maps correctly |
| Single root element, no wrapper | No extra DOM nodes |
| `className="custom"` | Consumer class appears last in class string |
| `as="section"` | Element tag is `<section>` |
| `ref` forwarding | `ref.current` is the root element |
| `id`, `data-*` passthrough | Native attrs on root element |
| SSR output matches client | No browser-only class resolution |
| Immediate children only in grid | Grandchildren not affected by grid placement |
| No cols prop → no column modifier | Omitted cols produces base-only class |

## Type Checking

```bash
# Verify TypeScript compilation
pnpm --filter @pathable/react exec tsc --noEmit
```

**Expected**: No type errors. The `cols`, `gap`, `columnGap`, `rowGap`, `align`, `width`, `maxWidth`, `margin*`, `as`, and `ref` props all compile with correct types.

## Storybook Verification

```bash
# Start Storybook
pnpm storybook

# Navigate to the Grid component in the sidebar
```

**Validated stories**:

1. **2-Column Grid** (`cols={2} gap="md"`): Four child blocks arranged in 2 columns, 2 rows, with visible 16px gaps.
2. **3-Column Grid** (`cols={3} gap="lg"`): Six child blocks arranged in 3 columns, 2 rows, with visible 24px gaps.
3. **4-Column Grid with Mixed Content** (`cols={4} gap="sm"`): Eight child blocks of varied content types, arranged in 4 columns.
4. **Separate Column and Row Gap** (`cols={3} columnGap="xl" rowGap="sm"`): Demonstrates tall row gaps and narrow column gaps (or vice versa).
5. **Alignment: Center** (`cols={2} gap="md" align="center"`): Items of varying heights vertically centered in each row.
6. **Controls/Playground**: Interactive prop exploration with knobs for `cols`, `gap`, `align`.

**A11y check**: Each story passes Storybook's automated accessibility check.

## Manual DOM Inspection

After rendering Grid in Storybook or a test page, open browser DevTools and verify:

```javascript
// Find all Grid elements
document.querySelectorAll('.pathable-grid')

// Verify a specific instance
const grid = document.querySelector('.pathable-grid--cols-3')
// getComputedStyle(grid).display === "grid"
// getComputedStyle(grid).gridTemplateColumns === "1fr 1fr 1fr"
// grid.childElementCount should match the React children count
// No intermediate wrapper divs between .pathable-grid and the intended children
// All immediate children are grid items; grandchildren are not
```

### CSS Grid Property Verification

```javascript
const grid = document.querySelector('.pathable-grid--cols-2.pathable-grid--gap-md')

// Column count
getComputedStyle(grid).gridTemplateColumns  // "1fr 1fr"

// Gap
getComputedStyle(grid).columnGap  // Should match the md gap value

// Alignment
getComputedStyle(grid).alignItems  // Should match the align prop value or default "stretch"

// Children should be immediate grid items
Array.from(grid.children).forEach(child => {
  // getComputedStyle(child).display should not be "grid" unless intentionally nested
  // No wrapper between grid and children
})
```

## Package Export Verification

```bash
# Check that Grid is publicly exported
cat packages/react/src/index.ts | grep Grid
```

**Expected**: `export { Grid } from './components/Grid/Grid.js'` and type exports present.

## Regression Check — Existing Layout Primitives

```bash
# Run all layout primitive tests to ensure no regressions
pnpm --filter @pathable/react test -- --testPathPattern="Grid|Stack|Inline|Cluster|Container|Box"

# Build the full pipeline
pnpm build
```

**Expected**: All existing tests pass. No layout primitive is affected by the new Grid component or SCSS contract.

## CI Gate Check

After pushing, verify CI passes for:

- ESLint (TypeScript)
- Stylelint (SCSS)
- Prettier
- `tsc --noEmit`
- `pnpm build` for both `@pathable/styles` and `@pathable/react`
- All Grid tests
- All layout primitive regression tests
- Storybook build without errors
- No new lint suppressions

## Lint Validation

```bash
# Run linting on both packages
pnpm --filter @pathable/styles lint
pnpm --filter @pathable/react lint

# Verify no new suppressions
git diff -- packages/styles | grep -E "stylelint-disable|eslint-disable|prettier-ignore"
git diff -- packages/react | grep -E "eslint-disable|stylelint-disable|prettier-ignore|@ts-ignore|@ts-expect-error"
```

**Expected**: No lint suppressions in the diff.