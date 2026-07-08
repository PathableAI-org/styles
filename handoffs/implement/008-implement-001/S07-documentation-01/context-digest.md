# Context Digest — S07-documentation-01 (US2 Utilities)

## Tasks
9 story files for utility class groups. These use `Utilities/` prefix for their title.

## Story Format for Utilities
- Use a single `All` export or multiple demo exports showing available values
- Utility stories use `div` elements with utility classes applied
- Show responsive variants where applicable (e.g., `pathable-display-none-desktop`)
- NO `.usa-*` class references — use only `pathable-*` prefixed classes
- None of these are JS-driven

## Title Assignments
- BackgroundColors → `Utilities/Background Colors`
- TextColors → `Utilities/Text Colors`
- Spacing → `Utilities/Spacing`
- Display → `Utilities/Display`
- TypographyUtilities → `Utilities/Typography`
- Border → `Utilities/Border`
- FlexAlignment → `Utilities/Flex & Alignment`
- Width → `Utilities/Width`
- TextAlignment → `Utilities/Text Alignment`

## Utility Classes Reference
- `.pathable-bg-*`: primary, base, surface, accent, link, focus-ring, danger, success, transparent
- `.pathable-text-*`: base, primary, muted, accent, link, white
- `.pathable-padding-*` / `.pathable-margin-*`: 0-10, 15; responsive: `{value}-mobile-lg`, `-tablet`, `-desktop`
- `.pathable-display-*`: flex, block, inline, inline-block, none; responsive variants
- `.pathable-font-family-*`: ui, heading, body, code, serif
- `.pathable-text-*` (font-weight): normal, bold, heavy
- `.pathable-border-*`: 0-5
- `.pathable-border-radius-*`: sm, md, lg
- `.pathable-flex-*`, `.pathable-flex-align-*`, `.pathable-flex-justify-*`
- `.pathable-width-*`: full, auto
- `.pathable-maxw-*`: mobile, mobile-lg, tablet, desktop
- `.pathable-text-*` (align): center, left, right; responsive variants