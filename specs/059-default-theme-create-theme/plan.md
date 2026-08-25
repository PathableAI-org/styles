# Implementation Plan: Default Theme and createTheme

**Branch**: `059-default-theme-create-theme` | **Date**: 2026-08-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/059-default-theme-create-theme/spec.md`

## Summary

Provide the theme data layer in `@pathableai/react`: an exported `defaultTheme` constant
containing the complete 25-token default color set (byte-for-byte matching
`packages/styles/src/_semantic.scss`), and a `createTheme` factory that deep-merges a partial
`DeepPartial<ThemeConfig>` over those defaults, validates completeness and color-value format,
and returns a fully-resolved, serializable `ThemeConfig`. The work is entirely pure data and
pure functions — no React components, no DOM, no browser globals. It builds directly on the
`ThemeColors`/`ThemeConfig` vocabulary from feature 058 and the authoritative default values
from feature 057.

## Technical Context

**Language/Version**: TypeScript 5.7 (`packages/react`), Node.js ESM for build/lint scripts.

**Primary Dependencies**: `@pathableai/styles` (`workspace:*`, source of truth for the token
*values* via `_semantic.scss`); `typescript`, `vitest`, `eslint` (react package dev toolchain).

**Storage**: N/A — one constant and one pure factory; no persistence, no runtime state.

**Testing**: `vitest` (react unit tests under `packages/react/src/**/__tests__/*.test.ts`),
`tsc` typecheck (`packages/react` `typecheck` script), `eslint` (`packages/react` `lint`,
`--max-warnings=0`), and the existing token sync lint (`pnpm lint:tokens`) which continues to
guard the 25-key vocabulary this feature populates.

**Target Platform**: Published npm package `@pathableai/react`; two new public exports
(`defaultTheme`, `createTheme`) plus one public utility type (`DeepPartial`).

**Project Type**: Library (React wrapper package within a pnpm monorepo).

**Performance Goals**: `createTheme` is a constant-time merge + a 25-entry validation pass —
trivial. The color validator is a regex/keyword lookup with no DOM, so it is environment-
independent and SSR-safe (no browser globals).

**Constraints**: No token value/name/count changes (constitution VIII/II — SCSS is the source
of truth for values, feature 058 for names); no `ThemeProvider`, runtime CSS emission, or
dark-mode generation (out of scope); no token categories beyond `colors`; `createTheme` and
`defaultTheme` must be pure and deterministic with no DOM/browser globals (so color validation
must be a dependency-free regex/heuristic, not a DOM/canvas parse); no mutation of the input or
`defaultTheme`; the returned theme must be plain serializable data; no lint/type-check
suppression.

**Scale/Scope**: 25 color tokens; 1 `defaultTheme` constant; 1 `createTheme` factory; 1
`DeepPartial` utility type; 1 internal color validator; unit tests covering partial overrides,
deep-merge, full-config passthrough, missing/invalid values, non-mutation, and serializability.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- Changes are confined to `packages/react` source (`src/theme/`, `src/index.ts`). No
  `packages/styles` source/asset/token changes, no Storybook or docs-site content changes.
- The owning `packages/styles` contract — the `--pathable-color-*` default values declared by
  `_semantic.scss` — is not modified; this feature *derives* its defaults from it and validates
  against it via unit tests.
- No React component is added or renamed, so the CamelCase component-naming parity rule does
  not apply. `defaultTheme` and `createTheme` are data-layer vocabulary, not components.

### Consumer and Publishable Validation

- Consumers import `defaultTheme` and `createTheme` from `@pathableai/react`; both are pure
  runtime exports requiring no separate `@pathableai/styles` import (satisfies constitution V).
- Public declarations remain type-safe: the plan includes `tsc` typecheck and
  `check:types`/`check:package` (`attw`/`publint`) as publishable validation for the added
  exports. `DeepPartial` is exported because it appears in `createTheme`'s public signature and
  therefore in the generated `.d.ts`.
- No breaking change: `ThemeColors`, `ThemeConfig`, and `themeColorToken` are untouched; the
  new exports are additive.

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
preserves existing accessibility guarantees by not altering any CSS output; it only re-exposes
the canonical default values as typed data.

### Responsive and Resilient States

*Not applicable* — no rendered component UI, tokens, or states change.

### Visual Regression

*Not applicable* — no token values change. Unit tests assert `defaultTheme` matches
`_semantic.scss` byte-for-byte, which is a stronger, non-visual guarantee.

### Documentation Surface Ownership

- Canonical source for the public data surface is the new `packages/react/src/theme/` module and
  its `contracts/` in this spec. The parent plan (`docs/plans/react-theming.md` →
  `03-default-theme-create-theme.md`) remains the consumer-facing narrative; no README/docs-site
  change is required for this feature.

### Cross-Framework Impact

- No `packages/styles` source or shared CSS contract changes, so framework Storybooks are
  unaffected. The styles package build is untouched.

### Complexity Tracking

- No constitution violations. No entry needed.

## Project Structure

### Documentation (this feature)

```text
specs/059-default-theme-create-theme/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── default-theme.md
│   ├── create-theme.md
│   └── color-validation.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/react/
├── src/
│   ├── index.ts                     # MODIFIED: export defaultTheme, createTheme, DeepPartial
│   └── theme/                       # public theme vocabulary module (from feature 058)
│       ├── tokens.ts                # unchanged (THEME_COLOR_KEYS, ThemeColors, ThemeConfig,
│       │                            #           themeColorToken)
│       ├── defaultTheme.ts          # NEW: defaultTheme constant (25 canonical hex values)
│       ├── createTheme.ts           # NEW: DeepPartial type + createTheme factory
│       ├── color.ts                 # NEW: isValidCssColor pure validator (internal helper)
│       ├── index.ts                 # MODIFIED: re-export defaultTheme, createTheme, DeepPartial
│       └── __tests__/
│           ├── tokens.test.ts       # unchanged (feature 058)
│           ├── defaultTheme.test.ts # NEW: 25 values match _semantic.scss
│           └── createTheme.test.ts  # NEW: merge/validation/purity/serializability
└── package.json                     # unchanged (existing typecheck/test:unit/build cover)
```

**Structure Decision**: A new `defaultTheme.ts` and `createTheme.ts` are added to the existing
`packages/react/src/theme/` module (established in feature 058), alongside `tokens.ts`. The
color validator lives in its own `color.ts` as an internal helper so it can be unit-tested in
isolation without widening the public API surface. `theme/index.ts` and `src/index.ts` forward
the two new runtime exports and the `DeepPartial` type. This keeps the 25-key source of truth in
`tokens.ts`, the 25-value source of truth in `defaultTheme.ts`, and the merge/validate logic in
`createTheme.ts`, each co-located and independently testable.

## Complexity Tracking

> No constitution violations.
