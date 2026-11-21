---
name: Spacing units
slug: tokens-spacing-units
kind: token
summary: 'The spacing token scale, in steps of half a rem from 0.25rem up to 7.5rem plus named widths up to 87.5rem, read by `units()` in Sass and used as the suffix of margin, padding, size and position classes.'
uswds: https://designsystem.digital.gov/design-tokens/spacing-units/
guarantees:
  - id: unit-base
    status: unverified
    claim: units(1) resolves to 0.5rem, units(2) to 1rem, units(3) to 1.5rem and units(10) to 5rem, where one numeric step is 8px at the default 16px root font size.
  - id: half-steps
    status: unverified
    claim: units(0.5) resolves to 0.25rem, units(1.5) to 0.75rem and units(2.5) to 1.25rem, and the class suffixes are 05, 105 and 205.
  - id: pixel-and-zero
    status: unverified
    claim: units(1px) resolves to 1px, units(2px) to 2px and units(0) to 0rem.
  - id: negative
    status: unverified
    claim: units(-1) and units('neg-1') both resolve to -0.5rem, units(-2px) resolves to -2px, and the class margin-x-neg-1 sets margin-left and margin-right to -0.5rem.
  - id: named-widths
    status: unverified
    claim: units('card') resolves to 10rem, units('card-lg') to 15rem, units('mobile') to 20rem, units('mobile-lg') to 30rem, units('tablet') to 40rem, units('desktop') to 64rem and units('widescreen') to 87.5rem.
  - id: invalid-token
    status: unverified
    claim: A value that is not a spacing token, such as units(11), is a Sass compile error.
  - id: padding-classes
    status: unverified
    claim: The classes padding-05, padding-1, padding-2 and padding-6 set padding to 0.25rem, 0.5rem, 1rem and 3rem.
  - id: breakpoint-queries
    status: unverified
    claim: at-media('tablet') compiles to a min-width media query of 40em and at-media-max('mobile-lg') to a max-width media query of 29.99em.
---

# Spacing units

