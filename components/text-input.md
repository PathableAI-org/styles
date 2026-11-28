---
name: Text input
slug: text-input
kind: static
summary: A text field, single-line or multi-line, with a bordered box, a brand focus ring and states for an error, a success and a disabled control.
styles-class: pathable-input
variants:
  - axis: width
    default: default
    values: [default, 2xs, xs, sm, small, md, medium, lg, xl, 2xl]
  - axis: state
    default: default
    values: [default, error, success]
guarantees:
  - id: box
    claim: The input is a block 40 px tall that fills its container up to 480 px, with a 1 px border in the theme's cool grey, 8 px of padding, square corners and an 8 px top margin.
  - id: text
    claim: The input text is in PathAble Blue, set in the body font at the form text size.
  - id: focus-ring
    claim: When the input is focused with the keyboard, it has a 2 px solid outline, offset 2 px, in the theme's focus ring colour, and in the system highlight colour in forced-colours mode.
  - id: disabled
    claim: A disabled input, or one with aria-disabled set to true, shows the theme's disabled text and background colours and a high-contrast border.
  - id: readonly
    claim: A read-only input looks like an enabled input, stays in the tab order, and its value can be selected and copied.
  - id: textarea
    claim: A textarea with the pathable-textarea class has the same border, padding, text, focus ring and disabled appearance as the input, and a fixed height that holds several lines of text.
  - id: form-width
    claim: Inside a pathable-form the input has no 480 px cap and fills its container, unless it carries a width modifier.
  - id: widths
    claim: The width modifiers set a maximum width of 5ex (2xs), 9ex (xs), 13ex (sm and small), 20ex (md and medium), 30ex (lg), 40ex (xl) and 50ex (2xl), and win over the form's own width rule.
  - id: error
    claim: With the error modifier, the input has a 4 px border in the theme's dark red, with 4 px less padding above and below to keep its height.
  - id: error-group
    claim: A pathable-form-group--error group and a pathable-label--error label mark the field with the error colour.
  - id: success
    claim: With the success modifier, the input has a 4 px border in the theme's dark green, with 4 px less padding above and below to keep its height.
---

# Text input

A text field, single-line or multi-line, with a bordered box, a brand focus ring
and states for an error, a success and a disabled control. Put `pathable-input`
on an `<input>` element.
The same class serves every text-like `type`, such as `text`, `email`, `tel`,
`search` and `password`; there are no per-type modifiers. A multi-line field is
a `<textarea>` with the `pathable-textarea` class.

## When to use

- A short free-text or formatted value: a name, a case number, an email
  address, a phone number.
- A value that runs over several lines, such as a case note: use a
  `<textarea class="pathable-textarea">`.

Use something else when:

- the value is one of a fixed set: use `pathable-select`, or radios in a
  `pathable-fieldset`;
- the field needs a prefix or suffix inside the box: use
  `pathable-input-prefix-suffix`.

Input masks, date pickers, character counters and client-side validation need
JavaScript and are not part of this component.

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

Each state is complete markup for one use of the input. Copy the one closest to
what you need.

<!-- examples -->

## Variants

Add at most one modifier class from each axis to `pathable-input`. The error
and success modifiers also go on a `pathable-textarea`.

| Axis  | Value     | Class                     | What it is for                                            |
| ----- | --------- | ------------------------- | --------------------------------------------------------- |
| width | `default` | none                      | Fills its container, up to 480 px                         |
| width | `2xs`     | `pathable-input--2xs`     | A very short value, at most 5ex wide                      |
| width | `xs`      | `pathable-input--xs`      | A short code, at most 9ex wide                            |
| width | `sm`      | `pathable-input--sm`      | A date or other short value, at most 13ex wide            |
| width | `small`   | `pathable-input--small`   | The same width as `sm`                                    |
| width | `md`      | `pathable-input--md`      | A phone number or similar, at most 20ex wide              |
| width | `medium`  | `pathable-input--medium`  | The same width as `md`                                    |
| width | `lg`      | `pathable-input--lg`      | A name, at most 30ex wide                                 |
| width | `xl`      | `pathable-input--xl`      | A long name or title, at most 40ex wide                   |
| width | `2xl`     | `pathable-input--2xl`     | The longest single-line value, at most 50ex wide          |
| state | `default` | none                      | No validation result to show                              |
| state | `error`   | `pathable-input--error`   | The value is wrong; use with the group, label and message |
| state | `success` | `pathable-input--success` | The value passed validation                               |

A disabled input is not a modifier: use the `disabled` attribute, or
`aria-disabled="true"` to keep the control focusable. A value that can be
focused and copied but not changed uses the `readonly` attribute.

The focus ring is Bright Blue Brooks, #4899e8, or the surface's focus ring
colour on a `pathable-bg-*` surface. The border, text, error, success and
disabled colours are fixed when the package is built. The pixel figures on this
page assume a 16 px root font size.

## Composition

- `pathable-label`: names the input; connect it with `for` and the input's
  `id`. The label and the input are siblings, with no wrapper around them.
- `pathable-hint`: helper text between the label and the input. Use it for a
  visible success message as well, and point the input at it with
  `aria-describedby`.
- `pathable-error-message`: says what is wrong, placed between the label and the
  input.
- `pathable-form-group`: used only for an error. Put
  `pathable-form-group--error` on a group that wraps the label, the message and
  the input, `pathable-label--error` on the label and `pathable-input--error`
  on the input together.
- Inside [`pathable-form`](form.md) the input fills the form; elsewhere it is
  capped at 480 px.
- The input has no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour.

## The consumer owns

- The label, with `for` matching the input's `id`, on every input. A
  placeholder is not a label.
- The `type`, `name`, `autocomplete` and `inputmode` that suit the value.
- The hint and error associations: the ids of the hint and the error message
  in `aria-describedby` on the input, and `aria-invalid="true"` while it has an
  error.
- Announcing an error that appears after the page loads, for example by
  inserting the message into a live region.
- A text cue for success: the green border is not enough on its own, so show a
  visible success message.
- Choosing a width that suits the expected value.
