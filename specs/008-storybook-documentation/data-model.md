# Data Model: Storybook Documentation

**Branch**: `008-storybook-documentation` | **Date**: 2026-07-08 | **Plan**: [plan.md](./plan.md)

## Entities

### ComponentStory

Maps a `pathable-*` component wrapper to a `.stories.js` file that documents its usage.

| Field | Type | Description |
| ------- | ------ | ------------- |
| `title` | String | Storybook sidebar path, e.g., `"Components/Basic/Button"` |
| `fileName` | String | Relative path from `src/stories/`, e.g., `"components/Button.stories.js"` |
| `componentClass` | String | The primary CSS class, e.g., `"pathable-button"` |
| `uswdsSource` | String | The USWDS component being wrapped, e.g., `"usa-button"` |
| `isJsDriven` | Boolean | Whether the component requires USWDS JavaScript for interactivity |
| `category` | ComponentCategory | The functional category this component belongs to |
| `stories` | Story[] | The named story exports documenting variants and states |
| `modifierClasses` | String[] | All modifier class variants, e.g., `["--accent-cool", "--outline", "--big"]` |
| `subElementClasses` | String[] | Sub-element classes, e.g., `["__heading", "__content", "__button"]` |
| `tags` | String[] | Storybook tags, e.g., `["autodocs"]` |

### ComponentCategory

Enumeration of functional categories for component grouping.

| Value | Description | Example Components |
| ------- | ------------- | ------------------- |
| `Basic` | Simple, standalone components | Button, Card, Link, List, Tag, Table |
| `FormControls` | Input and form-related components | Checkbox, Input, Radio, Select, Textarea, Combo Box, Date Picker |
| `Navigation` | Navigation and wayfinding components | Breadcrumb, Header, Pagination, Search, Sidenav, Skipnav |
| `Communication` | Alerts, messaging, and information display | Accordion, Alert, Banner, Modal, Process List, Site Alert, Step Indicator, Summary Box |
| `Layout` | Layout and structural components | Grid, Icon, Media Block |

### Story

A named story export that renders a specific variant or state of a component.

| Field | Type | Description |
| ------- | ------ | ------------- |
| `name` | String | Export name, e.g., `"Default"`, `"AccentCool"`, `"Outline"` |
| `displayName` | String | Human-readable name shown in Storybook sidebar |
| `description` | String | Optional description text shown in the Docs tab |
| `htmlTemplate` | String | The HTML template string to render |
| `args` | Object | Optional args for interactive controls |
| `argTypes` | Object | Optional arg type definitions for the controls panel |

### UtilityStory

Maps a utility module group to a `.stories.js` file.

| Field | Type | Description |
| ------- | ------ | ------------- |
| `title` | String | Storybook sidebar path, e.g., `"Utilities/Background Colors"` |
| `fileName` | String | Relative path from `src/stories/`, e.g., `"utilities/BackgroundColors.stories.js"` |
| `classPattern` | String | The CSS class pattern, e.g., `".pathable-bg-{value}"` |
| `cssProperty` | String | The CSS property being set, e.g., `"background-color"` |
| `values` | UtilityValue[] | The supported values and their display |
| `hasResponsiveVariants` | Boolean | Whether responsive breakpoint variants exist |
| `hasStateVariants` | Boolean | Whether state variants (hover, focus) exist |
| `stories` | Story[] | The named story exports |

### UtilityValue

A single value within a utility module.

| Field | Type | Description |
| ------- | ------ | ------------- |
| `name` | String | The value name, e.g., `"primary"`, `"4"`, `"flex"` |
| `class` | String | The full class, e.g., `"pathable-bg-primary"`, `"pathable-padding-4"` |
| `cssValue` | String | The resolved CSS value, e.g., `"#00365c"`, `"2rem"` |
| `colorSwatch` | String | Hex color value if the utility is a color (for swatch display) |

### StorybookConfig

The Storybook configuration files in `packages/styles/.storybook/`.

| File | Purpose |
| ------ | --------- |
| `main.js` | Framework selection (`@storybook/html-vite`), stories glob pattern, addons, autodocs config |
| `preview.js` | Global CSS import (`dist/styles.css`), global decorators, global parameters |
| `manager.js` | Custom theme using `@storybook/manager-api`, brand colors and fonts |

### StorybookTheme

The custom PathAble theme for the Storybook manager UI.

| Field | Value | Source |
| ------- | ------- | -------- |
| `brandTitle` | `"Pathable Styles"` | Package name |
| `brandUrl` | `"https://pathableai-org.github.io/styles"` or GitHub repo URL | Docs site |
| `colorPrimary` | `#00365c` | PathAble Blue (`--pathable-blue`) |
| `colorSecondary` | `#1cae96` | Intelligent Jade (`--intelligent-jade`) |
| `base` | `"light"` | Light theme for sidebar |
| `fontBase` | `'Nunito', system-ui, sans-serif` | Body font (`--pathable-font-body`) |
| `fontCode` | `'ui-monospace', 'SFMono-Regular', monospace` | Code font (`--pathable-font-mono`) |
| `appBg` | `#f8f9fa` | Light background |
| `appContentBg` | `#ffffff` | White content area |
| `barBg` | `#00365c` | PathAble Blue toolbar background |
| `barTextColor` | `#ffffff` | White text on toolbar |
| `textColor` | `#1a1a1a` | Dark text |
| `textMutedColor` | `#6c757d` | Muted text |

## Relationships

```
ComponentCategory 1──* ComponentStory
ComponentStory 1──* Story
UtilityStory 1──* Story
UtilityStory 1──* UtilityValue
StorybookConfig 1──1 StorybookTheme
```

## Validation Rules

1. Every `ComponentStory.fileName` must correspond to an existing `.stories.js` file in `src/stories/components/`.
2. Every `UtilityStory.fileName` must correspond to an existing `.stories.js` file in `src/stories/utilities/`.
3. `ComponentStory.isJsDriven` must be `true` for components that require USWDS JavaScript (accordion, banner, combo-box, date-picker, date-range-picker, file-input, header, in-page-navigation, input-mask, modal, navigation, site-alert, tooltip, validation).
4. Stories tagged `autodocs` must have a `render` function that returns valid HTML.
5. Utility stories must not use `argTypes` or `args` (they are static documentation).
6. No story file may import or reference USWDS JavaScript modules.
7. No story file may reference `.usa-*` classes — only `pathable-*` classes are documented.
