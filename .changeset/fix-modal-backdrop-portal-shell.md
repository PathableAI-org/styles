---
'@pathableai/styles': minor
'@pathableai/react': minor
---

Modal open presentation now uses a styles-owned portal DOM shell: wrapper → overlay → dialog (instead of a bare dialog under `document.body`).

### Migration

- If you queried `document.body > .pathable-modal` or similar direct-child selectors, update queries for the new wrapper/overlay/dialog tree.
- If you added temporary consumer overlay CSS or custom overlay wrappers to force a backdrop, remove them after upgrading — the package now owns the dimmer. Leaving ad-hoc overlays in place can cause double backdrops / stacked dimmers.
