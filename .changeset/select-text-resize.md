---
'@pathableai/styles': patch
---

Let a single `.pathable-select` wrap its selected value and grow in height instead of cutting the value off when the text size is increased on a narrow screen (WCAG 1.4.4). Chromium wraps the value; Firefox keeps it on one line, so a long value can still be cut off there at 200% text (tracked in a follow-up issue), and WebKit has not been checked. A `multiple` select is unchanged. In a `.pathable-form-row` a select keeps its own height instead of stretching to a taller control in the same row.
