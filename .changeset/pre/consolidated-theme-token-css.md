---
'@pathableai/styles': patch
---

Consolidate all `--pathable-color-*` declarations into a single `:root` block,
split the compiled stylesheet into `components.css`, `utilities.css`, and
`theme-default.css`, and expose `./components`, `./utilities`, and `./theme`
subpath exports so consumers can import component styles without also importing
the default theme tokens.
