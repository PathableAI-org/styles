---
'@pathableai/styles': patch
---

A workflow card's action container (`.pathable-card--workflow .pathable-card__action` around links, buttons or form controls, as the React `Card` renders it) now sits `--pathable-space-2` below the content above it, and a container holding buttons or form controls lays them out in a wrapping row with a `--pathable-space-2` gap, so a focused action's ring no longer overlaps the meta text or a stacked neighbour. The container no longer takes the link colour and underline when it holds a button or form control, so a button label is not underlined. Containers holding only links keep inline flow. These rules have zero specificity, so a `.pathable-cluster` or other utility on the container still sets its own gap.
