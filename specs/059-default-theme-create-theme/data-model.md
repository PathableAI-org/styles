# Data Model: Default Theme and createTheme

This document describes the domain entities introduced by the feature and their relationships.
The design is one constant, one pure factory, one utility type, and one pure validator; there is
no runtime state, persistence, or lifecycle beyond construction.

## Entities

### 1. `defaultTheme`

- **Kind**: Module-level constant of type `ThemeConfig`.
- **Definition**: `export const defaultTheme: ThemeConfig = { colors: { ...25 entries... } }`.
- **Fields**: `colors: ThemeColors` — all 25 keys present, each value a lowercase `#rrggbb`
  string copied verbatim from `packages/styles/src/_semantic.scss` `$semantic-colors`.
- **Invariants**:
  - Exactly 25 color tokens (SC-001).
  - Every value byte-for-byte equals the authoritative SCSS default (SC-001/SC-003/FR-002).
  - Never mutated by `createTheme` (FR-011).
- **Relationship**: The single source of default values against which `createTheme` merges.

### 2. `ThemeConfig` (established in feature 058 — reused, not redefined)

- **Kind**: Literal interface.
- **Definition**: `interface ThemeConfig { colors: ThemeColors }`.
- **Fields**: `colors: ThemeColors` — required; `ThemeColors` is the mapped type
  `{ [K in ThemeColorKey]: string }` over the 25 `THEME_COLOR_KEYS`.
- **Relationship**: The return type of `createTheme`; the type of `defaultTheme`.
- **Note**: This feature does not change its shape; it populates and validates instances of it.

### 3. `createTheme`

- **Kind**: Pure factory function.
- **Definition**: `createTheme(input: DeepPartial<ThemeConfig>): ThemeConfig`.
- **Behavior**:
  1. Reject non-plain-object input (throws).
  2. Deep-merge `input` over `defaultTheme` (see `research.md` §1) into a fresh object.
  3. Validate every required token is present (throws on missing).
  4. Validate every value is a valid CSS color string (throws on invalid).
  5. Return the complete, serializable `ThemeConfig`.
- **Invariants**: pure/deterministic (FR-010); no mutation of `input` or `defaultTheme` (FR-011);
  returns a plain-data object (FR-008/FR-009); throws at call time, not render time (FR-007).
- **Relationship**: Produces `ThemeConfig` instances from `DeepPartial<ThemeConfig>` inputs.

### 4. `DeepPartial<T>`

- **Kind**: Utility (mapped) type.
- **Definition**: `type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }`.
- **Invariants**: Makes every nested key optional, recursively.
- **Relationship**: The parameter type of `createTheme`; exported publicly because it appears in
  the public signature and thus the generated declarations.

### 5. `isValidCssColor`

- **Kind**: Pure predicate (internal to the `theme/` module, not part of the public API).
- **Definition**: `isValidCssColor(value: unknown): value is string`.
- **Behavior**: Returns `true` only for trimmed non-empty strings matching the accepted CSS color
  subset (hex, `rgb()`/`rgba()`, `hsl()`/`hsla()`, `hwb()`, and the named-color keyword set) —
  see `research.md` §3 for the exact boundary.
- **Invariants**: pure, deterministic, no DOM/browser globals (FR-010); rejects non-string values.
- **Relationship**: The value-level validator invoked by `createTheme` after the merge.

## Canonical default value table

The complete contract is the 25-entry table below. The SCSS source of truth is the
`$semantic-colors` map in `packages/styles/src/_semantic.scss`; the TS source of truth is
`defaultTheme.ts`. Unit tests keep the two in lockstep (SC-001/SC-003).

| # | `ThemeColorKey` (camelCase) | Default value |
|---|---|---|
| 1 | `bg` | `#dde2e8` |
| 2 | `surface` | `#ffffff` |
| 3 | `text` | `#00365c` |
| 4 | `textMuted` | `#015a76` |
| 5 | `border` | `#dde2e8` |
| 6 | `link` | `#4899e8` |
| 7 | `accent` | `#1cae96` |
| 8 | `focusRing` | `#4497f5` |
| 9 | `danger` | `#dc3545` |
| 10 | `success` | `#1cae96` |
| 11 | `textSuccess` | `#0d7a63` |
| 12 | `actionPrimaryBg` | `#00365c` |
| 13 | `actionPrimaryText` | `#ffffff` |
| 14 | `actionSecondaryBg` | `#1cae96` |
| 15 | `actionSecondaryText` | `#001a33` |
| 16 | `statusSuccessBg` | `#1cae96` |
| 17 | `statusSuccessText` | `#001a33` |
| 18 | `statusWarningBg` | `#f5a623` |
| 19 | `statusWarningText` | `#001a33` |
| 20 | `statusDangerBg` | `#dc3545` |
| 21 | `statusDangerText` | `#ffffff` |
| 22 | `workflowActive` | `#4899e8` |
| 23 | `workflowComplete` | `#1cae96` |
| 24 | `workflowBlocked` | `#dc3545` |
| 25 | `onAccent` | `#001a33` |

## State transitions

None — no runtime state, mutations, or lifecycle events. `createTheme` is a pure function of its
input and the module-level `defaultTheme`.

## Validation rules summary

| Rule | Enforcement |
| ---- | ----------- |
| 25 default values match `_semantic.scss` | `defaultTheme.test.ts` (vitest) |
| Non-object input rejected | `createTheme` guard + `createTheme.test.ts` |
| Missing token after merge rejected | `createTheme` validation + `createTheme.test.ts` |
| Invalid/non-string color value rejected | `isValidCssColor` + `createTheme.test.ts` |
| No mutation of `defaultTheme` / input | before/after deep-equality tests |
| Determinism | two calls deep-equal |
| Serializability | `JSON.parse(JSON.stringify(result))` round-trip deep-equal |
| Key vocabulary unchanged | existing `pnpm lint:tokens` (feature 058) |
