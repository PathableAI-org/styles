---
'@pathableai/styles': minor
---

Add `bg-*` and `text-*` utilities for the USWDS grayscale and basic colour
names under their own names, without a prefix: `bg-gray-5` to `bg-gray-90`, and
`bg-red`, `bg-orange`, `bg-gold`, `bg-yellow`, `bg-green`, `bg-mint`, `bg-cyan`,
`bg-blue`, `bg-indigo`, `bg-violet` and `bg-magenta`, with the matching `text-*`
classes. The state colours (`bg-error`, `bg-warning`, `bg-success`, `bg-info`,
`bg-disabled`) are included. The numbered system colours (`bg-red-50v`,
`bg-gray-cool-60`) still have no class, and the USWDS system values are not
changed. The compiled stylesheet grows by about 4 KB. The `pathable-*`
utilities are unchanged.
