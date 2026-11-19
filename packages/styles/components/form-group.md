---
name: FormGroup
slug: form-group
kind: static
summary: A wrapper that holds one field's label, hint, control and error message and sets the space above the field.
styles-class: pathable-form-group
variants: []
guarantees:
  - id: top-margin
    status: unverified
    claim: The group has a 1.5rem (24 px at a 16 px root) top margin and no other margin, padding, border or background.
  - id: first-label
    status: unverified
    claim: A `pathable-label` that is the group's first direct child has no top margin, so its top edge is the top edge of the group.
  - id: other-labels
    status: unverified
    claim: A `pathable-label` that is not the group's first direct child, including one nested deeper, keeps its 24 px top margin.
  - id: in-stack
    status: unverified
    claim: A group that is a direct child of `pathable-form-stack` or `pathable-form-row` has no top margin, so only that container's gap separates it from its neighbours.
  - id: row-alignment
    status: unverified
    claim: At viewport widths of 1024 px and wider, in groups that are direct children of one `pathable-form-row`, the tops of the direct-child controls line up even when their labels and hints differ in height.
---

# FormGroup

A wrapper that holds one field's label, hint, control and error message and
sets the space above the field. Put the class on a `<div>`. It is not
interactive and adds no role: it is a layout box, not a semantic group, and it
does not connect its children to each other.

## When to use

- Around each single-control field in a form: one text input, select or
  textarea with its label.

Use something else when:

- the controls are a set of radios or checkboxes, or several controls share
  one name: use a `<fieldset>` with `pathable-fieldset`;
- you need to space a whole form: put the groups directly in
  `pathable-form-stack`, which spaces them with a gap;
- fields should sit side by side on wide screens: put the groups directly in
  `pathable-form-row`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-form-group">
  <label class="pathable-label" for="service-location">Service location</label>
  <span class="pathable-hint" id="service-location-hint">
    Choose where the participant receives support.
  </span>
  <select
    class="pathable-select"
    id="service-location"
    name="location"
    aria-describedby="service-location-hint"
  >
    <option>Community office</option>
    <option>Remote</option>
  </select>
</div>
```

## Variants

The group has no modifier classes, and in particular no error modifier. An
error is shown by the `pathable-error-message` inside it.

## Tokens

None. The top margin is a fixed value in the compiled stylesheet, not a custom
property.

## Composition

- Put, as direct children and in this order: a `pathable-label`, an optional
  `pathable-hint`, one control (`pathable-input`, `pathable-select` or
  `pathable-textarea`), and an optional `pathable-error-message`.
- Make the label the first child. The group then drops the label's top margin,
  so the group's own margin is the only space above the field.
- Connect the parts yourself: `for` on the label matching `id` on the control,
  and `aria-describedby` on the control listing the hint's `id` and the error
  message's `id`, separated by a space. The group does none of this.
- In `pathable-form-row` at 1024 px and wider, each direct group becomes a
  four-row grid: label, hint, control, error message. Only direct children
  with those classes are placed; a wrapped or composite control is not
  aligned.
- In `pathable-form-stack` and `pathable-form-row`, the container's gap spaces
  the groups. Anywhere else, the group's 24 px top margin does, including
  above the first group.
- The group has no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The row alignment guarantee holds only for the supported structure above.

## The consumer owns

- The label, hint and error associations, and `aria-invalid` on the control
  when its value is wrong.
- Using a `pathable-fieldset` instead when the controls need a shared name for
  assistive technology.
- Removing the top margin of the first group when the form has no container
  that does it, if the space above the form is unwanted.
- The width of the field and the layout around the group.
