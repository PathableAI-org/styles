# Quickstart Validation: Form Controls and Button Adopt Sizing Props

**Feature**: specs/046-form-control-button-sizing
**Date**: 2026-08-20

## Prerequisites

```bash
# Build the styles package (needed for CSS class availability)
pnpm --filter @pathable/styles build

# Build the React package
pnpm --filter @pathable/react build
```

## Validation Scenarios

### 1. Type Check

```bash
pnpm --filter @pathable/react tsc --noEmit
```

**Expected**: No type errors. `SizingProps` correctly intersects with each component's existing prop types.

### 2. Component Tests

```bash
# Run all component sizing tests
pnpm --filter @pathable/react test -- --run \
  packages/react/src/components/Button/__tests__/Button.sizing.test.tsx \
  packages/react/src/components/Input/__tests__/Input.sizing.test.tsx \
  packages/react/src/components/Select/__tests__/Select.sizing.test.tsx \
  packages/react/src/components/Textarea/__tests__/Textarea.sizing.test.tsx
```

**Expected scenarios covered**:

- **Button**: `<Button width="full" />` → root has `pathable-width-full`. `<Button maxWidth="tablet" />` → root has `pathable-maxw-tablet`. `<Button width="full" className="my-custom" />` → classes in correct order. Single root element, no wrappers. Existing variant/size/disabled behavior preserved.
- **Input**: `<Input width="full" />` → root has `pathable-width-full`. `<Input maxWidth="desktop" />` → root has `pathable-maxw-desktop`. `<Input width="auto" />` → root has `pathable-width-auto`. Single root element, no wrappers.
- **Select**: `<Select width="full" />` → root has `pathable-width-full`. `<Select maxWidth="tablet" />` → root has `pathable-maxw-tablet`. `<Select width="full" maxWidth="desktop" />` → both classes present. Single root element, no wrappers.
- **Textarea**: `<Textarea width="full" />` → root has `pathable-width-full`. `<Textarea maxWidth="mobile-lg" />` → root has `pathable-maxw-mobile-lg`. Single root element, no wrappers.

### 3. Storybook (visual + contract)

```bash
# Build and run Storybook
pnpm --filter @pathable/react storybook

# OR run Storybook tests
pnpm test:storybook
```

**Expected**: Sizing stories for Button, Input, Select, and Textarea render correctly. Each story shows `width="full"`. Automated contract and a11y checks pass.

### 4. Resolver Unit Tests (regression)

```bash
pnpm --filter @pathable/react test -- --run packages/react/src/internal/resolvers/__tests__/
```

**Expected**: All existing resolver tests pass. No regressions in the resolver layer.

### 5. CI Gates

```bash
# Lint
pnpm --filter @pathable/react lint

# Format
pnpm --filter @pathable/react format:check

# Build
pnpm --filter @pathable/react build
```

**Expected**: All gates pass. No new warnings or suppressions.

### 6. End-to-End: Use Components in App

```tsx
import { Button, Input, Select, Textarea } from '@pathable/react'

function MyForm() {
  return (
    <form>
      <Input width="full" placeholder="Full width input" />
      <Select width="full" maxWidth="tablet">
        <option>Option 1</option>
        <option>Option 2</option>
      </Select>
      <Textarea width="full" rows={4} />
      <Button width="full">Submit</Button>
    </form>
  )
}
```

**Expected**: All components render with correct sizing classes on their root elements. No wrapper DOM elements. No `@pathable/styles` import needed.

## Expected Outcomes Summary

| Validation Step | Expected Result |
|---|---|
| TypeScript | No errors |
| Component tests (4 files) | All pass — correct classes, no wrappers |
| Resolver unit tests | All pass — no regressions |
| Storybook | Sizing stories render, contract + a11y checks pass |
| Lint | Clean — no warnings |
| Build | Succeeds |
| SSR consistency | Server output matches client output |
| Existing behavior | No regressions — disabled, focus, keyboard, native props all preserved |