# Styling and theming

## Choose one token strategy

The React entry point loads structural component and utility styles. It does
not load default theme tokens.

- For the shipped default colors, import `@pathableai/styles` or
  `@pathableai/styles/theme` once at the application boundary.
- For a custom scoped theme, create it with `createTheme` and render the
  affected subtree inside `ThemeProvider`.
- Rely on structural styles alone only when another application-owned layer
  supplies the complete required token contract.

Do not import private stylesheet paths.

```tsx
import '@pathableai/styles/theme'
import { Button } from '@pathableai/react'
```

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
