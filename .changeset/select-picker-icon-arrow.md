---
'@pathableai/styles': patch
---

In browsers that support `appearance: base-select`, a single `pathable-select`
now draws its arrow with `::picker-icon`, so automated colour-contrast checks no
longer report the select as incomplete. The arrow looks the same, and the opened
list is still the browser's own.
