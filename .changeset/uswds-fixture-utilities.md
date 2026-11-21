---
'@pathableai/styles': minor
---

Add the rest of the USWDS utility classes that the utilities pages name, under
their own names and without a prefix: `border-solid`, `border-dashed`,
`border-dotted` and `border-width-*`, `radius-*`, `clearfix`, `float-*`,
`overflow-*`, `top-*`, `right-*`, `bottom-*`, `left-*` and `pin-*`,
`flex-wrap`, `flex-justify-*` and `flex-align-self-*`, `maxh-*`, `minh-*` and
`minw-*`, `add-aspect-*`, `circle-*` and `square-*`, `text-indent-*`, and the
`text-italic`, `text-underline`, `text-no-underline`, `text-strike`,
`text-no-wrap`, `text-pre-wrap`, `text-sub`, `text-super` and `text-tabular`
text styles. The `mobile-lg:`, `tablet:` and `desktop:` prefixes now also work
on `display`, `margin`, `padding`, `border`, `radius`, `font`, `line-height`
and `measure` (for example `tablet:display-none` and `tablet:padding-4`), and
`hover:bg-*` and `hover:text-*` exist. The compiled stylesheet grows by about
160 KB (900 KB to 1,061 KB). The `pathable-*` utilities are unchanged.
