---
name: SummaryBox
slug: summary-box
kind: static
summary: A bordered box with a heading and a short body that gives a reader the key points to know or act on.
styles-class: pathable-summary-box
variants: []
guarantees:
  - id: box-surface
    status: unverified
    claim: The box has 24 px of padding on every side, a 1 px solid border and 4 px rounded corners, on a light information-blue background with the theme text colour.
  - id: heading
    status: unverified
    claim: The heading has no top margin and an 8 px bottom margin, and is set in the larger heading size of the component, not the browser's default for its element.
  - id: text-margins
    status: unverified
    claim: The body text has no top or bottom margin, so a paragraph or list in it adds no space of its own above or below.
  - id: following-gap
    status: unverified
    claim: A box that follows another element in the same parent starts 16 px below it; a box that is the first child of its parent has no top margin.
  - id: list-last-margin
    status: unverified
    claim: A pathable-list that is the last child of the body text has no bottom margin, so the box's 24 px padding is the only space below the last item.
  - id: link-colours
    status: unverified
    claim: A link in the box has the theme link colour with a contrast ratio of at least 4.5 to 1 against the box background, and a different colour while hovered.
---

# SummaryBox

A bordered box with a heading and a short body that gives a reader the key
points to know or act on. Put the class on a `<section>` that holds a
`pathable-summary-box__heading` and a `pathable-summary-box__text`. The box
adds no role and no label: name it yourself.

## When to use

- A few facts a participant must know before an appointment, such as what to
  bring and how to reschedule.
- The one or two next steps on a page, set apart from the running text.
- A short recap of what changed in a plan or a case record.

Use something else when:

- the message is an alert, a success or an error: use the alert component;
- the content is a set of links to other pages: use navigation;
- the content is long or dense: use plain content under a heading, or
  `pathable-process-list` for ordered steps;
- the content is a form or a group of fields: use `pathable-fieldset`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: default -->

## States

Each state is complete markup for one use of the box. Copy the one closest to
what you need.

<!-- examples -->

## Variants

The box has no modifier classes: there is one look. Change its content, not its
class.

## Composition

- `pathable-summary-box__heading`: the heading, an `<h3>` in the examples.
  Choose the level that follows the page's heading outline.
- `pathable-summary-box__text`: the body. Put it on a `<div>` that holds a
  `pathable-list`, or on a `<p>` for one sentence.
- `pathable-summary-box__link`: a link inside the body, in the box's own link
  colours. A plain `pathable-link` also works but does not follow the box
  background.
- `pathable-list`: the list of key points. A `pathable-list` that ends the
  body adds no bottom margin.
- There is no wrapper element around the heading and body. Both are direct
  children of the box, and the box needs no `pathable-summary-box__body`
  element.
- A box that follows a sibling is 16 px below it. Place the box inside a
  `pathable-stack` when the page needs another gap.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

The colours come from the theme, so a themed application may show other
colours; the figures on this page are those of the default theme.

## The consumer owns

- The landmark and its name. The examples use a `<section>` named by its
  heading through `aria-labelledby`, which a screen reader exposes as a
  region. Give each heading a literal `id` that is unique on the page. Use a
  `<section>` with this label only when the box deserves a place in the
  landmark list; two or three on a page is a sensible limit.
- The heading level, which must follow the page outline.
- The content: keep it short, and put the most important point first.
- Link targets, and link text that makes sense out of context.
