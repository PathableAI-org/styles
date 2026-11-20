---
name: Collection
slug: collection
kind: static
summary: A list of items, each with an optional thumbnail, a heading, a description and a line of metadata, separated by rules.
styles-class: pathable-collection
variants: []
guarantees:
  - id: item-rule
    status: unverified
    claim: Every item, the first included, has a 1px solid top border in the current text colour, a top margin of 1rem and 1rem of padding between the border and the content, and every item but the last has a bottom margin of 1rem.
  - id: no-markers
    status: unverified
    claim: The list and its items show no bullets or numbers, and neither the list nor its items have left padding.
  - id: inside-prose
    status: unmet
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
    status: unmet
    claim: The heading is set in the brand heading typeface, Fredoka Regular.
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

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<ul class="pathable-collection">
  <li class="pathable-collection__item">
    <img class="pathable-collection__img" src="guide-cover.jpg" alt="" />
    <div class="pathable-collection__body">
      <h3 class="pathable-collection__heading">
        <a class="pathable-link" href="/guides/adjustments"
          >Asking for workplace adjustments</a
        >
      </h3>
      <p>What to say, who to ask and what happens next.</p>
      <ul class="pathable-collection__meta" aria-label="Guide details">
        <li>Updated 3 November 2026</li>
        <li>8 minute read</li>
      </ul>
    </div>
  </li>
</ul>
```

## Variants

`pathable-collection` has no modifier classes. There is no condensed spacing
class in the package.

## Tokens

None. Every value is fixed in the stylesheet. The rule between items has no
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
- `pathable-collection__meta` goes on a `<ul>` of short details after the
  description. The class removes its bullets and indent; it does not lay the
  details out in a row, so they stack unless the consumer adds a flex row such
  as `pathable-inline`.
- The description is an ordinary `<p>`; it keeps its own margins.
- The list's text is Nunito at 0.99rem with a line height of 1.6.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

Today a list placed directly inside `pathable-prose` takes the prose list
spacing, a 3ch left padding and a 0.25em bottom margin on each item but the
last, so `inside-prose` is unmet. Until the fix lands, wrapping the list in
another element inside the prose avoids those rules.

The heading is set in Nunito, the body typeface, at weight 700. The brand rules
give Fredoka Regular for headings, so `heading-typeface` is unmet.

## The consumer owns

- Accessibility. Give a thumbnail `alt=""` when the heading already names the
  item, and a real `alt` only when the image adds information. Make the heading
  link's text unique within the list. Label the metadata list when its meaning
  is not obvious from its items.
- Heading levels that fit the page outline.
- The colour of the rules, by setting the item's text colour or border colour.
- Layout around the collection: its width and the space above and below it.
