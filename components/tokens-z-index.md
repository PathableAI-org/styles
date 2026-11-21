---
name: Z-index
slug: tokens-z-index
kind: token
summary: 'The z-index tokens bottom, 0, 100 to 500, top and auto, a short fixed scale of stacking levels used through the `z-<token>` classes.'
uswds: https://designsystem.digital.gov/design-tokens/z-index/
guarantees:
  - id: classes
    claim: The classes z-bottom, z-0, z-100, z-200, z-300, z-400, z-500, z-top and z-auto set z-index to -100, 0, 100, 200, 300, 400, 500, 99999 and auto.
  - id: no-variants
    claim: No responsive or state prefix is emitted for the z-<token> classes, so tablet:z-top and hover:z-top do not exist.
  - id: no-off-scale-class
    claim: No class exists for a level that is not on the scale, such as z-250.
  - id: positioned-only
    claim: A z-<token> class stacks an element only when the element is positioned or is a flex or grid item, as for any z-index.
---

# Z-index

The z-index tokens bottom, 0, 100 to 500, top and auto, a short fixed scale of
stacking levels used through the `z-<token>` classes. A fixed scale keeps stacking decisions in one place instead of
escalating numbers in each component. See the
[USWDS z-index tokens](https://designsystem.digital.gov/design-tokens/z-index/).

## When to use

- Placing an overlay, a sticky header or a dropdown above page content.
- Pushing a decorative layer behind content (`z-bottom`).

Use something else when:

- the element only needs to sit after another: reorder the markup instead;
- a component already stacks itself: do not override its stacking with a
  utility.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: stacking -->

## Values

| Token    | Class      | PathAble value | Use                                               |
| -------- | ---------- | -------------- | ------------------------------------------------- |
| `bottom` | `z-bottom` | `-100`         | Behind the content of the parent stacking context |
| `0`      | `z-0`      | `0`            | The base stacking level                           |
| `100`    | `z-100`    | `100`          | Slightly raised content                           |
| `200`    | `z-200`    | `200`          |                                                   |
| `300`    | `z-300`    | `300`          |                                                   |
| `400`    | `z-400`    | `400`          |                                                   |
| `500`    | `z-500`    | `500`          | Highest numbered level                            |
| `top`    | `z-top`    | `99999`        | Above everything else, for a modal or a skip link |
| `auto`   | `z-auto`   | `auto`         | The default; stacks by markup order               |

## Utilities

`z-<token>` is documented on [Display](utilities-display.md), together with
`position-*` and the offset classes it works with. It has no `mobile-lg:`,
`tablet:` or `desktop:` prefix and no `hover:`, `focus:`, `active:` or
`visited:` prefix.

## States

Each state is complete markup for one use of the z-index tokens.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

## The consumer owns

- Positioning the element: add `position-relative`, `position-absolute`,
  `position-fixed` or `position-sticky`, or place it in a flex or grid
  container; `z-<token>` alone does nothing on a static block.
- Stacking contexts: a token compares only with siblings in the same stacking
  context, so a `z-top` child of a lower-stacked parent stays below a later
  sibling of that parent.
- Keeping focus order and reading order in step with the visual stack;
  overlays that trap focus need the right semantics and keyboard handling.
