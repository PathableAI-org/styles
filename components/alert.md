---
name: Alert
slug: alert
kind: static
summary: A block-level message with a coloured left bar, an optional status icon, an optional heading and a short text, for information that belongs to the content around it.
styles-class: pathable-alert
variants:
  - axis: status
    default: default
    values: [default, info, success, warning, error, emergency]
  - axis: size
    default: default
    values: [default, slim]
  - axis: icon
    default: default
    values: [default, no-icon]
guarantees:
  - id: surface-and-bar
    status: unverified
    claim: An alert with no status modifier has a light grey background and an 8 px grey bar on its left edge, and shows no icon.
  - id: body-padding
    status: unverified
    claim: The body has 16 px of padding above and below and 20 px at the sides, and the alert fills the width of its container.
  - id: stacked-spacing
    status: unverified
    claim: An alert that follows another element in the same parent has a 16 px top margin.
  - id: status-icon
    status: unverified
    claim: The info, success, warning, error and emergency alerts show a 32 px icon at the top left of the body, the body is at least 53 px tall, and the heading and text are indented 40 px so they clear the icon.
  - id: info-colours
    status: unverified
    claim: The info alert has a pale blue background (#edf5fd), a blue bar (#4899e8) and dark blue text (#00365c).
  - id: emergency-colours
    status: unverified
    claim: The emergency alert has a #9c3d10 background and bar, white text and a white icon.
  - id: slim
    status: unverified
    claim: The slim alert has 8 px of padding above and below, a 24 px icon and 32 px of indent for the text, and no minimum height.
  - id: status-fill
    status: unmet
    claim: The success, warning and error alerts fill the whole alert, body included, with the status background (#1cae96, #f5a623, #dc3545) and set their text in the status text colour (#001a33, #001a33, #ffffff), so every pairing has at least 4.5:1 contrast. Today the body keeps a pale tint over the status background, so error text is white on pale red.
  - id: heading-text-type
    status: unmet
    claim: The heading is set about 24 px (1.49rem) with a 8 px bottom margin and no top margin, and the text has no vertical margin, from the heading and text classes themselves. Today those classes only set a colour, and the heading and text take the page's default heading and paragraph styles.
  - id: link-colour
    status: unmet
    claim: A link inside an alert is set in a colour that has at least 4.5:1 contrast on that alert's background. Today only the framework's own link class receives these colours, so a link in an alert keeps the page's link colour.
  - id: no-icon
    status: unmet
    claim: With the no-icon modifier the icon is hidden, the body has no minimum height and the heading and text have no indent. The class is not in the stylesheet yet.
---

# Alert

A block-level message with a coloured left bar, an optional status icon, an
optional heading and a short text, for information that belongs to the content
around it. Put the class on a `<div>` that holds one `pathable-alert__body`. It
adds no role, no live region and no dismiss control.

## When to use

- Feedback about the content next to it: a saved plan, a failed booking, a
  missing document, a benefits deadline.
- A short notice at the top of a form or a panel that tells the reader what to
  fix or what changed.

Use something else when:

- the message applies to the whole site and sits above the header: use
  `pathable-site-alert`;
- the message is about one form field: use `pathable-error-message`;
- the message is a longer explanation with actions: use the page content and
  `pathable-button` instead of an alert.

## Example

<!-- package: styles -->

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- /package -->

<!-- example: info -->

## States

Each state is complete markup for one use of the alert. Copy the one closest to
what you need.

<!-- examples -->

## Variants

Add at most one modifier class from each axis to `pathable-alert`.

| Axis   | Value       | Class                       | What it is for                                                |
| ------ | ----------- | --------------------------- | ------------------------------------------------------------- |
| status | `default`   | none                        | A neutral note, grey with no icon                             |
| status | `info`      | `pathable-alert--info`      | Helpful context or a schedule change                          |
| status | `success`   | `pathable-alert--success`   | A confirmed change or a finished task                         |
| status | `warning`   | `pathable-alert--warning`   | Something that needs attention soon                           |
| status | `error`     | `pathable-alert--error`     | A failed action or a problem that blocks the reader           |
| status | `emergency` | `pathable-alert--emergency` | Urgent news that affects service                              |
| size   | `default`   | none                        | 16 px vertical padding and a 32 px icon                       |
| size   | `slim`      | `pathable-alert--slim`      | 8 px vertical padding and a 24 px icon, for one-line messages |
| icon   | `default`   | none                        | The status icon shows                                         |
| icon   | `no-icon`   | `pathable-alert--no-icon`   | The icon is hidden and the text uses the full width           |

An alert with no heading needs no modifier: leave the heading out.

## Tokens

| What                                  | Token                                                                        |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| Success background and text           | `--pathable-color-status-success-bg`, `--pathable-color-status-success-text` |
| Warning background and text           | `--pathable-color-status-warning-bg`, `--pathable-color-status-warning-text` |
| Error background and text             | `--pathable-color-status-danger-bg`, `--pathable-color-status-danger-text`   |
| Focus ring on success, warning, error | `--pathable-color-on-accent`                                                 |
| Focus ring on emergency               | `--pathable-color-status-danger-text`                                        |

The pixel figures on this page are those of the default theme. The info and
emergency colours come from the theme's colour palette, not from a PathAble
token.

## Composition

- `pathable-alert__body`: required, the only child of `pathable-alert`. It
  carries the padding, the icon and the indent of its children.
- `pathable-alert__heading`: optional, a heading element such as an `<h3>`
  inside the body. Choose the level that fits the page outline.
- `pathable-alert__text`: the message, a `<p>` inside the body. Put a
  `pathable-link` in it for a next step.
- The body may hold a `<ul>` with `pathable-list` after the text for a list of
  things to fix.
- The status icon is drawn by the stylesheet next to the body; do not add an
  icon element. The `no-icon` alert has none.
- Alerts that follow each other in one parent are 16 px apart.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

Today the heading and text classes only set a colour, and the no-icon modifier
does not exist; see `heading-text-type`, `no-icon` and `status-fill`. Do not
rely on the success, warning and error text colours until `status-fill` is met.

## The consumer owns

- The role. An alert that is in the page when it loads needs none. Give one
  that the application adds after load, such as an error after a failed save,
  `role="alert"` so a screen reader announces it. Do not put a role on every
  alert.
- The heading level, and whether there is a heading at all.
- The words. Say what happened and what to do; status is never carried by the
  colour or icon alone.
- Showing and removing the alert, and any dismiss control.
- Serving the status icons: the stylesheet refers to icon files by a path
  relative to itself, so the application's build must publish them there.
- Not putting personal details in an alert that is announced or shown to
  people who should not see them.
