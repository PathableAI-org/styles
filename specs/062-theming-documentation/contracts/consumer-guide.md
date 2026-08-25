# Interface Contract: Consumer Guide

Artifact: `docs/theming/consumer-guide.md` (canonical source for "how to override, extend, and
choose a path"). This is the primary "how to use it" artifact for consumers.

## Purpose

Guide a developer to (a) override a few colors with `createTheme` + `ThemeProvider`, (b) extend
`defaultTheme` directly, and (c) choose between the default stylesheet import and the provider-driven
path (spec FR-003/FR-004/FR-005).

## Required sections

The guide MUST contain exactly these three scenarios, in this order, with no hand-written CSS in
any of them:

### 1. Override a few colors (`createTheme` + `ThemeProvider`) — FR-003

```tsx
import { ThemeProvider, createTheme } from '@pathableai/react'

const brand = createTheme({ colors: { accent: '#7c3aed', actionPrimaryBg: '#7c3aed' } })

<ThemeProvider theme={brand}>
  <AppShell>…</AppShell>
</ThemeProvider>
```

Must state: `createTheme` deep-merges the partial with `defaultTheme` and returns a complete
`ThemeConfig`; unspecified tokens fall through to defaults; no CSS is hand-written.

### 2. Extend `defaultTheme` directly — FR-004

```ts
import { defaultTheme } from '@pathableai/react'

const myTheme = {
  ...defaultTheme,
  colors: { ...defaultTheme.colors, accent: '#7c3aed' },
}
```

Must state: this starts from the full default object and overrides individual keys; it is the
spread-based alternative to `createTheme` when the consumer wants to own the whole object.

### 3. Choose between the default import and the provider-driven path — FR-005

Must present the three supported stylesheet-import paths (already documented in
`packages/react/README.md`) and the trade-off:

| Path | Import | Default tokens | When to use |
| ---- | ------ | -------------- | ----------- |
| Default | `import '@pathableai/styles'` | yes | No theming; unchanged legacy behavior |
| Theme subpath | `import '@pathableai/styles/theme'` | yes | Explicit default-token import at the boundary |
| Provider-driven | none (tokens via `ThemeProvider`) | no | Scoped/runtime overrides; no cascade fight |

The guide MUST reference, not duplicate, the runtime API contracts: `createTheme`/`defaultTheme`
(059), `ThemeProvider` (060), and the stylesheet subpaths (061).

## Invariants

- No hand-written CSS appears in any example (FR-003).
- Every example uses only exported, already-published APIs; the guide must not imply a private or
  future API.
- The guide links to the vocabulary reference for the full token list (single source per fact).

## Relationship to other contracts

- Token list: [`token-vocabulary.md`](./token-vocabulary.md).
- Runtime APIs: 059 [`create-theme.md`](../../059-default-theme-create-theme/contracts/create-theme.md),
  060 [`theme-provider.md`](../../060-theme-provider/contracts/theme-provider.md),
  061 [`styles-subpaths.md`](../../061-react-entry-point-wiring/contracts/styles-subpaths.md).
