---
'@pathableai/styles': minor
---

**Breaking change**: the compiled CSS no longer declares 206 custom properties
that no rule in the stylesheet reads. `dist/styles.css` and
`dist/theme-default.css` now declare only the 36 root properties the component
CSS or the retained React package reads: the 25 `--pathable-color-*`
properties, `--pathable-brand-pathable-blue`, `--pathable-brand-lived-in-lime`,
`--pathable-brand-bright-blue-brooks`, `--pathable-font-heading`,
`--pathable-font-body`, `--pathable-font-weight-normal`,
`--pathable-font-weight-bold` and `--elevation-sm|md|lg|xl`. Component and
utility classes are unchanged and nothing renders differently. The Sass
variables and maps the removed properties came from (`$spacing-scale`,
`$pathable-spacing-scale`, `$radius-scale`, `$typography-tokens`, the `$ui-*`
sizes and `$pathable-utilities`) stay in place. The `src/_utilities-tokens.scss`
partial, which only emitted the utility properties, is removed.

Migration: replace each removed property with the class or value below. Spacing
values follow the spacing token page (`tokens-spacing-units`), where one step
is 0.5rem.

| Removed                                                                                             | Replacement                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--space-4`, `--space-8`, `--space-12`, `--space-16`, `--space-24`, `--space-32`, `--space-48` (px) | Spacing tokens `05`, `1`, `105`, `2`, `3`, `4`, `6` (0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 3rem), as the spacing classes such as `margin-105` or `padding-3` |
| `--pathable-space-0` to `--pathable-space-8`                                                        | `.pathable-margin-<n>` and `.pathable-padding-<n>` (and their `-x`, `-y`, `-top`, `-bottom` forms), or `<n>` × 0.5rem                                                |
| `--radius-sm`, `--radius-md`, `--radius-lg`                                                         | `.pathable-border-radius-sm`, `.pathable-border-radius-md`, `.pathable-border-radius-lg`                                                                             |
| `--ui-display-lg`, `--pathable-font-size-display-lg` (2rem)                                         | `font-heading-xl`                                                                                                                                                    |
| `--ui-heading-lg`, `--pathable-font-size-heading-lg` (1.5rem)                                       | `font-heading-lg`                                                                                                                                                    |
| `--ui-heading-md`, `--pathable-font-size-heading-md` (1.25rem)                                      | No size class matches; use `font-heading-md` (1.13rem) or `font-heading-lg` (1.5rem), or the value `1.25rem`                                                         |
| `--ui-heading-sm`, `--pathable-font-size-heading-sm` (1.125rem)                                     | `font-heading-md`                                                                                                                                                    |
| `--ui-body-lg`, `--pathable-font-size-body-lg` (1.125rem)                                           | `font-body-md`                                                                                                                                                       |
| `--ui-body-md`, `--pathable-font-size-body-md` (1rem)                                               | `font-body-sm`                                                                                                                                                       |
| `--ui-body-sm`, `--pathable-font-size-body-sm` (0.875rem)                                           | `font-body-2xs`                                                                                                                                                      |
| `--ui-label-md`, `--pathable-font-size-label-md` (0.875rem)                                         | `font-ui-2xs`                                                                                                                                                        |
| `--ui-label-sm`, `--pathable-font-size-label-sm` (0.75rem)                                          | `font-ui-3xs`                                                                                                                                                        |
| `--ui-caption-md`, `--pathable-font-size-caption-md` (0.75rem)                                      | `font-body-3xs`                                                                                                                                                      |
| `--pathable-font-alt`, `--pathable-font-alternate-heading`                                          | `font-family-alt` or `.pathable-font-family-alt`                                                                                                                     |
| `--pathable-font-mono`                                                                              | `font-family-mono` or `.pathable-font-family-mono`                                                                                                                   |
| `--pathable-font-subheading`                                                                        | No class; use the value `'Poppins', system-ui, sans-serif`                                                                                                           |
| `--pathable-font-weight-semibold`                                                                   | `.pathable-text-semibold`                                                                                                                                            |
| `--pathable-font-line-height-heading`, `-body`, `-body-sm`, `-caption-md` (1.25, 1.5, 1.43, 1.33)   | The `line-height-<family>-<key>` classes, such as `line-height-heading-3` or `line-height-body-4`, or the value                                                      |
| `--pathable-brand-intelligent-jade`                                                                 | The `secondary` colour token, such as `bg-secondary` or `text-secondary`                                                                                             |
| `--pathable-brand-tech-teal`                                                                        | The `primary-vivid` colour token, such as `bg-primary-vivid`                                                                                                         |
| `--pathable-brand-shilling-silver`                                                                  | The `base` colour token, such as `bg-base`                                                                                                                           |
| `--pathable-bg-<value>`                                                                             | `.pathable-bg-<value>`, for `accent`, `base`, `danger`, `focus-ring`, `link`, `primary`, `success`, `surface`, `transparent`                                         |
| `--pathable-text-<value>`                                                                           | `.pathable-text-<value>`, for `accent`, `base`, `link`, `muted`, `primary`, `white`                                                                                  |
| `--pathable-text-weight-<value>`                                                                    | `.pathable-text-<value>`, for `normal`, `semibold`, `bold`                                                                                                           |
| `--pathable-text-align-<value>`                                                                     | `.pathable-text-<value>`, for `left`, `center`, `right`                                                                                                              |
| `--pathable-padding-<n>`, `--pathable-padding-x-<n>`, `--pathable-padding-y-<n>`                    | `.pathable-padding-<n>`, `.pathable-padding-x-<n>`, `.pathable-padding-y-<n>`, for `0` to `10` and `15`                                                              |
| `--pathable-margin-<n>`, `--pathable-margin-x-<n>`                                                  | `.pathable-margin-<n>`, `.pathable-margin-x-<n>`, for `0` to `10`, `15` and `auto`                                                                                   |
| `--pathable-margin-y-<n>`, `--pathable-margin-top-<n>`, `--pathable-margin-bottom-<n>`              | `.pathable-margin-y-<n>`, `.pathable-margin-top-<n>`, `.pathable-margin-bottom-<n>`, for `0` to `10` and `15`                                                        |
| `--pathable-display-<value>`                                                                        | `.pathable-display-<value>`, for `block`, `flex`, `inline`, `inline-block`, `none`                                                                                   |
| `--pathable-font-family-<value>`                                                                    | `.pathable-font-family-<value>`, for `alt`, `body`, `heading`, `mono`                                                                                                |
| `--pathable-border-<n>`, `--pathable-border-radius-<size>`                                          | `.pathable-border-<n>` for `0` to `5`; `.pathable-border-radius-<size>` for `sm`, `md`, `lg`                                                                         |
| `--pathable-flex-<value>`                                                                           | `.pathable-flex-<value>`, for `1`, `fill`                                                                                                                            |
| `--pathable-align-items-<value>`                                                                    | `.pathable-flex-align-<value>`, for `baseline`, `center`, `end`, `start`, `stretch`                                                                                  |
| `--pathable-justify-content-<value>`                                                                | `.pathable-flex-justify-<value>`, for `around`, `between`, `center`, `end`, `start`                                                                                  |
| `--pathable-width-<value>`, `--pathable-maxw-<value>`                                               | `.pathable-width-auto`, `.pathable-width-full`; `.pathable-maxw-<value>` for `mobile`, `mobile-lg`, `tablet`, `desktop`                                              |
