---
name: InputPrefixSuffix
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
    values: [default, xs, sm, md, lg]
guarantees:
  - id: group-box
    status: unverified
    claim: The group is a flex row, 2.5rem (40 px at a 16 px root) tall, at most 30rem (480 px) wide, with a 1 px border in the input border colour, a 0.5rem top margin and no padding, and its input has no border of its own.
  - id: prefix-position
    status: unverified
    claim: A prefix is absolutely placed at the start of the group with 0.5rem (8 px) of padding on each side, and the input after it has 2.5rem of left padding so its text starts after the prefix.
  - id: suffix-position
    status: unverified
    claim: A suffix is absolutely placed at the end of the group with 0.5rem (8 px) of padding on each side, and the input has 2.5rem of right padding so its text stops before the suffix.
  - id: affix-no-select
    status: unverified
    claim: The prefix and suffix cannot be selected with the pointer and their text stays on one line.
  - id: disabled-affix
    status: unverified
    claim: A prefix that is followed by, or a suffix that follows, a disabled input or an input with aria-disabled="true" takes the disabled look, a grey #c9c9c9 background with a not-allowed cursor.
  - id: affix-contrast
    status: unmet
    claim: The prefix and suffix text and icon have a contrast of at least 4.5:1 against the white input background; today they are drawn in #dde2e8, which is about 1.3:1.
  - id: prefix-icon-size
    status: unmet
    claim: A pathable-icon inside a pathable-input-prefix or pathable-input-suffix is 1.5rem (24 px) square; today it is 1em square, because the size rule reaches only the unprefixed icon class.
  - id: error-modifier
    status: unmet
    claim: With pathable-input-group--error, the group has a 0.25rem (4 px) solid #a52834 border; the class is not in the stylesheet yet.
  - id: success-modifier
    status: unmet
    claim: With pathable-input-group--success, the group has a 0.25rem (4 px) solid #1cae96 border; the class is not in the stylesheet yet.
  - id: width-modifiers
    status: unmet
    claim: The modifiers xs, sm, md and lg cap the group at 9ex, 13ex, 20ex and 30ex; the classes are not in the stylesheet yet.
---

# InputPrefixSuffix

A bordered group that holds a text input with a decorative prefix or suffix,
such as an icon or a unit, set inside its border. Put `pathable-input-group` on
a `<div>` around a `pathable-input` and one `pathable-input-prefix` or
`pathable-input-suffix`. The group draws the border; the affix is
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

<!-- example: prefix-icon -->

## States

Each state is complete markup for one use of the group. Copy the one closest
to what you need.

<!-- examples -->

## Variants

Add at most one modifier from each axis to `pathable-input-group`. The error,
success and width modifiers are the target: they are not in the stylesheet
yet (see Guarantees).

| Axis  | Value     | Class                           | What it is for                                     |
| ----- | --------- | ------------------------------- | -------------------------------------------------- |
| state | `default` | none                            | A field that has no message about its value        |
| state | `error`   | `pathable-input-group--error`   | A value that failed validation; a red 4 px border  |
| state | `success` | `pathable-input-group--success` | A value that has been checked; a green 4 px border |
| width | `default` | none                            | A group as wide as its container, up to 30rem      |
| width | `xs`      | `pathable-input-group--xs`      | A value of about 9 characters, such as hours       |
| width | `sm`      | `pathable-input-group--sm`      | A value of about 13 characters                     |
| width | `md`      | `pathable-input-group--md`      | A value of about 20 characters                     |
| width | `lg`      | `pathable-input-group--lg`      | A value of about 30 characters                     |

Wider and narrower sizes, such as `2xs`, `xl` and `2xl`, are not part of this
component.

The modifiers go on `pathable-input-group`, not on `pathable-input`.

## Tokens

None. The colours, sizes and spacing are fixed values in the compiled
stylesheet, not custom properties, so a theme does not change them.

## Composition

- `pathable-input-group`: the wrapper. `pathable-input-prefix-suffix` is a second
  name for the same block; use `pathable-input-group` in new markup.
- `pathable-input-prefix`: first child, before the `<input>`. It holds an icon or
  a short text such as a currency symbol, and takes `aria-hidden="true"`.
- `pathable-input-suffix`: last child, after the `<input>`. It holds a short
  unit and takes `aria-hidden="true"`. It must follow the input directly,
  because the disabled look is applied from the input to the suffix next to it.
- Use one prefix or one suffix in a group.
- The input is a `pathable-input` with a type of `text`, `tel` or similar;
  inside the group it loses its own border, so the group's border is the only one.
- An icon prefix holds an inline SVG with `pathable-icon`, `aria-hidden="true"`
  and `focusable="false"`. The package ships no icon sprite, so draw the icon
  inline. Until `prefix-icon-size` is met the icon is 1em, which is about 16 px.
- Put the group in a `pathable-form-group` with its `pathable-label`. For the error
  state add a `pathable-error-message` before the group, and tie it to the input
  with `aria-describedby` and `aria-invalid="true"`.
- The disabled look follows the input: `disabled` or `aria-disabled="true"` on
  the input dims the affix and changes the border in high-contrast mode.
- The group is not an `<input>` itself, so the label's `for` points at the
  input, not the group.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

Today the prefix and suffix are drawn in #dde2e8, which is too pale to read on
a white input; the affix is decorative, but a visible unit still needs
contrast. The error, success and width modifiers have no `pathable-*` class
yet, so the examples that use them show the target and do not style the group.

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
