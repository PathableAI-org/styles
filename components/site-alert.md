---
name: Site alert
slug: site-alert
kind: static
summary: A full-width banner under the site header that carries an info or emergency message for the whole site.
styles-class: pathable-site-alert
variants:
  - axis: status
    default: info
    values: [info, emergency]
  - axis: size
    default: default
    values: [default, slim]
  - axis: icon
    default: default
    values: [default, no-icon]
  - axis: heading
    default: default
    values: [default, no-heading]
guarantees:
  - id: body-font
    claim: The site alert is a block that fills the width of its container and sets its text in the PathAble body font.
  - id: nested-alert-surface
    claim: 'The nested alert inside the site alert shows the status surface (pale blue #edf5fd with a #4899e8 bar for info, #9c3d10 for emergency), the status icon and the status text colour.'
  - id: content-width
    claim: The nested body is at most 1024 px wide with 20 px of side padding; from a viewport 1024 px wide it is centred with 28 px of side padding so its content lines up with the site margins.
  - id: status-icon
    claim: The info and emergency site alerts show a 32 px icon at the top left of the nested body, and the heading and text are indented 40 px.
  - id: slim
    claim: The slim site alert has 8 px of padding above and below, a 24 px icon and a 32 px indent for the text.
  - id: no-icon
    claim: With the no-icon modifier the icon is hidden and the heading and text have no indent.
  - id: no-heading
    claim: With the no-heading modifier the nested body has no heading and its text starts with a bold lead-in; the icon, padding and indent are those of a site alert with a heading.
  - id: no-warning-status
    claim: There are no success, warning or error site alerts; only info and emergency have a status surface.
---

# Site alert

A full-width banner under the site header that carries an info or emergency
message for the whole site. Put the class on a `<section>` with an
`aria-label`, directly below the site header and above the page content, and
put one `pathable-alert` inside it. The banner adds no role, no live region
and no dismiss control, and it is not part of this component to add one.

## When to use

- A planned outage, a closure or an urgent notice that every user of the
  application needs to see on every page.
- A short change notice that lasts a few days and then goes away.

Use something else when:

- the message is about one panel or form: use `pathable-alert`;
- the message needs a success, warning or error look: use `pathable-alert`;
  the site alert has info and emergency only;
- the notice must be dismissed or remembered per user: the application builds
  that; no script ships with this component.

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

Each state is complete markup for one use of the site alert. Copy the one
closest to what you need.

<!-- examples -->

## Variants

Add at most one modifier class from each axis to `pathable-site-alert`. The
status is set on the site alert, not on the nested `pathable-alert`.

| Axis    | Value        | Class                             | What it is for                                       |
| ------- | ------------ | --------------------------------- | ---------------------------------------------------- |
| status  | `info`       | none                              | A planned change or helpful news for the whole site  |
| status  | `emergency`  | `pathable-site-alert--emergency`  | An outage or closure that needs attention now        |
| size    | `default`    | none                              | 16 px vertical padding and a 32 px icon              |
| size    | `slim`       | `pathable-site-alert--slim`       | 8 px vertical padding and a 24 px icon, for one line |
| icon    | `default`    | none                              | The status icon shows                                |
| icon    | `no-icon`    | `pathable-site-alert--no-icon`    | The icon is hidden and the text uses the full width  |
| heading | `default`    | none                              | A heading above the message                          |
| heading | `no-heading` | `pathable-site-alert--no-heading` | A bold lead-in in the message and no heading         |

Info is the default status; the examples also carry
`pathable-site-alert--info`, which gives the same look.

The body font is Nunito. The pixel figures on this page assume a 16 px root font
size.

## Urgency

A site alert that is in the page when it loads needs no role. One the
application adds after load has an urgency, set on the `<section>`:

- `role="status"` for news that can wait, such as a planned maintenance
  window. A screen reader reads it when it is next idle.
- `role="alert"` for news that the reader must hear now, such as an outage. A
  screen reader interrupts to read it.

Show one site alert at a time. Several stacked site alerts bury the message
that matters: put several short messages in one site alert, as a list inside
the body, as in the list state.

## Composition

- `pathable-alert`: required, the only child of the section. The status look
  of the banner is drawn on this nested element, so it must be present. Give
  it no status modifier; the status comes from the site alert's modifier.
- `pathable-alert__body`: required, the only child of the nested alert. It
  carries the padding, the icon and the indent.
- `pathable-alert__heading`: an `<h3>` inside the body; leave it out with the
  no-heading modifier.
- `pathable-alert__text`: the message, a `<p>` inside the body. Start it with
  a `<strong>` lead-in with the no-heading modifier. Put a `pathable-link` in it
  for a next step.
- The body may hold a `<ul>` with `pathable-list` instead of the text for
  several short messages.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour.

## The consumer owns

- The landmark name. The `aria-label` on the section is required; set it to
  "Site alert" or a more specific name, and keep it unique when more than one
  site alert is on the page.
- Placing the banner below the header, above the page content, and on every
  page that needs it.
- The role, as set out under Urgency.
- The heading level.
- Removing the banner when it no longer applies, and any dismiss control or
  memory of it; no script ships with this component.
- Serving the status icons at the path the stylesheet expects.
- The words. Say what is affected, when it ends and what to do now.
