---
name: Color state tokens
slug: tokens-color-state-tokens
kind: token
summary: The colour tokens error, warning, success, info, disabled and emergency, which carry the meaning of a status, with PathAble brand values for the base, dark and lighter grades.
uswds: https://designsystem.digital.gov/design-tokens/color/state-tokens/
guarantees:
  - id: error-grades
    status: unverified
    claim: The classes bg-error-lighter, bg-error-light, bg-error, bg-error-dark and bg-error-darker set background-color to #fcebec, #f39268, #dc3545, #a52834 and #6f3331.
  - id: warning-grades
    status: unverified
    claim: The classes bg-warning-lighter, bg-warning-light, bg-warning, bg-warning-dark and bg-warning-darker set background-color to #fef6e9, #fee685, #f5a623, #c4851c and #936f38.
  - id: success-grades
    status: unverified
    claim: The classes bg-success-lighter, bg-success-light, bg-success, bg-success-dark and bg-success-darker set background-color to #e8f7f4, #70e17b, #1cae96, #0d7a63 and #216e1f.
  - id: info-grades
    status: unverified
    claim: The classes bg-info-lighter, bg-info-light, bg-info, bg-info-dark and bg-info-darker set background-color to #edf5fd, #99deea, #4899e8, #015a76 and #2e6276.
  - id: disabled-grades
    status: unverified
    claim: The classes bg-disabled-lighter, bg-disabled-light, bg-disabled, bg-disabled-dark and bg-disabled-darker set background-color to #c9c9c9, #919191, #757575, #454545 and #1b1b1b.
  - id: emergency-tokens
    status: unverified
    claim: Only two emergency tokens exist, and bg-emergency and bg-emergency-dark set background-color to #9c3d10 and #332d29.
  - id: text-pairs
    status: unverified
    claim: Every swatch in the states of this page pairs its background with a text colour that has a contrast ratio of at least 4.5:1.
---

# Color state tokens

