---
'@pathableai/styles': minor
---

Adds the `pathable-form-group--month`, `pathable-form-group--day`,
`pathable-form-group--year` and `pathable-form-group--select` modifiers that
`components/memorable-date.md` documents.

- `pathable-form-group--select` makes the month select 160px (10rem) wide, where
  the USWDS `--month select` rule would give 240px. Its group shrinks when 10rem
  does not fit, so enlarged text on a phone does not scroll the page sideways.
