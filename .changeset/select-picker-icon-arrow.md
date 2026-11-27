---
'@pathableai/styles': patch
---

In browsers that support `appearance: base-select`, a single `.pathable-select` now draws its arrow with `::picker-icon`, with the same look as before. The opened list is still the browser's own, and other browsers are unchanged. This fixes axe reporting colour contrast as incomplete on the select.
