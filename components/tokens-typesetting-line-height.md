---
name: Line height
slug: tokens-typesetting-line-height
kind: token
summary: Six unitless line-height keys, normalised for each typeface, with 5 for body text and 3 for headings.
uswds: https://designsystem.digital.gov/design-tokens/typesetting/line-height/
guarantees:
  - id: body-line-height
    status: unverified
    claim: line-height-body-5 sets line-height to 1.6.
  - id: heading-line-height
    status: unverified
    claim: line-height-heading-3 sets line-height to 1.4.
  - id: brand-scale
    status: unverified
    claim: line-height-body-1 to line-height-body-6 set line-height to 1, 1.2, 1.4, 1.5, 1.6 and 1.8.
  - id: code-scale
    status: unverified
    claim: line-height-code-1 to line-height-code-6 set line-height to 1, 1.3, 1.4, 1.6, 1.7 and 1.8, because the code typeface has a different optical size.
  - id: unitless
    status: unverified
    claim: "Every line-height class and lh() result is a unitless number, so the line height scales with the element's own font size."
  - id: responsive-variants
    status: unverified
    claim: 'Each line-height class has mobile-lg:, tablet: and desktop: variants and no hover:, focus:, active: or visited: variants.'
---

# Line height

Six unitless line-height keys, normalised for each typeface, with 5 for body text
and 3 for headings. Line height is asked for together with a family, because
USWDS adjusts each value for the typeface's optical size.

## When to use

- Setting the line height of a block of text from a small, fixed set instead of
  a one-off number: `5` for running text, `3` for headings, `1` for a single
  line that must not add height (a badge, a button label).
- Keeping line height proportional to the font size, so it follows a size class
  or the reader's font size.

Use something else when:

- you need an exact pixel height for a control: set the control's height with
  a spacing token and centre the text;
- the text is a heading or paragraph the components already style: they apply
  these tokens, so no class is needed.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: scale -->

## Tokens

The keys are the numbers `1` to `6`. Each has a nominal system value; the value
you get is that number divided by the ratio of the base optical size (362px) to
the typeface's, rounded to one decimal.

| Key | System value | body, heading, alt, ui | code (Roboto Mono) | Typical use                     |
| --- | ------------ | ---------------------- | ------------------ | ------------------------------- |
| `1` | 1            | 1                      | 1                  | One line: labels, badges        |
| `2` | 1.2          | 1.2                    | 1.3                | Large display text              |
| `3` | 1.35         | 1.4                    | 1.4                | Headings (PathAble heading)     |
| `4` | 1.5          | 1.5                    | 1.6                | Compact running text            |
| `5` | 1.62         | 1.6                    | 1.7                | Body text (PathAble body)       |
| `6` | 1.75         | 1.8                    | 1.8                | Lead paragraph, relaxed reading |

The four brand typefaces declare the same optical size, so they share one
column. The system value of key `2` is 1.2; the USWDS website's 1.15 is wrong
for the installed version.

## Sass

```scss
@use '@pathableai/styles' as *;

.plan-card__title {
  line-height: line-height('heading', 3); // 1.4
}

.plan-card__summary {
  @include u-line-height('body', 5); // 1.6
}

.plan-card__headline {
  @include typeset('heading', 'xl', 3); // family, size and line height
}
```

`line-height($family, $key)` and `lh($family, $key)` are the same function and
take exactly two arguments; a family with no optical size is an error. The mixin
`u-line-height($family, $key)` sets the property; `typeset($family, $size,
$line-height)` sets family, size and line height together.

## Utilities

| Class                        | Property      | Page                                              |
| ---------------------------- | ------------- | ------------------------------------------------- |
| `line-height-<family>-<key>` | `line-height` | [Paragraph styles](utilities-paragraph-styles.md) |

`<family>` is `sans`, `serif`, `mono`, `cond`, `heading`, `ui`, `body`, `code` or
`alt`, and `<key>` is `1` to `6`: `line-height-body-5`, `line-height-heading-3`.
The responsive prefixes `mobile-lg:`, `tablet:` and `desktop:` also work, for
example `tablet:line-height-heading-2`.

## Settings

| Setting                      | PathAble default                            | USWDS default |
| ---------------------------- | ------------------------------------------- | ------------- |
| `$theme-body-line-height`    | `5`                                         | `5`           |
| `$theme-heading-line-height` | `3`                                         | `2`           |
| `$theme-lead-line-height`    | `6`                                         | `6`           |
| `$line-height-settings`      | `()` (output and responsive on; states off) | same          |

`$theme-input-line-height` and the other component line-height settings keep
their USWDS defaults.

```scss
@use '@pathableai/styles' with (
  $theme-heading-line-height: 3,
  $theme-body-line-height: 5
);
```

## States

Each state is complete markup for one use of the tokens. Copy the one closest
to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
was read from the Sass source and a compiled sample; none is checked by a test
yet (`status: unverified`).

The compiled values are rounded to one decimal, so key `3` is 1.4 although its
system value is 1.35, and key `5` is 1.6 although its system value is 1.62.

## The consumer owns

- Leaving enough space for text spacing overrides: a line height of at least
  1.5 for body text, which key `4`, `5` and `6` meet, and no fixed height on
  text containers (WCAG 1.4.12).
- Not using key `1` for text that can wrap onto a second line.
- Not mixing a line-height class from one family with a font-size class from
  another on the same element unless you intend the difference.
