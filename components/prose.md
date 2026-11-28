---
name: Prose
slug: prose
kind: static
summary: A container that styles the plain headings, paragraphs, lists and tables inside it, for long-form text that carries no classes of its own.
styles-class: pathable-prose
variants: []
guarantees:
  - id: base-type
    claim: The container sets the body typeface, Nunito, at 1rem (the sm size) with a line height of 1.6 for the text inside it.
  - id: paragraph-measure
    claim: A paragraph that is a direct child has a line height of 1.6 and is at most 68ex wide, and longer text wraps inside that width.
  - id: heading-scale
    claim: Direct-child headings h1 to h6 are 1.5rem, 1.13rem, 1.13rem, 1rem, 0.88rem and 0.75rem (the lg, md, md, sm, 2xs and 3xs sizes), with a margin of 0 and a line height of 1.4, and an h6 is uppercase with 0.025em letter spacing.
  - id: heading-weight
    claim: Direct-child headings h1 to h5 are set at weight 400, the normal weight.
  - id: block-rhythm
    claim: A direct child that follows another has a top margin of 1em, and a heading that follows another child has a top margin of 1.5em.
  - id: list-rules
    claim: A list that is a direct child has a 1em top and bottom margin, 3ch of left padding and a line height of 1.6, and its items have a 0.25em bottom margin and a width of at most 68ex.
  - id: table-rules
    claim: A table that is a direct child has the body typeface at 1rem (the sm size), collapsed borders and a 1.25rem top and bottom margin.
  - id: heading-typeface
    claim: A direct-child heading is set in the heading typeface at weight 400, Fredoka Regular.
---

# Prose

A container that styles the plain headings, paragraphs, lists and tables inside it, for long-form text that carries no classes of its own. Put the class on one element, such as a `<section>` or `<article>`, and write ordinary HTML inside it. The rules reach the container's direct children, so wrapping an element in a `<div>` inside the container removes its styling.

## When to use

- Body text that a person or a content system writes without marking up each
  element, such as a participant guide, a help article or rendered Markdown.
- A page of running text that mixes headings, paragraphs, lists and a table
  and needs consistent spacing between them.

Use something else when:

- the content is a component, such as a card or an alert: give it its own
  component class;
- you need a single list with spacing and nothing else: use `pathable-list`;
- you need only a paragraph or an intro: use `pathable-paragraph` or
  `pathable-intro`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- css-files -->

<!-- example: article -->

## States

Each state is complete markup for one use of the container. Copy the one
closest to what you need.

<!-- examples -->

## Variants

`pathable-prose` has no modifier classes. Sortable table headers need
JavaScript and are not part of this component.

The headings h1 to h5 have weight 400 (normal). The sizes, line heights and
spacing are relative to the container's font size.

## Composition

- Write plain elements as direct children: `<h1>` to `<h6>`, `<p>`, `<ul>`,
  `<ol>` and `<table>`. They take the container's rules without a class.
- An introduction paragraph can carry `pathable-intro`.
- A list placed directly in the container takes the prose list rules, not
  only the `pathable-list` rules. `pathable-card-group`,
  `pathable-collection` and `pathable-process-list` placed in a container are
  affected: their own list and card spacing is kept, as their `inside-prose`
  guarantees state. An unstyled `pathable-list` (`pathable-list--unstyled`)
  keeps no markers, indent, outer margin or item width limit, as the list's
  `inside-prose` guarantee states.
- Give a table a `<caption>`, a `<thead>` and a `<tbody>`, and `scope` on its
  header cells. A table with `pathable-table` classes keeps those classes' own
  styling.
- Nest lists inside the `<li>` they belong to. Each level keeps the prose list
  spacing.
- Keep headings in order, with one `<h1>` for the page.

## Guarantees

The guarantees are the list in the front matter at the top of this page.

The 68ex limit applies to each paragraph and list item, not to the container,
so the container can be as wide as its parent.

## The consumer owns

- The heading levels and their order, and a single `<h1>` per page.
- Writing real lists, headings and tables rather than styled `<div>`s.
- A caption and `scope` attributes on tables, and keeping them short enough to
  read at the widths you support.
- The width of the container and the space around it.
- The wording of the content, in plain language.
