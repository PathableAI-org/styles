---
name: Grid
slug: grid
kind: static
summary: A CSS grid container that places its direct children in one, two, three or four equal columns with token-based gaps.
styles-class: pathable-grid
variants:
  - axis: columns
    default: one
    values: [one, cols-2, cols-3, cols-4]
  - axis: gap
    default: default
    values: [default, gap-sm, gap-md, gap-lg, gap-xl]
  - axis: column-gap
    default: default
    values:
      [default, column-gap-sm, column-gap-md, column-gap-lg, column-gap-xl]
  - axis: row-gap
    default: default
    values: [default, row-gap-sm, row-gap-md, row-gap-lg, row-gap-xl]
  - axis: align
    default: default
    values:
      [
        default,
        align-start,
        align-center,
        align-end,
        align-stretch,
        align-baseline,
      ]
guarantees:
  - id: column-count
    status: unverified
    claim: Without a columns modifier every child takes a full-width row, and with cols-2, cols-3 or cols-4 the children fill that many columns in DOM order, row by row; the columns are equal in width while no child's content is wider than an equal share.
  - id: fixed-count
    status: unverified
    claim: The number of columns is the same at every viewport and container width; the grid has no breakpoint of its own.
  - id: gap-scale
    status: unverified
    claim: On a grid with no ancestor that sets a grid gap custom property, the gap between rows and between columns is 16 px by default, and 8, 16, 24 or 32 px with gap-sm, gap-md, gap-lg or gap-xl.
  - id: axis-gap
    status: unverified
    claim: A column-gap or row-gap modifier sets only that direction, on the same 8, 16, 24 and 32 px scale, and wins over a gap modifier on the same grid or an ancestor whatever the class order.
  - id: align
    status: unverified
    claim: On a grid with no ancestor that sets the alignment custom property, each child stretches to the height of its row by default; an align modifier sets the vertical alignment of every child in its row to start, centre, end, stretch or baseline.
  - id: custom-gap
    status: unverified
    claim: Setting the gap custom properties on the grid changes the gaps without a modifier class.
---

# Grid

A CSS grid container that places its direct children in one, two, three or
four equal columns with token-based gaps. Put the class on any block element,
such as a `<div>` or `<ul>`. It adds no role, no landmark and no space around
itself.

## When to use

- A fixed number of equal columns for content of similar weight, such as
  two columns of form sections or three columns of short summaries.
- A layout where you choose the column count yourself and change it at your
  own breakpoints.

Use something else when:

- the number of columns should follow the available width: use
  `pathable-card-grid` for cards and tiles;
- the items are headline metrics: use `pathable-kpi-grid` with
  `pathable-kpi-card` children;
- the items are form fields whose controls must line up: use
  `pathable-form-row`;
- the items are a row of buttons: use `pathable-button-group`, or
  `pathable-cluster` when the buttons should wrap;
- the items are a single row or column with no grid: use `pathable-inline` or
  `pathable-stack`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-grid pathable-grid--cols-3 pathable-grid--gap-lg">
  <section class="pathable-surface pathable-surface--raised pathable-padding-3">
    Referrals this week
  </section>
  <section class="pathable-surface pathable-surface--raised pathable-padding-3">
    Open cases
  </section>
  <section class="pathable-surface pathable-surface--raised pathable-padding-3">
    Upcoming sessions
  </section>
