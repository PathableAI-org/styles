---
name: Radio buttons
slug: radio
kind: static
summary: A native radio button with a styled label, for one choice among several that exclude each other.
styles-class: pathable-radio
variants: []
guarantees:
  - id: input-hidden
    claim: The native input is moved off-screen (position absolute, 999em to the left) but stays in the tab order, and the label draws the visible control.
  - id: circle
    claim: The unselected control is a 1.25rem (20 px at a 16 px root) circle with a white fill and a 2 px outline in #00365c, drawn 2rem (32 px) to the left of the label text.
  - id: label-layout
    claim: The label is inline-block with a 0.75rem (12 px) top margin and 2rem (32 px) of left padding, in normal weight, and shows a pointer cursor.
  - id: checked
    claim: A selected radio shows a #015a76 centre inside a 2 px white ring, inside a 2 px #015a76 outline.
  - id: disabled
    claim: A disabled input, or one with aria-disabled="true", shows its label in #757575 with a not-allowed cursor and a white circle with a 2 px #757575 outline, and a selected one shows a #757575 centre and outline.
  - id: focus-ring
    claim: When the input has focus, the circle shows a 0.25rem (4 px) solid #4899e8 outline 0.25rem (4 px) outside it, except on a focused tile input that is checked and does not have aria-disabled="true", where the outline is #00365c so it keeps 3:1 against the tile tint (an input with the disabled attribute cannot take focus).
  - id: root-block
    claim: The root is display block, so each radio starts on its own line, unless the element is a bare input or has the hidden attribute.
  - id: description
    claim: A label description is a block inside the label, 0.87rem (13.9 px at a 16 px root) with a 0.5rem (8 px) top margin.
  - id: tile
    claim: With pathable-radio__input--tile on the input, the label is a box with a 2 px border in a light grey, 4 px rounded corners, 0.5rem (8 px) top margin and padding of 0.75rem (12 px) above and below, 1rem (16 px) at the end and 2.5rem (40 px) at the start, with the circle drawn inside the start padding.
  - id: tile-checked
    claim: A selected tile has a #015a76 border and a background of #015a76 at 10 percent opacity; a disabled tile has a lighter border and a white background.
---

# Radio buttons

A native radio button with a styled label, for one choice among several that
exclude each other. Put `pathable-radio` on a wrapper, and put a
`pathable-radio__input` and its `pathable-radio__label` inside it. The class
adds no roles: the native `<input type="radio">` carries the semantics, so the
control works with no JavaScript.

## When to use

- One answer from a short list of options that exclude each other, such as how
  to contact a participant or which service plan applies.
- A choice where every option should be visible at once, so the person can
  compare them.

Use something else when:

- a person can pick more than one: use `pathable-checkbox`;
- the list is long, five or more options in a narrow space: use
  `pathable-select`;
- a person accepts or declines one clearly stated proposition: use a single
  `pathable-checkbox`. A yes or no question stays two radios.

## Example

<!-- package: styles -->

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- /package -->

<!-- example: default -->

## States

Each state is complete markup for one group of radio buttons. Copy the one
closest to what you need.

<!-- examples -->

There is no indeterminate state for radio buttons: a group with no choice
selected has no special look.

## Variants

There is one modifier, which is on the input and not on the wrapper: `pathable-radio__input--tile` draws the choice in a bordered box with a larger tap target. Add it to the input of every choice in a group.

## Composition

- `pathable-radio`: one choice. It wraps the input and its label, and is
  `display: block`, so choices stack one per line. Put the class on a
  `<div>`; a bare `<input>` with the class keeps its inline layout. The
  selectors that draw the circle are on the input and label classes, not on
  the root, so the root adds only the block layout.
- `pathable-radio__input`: the native `<input type="radio">`. It is hidden from
  sight and stays focusable.
- `pathable-radio__input--tile`: add it to the input of every choice in a group
  that uses tiles.
- `pathable-radio__label`: the `<label>`. It must follow the input as its next
  sibling, because the circle, its centre and the focus ring are drawn on the
  label from the input's state. Connect them with `for` and a matching input
  `id`.
- `pathable-radio__label-description`: an optional line of extra text inside
  the label, below the label text.
- Group the radios in a `pathable-fieldset` with a `pathable-legend` that asks
  the question, as in the examples. Every radio of a group has the same `name`
  and its own `value`, which is what makes one choice replace another and gives
  the group arrow-key navigation.
- Put help text in a `pathable-hint` before the first choice.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour.

The pixel and colour figures on this page are those of the default theme.

## The consumer owns

- The group name: a `<fieldset>` with a `<legend>` that asks the question.
  Radios are never used alone.
- Every input's `id`, the label's `for`, and the shared `name` and each
  `value` that are submitted.
- Which choice is selected first. Leave all unselected unless a default is
  right for most people; once one is selected, a person cannot clear it.
- The disabled and `aria-disabled` state. `disabled` removes the input from the
  tab order and from activation; `aria-disabled="true"` only changes how it
  looks and is announced, so the application must stop the change itself.
- Validation: any required marker, error message and `aria-describedby` link
  from the input to a hint or error.
- Layout beyond one choice per line, such as columns of choices.
