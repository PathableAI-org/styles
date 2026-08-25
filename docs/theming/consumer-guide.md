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

## 3. Choose between the default import and the provider-driven path

`@pathableai/styles` ships three stylesheet-import paths. Pick based on whether
you want the default token layer and whether you need scoped, runtime overrides:

| Path            | Import                                  | Default tokens | When to use                                        |
| --------------- | --------------------------------------- | -------------- | -------------------------------------------------- |
| Default         | `import '@pathableai/styles'`           | yes            | No theming; unchanged legacy behavior.             |
| Theme subpath   | `import '@pathableai/styles/theme'`     | yes            | Explicit default-token import at the boundary.     |
| Provider-driven | none — tokens come from `ThemeProvider` | no             | Scoped or runtime overrides with no cascade fight. |

For the provider-driven path, import only the React package — its entry point
already loads the structural stylesheet layers (component wrappers and
utilities) without the default token layer:

```tsx
import { ThemeProvider, createTheme } from '@pathableai/react'

const brand = createTheme({ colors: { accent: '#7c3aed' } })
```

For the default and theme-subpath paths, import the styles package at the
boundary alongside the React components:

```tsx
import '@pathableai/styles'
import { Button } from '@pathableai/react'
```

The runtime contracts behind these APIs live under `specs/`:

- `createTheme` / `defaultTheme`: `specs/059-default-theme-create-theme/contracts/`
- `ThemeProvider`: `specs/060-theme-provider/contracts/theme-provider.md`
- Stylesheet subpaths: `specs/061-react-entry-point-wiring/contracts/styles-subpaths.md`
