---
name: Content
slug: content
kind: static
summary: A container that limits every paragraph and list inside it to a readable line length.
styles-class: pathable-content
variants: []
guarantees:
  - id: measure
    status: unverified
    claim: Every `<p>`, `<ul>` and `<ol>` inside the container, at any depth, is at most 68ex wide unless a more specific rule sets its width.
  - id: container-unstyled
    status: unverified
    claim: The container itself gets no width, margin, padding, typeface, size or colour.
  - id: others-unlimited
    status: unverified
    claim: Headings, tables, images, block quotes and other elements inside the container are not limited in width.
---

# Content

A container that limits every paragraph and list inside it to a readable line
length. Put the class on the `<div>`, `<article>` or `<main>` that holds the
text. It adds no role and no semantics.

## When to use

- Around a block of body copy whose paragraphs and lists you do not mark up
  one by one, such as rendered Markdown or text from a content system.
- In a wide layout, to stop lines of text growing too long to read.

Use something else when:

- the text also needs its headings, lists and spacing styled: use
  `pathable-prose`;
- you mark up each paragraph yourself and also want space between them: put
  `pathable-paragraph` on each `<p>`;
- you need a typeface, size or tone for the text: use `pathable-text`;
- the text is the lead under a page title: use `pathable-intro`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<article class="pathable-content">
  <h2 class="pathable-heading pathable-heading--level-2">About this course</h2>
  <p>The course covers workplace safety in three short modules.</p>
  <ul>
    <li>Hazard awareness</li>
    <li>Safe lifting</li>
  </ul>
</article>
```

## Variants

This component has no variants.

## Tokens

None. The measure is fixed in the stylesheet, and a theme does not change it.

## Composition

- Put any block content inside. Only `<p>`, `<ul>` and `<ol>` are limited;
  everything else, and the container itself, keeps its full width.
- The limit is in `ex`, so it follows each element's own font size.
- The limit wins over the 88ex of `pathable-intro`, so an intro paragraph
  inside the container is limited to 68ex too.
- Lists inside accordions are limited too; put the accordion outside the
  container if it must run full width.
- The container sets no spacing between its children and no font. Add
  `pathable-paragraph` or `pathable-text` to the elements inside, or use
  `pathable-prose`, if they need it.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Accessibility. Choose the container element for its meaning, such as
  `<article>` or `<main>`, and keep a logical heading order inside it.
- The typeface, size, colour and spacing of the text inside.
- Breaking long text into short paragraphs.
- The layout around the container.
