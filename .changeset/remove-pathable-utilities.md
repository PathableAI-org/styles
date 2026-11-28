---
'@pathableai/styles': minor
---

**Breaking change**: the package no longer ships `pathable-` utility classes.
The utility classes are the USWDS ones under their USWDS names, which the
package already shipped beside them. Every `pathable-` utility class is
removed, with its `mobile-lg:`, `tablet:` and `desktop:` variants and its
`hover:` and `focus:` variants, and the Sass maps they were generated from
(`$pathable-utilities` and `$pathable-utility-breakpoints`) are gone. The
`src/_utilities-config.scss` partial stays, so loading it still compiles, but
it now defines nothing.

The focus-ring colour that `pathable-bg-<role>` set for the controls on it
moves to the matching unprefixed background class, with its `hover:` variant:
`bg-primary` and `bg-white` reset the ring to Bright Blue Brooks,
`bg-primary-vivid` sets it to white, `bg-secondary`, `bg-success` and
`bg-error` to the on-accent dark blue (`#001a33`) and `bg-base` to PathAble
Blue. A control placed directly on one of those classes now draws that ring
where it drew Bright Blue Brooks before. Other background classes leave the
ring unchanged.

The compiled CSS also stops declaring the 12 root custom properties that only
the retained React package read: `--pathable-color-border`,
`--pathable-color-accent`, `--pathable-color-danger`,
`--pathable-color-success`, `--pathable-color-text-success`,
`--pathable-color-workflow-active`, `--pathable-color-workflow-complete`,
`--pathable-color-workflow-blocked` and `--elevation-sm|md|lg|xl`. No rule in
the stylesheet reads them, so no component or utility class renders
differently. The Sass
variables and the `$elevation-levels` map they came from stay; the
`$semantic-colors` map loses those eight keys. For a value, use the colour
utility of the same colour (`bg-secondary` or `text-secondary` for the accent,
`bg-error` for danger, `text-secondary-dark` for text success) or the
elevation's shadow value in CSS.

The legacy `@pathableai/react` components and layout props, which are retained
but deferred, still emit `pathable-` utility classes and read those custom
properties, so their spacing, layout, width and colour props render without
styling, and their borders, accents, workflow markers and shadows lose their
colour or shadow unless a `ThemeProvider` sets the property, once this version
is installed.

Migration: replace each removed class with the unprefixed class below, which
sets the same value (the `maxw-*` classes in rem, the same width at a 16px root
font size). A removed class with no unprefixed equivalent is named in the
table with the CSS to write instead. The `mobile-lg:`, `tablet:` and
`desktop:` variants of the padding, margin and display classes map the same
way (`tablet:pathable-display-flex` becomes `tablet:display-flex`). The
breakpoint variants of the flex, flex-align, flex-justify, width and text-align
classes have no unprefixed equivalent: set the property in a `min-width` media
query instead. A spacing step `<n>` is
the same number of 0.5rem steps in both names.

| Removed                                                                    | Replacement                                                                                                                                                                                |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pathable-bg-primary`, `-surface`, `-link`, `-accent`, `-success`          | `bg-primary`, `bg-white`, `bg-primary-vivid`, `bg-secondary`, `bg-success`                                                                                                                 |
| `pathable-bg-base`, `-danger`, `-focus-ring`, `-transparent`               | `bg-base`, `bg-error`, `bg-accent-cool`, `bg-transparent`                                                                                                                                  |
| `hover:pathable-bg-<role>`                                                 | `hover:` and the replacement above, such as `hover:bg-primary-vivid`; `focus:pathable-bg-<role>` has no replacement                                                                        |
| `pathable-text-primary`, `-base`, `-muted`, `-link`, `-accent`, `-white`   | `text-primary`, `text-base`, `text-primary-vivid`, `text-primary-vivid`, `text-secondary`, `text-white`; the `hover:` variants map the same way, `focus:` ones to none                     |
| `pathable-text-normal`, `-semibold`, `-bold`                               | `text-normal`, `text-semibold`, `text-bold`                                                                                                                                                |
| `pathable-text-left`, `-center`, `-right`                                  | `text-left`, `text-center`, `text-right`                                                                                                                                                   |
| `pathable-padding-<n>`, `pathable-padding-x-<n>`, `pathable-padding-y-<n>` | `padding-<n>`, `padding-x-<n>`, `padding-y-<n>`                                                                                                                                            |
| `pathable-margin-<n>`, `-x-<n>`, `-y-<n>`, `-top-<n>`, `-bottom-<n>`       | `margin-<n>`, `margin-x-<n>`, `margin-y-<n>`, `margin-top-<n>`, `margin-bottom-<n>`; `margin-x-auto` for `pathable-margin-x-auto`. `pathable-margin-auto` has no class: set `margin: auto` |
| `pathable-display-flex`, `-block`, `-inline`, `-inline-block`, `-none`     | `display-flex`, `display-block`, `display-inline`, `display-inline-block`, `display-none`                                                                                                  |
| `pathable-font-family-heading`, `-body`, `-mono`, `-alt`                   | `font-family-heading`, `font-family-body`, `font-family-mono`, `font-family-alt`                                                                                                           |
| `pathable-border-0`, `-1`, `-2`, `-4`                                      | `border-0`, `border-1px`, `border-2px`, `border-05` (0.25rem, 4px); `pathable-border-3` and `-5` have no class: set `border: 3px solid` or `border: 5px solid`                             |
| `pathable-border-radius-sm` (0.5rem)                                       | `radius-lg` (0.5rem); `pathable-border-radius-md` (1rem) and `-lg` (2rem) have no class: set `border-radius`                                                                               |
| `pathable-flex-1`, `pathable-flex-fill`                                    | `flex-1`; `pathable-flex-fill` (`1 1 auto`) has no class, as `flex-fill` is `1 1 0%`: set `flex: 1 1 auto`                                                                                 |
| `pathable-flex-align-<value>`, `pathable-flex-justify-<value>`             | `flex-align-<value>`; `flex-justify-<value>`, with `flex-justify` for `between`; `pathable-flex-justify-around` has no class: set `justify-content: space-around`                          |
| `pathable-width-full`, `pathable-width-auto`                               | `width-full`, `width-auto`                                                                                                                                                                 |
| `pathable-maxw-mobile`, `-mobile-lg`, `-tablet`, `-desktop`                | `maxw-mobile`, `maxw-mobile-lg`, `maxw-tablet`, `maxw-desktop`                                                                                                                             |
