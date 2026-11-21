---
name: ButtonGroup
slug: button-group
kind: static
summary: A flex container that stacks related buttons on narrow screens and puts them in a row from 480 px wide.
styles-class: pathable-button-group
variants:
  - axis: style
    default: default
    values: [default, segmented]
guarantees:
  - id: stacks-narrow
    status: unverified
    claim: Below a viewport width of 480 px the children stack in one column in DOM order, each stretched to the width of the group.
  - id: stacked-gap
    status: unverified
    claim: Below a viewport width of 480 px the stacked children are 8 px apart, from a row gap of 0.5rem on the group, so the focus ring of a focused button is visible on all four sides.
  - id: row-from-480
    status: unverified
    claim: From a viewport width of 480 px the children sit side by side in DOM order, each stretched to the height of the tallest beside it, and they wrap or stack when they do not fit the group's container, so none runs past it.
  - id: list-reset
    status: unverified
    claim: The group has no top or bottom margin, no list markers and no left padding, so a `<ul>` with the class in left-to-right text shows no bullets or indent.
  - id: button-spacing
    status: unverified
    claim: In the row, `pathable-button` children are 8 px apart, from each button's own right margin; the group adds no column gap of its own, and a wrapped line sits 8 px below the one above it, from the same 0.5rem row gap that spaces the stacked children.
  - id: segmented
    status: unmet
    claim: With the segmented modifier the group is one row that never wraps, its pathable-button-group__item children touch with no gap, only the outer corners of the first and last button are rounded, and a hovered or focused button is drawn above its neighbours; neither the modifier nor the item class is in the stylesheet yet.
---

# ButtonGroup

A flex container that stacks related buttons on narrow screens and puts them
in a row from 480 px wide. Put the class on a `<div>` or a
`<ul>` around two or three `pathable-button` elements. It adds no role, no
grouping semantics and no selection state.

## When to use

- Two or three related actions that belong together, such as "Save" and
  "Cancel" at the end of a form.
- A short set of actions that should be full-width, easy-to-tap buttons on a
  phone and a compact row on larger screens.

Use something else when:

- the buttons should wrap onto more lines at every width, including below
  480 px where the group stacks: use `pathable-cluster`;
- the buttons should stay in a row at every width: use `pathable-inline`;
- the items are form fields: use `pathable-form-row`;
- the items are cards or tiles: use `pathable-card-grid` or `pathable-grid`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: default -->

## Variants

Style each button with the `pathable-button` modifiers, such as
`pathable-button--outline`. The group itself has one style modifier.

| Axis  | Value       | Class                              | What it is for                                                                 |
| ----- | ----------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| style | `default`   | none                               | Separate buttons that stack on a phone and sit in a row from 480 px.           |
| style | `segmented` | `pathable-button-group--segmented` | Joined buttons in one strip, for a few closely related actions. Not built yet. |

The segmented style is the target and is not in the stylesheet yet: neither
`pathable-button-group--segmented` nor the `pathable-button-group__item`
class that wraps each button has a rule, so the segmented example below does
not look joined today. See the `segmented` guarantee.

## States

<!-- examples -->

## Tokens

None. The group's spacing is fixed: its 480 px breakpoint and its margins
are not custom properties and do not change with the theme.

## Composition

- Put `pathable-button` elements directly inside the group, or inside `<li>`
  elements when the group is a `<ul>`. The group lays out its direct
  children only and has no element classes today. The segmented style will
  add `pathable-button-group__item` for the `<li>` around each button.
- Do not nest a group inside another group: nested groups are not designed or
  tested.
- Below 480 px each `pathable-button` is full width and the stacked buttons
  sit 8 px apart, so the focused button's focus ring shows on all four sides.
- The group has a negative inline margin of 4 px on each side, so it extends
  4 px beyond its container at the start and the end. Leave room for it, or
  use `pathable-cluster`, which has no negative margin.
- From 480 px the row wraps: when the buttons do not fit the group's
  container, such as with long labels, more than three buttons or enlarged
  text, the last one moves to a new line 8 px below instead of running past
  the container. Use `pathable-cluster` when you want wrapping at every width.
- The 480 px breakpoint follows the viewport, not the group's container. It
  is set as 30em, which is 480 px at the browser's default 16 px font size;
  a larger default font size moves it.
- On a `<ul>` in right-to-left text, remove the list's right padding
  yourself: the group only clears the left padding.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The `segmented` guarantee is unmet. Today a group with the segmented class is
laid out like the default group, so the buttons are separate and spaced.

## The consumer owns

- Accessibility. The class adds no semantics. When the buttons form a named
  set, add `role="group"` and an `aria-label`, as in the examples. On a `<ul>`
  with `role="list"` and an `aria-label`, as in the list example, each button
  sits in an `<li>`. Do not use the group as a toggle or tab set: it has no
  selected state, so a segmented group joins actions, not choices.
- Button order: put the primary action where your product's forms put it,
  and keep DOM order and visual order the same.
- Each button's type, label and behaviour.
- Space above and below the group.
