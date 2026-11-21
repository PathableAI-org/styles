---
name: Height and width
slug: utilities-height-and-width
kind: utility
summary: Utility classes that set an element's height, width, minimum and maximum sizes, fixed aspect ratio and circular or square shape.
uswds: https://designsystem.digital.gov/utilities/height-and-width/
classes:
  - height-<value>
  - width-<value>
  - maxh-<value>
  - maxw-<value>
  - minh-<value>
  - minw-<value>
  - add-aspect-<ratio>
  - circle-<value>
  - square-<value>
guarantees:
  - id: width
    status: unverified
    claim: width-full sets width 100%, width-auto sets auto, width-15 sets 7.5rem, width-card sets 10rem and width-mobile sets 20rem.
  - id: height
    status: unverified
    claim: height-full sets height 100%, height-viewport sets 100vh, height-card sets 10rem and height-auto sets auto.
  - id: max-and-min
    status: unverified
    claim: maxw-tablet sets max-width 40rem, maxw-none sets none, minh-viewport sets min-height 100vh and minw-15 sets min-width 7.5rem.
  - id: aspect
    status: unverified
    claim: add-aspect-16x9 sets aspect-ratio 1.7777777778 and max-width 100% in browsers that support aspect-ratio, and its direct children are positioned absolutely to fill it.
  - id: circle-square
    status: unverified
    claim: circle-5 sets width and height 2.5rem with border-radius 50%, and square-5 sets width and height 2.5rem with no border radius.
  - id: width-responsive
    status: unverified
    claim: tablet:width-full sets width 100% only from a viewport width of 40em (640px), and the stylesheet has no tablet:height-card class.
---

# Height and width

Utility classes that set an element's height, width, minimum and maximum
sizes, fixed aspect ratio and circular or square shape. All names are
unprefixed: `height-*`, `width-*`, `maxh-*`, `maxw-*`, `minh-*`, `minw-*`,
`add-aspect-*`, `circle-*` and `square-*`.

## When to use

- Limiting a line of text or a block to a readable width with `maxw-*`.
- Giving a block, image frame or avatar a fixed size.
- Keeping an embedded video or image frame at a fixed shape with
  `add-aspect-*`.
- Making a full-height panel with `height-viewport` or `minh-viewport`.

Use something else when:

- a column should be a share of a row: use the
  [layout grid](utilities-layout-grid.md);
- a line length should follow the typeface: use `measure-*` from the
  paragraph styles utilities.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: max-width -->

## Classes

| Class pattern        | Property                                     | Values                                                                                                                                                                    |
| -------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `height-<v>`         | `height`                                     | `0`, `auto`, `full` (100%), `viewport` (100vh), `1px`, `2px`, `05` to `3`, `4` to `10`, `15`, `card`, `card-lg`, `mobile`                                                 |
| `width-<v>`          | `width`                                      | `0`, `auto`, `full`, `1px`, `2px`, `05` to `3`, `4` to `10`, `15`, `card`, `card-lg`, `mobile`, `mobile-lg`, `tablet`, `tablet-lg`, `desktop`, `desktop-lg`, `widescreen` |
| `maxh-<v>`           | `max-height`                                 | `none`, `viewport`, `05` to `3`, `4` to `10`, `15`, `card`, `card-lg`, `mobile`, `mobile-lg`, `tablet`, `tablet-lg`                                                       |
| `maxw-<v>`           | `max-width`                                  | `none`, `full`, `05` to `3`, `4` to `10`, `15`, `card`, `card-lg`, `mobile`, `mobile-lg`, `tablet`, `tablet-lg`, `desktop`, `desktop-lg`, `widescreen`                    |
| `minh-<v>`           | `min-height`                                 | `0`, `full`, `viewport`, `1px`, `2px`, `05` to `3`, `4` to `10`, `15`, `card`, `card-lg`, `mobile`, `mobile-lg`, `tablet`, `tablet-lg`                                    |
| `minw-<v>`           | `min-width`                                  | `0`, `05` to `3`, `4` to `10`, `15`                                                                                                                                       |
| `add-aspect-<ratio>` | `aspect-ratio` and a fill-the-box child rule | `16x9`, `9x16`, `4x3`, `2x1`, `1x1`                                                                                                                                       |
| `circle-<v>`         | `width`, `height`, `border-radius: 50%`      | `1px`, `2px`, `05` to `3`, `4` to `10`, `15`, `card`, `card-lg`, `mobile`                                                                                                 |
| `square-<v>`         | `width`, `height`                            | the same values as `circle-<v>`                                                                                                                                           |

