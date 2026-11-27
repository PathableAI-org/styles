---
'@pathableai/styles': patch
---

**Visible layout change.** USWDS components now get `box-sizing: border-box` from USWDS's own component mixins, through the `$theme-global-border-box-sizing: false` theme setting, instead of from local patches. The package still does not emit USWDS's global sizing reset. This fixes content-box layout such as a one-line alert body growing taller than its icon needs, and also changes these layouts to match USWDS:

- `grid-container` and every `grid-container-<width>` are border-box, so their `max-width` now includes the side padding. A `grid-container` is unchanged up to a 1024px viewport, then its content area is up to 64px narrower; from a 1088px viewport it is 960px instead of 1024px wide. That also narrows the footer content.
- `grid-row`, every `grid-col` class and the direct children of a `grid-gap` row are border-box, so a column's gap padding is now inside its `n`/12 width instead of added to it. A row whose columns do not fill it, such as two `grid-col-3` in a `grid-row grid-gap`, has narrower columns, and so does a column that also carries padding or border utilities.
- Social links in the footer are 48px squares (3rem including their padding) instead of 56px, so more of them fit on one row at narrow widths.
- Content you place inside a form, fieldset, alert body, table, prose table, summary box, search, side navigation, footer, tag, button, hint, input group, checkbox label or radio label now inherits `box-sizing: border-box` from the component. An element there that sets a width or height together with padding or a border is smaller than before; set `box-sizing: content-box` on it to keep its old size.
- Content placed inside a card keeps the sizes it has outside one.
