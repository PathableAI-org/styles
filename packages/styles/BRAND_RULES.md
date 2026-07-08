# PathAble Brand Rules

This document defines the core color and typography rules for PathAble visual design. These rules are derived from the PathAble visual brand guide and should be used when creating interfaces, documents, presentations, marketing materials, and design-system components.

## Brand Personality

PathAble typography and color should feel:

- Bold
- Friendly
- Balanced
- Functional
- Clear
- Accessible

Visual design should support trust, clarity, and human connection. Brand expression should never make content harder to understand or use.

## Color Palette

| Name               |       Hex |                  RGB |                 CMYK | Pantone  |
| ------------------ | --------: | -------------------: | -------------------: | -------- |
| Intelligent Jade   | `#1cae96` |  `rgb(28, 174, 150)` |  `84%, 0%, 14%, 32%` | `3272 C` |
| PathAble Blue      | `#00365c` |     `rgb(0, 54, 92)` | `100%, 41%, 0%, 64%` | `541 C`  |
| Bright Blue Brooks | `#4899e8` |  `rgb(72, 153, 232)` |   `69%, 34%, 0%, 9%` | `2727 C` |
| Tech Teal          | `#015a76` |    `rgb(1, 90, 118)` |  `99%, 24%, 0%, 54%` | `3025 C` |
| Lived-In Lime      | `#d3ff66` | `rgb(211, 255, 102)` |   `17%, 0%, 60%, 0%` | `388 C`  |
| Shilling Silver    | `#dde2e8` | `rgb(221, 226, 232)` |     `5%, 3%, 0%, 9%` | `656 C`  |

## USWDS System Token Mapping

Each brand color is mapped to the closest USWDS v3.x system token. These mappings are configured in `src/_uswds-theme.scss` and are the single source of truth for theme color overrides.

| Brand Color        | Hex       | USWDS Theme Family | USWDS System Token | Mapped Hex | ΔE    |
| ------------------ | --------- | ------------------ | ------------------ | ---------- | ----- |
| PathAble Blue      | `#00365c` | Primary            | `blue-warm-80v`    | `#162e51`  | 5.56  |
| Intelligent Jade   | `#1cae96` | Secondary          | `mint-cool-30v`    | `#1dc2ae`  | 7.84  |
| Bright Blue Brooks | `#4899e8` | Accent-cool        | `blue-30v`         | `#58b4ff`  | 10.70 |
| Tech Teal          | `#015a76` | Accent-cool-dark   | `cyan-60v`         | `#00687d`  | 8.10  |
| Lived-In Lime      | `#d3ff66` | Accent-warm        | `green-warm-10v`   | `#e7f434`  | 18.97 |
| Shilling Silver    | `#dde2e8` | Base               | `gray-cool-10`     | `#dfe1e2`  | 2.79  |

**ΔE (deltaE 1976)**: Perceptual color distance. Values below 10 are imperceptible to most viewers. Lived-In Lime has the furthest match (ΔE 18.97) — documented as an anticipated edge case.

## Color Hierarchy

PathAble Blue, Intelligent Jade, and Bright Blue Brooks are the primary brand colors and should appear most prominently.

Tech Teal, Lived-In Lime, and Shilling Silver are supporting colors and should usually be used as accents, backgrounds, borders, or secondary visual elements.

Secondary colors should not dominate the primary palette.

## Tertiary Colors

Tertiary colors are derived from brand colors at `10%` opacity. They are intended for subtle backgrounds, low-impact decorative areas, and icon backgrounds.

Recommended tertiary colors:

| Name                   | Source                     |
| ---------------------- | -------------------------- |
| Bright Blue Brooks 10% | `rgba(72, 153, 232, 0.1)`  |
| Shilling Silver 10%    | `rgba(221, 226, 232, 0.1)` |
| Intelligent Jade 10%   | `rgba(28, 174, 150, 0.1)`  |

Tertiary colors should add character without reducing readability.

## Color Pairing

The strongest general-purpose pairing is:

| Background      | Foreground    | Usage                                               |
| --------------- | ------------- | --------------------------------------------------- |
| Shilling Silver | PathAble Blue | Preferred high-legibility pairing for web and print |

Other approved pairings include:

| Background             | Foreground               | Usage                                |
| ---------------------- | ------------------------ | ------------------------------------ |
| PathAble Blue          | White or Shilling Silver | Strong contrast                      |
| Tech Teal              | White                    | Strong contrast                      |
| Intelligent Jade       | White                    | Strong contrast                      |
| Bright Blue Brooks     | White                    | Use when contrast remains sufficient |
| Dark brand backgrounds | Lived-In Lime            | Accent or highlight only             |

