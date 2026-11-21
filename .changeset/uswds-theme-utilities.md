---
'@pathableai/styles': minor
---

Add the USWDS colour, spacing and list-reset utilities under their own names,
without a prefix. The stylesheet now defines `bg-*` and `text-*` for every
theme colour grade (`bg-primary`, `bg-secondary-light`, `bg-accent-warm-dark`,
`bg-base-lightest`, `bg-ink`, `text-ink`, plus `black`, `white` and
`transparent`), `padding-*` and `margin-*` utilities including the side
variants such as `margin-bottom-1`, and `add-list-reset`. Colours come from the
PathAble theme tokens. Responsive and hover variants are not included. The
compiled stylesheet grows by about 26 KB. The `pathable-*` utilities are
unchanged.
