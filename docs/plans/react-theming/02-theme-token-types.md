# 02 — Theme Token Types and Vocabulary

Status: NOT STARTED

## Parent Plan

[../react-theming.md](../react-theming.md) — Target state § "Typed Theme Configuration" and "Public Tone Type Exports"; Transition Plan Phase 1

## Scope

Establish the typed theme vocabulary in `@pathableai/react`: the `ThemeColors` and `ThemeConfig` interfaces, the camelCase-to-kebab-case mapping between TypeScript keys and `--pathable-color-*` custom properties, and the public re-export of the semantic tone types. This feature creates the typed foundation that `defaultTheme`, `createTheme`, and `ThemeProvider` consume; no runtime theming behavior ships here.

## Includes

- Define a `ThemeColors` interface whose keys correspond 1:1 with the semantic color tokens in `_semantic.scss` (all 25 `--pathable-color-*` tokens), using camelCase keys (e.g. `actionPrimaryBg`, `textSuccess`, `onAccent`).
- Define a `ThemeConfig` interface with a single `colors: ThemeColors` field (structured to allow future token categories such as typography and spacing).
- Define and document the camelCase → kebab-case mapping (the table in the parent plan § "CSS Custom Property Mapping"), plus a pure mapping function that converts a `ThemeColors` key to its `--pathable-color-*` name.
- Re-export the semantic tone types (`TextTone`, `SurfaceTone`, `BorderTone`, and `SurfaceElevation`) from the public entry point (`packages/react/src/index.ts`) so consumers share one vocabulary between component props and theme configuration.
- Add a build/lint-time sync check (extending the existing styles `lint:tokens` script or a new React-side check) so that a semantic token added to `_semantic.scss` without a matching `ThemeColors` key fails the build.
- Unit-test the mapping function for every token key (happy path and edge cases).

## Excludes

- The `defaultTheme` constant value (see [03](./03-default-theme-create-theme.md)).
- The `createTheme` factory (see [03](./03-default-theme-create-theme.md)).
- The `ThemeProvider` component (see [04](./04-theme-provider.md)).
- Emitting CSS custom properties at runtime.
- Any token _value_ changes.

## Dependencies

- [01 — Consolidated Theme Token CSS and Granular Exports](./01-consolidated-theme-token-css.md) (the consolidated `:root` block is the canonical token list this feature derives from).

## DONE Means

- `ThemeColors` and `ThemeConfig` are defined in `packages/react/src/` and exported from `@pathableai/react`.
- The `ThemeColors` key set matches the `--pathable-color-*` tokens emitted by `_semantic.scss` exactly (no missing, no extra keys).
- The camelCase → kebab-case mapping is documented and implemented as a pure function with unit tests.
- `TextTone`, `SurfaceTone`, `BorderTone`, and `SurfaceElevation` are importable from `@pathableai/react`.
- A token added to SCSS without a corresponding `ThemeColors` key fails the build/lint.
- CI passes.