Lived-In Lime may be used as an accent on darker backgrounds to highlight key words, focus states, or important moments. It should be used sparingly.

Lived-In Lime is better suited for print or large accent use than for small web text, because it may lack sufficient contrast in some combinations.

## Accessibility

Small text must use high-contrast foreground and background combinations.

Lower-contrast combinations should be avoided for small text below `18pt`. Lower-contrast combinations may be used for large text `18pt+` or bold text `14pt+` when readability remains strong.

Text over textured backgrounds must meet the same contrast expectations as text over flat backgrounds.

When brand expression and accessibility conflict, accessibility takes priority.

## Typography

| Use               | Font         | Weight    |
| ----------------- | ------------ | --------- |
| Heading           | `Fredoka`    | `Regular` |
| Alternate Heading | `Montserrat` | `Bold`    |
| Subheading        | `Poppins`    | `Bold`    |
| Body Text         | `Nunito`     | `Regular` |

## USWDS Typography Token Mapping

### Brand Typeface → USWDS Role Mapping

| Brand Font | Weight                        | USWDS Role          | Custom Typeface Token | Font Stack                            |
| ---------- | ----------------------------- | ------------------- | --------------------- | ------------------------------------- |
| Fredoka    | Regular (400)                 | heading             | `fredoka`             | `'Fredoka', system-ui, sans-serif`    |
| Nunito     | Regular (400), SemiBold (600) | body, ui            | `nunito`              | `'Nunito', system-ui, sans-serif`     |
| Montserrat | Bold (700)                    | alt                 | `montserrat`          | `'Montserrat', system-ui, sans-serif` |
| Poppins    | Bold (700)                    | — (subheading only) | `poppins`             | `'Poppins', system-ui, sans-serif`    |

> **Note:** USWDS supports a single `alt` role. Montserrat is assigned to that role via the `cond` font type. Poppins is available as a design token (`--pathable-font-subheading`) for subheading use but is not assigned to any USWDS role.

### Type Scale Mapping

| PathAble Token        | Size | USWDS System Token | USWDS Theme Token | Notes                                        |
| --------------------- | ---- | ------------------ | ----------------- | -------------------------------------------- |
| display-lg            | 32px | 12                 | xl                | Default — unchanged                          |
| heading-lg            | 24px | 10                 | lg                | Customized from default 9 (22px)             |
| heading-md            | 20px | 8                  | (none)            | No theme token — use system token 8 directly |
| heading-sm / body-lg  | 18px | 7                  | md                | Customized from default 6 (17px)             |
| body-md               | 16px | 5                  | sm                | Default — unchanged                          |
| body-sm / label-md    | 14px | 3                  | 2xs               | Default — unchanged                          |
| label-sm / caption-md | 12px | 1                  | 3xs               | Customized from default 2 (13px)             |

### Heading Size Assignments

| Element | USWDS Theme Token | Size |
| ------- | ----------------- | ---- |
| Display | xl                | 32px |
| h1      | lg                | 24px |
| h2      | md                | 18px |
| h3      | md                | 18px |
| h4      | sm                | 16px |
| h5      | 2xs               | 14px |
| h6      | 3xs               | 12px |
| Body    | sm                | 16px |

### Line-Height Settings

- `$theme-body-line-height: 5` (1.62)
- `$theme-heading-line-height: 3` (1.35)
- `$theme-lead-line-height: 6` (1.75)

## Typography Hierarchy

Headings should be the most prominent text element.

Subheadings and body text should scale down naturally from headings to create a clear hierarchy.

Anything longer than one sentence should use body text styling.

Headings and subheadings should be reserved for shorter, more prominent statements.

Highlights should be used sparingly to draw attention where needed.

## Typography Violations

Do not use the heading typeface for long sections of text.

Do not center sections of body text longer than 3 lines.

Do not create long unbroken areas of text.

Do not format body text in all caps.

Do not crowd text. Preserve breathing room around text blocks and UI elements.

Do not break the intended hierarchy by making body text visually compete with headings.

## Themes

The brand guide defines the core palette but does not define complete light, dark, or high-contrast themes.

Themes should be implemented through semantic tokens such as:

```css
--pathable-color-bg
--pathable-color-surface
--pathable-color-text
--pathable-color-text-muted
--pathable-color-border
--pathable-color-link
--pathable-color-accent
--pathable-color-focus-ring
```

