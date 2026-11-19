---
name: Loading
slug: loading
kind: static
summary: An inline loading indicator that shows a spinning ring beside visible status text and takes up space in the layout while it shows.
styles-class: pathable-loading
variants:
  - axis: size
    default: default
    values: [default, large]
guarantees:
  - id: spinner-size
    status: unmet
    claim: The spinner's outer size, border included, is 24 px across by default and 40 px across at large.
  - id: ring
    status: unverified
    claim: The spinner is a circle with a 2 px border, or 3 px at large, in the indicator's text colour, with the top quarter of the ring transparent.
  - id: spin
    status: unverified
    claim: The spinner turns once every 0.6 s at a constant speed without stopping, and under prefers-reduced-motion it does not turn and is drawn at 50% opacity.
  - id: layout
    status: unverified
    claim: The spinner and the text are centred on each other vertically, with a gap of 16 px by default and 24 px at large.
  - id: text-size
    status: unverified
    claim: The status text is 14 px with a line height of 1.5 by default and 16 px at large.
  - id: no-shrink
    status: unverified
    claim: The spinner keeps its size when the status text wraps onto several lines in a narrow container.
  - id: forced-colours
    status: unverified
    claim: In forced colours mode the ring is drawn in a system colour; in Chromium its top quarter is not kept transparent, so the ring shows as a closed circle and its turning is not visible.
---

# Loading

An inline loading indicator that shows a spinning ring beside visible status
text and takes up space in the layout while it shows. Put the class on a
`<div>` in the place the content will appear. The application adds the
indicator while it waits and removes it when the content arrives; the class
needs no JavaScript of its own.

## When to use

- A part of a page, such as a list or a panel, is fetching its content and
  the wait is short or of unknown length.
- A button press starts work whose result appears nearby.

Use something else when:

- the shape of the coming content is known and a placeholder would reduce
  layout shift: use `pathable-skeleton`;
- the state is about saving the user's work: use `pathable-save-status`;
- the load failed: show a `pathable-alert` with the error.

## Example

Load the stylesheet once in the application:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-loading" aria-live="polite">
  <span class="pathable-loading__spinner" aria-hidden="true"></span>
  <span class="pathable-loading__text">Loading messages…</span>
</div>
```

## Variants

Add at most one modifier class to `pathable-loading`.

| Axis | Value     | Class                     | What it is for                                    |
| ---- | --------- | ------------------------- | ------------------------------------------------- |
| size | `default` | none                      | Small ring and 14 px text, inside a list or panel |
| size | `large`   | `pathable-loading--large` | Larger ring and 16 px text, for a whole view      |

The ring's content box is 1.5rem by default and 2.5rem at large; the border is
drawn outside it.

## Tokens

| What                 | Token                              |
| -------------------- | ---------------------------------- |
| Text and ring colour | `--pathable-color-text-muted`      |
| Gap, default         | `--pathable-space-2`               |
| Gap, large           | `--pathable-space-3`               |
| Text size, default   | `--pathable-font-size-body-sm`     |
| Text size, large     | `--pathable-font-size-body-md`     |
| Text line height     | `--pathable-font-line-height-body` |

The gaps, text sizes and line height in the guarantees are those of the default
theme. A theme that changes these tokens changes them.

## Composition

- `pathable-loading__spinner` is the ring. Use an empty `<span>` and hide it
  from assistive technology with `aria-hidden="true"`.
- `pathable-loading__text` is the visible status text. Keep it short and say
  what is loading.
- The indicator is a block-level flex row as wide as its container. It adds
  no padding or margin; put it where the content will appear.
- For a ring with no visible text, leave out the text element and give the
  container `role="status"` and an `aria-label`, such as "Loading".
- Do not put the indicator inside a `pathable-button`: it sets its own muted
  text colour, which is not readable on a filled button. Place it on the page
  or a `pathable-card`, where that colour has enough contrast.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The spinner is unmet because its width and height exclude the border: it is 28
px across by default and 46 px at large, unless the application applies
`box-sizing: border-box` to every element.

## The consumer owns

- Accessibility. Put `aria-live="polite"` on the container, or `role="status"`
  on a ring without text, and make the container exist before its text
  changes so the change is announced. Hide the ring with `aria-hidden="true"`.
- Showing and removing the indicator, and moving focus to the content once it
  arrives when the user started the load.
- The status text, in the user's language.
- Layout around the indicator: where it sits and how much space it holds.
