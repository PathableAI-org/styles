---
name: Margin and padding
slug: utilities-margin-and-padding
kind: utility
summary: Utility classes that set an element's margin and padding, on all sides, on both sides of an axis or on a single side, from the spacing scale.
uswds: https://designsystem.digital.gov/utilities/margin-and-padding/
classes:
  - margin-<value>
  - margin-x-<value>
  - margin-y-<value>
  - margin-top-<value>
  - margin-right-<value>
  - margin-bottom-<value>
  - margin-left-<value>
  - padding-<value>
  - padding-x-<value>
  - padding-y-<value>
  - padding-top-<value>
  - padding-right-<value>
  - padding-bottom-<value>
  - padding-left-<value>
guarantees:
  - id: scale
    claim: margin-top-2 sets margin-top 1rem, margin-top-1 sets 0.5rem, margin-top-05 sets 0.25rem, margin-top-4 sets 2rem and padding-3 sets padding 1.5rem on all sides.
  - id: axes
    claim: margin-x-2 sets left and right margins to 1rem and no other margin, and padding-y-105 sets top and bottom padding to 0.75rem and no other padding.
  - id: auto
    claim: margin-x-auto sets margin-left and margin-right to auto, margin-top-auto sets margin-top auto, and padding has no auto class.
  - id: negative
    claim: margin-top-neg-1 sets margin-top -0.5rem, margin-neg-1 sets margin -0.5rem on all sides and margin-x-neg-2 sets left and right margins to -1rem.
  - id: px-and-em
    claim: margin-1px sets margin 1px, margin-left-05em sets margin-left 0.5em and padding-0 sets padding 0.
  - id: horizontal-sizes
    claim: margin-x-card sets left and right margins to 10rem, margin-x-mobile-lg and margin-x-tablet do not exist, and the stylesheet has no margin-top-card and no padding-x-card class.
  - id: responsive
    claim: tablet:margin-top-2 sets margin-top 1rem only from a viewport width of 40em (640px), and mobile-lg:padding-3 sets padding 1.5rem only from 30em (480px).
---

# Margin and padding

Utility classes that set an element's margin and padding, on all sides, on
both sides of an axis or on a single side, from the spacing scale. Names are
unprefixed: `margin-top-2`, `padding-x-3`, `margin-x-auto`,
`tablet:padding-y-4`.

## When to use

- Space between blocks, such as a gap under a paragraph or between cards.
- Padding inside a panel.
- Centring a block of limited width with `margin-x-auto`.
- Changing spacing at a breakpoint.

Use something else when:

- the spacing is between columns of a row: use `grid-gap` from the
  [layout grid](utilities-layout-grid.md);
- the spacing is between flex items on one line: put a margin on the items, or
  use [`flex-justify`](utilities-flex.md) to space them.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: responsive -->

## Classes

`<value>` is a USWDS spacing token; 1 unit is 0.5rem (8px at a 16px root font
size).

| Class pattern                                                                                                      | Property                                      | Values                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `margin-<v>`                                                                                                       | `margin`                                      | `0`, `1px`, `2px`, `05` (0.25rem), `1` (0.5rem), `105`, `2` (1rem), `205`, `3` (1.5rem), `4` to `10` (2rem to 5rem), `15` (7.5rem), `05em`, `1em`, `105em`, `2em` and their negatives (`neg-1px`, `neg-05`, `neg-1` ... `neg-15`) |
| `margin-x-<v>`, `margin-right-<v>`, `margin-left-<v>`                                                              | `margin-left` and `margin-right`, or one side | the values above, plus `auto` and the named widths `card` (10rem), `card-lg` (15rem) and `mobile` (20rem) only                                                                                                                    |
| `margin-y-<v>`, `margin-top-<v>`, `margin-bottom-<v>`                                                              | `margin-top` and `margin-bottom`, or one side | the values of `margin-<v>`, plus `auto`                                                                                                                                                                                           |
| `padding-<v>`                                                                                                      | `padding`                                     | `0`, `1px`, `2px`, `05`, `1`, `105`, `2`, `205`, `3`, `4` to `10`, `15`                                                                                                                                                           |
| `padding-x-<v>`, `padding-y-<v>`, `padding-top-<v>`, `padding-right-<v>`, `padding-bottom-<v>`, `padding-left-<v>` | the matching padding                          | the same values as `padding-<v>`                                                                                                                                                                                                  |

Padding has no negative, `auto`, `em` or named-width values. `margin-<v>`
with no side has no `auto` class; use `margin-x-auto` or `margin-y-auto`.

The values these classes take are defined by the design tokens: [Spacing units](tokens-spacing-units.md).

## Variants

- **Responsive.** `mobile-lg:`, `tablet:` and `desktop:` variants (480px,
  640px and 1024px, `min-width`, mobile first) are output for every margin and
  padding class: `padding-2 tablet:padding-4`, `margin-x-0 desktop:margin-x-auto`.
- **State.** None. No `hover:`, `focus:`, `active:` or `visited:` variants.

## Sass

```scss
@use '@pathableai/styles' as *;

.plan-panel {
  @include u-padding(2);
  @include u-margin-bottom(3);
  @include u-margin-x('auto');

  @include at-media('tablet') {
    @include u-padding(4);
  }
}

.plan-panel__title {
  @include u-margin-top('neg-1'); // or -1
  @include u-padding-y('105');
}
```

Mixins: `u-margin`, `u-margin-x`, `u-margin-y`, `u-margin-top`,
`u-margin-right`, `u-margin-bottom`, `u-margin-left`, and the same set with
`u-padding`. Quote half values (`'05'`, `'105'`, `'205'`) as strings, pass
other numbers unquoted, and add `!important` as a final argument to output it
for one use.

## Settings

The matching USWDS modules are `margin` (which includes the horizontal and
vertical variants) and `padding`. PathAble does not override any of these
settings, so USWDS defaults apply:

| Setting                                           | Default                             | Effect                                                                                   |
| ------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------- |
| `$output-these-utilities`                         | `default` (every module)            | A list such as `('margin', 'padding')` outputs only those modules                        |
| `$margin-settings`, `$padding-settings`           | `output: true`, `responsive: true`  | Set `responsive: false` to drop the breakpoint variants                                  |
| `$margin-manual-values`, `$padding-manual-values` | `()`                                | Adds a value, such as `$padding-manual-values: ('gutter': 1.25rem)` for `padding-gutter` |
| `$utilities-use-important`                        | `false`                             | `true` outputs every utility with `!important`                                           |
| `$theme-utility-breakpoints`                      | `mobile-lg`, `tablet`, `desktop` on | Which responsive prefixes exist                                                          |

Every module also takes `active`, `focus`, `hover` and `visited` keys, all
`false` here:

```scss
@use '@pathableai/styles' with (
  $margin-settings: (
    responsive: false,
  ),
  $padding-manual-values: (
    'gutter': 1.25rem,
  )
);
```

## States

Each state is complete markup for one use of the utilities. Copy the one
closest to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults. Lengths are the values the compiled
stylesheet outputs at a 16px root font size.

## The consumer owns

- Using the scale consistently: prefer the same few values across the
  application instead of a different one per block.
- Keeping a margin from collapsing or doubling: vertical margins between
  adjacent blocks collapse, so set the gap on one of the two blocks.
- Making padding large enough for touch targets where the padded element is
  interactive.
- Overriding component spacing with care: a utility class on a component
  competes with the component's own rule on specificity and order, so test the
  result.
