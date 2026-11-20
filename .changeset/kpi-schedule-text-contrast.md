---
'@pathableai/styles': patch
---

Raise the contrast of KpiCard upward trend text and ScheduleItem status and cancelled text to at least 4.5:1. The upward trend now uses `--pathable-color-text-success`. The Completed status pill uses `--pathable-color-text-success` and the Upcoming pill uses `--pathable-color-link`, both on the surface colour with a border. A cancelled ScheduleItem is no longer faded with `opacity`, and keeps its strikethrough title and muted text.
