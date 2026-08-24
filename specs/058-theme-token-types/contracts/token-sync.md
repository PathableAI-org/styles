# Interface Contract: Theme Token Sync Check

Enforcement point: `checkThemeTokenSync()` in `packages/styles/scripts/lint-tokens.mjs`,
invoked via the existing root `pnpm lint:tokens` (and thus `pnpm lint`).

## Purpose

Guarantee that the `ThemeColors` key set in `@pathableai/react` stays 1:1 with the
`--pathable-color-*` tokens declared by the `$semantic-colors` map and `:root` block in
`packages/styles/src/_semantic.scss` (the constitution-mandated source of truth).

## Inputs

- **SCSS side**: `$semantic-colors` map keys, parsed by the existing `parseScssMap(semantic,
  'semantic-colors')` — 25 kebab-case token names (e.g. `action-primary-bg`).
- **TS side**: the `THEME_COLOR_KEYS` const array in
  `packages/react/src/theme/tokens.ts`, extracted by a targeted regex over the array's
  single-quoted literals.

## Normalization

The script applies the same camelCase → kebab-case transform as `themeColorToken`
(`key.replace(/[A-Z]/g, (ch) => '-' + ch.toLowerCase())`) to each TS key before comparison.

## Pass/fail behavior

| Condition | Result |
| --------- | ------ |
| TS key set (kebab-normalized) equals SCSS token set | Exit code `0` |
| SCSS token missing from TS keys | Exit code non-zero; message lists each missing kebab token name |
| TS key with no SCSS token (extraneous) | Exit code non-zero; message lists each extraneous camelCase key name |
| React theme file absent or unparseable | Exit code non-zero with a clear error (no silent skip) |

Messages name the specific tokens (FR-008), not just a count.

## Wiring

- No new script or `package.json` change: `checkThemeTokenSync()` is added to the existing
  `lint-tokens.mjs`, so `pnpm lint:tokens` (root) and `pnpm lint` pick it up automatically.
- The react theme file is resolved relative to `STYLES_ROOT`
  (`resolve(STYLES_ROOT, '../react/src/theme/tokens.ts')`), so the check works from either the
  repo root or `packages/styles`.

## Failure examples

Adding `--pathable-color-info` to `_semantic.scss` without a `ThemeColors` key must produce
an error naming `info`. Adding a `ThemeColors` key `accentColour` with no SCSS token must
produce an error naming `accentColour`.
