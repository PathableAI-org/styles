# Context Digest: UI Capability — USWDS Typography Settings

## Overview

This digest provides the working context for implementing the `ui` vertical capability of the USWDS Typography Settings feature (T001–T012). All SCSS source changes across 4 files in `packages/styles/src/`, plus build/verify steps.

---

## 1. Task Text (T001–T012)

### T001 — Create `_fonts.scss` partial with `@font-face` rules
- File: `packages/styles/src/_fonts.scss` (NEW)
- Content: `@font-face` rules for all four brand typefaces:
  - Fredoka Regular (400)
  - Nunito Regular (400) + SemiBold (600)
  - Poppins Bold (700)
  - Montserrat Bold (700)
- Use `$theme-font-path` variable for the font path (defaults to `../fonts`)
- Follow the exact pattern from research.md Decision D8

### T002 — Update `index.scss` to forward `_fonts.scss` before `_uswds-theme.scss`
- File: `packages/styles/src/index.scss` (EDIT)
- Order: `@forward "fonts";` then `@forward "uswds-theme";` then existing forwards
- `@font-face` rules must be available before USWDS core is configured

### T003 — Add custom typeface token definitions to `_uswds-theme.scss`
- File: `packages/styles/src/_uswds-theme.scss` (EDIT)
- Add `$theme-typeface-tokens` map with entries for `fredoka`, `nunito`, `poppins`, `montserrat`
- Each entry: `display-name`, `cap-height: 364px`, `stack` with full fallback chain
- Follow research.md Decision D2 structure

### T004 — Configure font family type assignments and role assignments
- File: `packages/styles/src/_uswds-theme.scss` (EDIT)
- Set `$theme-font-type-cond: false`, `$theme-font-type-icon: false`, `$theme-font-type-lang: false`
- Set `$theme-font-type-mono: "roboto-mono"` (unchanged default)
- Set `$theme-font-type-sans: "source-sans-pro"` (unchanged default)
- Set `$theme-font-type-serif: false` (not used)
- Set `$theme-font-role-heading: "fredoka"`, `$theme-font-role-body: "nunito"`, `$theme-font-role-ui: "nunito"`, `$theme-font-role-code: "mono"`, `$theme-font-role-alt: "montserrat"`

### T005 — Configure body typography settings
- File: `packages/styles/src/_uswds-theme.scss` (EDIT)
- Set `$theme-body-font-family: "body"`, `$theme-body-font-size: "sm"`, `$theme-body-line-height: 5`
- Set `$theme-style-body-element: false` (preserve existing behavior)
- Set `$theme-respect-user-font-size: true`

### T006 — Build and verify US1
- Working directory: `packages/styles/`
- Run `pnpm build`
- Verify `rg "Fredoka" dist/styles.css`, `rg "Nunito" dist/styles.css`
- Verify `rg "font-family-heading" dist/styles.css` shows Fredoka stack
- Verify `rg "font-family-body" dist/styles.css` shows Nunito stack

### T007 — Configure type scale theme tokens
- File: `packages/styles/src/_uswds-theme.scss` (EDIT)
- `$theme-type-scale-3xs: 1` (12px), `$theme-type-scale-2xs: 3` (14px), `$theme-type-scale-xs: 4` (15px)
- `$theme-type-scale-sm: 5` (16px), `$theme-type-scale-md: 7` (18px)
- `$theme-type-scale-lg: 10` (24px), `$theme-type-scale-xl: 12` (32px)
- `$theme-type-scale-2xl: 14` (40px), `$theme-type-scale-3xl: 15` (48px)
- Follow research.md Decision D3 exact values

### T008 — Configure heading size tokens
- File: `packages/styles/src/_uswds-theme.scss` (EDIT)
- `$theme-display-font-size: "xl"`, `$theme-h1-font-size: "lg"`, `$theme-h2-font-size: "md"`
- `$theme-h3-font-size: "md"`, `$theme-h4-font-size: "sm"`, `$theme-h5-font-size: "2xs"`
- `$theme-h6-font-size: "3xs"`, `$theme-body-font-size: "sm"`

