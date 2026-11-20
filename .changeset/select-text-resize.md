---
'@pathableai/styles': patch
---

Let a single `.pathable-select` wrap its selected value and grow in height instead of cutting the value off when the text size is increased on a narrow screen (WCAG 1.4.4). Chromium wraps the value; Firefox keeps it on one line, so a long value can still be cut off there at 200% text (tracked in a follow-up issue), and WebKit has not been checked. Forced-colors mode and a `multiple` select keep their previous sizing. A select that is a direct flex or grid item now stretches to the row's height like other controls unless the container or the select sets `align-self`; inside a `.pathable-form-row` it keeps its own height.
