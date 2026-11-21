---
name: Flex
slug: tokens-flex
kind: token
summary: 'The flex shorthand tokens 1 to 12, fill and auto, which size a flex item as a proportion of its row through the `flex-<token>` classes.'
uswds: https://designsystem.digital.gov/design-tokens/flex/
guarantees:
  - id: numeric-tokens
    claim: The classes flex-1, flex-2 and flex-12 set flex to "1 1 0%", "2 1 0%" and "12 1 0%".
  - id: fill
    claim: The class flex-fill sets flex to "1 1 0%".
  - id: auto
    claim: The class flex-auto sets flex to "0 1 auto".
  - id: twelve-tokens
    claim: The classes flex-1 to flex-12, flex-fill and flex-auto all exist, and flex-13 does not.
  - id: no-variants
    claim: No responsive or state prefix is emitted for the flex-<token> classes, so tablet:flex-1 and hover:flex-1 do not exist.
---

# Flex

The flex shorthand tokens 1 to 12, fill and auto, which size a flex item as a
proportion of its row through the `flex-<token>` classes. Each token is a value of the CSS `flex` shorthand: a grow factor, a
shrink factor of 1 and a basis. Put the token on the children of a flex
container. See the [USWDS flex tokens](https://designsystem.digital.gov/design-tokens/flex/).

## When to use

- Sharing a row in set proportions, such as a 1 to 2 split between a label
  column and a content column.
- Making one item take the leftover width (`flex-fill`) or size to its content
  (`flex-auto`).

Use something else when:

- the layout is a page grid of 12 columns: use the
  [layout grid](utilities-layout-grid.md) classes;
- only the direction, wrapping or alignment of the container needs to change:
  those are the other classes on [Flex](utilities-flex.md).

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: proportions -->

## Values

| Token       | Class                 | PathAble value (`flex`) | Notes                                       |
| ----------- | --------------------- | ----------------------- | ------------------------------------------- |
| `1`         | `flex-1`              | `1 1 0%`                | Grow 1                                      |
| `2`         | `flex-2`              | `2 1 0%`                | Grow 2                                      |
| `3` to `11` | `flex-3` to `flex-11` | `3 1 0%` to `11 1 0%`   | Grow equals the token                       |
| `12`        | `flex-12`             | `12 1 0%`               | Grow 12                                     |
| `fill`      | `flex-fill`           | `1 1 0%`                | Same value as `flex-1`                      |
| `auto`      | `flex-auto`           | `0 1 auto`              | Sized by content; shrinks but does not grow |

All numeric tokens use a basis of `0%`, so the width of an item comes only
from the share it has of the free space, not from its content. Items in one
row with tokens 1, 2 and 1 take one quarter, one half and one quarter of the
row. The numbers are proportions, not a count of columns: `flex-6` next to
`flex-6` is a 50/50 split, and `flex-1` next to `flex-1` is the same.

## Utilities

`flex-<token>` is documented on [Flex](utilities-flex.md), together with the
container classes (`flex-row`, `flex-column`, `flex-wrap`, `flex-justify-*`,
`flex-align-*`). Add `display-flex` to the container; see
[Display](utilities-display.md). No `mobile-lg:`, `tablet:` or `desktop:` prefix
and no `hover:`, `focus:`, `active:` or `visited:` prefix exists for these
classes.

## States

Each state is complete markup for one use of the flex tokens.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

## The consumer owns

- Setting `display-flex` (or `display: flex`) on the container; a flex token
  on a child of a block container has no effect.
- Letting items wrap or stack on narrow screens: a row of `flex-1` items does
  not wrap by itself, so add `flex-wrap` or switch to `flex-column`.
- Keeping text readable inside a narrow share: a basis of `0%` lets an item
  shrink below the width of its longest word.
