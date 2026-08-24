# Quickstart: Semantic Color and Tone Model

**Feature**: Semantic Color and Tone Model
**Date**: 2026-08-23

## Purpose

Validation guide proving the shared tone vocabulary and the `Text` type migration work end-to-end. No SCSS changes are required for this feature (text tones already exist; surface/border are tracked gaps), so validation focuses on the internal type layer and the `Text` component's unchanged behavior.

## Prerequisites

- pnpm workspace installed (`pnpm install` already done).
- Packages: `@pathableai/styles`, `@pathableai/react` (workspace protocol).

## Validation scenarios

### 1. Tone types: public vs. internal boundary

Confirm the shared types are defined in the internal resolver layer, and that the public entry point exports only `TextTone` (via the `Text` API re-export) — not `SurfaceTone`/`BorderTone`/`textToneClass`.

```bash
# The tone types live in the internal layer
rg "TextTone|SurfaceTone|BorderTone" packages/react/src/internal/resolvers/

# Only TextTone may appear in the public entry point (via the Text API re-export)
rg "SurfaceTone|BorderTone|textToneClass" packages/react/src/index.ts || echo "PASS: SurfaceTone/BorderTone/textToneClass are internal-only"
rg "TextTone" packages/react/src/index.ts && echo "PASS: TextTone is public via Text"
```

Expected: `tone.ts`, `types.ts`, and `index.ts` (internal barrel) define/re-export the types; the public `index.ts` re-exports `TextTone` (through `Text`) but not `SurfaceTone`/`BorderTone`/`textToneClass`.

### 2. `Text` consumes the shared `TextTone` type

```bash
rg "TextTone" packages/react/src/components/Text/Text.tsx
```

Expected: `Text.tsx` imports `TextTone` from `../../internal/resolvers/tone.js` (or the internal barrel); the inline `export type TextTone = ...` declaration is gone, replaced by a re-export from the internal layer.

### 3. Unit tests pass

```bash
# New tone resolver tests
pnpm --filter @pathableai/react test:unit -- --testPathPattern="tone"

# Existing Text component tests (must remain green after the type migration)
pnpm --filter @pathableai/react test:unit -- --testPathPattern="Text"
```

Expected: `textToneClass` maps each tone to its class and returns `undefined` for invalid input; all `Text` tests pass unchanged.

### 4. Typecheck and build

```bash
pnpm --filter @pathableai/react build
```

Expected: build and `tsc --noEmit` succeed; `Text`'s public `tone` prop type is unchanged (same four literal values).

### 5. Server/client purity

The `textToneClass` resolver must contain no browser globals. Verify via the existing purity guard:

```bash
pnpm --filter @pathableai/react test:unit -- --testPathPattern="purity"
```

Expected: no `window`/`document` references in resolver code.

## Expected outcomes

- `TextTone` is shared in `internal/resolvers/tone.ts`; `Text.tsx` imports it.
- `SurfaceTone` and `BorderTone` are defined but have no resolver (tracked gaps in `research.md`).
- `Text` renders identical class output for `tone="default|muted|danger|success"` as before.
- No new SCSS files, no new tokens, no new components.

## References

- Tone vocabulary + decisions: [`research.md`](./research.md)
- Type/entity model: [`data-model.md`](./data-model.md)
- Interface contract: [`contracts/tone-vocabulary.md`](./contracts/tone-vocabulary.md)
