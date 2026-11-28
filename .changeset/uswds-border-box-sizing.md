---
'@pathableai/styles': patch
---

USWDS components now use `box-sizing: border-box`, as USWDS intends, which fixes
content-box layouts such as a one-line alert body growing taller than its icon
needs. The package still does not emit USWDS's global sizing reset. These
layouts also change to match USWDS:

- `grid-container` and every `grid-container-<width>` are border-box, so their
  `max-width` now includes the side padding. A `grid-container` is unchanged up
  to a 1024px viewport, then its content area is up to 64px narrower; from a
  1088px viewport it is 960px instead of 1024px wide. That also narrows the
  footer content.
- `grid-row` and the direct children of a `grid-gap` row are border-box. A child
  of a gapped row without a `grid-col` class now has its gap padding inside its
  width instead of added to it, and a `grid-row` that sets its own width
  together with padding or a border is smaller. `grid-col` columns were already
  border-box and are unchanged.
- Social links in the footer are 48px squares (3rem including their padding)
  instead of 56px, so more of them fit on one row at narrow widths.
- Content you place inside a form, fieldset, alert body, table, prose table,
  summary box, search, side navigation, footer, tag, button, hint, input group,
  checkbox label or radio label now inherits `box-sizing: border-box` from the
  component. An element there that sets a width or height together with padding
  or a border is smaller than before; set `box-sizing: content-box` on it to
  keep its old size.
- Content placed inside a card keeps the sizes it has outside one.
