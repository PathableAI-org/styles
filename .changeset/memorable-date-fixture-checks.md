---
'@pathableai/styles': minor
---

Add the memorable date's form group modifiers that `components/memorable-date.md` documents: `.pathable-form-group--month`, `.pathable-form-group--day` and `.pathable-form-group--year`, each an `@extend` of the matching USWDS `.usa-form-group--*` class, and `.pathable-form-group--select`. Each group in a `.pathable-memorable-date` now has a 16 px top margin and a 16 px right margin and is as wide as its content (it previously had the form group's 24 px top margin and no right margin). The day and a text month input are 48 px wide and the year input 72 px wide. The month select is 160 px wide, set by `.pathable-form-group--select`, where the USWDS `--month select` rule would give 240 px. No class is renamed or removed.
