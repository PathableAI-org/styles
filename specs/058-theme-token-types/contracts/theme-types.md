# Interface Contract: Theme Types and Mapping Function

Module: `@pathableai/react` → `packages/react/src/theme/`

## `THEME_COLOR_KEYS`

```ts
export const THEME_COLOR_KEYS = [
  'bg', 'surface', 'text', 'textMuted', 'border', 'link', 'accent', 'focusRing',
  'danger', 'success', 'textSuccess',
  'actionPrimaryBg', 'actionPrimaryText', 'actionSecondaryBg', 'actionSecondaryText',
  'statusSuccessBg', 'statusSuccessText', 'statusWarningBg', 'statusWarningText',
  'statusDangerBg', 'statusDangerText',
  'workflowActive', 'workflowComplete', 'workflowBlocked', 'onAccent',
] as const
```

- Runtime, `readonly`, single source of truth for the key set.
- Exactly 25 distinct single-quoted string literals.
- Each entry is the camelCase form of one `--pathable-color-*` token in
  `packages/styles/src/_semantic.scss`.

## `ThemeColorKey`

```ts
export type ThemeColorKey = (typeof THEME_COLOR_KEYS)[number]
```

## `ThemeColors`

```ts
export type ThemeColors = { [K in ThemeColorKey]: string }
```

- Flat: 25 string-valued keys.
- Autocomplete-exposes all 25 keys; rejects unknown keys on object literals.
- `Partial<ThemeColors>` is the documented partial-override shape.

## `ThemeConfig`

```ts
export interface ThemeConfig {
  colors: ThemeColors
}
```

- Extensible: future categories are added as sibling fields; `colors` is stable.

## `themeColorToken`

```ts
export function themeColorToken(value?: string | null): string | undefined
```

- **Preconditions**: none — accepts any string, `null`, or `undefined`.
- **Postconditions**:
  - `value` is one of the 25 `THEME_COLOR_KEYS` → returns the full
    `--pathable-color-*` CSS custom property name.
  - `value` is `null` or `undefined` → returns `undefined`.
  - `value` is an unrecognized string → returns `undefined`.
  - Never throws; never returns a malformed property name.
- **Properties**: pure (no side effects), deterministic, no DOM/browser globals,
  environment-independent (safe for SSR).

### Examples

| Input | Output |
| ----- | ------ |
| `'actionPrimaryBg'` | `'--pathable-color-action-primary-bg'` |
| `'textSuccess'` | `'--pathable-color-text-success'` |
| `'onAccent'` | `'--pathable-color-on-accent'` |
| `'bg'` | `'--pathable-color-bg'` |
| `'accentColour'` | `undefined` |
| `null` | `undefined` |
| `undefined` | `undefined` |

The full 25-entry mapping table is recorded in [`../data-model.md`](../data-model.md).
