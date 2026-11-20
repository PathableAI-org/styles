---
name: Fieldset
slug: fieldset
kind: static
summary: A borderless, unpadded fieldset that groups related form controls under one legend.
styles-class: pathable-fieldset
variants: []
guarantees:
  - id: no-chrome
    status: unverified
    claim: The fieldset has no border on any side, replacing the browser's default grooved border.
  - id: no-space
    status: unverified
    claim: The fieldset has zero margin and zero padding on every side, so its contents start at its own edges.
  - id: legend-aligned
    status: unverified
    claim: The left edge of a `pathable-legend` box inside the fieldset is the left edge of the fieldset's other children.
  - id: type
    status: unverified
    claim: The fieldset sets a font size of 0.99rem (15.84 px at a 16 px root) and line-height 1.4, in Nunito, which its contents inherit unless they set their own.
---

# Fieldset

A borderless, unpadded fieldset that groups related form controls under one
legend. Put the class on a `<fieldset>` element. It is not interactive. The
`<fieldset>` element itself gives the group its role; the class only removes
the browser's box around it.

## When to use

- A set of radios, where one answer is chosen.
- A set of checkboxes that answer one question.
- Several fields that only make sense together, such as the parts of an
  address, when the group needs one name.

Use something else when:

- the fields are related only by layout: use `pathable-form-row`, or
  `pathable-stack` with `pathable-form-stack`, without a fieldset;
- one control and its label are the whole field: use `pathable-form-group`;
- the group needs a visible box: put the fieldset inside a `pathable-card` or
  another surface.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<fieldset class="pathable-fieldset">
  <legend class="pathable-legend">Participation consent</legend>
  <span class="pathable-hint" id="participation-consent-hint">
    Confirm the participant agrees to each item.
  </span>
  <label class="pathable-checkbox">
    <input
      class="pathable-checkbox__input"
      type="checkbox"
      name="consent"
      value="share"
      aria-describedby="participation-consent-hint"
    />
    <span class="pathable-checkbox__label">
      Share progress notes with the employment coach
    </span>
  </label>
</fieldset>
```

## Variants

The fieldset has no modifier classes.

## Tokens

None. The font family, size and line-height are fixed values in the compiled
stylesheet, not custom properties.

## Composition

- Put a `<legend>` with `pathable-legend` as the fieldset's first child. It
  names the group. The legend class does not reset the browser's small inline
  padding on `<legend>`, so the legend text can sit a few pixels in from the
  other children.
- After the legend: an optional `pathable-hint`, the controls, then an
  optional `pathable-error-message`, in that order.
- Connect the hint and the error message to the controls with
  `aria-describedby` on each control, listing the hint's `id` and the error
  message's `id` separated by a space. The fieldset does not do this for you.
- The fieldset adds no space around itself or its contents. Space it from its
  neighbours with `pathable-stack` together with `pathable-form-stack`, or
  with your own margin. On its own, `pathable-form-stack` adds no gap, and do
  not count on the legend's top margin for space above the group.
- The fieldset keeps the browser's minimum width, which is the width of its
  widest unbreakable content. Long words or wide controls inside it widen the
  fieldset instead of wrapping; keep content inside narrow layouts breakable.
- The fieldset has no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- The structure: a real `<fieldset>` element with a `<legend>` first. A
  `<div>` with this class is not a group to assistive technology.
- Disabling the group, if needed, with the `disabled` attribute on the
  fieldset; the class adds no disabled styling of its own.
- The hint and error associations on each control, and `aria-invalid` on the
  controls when the group's answer is wrong.
- Any border, background or padding the group should have, and the layout
  around it.
