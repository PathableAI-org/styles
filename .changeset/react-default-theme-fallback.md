---
'@pathableai/react': patch
---

Load the default theme token layer automatically so components have complete fallback styling without a separate `@pathableai/styles` import. Scoped `ThemeProvider` values continue to override the defaults.

When upgrading from `0.0.4`, remove stylesheet imports added to restore that version's omitted defaults. Application-owned global token overrides must load after the package defaults; use `ThemeProvider` for order-independent scoped overrides.
