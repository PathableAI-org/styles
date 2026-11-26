---
'@pathableai/styles': minor
---

Adds the `pathable-summary-box__body` element class. The first and last child of `pathable-summary-box__text`, for example a list or paragraph, no longer add a top or bottom margin, so a list sits 8 px closer to the heading. A long word in the heading or text now wraps inside the box under enlarged text instead of running past its border. The documented markup is now a `<section aria-labelledby>` instead of `<div role="region">`; the old markup still renders the same.
