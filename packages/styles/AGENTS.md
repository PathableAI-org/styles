# Agent Instructions For PathAble Styles

Use these rules when creating or editing PathAble UI, documentation, prototypes, design tokens, CSS, SCSS, or visual assets.

## Required Source Of Truth

Agents MUST use the tokens and rules from `@pathable/styles`.

Agents MUST prefer semantic tokens over hardcoded color or font values.

Agents MUST NOT introduce new brand colors unless explicitly instructed.

Agents MUST NOT invent new typography rules unless explicitly instructed.

## Color Tokens

Agents MAY use these brand colors:

| Name               |       Hex |
| ------------------ | --------: |
| Intelligent Jade   | `#1cae96` |
| PathAble Blue      | `#00365c` |
| Bright Blue Brooks | `#4899e8` |
| Tech Teal          | `#015a76` |
| Lived-In Lime      | `#d3ff66` |
| Shilling Silver    | `#dde2e8` |

Agents MUST preserve these names when documenting or exposing tokens.

Agents MUST NOT rename brand colors casually.

## Semantic Color Usage

Agents MUST use semantic tokens for application UI when available.

Examples:

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

Agents MAY use raw brand colors only when defining tokens, documenting the palette, or creating intentionally branded one-off assets.

Color Rules

Agents MUST keep PathAble Blue, Intelligent Jade, and Bright Blue Brooks visually prominent.

Agents SHOULD use Tech Teal, Lived-In Lime, and Shilling Silver as supporting colors.

Agents MUST NOT let secondary or accent colors dominate the primary palette.

Agents MUST NOT use unapproved color combinations that reduce readability.

Agents MUST use high-contrast foreground and background combinations for small text.

Agents SHOULD prefer Shilling Silver with PathAble Blue for highly legible light-background designs.

Agents MAY use Lived-In Lime as an accent, focus, or highlight color on dark backgrounds.

Agents MUST NOT use Lived-In Lime for small web text unless contrast has been verified.

Agents MUST prioritize accessibility over brand subtlety.

Tertiary Colors

Agents MAY derive tertiary colors from brand colors at 10% opacity.

Agents SHOULD use tertiary colors for subtle backgrounds, icon backgrounds, and low-emphasis surfaces.

Agents MUST NOT use tertiary colors for primary text.

Agents MUST NOT use tertiary colors when they reduce readability.

Typography Tokens

Agents MUST use these typography roles:

Role Font Weight
Heading Fredoka Regular
Alternate Heading Montserrat Bold
Subheading Poppins Bold
Body Text Nunito Regular

Agents MUST use Fredoka Regular for headings when available.

Agents MAY use Montserrat Bold for headings when Fredoka is unavailable.

Agents MUST use Poppins Bold for subheadings.

Agents MUST use Nunito Regular for body text.

Typography Rules

Agents MUST make headings the most prominent text element.

Agents MUST scale subheadings and body text down naturally from headings.

Agents MUST use body text styling for anything longer than one sentence.

Agents MUST reserve headings and subheadings for short, prominent statements.

Agents MAY use highlights sparingly.

Agents MUST NOT use heading typefaces for long sections of text.

Agents MUST NOT center body text blocks longer than 3 lines.

Agents MUST NOT format body text in all caps.

Agents MUST NOT create long unbroken text blocks.

Agents MUST preserve breathing room around text.

Agents MUST preserve clear hierarchy between heading, subheading, and body text.

Theme Rules

Agents MAY create light, dark, and high-contrast themes by mapping semantic tokens to approved brand colors or reviewed derived colors.

Agents MUST NOT treat an algorithmically generated theme as official without review.

Dark themes SHOULD use PathAble Blue or a derived dark blue as a dominant background family.

Dark themes MUST use white or Shilling Silver for most text.

High-contrast themes MUST prioritize WCAG contrast over subtle brand expression.

High-contrast themes MAY reduce the palette to black, white, PathAble Blue, and Lived-In Lime.

