---
'@pathableai/react': patch
---

Change the package entry point to import only the structural style layers (`@pathableai/styles/components` and `@pathableai/styles/utilities`) instead of the full default theme token layer.

- Consumers who provide their own tokens via `ThemeProvider` no longer import the default token layer, so their tokens are not overridden by a package stylesheet.
- **Breaking change**: consumers who relied on `@pathableai/react`'s implicit side-effect import of `@pathableai/styles` must now add `import '@pathableai/styles'` (or `import '@pathableai/styles/theme'`) at the application boundary to keep the default token layer.
