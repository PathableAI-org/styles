---
name: DataVisualization
slug: data-visualization
kind: static
summary: A figure that frames a consumer-drawn chart with a caption holding a title and a one-sentence takeaway, and an optional data table beside it.
styles-class: pathable-data-visualization
variants: []
guarantees:
  - id: block-class
    status: unmet
    claim: The pathable-data-visualization class is not in the stylesheet yet, so a figure with it has only the browser's default figure margins.
  - id: figure-reset
    status: unmet
    claim: The figure has no side margin and is as wide as its container, and a pathable-data-visualization__chart never overflows it, whether it is an image or an inline SVG.
  - id: caption-parts
    status: unmet
    claim: The caption shows the title above the takeaway, each on its own line, with the title in bold text and the takeaway in the normal body size, left aligned.
  - id: caption-contrast
    status: unmet
    claim: The title and takeaway have a contrast ratio of at least 4.5 to 1 against the page background.
  - id: data-table-spacing
    status: unmet
    claim: A details element that is the last child of the figure is 16 px below the chart, and its summary shows a visible focus ring when focused.
---

# DataVisualization

A figure that frames a consumer-drawn chart with a caption holding a title and
a one-sentence takeaway, and an optional data table beside it. Put the class
on a `<figure>`. The design system does not draw charts: your application
draws the chart as an inline SVG or supplies it as an image.

This page is the target for the next release. The component has no code in the
stylesheet yet: none of its classes exist, and every guarantee below is unmet.
The markup in the examples is the markup to write now, so it needs no change
when the classes arrive.

## When to use

- A chart of a trend, such as appointments attended each month or open
  cases by week, that a case worker reads on a dashboard or in a report.
- Any image of data that needs a caption, a text alternative and the figures
  behind it.

Use something else when:

- the page shows one number: use `pathable-kpi-grid`;
- the data is a list of records that the reader compares or sorts: use
  `pathable-table`;
- the picture is a screenshot of the product: use `pathable-screenshot-frame`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: with-data-table -->

## States

Each state is complete markup for one use of the figure. Copy the one closest
to what you need.

<!-- examples -->

## Variants

The figure has no modifier classes.

## Composition

- `pathable-data-visualization__chart`: the chart itself, on an `<svg>` or an
  `<img>`. It scales down to the width of the figure and keeps its aspect
  ratio.
- `pathable-data-visualization__caption`: the `<figcaption>`, the first child of the figure, above the chart. It holds the
  title and the takeaway.
- `pathable-data-visualization__title`: what the chart shows, in a few words.
- `pathable-data-visualization__takeaway`: one sentence that says what the
  reader should conclude, with the figures.
- The data table: a `<details>` element with a `<summary>` of "View data
  table", holding a `pathable-table` with a `<caption>` that names it. It is a
  native element and needs no JavaScript. Put it last in the figure, after the chart. Leave
  the table outside a `<details>` when the figures are what the reader came
  for.
- Charts that need scripts, such as hover tooltips or zoom, are not part of
  this component. Draw them with a library of your choice and keep the
  markup above around them.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

Every guarantee here is unmet because the classes are not in the stylesheet
yet. There is no chart colour palette in the package either: the consumer
chooses the colours.

## The consumer owns

- Drawing the chart, and its colours. No colour is the only cue: label the
  marks directly on the chart, as the examples do, or add a shape, pattern or
  text label, and check that the marks have a contrast ratio of at least 3 to 1
  against their background.
- The text alternative. An inline SVG has `role="img"` and an accessible name
  and description, from its own `<title>` and `<desc>` through
  `aria-labelledby`. An image has `alt` text that gives the takeaway and the
  main figures. Both state what the chart concludes, not only what kind of
  chart it is.
- The data table, so that the figures are available to a reader who cannot
  see the chart, with a `<caption>` that names it.
- The title and takeaway, written from the data, and literal `id` values that
  are unique on the page.
- Dates, units and any data minimisation for sensitive records.
