---
'@pathableai/styles': patch
---

In browsers that support `appearance: base-select`, a single `.pathable-select` now draws its arrow with `::picker-icon` and the opened list uses the browser's base-select picker. Other browsers are unchanged. This fixes axe reporting colour contrast as incomplete on the select.
