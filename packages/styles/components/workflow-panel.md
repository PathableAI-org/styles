---
name: WorkflowPanel
slug: workflow-panel
kind: static
summary: A narrow column for one guided staff task, with a context header, objective, current activity, prompt, note input, save status and completion actions.
styles-class: pathable-workflow-panel
variants:
  - axis: state
    default: default
    values:
      [default, loading, saving, saved, offline, validation-error, completed]
guarantees:
  - id: column
    status: unverified
    claim: The panel is a single column at most --pathable-workflow-panel-max-width wide (320 px by default) with --pathable-workflow-panel-gap (12 px by default) between its regions.
  - id: prompt-scroll
    status: unverified
    claim: The prompt has 12 px padding and its content is at most 320 px tall (344 px with the padding), scrolling vertically inside itself when its content is longer.
  - id: status-text
    status: unverified
    claim: Each state modifier writes a fixed English message before the status region's content (Loading…, Saving…, ✓ Saved, the offline warning, the validation warning or ✓ Completed), and the default state writes none.
  - id: completed-hides
    status: unverified
    claim: In the completed state the prompt and input regions are not displayed and every other region still is.
  - id: empty-regions
    status: unverified
    claim: An objective or current-activity region with no child nodes at all, not even whitespace, is not displayed and leaves no gap.
  - id: action-targets
    status: unverified
    claim: Every pathable-button in the actions region is at least 44 by 44 px, and below a 640 px viewport the actions region sticks to the bottom of the viewport.
  - id: text-contrast
    status: unmet
    claim: The current-activity text and the saved, completed and offline status messages each have a contrast of at least 4.5:1 against their background.
---

# WorkflowPanel

A narrow column for one guided staff task, with a context header, objective,
current activity, prompt, note input, save status and completion actions. Put
the class on a `<div>` or `<section>`. The application sets a state modifier
class to show loading, saving, saved, offline, error or completed status; the
panel needs no JavaScript of its own.

## When to use

- A side panel that walks a staff member through one task in a session, such
  as an assessment, beside the record it concerns.
- A compact task view where the save status must stay visible while notes are
  written.

Use something else when:

- the task is a full-page form in ordered steps: use `pathable-wizard`;
- the content is a static message with no task: use `pathable-alert` or
  `pathable-summary-box`;
- the panel only needs to stay in view while the page scrolls: use
  `pathable-sticky-panel`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<section
  class="pathable-workflow-panel pathable-workflow-panel--saved"
  aria-label="Intake assessment"
>
  <div class="pathable-workflow-panel__context-header">
    Participant: Jamie Rivera
  </div>
  <div class="pathable-workflow-panel__objective">
    Complete the intake assessment
  </div>
  <div class="pathable-workflow-panel__current-activity">
    Current activity: Initial assessment
  </div>
  <div class="pathable-workflow-panel__prompt">
    Review the participant's background and goals, and note any barriers to
    employment.
  </div>
  <div class="pathable-workflow-panel__input">
    <label class="pathable-label" for="notes">Assessment notes</label>
    <textarea class="pathable-textarea" id="notes" rows="4"></textarea>
  </div>
  <div class="pathable-workflow-panel__status" role="status"></div>
  <div class="pathable-workflow-panel__actions">
    <button class="pathable-button pathable-button--save">Save draft</button>
    <button class="pathable-button pathable-button--continue">Continue</button>
  </div>
</section>
```

## Variants

Add at most one state modifier class to `pathable-workflow-panel`. Each state
changes only what the status region shows, except where the table says more.

| Axis  | Value              | Class                                       | What it is for                                        |
| ----- | ------------------ | ------------------------------------------- | ----------------------------------------------------- |
| state | `default`          | none                                        | Working; the status region shows only its own content |
| state | `loading`          | `pathable-workflow-panel--loading`          | Task data is being fetched: "Loading…"                |
| state | `saving`           | `pathable-workflow-panel--saving`           | Notes are being saved: "Saving…"                      |
| state | `saved`            | `pathable-workflow-panel--saved`            | Save succeeded: "✓ Saved" in green                    |
| state | `offline`          | `pathable-workflow-panel--offline`          | Connection lost: amber warning box; continue dimmed   |
| state | `validation-error` | `pathable-workflow-panel--validation-error` | Errors to fix: red warning box                        |
| state | `completed`        | `pathable-workflow-panel--completed`        | Task done: "✓ Completed"; prompt and input hidden     |

## Tokens

| What                      | Token                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| Maximum width             | `--pathable-workflow-panel-max-width`                                                             |
| Gap between regions       | `--pathable-workflow-panel-gap`                                                                   |
| Prompt background         | `--pathable-workflow-panel-prompt-bg`                                                             |
| Prompt line height        | `--pathable-font-line-height-body`                                                                |
| Region and status weights | `--pathable-font-weight-semibold`, `--pathable-font-weight-bold`, `--pathable-font-weight-normal` |

In the default theme the maximum width is 20rem (320 px), the gap 0.75rem
(12 px) and the prompt background light grey (`#f0f0f0`). The region text
colours, the status message colours and the mobile footer's white background
are fixed colours, not theme tokens. The contrast figures in the guarantees
are measured with those fixed colours.

## Composition

Regions stack in source order; each is optional:

- `pathable-workflow-panel__context-header`: who or what the task is about,
  semibold.
- `pathable-workflow-panel__objective`: the task's goal, bold. Hidden when
  it has no child nodes at all; whitespace or a line break inside it keeps it
  displayed.
- `pathable-workflow-panel__current-activity`: the current activity, in grey.
  Hidden on the same terms as the objective.
- `pathable-workflow-panel__prompt`: instructions on a grey background with
  2 px rounded corners, scrolling once its content passes 320 px tall (344 px
  with its padding).
- `pathable-workflow-panel__input`: a wrapper for the note field, such as a
  labelled `pathable-textarea`. It adds no spacing of its own.
- `pathable-workflow-panel__status`: the save and progress status. The state
  modifiers put their message at its start.
- `pathable-workflow-panel__actions`: a wrapping row of `pathable-button`
  elements with an 8 px gap. Each button keeps its own 0.5rem right margin, so
  buttons appear 16 px apart and the last one stops 0.5rem short of the
  panel's end. Mark the primary one `pathable-button--continue`: the offline
  state dims it to 60% opacity and ignores pointer clicks on it, but it can
  still be reached and pressed with the keyboard.

The panel sets no working font size for the context header, objective,
current activity, prompt or status regions, or for the status messages, so
they render at the inherited size; set a size yourself if you need one.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

Today all four fall short: the current-activity text is about 2.2:1 on white,
the saved and completed messages about 2.8:1 on white, and the offline message
about 4.3:1 on its amber box.

## The consumer owns

- Setting and clearing the state modifier as the task loads, saves, goes
  offline, fails validation or completes. Use one state at a time.
- Announcing state changes. The status messages are CSS-generated English
  text: they cannot be translated through markup, and assistive technology may
  not read or announce them. Put the same status in words in the status
  region, for example in a `pathable-sr-only` element inside a `role="status"`
  region.
- Disabling the continue button yourself when offline, with `disabled` or
  `aria-disabled="true"` and a guard in the handler.
- The controls. Buttons keep their `pathable-button` styling and the note
  field its own component class; the panel only sizes and lays out the
  buttons. Label the note field visibly.
- Room for the sticky actions on narrow screens, and placing the panel beside
  the content it supports.
- Minimising sensitive participant data shown in the panel.
