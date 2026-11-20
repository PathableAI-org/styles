---
'@pathableai/styles': patch
---

The `pathable-loading` spinner is now 24 px across by default and 40 px with `pathable-loading--large`, border included, as its stylesheet documents. It was 28 px and 46 px because its width and height excluded the border. The spinner now sets `box-sizing: border-box`. The React `Loading` inherits the fix.
