---
name: SrOnly
slug: sr-only
kind: static
summary: A utility class that moves an element off screen so it is not seen but is still read by screen readers.
styles-class: pathable-sr-only
variants: []
guarantees:
  - id: off-screen
    status: unverified
    claim: The element is absolutely positioned 999em to the left of its containing block, so it is not visible and takes up no space in the layout.
  - id: still-exposed
    status: unverified
    claim: The class sets no display, visibility, opacity, size or clipping, so the element and its text stay in the accessibility tree.
  - id: natural-size
    status: unverified
    claim: The element keeps the width and height of its content off screen.
  - id: no-ltr-scroll
    status: unverified
    claim: In a left-to-right page the element adds no horizontal scroll to the page.
  - id: stays-hidden-on-focus
    status: unverified
    claim: An element with the class stays off screen when it receives focus.
---

# SrOnly

A utility class that moves an element off screen so it is not seen but is
still read by screen readers. Put the class on a `<span>` of text that adds
context sighted users get from the layout.

## When to use

- A control whose visible text is ambiguous out of context, such as several
  "Edit" links in a table: add the row's name in hidden text.
- Status text for assistive technology beside a visual indicator that is
  hidden from it, such as a `pathable-save-status`.
- A heading for a region whose purpose is obvious visually.

Use something else when:

- the content should be hidden from everyone: use the `hidden` attribute;
- the element can receive focus, such as a skip link: use `pathable-skipnav`,
  which is shown when focused;
- sighted users would also benefit from the text: show it, for example with
  `pathable-label` or `pathable-hint`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<a href="/participants/42/edit">
  Edit<span class="pathable-sr-only"> Jordan Lee's profile</span>
</a>
```

## Variants

The component has no modifiers.

## Tokens

None.

## Composition

- Put text, or an element that holds text, inside. Do not put focusable
  content inside: it stays off screen when focused, so a keyboard user cannot
  see where focus is.
- The element is positioned against its nearest positioned ancestor. Inside
  an ancestor with `overflow: hidden` it is clipped from view, which is still
  hidden and still read.
- Start hidden text with a space, as in the example, when it continues a
  visible phrase, so screen readers do not run the words together.
- In a right-to-left page the off-screen element extends the page's
  horizontal scroll by about 999em. On such a page, hide text another way.
- The element has no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The offset is in `em`, so it is measured from the element's own font size:
999 times that size.

## The consumer owns

- Accessibility. Hidden text must agree with what the page shows, and must not
  hide information sighted users need.
- The wording, in the user's language, and keeping it short.
- Not using the class on focusable elements or on content inside a right-to-
  left page.
