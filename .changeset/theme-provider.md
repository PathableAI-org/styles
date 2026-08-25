---
'@pathableai/react': patch
---

Add `ThemeProvider` component, `ThemeProviderProps`, and `ColorScheme` types.

- `ThemeProvider` accepts an optional `theme?: ThemeConfig` (defaults to `defaultTheme`) and an optional `colorScheme` hook, plus optional `as` prop (defaults to `div`) for the wrapper element.
- Renders a wrapper element with every resolved `--pathable-color-*` CSS custom property applied as inline `style`.
- Suppresses the wrapper element when the provided theme deep-equals `defaultTheme`.
- Supports nesting; an inner `ThemeProvider` overrides its ancestor's resolved tokens.
- New public exports: `ColorScheme` and `ThemeProviderProps` types.
