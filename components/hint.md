---
name: Hint
slug: hint
kind: static
summary: Muted help text that tells the user how to fill in a form control.
styles-class: pathable-hint
variants: []
guarantees:
  - id: muted-colour
    status: unverified
    claim: 'The hint text colour is `--pathable-color-text-muted`, which is #015a76 in the default theme.'
  - id: contrast
    status: unverified
    claim: In the default theme the hint text has a contrast of at least 4.5:1 against `--pathable-color-bg`.
  - id: type
    status: unverified
    claim: The hint text is 0.99rem (15.84 px at a 16 px root) with line-height 1.4, in Nunito, the same size as `pathable-label`.
  - id: no-box
    status: unverified
    claim: The hint sets no display, margin or padding, so a `<span>` hint is inline and adds no space of its own.
  - id: inherited-weight
    status: unverified
    claim: The hint sets no font weight, so it takes the font weight of the element it sits in.
---

# Hint

Muted help text that tells the user how to fill in a form control. Put the
class on a `<span>`, or on a `<div>` for more than a line. It is not
interactive and adds no role. It does not describe a control until you
connect it with `aria-describedby`.

## When to use

- A format, an example or a constraint the user needs before typing, such as
  "Use the name shown on the participant record."
- A short inline note inside a label, such as "(required)".

Use something else when:

- the text names the control: use `pathable-label` or `pathable-legend`;
- the text reports a problem with the value the user entered: use
  `pathable-error-message`;
- the message concerns the whole page or form: use `pathable-alert` or
  `pathable-page-error`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-form-group">
  <label class="pathable-label" for="participant-name">Participant name</label>
  <span class="pathable-hint" id="participant-name-hint">
    Use the name shown on the participant record.
  </span>
  <input
    class="pathable-input"
    id="participant-name"
    name="participantName"
    aria-describedby="participant-name-hint"
  />
</div>
```

## Variants

The hint has no modifier classes.

## Tokens

| What             | Token                         |
| ---------------- | ----------------------------- |
| Hint text colour | `--pathable-color-text-muted` |

The colour and the contrast figure in the guarantees are those of the default
theme. A theme that changes this token changes them. The font family, size and
line-height are fixed values in the compiled stylesheet.

## Composition

- Put the hint after the `pathable-label` and before the control, inside the
  same `pathable-form-group`. A `<span>` hint between a block label and a
  block control sits on its own line.
- In a group of radios or checkboxes, put the hint after the
  `pathable-legend`, inside the `pathable-fieldset`.
- Give the hint an `id`, and list that `id` in the control's
  `aria-describedby`. In a fieldset, list it on each control in the group.
  When the field also shows a `pathable-error-message`, list both ids,
  separated by a space.
- Inside `pathable-form-row`, at viewport widths of 1024 px and wider, a hint
  that is a direct child of a direct `pathable-form-group` sits in the group's
  second row, so the controls of neighbouring fields line up.
- Do not use a `<p>` for the hint unless you want the browser's paragraph
  margins: the hint does not remove them.
- The hint has no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The contrast guarantee is against the page background. On another surface,
check the contrast yourself.

## The consumer owns

- The association: a unique `id` on the hint and that `id` in the control's
  `aria-describedby`. Without it, screen reader users do not hear the hint
  when they reach the control.
- Hint text that stays true while the user types; put problems with the value
  in a `pathable-error-message` instead of changing the hint.
- Keeping hints short. Do not put the only copy of essential instructions in a
  placeholder.
- Layout around the hint and the spacing between it and the control.
