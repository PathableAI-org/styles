---
name: Icon list
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
    claim: The list has no bullets, no margin and no left padding, a body font of 1rem (the sm size, 16 px at a 16 px root) with 1.6 line height, and a maximum width of 72ex.
  - id: item-row
    claim: Each item is a flex row, with 12 px of space above every item except the first.
  - id: content-gap
    claim: The content block has a left padding of 0.4rem (6.4 px at a 16 px root) between it and the icon, and its first and last children have no margin at the top and bottom.
  - id: long-words
    claim: The content block can shrink below its longest word and breaks a word too long for it, so an item never scrolls sideways under enlarged text on a narrow screen.
  - id: icon-box
    claim: A pathable-icon inside pathable-icon-list__icon is a block 1.5rem square.
  - id: title
    claim: The class pathable-icon-list__title sets a heading in the heading typeface at regular weight (400) and the body size with 1.2 line height, no bottom margin, and 8 px above the element that follows it.
  - id: size-lg
    claim: The class pathable-icon-list--size-lg makes the icon 2.25rem square, the content text 1.5rem (the lg size) and the gap between icon and content 0.6rem, and removes the 72ex maximum width.
---

# Icon list

A list whose items each start with an icon and are followed by a block of text, for short lists where every item has a status or category. Put the
class on a `<ul>` of `pathable-icon-list__item` elements. The list adds no
roles: give it a name yourself.

## When to use

- A short checklist where every item has a status icon, such as the documents
  a participant has handed in.
- A set of tips or steps where each point has its own icon and perhaps a
  short title.

Use something else when:

- the items are ordered steps of a process: use `pathable-process-list`;
- the list has no icons: use a plain `<ul>`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- css-files -->

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
| size | `size-lg` | `pathable-icon-list--size-lg` | A 2.25rem icon beside 1.5rem text   |

The icon takes the text colour of the list. To colour the icons, set `color`
on `pathable-icon-list__icon`.

## Composition

- `pathable-icon-list__item`: one item, a flex row. Make it a `<li>`.
- `pathable-icon-list__icon`: holds the icon. Put an `<svg>` with the
  `pathable-icon` class inside it, with `aria-hidden="true"` and
  `role="img"`, and a `<use>` that references a symbol of the sprite, as
  described on the Icon page.
- `pathable-icon-list__content`: the text beside the icon. It can be plain
  text, a `<strong>` lead-in, or a title followed by paragraphs.
- `pathable-icon-list__title`: an optional heading at the top of the content.
- A `<ul>` or `<ol>` inside the content keeps its own markers.
- The content is markup the application writes. The package does not escape
  or sanitise it.
- JavaScript is not part of this component. Nothing here filters, copies or
  toggles items.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour.

## The consumer owns

- Accessibility. Give the list a name with `aria-label`, or with
  `aria-labelledby` pointing at a visible heading, and use `role="list"` on the
  `<ul>`. Hide each icon with `aria-hidden="true"`, and say what the icon shows in the text: colour or shape is never the only
  cue.
- Serving the sprite file, and the URL it is served from.
- The colour contrast of the icons and the text.
- The text of each item and any headings in it, and their level.
