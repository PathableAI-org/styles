---
name: StickyPanel
slug: sticky-panel
kind: static
summary: A block that stays in view a fixed distance below the top of its scroll area and turns static on short viewports.
styles-class: pathable-sticky-panel
variants:
  - axis: position
    default: sticky
    values: [sticky, static]
guarantees:
  - id: sticks
    status: unverified
    claim: On a viewport at least 600 px tall, the panel stops 24 px below the top of its nearest scrolling ancestor while its parent is still in view, and scrolls away with the parent's end.
  - id: short-viewport
    status: unverified
    claim: On a viewport less than 600 px tall, the panel scrolls with the page like any other block.
  - id: static-modifier
    status: unverified
    claim: With the static modifier, the panel scrolls with the page at every viewport height.
  - id: own-height
    status: unverified
    claim: As a grid or flex item, such as a direct child of pathable-sidebar-layout, the panel keeps its content's height instead of stretching to the row.
  - id: custom-offset
    status: unverified
    claim: Setting --pathable-sticky-panel-top on the panel sets the distance it stops below the top of the scroll area.
---

# StickyPanel

A block that stays in view a fixed distance below the top of its scroll area
and turns static on short viewports. Put the class on a `<div>` that holds
secondary content, usually in the sidebar of `pathable-sidebar-layout`. It
adds no role, no background and no padding.

## When to use

- Secondary content that helps while the reader scrolls a long main column:
  a summary, a table of contents, a short list of actions.

Use something else when:

- you need the two-column arrangement itself: use `pathable-sidebar-layout`
  and put the sticky panel inside it;
- the content is the application's navigation: use `pathable-app-shell`,
  which has its own sidebar;
- the content must stay in view whatever the viewport height, or is taller
  than a short screen: do not make it sticky; use `pathable-stack` in normal
  flow.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-sidebar-layout">
  <article>
    <h1>Accommodation request</h1>
    <p>Long form content…</p>
  </article>
  <aside class="pathable-sticky-panel" aria-label="Request summary">
    <div class="pathable-surface pathable-surface--raised pathable-padding-3">
      <p>Step 2 of 4: your needs</p>
    </div>
  </aside>
</div>
```

## Variants

| Axis     | Value    | Class                           | What it is for                                             |
| -------- | -------- | ------------------------------- | ---------------------------------------------------------- |
| position | `sticky` | none                            | Sticks on viewports at least 600 px tall                   |
| position | `static` | `pathable-sticky-panel--static` | Never sticks, for a page where sticking would hide content |

The static modifier lets one template opt a page out without removing the
class. For a different stopping distance, set `--pathable-sticky-panel-top`
on the panel, for example to clear a fixed header. The property inherits.

## Tokens

| What                  | Token                         |
| --------------------- | ----------------------------- |
| Distance from the top | `--pathable-sticky-panel-top` |
| Default distance      | `--space-24`                  |

The 24 px distance is the default theme's figure. The 600 px height threshold
is fixed in the stylesheet and is not a token.

## Composition

- The panel can only stick within its parent. It needs a parent taller than
  itself, such as a sidebar column that stretches to the main column's
  height. As a direct child of `pathable-sidebar-layout` it keeps its own
  height so it can move within its row.
- Any ancestor with `overflow` set to `hidden`, `auto` or `scroll` becomes
  the scroll area the panel sticks to, which usually stops it sticking to the
  page.
- Below 1024 px wide, `pathable-sidebar-layout` stacks the panel under the
  main content, where its row is only as tall as the panel, so it does not
  move.
- The panel sets no background, z-index or maximum height. Put its content on
  a surface, such as `pathable-surface--raised`, and keep it shorter than the
  viewport: a taller panel's lower part is out of reach until the parent's
  end scrolls into view.
- The panel has no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Not hiding content. A sticky panel must not cover focused elements or
  text; check it at 200 per cent zoom, and use the static modifier where it
  would.
- Landmarks and names. Use `<aside>` or `<nav>` with an accessible name where
  the content needs one; the class adds no role.
- The panel's height, background and stacking against other positioned
  content.
- Any fixed header the panel must stop below, by setting the offset.
