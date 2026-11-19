---
name: Split
slug: split
kind: static
summary: A two-column grid that places two regions side by side on wide viewports and stacks them below 1024 px.
styles-class: pathable-split
variants:
  - axis: ratio
    default: default
    values: [default, ratio-1-1, ratio-1-2, ratio-2-1, ratio-1-3]
  - axis: align
    default: default
    values: [default, align-start, align-center, align-end, align-stretch]
guarantees:
  - id: two-columns
    status: unverified
    claim: At a viewport width of 1024 px or more, the first two children sit side by side in columns sized 1:1 by default and with ratio-1-1, and 1:2, 2:1 or 1:3 with ratio-1-2, ratio-2-1 or ratio-1-3.
  - id: collapse
    status: unverified
    claim: At a viewport width of 1023 px or less, every ratio collapses to one full-width column with the children in source order.
  - id: gap
    status: unverified
    claim: The space between the columns, and between the regions once they stack, is 24 px.
  - id: centred-default
    status: unverified
    claim: Regions of different heights are centred vertically against each other by default and with align-center, and align-start, align-end and align-stretch align them to the top, the bottom or the full row height.
  - id: no-reorder
    status: unverified
    claim: The split never reorders its children, so the first child is at the start of the row (the left in left-to-right text) on wide viewports and on top on narrow ones.
  - id: custom-properties
    status: unverified
    claim: Setting --pathable-split-ratio, --pathable-split-gap or --pathable-split-align on the split sets its wide-viewport columns, its gap or its alignment to that value.
---

# Split

A two-column grid that places two regions side by side on wide viewports and
stacks them below 1024 px. Put the class on a block element with exactly two
children, such as a `<div>` or `<section>`. It adds no role, no padding and no
border.

## When to use

- Two peer regions that belong side by side on a desktop: text beside an
  image, a form beside its explanation, a summary beside a call to action.
- A two-column band in a landing page or results page that must become one
  column on phones and tablets.

Use something else when:

- one region is the main content and the other a narrow secondary column,
  such as filters or related links: use `pathable-sidebar-layout`;
- there are three or more equal regions or a set of cards: use
  `pathable-grid` or `pathable-card-grid`;
- the items are small, such as buttons or tags: use `pathable-cluster` or
  `pathable-inline`;
- the regions should always be one above the other: use `pathable-stack`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<section
  class="pathable-split pathable-split--ratio-2-1 pathable-split--align-start"
>
  <div>
    <h2>Request an accommodation</h2>
    <p>Tell us what would help you do your best work.</p>
  </div>
  <div class="pathable-surface pathable-surface--raised pathable-padding-3">
    <p>Most requests are answered within five working days.</p>
  </div>
</section>
```

## Variants

Add at most one modifier class from each axis to `pathable-split`. The two
axes combine freely. The ratio applies only at 1024 px and wider.

| Axis  | Value           | Class                           | What it is for                                  |
| ----- | --------------- | ------------------------------- | ----------------------------------------------- |
| ratio | `default`       | none                            | Two equal columns                               |
| ratio | `ratio-1-1`     | `pathable-split--ratio-1-1`     | Two equal columns, the same as the default      |
| ratio | `ratio-1-2`     | `pathable-split--ratio-1-2`     | First column one third, second two thirds       |
| ratio | `ratio-2-1`     | `pathable-split--ratio-2-1`     | First column two thirds, second one third       |
| ratio | `ratio-1-3`     | `pathable-split--ratio-1-3`     | First column one quarter, second three quarters |
| align | `default`       | none                            | Regions centred vertically against each other   |
| align | `align-start`   | `pathable-split--align-start`   | Regions aligned to the top of the row           |
| align | `align-center`  | `pathable-split--align-center`  | Centred, the same as the default but stated     |
| align | `align-end`     | `pathable-split--align-end`     | Regions aligned to the bottom of the row        |
| align | `align-stretch` | `pathable-split--align-stretch` | Both regions as tall as the taller one          |

For another ratio, set `--pathable-split-ratio` to a `grid-template-columns`
value, such as `2fr 3fr`. The three custom properties inherit, so a nested
split without its own modifiers takes the outer split's values.

## Tokens

| What                | Token                    |
| ------------------- | ------------------------ |
| Columns at 1024 px+ | `--pathable-split-ratio` |
| Vertical alignment  | `--pathable-split-align` |
| Gap, overridable    | `--pathable-split-gap`   |
| Default gap         | `--space-24`             |

The 24 px gap is the default theme's figure. The 1024 px breakpoint is fixed
in the stylesheet and is not a token.

## Composition

- Put exactly two children in a split. A third child starts a new row at the
  same column widths, and an empty child still keeps its column.
- The breakpoint follows the viewport, not the split's own width. A split
  inside a narrow panel on a wide screen still has two columns; use
  `pathable-stack` there instead.
- Columns are `fr` tracks, so content that cannot shrink, such as a wide
  table or a long unbroken string, can widen its column beyond the ratio.
- The split has no element classes and no padding. Put it inside
  `pathable-container` for a width limit, and give each region its own
  padding or surface.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Reading order. Put the region that should be read first first in the
  source; the split does not reorder for narrow screens.
- Semantics. Use headings and landmarks inside the regions as the content
  needs; the class adds no role.
- Content that fits its column, and checking the layout at 1023 px and
  1024 px, where it changes.
- Padding, background and width around and inside the regions.
