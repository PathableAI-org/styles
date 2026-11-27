---
name: Summary box
slug: summary-box
kind: static
summary: A bordered box with a heading and a short body that gives a reader the key points to know or act on.
styles-class: pathable-summary-box
variants: []
guarantees:
  - id: box-surface
    claim: The box has 24 px of padding on every side, a 1 px solid border and 4 px rounded corners, on a light information-blue background with the theme text colour.
  - id: heading
    claim: The heading has no top margin and an 8 px bottom margin, and is set in the larger heading size of the component, not the browser's default for its element.
  - id: text-margins
    claim: The text has no top or bottom margin, so a paragraph or list in it adds no space of its own above or below.
  - id: following-gap
    claim: A box that follows another element in the same parent starts 16 px below it; a box that is the first child of its parent has no top margin.
  - id: list-last-margin
    claim: A pathable-list that is the last child of the text has no bottom margin, so the box's 24 px padding is the only space below the last item.
  - id: link-colours
    claim: A link in the box has the theme link colour with a contrast ratio of at least 4.5 to 1 against the box background, and a different colour while hovered.
---

# Summary box

A bordered box with a heading and a short body that gives a reader the key
points to know or act on. Put the class on a `<section>` with an `aria-labelledby` that points at the
heading; a named section is a region landmark. Inside it, a
`pathable-summary-box__body` holds a `pathable-summary-box__heading` and a
`pathable-summary-box__text`.

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

- `pathable-summary-box`: the `<section aria-labelledby>`, the box
  itself.
- `pathable-summary-box__body`: the `<div>` inside the box that holds the
  heading and the text.
- `pathable-summary-box__heading`: the heading, an `<h3>` in the examples,
  with a literal `id` that the box's `aria-labelledby` names. Choose the level
  that follows the page's heading outline.
- `pathable-summary-box__text`: the body text. It is a `<div>` that holds a
  `pathable-list` or paragraphs.
- `pathable-summary-box__link`: a link inside the text, in the box's own link
  colours. A plain `pathable-link` also works but does not follow the box
  background.
- `pathable-list`: the list of key points. A `pathable-list` that ends the
  text adds no bottom margin.
- A box that follows a sibling is 16 px below it. Set another gap with a margin
  utility when the page needs one.

## Guarantees

The guarantees are the list in the front matter at the top of this page. The
colours come from the theme, so a themed application may show other colours;
the figures on this page are those of the default theme.

## The consumer owns

- The region's name. The box is a `<section>`, a region landmark named by its heading
  through `aria-labelledby`. Give each heading a literal `id` that is unique
  on the page. Keep to two or three boxes on a page, because each is a
  landmark.
- The heading level, which must follow the page outline.
- The content: keep it short, and put the most important point first.
- Link targets, and link text that makes sense out of context.
