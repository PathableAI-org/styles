---
name: Breadcrumb
slug: breadcrumb
kind: static
summary: A secondary navigation trail that shows the path from the top of the site to the current page, as a row of links ending in the current page's name.
styles-class: pathable-breadcrumb
variants:
  - axis: wrap
    default: default
    values: [default, wrap]
guarantees:
  - id: single-line
    status: unverified
    claim: From a viewport width of 480 px the trail sits on one line, each item but the last is followed by a chevron separator, and a trail wider than its container is cut off with an ellipsis instead of wrapping.
  - id: narrow-parent-link
    status: unverified
    claim: Below a viewport width of 480 px only the parent link, the item before the current page, is shown, with a back arrow before it; the other items are hidden from view and stay in the page for screen readers.
  - id: link-style
    status: unverified
    claim: Each link is in the theme link colour with no underline on the link itself, the underline is drawn under its text only, and the link changes to the darker hover colour on hover.
  - id: spacing
    status: unverified
    claim: From a viewport width of 480 px the trail has 16 px of padding above and below and none at the sides, and its list has 4 px of padding with a matching negative margin so a focus ring on the first link is not clipped.
  - id: wrap
    status: unmet
    claim: With the wrap modifier the trail wraps onto further lines at every width instead of being cut off with an ellipsis, each item stays whole, and lines are 1.5 times the font size apart. The pathable-breadcrumb--wrap class is not in the stylesheet yet.
---

# Breadcrumb

A secondary navigation trail that shows the path from the top of the site to
the current page, as a row of links ending in the current page's name. Put the
class on a `<nav>` that holds an ordered list of items. The current page is the
last item, marked with `aria-current="page"`, and is not a link.

## When to use

- A record or page that sits several levels down, such as a participant's
  employment plan inside their case file, where the reader needs a way back up.
- A site whose sections nest in a fixed hierarchy that the reader can
  predict.

Use something else when:

- the reader moves sideways between pages of the same level: use
  `pathable-sidenav` or `pathable-pagination`;
- the trail would be one item long: leave it out;
- the items are steps of a process: use `pathable-process-list`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: default -->

## States

Each state is complete markup for one use of the trail. Copy the one closest to
what you need.

<!-- examples -->

## Variants

Add the modifier class to `pathable-breadcrumb`.

| Axis | Value     | Class                       | What it is for                                                 |
| ---- | --------- | --------------------------- | -------------------------------------------------------------- |
| wrap | `default` | none                        | One line; a trail wider than its container ends in an ellipsis |
| wrap | `wrap`    | `pathable-breadcrumb--wrap` | Long page names that should wrap instead of being cut off      |

The wrap modifier is not in the stylesheet yet; see Guarantees.

## Composition

- `pathable-breadcrumb`: the `<nav>`. Give it an `aria-label` such as
  `Breadcrumb`.
- `pathable-breadcrumb__list`: the `<ol>`. The order of the items is
  meaningful, so use an ordered list.
- `pathable-breadcrumb__list-item`: one `<li>` per level, in order from the
  top to the current page.
- `pathable-breadcrumb__link`: the `<a>` in every item except the last. Put
  the link text in a `<span>` inside the link: the underline is drawn under
  the span so it does not run past the text.
- The last item holds the current page's name as plain text, not a link, and
  carries `aria-current="page"` on the `<li>`.
- The separators and the back arrow are drawn by the stylesheet; do not add
  icons or separator characters to the markup.
- The 480 px breakpoint follows the viewport, not the trail's container, and
  is set as 30em, which is 480 px at the browser's default 16 px font size.
- Below 480 px the stylesheet shows only the parent link as a back link. The
  trail needs at least two items for that to work.
- The trail has no behaviour of its own. It collapses with CSS only and needs
  no JavaScript.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

The `wrap` guarantee is unmet. Today a trail cannot be told to wrap on a wide
screen: a long trail is always cut off with an ellipsis, and the full text
stays in the document.

## The consumer owns

- The links: where each one goes and the text it shows. Use the page's
  title, not a generic word such as "Back".
- The hierarchy: which levels appear and in what order. Keep it the same
  as the site's real structure.
- The landmark label: an `aria-label` on the `<nav>` that names the trail in
  the page's language. Two navigation landmarks on one page need different
  labels.
- Marking the last item with `aria-current="page"`.
- Space above and below the trail beyond its own padding.
