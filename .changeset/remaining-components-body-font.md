---
'@pathableai/styles': patch
---

`pathable-site-alert` and `pathable-error-message` now render in Nunito, the brand body typeface, when the page sets no font, instead of the browser's default serif font.

- Text widths and line heights shift slightly, because Nunito's metrics differ from the fallback fonts.
- Text that asks for `font-weight: 700`, such as the site alert's lead-in, now renders in Nunito SemiBold, because the package ships only Nunito 400 and 600. Before, it rendered bold in the fallback font.
