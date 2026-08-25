---
'@pathableai/react': patch
---

Add `defaultTheme` export and `createTheme` factory for typed theming.

- `defaultTheme`: a complete ThemeConfig constant with the 25 default semantic color token values matching the CSS custom properties.
- `createTheme(input)`: accepts a partial ThemeConfig, deep-merges with defaultTheme, validates all required tokens and color values, and returns a fully resolved ThemeConfig.
