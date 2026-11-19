---
name: SidebarLayout
slug: sidebar-layout
kind: static
summary: A two-column grid that sets main content beside a narrower sidebar on wide viewports and stacks them below 1024 px.
styles-class: pathable-sidebar-layout
variants:
  - axis: ratio
    default: default
    values: [default, ratio-3-1, ratio-2-1, ratio-4-1]
  - axis: order
    default: content-first
    values: [content-first, sidebar-first]
guarantees:
  - id: columns
    status: unverified
    claim: At a viewport width of 1024 px or more, the first child gets three quarters of the width and the second one quarter by default and with ratio-3-1, and two thirds or four fifths with ratio-2-1 or ratio-4-1.
  - id: sidebar-first
    status: unverified
    claim: With sidebar-first, the narrow column is the first one, at 1:3 by default or with ratio-3-1, 1:2 with ratio-2-1 and 1:4 with ratio-4-1.
  - id: collapse
    status: unverified
    claim: At a viewport width of 1023 px or less, every ratio and order collapses to one full-width column with the children in source order.
  - id: gap
    status: unverified
    claim: The space between the columns, and between the regions once they stack, is 24 px.
  - id: equal-height
    status: unverified
    claim: Both regions stretch to the height of the taller one, except a child with pathable-sticky-panel, which keeps its own height.
  - id: custom-properties
    status: unverified
    claim: Setting --pathable-sidebar-ratio or --pathable-sidebar-gap on the layout sets its wide-viewport columns or its gap to that value.
---

# SidebarLayout

A two-column grid that sets main content beside a narrower sidebar on wide
viewports and stacks them below 1024 px. Put the class on a block element with
exactly two children: the main region and the sidebar. It adds no role, no
padding and no border.

## When to use

- A page or panel with one main column and one secondary column: filters
  beside results, related links or a summary beside an article, a help panel
  beside a form.

Use something else when:

- the two regions are peers of similar weight, or need vertical centring:
  use `pathable-split`;
- the sidebar is the application's navigation, with a top bar and a content
  area: use `pathable-app-shell`;
- there are three or more regions or a set of cards: use `pathable-grid` or
  `pathable-card-grid`;
- the regions should always be one above the other: use `pathable-stack`.

To keep the sidebar in view while the main column scrolls, put its content in
`pathable-sticky-panel`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-sidebar-layout">
  <main>
    <h1>Your accommodations</h1>
    <p>Requests you have made and their status.</p>
  </main>
  <aside aria-label="Help">
    <div class="pathable-sticky-panel">
      <p>Questions? Contact your coordinator.</p>
    </div>
  </aside>
</div>
```

## Variants

Add at most one modifier class from each axis to `pathable-sidebar-layout`.
The two axes combine freely. Columns apply only at 1024 px and wider.

| Axis  | Value           | Class                                    | What it is for                                   |
| ----- | --------------- | ---------------------------------------- | ------------------------------------------------ |
| ratio | `default`       | none                                     | Main and sidebar at 3:1                          |
| ratio | `ratio-3-1`     | `pathable-sidebar-layout--ratio-3-1`     | 3:1, the same as the default but stated          |
| ratio | `ratio-2-1`     | `pathable-sidebar-layout--ratio-2-1`     | 2:1, a wider sidebar                             |
| ratio | `ratio-4-1`     | `pathable-sidebar-layout--ratio-4-1`     | 4:1, a narrower sidebar                          |
| order | `content-first` | none                                     | Wide column first, for main content then sidebar |
| order | `sidebar-first` | `pathable-sidebar-layout--sidebar-first` | Narrow column first, for sidebar then content    |

`sidebar-first` swaps the column widths, not the children. It only puts the
sidebar on the left when the sidebar is the first child in the source.

For another ratio, set `--pathable-sidebar-ratio` to a `grid-template-columns`
value in column order, such as `5fr 2fr`, or `2fr 5fr` for a sidebar that
comes first; a value set on the element itself overrides the
`sidebar-first` modifier. Both custom
properties inherit, so a nested layout without its own modifiers takes the
outer layout's values.

## Tokens

| What                | Token                      |
| ------------------- | -------------------------- |
| Columns at 1024 px+ | `--pathable-sidebar-ratio` |
| Gap, overridable    | `--pathable-sidebar-gap`   |
| Default gap         | `--space-24`               |

The 24 px gap is the default theme's figure. The 1024 px breakpoint is fixed
in the stylesheet and is not a token.

## Composition

- Put exactly two children in the layout. A third child starts a new row at
  the same column widths.
- The breakpoint follows the viewport, not the layout's own width.
- Columns are `fr` tracks, so content that cannot shrink, such as a wide
  table, can widen its column beyond the ratio.
- Both regions are as tall as the taller one, which lets a
  `pathable-sticky-panel` inside the sidebar stick while the main column
  scrolls past.
- The layout has no element classes and no padding. Put it inside
  `pathable-container` for a width limit, and give each region its own
  padding or surface.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Source order. Put the region that should be read first first in the
  source, and pair `sidebar-first` with a sidebar that comes first. On narrow
  screens the first child is on top.
- Landmarks. Use `<main>`, `<aside>` or `<nav>` with an accessible name as
  the regions need; the class adds no role.
- Content that fits its column, and checking the layout at 1023 px and
  1024 px, where it changes.
- Padding, background and width around and inside the regions.
