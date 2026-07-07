# Research: USWDS Typography Settings

## Decisions

### Decision D1: Brand Typeface to USWDS Font Role Mapping

Each PathAble brand typeface must be registered as a custom typeface token in USWDS and assigned to the appropriate role-based font token.

| Brand Font | Weight | USWDS Role | USWDS Type Assignment | Custom Configuration Required |
|---|---|---|---|---|
| Fredoka | Regular (400) | heading | `$theme-font-type-sans` → custom "fredoka" token | Yes — custom typeface token + custom-src |
| Nunito | Regular (400), SemiBold (600) | body, ui | `$theme-font-type-sans` → custom "nunito" token | Yes — shares sans type with Fredoka, or separate custom token |
| Poppins | Bold (700) | alt (subheading) | Custom typeface token | Yes — separate custom typeface token |
| Montserrat | Bold (700) | alt (alternate heading) | Custom typeface token | Yes — separate custom typeface token |

**Rationale**: USWDS supports custom typeface tokens via `$theme-typeface-tokens`. Each brand font needs its own token with a `display-name`, `cap-height`, and `stack`. The `stack` property defines the fallback chain (e.g., `'Fredoka', system-ui, sans-serif`). Typeface tokens are then assigned to type-based font tokens (`$theme-font-type-sans`, etc.), which are in turn assigned to role-based tokens (`$theme-font-role-heading`, etc.).

**NOTE**: Fredoka and Nunito cannot share the same `sans` type token if they need different font stacks. The recommended approach is to register each brand font as its own custom typeface token and assign them directly to roles. The `$theme-font-role-*` settings accept typeface token names (e.g., `"fredoka"`, `"nunito"`) as well as type-based tokens (`"sans"`, `"serif"`, etc.).

**Alternatives considered**:
- Using a single custom sans typeface and mapping all roles to it: rejected because Fredoka, Nunito, Poppins, and Montserrat are distinct typefaces that cannot be represented by a single font stack.
- Using built-in USWDS fonts (Source Sans Pro, Merriweather): rejected because they do not match PathAble brand guidelines.

### Decision D2: Custom Typeface Token Configuration

Each brand font needs a `$theme-typeface-tokens` entry and a `$theme-font-[family]-custom-src` entry for `@font-face` generation.

**Example structure** (Fredoka):
```scss
$theme-typeface-tokens: (
  "fredoka": (
    "display-name": "Fredoka",
    "cap-height": 364px,
    "stack": "'Fredoka', system-ui, sans-serif",
  ),
  "nunito": (
    "display-name": "Nunito",
    "cap-height": 364px,
    "stack": "'Nunito', system-ui, sans-serif",
  ),
  "poppins": (
    "display-name": "Poppins",
    "cap-height": 364px,
    "stack": "'Poppins', system-ui, sans-serif",
  ),
  "montserrat": (
    "display-name": "Montserrat",
    "cap-height": 364px,
    "stack": "'Montserrat', system-ui, sans-serif",
  ),
);
```

**Custom src example** (Fredoka, self-hosted in `assets/fonts/fredoka/`):
```scss
$theme-font-sans-custom-src: (
  dir: "fredoka",
  roman: (
    100: false,
    200: false,
    300: false,
    400: "Fredoka-Regular",
    500: false,
    600: false,
    700: false,
    800: false,
    900: false,
  ),
  italic: (
    100: false,
    200: false,
    300: false,
    400: false,
    500: false,
    600: false,
    700: false,
    800: false,
    900: false,
  ),
);
```

**Note**: The `$theme-font-[type]-custom-src` maps to a type-based font token (e.g., `sans`, `serif`, `mono`). If multiple fonts share the same type (e.g., Fredoka and Nunito both as `sans`), the custom src for that type can only point to one font directory. The solution is to use separate custom type tokens — or to rely on the `stack` property in `$theme-typeface-tokens` to define the font-family string, and handle `@font-face` rules outside of USWDS (via a separate CSS import or `@font-face` block in the project).

