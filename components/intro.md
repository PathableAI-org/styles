---
name: Intro
slug: intro
kind: static
summary: A large lead-text style for the sentence that introduces a page, set wider than body text and with generous line spacing.
styles-class: pathable-intro
variants: []
guarantees:
  - id: size
    status: unverified
    claim: The font size is 1.49rem at every viewport width, which is 23.84 px with a 16 px root size, at weight 400.
  - id: line-height
    status: unverified
    claim: The line height is 1.8 times the font size.
  - id: measure
    status: unverified
    claim: The intro is at most 88ex wide and is narrower when its container is.
  - id: no-box
    status: unverified
    claim: The class sets no margin, padding or colour, so the element keeps the margins other rules give it and, outside `pathable-section--dark` and `pathable-dark-background`, the colour of its parent.
---

# Intro

A large lead-text style for the sentence that introduces a page, set wider
than body text and with generous line spacing. Put the class on the `<p>`
directly under the page's main heading. It adds no role and no semantics.

## When to use

- One short lead sentence under the headline of a marketing, landing or
  overview page.
- A summary that tells the reader what the page is for before the body text.

Use something else when:

- the text is the headline itself: use `pathable-display` on a marketing page
  or `pathable-heading` with `pathable-heading--level-1` in application UI;
- the text is ordinary body copy, or runs to more than one sentence: use
  `pathable-text` with `pathable-paragraph`;
- one phrase needs emphasis: use `pathable-text-highlight` on a `<span>`
  inside the intro.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<h1 class="pathable-heading pathable-heading--level-1">Your training plan</h1>
<p class="pathable-intro">
  Three short modules prepare you for your first shift.
</p>
```

## Variants

This component has no variants. The size is the same at every viewport width.

## Tokens

None. The typeface, size, weight and line height are fixed in the stylesheet,
and a theme does not change them. Today the intro is set in Fredoka, the
heading typeface.

## Composition

- Put one sentence of plain text inside. Inline links and one
  `pathable-text-highlight` span are fine. There are no element classes.
- Use one intro per page, directly after the main heading.
- The class sets no margin, so a `<p>` keeps the browser's 1em top and bottom
  margins. Remove them, for example with `pathable-margin-0`, before you space
  the intro from the heading and the body text with the layout, such as
  `pathable-stack` with a gap modifier; otherwise the margins add to the gap.
- Inside `pathable-section--dark` or `pathable-dark-background`, an intro on a
  `<p>` is white, whatever colour you set on the container.
- The 88ex limit is wider than the 68ex of `pathable-paragraph`, so the intro
  can run wider than the body text below it.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Accessibility. Use a `<p>`, not a heading element: the intro is not a
  heading.
- The text colour and its contrast against the background behind it.
- Keeping the intro to one sentence, in sentence case. The intro is set in
  Fredoka, the heading typeface, and the brand rules ask for body text styling
  for anything longer than one sentence.
- Spacing and alignment around it; do not centre an intro that wraps to more
  than three lines.
