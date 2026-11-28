---
'@pathableai/styles': minor
---

**Breaking change**: Removes 206 custom properties that no rule in the
stylesheet reads. `dist/styles.css` and `dist/theme-default.css` now declare
only the 24 root properties the component CSS reads:

- 17 `--pathable-color-*` properties;
- `--pathable-brand-pathable-blue`, `--pathable-brand-lived-in-lime` and
  `--pathable-brand-bright-blue-brooks`;
- `--pathable-font-heading`, `--pathable-font-body`,
  `--pathable-font-weight-normal` and `--pathable-font-weight-bold`.

Nothing renders differently. The Sass variables and maps the removed properties
came from (`$spacing-scale`, `$pathable-spacing-scale`, `$radius-scale`,
`$typography-tokens` and the `$ui-*` sizes) stay in place. The `src/_utilities-tokens.scss` partial stays, so loading it still
compiles, but it now emits nothing.

**Migration**: replace each removed property with the class or value below.
Spacing values follow the spacing token page (`tokens-spacing-units`), where one
step is 0.5rem.

| Removed                                                                                             | Replacement                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--space-4`, `--space-8`, `--space-12`, `--space-16`, `--space-24`, `--space-32`, `--space-48` (px) | Spacing tokens `05`, `1`, `105`, `2`, `3`, `4`, `6` (0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 3rem), as the spacing classes such as `margin-105` or `padding-3` |
| `--pathable-space-0` to `--pathable-space-8`                                                        | `margin-<n>` and `padding-<n>` (and their `-x`, `-y`, `-top`, `-bottom` forms), or `<n>` × 0.5rem                                                                    |
| `--radius-sm`, `--radius-md`, `--radius-lg`                                                         | `radius-lg` for `--radius-sm` (0.5rem); no class for `--radius-md` (1rem) or `--radius-lg` (2rem): use the value                                                     |
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
| `--pathable-font-alt`, `--pathable-font-alternate-heading`                                          | `font-family-alt`                                                                                                                                                    |
| `--pathable-font-mono`                                                                              | `font-family-mono`                                                                                                                                                   |
| `--pathable-font-subheading`                                                                        | No class; use the value `'Poppins', system-ui, sans-serif`                                                                                                           |
| `--pathable-font-weight-semibold`                                                                   | `text-semibold`                                                                                                                                                      |
| `--pathable-font-line-height-heading`, `-body`, `-body-sm`, `-caption-md` (1.25, 1.5, 1.43, 1.33)   | The `line-height-<family>-<key>` classes, such as `line-height-heading-3` or `line-height-body-4`, or the value                                                      |
| `--pathable-brand-intelligent-jade`                                                                 | The `secondary` colour token, such as `bg-secondary` or `text-secondary`                                                                                             |
| `--pathable-brand-tech-teal`                                                                        | The `primary-vivid` colour token, such as `bg-primary-vivid`                                                                                                         |
| `--pathable-brand-shilling-silver`                                                                  | The `base` colour token, such as `bg-base`                                                                                                                           |
| `--pathable-bg-<value>`                                                                             | `bg-primary`, `bg-base`, `bg-white`, `bg-secondary`, `bg-primary-vivid`, `bg-accent-cool`, `bg-error`, `bg-success`, `bg-transparent`                                |
| `--pathable-text-<value>`                                                                           | `text-primary`, `text-base`, `text-primary-vivid` (muted and link), `text-secondary` (accent), `text-white`                                                          |
| `--pathable-text-weight-<value>`                                                                    | `text-normal`, `text-semibold`, `text-bold`                                                                                                                          |
| `--pathable-text-align-<value>`                                                                     | `text-left`, `text-center`, `text-right`                                                                                                                             |
| `--pathable-padding-<n>`, `--pathable-padding-x-<n>`, `--pathable-padding-y-<n>`                    | `padding-<n>`, `padding-x-<n>`, `padding-y-<n>`                                                                                                                      |
| `--pathable-margin-<n>`, `--pathable-margin-x-<n>`                                                  | `margin-<n>`, `margin-x-<n>`; `margin-x-auto` for `auto`                                                                                                             |
| `--pathable-margin-y-<n>`, `--pathable-margin-top-<n>`, `--pathable-margin-bottom-<n>`              | `margin-y-<n>`, `margin-top-<n>`, `margin-bottom-<n>`                                                                                                                |
| `--pathable-display-<value>`                                                                        | `display-<value>`, for `block`, `flex`, `inline`, `inline-block`, `none`                                                                                             |
| `--pathable-font-family-<value>`                                                                    | `font-family-<value>`, for `alt`, `body`, `heading`, `mono`                                                                                                          |
| `--pathable-border-<n>`, `--pathable-border-radius-<size>`                                          | `border-0`, `border-1px`, `border-2px`, `border-05` (4px); `radius-lg` (0.5rem); other values have no class                                                          |
| `--pathable-flex-<value>`                                                                           | `flex-1`; no class for `fill` (`1 1 auto`)                                                                                                                           |
| `--pathable-align-items-<value>`                                                                    | `flex-align-<value>`, for `baseline`, `center`, `end`, `start`, `stretch`                                                                                            |
| `--pathable-justify-content-<value>`                                                                | `flex-justify-<value>` for `center`, `end`, `start`; `flex-justify` for `between`; no class for `around`                                                             |
| `--pathable-width-<value>`, `--pathable-maxw-<value>`                                               | `width-auto`, `width-full`; `maxw-<value>` for `mobile`, `mobile-lg`, `tablet`, `desktop`                                                                            |
