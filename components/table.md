---
name: Table
slug: table
kind: static
summary: A data table with a shaded header row, bordered cells and a caption, for rows of values that share the same column headings.
styles-class: pathable-table
variants:
  - axis: border
    default: default
    values: [default, borderless]
  - axis: density
    default: default
    values: [default, compact]
  - axis: rows
    default: default
    values: [default, striped]
  - axis: layout
    default: default
    values: [default, stacked, stacked-header]
  - axis: header
    default: default
    values: [default, sticky-header]
guarantees:
  - id: type
    claim: The table text is Nunito at 0.99rem with a line height of 1.6 in dark blue (#00365c), and header cells have a line height of 1.4.
  - id: cell-box
    claim: Cells have a 1 px solid #00365c border, collapsed so neighbouring cells share one line, and 0.5rem of padding above and below and 1rem left and right.
  - id: header-surface
    claim: Header cells have a #eef0f4 background and body cells a white background, with the text in both at a contrast of at least 12:1.
  - id: table-margin
    claim: The table has a 1.25rem margin above and below and none at the sides, and its text is left aligned.
  - id: caption
    claim: The caption is left aligned Nunito bold at 0.93rem with 0.75rem of space between it and the table.
  - id: borderless
    claim: With the borderless modifier, cells have no left or right border, header cells have no top border, and header cells have a white background instead of #eef0f4.
  - id: compact
    claim: With the compact modifier, cells have 0.25rem of padding above and below and 0.75rem left and right.
  - id: striped
    claim: With the striped modifier, the cells of every odd body row have a #f6f8f9 background, with the text at a contrast of at least 11:1.
  - id: stacked
    claim: At a viewport narrower than 480 px, with the stacked modifier, each row is a block and each cell is on its own line preceded by the text of its data-label attribute.
  - id: stacked-header
    claim: At a viewport narrower than 480 px, with the stacked-header modifier, each row is a block as with stacked, and the row header is shown as a heading above the other cells of its row.
  - id: sticky-header
    claim: With the sticky-header modifier, the header cells stay at the top of the scrolling area while the body rows scroll beneath them.
  - id: scroll-container
    claim: The scrollable container scrolls horizontally when its table is wider than it, and the table inside is never narrower than its content.
  - id: scrollable-focus
    claim: The scrollable container is reachable by keyboard and shows a visible focus indicator when it has focus.
---

# Table

A data table with a shaded header row, bordered cells and a caption, for rows
of values that share the same column headings. Put the class on a `<table>`.
It adds no role: the native table semantics, with a `<caption>` and header
cells that have a `scope`, are what assistive technology reads.

## When to use

- Records the reader compares across columns, such as participants with their
  case worker, next appointment and status.
- A small set of figures that belong with the text around them, using the
  borderless modifier.

Use something else when:

- the rows are a feed of events with status and actions: use
  `pathable-activity-list`;
- the data is a layout, not values with headings: use a layout component such
  as `pathable-grid`;
- the reader needs to sort the columns: sorting needs JavaScript and is not
  part of this component.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: default -->

## States

Each state is complete markup for one use of the table. Copy the one closest
to what you need.

<!-- examples -->

## Variants

Add at most one modifier class from each axis to `pathable-table`. The
modifiers from different axes combine, such as `pathable-table--compact` with
`pathable-table--striped`. The scrollable container is a separate element that
wraps the table; see Composition.

| Axis    | Value            | Class                            | What it is for                                             |
| ------- | ---------------- | -------------------------------- | ---------------------------------------------------------- |
| border  | `default`        | none                             | Bordered cells and a shaded header row                     |
| border  | `borderless`     | `pathable-table--borderless`     | No side borders, for a table that reads as text            |
| density | `default`        | none                             | 0.5rem by 1rem cell padding                                |
| density | `compact`        | `pathable-table--compact`        | 0.25rem by 0.75rem cell padding, for dense data            |
| rows    | `default`        | none                             | Every body row has a white background                      |
| rows    | `striped`        | `pathable-table--striped`        | Shaded odd rows, to follow a row across many columns       |
| layout  | `default`        | none                             | The table keeps its columns at every width                 |
| layout  | `stacked`        | `pathable-table--stacked`        | Rows become blocks on a phone, each cell labelled          |
| layout  | `stacked-header` | `pathable-table--stacked-header` | Rows become blocks on a phone, the row header as a heading |
| header  | `default`        | none                             | The header row scrolls away with the body                  |
| header  | `sticky-header`  | `pathable-table--sticky-header`  | The header row stays in view while the body rows scroll    |

## Composition

- Give every table a `<caption>` that names the data, such as "Upcoming
  appointments by participant". It is the table's accessible name. If a
  visible caption does not suit the design, hide it with `pathable-sr-only`;
  do not leave it out.
- Put column headers in a `<thead>` as `<th scope="col">` and the first cell
  of each body row as `<th scope="row">`. The remaining cells are `<td>`.
- A header cell of a row is also shaded, which is why a row header looks like a
  column header; keep the row header to the one cell that names the row.
- Stacked tables: put a `data-label` attribute on every `<th>` and `<td>` of
  the body, with the text of its column heading. The stacked layout shows that
  text above each value.
- Scrollable container: wrap the table in
  `<div class="pathable-table-container--scrollable" tabindex="0">`. The
  container scrolls a table that is wider than it and, with `tabindex="0"`, a
  keyboard user can focus it and scroll it.
- The table has no element classes. Put other components, such as buttons or
  links, inside cells as normal.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour.

The rem figures scale with the root font size. The pixel and rem figures on
this page are those of the default theme.

## The consumer owns

- The caption, the header cells and their `scope`: the table's meaning for
  assistive technology.
- The `data-label` text of every cell in a stacked table.
- The `tabindex="0"` on a scrollable container.
- Sorting, loading states and row actions: these need script or markup this
  component does not provide.
- The data: realistic, short cell text, and the date and name formats.
  Personal data in a table needs the same minimisation as anywhere else.
