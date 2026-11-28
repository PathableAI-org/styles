---
'@pathableai/styles': minor
---

Adds the USWDS colour, spacing and list-reset utilities, under their own names
and without a prefix:

- `bg-*` and `text-*` for every theme colour grade (`bg-primary`,
  `bg-secondary-light`, `bg-accent-warm-dark`, `bg-base-lightest`, `bg-ink`,
  `text-ink`, plus `black`, `white` and `transparent`). Colours come from the
  PathAble theme tokens.
- `padding-*` and `margin-*`, including the side variants such as
  `margin-bottom-1`.
- `add-list-reset`.

Responsive and hover variants are not included. The compiled stylesheet grows by
about 26KB.
