# Interface Contract: Token Vocabulary Reference

Artifact: `docs/theming/token-vocabulary.md` (canonical source for "what each token controls").
This is the human-consumable reference that answers "these are the tokens and what each controls".

## Purpose

Provide a single reference listing every public color token (`ThemeColors` key), its CSS custom
property, its default value, and a plain-language description of its role (spec FR-001/FR-002).

## Required columns

The reference MUST contain exactly one table with these columns:

| Column | Meaning |
| ------ | ------- |
| Key | The `ThemeColors` key (camelCase), e.g. `actionPrimaryBg` |
| CSS custom property | The `--pathable-color-*` name (kebab-case), e.g. `--pathable-color-action-primary-bg` |
| Default value | The lowercase `#rrggbb` value from `defaultTheme.colors[key]` |
| Role | A plain-language description of what the token controls |

The key → property mapping is the existing `THEME_COLOR_TOKEN_MAP` (feature 058
[`theme-types.md`](../../058-theme-token-types/contracts/theme-types.md)); the reference must not
invent a divergent mapping.

## Completeness and accuracy invariants

1. **No omissions** — every one of the 25 `ThemeColorKey`s must appear exactly once (SC-001).
2. **No invented tokens** — no row may name a key or property absent from the 25-token set.
3. **Values match `defaultTheme`** — the default-value column is derived from
   `defaultTheme.colors` (itself generated from `$semantic-colors` in `_semantic.scss`), so it
   cannot drift; the verification record spot-checks it (FR-002).
4. **Deterministic order** — rows follow the `THEME_COLOR_KEYS` order (the authoritative order in
   `packages/react/src/theme/tokens.ts`).

## Sync enforcement

- `pnpm lint:tokens` (058 [`token-sync.md`](../../058-theme-token-types/contracts/token-sync.md))
  already fails if the TS key set and the SCSS token set drift; a token added to/removed from the
  theme but missing from this reference is a defect (spec edge case) and is caught by the
  verification record's table-vs-`defaultTheme` comparison.

## Relationship to other contracts

- Key set, mapping, and types: 058 [`theme-types.md`](../../058-theme-token-types/contracts/theme-types.md).
- Default values: 059 [`default-theme.md`](../../059-default-theme-create-theme/contracts/default-theme.md).
- How to use the tokens: [`consumer-guide.md`](./consumer-guide.md).
