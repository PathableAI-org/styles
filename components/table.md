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
  - axis: selection
    default: default
    values: [default, selected]
  - axis: empty
    default: default
    values: [default, empty]
  - axis: scroll
    default: default
    values: [default, scrollable]
guarantees:
  - id: type
    status: unverified
    claim: The table text is Nunito at 0.99rem with a line height of 1.6 in dark blue (#00365c), and header cells have a line height of 1.4.
  - id: cell-box
    status: unverified
    claim: Cells have a 1 px solid #00365c border, collapsed so neighbouring cells share one line, and 0.5rem of padding above and below and 1rem left and right.
  - id: header-surface
    status: unverified
    claim: Header cells have a #eef0f4 background and body cells a white background, with the text in both at a contrast of at least 12:1.
  - id: table-margin
    status: unverified
    claim: The table has a 1.25rem margin above and below and none at the sides, and its text is left aligned.
  - id: caption
    status: unverified
    claim: The caption is left aligned Nunito bold at 0.93rem with 0.75rem of space between it and the table.
  - id: borderless
    status: unverified
    claim: With the borderless modifier, cells have no left or right border, header cells have no top border, and header cells have a white background instead of #eef0f4.
  - id: compact
    status: unverified
    claim: With the compact modifier, cells have 0.25rem of padding above and below and 0.75rem left and right.
  - id: striped
    status: unverified
    claim: With the striped modifier, the cells of every odd body row have a #f6f8f9 background, with the text at a contrast of at least 11:1.
  - id: selected-row
    status: unverified
    claim: With the selected modifier, a row with the class is-selected or the attribute aria-selected="true" has a white background and a 2 px outline in the focus ring colour, drawn 1 px inside the row; in forced colours the outline uses the system Highlight colour.
  - id: empty-message
    status: unverified
    claim: With the empty modifier, body cells are centred in muted text at 0.875rem with 4rem of padding above and below and 2rem left and right.
  - id: scroll-container
    status: unverified
    claim: The scrollable container scrolls horizontally when its table is wider than it, the table inside is never narrower than its content, and the container has 2 px of padding so a focus outline on a cell is not clipped.
  - id: scroll-hint
    status: unverified
    claim: At a viewport 640 px wide or narrower the scrollable container ends in a 1.5rem strip with a faint dark gradient that does not take pointer events; in forced colours the container has a 1 px border.
  - id: scrollable-focus
    status: unmet
    claim: A scrollable container is reachable by keyboard and has an accessible name without the consumer adding `tabindex` and a label to it.
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
  part of this component. The stylesheet has a `pathable-table--sortable`
  modifier that draws sort arrows from `aria-sort`, but a script must set that
  attribute and handle the clicks, so this page does not specify it.

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
`pathable-table--striped`. The scrollable modifier goes on a container around
the table, not on the table.

| Axis      | Value        | Class                        | What it is for                                       |
| --------- | ------------ | ---------------------------- | ---------------------------------------------------- |
| border    | `default`    | none                         | Bordered cells and a shaded header row               |
| border    | `borderless` | `pathable-table--borderless` | No side borders, for a table that reads as text      |
| density   | `default`    | none                         | 0.5rem by 1rem cell padding                          |
| density   | `compact`    | `pathable-table--compact`    | 0.25rem by 0.75rem cell padding, for dense data      |
| rows      | `default`    | none                         | Every body row has a white background                |
| rows      | `striped`    | `pathable-table--striped`    | Shaded odd rows, to follow a row across many columns |
| selection | `default`    | none                         | No row is highlighted                                |
| selection | `selected`   | `pathable-table--selected`   | Outlines the row marked `is-selected`                |
| empty     | `default`    | none                         | The body holds rows                                  |
| empty     | `empty`      | `pathable-table--empty`      | The body holds one centred message                   |
| scroll    | `default`    | none                         | The table is as wide as its container allows         |
| scroll    | `scrollable` | `pathable-table--scrollable` | A container that scrolls a wide table sideways       |

The empty and selected modifiers are states the application sets. The
stylesheet has no stacked layout that turns rows into blocks on a phone, no
sticky header and no `data-label` support: use the scrollable container for a
table that is too wide for a phone. The stylesheet also has loading-skeleton
and hover-action modifiers for application tables, and they are not part of
this page.

## Tokens

| What                    | Token                                      |
| ----------------------- | ------------------------------------------ |
| Selected row background | `--pathable-color-surface`                 |
| Selected row outline    | `--pathable-color-focus-ring`              |
| Empty message colour    | `--pathable-color-text-muted`              |
| Empty message size      | `--pathable-font-size-body-sm`             |
| Empty message padding   | `--pathable-space-8`, `--pathable-space-4` |

The pixel and rem figures on this page are those of the default theme. The
type, borders, cell padding, header and stripe colours are fixed values in the
stylesheet, so a theme does not change them.

## Composition

- Give every table a `<caption>` that names the data, such as "Upcoming
  appointments by participant". It is the table's accessible name. If a
  visible caption does not suit the design, hide it with `pathable-sr-only`;
  do not leave it out.
- Put column headers in a `<thead>` as `<th scope="col">` and the first cell
  of each body row as `<th scope="row">`. The remaining cells are `<td>`.
- A header cell of a row is also shaded, which is why a row header looks like a
  column header; keep the row header to the one cell that names the row.
- Selected row: put the class `is-selected` on the `<tr>`. Also state the selection in text, as in the selected example: the
  outline alone is not read by a screen reader.
- Empty table: keep the `<thead>`, and put one `<td>` with a `colspan` equal to
  the number of columns in the body, holding the message.
- Scrollable container: put `pathable-table--scrollable` on a `<section>` that
  directly wraps the table. The class makes the container scroll but does not
  make it reachable by keyboard. A scrollable region needs a focusable,
  labelled container (WCAG 2.1.1 and 4.1.2), so add `tabindex="0"` and
  `aria-labelledby` pointing at the table's caption `id`, as the scrollable
  example does; a `<section>` with a name is a region landmark. This is the
  `scrollable-focus` guarantee, which is unmet.
- The table has no element classes. Put other components, such as buttons or
  links, inside cells as normal.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

The rem figures scale with the root font size.

## The consumer owns

- The caption, the header cells and their `scope`: the table's meaning for
  assistive technology.
- Keyboard access and a name for a scrollable container: `tabindex="0"` and
  `aria-labelledby`, because the class adds none of them.
- Stating a row's selection or the empty result in text, not only through the
  outline or the centred message.
- Sorting, loading states, row actions and any layout that stacks rows on a
  phone: these need script or markup the stylesheet does not provide.
- The data: realistic, short cell text, and the date and name formats.
  Personal data in a table needs the same minimisation as anywhere else.
