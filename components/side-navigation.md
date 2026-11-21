---
name: Side navigation
slug: side-navigation
kind: static
summary: A vertical list of links to the pages in a section, with the current page marked and sub-pages nested below their parent.
styles-class: pathable-sidenav
variants: []
guarantees:
  - id: list
    claim: The list has no bullets, margin or padding, and a 1 px light grey border below the last item.
  - id: item-divider
    claim: Each list item has a 1 px light grey border above it, including items in a nested list.
  - id: link-box
    claim: Each link is a block with 8 px of padding above and below and 16 px on the left and right, no underline and Nunito at the small text size.
  - id: link-colour
    claim: A link that is not the current page is dark grey with a contrast of at least 4.5:1, turns the theme link colour and gains a light background while hovered.
  - id: current
    claim: The current link is bold in the theme link colour, with a 4 px bar in the same colour along its left edge.
  - id: sublist
    claim: A nested list uses the smaller text size and indents its links a further 16 px for each level of nesting.
  - id: focus-ring
    claim: When a link is focused with the keyboard, it has a 2 px solid outline in the theme's focus ring colour with no offset, so the outline stays inside the list.
---

# Side navigation

A vertical list of links to the pages in a section, with the current page
marked and sub-pages nested below their parent. Put the `<nav>` element around
a `<ul class="pathable-sidenav">` of `<li class="pathable-sidenav__item">`
items, each holding one `<a>`. The `<nav>` is a landmark, so give it an
`aria-label`.

## When to use

- Moving between the pages of one section, such as the settings pages of an
  account or the topics in a help centre.
- A hierarchy of up to three levels beside the page content.

Use something else when:

- the links are the main navigation of the whole site: use the header;
- the links move through a sequence of results: use `pathable-pagination`;
- the links show where the person is in a hierarchy as a trail: use
  `pathable-breadcrumb`.

## Example

<!-- package: styles -->

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- /package -->

<!-- example: default -->

## States

Each state is complete markup for one use of the side navigation. Copy the one
closest to what you need.

<!-- examples -->

## Variants

The side navigation has no modifier classes: there is one look. Depth is set
by nesting, not by a class.

## Composition

- `nav[aria-label]`: the landmark. Use a name that differs from the site's
  other navigation landmarks.
- `pathable-sidenav`: the top-level `<ul>`.
- `pathable-sidenav__item`: each `<li>`, at every level.
- `pathable-sidenav__sublist`: a nested `<ul>`, placed inside the `<li>` of
  its parent link, after the link.
- `pathable-current`: on the `<a>` of the current page. Put it also on the
  link of each parent section of the current page, which shows the path to
  it.
- `aria-current="page"`: on the one link for the page the person is on.
- The links are plain `<a>` elements with no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour.

The colours come from the theme, so a themed application may show other
colours; the figures on this page are those of the default theme.

## The consumer owns

- The `aria-label` of the `<nav>`, and keeping it unique among the page's
  navigation landmarks.
- Which link is current: the `pathable-current` class and `aria-current` must
  move with the page.
- Link targets, and link text that makes sense out of context.
- Keeping the list short and the nesting to three levels at most.
- Placing the navigation beside or above the page content and its behaviour at
  narrow widths.
