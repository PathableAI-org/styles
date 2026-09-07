# Theming consumer guide

This guide covers the three ways to customize colors in `@pathableai/react`.
It assumes the runtime API already exists; the full list of overridable tokens
is in the [token vocabulary reference](./token-vocabulary.md).

## 1. Override a few colors with `createTheme` + `ThemeProvider`

Use `createTheme` to resolve a partial override into a complete theme, then
scope it to a subtree with `ThemeProvider`:

```tsx
import { ThemeProvider, createTheme } from '@pathableai/react'

const brand = createTheme({
  colors: { accent: '#7c3aed', actionPrimaryBg: '#7c3aed' },
})

;<ThemeProvider theme={brand}>
  <AppShell>…</AppShell>
</ThemeProvider>
```

`createTheme` deep-merges the partial with `defaultTheme` and returns a complete
`ThemeConfig`. The two tokens you name are overridden; every other token falls
through to the Pathable default. No CSS is written by hand — the provider emits
the resolved `--pathable-color-*` values and the existing components consume
them.

## 2. Extend `defaultTheme` directly

When you want to own the whole theme object, start from `defaultTheme` and
override individual keys with a spread:

```ts
import { defaultTheme } from '@pathableai/react'

const myTheme = {
  ...defaultTheme,
  colors: { ...defaultTheme.colors, accent: '#7c3aed' },
}
```

This is the spread-based alternative to `createTheme`: it starts from the full
default object and replaces only the keys you name. Both paths produce the same
kind of complete, resolved `ThemeConfig`.

## 3. Use automatic defaults and provider overrides

Importing `@pathableai/react` automatically loads the default token layer and
the structural component and utility styles. No separate stylesheet import is
needed:

```tsx
import { Button } from '@pathableai/react'
```

Use `ThemeProvider` for scoped or runtime overrides. The provider emits inline
custom properties, so its values override the root defaults without requiring
stylesheet ordering or hand-written CSS:

```tsx
import { ThemeProvider, createTheme } from '@pathableai/react'

const brand = createTheme({ colors: { accent: '#7c3aed' } })
```

The `@pathableai/styles` root, theme, component, and utility imports remain
available to CSS-only consumers. Applications importing `@pathableai/react`
should not add those imports separately because React already loads each layer.

The runtime contracts behind these APIs live under `specs/`:

- `createTheme` / `defaultTheme`: `specs/059-default-theme-create-theme/contracts/`
- `ThemeProvider`: `specs/060-theme-provider/contracts/theme-provider.md`
- Stylesheet subpaths: `specs/061-react-entry-point-wiring/contracts/styles-subpaths.md`
