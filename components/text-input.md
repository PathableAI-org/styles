---
name: TextInput
slug: text-input
kind: static
summary: A single-line text field with a bordered box, a brand focus ring and states for an error, a success and a disabled control.
styles-class: pathable-input
variants:
  - axis: width
    default: default
    values: [default, 2xs, xs, sm, md, lg, xl, 2xl]
  - axis: state
    default: default
    values: [default, error, success]
guarantees:
  - id: box
    status: unverified
    claim: The input is a block 40 px tall that fills its container up to 480 px, with a 1 px border in the theme's cool grey, 8 px of padding, square corners and an 8 px top margin.
  - id: text
    status: unverified
    claim: The input text is in PathAble Blue, set in the body font at the form text size.
  - id: focus-ring
    status: unverified
    claim: When the input is focused with the keyboard, it has a 2 px solid outline, offset 2 px, in the theme's focus ring colour, and in the system highlight colour in forced-colours mode.
  - id: disabled
    status: unverified
    claim: A disabled input, or one with aria-disabled set to true, shows the theme's disabled text and background colours and a high-contrast border.
  - id: form-width
    status: unverified
    claim: Inside a pathable-form or pathable-form-row the input has no 480 px cap and fills its container, unless it carries a pathable-maxw width utility.
  - id: widths
    status: unmet
    claim: The width modifiers set a maximum width of 5ex (2xs), 9ex (xs), 13ex (sm), 20ex (md), 30ex (lg), 40ex (xl) and 50ex (2xl), and win over the form's own width rule. None of these classes is in the stylesheet yet; the pathable-maxw width utilities are the only way to limit the width today and are in fixed pixels, not characters.
  - id: error
    status: unmet
    claim: With the error modifier, the input has a 4 px border in the theme's dark red, with 4 px less padding above and below to keep its height. The pathable-input--error class is not in the stylesheet yet.
  - id: error-group
    status: unmet
    claim: A pathable-form-group--error group and a pathable-label--error label mark the field with the error colour. Neither class is in the stylesheet yet, so the error state has no group rule and the label keeps its normal colour.
  - id: success
    status: unmet
    claim: With the success modifier, the input has a 4 px border in the theme's green, with 4 px less padding above and below to keep its height. The pathable-input--success class is not in the stylesheet yet.
---

# TextInput

A single-line text field with a bordered box, a brand focus ring and states for
an error, a success and a disabled control. Put the class on an `<input>`
element. The same class serves every text-like `type`, such as `text`, `email`,
`tel`, `search` and `password`; there are no per-type modifiers. A multi-line
field is a different control and is not part of this component.

## When to use

- A short free-text or formatted value: a name, a case number, an email
  address, a phone number.

Use something else when:

- the value is one of a fixed set: use `pathable-select`, or radios in a
  `pathable-fieldset`;
- the field needs a prefix or suffix inside the box: use
  `pathable-input-prefix-suffix`;
- the value is long or runs over several lines: use a `pathable-textarea`.

Input masks, date pickers, character counters and client-side validation need
JavaScript and are not part of this component.

## Example

<!-- package: styles -->

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- /package -->

<!-- example: default -->

## States

Each state is complete markup for one use of the input. Copy the one closest to
what you need.

<!-- examples -->

## Variants

Add at most one modifier class from each axis to `pathable-input`. The width
and state modifiers are not in the stylesheet yet; see the guarantees marked
`unmet`.

| Axis  | Value     | Class                     | What it is for                                            |
| ----- | --------- | ------------------------- | --------------------------------------------------------- |
| width | `default` | none                      | Fills its container, up to 480 px                         |
| width | `2xs`     | `pathable-input--2xs`     | A very short value, at most 5ex wide                      |
| width | `xs`      | `pathable-input--xs`      | A short code, at most 9ex wide                            |
| width | `sm`      | `pathable-input--sm`      | A date or other short value, at most 13ex wide            |
| width | `md`      | `pathable-input--md`      | A phone number or similar, at most 20ex wide              |
| width | `lg`      | `pathable-input--lg`      | A name, at most 30ex wide                                 |
| width | `xl`      | `pathable-input--xl`      | A long name or title, at most 40ex wide                   |
| width | `2xl`     | `pathable-input--2xl`     | The longest single-line value, at most 50ex wide          |
| state | `default` | none                      | No validation result to show                              |
| state | `error`   | `pathable-input--error`   | The value is wrong; use with the group, label and message |
| state | `success` | `pathable-input--success` | The value passed validation                               |

A disabled input is not a modifier: use the `disabled` attribute, or
`aria-disabled="true"` to keep the control focusable.

## Tokens

| What                           | Token                                                               |
| ------------------------------ | ------------------------------------------------------------------- |
| Focus ring colour on a surface | `--pathable-surface-focus-ring`, else `--pathable-color-focus-ring` |

The pixel figures on this page are those of the default theme. The border,
text, error, success and disabled colours come from the theme's colour settings
at build time and are not custom properties.

## Composition

- `pathable-form-group`: wraps the label, hint, input and error message of one
  field.
- `pathable-label`: names the input; connect it with `for` and the input's
  `id`.
- `pathable-hint`: helper text between the label and the input.
- `pathable-error-message`: says what is wrong, placed between the label and the
  input.
- For an error, put `pathable-form-group--error` on the group,
  `pathable-label--error` on the label and `pathable-input--error` on the input
  together. All three are unmet today.
- Inside [`pathable-form`](form.md) the input fills the form; elsewhere it is
  capped at 480 px.
- The input has no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

Some stories and React components pass type modifiers for the input `type`,
such as an email modifier; the stylesheet has no rule for any of them, so they
have no visual effect today. The error modifier is covered by the `error`
guarantee above.

## The consumer owns

- The label, with `for` matching the input's `id`, on every input. A
  placeholder is not a label.
- The `type`, `name`, `autocomplete` and `inputmode` that suit the value.
- The hint and error associations: the ids of the hint and the error message
  in `aria-describedby` on the input, and `aria-invalid="true"` while it has an
  error.
- Announcing an error that appears after the page loads, for example by
  inserting the message into a live region.
- A text cue for success where it matters: the green border is not enough on
  its own.
- Choosing a width that suits the expected value.
