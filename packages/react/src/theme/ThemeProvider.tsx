import React, { forwardRef } from 'react'
import type { ElementType, ReactNode } from 'react'
import { defaultTheme } from './defaultTheme.js'
import { THEME_COLOR_KEYS, THEME_COLOR_TOKEN_MAP } from './tokens.js'
import type { ThemeConfig } from './tokens.js'

/**
 * Forward-compatible color-scheme hook for future dark-mode support.
 * Accepted without error; treated as a documented no-op in this release.
 */
export type ColorScheme = 'light' | 'dark'

export interface ThemeProviderProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'color'
> {
  /**
   * A complete, resolved `ThemeConfig` (produced by `createTheme`).
   * Defaults to `defaultTheme`. When the resolved theme.colors
   * equals `defaultTheme.colors`, no wrapper element is rendered.
   */
  theme?: ThemeConfig
  /**
   * Forward-compatible color-scheme hook. Accepted and ignored in this
   * release — both `'light'` and `'dark'` produce identical output.
   */
  colorScheme?: ColorScheme
  /** Polymorphic element type. Defaults to `'div'`. */
  as?: ElementType
  children?: ReactNode
}

function ThemeProviderInner(
  {
    theme = defaultTheme,
    colorScheme: _colorScheme,
    as,
    children,
    ...rest
  }: ThemeProviderProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const isDefault = THEME_COLOR_KEYS.every(
    (key) =>
      theme.colors[key] ===
      (defaultTheme.colors as Record<string, string>)[key],
  )

  // No-wrapper path: no element, no ref attachment.
  if (isDefault) return children as React.ReactElement | null

  const cssVars: Record<string, string> = {}
  for (const key of THEME_COLOR_KEYS) {
    cssVars[THEME_COLOR_TOKEN_MAP[key]] = theme.colors[key]
  }

  const Component = (as ?? 'div') as React.ElementType

  return (
    <Component ref={ref} style={cssVars as React.CSSProperties} {...rest}>
      {children}
    </Component>
  )
}

export const ThemeProvider = forwardRef<HTMLElement, ThemeProviderProps>(
  ThemeProviderInner,
)