Implementation Rules

Agents MUST use existing package tokens before creating new ones.

Agents MUST add new tokens semantically, not by visual description alone.

Good token names:

--pathable-color-text
--pathable-color-surface
--pathable-color-focus-ring

Avoid token names like:

--pathable-color-pretty-blue
--pathable-color-random-bg
--pathable-color-card-thing

Agents MUST document any new token with its intended role.

Agents MUST check contrast before using color pairs for text.

Agents MUST NOT hardcode brand values throughout application code when a token exists.

## USWDS Token Usage

This package wraps USWDS v3.x theme color tokens. When creating or editing SCSS that references brand colors:

- Agents MUST use `uswds.color("token-name")` to reference brand colors in SCSS (e.g., `uswds.color("blue-warm-80v")` for PathAble Blue)
- Agents MUST NOT use `$theme-color-primary` directly — that returns a string token name, not a hex color
- Agents MUST NOT edit `_uswds-theme.scss` to add new theme overrides without explicit instructions
- Agents MUST keep all USWDS theme color overrides scoped within `_uswds-theme.scss` per FR-008
- Agents MAY reference the USWDS token mapping table in BRAND_RULES.md for token lookups

For SCSS consumers, the correct pattern is:

```scss
@use 'uswds-core' as uswds;
$my-variable: uswds.color('blue-warm-80v');
```

For CSS consumers, the compiled output contains resolved hex values via `--pathable-*` custom properties.

## USWDS Typography Token Usage

This package wraps USWDS v3.x typography theme tokens. When creating or editing SCSS that references typography values:

### Dual Naming Convention

Most typography CSS custom properties are emitted in two namespaces: `--pathable-font-*` and `--usa-font-*`, both resolving to identical values. The `--pathable-font-*` namespace is the source of truth. PathAble-specific tokens (`--pathable-font-subheading`) that have no USWDS role equivalent are only emitted under the `--pathable-*` namespace.

### CSS Custom Property Categories

- **Font role**: `--pathable-font-heading`, `--pathable-font-body`, `--pathable-font-mono`, `--pathable-font-alt` (and `--usa-font-heading`, `--usa-font-body`, `--usa-font-mono`, `--usa-font-alt` equivalents)
- **Font size**: `--pathable-font-size-*` tokens (and `--usa-font-size-*` equivalents)
- **Font weight**: `--pathable-font-weight-normal`, `--pathable-font-weight-semibold`, `--pathable-font-weight-bold` (and `--usa-font-weight-normal`, `--usa-font-weight-semibold`, `--usa-font-weight-bold` equivalents)
- **Line height**: `--pathable-font-line-height-body` (and `--usa-font-line-height-body`, `--usa-font-line-height-heading` equivalents)

### SCSS Typography Token Reference Rules

- Agents MUST use `uswds-core` functions to reference typography theme tokens (e.g., `uswds.family('heading')`, `uswds.type-scale('lg')`)
- Agents MUST NOT use `$theme-font-*` variables directly — those are USWDS internal configuration values
- Agents MUST NOT edit `_uswds-theme.scss` to add new typography overrides without explicit instructions
- Agents MUST keep all USWDS theme typography overrides scoped within `_uswds-theme.scss` per FR-011
- Agents MAY reference the `--pathable-font-*` or `--usa-font-*` CSS custom properties from CSS
- For SCSS consumers: `@use 'uswds-core' as uswds;` then `uswds.family('heading')`
- For CSS consumers: the compiled output contains resolved values via `--pathable-font-*` and `--usa-font-*` custom properties

### Custom Typeface Token Documentation

| Brand Font | Custom Token   | USWDS Role                    | Font Type |
| ---------- | -------------- | ----------------------------- | --------- |
| Fredoka    | `"fredoka"`    | heading                       | serif     |
| Nunito     | `"nunito"`     | body, ui                      | sans      |
| Montserrat | `"montserrat"` | alt                           | cond      |
| Poppins    | `"poppins"`    | — (available for subheadings) | —         |

