---
name: Link
slug: link
kind: static
summary: A text link in the PathAble link colour, underlined, with an optional icon and hidden label for links that leave the site.
styles-class: pathable-link
variants:
  - axis: destination
    default: internal
    values: [internal, external]
  - axis: background
    default: light
    values: [light, alt]
guarantees:
  - id: link-colour
    status: unverified
    claim: A link, visited or not, is underlined and takes the colour of --pathable-color-link, which is #015a76 in the default theme.
  - id: hover-active-colour
    status: unverified
    claim: A hovered link takes the PathAble primary colour, and a pressed link the darker primary colour, including a link that has been visited.
  - id: focus-ring
    status: unverified
    claim: A focused link draws its outline in the colour of --pathable-surface-focus-ring when the surface sets one, otherwise in --pathable-color-focus-ring.
  - id: external-icon
    status: unverified
    claim: An external link shows a launch icon after its text, drawn in the text colour.
  - id: external-label
    status: unverified
    claim: An external link has a visually hidden label "External." before its text, or "External, opens in a new tab." when it has target="_blank". The labels are English whatever the page language.
  - id: dark-colour
    status: unverified
    claim: On a dark background, an unvisited link takes the reverse link colour, not the PathAble link colour, and a visited link keeps the PathAble link colour. This is read from the source, not seen in a browser.
  - id: alt-external
    status: unmet
    claim: With pathable-link--alt, an external link on a dark background has an external icon with enough contrast. The pathable-link--alt class is not in the stylesheet yet.
---

# Link

A text link in the PathAble link colour, underlined, with an optional icon and
hidden label for links that leave the site. Put the class on an `<a>` inside
text. It adds no role and no behaviour.

## When to use

- A link to another page, a record or a document inside running text or a list.
- A link to another website, with the external modifier, so that the icon and the
  hidden label tell every reader it leaves the application.

Use something else when:

- the control performs an action, such as saving or submitting: use
  `pathable-button`;
- the link is a navigation item in a menu or a step list: use the navigation
  component for that menu.

Links that act on a dark container belong on `pathable-dark-background`. The
dark-background behaviour is unverified; see the guarantees.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: default -->

## States

Each state is complete markup for one use of the link. Copy the one closest to
what you need.

<!-- examples -->

## Variants

Add the external modifier to `pathable-link` for a link to another website. The
alt modifier belongs on an external link on a dark background.

| Axis        | Value      | Class                                    | What it is for                                           |
| ----------- | ---------- | ---------------------------------------- | -------------------------------------------------------- |
| destination | `internal` | none                                     | A link within the application                            |
| destination | `external` | `pathable-link--external`                | A link to another website, with an icon and hidden label |
| background  | `light`    | none                                     | A link on a light surface                                |
| background  | `alt`      | `pathable-link--alt` (with `--external`) | An external link on a dark background                    |

A visited link needs no class. The alt modifier has no effect alone; combine it
with the external modifier.

## Tokens

| What                    | Token                                                               |
| ----------------------- | ------------------------------------------------------------------- |
| Link and visited colour | `--pathable-color-link`                                             |
| Focus outline colour    | `--pathable-surface-focus-ring`, else `--pathable-color-focus-ring` |

Hover and pressed colours are fixed brand values and are not tokens.

## Composition

- `pathable-link`: on an `<a>` with a real `href`, inside a sentence or a list
  item.
- `pathable-link--external`: adds the icon and the hidden label. Pair it with
  `rel="noreferrer"`. Add `target="_blank"` only when the link must open a new
  tab; the hidden label then says so.
- `pathable-link--alt`: not in the stylesheet yet; see `alt-external`.
- On a dark container, put the link inside `pathable-dark-background`. The
  `pathable-link--nav` class that appears in a Storybook story has no rules and
  is not part of this component.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

The icon and the hidden label are drawn by the stylesheet, so they are not in
the markup and they are not in the page language.

## The consumer owns

- Whether the link leaves the site, and so whether to add the external modifier.
- Link text that makes sense out of context, and unique text or a hidden suffix
  when several links on a page would otherwise share a name.
- A real `href` on every link; use a button for an action.
- `rel="noreferrer"` on external links, and `target="_blank"` only where it is
  needed.
- A translated hidden label on pages that are not in English, since the
  stylesheet's labels are English.
