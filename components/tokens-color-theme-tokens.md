---
name: Color theme tokens
slug: tokens-color-theme-tokens
kind: token
summary: 'The role-based colour tokens base, primary, secondary, accent-warm, accent-cool and ink, each with lighter to darker grades, set to the PathAble brand colours.'
uswds: https://designsystem.digital.gov/design-tokens/color/theme-tokens/
guarantees:
  - id: primary-grades
    claim: The classes bg-primary-lighter, bg-primary-light, bg-primary, bg-primary-vivid, bg-primary-dark and bg-primary-darker set background-color to #e6ebef, #99afbe, #00365c, #015a76, #002845 and #001e33.
  - id: secondary-grades
    claim: The classes bg-secondary-lighter, bg-secondary-light, bg-secondary, bg-secondary-vivid, bg-secondary-dark and bg-secondary-darker set background-color to #e8f7f4, #a4dfd5, #1cae96, #1cae96, #0d7a63 and #0d4e44.
  - id: accent-cool-grades
    claim: The classes bg-accent-cool-lighter, bg-accent-cool-light, bg-accent-cool, bg-accent-cool-dark and bg-accent-cool-darker set background-color to #edf5fd, #b6d6f6, #4899e8, #015a76 and #00365c.
  - id: accent-warm-grades
    claim: The classes bg-accent-warm-lighter, bg-accent-warm-light, bg-accent-warm, bg-accent-warm-dark and bg-accent-warm-darker set background-color to #fbfff0, #edffc2, #d3ff66, #4a5924 and #354019.
  - id: base-grades
    claim: The classes bg-base-lightest, bg-base-lighter, bg-base-light, bg-base, bg-base-dark, bg-base-darker, bg-base-darkest and bg-ink set background-color to #f6f8f9, #eef0f4, #e6e9ee, #dde2e8, #565c65, #00365c, #00365c and #00365c.
  - id: lightest-darkest-off
    claim: No class exists for the tokens primary-lightest, primary-darkest, secondary-lightest, secondary-darkest, accent-cool-lightest, accent-cool-darkest, accent-warm-lightest or accent-warm-darkest, because PathAble defines no such grade.
  - id: text-pairs
    claim: Every swatch in the states of this page pairs its background with a text colour that has a contrast ratio of at least 4.5:1.
---

# Color theme tokens

