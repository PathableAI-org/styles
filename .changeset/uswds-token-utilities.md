---
'@pathableai/styles': minor
---

Adds the USWDS utility classes that the token pages name, under their own names
and without a prefix:

- `border`, `border-color`, `outline` and `outline-color` (`border-2px`,
  `border-primary`, `outline-2px`, `outline-accent-cool`), and
  `underline-<token>`.
- `display`, `flex`, `flex-direction` and `align-items` (`display-flex`,
  `flex-1`, `flex-column`, `flex-align-center`), and `order` with the
  `mobile-lg:`, `tablet:` and `desktop:` prefixes.
- `shadow-1` to `shadow-5` with the `hover:` prefix, `opacity-*`, `z-*` and
  `position`.
- `width`, `height`, `maxw-*`, `text-align` and `text-transform`.
- `font-family-*`, `font-<family>-<size>`, `line-height-*`, `measure-*`,
  `text-ls-*`, and the `text-light`, `text-normal`, `text-semibold` and
  `text-bold` weights.

Brand typefaces are normalised to the USWDS base optical size (362px), so the
type scale renders as the font-size page states (`font-body-sm` is 1rem). The
compiled stylesheet grows by about 40KB.
