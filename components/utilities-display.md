---
name: Display
slug: utilities-display
kind: utility
summary: 'Utility classes that set how an element is shown, positioned and layered: display, opacity, overflow, position, offsets, pin and z-index.'
uswds: https://designsystem.digital.gov/utilities/display/
classes:
  - display-<value>
  - opacity-<value>
  - overflow-<value>
  - overflow-x-<value>
  - overflow-y-<value>
  - position-<value>
  - top-<value>
  - right-<value>
  - bottom-<value>
  - left-<value>
  - pin-<value>
  - z-<value>
guarantees:
  - id: display
    claim: display-none sets display none, display-block sets block, display-inline-block sets inline-block, display-flex sets flex, display-inline-flex sets inline-flex and display-table-cell sets table-cell.
  - id: display-responsive
    claim: tablet:display-none sets display none only from a viewport width of 40em (640px), and the display classes have mobile-lg, tablet and desktop variants.
  - id: position
    claim: position-relative, position-absolute, position-fixed, position-static and position-sticky set the position property to the same keyword.
  - id: offsets
    claim: top-0 sets top 0, top-1 sets top 0.5rem, top-neg-1 sets top -0.5rem, top-auto sets top auto and top-full sets top 100%, and right, bottom and left take the same values.
  - id: pin
    claim: pin-all sets top, right, bottom and left to 0 with position absolute, pin-x sets left and right to 0 with position absolute, and pin-none sets all four offsets to auto with position static.
  - id: z-index
    claim: z-100 sets z-index 100, z-top sets 99999, z-bottom sets -100, and z-0, z-200, z-300, z-400, z-500 and z-auto set their own value.
  - id: overflow-opacity
    claim: overflow-hidden sets overflow hidden, overflow-x-auto sets overflow-x auto and opacity-50 sets opacity 0.5.
---

# Display

Utility classes that set how an element is shown, positioned and layered:
display, opacity, overflow, position, offsets, pin and z-index. USWDS documents
all of them on one Display page, and they are listed together here. All names
are unprefixed.

## When to use

- Showing or hiding a block at a breakpoint, such as a long instruction on a
  tablet and a short one on a phone.
- Making an element a flex container, an inline-block or a block, with the
  `display-flex` class used with the [flex utilities](utilities-flex.md).
- Positioning a badge or caption against a parent with `position-relative`,
  `position-absolute` and the offset or pin classes.
- Clipping or scrolling overflowing content.

Use something else when:

- text must stay available to assistive technology but be invisible: use
  `pathable-sr-only`, because `display-none` removes the element from the
  accessibility tree;
- you are building page layout from rows and columns: use the
  [layout grid](utilities-layout-grid.md).

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: positioned-badge -->

## Classes

| Class pattern                                    | Property                                      | Values                                                                                                                                                                 |
| ------------------------------------------------ | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `display-<v>`                                    | `display`                                     | `block`, `flex`, `none`, `inline`, `inline-block`, `inline-flex`, `table`, `table-cell`, `table-row`                                                                   |
| `opacity-<v>`                                    | `opacity`                                     | `0`, `10`, `20`, `30`, `40`, `50`, `60`, `70`, `80`, `90`, `100` (0 to 1 in tenths)                                                                                    |
| `overflow-<v>`                                   | `overflow`                                    | `auto`, `hidden`, `scroll`, `visible`                                                                                                                                  |
| `overflow-x-<v>`                                 | `overflow-x`                                  | `auto`, `hidden`, `scroll`, `visible`                                                                                                                                  |
| `overflow-y-<v>`                                 | `overflow-y`                                  | `auto`, `hidden`, `scroll`, `visible`                                                                                                                                  |
| `position-<v>`                                   | `position`                                    | `absolute`, `fixed`, `relative`, `static`, `sticky`                                                                                                                    |
| `top-<v>`, `right-<v>`, `bottom-<v>`, `left-<v>` | `top`, `right`, `bottom`, `left`              | `0`, `auto`, `full` (100%), `1px`, `2px`, `05` (0.25rem), `1` (0.5rem), `105`, `2`, `205`, `3` (1.5rem) and their negatives (`neg-1px`, `neg-05`, `neg-1` ... `neg-3`) |
| `pin-<v>`                                        | offsets set to `0`, with `position: absolute` | `all` (four sides), `x` (left and right), `y` (top and bottom), `top`, `bottom`, `left`, `right`; `pin-none` sets the four offsets to `auto` and `position: static`    |
| `z-<v>`                                          | `z-index`                                     | `auto`, `bottom` (-100), `top` (99999), `0`, `100`, `200`, `300`, `400`, `500`                                                                                         |

