# Research: Typography Storybook Section

## Topic 1: Existing Typography Tokens Audit

### Source of Truth

`packages/styles/src/_typography.scss` defines all typography tokens. The file emits CSS custom properties in three categories:

1. **Font role tokens** (via `$typography-tokens` map → `--pathable-*` / `--usa-*`):
   - `--pathable-font-heading` / `--usa-font-heading` — Fredoka stack
   - `--pathable-font-body` / `--usa-font-body` — Nunito stack
   - `--pathable-font-mono` / `--usa-font-mono` — monospace stack
   - `--pathable-font-alt` / `--usa-font-alt` — Montserrat stack
   - `--pathable-font-subheading` — Poppins stack (pathable-only, no `--usa-*` equivalent)

2. **Font size tokens** (via `$typography-tokens` map):
   - `--pathable-font-size-display-lg` (32px), `--pathable-font-size-heading-lg` (24px), `--pathable-font-size-heading-md` (20px), `--pathable-font-size-heading-sm` (18px)
   - `--pathable-font-size-body-lg` (18px), `--pathable-font-size-body-md` (16px), `--pathable-font-size-body-sm` (14px)
   - `--pathable-font-size-label-md` (14px), `--pathable-font-size-label-sm` (12px)
   - `--pathable-font-size-caption-md` (12px)

3. **Font weight and line-height tokens** (via `$typography-tokens` map):
   - `--pathable-font-weight-normal` (400), `--pathable-font-weight-semibold` (600), `--pathable-font-weight-bold` (700)
   - `--pathable-font-line-height-heading` (1.25), `--pathable-font-line-height-body` (1.5)

4. **UI size tokens** (via `$ui-*` variables → `--ui-*`):
   - `--ui-display-lg` through `--ui-caption-md` — size-only values (no font-family, weight, or line-height)

Additionally, the `$typography-scale` map in `_typography.scss` aggregates font-family, font-size, line-height, and font-weight per scale token but does NOT emit these as individual CSS custom properties. It is used for SCSS compilation only.

### Assessment: Are Role-Based Semantic Typography Tokens Missing?

**FR-008 assessment**: The spec asks whether semantic typography tokens like `--pathable-typography-heading-font` or `--pathable-typography-body-size` are missing.

**Decision**: No new tokens are needed. The existing `--pathable-font-*` namespace already provides semantic role-based coverage:

| Role | Existing Token | Status |
| ------ | --------------- | -------- |
| Heading font family | `--pathable-font-heading` | ✅ Already exists |
| Body font family | `--pathable-font-body` | ✅ Already exists |
| Alternate heading font | `--pathable-font-alt` | ✅ Already exists |
| Subheading font | `--pathable-font-subheading` | ✅ Already exists |
| Body font size (md) | `--pathable-font-size-body-md` | ✅ Already exists |
| Heading font weight | `--pathable-font-weight-bold` | ✅ Already exists |

The `--pathable-font-*` prefix is already a semantic naming convention. Adding a `--pathable-typography-*` alias would duplicate the existing tokens without adding value. The Storybook story will reference the existing `--pathable-font-*` tokens directly.

### Alternative Considered

Creating a new `--pathable-typography-*` token namespace:

- **Rejected because**: The existing `--pathable-font-*` tokens already serve the semantic role. Adding a parallel namespace would create confusion about which set is authoritative. The spec's FR-008 uses an "if missing" conditional — the existing tokens are not missing.

---

## Topic 2: Existing Brand / Color Usage Story Pattern Analysis

### Source of Truth

`packages/styles/src/stories/brand/ColorUsage.stories.js`

### Pattern Summary

| Aspect | Pattern |
| -------- | --------- |
| **File location** | `packages/styles/src/stories/brand/` |
| **Export default** | `{ title: 'Brand/Color Usage', tags: ['autodocs'] }` |
| **Story export** | Single `Default` export with `render: () => \`...\`` |
| **Rendering** | HTML template string returned from render function |
| **Data** | Arrays of objects at module level, then `.map().join('')` inside template |
| **Styling** | Inline styles throughout (no utility classes) |
| **Sections** | `<section>` elements with `margin-bottom` for spacing |
| **Tables** | Hand-coded `<table>` with `<thead>` and `<tbody>` |
| **Color swatches** | Inline `<span>` with `background-color` and `border` |
| **Code display** | `<code>` elements for token names |
| **Typography** | System font family, PathAble Blue and Tech Teal text colors |

### Key Implementation Details

- The `export default` object uses `title: 'Brand/Color Usage'` — the forward slash creates the Storybook category hierarchy.
- All data is computed at module level as exported constants, then referenced in the template.
- The `render` function is a simple arrow function returning a template literal.
- No React or framework components — pure HTML strings.
- Uses `autodocs` tag for automatic documentation generation.

### Application to Typography Story

The Typography story will follow the exact same pattern:

- `export default { title: 'Brand/Typography', tags: ['autodocs'] }`
- Single `Default` export with `render` returning HTML string
- Data-driven sections for font roles, type scale, long-text examples, and violations
- Same inline styling convention
- Same `<section>` layout structure

---

## Topic 3: FEEDBACK.md Handling

### Current State

`FEEDBACK.md` is currently tracked by git (`git ls-files` confirms it exists in the index).

### Decision

Use `git rm FEEDBACK.md` to remove the file from both the working tree and the git index. The file is a temporary assessment that should not be version-controlled. Since the feedback content has been processed into the spec, the file has no ongoing value.

### Alternative Considered

Adding `FEEDBACK.md` to `.gitignore` without removing it from the index:

- **Rejected because**: The file would still be tracked by git (`.gitignore` only affects untracked files). A `git rm --cached` would be needed, which is equivalent to the chosen approach but leaves the file on disk. Since the file is temporary and its content has been captured, complete removal is cleaner.

---

## Consolidated Decisions

| Topic | Decision | Rationale |
| ------- | ---------- | ----------- |
| New semantic typography tokens | Not needed | Existing `--pathable-font-*` tokens already cover all roles |
| Typography story pattern | Follow `ColorUsage.stories.js` | Same brand category, same rendering approach, same conventions |
| FEEDBACK.md | `git rm FEEDBACK.md` | Temporary file, content captured in spec, no ongoing value |
