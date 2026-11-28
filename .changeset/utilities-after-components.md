---
'@pathableai/styles': patch
---

In `styles.css`, `pathable-*` utility classes now come after the component
rules, so a utility such as `pathable-display-none` or
`tablet:pathable-display-flex` overrides a component class that sets the same
property. Before, an element like `pathable-checkbox`, `pathable-button` or
`pathable-label` kept its own `display`.
