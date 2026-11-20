---
'@pathableai/styles': minor
---

**Breaking change**: the `pathable-workflow-panel` state modifiers (`--loading`, `--saving`, `--saved`, `--offline`, `--validation-error`, `--completed`) no longer write a status message with generated `::before` content. Each now only styles (colour, box) the text your application puts in `.pathable-workflow-panel__status`, so the message is real, translatable text that a `role="status"` region can announce.

Migration: put the message in the status element yourself and give it `role="status"`, for example `<div class="pathable-workflow-panel__status" role="status">Saved</div>`. Until you do, the status region is empty and draws nothing. If you followed the earlier documented pattern of a visually hidden status (`pathable-sr-only`), make that text visible, or the status is no longer shown to sighted users. The "✓" and "⚠" glyphs are gone; if you want them, wrap them in `<span aria-hidden="true">` so they are not announced.

The workflow panel's current-activity text and the offline status text now use `--pathable-color-text-muted` and `--pathable-color-text`, which meet 4.5:1 contrast. The current-activity text changes from grey to the brand teal, and you can override both colours through the theme.
