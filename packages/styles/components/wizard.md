---
name: Wizard
slug: wizard
kind: static
summary: A centred page layout for one step of a multi-step form, with step context, a heading, the step's content, a validation summary and an action footer.
styles-class: pathable-wizard
variants: []
guarantees:
  - id: max-width
    status: unverified
    claim: The wizard is at most --pathable-wizard-max-width wide, 1024 px by default, and is centred in a wider container.
  - id: validation-hidden
    status: unverified
    claim: The validation region is not displayed unless it also has pathable-wizard__validation--visible.
  - id: heading-gap
    status: unmet
    claim: The heading sits one wizard gap, --pathable-wizard-gap or 16 px by default, below the region before it, like every other region after the first.
  - id: mobile-summary
    status: unverified
    claim: The mobile summary is not displayed at a viewport 640 px wide or wider and is displayed below that.
  - id: action-targets
    status: unverified
    claim: Every pathable-button in the action footer is at least 44 by 44 px at every viewport width.
  - id: action-order
    status: unmet
    claim: At every viewport width, no two footer buttons are closer than the footer's 8 px gap and the last button reaches the footer's end; at a viewport 640 px wide or wider they sit in a wrapping row with only that gap between neighbours on a line, except that the continue button, the submit button and the last button are pushed to the inline end.
  - id: mobile-footer
    status: unverified
    claim: Below a 640 px viewport, the action footer sticks to the bottom of the viewport as two equal columns, with a save button alone on the first row.
  - id: region-sizes
    status: unverified
    claim: At a 16 px root, the heading is set at the theme's large type size, 1.5rem (24 px), the section heading at its medium size, 1.125rem (18 px), and the mobile summary at its small size, 1rem (16 px), instead of the inherited or element default size.
---

# Wizard

A centred page layout for one step of a multi-step form, with step context, a
heading, the step's content, a validation summary and an action footer. Put the
class on the element that holds one step. The application renders one step at a
time and sets the classes for it; the wizard needs no JavaScript of its own.

## When to use

- A long form split into ordered steps, such as intake or enrolment, where the
  reader moves forward and back and can save and leave.
- A single-step form that should share the same heading and footer layout as
  the multi-step ones.

Use something else when:

- the form fits on one page with no steps: use `pathable-form` alone;
- the reader answers a few questions to find a resource: use
  `pathable-wayfinder`;
- the work is a side panel beside a record, not a page: use
  `pathable-workflow-panel`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-wizard">
  <ol class="pathable-step-indicator">
    <li
      class="pathable-step-indicator__segment pathable-step-indicator__segment--completed"
    >
      <span class="pathable-step-indicator__segment-label">Create account</span>
    </li>
    <li
      class="pathable-step-indicator__segment pathable-step-indicator__segment--current"
      aria-current="step"
    >
      <span class="pathable-step-indicator__segment-label"
        >Participant intake</span
      >
    </li>
  </ol>
  <p class="pathable-wizard__mobile-summary">Step 2 of 2: Participant intake</p>
  <h2 class="pathable-wizard__heading" tabindex="-1">Participant intake</h2>
  <div class="pathable-wizard__validation" tabindex="-1"></div>
  <div class="pathable-form">
    <div class="pathable-form-group">
      <label class="pathable-label" for="first-name">First name</label>
      <input class="pathable-input" id="first-name" type="text" />
    </div>
  </div>
  <div class="pathable-wizard__actions">
    <button type="button" class="pathable-button pathable-button--save">
      Save and exit
    </button>
    <button type="button" class="pathable-button pathable-button--back">
      Back
    </button>
    <button type="submit" class="pathable-button pathable-button--submit">
      Submit
    </button>
  </div>
</div>
```

## Variants

The wizard has no block modifiers. Its one state, a visible validation summary,
is an element modifier described under Composition.

## Tokens

| What                             | Token                             |
| -------------------------------- | --------------------------------- |
| Maximum width                    | `--pathable-wizard-max-width`     |
| Gap between regions and sections | `--pathable-wizard-gap`           |
| Heading and section weight       | `--pathable-font-weight-bold`     |
| Mobile summary weight            | `--pathable-font-weight-semibold` |

`--pathable-wizard-max-width` is 64rem (1024 px) and `--pathable-wizard-gap`
is 1rem (16 px) in the default theme. The section rule, the footer's top
border and the mobile footer's white background and shadow are fixed colours,
not theme tokens.

## Composition

Direct children stack in source order, each separated by the wizard gap:

- Step context: a `pathable-step-indicator`. The wizard does not hide it on
  narrow screens; leave it out or hide it there if the mobile summary replaces
  it.
- `pathable-wizard__mobile-summary`: a one-line step summary such as "Step 2 of
  4: Participant intake", shown only below 640 px.
- `pathable-wizard__heading`: the step's heading, bold, with no margin of its
  own apart from the wizard gap above it.
- `pathable-wizard__validation`: the error summary region, hidden until you add
  `pathable-wizard__validation--visible`. Put a `pathable-alert` with
  `pathable-alert--error` inside it.
- The step's content: a `pathable-form` or any other content. It needs no
  wizard class. Inside it, `pathable-wizard__section` is a heading (such as an
  `<h3>`) that divides a long step into titled sections, with a 1 px rule
  below it and 8 px under the rule.
- `pathable-wizard__actions`: the action footer, last, with a 1 px rule above
  it. Put `pathable-button` elements in it in this order: save and exit
  (`pathable-button--save`), back (`pathable-button--back`), then continue
  (`pathable-button--continue`) or, on the final step, submit
  (`pathable-button--submit`). Leave out the back button on the first step.
  The footer puts an 8 px gap between buttons. Apart from the primary button
  the narrow layout stretches, a `pathable-button` fills its space below a
  480 px viewport and keeps its own width from 480 px up.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

Today each `pathable-button` in the footer keeps its own 0.5rem right margin.
From 640 px up, buttons appear 16 px apart and the last one stops 0.5rem short
of the footer's end; below 640 px the save button sits 4 px left of centre,
and below 480 px the back button touches the button beside it.

Today the heading has no top margin and sits directly against the element
before it, because its margin reset also removes the wizard gap.

The heading, section and mobile summary sizes compile to the theme's large,
medium and small type sizes, so the text no longer renders at the inherited or
element default size.

## The consumer owns

- Rendering one step at a time, moving between steps and deciding which
  buttons to show.
- Focus. After a step change, move focus to the heading, which needs
  `tabindex="-1"` as in the example; after a failed submit, add
  `pathable-wizard__validation--visible`, fill the summary and move focus to
  it. Announcing errors, for example with `role="alert"`, is yours.
- The step indicator's states and `aria-current="step"` on the current step.
- The buttons. They keep their `pathable-button` styling; the footer only
  orders them, sets their minimum size and, below 640 px, stretches the
  primary one. Use real `<button>` elements with `type` set: `type="button"`
  for save and exit and back, and `type="submit"` only for the action that
  submits the step.
- Room for the sticky footer on narrow screens, so it does not cover the last
  field.
- Form fields, labels, hints and per-field error messages.
