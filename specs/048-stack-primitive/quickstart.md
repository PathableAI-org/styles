# Quickstart: Stack Layout Primitive Validation

**Feature**: Stack Layout Primitive
**Date**: 2026-08-20

This guide describes how to validate that the `Stack` component works correctly. It covers build, test, and interactive verification steps.

## Prerequisites

- pnpm workspace with dependencies installed: `pnpm install`
- `packages/styles` built: `pnpm --filter @pathable/styles build`
- `packages/react` builds cleanly: `pnpm --filter @pathable/react build`

## Build Verification

```bash
# Build the React package (includes Stack)
pnpm --filter @pathable/react build

# Verify Stack is in the build output
ls -la packages/react/dist/components/Stack/Stack.d.ts
ls -la packages/react/dist/components/Stack/Stack.js
```

**Expected**: TypeScript declaration and compiled JS files exist in dist.

## Unit and Component Tests

```bash
# Run all Stack tests
pnpm --filter @pathable/react test -- --testPathPattern="Stack"

# Run specific test if needed (adjust name as implemented)
pnpm --filter @pathable/react test -- --testPathPattern="Stack" --testNamePattern="gap"
```

**Validated outcomes**:

| Test | What it proves |
|------|---------------|
| `gap="sm"` → `pathable-stack--gap-sm` | Gap prop maps to modifier class |
| `gap="md"`, `gap="lg"`, `gap="xl"` | All gap values map correctly |
| No `gap` → no modifier class | Omitted gap produces base-only class |
| `align="center"` → `pathable-flex-align-center` | Align prop maps to utility class |
| All align values | Each align value maps correctly |
| `width="full"` → `pathable-width-full` | Sizing prop maps to utility class |
| `maxWidth="desktop"` → `pathable-maxw-desktop` | maxWidth prop maps correctly |
| `marginX="auto"` → `pathable-margin-x-auto` | Spacing prop maps correctly |
| Single root element, no wrapper | No extra DOM nodes |
| `className="custom"` | Consumer class appears last in class string |
| `as="section"` | Element tag is `<section>` |
| `ref` forwarding | `ref.current` is the root element |
| `id`, `data-*` passthrough | Native attrs on root element |
| SSR output matches client | No browser-only class resolution |
| Wrapper between Stack and children | Gap/alignment only affects immediate children |

## Type Checking

```bash
# Verify TypeScript compilation
pnpm --filter @pathable/react exec tsc --noEmit
```

**Expected**: No type errors. The `gap`, `align`, `width`, `maxWidth`, `margin*`, `as`, and `ref` props all compile with correct types.

## Storybook Verification

```bash
# Start Storybook
pnpm storybook

# Navigate to the Stack component in the sidebar
```

**Validated stories**:

1. **Default** (no props): Empty stack with only `pathable-stack` class — purple background or visible outline to show the element occupies space.
2. **Gap SM**: `<Stack gap="sm">` with 2-3 child blocks — visible 8px gap between them.
3. **Gap MD**: `<Stack gap="md">` with 2-3 child blocks — visible 16px gap.
4. **Gap LG**: `<Stack gap="lg">` with 2-3 child blocks — visible 24px gap.
5. **Gap XL**: `<Stack gap="xl">` with 2-3 child blocks — visible 32px gap.
6. **Align Center**: `<Stack gap="md" align="center">` with varied-width children — children are horizontally centered.
7. **Align Start**: `<Stack gap="md" align="start">` — children are left-aligned.
8. **Nested Layout**: Stack inside Container, or Stack with child elements that demonstrate real-world composition — shows structural integrity.

**A11y check**: Each story passes Storybook's automated accessibility check.

## Manual DOM Inspection

After rendering Stack in Storybook or a test page, open browser DevTools and verify:

```javascript
// Find all Stack elements
document.querySelectorAll('.pathable-stack')

// Verify a specific instance
const stack = document.querySelector('.pathable-stack--gap-sm')
// stack.childElementCount should match the React children count
// No intermediate wrapper divs between .pathable-stack and the intended children
// getComputedStyle(stack).flexDirection === "column"
// getComputedStyle(stack).gap matches the expected spacing token
```

## Package Export Verification

```bash
# Check that Stack is publicly exported
cat packages/react/src/index.ts | grep Stack
```

**Expected**: `export { Stack } from './components/Stack/Stack.js'` and type exports present.

## CI Gate Check

After pushing, verify CI passes for:

- ESLint (TypeScript)
- Prettier
- `tsc --noEmit`
- `pnpm build` for `@pathable/react`
- All Stack tests
- Storybook build without errors
- No new lint suppressions

## Lint Validation

```bash
# Run linting on the React package
pnpm --filter @pathable/react lint

# Verify no new suppressions
git diff -- packages/react | grep -E "eslint-disable|stylelint-disable|prettier-ignore|@ts-ignore|@ts-expect-error"
```

**Expected**: No lint suppressions in the diff.