Brand colors may be used to generate theme candidates, but generated themes should be reviewed before being treated as official.

Dark themes should preserve PathAble Blue as a dominant background family where possible.

High-contrast themes should prioritize readability and WCAG contrast over subtle brand expression.

## Utility Classes

The `@pathable/styles` package generates `.pathable-*` CSS utility classes. See `packages/styles/AGENTS.md` for the complete utility module reference.

### Common Utility Class Examples

| Purpose            | Class                            | Effect                   |
| ------------------ | -------------------------------- | ------------------------ |
| Primary background | `.pathable-bg-primary`           | PathAble Blue background |
| Surface background | `.pathable-bg-surface`           | White surface background |
| Primary text       | `.pathable-text-primary`         | PathAble Blue text       |
| Body font          | `.pathable-font-family-body`     | Nunito font              |
| Heading font       | `.pathable-font-family-heading`  | Fredoka font             |
| Spacing            | `.pathable-padding-2`            | 8px padding all sides    |
| Spacing            | `.pathable-padding-4`            | 16px padding all sides   |
| Spacing            | `.pathable-margin-top-2`         | 8px top margin           |
| Layout             | `.pathable-display-flex`         | Flex container           |
| Alignment          | `.pathable-flex-align-center`    | Center alignment         |
| Alignment          | `.pathable-flex-justify-between` | Space between            |
| Border             | `.pathable-border-1`             | 1px border               |
| Border radius      | `.pathable-border-radius-sm`     | 4px border radius        |

### Responsive Variants

Use breakpoint prefixes for responsive layouts:

```html
<div
  class="pathable-padding-1 tablet:pathable-padding-4 desktop:pathable-padding-8"
>
  Responsive padding
</div>
```

Breakpoints: `mobile-lg` (480px), `tablet` (640px), `desktop` (1024px).

## USWDS Component Wrappers

This package provides `.pathable-{component}` CSS class wrappers for all USWDS components. Most `.pathable-{component}` classes resolve to the same computed styles as the corresponding `.usa-{component}` class via SCSS `@extend`. Some components (noted below) do not emit a base class because USWDS does not define one for the corresponding component — in those cases the wrapper only provides child element classes or forwards the USWDS bundle for selective import.

### Component Wrapper Naming Convention