**Recommendation**: Use `$theme-typeface-tokens` to define the font stacks, and add `@font-face` rules manually in the project's own CSS (or via a separate partial) rather than using USWDS's custom-src system. This avoids the problem of multiple fonts sharing a single `$theme-font-[type]-custom-src` map.

### Decision D3: PathAble Type Scale to USWDS System Token Mapping

USWDS type scale system tokens (target px values, without normalization):

| System Token | Target px |
|---|---|
| micro | 10px |
| 1 | 12px |
| 2 | 13px |
| 3 | 14px |
| 4 | 15px |
| 5 | 16px |
| 6 | 17px |
| 7 | 18px |
| 8 | 20px |
| 9 | 22px |
| 10 | 24px |
| 11 | 28px |
| 12 | 32px |
| 13 | 36px |
| 14 | 40px |
| 15 | 48px |

**PathAble → USWDS mapping**:

| PathAble Token | Size | USWDS System Token | USWDS Theme Token | Notes |
|---|---|---|---|---|
| display-lg | 32px | 12 | needs custom `$theme-type-scale-xl` → 12 | Default xl is 12 (32px) — exact match |
| heading-lg | 24px | 10 | needs custom `$theme-type-scale-lg` → 10 | Default lg is 9 (22px) |
| heading-md | 20px | 8 | no default theme token | Use system token 8 directly |
| heading-sm / body-lg | 18px | 7 | needs custom `$theme-type-scale-md` → 7 | Default md is 6 (17px) |
| body-md | 16px | 5 | sm (default 5) | Exact match unchanged |
| body-sm / label-md | 14px | 3 | 2xs (default 3) | Exact match unchanged |
| label-sm / caption-md | 12px | 1 | needs custom `$theme-type-scale-3xs` → 1 | Default 3xs is 2 (13px) |

**Theme scale configuration needed**:
```scss
$theme-type-scale-3xs: 1,   // 12px (label-sm, caption-md)
$theme-type-scale-2xs: 3,   // 14px (body-sm, label-md) — unchanged default
$theme-type-scale-xs:  4,   // 15px — unchanged default
$theme-type-scale-sm:  5,   // 16px (body-md) — unchanged default
$theme-type-scale-md:  7,   // 18px (heading-sm, body-lg)
$theme-type-scale-lg:  10,  // 24px (heading-lg)
$theme-type-scale-xl:  12,  // 32px (display-lg) — unchanged default
$theme-type-scale-2xl: 14,  // 40px — unchanged default
$theme-type-scale-3xl: 15,  // 48px — unchanged default
```

**Heading size assignments**:
```scss
$theme-display-font-size: 'xl',   // 32px (display-lg)
$theme-h1-font-size: 'lg',        // 24px (heading-lg)
$theme-h2-font-size: 'md',        // 18px (heading-sm) — 20px (heading-md) has no theme token; use 18px or override
$theme-h3-font-size: 'md',        // 18px (heading-sm)
$theme-h4-font-size: 'sm',        // 16px (body-md)
$theme-h5-font-size: '2xs',       // 14px (body-sm)
$theme-h6-font-size: '3xs',       // 12px (label-sm)
$theme-body-font-size: 'sm',      // 16px (body-md)
```

**Note on heading-md (20px)**: USWDS theme tokens only have 9 size slots (3xs–3xl). 20px maps to system token 8, which has no default theme token assignment. The heading size settings accept theme tokens (3xs–3xl). Options:
- Use 'md' (18px, closest smaller) for h2 and accept the slight size difference
- Or set a custom heading size for h2 using a system token override

### Decision D4: Line-Height Mapping

USWDS line-height tokens (target values, unitless):

| Token | Target |
|---|---|
| 1 | 1.0 |
| 2 | 1.15 |
| 3 | 1.35 |
| 4 | 1.5 |
| 5 | 1.62 |
| 6 | 1.75 |

**PathAble → USWDS mapping**:

