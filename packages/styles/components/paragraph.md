---
name: Paragraph
slug: paragraph
kind: static
summary: A paragraph style that limits the line length to a readable measure and puts one line of space between a paragraph and its neighbours.
styles-class: pathable-paragraph
variants: []
guarantees:
  - id: measure
    status: unverified
    claim: The paragraph is at most 68ex wide and is narrower when its container is.
  - id: line-height
    status: unverified
    claim: The line height is 1.6 times the font size when no other class on the element sets one.
  - id: spacing
    status: unverified
    claim: The paragraph has no bottom margin, no top margin when it is the first child, a 1em top margin after a preceding sibling, and gives the element after it a 1em top margin.
  - id: font-inherited
    status: unverified
    claim: The class sets no typeface, size, weight or colour, so the text takes them from its parent or from another class on the element.
---

# Paragraph

A paragraph style that limits the line length to a readable measure and puts
one line of space between a paragraph and its neighbours. Put the class on a
`<p>`. It adds no role and no semantics.

## When to use

- Each paragraph of body copy in application UI, where you mark up paragraphs
  one by one.
- Together with `pathable-text` on the same `<p>`, which sets the typeface,
  size and colour that this class leaves alone.

Use something else when:

- you control the container but not each paragraph, such as rendered
  Markdown: wrap it in `pathable-content` to limit the measure, or in
  `pathable-prose` to also style its headings and lists;
- the text is the lead under a page title: use `pathable-intro`;
- the text is a heading: use `pathable-heading` or `pathable-display`;
- you need only the font role or tone: use `pathable-text` alone.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div>
  <p class="pathable-paragraph pathable-text pathable-text--body">
    Your coach reviews each module within two working days.
  </p>
  <p class="pathable-paragraph pathable-text pathable-text--body">
    You will get an email when a review is ready.
  </p>
</div>
```

## Variants

This component has no variants.

## Tokens

None. The measure, line height and spacing are fixed in the stylesheet, and a
theme does not change them.

## Composition

- Put text and inline content inside, such as links, `<strong>` and
  `pathable-text-highlight` spans. There are no element classes.
- The measure is in `ex`, so it follows the paragraph's own font size: larger
  text gives a wider paragraph.
- When `pathable-text` is on the same element, its line height (1.5 for body
  in the default theme) wins over this class's 1.6. The measure and spacing
  still apply.
- The 1em top margin given to the element after a paragraph applies to any
  element, such as a heading or a list. A rule of equal weight on that element
  can replace it.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Accessibility. Use a real `<p>` element so the paragraph is announced as one.
- The typeface, size and colour, for example with `pathable-text`.
- Breaking long text into short paragraphs, and not centring paragraphs that
  wrap to more than three lines.
- The layout around the paragraphs.
