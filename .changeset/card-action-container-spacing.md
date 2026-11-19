---
'@pathableai/styles': patch
---

A workflow card's action container (`.pathable-card--workflow .pathable-card__action` around buttons or links, as the React `Card` renders it) now sits `--pathable-space-2` below the content above it and spaces its actions `--pathable-space-2` apart, so a focused action's ring no longer overlaps the meta text or a stacked neighbour. The container no longer applies the link colour and underline to a button label; this now applies whenever it holds a button or form control, not only a link. A `.pathable-cluster` or other utility on the container still sets its own gap.
