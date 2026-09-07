# 03 — Default Theme and createTheme

Status: NOT STARTED

## Parent Plan

[../react-theming.md](../react-theming.md) — Target state § "defaultTheme Export" and "createTheme Helper"; Transition Plan Phase 1

## Scope

Provide the theme _data_ layer in `@pathableai/react`: an exported `defaultTheme` constant containing the complete default color token set, and a `createTheme` factory that deep-merges a partial theme with those defaults and returns a fully resolved, validated `ThemeConfig`. This feature is pure data and pure functions — no React components and no DOM.

## Includes

- Export `defaultTheme`, a `ThemeConfig` whose `colors` values are exactly the defaults declared in `_semantic.scss` (e.g. `accent: '#1cae96'`, `bg: '#dde2e8'`, `text: '#00365c'`).
- Implement `createTheme(input: DeepPartial<ThemeConfig>): ThemeConfig`:
  - Deep-merges `input` over `defaultTheme`, so unspecified color tokens fall through to defaults.
  - Validates that every required token is present after merging.
  - Validates that each value is a valid CSS color string.
  - Throws a descriptive error at call time (not render time) on invalid input.
  - Returns a complete, serializable `ThemeConfig` with no runtime side effects.
- Ensure `createTheme` and `defaultTheme` are pure and deterministic (no browser globals, no mutation of the input or the shared default).
- Unit-test: partial overrides, deep-merge behavior, full-config passthrough, missing/invalid values, non-mutation of `defaultTheme`, and serializability.
- Confirm the returned theme is safe to pass to `ThemeProvider` (feature 04) without re-validation.

## Excludes

- The `ThemeProvider` component (see [04](./04-theme-provider.md)).
- Runtime CSS custom property emission.
- Dark-mode token generation — a consumer may supply a dark `ThemeColors` object, but `createTheme` does not auto-generate one.
- Token categories beyond `colors` (typography, spacing, etc.).

## Dependencies

- [02 — Theme Token Types and Vocabulary](./02-theme-token-types.md) (for `ThemeConfig`/`ThemeColors` and the token set).
- [01 — Consolidated Theme Token CSS and Granular Exports](./01-consolidated-theme-token-css.md) (for the authoritative default values).

## DONE Means

- `defaultTheme` is exported from `@pathableai/react` and its color values match `_semantic.scss` exactly.
- `createTheme({ colors: { accent: '#7c3aed' } })` returns a complete `ThemeConfig` with `accent` overridden and all other tokens at their defaults.
- `createTheme` throws a descriptive error for missing required tokens or invalid color strings.
- `defaultTheme` is not mutated by `createTheme` (deep equality before/after).
- The returned theme is serializable (`JSON.parse(JSON.stringify(theme))` deep-equals `theme`).
- Unit tests cover the cases above and CI passes.
