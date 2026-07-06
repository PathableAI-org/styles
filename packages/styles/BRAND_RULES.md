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
