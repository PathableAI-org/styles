---
name: Button group
slug: button-group
kind: static
summary: A list of related buttons that stack on narrow screens and sit in a row from 480 px wide.
styles-class: pathable-button-group
variants:
  - axis: style
    default: default
    values: [default, segmented]
guarantees:
  - id: stacks-narrow
    claim: Below a viewport width of 480 px the children stack in one column in DOM order, each stretched to the width of the group.
  - id: stacked-gap
    claim: Below a viewport width of 480 px the stacked children are 8 px apart, from a row gap of 0.5rem on the group, so the focus ring of a focused button is visible on all four sides.
  - id: row-from-480
    claim: From a viewport width of 480 px the children sit side by side in DOM order, each stretched to the height of the tallest beside it, and they wrap or stack when they do not fit the group's container, so none runs past it.
  - id: list-reset
    claim: The group has no top or bottom margin, no list markers and no left padding, so the `<ul>` shows no bullets or indent.
  - id: button-spacing
    claim: In the row, the items are 8 px apart, from each button's own right margin; the group adds no column gap of its own, and a wrapped line sits 8 px below the one above it, from the same 0.5rem row gap that spaces the stacked children.
  - id: segmented
    claim: With the segmented modifier the group is one row that never wraps, its pathable-button-group__item children touch with no gap, only the outer corners of the first and last button are rounded, and a hovered or focused button is drawn above its neighbours.
---

# Button group

A list of related buttons that stack on narrow screens and sit in a row from
480 px wide. Put `pathable-button-group` on a `<ul>`, a
`pathable-button-group__item` on each `<li>`, and a `pathable-button` inside
each item. The class adds no role, no grouping semantics and no selection
state.

## When to use

- Two or three related actions that belong together, such as "Back" and
  "Continue" at the end of a step.
- A short set of actions that should be full-width, easy-to-tap buttons on a
  phone and a compact row on larger screens.
- A segmented group that switches between views of the same content, such as
  a list, a board and a calendar of appointments.

Use something else when:

- the items are cards: use a `pathable-card-group`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: default -->

## Variants

Style each button with the `pathable-button` modifiers, such as
`pathable-button--outline`. The group itself has one style modifier.

| Axis  | Value       | Class                              | What it is for                                                                                                      |
| ----- | ----------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| style | `default`   | none                               | Separate buttons that stack on a phone and sit in a row from 480 px.                                                |
| style | `segmented` | `pathable-button-group--segmented` | Joined buttons in one strip that switch between views. The current view is a filled button, the others are outline. |

In a segmented group, show exactly one current state: the current button is
filled and the alternatives use `pathable-button--outline`.

## States

<!-- examples -->

## Composition

- Make the group a `<ul>` and put each `pathable-button` or button-styled
  `<a>` inside a `<li class="pathable-button-group__item">`. The group lays
  out its items only.
- Do not nest a group inside another group.
- Below 480 px each item is full width and the stacked buttons sit 8 px apart,
  so the focused button's focus ring shows on all four sides.
- The group has a negative inline margin of 4 px on each side, so it extends
  4 px beyond its container at the start and the end. Leave room for it.
- From 480 px the row wraps: when the items do not fit the group's container,
  such as with long labels, more than three buttons or enlarged text, the last
  one moves to a new line 8 px below instead of running past the container.
- The 480 px breakpoint follows the viewport, not the group's container. It
  is set as 30em, which is 480 px at the browser's default 16 px font size;
  a larger default font size moves it.
- A segmented group joins its buttons into one strip. Use one filled button for
  the current view and `pathable-button--outline` for the others.
- A width class on a button, such as `width-auto`, wins over the group's own
  width at every viewport width, so in a segmented group the buttons can keep
  the width of their labels on a phone instead of filling it. Below 480 px
  the item then takes the width of its button, so the strip stays joined and
  can end before the group's right edge, and a button with no width class in
  the same group takes the rest of the strip. When the labels do not fit, the
  items shrink and the labels wrap, as they do without a width class. From
  480 px the strip is as wide as its content. `width-full` keeps a segmented
  button at its share of the strip, as when it has no width class.
- On a `<ul>` in right-to-left text, remove the list's right padding
  yourself: the group only clears the left padding.

## Guarantees

The guarantees are the list in the front matter at the top of this page.

## The consumer owns

- Accessibility. The list gives the buttons list semantics, and the class adds
  nothing else. When the buttons form a named set, add an `aria-label` to the
  `<ul>`.
- The current state of a segmented group. Expose it to assistive technology,
  for example with `aria-pressed` on each button, and change the filled and
  outline looks together with it. A segmented group switches views of the same
  content; it is not a tab set.
- Button order: put the primary action where your product's forms put it,
  and keep DOM order and visual order the same.
- Each button's type, label and behaviour.
- Space above and below the group.
