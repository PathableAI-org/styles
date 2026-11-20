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
    status: unverified
    claim: The spinner's outer size, border included, is 1.5rem across by default and 2.5rem across at large, which is 24 px and 40 px at a 16 px root font size.
  - id: ring
    status: unverified
    claim: Outside forced colours mode, the spinner is a circle with a 2 px border, or 3 px at large, in the indicator's text colour, with the top quarter of the ring transparent.
  - id: spin
    status: unverified
    claim: The spinner turns once every 0.6 s at a constant speed without stopping, and under prefers-reduced-motion it does not turn and is drawn at 50% opacity.
  - id: layout
    status: unverified
    claim: The spinner and the text are centred on each other vertically, with a gap of 1rem by default and 1.5rem at large, which is 16 px and 24 px at a 16 px root font size.
  - id: text-size
    status: unverified
    claim: The status text is 0.875rem with a line height of 1.5 by default and 1rem at large, which is 14 px and 16 px at a 16 px root font size.
  - id: scales-with-root
    status: unmet
    claim: The status text size follows the root font size, so at a 200% root font size it doubles at both sizes.
  - id: no-shrink
    status: unverified
    claim: The spinner keeps its size when the status text wraps onto several lines in a narrow container.
  - id: forced-colours
    status: unmet
    claim: In forced colours mode the ring is drawn in a system colour and keeps a visible gap, or another visible sign of motion, so its turning can be seen.
---

# Loading

An inline loading indicator that shows a spinning ring beside visible status
text and takes up space in the layout while it shows. Put the class on a
`<div>` inside a live region that stays in the place the content will appear.
The application adds the indicator to that region while it waits and removes
it when the content arrives; the class needs no JavaScript of its own.

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

The `role="status"` element is on the page before loading starts. The
application adds the indicator inside it and removes it again when the content
arrives; put the content beside the live region, not inside it, so it is not
read out in full.

```html
<div role="status">
  <div class="pathable-loading">
    <span class="pathable-loading__spinner" aria-hidden="true"></span>
    <span class="pathable-loading__text">Loading messages…</span>
  </div>
</div>
```

## Variants

Add at most one modifier class to `pathable-loading`.

| Axis | Value     | Class                     | What it is for                                               |
| ---- | --------- | ------------------------- | ------------------------------------------------------------ |
| size | `default` | none                      | Small ring and 0.875rem (14 px) text, inside a list or panel |
| size | `large`   | `pathable-loading--large` | Larger ring and 1rem (16 px) text, for a whole view          |

The ring is 1.5rem across by default and 2.5rem at large, border included: it
is `border-box` sized, so the 2 px border (3 px at large) is drawn inside that
size.

## Tokens

| What                 | Token                              |
| -------------------- | ---------------------------------- |
| Text and ring colour | `--pathable-color-text-muted`      |
| Gap, default         | `--pathable-space-2`               |
| Gap, large           | `--pathable-space-3`               |
| Text size, default   | `--pathable-font-size-body-sm`     |
| Text size, large     | `--pathable-font-size-body-md`     |
| Text line height     | `--pathable-font-line-height-body` |

The gaps and the spinner size are in rem, so they scale with the root font
size; the text sizes are pixel tokens and do not. The gaps, text sizes and line
height in the guarantees are those of the default theme. A theme that changes
these tokens changes them.

## Composition

- `pathable-loading__spinner` is the ring. Use an empty `<span>` and hide it
  from assistive technology with `aria-hidden="true"`.
- `pathable-loading__text` is the visible status text. Keep it short and say
  what is loading.
- The indicator is a block-level flex row as wide as its container. It adds
  no padding or margin; put it where the content will appear.
- For a ring with no visible text, replace the text element with a
  `pathable-sr-only` span that says what is loading, such as "Loading
  messages", so the live region has text to announce.
- Do not put the indicator inside a `pathable-button`: it sets its own muted
  text colour, which is not readable on a filled button. Place it on the page
  or a `pathable-card`, where that colour has enough contrast.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The forced colours guarantee is unmet: in Chromium the browser replaces the
transparent top of the ring with the system colour, so the ring shows as a
closed circle and its turning cannot be seen.

The scales-with-root guarantee is unmet. Today the font-size tokens are fixed
px values, so the status text size does not follow the user's default font
size.

## The consumer owns

- Accessibility. Keep a live region, such as an element with
  `role="status"`, on the page before loading starts, and add and remove the
  indicator inside it so its text is announced. Do not put `aria-live` on the
  indicator itself when you add and remove it. Hide the ring with
  `aria-hidden="true"`.
- Showing and removing the indicator, and moving focus to the content once it
  arrives when the user started the load.
- The status text, in the user's language.
- Layout around the indicator: where it sits and how much space it holds.
