# Agent Instructions For PathAble Styles

Use these rules when creating or editing PathAble UI, documentation, prototypes, design tokens, CSS, SCSS, or visual assets.

> **Contributor guidance.** This file tells agents how to change this
> repository. It is not the intended consumer agent guidance for an installed
> `@pathableai/styles` version, even though the current package manifest still
> includes it. Consumer component guidance is auditable Markdown generated
> from the component pages and fixtures and shipped with the CSS; package-wide
> routing, selection and bug-reporting guidance also belongs in the installed
> package but is not generated from individual component pages. See
> [`docs/engineering/intent.md`](../../docs/engineering/intent.md).
>
> **Refactor in progress.** `@pathableai/styles` is becoming a thin wrapper
> around the static portion of USWDS. It exposes `pathable-` component names,
> re-exports unprefixed USWDS tokens and utilities under the same names, and
> applies PathAble brand settings. See
> [`docs/engineering/target-state.md`](../../docs/engineering/target-state.md),
> which wins for the direction of the package. Sections below marked "current
> implementation, being replaced" describe today's code; follow them to work on
> that code, but do not copy the pattern into new docs or fixtures.
>
> **Active scope.** Work only on the documented static catalog, its component
> pages and fixtures, tokens and utilities, and the compiled CSS unless the task
> explicitly says otherwise. The package ships no JavaScript and only the
> components that have a page in `components/` and a folder in `fixtures/`; do
> not add a component without both, and do not make a component depend on
> package JavaScript. `packages/react/` is retained but deferred. Existing
> generated-output checks may still require a mechanical React-guidance update;
> stop and ask if that would require a semantic React decision.
>
> Begin with USWDS markup and styles. A local deviation must be narrow and
> motivated by either an approved PathAble brand choice that configuration
> cannot express or a demonstrated accessibility defect, with fixture, story,
> automated or visual evidence. General redesign and convenience divergence are
> outside the current refactor.

## Required Source Of Truth

Agents MUST use the tokens and rules from `@pathableai/styles`.

Agents MUST prefer the documented token classes and `pathable-*` component classes (see the `components/tokens-*.md` pages) over hardcoded color or font values. The `--pathable-*` custom properties are internal implementation that component SCSS uses; they are not a consumer API.

Agents MUST NOT introduce new brand colors unless explicitly instructed.

Agents MUST NOT invent new typography rules unless explicitly instructed.

Agents SHOULD read a component's page, listed in `components/index.md` in the
installed package, before writing its markup. The page's examples are the
reference markup. In this repository the pages are built from the source pages
in the top-level `components/` directory; see `components/README.md` there.

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

Agents MUST use the documented token classes and component classes for application UI when available (for example `bg-primary` or `text-ink`, listed on the `components/tokens-color.md` page).

Internally, component SCSS reads these semantic custom properties. They are implementation, not a consumer token list:

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

## Color Rules

Agents MUST keep PathAble Blue, Intelligent Jade, and Bright Blue Brooks visually prominent.

Agents SHOULD use Tech Teal, Lived-In Lime, and Shilling Silver as supporting colors.

Agents MUST NOT let secondary or accent colors dominate the primary palette.

Agents MUST NOT use unapproved color combinations that reduce readability.

Agents MUST use high-contrast foreground and background combinations for small text.

Agents SHOULD prefer Shilling Silver with PathAble Blue for highly legible light-background designs.

Agents MAY use Lived-In Lime as an accent or highlight color on dark backgrounds.

Agents MUST NOT use Lived-In Lime for small web text unless contrast has been verified.

Agents MUST prioritize accessibility over brand subtlety.

## Tertiary Colors

Agents MAY derive tertiary colors from brand colors at 10% opacity.

Agents SHOULD use tertiary colors for subtle backgrounds, icon backgrounds, and low-emphasis surfaces.

Agents MUST NOT use tertiary colors for primary text.

Agents MUST NOT use tertiary colors when they reduce readability.

