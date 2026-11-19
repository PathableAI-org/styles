---
name: Text
slug: text
kind: static
summary: A body-text style that sets the typeface, size, line height and colour of a run of text from a role and a tone.
styles-class: pathable-text
variants:
  - axis: role
    default: inherit
    values: [inherit, body, small, caption]
  - axis: tone
    default: inherit
    values: [inherit, tone-default, tone-muted, tone-danger, tone-success]
guarantees:
  - id: role-scale
    status: unverified
    claim: The body, small and caption roles set 16, 14 and 12 px text with line heights of 1.5, 1.43 and 1.33, all at weight 400.
  - id: body-typeface
    status: unverified
    claim: The text is set in the body typeface at every role and tone.
  - id: plain-is-body
    status: unverified
    claim: With no modifier and no ancestor setting the text custom properties, the text renders exactly as the body role in the default tone.
  - id: tone-colour-only
    status: unverified
    claim: A tone modifier changes the text colour and nothing else, so size, line height and weight are the same at every tone.
  - id: tone-contrast
    status: unverified
    claim: Every tone has a contrast of at least 4.5:1 on the white surface colour.
  - id: inherits-role-and-tone
    status: unverified
    claim: A `pathable-text` with no modifier inside a `pathable-text` with a role or tone modifier takes that role and tone, and a modifier on the inner element replaces it.
  - id: no-box
    status: unverified
    claim: The class sets no margin, padding, display or width, so the element keeps the box other rules give it.
---

# Text

A body-text style that sets the typeface, size, line height and colour of a
run of text from a role and a tone. Put the class on a `<p>`, `<span>`, `<div>`
or any other element that holds text. It adds no role and no semantics.

## When to use

- Body copy, secondary copy and captions in application UI.
- Text whose colour carries a tone, such as muted metadata or a success
  message, beside words that already say what the tone means.

Use something else when:

- the text is a heading: use a heading element with `pathable-heading` and a
  level modifier;
- the text is a lead paragraph under a page title: use `pathable-intro`;
- the paragraphs also need a readable line length and space between them: add
  `pathable-paragraph` to each, or wrap them in `pathable-content`;
- a phrase inside the text needs a marker, underline or fill: use
  `pathable-text-highlight` on a `<span>`;
- the text is a form hint or an error under a field: use `pathable-hint` or
  `pathable-error-message`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<p class="pathable-text pathable-text--body">
  Your training record was updated on 3 March.
</p>
<p class="pathable-text pathable-text--small pathable-text--tone-muted">
  Updated by the records team
</p>
```

## Variants

Add at most one modifier class from each axis to `pathable-text`. The two axes
combine freely.

| Axis | Value          | Class                         | What it is for                                        |
| ---- | -------------- | ----------------------------- | ----------------------------------------------------- |
| role | `inherit`      | none                          | The nearest ancestor's role, or body if there is none |
| role | `body`         | `pathable-text--body`         | 16 px body copy; also resets an inherited role        |
| role | `small`        | `pathable-text--small`        | 14 px secondary copy and metadata                     |
| role | `caption`      | `pathable-text--caption`      | 12 px captions and fine print                         |
| tone | `inherit`      | none                          | The nearest ancestor's tone, or the text colour       |
| tone | `tone-default` | `pathable-text--tone-default` | Normal text colour; also resets an inherited tone     |
| tone | `tone-muted`   | `pathable-text--tone-muted`   | Less prominent text, such as metadata                 |
| tone | `tone-danger`  | `pathable-text--tone-danger`  | Text about a failure or a destructive result          |
| tone | `tone-success` | `pathable-text--tone-success` | Text about a completed or approved result             |

The modifiers set four custom properties that inherit: `--pathable-text-font-size`,
`--pathable-text-line-height`, `--pathable-text-font-weight` and
`--pathable-text-color`. A `pathable-text` with no modifier reads them from the
nearest ancestor that sets them, so give nested text its own modifier when it
must not follow its parent. Setting one of these properties on the element
yourself overrides its value.

## Tokens

| What                       | Token                                                                       |
| -------------------------- | --------------------------------------------------------------------------- |
| Typeface                   | `--pathable-font-body`                                                      |
| Body size and line height  | `--pathable-font-size-body-md`, `--pathable-font-line-height-body`          |
| Small size and line height | `--pathable-font-size-body-sm`, `--pathable-font-line-height-body-sm`       |
| Caption size, line height  | `--pathable-font-size-caption-md`, `--pathable-font-line-height-caption-md` |
| Weight                     | `--pathable-font-weight-normal`                                             |
| Default tone colour        | `--pathable-color-text`                                                     |
| Muted tone colour          | `--pathable-color-text-muted`                                               |
| Danger tone colour         | `--pathable-color-danger`                                                   |
| Success tone colour        | `--pathable-color-text-success`                                             |

In the default theme the typeface is Nunito and the tone colours are
`#00365c`, `#015a76`, `#dc3545` and `#0d7a63`, with contrasts on white of
12.48:1, 7.71:1, 4.53:1 and 5.27:1. The sizes, line heights and contrast
figures in the guarantees are those of the default theme. A theme that
changes these tokens changes them.

## Composition

- Put text and inline content inside, such as links, `<strong>` and
  `pathable-text-highlight` spans. There are no element classes.
- The class sets no margin. On a `<p>`, add `pathable-paragraph` for space
  between paragraphs and a readable line length. When both are on one element,
  the text role's line height wins over the paragraph's.
- The danger tone falls below 4.5:1 on the page background colour; keep danger
  text on a white surface, such as `pathable-card`.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Accessibility. Never rely on the tone colour alone: say "failed" or
  "approved" in the words. A message that must be announced needs a live
  region or `pathable-alert`; the class announces nothing.
- Choosing the element: a `<p>` for a paragraph, a `<span>` inside a line.
- Keeping body text in sentence case and in short paragraphs, not all capitals.
- Spacing, line length and alignment around the text.
