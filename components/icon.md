---
name: Icon
slug: icon
kind: static
summary: An inline SVG icon sized to the current font size and painted in the current text colour.
styles-class: pathable-icon
variants: []
guarantees:
  - id: em-size
    status: unverified
    claim: Outside a pathable-icon-tile or a pathable-bottom-navigation__item, the icon is 1em square, the font size of the icon element, whatever width and height attributes the SVG carries.
  - id: current-colour
    status: unverified
    claim: The SVG's fill is the current text colour, so every shape without its own fill attribute paints in that colour, and a fill attribute on the svg element itself is overridden.
  - id: baseline
    status: unverified
    claim: The icon is an inline block with no vertical alignment of its own, so its bottom edge sits on the baseline of the text around it.
  - id: relative
    status: unverified
    claim: The icon is relatively positioned with no offset, so a top or left value nudges it without moving the text around it.
  - id: in-tile
    status: unverified
    claim: Inside a pathable-icon-tile the tile's icon size replaces the 1em size, and the icon stays centred in the tile.
---

# Icon

An inline SVG icon sized to the current font size and painted in the current
text colour. Put the class on an `<svg>` with a `viewBox`. It is not
interactive: the class adds no role, no tab stop and no accessible name.

## When to use

- A small icon inside a line of text, a link, a button label or a list item,
  where it should grow and shrink with the text.
- The icon inside a `pathable-icon-tile`, which then sets its size.

Use something else when:

- the icon needs a tile or background behind it, or a status colour: put it
  in a `pathable-icon-tile`;
- the icon is itself a control: use a `<button>` with
  `pathable-icon-button`;
- the icon stands for an empty view: use `pathable-empty-state__icon` inside
  `pathable-empty-state`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<p>
  <svg
    class="pathable-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
    />
    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
  Appointment at 2:00 PM
</p>
```

## Variants

The component has no modifiers. Change the size with `font-size` on the icon
or its parent, and the colour with `color`.

## Tokens

None. The size comes from the font size and the colour from the text colour
where the icon sits.

## Composition

- Put the class on the `<svg>` itself, with a square `viewBox` such as
  `0 0 24 24`. Width and height attributes are overridden, so leave them out.
- Use filled artwork. The fill overrides a `fill="none"` attribute on the
  `<svg>`, so stroke-only artwork renders as solid shapes.
- The icon adds no space around itself. Next to text, put a space or a gap
  between them.
- Sitting on the baseline, the icon rises slightly above the centre of
  lowercase text. To centre it on a line, place it in a flex row with
  `pathable-flex-align-center`.
- Inside `pathable-icon-tile` the tile sets the icon's size; see that
  component's page. Inside a `pathable-bottom-navigation__item` it is 20 px.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The size guarantee is about the icon's box, not the drawing inside it: artwork
that does not fill its own view box looks smaller.

## The consumer owns

- Accessibility. For a decorative icon beside text that says the same thing,
  set `aria-hidden="true"` and `focusable="false"`. For an icon that carries
  meaning on its own, give the SVG `role="img"` and an accessible name with
  `aria-label` or `aria-labelledby`.
- The colour contrast of the icon against its background, which is that of
  the text colour it inherits.
- The icon artwork.
- Layout around the icon: spacing and alignment with text.
