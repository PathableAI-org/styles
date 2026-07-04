# Context Digest: Domain Model — All Token Partials (US1 + US2 + US3)

## Tasks (18 total)
- **T001**: Remove placeholder content from index.scss
- **T005**: Create index.scss with @forward for all partials
- **T006**: Verify pnpm build succeeds
- **T007-T011**: Create _colors.scss, _typography.scss, _spacing.scss, _elevation.scss, _radius.scss (US1)
- **T012**: Build and verify US1 output
- **T013**: Create _semantic.scss with 10 semantic tokens (US2)
- **T014**: Build and verify US2 + WCAG AA contrast
- **T015-T020**: Add Sass maps to all 6 partials (US3)
- **T021**: Verify exports with test import
- **T022**: Build and clean test file

## Research Context

### Brand Colors
- `--pathable-blue`: #00365c (primary)
- `--intelligent-jade`: #1cae96 (primary)
- `--bright-blue-brooks`: #4899e8 (primary)
- `--tech-teal`: #015a76 (supporting)
- `--lived-in-lime`: #d3ff66 (supporting)
- `--shilling-silver`: #dde2e8 (supporting)

### Font-to-Role Mapping
- Heading: Fredoka Regular
- Alternate Heading: Montserrat Bold
- Subheading: Poppins Bold
- Body Text: Nunito Regular

### Typography Scale (from research.md Section 3)
| Role | Font | Size | Line-Height | Weight |
|------|------|------|-------------|--------|
| ui/display/lg | Fredoka Regular | 32px | 40px | 400 |
| ui/heading/lg | Poppins Bold | 24px | 32px | 700 |
| ui/heading/md | Poppins Bold | 20px | 28px | 700 |
| ui/heading/sm | Poppins Bold | 18px | 24px | 700 |
| ui/body/lg | Nunito Regular | 18px | 28px | 400 |
| ui/body/md | Nunito Regular | 16px | 24px | 400 |
| ui/body/sm | Nunito Regular | 14px | 20px | 400 |
| ui/label/md | Nunito SemiBold | 14px | 20px | 600 |
| ui/label/sm | Nunito SemiBold | 12px | 16px | 600 |
| ui/caption/md | Nunito Regular | 12px | 16px | 400 |

### Elevation Box-Shadows (from research.md Section 4)
- sm: `0px 1px 2px 0px rgba(0, 54, 92, 0.12)`
- md: `0px 4px 8px 0px rgba(0, 54, 92, 0.16)`
- lg: `0px 8px 16px -2px rgba(0, 54, 92, 0.20)`
- xl: `0px 12px 24px -4px rgba(0, 54, 92, 0.24)`

### Semantic Token Mappings (from data-model.md)
- `--pathable-color-bg`: Shilling Silver or White
- `--pathable-color-surface`: White
- `--pathable-color-text`: PathAble Blue (#00365c)
- `--pathable-color-text-muted`: Tech Teal (#015a76)
- `--pathable-color-border`: Shilling Silver (#dde2e8)
- `--pathable-color-link`: Bright Blue Brooks (#4899e8)
- `--pathable-color-accent`: Intelligent Jade (#1cae96)
- `--pathable-color-focus-ring`: Bright Blue Brooks (#4899e8)
- `--pathable-color-danger`: Red (TBD)
- `--pathable-color-success`: Intelligent Jade (#1cae96)

### Naming Convention (from contracts/README.md)
- Brand Colors: `--pathable-` lowercase-kebab
- Font Families: `--pathable-font-` role
- Typography Scale: `--ui-role-size`
- Spacing: `--space-{px}`
- Elevation: `--elevation-{level}`
- Radius: `--radius-{size}`

### Radius Values (from data-model.md)
- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 12px

### Spacing Scale
- 4px, 8px, 12px, 16px, 24px, 32px, 48px

### WCAG AA Requirement (SC-005)
- #00365c on #dde2e8 = ~7.3:1 contrast ratio (passes 4.5:1)

### Current State
- Existing index.scss has placeholder content (Indigo/Purple colors, Inter font)
- No SCSS partials exist yet
- Build compiles with `sass src/index.scss dist/styles.css`

## Validation Commands (expected in receipt)
- `cd packages/styles && pnpm build`
- grep for each token category in dist/styles.css