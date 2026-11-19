---
name: Container
slug: container
kind: static
summary: A full-width block that centres its content, caps its width and adds equal horizontal gutters.
styles-class: pathable-container
variants:
  - axis: width
    default: default
    values: [default, standard, wide, full]
guarantees:
  - id: max-width
    status: unverified
    claim: The container is at most 1024 px wide by default and with standard, at most 1280 px with wide, and as wide as its parent with full, gutters included.
  - id: centred
    status: unverified
    claim: When its parent is wider than its maximum width, the container is centred, with equal space on its left and right.
  - id: gutters
    status: unverified
    claim: The container has 24 px of padding on its left and right at every width and viewport, and none on its top and bottom.
  - id: fills-parent
    status: unverified
    claim: Below its maximum width the container fills its parent's width exactly, with its gutters inside that width, so the container itself is never wider than a parent at least 48 px wide (twice the gutter).
  - id: custom-properties
    status: unverified
    claim: Setting --pathable-container-max-width or --pathable-container-gutter-x on the container sets its maximum width or its left and right padding to that value.
---

# Container

A full-width block that centres its content, caps its width and adds equal
horizontal gutters. Put the class on a block element, such as a `<div>`,
`<main>` or `<section>`. It adds no role, no background and no vertical
spacing.

## When to use

- The readable column of a page: wrap the content of `<main>`, a header or a
  footer so it lines up across the page.
- A full-bleed band, such as a coloured section, whose content should still
  line up with the page column: put the container inside the band.

Use something else when:

- the page is an application with navigation, a top bar and a content area:
  use `pathable-app-shell`;
- the content needs vertical spacing between blocks: put a `pathable-stack`
  inside the container;
- two regions sit side by side: put a `pathable-split` or
  `pathable-sidebar-layout` inside the container.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<main class="pathable-container">
  <div class="pathable-stack">
    <h1>Resources</h1>
    <p>Guides and tools for requesting workplace accommodations.</p>
  </div>
</main>
```

## Variants

Add at most one width modifier to `pathable-container`.

| Axis  | Value      | Class                          | What it is for                                  |
| ----- | ---------- | ------------------------------ | ----------------------------------------------- |
| width | `default`  | none                           | At most 1024 px, for content pages              |
| width | `standard` | `pathable-container--standard` | At most 1024 px, the same as the default        |
| width | `wide`     | `pathable-container--wide`     | At most 1280 px, for data tables and dashboards |
| width | `full`     | `pathable-container--full`     | The parent's full width, keeping the gutters    |

The maximum width includes the gutters, so the content box is at most 976 px
by default and 1232 px with `wide`.

For another width, set `--pathable-container-max-width` on the container. For
other gutters, set `--pathable-container-gutter-x`. Both inherit, so a nested
container without a modifier takes the outer container's values.

## Tokens

| What                  | Token                            |
| --------------------- | -------------------------------- |
| Maximum width         | `--pathable-container-max-width` |
| Left and right gutter | `--pathable-container-gutter-x`  |
| Default gutter        | `--space-24`                     |

The 24 px gutter is the default theme's figure. The 1024 px and 1280 px
widths are fixed values in the stylesheet, not theme tokens.

## Composition

- Any content can go inside. The container is one block; use
  `pathable-stack`, `pathable-split` or `pathable-sidebar-layout` inside it
  to arrange the content.
- It needs a parent that is a normal block or full-width flex or grid item.
  Inside a flex row the container's `width: 100%` is a basis that the row
  can shrink.
- It sets its own left and right margins to `auto` to centre itself, and
  those rules come after the margin utilities in the stylesheet: a left or
  right margin utility on the container has no effect, while top and bottom
  margin utilities, such as `pathable-margin-top-2`, work.
- The gutter does not change with the viewport. For a full-bleed band, put
  the background on an outer element and the container inside it; the band
  then spans the page and the content lines up with other containers.
- The container has no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Landmarks. Use `<main>`, `<header>` or `<footer>` where they fit; the class
  adds no role.
- Vertical spacing above, below and inside the container.
- Choosing one width per page and using it for the header, content and
  footer so their edges line up.
- Content wider than the container, such as a wide table: give it its own
  horizontal scrolling.
