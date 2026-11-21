---
name: Flex
slug: utilities-flex
kind: utility
summary: 'Utility classes for flex containers and items: direction, wrapping, justification, alignment, item sizing and visual order.'
uswds: https://designsystem.digital.gov/utilities/flex/
classes:
  - flex-<value>
  - flex-fill
  - flex-auto
  - flex-row
  - flex-column
  - flex-wrap
  - flex-no-wrap
  - flex-justify
  - flex-justify-<value>
  - flex-align-<value>
  - flex-align-self-<value>
  - order-<value>
guarantees:
  - id: container
    status: unverified
    claim: display-flex makes an element a flex container, flex-row sets flex-direction row, flex-column sets column, flex-wrap sets flex-wrap wrap and flex-no-wrap sets nowrap.
  - id: justify
    status: unverified
    claim: flex-justify-start sets justify-content flex-start, flex-justify-center sets center, flex-justify-end sets flex-end and flex-justify sets space-between.
  - id: align
    status: unverified
    claim: flex-align-center sets align-items center and flex-align-start, flex-align-end, flex-align-stretch and flex-align-baseline set their own values, and flex-align-self-end sets align-self flex-end.
  - id: items
    status: unverified
    claim: flex-fill sets flex 1 1 0%, flex-auto sets flex 0 1 auto, and flex-1 sets flex 1 1 0% while flex-3 sets flex 3 1 0%.
  - id: order
    status: unverified
    claim: order-first sets order -1, order-last sets order 999, order-initial sets order initial, and order-0 to order-11 set that number.
  - id: responsive
    status: unverified
    claim: tablet:order-first and tablet:flex-justify-center take effect only from a viewport width of 40em (640px), and flex-row, flex-column, flex-wrap and the flex-align classes have no tablet variant.
---

# Flex

Utility classes for flex containers and items: direction, wrapping,
justification, alignment, item sizing and visual order. Alignment and order
live on this page on the USWDS site, so `flex-align-*`, `flex-align-self-*`,
`flex-justify-*` and `order-*` are all here. Every name is unprefixed. The
container itself is `display-flex` from the [display utilities](utilities-display.md).

## When to use

- A row or column of items that share, centre or space out the available room:
  a name and a status at opposite ends, a toolbar, an icon beside text.
- Changing the visual order of items at a breakpoint.

Use something else when:

- the layout is a page-level set of rows and columns: use the
  [layout grid](utilities-layout-grid.md);
- you only need space between two blocks: use
  [margin and padding](utilities-margin-and-padding.md).

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: row -->

## Classes

| Class pattern               | Property          | Values                                                                                    |
| --------------------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| `flex-<n>`                  | `flex`            | `n` from 1 to 12: `n 1 0%`                                                                |
| `flex-fill`                 | `flex`            | `1 1 0%`                                                                                  |
| `flex-auto`                 | `flex`            | `0 1 auto`                                                                                |
| `flex-row`, `flex-column`   | `flex-direction`  | `row`, `column`                                                                           |
| `flex-wrap`, `flex-no-wrap` | `flex-wrap`       | `wrap`, `nowrap`                                                                          |
| `flex-justify-<v>`          | `justify-content` | `start` (flex-start), `center`, `end` (flex-end); `flex-justify` alone is `space-between` |
| `flex-align-<v>`            | `align-items`     | `start`, `center`, `end`, `stretch`, `baseline`                                           |
| `flex-align-self-<v>`       | `align-self`      | `start`, `center`, `end`, `stretch`, `baseline`                                           |
| `order-<v>`                 | `order`           | `first` (-1), `last` (999), `initial`, `0` to `11`                                        |

The flex container is `display-flex` (or `display-inline-flex`); the classes
above do nothing on an element that is not a flex container or flex item.

The values these classes take are defined by the design tokens: [Flex](tokens-flex.md) and [Order](tokens-order.md).

## Variants

- **Responsive.** `justify-content` and `order` have `mobile-lg:`, `tablet:`
  and `desktop:` variants (480px, 640px and 1024px, `min-width`, mobile
  first): `tablet:flex-justify-center`, `tablet:order-first`. The
  `flex-<n>`, `flex-fill`, `flex-auto`, direction, wrap, `flex-align-*` and
  `flex-align-self-*` classes have no responsive variants. Use
  `tablet:display-none` and `tablet:display-flex` to switch layouts.
- **State.** None. No `hover:`, `focus:`, `active:` or `visited:` variants.

## Sass

`u-flex` takes any flex value, written as the class name without the `flex-`
prefix (`row`, `wrap`, `fill`, `align-center`, `align-self-end`,
`justify-center`), and picks the property from the name:

```scss
@use '@pathableai/styles' as *;

.plan-summary {
  @include u-display('flex');
  @include u-flex('row', 'wrap', 'align-center', 'justify-center');
}

.plan-summary__status {
  @include u-flex('fill', 'align-self-end');
  @include u-order('last');
}
```

Mixins: `u-flex`, `u-flex-direction`, `u-align-items`, `u-align-self`,
`u-justify-content` and `u-order`. The per-property mixins other than
`u-order` take the same names as `u-flex` (`u-align-items('align-center')`,
`u-justify-content('justify-center')`, `u-flex-direction('column')`), so
prefer `u-flex` for everything except order. Add `!important` as a final
argument to output it for one use.

## Settings

The matching USWDS modules are `flex`, `flex-direction`, `flex-wrap`,
`align-items`, `align-self`, `justify-content` and `order`. PathAble does not
override any of these settings, so USWDS defaults apply:

| Setting                                                                                                              | Default                             | Effect                                                        |
| -------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------- |
| `$output-these-utilities`                                                                                            | `default` (every module)            | A list such as `('flex', 'order')` outputs only those modules |
| `$justify-content-settings`, `$order-settings`                                                                       | `output: true`, `responsive: true`  | Breakpoint variants of `flex-justify-*` and `order-*`         |
| `$flex-settings`, `$flex-direction-settings`, `$flex-wrap-settings`, `$align-items-settings`, `$align-self-settings` | `output: true`, `responsive: false` | Set `responsive: true` to output breakpoint variants          |
| `$utilities-use-important`                                                                                           | `false`                             | `true` outputs every utility with `!important`                |
| `$theme-utility-breakpoints`                                                                                         | `mobile-lg`, `tablet`, `desktop` on | Which responsive prefixes exist                               |

Every module also takes `active`, `focus`, `hover` and `visited` keys, all
`false` here:

```scss
@use '@pathableai/styles' with (
  $flex-direction-settings: (
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
checks yet (`status: unverified`).

## The consumer owns

- Source order. `order-*` changes only what is drawn, not the order that
  keyboard focus and screen readers follow, so keep the source order
  meaningful and use `order-*` for presentation only.
- Giving a flex item a way to shrink or wrap when its content is long, such as
  `flex-wrap` on the container.
- The container: add `display-flex` and any gap with
  [margin](utilities-margin-and-padding.md) on the items.
