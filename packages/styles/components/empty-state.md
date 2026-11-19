---
name: EmptyState
slug: empty-state
kind: static
summary: A centred block with an icon, a heading, a short explanation and an optional action, shown in place of a view that has no content.
styles-class: pathable-empty-state
variants:
  - axis: kind
    default: default
    values: [default, no-data, no-results, setup-required, completed]
guarantees:
  - id: centred-column
    status: unverified
    claim: The children stack in a column, centred horizontally with centred text, 24 px apart, inside 64 px of padding above and below and 32 px left and right.
  - id: narrow-padding
    status: unverified
    claim: At a viewport 480 px wide or narrower, the padding is 48 px above and below and 16 px left and right.
  - id: icon-size
    status: unverified
    claim: The icon element is 48 px square whatever width and height attributes it carries.
  - id: kind-colour
    status: unverified
    claim: Kind changes only the icon's colour and opacity, 0.5 by default and 0.6 for every other kind, and leaves the heading, body and action unchanged.
  - id: text
    status: unverified
    claim: The heading is 20 px bold in the heading typeface and the text colour, and the body is 14 px with a line height of 1.5 in the muted text colour and no wider than 28rem.
  - id: action-space
    status: unverified
    claim: The action element has 16 px of extra space above it, on top of the 24 px gap.
  - id: forced-colours
    status: unverified
    claim: In forced colours mode the block has a 1 px border in the system CanvasText colour.
---

# EmptyState

A centred block with an icon, a heading, a short explanation and an optional
action, shown in place of a view that has no content. Put the class on a
`<div>` where the list, table or panel would be. The application decides when
to show it; the class needs no JavaScript.

## When to use

- A list, table or dashboard panel has nothing to show yet, or a search or
  filter matched nothing.
- A feature needs setting up before it shows content, or the user has finished
  every item.

Use something else when:

- the content is still loading: use `pathable-loading` or `pathable-skeleton`;
- loading failed or something needs attention now: use `pathable-alert`;
- the view has some content and one section is empty: a sentence of text in
  that section is enough.

## Example

Load the stylesheet once in the application:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-empty-state pathable-empty-state--no-results">
  <svg
    class="pathable-empty-state__icon"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
    />
  </svg>
  <h2 class="pathable-empty-state__heading">No matching results</h2>
  <p class="pathable-empty-state__body">
    Try changing your search terms or filters.
  </p>
  <a href="/resources" class="pathable-empty-state__action pathable-button">
    Clear all filters
  </a>
</div>
```

## Variants

Add at most one modifier class to `pathable-empty-state`. The kind changes
only the icon colour; pick it by why the view is empty.

| Axis | Value            | Class                                  | What it is for                        |
| ---- | ---------------- | -------------------------------------- | ------------------------------------- |
| kind | `default`        | none                                   | Muted icon, no particular reason      |
| kind | `no-data`        | `pathable-empty-state--no-data`        | Nothing has been added yet; link icon |
| kind | `no-results`     | `pathable-empty-state--no-results`     | A search or filter matched nothing    |
| kind | `setup-required` | `pathable-empty-state--setup-required` | Setup must happen first; accent icon  |
| kind | `completed`      | `pathable-empty-state--completed`      | Every item is done; success icon      |

## Tokens

| What                           | Token                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| Padding                        | `--pathable-space-8`, `--pathable-space-4`                                                  |
| Padding, narrow viewport       | `--pathable-space-6`, `--pathable-space-2`                                                  |
| Gap between children           | `--pathable-space-3`                                                                        |
| Extra space above action       | `--pathable-space-2`                                                                        |
| Body and default icon colour   | `--pathable-color-text-muted`                                                               |
| Heading colour                 | `--pathable-color-text`                                                                     |
| Heading typeface, size, weight | `--pathable-font-heading`, `--pathable-font-size-heading-md`, `--pathable-font-weight-bold` |
| Body size, line height         | `--pathable-font-size-body-sm`, `--pathable-font-line-height-body`                          |
| No-data icon colour            | `--pathable-color-link`                                                                     |
| No-results icon colour         | `--pathable-color-status-warning-text`                                                      |
| Setup-required icon colour     | `--pathable-color-accent`                                                                   |
| Completed icon colour          | `--pathable-color-success`                                                                  |

The pixel sizes in the guarantees are those of the default theme. A theme that
changes these tokens changes them.

## Composition

- `pathable-empty-state__icon` goes on an `<svg>` drawn in `currentColor`, so
  the kind colour reaches it. It is decorative: set `aria-hidden="true"`.
- `pathable-empty-state__heading` goes on a heading element at the level that
  fits the page outline.
- `pathable-empty-state__body` goes on a `<p>` of one or two sentences.
- `pathable-empty-state__action` is optional. Put it on the one link or button
  that resolves the empty state, together with `pathable-button`. The button
  brings a 0.5rem right margin, which sets the action 4px left of centre.
- Keep the children in that order. The block adds no background; place it on
  the page or inside the `pathable-card` or panel that would hold the content.
- The block is as wide as its container. Its padding shrinks on a narrow
  viewport, not in a narrow container.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Accessibility. Hide the icon with `aria-hidden="true"`; the heading and body
  carry the meaning. If the empty state replaces content after a search or
  filter, announce the change, for example by moving focus to the heading or
  through a live region.
- The content: a short heading and a body of no more than two or three lines,
  since all text in the block is centred.
- Choosing the kind, and not relying on the icon colour to explain it.
- Layout around the block, and the action's destination or behaviour.
