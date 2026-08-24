# Interface Contract: Public Tone and Elevation Type Exports

These types are already defined in `packages/react/src/internal/resolvers/` and are
re-exported — not redefined — from the public entry point (`packages/react/src/index.ts`).

## Exported symbols and their sources

| Symbol | Source module | Union values |
| ------ | ------------- | ------------ |
| `TextTone` | `internal/resolvers/tone.ts` | `'default' \| 'muted' \| 'danger' \| 'success'` |
| `SurfaceTone` | `internal/resolvers/tone.ts` | `'default' \| 'subtle' \| 'primary'` |
| `BorderTone` | `internal/resolvers/tone.ts` | `'default' \| 'danger'` |
| `SurfaceElevation` | `internal/resolvers/surface.ts` | `'sm' \| 'md' \| 'lg' \| 'xl'` |

## Public entry-point shape

```ts
export type { TextTone, SurfaceTone, BorderTone } from './internal/resolvers/tone.js'
export type { SurfaceElevation } from './internal/resolvers/surface.js'
```

## Contract rules

- These are type-only exports; they introduce no runtime value.
- The union values above are the complete, authoritative sets. No value is added, removed,
  or renamed by this feature.
- `TextTone` must remain importable from `@pathableai/react` after the change. Because
  `TextTone` is already forwarded through the `Text` component barrel today, the public entry
  consolidates its provenance to the `internal/resolvers/tone.ts` re-export and drops the
  redundant `TextTone` from the `Text` component barrel line to avoid a duplicate-export error
  (see [`../research.md`](../research.md) §4).

## Verification

A TypeScript consumer can write:

```ts
import type { TextTone, SurfaceTone, BorderTone, SurfaceElevation } from '@pathableai/react'

const a: TextTone = 'muted'        // ok
const b: SurfaceTone = 'subtle'    // ok
const c: BorderTone = 'danger'     // ok
const d: SurfaceElevation = 'lg'   // ok
const e: SurfaceElevation = 'xxl'  // compile error
```
