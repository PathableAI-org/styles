---
name: Icon
slug: icon
kind: static
summary: An inline SVG icon that references a named icon in the PathAble sprite, sized to the current font size and painted in the current text colour.
styles-class: pathable-icon
variants:
  - axis: size
    default: default
    values: [default, size-3, size-4, size-5, size-6, size-7, size-8, size-9]
guarantees:
  - id: em-size
    claim: The icon is 1em square, the font size of the icon element, whatever width and height attributes the SVG carries.
  - id: current-colour
    claim: The SVG's fill is the current text colour, so every shape in the referenced sprite symbol paints in that colour, and a fill attribute on the svg element itself is overridden.
  - id: baseline
    claim: The icon is an inline block with no vertical alignment of its own, so its bottom edge sits on the baseline of the text around it.
  - id: relative
    claim: The icon is relatively positioned with no offset, so a top or left value nudges it without moving the text around it.
  - id: size-modifiers
    claim: The classes pathable-icon--size-3 to pathable-icon--size-9 make the icon a square of 24, 32, 40, 48, 56, 64 and 72 px, whatever the font size around it.
---

# Icon

An inline SVG icon that references a named icon in the PathAble sprite, sized
to the current font size and painted in the current text colour. Put the class
on an `<svg>` that holds a `<use>` pointing at a symbol of the sprite. It is
not interactive: the class adds no role, no tab stop and no accessible name.

## When to use

- A small icon inside a line of text, a link, a button label or a list item,
  where it should grow and shrink with the text.

Use something else when:

- the icon is itself a control: use a `<button>` with an accessible name and
  put the icon inside it.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: default -->

## States

Each state is complete markup for one use of the icon. Copy the one closest to
what you need.

<!-- examples -->

## Variants

The default icon is 1em square. Change its size with `font-size` on the icon
or its parent, and its colour with `color`. The size modifiers are for an icon
that should keep a fixed size whatever the text around it does.

| Axis | Value     | Class                   | What it is for                      |
| ---- | --------- | ----------------------- | ----------------------------------- |
| size | `default` | none                    | 1em square, the font size around it |
| size | `size-3`  | `pathable-icon--size-3` | 24 px square                        |
| size | `size-4`  | `pathable-icon--size-4` | 32 px square                        |
| size | `size-5`  | `pathable-icon--size-5` | 40 px square                        |
| size | `size-6`  | `pathable-icon--size-6` | 48 px square                        |
| size | `size-7`  | `pathable-icon--size-7` | 56 px square                        |
| size | `size-8`  | `pathable-icon--size-8` | 64 px square                        |
| size | `size-9`  | `pathable-icon--size-9` | 72 px square                        |

The size comes from the font size and the colour from the text colour where
the icon sits.

## The sprite

The icons are the named symbols of the PathAble sprite, the package's asset
`@pathableai/styles/dist/img/sprite.svg`. An icon is the symbol's name after
the `#` in the `<use>` reference, such as `#check_circle`, `#schedule`,
`#warning` or `#navigate_next`. The sprite is a file that the application
serves, and the `href` is the URL it is served from, such as
`/assets/img/sprite.svg`.

A decorative icon, beside text that says the same thing, is hidden from
assistive technology:

```svg
<svg class="pathable-icon" aria-hidden="true" focusable="false" role="img">
  <use href="/assets/img/sprite.svg#check_circle"></use>
</svg>
```

An icon that carries meaning on its own has a `<title>` and is named by
`aria-labelledby`:

```svg
<svg
  class="pathable-icon"
  focusable="false"
  role="img"
  aria-labelledby="overdue-icon-title"
>
  <title id="overdue-icon-title">Overdue</title>
  <use href="/assets/img/sprite.svg#warning"></use>
</svg>
```

## Composition

- Put the class on the `<svg>` itself, with one `<use>` inside it that
  references a symbol of the sprite. Leave out width and height attributes
  and the `viewBox`: the class sets the size.
- The icon adds no space around itself. Next to text, put a space or a gap
  between them.
- Sitting on the baseline, the icon rises slightly above the centre of
  lowercase text. To centre it on a line, place it in a flex row with
  `pathable-flex-align-center`.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour.

The size guarantee is about the icon's box, not the drawing inside it: artwork
that does not fill its own view box looks smaller.

## The consumer owns

- Accessibility. For a decorative icon beside text that says the same thing,
  set `aria-hidden="true"` and `focusable="false"`. For an icon that carries
  meaning on its own, give the SVG `role="img"`, a `<title>` with an `id`, and
  `aria-labelledby` pointing at that `id`.
- The colour contrast of the icon against its background, which is that of
  the text colour it inherits.
- Serving the sprite file, and the URL it is served from.
- Layout around the icon: spacing and alignment with text.
