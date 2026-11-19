---
name: ProcessList
slug: process-list
kind: static
summary: A numbered sequence of steps, each with a circled number and a heading, joined by a vertical line.
styles-class: pathable-process-list
variants: []
guarantees:
  - id: numbered-marker
    status: unmet
    claim: Each item shows its position in the list, starting at 1, as a number centred in a white circle 2.5rem across overall, including its 0.25rem PathAble Blue border.
  - id: connector
    status: unmet
    claim: Every item but the last has a 0.5rem left border in lighter PathAble Blue that runs from its marker to the next, centred under the markers, and the last item's border is transparent.
  - id: item-spacing
    status: unverified
    claim: Each item has 2rem of bottom padding and 2rem of left padding inside its border, and is at most 72ex wide.
  - id: no-native-markers
    status: unverified
    claim: The list shows no browser bullets or numbers, its padding is 20px at the top and none on the right or bottom, and its left padding is 1rem unless the list is a direct child of pathable-prose.
  - id: heading-style
    status: unverified
    claim: The heading is 1.49rem, PathAble Blue, with no margin, and the element after it has a 0.25rem top margin.
  - id: heading-typeface
    status: unmet
    claim: The heading is set in the brand heading typeface, Fredoka Regular.
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

```html
<ol class="pathable-process-list">
  <li class="pathable-process-list__item">
    <h3 class="pathable-process-list__heading">Tell us what you need</h3>
    <p>Describe the adjustment and how it helps you at work.</p>
  </li>
  <li class="pathable-process-list__item">
    <h3 class="pathable-process-list__heading">Meet your coordinator</h3>
    <p>We agree the details with you and your employer.</p>
  </li>
  <li class="pathable-process-list__item">
    <h3 class="pathable-process-list__heading">Start using it</h3>
    <p>We check in after four weeks to see how it is going.</p>
  </li>
</ol>
```

## Variants

`pathable-process-list` has no modifier classes.

## Tokens

None. The marker, line and heading colours are fixed PathAble Blue (`#00365c`)
and its lighter grade (`#e6ebef`) in the stylesheet, not theme tokens, so a theme
does not change them.

## Composition

- `pathable-process-list__item` goes on each `<li>`. The number, the circle and
  the line are drawn on the item; an `<li>` without the class gets none of
  them and does not advance the count.
- `pathable-process-list__heading` goes on a heading element at the top of each
  item. Choose the level that fits the page outline.
- Put the step's description in ordinary elements after the heading, such as a
  `<p>` or a `<ul>`. A `<ul>` inside an item gets disc bullets and 0.25rem
  between its items. The first and last child of an item have no outer margin.
- The markers are placed against the list's left edge. Do not add left padding
  to the list, or the markers and the line come apart. Even without it, the
  line runs 4px left of the circles' centre today.
- Do not put the list directly inside `pathable-prose`: there it takes the
  prose list spacing today, including a 3ch left padding that moves the line
  further right of the markers and a 0.25em bottom margin on each item but the
  last. Wrapping it in another element inside the prose avoids those rules.
- The list's text is Nunito at 0.99rem with a line height of 1.6; the marker
  numbers are 1.49rem.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

Today the circle's 0.25rem border is added outside its 2.5rem width, so the
marker is 3rem across and the line runs 4px left of its centre: `numbered-marker`
and `connector` are unmet. A list placed directly inside `pathable-prose` has
the prose list's left padding instead of 1rem: see Composition.

The heading is set in Nunito, the body typeface, at weight 700. The brand rules
give Fredoka Regular for headings, so `heading-typeface` is unmet.

## The consumer owns

- Accessibility. Keep the `<ol>`: the drawn numbers are decoration, and the
  list semantics are what tell a screen reader how many steps there are and
  which one it is reading. Do not repeat the number in the heading text.
- Heading levels that fit the page outline.
- Keeping each step short; a step that needs a form belongs on its own page.
- Layout around the list: its width and the space above and below it.
