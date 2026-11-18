---
'@pathableai/styles': patch
---

Fix 25 declarations that referenced the undefined `--pathable-font-size-body-xs`
and `--pathable-font-size-heading-xl` tokens, which the browser dropped so the
text inherited its size.

- Secondary and metadata text now uses `--pathable-font-size-caption-md`
  (12px): ActivityList row context, date and owner; DashboardHeader
  breadcrumb; FilterBar result count; KpiGrid card label; RecordHeader
  metadata; ResourceCard provider, metadata and source; ScheduleItem date
  time, context and meta.
- Labels, controls and status text now use `--pathable-font-size-label-sm`
  (12px): ActivityList status text and compact row title; FilterBar sort
  select and clear action; FilterPill; KpiGrid trend and trend label;
  ScheduleItem date month and status; Table status cell text.
- The DashboardHeader title and the KpiGrid card value now use
  `--pathable-font-size-display-lg` (32px).

This text is now visibly smaller (or, for the title and value, sized to 32px)
wherever it previously inherited a different size. No token or class is added,
renamed or removed.
