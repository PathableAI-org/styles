---
'@pathableai/styles': patch
---

`pathable-breadcrumb` links now draw the PathAble focus outline
(`--pathable-color-focus-ring`) instead of the browser's default focus ring.

- `pathable-breadcrumb` resets `--pathable-surface-focus-ring`, so the outline
  stays visible on its white background inside a `bg-primary-vivid` container.
- Below 480px, the items hidden at that width stay keyboard-focusable, and one
  whose link has focus is shown above the parent link while it has focus, so the
  focus can be seen.
