import { defaultTheme } from './defaultTheme.js'
import { isValidCssColor } from './color.js'
import { THEME_COLOR_KEYS } from './tokens.js'
import type { ThemeConfig, ThemeColors } from './tokens.js'

/**
 * Recursively makes every key optional. Co-located with `createTheme`, its only
 * consumer.
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

function describeType(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'function') return 'function'
  return typeof value
}

/**
 * Deep-merges `override` over `base` into a fresh object without mutating
 * either operand. Object-valued entries recurse; non-plain-object values
 * resolve to the override.
 */
function deepMerge(base: unknown, override: unknown): unknown {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override
  }
  const result: Record<string, unknown> = { ...base }
  for (const key of Object.keys(override)) {
    const baseValue = result[key]
    const overrideValue = override[key]
    result[key] =
      isPlainObject(baseValue) && isPlainObject(overrideValue)
        ? deepMerge(baseValue, overrideValue)
        : overrideValue
  }
  return result
}

/**
 * Builds a complete `ThemeConfig` by deep-merging a partial theme over the
 * canonical `defaultTheme`, then validating that every required token is
 * present and every value is a valid CSS color string. Throws a descriptive
 * `Error` naming the offending token on failure. Pure and non-mutating.
 */
export function createTheme(input: DeepPartial<ThemeConfig>): ThemeConfig {
  if (!isPlainObject(input)) {
    throw new Error(
      `createTheme: expected a plain object, received ${describeType(input)}`,
    )
  }

  const merged = deepMerge(defaultTheme, input) as { colors?: unknown }
  const colors: Record<string, unknown> = isPlainObject(merged.colors)
    ? { ...merged.colors }
    : {}

  for (const key of THEME_COLOR_KEYS) {
    const value = colors[key]
    if (value === undefined || value === null) {
      throw new Error(`createTheme: missing required color token "${key}"`)
    }
    if (!isValidCssColor(value)) {
      throw new Error(
        `createTheme: invalid color value for "${key}": ${String(value)}`,
      )
    }
  }

  return { colors: colors as ThemeColors }
}
