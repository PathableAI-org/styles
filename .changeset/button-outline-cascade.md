---
'@pathableai/styles': patch
---

Fix `.pathable-button--outline` so that `pathable-button pathable-button--outline` renders as an outline button again: a transparent background, a 2px inset border and text in the primary action color (`--pathable-color-action-primary-bg`). Before this fix the `.pathable-button` brand rule overrode the outline at equal specificity, so the outline modifier rendered as a filled primary button. Hover, active, disabled and inverse outline states are unchanged. No class is renamed or removed, and the React `Button` `outline` variant picks up the fix through the CSS.
