---
name: IconList
slug: icon-list
kind: static
summary: A list whose items each start with an icon and are followed by a block of text, for short lists where every item has a status or category.
styles-class: pathable-icon-list
variants:
  - axis: size
    default: default
    values: [default, size-lg]
guarantees:
  - id: list-reset
    status: unverified
    claim: The list has no bullets, no margin and no left padding, a body font of about 16 px (0.99rem) with 1.6 line height, and a maximum width of 72ex.
  - id: item-row
    status: unverified
    claim: Each item is a flex row, with 12 px of space above every item except the first.
  - id: content-gap
    status: unverified
    claim: The content block has a left padding of about 6 px (0.396rem) between it and the icon, and its first and last children have no margin at the top and bottom.
  - id: icon-box
    status: unmet
    claim: A pathable-icon inside pathable-icon-list__icon is a block 1.5rem square. Today only an svg that also carries the unprefixed icon class gets this size, so a pathable-icon stays at 1em.
  - id: title
    status: unmet
    claim: The class pathable-icon-list__title is not in the stylesheet yet. When it is, it sets a heading in the heading typeface at the body size with 1.2 line height, no bottom margin, and 8 px above the element that follows it.
  - id: size-lg
    status: unmet
    claim: The class pathable-icon-list--size-lg is not in the stylesheet yet. When it is, it makes the icon 2.235rem square, the content text 1.49rem and the gap between icon and content 0.596rem, and removes the 72ex maximum width.
---

# IconList

A list whose items each start with an icon and are followed by a block of text, for short lists where every item has a status or category. Put the
class on a `<ul>` of `pathable-icon-list__item` elements. The list adds no
roles: give it a name yourself.

## When to use

- A short checklist where every item has a status icon, such as the documents
  a participant has handed in.
- A set of tips or steps where each point has its own icon and perhaps a
  short title.

Use something else when:

- the items have a status, a date and an owner the reader scans: use
  `pathable-activity-list`;
- the items are ordered steps of a process: use `pathable-process-list`;
- the list has no icons: use a plain `<ul>`.

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

Add at most one modifier class from the size axis to `pathable-icon-list`.

| Axis | Value     | Class                         | What it is for                      |
| ---- | --------- | ----------------------------- | ----------------------------------- |
| size | `default` | none                          | A 1.5rem icon beside body-size text |
| size | `size-lg` | `pathable-icon-list--size-lg` | A 2.235rem icon beside 1.49rem text |

The size modifier is not in the stylesheet yet; see the `size-lg` guarantee.
The icon takes the text colour of the list. To colour the icons, set `color`
on `pathable-icon-list__icon`.

## Composition

- `pathable-icon-list__item`: one item, a flex row. Make it a `<li>`.
- `pathable-icon-list__icon`: holds the icon. Put an `<svg>` with the
  `pathable-icon` class inside it, as described on the Icon page.
- `pathable-icon-list__content`: the text beside the icon. It can be plain
  text, a `<strong>` lead-in, or a title followed by paragraphs.
- `pathable-icon-list__title`: an optional heading at the top of the content.
  It is not in the stylesheet yet; see the `title` guarantee.
- A `<ul>` or `<ol>` inside the content keeps its own markers.
- The content is markup the application writes. The package does not escape
  or sanitise it.
- JavaScript is not part of this component. Nothing here filters, copies or
  toggles items.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Accessibility. Give the list a name with `aria-label`, or with
  `aria-labelledby` pointing at a visible heading, and use `role="list"` on the
  `<ul>`. Hide each icon with `aria-hidden="true"` and `focusable="false"`,
  and say what the icon shows in the text: colour or shape is never the only
  cue.
- The icon artwork. The examples draw each icon as inline `<path>` data. An
  application can instead use its own SVG sprite through `<use href>`.
- The colour contrast of the icons and the text.
- The text of each item and any headings in it, and their level.
