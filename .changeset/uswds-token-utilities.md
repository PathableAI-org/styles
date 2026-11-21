---
'@pathableai/styles': minor
---

Add the USWDS utility classes that the token pages name, under their own names
and without a prefix: `border`, `border-color`, `outline` and `outline-color`
(`border-2px`, `border-primary`, `outline-2px`, `outline-accent-cool`),
`underline-<token>`, `display`, `flex`, `flex-direction` and `align-items`
(`display-flex`, `flex-1`, `flex-column`, `flex-align-center`), `order`
(with the `mobile-lg:`, `tablet:` and `desktop:` prefixes), `shadow-1` to
`shadow-5` with the `hover:` prefix, `opacity-*`, `z-*`, `position`, `width`,
`height`, `maxw-*`, `text-align`, `text-transform`, `font-family-*`,
`font-<family>-<size>`, `line-height-*`, `measure-*`, `text-ls-*` and the
`text-light`, `text-normal`, `text-semibold` and `text-bold` weights. Brand
typefaces are normalised to the USWDS base optical size (362px), so the type
scale renders as the font-size page states (`font-body-sm` is 1rem). The
disabled state colours return to the USWDS defaults (`bg-disabled` is #757575,
`bg-disabled-dark` is #454545), so disabled controls take the USWDS gray text
and border colours. The compiled stylesheet grows by about 40 KB. The
`pathable-*` utilities are unchanged.
