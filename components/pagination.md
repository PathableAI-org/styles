---
name: Pagination
slug: pagination
kind: static
summary: A row of page links for moving through a long result set, with the current page marked and previous and next links on wider screens.
styles-class: pathable-pagination
variants: []
guarantees:
  - id: row-layout
    claim: The list is a single centred row that does not wrap, with no list markers or left padding, and each list item is 40 px tall and at least 40 px wide with 4 px of margin on each side.
  - id: page-link-style
    claim: Each numbered page button (`pathable-pagination__button`) has a 1 px border in a faint tint of the text colour, 4 px rounded corners, 8 px of padding and the theme link colour, and on hover or focus its text and border change to the darker hover colour.
  - id: arrows-hidden-narrow
    claim: The previous and next items (`pathable-pagination__arrow`) are hidden below a viewport width of 640 px, where the page links are the only way to move, and shown from 640 px.
  - id: touch-target
    claim: At a viewport width of 640 px or narrower, and on a coarse pointer at any width, every button and arrow link is at least 44 px wide and 44 px tall.
  - id: overflow-mark
    claim: The overflow item (`pathable-pagination__overflow`) has 8 px of padding and its text cannot be selected.
  - id: current-page
    claim: A numbered page button with the pathable-current class has a solid background in the theme's dark colour, white text and no visible border, and keeps that look on hover and focus.
  - id: arrow-spacing
    claim: From a viewport width of 640 px the previous link has 20 px of margin after it and the next link has 20 px of margin before it.
  - id: arrow-icon-size
    claim: The arrow icons inside the previous and next links are 18 px wide and 18 px tall.
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
- `pathable-pagination__list`: the `<ul>`.
- `pathable-pagination__item`: one `<li>` per page button, arrow or overflow
  mark. Every item has it.
- `pathable-pagination__page-no`: added to each `<li>` that holds a numbered
  page button.
- `pathable-pagination__button`: the `<a>` of a numbered page, drawn as a
  bordered button. Its `aria-label` names the page ("Page 9"), and the last
  page is "Last page, page 24".
- `pathable-pagination__arrow`: added to the previous and next `<li>`. They
  are hidden below 640 px, so the numbered pages must be enough on their own.
- `pathable-pagination__link`: the `<a>` in each arrow item, drawn as plain
  link text. Its `aria-label` is "Previous page" or "Next page".
- `pathable-pagination__previous-page` and `pathable-pagination__next-page`:
  added to the previous and the next link, to space them from the page
  buttons.
- `pathable-pagination__link-text`: the `<span>` that holds the visible
  "Previous" or "Next" inside the arrow link, beside the icon.
- `pathable-pagination__overflow`: an item that stands for pages left out. It
  holds a `…` in a `<span aria-hidden="true">` and a `pathable-sr-only` span
  reading "ellipsis indicating non-visible pages".
- `pathable-current`: added to the numbered page button of the current page,
  together with `aria-current="page"`.
- Show the previous link only when there is a previous page, and the next link
  only when there is a next page. The first-page and last-page states show
  this.
- Arrows are `<svg>` elements with the `pathable-icon` class,
  `aria-hidden="true"` and `role="img"`, that reference the icon sprite with
  `<use href="/assets/img/sprite.svg#navigate_before">` or `#navigate_next`.
- The 640 px breakpoint follows the viewport, not the container.

## Guarantees

The guarantees are the list in the front matter at the top of this page. The
pixel figures assume a 16 px root font size, and the breakpoint follows the
viewport.

## The consumer owns

- Which page is current, how many pages there are and where each link goes.
- The current page's mark: the `pathable-current` class and
  `aria-current="page"`, on the same link.
- Accessible names, in the page's language. Give each numbered page button an
  `aria-label` with its number that differs from every other link ("Page 3"),
  the last page "Last page, page 24", and the arrow links "Previous page" and
  "Next page". Each label starts with the visible text.
- The label of the `<nav>`, in the page's language. Two pagination
  landmarks on one page need different labels.
- Which items to show for a long set, and when to switch to the unbounded
  state.
- Focus after a page change: move it to the start of the new results when the
  page does not reload.
