---
'@pathableai/styles': minor
---

**Breaking change**: every rule in the compiled CSS (`styles.css`, `components.css`, `utilities.css` and `theme-default.css`) now sits in a cascade layer: `pathable.base` (tokens and font faces), `pathable.components` or `pathable.utilities`. Each file begins with `@layer pathable.base, pathable.components, pathable.utilities;`.

Consequences:

- Unlayered CSS in an app beats every package rule, whatever its specificity.
- Utilities beat component classes whatever order the files load in.
- For `!important` declarations the order is reversed: an `!important` in `pathable.base` or `pathable.components` beats one in a later layer, and beats an unlayered `!important` in an app.

Migration:

- Remove specificity hacks that only existed to beat package rules.
- Review unlayered app rules that relied on losing to package rules; they now win.
- To keep app rules below the package, put them in a layer declared before `pathable.base`.