## Typography Tokens

Agents MUST use these typography roles:

| Role              | Font       | Weight  |
| ----------------- | ---------- | ------- |
| Heading           | Fredoka    | Regular |
| Alternate Heading | Montserrat | Bold    |
| Subheading        | Poppins    | Bold    |
| Body Text         | Nunito     | Regular |

Agents MUST use Fredoka Regular for headings when available.

Agents MAY use Montserrat Bold for headings when Fredoka is unavailable.

Agents MUST use Poppins Bold for subheadings.

Agents MUST use Nunito Regular for body text.

## Typography Rules

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

## Theme Rules

The package ships one PathAble theme, fixed at build time. Light, dark and high-contrast variants are package work done in the SCSS source with approved brand colors or reviewed derived colors, not consumer overrides.

Agents MUST NOT treat an algorithmically generated theme as official without review.

Dark themes SHOULD use PathAble Blue or a derived dark blue as a dominant background family.

Dark themes MUST use white or Shilling Silver for most text.

High-contrast themes MUST prioritize WCAG contrast over subtle brand expression.

High-contrast themes MAY reduce the palette to black, white, PathAble Blue, and Lived-In Lime.

## Implementation Rules

Contributors define internal semantic custom properties in SCSS; consumers do not use them. Contributors MUST reuse an existing internal property before creating a new one.

Contributors MUST name new internal properties semantically, not by visual description alone.

Good internal property names:

```css
--pathable-color-text
--pathable-color-surface
--pathable-color-focus-ring
```

Avoid internal property names like:

```css
--pathable-color-pretty-blue
--pathable-color-random-bg
--pathable-color-card-thing
```

Contributors MUST document any new internal property with its intended role.

Agents MUST check contrast before using color pairs for text.

Agents MUST NOT hardcode brand values throughout application code when a documented token class exists.

Inside component SCSS, agents MUST reference only custom properties that exist. `pnpm lint:tokens` fails on any `var(--*)` reference without a fallback, prefixed (`--pathable-*`) or not (`--elevation-*`), that the token source files do not define and no SCSS source file declares. References inside comments are checked too, so a comment that names a token must name one that exists. There are no exceptions by name.

## USWDS Token Usage

> Current implementation, being replaced: consumer SCSS through `uswds-core` is not part of the target contract. See [target state](../../docs/engineering/target-state.md).

This package configures the USWDS v3.x theme color families with the exact brand hex values (see "USWDS Theme Colors" in BRAND_RULES.md). When creating or editing SCSS that references brand colors:

- Agents MUST prefer the internal `--pathable-*` custom properties (for example `var(--pathable-color-text)` or `var(--pathable-brand-pathable-blue)`) in component styles
- When a USWDS function needs a color, Agents MUST use theme tokens such as `uswds.color('primary')` (PathAble Blue) or `uswds.color('accent-cool-dark')` (Tech Teal), which resolve to the brand values
- Agents MUST NOT use USWDS system tokens such as `blue-warm-80v` for brand colors; they are only approximations of the brand palette
- Agents MUST NOT use `$theme-color-primary` and other `$theme-*` settings directly — they are USWDS configuration values, not resolved colors
- Agents MUST NOT edit `_uswds-theme.scss` to add new theme overrides without explicit instructions
- Agents MUST keep all USWDS theme color overrides scoped within `_uswds-theme.scss`

For SCSS consumers, the correct pattern is:

```scss
@use 'uswds-core' as uswds;
$my-variable: uswds.color('primary'); // #00365c, PathAble Blue
```

For CSS consumers, the compiled output contains resolved hex values. Consumers use the token classes and component classes, not the `--pathable-*` custom properties.

## USWDS Typography Token Usage

This package wraps USWDS v3.x typography theme tokens. When creating or editing SCSS that references typography values:

### Naming Convention

Internal typography custom properties are emitted in the `--pathable-font-*` namespace for component SCSS to use.

### Internal CSS Custom Property Categories

