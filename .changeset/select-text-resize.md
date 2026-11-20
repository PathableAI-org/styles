---
'@pathableai/styles': patch
---

Let a single `.pathable-select` wrap its selected value and grow in height instead of cutting the value off when the text size is increased on a narrow screen (WCAG 1.4.4). Chromium wraps the value. Firefox keeps it on one line, and forced-colors mode keeps the previous fixed height, so a long value can still be cut off in both at 200% text (tracked in a follow-up issue); WebKit has not been checked. A single word wider than the select's text area is still cut off. A `multiple` select is unchanged. A select that is a direct flex or grid item now stretches to the row's height, unlike `.pathable-input`, which keeps its fixed height; set `align-self` on the select to opt out. Inside a `.pathable-form-row` it keeps its own height.
