---
name: Float
slug: utilities-float
kind: utility
summary: Utility classes that float an element to the left or right, or turn floating off.
uswds: https://designsystem.digital.gov/utilities/float/
classes:
  - float-none
  - float-left
  - float-right
guarantees:
  - id: left
    claim: float-left sets float left.
  - id: right
    claim: float-right sets float right.
  - id: none
    claim: float-none sets float none, and on an element that also has float-left it wins, because it comes later in the stylesheet, so the element is not floated.
  - id: not-responsive
    claim: The stylesheet contains no tablet:float-left, tablet:float-right or tablet:float-none class and no hover:float-left class.
---

# Float

Utility classes that float an element to the left or right, or turn floating
off. The class names are unprefixed.

## When to use

- Letting a short block, such as a contact detail or a label, sit at one side
  while the text after it wraps around it.
- Placing two short blocks at opposite ends of a container when a flex row is
  not available.

Use something else when:

- items need to line up, share space or change order: use the
  [flex utilities](utilities-flex.md), which also need no clearing;
- a page is laid out in rows and columns: use the
  [layout grid](utilities-layout-grid.md).

A floated element is taken out of its parent's height. Give the parent
[`clearfix`](utilities-clearfix.md) so it contains its floats.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: side-by-side -->

## Classes

| Class pattern | Property | Values                  |
| ------------- | -------- | ----------------------- |
| `float-<v>`   | `float`  | `none`, `left`, `right` |

`float-none` is for an element that another rule floats, such as markup
generated with `float-left` on every item where one item must not float. In the
stylesheet it comes after `float-left`, so it wins over it on the same element;
`float-right` comes after `float-none`, so it wins over `float-none`. Putting
`float-none` on an element whose parent is floated does nothing, because a float
does not make its children float.

## Variants

- **Responsive.** None. `float-*` is output without `mobile-lg:`, `tablet:` or
  `desktop:` variants.
- **State.** None. No `hover:`, `focus:`, `active:` or `visited:` variants.

## States

Each state is complete markup for one use of the utilities. Copy the one
closest to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states the CSS a class compiles to at PathAble defaults.

## The consumer owns

- Clearing the floats: add [`clearfix`](utilities-clearfix.md) to the parent,
  or the parent collapses to the height of its non-floated content.
- Reading order. A floated element keeps its place in the source, so the order
  that keyboard and screen reader users meet content is the source order, not
  the drawn order.
- Giving a floated element a width when its content could stretch it across
  the line.