### T009 — Configure line-height, heading, and prose settings
- File: `packages/styles/src/_uswds-theme.scss` (EDIT)
- `$theme-heading-line-height: 3` (1.35), `$theme-body-line-height: 5` (1.62)
- `$theme-lead-font-family: "heading"`, `$theme-lead-font-size: "lg"`, `$theme-lead-line-height: 6`, `$theme-lead-measure: 6`
- `$theme-prose-font-family: "body"`
- `$theme-heading-margin-top: 1.5em`, `$theme-paragraph-margin-top: 1em`
- `$theme-small-font-size: "2xs"`, `$theme-display-font-size: "xl"`

### T010 — Add `$typography-tokens` map and dual `@each` loop to `_typography.scss`
- File: `packages/styles/src/_typography.scss` (EDIT)
- Create a `$typography-tokens` map with entries for font-family, font-size, font-weight, and line-height tokens
- Add an `@each` loop that emits both `--pathable-#{$name}` and `--usa-#{$name}` for each entry
- Follow the Dual Naming Convention section in `contracts/scss-interface.md`
- Ensure existing `--pathable-font-*` and `--ui-*` custom properties remain unchanged

### T011 — Build and verify US3
- Working directory: `packages/styles/`
- Run `pnpm build`
- Verify `rg "--pathable-font-heading" dist/styles.css`
- Verify `rg "--usa-font-heading" dist/styles.css`
- Verify both resolve to the same Fredoka font stack value

### T012 — Add upgrade documentation comments to `_uswds-theme.scss`
- File: `packages/styles/src/_uswds-theme.scss` (EDIT)
- Add a header comment block documenting that ALL typography overrides are scoped in this file
- Include upgrade instructions: "To upgrade USWDS: bump version in package.json, rebuild, verify no unexpected typography changes. Only this file needs review."
- Follow the same pattern as the existing color settings header comments

---

## 2. Research Decisions (D1–D10) — Summaries

### D1: Brand Typeface to USWDS Font Role Mapping
- Fredoka (400) → heading role → custom "fredoka" token
- Nunito (400, 600) → body, ui roles → custom "nunito" token
- Poppins (700) → alt (subheading) → custom "poppins" token
- Montserrat (700) → alt (alternate heading) → custom "montserrat" token
- Each brand font needs its own custom typeface token with `display-name`, `cap-height`, `stack`

### D2: Custom Typeface Token Configuration
```
$theme-typeface-tokens: (
  "fredoka":    ("display-name": "Fredoka",    "cap-height": 364px, "stack": "'Fredoka', system-ui, sans-serif"),
  "nunito":     ("display-name": "Nunito",     "cap-height": 364px, "stack": "'Nunito', system-ui, sans-serif"),
  "poppins":    ("display-name": "Poppins",    "cap-height": 364px, "stack": "'Poppins', system-ui, sans-serif"),
  "montserrat": ("display-name": "Montserrat", "cap-height": 364px, "stack": "'Montserrat', system-ui, sans-serif"),
);
```
- Recommendation: Use `$theme-typeface-tokens` for stacks + manual `@font-face` in `_fonts.scss` (not USWDS custom-src system)

### D3: PathAble Type Scale to USWDS System Token Mapping
- Custom theme scale tokens needed:
  - `$theme-type-scale-3xs: 1` (12px), `$theme-type-scale-2xs: 3` (14px), `$theme-type-scale-xs: 4` (15px)
  - `$theme-type-scale-sm: 5` (16px), `$theme-type-scale-md: 7` (18px)
  - `$theme-type-scale-lg: 10` (24px), `$theme-type-scale-xl: 12` (32px)
  - `$theme-type-scale-2xl: 14` (40px), `$theme-type-scale-3xl: 15` (48px)
- Heading sizes: display=xl (32px), h1=lg (24px), h2=md (18px), h3=md (18px), h4=sm (16px), h5=2xs (14px), h6=3xs (12px)

### D4: Line-Height Mapping
- `$theme-body-line-height: 5` (1.62) — for body text
- `$theme-heading-line-height: 3` (1.35) — for headings
- `$theme-lead-line-height: 6` (1.75) — for lead text

