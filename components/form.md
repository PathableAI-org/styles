---
name: Form
slug: form
kind: static
summary: The container for a group of form fields, which sets the form typography, caps the form's width on wider screens and lets the controls inside fill it.
styles-class: pathable-form
variants:
  - axis: size
    default: default
    values: [default, large]
guarantees:
  - id: max-width
    status: unverified
    claim: From a viewport 480 px wide upward the form is at most 320 px wide; below that it fills its container.
  - id: control-fill
    status: unverified
    claim: A pathable-input, pathable-select or pathable-textarea inside the form has no maximum width of its own and fills the form, unless it carries one of the pathable-maxw-mobile, pathable-maxw-mobile-lg, pathable-maxw-tablet or pathable-maxw-desktop width utilities, which still apply.
  - id: required-mark
    status: unverified
    claim: An abbr element whose title is "required" inside the form has no underline or other text decoration.
  - id: link-style
    status: unverified
    claim: A link inside the form that is not a pathable-button gets the form's link typesetting.
  - id: large-width
    status: unmet
    claim: With the large modifier, the form is at most 480 px wide from a viewport 480 px wide upward. The pathable-form--large class is not in the stylesheet yet.
  - id: button-margin
    status: unmet
    claim: A pathable-button inside the form has a top margin of 8 px, and 24 px from a viewport 480 px wide upward, so the submit button is set apart from the last field. Today the form sets this margin only for buttons that carry the USWDS class, so a pathable-button gets none.
---

# Form

The container for a group of form fields, which sets the form typography, caps
the form's width on wider screens and lets the controls inside fill it. Put the
class on the `<form>` element. It adds no role and no behaviour: the browser's
own form submission and validation apply, and nothing here needs JavaScript.

## When to use

- A short form in one column: a sign-in, an intake step, a search or filter
  form, or a single edit panel.
- The wrapper for fields built from `pathable-form-group` and
  `pathable-fieldset`.

Use something else when:

- fields should sit side by side on wide screens: put the groups in a
  `pathable-form-row` inside the form;
- the form is a multi-step process: use `pathable-wizard`;
- you only need to space a set of groups and do not want the width cap: use
  `pathable-stack` with `pathable-form-stack`.

Show and hide password toggles, input masks, date pickers, combo boxes,
character counters and client-side validation need JavaScript and are not part
of this component.

## Example

<!-- package: styles -->

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- /package -->

<!-- example: default -->

## States

Each state is complete markup for one use of the form. Copy the one closest to
what you need.

<!-- examples -->

## Variants

Add at most one modifier class from the axis to `pathable-form`.

| Axis | Value     | Class                  | What it is for                                              |
| ---- | --------- | ---------------------- | ----------------------------------------------------------- |
| size | `default` | none                   | A form at most 320 px wide on screens 480 px wide and wider |
| size | `large`   | `pathable-form--large` | A form at most 480 px wide, when the form is the main task  |

## Composition

- `pathable-form-group`: wraps one field. See the
  [FormGroup](form-group.md) page.
- `pathable-label`: names a control. See the [Label](label.md) page.
- `pathable-hint`: helper text under the label. See the [Hint](hint.md) page.
- `pathable-error-message`: says what is wrong with a value. See the
  [ErrorMessage](error-message.md) page. Put the error styling on the field's
  group, never on the form, so only the question with the error is marked.
- `pathable-fieldset` and `pathable-legend`: group radios and checkboxes under
  one question. See the [Fieldset](fieldset.md) and [Legend](legend.md) pages.
- `pathable-input`, `pathable-checkbox` and `pathable-radio`: the controls.
  See the [TextInput](text-input.md) page for the text input.
- `pathable-button`: the submit button, as the form's last child. The form
  does not space it yet (see the `button-margin` guarantee), so put it in a
  `pathable-button-group` or give it a margin utility.
- The form has no element classes. A short note about the form, such as "Fields
  marked * are required", is plain text for you to style: the form has no
  note class yet.
- The form adds no padding, margin, border or background.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

## The consumer owns

- The form's action, method, field names and validation. Use the native
  `required` attribute and mark a required field's label with
  `<abbr title="required">*</abbr>`, as the examples do.
- Each field's label, hint and error associations: `for` on the label,
  `aria-describedby` on the control listing the hint and error ids, and
  `aria-invalid="true"` on the control while it has an error.
- A name for the form when it is a landmark the reader should find, such as a
  search form: `aria-label` or `aria-labelledby`. A form with no name is not
  announced as a landmark.
- Where the error summary, if any, goes and how focus moves to it.
- Any data minimisation for the sensitive records the form collects.
