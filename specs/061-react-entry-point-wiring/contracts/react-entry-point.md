# Interface Contract: `@pathableai/react` Entry Point

Module: `@pathableai/react` → `packages/react/src/index.ts`, built by `vite build` into
`dist/index.js` and typed by `dist/index.d.ts`.

## Side-effect imports (the contract this feature changes)

The package's public entry point performs exactly these stylesheet side-effect imports:

```ts
import '@pathableai/styles/components'
import '@pathableai/styles/utilities'
```

It **must not** import `@pathableai/styles` (the default `.` root, which includes the `:root`
default theme token layer) or `@pathableai/styles/theme` as a side effect.

## Preconditions

- `@pathableai/styles` is a runtime dependency (`workspace:*` at development time; a published
  version at install time).
- The `@pathableai/styles` package `exports` map provides `./components` and `./utilities` (owned by
  `packages/styles`; feature 057).

## Behavior

- Importing `@pathableai/react` loads the compiled structural stylesheets (component wrappers +
  utilities) through the styles package's public subpaths.
- Importing `@pathableai/react` does **not** load the default theme token layer; consumers who want
  default tokens must import `@pathableai/styles` or `@pathableai/styles/theme` at the application
  boundary.
- The package's exported API (theme vocabulary, `defaultTheme`/`createTheme`, `ThemeProvider`,
  components, and their types) is unchanged by this feature.

## Postconditions

- A consumer who imports only `@pathableai/react` and wraps their app in `ThemeProvider` renders
  with only provider-supplied tokens — no package-provided default tokens interleave.
- A consumer who imports `@pathableai/react` **and** `import '@pathableai/styles'` (or
  `import '@pathableai/styles/theme'`) renders identically to today (full default token layer).
- A consumer who imports only `@pathableai/react` and no stylesheet receives structural styles but
  no default tokens (the documented breaking change).

## Build contract (Vite)

The library build (`packages/react/vite.config.ts`) externalizes `@pathableai/styles` and all its
subpaths (`/^@pathableai\/styles(\/|$)/`), so `dist/index.js` preserves the two side-effect imports
as runtime imports and does not bundle the compiled CSS into the React package.

## Examples

```ts
// Provider-driven (Story 1): no default theme import needed.
import { ThemeProvider, createTheme } from '@pathableai/react'
const brand = createTheme({ colors: { accent: '#7c3aed' } })
// <ThemeProvider theme={brand}>…</ThemeProvider>

// Default path (Story 2): unchanged.
import '@pathableai/styles'
import { Button } from '@pathableai/react'

// Theme-subpath path (Story 3): unchanged.
import '@pathableai/styles/theme'
import { Button } from '@pathableai/react'
```

## Relationship to other contracts

- The styles subpath mapping (what `./components`, `./utilities`, `.`, and `./theme` resolve to):
  [`styles-subpaths.md`](./styles-subpaths.md).
- The `ThemeProvider` component contract: feature 060
  [`contracts/theme-provider.md`](../../060-theme-provider/contracts/theme-provider.md).
