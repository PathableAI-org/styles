---
'@pathableai/styles': minor
---

The shared focus outline on `.pathable-button`, `.pathable-input`, `.pathable-select`, `.pathable-textarea` and `.pathable-icon-button` now follows the surface it sits on, so it stays visible there. Each `.pathable-surface` variant with its own background sets the new `--pathable-surface-focus-ring` custom property. `--brand`, `--tone-primary`, `--inset` and `--tone-subtle` use `--pathable-color-text` (PathAble Blue), because Bright Blue Brooks is only 1.1:1 on Intelligent Jade and 2.3:1 on Shilling Silver. `--raised`, `--interactive`, `--inverse` and `--tone-default` keep `--pathable-color-focus-ring` (Bright Blue Brooks). Outside a surface, and on `--base`, nothing changes. To use the same ring on a container of your own, set `--pathable-surface-focus-ring` on it. The icon button's own `--pathable-icon-button-focus-ring` still takes precedence. The React `Surface`, `Button`, `Input`, `Select`, `Textarea` and `IconButton` inherit the change.
