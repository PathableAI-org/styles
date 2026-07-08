# Context Digest — Documentation Capability

**Vertical Capability**: documentation
**Feature**: 008-storybook-documentation
**Run ID**: 008-implement-001
**Planner ID**: planner-documentation-01

---

## Overview

Set up Storybook in `packages/styles` to provide browsable, local documentation for all `pathable-*` component wrappers and utility classes. Uses `@storybook/html-vite` framework, loads compiled `dist/styles.css`, and customizes the manager chrome with PathAble brand colors. Stories are plain HTML template strings in `.stories.js` files. No test runners or test addons.

**Reference documents**:
- `specs/008-storybook-documentation/spec.md` — Feature specification with FR-001 through FR-012
- `specs/008-storybook-documentation/plan.md` — Implementation plan with research decisions
- `specs/008-storybook-documentation/tasks.md` — All 53 tasks organized by phase
- `specs/008-storybook-documentation/research.md` — Framework selection, CSS loading, story format research
- `specs/008-storybook-documentation/data-model.md` — Entity model (ComponentStory, UtilityStory, StorybookTheme)
- `specs/008-storybook-documentation/contracts/story-interface.md` — Story file format contract
- `specs/008-storybook-documentation/quickstart.md` — Setup and usage guide with code examples
- `specs/008-storybook-documentation/context-index.json` — Context index with JS-driven components list

---

## Key Constraints

| Ref | Constraint | Details |
|-----|-----------|---------|
| FR-009 | No test addons | `@storybook/addon-interactions`, `@storybook/test`, `@storybook/jest` MUST NOT be installed or configured |
| FR-011 | Scoped to `packages/styles` | All config and stories live under `packages/styles/` — no changes to `apps/docs/` |
| FR-012 | JS-driven component note | Components requiring USWDS JS must include a note in story parameters: "This component requires USWDS JavaScript for full interactivity" |
| FR-004 | Load compiled CSS | `preview.js` must import `../dist/styles.css` — all examples use PathAble styles |
| Contract | No `.usa-*` classes | Stories only reference `pathable-*` classes, never underlying USWDS classes |
| Contract | No USWDS JS imports | Story files must not import or reference USWDS JavaScript modules |

---

## JS-Driven Components (must include USWDS JS dependency note)

From `context-index.json`:

- accordion, banner, combo-box, date-picker, date-range-picker, file-input, header, in-page-navigation, input-mask, modal, nav, search, site-alert, time-picker, tooltip, validation, character-count, language-selector

**Matching tasks that are JS-driven**: T016 (ComboBox), T017 (DatePicker), T018 (DateRangePicker), T024 (Header), T029 (Accordion), T031 (Banner), T032 (Modal), T034 (SiteAlert)

---

## Story File Contract (from story-interface.md)

### Default Export

```js
export default {
  title: 'Components/{Category}/{Name}',   // or 'Utilities/{Name}'
  tags: ['autodocs'],
};
```

### Named Exports (Stories)

```js
export const Default = {
  render: () => '<button class="pathable-button">Default Button</button>',
};

export const AccentCool = {
  render: () => '<button class="pathable-button pathable-button--accent-cool">Accent Cool</button>',
};
```

### JS-Driven Story Pattern

```js
export const Default = {
  render: () => '<div class="pathable-accordion">...</div>',
  parameters: {
    docs: {
      description: {
        story: '**Note:** This component requires USWDS JavaScript for full interactivity. Only static CSS documentation is provided here. See the USWDS documentation for JS setup.',
      },
    },
  },
};
```

### Utility Story Pattern

```js
export default {
  title: 'Utilities/Background Colors',
  tags: ['autodocs'],
};

export const AllColors = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      <div class="pathable-bg-primary" style="padding: 1rem; color: white;">pathable-bg-primary</div>
      <div class="pathable-bg-base" style="padding: 1rem; color: white;">pathable-bg-base</div>
      ...
    </div>
  `,
};
```

---

## Sidebar Structure

```
Components
├── Basic/             Button, Button Group, Card, Link, List, Tag, Table
├── Form Controls/     Checkbox, Combo Box, Date Picker, Date Range Picker, Input, Radio, Select, Textarea
├── Navigation/        Breadcrumb, Header, Pagination, Search, Sidenav, Skipnav
├── Communication/     Accordion, Alert, Banner, Modal, Process List, Site Alert, Step Indicator, Summary Box
└── Layout/            Icon, Media Block

