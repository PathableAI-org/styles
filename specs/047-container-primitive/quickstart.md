# Quickstart: Container Layout Primitive

**Feature**: Container Layout Primitive  
**Date**: 2026-08-20  

## Prerequisites

- pnpm installed
- Repository cloned and dependencies installed (`pnpm install`)
- `@pathable/styles` built (`pnpm --filter @pathable/styles build`)

## Build

```bash
# Build the React package (includes new Container component)
pnpm --filter @pathable/react build
```

## Test

```bash
# Run Container component tests only
pnpm --filter @pathable/react test -- --testPathPattern="Container"

# Run all React package tests
pnpm --filter @pathable/react test
```

## Storybook

```bash
# Start Storybook for visual verification
pnpm --filter @pathable/react storybook

# Navigate to Container stories and verify:
# 1. "Standard" story renders at 1024px max-width with gutters
# 2. "Wide" story renders at 1280px max-width
# 3. "Full" story renders at 100% width (full-bleed)
```

## Validation Scenarios

### 1. Basic Rendering

Render `<Container size="standard">Hello</Container>`. Expected: a single `<div>` with classes `pathable-container pathable-container--standard`, containing "Hello" as a direct text node. No wrapper elements.

### 2. Polymorphic Element

Render `<Container as="main" size="wide">Main content</Container>`. Expected: a single `<main>` element with classes `pathable-container pathable-container--wide`.

### 3. Size Omitted

Render `<Container>Content</Container>`. Expected: a single `<div>` with only the base `pathable-container` class.

### 4. ClassName Merge

Render `<Container size="standard" className="my-page">`. Expected: classes `pathable-container pathable-container--standard my-page` on the root element.

### 5. Native Props

Render `<Container size="full" id="hero" data-test="main">`. Expected: `id="hero"` and `data-test="main"` attributes on the root element.

### 6. Ref Forwarding

```typescript
const ref = React.createRef<HTMLDivElement>()
render(<Container size="standard" ref={ref}>Content</Container>)
expect(ref.current).toBeInstanceOf(HTMLDivElement)
expect(ref.current?.className).toContain('pathable-container')
```

### 7. Deep Nesting

Render `<Container size="wide"><div><p>Deep</p></div></Container>`. Expected: one root `<div>` with container classes, containing the nested `<div><p>` structure unchanged.

### 8. SSR Consistency

Server-render `<Container size="standard">SSR test</Container>` and compare with client render output. Expected: identical DOM string.

## Expected Test Coverage

- Size-to-class mapping for each value (standard, wide, full)
- No size → base class only
- No wrapper elements
- Ref forwarding (div and as="main")
- `as` element selection (main, section, nav)
- `className` merge order
- Native prop passthrough (id, data-*, aria-*)
- SSR/client output parity