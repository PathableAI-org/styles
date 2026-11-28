---
name: Checkbox
slug: checkbox
kind: static
summary: A native checkbox with a styled label, for one choice among several that a person can select independently.
styles-class: pathable-checkbox
variants: []
guarantees:
  - id: input-hidden
    claim: The native input is moved off-screen (position absolute, 999em to the left) but stays in the tab order, and the label draws the visible control.
  - id: box
    claim: 'The unchecked box is a 1.25rem (20 px at a 16 px root) square with 2 px rounded corners, a white fill and a 2 px outline in #00365c, drawn 2rem (32 px) to the left of the label text.'
  - id: label-layout
    claim: The label is inline-block with a 0.75rem (12 px) top margin and 2rem (32 px) of left padding, in normal weight, and shows a pointer cursor.
  - id: checked
    claim: 'A checked box is filled #015a76 with a 2 px #015a76 outline and a check mark centred in it.'
  - id: indeterminate
    claim: 'An input with the data-indeterminate attribute, or whose indeterminate property is true, shows a box filled #015a76 with a dash centred in it.'
  - id: disabled
    claim: 'A disabled input, or one with aria-disabled="true", shows its label in #757575 with a not-allowed cursor and a white box with a 2 px #757575 outline, and a checked or indeterminate one fills the box #757575.'
  - id: focus-ring
    claim: 'When the input has focus, the box shows a 0.25rem (4 px) solid #4899e8 outline 0.25rem (4 px) outside it, except on a focused tile input that is checked or indeterminate and does not have aria-disabled="true", where the outline is #00365c so it keeps 3:1 against the tile tint (an input with the disabled attribute cannot take focus).'
  - id: root-block
    claim: The root is display block, so each checkbox starts on its own line, unless the element is a bare input or has the hidden attribute.
  - id: description
    claim: A label description is a block inside the label, 0.88rem (the 2xs size, 14.08 px at a 16 px root) with a 0.5rem (8 px) top margin.
  - id: tile
    claim: With pathable-checkbox__input--tile on the input, the label is a box with a 2 px border in a light grey, 4 px rounded corners, 0.5rem (8 px) top margin and padding of 0.75rem (12 px) above and below, 1rem (16 px) at the end and 2.5rem (40 px) at the start, with the check box drawn inside the start padding.
  - id: tile-checked
    claim: 'A checked or indeterminate tile has a #015a76 border and a background of #015a76 at 10 percent opacity; a disabled tile has a lighter border and a white background.'
---

# Checkbox

A native checkbox with a styled label, for one choice among several that a
person can select independently. Put `pathable-checkbox` on a wrapper, and
put a `pathable-checkbox__input` and its `pathable-checkbox__label` inside it.
The class adds no roles: the native `<input type="checkbox">` carries the
semantics, so the control works with no JavaScript.

## When to use

- A set of choices where a person can pick any number, such as the supports a
  participant needs or the documents on file.
- A single proposition that a person accepts or declines, such as agreeing to
  appointment reminders.

Use something else when:

- the choices exclude each other, or the question is yes or no: use two
  `pathable-radio` choices;
- a setting takes effect the moment it changes: use a switch, which this
  package does not provide.

## Example

<!-- package: styles -->

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- /package -->

<!-- css-files -->

<!-- example: default -->

## States

Each state is complete markup for one group of checkboxes. Copy the one
closest to what you need.

<!-- examples -->

An indeterminate state needs script. The `data-indeterminate` attribute only
draws the dash. A native checkbox has no HTML attribute for the state, so the
application sets the input's `indeterminate` property to `true` so assistive
technology reports it as mixed, and clears it when the person changes the box.
Updating the group's other choices is also the application's job.

## Variants

There is one modifier, which is on the input and not on the wrapper: `pathable-checkbox__input--tile` draws the choice in a bordered box with a larger tap target. Add it to the input of every choice in a group.

## Composition

- `pathable-checkbox`: one choice. It wraps the input and its label, and is
  `display: block`, so choices stack one per line. Put the class on a
  `<div>`; a bare `<input>` with the class keeps its inline layout. The
  selectors that draw the box are on the input and label classes, not on the
  root, so the root adds only the block layout.
- `pathable-checkbox__input`: the native `<input type="checkbox">`. It is
  hidden from sight and stays focusable.
- `pathable-checkbox__input--tile`: add it to the input of every choice in a
  group that uses tiles.
- `pathable-checkbox__label`: the `<label>`. It must follow the input as its
  next sibling, because the box, the check mark and the focus ring are drawn on
  the label from the input's state. Connect them with `for` and a matching
  input `id`.
- `pathable-checkbox__label-description`: an optional line of extra text inside
  the label, below the label text.
- Group related choices in a `pathable-fieldset` with a `pathable-legend` that
  asks the question, as in the examples. Give the checkboxes of a group the
  same `name` ending in `[]`, which lets a group repeat one name, and each its
  own `value`.
- Put help text in a `pathable-hint` before the first choice or inside a
  description.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour.

The pixel figures on this page assume a 16 px root font size.

## The consumer owns

- The group name: a `<fieldset>` with a `<legend>` for a related set, or a
  visible `<label>` alone for a single checkbox.
- Every input's `id`, the label's `for`, and the `name` and `value` that are
  submitted.
- The checked, disabled and `aria-disabled` state. `disabled` removes the input
  from the tab order and from activation; `aria-disabled="true"` only changes
  how it looks and is announced, so the application must stop the change
  itself.
- The indeterminate state: setting and clearing the `indeterminate` property
  in script, and what it means for the other choices.
- Validation: any required marker, error message and `aria-describedby` link
  from the input to a hint or error.
- Layout beyond one choice per line, such as columns of choices.
