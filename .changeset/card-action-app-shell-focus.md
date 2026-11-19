---
'@pathableai/styles': patch
---

Keyboard focus on the workflow card's action link (`.pathable-card--workflow .pathable-card__action`) and on a focusable app shell content region (`.pathable-app-shell__content`) now shows the brand focus indicator instead of the browser's default ring: a 2px solid `--pathable-color-focus-ring` outline (`Highlight` under forced colors), drawn inside the content region's edge. Both rules apply on `:focus-visible` only. No class or token changes.