The spacing token scale, in steps of half a rem from 0.25rem up to 7.5rem plus
named widths up to 87.5rem, read by `units()` in Sass and used as the suffix of
margin, padding, size and position classes. One numeric step is 8px at the
default root font size, so `2` is 16px, and values compile to `rem` so spacing
follows the reader's font size. See the
[USWDS spacing units](https://designsystem.digital.gov/design-tokens/spacing-units/).

## When to use

- Any gap, padding, margin, offset or fixed width in application CSS: call
  `units()` instead of writing a number, so the application stays on the scale.
- Matching a spacing class: the number in `margin-2` is the same token as
  `units(2)`.

Use something else when:

- the size follows the text it sits beside: use `em` or `ch` spacing
  (`margin-top-1em`, `padding-x-2ch`);
- the size is a type size: use the [font size](tokens-typesetting-font-size.md)
  tokens.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: padding-scale -->

## Tokens

Values are at the PathAble default of `$theme-respect-user-font-size: true`
(a root of 100%, 16px). Numeric tokens are written as numbers in Sass and as
the key in a class name; a half step is written `0.5` in Sass and `05` in a
class.

| Token (Sass)         | Class suffix                  | Value                         | Notes                                     |
| -------------------- | ----------------------------- | ----------------------------- | ----------------------------------------- |
| `0`                  | `0`                           | `0rem`                        | `units(0)` is `0rem`                      |
| `1px`, `2px`         | `1px`, `2px`                  | `1px`, `2px`                  | Fixed pixels, not rem                     |
| `0.5` (`'05'`)       | `05`                          | `0.25rem` (4px)               |                                           |
| `1`                  | `1`                           | `0.5rem` (8px)                |                                           |
| `1.5` (`'105'`)      | `105`                         | `0.75rem` (12px)              |                                           |
| `2`                  | `2`                           | `1rem` (16px)                 |                                           |
| `2.5` (`'205'`)      | `205`                         | `1.25rem` (20px)              |                                           |
| `3`                  | `3`                           | `1.5rem` (24px)               |                                           |
| `4`                  | `4`                           | `2rem` (32px)                 |                                           |
| `5`                  | `5`                           | `2.5rem` (40px)               |                                           |
| `6`                  | `6`                           | `3rem` (48px)                 |                                           |
| `7`                  | `7`                           | `3.5rem` (56px)               |                                           |
| `8`                  | `8`                           | `4rem` (64px)                 |                                           |
| `9`                  | `9`                           | `4.5rem` (72px)               |                                           |
| `10`                 | `10`                          | `5rem` (80px)                 |                                           |
| `15`                 | `15`                          | `7.5rem` (120px)              |                                           |
| `-1px`, `-2px`       | `neg-1px`, `neg-2px`          | `-1px`, `-2px`                | Negative values, also `'neg-1px'`         |
| `-0.5` to `-3`       | `neg-05` to `neg-3`           | `-0.25rem` to `-1.5rem`       | Same steps as above; `-1` is `'neg-1'`    |
| `-4` to `-10`, `-15` | `neg-4` to `neg-10`, `neg-15` | `-2rem` to `-5rem`, `-7.5rem` |                                           |
| `'card'`             | `card`                        | `10rem` (160px)               | Named                                     |
| `'card-lg'`          | `card-lg`                     | `15rem` (240px)               | Named                                     |
| `'mobile'`           | `mobile`                      | `20rem` (320px)               | Named                                     |
| `'mobile-lg'`        | `mobile-lg`                   | `30rem` (480px)               | Named; a breakpoint                       |
| `'tablet'`           | `tablet`                      | `40rem` (640px)               | Named; a breakpoint                       |
| `'tablet-lg'`        | `tablet-lg`                   | `55rem` (880px)               | Named                                     |
| `'desktop'`          | `desktop`                     | `64rem` (1024px)              | Named; a breakpoint                       |
| `'desktop-lg'`       | `desktop-lg`                  | `75rem` (1200px)              | Named                                     |
| `'widescreen'`       | `widescreen`                  | `87.5rem` (1400px)            | Named                                     |
| `'auto'`, `'none'`   | `auto`, `none`                | `auto`, `none`                | Keywords, where the property accepts them |

Which tokens a class accepts depends on the property: padding takes `0` to `15`
and the pixel and half steps; margin adds negatives, `auto` (on `margin-x` and
`margin-y`) and `em` values; width, height and max-width add the named tokens.
`padding-card` does not exist, but `width-card` and `maxw-mobile` do.

## Sass

`units()` returns a spacing value. `at-media()` and `at-media-max()` open a
media query at a named breakpoint token:

```scss
@use '@pathableai/styles' as *;

.plan-card {
  padding: units(2);
  margin-bottom: units(3);
  max-width: units('mobile-lg');

  @include at-media('tablet') {
    padding: units(4);
  }
}

.plan-card__badge {
  margin-left: units(-1);
}
```

`at-media('tablet')` compiles to `@media all and (min-width: 40em)`;
`at-media-max('mobile-lg')` compiles to `(max-width: 29.99em)`. The mixins
`u-margin()`, `u-padding()`, `u-width()`, `u-height()` and the other
size mixins take the same tokens, for example `@include u-padding-x(2)`.
`units(11)` is a compile error.

## Utilities

| Property                            | Classes                                                     | Page                                                           |
| ----------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| `margin`, `padding`                 | `margin-<side?>-<token>`, `padding-<side?>-<token>`         | [Margin and padding](utilities-margin-and-padding.md)          |
| `width`, `height`, `min-*`, `max-*` | `width-<token>`, `maxw-<token>`, `height-<token>` and so on | [Height and width](utilities-height-and-width.md)              |
| `top`, `right`, `bottom`, `left`    | `top-<token>`, `left-<token>` and so on                     | [Display](utilities-display.md)                                |
| Column gap                          | `grid-gap-<token>`                                          | [Layout grid](utilities-layout-grid.md)                        |
| Border width, outline width         | `border-<token>`, `outline-<token>`                         | [Border](utilities-border.md), [Outline](utilities-outline.md) |

Responsive prefixes `mobile-lg:`, `tablet:` and `desktop:` apply to margin and
padding classes (for example `tablet:padding-4`) and the breakpoints use the
`'mobile-lg'`, `'tablet'` and `'desktop'` tokens above.

## Settings

| Setting                                                         | PathAble default                                                                                                              | Controls                                                                       |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `$theme-respect-user-font-size`                                 | `true`                                                                                                                        | `true` outputs `rem` against a 100% root; `false` uses `$theme-root-font-size` |
| `$theme-root-font-size`                                         | `10px` (USWDS default)                                                                                                        | Root size used only when the setting above is `false`                          |
| `$theme-utility-breakpoints`                                    | `mobile-lg`, `tablet`, `desktop` on; `card`, `card-lg`, `mobile`, `tablet-lg`, `desktop-lg`, `widescreen` off (USWDS default) | Which named tokens produce responsive prefixes                                 |
| `$theme-column-gap-sm`, `-md`, `-lg`, `-mobile`, `-desktop`     | `2px`, `2`, `3`, `2`, `4` (USWDS defaults)                                                                                    | Grid gap tokens, as spacing tokens                                             |
| `$theme-site-margins-width`, `$theme-site-margins-mobile-width` | `4`, `2` (USWDS defaults)                                                                                                     | Site margin, as spacing tokens                                                 |
| `$theme-grid-container-max-width`                               | `'desktop'` (USWDS default)                                                                                                   | Container width, a named spacing token                                         |

The spacing tokens themselves are not configurable and are the same as in
USWDS. To turn on a breakpoint:

```scss
@use '@pathableai/styles' with (
  $theme-utility-breakpoints: (
    'tablet-lg': true,
  )
);
```

## States

Each state is complete markup showing spacing tokens through the classes that
consume them.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour that was read from the package source and that no test
checks yet (`status: unverified`).

## The consumer owns

- Staying on the scale: use the nearest token rather than a custom pixel
  value.
- Keeping touch targets and text spacing usable when a user enlarges text:
  `rem` spacing grows with the root font size, fixed `px` spacing does not.
- Choosing a token the property accepts: `padding-card` and `margin-top-card`
  do not exist, while `width-card` does.
