---
name: IconTile
slug: icon-tile
kind: static
summary: A fixed-size square or circular tile that centres one icon and colours it by status.
styles-class: pathable-icon-tile
variants:
  - axis: size
    default: default
    values: [compact, default, large]
  - axis: shape
    default: square
    values: [square, circle]
  - axis: status
    default: default
    values: [default, success, error, warning, info]
states: []
guarantees:
  - id: fixed-size
    claim: The tile is 32, 44 or 52 px square at compact, default and large, and the icon box inside it is 16, 20 or 24 px.
  - id: centred-icon
    claim: The icon box is centred in the tile within 0.01 px on both axes, at every size, shape and status.
  - id: shape
    claim: A square tile has 4 px rounded corners and a circle tile is fully round.
  - id: status-colour
    claim: Status sets the colour an icon drawn in currentColor paints with, and the tile background is the same for every status.
  - id: no-shrink
    claim: The tile keeps its size beside long text in a flex row.
  - id: custom-size
    claim: Setting the two size custom properties on the tile resizes the tile and the icon box, and the icon stays centred.
---

# IconTile

A fixed-size square or circular tile that centres one icon and colours it by
status. Put the class on a `<span>`. It is not interactive: the class adds no
role, no tab stop and no accessible name.

## When to use

- A leading visual for a row, list item, card or heading, usually beside text
  that says the same thing.
- A small status mark beside a label, where the status colour reinforces words
  that are already there.

Use something else when:

- the icon performs an action: use a `<button>` with `pathable-icon-button`;
- the icon sits inside a line of text with no tile behind it: use
  `pathable-icon` on the SVG alone;
- the status needs its own words, such as "Pending": use `pathable-tag`;
- the message needs a heading and body, or must be announced: use
  `pathable-alert`.

## Example

With the `@pathableai/styles` stylesheet loaded; no JavaScript is needed:

```html
<div
  class="pathable-inline pathable-inline--gap-sm"
  style="align-items: center"
>
  <span
    class="pathable-icon-tile pathable-icon-tile--success"
    aria-hidden="true"
  >
    <svg class="pathable-icon" viewBox="0 0 24 24" focusable="false">
      <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
    </svg>
  </span>
  <span>Training record verified</span>
</div>
```

## Variants

Add at most one modifier class from each axis to `pathable-icon-tile`. The
three axes combine freely.

| Axis   | Value     | Class                         | What it is for                                  |
| ------ | --------- | ----------------------------- | ----------------------------------------------- |
| size   | `compact` | `pathable-icon-tile--compact` | 32 px tile, 16 px icon, for dense lists         |
| size   | `default` | none                          | 44 px tile, 20 px icon, for most rows and cards |
| size   | `large`   | `pathable-icon-tile--large`   | 52 px tile, 24 px icon, for prominent rows      |
| shape  | `square`  | none                          | Rounded square, the default                     |
| shape  | `circle`  | `pathable-icon-tile--circle`  | Round tile; use one shape throughout a list     |
| status | `default` | none                          | Normal text colour, no status meaning           |
| status | `success` | `pathable-icon-tile--success` | Completed or approved                           |
| status | `error`   | `pathable-icon-tile--error`   | Failed, missing or blocked                      |
| status | `warning` | `pathable-icon-tile--warning` | Needs attention; see known defects              |
| status | `info`    | `pathable-icon-tile--info`    | Neutral information, such as new messages       |

For a size outside these three, set `--pathable-icon-tile-size` and
`--pathable-icon-tile-icon-size` on the tile itself. Both custom properties
inherit, so setting them on a container also resizes every default-size tile
inside it.

## States

None. IconTile is static: it has no hover, focus, pressed, disabled or loading
state, and nothing about it changes after it renders.

## Composition

- Put exactly one icon inside: an `<svg>`, with or without `pathable-icon`.
  The tile sizes any `<svg>` or `pathable-icon` element inside it, overriding
  its `width` and `height` attributes.
- Draw the icon in `currentColor`, or the status colour does not reach it.
  `pathable-icon` fills with `currentColor`; a stroked SVG needs
  `stroke="currentColor"`.
- Place the tile beside its text in a flex row with a gap, such as
  `pathable-inline` with `pathable-inline--gap-sm`. That row does not centre
  its children, so set `align-items: center` on it. The tile adds no space
  around itself.
- The tile background is `--pathable-color-bg`, the page background token. On
  a page or panel that already uses that colour, the tile's edge is not
  visible, so square and circle look the same. Place tiles on a surface, such
  as `pathable-card` or `pathable-surface--raised`.
- Do not put a tile inside a `pathable-button` or a link to make it clickable,
  and do not put interactive content inside a tile. Use `pathable-icon-button`
  for an icon action.

## Guarantees

What the package guarantees. Each line matches a guarantee in the front matter,
and the package's tests cite those by id:

- Size: 32, 44 or 52 px square tiles with 16, 20 or 24 px icon boxes.
- Centring: the icon box is centred in the tile within 0.01 px, at every size,
  shape and status. This is the box, not the drawing inside it: artwork that is
  off-centre in its own view box still looks off-centre.
- Shape: 4 px rounded corners for square tiles, fully round for circle tiles.
- Status colour: status changes only the icon colour, never the background.
- The tile does not shrink in a flex row beside long text.
- The two size custom properties resize the tile and icon box and keep the icon
  centred.

## The consumer owns

- Accessibility. For a decorative tile beside text that says the same thing,
  set `aria-hidden="true"` on the tile. For an icon that carries meaning the
  text does not, leave the tile visible to assistive technology and give the
  SVG `role="img"` and an accessible name with `aria-label` or
  `aria-labelledby`.
- Never relying on colour alone: say the status in text or another visible cue.
- The icon artwork, and keeping it centred in its own view box.
- Layout around the tile: gap, alignment with text and wrapping.

## Known defects

- The success icon colour has a contrast of about 2.1:1 against the tile
  background, below the 3:1 that a meaningful icon needs. Keep success tiles
  decorative and say the status in text.
- The warning status renders a near-black navy, not amber, and is hard to tell
  apart from the default status by colour.
