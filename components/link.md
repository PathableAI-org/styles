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
    claim: A link, visited or not, is underlined and takes the colour Tech Teal, #015a76.
  - id: hover-active-colour
    claim: A hovered link takes the PathAble primary colour, and a pressed link the darker primary colour, including a link that has been visited.
  - id: focus-ring
    claim: A focused link draws its outline in the surface's focus ring colour when the surface sets one, otherwise in Bright Blue Brooks, #4899e8.
  - id: external-icon
    claim: An external link shows a launch icon after its text, drawn in the text colour.
  - id: external-label
    claim: An external link has a visually hidden label "External." before its text, or "External, opens in a new tab." when it has target="_blank". The labels are English whatever the page language.
  - id: dark-colour
    claim: On a dark background, an unvisited link takes the reverse link colour, not the PathAble link colour, and a visited link keeps the PathAble link colour.
  - id: alt-external
    claim: With pathable-link--alt, an external link on a dark background has an external icon with enough contrast.
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

Links on a dark container belong on `pathable-dark-background`.

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

| Axis        | Value      | Class                     | What it is for                                                        |
| ----------- | ---------- | ------------------------- | --------------------------------------------------------------------- |
| destination | `internal` | none                      | A link within the application                                         |
| destination | `external` | `pathable-link--external` | A link to another website, with an icon and hidden label              |
| background  | `light`    | none                      | A link on a light surface                                             |
| background  | `alt`      | `pathable-link--alt`      | An external link on a dark background, with `pathable-link--external` |

A visited link needs no class. Combine the alt modifier with the external
modifier.

## Tokens

| What                    | Value                                                                        |
| ----------------------- | ---------------------------------------------------------------------------- |
| Link and visited colour | Tech Teal, #015a76                                                           |
| Focus outline colour    | Bright Blue Brooks, #4899e8, or the surface's focus ring colour on a surface |

The colours are named on [tokens-color.md](tokens-color.md).

Hover and pressed colours are fixed values in the stylesheet.

## Composition

- `pathable-link`: on an `<a>` with a real `href`, inside a sentence or a list
  item.
- `pathable-link--external`: adds the icon and the hidden label. Pair it with
  `rel="noreferrer"`. Add `target="_blank"` only when the link must open a new
  tab; the hidden label then says so.
- `pathable-link--alt`: with `pathable-link--external`, gives the external icon
  enough contrast on a dark background; see `alt-external`.
- On a dark container, put the link inside `pathable-dark-background`.

## Guarantees

The guarantees are the list in the front matter at the top of this page.

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
