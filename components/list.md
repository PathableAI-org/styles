---
name: List
slug: list
kind: static
summary: Vertical spacing, indent and line length for a plain bulleted or numbered list of text.
styles-class: pathable-list
variants:
  - axis: marker
    default: default
    values: [default, unstyled]
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
  - id: unstyled-markers
    status: unmet
    claim: With the unstyled modifier, the list has no bullets or numbers, no left padding and no top or bottom margin, and its items have no bottom margin and no width limit. The class pathable-list--unstyled is not in the stylesheet yet.
---

# List

Vertical spacing, indent and line length for a plain bulleted or numbered list
of text. Put the class on a `<ul>` or an `<ol>`. The class sets no font, no
colour and no marker style; the list keeps the browser's bullets or numbers and
the text styles it inherits. The unstyled modifier takes the markers away.

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

<!-- example: unordered -->

## States

Each state is complete markup for one use of the list. Copy the one closest to
what you need.

<!-- examples -->

## Variants

Add at most one modifier class to `pathable-list`. The same class works on
`<ul>` and `<ol>`; the element decides whether items are bulleted or numbered,
so bulleted and numbered lists are not variants.

| Axis   | Value      | Class                     | What it is for                                                                   |
| ------ | ---------- | ------------------------- | -------------------------------------------------------------------------------- |
| marker | `default`  | none                      | The browser's bullets or numbers, a 3ch indent and spacing around the list       |
| marker | `unstyled` | `pathable-list--unstyled` | No markers, no indent and no outer margin, for items that read as separate lines |

`pathable-list--unstyled` is not in the stylesheet yet (see the
`unstyled-markers` guarantee). It is the target: until it ships, the class
does nothing and the list looks like the default.

## Tokens

None. Every value is fixed in the stylesheet and relative to the list's own
font size (`em`, `ch`, `ex`), so the spacing scales with the text it inherits.

## Composition

- Use only `<li>` children. There are no element classes; the rules reach the
  `<li>` elements directly.
- A list nested inside an item gets the 0.25em top margin, 0.25em between its
  items and the 68ex item width without the class. Its indent is then the
  browser's default, not 3ch.
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
- List semantics for an unstyled list: some browsers stop announcing a list
  whose items draw no markers, so give an unstyled `<ul>` `role="list"` and a
  name, as the unstyled state does.
- Layout around the list: the width of its container and the spacing between
  the list and the content around it.
