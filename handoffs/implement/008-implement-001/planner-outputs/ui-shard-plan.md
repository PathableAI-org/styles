# UI Capability — Shard Plan

**Planner**: ui-planner-008
**Vertical Capability**: ui
**Feature**: 008-storybook-documentation
**Run ID**: 008-implement-001

## Capability Scope

Phase 5: US3 Theme — Customize the Storybook manager chrome with PathAble brand colors and typography. Two tasks covering `manager.js` (theme object via `@storybook/theming`) and `manager-head.html` (Google Fonts preconnect/stylesheet links).

## Dependency Graph

```
Phase 1 (Setup) ──> Phase 2 (Foundational) ──> Phase 5 (US3 Theme) [THIS CAPABILITY]
                                                   ├── T048 (manager.js)
                                                   └── T049 (manager-head.html)
```

The UI capability depends on **Phase 2 Foundational** (T005, T006, T007) being complete — those tasks create `main.js`, `preview.js`, and add Storybook scripts to `package.json`. Without those, the `.storybook/` directory exists but `manager.js` and `manager-head.html` have nothing to hook into.

No dependency on US1 (component stories) or US2 (utility stories) — theming is independent.

## Shards

### S01-ui-01: Storybook Theme Customization

| Field | Value |
|-------|-------|
| **Tasks** | T048, T049 |
| **Description** | Create `packages/styles/.storybook/manager.js` with a custom PathAble theme using `@storybook/theming` `create()`, and create `packages/styles/.storybook/manager-head.html` with Google Fonts preconnect and stylesheet links for Fredoka and Nunito. |
| **Depends on** | Phase 2 Foundational (T005, T006, T007) |
| **Parallelism** | T048 and T049 write to different files with no conflicts — can run in any order or in parallel |
| **Allowed read paths** | `packages/styles/`, `specs/008-storybook-documentation/data-model.md`, `specs/008-storybook-documentation/research.md`, `specs/008-storybook-documentation/plan.md`, `handoffs/implement/008-implement-001/context-index.json` |
| **Allowed write paths** | `packages/styles/.storybook/manager.js`, `packages/styles/.storybook/manager-head.html` |

#### Task Details

**T048 — Create `packages/styles/.storybook/manager.js`**

- Export custom theme via `import { addons } from '@storybook/manager-api'; import { create } from '@storybook/theming';`
- Theme field values from data-model.md StorybookTheme entity:
  - `brandTitle`: `"Pathable Styles"`
  - `brandUrl`: GitHub repo URL `"https://github.com/pathableai-org/styles"` (from spec context)
  - `colorPrimary`: `"#00365c"` (PathAble Blue / `--pathable-blue`)
  - `colorSecondary`: `"#1cae96"` (Intelligent Jade / `--intelligent-jade`)
  - `base`: `"light"`
  - `fontBase`: `"'Nunito', system-ui, sans-serif"` (body font)
  - `fontCode`: `"'ui-monospace', 'SFMono-Regular', monospace"` (code font from data-model.md)
  - `appBg`: `"#f8f9fa"` (light background)
  - `appContentBg`: `"#ffffff"` (white content area)
  - `barBg`: `"#00365c"` (PathAble Blue toolbar background)
  - `barTextColor`: `"#ffffff"` (white text on dark toolbar)
  - `textColor`: `"#1a1a1a"` (dark text)
  - `textMutedColor`: `"#6c757d"` (muted text — not Shilling Silver `#dde2e8`, as that is too light for readable muted text)
- Apply via `addons.setConfig({ theme: customTheme })`

**T049 — Create `packages/styles/.storybook/manager-head.html`**

- Google Fonts preconnect for `https://fonts.googleapis.com` and `https://fonts.gstatic.com`
- Stylesheet links for:
  - `https://fonts.googleapis.com/css2?family=Fredoka:wght@400&display=swap` (headings)
  - `https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap` (body text, regular + semibold)
- The `font-family` stacks set on `fontBase` in `manager.js` will use these loaded fonts
- Order: preconnect links first (performance), then stylesheet links

#### Validation Commands

```bash
# Verify manager.js exists and contains create() call
rg "create" packages/styles/.storybook/manager.js

# Verify brand colors are set
rg "#00365c" packages/styles/.storybook/manager.js
rg "#1cae96" packages/styles/.storybook/manager.js

# Verify brand title
rg "Pathable Styles" packages/styles/.storybook/manager.js

# Verify manager-head.html exists with Google Fonts links
rg "fonts.googleapis.com" packages/styles/.storybook/manager-head.html
rg "fonts.gstatic.com" packages/styles/.storybook/manager-head.html
rg "Fredoka" packages/styles/.storybook/manager-head.html
rg "Nunito" packages/styles/.storybook/manager-head.html

# Verify preconnect comes before stylesheet links
rg "preconnect" packages/styles/.storybook/manager-head.html
```

#### Context Gaps

None identified.

---

## Execution Order

1. **S01-ui-01** — After Phase 2 Foundational (T005-T007) completes. Can run in parallel with Phase 3 (US1 stories) and Phase 4 (US2 utilities) since there are no file conflicts.