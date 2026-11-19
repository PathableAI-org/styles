---
name: Display
slug: display
kind: static
summary: A large headline style for the top of a marketing or landing page that grows in two steps as the viewport widens.
styles-class: pathable-display
variants: []
guarantees:
  - id: responsive-size
    status: unverified
    claim: The font size is 1.12rem below a 480 px viewport, 1.49rem from 480 px and 1.99rem from 640 px, which is 17.92, 23.84 and 31.84 px with a 16 px root size.
  - id: typeface
    status: unverified
    claim: The text is set in Fredoka with a line height of 1.4 times the font size at every viewport width.
  - id: spacing
    status: unverified
    claim: The display has no bottom margin, and no top margin when it is the first child.
  - id: clears-floats
    status: unverified
    claim: The display clears floats on both sides.
  - id: inherits-colour
    status: unverified
    claim: The display sets no colour, so outside `pathable-section--dark` and `pathable-dark-background` its text is the colour of its parent.
  - id: regular-weight
    status: unmet
    claim: The display is set in Fredoka at its regular weight, 400.
---

# Display

A large headline style for the top of a marketing or landing page that grows
in two steps as the viewport widens. Put the class on the page's `<h1>`, or on
the heading of a hero section. It adds no role and no semantics of its own.

## When to use

- The one headline of a marketing page, landing page or hero section.
- A short statement of a few words.

Use something else when:

- the heading is a page title or section heading in application UI: use
  `pathable-heading` with `pathable-heading--level-1`, which stays 2rem (32 px
  at a 16 px root) at every width and takes its typeface and colour from the
  theme;
- the text is the lead paragraph under the headline: use `pathable-intro`;
- the text is longer than one sentence: use body text, such as
  `pathable-text`;
- one phrase in the headline needs emphasis: use `pathable-text-highlight`
  on a `<span>` inside it.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<section class="pathable-section">
  <h1 class="pathable-display">Find work that fits you</h1>
  <p class="pathable-intro">
    PathAble matches your skills to employers who are ready to hire.
  </p>
</section>
```

## Variants

This component has no variants. The size changes with the viewport width only.

## Tokens

None. The typeface, size and line height are fixed in the stylesheet, and a
theme does not change them. The display sets no colour; set the colour on it or
on its container.

## Composition

- Put short plain text inside, optionally with one `pathable-text-highlight`
  span. There are no element classes.
- Use one display per page or hero.
- The display adds 1.5em of space above itself when something precedes it,
  and 1em of space above the element that follows it. A rule of equal weight
  can replace either: after a `pathable-paragraph` the space above the display
  is 1em, and the zero margin of a following `pathable-heading` removes the
  1em on it.
- On a dark hero background, set a light text colour on the display or its
  container. Inside `pathable-section--dark`, the section colours a display on
  an `<h1>` to `<h6>` `#4899e8`, and a colour on the container or a single
  class on the display, such as `pathable-text-white`, does not change it.
  Inside `pathable-dark-background`, a display on a `<p>` or `<span>` is white.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The regular-weight guarantee is unmet: the display asks for weight 700, and the
package loads Fredoka only at 400, so browsers draw a synthesised bold.

## The consumer owns

- Accessibility. Use a real heading element, normally the page's `<h1>`, and
  keep one `<h1>` per page.
- The text colour and its contrast against the background behind it.
- Keeping the headline short so it does not wrap to many lines on a phone.
- Spacing and alignment around the headline.
