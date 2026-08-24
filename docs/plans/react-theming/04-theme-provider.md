# 04 — ThemeProvider

Status: NOT STARTED

## Parent Plan

[../react-theming.md](../react-theming.md) — Target state § "ThemeProvider Component"; Transition Plan Phase 1

## Scope

Implement `ThemeProvider`, a React component that accepts a `ThemeConfig` and emits the resolved color tokens as CSS custom properties on a wrapper element's inline `style`, scoping the theme to its subtree. This is the runtime piece that makes typed, partial theme overrides actually render — and it gives scoping (and multi-theme/nesting) for free because it works at the CSS cascade level rather than mutating `:root`.

## Includes

- Implement a `ThemeProvider` component exported from `@pathableai/react`.
- Accept a `theme` prop of type `ThemeConfig` (from [02](./02-theme-token-types.md)).
- Accept an optional `as` prop to configure the wrapper element (default `div`), and forward any extra native props.
- Emit every resolved `--pathable-color-*` custom property on the wrapper's inline `style` (via the mapping from [02](./02-theme-token-types.md)).
- Accept an optional `colorScheme` prop (`'light' | 'dark'`) as the hook for runtime switching; in this feature it selects a consumer-provided dark `ThemeConfig` field (or is a documented no-op if dark tokens are not yet modeled).
- Render **no wrapper element** when the resolved theme deep-equals `defaultTheme` (preserve existing DOM structure for the default path).
- Support nesting: an inner `ThemeProvider` wins for the properties it declares, with fallthrough to outer providers and ultimately `:root`.
- Ensure server-renderable output (inline `style` is fully serializable; no browser globals, no layout effect required).
- Unit-test: emitted custom properties, scoping (properties on the wrapper only), no-wrapper-when-default, nesting precedence, `as`/ref behavior, and absence of extra DOM nodes for the default path.
- Add Storybook stories: default (no provider), a partial override (`accent` + `actionPrimaryBg`), and a nested branded-section example.

## Excludes

- Runtime CSS-in-JS (the inline `style` on a wrapper is the mechanism, not a styled-components/Emotion engine).
- Token categories beyond `colors`.
- Auto-generating dark-mode tokens from light-mode tokens.
- Changing how components resolve tokens — components continue to reference `var(--pathable-*)` through their SCSS-owned classes; this feature only changes what those variables resolve to within the subtree.

## Dependencies

- [02 — Theme Token Types and Vocabulary](./02-theme-token-types.md)
- [03 — Default Theme and createTheme](./03-default-theme-create-theme.md)

## DONE Means

- `ThemeProvider` is exported from `@pathableai/react`.
- `<ThemeProvider theme={createTheme({ colors: { accent: '#7c3aed' } })}>` renders children inside a wrapper whose inline `style` declares `--pathable-color-accent: #7c3aed` and all other tokens at defaults.
- Overrides are scoped: components inside the subtree resolve the overridden value; components outside resolve the `:root` default.
- Passing `defaultTheme` (or an equivalent full theme) renders children with **no** wrapper element.
- Nesting works: the innermost provider's values win.
- Server/client output is identical.
- Unit tests and Storybook stories pass; CI passes.
