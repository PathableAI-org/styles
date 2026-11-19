---
name: FormRow
slug: form-row
kind: static
summary: A row of form fields that stacks on narrow screens and, from 1024 px wide, puts each field in an equal column with the controls lined up.
styles-class: pathable-form-row
variants:
  - axis: gap
    default: default
    values: [default, gap-sm, gap-md, gap-lg, gap-xl]
guarantees:
  - id: stacks-narrow
    status: unverified
    claim: Below a viewport width of 1024 px the direct form groups stack in one column in DOM order, separated by the row gap and with no top margin of their own.
  - id: equal-columns
    status: unverified
    claim: From a viewport width of 1024 px each direct form group takes one equal-width column, however many groups there are, and the row does not scroll horizontally.
  - id: aligned-controls
    status: unverified
    claim: From 1024 px the tops of the direct input, select and textarea controls of all groups line up within 1 px when their labels and hints differ in length or are missing.
  - id: errors-below
    status: unverified
    claim: From 1024 px a direct error message starts at or below the bottom of the tallest control in the row.
  - id: controls-fill
    status: unverified
    claim: From 1024 px a direct input, select or textarea fills its column with no maximum width, unless it carries a max-width utility, which then keeps its own limit.
  - id: gap-scale
    status: unverified
    claim: The gap between fields is 8 px by default, and 4, 8, 16 or 24 px with gap-sm, gap-md, gap-lg or gap-xl; from 1024 px it is the column gap and the row adds no gap between a field's label, hint, control and error, though the control keeps its own 8 px top margin.
---

# FormRow

A row of form fields that stacks on narrow screens and, from 1024 px wide, puts
each field in an equal column with the controls lined up. Put the class on a
`<div>` (or a `<fieldset>` that groups the fields) whose direct children are
`pathable-form-group` elements. It adds no role, no legend and no validation.

## When to use

- Two to four short, related fields that read naturally side by side, such as
  first and last name, or a pair of filters.
- Fields whose labels or hints differ in length but whose controls should
  still start on one line.

Use something else when:

- the fields belong one below another at every width: use
  `pathable-form-stack` with `pathable-stack`;
- the items are not form fields, or need a fixed column count: use
  `pathable-grid`;
- the items are the form's buttons: use `pathable-button-group` or
  `pathable-cluster`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-form-row">
  <div class="pathable-form-group">
    <label class="pathable-label" for="service">Service area</label>
    <span class="pathable-hint" id="service-hint">
      Choose the category that best matches the current goal.
    </span>
    <select
      class="pathable-select"
      id="service"
      aria-describedby="service-hint"
    >
      <option>Employment support</option>
      <option>Independent living</option>
    </select>
  </div>
  <div class="pathable-form-group">
    <label class="pathable-label" for="status">Status</label>
    <select class="pathable-select" id="status">
      <option>Active</option>
      <option>Paused</option>
    </select>
  </div>
</div>
```

## Variants

Add at most one gap modifier class to `pathable-form-row`.

| Axis | Value     | Class                       | What it is for                     |
| ---- | --------- | --------------------------- | ---------------------------------- |
| gap  | `default` | none                        | 8 px between fields                |
| gap  | `gap-sm`  | `pathable-form-row--gap-sm` | 4 px, for compact filter bars      |
| gap  | `gap-md`  | `pathable-form-row--gap-md` | 8 px, the same as the default      |
| gap  | `gap-lg`  | `pathable-form-row--gap-lg` | 16 px, for fields with long labels |
| gap  | `gap-xl`  | `pathable-form-row--gap-xl` | 24 px, for wide forms              |

## Tokens

| What                   | Token                     |
| ---------------------- | ------------------------- |
| Gap between fields     | `--pathable-form-row-gap` |
| Small gap              | `--space-4`               |
| Default and medium gap | `--space-8`               |
| Large gap              | `--space-16`              |
| Extra-large gap        | `--space-24`              |

Set `--pathable-form-row-gap` on the row for a gap outside the scale. The
pixel figures are those of the default theme. A theme that changes the
spacing tokens changes them.

## Composition

- Every direct child is a `pathable-form-group`. Inside each group, in this
  DOM order and as direct children: a `pathable-label`, an optional
  `pathable-hint`, one `pathable-input`, `pathable-select` or
  `pathable-textarea`, and an optional `pathable-error-message`. The row
  lines up these four parts across groups.
- Other controls, such as a control inside a wrapper element, a date picker
  or a combo box, sit in the group but are not lined up with the others.
- When controls differ in height, such as a textarea beside an input, every
  error message starts below the tallest control.
- From 1024 px the row puts no gap between a field's label, hint, control
  and error, but each control keeps its own 8 px top margin, and a label
  that is not the first child of its group keeps its own top margin.
- To keep a control narrower than its column, add a max-width utility such
  as `pathable-maxw-mobile` to it.
- The breakpoint follows the viewport, not the row's container. A row in a
  narrow sidebar still makes columns on a wide screen, so keep rows in a
  container wide enough for their fields. Do not put a row inside the narrow
  `pathable-form`; use `pathable-form-stack` for a wider form.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Accessibility. Give every control a `<label for>` and connect its hint and
  error with `aria-describedby`; set `aria-invalid="true"` on a control in
  error. When the fields form one question, such as a date range, wrap them
  in a `<fieldset>` with a `<legend>`.
- Keeping the DOM order of the fields the order they should be read and
  tabbed through; the row does not reorder them.
- Choosing how many fields share a row so each column stays wide enough for
  its content.
- Validation, error text and the form's submit buttons.
