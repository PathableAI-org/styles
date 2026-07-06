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
@use "uswds-core" as uswds;
$my-variable: uswds.color("blue-warm-80v");
```

For CSS consumers, the compiled output contains resolved hex values via `--pathable-*` custom properties.
