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

## USWDS Theme Colors

The USWDS theme in `src/_uswds-theme.scss` is configured with the exact brand hex values, so components built on USWDS render in the brand palette rather than the nearest USWDS system color. Each family's other grades are derived from its brand color:

- `lighter` grades are the brand color at 10% over white, the same as the tertiary colors below.
- `light` grades are the brand color at 40% over white.
- `dark` and `darker` grades are the brand color mixed with black, or another brand color where one fits the role.

| USWDS theme family | Brand grade                   | Derived grades                                                                                                |
| ------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Primary            | PathAble Blue `#00365c`       | lighter `#e6ebef`, light `#99afbe`, vivid Tech Teal `#015a76`, dark `#002845`, darker `#001e33`               |
| Secondary          | Intelligent Jade `#1cae96`    | lighter `#e8f7f4`, light `#a4dfd5`, dark `#0d7a63`, darker `#0d4e44`                                          |
| Accent-cool        | Bright Blue Brooks `#4899e8`  | lighter `#edf5fd`, light `#b6d6f6`, dark Tech Teal `#015a76`, darker PathAble Blue `#00365c`                  |
| Accent-warm        | Lived-In Lime `#d3ff66`       | lighter `#fbfff0`, light `#edffc2`, dark `#4a5924`, darker `#354019`                                          |
| Base               | Shilling Silver `#dde2e8`     | lightest `#f6f8f9`, lighter `#eef0f4`, light `#e6e9ee`, dark `gray-cool-60`, darker/darkest/ink PathAble Blue |
| Info               | Bright Blue Brooks `#4899e8`  | lighter `#edf5fd`, dark Tech Teal `#015a76`                                                                   |
| Success            | Intelligent Jade `#1cae96`    | lighter `#e8f7f4`, dark `#0d7a63`                                                                             |
| Warning            | Amber `#f5a623` (functional)  | lighter `#fef6e9`, dark `#c4851c`                                                                             |
| Error              | Danger `#dc3545` (functional) | lighter `#fcebec`, dark `#a52834`                                                                             |

USWDS links use Tech Teal (PathAble Blue on hover, `#002845` when active), and the USWDS focus outline uses Bright Blue Brooks, matching the internal `--pathable-color-link` and `--pathable-color-focus-ring` properties.

The breadcrumb separators and back arrow use the base family's dark grade (`gray-cool-60`, 6.7:1 on white), because USWDS's default, the base grade, is Shilling Silver here.

The shared PathAble focus outline (used by `.pathable-button`, `.pathable-input`, `.pathable-select` and `.pathable-textarea`) is drawn on the surface behind the control, so a coloured background sets its colour through `--pathable-surface-focus-ring`. It is Bright Blue Brooks by default. Dark containers reset it to Bright Blue Brooks: the `pathable-bg-primary` utility and `.pathable-dark-background`. The `pathable-bg-accent` and `pathable-bg-success` utilities (Jade) set it to the on-accent dark blue, `pathable-bg-base` (Silver) and the footer primary and secondary sections (Silver family, whose links also draw the outline in that colour) to PathAble Blue, `pathable-bg-danger` to the on-accent dark blue (3.9:1), `.pathable-alert--success`, `--warning` and `--error` to the on-accent dark blue, and `.pathable-alert--emergency` to white, because Bright Blue Brooks is only 1.5:1 and 2.3:1 on those reds. Every other `.pathable-alert` (info, including an alert with no status modifier, and slim) sets it to PathAble Blue, because Bright Blue Brooks is only 2.7:1 on the info tint. The outlines that components draw outside themselves read the same property, so they follow the background too: `.pathable-link`, `.pathable-breadcrumb__link`, `.pathable-button--unstyled`, and the scrollable table container. Outlines drawn inside an element (negative `outline-offset`) are drawn on the element's own background and are not covered. Tech Teal (`pathable-bg-link`) sets it to white (`--pathable-color-surface`, 7.7:1), because Bright Blue Brooks is only 2.6:1 on it. A white ring would inherit into light containers nested in the teal one, where it is 1.0:1, so the `pathable-bg-surface` utility and the light component containers (the card container, table and breadcrumb) reset it to Bright Blue Brooks. A new light container needs the same reset. The Jade, Silver and danger utilities and the alerts set their own ring, so they hold inside the teal container too.

The brand book defines no red or amber. Danger (`#dc3545`) and warning (`#f5a623`) are functional status colors added by the design system; use them only for status, never as decoration.

## Color Hierarchy

PathAble Blue, Intelligent Jade, and Bright Blue Brooks are the primary brand colors and should appear most prominently.

Tech Teal, Lived-In Lime, and Shilling Silver are secondary colors and should usually be used as accents, backgrounds, borders, or secondary visual elements.

Secondary colors should not dominate the primary palette.

## Tertiary Colors

