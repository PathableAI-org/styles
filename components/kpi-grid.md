---
name: KpiGrid
slug: kpi-grid
kind: static
summary: An auto-filling grid of metric cards, each showing an emphasised value, a label and an optional trend.
styles-class: pathable-kpi-grid
variants:
  - axis: columns
    default: auto
    values: [auto, columns-2, columns-3, columns-4]
guarantees:
  - id: auto-columns
    status: unverified
    claim: Without a columns modifier, and with no minimum-width custom property set on the grid or an ancestor, the grid fits as many equal-width columns of at least 200 px as its width allows; a 1000 px grid has four 226 px columns.
  - id: fixed-columns
    status: unverified
    claim: With columns-2, columns-3 or columns-4 the grid has exactly that many equal-width columns at viewport widths above 480 px, whatever its own width.
  - id: narrow-single-column
    status: unverified
    claim: At a viewport width of 480 px or less the grid has one column, with or without a columns modifier.
  - id: gap
    status: unverified
    claim: With no gap custom property set on the grid or an ancestor, the gap between cards is 32 px in both directions.
  - id: full-width
    status: unverified
    claim: The grid is as wide as its container, and in a container narrower than 200 px its single column is the container's width.
  - id: value-weight
    status: unmet
    claim: The value is set in the heading typeface at weight 400, Fredoka Regular.
  - id: trend-shape
    status: unverified
    claim: A trend marked up, down or neutral starts with an upward triangle, a downward triangle or two small triangles point to point (an hourglass), so the direction is shown by shape as well as colour.
  - id: up-trend-contrast
    status: met
    claim: The text of a trend marked up has a contrast ratio of at least 4.5 to 1 against the card's background.
  - id: loading
    status: unverified
    claim: In a loading card the value and label become placeholder bars, the icon and trend are hidden, and the shimmer animation is off when reduced motion is requested.
  - id: unavailable
    status: unverified
    claim: In an unavailable card the value shows an em dash in muted text and hides every child element of the value.
---

# KpiGrid

An auto-filling grid of metric cards, each showing an emphasised value, a
label and an optional trend. Put `pathable-kpi-grid` on a `<div>` or a list
and `pathable-kpi-card` on each child. Neither class adds a role, a live
region or an accessible name.

## When to use

- A row of headline numbers at the top of a dashboard or report, such as
  active participants or placement rate.
- Metrics that need a loading placeholder or a "no data" state that keeps the
  layout steady.

Use something else when:

- the items are cards with richer content, such as a title, description and
  actions: use `pathable-card-grid`;
- you need an exact column count for content that is not metrics: use
  `pathable-grid`;
- the number needs a chart or a table to make sense: put that content in a
  surface such as `pathable-surface--raised` instead.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-kpi-grid">
  <div class="pathable-kpi-card">
    <p class="pathable-kpi-card__value">1,247</p>
    <p class="pathable-kpi-card__label">Active participants</p>
    <div class="pathable-kpi-card__trend" data-trend="neutral">
      <span class="pathable-kpi-card__trend-label">
        No change from last month
      </span>
    </div>
  </div>
  <div class="pathable-kpi-card">
    <p class="pathable-kpi-card__value">86%</p>
    <p class="pathable-kpi-card__label">Placement rate</p>
  </div>
</div>
```

## Variants

Add at most one columns modifier class to `pathable-kpi-grid`.

| Axis    | Value       | Class                          | What it is for                            |
| ------- | ----------- | ------------------------------ | ----------------------------------------- |
| columns | `auto`      | none                           | As many columns of at least 200 px as fit |
| columns | `columns-2` | `pathable-kpi-grid--columns-2` | Exactly two columns above 480 px          |
| columns | `columns-3` | `pathable-kpi-grid--columns-3` | Exactly three columns above 480 px        |
| columns | `columns-4` | `pathable-kpi-grid--columns-4` | Exactly four columns above 480 px         |

The cards have two state modifiers of their own, described under
Composition: `pathable-kpi-card--loading` and `pathable-kpi-card--unavailable`.

## Tokens

The grid reads two custom properties of its own, which you can set on it:

| What                 | Token                           |
| -------------------- | ------------------------------- |
| Minimum column width | `--pathable-kpi-grid-min-width` |
| Gap between cards    | `--pathable-kpi-grid-gap`       |
| Default gap          | `--pathable-space-4`            |
| Font family          | `--pathable-font-body`          |

Both custom properties inherit, so setting them on a container also changes
every grid inside it that does not set its own. The minimum column width is
200 px unless you set `--pathable-kpi-grid-min-width`; it is not a theme
token. The 32 px gap is
that of the default theme. The cards take their surface, border, text, muted
text and trend colours, their corner radius and their type sizes from theme
tokens, so a theme that changes those tokens changes the cards.

## Composition

- Each direct child of the grid is a `pathable-kpi-card`: a bordered surface
  with 32 px padding that stacks its parts with a small gap. Cards in one row
  stretch to the same height.
- Inside a card, in this order:
  - `pathable-kpi-card__icon`, optional: a 32 px square that sizes the
    `<svg>` or `<img>` inside it and sets muted text as its current colour.
    An `<svg>` takes that colour only when it paints with `currentColor`,
    for example with the `pathable-icon` class; an `<img>` keeps its own
    colours.
  - `pathable-kpi-card__value`, required: the number, in the heading font at
    display size and weight 400. Long values wrap rather than overflow.
  - `pathable-kpi-card__label`, required: what the number counts, in muted
    caption text.
  - `pathable-kpi-card__trend`, optional: the comparison. Set `data-trend` to
    `up`, `down` or `neutral` for the success, danger or muted colour and its
    shape: an upward triangle, a downward triangle, or two small triangles
    point to point. Put the words in a `pathable-kpi-card__trend-label`
    inside it. Use a `<div>` or `<span>` for the trend, not a `<p>`: the
    trend resets only its top margin, so a paragraph keeps the browser's
    bottom margin and makes the card taller.
- Add `pathable-kpi-card--loading` to a card while its data loads. Keep empty
  value and label elements in it: they become the placeholder bars.
- Add `pathable-kpi-card--unavailable` when there is no figure. Anything
  wrapped in an element inside the value is hidden and an em dash shows
  instead; text placed directly in the value is not hidden.
- Above 480 px a columns modifier keeps its column count however narrow the
  grid is. In a narrow panel, prefer the default auto columns.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The 480 px breakpoint follows the viewport, not the grid's container.

Today the value asks for bold, and the package ships only Fredoka Regular (400),
so browsers draw a synthesised bold; `value-weight` is unmet.

In the default theme an up trend's text is the darker success green
(#0d7a63), 0.75rem (12 px) and semibold, on the card's white background, which
measures 5.27 to 1. A down trend measures 4.53 to 1 and a neutral one 7.71 to 1.

## The consumer owns

- Accessibility. Never rely on trend colour alone: always write the direction
  and amount in the trend label, such as "Up 12% from last month". Mark the
  placeholder elements of a loading card `aria-hidden="true"` and say that
  the figures are loading in text that assistive technology can reach.
- Explaining an unavailable figure. The em dash has no words, and the hidden
  value is hidden from assistive technology too, so say why there is no
  figure in the label or nearby text.
- Updating the figures and switching the state classes; the classes contain
  no script.
- Headings and landmarks around the grid, and the order of the cards.
