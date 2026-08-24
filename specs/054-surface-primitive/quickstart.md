# Quickstart: Surface Primitive

**Feature**: Surface Primitive
**Date**: 2026-08-24

## Purpose

Validation guide proving the `Surface` primitive works end-to-end: the new
`pathable-surface` tone/elevation/border modifiers in `@pathableai/styles`, the
`Surface` React component in `@pathableai/react`, and its coordinated class
output, ref/as behavior, and server/client determinism.

## Prerequisites

- pnpm workspace installed (`pnpm install` already done).
- Packages: `@pathableai/styles`, `@pathableai/react` (workspace protocol).

## Validation scenarios

### 1. SCSS contract present in `packages/styles`

Confirm the new tone/elevation/border modifiers exist and resolve to semantic
tokens (no literal hex/px/rem in the modifiers).

```bash
rg "pathable-surface--tone-(default|subtle|primary)" packages/styles/src/pathable-component-wrappers/pathable-surface.scss
rg "pathable-surface--elevation-(sm|md|lg|xl)" packages/styles/src/pathable-component-wrappers/pathable-surface.scss
rg "pathable-surface--border-(default|danger)" packages/styles/src/pathable-component-wrappers/pathable-surface.scss
```

Expected: each modifier declared with `var(--pathable-*)` / `var(--elevation-*)`
values only.

### 2. `Surface` exported from `@pathableai/react`

```bash
rg "Surface" packages/react/src/index.ts
rg "Surface" packages/react/src/components/Surface/Surface.tsx
```

Expected: `Surface` and `SurfaceProps` (plus `SurfaceElevation`) exported from
the public entry point; the component lives in `components/Surface/`.

### 3. Unit tests pass

```bash
# New surface resolver + component tests
pnpm --filter @pathableai/react test:unit -- --testPathPattern="Surface"

# Existing primitive suite (no regressions)
pnpm --filter @pathableai/react test:unit -- --testPathPattern="Text|Grid|Inline|Cluster|Stack|Container|Heading|Card"
```

Expected: each `variant` maps to its tone class; `elevation` and `borderTone`
combine correctly with `variant`; `as`/ref/passthrough and no-wrapper checks
pass; invalid values are rejected by types.

### 4. Typecheck and build

```bash
pnpm --filter @pathableai/react build
```

Expected: `tsc` succeeds; `Surface`'s public props are typed from the shared
`SurfaceTone`/`BorderTone` unions plus the verified `SurfaceElevation` steps.

### 5. Server/client purity

The resolvers must contain no browser globals. Verify via the purity guard:

```bash
pnpm --filter @pathableai/react test:unit -- --testPathPattern="purity"
```

Expected: no `window`/`document` references in `surfaceToneClass`,
`surfaceElevationClass`, or `surfaceBorderToneClass`.

### 6. Storybook stories render

```bash
# React Storybook stories
pnpm --filter @pathableai/react test:storybook-react -- --grep "Surface" || true
```

Expected: one deterministic story per supported `variant`, plus stories for
`elevation` and `borderTone` combinations; stories use accessible queries and
deterministic content.

### 7. Contrast evidence recorded

Confirm the per-variant contrast table and forced-colors/reduced-motion notes
are recorded in `research.md` (spec FR-025/FR-026/FR-027), and the SCSS carries
`@media (forced-colors: active)` / `prefers-reduced-motion` handling for the
new modifiers.

## Expected outcomes

- `Surface` renders a single element (`div` default, `as` override) with the
  coordinated tone/elevation/border classes and no wrapper nodes.
- `variant="primary"` resolves to accent background + `on-accent` foreground.
- Arbitrary `color`/`background`/`borderColor`/`box-shadow` props are rejected
  by the type system.
- Server and client output are identical for all covered prop combinations.

## References

- Research + decisions: [`research.md`](./research.md)
- Type/entity model: [`data-model.md`](./data-model.md)
- Interface contract: [`contracts/component-api.md`](./contracts/component-api.md)