Tertiary colors are derived from brand colors at `10%` opacity. They are intended for subtle backgrounds, low-impact decorative areas, and icon backgrounds.

Recommended tertiary colors:

| Name                   | Source                     | Solid equivalent on white |
| ---------------------- | -------------------------- | ------------------------- |
| Bright Blue Brooks 10% | `rgba(72, 153, 232, 0.1)`  | `#edf5fd`                 |
| Shilling Silver 10%    | `rgba(221, 226, 232, 0.1)` | `#fcfcfd`                 |
| Intelligent Jade 10%   | `rgba(28, 174, 150, 0.1)`  | `#e8f7f4`                 |

Tertiary colors should add character without reducing readability.

## Color Pairing

The brand book rates its approved pairings with stars: one star for large text and graphics only, two stars for use anywhere. The measured WCAG contrast does not always agree with those ratings, so this table records both. Where they disagree, follow the measured contrast.

| Background         | Foreground    | Brand book | Measured contrast | Use in the design system                             |
| ------------------ | ------------- | ---------- | ----------------- | ---------------------------------------------------- |
| Shilling Silver    | PathAble Blue | ★★         | 9.58:1            | Preferred high-legibility pairing for web and print  |
| PathAble Blue      | Lived-In Lime | ★          | 10.86:1           | Accent words or highlights; passes for any text size |
| Lived-In Lime      | PathAble Blue | ★          | 10.86:1           | Accent surfaces; passes for any text size            |
| Bright Blue Brooks | White         | ★          | 3.00:1            | Large text (18pt+, or bold 14pt+) and graphics only  |
| Intelligent Jade   | White         | ★          | 2.78:1            | Fails WCAG for all text; do not use for text         |

Other pairings used by the design system:

| Background                             | Foreground          | Measured contrast | Usage                                         |
| -------------------------------------- | ------------------- | ----------------- | --------------------------------------------- |
| White                                  | PathAble Blue       | 12.48:1           | Body and heading text                         |
| PathAble Blue                          | White               | 12.48:1           | Primary actions and dark surfaces             |
| PathAble Blue                          | Shilling Silver     | 9.58:1            | Text on dark surfaces                         |
| Tech Teal                              | White               | 7.71:1            | Dark supporting surfaces                      |
| Tech Teal                              | Lived-In Lime       | 6.70:1            | Accent words on Tech Teal                     |
| White                                  | Tech Teal           | 7.71:1            | Links and muted text                          |
| Shilling Silver                        | Tech Teal           | 5.91:1            | Links and muted text on the page background   |
| Intelligent Jade                       | On-accent `#001a33` | 6.31:1            | Secondary buttons and success status          |
| Bright Blue Brooks                     | On-accent `#001a33` | 5.85:1            | Accent-cool buttons                           |
| Intelligent Jade or Bright Blue Brooks | PathAble Blue       | 4.48:1 / 4.16:1   | Large text only; use on-accent for small text |

The brand book's button examples use white labels on Intelligent Jade and Bright Blue Brooks. Those fail WCAG at button text sizes, so design-system buttons on those colors use the dark on-accent text color (`#001a33`) instead.

Lived-In Lime may be used sparingly as an accent on darker backgrounds to highlight key words or phrases.

Lived-In Lime must never be used as text on light backgrounds (1.15:1 on white). The brand book notes it is better suited to print than web because of this.

Bright Blue Brooks text on white or Shilling Silver (3.00:1 and 2.30:1) is not used for links or small text. Links use Tech Teal.

## Color Violations

Do not implement colors from outside the palette into the identity. The functional danger and warning colors above are the only additions, and only for status.

Do not use undesignated color combinations. They often look harsh.

Do not use low-contrast colors for small text.

Do not let secondary colors overpower the primary palette.

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

Montserrat Bold is only for headings when Fredoka is not available.

Highlights use italic body text (Nunito) and should be used sparingly.

The design system also uses Nunito SemiBold (600) for UI labels. This weight is a design-system addition, not part of the brand book.

## USWDS Typography Token Mapping

### Brand Typeface → USWDS Role Mapping

| Brand Font | Weight                        | USWDS Role          | Custom Typeface Token | Font Stack                            |
| ---------- | ----------------------------- | ------------------- | --------------------- | ------------------------------------- |
| Fredoka    | Regular (400)                 | heading             | `fredoka`             | `'Fredoka', system-ui, sans-serif`    |
| Nunito     | Regular (400), SemiBold (600) | body, ui            | `nunito`              | `'Nunito', system-ui, sans-serif`     |
| Montserrat | Bold (700)                    | alt                 | `montserrat`          | `'Montserrat', system-ui, sans-serif` |
| Poppins    | Bold (700)                    | — (subheading only) | `poppins`             | `'Poppins', system-ui, sans-serif`    |

