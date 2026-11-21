---
name: Card
slug: card
kind: static
summary: A bordered box with a heading, an optional image, a body and a footer action, for one item such as a service, an appointment or an event.
styles-class: pathable-card
variants:
  - axis: layout
    default: default
    values: [default, flag]
  - axis: header
    default: default
    values: [default, header-first]
  - axis: media-side
    default: default
    values: [default, media-right]
  - axis: appearance
    default: default
    values: [default, workflow]
guarantees:
  - id: box
    status: unverified
    claim: The container is a white box with a 2 px solid #eef0f4 border, 0.5rem rounded corners and 0.5rem left and right margins, set in Nunito at 0.99rem with a line height of 1.6 in the theme text colour; the card itself draws no background, border or padding.
  - id: card-spacing
    status: unverified
    claim: A card has a bottom margin of 2.5rem below a 40em viewport and 2rem from 40em, including when it is the last child of its parent.
  - id: part-padding
    status: unverified
    claim: The header, body and footer have 1.5rem of padding left and right; the header has 1.5rem above and 0.5rem below, the body 0.5rem above and below, and the footer 0.5rem above and 1.5rem below; the first part has 1.5rem above it and the last part 1.5rem below it.
  - id: heading-style
    status: unverified
    claim: The heading is set in Fredoka Regular at 1.49rem with a line height of 1.2 and no margin, and a word wider than the card breaks instead of leaving it.
  - id: media-fit
    status: unverified
    claim: Outside a flag card, an image, svg, video or picture directly inside the media is as wide as the container, with its height following its own ratio, and the media is ordered before the other parts, so it sits at the top of the card.
  - id: media-corners
    status: unverified
    claim: In a card that is not a flag or header-first card, the media is clipped and its top corners are rounded to 0.375rem, which is the container's radius less its border.
  - id: header-first
    status: unverified
    claim: With the header-first modifier the header stays above the media, the media's top corners stay square, and the header and body each have 1rem of padding towards the media.
  - id: exdent-media
    status: unverified
    claim: The exdent media modifier gives the media a negative 2 px margin on its left, right and top, so it covers the container border, which makes the image 4 px wider than the container's content box.
  - id: flag-layout
    status: unverified
    claim: With the flag modifier, from a 40em viewport the media is a 15rem column on the left that fills the card's height with overflow clipped, and the header, body and footer have a 15rem left margin; below 40em a flag card stacks like a card with media.
  - id: flag-image-fill
    status: unmet
    claim: In a flag card the image fills the 15rem column and is cropped to cover it, whatever the image's ratio. Today the image keeps its own proportions, scaled to its natural width, so a wide image is cut off on its right edge.
  - id: media-right
    status: unmet
    claim: The class pathable-card--media-right is not in the stylesheet yet. When it is, a flag card with it has the 15rem media column on the right and the 15rem margin on the right of the header, body and footer.
  - id: inset-media
    status: unmet
    claim: The classes pathable-card__media--inset and pathable-card__img are not in the stylesheet yet. When they are, an inset media box has 1.5rem of padding above and on both sides and its image sits in a box with a light grey background, which clips and fills it.
  - id: workflow-surface
    status: unverified
    claim: With the workflow modifier the card has the theme surface background and a 1 px border in the theme border colour, and its container has no border and no shadow.
  - id: workflow-parts
    status: unverified
    claim: In a workflow card the heading is in the theme text colour and Fredoka, the status is bold at the small body size in the theme success text colour, the metadata is in the muted text colour at the small body size, and the action is a link in the theme link colour with an underline.
  - id: workflow-focus
    status: unverified
    claim: A workflow card draws a 2 px outline with a 2 px offset around the whole card while any element inside it has focus, and its action links draw the same outline on their own focus.
---

# Card

A bordered box with a heading, an optional image, a body and a footer action,
for one item such as a service, an appointment or an event. Put the class on a
block element that holds a `pathable-card__container`. The card adds no role:
the box you see is the container, and the card itself only sets spacing.

## When to use

- A self-contained item a person can act on from the box itself, such as a
  service to learn about, a workshop to register for or an appointment to
  book.
- A set of items of similar weight, such as the services a programme offers,
  laid out in a `pathable-card-grid`.
- A work item that shows its status, a short summary and one next action, in
  its workflow form.

Use something else when:

- the items are rows in a scannable list, each with a title and details:
  use `pathable-collection`;
