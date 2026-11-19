---
'@pathableai/styles': patch
---

Focus outlines that components draw outside themselves now take their colour from the background behind them (`--pathable-surface-focus-ring`), so they keep 3:1 contrast on Intelligent Jade, Shilling Silver and danger red. This covers `.pathable-surface--interactive`, `.pathable-link`, `.pathable-button--unstyled`, and the filter pill, card, resource card, filter bar, optional form section, toast and app shell navigation outlines. The `pathable-bg-accent`, `pathable-bg-success`, `pathable-bg-base` and `pathable-bg-danger` utilities and `.pathable-alert--emergency` now set the ring for the controls on them (on-accent blue, PathAble Blue and white). The outline is unchanged outside those backgrounds.
