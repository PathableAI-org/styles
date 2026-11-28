---
'@pathableai/styles': patch
---

`pathable-collection` and `pathable-process-list` now render the same when they
are direct children of `pathable-prose` as outside it. The prose list padding
and item spacing no longer override the collection's flush list and item
margins, or move the process list's connector line away from its markers.
