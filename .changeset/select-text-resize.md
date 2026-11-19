---
'@pathableai/styles': patch
---

Let a `.pathable-select` wrap its selected value and grow in height instead of cutting the value off when the text size is increased on a narrow screen (WCAG 1.4.4). Chromium and WebKit wrap the value; Firefox keeps it on one line. A select no longer stretches to a taller neighbour in a grid or flex row.