The numeric values are USWDS spacing units (1 unit is 0.5rem, so `height-5` is
2.5rem and `width-15` is 7.5rem). The named sizes are `card` 10rem, `card-lg`
15rem, `mobile` 20rem, `mobile-lg` 30rem, `tablet` 40rem, `tablet-lg` 55rem,
`desktop` 64rem, `desktop-lg` 75rem and `widescreen` 87.5rem.

`add-aspect-*` is for a box whose child fills it, such as an iframe or an
image; the box keeps its shape at any width up to its own `max-width`.

The values these classes take are defined by the design tokens: [Spacing units](tokens-spacing-units.md).

## Variants

- **Responsive.** Only `width-*` has responsive variants: `mobile-lg:`,
  `tablet:` and `desktop:` (480px, 640px and 1024px, `min-width`, mobile
  first), such as `width-full tablet:width-mobile-lg`. `height`, `maxh`,
  `maxw`, `minh`, `minw`, `add-aspect`, `circle` and `square` have no
  responsive variants.
- **State.** None. No `hover:`, `focus:`, `active:` or `visited:` variants.

## Sass

```scss
@use '@pathableai/styles' as *;

.welcome-video {
  @include add-aspect('16x9');
  @include u-maxw('mobile-lg');
}

.plan-panel {
  @include u-width('full');
  @include u-minh('card');

  @include at-media('tablet') {
    @include u-width('mobile-lg');
  }
}

.avatar {
  @include u-circle(5);
}
```

Mixins: `u-height`, `u-width`, `u-maxh`, `u-maxw`, `u-minh`, `u-minw`,
`u-circle` and `u-square`; `add-aspect` has no `u-` prefix and takes the ratio
as a string. Quote strings and half values (`u-width('05')`), and add
`!important` as a final argument to output it for one use.

## Settings

The matching USWDS modules are `height`, `width`, `max-height`, `max-width`,
`min-height`, `min-width`, `add-aspect`, `circle` and `square`. PathAble does
not override any of these settings, so USWDS defaults apply:

| Setting                                                                                                                                                                          | Default                             | Effect                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------- |
| `$output-these-utilities`                                                                                                                                                        | `default` (every module)            | A list such as `('width', 'max-width')` outputs only those modules         |
| `$width-settings`                                                                                                                                                                | `output: true`, `responsive: true`  | Breakpoint variants of `width-*`                                           |
| `$height-settings`, `$max-height-settings`, `$max-width-settings`, `$min-height-settings`, `$min-width-settings`, `$add-aspect-settings`, `$circle-settings`, `$square-settings` | `output: true`, `responsive: false` | Set `responsive: true` to output breakpoint variants                       |
| `$<module>-manual-values`                                                                                                                                                        | `()`                                | Adds a value, such as `$width-manual-values: ('tab': 4ch)` for `width-tab` |
| `$utilities-use-important`                                                                                                                                                       | `false`                             | `true` outputs every utility with `!important`                             |
| `$theme-utility-breakpoints`                                                                                                                                                     | `mobile-lg`, `tablet`, `desktop` on | Which responsive prefixes exist                                            |

Every module also takes `active`, `focus`, `hover` and `visited` keys, all
`false` here:

```scss
@use '@pathableai/styles' with (
  $width-manual-values: (
    'tab': 4ch,
  ),
  $max-width-settings: (
    responsive: true,
  )
);
```

## States

Each state is complete markup for one use of the utilities. Copy the one
closest to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour that was read from the package source and that no test
checks yet (`status: unverified`). Lengths are the values the compiled
stylesheet outputs at a 16px root font size.

## The consumer owns

- Keeping text readable when a fixed `height-*` or `maxh-*` clips it: prefer
  `minh-*` or `maxw-*` for text, and set `overflow` deliberately with the
  [display utilities](utilities-display.md).
- Giving an image inside `add-aspect-*` an `alt` that describes it, and
  giving an embedded frame a `title`.
- Text inside a `circle-*` or `square-*` fitting its box at larger text
  sizes.
- Avoiding fixed widths in a container that is narrower than the width.
