# Data Model: Theme Token Types and Vocabulary

This document describes the domain entities introduced by the feature and their
relationships. The design is type-only plus one pure function; there is no runtime state,
persistence, or lifecycle.

## Entities

### 1. `ThemeColorKey`

- **Kind**: Type-level union of 25 string literals.
- **Definition**: `type ThemeColorKey = (typeof THEME_COLOR_KEYS)[number]`, derived from the
  runtime constant `THEME_COLOR_KEYS` (a `readonly` `as const` string array). The array is the
  single source of truth for the key set.
- **Invariants**:
  - Exactly 25 distinct members.
  - Each member is camelCase and maps 1:1 to one `--pathable-color-*` token in
    `packages/styles/src/_semantic.scss`.
- **Relationship**: `ThemeColors` keys are exactly `ThemeColorKey`.

### 2. `ThemeColors`

- **Kind**: Mapped type over `ThemeColorKey`.
- **Definition**: `type ThemeColors = { [K in ThemeColorKey]: string }`.
- **Fields**: One field per key; each value is a `string` (a CSS color value; no format
  validation is applied at this layer).
- **Validation rules** (compile-time, enforced by the mapped type + excess-property checks):
  - A key outside the 25-key set is rejected.
  - Every key is required (a `Partial<ThemeColors>` is the documented override shape).
- **Relationship**: `ThemeConfig.colors: ThemeColors`.

### 3. `ThemeConfig`

- **Kind**: Literal interface.
- **Definition**: `interface ThemeConfig { colors: ThemeColors }`.
- **Fields**:
  - `colors: ThemeColors` — required.
- **Extensibility**: Future token categories (typography, spacing) are added as *sibling*
  optional/required fields; `colors` remains unchanged, so no breaking change (FR-002).

### 4. Theme color token mapping (the camelCase → kebab-case bridge)

- **Kind**: Pure, deterministic, documented 1:1 relationship between a `ThemeColorKey`
  (camelCase) and a `--pathable-color-*` CSS custom property name (kebab-case with the
  `--pathable-color-` prefix).
- **Algorithm**: each uppercase letter denotes a word boundary prefixed with a hyphen, then
  lowercased; the result is prefixed with `--pathable-color-`.
- **Representation**: `THEME_COLOR_TOKEN_MAP: Record<ThemeColorKey, string>` derived once from
  `THEME_COLOR_KEYS`; exposed through `themeColorToken(value?: string | null): string | undefined`.
- **Invariants**:
  - Bijective over the 25 keys (each key → exactly one name; each name ← exactly one key).
  - `themeColorToken(null)` / `themeColorToken(undefined)` / unknown strings → `undefined`
    (never throws, never emits a malformed name).

### 5. Tone types (`TextTone`, `SurfaceTone`, `BorderTone`)

- **Kind**: Existing union string-literal types in
  `packages/react/src/internal/resolvers/tone.ts`; this feature makes them public.
- **Values**:
  - `TextTone = 'default' | 'muted' | 'danger' | 'success'`
  - `SurfaceTone = 'default' | 'subtle' | 'primary'`
  - `BorderTone = 'default' | 'danger'`
- **Relationship**: Independent of `ThemeColors`; shared vocabulary between component props and
  theme configuration.

### 6. `SurfaceElevation`

- **Kind**: Existing union string-literal type in
  `packages/react/src/internal/resolvers/surface.ts` (`keyof typeof SURFACE_ELEVATION_MAP`).
- **Values**: `'sm' | 'md' | 'lg' | 'xl'`.
- **Relationship**: Independent of `ThemeColors`; this feature makes it public.

## Canonical mapping table

The 25 entries are the complete contract. The SCSS source of truth is the `$semantic-colors`
map and `:root` block in `packages/styles/src/_semantic.scss`; the table below records the
fixed correspondence.

| # | `ThemeColorKey` (camelCase) | kebab segment | CSS custom property |
|---|---|---|---|
| 1 | `bg` | `bg` | `--pathable-color-bg` |
| 2 | `surface` | `surface` | `--pathable-color-surface` |
| 3 | `text` | `text` | `--pathable-color-text` |
| 4 | `textMuted` | `text-muted` | `--pathable-color-text-muted` |
| 5 | `border` | `border` | `--pathable-color-border` |
| 6 | `link` | `link` | `--pathable-color-link` |
| 7 | `accent` | `accent` | `--pathable-color-accent` |
| 8 | `focusRing` | `focus-ring` | `--pathable-color-focus-ring` |
| 9 | `danger` | `danger` | `--pathable-color-danger` |
| 10 | `success` | `success` | `--pathable-color-success` |
| 11 | `textSuccess` | `text-success` | `--pathable-color-text-success` |
| 12 | `actionPrimaryBg` | `action-primary-bg` | `--pathable-color-action-primary-bg` |
| 13 | `actionPrimaryText` | `action-primary-text` | `--pathable-color-action-primary-text` |
| 14 | `actionSecondaryBg` | `action-secondary-bg` | `--pathable-color-action-secondary-bg` |
| 15 | `actionSecondaryText` | `action-secondary-text` | `--pathable-color-action-secondary-text` |
| 16 | `statusSuccessBg` | `status-success-bg` | `--pathable-color-status-success-bg` |
| 17 | `statusSuccessText` | `status-success-text` | `--pathable-color-status-success-text` |
| 18 | `statusWarningBg` | `status-warning-bg` | `--pathable-color-status-warning-bg` |
| 19 | `statusWarningText` | `status-warning-text` | `--pathable-color-status-warning-text` |
| 20 | `statusDangerBg` | `status-danger-bg` | `--pathable-color-status-danger-bg` |
| 21 | `statusDangerText` | `status-danger-text` | `--pathable-color-status-danger-text` |
| 22 | `workflowActive` | `workflow-active` | `--pathable-color-workflow-active` |
| 23 | `workflowComplete` | `workflow-complete` | `--pathable-color-workflow-complete` |
| 24 | `workflowBlocked` | `workflow-blocked` | `--pathable-color-workflow-blocked` |
| 25 | `onAccent` | `on-accent` | `--pathable-color-on-accent` |

## State transitions

None — no runtime state, mutations, or lifecycle events.

## Validation rules summary

| Rule | Enforcement |
| ---- | ----------- |
| 25-key set matches `$semantic-colors` | Sync check (`checkThemeTokenSync`) at `pnpm lint:tokens` |
| Unknown key rejected at compile time | Mapped type + excess-property checks (`tsc`) |
| Nullish/unknown runtime input → `undefined` | `themeColorToken` validation (`vitest`) |
| Every valid key → exactly one property name | `THEME_COLOR_TOKEN_MAP` construction + unit tests |
| Tone/elevation unions unchanged | Re-export only (no redefinition) |
