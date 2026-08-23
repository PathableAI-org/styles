# Tone Vocabulary Contract

**Feature**: Semantic Color and Tone Model
**Date**: 2026-08-23

## Purpose

This contract defines the shared semantic tone vocabulary and the internal TypeScript surface that `@pathable/react` exposes to component authors. It is the interface between the design-system SCSS contracts (owned by `@pathable/styles`) and the React wrapper layer.

## Public vs. internal

- **Internal** — the tone types (`TextTone`, `SurfaceTone`, `BorderTone`) and the `textToneClass` resolver live in `packages/react/src/internal/resolvers/` and are **not** re-exported from the public `packages/react/src/index.ts` entry point.
- **Public** — the `Text` component's `tone` prop is the only public consumer surface. Its value set is unchanged by this feature.

## Type contracts

```typescript
// packages/react/src/internal/resolvers/tone.ts

export type TextTone = 'default' | 'muted' | 'danger' | 'success'

export type SurfaceTone = 'default' | 'subtle' | 'primary'

export type BorderTone = 'default' | 'danger'

export function textToneClass(value?: string | null): string | undefined
```

- `TextTone` — fully grounded: `textToneClass` maps each member to a `pathable-text--tone-*` class.
- `SurfaceTone` — vocabulary only; SCSS contract is a tracked gap (owner: feature 12 `Surface`).
- `BorderTone` — vocabulary only; SCSS contract is a tracked gap (no owner yet).

## Resolver contract

| Input | Output |
|-------|--------|
| `'default'` | `'pathable-text--tone-default'` |
| `'muted'` | `'pathable-text--tone-muted'` |
| `'danger'` | `'pathable-text--tone-danger'` |
| `'success'` | `'pathable-text--tone-success'` |
| `null` / `undefined` | `undefined` |
| any other string | `undefined` (runtime fallback; compile-time rejected for `TextTone`) |

## Class merge order (`Text`)

`pathable-text` → `pathable-text--{variant}` → `pathable-text--tone-{tone}` → consumer `className`.

## Vocabulary mapping

See `research.md` — "Tone Vocabulary (canonical record)" for the full tone → SCSS source → resolved class / gap table, including the contrast evidence.

## Guarantees

1. **Determinism**: `textToneClass` is a pure lookup — no browser globals, no feature detection; server and client output are identical.
2. **Theme independence**: values express meaning (`danger`), never palette (`red-600`).
3. **Source-first**: no wrapper advertises a tone whose `packages/styles` contract does not exist (gaps are explicit).
4. **No silent adoption**: `SurfaceTone`/`BorderTone` have no resolvers until their contracts exist.
