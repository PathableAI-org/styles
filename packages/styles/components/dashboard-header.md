---
name: DashboardHeader
slug: dashboard-header
kind: static
summary: The top of a dashboard or working page, with an optional breadcrumb trail, the page title, a context line, actions and a short description.
styles-class: pathable-dashboard-header
variants:
  - axis: layout
    default: default
    values: [default, stacked]
  - axis: density
    default: default
    values: [default, compact]
guarantees:
  - id: region-spacing
    status: unverified
    claim: The header stacks its regions in a column with a 1.5rem gap and 3rem top and bottom padding and no side padding; compact uses a 1rem gap and 2rem padding.
  - id: title-row
    status: unverified
    claim: In the title row the title grows to fill the free space and can shrink below its content width, the context and actions keep their natural width, and items that do not fit on one line wrap to the next.
  - id: stacked
    status: unverified
    claim: With the stacked modifier, or at a viewport of 640 px or less, the title, context and actions stack vertically in source order.
  - id: narrow
    status: unverified
    claim: At a viewport of 640 px or less the title is 1.5rem instead of 2rem, which is 24 px instead of 32 px at a 16 px root font size, the padding is 2rem, and the actions region is full width with each child growing to fill the space left on its line.
  - id: action-target
    status: unverified
    claim: Every pathable-button in the actions region is at least 44 by 44 px.
  - id: description-measure
    status: unverified
    claim: The description is at most 40rem wide, at 0.875rem (14 px at a 16 px root) with a line height of 1.5, in the muted text colour.
  - id: scales-with-root
    status: unmet
    claim: The breadcrumb, title, context and description font sizes follow the root font size, so at a 200% root font size each size doubles.
  - id: context-nowrap
    status: unverified
    claim: The context line never wraps and never shrinks.
  - id: custom-properties
    status: unmet
    claim: Setting --pathable-dashboard-header-gap on the header changes the space between its regions, and setting --pathable-dashboard-header-max-width limits its width.
---

# DashboardHeader

The top of a dashboard or working page, with an optional breadcrumb trail, the
page title, a context line, actions and a short description. Put the class on a
`<div>` or `<header>` at the top of the main content. It is not interactive: it
lays out the links and buttons placed in it and gives only buttons a minimum
size.

## When to use

- The title area of an application screen that has a page title and one or
  more page-level actions, such as "Export" or "Add program".

Use something else when:

- the page is about one person, organisation or resource and should show its
  picture and details: use `pathable-record-header`;
- the page is a landing page that needs a photograph and one call to action:
  use `pathable-hero`;
- you need a full breadcrumb component on its own: use `pathable-breadcrumb`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-dashboard-header">
  <nav
    class="pathable-dashboard-header__breadcrumb pathable-padding-1"
    aria-label="Breadcrumb"
  >
    <a class="pathable-link" href="/">Home</a>
    <a class="pathable-link" href="/programs">Programs</a>
    <span aria-current="page">Employment Pathways</span>
  </nav>
  <div class="pathable-dashboard-header__row">
    <h1 class="pathable-dashboard-header__title">Employment Pathways</h1>
    <span class="pathable-dashboard-header__context">Active · Q4 2026</span>
    <div class="pathable-dashboard-header__actions">
      <button class="pathable-button pathable-button--outline" type="button">
        Export
      </button>
      <button class="pathable-button" type="button">Add program</button>
    </div>
  </div>
  <p class="pathable-dashboard-header__description">
    Track programs across all regions.
  </p>
