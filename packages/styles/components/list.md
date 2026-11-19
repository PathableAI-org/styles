---
name: List
slug: list
kind: static
summary: Vertical spacing, indent and line length for a plain bulleted or numbered list of text.
styles-class: pathable-list
variants: []
guarantees:
  - id: block-spacing
    status: unverified
    claim: The list has a top and bottom margin of 1em, and a list that is the last child of its parent has no bottom margin.
  - id: indent
    status: unverified
    claim: The list has a left padding of 3ch and a line height of 1.6, and keeps the browser's own bullets or numbers.
  - id: item-spacing
    status: unverified
    claim: Each item has a bottom margin of 0.25em, and the last item has none.
  - id: line-length
    status: unverified
    claim: Each item is at most 68ex wide, and longer text wraps inside that width.
  - id: nested-list
    status: unverified
    claim: A list nested inside an item of the list has a top margin of 0.25em.
---

# List

Vertical spacing, indent and line length for a plain bulleted or numbered list
of text. Put the class on a `<ul>` or an `<ol>`. The class sets no font, no
colour and no marker style; the list keeps the browser's bullets or numbers and
the text styles it inherits.

## When to use

- A short run of related points or steps in running text, such as the
  documents a participant needs to bring.
- A numbered sequence that needs nothing more than numbers.

Use something else when:

- each step needs a heading, a numbered marker and a line joining the steps:
  use `pathable-process-list`;
- each item has an image, a heading and metadata: use `pathable-collection`;
- each item leads with an icon: use `pathable-icon-tile` beside the text in a
  `pathable-media-block`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<ul class="pathable-list">
  <li>Photo identification</li>
  <li>Your most recent support plan</li>
  <li>Any letters from your employer about adjustments</li>
</ul>
```

## Variants

`pathable-list` has no modifier classes. The same class works on `<ul>` and
`<ol>`; the element decides whether items are bulleted or numbered.

## Tokens

None. Every value is fixed in the stylesheet and relative to the list's own
font size (`em`, `ch`, `ex`), so the spacing scales with the text it inherits.

## Composition

- Use only `<li>` children. There are no element classes; the rules reach the
  `<li>` elements directly.
- A list nested inside an item does not need the class to get the 0.25em top
  margin, but it does need the class for its own indent and item spacing.
- The list can sit anywhere text does, including inside `pathable-prose`,
  `pathable-card` and `pathable-media-block`.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The 68ex limit applies to each item, not to the list, so the list itself can be
as wide as its container.

## The consumer owns

- Choosing `<ol>` when order matters and `<ul>` when it does not; screen
  readers announce the list type and the number of items.
- Keeping each item short, and writing items in parallel form.
- Removing the bullets, if a design needs no markers: the package has no class
  for an unmarked list.
- Layout around the list: width of the container and spacing from content that
  is not its parent's last child.
