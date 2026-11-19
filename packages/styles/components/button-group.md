---
name: ButtonGroup
slug: button-group
kind: static
summary: A flex container that stacks related buttons on narrow screens and puts them in one non-wrapping row from 480 px wide.
styles-class: pathable-button-group
variants: []
guarantees:
  - id: stacks-narrow
    status: unverified
    claim: Below a viewport width of 480 px the children stack in one column in DOM order, each stretched to the width of the group.
  - id: row-from-480
    status: unverified
    claim: From a viewport width of 480 px the children sit in a single row in DOM order that never wraps, and every child is stretched to the height of the tallest.
  - id: list-reset
    status: unverified
    claim: The group has no top or bottom margin, no list markers and no left padding, so a `<ul>` with the class in left-to-right text shows no bullets or indent.
  - id: button-spacing
    status: unverified
    claim: In the row, `pathable-button` children are 8 px apart, from each button's own right margin; the group adds no gap of its own.
---

# ButtonGroup

A flex container that stacks related buttons on narrow screens and puts them
in one non-wrapping row from 480 px wide. Put the class on a `<div>` or a
`<ul>` around two or three `pathable-button` elements. It adds no role, no
grouping semantics and no selection state.

## When to use

- Two or three related actions that belong together, such as "Save" and
  "Cancel" at the end of a form.
- A short set of actions that should be full-width, easy-to-tap buttons on a
  phone and a compact row on larger screens.

Use something else when:

- the buttons should wrap onto more lines when the row runs out of space: use
  `pathable-cluster`;
- the buttons should stay in a row at every width: use `pathable-inline`;
- the items are form fields: use `pathable-form-row`;
- the items are cards or tiles: use `pathable-card-grid` or `pathable-grid`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-button-group" role="group" aria-label="Plan actions">
  <button type="submit" class="pathable-button">Save plan</button>
  <button type="button" class="pathable-button pathable-button--outline">
    Cancel
  </button>
</div>
```

## Variants

The group has no modifier classes. Style each button with the `pathable-button`
modifiers, such as `pathable-button--outline`.

There is no segmented (joined-up) style. A segmented modifier on the group is
not defined in the stylesheet and has no effect.

## Tokens

None. The group's spacing is fixed: its 480 px breakpoint and its margins
are not custom properties and do not change with the theme.

## Composition

- Put `pathable-button` elements directly inside the group, or inside `<li>`
  elements when the group is a `<ul>`. The group lays out its direct
  children only and has no element classes.
- Below 480 px each `pathable-button` is full width and the stacked buttons
  touch, with no vertical space between them. Add your own space, such as a
  margin on the buttons, when they need it.
- The group has a negative inline margin of 4 px on each side, so it extends
  4 px beyond its container at the start and the end. Leave room for it, or
  use `pathable-cluster`, which has no negative margin.
- The row never wraps. With long labels or more than three buttons it can
  overflow a narrow container; keep labels short or use `pathable-cluster`.
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

## The consumer owns

- Accessibility. The class adds no semantics. When the buttons form a named
  set, add `role="group"` and an `aria-label`, as in the example. Do not use
  the group as a toggle or tab set: it has no selected state.
- Button order: put the primary action where your product's forms put it,
  and keep DOM order and visual order the same.
- Each button's type, label and behaviour.
- Space above and below the group, and between stacked buttons on narrow
  screens.
