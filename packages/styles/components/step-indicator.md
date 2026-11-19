---
name: StepIndicator
slug: step-indicator
kind: static
summary: A horizontal progress bar for a multi-step process, one equal segment per step, with an optional heading that names the current step.
styles-class: pathable-step-indicator
variants: []
guarantees:
  - id: equal-segments
    status: unverified
    claim: Segments share the row's width equally, each at most 15rem wide, with a 1 px margin on either side.
  - id: segment-bar
    status: unverified
    claim: Each segment draws a 0.5rem-tall bar along its top edge, #919191 for an upcoming step, #001e33 for a complete step and #00365c for the current step.
  - id: labels-by-width
    status: unverified
    claim: Below a 40em viewport segment labels are not displayed, and from 40em each label shows left-aligned under its bar with 0.5rem between the bar and the label.
  - id: label-state
    status: unverified
    claim: From 40em an upcoming step's label is #565c65, a complete step's label is #001e33, and the current step's label is bold #00365c.
  - id: counter
    status: unverified
    claim: 'The current-step counter is a circle at least 2.5rem across, about 3rem at the default heading size, with a #00365c background and white text.'
  - id: heading-size
    status: unverified
    claim: The heading is bold #00365c at 1.12rem with a 1rem top margin below a 40em viewport, and 1.49rem with a 2rem top margin from 40em.
---

# StepIndicator

A horizontal progress bar for a multi-step process, one equal segment per step,
with an optional heading that names the current step. Put the class on a
`<section>` or `<div>` that holds an ordered list of segments. It is not
interactive: steps are not links and the class adds no role or state. To name
the block with `aria-label`, use an element with a role, such as `<section>`;
a plain `<div>` cannot take a name.

## When to use

- Showing where the person is in a short, linear form or wizard, such as
  three to six steps.

Use something else when:

- the steps are instructions to read, not progress: use
  `pathable-process-list`;
- the person needs to move between steps: build the wizard with
  `pathable-wizard` and its own navigation, and keep the step indicator as a
  display only.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<section class="pathable-step-indicator" aria-label="Progress">
  <ol class="pathable-step-indicator__segments">
    <li
      class="pathable-step-indicator__segment pathable-step-indicator__segment--complete"
    >
      <span class="pathable-sr-only">Create account, completed</span>
      <span class="pathable-step-indicator__segment-label" aria-hidden="true">
        Create account
      </span>
    </li>
    <li
      class="pathable-step-indicator__segment pathable-step-indicator__segment--current"
      aria-current="step"
    >
      <span class="pathable-sr-only">Verify identity</span>
      <span class="pathable-step-indicator__segment-label" aria-hidden="true">
        Verify identity
      </span>
    </li>
    <li class="pathable-step-indicator__segment">
      <span class="pathable-sr-only">Set up profile, not completed</span>
      <span class="pathable-step-indicator__segment-label" aria-hidden="true">
        Set up profile
      </span>
    </li>
  </ol>
  <div class="pathable-step-indicator__header">
    <h2 class="pathable-step-indicator__heading">
      <span class="pathable-sr-only">Step</span>
      <span class="pathable-step-indicator__current-step">2</span>
      <span class="pathable-step-indicator__total-steps">of 3</span>
      Verify identity
    </h2>
  </div>
</section>
```

## Variants

The step indicator has no modifier classes. The state of each step is set on
the segment, not on the block; see Composition.

## Tokens

None. The colours, the Nunito font, sizes and spacing are fixed values and do
not follow a theme.

## Composition

- `pathable-step-indicator` is the block. It sets the body font at 0.99rem with
  a line height of 1.2, a white background and a 2rem bottom margin. Below
  40em it has a −1 px side margin so the first and last bars line up with the
  container edge.
- `pathable-step-indicator__segments` is the `<ol>` of steps: a flex row with
  no list markers, margin or padding.
- `pathable-step-indicator__segment` is one `<li>` per step. Add
  `pathable-step-indicator__segment--complete` to finished steps and
  `pathable-step-indicator__segment--current` to the one current step; a
  segment with neither is upcoming. `pathable-step-indicator__segment--completed`
  is the same as `pathable-step-indicator__segment--complete`.
- `pathable-step-indicator__segment-label` is the step's visible name inside
  the segment. From 40em it sits 0.5rem below the bar. Below 40em it is not
  displayed.
- `pathable-step-indicator__header` is a flex row, aligned on the text
  baseline, under the segments. Put the `pathable-step-indicator__heading`
  inside it, with `pathable-step-indicator__current-step` (the circled number,
  about 3rem across at the default heading size)
  and `pathable-step-indicator__total-steps` (for example "of 3", followed by
  a 0.5rem gap) before the step name.
- `pathable-step-indicator__step`, `pathable-step-indicator__step--current`,
  `pathable-step-indicator__step--complete` and
  `pathable-step-indicator__step-label` are aliases of the segment classes and
  look the same.
- The class may also go straight on the `<ol>` in place of the wrapper and
  `pathable-step-indicator__segments`. The list then has no bottom or side
  margin, and there is nowhere to put the header.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

Because segments stop at 15rem, a short process in a wide container leaves the
row's right-hand part empty.

## The consumer owns

- Accessibility. Below 40em the labels are `display: none`, so they are hidden
  from assistive technology as well as from sight. Always include the heading
  with the current step's number and name, or another text equivalent. Mark
  the current segment with `aria-current="step"`, and give each step its name
  and state in `pathable-sr-only` text directly in the `<li>`, outside
  `pathable-step-indicator__segment-label`, as in the example. Text inside the
  label is lost below 40em, and the bars carry the state in colour only. Hide
  the visible label with `aria-hidden="true"` so the name is not read twice.
- Keeping the classes and the text in step: the stylesheet does not count
  steps or work out which is current.
- The heading level, and the label text and its length.
- Layout around the block, including space above it.
