---
'@pathableai/styles': patch
---

`pathable-legend` no longer keeps the browser's default inline padding of 2px
on each side, matching USWDS.

- The legend text lines up with the hint, labels and controls in the same
  fieldset instead of starting 2px to their right.
- The legend text has 4px more width, so a legend that only just wrapped may
  now fit on one line, and the content under it moves up by a line.
