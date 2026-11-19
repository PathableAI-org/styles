---
name: GraphicList
slug: graphic-list
kind: static
summary: A section of media blocks, each a picture beside a heading and text, set in the body typeface with brand headings.
styles-class: pathable-graphic-list
variants: []
guarantees:
  - id: body-type
    status: unverified
    claim: Text in the list is Nunito at 0.99rem with a line height of 1.6.
  - id: heading-type
    status: unverified
    claim: The heading is Fredoka at 1.12rem with a line height of 1.4.
  - id: heading-spacing
    status: unverified
    claim: The heading has no top margin when it is the first child, a 1.5em top margin when it follows another element and no bottom margin, and the element after it has a 1em top margin.
  - id: block-spacing
    status: unmet
    claim: Each pathable-media-block in the list has a bottom margin of 2rem below a 40em viewport and 4rem from 40em, and the last one has none.
  - id: image-gap
    status: unmet
    claim: The image of a pathable-media-block in the list has a right margin of 1.5rem.
  - id: body-first-child
    status: unmet
    claim: The first child of a pathable-media-block body in the list has no top margin, so its heading lines up with the top of the image.
---

# GraphicList

A section of media blocks, each a picture beside a heading and text, set in the
body typeface with brand headings. Put the class on a `<div>` or `<section>`
that holds `pathable-media-block` elements.

Today the class sets the section's type and its heading only. The spacing
between the media blocks and inside them is not applied to
`pathable-media-block` markup yet: see Guarantees.

## When to use

- A short run of features, services or benefits, each with an illustration or
  icon, a heading and a sentence or two.

Use something else when:

- the items are a list a person scans and picks a link from: use
  `pathable-collection`;
- the items are steps in order: use `pathable-process-list`;
- the items are boxed panels in a grid: use `pathable-card`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<section class="pathable-graphic-list">
  <h2 class="pathable-graphic-list__heading">What we offer</h2>
  <div class="pathable-media-block">
    <img
      class="pathable-media-block__img"
      src="coaching.svg"
      alt=""
      width="64"
      height="64"
    />
    <div class="pathable-media-block__body">
      <h3>One-to-one coaching</h3>
      <p>Sessions with a coordinator who knows your workplace.</p>
    </div>
  </div>
  <div class="pathable-media-block">
    <img
      class="pathable-media-block__img"
      src="adjustments.svg"
      alt=""
      width="64"
      height="64"
    />
    <div class="pathable-media-block__body">
      <h3>Workplace adjustments</h3>
      <p>Help agreeing changes with your employer.</p>
    </div>
  </div>
</section>
```

## Variants

`pathable-graphic-list` has no modifier classes.

## Tokens

None. The typefaces, sizes and spacing are fixed in the stylesheet.

## Composition

- `pathable-graphic-list__heading` goes on the section's heading. Its
  spacing rules also apply outside a graphic list, wherever the class is used.
- Each item is a `pathable-media-block` with `pathable-media-block__img` and
  `pathable-media-block__body`. Today the blocks take only their own layout:
  a 0.5rem image gap and no space between blocks. Until the unmet guarantees
  are met, add the spacing between blocks yourself, for example with
  `pathable-stack`.
- The package has no class for laying the blocks out in columns. Put them in a
  grid of the consumer's own if the design needs more than one column.
- Headings inside each block's body keep their own size and margins.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The three unmet guarantees are spacing the stylesheet has for this list but
does not apply to `pathable-media-block` children, although the package says
the wrapper needs no other classes in the markup.

## The consumer owns

- Accessibility. Give an illustration `alt=""` when the block's heading says
  the same thing, and a real `alt` only when the image adds information.
- Heading levels that fit the page outline, for the section heading and the
  heading in each block.
- Spacing between the blocks, and any column layout, until the unmet
  guarantees are met.
- Layout around the section: its width and the space above and below it.
