---
name: SrOnly
slug: sr-only
kind: static
summary: Hides an element visually so it is not seen but is still read by screen readers.
styles-class: pathable-sr-only
variants: []
guarantees:
  - id: visually-hidden
    status: met
    claim: The element is a 1px box clipped to nothing, so it is not visible and takes up no space in the layout.
  - id: still-exposed
    status: unverified
    claim: The class sets no display, visibility or opacity, so the element and its text stay in the accessibility tree.
  - id: no-scroll
    status: met
    claim: The element adds no horizontal scroll to the page or to any scrolling container, in left-to-right and right-to-left pages alike.
  - id: stays-hidden-on-focus
    status: unverified
    claim: An element with the class stays hidden when it receives focus.
---

# SrOnly

Hides an element visually so it is not seen but is still read by screen
readers.

<!-- package: styles -->

Put the class on a `<span>` of text that adds context sighted users get from
the layout.

<!-- /package -->

<!-- package: react -->

Wrap text that adds context sighted users get from the layout in `<SrOnly>`,
which renders a `<span>` with the `pathable-sr-only` class.

<!-- /package -->

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

<!-- package: styles -->

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- /package -->

<!-- package: react -->

Import `SrOnly` from `@pathableai/react`. The package entry point loads the
styles it needs; no JavaScript runs in the browser.

<!-- /package -->

<!-- example: inline -->

## States

<!-- examples -->

## Variants

The component has no modifiers.

## Tokens

None.

## Composition

- Put text, or an element that holds text, inside. Do not put focusable
  content inside: it stays hidden when focused, so a keyboard user cannot
  see where focus is.
- The element stays where it sits in the markup, as a clipped 1px box. It
  does not depend on the page's direction, a positioned ancestor or a scroll
  container.
- Start hidden text with a space, as in the example, when it continues a
  visible phrase, so screen readers do not run the words together.

<!-- package: styles -->

The element has no element classes.

<!-- /package -->

<!-- package: react -->

`SrOnly` renders a `<span>` by default. Use `as` to render a `<p>` or a
heading from `h2` to `h6`, as in the heading state. It accepts no `tabIndex`,
because the element must not receive focus. Do not add `pathable-sr-only` to
elements by hand.

<!-- /package -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The element is `position: absolute`, 1px by 1px with a `-1px` margin, and
clipped with `clip-path: inset(50%)`. `white-space: nowrap` stops its text
wrapping inside the 1px box, so a screen reader reads it as one run.

## The consumer owns

- Accessibility. Hidden text must agree with what the page shows, and must not
  hide information sighted users need.
- The wording, in the user's language, and keeping it short.
- Not using the class on focusable elements.