- **Font role**: `--pathable-font-heading`, `--pathable-font-body`
- **Font weight**: `--pathable-font-weight-normal`, `--pathable-font-weight-bold`

### SCSS Typography Token Reference Rules

- Agents MUST use `uswds-core` functions to reference typography theme tokens (e.g., `uswds.family('heading')`). USWDS has no `type-scale()` function: a call to it compiles to invalid CSS. For a type-scale size, use `type-scale-rem('lg')` from `src/_type-scale.scss`
- Agents MUST NOT use `$theme-font-*` variables directly — those are USWDS internal configuration values
- Agents MUST NOT edit `_uswds-theme.scss` to add new typography overrides without explicit instructions
- Agents MUST keep all USWDS theme typography overrides scoped within `_uswds-theme.scss`
- Component SCSS MAY reference the `--pathable-font-*` custom properties; they are internal, not consumer API
- For SCSS consumers: `@use 'uswds-core' as uswds;` then `uswds.family('heading')`
- For CSS consumers: use the typography token classes documented on the `components/tokens-typesetting*.md` pages

### Custom Typeface Token Documentation

| Brand Font | Custom Token   | USWDS Role                    | Font Type |
| ---------- | -------------- | ----------------------------- | --------- |
| Fredoka    | `"fredoka"`    | heading                       | serif     |
| Nunito     | `"nunito"`     | body, ui                      | sans      |
| Montserrat | `"montserrat"` | alt                           | cond      |
| Poppins    | `"poppins"`    | — (available for subheadings) | —         |

### Font File Distribution

Font files (`.woff2`) are bundled with the `@pathableai/styles` npm package. They are automatically copied from [Fontsource](https://fontsource.org/) npm packages at build time via the `scripts/copy-fonts.mjs` script. The fonts are published in the `fonts/` directory and referenced by the compiled CSS at `../fonts/...` relative to `dist/styles.css`.

Consuming projects do not need to manually place font files — they are distributed automatically with the package.

## USWDS Utility Wrappers Usage

> Current implementation, being replaced: the target re-exports USWDS utilities under their unprefixed names (`margin-top-2`), not as `.pathable-*` classes. See [target state](../../docs/engineering/target-state.md).

This package generates `.pathable-*` CSS utility classes from configuration maps. It emits no custom property for a utility value; each class sets its value directly.

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

- Agents MUST use `.pathable-*` utility classes in HTML templates instead of ad-hoc CSS for background-color, color, padding, margin, display, font-family, border, border-radius, flex, align-items, justify-content, width, and text-align.
- Agents MUST NOT write ad-hoc CSS rules for properties that have a `.pathable-*` utility class equivalent.
- Agents MUST keep directional border and complex layout CSS (grid, max-width with theme variables, custom `z-index`) in component `<style>` blocks since these have no utility equivalents.

## Component Classes Usage

> Current implementation, being replaced for the supported static catalog:
> the target is `pathable-*` selectors with no `@extend .usa-*`. See
> [target state](../../docs/engineering/target-state.md).

This package provides `.pathable-{component}` component classes for the static USWDS components that have a page in `components/` and canonical markup in `fixtures/`. Each `.pathable-{component}` class takes the USWDS styles of the corresponding `.usa-{component}` class through SCSS `@extend`, so consumer markup needs no `.usa-*` class. The component pages list the components and their elements and modifiers.

### Component Class Rules

- Agents MUST use `.pathable-{component}` classes in HTML templates, never `.usa-{component}` classes.
- Agents MUST use `.pathable-{component}__{element}` for child element classes (e.g., `.pathable-card__header`, `.pathable-card__body`).
- Agents MUST use `.pathable-{component}--{modifier}` for modifier variants (e.g., `.pathable-button--outline`, `.pathable-table--borderless`).
- Agents MUST use only the components, elements and modifiers a component page documents.
- Agents MUST NOT write ad-hoc CSS rules for styling that can be achieved by applying component classes.
