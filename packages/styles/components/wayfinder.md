---
name: Wayfinder
slug: wayfinder
kind: static
summary: A panel that turns a resource search into a few labelled questions, with a decorative icon, a heading, explanatory text, question groups and one result action.
styles-class: pathable-wayfinder
variants:
  - axis: surface
    default: bordered
    values: [bordered, raised]
guarantees:
  - id: panel-spacing
    status: unverified
    claim: The panel has 48 px padding, 32 px between its children and 12 px rounded corners.
  - id: surface
    status: unverified
    claim: A bordered panel has a 1 px border and no shadow, and a raised panel has the medium elevation shadow and no border.
  - id: heading-weight
    status: unmet
    claim: The heading is set in the heading typeface at weight 400, Fredoka Regular.
  - id: question-columns
    status: unverified
    claim: Above a 1024 px viewport, question groups sit side by side 48 px apart, each at least 224 px wide, sharing the width equally and wrapping when they do not fit.
  - id: narrow-stack
    status: unverified
    claim: At a viewport 1024 px wide or narrower, question groups stack in one column and the action is full width and at least 44 px tall.
  - id: choice-target
    status: unverified
    claim: Every label inside a question's controls is at least 60 px tall, a 44 px minimum content height (the label is content-box) plus 8 px padding above and below, and lays out its input and text as a row whose items are centred vertically.
  - id: text-measure
    status: unverified
    claim: The explanatory text is at most 640 px wide whatever the panel's width.
  - id: action-alignment
    status: unverified
    claim: Above a 1024 px viewport, the action keeps its own width at the start of the panel, 48 px below the question groups.
---

# Wayfinder

A panel that turns a resource search into a few labelled questions, with a
decorative icon, a heading, explanatory text, question groups and one result
action. Put the class on a `<div>` or `<section>`. It lays out what you put in
it; it adds no roles and does not read or submit the answers.

## When to use

- Guiding someone to the right resource or programme by asking two or three
  plain questions, instead of showing a long filter panel.
- An entry point on a discovery page, where one action shows the results.

Use something else when:

- the questions span several pages: use `pathable-wizard`;
- the reader narrows an existing list with many filters: use
  `pathable-filterable-option-list`;
- there is no question, only a message and a call to action: use
  `pathable-card` or `pathable-summary-box`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<section
  class="pathable-wayfinder pathable-wayfinder--raised"
  aria-labelledby="wayfinder-heading"
>
  <svg
    class="pathable-wayfinder__icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
  <h2 id="wayfinder-heading" class="pathable-wayfinder__heading">
    What are you looking for?
  </h2>
  <p class="pathable-wayfinder__text">
    Answer a few questions to find the best resources for your needs.
  </p>
  <div class="pathable-wayfinder__questions">
    <fieldset class="pathable-wayfinder__question">
      <legend class="pathable-wayfinder__question-label">
        Who are you helping?
      </legend>
      <div class="pathable-wayfinder__question-controls">
        <label
          ><input type="radio" name="audience" value="self" /> Myself</label
        >
        <label
          ><input type="radio" name="audience" value="client" /> A client</label
        >
      </div>
    </fieldset>
  </div>
  <button type="button" class="pathable-button pathable-wayfinder__action">
    Show results
  </button>
</section>
```

## Variants

Add at most one modifier class to `pathable-wayfinder`.

| Axis    | Value      | Class                        | What it is for                               |
| ------- | ---------- | ---------------------------- | -------------------------------------------- |
| surface | `bordered` | none                         | Flat panel with a 1 px border, inside a page |
| surface | `raised`   | `pathable-wayfinder--raised` | Shadowed panel with no border, to stand out  |

## Tokens

| What                     | Token                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------- |
| Panel background         | `--pathable-color-surface`                                                             |
| Border (bordered)        | `--pathable-color-border`                                                              |
| Shadow (raised)          | `--elevation-md`                                                                       |
| Corner radius            | `--radius-lg`                                                                          |
| Padding and gaps         | `--pathable-space-6`, `--pathable-space-4`, `--pathable-space-2`, `--pathable-space-1` |
| Icon and choice colour   | `--pathable-color-accent`                                                              |
| Heading size and font    | `--pathable-font-size-heading-lg`, `--pathable-font-heading`                           |
| Question label font      | `--pathable-font-subheading`                                                           |
| Text and label size      | `--pathable-font-size-body-sm`                                                         |
| Heading and label colour | `--pathable-color-text`                                                                |
| Explanatory text colour  | `--pathable-color-text-muted`                                                          |

The pixel figures on this page are those of the default theme. A theme that
changes these tokens changes them.

## Composition

Children stack in a column in source order:

- `pathable-wayfinder__icon`: an optional decorative `<svg>`, 48 px square,
  in the accent colour at 80% opacity. Draw it in `currentColor`.
- `pathable-wayfinder__heading`: the panel's heading, in the heading font at
  weight 400, with no margin.
- `pathable-wayfinder__text`: a short explanation in muted text.
- `pathable-wayfinder__questions`: holds one or more question groups.
- `pathable-wayfinder__question`: a `<fieldset>`, with its border, padding
  and margin removed, holding:
  - `pathable-wayfinder__question-label`: the `<legend>` that asks the
    question;
  - `pathable-wayfinder__question-controls`: a column of `<label>` elements,
    each wrapping one radio button or checkbox and its text. Each label is
    60 px tall at least: a 44 px minimum height plus 8 px padding above and
    below, since the label is content-box. The label sets an 8 px gap between
    the input and its text; the browser's own input margins add about 3 px to
    it, indent the input about 5 px and can set it slightly off centre. Radio buttons and checkboxes take the
    accent colour.
- `pathable-wayfinder__action`: the result action, usually a
  `pathable-button`, placed last.

In forced-colours mode the panel draws a 2 px outline so its edge stays
visible.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

Today the heading asks for bold, and the package ships only Fredoka Regular
(400), so browsers draw a synthesised bold; `heading-weight` is unmet.

## The consumer owns

- Accessibility. Name the panel (a landmark with `aria-labelledby` pointing at
  the heading, or `role="region"` with a label), group each question in a
  `<fieldset>` with a `<legend>`, and hide the icon with `aria-hidden="true"`.
- The controls. The wayfinder styles only the `<label>` elements in a
  question's controls and the accent colour of radio buttons and checkboxes.
  In the default theme that accent is 2.8:1 on white, below the 3:1 a
  control's state needs, so check the selected state is clear. It does not
  style other inputs, such as selects or text fields; give those
  their own component classes. The action keeps its `pathable-button` look;
  the wayfinder only places and, on narrow screens, widens it.
- What the answers do: reading them, validating them and showing results.
  Wrap the panel in a `<form>` and make the action `type="submit"` if it
  should submit; the example uses `type="button"` for a scripted action.
- The heading level, the wording and the number of questions; keep them few.
- Layout around the panel, including its maximum width.