</div>
```

## Variants

Add at most one modifier class from each axis to `pathable-grid`. The axes
combine freely.

| Axis       | Value            | Class                           | What it is for                                |
| ---------- | ---------------- | ------------------------------- | --------------------------------------------- |
| columns    | `one`            | none                            | One column; each child takes its own row      |
| columns    | `cols-2`         | `pathable-grid--cols-2`         | Two equal columns                             |
| columns    | `cols-3`         | `pathable-grid--cols-3`         | Three equal columns                           |
| columns    | `cols-4`         | `pathable-grid--cols-4`         | Four equal columns                            |
| gap        | `default`        | none                            | 16 px between rows and columns                |
| gap        | `gap-sm`         | `pathable-grid--gap-sm`         | 8 px both ways, for dense content             |
| gap        | `gap-md`         | `pathable-grid--gap-md`         | 16 px both ways; resets an inherited gap      |
| gap        | `gap-lg`         | `pathable-grid--gap-lg`         | 24 px both ways, for cards and panels         |
| gap        | `gap-xl`         | `pathable-grid--gap-xl`         | 32 px both ways, for page sections            |
| column-gap | `default`        | none                            | Follows the gap axis                          |
| column-gap | `column-gap-sm`  | `pathable-grid--column-gap-sm`  | 8 px between columns only                     |
| column-gap | `column-gap-md`  | `pathable-grid--column-gap-md`  | 16 px between columns only                    |
| column-gap | `column-gap-lg`  | `pathable-grid--column-gap-lg`  | 24 px between columns only                    |
| column-gap | `column-gap-xl`  | `pathable-grid--column-gap-xl`  | 32 px between columns only                    |
| row-gap    | `default`        | none                            | Follows the gap axis                          |
| row-gap    | `row-gap-sm`     | `pathable-grid--row-gap-sm`     | 8 px between rows only                        |
| row-gap    | `row-gap-md`     | `pathable-grid--row-gap-md`     | 16 px between rows only                       |
| row-gap    | `row-gap-lg`     | `pathable-grid--row-gap-lg`     | 24 px between rows only                       |
| row-gap    | `row-gap-xl`     | `pathable-grid--row-gap-xl`     | 32 px between rows only                       |
| align      | `default`        | none                            | Children stretch to the row height            |
| align      | `align-start`    | `pathable-grid--align-start`    | Children sit at the top of their row          |
| align      | `align-center`   | `pathable-grid--align-center`   | Children are centred vertically in their row  |
| align      | `align-end`      | `pathable-grid--align-end`      | Children sit at the bottom of their row       |
| align      | `align-stretch`  | `pathable-grid--align-stretch`  | Children stretch; resets inherited alignment  |
| align      | `align-baseline` | `pathable-grid--align-baseline` | Children line up on their first text baseline |

## Tokens

The gaps come from spacing tokens, and the modifiers work by setting the
grid's own custom properties, which you can also set directly. These custom
properties inherit, so setting them on a container, or a modifier on an outer
grid, also changes every grid inside it that does not set its own:

| What                   | Token                        |
| ---------------------- | ---------------------------- |
| Both gaps              | `--pathable-grid-gap`        |
| Column gap only        | `--pathable-grid-column-gap` |
| Row gap only           | `--pathable-grid-row-gap`    |
| Vertical alignment     | `--pathable-grid-align`      |
| Small gap              | `--space-8`                  |
| Default and medium gap | `--space-16`                 |
| Large gap              | `--space-24`                 |
| Extra-large gap        | `--space-32`                 |

The pixel figures on this page are those of the default theme. A theme that
changes the spacing tokens changes them.

## Composition

- The grid lays out its direct children only. Each child is one cell; the
  grid has no element classes and no column-span helpers.
- Columns are equal while their content fits. A child whose content cannot
  shrink, such as a long unbroken word, a wide table or a fixed-width image,
  widens its own column and squeezes the others. Let such content wrap, or
  give it `min-width: 0` and its own overflow handling.
- A grid nested in another grid takes the outer grid's gap and align
  modifiers unless it sets its own. A plain inner grid inside a
  `pathable-grid--gap-xl pathable-grid--align-center` grid has 32 px gaps and
  centred children; give it `pathable-grid--gap-md` and
  `pathable-grid--align-stretch` to get the defaults back. An outer
  column-gap or row-gap modifier also beats the inner grid's gap modifier in
  that direction, so set the inner grid's column-gap and row-gap modifiers
  too when the outer grid has them.
- Four columns stay four columns on a phone. Change the column modifier at
  your own breakpoints, or use `pathable-card-grid`, which adds and removes
  columns by width.
- The grid sets no width, padding or margin. Put it inside a page container
  such as `pathable-container`, or on a surface such as
  `pathable-surface--raised`.
- To make each cell a card, give it a surface, as in the example. The
  `pathable-card` class on its own draws no background, border or padding;
  its visible card is the `pathable-card__container` inside it. It also adds
  a bottom margin of 32 px (40 px below a 640 px viewport), which adds to the
  row gap.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Semantics. The grid is a visual layout only. Use a list (`<ul>` with
  `<li>` children) when the items are a list, removing its bullets, padding
  and margin yourself, and headings inside each cell when they are sections.
- Reading order. Children are placed in DOM order, row by row; keep the DOM
  order the order that makes sense when read aloud or tabbed through.
- Responsive behaviour: choosing fewer columns on narrow screens.
- Content that fits its column, and wrapping or overflow inside each cell.
