---
name: Cluster
slug: cluster
kind: static
summary: A wrapping horizontal flex row that groups small items with the same gap between items and between lines.
styles-class: pathable-cluster
variants:
  - axis: gap
    default: default
    values: [default, gap-sm, gap-md, gap-lg, gap-xl]
  - axis: align
    default: default
    values:
      [
        default,
        align-start,
        align-center,
        align-end,
        align-stretch,
        align-baseline,
      ]
guarantees:
  - id: wraps
    status: unverified
    claim: An item that does not fit in the space left on the current line starts a new line, and items keep source order.
  - id: gap-sizes
    status: unverified
    claim: The space between items is 8 px by default and with gap-md, and 4, 16 or 24 px with gap-sm, gap-lg or gap-xl.
  - id: equal-row-gap
    status: unverified
    claim: The space between wrapped lines is the same as the space between items on a line.
  - id: centred-default
    status: unverified
    claim: Items that do not set their own alignment are centred vertically on their line by default and with align-center, and align-start, align-end, align-stretch and align-baseline align them to the top, the bottom, the full line height or the text baseline.
  - id: gap-between-only
    status: unverified
    claim: The cluster adds no space before its first item, after its last item or around itself.
  - id: custom-properties
    status: unverified
    claim: Setting --pathable-cluster-gap or --pathable-cluster-align on the cluster sets its gap or its vertical alignment to that value.
  - id: inherited-settings
    status: unverified
    claim: A cluster with no gap or align modifier inside a cluster that has one uses the outer cluster's value, because the custom properties inherit.
---

# Cluster

A wrapping horizontal flex row that groups small items with the same gap
between items and between lines. Put the class on any block element, such as
a `<div>` or `<ul>`. It adds no role, no padding and no border; it only
arranges its direct children.

## When to use

- A group of small, related items whose count or width varies: tags,
  filters, buttons in an action bar, metadata such as date and author.
- A row that must reflow onto several lines on narrow screens.

Use something else when:

- the items must stay on one line, such as an icon beside its label: use
  `pathable-inline`;
- the items should be one above the other: use `pathable-stack`;
- the items are cards or panels that should line up in columns: use
  `pathable-card-grid` or `pathable-grid`;
- two content regions sit side by side: use `pathable-split` or
  `pathable-sidebar-layout`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-cluster">
  <button type="button" class="pathable-button">Save</button>
  <button type="button" class="pathable-button pathable-button--outline">
    Cancel
  </button>
</div>
```

## Variants

Add at most one modifier class from each axis to `pathable-cluster`. The two
axes combine freely.

| Axis  | Value            | Class                              | What it is for                              |
| ----- | ---------------- | ---------------------------------- | ------------------------------------------- |
| gap   | `default`        | none                               | 8 px between items and lines                |
| gap   | `gap-sm`         | `pathable-cluster--gap-sm`         | 4 px, for compact groups of tags            |
| gap   | `gap-md`         | `pathable-cluster--gap-md`         | 8 px, the same as the default but stated    |
| gap   | `gap-lg`         | `pathable-cluster--gap-lg`         | 16 px, for buttons and larger controls      |
| gap   | `gap-xl`         | `pathable-cluster--gap-xl`         | 24 px, for widely separated groups          |
| align | `default`        | none                               | Items centred vertically on each line       |
| align | `align-start`    | `pathable-cluster--align-start`    | Items aligned to the top of each line       |
| align | `align-center`   | `pathable-cluster--align-center`   | Centred, the same as the default but stated |
| align | `align-end`      | `pathable-cluster--align-end`      | Items aligned to the bottom of each line    |
| align | `align-stretch`  | `pathable-cluster--align-stretch`  | Items stretched to the line's tallest item  |
| align | `align-baseline` | `pathable-cluster--align-baseline` | Items' first text baselines lined up        |

For other values, set `--pathable-cluster-gap` (one length, used for both
directions) or `--pathable-cluster-align` (an `align-items` value) on the
cluster. Both inherit: a nested cluster without its own modifiers takes the
outer cluster's values.

## Tokens

| What                 | Token                      |
| -------------------- | -------------------------- |
| Gap, overridable     | `--pathable-cluster-gap`   |
| Alignment            | `--pathable-cluster-align` |
| `gap-sm`             | `--space-4`                |
| Default and `gap-md` | `--space-8`                |
| `gap-lg`             | `--space-16`               |
| `gap-xl`             | `--space-24`               |

The pixel figures are those of the default theme's spacing scale.

## Composition

- Any elements can be children; the gap sits between direct children only.
  Use `<ul>` with `<li>` children when the items form a list.
- Items keep their own width and start at the left edge. Add
  `pathable-flex-justify-between` or another justify utility to distribute
  them; with wrapping, a justify utility applies to each line separately.
- Wrapping does not stop overflow: an item wider than the cluster, such as
  one with a long unbroken string or a fixed minimum width, takes a line of
  its own and overflows unless its own content can wrap.
- Set vertical alignment with the align modifiers or
  `--pathable-cluster-align`, not a utility such as
  `pathable-flex-align-start`: whether the utility overrides the cluster's
  own alignment currently depends on how the stylesheet is loaded, which is
  a known defect.
- Children keep their own margins, which add to the gap. `pathable-button`
  has an 8 px right margin, so buttons in a cluster sit 8 px further apart
  than the gap, and below a 480 px viewport each button is full width and
  takes its own line.
- The cluster has no element classes and no padding. It nests inside
  `pathable-stack`, cards and surfaces, and clusters nest inside each other.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Semantics and accessible names. Use a list for a list of items and give
  groups of controls a label where the group needs one; the class adds no
  role.
- Reading order. Wrapped items keep source order, left to right then top to
  bottom.
- The order and priority of actions, and each item's own size.
- Padding, background and width around the cluster.
