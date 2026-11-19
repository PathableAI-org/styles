---
name: RecordHeader
slug: record-header
kind: static
summary: A bordered panel that introduces one person, organisation, service or resource, with a round picture, its name, a metadata line, status tags and actions.
styles-class: pathable-record-header
variants:
  - axis: alignment
    default: start
    values: [start, centered]
  - axis: media
    default: image
    values: [image, no-image]
guarantees:
  - id: media-size
    status: unverified
    claim: The media is a 4rem circle that does not shrink, an image inside covers it without distortion, and an SVG inside is half its width and height, centred.
  - id: row-layout
    status: unverified
    claim: Media, body and actions sit in one top-aligned row with a 2rem gap, and the actions region is pushed to the inline end.
  - id: panel
    status: unverified
    claim: The panel has 2rem padding, 8 px rounded corners, a 1 px border and the surface background, and fills its container's width.
  - id: long-identity
    status: unverified
    claim: The body can shrink below its content width and a long name breaks inside words rather than overflowing the panel.
  - id: metadata-row
    status: unverified
    claim: Metadata items sit in a wrapping row with a 1rem gap and a middle dot before every item after the first, with no list markers or indent.
  - id: centered
    status: unverified
    claim: With the centered modifier, media, body and actions stack in a column and the text, metadata, tags and actions are centred.
  - id: narrow
    status: unverified
    claim: At a viewport of 640 px or less the panel stacks in a column with items stretched, and the actions region is full width with each child growing to share it.
  - id: custom-size
    status: unverified
    claim: Setting the avatar-size custom property resizes the media circle, and setting the gap custom property changes the space between media, body and actions.
---

# RecordHeader

A bordered panel that introduces one person, organisation, service or resource,
with a round picture, its name, a metadata line, status tags and actions. Put
the class on a `<div>` or `<header>`. It is not interactive: it lays out the
buttons placed in it but does not style them.

## When to use

- The top of a profile, organisation, case or service page, where the reader
  needs to see whose record it is before the details below.

Use something else when:

- the page is a dashboard or list with a title and page actions but no single
  subject: use `pathable-dashboard-header`;
- the record is one item in a list of many: use `pathable-card` or
  `pathable-media-block`;
- you only need a small icon beside a line of text: use `pathable-icon-tile`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-record-header">
  <div class="pathable-record-header__media">
    <img src="/photos/jane-doe.jpg" alt="" />
  </div>
  <div class="pathable-record-header__body">
    <h1 class="pathable-record-header__identity">Jane Doe</h1>
    <ul class="pathable-record-header__metadata">
      <li>Employment Specialist</li>
      <li>Seattle Region</li>
    </ul>
    <div class="pathable-record-header__badges">
      <span class="pathable-tag">Certified</span>
    </div>
  </div>
  <div class="pathable-record-header__actions">
    <button class="pathable-button" type="button">Message</button>
  </div>
</div>
```

## Variants

Add at most one modifier class from each axis to `pathable-record-header`. The
two axes combine freely.

| Axis      | Value      | Class                              | What it is for                                                                                        |
| --------- | ---------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| alignment | `start`    | none                               | Picture at the start, actions at the end, in one row                                                  |
| alignment | `centered` | `pathable-record-header--centered` | Everything stacked and centred, for a narrow column (see Composition for viewports of 640 px or less) |
| media     | `image`    | none                               | A photo or logo, on the page background colour                                                        |
| media     | `no-image` | `pathable-record-header--no-image` | A fallback icon on an accent-coloured circle                                                          |

## Tokens

| What                       | Token                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| Media size (default 4rem)  | `--pathable-record-header-avatar-size`                                                      |
| Gap between regions        | `--pathable-record-header-gap`                                                              |
| Panel background, border   | `--pathable-color-surface`, `--pathable-color-border`                                       |
| Corner radius              | `--radius-md`                                                                               |
| Media background and icon  | `--pathable-color-bg`, `--pathable-color-text-muted`                                        |
| No-image background        | `--pathable-color-accent`                                                                   |
| Name font, size and weight | `--pathable-font-heading`, `--pathable-font-size-heading-md`, `--pathable-font-weight-bold` |
| Name colour                | `--pathable-color-text`                                                                     |
| Body font, metadata size   | `--pathable-font-body`, `--pathable-font-size-caption-md`                                   |
| Spacing                    | `--pathable-space-1`, `--pathable-space-2`, `--pathable-space-4`                            |

The two component properties are read on the media and the panel; set them on
the panel or above it. When the gap property is unset the gap is
`--pathable-space-4`. The pixel figures in the guarantees are those of the
default theme, where the spacing tokens 1, 2 and 4 are 0.5, 1 and 2rem and
`--radius-md` is 8 px. A theme that changes these tokens changes them.

## Composition

- `pathable-record-header__media` holds one `<img>` or one `<svg>`. It clips
  its content to a circle. Use an SVG drawn in `currentColor` for the fallback
  icon.
- `pathable-record-header__body` holds the name, metadata and tags in a column
  with a 0.5rem gap.
- `pathable-record-header__identity` is the name, at 20 px bold in the heading
  font. Use a heading at the right level for the page.
- `pathable-record-header__metadata` is a `<ul>` of short facts at 12 px in the
  muted colour. The dots between items are drawn by the stylesheet; do not
  type them.
- `pathable-record-header__badges` is a wrapping row of `pathable-tag`
  elements, 0.5rem apart. Its own 0.5rem top margin adds to the body's 0.5rem
  gap, so there is 1rem above it.
- `pathable-record-header__actions` is a wrapping row of buttons with a 1rem
  gap. It does not resize the buttons on a wide screen. Each `pathable-button`
  keeps its own 0.5rem right margin, so buttons appear 1.5rem apart and the
  last one stops 0.5rem short of the panel's inline end; on a narrow screen
  the buttons fill the row less that 0.5rem.
- `pathable-record-header__overflow` is a positioning wrapper for a "more
  actions" control inside the actions region. It only sets
  `position: relative` and a flex row; the menu itself is yours.
- With `pathable-record-header--no-image` the media circle uses the accent
  colour with the icon in the surface colour, and the whole circle is drawn at
  80% opacity.
- At a viewport of 640 px or less the media gets an extra 1rem below it, on
  top of the gap. With `pathable-record-header--centered` at that width the
  text and actions stay centred but the picture moves to the start edge.
- In forced-colours mode the panel gets a 2 px border and the media a 1 px
  border.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Accessibility. Give a photo `alt=""` when the name beside it already says who
  it is, or a short description when it adds information. Set
  `aria-hidden="true"` on a fallback icon. Give an icon-only action button an
  accessible name.
- The buttons and any overflow menu: the header does not style them, and the
  menu needs its own markup, keyboard handling and script.
- Status tags that say their status in words, not colour alone.
- The heading level of the name.
- Image loading and fallback: the stylesheet does not swap a broken image for
  the icon; render the no-image form yourself.