| PathAble Context | Size | Line-Height | Ratio | Closest USWDS Token | Notes |
|---|---|---|---|---|---|
| display | 32px | 40px | 1.25 | 3 (1.35) | Between 2 (1.15) and 3 (1.35) |
| heading-lg | 24px | 32px | 1.333 | 3 (1.35) | Close match |
| heading-md | 20px | 28px | 1.4 | 3 (1.35) or 4 (1.5) | Between 3 and 4 |
| heading-sm | 18px | 24px | 1.333 | 3 (1.35) | Close match |
| body-lg | 18px | 28px | 1.555 | 4 (1.5) or 5 (1.62) | Between 4 and 5 — use 5 |
| body-md | 16px | 24px | 1.5 | 4 (1.5) | Exact match |
| body-sm | 14px | 20px | 1.428 | 4 (1.5) | Close match |

**Settings**:
```scss
$theme-body-line-height: 5,        // 1.62 — default, suitable for body text
$theme-heading-line-height: 3,     // 1.35 — for headings
$theme-lead-line-height: 6,        // 1.75 — default
```

### Decision D5: Font Weight Configuration

USWDS font weight tokens (defaults):

| Token | Default |
|---|---|
| `$theme-font-weight-thin` | false |
| `$theme-font-weight-light` | 300 |
| `$theme-font-weight-normal` | 400 |
| `$theme-font-weight-medium` | false |
| `$theme-font-weight-semibold` | false |
| `$theme-font-weight-bold` | 700 |
| `$theme-font-weight-heavy` | false |

**PathAble → USWDS mapping**:

| Brand Font | Required Weights | USWDS Token | Custom? |
|---|---|---|---|
| Fredoka | Regular (400) | `$theme-font-weight-normal` | No — 400 is standard |
| Nunito | Regular (400) | `$theme-font-weight-normal` | No |
| Nunito | SemiBold (600) | `$theme-font-weight-semibold` → set to 600 | Yes — semi-bold is false by default |
| Poppins | Bold (700) | `$theme-font-weight-bold` | No — 700 is standard |
| Montserrat | Bold (700) | `$theme-font-weight-bold` | No — 700 is standard |

**Configuration**:
```scss
$theme-font-weight-semibold: 600,   // Enable for Nunito SemiBold (labels)
$theme-generate-all-weights: false, // Only generate the weights we need
```

### Decision D6: CSS Custom Property Duplication Strategy

**Decision**: Use SCSS `@each` loop over a combined map to emit both `--pathable-font-*` and `--usa-font-*` CSS custom properties from a single source of truth.

**Example approach**:
```scss
$typography-tokens: (
  'font-heading': $pathable-font-heading,
  'font-body': $pathable-font-body,
  // ...
);

:root {
  @each $name, $value in $typography-tokens {
    --pathable-#{$name}: #{$value};
    --usa-#{$name}: #{$value};
  }
}
```

**Rationale**: A single loop prevents duplication errors and ensures the two naming conventions always resolve to identical values. The map is the single source of truth.

**Alternatives considered**:
- Duplicate declarations (Option A): error-prone, violates DRY principle.
- `@extend`: not applicable to CSS custom properties.

### Decision D7: Typography Settings Architecture

**Decision**: Add typography `$theme-font-*` and related settings directly into the existing `_uswds-theme.scss` file, alongside the existing color settings, keeping all USWDS `@use "uswds-core" with (...)` configuration in a single file.

**Rationale**: FR-011 requires a single configuration file. Splitting color and typography into separate files would require either:
- Two `@use "uswds-core" with (...)` blocks (impossible — Sass modules can only be configured once), or
- A separate mechanism to merge the two configurations

Since the `@use ... with` block must be a single block, all typography settings will be added to the existing `_uswds-theme.scss` file.

**Alternatives considered**:
- Separate `_uswds-theme-typography.scss` partial: rejected because Sass's `@use ... with` can only appear once per module. Two partials would each need their own `@use ... with` block, which is not allowed.
- Typography values loaded from a separate map and merged: unnecessarily complex for a design token package.

### Decision D8: Custom Font @font-face Strategy

**Decision**: Add `@font-face` rules for Fredoka, Nunito, Poppins, and Montserrat in a dedicated `_fonts.scss` partial, rather than using USWDS's `$theme-font-*-custom-src` system.

