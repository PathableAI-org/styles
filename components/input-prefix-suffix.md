---
name: Input prefix/suffix
slug: input-prefix-suffix
kind: static
summary: A bordered group that holds a text input with a decorative prefix or suffix, such as an icon or a unit, set inside its border.
styles-class: pathable-input-group
variants:
  - axis: state
    default: default
    values: [default, error, success]
  - axis: width
    default: default
    values: [default, 2xs, xs, sm, small, md, medium, lg, xl, 2xl]
guarantees:
  - id: group-box
    claim: The group is a flex row, 2.5rem (40 px at a 16 px root) tall, at most 30rem (480 px) wide, with a 1 px border in the input border colour, a 0.5rem top margin and no padding, and its input has no border of its own.
  - id: prefix-position
    claim: A prefix is absolutely placed at the start of the group with 0.5rem (8 px) of padding on each side, and the input after it has 2.5rem of left padding so its text starts after the prefix.
  - id: suffix-position
    claim: A suffix is absolutely placed at the end of the group with 0.5rem (8 px) of padding on each side, and the input has 2.5rem of right padding so its text stops before the suffix.
  - id: affix-no-select
    claim: The prefix and suffix cannot be selected with the pointer and their text stays on one line.
  - id: disabled-affix
    claim: 'A prefix that is followed by, or a suffix that follows, a disabled input or an input with aria-disabled="true" takes the disabled look, a grey #c9c9c9 background with a not-allowed cursor.'
  - id: affix-contrast
    claim: The prefix and suffix text and icon have a contrast of at least 4.5:1 against the white input background.
  - id: prefix-icon-size
    claim: A pathable-icon inside a pathable-input-prefix or pathable-input-suffix is 1.5rem (24 px) square.
  - id: error-modifier
    claim: 'With pathable-input-group--error, the group has a 0.25rem (4 px) solid #a52834 border.'
  - id: success-modifier
    claim: 'With pathable-input-group--success, the group has a 0.25rem (4 px) solid #0d7a63 border.'
  - id: state-focus-gap
    claim: In an error or success group, the focused input's 2 px focus ring is offset 0.25rem plus 1 px, so a 1 px gap separates it from the outside of the 4 px border, as the default group's 2 px offset does outside its 1 px border.
  - id: width-modifiers
    claim: The modifiers 2xs, xs, sm, md, lg, xl and 2xl cap the group at 5ex, 9ex, 13ex, 20ex, 30ex, 40ex and 50ex plus 3rem for the input's padding beside the affix and 2px for the default 1px border, so the value has that width (6px less with the 4px error or success border), and small and medium are aliases of sm and md.
---

# Input prefix/suffix

A bordered group that holds a text input with a decorative prefix or suffix,
such as an icon or a unit, set inside its border. Put `pathable-input-group` on
a `<div>` inside a `pathable-form`, around a `pathable-input` and one
`pathable-input-prefix` or `pathable-input-suffix`. The group draws the border; the affix is
only for sighted users and is hidden from assistive technology.

## When to use

- A symbol inside the field that shows what kind of value goes in, such as a
  phone icon or a dollar sign.
- A unit after the value, such as "hrs." or "lbs.".

Use something else when:

- the affix is a control, such as a button or a select: it is not part of
  this component;
- the text must be read out or is needed to understand the field: put it in
  the `pathable-label` or a `pathable-hint`;
- the input is for search: use `pathable-search`.

## Example

<!-- package: styles -->

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- /package -->

<!-- css-files -->

<!-- example: prefix-icon -->

## States

Each state is complete markup for one use of the group. Copy the one closest
to what you need.

<!-- examples -->

## Variants

Add at most one modifier from each axis to `pathable-input-group`.

| Axis  | Value     | Class                           | What it is for                                     |
| ----- | --------- | ------------------------------- | -------------------------------------------------- |
| state | `default` | none                            | A field that has no message about its value        |
| state | `error`   | `pathable-input-group--error`   | A value that failed validation; a red 4 px border  |
| state | `success` | `pathable-input-group--success` | A value that has been checked; a green 4 px border |
| width | `default` | none                            | A group as wide as its container, up to 30rem      |
| width | `2xs`     | `pathable-input-group--2xs`     | A value of about 5 characters                      |
| width | `xs`      | `pathable-input-group--xs`      | A value of about 9 characters, such as hours       |
| width | `sm`      | `pathable-input-group--sm`      | A value of about 13 characters                     |
| width | `small`   | `pathable-input-group--small`   | An alias of `sm`                                   |
| width | `md`      | `pathable-input-group--md`      | A value of about 20 characters                     |
| width | `medium`  | `pathable-input-group--medium`  | An alias of `md`                                   |
| width | `lg`      | `pathable-input-group--lg`      | A value of about 30 characters                     |
| width | `xl`      | `pathable-input-group--xl`      | A value of about 40 characters                     |
| width | `2xl`     | `pathable-input-group--2xl`     | A value of about 50 characters                     |

The modifiers go on `pathable-input-group`, not on `pathable-input`. The
form caps every group at its own width too: from a 480 px viewport a
`pathable-form` is at most 20rem wide, so there an `xl` or `2xl` group is as
wide as the form. Below 480 px the form fills its container, and a group is
as wide as the form only when its own cap is wider.

The prefix and suffix text uses the muted text colour, kept at 4.5:1 or more
against white for the affix-contrast guarantee.

## Composition

- `pathable-form`: the form that holds the label and the group.
- `pathable-input-group`: the wrapper, a `<div>` after the label.
- `pathable-input-prefix`: first child, before the `<input>`. It holds an icon or
  a short text such as a currency symbol, and takes `aria-hidden="true"`.
- `pathable-input-suffix`: last child, after the `<input>`. It holds a short
  unit and takes `aria-hidden="true"`. It must follow the input directly,
  because the disabled look is applied from the input to the suffix next to it.
- Use one prefix or one suffix in a group, and keep it short: the input leaves
  2.5rem for it, enough for an icon, a symbol or a unit of a few letters.
- The input is a `pathable-input` with a type of `text`, `tel` or similar;
  inside the group it loses its own border, so the group's border is the only one.
- An icon prefix holds an `<svg>` with `pathable-icon`, `aria-hidden="true"`,
  `role="img"` and `focusable="false"`, whose `<use>` references a symbol of
  the sprite, as described on the Icon page.
- Put the `pathable-label` before the group. For the error state add a
  `pathable-error-message` before the group, and tie it to the input with
  `aria-describedby` and `aria-invalid="true"`.
- The disabled look follows the input: `disabled` or `aria-disabled="true"` on
  the input dims the affix and changes the border in high-contrast mode.
- The group is not an `<input>` itself, so the label's `for` points at the
  input, not the group.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour.

The pixel figures assume a 16 px root font size.

## The consumer owns

- The meaning. The affix is hidden from assistive technology, so a unit or
  symbol that matters, such as "in pounds" or "in dollars", is in the label
  text: "Weight, in pounds".
- The `<label>`, its `for` and the input's `id`, `name`, `type`, `inputmode` and
  `autocomplete`.
- The error message, `aria-invalid` and `aria-describedby`. The error modifier
  draws a border and nothing more; colour is never the only cue.
- Disabled state, validation and the format of the value.
- Not putting a button, link or other focusable element in the affix.
