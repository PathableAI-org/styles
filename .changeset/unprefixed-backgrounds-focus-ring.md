---
'@pathableai/styles': patch
---

Controls on `bg-primary-vivid` now draw the focus ring in white, and on
`bg-secondary`, `bg-success` and `bg-error` in `#001a33` and on `bg-base` in
`#00365c`, instead of Bright Blue Brooks (`#4899e8`), which is under 3:1 on
those backgrounds.

- `bg-primary` and `bg-white` reset the ring to Bright Blue Brooks, so a white
  ring from a `bg-primary-vivid` further out does not reach the controls on
  them.
- The `hover:` variants set the ring only while the container is hovered.
- Other background classes, including `bg-secondary-vivid`, `bg-ink` and
  `bg-accent-cool-dark`, leave the ring as it is.
- A `pathable-legend` inside `bg-primary`, `bg-primary-vivid`, `bg-secondary`,
  `bg-success`, `bg-error`, `bg-accent-cool`, `text-base`, `text-primary`,
  `text-primary-vivid`, `text-secondary` or `text-white` now takes the
  container's text colour, instead of `#00365c`.
