---
name: List reset
slug: utilities-list-reset
kind: utility
summary: A utility class that removes a list's bullets or numbers, indent and outer top and bottom margin.
uswds: https://designsystem.digital.gov/utilities/list-reset/
classes:
  - add-list-reset
guarantees:
  - id: reset
    claim: add-list-reset sets margin-top 0, margin-bottom 0, padding-left 0 and list-style none.
  - id: items-unchanged
    claim: add-list-reset sets no property on the list items, so their own margins, padding and widths are not changed.
  - id: ol
    claim: add-list-reset on an ol removes its numbers as well as the bullets of a ul.
  - id: not-responsive
    claim: The stylesheet contains no tablet:add-list-reset class and no hover:add-list-reset class.
---

# List reset

A utility class that removes a list's bullets or numbers, indent and outer top
and bottom margin. The class name is `add-list-reset`, unprefixed. The component modifier for an unstyled text list is
`pathable-list--unstyled`, described on the [List](list.md) page; this utility
is the general reset for any list.

## When to use

- A `<ul>` or `<ol>` that is not a run of text: a row of workshops laid out
  with [flex](utilities-flex.md), a menu, or a set of cards.
- Your own component's list, where the class resets the browser defaults before
  your own spacing.

Use something else when:

- the list is a plain text list that only needs its markers hidden: use
  `pathable-list pathable-list--unstyled` from the [List](list.md) page, which
  also sets the item spacing and line length.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: reset -->

## Classes

| Class pattern    | Property                                                    | Values                          |
| ---------------- | ----------------------------------------------------------- | ------------------------------- |
| `add-list-reset` | `margin-top`, `margin-bottom`, `padding-left`, `list-style` | `0`, `0`, `0`, `none`; no value |

## Variants

- **Responsive.** None. `add-list-reset` is output without `mobile-lg:`,
  `tablet:` or `desktop:` variants.
- **State.** None. No `hover:`, `focus:`, `active:` or `visited:` variants.

## States

Each state is complete markup for one use of the utility. Copy the one closest
to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states the CSS a class compiles to at PathAble defaults.

## The consumer owns

- List semantics. Some browsers stop announcing a list whose items draw no
  markers, so give a reset `<ul>` `role="list"` and a name, as the states
  here do.
- Spacing around and between the items, which the reset removes at the list
  level only.
- Choosing `<ol>` when order matters; the reset hides the numbers but not the
  fact that the list is ordered, so say the order in text if it matters.
