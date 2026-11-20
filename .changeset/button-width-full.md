---
'@pathableai/styles': patch
---

Fix `.pathable-button` with `.pathable-width-full` (the React `Button` `width="full"` prop) so it fills its container at every viewport. From 30em up the USWDS button rule `width: auto` overrode the utility at equal specificity, so the button stayed at its content width. The width utilities now win on a button at every breakpoint, including the `mobile-lg:`, `tablet:` and `desktop:` variants, so `width="auto"` also shrinks a button to its content width below 30em, where USWDS used to keep it full width. No class is renamed or removed.
