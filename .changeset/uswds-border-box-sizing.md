---
'@pathableai/styles': patch
---

**Visible layout change.** USWDS components now get `box-sizing: border-box` from USWDS's own component mixins, through the `$theme-global-border-box-sizing: false` theme setting, instead of from local patches. The package still does not emit USWDS's global sizing reset. This fixes content-box layout such as a one-line alert body growing taller than its icon needs, and also changes these layouts to match USWDS:

- `grid-container` and every `grid-container-<width>` are border-box, so their `max-width` now includes the side padding: at tablet and desktop widths a `grid-container` content area is 64px narrower (960px instead of 1024px at 1280px), which also narrows grid columns and the footer content.
- Social links in the footer are 48px squares (3rem including their padding) instead of 56px, so more of them fit on one row at narrow widths.
- Content you place inside a form, fieldset, alert body, table, prose table, summary box, search, side navigation, footer, tag, button, hint or input group now inherits `box-sizing: border-box` from the component. An element there that sets a width or height together with padding or a border is smaller than before; set `box-sizing: content-box` on it to keep its old size.
- Content placed inside a card keeps the sizes it has outside one.