**Rationale**: USWDS's `$theme-font-*-custom-src` is designed for a single font per type (e.g., one custom `sans` font). Since PathAble uses four distinct typefaces, the custom-src approach would not work for all of them. A manual `@font-face` partial gives full control over each font's file paths, weights, and styles.

**Configuration**:
```scss
// _fonts.scss — loaded before _uswds-theme.scss
@font-face {
  font-family: 'Fredoka';
  font-style: normal;
  font-weight: 400;
  src: url('#{$theme-font-path}/fredoka/Fredoka-Regular.woff2') format('woff2');
}

@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  src: url('#{$theme-font-path}/nunito/Nunito-Regular.woff2') format('woff2');
}

@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 600;
  src: url('#{$theme-font-path}/nunito/Nunito-SemiBold.woff2') format('woff2');
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  src: url('#{$theme-font-path}/poppins/Poppins-Bold.woff2') format('woff2');
}

@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  src: url('#{$theme-font-path}/montserrat/Montserrat-Bold.woff2') format('woff2');
}
```

**Font path**: `$theme-font-path` defaults to `../fonts` relative to the compiled CSS. Font files should be placed at:
- `packages/styles/fonts/fredoka/Fredoka-Regular.woff2`
- `packages/styles/fonts/nunito/Nunito-Regular.woff2`
- `packages/styles/fonts/nunito/Nunito-SemiBold.woff2`
- `packages/styles/fonts/poppins/Poppins-Bold.woff2`
- `packages/styles/fonts/montserrat/Montserrat-Bold.woff2`

**Alternatives considered**:
- Using USWDS `$theme-font-*-custom-src` for each type: rejected because USWDS only supports one custom font per type (sans, serif, mono, etc.), and we have four distinct typefaces.
- Using a CDN (Google Fonts, etc.): rejected for consistency with the self-hosting approach implied by the spec assumptions.

### Decision D9: Body Typography and Prose Settings

**Body configuration**:
```scss
$theme-body-font-family: 'body',       // Nunito via role assignment
$theme-body-font-size: 'sm',           // 16px
$theme-body-line-height: 5,            // 1.62
$theme-style-body-element: false,      // Don't add explicit body styles (existing behavior)
```

**Prose configuration**:
```scss
$theme-prose-font-family: 'body',      // Nunito
$theme-lead-font-family: 'heading',    // Fredoka for lead/intro text
$theme-lead-font-size: 'lg',           // 24px
$theme-lead-line-height: 6,            // 1.75
$theme-lead-measure: 6,                // Wide measure for lead text
$theme-heading-margin-top: 1.5em,      // Breathing room per brand guide
$theme-paragraph-margin-top: 1em,      // Breathing room per brand guide
```

**Global styles**: Keep `$theme-global-content-styles: false`, `$theme-global-paragraph-styles: false`, and `$theme-global-link-styles: false` to maintain existing behavior (no automatic HTML element styling).

### Decision D10: Root Font Size

**Configuration**:
```scss
$theme-respect-user-font-size: true,   // Default — respects browser preferences
```

**Rationale**: Accessibility best practice. When `true`, the root font size is `100%` and media queries use ems. When `false`, a fixed px value is used. Per spec assumptions, this remains `true`.

## Alternatives Considered

| Alternative | Rejected Because |
|---|---|
| Using built-in USWDS fonts (Source Sans Pro, Merriweather) | Does not match PathAble brand guidelines for Fredoka, Nunito, etc. |
| Single custom sans typeface for all roles | Cannot represent 4 distinct typefaces with different font stacks |
| USWDS `$theme-font-*-custom-src` for all fonts | Supports only one custom font per type; cannot handle 4 distinct fonts |
| CDN font loading (Google Fonts) | Inconsistent with self-hosting model; spec assumes self-hosted fonts |
| Separate `_uswds-theme-typography.scss` partial | Sass `@use ... with` can only appear once per module |
| Duplicate CSS custom property declarations | Error-prone, violates DRY principle |