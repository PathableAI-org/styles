---
name: ProcessList
slug: process-list
kind: static
summary: A numbered sequence of steps, each with a circled number and a heading, joined by a vertical line.
styles-class: pathable-process-list
variants: []
guarantees:
  - id: numbered-marker
    status: unverified
    claim: Each item shows its position in the list, starting at 1, as a number centred in a white circle 2.5rem across overall, including its 0.25rem PathAble Blue border.
  - id: connector
    status: unverified
    claim: Every item but the last has a 0.5rem left border in lighter PathAble Blue that runs from its marker to the next, centred under the markers, and the last item's border is transparent.
  - id: item-spacing
    status: unverified
    claim: Each item has 2rem of bottom padding and 2rem of left padding inside its border, and is at most 72ex wide.
  - id: no-native-markers
    status: unverified
    claim: The list shows no browser bullets or numbers, its padding is 20px at the top and none on the right or bottom, and its left padding is 1rem.
  - id: inside-prose
    status: unverified
    claim: A list that is a direct child of pathable-prose renders the same as one outside it, with the same list padding, item spacing, markers and connector line.
  - id: heading-style
    status: unverified
    claim: The heading is 1.49rem, PathAble Blue (#00365c), with no margin, and the element after it has a 0.25rem top margin.
  - id: heading-typeface
    status: unverified
    claim: The heading is set in the brand heading typeface at normal weight, Fredoka Regular, through --pathable-font-heading and --pathable-font-weight-normal.
---

# ProcessList

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
- Without description text: a heading alone. The item keeps its 2rem of bottom
  padding, so steps with no description are spaced the same way.
- Heading level: `<h2>`, `<h3>`, `<h4>` and so on look the same, because the
  class sets the size. Put the class on a real heading element, not on a
  `<p>`, so the steps are listed by heading navigation. A step title on a `<p>`
  is a visual heading only.

The list has no variant for a larger heading or larger description text. Keep
the type sizes the stylesheet sets.

## Tokens

| What                | Token                           |
| ------------------- | ------------------------------- |
| Heading typeface    | `--pathable-font-heading`       |
| Heading font weight | `--pathable-font-weight-normal` |

The marker, the connector line and the heading colour are not custom
properties. They are compiled into the stylesheet from the theme's colour
settings: PathAble Blue (`#00365c`) for the marker ring, the numeral and the
heading, and its lightest grade (`#e6ebef`) for the line. A theme that
overrides custom properties does not change them.

## Composition

- `pathable-process-list__item` goes on each `<li>`. The number, the circle and
  the line are drawn on the item; an `<li>` without the class gets none of
  them and does not advance the count.
- `pathable-process-list__heading` goes on a heading element at the top of each
  item. Choose the level that fits the page outline. It also works on a `<p>`
  for a step title that is not a heading, but prefer a heading element.
- Put the step's description in ordinary elements after the heading, such as a
  `<p>` or a `<ul>`. A `<ul>` inside an item gets disc bullets and 0.25rem
  between its items. The first and last child of an item have no outer margin.
- The markers are placed against the list's left edge. Do not add left padding
  to the list, or the markers and the line come apart. Even without it, the
  line sits through the circles' centre.
- The list's text is Nunito at 0.99rem with a line height of 1.6; the marker
  numbers are 1.49rem.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

Every guarantee here is `unverified`: the stylesheet implements each one, and
no test checks it yet. The marker is sized as border-box so its 0.25rem border
sits inside the 2.5rem, which centres the connector line on it; a list directly
inside `pathable-prose` is given the same rules as one outside it; and the
heading takes the Fredoka Regular typeface. The pixel figures are those of the
default theme.

The package does not provide a variant for a numbered list with a body-text
column (`pathable-process-list__body`); steps put their description directly in
the item.

## The consumer owns

- Accessibility. Keep the `<ol>`: the drawn numbers are decoration, and the
  list semantics are what tell a screen reader how many steps there are and
  which one it is reading. Do not repeat the number in the heading text.
- Heading levels that fit the page outline.
- Keeping each step short; a step that needs a form belongs on its own page.
- Layout around the list: its width and the space above and below it.
