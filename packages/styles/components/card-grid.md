---
name: CardGrid
slug: card-grid
kind: static
summary: An auto-filling grid that fits as many equal columns of at least 300 px as its container allows, for cards and tiles.
styles-class: pathable-card-grid
variants:
  - axis: gap
    default: default
    values: [default, gap-sm, gap-md, gap-lg]
guarantees:
  - id: auto-columns
    status: unverified
    claim: The grid shows as many equal-width columns of at least 300 px as fit its container, and those columns share the full container width; a 1000 px container with the default gap has three 317 px columns.
  - id: container-driven
    status: unverified
    claim: The column count depends only on the grid's own width, not on the viewport, so the same grid shows fewer columns in a narrower container.
  - id: no-overflow
    status: unverified
    claim: In a container narrower than the minimum column width, the grid has one column exactly as wide as the container and does not overflow it.
  - id: keeps-tracks
    status: unverified
    claim: With fewer children than fit in a row, empty column tracks are kept, so each child keeps the width of one column and the row starts at the inline start edge.
  - id: gap-scale
    status: unverified
    claim: The gap between rows and between columns is 24 px by default, and 16, 24 or 32 px with gap-sm, gap-md or gap-lg.
  - id: custom-properties
    status: unverified
    claim: Setting the minimum-width custom property on the grid changes the minimum column width, and setting the gap custom property changes both gaps.
---

# CardGrid

An auto-filling grid that fits as many equal columns of at least 300 px as its
container allows, for cards and tiles. Put the class on any block element,
such as a `<div>` or `<ul>`. It adds no role and no space around itself, and
it needs no breakpoints: columns appear and disappear as the container
changes width.

## When to use

- A collection of cards or tiles of similar weight whose count varies, such as
  search results, resources or programmes.
- A collection that must work in a full-width page and in a narrow panel
  without separate markup.

Use something else when:

- you need an exact number of columns: use `pathable-grid` with a columns
  modifier;
- the items are headline metrics: use `pathable-kpi-grid`, which has a
  smaller minimum column width and metric card styling;
- the items are form fields: use `pathable-form-row`;
- the items are a single vertical list: use `pathable-stack`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-card-grid">
  <section class="pathable-card">Job coaching</section>
  <section class="pathable-card">Benefits counselling</section>
  <section class="pathable-card">Supported housing</section>
</div>
```

## Variants

Add at most one gap modifier class to `pathable-card-grid`.

| Axis | Value     | Class                        | What it is for                      |
| ---- | --------- | ---------------------------- | ----------------------------------- |
| gap  | `default` | none                         | 24 px between rows and columns      |
| gap  | `gap-sm`  | `pathable-card-grid--gap-sm` | 16 px, for compact tiles            |
| gap  | `gap-md`  | `pathable-card-grid--gap-md` | 24 px, the same as the default      |
| gap  | `gap-lg`  | `pathable-card-grid--gap-lg` | 32 px, for large cards with imagery |

## Tokens

The grid reads two custom properties of its own, which you can set on it:

| What                   | Token                            |
| ---------------------- | -------------------------------- |
| Minimum column width   | `--pathable-card-grid-min-width` |
| Gap between cards      | `--pathable-card-grid-gap`       |
| Small gap              | `--space-16`                     |
| Default and medium gap | `--space-24`                     |
| Large gap              | `--space-32`                     |

The minimum column width is 300 px unless you set
`--pathable-card-grid-min-width`; it is not a theme token. The gap figures
are those of the default theme. A theme that changes the spacing tokens
changes them.

## Composition

- The grid lays out its direct children only; each child is one cell. Put a
  `pathable-card` or another surface in each cell, or make the cell itself the
  card, as in the example.
- Cards in one row stretch to the height of the tallest card in that row.
  Cards in different rows can differ in height.
- Columns are all the same width, including when the last row is not full;
  the last row leaves empty space at its end rather than widening its cards.
- The grid sets no width, padding or margin. It fills the width of whatever
  contains it; put it in a page container such as `pathable-container` or a
  panel.
- The grid does not reset list styles. On a `<ul>`, remove the bullets,
  padding and margin yourself.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The column figures assume the default 24 px gap; a larger gap fits fewer
columns in the same width.

## The consumer owns

- Semantics. Use a list when the cards are a list, and give each card a
  heading when it has one.
- Reading order. Cards are placed in DOM order, row by row; keep that order
  meaningful for reading aloud and tabbing.
- The cards themselves: their surface, padding, content and any link or
  button inside them.
- Content that fits a column of the minimum width, including long words and
  images.
