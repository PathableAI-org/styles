---
'@pathableai/styles': patch
---

Fix `.pathable-button` with `.pathable-width-full` (the React `Button` `width="full"` prop) so it fills its container at every viewport. From 30em up the USWDS button rule `width: auto` overrode the utility at equal specificity, so the button stayed at its content width. No class is renamed or removed.
