---
'@pathableai/react': patch
---

Load the default theme token layer automatically so React components have complete fallback styling without a separate `@pathableai/styles` import. The defaults use zero selector specificity so application-owned `:root` tokens and scoped `ThemeProvider` values override them regardless of stylesheet order.

When upgrading `@pathableai/react` from `0.0.4`, remove stylesheet imports added to restore that version's omitted defaults. Use `ThemeProvider` for scoped runtime overrides or application-owned `:root` declarations for global overrides.
