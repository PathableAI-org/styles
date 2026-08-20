# Capability Inventory: @pathable/styles Utility Classes

**Feature**: `specs/044-semantic-prop-foundation`
**Source**: `packages/styles/src/_utilities.scss` (`$pathable-utilities` config map)
**Generated**: 2026-08-19

This document inventories every utility CSS class family emitted by `@pathable/styles`, organized by semantic capability. Each entry is verified against the SCSS source (not assumed). Gaps are recorded where a recognized semantic role lacks a corresponding utility class.

---

## Sizing

| Module Key | Class Prefix     | CSS Property | Values                                                                      | Responsive |
| ---------- | ---------------- | ------------ | --------------------------------------------------------------------------- | ---------- |
| `width`    | `pathable-width` | `width`      | `auto`, `full`                                                              | Yes        |
| `maxw`     | `pathable-maxw`  | `max-width`  | `mobile` (320px), `mobile-lg` (480px), `tablet` (640px), `desktop` (1024px) | No         |

**Owning source**: `packages/styles/src/_utilities.scss`

---

## Spacing

### Padding

| Module Key  | Class Prefix         | CSS Property                    | Values         | Responsive |
| ----------- | -------------------- | ------------------------------- | -------------- | ---------- |
| `padding`   | `pathable-padding`   | `padding`                       | `0`–`10`, `15` | Yes        |
| `padding-x` | `pathable-padding-x` | `padding-left`, `padding-right` | `0`–`10`, `15` | Yes        |
| `padding-y` | `pathable-padding-y` | `padding-top`, `padding-bottom` | `0`–`10`, `15` | Yes        |

### Margin

| Module Key      | Class Prefix             | CSS Property                  | Values         | Responsive |
| --------------- | ------------------------ | ----------------------------- | -------------- | ---------- |
| `margin`        | `pathable-margin`        | `margin`                      | `0`–`10`, `15` | Yes        |
| `margin-x`      | `pathable-margin-x`      | `margin-left`, `margin-right` | `0`–`10`, `15` | Yes        |
| `margin-y`      | `pathable-margin-y`      | `margin-top`, `margin-bottom` | `0`–`10`, `15` | Yes        |
| `margin-top`    | `pathable-margin-top`    | `margin-top`                  | `0`–`10`, `15` | Yes        |
| `margin-bottom` | `pathable-margin-bottom` | `margin-bottom`               | `0`–`10`, `15` | Yes        |

**Owning source**: `packages/styles/src/_utilities.scss`

---

## Display

| Module Key | Class Prefix       | CSS Property | Values                                            | Responsive |
| ---------- | ------------------ | ------------ | ------------------------------------------------- | ---------- |
| `display`  | `pathable-display` | `display`    | `flex`, `block`, `inline`, `inline-block`, `none` | Yes        |

**Owning source**: `packages/styles/src/_utilities.scss`

---

## Alignment

| Module Key        | Class Prefix            | CSS Property      | Values                                          | Responsive |
| ----------------- | ----------------------- | ----------------- | ----------------------------------------------- | ---------- |
| `align-items`     | `pathable-flex-align`   | `align-items`     | `center`, `start`, `end`, `stretch`, `baseline` | Yes        |
| `justify-content` | `pathable-flex-justify` | `justify-content` | `center`, `start`, `end`, `between`, `around`   | Yes        |
| `text-align`      | `pathable-text`         | `text-align`      | `center`, `left`, `right`                       | Yes        |

**Owning source**: `packages/styles/src/_utilities.scss`

> **Note**: `pathable-text` class prefix is shared with text-color and text-weight modules. Disambiguation is by function name in the resolver layer (`textColorClass`, `fontWeightClass`, `textAlignClass`).

---

## Visibility

**STATUS: GAP** — No utility classes exist for `visibility`, `opacity`, or `z-index`.

---

## Flex / Grid Participation

| Module Key | Class Prefix    | CSS Property | Values                              | Responsive |
| ---------- | --------------- | ------------ | ----------------------------------- | ---------- |
| `flex`     | `pathable-flex` | `flex`       | `1` (`1 1 0%`), `fill` (`1 1 auto`) | Yes        |

**Owning source**: `packages/styles/src/_utilities.scss`

**Gaps**:

- No individual `flex-grow`, `flex-shrink`, `flex-basis`, or `order` utilities
- No grid utilities (`grid-template-*`, `grid-column`, `grid-row`, `place-*`, `gap`)

---

## Typography

| Module Key    | Class Prefix           | CSS Property  | Values                           | Responsive |
| ------------- | ---------------------- | ------------- | -------------------------------- | ---------- |
| `font-family` | `pathable-font-family` | `font-family` | `heading`, `body`, `mono`, `alt` | No         |
| `text-weight` | `pathable-text`        | `font-weight` | `normal`, `semibold`, `bold`     | No         |

**Owning source**: `packages/styles/src/_utilities.scss`

**Gaps**:

- No `font-size` utility
- No `line-height` utility
- No `letter-spacing` utility
- No `text-transform` utility
- No `text-decoration` utility