The spacing values are the USWDS spacing units (1 unit is 0.5rem).

The values these classes take are defined by the design tokens: [Spacing units](tokens-spacing-units.md), [Z-index](tokens-z-index.md) and [Opacity](tokens-opacity.md).

## Variants

- **Responsive.** Only the `display-*` classes have responsive variants:
  `mobile-lg:`, `tablet:` and `desktop:` (480px, 640px and 1024px, `min-width`,
  mobile first), such as `display-none tablet:display-block`. `opacity`,
  `overflow`, `position`, the offsets, `pin` and `z-index` are output without
  breakpoint prefixes.
- **State.** None. No `hover:`, `focus:`, `active:` or `visited:` variants are
  output for any class on this page.

## Sass

```scss
@use '@pathableai/styles' as *;

.status-badge {
  @include u-position('absolute');
  @include u-top(0);
  @include u-right(0);
  @include u-z(100);
}

.plan-panel {
  @include u-display('none');
  @include u-overflow-x('auto');
  opacity: 0.5; // opacity has no mixin

  @include at-media('tablet') {
    @include u-display('block');
  }
}

.plan-footer {
  @include u-pin('bottom'); // also u-pin-bottom, u-pin-x, u-pin-all, u-pin-none
}
```

Mixins (opacity has none): `u-display`, `u-overflow`, `u-overflow-x`, `u-overflow-y`,
`u-position`, `u-top`, `u-right`, `u-bottom`, `u-left`, `u-pin`, `u-pin-all`,
`u-pin-x`, `u-pin-y`, `u-pin-top`, `u-pin-bottom`, `u-pin-left`,
`u-pin-right`, `u-pin-none` and `u-z`. Quote half values as strings
(`u-top('05')`), write negatives as `-1` or `'neg-1'`, and add `!important`
as a final argument to output it for one use.

## Settings

The matching USWDS modules are `display`, `opacity`, `overflow`, `position`,
`top`, `right`, `bottom`, `left`, `pin` and `z-index`. PathAble does not
override any of these settings, so USWDS defaults apply:

| Setting                                                                                                                                                                         | Default                             | Effect                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------- |
| `$output-these-utilities`                                                                                                                                                       | `default` (every module)            | A list of module names, such as `('display', 'position')`, outputs only those modules       |
| `$display-settings`                                                                                                                                                             | `output: true`, `responsive: true`  | Responsive variants of the `display-*` classes                                              |
| `$opacity-settings`, `$overflow-settings`, `$position-settings`, `$top-settings`, `$right-settings`, `$bottom-settings`, `$left-settings`, `$pin-settings`, `$z-index-settings` | `output: true`, `responsive: false` | Set `responsive: true` to output breakpoint variants for one module                         |
| `$utilities-use-important`                                                                                                                                                      | `false`                             | `true` outputs every utility with `!important`                                              |
| `$theme-utility-breakpoints`                                                                                                                                                    | `mobile-lg`, `tablet`, `desktop` on | Which responsive prefixes exist                                                             |
| `$<module>-manual-values`                                                                                                                                                       | `()`                                | Adds a value to one module, such as `$z-index-manual-values: ('modal': 1000)` for `z-modal` |

Every module also takes `active`, `focus`, `hover` and `visited` keys, all
`false` here:

```scss
@use '@pathableai/styles' with (
  $z-index-settings: (
    responsive: true,
  ),
  $z-index-manual-values: (
    'modal': 1000,
  )
);
```

## States

Each state is complete markup for one use of the utilities. Copy the one
closest to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

## The consumer owns

- Whether hidden content should be hidden from everyone. `display-none` also
  hides the element from assistive technology, and an element hidden below a
  breakpoint is unavailable there, so repeat essential content rather than
  hiding the only copy.
- Stacking order beyond the values in the table: choose `z-*` values so
  components stay in a consistent order, and avoid `position-fixed` content
  that covers focused controls.
- Making a scrollable region reachable by keyboard when it scrolls
  (`overflow-*` with overflowing content needs `tabindex="0"` and a name).
- Keeping text readable when `opacity-*` is below 100, including its contrast.
