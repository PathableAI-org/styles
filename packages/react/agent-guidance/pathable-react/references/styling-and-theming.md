# Styling and theming

## Use the built-in fallback

The React entry point loads default theme tokens plus structural component and
utility styles. Do not add a separate `@pathableai/styles` stylesheet import in
an application that imports `@pathableai/react`.

- For a custom scoped theme, create it with `createTheme` and render the
  affected subtree inside `ThemeProvider`.
- Provider values are inline custom properties, so they override the root
  defaults while content outside the provider retains the fallback theme.
- Import `@pathableai/styles` subpaths directly only in CSS-only consumers that
  do not import the React package.

Do not import private stylesheet paths.

```tsx
import type { ReactNode } from 'react'
import { ThemeProvider, createTheme } from '@pathableai/react'

const theme = createTheme({ colors: { accent: '#7c3aed' } })

export function BrandedArea({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
```

## Prefer semantic APIs

- Prefer component props for tone, surface, border, elevation, width, spacing,
  and layout when the installed type exposes them.
- Use semantic theme keys such as `accent`, `surface`, and `textMuted`. Do not
  invent visual aliases such as `prettyBlue` or redeclare the package's
  `--pathable-color-*` variables on `:root`.
- Do not hardcode brand colors or typography when an existing semantic token
  expresses the intent.
- Preserve accessible contrast when customizing a theme. Generated color sets
  require human review before they are treated as official brand themes.

## Extend deliberately

Components add their required `pathable-*` classes. Do not repeat those base
classes or invent component modifiers.

Use `className` for application-specific styling or a shipped utility only when
the component has no suitable semantic prop. Consumer classes are appended to
the component's classes; they must not replace or undermine required behavior,
semantics, or focus styling.
