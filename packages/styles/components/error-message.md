---
name: ErrorMessage
slug: error-message
kind: static
summary: Bold red text, on its own line, that says what is wrong with the value of a form control.
styles-class: pathable-error-message
variants: []
guarantees:
  - id: block
    status: unverified
    claim: The error message is display block, so it takes its own line even when it is a `<span>`.
  - id: bold
    status: unverified
    claim: The error message sets font weight 700.
  - id: padding
    status: unverified
    claim: The error message has 0.25rem (4 px at a 16 px root) of padding above and below its text, no horizontal padding and no margin.
  - id: fixed-colour
    status: unverified
    claim: 'The error message text colour is #a52834 and comes from no custom property, so it is the same in every theme.'
  - id: contrast
    status: unverified
    claim: "The error message text has a contrast of at least 4.5:1 against #dde2e8, the default theme's page background colour."
  - id: plain-box
    status: unverified
    claim: The error message draws no background, border or icon.
  - id: body-font
    status: unmet
    claim: The error message text is set in Nunito, the body font, even on a page that sets no font of its own.
---

# ErrorMessage

Bold red text, on its own line, that says what is wrong with the value of a
form control. Put the class on a `<span>` or `<div>`. It is not interactive.
The class adds no role and does not announce the message; it does not
describe a control until you connect it with `aria-describedby`.

## When to use

- After validation, to say what is wrong with one field and how to fix it,
  such as "Select an employment goal before continuing."
- Below a group of radios or checkboxes, for an error with the group's answer.

Use something else when:

- the text helps before the user has made a mistake: use `pathable-hint`;
- the form has several errors and needs a summary at the top: use
  `pathable-alert`;
- the page or a section of it failed to load: use `pathable-page-error`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-form-group">
  <label class="pathable-label" for="authorization-number">
    Funding authorisation number
  </label>
  <input
    class="pathable-input"
    id="authorization-number"
    name="authorizationNumber"
    aria-invalid="true"
    aria-describedby="authorization-number-error"
  />
  <span class="pathable-error-message" id="authorization-number-error">
    Enter the funding authorisation number.
  </span>
</div>
```

## Variants

The error message has no modifier classes.

## Tokens

None. The colour #a52834 is a fixed value in the compiled stylesheet, not a
custom property, so a theme that changes the danger or text tokens does not
change it. Check its contrast yourself on any background other than the
default page background.

## Composition

- Put the error message after the control, inside the same
  `pathable-form-group`. In a `pathable-fieldset`, put it after the last
  control of the group.
- Give the message an `id` and list it in the control's `aria-describedby`.
  When the field also has a `pathable-hint`, list both ids, hint first,
  separated by a space. In a fieldset, list them on each control.
- Set `aria-invalid="true"` on the control while the message shows. The error
  message does not mark the control, and the field has no error styling of its
  own: the red bold text is the only visual sign.
- To have the message announced when it appears, insert it into a live region
  or give it `role="alert"` as you insert it. A message that is in the page
  from the start is not announced.
- Inside `pathable-form-row`, at viewport widths of 1024 px and wider, an
  error message that is a direct child of a direct `pathable-form-group` sits
  in the group's fourth row, below the tallest control in the row.
- The error message has no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

Today the error message sets no font family and no font size, so it takes both
from the element it sits in. On a page that sets no font it renders in the
browser's default font and size, unlike the `pathable-label` and
`pathable-hint` beside it.

The package ships Nunito in weights 400 and 600 only. Where the message is set
in Nunito, the browser draws the 700 weight from the 600 face or synthesises a
bolder one, depending on the browser.

## The consumer owns

- Deciding when a value is invalid, and adding and removing the message.
- The associations: the message `id` in `aria-describedby`, and
  `aria-invalid` on the control.
- Announcing the message, if it should be announced.
- Message text that says what went wrong and how to fix it, without relying on
  the red colour: the words must carry the meaning.
- Moving focus, or a summary at the top of the form, when there are several
  errors.