### Font File Distribution

Font files (`.woff2`) are bundled with the `@pathable/styles` npm package. They are automatically copied from [Fontsource](https://fontsource.org/) npm packages at build time via the `scripts/copy-fonts.mjs` script. The fonts are published in the `fonts/` directory and referenced by the compiled CSS at `../fonts/...` relative to `dist/styles.css`.

Consuming projects do not need to manually place font files — they are distributed automatically with the package.

## USWDS Utility Wrappers Usage

This package generates `.pathable-*` CSS utility classes from configuration maps. Each utility value is also emitted as dual `--pathable-*` / `--usa-*` CSS custom properties.

### Utility Class Naming Convention

| Module           | Class Pattern                     | CSS Property                     |
| ---------------- | --------------------------------- | -------------------------------- |
| background-color | `.pathable-bg-{value}`            | `background-color`               |
| color            | `.pathable-text-{value}`          | `color`                          |
| padding          | `.pathable-padding-{n}`           | `padding`                        |
| padding-x        | `.pathable-padding-x-{n}`         | `padding-left` + `padding-right` |
| padding-y        | `.pathable-padding-y-{n}`         | `padding-top` + `padding-bottom` |
| margin           | `.pathable-margin-{n}`            | `margin`                         |
| margin-x         | `.pathable-margin-x-{n}`          | `margin-left` + `margin-right`   |
| margin-y         | `.pathable-margin-y-{n}`          | `margin-top` + `margin-bottom`   |
| margin-top       | `.pathable-margin-top-{n}`        | `margin-top`                     |
| margin-bottom    | `.pathable-margin-bottom-{n}`     | `margin-bottom`                  |
| display          | `.pathable-display-{value}`       | `display`                        |
| font-family      | `.pathable-font-family-{role}`    | `font-family`                    |
| font-weight      | `.pathable-text-{weight}`         | `font-weight`                    |
| border           | `.pathable-border-{n}`            | `border`                         |
| border-radius    | `.pathable-border-radius-{value}` | `border-radius`                  |
| flex             | `.pathable-flex-{n}`              | `flex`                           |
| align-items      | `.pathable-flex-align-{value}`    | `align-items`                    |
| justify-content  | `.pathable-flex-justify-{value}`  | `justify-content`                |
| width            | `.pathable-width-{value}`         | `width`                          |
| max-width        | `.pathable-maxw-{value}`          | `max-width`                      |
| text-align       | `.pathable-text-{alignment}`      | `text-align`                     |

### Responsive Variants

Breakpoint-prefixed variants follow `.{breakpoint}\:pathable-{base}-{value}`:

| Breakpoint  | Min Width |
| ----------- | --------- |
| `mobile-lg` | 480px     |
| `tablet`    | 640px     |
| `desktop`   | 1024px    |

### State Variants

State variants follow `.{state}\:pathable-{base}-{value}`:

- `hover:` — for background-color and color modules
- `focus:` — for background-color and color modules

### SCSS Utility Token Reference Rules

- Agents MUST use `.pathable-*` utility classes in HTML/Astro templates instead of ad-hoc CSS for background-color, color, padding, margin, display, font-family, border, border-radius, flex, align-items, justify-content, width, and text-align.
- Agents MUST NOT write ad-hoc CSS rules for properties that have a `.pathable-*` utility class equivalent.
- Agents MUST keep directional border and complex layout CSS (grid, max-width with theme variables, custom `z-index`) in component `<style>` blocks since these have no utility equivalents.
- Agents May use `--pathable-{module}-{value}` and `--usa-{module}-{value}` CSS custom properties as alternatives to the class-based utilities.

## USWDS Component Wrappers Usage

This package provides `.pathable-{component}` CSS class wrappers for all USWDS components, organized into a package system. Each `.pathable-{component}` class resolves to the same computed styles as the corresponding `.usa-{component}` class via SCSS `@extend`.

### Component Wrapper Naming Convention

| Component      | PathAble Class             | USWDS Equivalent      |
| -------------- | -------------------------- | --------------------- |
| accordion      | `.pathable-accordion`      | `.usa-accordion`      |
| alert          | `.pathable-alert`          | `.usa-alert`          |
| banner         | `.pathable-banner`         | `.usa-banner`         |
| breadcrumb     | `.pathable-breadcrumb`     | `.usa-breadcrumb`     |
| button         | `.pathable-button`         | `.usa-button`         |
| button-group   | `.pathable-button-group`   | `.usa-button-group`   |
| card           | `.pathable-card`           | `.usa-card`           |
| checkbox       | `.pathable-checkbox`       | `.usa-checkbox`       |
| combo-box      | `.pathable-combo-box`      | `.usa-combo-box`      |
| date-picker    | `.pathable-date-picker`    | `.usa-date-picker`    |
| footer         | `.pathable-footer`         | `.usa-footer`         |
| form           | `.pathable-form`           | `.usa-form`           |
| header         | `.pathable-header`         | `.usa-header`         |
| icon           | `.pathable-icon`           | `.usa-icon`           |
| identifier     | `.pathable-identifier`     | `.usa-identifier`     |
| input          | `.pathable-input`          | `.usa-input`          |
| link           | `.pathable-link`           | `.usa-link`           |
| list           | `.pathable-list`           | `.usa-list`           |
| media-block    | `.pathable-media-block`    | `.usa-media-block`    |
| modal          | `.pathable-modal`          | `.usa-modal`          |
| nav            | `.pathable-nav`            | `.usa-nav`            |
| pagination     | `.pathable-pagination`     | `.usa-pagination`     |
| process-list   | `.pathable-process-list`   | `.usa-process-list`   |
| prose          | `.pathable-prose`          | `.usa-prose`          |
| radio          | `.pathable-radio`          | `.usa-radio`          |
| search         | `.pathable-search`         | `.usa-search`         |
| sidenav        | `.pathable-sidenav`        | `.usa-sidenav`        |
| skipnav        | `.pathable-skipnav`        | `.usa-skipnav`        |
| step-indicator | `.pathable-step-indicator` | `.usa-step-indicator` |
| summary-box    | `.pathable-summary-box`    | `.usa-summary-box`    |
| table          | `.pathable-table`          | `.usa-table`          |
| tag            | `.pathable-tag`            | `.usa-tag`            |
| textarea       | `.pathable-textarea`       | `.usa-textarea`       |
| tooltip        | `.pathable-tooltip`        | `.usa-tooltip`        |
| validation     | `.pathable-validation`     | `.usa-validation`     |

### Component Wrapper Rules

- Agents MUST use `.pathable-{component}` classes in HTML/Astro templates instead of `.usa-{component}` classes when a wrapper exists.
- Agents MUST use `.pathable-{component}__{element}` for child element classes (e.g., `.pathable-card__header`, `.pathable-card__body`).
- Agents MUST use `.pathable-{component}--{modifier}` for modifier variants (e.g., `.pathable-button--outline`, `.pathable-table--borderless`).
- For JS-driven components (accordion, banner, combo-box, date-picker, date-range-picker, file-input, header, in-page-navigation, input-mask, modal, nav, site-alert, time-picker, tooltip, validation), Agents MUST keep `.usa-{component}` on the DOM element AND add `.pathable-{component}` as an additional class — the USWDS JavaScript selects DOM nodes by `.usa-*` class names, and removing them would break interactivity.
- Agents MUST NOT write ad-hoc CSS rules for styling that can be achieved by applying component wrapper classes.
- Agent MAY use `--pathable-{component}-{property}` and `--usa-{component}-{property}` CSS custom properties as alternatives to the class-based components.
