---
name: Spacing units
slug: tokens-spacing-units
kind: token
summary: 'The spacing token scale, in steps of half a rem from 0.25rem up to 7.5rem plus named widths up to 87.5rem, used as the suffix of margin, padding, size and position classes.'
uswds: https://designsystem.digital.gov/design-tokens/spacing-units/
guarantees:
  - id: unit-base
    claim: The classes padding-1, padding-2, padding-3 and padding-10 set padding to 0.5rem, 1rem, 1.5rem and 5rem, where one numeric step is 8px at the default 16px root font size.
  - id: half-steps
    claim: The classes padding-05, padding-105 and padding-205 set padding to 0.25rem, 0.75rem and 1.25rem.
  - id: pixel-and-zero
    claim: The classes padding-1px, padding-2px and padding-0 set padding to 1px, 2px and 0.
  - id: negative
    claim: The class margin-x-neg-1 sets margin-left and margin-right to -0.5rem.
  - id: named-widths
    claim: The classes width-card, width-card-lg, width-mobile, width-mobile-lg, width-tablet, width-desktop and width-widescreen set width to 10rem, 15rem, 20rem, 30rem, 40rem, 64rem and 87.5rem.
  - id: no-off-scale-class
    claim: No class exists for a step that is not on the scale, such as padding-11.
  - id: padding-classes
    claim: The classes padding-05, padding-1, padding-2 and padding-6 set padding to 0.25rem, 0.5rem, 1rem and 3rem.
  - id: breakpoint-queries
    claim: 'The prefixes mobile-lg:, tablet: and desktop: wrap a class in a min-width media query of 30em, 40em and 64em.'
---

# Spacing units

The spacing token scale, in steps of half a rem from 0.25rem up to 7.5rem plus
named widths up to 87.5rem, used as the suffix of margin, padding, size and
position classes. One numeric step is 8px at the
default root font size, so `2` is 16px, and values compile to `rem` so spacing
follows the reader's font size. See the
[USWDS spacing units](https://designsystem.digital.gov/design-tokens/spacing-units/).

## When to use

- Any gap, padding, margin, offset or fixed width in markup: use a class built
  from a token instead of a one-off value, so the application stays on the
  scale.
- Reading a spacing class: the number in `margin-2` is the token `2`, 1rem.

Use something else when:

- the size follows the text it sits beside: use `em` spacing
  (`margin-top-1em`, `margin-x-2em`);
- the size is a type size: use the [font size](tokens-typesetting-font-size.md)
  tokens.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: padding-scale -->

## Values

Values are in `rem` against PathAble's root font size of 100% (16px), so
spacing follows the reader's font size. A token is the key in a class name; a
half step is written `05` in a class, so `padding-05` is 0.25rem.

| Class suffix                  | PathAble value                | Notes                                     |
| ----------------------------- | ----------------------------- | ----------------------------------------- |
| `0`                           | `0`                           |                                           |
| `1px`, `2px`                  | `1px`, `2px`                  | Fixed pixels, not rem                     |
| `05`                          | `0.25rem` (4px)               |                                           |
| `1`                           | `0.5rem` (8px)                |                                           |
| `105`                         | `0.75rem` (12px)              |                                           |
| `2`                           | `1rem` (16px)                 |                                           |
| `205`                         | `1.25rem` (20px)              |                                           |
| `3`                           | `1.5rem` (24px)               |                                           |
| `4`                           | `2rem` (32px)                 |                                           |
| `5`                           | `2.5rem` (40px)               |                                           |
| `6`                           | `3rem` (48px)                 |                                           |
| `7`                           | `3.5rem` (56px)               |                                           |
| `8`                           | `4rem` (64px)                 |                                           |
| `9`                           | `4.5rem` (72px)               |                                           |
| `10`                          | `5rem` (80px)                 |                                           |
| `15`                          | `7.5rem` (120px)              |                                           |
| `neg-1px`, `neg-2px`          | `-1px`, `-2px`                | Negative values, on margin                |
| `neg-05` to `neg-3`           | `-0.25rem` to `-1.5rem`       | Same steps as above, negated              |
| `neg-4` to `neg-10`, `neg-15` | `-2rem` to `-5rem`, `-7.5rem` |                                           |
| `card`                        | `10rem` (160px)               | Named                                     |
| `card-lg`                     | `15rem` (240px)               | Named                                     |
| `mobile`                      | `20rem` (320px)               | Named                                     |
| `mobile-lg`                   | `30rem` (480px)               | Named; also a responsive prefix           |
| `tablet`                      | `40rem` (640px)               | Named; also a responsive prefix           |
| `tablet-lg`                   | `55rem` (880px)               | Named                                     |
| `desktop`                     | `64rem` (1024px)              | Named; also a responsive prefix           |
| `desktop-lg`                  | `75rem` (1200px)              | Named                                     |
| `widescreen`                  | `87.5rem` (1400px)            | Named                                     |
| `auto`, `none`                | `auto`, `none`                | Keywords, where the property accepts them |

Which tokens a class accepts depends on the property: padding takes `0` to `15`
and the pixel and half steps; margin adds negatives, `auto` (on `margin-x` and
`margin-y`) and `em` values, and only `card`, `card-lg` and `mobile` among the
named widths (`margin-x-card`); width, height and max-width take all the named
tokens.
`padding-card` does not exist, but `width-card` and `maxw-mobile` do.

## Utilities

| Property                            | Classes                                                     | Page                                                           |
| ----------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| `margin`, `padding`                 | `margin-<side?>-<token>`, `padding-<side?>-<token>`         | [Margin and padding](utilities-margin-and-padding.md)          |
| `width`, `height`, `min-*`, `max-*` | `width-<token>`, `maxw-<token>`, `height-<token>` and so on | [Height and width](utilities-height-and-width.md)              |
| `top`, `right`, `bottom`, `left`    | `top-<token>`, `left-<token>` and so on                     | [Display](utilities-display.md)                                |
| Column gap                          | `grid-gap-<token>`                                          | [Layout grid](utilities-layout-grid.md)                        |
| Border width, outline width         | `border-<token>`, `outline-<token>`                         | [Border](utilities-border.md), [Outline](utilities-outline.md) |

Responsive prefixes `mobile-lg:`, `tablet:` and `desktop:` apply to margin and
padding classes (for example `tablet:padding-4`); the prefixes are named after
the `mobile-lg`, `tablet` and `desktop` tokens above.

## States

Each state is complete markup showing spacing tokens through the classes that
consume them.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

## The consumer owns

- Staying on the scale: use the nearest token rather than a custom pixel
  value.
- Keeping touch targets and text spacing usable when a user enlarges text:
  `rem` spacing grows with the root font size, fixed `px` spacing does not.
- Choosing a token the property accepts: `padding-card` and `margin-top-card`
  do not exist, while `width-card` does.