The colour tokens error, warning, success, info, disabled and emergency, which
carry the meaning of a status, with PathAble brand values for the base, dark
and lighter grades. A state token names a meaning, so `error` stays the error
colour even if a theme changes. See the
[USWDS state tokens](https://designsystem.digital.gov/design-tokens/color/state-tokens/).

## When to use

- Colouring a status: a validation message, an alert, a badge, a field border
  in error, a disabled control.
- Choosing the tint for an alert or message background: the `lighter` grade
  behind `text-ink`.

Use something else when:

- the colour is decoration or brand expression: use a
  [theme token](tokens-color-theme-tokens.md); `error` and `warning` are
  functional colours and are not for decoration;
- the meaning must be known without seeing colour: add text or an icon, as
  colour alone does not carry a status.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: error -->

## Tokens

The source column uses **Brand** for a brand-guide or design-system functional
colour, **Derived** for a tint or shade of one, and **USWDS default** for a
value the PathAble theme leaves alone.

| Token              | Value                        | Source        | Notes                                                       |
| ------------------ | ---------------------------- | ------------- | ----------------------------------------------------------- |
| `error-lighter`    | `#fcebec`                    | Derived       | Danger at 10% over white                                    |
| `error-light`      | `#f39268` (`red-warm-30v`)   | USWDS default |                                                             |
| `error`            | `#dc3545` Danger             | Brand         | 4.53:1 with white                                           |
| `error-dark`       | `#a52834`                    | Derived       |                                                             |
| `error-darker`     | `#6f3331` (`red-70`)         | USWDS default |                                                             |
| `warning-lighter`  | `#fef6e9`                    | Derived       |                                                             |
| `warning-light`    | `#fee685` (`yellow-10v`)     | USWDS default |                                                             |
| `warning`          | `#f5a623` Amber              | Brand         | Needs dark text: `text-black` is 10.36:1                    |
| `warning-dark`     | `#c4851c`                    | Derived       | Needs dark text: `text-black` is 6.72:1                     |
| `warning-darker`   | `#936f38` (`gold-50v`)       | USWDS default |                                                             |
| `success-lighter`  | `#e8f7f4`                    | Derived       |                                                             |
| `success-light`    | `#70e17b` (`green-cool-20v`) | USWDS default |                                                             |
| `success`          | `#1cae96` Intelligent Jade   | Brand         | White text fails (2.78:1); use `text-black`                 |
| `success-dark`     | `#0d7a63`                    | Derived       | 5.27:1 with white                                           |
| `success-darker`   | `#216e1f` (`green-cool-60v`) | USWDS default |                                                             |
| `info-lighter`     | `#edf5fd`                    | Derived       |                                                             |
| `info-light`       | `#99deea` (`cyan-20`)        | USWDS default |                                                             |
| `info`             | `#4899e8` Bright Blue Brooks | Brand         | White text is 3.00:1: large text only                       |
| `info-dark`        | `#015a76` Tech Teal          | Brand         |                                                             |
| `info-darker`      | `#2e6276` (`blue-cool-60`)   | USWDS default |                                                             |
| `disabled-lighter` | `#c9c9c9` (`gray-20`)        | USWDS default |                                                             |
| `disabled-light`   | `#919191` (`gray-40`)        | USWDS default |                                                             |
| `disabled`         | `#757575` (`gray-50`)        | USWDS default | 4.61:1 with white                                           |
| `disabled-dark`    | `#454545` (`gray-70`)        | USWDS default |                                                             |
| `disabled-darker`  | `#1b1b1b` (`gray-90`)        | USWDS default |                                                             |
| `emergency`        | `#9c3d10` (`red-warm-60v`)   | USWDS default | Only two emergency tokens: `emergency` and `emergency-dark` |
| `emergency-dark`   | `#332d29` (`red-warm-80`)    | USWDS default |                                                             |

The brand guide defines no red or amber: danger and amber are functional
colours added by the design system, for status only.

## Sass

```scss
@use '@pathableai/styles' as *;

.field-error {
  @include u-bg('error-lighter');
  @include u-border-color('error');
  @include u-text('ink');
  border-left-width: units(1);
  border-left-style: solid;
}
```

`color('error-dark')` and the other state names are valid anywhere `color()`
is. See [Color](tokens-color.md#sass).

## Utilities

State tokens are suffixes of the same colour classes as the theme tokens:
`bg-error`, `text-error-dark`, `border-warning`, `outline-info`,
`underline-success`. See [Color](utilities-color.md),
[Border](utilities-border.md), [Outline](utilities-outline.md) and
[Text styles](utilities-text-styles.md). Each accepts the `hover:` prefix.

## Settings

The PathAble theme sets the base, dark and lighter grades of four families and
leaves the rest at the USWDS defaults.

```scss
@use '@pathableai/styles' with (
  $theme-color-error-lighter: #fcebec,
  $theme-color-error: #dc3545,
  $theme-color-error-dark: #a52834,
  $theme-color-warning-lighter: #fef6e9,
  $theme-color-warning: #f5a623,
  $theme-color-warning-dark: #c4851c,
  $theme-color-success-lighter: #e8f7f4,
  $theme-color-success: #1cae96,
  $theme-color-success-dark: #0d7a63,
  $theme-color-info-lighter: #edf5fd,
  $theme-color-info: #4899e8,
  $theme-color-info-dark: #015a76
);
```

Not set, so at the USWDS default: `error-light` (`'red-warm-30v'`),
`error-darker` (`'red-70'`), `warning-light` (`'yellow-10v'`), `warning-darker`
(`'gold-50v'`), `success-light` (`'green-cool-20v'`), `success-darker`
(`'green-cool-60v'`), `info-light` (`'cyan-20'`), `info-darker`
(`'blue-cool-60'`), all five `disabled` grades (`'gray-20'`, `'gray-40'`,
`'gray-50'`, `'gray-70'`, `'gray-90'`), `$theme-color-emergency`
(`'red-warm-60v'`) and `$theme-color-emergency-dark` (`'red-warm-80'`).

## States

Each state is one status family, from its lightest to its darkest grade, with
the text class that keeps the pair at 4.5:1 or better.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour that was read from the package source and that no test
checks yet (`status: unverified`).

## The consumer owns

- Pairing every status colour with text or an icon that names the status.
- Choosing readable text for each background: `text-ink` on `lighter` and
  `light` grades, `text-white` on `error`, `error-dark`, `disabled` and darker
  grades, `text-black` on the `warning`, `warning-dark`, `success` and `info` base grades.
- Following the disabled convention of the control or component: the
  `disabled` tokens colour a control, but the `disabled` attribute or
  `aria-disabled` is what disables it.
