/**
 * Theme color vocabulary — the typed surface of the `--pathable-color-*` CSS
 * custom properties emitted by `@pathableai/styles` `_semantic.scss`. The
 * styles package's `$semantic-colors` map remains the authoritative token
 * list; `checkThemeTokenSync` in `packages/styles/scripts/lint-tokens.mjs`
 * keeps this key set in lockstep with it.
 *
 * @see specs/058-theme-token-types/contracts/theme-types.md
 */

export const THEME_COLOR_KEYS = [
  'bg',
  'surface',
  'text',
  'textMuted',
  'border',
  'link',
  'accent',
  'focusRing',
  'danger',
  'success',
  'textSuccess',
  'actionPrimaryBg',
  'actionPrimaryText',
  'actionSecondaryBg',
  'actionSecondaryText',
  'statusSuccessBg',
  'statusSuccessText',
  'statusWarningBg',
  'statusWarningText',
  'statusDangerBg',
  'statusDangerText',
  'workflowActive',
  'workflowComplete',
  'workflowBlocked',
  'onAccent',
] as const

export type ThemeColorKey = (typeof THEME_COLOR_KEYS)[number]

/** The complete set of overridable semantic color tokens. */
export type ThemeColors = { [K in ThemeColorKey]: string }

export interface ThemeConfig {
  colors: ThemeColors
}

function camelToKebab(value: string): string {
  return value.replace(/[A-Z]/g, (ch) => '-' + ch.toLowerCase())
}

export const THEME_COLOR_TOKEN_MAP = Object.fromEntries(
  THEME_COLOR_KEYS.map((key) => [key, `--pathable-color-${camelToKebab(key)}`]),
) as Record<ThemeColorKey, string>

/**
 * Pure resolver mapping a `ThemeColorKey` to its `--pathable-color-*` CSS
 * custom property name. Returns undefined for null / undefined / unknown
 * values (runtime fallback). No browser globals; deterministic output.
 */
export function themeColorToken(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (THEME_COLOR_TOKEN_MAP as Record<string, string | undefined>)[value]
}
