# Implementation Plan: Brand Design Tokens

**Branch**: `001-brand-design-tokens` | **Date**: 2026-07-04 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)
- [Phase 0: Research](#phase-0-research)
- [Phase 1: Design and Contracts](#phase-1-design-and-contracts)

## Summary

Add PathAble brand design tokens (6 brand colors, 10 semantic colors, 4 font families, 10 typography scale roles, 7 spacing values, 4 elevation levels, 3 border-radius values) to the `@pathable/styles` SCSS package as CSS custom properties. Restructure the SCSS source into modular partials per token category. Fix structural markdown issues in the three documentation files (README.md, BRAND_RULES.md, AGENTS.md) and ensure they are included in the published package.

## Technical Context

**Language/Version**: Dart Sass (`sass` ^1.86.3) via pnpm build script

**Primary Dependencies**: Zero runtime dependencies. Dev dependencies: `sass` ^1.86.3, `stylelint` ^16.18.0, `prettier` ^3.5.0

**Storage**: Compiled CSS output (`dist/styles.css`) and SCSS source in the package. No database.

**Testing**: Manual build verification (`pnpm build`), linting (`pnpm lint:styles`), and format checking (`pnpm check:format`). No test framework configured.

**Target Platform**: Modern browsers supporting CSS custom properties (no IE11). Published as npm package.

**Project Type**: SCSS design token package (library), part of a pnpm monorepo workspace at `packages/styles`

**Performance Goals**: Build completes in under 10 seconds on dev machine. No runtime performance concerns (static CSS).

**Constraints**: Zero runtime dependencies. Must publish both compiled CSS and SCSS source. Must include documentation files in the published package.

**Scale/Scope**: Single package with ~50 CSS custom properties across 6 token categories. Three documentation files (markdown).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. CSS Custom Properties Are the Runtime Contract | PASS | All tokens will be emitted as CSS custom properties in `:root` |
| II. SCSS Is an Authoring and Extension Layer | PASS | SCSS modularized with partials; every Sass variable produces a CSS custom property |
| III. pnpm Workspaces Structure the Repository | PASS | Package lives at `packages/styles` in existing pnpm workspace |
| IV. First Implementation Slice Is Narrow | PASS | Only design tokens; no Vue, React, Tailwind, or full docs site in this feature |
| V. Published Artifacts Must Be Reliable | PASS | `dist/styles.css` compiled; `package.json` will declare entrypoints; doc files included via `"files"` |
| VI. Token Naming Must Be Semantic and Stable | PASS | `--pathable-color-bg`, `--pathable-color-text`, `--space-16`, `--elevation-sm`, etc. follow semantic convention |
| VII. Design Source Alignment Matters | PASS | All values confirmed from Brand Book PDF, Figma text/effect properties, and COLOR_AND_TYPOGRAPHY_RULES.md |
| VIII. Accessibility Is Part of Token Quality | PASS | SC-005 requires WCAG AA contrast (4.5:1) for `--pathable-color-text` on `--pathable-color-bg` |
| IX. Framework Independence Comes First | PASS | Pure SCSS/CSS; no framework dependencies |
| X. Documentation Is a First-Class Package Concern | PASS | README.md exists and is fixed; BRAND_RULES.md and AGENTS.md included; docs site deferred |
| XI. Versioning and Release Discipline | PASS | Token additions are minor version changes. Build output verified via `pnpm build` |

**Gate Result**: PASS — all constitution principles satisfied. No violations requiring complexity justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-brand-design-tokens/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
packages/styles/
├── package.json
├── README.md                    # Fix formatting issues
├── BRAND_RULES.md               # Fix formatting issues
├── AGENTS.md                    # Fix formatting issues
├── src/
│   ├── index.scss               # Main entry: @forward all partials
│   ├── _colors.scss             # Brand color tokens (--pathable-blue, etc.)
│   ├── _semantic.scss           # Semantic color tokens (--pathable-color-bg, etc.)
│   ├── _typography.scss         # Font families + typography scale
│   ├── _spacing.scss            # Spacing scale (--space-4 through --space-48)
│   ├── _elevation.scss          # Elevation tokens (--elevation-sm through --elevation-xl)
│   └── _radius.scss             # Border-radius tokens (--radius-sm, --radius-md, --radius-lg)
└── dist/
    ├── styles.css               # Compiled output
    └── styles.css.map           # Source map
```

**Structure Decision**: Modular SCSS partials within `packages/styles/src/`, one per token category, with `index.scss` as the single entry point using `@forward`. Flattened partial structure (no nested subdirectories) for simplicity.

## Complexity Tracking

No constitution violations detected. Complexity tracking is not required.

## Phase 0: Research

No unresolved unknowns or NEEDS CLARIFICATION markers remain in the spec. All token values have been confirmed from:
- Brand Book PDF (6 brand color hex values, 4 font families, typography roles)
- Figma text layer properties (typography scale: font-size, line-height, font-weight)
- Figma effect properties (elevation: box-shadow values using PathAble Blue at varying opacities)
- COLOR_AND_TYPOGRAPHY_RULES.md (font role mapping corrected)
- README.md, BRAND_RULES.md, AGENTS.md (semantic token naming with `--pathable-` prefix)

The `research.md` file should document the key data sources and the decision to use the package's authoritative documentation files for naming conventions.

### Research output: [research.md](research.md)

Create `research.md` documenting:
1. **Data Source**: Brand Book PDF (March 2026 by CTRL STUDIO) — hex/RGB/CMYK/Pantone for 6 brand colors
2. **Font Mapping Resolution**: COLOR_AND_TYPOGRAPHY_RULES.md corrected the FR-003 font-to-role mapping (alternate heading = Montserrat Bold, subheading = Poppins Bold)
3. **Typographic Scale**: Figma text nodes provided exact font-size and line-height for all 10 roles
4. **Elevation Values**: Figma drop-shadow effects provided exact box-shadow values for all 4 levels
5. **Semantic Token Naming**: README.md, BRAND_RULES.md, and AGENTS.md established the `--pathable-` prefix pattern
6. **READIME Markdown Issues**: README.md has a broken code block (missing closing ```) and unformatted section headings (Guidance, Accessibility, License as bare text) — confirmed by inspection

## Phase 1: Design and Contracts

### Data Model: [data-model.md](data-model.md)

The data model captures all token entities and their attributes:

1. **BrandColor**: name, kebab-name (CSS var), hex, description, category (primary/supporting)
2. **SemanticToken**: name (CSS var), role, light-mode value (brand color ref), description
3. **FontFamilyToken**: name (CSS var), font-name, weight, role, fallbacks
4. **TypographyScaleToken**: name (CSS var), role, font-family, font-size, line-height, font-weight
5. **SpacingToken**: name (CSS var), value (px)
6. **ElevationToken**: name (CSS var), level, box-shadow value
7. **RadiusToken**: name (CSS var), value (px)

### Contracts

This is a CSS design token package — there are no external API contracts, command schemas, or service interfaces. The public contract is the set of CSS custom properties emitted on `:root` and the SCSS `@forward` API.

Create [contracts/README.md](contracts/README.md) documenting:
- The CSS custom property naming convention (`--pathable-` prefix, `--space-`, `--elevation-`, `--radius-`)
- The SCSS entry point (`@use '@pathable/styles'`)
- How consumers import and use the tokens

### Quickstart: [quickstart.md](quickstart.md)

Create a quickstart guide showing:
1. Install: `pnpm add @pathable/styles`
2. CSS import path: `@import '@pathable/styles/dist/styles.css'` or in HTML as `<link>`
3. SCSS import path: `@use '@pathable/styles' as tokens;`
4. Basic usage examples with `var(--pathable-color-bg)`, `var(--space-16)`, `var(--pathable-font-heading)`
5. Build command: `cd packages/styles && pnpm build`

### Agent Context Update

After Phase 1 artifacts are created, run the agent context update script to register the new technology context (SCSS design tokens with `--pathable-` prefix naming convention).