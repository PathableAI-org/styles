---
name: Memorable date
slug: memorable-date
kind: static
summary: A group of separate month, day and year fields for a date the person knows by heart, such as a start date or an expiry date.
styles-class: pathable-memorable-date
variants: []
guarantees:
  - id: layout
    claim: The memorable date is a flex container that wraps, so the month, day and year groups sit in one row and move onto further lines when the container is too narrow.
  - id: group-spacing
    claim: Each form group in the memorable date has a 16 px top margin and a 16 px right margin, and is as wide as its content.
  - id: control-widths
    claim: The day and a text month input are 48 px wide, the year input is 72 px wide and the month select is 160 px wide.
  - id: number-inputs
    claim: A numeric input inside the memorable date hides the browser's spin buttons and contacts auto-fill button.
  - id: control-text
    claim: The month select and the day and year inputs use Nunito in the theme's PathAble Blue at the form text size, with the same border and focus ring as a text input.
---

# Memorable date

A group of separate month, day and year fields for a date the person knows by
heart, such as a start date or an expiry date. Put `pathable-memorable-date` on
a `<div>` inside a `pathable-fieldset`, after the legend and the hint. The
class adds no role and no label: the fieldset and its legend name the group.

## When to use

- A date the person remembers without a calendar, such as a date of birth, a
  program start date or a credential expiry date.
- A date that may be far in the past or the future, where paging through a
  calendar would be slow.

Use something else when:

- the person needs to pick a date near today from a calendar: this component
  does not offer one;
- the value is a single short text value: use `pathable-input`;
- the value is one of a fixed set: use `pathable-select`.

## Example

<!-- package: styles -->

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- /package -->

<!-- example: default -->

## States

Each state is complete markup for one use of the memorable date. Copy the one
closest to what you need.

<!-- examples -->

## Variants

The memorable date has no modifier classes: there is one look. The month is
either a `pathable-select` in a form group with
`pathable-form-group--select`, or a two-digit `pathable-input`; both are shown
above.

## Composition

- `pathable-fieldset` and `pathable-legend`: group the three fields and name
  the date they hold.
- `pathable-hint`: an example of the format, between the legend and the
  memorable date, linked to every control by `aria-describedby`.
- `pathable-form-group`: wraps one field. Add `pathable-form-group--month`,
  `pathable-form-group--day` or `pathable-form-group--year` for the field it
  holds, in that order.
- `pathable-form-group--select`: goes on the month group when the month is a
  select.
- `pathable-label`: names each field, linked with `for` and the control's
  `id`.
- `pathable-select`: the month as a select, with a `- Select -` first option
  that has no value.
- `pathable-input`: the day and year, and the month when it is text. Set
  `maxlength`, `pattern="[0-9]*"` and `inputmode="numeric"` so a phone shows a
  number keypad.
- For an error, wrap the fieldset in a `pathable-form-group` with
  `pathable-form-group--error`, put a `pathable-error-message` after the hint
  and add `pathable-input--error` to each control that is wrong.
- The element has no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour.

The colours are fixed when the package is built. The pixel figures on this page
assume a 16 px root font size.

## The consumer owns

- The legend text and the hint with an example in the format the person is
  expected to type.
- A unique `id` on every control, a matching `for` on its label, and the
  `name` of each part.
- The `aria-describedby` that links the hint, and the error message when there
  is one, to each control, and `aria-invalid="true"` on each control in error.
- Validating the date, and an error message that says what is wrong, such as
  which part is missing.
- Announcing an error that appears after the page loads.
