# Data Model: Semantic Color and Tone Model

**Feature**: Semantic Color and Tone Model
**Date**: 2026-08-23

## Domain Entities

### TextTone

The semantic meaning categories for text content.

- **Type**: `'default' | 'muted' | 'danger' | 'success'`
- **Purpose**: Lets applications express "this text is muted/danger/success" without naming a palette value.
- **Validation**: Closed string-literal union — TypeScript rejects unknown values at compile time.
- **Required**: No — optional on the `Text` component; omitted means "default text color".
- **Mapping**: resolved by `textToneClass()` to a `pathable-text--tone-*` modifier class.

### SurfaceTone

The semantic meaning categories for surfaces/containers.

- **Type**: `'default' | 'subtle' | 'primary'`
- **Purpose**: Forward-declared shared vocabulary for the future `Surface` primitive (feature 12).
- **Validation**: Closed string-literal union.
- **SCSS contract**: **TRACKED GAP** — no `pathable-surface--tone-*` contract exists yet; owned by feature 12.
- **Mapping**: no resolver in this feature (gap).

### BorderTone

The semantic meaning categories for boundaries/borders.

- **Type**: `'default' | 'danger'`
- **Purpose**: Forward-declared shared vocabulary for future boundary/surface work.
- **Validation**: Closed string-literal union.
- **SCSS contract**: **TRACKED GAP** — no border-tone contract exists yet; no owning feature assigned.
- **Mapping**: no resolver in this feature (gap).

### ToneVocabulary

The canonical record of every tone role, its SCSS source, and its resolved class name(s) or tracked gap.

- **Location**: recorded in `research.md` (the audit) and mirrored as doc comments in `tone.ts` (the code-level source).
- **Invariant**: no advertised tone resolves to an unverified or missing class without a documented gap (spec FR-007/FR-008).

## Class Resolution Model

### `textToneClass` resolver

Pure function mapping a `TextTone` value to its class (or `undefined` for `null`/`undefined`/unknown), following the resolver-layer pattern established by feature 01 (`textColorClass`, `backgroundColorClass`).

```text
textToneClass('default') -> 'pathable-text--tone-default'
textToneClass('muted')   -> 'pathable-text--tone-muted'
textToneClass('danger')  -> 'pathable-text--tone-danger'
textToneClass('success') -> 'pathable-text--tone-success'
textToneClass(undefined) -> undefined
textToneClass('unknown') -> undefined  // runtime fallback; compile-time rejected
```

### Text class merge order (unchanged from feature 09)

1. `pathable-text` (base, always)
2. `pathable-text--{variant}` (if `variant`)
3. `pathable-text--tone-{tone}` (if `tone`)
4. consumer `className` (last)

`Text.tsx` consumes `textToneClass(tone)` in place of its inline `TEXT_TONE_CLASS` map; the rendered class output is byte-for-byte identical for all previously supported values.

## Mapping Tables

### TextTone → class → token

| Value | Class | Token |
|-------|-------|-------|
| `default` | `pathable-text--tone-default` | `--pathable-color-text` |
| `muted` | `pathable-text--tone-muted` | `--pathable-color-text-muted` |
| `danger` | `pathable-text--tone-danger` | `--pathable-color-danger` |
| `success` | `pathable-text--tone-success` | `--pathable-color-text-success` |

### SurfaceTone → (gap) → candidate token

| Value | Class | Candidate token | Status |
|-------|-------|-----------------|--------|
| `default` | (TBD) | `--pathable-color-surface` | GAP |
| `subtle` | (TBD) | `--pathable-color-bg` | GAP |
| `primary` | (TBD) | `--pathable-color-accent` or `--pathable-color-action-primary-bg` | GAP (unresolved) |

### BorderTone → (gap) → candidate token

| Value | Class | Candidate token | Status |
|-------|-------|-----------------|--------|
| `default` | (TBD) | `--pathable-color-border` | GAP |
| `danger` | (TBD) | `--pathable-color-danger` | GAP |

## State Machine

No state. The feature is a pure type/type-relocation change plus a vocabulary record. The only "state" is prop presence:

- **Valid**: `tone` ∈ `TextTone` — mapped to a class.
- **Invalid**: `tone` outside the union — rejected at compile time; `textToneClass` returns `undefined` for an unknown runtime string (documented fallback).
- **Omitted**: `tone` = `undefined` → no tone class, default text color.
- **Identity**: `tone="default"` yields `pathable-text--tone-default` (same visual result as omitting tone, deterministic semantics — no special-casing).

## Relationships

- **TextTone** is consumed by the **`Text` component** (feature 09) via the internal barrel (`internal/resolvers/index.ts`).
- **SurfaceTone** is a forward-declaration for the **`Surface` primitive** (feature 12); its SCSS contract is a tracked gap owned by that feature.
- **BorderTone** is a forward-declaration for future boundary/surface work; no owning feature yet.
- The tone vocabulary lives alongside the existing **utility color types** (`BackgroundColor`, `TextColor`) but is a distinct semantic concept — see `research.md` Decision 1.
- All tone types remain **internal** (not exported from `packages/react/src/index.ts`), per spec FR-014 and feature 01's "not a public export" scope.
