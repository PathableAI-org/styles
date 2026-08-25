# Data Model: React Entry Point Wiring

This feature is a module-entry/import change with **no runtime data entities**. There is no state,
persistence, lifecycle, or transition to model — the change re-points which compiled CSS layers the
`@pathableai/react` package imports as side effects. The only durable domain facts are the
consumer-path combinations and the stylesheet-subpath → compiled-file mapping that consumers rely
on. They are recorded here as the feature's domain facts (constitution "Architecture SSOT") and are
also expressed as contracts in [`contracts/`](./contracts/).

## Domain facts (no entities)

### 1. Stylesheet subpath mapping

The `@pathableai/styles` package `exports` map resolves each public subpath to a compiled file:

| Public import                     | Resolves to                | Layer content                                                             |
| --------------------------------- | -------------------------- | ------------------------------------------------------------------------- |
| `@pathableai/styles`              | `dist/styles.css`          | Full stylesheet: tokens + utilities + component wrappers + layout grid    |
| `@pathableai/styles/components`   | `dist/components.css`      | Fonts + component wrappers + USWDS layout grid (no `:root` tokens)        |
| `@pathableai/styles/utilities`    | `dist/utilities.css`       | Utility classes (no `:root` tokens)                                       |
| `@pathableai/styles/theme`        | `dist/theme-default.css`   | Default `:root` token declarations                                        |

This mapping is owned by `packages/styles` (feature 057) and is unchanged by this feature.

### 2. Consumer paths

Three supported ways a consumer combines `@pathableai/react` with stylesheet imports:

| Path            | Stylesheet imports by the consumer                          | Default tokens | Notes                                                                  |
| --------------- | ----------------------------------------------------------- | -------------- | ---------------------------------------------------------------------- |
| Default         | `import '@pathableai/styles'`                               | Yes            | Full default token layer; unchanged behavior (FR-003)                  |
| Theme-subpath   | `import '@pathableai/styles/theme'`                         | Yes            | Default tokens via the theme subpath; unchanged behavior (FR-004)      |
| Provider-driven | none (tokens via `ThemeProvider`)                           | No             | Structural styles auto-load; tokens supplied at runtime (FR-002)       |

Before the change, the React package implicitly imported the default token layer, so the
"provider-driven" path also received default tokens and required cascade overrides. After the
change, the React package imports only `components` + `utilities`, so the provider-driven path is
clean and the default/theme paths are unchanged (they already import at the application boundary).

## State transitions

None — the change is static module-graph rewiring; there is no runtime state, mutation, or
lifecycle.

## Validation rules summary

| Rule | Enforcement |
| ---- | ----------- |
| React entry imports only `./components` + `./utilities` | source review + `vite build` output inspection (`dist/index.js` begins with the two side-effect imports) |
| No default token layer imported by the React package | absence of `import '@pathableai/styles'` (root) in `dist/index.js` |
| Structural subpaths resolve in the published package | `attw --pack`, `publint --pack false`, `test-next-consumer.mjs` |
| Default/theme paths render identically | existing Storybook fixtures + contract gates (`test:storybook-react`) |
| Provider-driven path uses only provider tokens | `ThemeProvider` unit tests (feature 060) + render assertion |
| Token vocabulary unchanged | `pnpm lint:tokens` |
