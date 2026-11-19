---
name: EmbedContainer
slug: embed-container
kind: static
summary: A full-width 16:9 box that stretches one embedded video, map or frame to fill it.
styles-class: pathable-embed-container
variants: []
guarantees:
  - id: ratio
    status: unverified
    claim: In a parent with no set height that is not a flex row, the box is as wide as its parent and its height is 9/16 of its width.
  - id: fills
    status: unverified
    claim: An iframe, object, embed or other direct child is positioned over the whole box at 100% of its width and height, whatever width and height attributes it has.
  - id: no-overflow
    status: unverified
    claim: The box is never wider than its parent and clips anything that reaches outside it.
  - id: image-cover
    status: unverified
    claim: An image placed directly in the box covers it without distortion, cropping whatever does not fit the 16:9 shape.
---

# EmbedContainer

A full-width 16:9 box that stretches one embedded video, map or frame to fill
it. Put the class on a `<div>` around the embed. The box keeps its shape as the
page narrows, so the embed never overflows a phone screen or leaves empty bands.

## When to use

- A video, map, slide viewer or other third-party `<iframe>` whose width should
  follow the layout and whose height should follow the width.
- A still image that should be cropped to the same 16:9 shape as the videos
  beside it.

Use something else when:

- the media is a small picture beside text: use `pathable-media-block`;
- the media belongs to a card: use the card's own media element inside
  `pathable-card`;
- the embed needs a fixed height, such as a form: set the height on the
  `<iframe>` itself and do not use this box.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-embed-container">
  <iframe
    src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
    title="Introduction to workplace adjustments (video)"
    allowfullscreen
  ></iframe>
</div>
```

## Variants

`pathable-embed-container` has no modifier classes. The ratio is always 16:9;
the package has no class for another ratio.

## Tokens

None. The ratio is fixed in the stylesheet.

## Composition

- Put exactly one embed inside, as a direct child: an `<iframe>`, `<object>`,
  `<embed>`, `<video>` or `<img>`. It is placed over the whole box, and its
  `width` and `height` attributes are overridden.
- The box takes its width from its parent. Constrain the width on the parent,
  such as a grid column, not on the box.
- Do not make the box a direct child of a flex row, such as `pathable-inline`,
  `pathable-media-block` or `pathable-collection__item`. The box has no width
  of its own and nothing in flow, so there it shrinks to nothing and the embed
  disappears. Wrap it in an element that has a width.
- Do not set a height on the parent. The box inherits that height. A parent
  shorter than 9/16 of its width makes the box narrow to keep 16:9, so it no
  longer fills the width; a taller parent makes the box fill the width at the
  parent's height, so it is no longer 16:9. The parent's padding is copied into
  the box too, but does not change its size.
- The `<iframe>` keeps the browser's default border, which is clipped at the
  right and bottom edges. Set `border: 0` on it to fill the box edge to edge.
- The class also works on an `<img>` itself, which is then cropped to 16:9.
- Put any caption or transcript link outside the box, after it. Anything inside
  is laid over the embed.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The ratio is the box's, not the content's: a 4:3 video in the box shows
letterbox bands drawn by the player, and an image is cropped.

## The consumer owns

- Accessibility. Give every `<iframe>` a `title` that says what it shows, give
  an image an `alt`, and provide captions and a transcript for video and audio.
- Keyboard access to the embedded content, which the third party controls.
- Privacy and loading: choose privacy-preserving embed URLs and add
  `loading="lazy"` where it suits.
- Layout around the box: its width, and the space above and below it.
