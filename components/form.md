---
name: Form
slug: form
kind: static
summary: The container for a group of form fields, which sets the form typography, caps the form's width on wider screens and lets the controls inside fill it.
styles-class: pathable-form
variants: []
guarantees:
  - id: max-width
    claim: From a viewport 480 px wide upward the form is at most 320 px wide; below that it fills its container.
  - id: control-fill
    claim: A pathable-input, pathable-select or pathable-textarea inside the form has no maximum width of its own and fills the form, unless it carries one of the maxw-mobile, maxw-mobile-lg, maxw-tablet or maxw-desktop width utilities, which still apply.
  - id: fieldset-spacing
    claim: A pathable-fieldset inside the form has a 24 px top margin, the same as a pathable-label, so its legend is set apart from the field above; a fieldset that is the first child of a pathable-form-group has no top margin of its own, because the group spaces it.
  - id: required-mark
    claim: An abbr element whose title is "required" inside the form has no underline or other text decoration, and with the pathable-hint--required class its asterisk is drawn in the dark error text colour.
  - id: link-style
    claim: A link inside the form that is not a pathable-button gets the form's link typesetting.
  - id: field-error
    claim: A pathable-form-group--error group, a pathable-label--error label and a pathable-input--error control mark the one field that has an error, and the form itself carries no error class. See the error and error-group guarantees of the Text input page.
  - id: button-margin
    claim: A pathable-button inside the form has a top margin of 8 px, and 24 px from a viewport 480 px wide upward, so the submit button is set apart from the last field. A pathable-button in a pathable-button-group gets no top margin from the form, so the group's own spacing applies.
---

# Form

The container for a group of form fields, which sets the form typography, caps
the form's width on wider screens and lets the controls inside fill it. Put the
class on the `<form>` element. It adds no role and no behaviour: the browser's
own form submission and validation apply, and nothing here needs JavaScript.

## When to use

- A short form in one column: a sign-in, an intake step, a search or filter
  form, or a single edit panel.
- The wrapper for fields built from `pathable-label`, `pathable-input` and
  `pathable-fieldset`.

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

<!-- css-files -->

<!-- example: default -->

## States

Each state is complete markup for one use of the form. Copy the one closest to
what you need.

<!-- examples -->

## Variants

The form has no variants. It is one width, at most 320 px, from a viewport 480 px wide upward.

## Composition

- `pathable-label`: names a control and comes before it. A field's label,
  hint, error message and control follow one another directly in the form.
- `pathable-hint`: helper text under the label. With `pathable-hint--required`
  on an `<abbr title="required">*</abbr>` it is the visible required marker.
- `pathable-error-message`: says what is wrong with a value. Wrap that one
  field in a `pathable-form-group--error`, with `pathable-label--error` on its
  label and `pathable-input--error` on its control, so only the question with
  the error is marked and the form itself carries no error class.
- `pathable-fieldset` and `pathable-legend`: group radios and checkboxes under
  one question. The fieldset has a 24 px top margin inside the form, like a
  label, so it follows the field before it directly with no wrapper.
- `pathable-input`, `pathable-checkbox` and `pathable-radio`: the controls.
  See the [Text input](text-input.md) page for the text input.
- `pathable-button`: the submit button, as the form's last child. It has a top
  margin of 8 px, and 24 px from a viewport 480 px wide upward.
- The form has no element classes and adds no padding, margin, border or
  background.

### Required and optional fields

- Explain the required marker at the start of the form, before the first
  field: "Required fields are marked with an asterisk (\*)."
- Mark each required field's label with the visible text
  `<abbr title="required" class="pathable-hint pathable-hint--required">*</abbr>`
  and set the native `required` attribute. The asterisk is visible text, so the
  marker does not depend on colour.
- Mark optional fields in their label, such as "Preferred name (optional)",
  so the person knows which fields they can skip.
- Ask only for what is needed. Prefer fewer fields over many optional ones.

### Order and disabled fields

- The visual order of the fields matches the DOM order. Do not reorder fields
  with CSS, because keyboard and screen reader users follow the DOM.
- Avoid disabled fields. A disabled field is not focusable, is hard to read
  and does not say why it is unavailable. Leave the field out, or explain in
  text what is needed before it can be filled in.

### Errors after a failed submission

- Put the error notification in the page title, such as "Error: Book
  appointment", so a screen reader announces it when the page reloads.
- Mark the question with the error with the error modifiers and a
  `pathable-error-message` that says how to fix it.

## Guarantees

The guarantees are the list in the front matter at the top of this page.

## The consumer owns

- The form's action, method, field names and validation. Use the native
  `required` attribute and the visible required marker, as the examples do.
- Each field's label, hint and error associations: `for` on the label,
  `aria-describedby` on the control listing the hint and error ids, and
  `aria-invalid="true"` on the control while it has an error.
- A name for the form when it is a landmark the reader should find, such as a
  search form: `aria-label` or `aria-labelledby`. A form with no name is not
  announced as a landmark.
- The page title, including its error notification, and where the error
  summary, if any, goes and how focus moves to it.
- Any data minimisation for the sensitive records the form collects.
