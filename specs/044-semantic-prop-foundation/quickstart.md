# Quickstart: Semantic Utility Type System and Class Resolvers

**Feature**: `specs/044-semantic-prop-foundation`

## Prerequisites

- Node.js (as specified in root `package.json` `engines.node`)
- pnpm
- `@pathable/styles` built (`pnpm --filter @pathable/styles build`) — needed for inventory verification
- `packages/react` dependencies installed (`pnpm install`)

## Setup

```bash
# From repo root
pnpm install
pnpm --filter @pathable/styles build
```

## Add Vitest to packages/react

```bash
pnpm --filter @pathableai/react add -D vitest
```

Create `packages/react/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      include: ['src/internal/resolvers/**/*.ts'],
      exclude: ['src/internal/resolvers/__tests__/**'],
      thresholds: {
        functions: 100,
      },
    },
  },
})
```

Add to `packages/react/package.json` `scripts`:

```json
{
  "test:unit": "vitest run",
  "test:unit:watch": "vitest",
  "test:unit:coverage": "vitest run --coverage"
}
```

## Validation Steps

### Step 1: Verify the inventory document exists and is accurate

```bash
cat packages/react/docs/capability-inventory.md | head -50
# Should show all utility families: bg, text (color), padding,
# padding-x, padding-y, margin, margin-x, margin-y, margin-top,
# margin-bottom, display, font-family, text-weight, border,
# border-radius, flex, align-items, justify-content, width, maxw,
# text-align — plus a Gaps section
```

### Step 2: Verify resolver types compile

```bash
pnpm --filter @pathableai/react typecheck
# Expected: passes with no errors
```

### Step 3: Run resolver unit tests

```bash
pnpm --filter @pathableai/react test:unit
# Expected: all tests pass, coverage >= 100% for resolver functions
```

### Step 4: Verify resolvers are pure (no browser globals)

```bash
pnpm --filter @pathableai/react test:unit
# Expected: any test that checks for window/document/etc references passes
```

### Step 5: Verify resolver module is NOT in public exports

```bash
pnpm --filter @pathableai/react build
grep -r "widthClass\|mergeClasses\|SizingProps" packages/react/dist/ && echo "FAIL: resolvers leaked to dist" || echo "PASS: resolvers are internal"
```

### Step 6: Verify lint passes

```bash
pnpm --filter @pathableai/react lint
# Expected: passes with no warnings or errors
```

### Step 7: Verify full build still works

```bash
pnpm --filter @pathableai/react build
# Expected: Vite builds successfully, tsc emits declarations without errors
```

## Validation Scenarios

### Scenario A: Happy path — width resolver

```typescript
import { widthClass } from '../../internal/resolvers/sizing'

it('maps "full" to "pathable-width-full"', () => {
  expect(widthClass('full')).toBe('pathable-width-full')
})
```

### Scenario B: Null/undefined handling

```typescript
it('returns undefined for undefined input', () => {
  expect(widthClass(undefined)).toBeUndefined()
})

it('returns undefined for null input', () => {
  expect(widthClass(null)).toBeUndefined()
})
```

### Scenario C: Class merging preserves order

```typescript
import { mergeClasses } from '../../internal/resolvers/mergeClasses'

it('composes classes in the defined order', () => {
  const result = mergeClasses('pathable-card', 'pathable-width-full', 'my-custom')
  expect(result).toBe('pathable-card pathable-width-full my-custom')
})
```

### Scenario D: Margin conflict — directional wins over shorthand

```typescript
import { marginAllClass, marginTopClass, mergeClasses } from '../../internal/resolvers'

it('directional margin follows shorthand for CSS cascade', () => {
  const result = mergeClasses(
    'pathable-card',
    marginAllClass('2'),    // pathable-margin-2 (all sides)
    marginTopClass('4'),    // pathable-margin-top-4 (top overrides)
    undefined
  )
  expect(result).toBe('pathable-card pathable-margin-2 pathable-margin-top-4')
  // CSS cascade: margin-top-4 appears last, wins for top edge
})
```

## Expected Outcomes

After running all validation steps:

- [ ] Inventory document exists and matches SCSS source utility config
- [ ] All value types compile without missing union members
- [ ] All resolver tests pass (valid, undefined, null, invalid)
- [ ] Coverage >= 100% for resolver functions and mergeClasses
- [ ] No resolver code references browser globals
- [ ] Public build (`dist/`) contains no resolver exports
- [ ] ESLint passes with `--max-warnings=0`
- [ ] TypeScript typecheck passes
- [ ] Full build (`vite build && tsc`) succeeds