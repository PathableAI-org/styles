---
name: Process list
slug: process-list
kind: static
summary: A numbered sequence of steps, each with a circled number and a heading, joined by a vertical line.
styles-class: pathable-process-list
variants: []
guarantees:
  - id: numbered-marker
    claim: Each item shows its position in the list, starting at 1, as a number centred in a white circle 2.5rem across overall, including its 0.25rem PathAble Blue border.
  - id: connector
    claim: Every item but the last has a 0.5rem left border in lighter PathAble Blue that runs from its marker to the next, centred under the markers, and the last item's border is transparent.
  - id: item-spacing
    claim: Each item has 2rem of bottom padding and 2rem of left padding inside its border, and is at most 72ex wide.
  - id: no-native-markers
    claim: The list shows no browser bullets or numbers, its padding is 20px at the top and none on the right or bottom, and its left padding is 1rem.
  - id: inside-prose
    claim: A list that is a direct child of pathable-prose renders the same as one outside it, with the same list padding, item spacing, markers and connector line.
  - id: heading-style
    claim: The heading is 1.5rem (the lg size), PathAble Blue (#00365c), with no margin, and the element after it has a 0.25rem top margin.
  - id: heading-typeface
    claim: The heading is set in the brand heading typeface at normal weight, Fredoka Regular, with weight 400.
  - id: custom-size
    claim: A type or spacing utility on an item, a heading or a description, such as font-sans-xl, line-height-sans-1, font-sans-lg or padding-bottom-4, sets that element's size or spacing in place of the list's own.
---

# Process list

A numbered sequence of steps, each with a circled number and a heading, joined
by a vertical line. Put the class on an `<ol>`. The numbers are drawn by the
stylesheet from the item order, so they always run 1, 2, 3 without gaps.

## When to use

- A short sequence a person goes through in order, such as applying for an
  adjustment or setting up an account, where each step has a name and a few
  sentences.

Use something else when:

- the steps are one line each with no heading: use `pathable-list` on an
  `<ol>`;
- the person is moving through the steps of a form and needs to see which one
  they are on: use `pathable-step-indicator`;
- the items are not ordered: use `pathable-collection` or `pathable-list`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: default -->

## States

Each state is complete markup for one use of the list. Copy the one closest to
what you need.

<!-- examples -->

## Variants

`pathable-process-list` has no modifier classes. The states above differ only
in what goes inside each item:

- With description text: a heading followed by a `<p>`, a `<ul>` or both.
- Without description text: a title alone. The title may be a `<p>` with the
  heading class and type utilities, as in the no-text example, and the item
  keeps its bottom padding so steps are spaced the same way.
- Heading level: `<h2>`, `<h3>`, `<h4>` and so on look the same, because the
  class sets the size. Put the class on a real heading element where the steps
  should be listed by heading navigation.
- Custom size: type and spacing utilities on the heading, the description and
  the item make the steps larger, as in the custom-size example.

## Tokens

| What                | Value       |
| ------------------- | ----------- |
| Heading typeface    | Fredoka     |
| Heading font weight | 400, normal |

The marker, the connector line and the heading colour are fixed values in
the stylesheet: PathAble Blue (`#00365c`) for the marker ring, the numeral and the
heading, and its lightest grade (`#e6ebef`) for the line.

## Composition

- `pathable-process-list__item` goes on each `<li>`. The number, the circle and
  the line are drawn on the item; an `<li>` without the class gets none of
  them and does not advance the count.
- `pathable-process-list__heading` goes on a heading element at the top of each
  item. Choose the level that fits the page outline. It also works on a `<p>`
  for a step title that is not a heading.
- Put the step's description in ordinary elements after the heading, such as a
  `<p>` or a `<ul>`. A `<ul>` inside an item gets disc bullets and 0.25rem
  between its items. The first and last child of an item have no outer margin.
- The markers are placed against the list's left edge. Do not add left padding
  to the list, or the markers and the line come apart.
- The list's text is Nunito at 1rem (the sm size) with a line height of 1.6; the marker
  numbers are 1.5rem.

## Guarantees

The guarantees are the list in the front matter at the top of this page. The
marker is sized as border-box so its 0.25rem border sits inside the 2.5rem,
which centres the connector line on it; a list directly inside `pathable-prose`
is given the same rules as one outside it; and the heading takes the Fredoka
Regular typeface. The pixel figures are those of the default theme.

## The consumer owns

- Accessibility. Keep the `<ol>`: the drawn numbers are decoration, and the
  list semantics are what tell a screen reader how many steps there are and
  which one it is reading. Do not repeat the number in the heading text.
- Heading levels that fit the page outline.
- Keeping each step short; a step that needs a form belongs on its own page.
- Layout around the list: its width and the space above and below it.
