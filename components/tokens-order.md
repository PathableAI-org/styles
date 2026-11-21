---
name: Order
slug: tokens-order
kind: token
summary: 'The order tokens first, last, initial and 0 to 11, which change the visual position of a flex or grid item without changing the markup, through the `order-<token>` classes and the `order()` function.'
uswds: https://designsystem.digital.gov/design-tokens/order/
guarantees:
  - id: keywords
    claim: order('first') resolves to -1, order('last') to 999 and order('initial') to initial, and the classes order-first, order-last and order-initial set order to those values.
  - id: numbers
    claim: order(0) resolves to 0 and order(11) to 11, the classes order-0 to order-11 set order to the token, and order-12 does not exist.
  - id: responsive-variants
    claim: The classes mobile-lg:order-first, tablet:order-first and desktop:order-last exist and set order inside a min-width media query, and no state prefix such as hover:order-1 exists.
  - id: invalid-token
    claim: order(12) is a Sass compile error.
  - id: dom-unchanged
    claim: An order class changes only the visual order of siblings in a flex or grid container and does not change their order in the document, so reading and keyboard order follow the markup.
---

# Order

The order tokens first, last, initial and 0 to 11, which change the visual
position of a flex or grid item without changing the markup, through the
`order-<token>` classes and the `order()` function. Items are laid out by
ascending `order`, and items with the same value keep their markup order. See
the [USWDS order tokens](https://designsystem.digital.gov/design-tokens/order/).

## When to use

- Moving a panel to the top or bottom of a stack at one breakpoint, for example
  a contact panel that follows the content on a phone and leads it on a
  tablet.
- Placing one item first or last in a flex row without touching the others.

Use something else when:

- the reading order must change: edit the markup, because `order` does not
  move the item for screen readers or keyboard users;
- the item is not in a flex or grid container: `order` has no effect there.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: reorder -->

## Tokens

| Token       | Class                   | Value       | Notes                                              |
| ----------- | ----------------------- | ----------- | -------------------------------------------------- |
| `'first'`   | `order-first`           | `-1`        | Before every item whose order is 0 or more         |
| `'last'`    | `order-last`            | `999`       | After every item whose order is 998 or less        |
| `'initial'` | `order-initial`         | `initial`   | Resets to the CSS initial value, which is 0        |
| `0`         | `order-0`               | `0`         | The value an item has when no class is set         |
| `1` to `11` | `order-1` to `order-11` | `1` to `11` | Ascending position, after items with a lower value |

Only items with an order class move. An item with no class has order 0 and
keeps its place among the other items at 0. `order-first` is below 0, so an
item with it comes before the unclassed items.

## Sass

`order()` returns the value and `u-order()` sets the `order` property:

```scss
@use '@pathableai/styles' as *;

.contact-panel {
  @include u-order('last');

  @include at-media('tablet') {
    @include u-order('first');
  }
}
```

`order(12)` is a compile error.

## Utilities

`order-<token>` is documented on [Flex](utilities-flex.md). It has responsive
variants: `mobile-lg:order-<token>`, `tablet:order-<token>` and
`desktop:order-<token>`, applying from that breakpoint up. No `hover:`,
`focus:`, `active:` or `visited:` prefix exists for it by default. The container
needs `display-flex` ([Display](utilities-display.md)) or a grid.

## Settings

| Setting                      | PathAble default                                    | Controls                                       |
| ---------------------------- | --------------------------------------------------- | ---------------------------------------------- |
| `$order-settings`            | `()`, giving output on, responsive on, states off   | Which variants the `order-<token>` classes get |
| `$order-palettes`            | `('palette-order-default')`                         | Which tokens become classes                    |
| `$order-manual-values`       | `()`                                                | Extra class values                             |
| `$theme-utility-breakpoints` | `mobile-lg`, `tablet`, `desktop` on (USWDS default) | Which breakpoints get a prefix                 |

```scss
@use '@pathableai/styles' with (
  $order-settings: (
    responsive: false,
  )
);
```

## States

Each state is complete markup for one use of the order tokens.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

## The consumer owns

- Keeping the markup in a meaningful reading order: screen readers, the Tab
  key and search results follow the markup, not the order class (WCAG 1.3.2
  Meaningful Sequence and 2.4.3 Focus Order).
- Limiting reordering to presentation that does not change meaning, such as
  swapping two equal panels, and checking that focus does not jump
  unexpectedly.
- Giving items a numeric order only when the whole set is classed, so a mix of
  classed and unclassed items does not surprise.