| Component          | PathAble Class                 | USWDS Equivalent          | Notes |
| ------------------ | ------------------------------ | ------------------------- | ----- |
| accordion          | `.pathable-accordion`          | `.usa-accordion`          | |
| alert              | `.pathable-alert`              | `.usa-alert`              | |
| banner             | `.pathable-banner`             | `.usa-banner`             | |
| breadcrumb         | `.pathable-breadcrumb`         | `.usa-breadcrumb`         | |
| button             | `.pathable-button`             | `.usa-button`             | |
| button-group       | `.pathable-button-group`       | `.usa-button-group`       | |
| card               | `.pathable-card`               | `.usa-card`               | |
| character-count    | —                              | —                         | USWDS has no base class; only `__status` selectors |
| checkbox           | `.pathable-checkbox__*`        | `.usa-checkbox__*`        | USWDS has no base `.usa-checkbox` class; only element selectors |
| checklist          | `.pathable-checklist`          | `.usa-checklist`          | |
| collection         | `.pathable-collection`         | `.usa-collection`         | |
| combo-box          | `.pathable-combo-box`          | `.usa-combo-box`          | |
| content            | `.pathable-content`            | `.usa-content`            | |
| dark-background    | `.pathable-dark-background`    | `.usa-dark-background`    | |
| date-picker        | —                              | —                         | USWDS has no base class; only child/state selectors |
| date-range-picker  | —                              | —                         | JS-only component; no CSS class defined |
| display            | `.pathable-display`            | `.usa-display`            | |
| embed-container    | `.pathable-embed-container`    | `.usa-embed-container`    | |
| error-message      | `.pathable-error-message`      | `.usa-error-message`      | |
| fieldset           | `.pathable-fieldset`           | `.usa-fieldset`           | |
| file-input         | `.pathable-file-input`         | `.usa-file-input`         | |
| footer             | `.pathable-footer`             | `.usa-footer`             | |
| form               | `.pathable-form`               | `.usa-form`               | |
| form-group         | `.pathable-form-group`         | `.usa-form-group`         | |
| graphic-list       | `.pathable-graphic-list`       | `.usa-graphic-list`       | |
| header             | `.pathable-header`             | `.usa-header`             | |
| hero               | `.pathable-hero`               | `.usa-hero`               | |
| hint               | `.pathable-hint`               | `.usa-hint`               | |
| icon               | `.pathable-icon`               | `.usa-icon`               | |
| icon-list          | `.pathable-icon-list`          | `.usa-icon-list`          | |
| identifier         | `.pathable-identifier`         | `.usa-identifier`         | |
| in-page-navigation | `.pathable-in-page-navigation` | `.usa-in-page-nav`        | |
| input              | `.pathable-input`              | `.usa-input`              | |
| input-mask         | `.pathable-input-mask`         | `.usa-input-mask`         | |
| input-prefix-suffix| `.pathable-input-prefix-suffix`| `.usa-input-group`        | Maps to `.usa-input-group` (the USWDS base class) |
| intro              | `.pathable-intro`              | `.usa-intro`              | |
| label              | `.pathable-label`              | `.usa-label`              | |
| language-selector  | `.pathable-language-selector`  | `.usa-language`           | Maps to `.usa-language` (the USWDS base class) |
| layout-docs        | `.pathable-layout-docs`        | `.usa-layout-docs`        | |
| layout-grid        | `.pathable-grid-*`             | `.grid-*`                 | |
| legend             | `.pathable-legend`             | `.usa-legend`             | |
| link               | `.pathable-link`               | `.usa-link`               | |
| list               | `.pathable-list`               | `.usa-list`               | |
| media-block        | `.pathable-media-block`        | `.usa-media-block`        | |
| memorable-date     | `.pathable-memorable-date`     | `.usa-memorable-date`     | |
| modal              | `.pathable-modal`              | `.usa-modal`              | |
| nav                | `.pathable-nav`                | `.usa-nav`                | |
| pagination         | `.pathable-pagination`         | `.usa-pagination`         | |
| paragraph          | `.pathable-paragraph`          | `.usa-paragraph`          | |
| process-list       | `.pathable-process-list`       | `.usa-process-list`       | |
| prose              | `.pathable-prose`              | `.usa-prose`              | |
| radio              | `.pathable-radio__*`           | `.usa-radio__*`           | USWDS has no base `.usa-radio` class; only element selectors |
| range              | `.pathable-range`              | `.usa-range`              | |
| search             | `.pathable-search`             | `.usa-search`             | |
| section            | `.pathable-section`            | `.usa-section`            | |
| select             | `.pathable-select`             | `.usa-select`             | |
| sidenav            | `.pathable-sidenav`            | `.usa-sidenav`            | |
| site-alert         | `.pathable-site-alert`         | `.usa-site-alert`         | |
| site-title         | —                              | —                         | No CSS class defined; `.usa-logo` / `.usa-logo__text` used in template |
| skipnav            | `.pathable-skipnav`            | `.usa-skipnav`            | |
| step-indicator     | `.pathable-step-indicator`     | `.usa-step-indicator`     | |
| summary-box        | `.pathable-summary-box`        | `.usa-summary-box`        | |
| table              | `.pathable-table`              | `.usa-table`              | |
| tag                | `.pathable-tag`                | `.usa-tag`                | |
| textarea           | `.pathable-textarea`           | `.usa-textarea`           | |
| time-picker        | `.pathable-time-picker`        | `.usa-time-picker`        | |
| tooltip            | `.pathable-tooltip`            | `.usa-tooltip`            | |
| validation         | —                              | —                         | JS-only bundle; forwards form component styles |

### Component Wrapper Rules

- Use `.pathable-{component}` classes in HTML/Astro templates instead of `.usa-{component}` classes when a wrapper exists.
- Use `.pathable-{component}__{element}` for child element classes (e.g., `.pathable-card__header`, `.pathable-card__body`).
- Use `.pathable-{component}--{modifier}` for modifier variants (e.g., `.pathable-button--outline`, `.pathable-table--borderless`).
- For components where USWDS does not define a base class (character-count, checkbox, radio, date-picker, date-range-picker, site-title, validation), the wrapper provides element-level selectors or forwards the USWDS bundle — use the available `.pathable-{component}__{element}` classes directly.
- For JS-driven components (accordion, banner, character-count, combo-box, date-picker, date-range-picker, file-input, header, in-page-navigation, input-mask, language-selector, modal, nav, site-alert, time-picker, tooltip, validation), keep `.usa-{component}` on the DOM element AND add `.pathable-{component}` as an additional class — the USWDS JavaScript selects DOM nodes by `.usa-*` class names, and removing them would break interactivity.
- Use `--pathable-{component}-{property}` and `--usa-{component}-{property}` CSS custom properties as alternatives to the class-based components.