Utilities
├── Background Colors    .pathable-bg-*
├── Text Colors          .pathable-text-*
├── Spacing              .pathable-padding-*, .pathable-margin-*
├── Display              .pathable-display-*
├── Typography           .pathable-font-family-*, .pathable-text-*
├── Border               .pathable-border-*, .pathable-border-radius-*
├── Flex & Alignment     .pathable-flex-*, .pathable-flex-align-*, .pathable-flex-justify-*
├── Width & Max Width    .pathable-width-*, .pathable-maxw-*
└── Text Alignment       .pathable-text-*
```

---

## Title Mapping (title → folder)

| Shard | Stories | Title Pattern |
|-------|---------|---------------|
| S03 | Button, ButtonGroup, Card, Link, List, Tag, Table | `Components/Basic/{Name}` |
| S04 | Checkbox, ComboBox, DatePicker, DateRangePicker, Input, Radio, Select, Textarea | `Components/Form Controls/{Name}` |
| S04 | Icon, MediaBlock | `Components/Layout/{Name}` |
| S05 | Breadcrumb, Header, Pagination, Search, Sidenav, Skipnav | `Components/Navigation/{Name}` |
| S06 | Accordion, Alert, Banner, Modal, ProcessList, SiteAlert, StepIndicator, SummaryBox | `Components/Communication/{Name}` |
| S07 | BackgroundColors, TextColors, Spacing, Display, TypographyUtilities, Border, FlexAlignment, Width, TextAlignment | `Utilities/{Name With Spaces}` |

---

## StorybookTheme Config (from data-model.md)

| Field | Value |
|-------|-------|
| brandTitle | `"Pathable Styles"` |
| brandUrl | `"https://github.com/pathableai/styles"` |
| colorPrimary | `#00365c` (PathAble Blue) |
| colorSecondary | `#1cae96` (Intelligent Jade) |
| base | `"light"` |
| fontBase | `'Nunito', system-ui, sans-serif` |
| fontCode | `'ui-monospace', 'SFMono-Regular', monospace` |
| appBg | `#f8f9fa` |
| appContentBg | `#ffffff` |
| barBg | `#00365c` |
| barTextColor | `#ffffff` |
| barSelectedColor | `#1cae96` |
| textColor | `#1a1a1a` |
| textMutedColor | `#6c757d` |

Manager head HTML must include Google Fonts preconnect + links for Fredoka (`.woff2`) and Nunito.

---

## Dependency Chain Per Shard

| Shard | Depends On | Description |
|-------|-----------|-------------|
| S01 | (none) | Install deps + create directories |
| S02 | S01 | Create `.storybook/main.js`, `preview.js`, update `package.json` scripts |
| S03 | S02 | Basic component stories (7 files) |
| S04 | S02 | Form Controls (8 files) + Layout (2 files) stories |
| S05 | S02 | Navigation component stories (6 files) |
| S06 | S02 | Communication component stories (8 files) |
| S07 | S02 | Utility stories (9 files) |
| S08 | S02 | Theme: `manager.js` + `manager-head.html` |
| S09 | S03–S08 | Build, verify, FR-009/FR-012 compliance checks |

---

## Existing Package State

**`packages/styles/package.json`** currently has:
- No Storybook dependencies (needs: `storybook`, `@storybook/html-vite`, `@storybook/addon-docs`, `@storybook/manager-api`, `@storybook/theming`)
- Scripts: `build`, `watch`, `lint:styles` (needs: `storybook`, `build-storybook`)
- Dependencies: `@uswds/uswds` ^3.0.0
- DevDependencies: sass, @fontsource/fredoka, @fontsource/montserrat, @fontsource/nunito, @fontsource/poppins

**Component wrappers** exist at `packages/styles/src/pathable-component-wrappers/` covering all USWDS components.

---

## Validation Strategy

- S01: Verify deps installed with `pnpm list`, check directories exist
- S02: Verify `main.js` and `preview.js` exist with correct content, scripts in package.json
- S03–S08: Verify story files exist with `test -f`, check key class references and autodocs tags
- S09: Run `pnpm build` (must succeed), run `pnpm storybook --ci` (starts without errors), verify no test addons in config, verify no `.usa-*` in story files, verify JS-driven stories include USWDS note