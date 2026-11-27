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
guarantees:
  - id: group
    claim: The card group is a list with no bullets, margin or padding, and its cards are its direct list items.
  - id: inside-prose
    claim: A card group that is a direct child of pathable-prose renders the same as one outside it, with no list padding or bullets and the same card spacing.
  - id: box
    claim: The container is a white box with a 2 px solid #eef0f4 border, 0.5rem rounded corners and 0.5rem left and right margins, set in Nunito at 0.99rem with a line height of 1.6 in the theme text colour; the card itself draws no background, border or padding.
  - id: card-spacing
    claim: A card has a bottom margin of 2.5rem below a 40em viewport and 2rem from 40em, including when it is the last child of its parent.
  - id: part-padding
    claim: The header, body and footer have 1.5rem of padding left and right; the header has 1.5rem above and 0.5rem below, the body 0.5rem above and below, and the footer 0.5rem above and 1.5rem below; the first part has 1.5rem above it and the last part 1.5rem below it.
  - id: heading-style
    claim: The heading is set in Fredoka Regular at 1.49rem with a line height of 1.2 and no margin, and a word wider than the card breaks instead of leaving it.
  - id: media-fit
    claim: Outside a flag card, the media is ordered before the other parts, so it sits at the top of the card, and its image is as wide as the container, cropped to cover the image box, which has a light grey background.
  - id: media-corners
    claim: In a card that is not a flag or header-first card, the image box is clipped and its top corners are rounded to 0.375rem, which is the container's radius less its border.
  - id: header-first
    claim: With the header-first modifier the header stays above the media, the media's top corners stay square, and the header and body each have 1rem of padding towards the media.
  - id: inset-media
    claim: Where the media is not a 15rem column, an inset media box has 1.5rem of padding above and on both sides; in the flag column layout it has 1.5rem above and below and on the outer side, and none beside the text. The image box inside it has square corners.
  - id: exdent-media
    claim: The exdent media modifier gives the media a negative 2 px margin on its left, right and top, so it covers the container border, which makes the image 4 px wider than the container's content box.
  - id: exdent-parts
    claim: The exdent modifiers on the header, body and footer give the part a negative 2 px margin on its left and right, so it covers the container border, and keep the content in line with the other parts.
  - id: flag-layout
    claim: With the flag modifier, from a 40em viewport and when the card is at least 30rem wide, which leaves room for the 15rem column beside a text column, the media is a 15rem column on the left that fills the card's height with overflow clipped, and the header, body and footer have a 15rem left margin; otherwise a flag card stacks like a card with media.
  - id: flag-image-fill
    claim: In a flag card whose media is a 15rem column, the image fills the column and is cropped to cover it, whatever the image's ratio.
  - id: media-right
    claim: A flag card with the media-right modifier whose media is a 15rem column has that column on the right and the 15rem margin on the right of the header, body and footer.
---

# Card

A bordered box with a heading, an optional image, a body and a footer action,
for one item such as a service, an appointment or an event. Put
`pathable-card` on an `<li>` of a `<ul class="pathable-card-group">`, with one
`pathable-card__container` inside it. The card adds no role: the box you see
is the container, and the card itself only sets spacing.

## When to use

- A self-contained item a person can act on from the box itself, such as a
  service to learn about, a workshop to register for or an appointment to
  book.
- A set of items of similar weight, such as the services a programme offers,
  laid out in a card group.

Use something else when:

- the items are rows in a scannable list, each with a title and details:
  use `pathable-collection`.

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

Add at most one modifier class from each axis to `pathable-card`.

| Axis       | Value          | Class                         | What it is for                                                                                   |
| ---------- | -------------- | ----------------------------- | ------------------------------------------------------------------------------------------------ |
| layout     | `default`      | none                          | Parts stacked in one column, with any image across the top                                       |
| layout     | `flag`         | `pathable-card--flag`         | The image in a 15rem column beside the text, from a 40em viewport and a card at least 30rem wide |
| header     | `default`      | none                          | The image first, above the heading                                                               |
| header     | `header-first` | `pathable-card--header-first` | The heading first, above the image                                                               |
| media-side | `default`      | none                          | The flag image on the left                                                                       |
| media-side | `media-right`  | `pathable-card--media-right`  | The flag image on the right                                                                      |

The media-side modifier is for a flag card. The media and the parts also take
element modifiers, set on the element and not on the card:
`pathable-card__media--inset` (the image inside the card padding),
`pathable-card__media--exdent` (the image over the container border), and
`pathable-card__header--exdent`, `pathable-card__body--exdent` and
`pathable-card__footer--exdent` (the part over the container border).

## Tokens

None. The sizes, colours and spacing are fixed values in the compiled
stylesheet. The pixel figures on this page are those of
the default theme.

## Composition

- `pathable-card-group`: a `<ul>` that holds the cards. A card is always one
  of its `<li>` items, including a single card.
- `pathable-card`: the outer block, on the `<li>`.
- `pathable-card__container`: the bordered box. Put every other part directly
  inside it.
- `pathable-card__header`: holds the heading. Put the heading, such as an
  `<h3>`, in `pathable-card__heading`. Pick the level that fits the page
  outline. The header comes first in the markup.
- `pathable-card__media`: holds a `pathable-card__img`, which holds an
  `<img>`. Whatever its place in the markup, the media is shown first, above
  the other parts, unless the card has the header-first modifier. Write it
  between the header and the body.
- `pathable-card__body`: the text, usually one paragraph.
- `pathable-card__footer`: the action, such as a `pathable-button` or a
  `pathable-link`. A card has one primary action.
- To lay several cards out, put them in one card group, as in the list state.
- Cards in a card group fill its width, one per row, unless a width or column
  class sets another width. Use column classes, such as `tablet:grid-col-6`,
  to lay cards out in a row.
- A flag or media-right card needs room for its 15rem column beside the text.
  It stacks like a card with media when it is narrower than 30rem, even from a
  40em viewport.
- From a 40em viewport, a flag card whose width comes from its content, such
  as one with `width-auto` or in a shrink-to-fit parent, is 30rem wide, or the
  viewport width if that is less. As a flex or grid item it shrinks to the space
  available and stacks below 30rem. A width or max-width class still sets
  another width.
- From a 40em viewport, a flag card is an unnamed inline-size query container.
  Container queries and `cqi` or `cqw` units written inside it resolve against
  the card.
- Some utilities do not apply: a margin-right utility on a lone button in a
  card footer; side padding, left margin and max-width utilities on a button
  directly in an exdent part; margin-top, margin-bottom and padding-left
  utilities on a card group placed directly in `pathable-prose`; and max-width
  and margin-bottom utilities on a card in that group.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is the contract of the component.

## The consumer owns

- Accessibility. Give an image `alt=""` when the heading already names the
  item, and a real `alt` only when the image adds information. Give a card's
  action text that is unique on the page, for example by adding the item's
  name in a `pathable-sr-only` span after the visible label.
- Heading levels that fit the page outline.
- The image files, and the aspect ratios they are cut to. Cards in one row
  look even when their images share one ratio.
- Roles and names for lists of cards: label the `<ul>` with `aria-label` or
  `aria-labelledby`.
- Any action that needs JavaScript, such as a card that opens a dialog. This
  component only styles the markup.
- The destination of the action and how a click is handled.
