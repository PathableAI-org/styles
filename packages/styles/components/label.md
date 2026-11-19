---
name: Label
slug: label
kind: static
summary: A block-level text label that names one form control, set on its own line above it.
styles-class: pathable-label
variants: []
guarantees:
  - id: block
    status: unverified
    claim: The label is display block, so it takes its own line above the control even when it is an inline `<label>` element.
  - id: type
    status: unverified
    claim: The label text is 0.99rem (15.84 px at a 16 px root), font weight 400 and line-height 1.4, in Nunito.
  - id: top-margin
    status: unverified
    claim: The label has a 1.5rem (24 px at a 16 px root) top margin and no bottom margin.
  - id: max-width
    status: unverified
    claim: The label is at most 30rem (480 px at a 16 px root) wide, and text longer than that wraps at its spaces.
  - id: first-in-group
    status: unverified
    claim: A label that is the first direct child of a `pathable-form-group` has no top margin, so its top edge is the top edge of the group.
  - id: inherited-colour
    status: unverified
    claim: The label sets no colour, so its text colour is the colour of the element it sits in.
---

# Label

A block-level text label that names one form control, set on its own line
above it. Put the class on a `<label>` element. It is not interactive in
itself: the class adds no role and no tab stop, and it does not connect the
label to a control. That connection is yours to make.

## When to use

- The visible name of a single text input, select, textarea or similar
  control.

Use something else when:

- the name belongs to a group of controls, such as a set of radios or
  checkboxes: use a `<legend>` with `pathable-legend` inside a `<fieldset>`
  with `pathable-fieldset`;
- the text explains how to fill the control in: use `pathable-hint`;
- the text reports what is wrong with the value: use `pathable-error-message`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-form-group">
  <label class="pathable-label" for="participant-name">Participant name</label>
  <input class="pathable-input" id="participant-name" name="participantName" />
</div>
```

## Variants

The label has no modifier classes. It looks the same in every context; only
its top margin changes, as the Composition section describes.

## Tokens

None. The font family, size, line-height and margin are fixed values in the
compiled stylesheet, not custom properties, so a theme does not change them.
The label takes its colour from its container.

## Composition

- Put the label before its control, and connect the two with `for` on the
  label and the same value as `id` on the control. Wrapping the control inside
  the label also connects them, but the label is display block, so the control
  then sits inside the label's box.
- Put the label inside a `pathable-form-group` with its control, and its
  optional `pathable-hint` and `pathable-error-message`. As the group's first
  child the label drops its top margin and the group's own margin spaces the
  field. Anywhere else, including directly inside `pathable-form-stack`, the
  label keeps its 24 px top margin.
- Inside `pathable-form-row`, at viewport widths of 1024 px and wider, a label
  that is a direct child of a direct `pathable-form-group` sits in the group's
  first row, so the controls of neighbouring fields line up.
- A short note such as "(required)" can go inside the label as an inline
  `<span>` with `pathable-hint`; it is then part of the control's name.
- The label has no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The pixel figures assume a 16 px root font size. The label scales with the
root size, because every length is in `rem`.

## The consumer owns

- The association: a unique `id` on the control and the same value in the
  label's `for`. Without it the control has no accessible name from the label
  and clicking the label does not focus the control.
- One label per control, with text that names the control on its own.
- Marking a required field in words, not by colour or an asterisk alone.
- Layout around the label: the field width, and the spacing between fields
  when you do not use `pathable-form-group`, `pathable-form-stack` or
  `pathable-form-row`.
