# Quickstart Validation: Card Sizing and Spacing Props

**Feature**: specs/045-card-sizing-spacing
**Date**: 2026-08-19

## Prerequisites

```bash
# Build the styles package (needed for CSS class availability)
pnpm --filter @pathable/styles build

# Build the React package
pnpm --filter @pathable/react build
```

## Validation Scenarios

### 1. Resolver Verification (unit)

```bash
# Run resolver unit tests — verifies prop-to-class mapping
pnpm --filter @pathable/react test -- --run packages/react/src/internal/resolvers/__tests__/sizing.test.ts packages/react/src/internal/resolvers/__tests__/spacing.test.ts
```

**Expected**: All resolver tests pass, confirming `widthClass`, `maxWidthClass`, and margin resolvers map values to correct class strings.

### 2. Card Component Test (integration)

```bash
# Run Card-specific sizing/spacing tests
pnpm --filter @pathable/react test -- --run packages/react/src/components/Card/__tests__/Card.sizingSpacing.test.tsx
```

**Expected scenarios covered**:
- `<Card width="full" />` → root has `pathable-width-full`, no wrappers
- `<Card maxWidth="tablet" />` → root has `pathable-maxw-tablet`
- `<Card marginX="auto" />` → root has `pathable-margin-x-auto`
- `<Card marginTop="4" marginBottom="8" />` → root has both classes
- `<Card width="full" className="my-custom" />` → classes appear in correct order (`pathable-card`, `pathable-width-full`, `my-custom`)
- `<Card maxWidth="tablet" marginX="auto" />` → exactly one root element, no child wrappers
- Server-rendered output matches client-rendered output for all combinations

### 3. Storybook (visual + interaction)

```bash
# Build and run Storybook
pnpm --filter @pathable/react storybook

# OR run Storybook tests
pnpm test:storybook
```

**Expected**: Card sizing/spacing stories render correctly. Automated contract checks pass. No a11y violations.

### 4. Type Check

```bash
# Verify TypeScript compilation
pnpm --filter @pathable/react tsc --noEmit
```

**Expected**: No type errors. Props accept only valid value unions.

### 5. End-to-End: Use Card in App

```tsx
// In a consuming application, this must work without extra imports:
import { Card } from '@pathable/react'

function MyPage() {
  return (
    <div>
      <Card width="full" maxWidth="tablet" marginX="auto">
        <p>Centered, constrained card content</p>
      </Card>
    </div>
  )
}
```

**Expected**: Component renders with correct CSS classes applied to the root element. No wrapper DOM elements. No `@pathable/styles` import needed.

## Expected Outcomes Summary

| Validation Step | Expected Result |
|---|---|
| Resolver unit tests | All pass |
| Card component tests | All pass (no wrappers, correct classes, correct order) |
| Storybook | Stories render, contract checks pass |
| TypeScript | No errors |
| Server rendering | Identical to client rendering |
| Existing tests | No regressions |
| CI | All gates pass (lint, type-check, test, build, a11y) |