---
'@pathableai/styles': patch
---

The `pathable-loading` spinner now keeps the gap in its ring in forced colours mode, so its turning can be seen. The ring is drawn in `ButtonText` with a `Canvas` top, instead of the browser replacing the transparent top with the same colour as the rest of the ring.
