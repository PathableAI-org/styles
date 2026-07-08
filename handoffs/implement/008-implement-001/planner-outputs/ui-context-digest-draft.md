# Context Digest — UI Capability: Storybook Theme Customization (Draft)

**Planner**: ui-planner-008
**Feature**: 008-storybook-documentation
**Run ID**: 008-implement-001
**Vertical Capability**: ui (Phase 5: US3 Theme)
**Tasks**: T048, T049

---

## 1. Feature Summary

Customize the Storybook manager UI chrome with PathAble brand colors and typography. Two files are created in `packages/styles/.storybook/`:

- **`manager.js`** — Custom theme object using `@storybook/theming` `create()` function, applied via `addons.setConfig()`
- **`manager-head.html`** — Google Fonts preconnect and stylesheet links so Fredoka and Nunito render in the Storybook manager UI

---

## 2. Task Details

### T048 — Create `packages/styles/.storybook/manager.js`

**Purpose**: Customize the Storybook manager chrome (sidebar, toolbar, buttons, text) with PathAble brand identity.

**API**:
- `import { addons } from '@storybook/manager-api'`
- `import { create } from '@storybook/theming'`
- `addons.setConfig({ theme: customTheme })`

**Theme field values** (from data-model.md StorybookTheme entity with adjustments):

| Theme Field | Value | Source |
|-------------|-------|--------|
| `brandTitle` | `"Pathable Styles"` | Package name |
| `brandUrl` | `"https://github.com/pathableai-org/styles"` | GitHub repo |
| `colorPrimary` | `"#00365c"` | PathAble Blue (`--pathable-blue`) |
| `colorSecondary` | `"#1cae96"` | Intelligent Jade (`--intelligent-jade`) |
| `base` | `"light"` | Light theme |
| `fontBase` | `"'Nunito', system-ui, sans-serif"` | Body font (`--pathable-font-body`) |
| `fontCode` | `"'ui-monospace', 'SFMono-Regular', monospace"` | Code font (`--pathable-font-mono`) |
| `appBg` | `"#f8f9fa"` | Light background |
| `appContentBg` | `"#ffffff"` | White content area |
| `barBg` | `"#00365c"` | PathAble Blue toolbar background |
| `barTextColor` | `"#ffffff"` | White text on dark toolbar |
| `textColor` | `"#1a1a1a"` | Dark text |
| `textMutedColor` | `"#6c757d"` | Muted text (standard muted gray, NOT Shilling Silver `#dde2e8` which is too light for readability) |

**Note on `textMutedColor`**: The data-model.md StorybookTheme entity suggests `#dde2e8` (Shilling Silver), but that is too light for readable muted text on a white background. The more accessible value `#6c757d` (Bootstrap's muted text color) is used instead. This is a deliberate accessibility improvement — Shilling Silver is fine as a background/border color but fails WCAG contrast for text.

### T049 — Create `packages/styles/.storybook/manager-head.html`

**Purpose**: Load Google Fonts for Fredoka (headings) and Nunito (body) in the Storybook manager iframe so the `fontBase` and `fontCode` stacks in the theme render correctly.

**Structure** (preconnect before stylesheets for optimal loading performance):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap" />
```

**Font details**:
- Fredoka: weight 400 (Regular) — used for headings via `$theme-font-role-heading: "fredoka"` / `--pathable-font-heading`
- Nunito: weights 400 (Regular), 600 (SemiBold) — used for body and UI text via `--pathable-font-body`

---

## 3. Key Design Decisions (from R0-5)

| Decision | Value | Rationale |
|----------|-------|-----------|
| Theme API | `@storybook/theming` `create()` | Standard Storybook API for custom themes |
| Manager HTML | `manager-head.html` file (not JS) | Google Fonts loads before JS executes, reducing FOUT |
| Font strategy | Google Fonts CDN (not self-hosted) | Manager runs in developer's browser, no font file distribution needed |
| Theme application | `addons.setConfig()` | Standard Storybook pattern for applying custom themes |
| `base` value | `"light"` | Matches the PathAble brand which is primarily light-themed |
| `textMutedColor` | `#6c757d` (not `#dde2e8`) | Accessibility — Shilling Silver is too light for text on white |

---

## 4. Critical Constraints

1. **Dependency on Foundational Phase**: T048 and T049 require Phase 2 (T005-T007) to be complete — the `.storybook/` directory must exist, `main.js` must be configured, and Storybook must be installable/runnable.
2. **No test addons**: FR-009 prohibits test-related addons. The theme is purely cosmetic — no testing implications.
3. **No USWDS JavaScript**: The manager theme does not import or reference any USWDS code.
4. **`@storybook/theming` vs `@storybook/manager-api`**: `create()` comes from `@storybook/theming`, while `addons.setConfig()` comes from `@storybook/manager-api`. Both packages should already be installed as dependencies from Phase 1 Setup (T001).
5. **Fredoka not in fontBase**: The `fontBase` field uses Nunito (body font), NOT Fredoka (heading font). Storybook's theme only supports a single `fontBase` for the manager UI — Fredoka is loaded for potential use in the brand title and heading-level elements, but Nunito is the primary manager UI font.

---

## 5. No File Conflicts

T048 (`manager.js`) and T049 (`manager-head.html`) write to separate files with no overlap. They can execute in any order or in parallel.

These files do NOT conflict with:
- Phase 1 Setup tasks (T001-T004) — create directories and install deps
- Phase 2 Foundational tasks (T005-T007) — create `main.js`, `preview.js`, update `package.json`
- Phase 3 US1 tasks (T008-T038) — component stories in `src/stories/components/`
- Phase 4 US2 tasks (T039-T047) — utility stories in `src/stories/utilities/`

---

## 6. Asset Bindings

| Asset | Purpose | Status |
|-------|---------|--------|
| Google Fonts CDN | Fredoka and Nunito font files | External — no local files needed. Loaded via CDN in `manager-head.html` |
| `@storybook/theming` npm package | `create()` function for theme | Dev dependency installed in Phase 1 Setup (T001) |
| `@storybook/manager-api` npm package | `addons.setConfig()` function | Dev dependency installed in Phase 1 Setup (T001) |

---

## 7. Validation Commands

```bash
# File existence
test -f packages/styles/.storybook/manager.js && echo "OK: manager.js exists"
test -f packages/styles/.storybook/manager-head.html && echo "OK: manager-head.html exists"

# Theme content
rg "create" packages/styles/.storybook/manager.js && echo "OK: create() used"
rg "addons.setConfig" packages/styles/.storybook/manager.js && echo "OK: setConfig used"
rg "'#00365c'" packages/styles/.storybook/manager.js && echo "OK: colorPrimary"
rg "'#1cae96'" packages/styles/.storybook/manager.js && echo "OK: colorSecondary"
rg "Pathable Styles" packages/styles/.storybook/manager.js && echo "OK: brandTitle"

# Google Fonts
rg "preconnect" packages/styles/.storybook/manager-head.html && echo "OK: preconnect"
rg "fonts.googleapis.com" packages/styles/.storybook/manager-head.html && echo "OK: Google Fonts linked"
rg "Fredoka" packages/styles/.storybook/manager-head.html && echo "OK: Fredoka"
rg "Nunito" packages/styles/.storybook/manager-head.html && echo "OK: Nunito"
```

---

## 8. Context Gaps

None identified. All theme field values, font URLs, and API imports are fully specified from the research and data-model artifacts.