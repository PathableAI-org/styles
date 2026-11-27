---
name: Layout grid
slug: utilities-layout-grid
kind: utility
summary: A 12-column, mobile-first flexbox grid made of a container, rows, columns, gaps and offsets, with the same unprefixed class names USWDS uses.
uswds: https://designsystem.digital.gov/utilities/layout-grid/
classes:
  - grid-container
  - grid-container-<width>
  - grid-row
  - grid-col
  - grid-col-auto
  - grid-col-fill
  - grid-col-<1-12>
  - grid-gap
  - grid-gap-<size>
  - grid-offset-<1-12>
  - grid-offset-none
guarantees:
  - id: container
    claim: grid-container is centred with auto left and right margins, has a max-width of 64rem and 1rem of left and right padding, and the padding is 2rem from a viewport width of 64em.
  - id: row
    claim: grid-row is a flex container (display flex) whose items wrap (flex-wrap wrap).
  - id: columns
    claim: grid-col-6 has a width of 50% and flex 0 1 auto, grid-col-12 has a width of 100%, and grid-col has flex 1 1 0%, width auto, max-width 100% and min-width 1px.
  - id: gap
    claim: grid-row grid-gap has left and right margins of -0.5rem and its direct children have left and right padding of 0.5rem, and from a viewport width of 64em the margins are -1rem and the padding is 1rem.
  - id: gap-sizes
    claim: grid-row grid-gap-lg has margins of -0.75rem with 0.75rem of child padding, and grid-row grid-gap-sm has margins of -1px with 1px of child padding.
  - id: offset
    claim: grid-offset-3 sets margin-left to 25%, and grid-offset-none sets margin-left to 0.
  - id: responsive
    claim: tablet:grid-col-4 sets a width of 33.3333333333% only from a viewport width of 40em (640px).
---

# Layout grid

A 12-column, mobile-first flexbox grid made of a container, rows, columns, gaps
and offsets, with the same unprefixed class names USWDS uses. Every class here
is `grid-*` with no `pathable-` prefix, because USWDS names none of them with a
component prefix: `grid-container`, `grid-row`, `grid-col-*`, `grid-gap*` and
`grid-offset-*` stay exactly as in the USWDS documentation.

## When to use

- Page-level layout that changes at the `mobile-lg`, `tablet` and `desktop`
  breakpoints: a main column beside a sidebar, a row of cards, a form split
  into two columns.
- A page width and side margin that match the rest of the application.

Use something else when:

- items only need to sit in a row or column and share space: use the
  [flex utilities](utilities-flex.md), which need no container, row or column
  classes;
- a block only needs to be centred or have a width: use
  [margin and padding](utilities-margin-and-padding.md) and
  [height and width](utilities-height-and-width.md).

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: responsive-columns -->

## Classes

Columns must be direct children of a `grid-row`, and a `grid-row` should sit
inside a `grid-container` (or any wrapper that provides the page width). Rows
and columns have no gutter until the row carries a gap class.

| Class pattern            | Property                                                           | Values                                                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `grid-container`         | `margin-x: auto`, `max-width`, `padding-x`, `box-sizing`           | max-width `64rem` (`desktop`), which includes the padding (`border-box`); padding 1rem (units 2), 2rem (units 4) from 64em                                                                |
| `grid-container-<width>` | the same, with another `max-width`                                 | `card` 10rem, `card-lg` 15rem, `mobile` 20rem, `mobile-lg` 30rem, `tablet` 40rem, `tablet-lg` 55rem, `desktop` 64rem, `desktop-lg` 75rem, `widescreen` 87.5rem                            |
| `grid-row`               | `display: flex`, `flex-wrap: wrap`, `box-sizing: border-box`       | none                                                                                                                                                                                      |
| `grid-col`               | `flex: 1 1 0%`, `width: auto`, `max-width: 100%`, `min-width: 1px` | equal-width columns that share the row; every `grid-col` class is `border-box`, so gap padding is inside its width                                                                        |
| `grid-col-auto`          | `flex: 0 1 auto`, `width: auto`, `max-width: 100%`                 | a column as wide as its content                                                                                                                                                           |
| `grid-col-fill`          | `flex: 1 1 0%`, `width: auto`, `max-width: 100%`, `min-width: 1px` | a column that takes the remaining width                                                                                                                                                   |
| `grid-col-<n>`           | `flex: 0 1 auto`, `width`                                          | `n` from 1 to 12: width is `n` / 12 of the row (`grid-col-6` is 50%, `grid-col-4` is 33.3333333333%)                                                                                      |
| `grid-gap`               | negative `margin-x` on the row, `padding-x` on its direct children | the children are `border-box`; 0.5rem each side below 64em, 1rem each side from 64em (a 16px gutter, then 32px)                                                                           |
| `grid-gap-<size>`        | the same, with a fixed gutter                                      | `0`, `2px`, `05` (4px), `1` (8px), `2` (16px), `3` (24px), `4` (32px), `5` (40px), `6` (48px), and the named sizes `sm` (2px), `md` (16px), `lg` (24px). The gutter is twice the padding. |
| `grid-offset-<n>`        | `margin-left`                                                      | `n` from 1 to 12: `n` / 12 of the row; `grid-offset-none` is `0`                                                                                                                          |

Put `grid-gap` classes on the `grid-row`, not on a column. A row with a gap
class sets negative side margins so the first and last column line up with the
container's content edge.

The values these classes take are defined by the design tokens: [Spacing units](tokens-spacing-units.md) and [Flex](tokens-flex.md).

## Variants

- **Responsive.** `mobile-lg:`, `tablet:` and `desktop:` prefixes (480px,
  640px and 1024px, `min-width`, mobile first) are output for
  `grid-container`, `grid-container-<width>`, `grid-col`, `grid-col-auto`,
  `grid-col-fill`, `grid-col-<n>`, `grid-offset-<n>`, `grid-offset-none` and
  `grid-gap-<size>`. The gap prefix goes on the gap class, such as
  `grid-row tablet:grid-gap-4`; a bare `grid-gap` and `grid-row` have no
  responsive variant.
  `card:`, `card-lg:`, `mobile:`, `tablet-lg:`, `desktop-lg:` and
  `widescreen:` are not output.
- **State.** None. The layout grid has no `hover:`, `focus:`, `active:` or
  `visited:` variants.

Stack columns on a phone and place them side by side later by giving each
column a full width first, then a narrower one at a breakpoint:
`grid-col-12 tablet:grid-col-6`. A bare `tablet:grid-col-6` leaves the column
as wide as its content below the tablet breakpoint.

## States

Each state is complete markup for one use of the grid. Copy the one closest to
what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states the CSS a class compiles to at PathAble defaults. The widths are the values the compiled
stylesheet outputs at a 16px root font size.

## The consumer owns

- The page structure: whether a region is a `<main>`, `<nav>` or `<aside>`, and
  the reading order. A grid changes layout, not source order; keep the source
  order logical for keyboard and screen reader users and do not rely on
  [`order-*`](utilities-flex.md) to fix it.
- Content that fits a column at the narrowest width it appears at, including
  long words and tables.
- Which breakpoint each column changes at.
- Vertical spacing between rows: add [margin](utilities-margin-and-padding.md)
  to rows or columns.
