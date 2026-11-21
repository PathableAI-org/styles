---
name: Pagination
slug: pagination
kind: static
summary: A row of page links for moving through a long result set, with the current page marked and previous and next links on wider screens.
styles-class: pathable-pagination
variants: []
guarantees:
  - id: row-layout
    status: unverified
    claim: The list is a single centred row that does not wrap, with no list markers or left padding, and each item is 40 px tall and at least 40 px wide with 4 px of margin on each side.
  - id: page-link-style
    status: unverified
    claim: Each page link has a 1 px border in a faint tint of the text colour, 4 px rounded corners, 8 px of padding and the theme link colour, and on hover or focus its text and border change to the darker hover colour.
  - id: arrows-hidden-narrow
    status: unverified
    claim: The previous and next items are hidden below a viewport width of 640 px, where the page links are the only way to move, and shown from 640 px.
  - id: touch-target
    status: unverified
    claim: At a viewport width of 640 px or narrower, and on a coarse pointer at any width, every link is at least 44 px wide and 44 px tall.
  - id: overflow-mark
    status: unverified
    claim: The overflow item has 8 px of padding and its text cannot be selected.
  - id: current-page
    status: unmet
    claim: A page link with the pathable-current class has a solid background in the theme's dark colour, white text and no visible border, and keeps that look on hover and focus. Today the class does nothing inside a pagination, so the current page looks like the others.
  - id: arrow-spacing
    status: unmet
    claim: From a viewport width of 640 px the previous link has 20 px of margin after it and the next link has 20 px of margin before it. The pathable-pagination__previous-page and pathable-pagination__next-page classes are not in the stylesheet yet.
  - id: arrow-icon-size
    status: unmet
    claim: The arrow icons inside the previous and next links are 18 px wide and 18 px tall. Today an icon with the pathable-icon class is 1em, the size of the text.
---

# Pagination

A row of page links for moving through a long result set, with the current page
marked and previous and next links on wider screens. Put the class on a
`<nav>` that holds a list of page links. The class adds no state: the
application decides which page is current and what each link does.

## When to use

- A list of participants, cases or appointments that the application splits
  into numbered pages.
- A result set where the reader needs to jump to a page by number as well as
  step one page at a time.

Use something else when:

- the reader moves one step at a time through a short, known sequence: use a
  pair of `pathable-button` links;
- the items load as the reader scrolls or by a "show more" button: use a
  button, not page links;
- the trail shows where the page sits in the site: use `pathable-breadcrumb`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: default -->

## States

Each state is complete markup for one point in a result set. Copy the one
closest to what you need. Which links and overflow marks appear is the
application's choice; these follow the usual pattern: all pages when there are
seven or fewer, otherwise the first and last page, the pages beside the current
page and an overflow mark for each gap. The unbounded state is for a result set
whose last page is not known.

<!-- examples -->

## Variants

The pagination has no modifier classes. The first page, the last page and an
unbounded result set differ in which items the markup holds, not in classes.

## Composition

- `pathable-pagination`: the `<nav>`. Give it an `aria-label` that names what
  is being paged, such as `Participant list pages`.
- `pathable-pagination__list`: the `<ul>`. Add `role="list"`: the items draw
  no markers, and the explicit role keeps the list announced in Safari.
- `pathable-pagination__item`: one `<li>` per page link, arrow or overflow
  mark. Every item has it.
- `pathable-pagination__link`: the `<a>` in each page item and each arrow
  item. In a page item it is drawn as a bordered button; in an arrow item it
  is plain link text.
- `pathable-pagination__arrow`: added to the previous and next items. They
  are hidden below 640 px, so the page links must be enough on their own.
- `pathable-pagination__previous-page` and `pathable-pagination__next-page`:
  added to the previous and the next link, to space them from the page links.
  Not in the stylesheet yet; see Guarantees.
- `pathable-pagination__overflow`: an item that stands for pages left out. Its
  content is a `…` in a `<span>` with `aria-hidden="true"`, so screen readers
  skip it; the gap is understood from the page numbers either side.
- `pathable-current`: added to the link of the current page, together with
  `aria-current="page"`. Not styled in a pagination yet; see Guarantees.
- Show the previous link only when there is a previous page, and the next link
  only when there is a next page. The first-page and last-page states show
  this.
- Arrows are inline `<svg>` elements with the `pathable-icon` class, a
  `viewBox` and `aria-hidden="true"` with `focusable="false"`. The package
  does not ship an icon sprite.
- The 640 px breakpoint follows the viewport, not the container.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

Three guarantees are unmet today: the current page is not drawn differently
(`current-page`), the previous and next links sit hard against the page links
(`arrow-spacing`) and the arrow icons are the size of the text
(`arrow-icon-size`). Keep `aria-current="page"` on the current link all the
same: it carries the meaning for assistive technology and for tests.

## The consumer owns

- Which page is current, how many pages there are and where each link goes.
- The current page's mark: the `pathable-current` class and
  `aria-current="page"`, on the same link.
- Accessible names. Give each page link a name that includes its number and
  differs from every other link: put the word "Page" in a `pathable-sr-only`
  span before the number, with the space inside the span, so "3" is read as
  "Page 3". Do the same for the last page ("Last page, page 24") and for the
  previous and next links ("Previous page", "Next page"). Do not use an
  `aria-label` that replaces the visible text.
- The label of the `<nav>`, in the page's language. Two pagination
  landmarks on one page need different labels.
- Which items to show for a long set, and when to switch to the unbounded
  state.
- Focus after a page change: move it to the start of the new results when the
  page does not reload.
