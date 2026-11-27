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
    claim: The list has a top and bottom margin of 1em, and a list that is the last child of its parent has no bottom margin.
  - id: indent
    claim: The list has a left padding of 3ch and a line height of 1.6, and keeps the browser's own bullets or numbers.
  - id: item-spacing
    claim: Each item has a bottom margin of 0.25em, and the last item has none.
  - id: line-length
    claim: Each item is at most 68ex wide, and longer text wraps inside that width.
  - id: nested-list
    claim: A list nested inside an item of the list has a top margin of 0.25em.
  - id: unstyled-markers
    claim: With the unstyled modifier, the list has no bullets or numbers, no left padding and no top or bottom margin, and its items have no bottom margin and no width limit.
  - id: inside-prose
    claim: A list with the unstyled modifier that is a direct child of pathable-prose renders the same as one outside it, with no markers, no left padding, no top or bottom margin, and items with no bottom margin and no width limit.
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
- each item leads with an icon: use `pathable-icon-list`.

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

Every value is relative to the list's own font size (`em`, `ch`, `ex`), so the
spacing scales with the text it inherits.

## Composition

- Use only `<li>` children. There are no element classes; the rules reach the
  `<li>` elements directly.
- A list nested inside an item gets the 0.25em top margin, 0.25em between its
  items and the 68ex item width without the class. Its indent is then the
  browser's default, not 3ch.
- The list can sit anywhere text does, including inside `pathable-prose` and
  `pathable-card`.

## Guarantees

The guarantees are the list in the front matter at the top of this page.

The 68ex limit applies to each item, not to the list, so the list itself can be
as wide as its container.

## The consumer owns

- Choosing `<ol>` when order matters and `<ul>` when it does not; screen
  readers announce the list type and the number of items.
- Keeping each item short, and writing items in parallel form.
- List semantics for an unstyled list. Some browsers stop announcing a list
  whose items draw no markers, so give an unstyled `<ul>` `role="list"` and a
  name (`aria-label` or `aria-labelledby`), as the states here do.
- Layout around the list: the width of its container and the spacing between
  the list and the content around it.