> **Note:** USWDS supports a single `alt` role. Montserrat is assigned to that role via the `cond` font type. Poppins is in the package font stack for subheadings, set internally, and is not assigned to any USWDS role. No font-family class names it; see `components/tokens-typesetting-font-family.md` for the font-family classes.

### Type Scale Mapping

Type sizes are in `rem`, so they follow the user's default font size; the
pixel figures are those at a 16 px root font size. The published font-size
tokens are `rem` values, so they follow it.

| PathAble Token        | Size             | USWDS System Token | USWDS Theme Token | Notes                                        |
| --------------------- | ---------------- | ------------------ | ----------------- | -------------------------------------------- |
| display-lg            | 2rem (32 px)     | 12                 | xl                | Default — unchanged                          |
| heading-lg            | 1.5rem (24 px)   | 10                 | lg                | Customized from default 9 (1.375rem, 22 px)  |
| heading-md            | 1.25rem (20 px)  | 8                  | (none)            | No theme token — use system token 8 directly |
| heading-sm / body-lg  | 1.125rem (18 px) | 7                  | md                | Customized from default 6 (1.0625rem, 17 px) |
| body-md               | 1rem (16 px)     | 5                  | sm                | Default — unchanged                          |
| body-sm / label-md    | 0.875rem (14 px) | 3                  | 2xs               | Default — unchanged                          |
| label-sm / caption-md | 0.75rem (12 px)  | 1                  | 3xs               | Customized from default 2 (0.8125rem, 13 px) |

### Heading Size Assignments

| Element | USWDS Theme Token | Size             |
| ------- | ----------------- | ---------------- |
| Display | xl                | 2rem (32 px)     |
| h1      | lg                | 1.5rem (24 px)   |
| h2      | md                | 1.125rem (18 px) |
| h3      | md                | 1.125rem (18 px) |
| h4      | sm                | 1rem (16 px)     |
| h5      | 2xs               | 0.875rem (14 px) |
| h6      | 3xs               | 0.75rem (12 px)  |
| Body    | sm                | 1rem (16 px)     |

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

## Logos

The brand has two logos:

- **Primary logo**: the "PathAble" wordmark with three stepped lines (the "jar") below and to the right. Use it whenever possible.
- **Secondary logo**: the stacked "PA" mark with the same three lines, for layouts where horizontal space is limited.

In the full-color logo, the wordmark and top line are PathAble Blue, the middle line is Tech Teal, and the bottom line is Intelligent Jade. On dark backgrounds, use the light version of the logo.

Clear space: the unit `x` is one-sixth of the height of the jar. Keep at least `2x` around the jar and `4x` above and below the letters. Use more space whenever possible, and always scale the logo proportionally.

Do not stretch or warp the logo, create new color layouts for it, add a drop shadow, display it in unbranded colors, outline it, or rearrange it into a new variation.

This package does not ship logo files. Use the official logo assets supplied by the PathAble brand team.

## Iconography

Use familiar, widely recognized icons to communicate ideas quickly across disability, technology, and artificial-intelligence contexts. Icons are not unique to PathAble.

Icons may sit on a circle of a tertiary (10%) color, with the icon in the matching full color, for example a Bright Blue Brooks icon on Bright Blue Brooks 10%.

## Themes

The brand guide defines the core palette but does not define complete light, dark, or high-contrast themes.

Themes are implemented internally through semantic custom properties such as the following; they are implementation, not a consumer token list. Consumers use the token classes on the `components/tokens-*.md` pages:

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

The `@pathableai/styles` package provides the USWDS utility classes under their USWDS names, plus one prefixed family, `pathable-bg-<role>`, which sets a background colour and the focus-ring colour of components inside it. The `components/utilities-*.md` pages list the supported families, values, breakpoint prefixes and state prefixes.

### Common Utility Class Examples

| Purpose            | Class                 | Effect                   |
| ------------------ | --------------------- | ------------------------ |
| Primary background | `bg-primary`          | PathAble Blue background |
| Surface background | `pathable-bg-surface` | White surface background |
| Primary text       | `text-primary`        | PathAble Blue text       |
| Body font          | `font-family-body`    | Nunito font              |
| Heading font       | `font-family-heading` | Fredoka font             |
| Spacing            | `padding-2`           | 8px padding all sides    |
| Spacing            | `padding-4`           | 16px padding all sides   |
| Spacing            | `margin-top-2`        | 8px top margin           |
| Layout             | `display-flex`        | Flex container           |
| Alignment          | `flex-align-center`   | Center alignment         |
| Alignment          | `flex-justify`        | Space between            |
| Border             | `border-1px`          | 1px border               |
| Border radius      | `radius-sm`           | Small border radius      |

### Breakpoint prefixes

Use breakpoint prefixes for responsive layouts:

```html
<div class="padding-1 tablet:padding-4 desktop:padding-8">
  Responsive padding
</div>
```