The role-based colour tokens base, primary, secondary, accent-warm, accent-cool
and ink, each with lighter to darker grades, set to the PathAble brand colours.
A theme token names a role, not a colour:
`primary` is the colour of the main action, and a different theme can change
what it is. See the
[USWDS theme tokens](https://designsystem.digital.gov/design-tokens/color/theme-tokens/).

## When to use

- Any colour in the application that has a role: surfaces, borders, text,
  accents and links. Prefer a theme token over a system token or a hex value.
- Building a tint scale: the `lighter`, `light`, `dark` and `darker` grades are
  the approved steps of one brand colour.

Use something else when:

- the colour reports a status: use the [state tokens](tokens-color-state-tokens.md);
- the application needs a colour that is not in the brand: use a system token
  from [color system tokens](tokens-color-system-tokens.md).

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: primary -->

## Values

The source column says where the value comes from: **Brand** is a brand-guide colour, **Derived** is a tint
or shade of a brand colour (a `lighter` grade is the brand colour at 10% over
white, a `light` grade at 40% over white, and `dark` and `darker` grades are
the brand colour mixed with black), and **USWDS default** is a value the
PathAble theme leaves alone.

| Token                  | PathAble value               | Source        | Notes                                                          |
| ---------------------- | ---------------------------- | ------------- | -------------------------------------------------------------- |
| `base-lightest`        | `#f6f8f9`                    | Derived       | Shilling Silver, lightest tint                                 |
| `base-lighter`         | `#eef0f4`                    | Derived       | Shilling Silver tint                                           |
| `base-light`           | `#e6e9ee`                    | Derived       | Shilling Silver tint                                           |
| `base`                 | `#dde2e8` Shilling Silver    | Brand         |                                                                |
| `base-dark`            | `#565c65` (`gray-cool-60`)   | USWDS default | A neutral gray for borders and tags                            |
| `base-darker`          | `#00365c` PathAble Blue      | Brand         |                                                                |
| `base-darkest`         | `#00365c` PathAble Blue      | Brand         |                                                                |
| `ink`                  | `#00365c` PathAble Blue      | Brand         | Default text colour                                            |
| `primary-lightest`     | `false`                      | USWDS default | Not defined: no class                                          |
| `primary-lighter`      | `#e6ebef`                    | Derived       |                                                                |
| `primary-light`        | `#99afbe`                    | Derived       |                                                                |
| `primary`              | `#00365c` PathAble Blue      | Brand         |                                                                |
| `primary-vivid`        | `#015a76` Tech Teal          | Brand         |                                                                |
| `primary-dark`         | `#002845`                    | Derived       |                                                                |
| `primary-darker`       | `#001e33`                    | Derived       |                                                                |
| `primary-darkest`      | `false`                      | USWDS default | Not set: no class                                              |
| `secondary-lightest`   | `false`                      | USWDS default | Not set: no class                                              |
| `secondary-lighter`    | `#e8f7f4`                    | Derived       |                                                                |
| `secondary-light`      | `#a4dfd5`                    | Derived       |                                                                |
| `secondary`            | `#1cae96` Intelligent Jade   | Brand         | White text fails (2.78:1); use `text-black`                    |
| `secondary-vivid`      | `#1cae96` Intelligent Jade   | Derived       | The brand has no vivid jade; set to the base so no red appears |
| `secondary-dark`       | `#0d7a63`                    | Derived       | Text-safe deep jade, 5.27:1 with white                         |
| `secondary-darker`     | `#0d4e44`                    | Derived       |                                                                |
| `secondary-darkest`    | `false`                      | USWDS default | Not set: no class                                              |
| `accent-warm-lightest` | `false`                      | USWDS default | Not set: no class                                              |
| `accent-warm-lighter`  | `#fbfff0`                    | Derived       |                                                                |
| `accent-warm-light`    | `#edffc2`                    | Derived       |                                                                |
| `accent-warm`          | `#d3ff66` Lived-In Lime      | Brand         | Never text on a light background (1.15:1 on white)             |
| `accent-warm-dark`     | `#4a5924`                    | Derived       | Kept dark so white text passes (7.65:1)                        |
| `accent-warm-darker`   | `#354019`                    | Derived       |                                                                |
| `accent-warm-darkest`  | `false`                      | USWDS default | Not set: no class                                              |
| `accent-cool-lightest` | `false`                      | USWDS default | Not set: no class                                              |
| `accent-cool-lighter`  | `#edf5fd`                    | Derived       |                                                                |
| `accent-cool-light`    | `#b6d6f6`                    | Derived       |                                                                |
| `accent-cool`          | `#4899e8` Bright Blue Brooks | Brand         | White text is 3.00:1: large text only; use `text-black`        |
| `accent-cool-dark`     | `#015a76` Tech Teal          | Brand         | Link colour                                                    |
| `accent-cool-darker`   | `#00365c` PathAble Blue      | Brand         |                                                                |
| `accent-cool-darkest`  | `false`                      | USWDS default | Not set: no class                                              |

There is no `accent-warm-vivid` or `accent-cool-vivid` token: only `primary`
and `secondary` have a vivid grade.

## Utilities

- `bg-<token>`, `text-<token>`: [Color](utilities-color.md)
- `border-<token>`: [Border](utilities-border.md)
- `outline-<token>`: [Outline](utilities-outline.md)
- `underline-<token>`: [Text styles](utilities-text-styles.md)

The `bg-`, `text-`, `border-` and `underline-` classes accept the `hover:`
prefix. For example, `bg-primary hover:bg-primary-dark` darkens a surface on
pointer hover. `outline-<token>` has no `hover:` variant.

## States

Each state is one theme family, from its lightest to its darkest grade, with
the text class that keeps the pair at 4.5:1 or better.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

## The consumer owns

- Picking the text colour for each background: `text-ink` on the lighter
  grades and on `base`, `text-white` on the dark grades, and `text-black` on
  `secondary`, `accent-cool` and their vivid grades.
- Using `accent-warm` as a surface or as text on a dark background only.
- Keeping any colour it substitutes for a brand grade readable against the
  pairings above; a replacement for `primary` changes every pair built on it.
