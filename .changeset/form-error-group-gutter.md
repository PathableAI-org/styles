---
'@pathableai/styles': patch
---

The form, text input, select and memorable date component pages now say to
leave at least `1.25rem` of space to the left of a `pathable-form-group--error`
from a `64em` viewport upward.

- From that width the group moves `1.25rem` to the left so its dark red error
  bar sits outside the field's left edge, and a container with less left
  padding or margin cuts the bar off.
- Set the gutter in `rem`, so it grows with the reader's font size.