- the box only groups content and has no heading or action: use
  `pathable-surface`;
- the item is a count or a metric: use `pathable-kpi-grid`.

## Example

<!-- package: styles -->

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- /package -->

<!-- example: default -->

## States

Each state is complete markup for one use of the card. Copy the one closest
to what you need.

<!-- examples -->

## Variants

Add at most one modifier class from each axis to `pathable-card`. The
media-side modifier only has an effect together with the flag modifier.

| Axis       | Value          | Class                         | What it is for                                                                |
| ---------- | -------------- | ----------------------------- | ----------------------------------------------------------------------------- |
| layout     | `default`      | none                          | Parts stacked in one column, with any image across the top                    |
| layout     | `flag`         | `pathable-card--flag`         | The image in a 15rem column beside the text from a 40em viewport              |
| header     | `default`      | none                          | The image first, above the heading                                            |
| header     | `header-first` | `pathable-card--header-first` | The heading first, above the image                                            |
| media-side | `default`      | none                          | The flag image on the left                                                    |
| media-side | `media-right`  | `pathable-card--media-right`  | The flag image on the right; not in the stylesheet yet                        |
| appearance | `default`      | none                          | A white container with a light border                                         |
| appearance | `workflow`     | `pathable-card--workflow`     | A surface-coloured card for a work item with a status, metadata and an action |

## Tokens

The workflow modifier reads these custom properties; the other variants use
fixed values.

| What                           | Token                                                               |
| ------------------------------ | ------------------------------------------------------------------- |
| Workflow background            | `--pathable-color-surface`                                          |
| Workflow border                | `--pathable-color-border`                                           |
| Workflow text                  | `--pathable-color-text`                                             |
| Workflow heading typeface      | `--pathable-font-heading`                                           |
| Workflow status text           | `--pathable-color-text-success`                                     |
| Workflow metadata text         | `--pathable-color-text-muted`                                       |
| Workflow metadata, status size | `--pathable-font-size-body-sm`                                      |
| Workflow action                | `--pathable-color-link`                                             |
| Workflow focus outline         | `--pathable-surface-focus-ring`, else `--pathable-color-focus-ring` |
| Heading weight                 | `--pathable-font-weight-normal`                                     |

The pixel figures on this page are those of the default theme.

## Composition

- `pathable-card`: the outer block. Put it on a `<div>`, or on an `<li>` when
  the cards are the items of a list.
- `pathable-card__container`: the bordered box. Put every other part directly
  inside it.
- `pathable-card__header`: holds the heading. Put the heading, such as an
  `<h3>`, in `pathable-card__heading`. Pick the level that fits the page
  outline.
- `pathable-card__media`: holds an image, `svg`, `video` or `picture`.
  Whatever its place in the markup, it is shown first, above the other parts,
  unless the card has the header-first modifier. Add
  `pathable-card__media--exdent` for an image that runs over the container
  border to the card's edge.
- `pathable-card__body`: the text, usually one paragraph.
- `pathable-card__footer`: the action, such as a `pathable-button` or a
  `pathable-link`. A card has one primary action.
- Workflow parts, inside a card with the workflow modifier:
  `pathable-card__status` (a status in words, such as "Completed"),
  `pathable-card__meta` (a line of details such as a date),
  and `pathable-card__action` (the action link, or a container of actions).
- To lay several cards out, put them in a `pathable-card-grid` on a `<ul>`
  with the cards as `<li>` items, as in the list state. A card group class
  that lays cards out in flag-width rows is not part of this component.
- Inset media, `pathable-card__media--inset` with an inner `pathable-card__img`,
  and exdent classes on the header, body and footer are not in the stylesheet
  yet.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The class `pathable-card--media` is in the stylesheet as an alias of
`pathable-card` and adds nothing: do not use it.

## The consumer owns

- Accessibility. Give an image `alt=""` when the heading already names the
  item, and a real `alt` only when the image adds information. Give a card's
  action text that is unique on the page, for example by adding the item's
  name in a `pathable-sr-only` span after the visible label.
- Heading levels that fit the page outline.
- The image files, and the aspect ratios they are cut to. The image keeps its
  own ratio, so cards in one row look even only when their images share one.
- Roles and names for lists of cards: label the `<ul>` with `aria-label` or
  `aria-labelledby`.
- Any action that needs JavaScript, such as a card that opens a dialog. This
  component only styles the markup.
- The destination of the action and how a click is handled.
