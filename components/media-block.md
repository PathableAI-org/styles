---
name: MediaBlock
slug: media-block
kind: static
summary: A flex row that holds an image or icon at its natural size beside a body of text that takes the remaining width.
styles-class: pathable-media-block
variants: []
guarantees:
  - id: row
    status: unverified
    claim: The block lays out its image and body in one flex row, aligned to the top, and never wraps the body below the image.
  - id: image-fixed
    status: unverified
    claim: The image keeps its own width and does not shrink, however long the body text is.
  - id: image-gap
    status: unverified
    claim: The image has a right margin of 0.5rem and no other margin.
  - id: body-fills
    status: unverified
    claim: The body grows to fill the width the image leaves, and text that can wrap wraps inside that width.
---

# MediaBlock

A flex row that holds an image or icon at its natural size beside a body of
text that takes the remaining width. Put the class on a `<div>`. It sets layout
only: no font, colour, border or padding, and no role.

## When to use

- A person, organisation or resource shown as a picture or icon with a name and
  a line or two of description.
- Any text that should start beside a leading visual and wrap beside it, not
  under it.

Use something else when:

- the row is a list of several such items with headings, metadata and dividers
  between them: use `pathable-collection`;
- the visual is a status icon on a tile: put a `pathable-icon-tile` inside this
  block, or beside text in `pathable-inline`;
- the content is a boxed panel with a header and actions: use `pathable-card`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-media-block">
  <img
    class="pathable-media-block__img"
    src="jordan-lee.jpg"
    alt="Jordan Lee"
    width="64"
    height="64"
  />
  <div class="pathable-media-block__body">
    <h3>Jordan Lee</h3>
    <p>Employment support coordinator for the central region.</p>
  </div>
</div>
```

## Variants

`pathable-media-block` has no modifier classes.

## Tokens

None. The 0.5rem gap is fixed in the stylesheet.

## Composition

- `pathable-media-block__img` goes on the leading visual: an `<img>`, an
  `<svg>`, or a wrapper around either. Give it a size with `width` and
  `height`; the block does not size it.
- `pathable-media-block__body` goes on the element that holds the text. It
  takes all the width the image leaves.
- Use exactly one of each, image first. Content placed directly in the block
  without either class becomes another flex item, with no gap and no growth.
- The block is aligned to the top, so a short body sits level with the top of
  the image. The package has no class that centres the body against the image:
  `pathable-flex-align-center` on the block has no effect, because the block's
  own alignment wins.
- The body's first heading keeps its own top margin. Remove it if the heading
  should line up with the top of the image.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The body only wraps cleanly when its content can wrap. Content that cannot,
such as a long URL or a wide table, can push past the block unless the consumer
lets it break or scroll.

## The consumer owns

- Accessibility. Give a meaningful image an `alt`, or an SVG `role="img"` and
  an accessible name. Give a decorative image `alt=""`, or `aria-hidden="true"`
  on the SVG, when the body already names the subject.
- Heading levels inside the body, so they fit the page outline.
- The image's size and aspect ratio.
- Layout around the block: spacing between blocks and the container's width.