Breakpoints: `mobile-lg` (480px), `tablet` (640px), `desktop` (1024px).

## Component Classes

This package provides `.pathable-{component}` component classes for the static USWDS components that have a page in `components/`. Most `.pathable-{component}` classes resolve to the same computed styles as the corresponding `.usa-{component}` class via SCSS `@extend`, so markup needs no `.usa-*` class. Some components (noted below) do not emit a base class because USWDS does not define one for the corresponding component — in those cases the component class only provides child element classes.

### Component Class Naming Convention

| Component           | PathAble Class                  | USWDS Equivalent       | Notes                                                                 |
| ------------------- | ------------------------------- | ---------------------- | --------------------------------------------------------------------- |
| alert               | `.pathable-alert`               | `.usa-alert`           |                                                                       |
| breadcrumb          | `.pathable-breadcrumb`          | `.usa-breadcrumb`      |                                                                       |
| button              | `.pathable-button`              | `.usa-button`          |                                                                       |
| button-group        | `.pathable-button-group`        | `.usa-button-group`    |                                                                       |
| card                | `.pathable-card`                | `.usa-card`            |                                                                       |
| checkbox            | `.pathable-checkbox__*`         | `.usa-checkbox__*`     | No base `.usa-checkbox`; the `.pathable-checkbox` root is block-level |
| collection          | `.pathable-collection`          | `.usa-collection`      |                                                                       |
| dark-background     | `.pathable-dark-background`     | `.usa-dark-background` |                                                                       |
| error-message       | `.pathable-error-message`       | `.usa-error-message`   |                                                                       |
| fieldset            | `.pathable-fieldset`            | `.usa-fieldset`        |                                                                       |
| footer              | `.pathable-footer`              | `.usa-footer`          |                                                                       |
| form                | `.pathable-form`                | `.usa-form`            |                                                                       |
| form-group          | `.pathable-form-group`          | `.usa-form-group`      |                                                                       |
| hint                | `.pathable-hint`                | `.usa-hint`            |                                                                       |
| icon                | `.pathable-icon`                | `.usa-icon`            |                                                                       |
| icon-list           | `.pathable-icon-list`           | `.usa-icon-list`       |                                                                       |
| input               | `.pathable-input`               | `.usa-input`           |                                                                       |
| input-prefix-suffix | `.pathable-input-prefix-suffix` | `.usa-input-group`     | Maps to `.usa-input-group` (the USWDS base class)                     |
| intro               | `.pathable-intro`               | `.usa-intro`           |                                                                       |
| label               | `.pathable-label`               | `.usa-label`           |                                                                       |
| legend              | `.pathable-legend`              | `.usa-legend`          |                                                                       |
| link                | `.pathable-link`                | `.usa-link`            |                                                                       |
| list                | `.pathable-list`                | `.usa-list`            |                                                                       |
| memorable-date      | `.pathable-memorable-date`      | `.usa-memorable-date`  |                                                                       |
| pagination          | `.pathable-pagination`          | `.usa-pagination`      |                                                                       |
| paragraph           | `.pathable-paragraph`           | `.usa-paragraph`       |                                                                       |
| process-list        | `.pathable-process-list`        | `.usa-process-list`    |                                                                       |
| prose               | `.pathable-prose`               | `.usa-prose`           |                                                                       |
| radio               | `.pathable-radio__*`            | `.usa-radio__*`        | No base `.usa-radio`; the `.pathable-radio` root is block-level       |
| search              | `.pathable-search`              | `.usa-search`          |                                                                       |
| select              | `.pathable-select`              | `.usa-select`          |                                                                       |
| sidenav             | `.pathable-sidenav`             | `.usa-sidenav`         |                                                                       |
| site-alert          | `.pathable-site-alert`          | `.usa-site-alert`      |                                                                       |
| step-indicator      | `.pathable-step-indicator`      | `.usa-step-indicator`  |                                                                       |
| summary-box         | `.pathable-summary-box`         | `.usa-summary-box`     |                                                                       |
| table               | `.pathable-table`               | `.usa-table`           |                                                                       |
| tag                 | `.pathable-tag`                 | `.usa-tag`             |                                                                       |
| textarea            | `.pathable-textarea`            | `.usa-textarea`        |                                                                       |

### Component Class Rules

- Use `.pathable-{component}` classes in HTML templates, never `.usa-{component}` classes.
- Use `.pathable-{component}__{element}` for child element classes (e.g., `.pathable-card__header`, `.pathable-card__body`).
- Use `.pathable-{component}--{modifier}` for modifier variants (e.g., `.pathable-button--outline`, `.pathable-table--borderless`).
- For components where USWDS does not define a base class (checkbox, radio), the component class provides element-level selectors — use the available `.pathable-{component}__{element}` classes directly.
