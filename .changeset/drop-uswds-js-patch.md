---
'@pathableai/styles': patch
---

Stop patching the USWDS JavaScript. `dist/pathable.js` is now built from unmodified USWDS source, so its behaviours select `usa-` classes again and no longer honour the `data-react-owned` opt-out.
