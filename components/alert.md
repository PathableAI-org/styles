---
name: Alert
slug: alert
kind: static
summary: A block-level message with a coloured left bar, an optional status icon, an optional heading and a short text, for information that belongs to the content around it.
styles-class: pathable-alert
variants:
  - axis: status
    default: info
    default-modifier: true
    values: [info, success, warning, error, emergency]
  - axis: size
    default: default
    values: [default, slim]
  - axis: icon
    default: default
    values: [default, no-icon]
guarantees:
  - id: surface-and-bar
    claim: An alert has a status surface and an 8 px bar on its left edge in the status colour, and fills the width of its container.
  - id: body-padding
    claim: The body has 16 px of padding above and below and 20 px at the sides, and the alert fills the width of its container.
  - id: stacked-spacing
    claim: An alert that follows another element in the same parent has a 16 px top margin.
  - id: status-icon
    claim: The alert shows a 32 px icon at the top left of the body, the body is at least 53 px tall, and the heading and text are indented 40 px so they clear the icon.
  - id: info-colours
    claim: The info alert has a pale blue background (#edf5fd), a blue bar (#4899e8) and dark blue text (#00365c).
  - id: emergency-colours
    claim: 'The emergency alert has a #9c3d10 background and bar, white text and a white icon.'
  - id: slim
    claim: The slim alert has 8 px of padding above and below, a 24 px icon and 32 px of indent for the text, and no minimum height.
  - id: status-fill
    claim: 'The success, warning and error alerts fill the whole alert, body included, with the status background (#1cae96, #f5a623, #dc3545) and set their text in the status text colour (#001a33, #001a33, #ffffff), so every pairing has at least 4.5:1 contrast.'
  - id: heading-text-type
    claim: The heading is set at 1.5rem (the lg size, 24 px at a 16 px root) with a 8 px bottom margin and no top margin, and the text has no vertical margin, from the heading and text classes themselves.
  - id: link-colour
    claim: A link inside an alert is set in a colour that has at least 4.5:1 contrast on that alert's background.
  - id: no-icon
    claim: With the no-icon modifier the icon is hidden, the body has no minimum height and the heading and text have no indent.
  - id: focus-ring
    claim: A focus outline inside an alert has at least 3:1 contrast on that alert's surface; on the info alert it is PathAble Blue (#00365c).
  - id: long-words
    claim: A word too long for the body, such as a heading word under browser text zoom on a narrow screen, wraps inside the alert instead of running out of it.
  - id: forced-colors
    claim: In forced-colours mode the status icon is drawn in the forced text colour, so it still shows next to the heading and text.
---

# Alert

A block-level message with a coloured left bar, an optional status icon, an
optional heading and a short text, for information that belongs to the content
around it. Put the class on a `<div>`, or a `<section>` for a named region,
that holds one `pathable-alert__body`. It adds no role, no live region and no
dismiss control; the role comes from how the alert is announced, as set out
under Announcing an alert.

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

<!-- css-files -->

<!-- example: info -->

## States

Each state is complete markup for one use of the alert. Copy the one closest to
what you need.

<!-- examples -->

## Variants

Add at most one modifier class from each axis to `pathable-alert`.

| Axis   | Value       | Class                       | What it is for                                                |
| ------ | ----------- | --------------------------- | ------------------------------------------------------------- |
| status | `info`      | none                        | Helpful context or a schedule change                          |
| status | `success`   | `pathable-alert--success`   | A confirmed change or a finished task                         |
| status | `warning`   | `pathable-alert--warning`   | Something that needs attention soon                           |
| status | `error`     | `pathable-alert--error`     | A failed action or a problem that blocks the reader           |
| status | `emergency` | `pathable-alert--emergency` | Urgent news that affects service                              |
| size   | `default`   | none                        | 16 px vertical padding and a 32 px icon                       |
| size   | `slim`      | `pathable-alert--slim`      | 8 px vertical padding and a 24 px icon, for one-line messages |
| icon   | `default`   | none                        | The status icon shows                                         |
| icon   | `no-icon`   | `pathable-alert--no-icon`   | The icon is hidden and the text uses the full width           |

Info is the default status; the examples also carry
`pathable-alert--info`, which gives the same look. An alert with no heading needs no modifier: leave the heading out.

- Success: Intelligent Jade, #1cae96, with #001a33 text.
- Warning: Amber, #f5a623, with #001a33 text.
- Error: Danger, #dc3545, with white, #ffffff, text.
- Focus ring on success, warning and error: #001a33 on all three, which is
  also the text colour on success and warning.
- Focus ring on emergency: White, #ffffff, the text colour of the alert.
- Focus ring on info alerts: PathAble Blue, #00365c.

The info and emergency colours are fixed when the package is built and are
named on [tokens-color.md](tokens-color.md). The pixel figures on this page
assume a 16 px root font size.

## Announcing an alert

An alert is one of three kinds, by how a screen reader meets it:

- A static named region: the alert is in the page when it loads. Make it a
  `<section>` with an `aria-label`, so it is a region landmark with a name.
- An advisory alert: the application adds it after load for news that can
  wait, such as a saved change. Give it `role="status"`, which is read when
  the reader is next idle.
- An urgent alert: the application adds it after load for news the reader
  must hear now, such as a failed save or an emergency. Give it
  `role="alert"`, which interrupts what is being read.

Put the alert type in the opening words of the heading, or of the message
when there is no heading, such as "Warning: benefits recertification due
soon". Colour and the icon are never the only cue.

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
- An alert can sit inside `pathable-dark-background`. It keeps its own
  surface, text and link colours there.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour.

## The consumer owns

- The role, as set out under Announcing an alert. Do not put a live role on
  every alert: use `role="alert"` only for urgent news.
- The heading level, and whether there is a heading at all.
- The words. Say what happened and what to do; status is never carried by the
  colour or icon alone.
- Showing and removing the alert, and any dismiss control.
- Serving the status icons at the path the stylesheet expects.
- Not putting personal details in an alert that is announced or shown to
  people who should not see them.
