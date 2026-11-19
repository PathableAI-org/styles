---
'@pathableai/styles': minor
---

**Breaking change**: the `pathable-workflow-panel` state modifiers (`--loading`, `--saving`, `--saved`, `--offline`, `--validation-error`, `--completed`) no longer write a status message with generated `::before` content. Each now only styles (colour, box) the text your application puts in `.pathable-workflow-panel__status`, so the message is real, translatable text that a `role="status"` region can announce.

Migration: put the message in the status element yourself and give it `role="status"`, for example `<div class="pathable-workflow-panel__status" role="status">Saved</div>`. Until you do, the status region is empty. The "✓" and "⚠" glyphs are gone; include them in your text if you want them.