> **Note**: Text color from the `text` module is grouped under Color/Tone for semantic clarity.

---

## Color / Tone

### Background

| Module Key | Class Prefix  | CSS Property       | Values                                                                                           | Responsive | State Variants   |
| ---------- | ------------- | ------------------ | ------------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| `bg`       | `pathable-bg` | `background-color` | `primary`, `base`, `surface`, `accent`, `link`, `focus-ring`, `danger`, `success`, `transparent` | No         | `hover`, `focus` |

### Text Color

| Module Key | Class Prefix    | CSS Property | Values                                                | Responsive | State Variants   |
| ---------- | --------------- | ------------ | ----------------------------------------------------- | ---------- | ---------------- |
| `text`     | `pathable-text` | `color`      | `base`, `primary`, `muted`, `accent`, `link`, `white` | No         | `hover`, `focus` |

**Owning source**: `packages/styles/src/_utilities.scss`

> **Note**: `hover:` and `focus:` state variants are emitted in CSS but are NOT handled by the initial resolver layer (see research.md Decision 7: Responsive Variant Handling).

---

## Border

| Module Key      | Class Prefix             | CSS Property    | Values           | Responsive |
| --------------- | ------------------------ | --------------- | ---------------- | ---------- |
| `border`        | `pathable-border`        | `border`        | `0`–`5` (px)     | No         |
| `border-radius` | `pathable-border-radius` | `border-radius` | `sm`, `md`, `lg` | No         |

**Owning source**: `packages/styles/src/_utilities.scss`

> **Note**: Border and border-radius utilities are present in SCSS but are not yet mapped to semantic props in this feature. They represent a future semantic capability group.

---

## Gap Summary

| Desired Capability                                                                     | Gap                                                                        |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `min-width`                                                                            | No utility class exists                                                    |
| Visibility (`visibility`, `opacity`, `z-index`)                                        | No utility classes exist                                                   |
| Font size                                                                              | No utility class exists                                                    |
| Line height                                                                            | No utility class exists                                                    |
| Letter spacing                                                                         | No utility class exists                                                    |
| Text transform                                                                         | No utility class exists                                                    |
| Text decoration                                                                        | No utility class exists                                                    |
| Grid (`grid-template-*`, `grid-column`, `grid-row`, `place-*`, `gap`)                  | No utility classes exist                                                   |
| Individual flex properties (`flex-grow`, `flex-shrink`, `flex-basis`, `order`)         | Only `flex-1` and `flex-fill` shorthand exists                             |
| Padding directional (`padding-top`, `padding-bottom`, `padding-left`, `padding-right`) | Only `padding`, `padding-x`, `padding-y` exist                             |
| Margin directional (`margin-left`, `margin-right`)                                     | Only `margin`, `margin-x`, `margin-y`, `margin-top`, `margin-bottom` exist |
| Border utilities                                                                       | Present in SCSS but not yet mapped to semantic props                       |
| Border-radius utilities                                                                | Present in SCSS but not yet mapped to semantic props                       |

---

## Verified Capability Groups (for Resolver Implementation)

| #   | Capability | Modules                                                                              | Has Resolvers |
| --- | ---------- | ------------------------------------------------------------------------------------ | ------------- |
| 1   | Sizing     | width, maxw                                                                          | Yes           |
| 2   | Spacing    | padding, padding-x, padding-y, margin, margin-x, margin-y, margin-top, margin-bottom | Yes           |
| 3   | Display    | display                                                                              | Yes           |
| 4   | Alignment  | align-items, justify-content, text-align                                             | Yes           |
| 5   | Visibility | (none — gap)                                                                         | No            |
| 6   | Flex/Grid  | flex                                                                                 | Yes           |
| 7   | Typography | font-family, text-weight                                                             | Yes           |
| 8   | Color/Tone | bg, text (color)                                                                     | Yes           |

---

## Component Semantic-Prop Support Matrix

**Feature**: `specs/046-form-control-button-sizing` (slice 03)

This matrix records which `@pathable/react` components support which semantic sizing props. Supported = ✅, Not yet supported = —, Not applicable = N/A.

| Component | `width` | `maxWidth` | Notes                                             |
| --------- | ------- | ---------- | ------------------------------------------------- |
| Card      | ✅      | ✅         | Slice 02 (`specs/045-card-sizing-spacing`)        |
| Button    | ✅      | ✅         | Slice 03 (`specs/046-form-control-button-sizing`) |
| Input     | ✅      | ✅         | Slice 03 (`specs/046-form-control-button-sizing`) |
| Select    | ✅      | ✅         | Slice 03 (`specs/046-form-control-button-sizing`) |
| Textarea  | ✅      | ✅         | Slice 03 (`specs/046-form-control-button-sizing`) |
| Accordion | —       | —          | Not yet evaluated                                 |
| Alert     | —       | —          | Not yet evaluated                                 |

**Note**: `minWidth` is not yet supported on any component — no `min-width` utility class exists in `@pathable/styles`. See Gap Summary above.
