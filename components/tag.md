---
name: Tag
slug: tag
kind: static
summary: A small inline label in white uppercase text on a dark grey background, for a short word or phrase such as a category or state.
styles-class: pathable-tag
variants:
  - axis: size
    default: default
    values: [default, big]
guarantees:
  - id: font-size
    claim: The tag text is uppercase Nunito at 0.88rem (the 2xs size) by default and 1rem (the sm size) at big, which is 14.08 px and 16 px at a 16 px root font size.
  - id: box
    claim: The tag has 1 px of padding above and below, 0.5rem of padding left and right, and 2 px rounded corners, at both sizes.
  - id: colour
    claim: 'The text is white on a #565c65 background, a contrast of 6.74:1, at both sizes and in every theme.'
  - id: trailing-margin
    claim: A tag has a 0.25rem right margin, which is 0 when the tag is the only element of its element type among its siblings.
  - id: inline-wrap
    claim: Outside a flex or grid container the tag is inline, so long text wraps onto further lines with the text around it inside a narrow container instead of overflowing it.
---

# Tag

A small inline label in white uppercase text on a dark grey background, for a
short word or phrase such as a category or state. Put the class on a `<span>`.
It is not interactive: the class adds no role, no tab stop and no accessible
name beyond its text.

## When to use

- A short label beside a heading, a table cell value or a list item, such as
  "New", "Draft" or "Pending".
- Several labels in a row, such as the categories of a resource.

Use something else when:

- the label performs an action or applies a filter: use a `<button>` with
  `pathable-button`, since a tag cannot be focused or pressed;
- the state needs a status colour, such as success or error: the tag has one
  colour only; use `pathable-alert` for a message;
- the label is a whole sentence: write it as text, not a tag.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: default -->

## States

Each state is complete markup for one use of the tag. Copy the one closest to
what you need.

<!-- examples -->

## Variants

Add at most one modifier class to `pathable-tag`.

| Axis | Value     | Class               | What it is for                            |
| ---- | --------- | ------------------- | ----------------------------------------- |
| size | `default` | none                | 0.88rem text, for most labels             |
| size | `big`     | `pathable-tag--big` | 1rem text, beside larger headings or text |

The big tag changes only the font size; the padding is the same.

The tag sets no line height, so its height follows the line height of the text
around it.

## Composition

- Put plain text inside, one to three words. Do not put links, buttons or
  icons inside a tag.
- The text is set in capitals by `text-transform`; write it in normal case in
  the markup so assistive technology reads it as words, not letters.
- The tag is an inline element: it flows with text and wraps with it. In a
  flex row it becomes a block-level flex item: a long label wraps onto several
  lines inside the tag's own box instead of breaking across lines with the
  text around it. Give the row a gap instead of relying on the tag's margin.
- The trailing margin spaces tags that sit side by side. It is removed by the
  `:only-of-type` rule, which looks at the element type, not the class: a tag
  that is the only `<span>` among its siblings has no margin, and a tag next
  to another `<span>` keeps it.
- The element has no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page.

The rem figures scale with the root font size; the pixel figures are those at
a 16 px root.

## The consumer owns

- Accessibility. The tag text is read as part of the surrounding content. If
  the label needs context to make sense, such as "Status: Pending", supply it
  in visible text or in text with `pathable-sr-only`.
- Never relying on the tag alone to convey state: it is the same grey for
  every value, so the words carry the meaning.
- The content: short, meaningful words in normal case.
- Layout around the tag: spacing in a flex row, alignment with a heading and
  wrapping in narrow containers.