### D5: Font Weight Configuration
- `$theme-font-weight-semibold: 600` — enable for Nunito SemiBold
- `$theme-generate-all-weights: false` — only generate needed weights

### D6: CSS Custom Property Duplication Strategy
- Use SCSS `@each` loop over a `$typography-tokens` map to emit both `--pathable-*` and `--usa-*` CSS custom properties from a single source of truth

### D7: Typography Settings Architecture
- Add all typography `$theme-font-*` settings directly into the existing `_uswds-theme.scss` alongside color settings
- Single `@use "uswds-core" with (...)` block — cannot be split across files

### D8: Custom Font `@font-face` Strategy
- Manual `@font-face` rules in dedicated `_fonts.scss` partial (not USWDS custom-src system)
- 5 `@font-face` blocks: Fredoka Regular (400), Nunito Regular (400), Nunito SemiBold (600), Poppins Bold (700), Montserrat Bold (700)
- Font path: `$theme-font-path` defaults to `../fonts` relative to compiled CSS

### D9: Body Typography and Prose Settings
- Body: `$theme-body-font-family: "body"`, `$theme-body-font-size: "sm"`, `$theme-body-line-height: 5`, `$theme-style-body-element: false`
- Prose: `$theme-prose-font-family: "body"`, `$theme-lead-font-family: "heading"`, `$theme-lead-font-size: "lg"`, `$theme-lead-line-height: 6`, `$theme-lead-measure: 6`
- Margins: `$theme-heading-margin-top: 1.5em`, `$theme-paragraph-margin-top: 1em`
- Keep `$theme-global-content-styles: false`, `$theme-global-paragraph-styles: false`, `$theme-global-link-styles: false`

### D10: Root Font Size
- `$theme-respect-user-font-size: true` — respects browser preferences (accessibility)

---

## 3. Data Model Entity Definitions (Relevant to SCSS)

### BrandTypeface
| Field | Type | Description |
|-------|------|-------------|
| name | string | Canonical typeface name |
| role | enum | heading, body, ui, code, alt, subheading |
| weights | array of int | Available weight values |
| uswdsTypefaceToken | string | Custom typeface token name |
| fontStack | string | CSS font-family fallback chain |
| displayName | string | Display name |
| capHeight | px | Cap height (default: 364px) |

Instances: Fredoka (heading, 400), Nunito (body/ui, 400/600), Poppins (subheading, 700), Montserrat (alt, 700)

### FontFamilyToken
- Type: cond, icon, lang, mono, sans, serif
- Enabled: sans=true, mono=true; all others=false

### RoleFontToken
- heading → fredoka, body → nunito, ui → nunito, code → mono, alt → montserrat

### TypeScaleMapping
- Defines PathAble token → USWDS system token → USWDS theme token mappings

### FontWeightMapping
- semibold → 600 (custom); normal=400, bold=700 (defaults)

### LineHeightMapping
- body → 5 (1.62), heading → 3 (1.35), lead → 6 (1.75)

### TypographyCustomProperty
- Dual-named: `--pathable-font-*` and `--usa-font-*` with identical values

---

## 4. SCSS Interface Contract Details

### `_fonts.scss` (NEW)
- Role: `@font-face` declarations for all self-hosted brand typefaces
- Consumed by: `index.scss` via `@forward "fonts"` (must be before `_uswds-theme`)
- Contains: 5 `@font-face` blocks (Fredoka 400, Nunito 400, Nunito 600, Poppins 700, Montserrat 700)
- Font path: `$theme-font-path` (defaults to `../fonts`)

### `_uswds-theme.scss` (UPDATED)
- Role: Single source of truth for ALL USWDS theme token configuration (color AND typography)
- Additions: `$theme-typeface-tokens`, `$theme-font-role-*`, `$theme-type-scale-*`, `$theme-font-weight-semibold`, `$theme-h1-*` through `$theme-h6-*`, `$theme-body-*`, `$theme-heading-*`, `$theme-prose-*`, `$theme-lead-*`, `$theme-display-*`, `$theme-small-*`, `$theme-respect-user-font-size`
- Does NOT contain: `@font-face` rules, component styles
- Current state: Has a `@use 'uswds-core' with (...)` block containing only color settings. Typography settings must be added INTO this existing block.

