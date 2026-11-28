---
'@pathableai/styles': patch
---

In `styles.css`, utility classes now come after the component rules, so a
utility such as `display-none` or `tablet:display-flex` overrides a component class that sets the same
property. Before, an element like `pathable-checkbox`, `pathable-button` or
`pathable-label` kept its own `display`.
