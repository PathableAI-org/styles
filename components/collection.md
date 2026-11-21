---
name: Collection
slug: collection
kind: static
summary: A list of items, each with an optional thumbnail, a heading, a description and a line of metadata, separated by rules.
styles-class: pathable-collection
variants:
  - axis: density
    default: default
    values: [default, condensed]
guarantees:
  - id: item-rule
    status: unverified
    claim: Every item, the first included, has a 1px solid top border in the current text colour, a top margin of 1rem and 1rem of padding between the border and the content, and every item but the last has a bottom margin of 1rem; the last item has none.
  - id: no-markers
    status: unverified
    claim: The list and its items show no bullets or numbers, and neither the list nor its items have left padding.
  - id: inside-prose
    status: unverified
    claim: A list that is a direct child of pathable-prose renders the same as one outside it, with the same list padding and item spacing.
  - id: thumbnail-size
    status: unverified
    claim: The thumbnail is 4rem wide below a 40em viewport and 5rem from 40em, has a 1rem right margin and does not shrink.
  - id: body-fills
    status: unverified
    claim: The body sits beside the thumbnail, aligned to its top, and takes all the remaining width of the item.
  - id: line-length
    status: unverified
    claim: Each item is at most 68ex wide.
  - id: heading-style
    status: unverified
    claim: The heading is 1.12rem with a line height of 1.4 and no margin, and the metadata list below it has a 0.25em top margin.
  - id: heading-typeface
    status: unverified
    claim: The heading is set in the brand heading typeface, Fredoka Regular.
  - id: condensed
    status: unmet
    claim: The class pathable-collection--condensed is not in the stylesheet yet. When it is, each item has 0.5rem of top and bottom margin and 0.5rem of padding between the border and the content.
  - id: description
    status: unmet
    claim: The class pathable-collection__description is not in the stylesheet yet. When it is, the description has 0.5rem of margin above and below it.
  - id: meta-item
    status: unmet
    claim: The class pathable-collection__meta-item is not in the stylesheet yet. When it is, each detail is a block with a 0.25rem top margin and a 0.5rem right margin, in a smaller type size than the description.
  - id: calendar-date
    status: unmet
    claim: The classes pathable-collection__calendar-date, pathable-collection__calendar-date-month and pathable-collection__calendar-date-day are not in the stylesheet yet. When they are, the date block is the width of the thumbnail with the same 1rem right margin, the month is a bold centred label in white on the primary colour with rounded top corners, and the day is a bold centred number in the primary colour inside a 1px primary border with rounded bottom corners.
---

# Collection

A list of items, each with an optional thumbnail, a heading, a description and
a line of metadata, separated by rules. Put the class on a `<ul>`. It suits
search results, resource lists and news listings, where each entry links to
its own page.

## When to use

- A list of related pages or resources a person scans and picks one from,
  such as guides, training courses or articles.
- Results that each need a title, a sentence of description and details such
  as a date or author.

Use something else when:

- the items are plain text points: use `pathable-list`;
- there is only one item: use `pathable-media-block`;
- the items are steps in order: use `pathable-process-list`;
- each item is a boxed panel in a grid: use `pathable-card`.

## Example

<!-- package: styles -->

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- /package -->

<!-- example: default -->

## States

Each state is complete markup for one use of the list. Copy the one closest to
what you need.

<!-- examples -->

## Variants

Add at most one modifier class to `pathable-collection`.

| Axis    | Value       | Class                            | What it is for                                                                                   |
| ------- | ----------- | -------------------------------- | ------------------------------------------------------------------------------------------------ |
| density | `default`   | none                             | 1rem of margin and padding around each item                                                      |
| density | `condensed` | `pathable-collection--condensed` | 0.5rem of margin and padding around each item, for a list of headings; not in the stylesheet yet |

## Tokens

| What                | Token                           |
| ------------------- | ------------------------------- |
| Heading typeface    | `--pathable-font-heading`       |
| Heading font weight | `--pathable-font-weight-normal` |

Every other value is fixed in the stylesheet. The rule between items has no
colour of its own: it takes the item's text colour.

## Composition

- `pathable-collection__item` goes on each `<li>`. It is a flex row, aligned to
  the top.
- `pathable-collection__img` goes on an optional thumbnail `<img>`, first in
  the item. Its width is set by the class; set no height and let the image's
  own ratio decide it. A fixed height, including a `height` attribute,
  distorts the image below 40em, where the width is 4rem.
- `pathable-collection__body` goes on the element after the thumbnail that
  holds the text. Use it even without a thumbnail.
- `pathable-collection__heading` goes on a heading element at the top of the
  body, usually wrapping a link to the item's page.
- `pathable-collection__description` goes on the `<p>` after the heading. It
  is not in the stylesheet yet; until it is, a plain `<p>` keeps its own
  margins.
- `pathable-collection__meta` goes on a `<ul>` of short details after the
  description. The class removes its bullets and indent; it does not lay the
  details out in a row, so they stack unless the consumer adds a flex row such
  as `pathable-inline`. Use one list per kind of detail, such as one for the
  author and date and one for tags, and name each with `aria-label`.
- `pathable-collection__meta-item` goes on each `<li>` of a meta list. It is
  not in the stylesheet yet; until it is, a plain `<li>` has no spacing or
  type size of its own. Put a `pathable-tag` span inside it for a topic.
- `pathable-collection__calendar-date` goes on a block before the body, in
  place of a thumbnail, that holds a `<time>` with a
  `pathable-collection__calendar-date-month` and a
  `pathable-collection__calendar-date-day` span. It is not in the stylesheet
  yet.
- JavaScript is not part of this component: it does not sort, filter or page
  the items.
- The list's text is Nunito at 0.99rem with a line height of 1.6.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

A list placed directly inside `pathable-prose` renders the same as one
outside it, so the list padding and item spacing do not change there.

The heading is set in the brand heading typeface, Fredoka, at weight 400
(Regular), as the brand rules require.

## The consumer owns

- Accessibility. Give a thumbnail `alt=""` when the heading already names the
  item, and a real `alt` only when the image adds information. Make the heading
  link's text unique within the list. Label the metadata list when its meaning
  is not obvious from its items.
- Heading levels that fit the page outline.
- The colour of the rules, by setting the item's text colour or border colour.
- Layout around the collection: its width and the space above and below it.
