---
name: Select
slug: select
kind: static
summary: A native drop-down list in a bordered box with an arrow icon, for choosing one value from a short fixed set.
styles-class: pathable-select
variants: []
guarantees:
  - id: box
    claim: The select is a block 40 px tall that fills its container up to 480 px, with a 1 px border, a white background, square corners, an 8 px top margin and 32 px of padding on the right for the arrow.
  - id: arrow
    claim: The select hides the browser's own arrow and draws an up-and-down arrow icon 20 px square, 8 px from the right edge and centred vertically.
  - id: text
    claim: The selected value is set in Nunito at the form text size in the theme's PathAble Blue.
  - id: focus-ring
    claim: When the select is focused, it has a 2 px solid outline, offset 2 px, in the theme's focus ring colour.
  - id: disabled
    claim: A disabled select, or one with aria-disabled set to true, shows the theme's disabled text and background colours and a high-contrast border.
  - id: multiple
    claim: A select with the multiple attribute grows to the height of its list and shows no arrow icon and no right padding.
  - id: forced-colors
    claim: In forced-colours mode the select uses the browser's own list-box drawing, with no arrow icon and no right padding.
---

# Select

A native drop-down list in a bordered box with an arrow icon, for choosing one
value from a short fixed set. Put `pathable-select` on a `<select>` element
with `<option>` children. The class adds no role: the element's native
combobox or list box role is kept.

## When to use

- One choice from roughly four to fifteen options, such as a learning pathway,
  a session format or a provider.
- A list whose options the person is likely to know by name, so they need not
  see them all at once.

Use something else when:

- there are fewer than four options and all of them fit: use radio buttons
  (`pathable-radio`), so every option is visible;
- the list is very long and needs typing to filter it: that needs JavaScript
  and is not part of this component;
- the value is free text: use `pathable-input`.

## Example

<!-- package: styles -->

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- /package -->

<!-- example: default -->

## States

Each state is complete markup for one use of the select. Copy the one closest
to what you need.

<!-- examples -->

## Variants

The select has no modifier classes: there is one look. The error state uses
`pathable-input--error` together with the group and label modifiers, and a
disabled select uses the `disabled` attribute.

## Composition

- `pathable-label`: names the select; connect it with `for` and the select's
  `id`.
- `pathable-form-group`: wraps the label, hint, select and error message of
  one field.
- `pathable-hint`: helper text between the label and the select.
- `pathable-error-message`: says what is wrong, placed between the label and
  the select.
- For an error, put `pathable-form-group--error` on the group,
  `pathable-label--error` on the label and `pathable-input--error` on the
  select together.
- Start the list with `<option value>- Select -</option>`, an option with no
  value, so the field starts unanswered.
- A `disabled` select cannot be focused; use `aria-disabled="true"` instead to
  keep it in the tab order.
- The element has no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour.

The colours are fixed when the package is built. The pixel figures on this page
assume a 16 px root font size.

## The consumer owns

- The label, with `for` matching the select's `id`, on every select.
- The options, their values and their order.
- The hint and error associations: the ids of the hint and the error message
  in `aria-describedby` on the select, and `aria-invalid="true"` while it has
  an error.
- Announcing an error that appears after the page loads.
- Explaining why a control is disabled in nearby visible text, and avoiding a
  disabled select where the person needs to read its value.
