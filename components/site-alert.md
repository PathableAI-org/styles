---
name: SiteAlert
slug: site-alert
kind: static
summary: A full-width banner under the site header that carries an info or emergency message for the whole site.
styles-class: pathable-site-alert
variants:
  - axis: status
    default: default
    values: [default, info, emergency]
  - axis: size
    default: default
    values: [default, slim]
  - axis: icon
    default: default
    values: [default, no-icon]
guarantees:
  - id: body-font
    status: unverified
    claim: The site alert is a block that fills the width of its container and sets its text in the PathAble body font.
  - id: nested-alert-surface
    status: unmet
    claim: The nested alert inside the site alert shows the status surface (pale blue #edf5fd with a #4899e8 bar for info, #9c3d10 for emergency), the status icon and the status text colour. Today the stylesheet reaches the nested alert only when it carries the framework's own alert classes, so a nested alert in the PathAble markup stays plain grey with a transparent body.
  - id: content-width
    status: unmet
    claim: The nested body is at most 1024 px wide with 20 px of side padding; from a viewport 1024 px wide it is centred with 28 px of side padding so its content lines up with the site margins. Today this is set only for the framework's own alert classes.
  - id: status-icon
    status: unmet
    claim: The info and emergency site alerts show a 32 px icon at the top left of the nested body, and the heading and text are indented 40 px.
  - id: slim
    status: unmet
    claim: The slim site alert has 8 px of padding above and below, a 24 px icon and a 32 px indent for the text.
  - id: no-icon
    status: unmet
    claim: With the no-icon modifier the icon is hidden and the heading and text have no indent. The class is not in the stylesheet yet.
  - id: no-warning-status
    status: unverified
    claim: There are no success, warning or error site alerts; only info and emergency have a status surface.
---

# SiteAlert

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

<!-- example: info -->

## States

Each state is complete markup for one use of the site alert. Copy the one
closest to what you need.

<!-- examples -->

## Variants

Add at most one modifier class from each axis to `pathable-site-alert`. The
status is set on the site alert, not on the nested `pathable-alert`.

| Axis   | Value       | Class                            | What it is for                                       |
| ------ | ----------- | -------------------------------- | ---------------------------------------------------- |
| status | `default`   | none                             | A neutral grey banner with no icon                   |
| status | `info`      | `pathable-site-alert--info`      | A planned change or helpful news for the whole site  |
| status | `emergency` | `pathable-site-alert--emergency` | An outage or closure that needs attention now        |
| size   | `default`   | none                             | 16 px vertical padding and a 32 px icon              |
| size   | `slim`      | `pathable-site-alert--slim`      | 8 px vertical padding and a 24 px icon, for one line |
| icon   | `default`   | none                             | The status icon shows                                |
| icon   | `no-icon`   | `pathable-site-alert--no-icon`   | The icon is hidden and the text uses the full width  |

A site alert with no heading needs no modifier: leave the heading out.

## Tokens

| What      | Token                  |
| --------- | ---------------------- |
| Body font | `--pathable-font-body` |

The pixel figures on this page are those of the default theme.

## Composition

- `pathable-alert`: required, the only child of the section. The status look
  of the banner is drawn on this nested element, so it must be present. Give
  it no status modifier; the status comes from the site alert's modifier.
- `pathable-alert__body`: required, the only child of the nested alert. It
  carries the padding, the icon and the indent.
- `pathable-alert__heading`: optional, an `<h3>` inside the body.
- `pathable-alert__text`: the message, a `<p>` inside the body. Start it with
  a `<strong>` lead-in when there is no heading. Put a `pathable-link` in it
  for a next step.
- The body may hold a `<ul>` with `pathable-list` instead of the text for
  several short messages.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

Today the stylesheet draws the banner only when the nested element and its
body carry the framework's own alert classes, which PathAble markup does not
use. The markup on this page is the target; until `nested-alert-surface` is
met, a site alert written this way shows no status colour, icon or width
limit. This needs a rendering check before anyone relies on it.

## The consumer owns

- The landmark name. The `aria-label` on the section is required; set it to
  "Site alert" or a more specific name, and keep it unique when more than one
  site alert is on the page.
- Placing the banner below the header, above the page content, and on every
  page that needs it.
- The role. A banner that is in the page when it loads needs none. Add
  `role="alert"` only when the application injects it after load.
- The heading level, and whether there is a heading at all.
- Removing the banner when it no longer applies, and any dismiss control or
  memory of it; no script ships with this component.
- Serving the status icons at the path the stylesheet expects.
- The words. Say what is affected, when it ends and what to do now.
