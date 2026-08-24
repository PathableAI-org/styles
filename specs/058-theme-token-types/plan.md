# Implementation Plan: Theme Token Types and Vocabulary

**Branch**: `058-theme-token-types` | **Date**: 2026-08-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/058-theme-token-types/spec.md`

## Summary

Establish the typed theme vocabulary in `@pathableai/react`: the `ThemeColors` and
`ThemeConfig` public types, the camelCase-to-kebab-case mapping between TypeScript keys
and the `--pathable-color-*` CSS custom properties, and the public re-export of the
semantic tone/elevation types. The work is entirely type + one pure utility function,
backed by a build/lint-time sync check that keeps the TypeScript key set 1:1 with the
`$semantic-colors` map and `:root` block in `packages/styles/src/_semantic.scss`. No
runtime theming behavior, token values, token names, or component changes ship here.

## Technical Context

**Language/Version**: TypeScript 5.7 (`packages/react`), Node.js ESM for build/lint scripts.

**Primary Dependencies**: `@pathableai/styles` (`workspace:*`, source of truth for the token
list); `typescript`, `vitest`, `eslint` (react package dev toolchain).

**Storage**: N/A — pure types and one stateless pure function; no persistence.

**Testing**: `vitest` (react unit tests under `packages/react/src/**/__tests__/*.test.ts`),
`tsc` typecheck (`packages/react` `typecheck` script), `eslint` (`packages/react` `lint`),
and the token sync lint (`pnpm lint:tokens`).

**Target Platform**: Published npm package `@pathableai/react`; compile-time types plus a
single environment-independent pure utility.

**Project Type**: Library (React wrapper package within a pnpm monorepo).

**Performance Goals**: N/A for the types/function. The sync check must run in under 5 seconds
incremental (SC-004) — it reuses the existing in-memory `$semantic-colors` parser.

**Constraints**: No token value/name/count changes (constitution VIII/II — SCSS is the source
of truth); no runtime theming, `defaultTheme`, `createTheme`, or `ThemeProvider` (out of scope);
the mapping function must be pure with no DOM/browser globals; the sync check must fail with
descriptive names (FR-008); no lint/type-check suppression; no duplicate public export of the
already-forwarded `TextTone` symbol.

**Scale/Scope**: 25 color tokens; 2 new public types (`ThemeColors`, `ThemeConfig`) plus 1 key
type; 1 pure mapping function; 4 re-exported tone/elevation types; 1 sync check; 1 new `theme/`
module; unit tests for the mapping function.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- Changes are confined to `packages/react` source (`src/theme/`, `src/index.ts`) and the
  cross-package token sync lint (`packages/styles/scripts/lint-tokens.mjs`). No `packages/styles`
  source/asset/token changes, no Storybook or docs-site content changes.
- The owning `packages/styles` contract — the `--pathable-color-*` custom properties emitted by
  `_semantic.scss` — is not modified; this feature *derives* its vocabulary from it.
- No React component is added or renamed, so the CamelCase component-naming parity rule does not
  apply. The new types are vocabulary, not components.

### Consumer and Publishable Validation

- Consumers import `ThemeColors`, `ThemeConfig`, and the re-exported tone types from
  `@pathableai/react`; these are type-only exports plus one pure function that requires no
  separate `@pathableai/styles` import (satisfies constitution V).
- Public declarations remain type-safe: the plan includes `tsc` typecheck and
  `check:types`/`check:package` (`attw`/`publint`) as publishable validation for the added exports.
- No breaking change: `TextTone` remains importable from `@pathableai/react` (currently forwarded
  via the `Text` component); the plan consolidates its re-export without removing the symbol.

### Validation Gates

- Applicable gates: `packages/react` `lint` (eslint, `--max-warnings=0`), `typecheck`,
  `test:unit` (vitest), `build`, and the token sync lint (`lint:tokens`). The plan does not
  disable, weaken, skip, or remove any lint check.
- No file is excluded from its validator to make CI pass.
- No warning-only configuration is introduced.

### Story and Interaction Requirements

*Not applicable* — no rendered component UI, stories, or interactive behavior changes.

### Accessibility

*Not applicable* — no markup, component behavior, or visual token values change. The feature
preserves existing accessibility guarantees by not altering any CSS output.

### Responsive and Resilient States

*Not applicable* — no rendered component UI, tokens, or states change.

### Visual Regression

*Not applicable* — no token values change. The sync check enforces token-*name* parity only.

### Documentation Surface Ownership

- Canonical source for the public type surface is the new `packages/react/src/theme/` module and
  its `contracts/` in this spec. The parent plan (`docs/plans/react-theming.md`) remains the
  consumer-facing narrative; no README/docs-site change is required for this feature.

### Cross-Framework Impact

- No `packages/styles` source or shared CSS contract changes, so framework Storybooks are
  unaffected. The styles package build is untouched; the only styles-side artifact touched is the
  already-existing `lint-tokens.mjs` (an additive check).

### Complexity Tracking

- No constitution violations. No entry needed.

## Project Structure

### Documentation (this feature)

```text
specs/058-theme-token-types/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── theme-types.md
│   ├── tone-exports.md
│   └── token-sync.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/react/
├── src/
│   ├── index.ts                     # MODIFIED: export ThemeColors/ThemeConfig/themeColorToken
│   │                                #          + re-export tone/elevation types
│   ├── theme/                       # NEW: public theme vocabulary module
│   │   ├── tokens.ts                # NEW: THEME_COLOR_KEYS, ThemeColors, mapping function
│   │   └── index.ts                 # NEW: barrel re-export
│   └── components/Text/Text.tsx     # unchanged (still re-exports TextTone internally)
└── package.json                     # unchanged (no new scripts; typecheck/test already cover)

packages/styles/
└── scripts/lint-tokens.mjs          # MODIFIED: add checkThemeTokenSync() (additive)
```

**Structure Decision**: A new public `packages/react/src/theme/` module owns the theme vocabulary
(keys constant, derived `ThemeColors`, `ThemeConfig`, and the pure mapping function), exported from
`src/index.ts` alongside the existing component/tone exports. This mirrors how other public types
live adjacent to their owning domain rather than in the internal `resolvers/` tree, and keeps the
mapping function co-located with the single source-of-truth key constant. The token sync check is
added to the existing `lint-tokens.mjs` (reusing its `$semantic-colors` parser) rather than as a
separate script.

## Complexity Tracking

> No constitution violations.