</div>
```

## Variants

Add at most one modifier class from each axis to `pathable-dashboard-header`.
The two axes combine freely.

| Axis    | Value     | Class                                | What it is for                                       |
| ------- | --------- | ------------------------------------ | ---------------------------------------------------- |
| layout  | `default` | none                                 | Actions beside the title while they fit              |
| layout  | `stacked` | `pathable-dashboard-header--stacked` | Actions always below the title, at every width       |
| density | `default` | none                                 | 3rem padding above and below, 1.5rem between regions |
| density | `compact` | `pathable-dashboard-header--compact` | 2rem padding, 1rem between regions                   |

## Tokens

| What                                    | Token                                                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Body font (breadcrumb, context, text)   | `--pathable-font-body`                                                                                       |
| Title font                              | `--pathable-font-heading`                                                                                    |
| Title size, wide and narrow             | `--pathable-font-size-display-lg`, `--pathable-font-size-heading-lg`                                         |
| Title weight                            | `--pathable-font-weight-bold`                                                                                |
| Breadcrumb size                         | `--pathable-font-size-caption-md`                                                                            |
| Context and description size            | `--pathable-font-size-body-sm`                                                                               |
| Description line height                 | `--pathable-font-line-height-body`                                                                           |
| Title colour                            | `--pathable-color-text`                                                                                      |
| Breadcrumb, context, description colour | `--pathable-color-text-muted`                                                                                |
| Spacing                                 | `--pathable-space-1`, `--pathable-space-2`, `--pathable-space-3`, `--pathable-space-4`, `--pathable-space-6` |

The pixel figures in the guarantees are those of the default theme, where the
spacing tokens 1, 2, 3, 4 and 6 are 0.5, 1, 1.5, 2 and 3rem. A theme that
changes these tokens changes them. The header has no custom properties of its
own.

## Composition

- `pathable-dashboard-header__breadcrumb` is the optional trail, first in the
  header. Each direct child after the first gets a "/" separator before it, in
  the muted colour at half opacity. Long trails wrap. At a viewport of 640 px
  or less the trail clips anything that overflows it. The focus outline of its
  links should stay visible, but today that clipping cuts off every side of the
  outline that touches the trail's edge. Give the trail itself padding of at
  least 0.25rem on every side, as the example does with `pathable-padding-1`,
  or give the links an inset focus style. Padding on the links does not help:
  their outline is still drawn outside the trail's edge. The padding applies at
  every width: `pathable-padding-1` is 0.5rem, so the example's trail text
  starts 0.5rem in from the title and the trail is 1rem taller. An inset focus
  style avoids both.
- `pathable-dashboard-header__row` holds the title, the context and the
  actions, spread across the row with a 1.5rem gap and aligned to the top.
- `pathable-dashboard-header__title` is the page title; use the page's `<h1>`.
  It wraps long titles.
- `pathable-dashboard-header__context` is a short status line after the title,
  such as "Draft · Q2 2026". The title takes the free space, so on a wide row
  the context sits at the far end, next to the actions. Keep it short: it does
  not wrap.
- `pathable-dashboard-header__actions` holds the page actions in a wrapping row
  with a 1rem gap. Each `pathable-button` keeps its own 0.5rem right margin, so
  buttons appear 1.5rem apart and the last one stops 0.5rem short of the
  header's end. The region makes each `pathable-button` an inline flex box of
  at least 44 by 44 px; it does not size links or other controls. At 640 px
  or less each child grows to fill the space left on its line; below 30em
  every `pathable-button` is full width, so the buttons take one row each.
- `pathable-dashboard-header__description` is an optional paragraph after the
  row.
- In forced-colours mode the header gets a 1 px bottom border and 2rem bottom
  padding.
- The header is full width and adds no side padding; place it inside the page
  container.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The custom-properties guarantee is unmet: it is the two custom properties the
component's source describes; the compiled stylesheet does not read either, so
setting them does nothing.

The scales-with-root guarantee is unmet. Today the font-size tokens are fixed
px values, so the header's text sizes do not follow the user's default font
size.

## The consumer owns

- Links in the breadcrumb. The header styles the trail's size, colour and
  separators but not its links; add `pathable-link` to each, or they keep the
  browser's default link colours.
- Breadcrumb semantics: use a `<nav>` with an accessible name, and mark the
  current page with `aria-current="page"`. Some screen readers announce the
  "/" separators.
- The heading level: the title should be the page's only `<h1>`.
- Buttons and their labels, and their order in the actions region.
- The context text. If it states a status, say it in words, not colour.
