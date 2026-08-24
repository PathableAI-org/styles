# Data Model: Surface Primitive

**Feature**: Surface Primitive
**Date**: 2026-08-24

## Domain Entities

### Surface component

A React component in `@pathableai/react` that renders a semantic visual
container and coordinates foreground, background, border, and elevation into a
single `variant` prop plus optional `borderTone` and `elevation` refinements.

- **Default element**: `div`.
- **Polymorphism**: optional `as` prop (`ElementType`).
- **Ref**: forwarded to the rendered element.
- **Wrapper nodes**: none — a single DOM node per instance.

### Surface variant (SurfaceTone)

The semantic surface *tone* selectors, typed by the shared `SurfaceTone` union.

- **Type**: `'default' | 'subtle' | 'primary'` (from `internal/resolvers/tone.ts`).
- **Optional**: yes — omitted means the default tone modifier (`pathable-surface--tone-default`) is applied.
- **Validation**: closed string-literal union; TypeScript rejects unknown values.
- **Mapping**: a `surfaceToneClass()` resolver maps each value to a
  `pathable-surface--tone-*` modifier (see mapping tables below).

### Border tone (BorderTone)

The semantic boundary meaning selectors, typed by the shared `BorderTone` union.

- **Type**: `'default' | 'danger'` (from `internal/resolvers/tone.ts`).
- **Optional**: yes — omitted means the variant's default border applies.
- **Mapping**: a `surfaceBorderToneClass()` resolver maps each value to a
  `pathable-surface--border-*` modifier.

### Elevation step

A finite, verified depth level.

- **Type**: `'sm' | 'md' | 'lg' | 'xl'`.
- **Optional**: yes — omitted means no elevation modifier class is applied.
- **Validation**: closed union; only verified `--elevation-*` steps are accepted.
- **Mapping**: a `surfaceElevationClass()` resolver maps each value to a
  `pathable-surface--elevation-*` modifier.

## Class Resolution Model

### Resolvers (pure, no browser dependencies)

```text
surfaceToneClass('default') -> 'pathable-surface--tone-default'
surfaceToneClass('subtle')  -> 'pathable-surface--tone-subtle'
surfaceToneClass('primary') -> 'pathable-surface--tone-primary'
surfaceToneClass(undefined) -> undefined
surfaceToneClass('unknown') -> undefined   // runtime fallback; compile-time rejected

surfaceElevationClass('sm') -> 'pathable-surface--elevation-sm'
surfaceElevationClass('md') -> 'pathable-surface--elevation-md'
surfaceElevationClass('lg') -> 'pathable-surface--elevation-lg'
surfaceElevationClass('xl') -> 'pathable-surface--elevation-xl'
surfaceElevationClass(undefined) -> undefined

surfaceBorderToneClass('default') -> 'pathable-surface--border-default'
surfaceBorderToneClass('danger')  -> 'pathable-surface--border-danger'
surfaceBorderToneClass(undefined) -> undefined
```

### Class merge order

1. `pathable-surface` (base, always)
2. `pathable-surface--tone-{variant}` (if `variant`)
3. `pathable-surface--elevation-{n}` (if `elevation`)
4. `pathable-surface--border-{tone}` (if `borderTone`)
5. resolved sizing/spacing classes (`width`, `maxWidth`, `margin*`)
6. consumer `className` (last)

`mergeClasses()` handles deduplication, whitespace normalization, and falsy
filtering.

## Mapping Tables

### SurfaceTone → modifier → tokens

| Value | Modifier | Background | Foreground | Default border |
|-------|----------|------------|------------|----------------|
| `default` | `pathable-surface--tone-default` | `--pathable-color-surface` | `--pathable-color-text` | `--pathable-color-border` |
| `subtle` | `pathable-surface--tone-subtle` | `--pathable-color-bg` | `--pathable-color-text` | `--pathable-color-border` |
| `primary` | `pathable-surface--tone-primary` | `--pathable-color-accent` | `--pathable-color-on-accent` | `--pathable-color-accent` |

### Elevation step → modifier → token

| Value | Modifier | Shadow |
|-------|----------|--------|
| `sm` | `pathable-surface--elevation-sm` | `--elevation-sm` |
| `md` | `pathable-surface--elevation-md` | `--elevation-md` |
| `lg` | `pathable-surface--elevation-lg` | `--elevation-lg` |
| `xl` | `pathable-surface--elevation-xl` | `--elevation-xl` |

### BorderTone → modifier → token

| Value | Modifier | Border color |
|-------|----------|--------------|
| `default` | `pathable-surface--border-default` | `--pathable-color-border` |
| `danger` | `pathable-surface--border-danger` | `--pathable-color-danger` |

## State Model

No runtime state. The only "state" is prop presence, which is resolved to a
deterministic class string at render time:

- **Valid**: each of `variant`/`elevation`/`borderTone` within its union —
  mapped to a modifier class.
- **Invalid**: a value outside its union — rejected at compile time; the
  resolver returns `undefined` for an unknown runtime string (documented
  fallback).
- **Omitted**: a prop equal to `undefined` — no modifier class; the base
  surface (and, for `variant`, the default border) applies.
- **Determinism**: resolution is pure — identical output server and client.

## Relationships

- **SurfaceTone / BorderTone** are the shared types defined in
  `internal/resolvers/tone.ts` (feature 11); `Surface` consumes them, resolving
  the tracked gaps recorded there.
- **Surface** reuses `SizingProps` and external `SpacingProps` capability
  interfaces from `internal/resolvers/types.ts` (feature 01).
- **Surface** is distinct from **`Card`** (which renders `pathable-card` with a
  presentation model and internal structure) and from **`Container`** (which
  renders `pathable-container` width sizing). `Surface` is the semantic
  treatment primitive; it does not own card or layout semantics.
- The legacy `pathable-surface--{base|raised|inset|interactive|brand|inverse}`
  depth variants remain in `packages/styles` and are unrelated to the new
  `SurfaceTone` tone-role modifiers (see `research.md` Decision 1).
- `surfaceToneClass`, `surfaceElevationClass`, and `surfaceBorderToneClass`
  resolvers are **internal** (not exported from the public `@pathableai/react`
  entry point); only the `Surface` component and its prop types are public.
