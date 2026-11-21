---
name: Step indicator
slug: step-indicator
kind: static
summary: A horizontal progress bar for a multi-step process, one equal segment per step, with an optional heading that names the current step.
styles-class: pathable-step-indicator
variants:
  - axis: counters
    default: default
    values: [default, counters, counters-sm]
  - axis: align
    default: default
    values: [default, center]
  - axis: labels
    default: default
    values: [default, no-labels]
guarantees:
  - id: equal-segments
    claim: Segments share the row's width equally, each at most 15rem wide, with a 1 px margin on either side.
  - id: segment-bar
    claim: 'Each segment draws a 0.5rem-tall bar along its top edge, #919191 for an upcoming step, #001e33 for a complete step and #00365c for the current step.'
  - id: labels-by-width
    claim: Below a 40em viewport segment labels are not displayed, and from 40em each label shows left-aligned under its bar with 0.5rem between the bar and the label.
  - id: label-state
    claim: "From 40em an upcoming step's label is #565c65, a complete step's label is #001e33, and the current step's label is bold #00365c."
  - id: counter
    claim: 'The current-step number in the heading is a 2.5rem circle with its number centred, a #00365c background and white text.'
  - id: heading-size
    claim: 'The heading is bold #00365c at 1.12rem with a 1rem top margin below a 40em viewport, and 1.49rem with a 2rem top margin from 40em.'
  - id: segment-counters
    claim: With the counters modifier, from 40em each segment shows its number in a 2.5rem circle centred on its bar, upcoming circles ringed #919191 with #565c65 numbers, complete circles #001e33 and the current circle #00365c with white numbers, and the last segment has no bar.
  - id: segment-counters-small
    claim: With the counters-sm modifier the segment circles are 1.5rem across with 0.87rem numbers and the same colours as counters.
  - id: centered-segments
    claim: With the center modifier, from 40em the segment circles and labels are centred on each segment and the label text is centred.
  - id: no-labels
    claim: With the no-labels modifier no segment label is displayed at any width and the heading has a 1rem top margin from 40em.
---

# Step indicator

A horizontal progress bar for a multi-step process, one equal segment per step,
with an optional heading that names the current step. Put the class on a
`<div>` that holds an ordered list of segments and a header. It is not
interactive: steps are not links and the class adds no role or state.

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

<!-- example: default -->

## States

Each state is complete markup for one use of the step indicator. Copy the one
closest to what you need.

<!-- examples -->

## Variants

| Axis     | Value         | Class                                  | What it is for                                                             |
| -------- | ------------- | -------------------------------------- | -------------------------------------------------------------------------- |
| counters | `default`     | none                                   | Bars only, with the label under each bar.                                  |
| counters | `counters`    | `pathable-step-indicator--counters`    | A numbered circle on each bar, so the step order reads without the labels. |
| counters | `counters-sm` | `pathable-step-indicator--counters-sm` | The same with smaller circles, for dense layouts.                          |
| align    | `default`     | none                                   | Labels and bars start at the left of each segment.                         |
| align    | `center`      | `pathable-step-indicator--center`      | Circles and labels centred on each segment; use with a counters modifier.  |
| labels   | `default`     | none                                   | A visible label under each bar from 40em.                                  |
| labels   | `no-labels`   | `pathable-step-indicator--no-labels`   | Bars and the heading only, for a short process whose steps need no names.  |

The state of each step is set on the segment, not on the block; see
Composition.

## Tokens

None. The colours, the Nunito font, sizes and spacing are fixed values and do
not follow a theme. The bar and heading colours come from the theme's colour
settings: PathAble Blue `#00365c` for the current step, its darker grade
`#001e33` for complete steps, `#919191` for the upcoming bar and `#565c65` for
the upcoming label text.

## Composition

- `pathable-step-indicator` is the block, a `<div>`. It sets the body font at
  0.99rem with a line height of 1.2, a white background and a 2rem bottom
  margin. Below 40em it has a −1 px side margin so the first and last bars
  line up with the container edge.
- `pathable-step-indicator__segments` is the `<ol>` of steps: a flex row with
  no list markers, margin or padding.
- `pathable-step-indicator__segment` is one `<li>` per step. Add
  `pathable-step-indicator__segment--complete` to finished steps and
  `pathable-step-indicator__segment--current` to the one current step; a
  segment with neither is upcoming.
- `pathable-step-indicator__segment-label` is the `<span>` in each segment
  that holds the step's visible name. From 40em it sits 0.5rem below the bar.
  Below 40em it is not displayed. After the name, a complete step has a
  `pathable-sr-only` span reading "completed" and an upcoming step has one
  reading "not completed"; the current step has none.
- `pathable-step-indicator__header` is a flex row, aligned on the text
  baseline, under the segments. It holds the
  `pathable-step-indicator__heading`.
- `pathable-step-indicator__heading` is the heading, an `<h2>` in the
  examples. Its first child is `pathable-step-indicator__heading-counter`,
  which holds a `pathable-sr-only` "Step", then
  `pathable-step-indicator__current-step` (the circled number, 2.5rem across)
  and `pathable-step-indicator__total-steps` (for example "of 4", followed by
  a 0.5rem gap). Its second child is `pathable-step-indicator__heading-text`,
  the current step's name.
- The counters, centred and no-label modifiers go on the block and combine:
  `--center` goes with `--counters` or `--counters-sm`, and `--center` also
  combines with `--no-labels`. The numbers in the circles are drawn by the
  stylesheet from the segment order, so the segments carry no number in their
  text.
- Interactive steps, such as links to earlier steps or a button that moves on,
  are not part of this component.

## Guarantees

The guarantees are the list in the front matter at the top of this page.

Because segments stop at 15rem, a short process in a wide container leaves the
row's right-hand part empty.

## The consumer owns

- Accessibility. Below 40em the labels are `display: none`, so they are hidden
  from assistive technology as well as from sight. Always include the heading
  with the current step's number and name, or another text equivalent. The
  examples mark the current segment with `aria-current="step"`: `step` is the
  WAI-ARIA value for the current step in a process and is an intentional
  accessibility choice of this component. The stylesheet does not depend on
  the value. Keep the "completed" and "not completed" text in the label, as in
  the examples, because the bars carry the state in colour only. With the
  no-labels modifier, hide the whole `<ol>` with `aria-hidden="true"` and rely
  on the heading.
- Keeping the classes and the text in step: the stylesheet does not count
  steps or work out which is current.
- The heading level, and the label text and its length.
- Layout around the block, including space above it.