### `_typography.scss` (UPDATED)
- Role: PathAble typography SCSS variables, typography scale, and CSS custom properties
- Existing: `$pathable-font-*` variables, `$typography-scale` map, `$ui-*` variables, `--pathable-font-*` CSS custom properties, `--ui-*` CSS custom properties
- Additions: `$typography-tokens` map (single source of truth for dual-named CSS custom properties), `@each` loop emitting both `--pathable-#{$name}` and `--usa-#{$name}`
- Existing `--pathable-font-*` and `--ui-*` custom properties MUST remain unchanged

### `index.scss` (UPDATED)
- Current order: `@forward "uswds-theme"; @forward "colors"; @forward "typography"; @forward "spacing"; @forward "elevation"; @forward "radius"; @forward "semantic"; @forward "usa-layout-grid/src/styles";`
- New order: `@forward "fonts";` **first**, then `@forward "uswds-theme";` then remaining forwards unchanged
- `@use 'sass:map';` at top must be preserved

---

## 5. Dual Naming Convention Specification

From `contracts/scss-interface.md`:

```
$typography-tokens: (
  'font-heading': $pathable-font-heading,
  'font-body': $pathable-font-body,
  'font-mono': $pathable-font-mono,
  'font-alt': $pathable-font-alternate-heading,
  'font-size-body-md': $ui-body-md,
  'font-weight-normal': 400,
  'font-weight-bold': 700,
  // ... etc
);

:root {
  @each $name, $value in $typography-tokens {
    --pathable-#{$name}: #{$value};
    --usa-#{$name}: #{$value};
  }
}
```

Rules:
1. The two namespaces always resolve to identical values
2. Adding a new token requires editing only one map entry
3. The `--usa-*` namespace is derived from the `--pathable-*` source of truth

New CSS custom properties being added:
- `--pathable-font-heading` / `--usa-font-heading` — Fredoka font stack
- `--pathable-font-body` / `--usa-font-body` — Nunito font stack
- `--pathable-font-mono` / `--usa-font-mono` — mono font stack
- `--pathable-font-alt` / `--usa-font-alt` — Montserrat font stack
- `--pathable-font-size-*` / `--usa-font-size-*` — font size tokens
- `--pathable-font-weight-*` / `--usa-font-weight-*` — font weight tokens
- `--pathable-font-line-height-*` / `--usa-font-line-height-*` — line height tokens

---

## 6. Build and Verification Commands

```bash
# Build command (from packages/styles/)
pnpm build

# Verify brand fonts (US1 — after T006)
rg "Fredoka" dist/styles.css
rg "Nunito" dist/styles.css
rg "font-family-heading" dist/styles.css
rg "font-family-body" dist/styles.css

# Verify dual CSS custom properties (US3 — after T011)
rg "--pathable-font-heading" dist/styles.css
rg "--usa-font-heading" dist/styles.css

# Both should resolve to the same Fredoka font stack value
```

---

## 7. Execution Constraints

1. **Shard consolidation**: All `_uswds-theme.scss` writes (T003, T004, T005, T007, T008, T009, T012) MUST be in the same shard to avoid file conflicts. The `@use "uswds-core" with (...)` block is SINGLE — all `$theme-*` typography settings go into the existing block alongside color settings.
2. **Execution order within shard**: T001 (fonts) → T002 (index forward) → T003+T004 (typeface tokens + role assignments) → T005 (body typography) → T006 (build & verify US1) → T007+T008+T009 (type scale + headings + prose) → T010 (dual CSS props) → T011 (build & verify US3) → T012 (upgrade docs)
3. **Existing SCSS variables must be preserved**: `$pathable-font-*` values, `$typography-scale` map, `$ui-*` variables, `--pathable-font-*` and `--ui-*` CSS custom properties in `_typography.scss` must remain unchanged.
4. **Font files are not required for build**: `@font-face` rules compile successfully without font files present, but fonts won't render at runtime without them.
5. **Build command**: `sass --load-path=node_modules/@uswds/uswds/packages src/index.scss dist/styles.css` (via `pnpm build`)