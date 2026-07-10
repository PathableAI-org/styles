# Research: Storybook Setup for Pathable Styles

**Branch**: `008-storybook-documentation` | **Date**: 2026-07-08 | **Plan**: [plan.md](./plan.md)

## Research Tasks

### R0-1: Storybook Framework Selection

**Question**: Which Storybook framework is most appropriate for documenting CSS-only components that use `pathable-*` classes on plain HTML?

**Decision**: Use `@storybook/html-vite`.

**Rationale**:

- `@storybook/html-vite` is the lightest-weight Storybook framework, requiring no React, Vue, Lit, or other frontend framework dependency.
- Stories are simple JavaScript functions that return HTML template strings, which maps directly to our use case of rendering `<div class="pathable-button">...</div>` etc.
- Vite provides fast dev server startup and hot module replacement.
- No framework dependency is introduced to the `@pathable/styles` package, preserving its CSS-only nature.
- ES module format (`*.stories.js`) is standard and well-supported.

**Alternatives considered**:

| Option | Decision | Reason for rejection |
| -------- | ---------- | --------------------- |
| `@storybook/web-components-vite` | Rejected | Adds Lit dependency; over-engineered for CSS class documentation |
| `@storybook/react-vite` | Rejected | Adds React dependency; misleading since components aren't React-based |
| `@storybook/html-webpack5` | Rejected | Webpack is slower than Vite and adds unnecessary complexity |

### R0-2: CSS Loading Strategy

**Question**: How should the compiled `dist/styles.css` be loaded in Storybook so all examples render with PathAble styling?

**Decision**: Import `dist/styles.css` directly in `preview.js`.

**Rationale**:

- `import '../dist/styles.css'` in `preview.js` is the standard Storybook pattern for global CSS.
- Vite processes the CSS import seamlessly as part of its module pipeline.
- The developer runs `pnpm build` before `pnpm storybook` (at least once, or as part of the storybook script).
- CSS custom properties (`--pathable-*`) are available globally through the imported stylesheet.

**Workflow**: The `storybook` script in `package.json` will be `storybook dev -p 6006` (or a combined `pnpm build && storybook dev -p 6006` for convenience). The preview.js import handles the rest.

**Alternatives considered**:

| Option | Decision | Reason for rejection |
| -------- | ---------- | --------------------- |
| `preview-head.html` link tag | Rejected | Non-standard; Vite serves static files but import is cleaner |
| Build-before-start custom script | Rejected | `pnpm build` as a separate step or combined command is simpler |

### R0-3: Story Organization and Categories

**Question**: How should component and utility stories be organized in the Storybook sidebar?

**Decision**: Use Storybook's title-based category system with two top-level groups: Components and Utilities.

**Rationale**:

- Storybook's natural grouping via `title: 'Category/Subcategory/Name'` is intuitive.
- Two top-level categories (Components, Utilities) match the package's own organizational structure.
- Components are further sub-grouped into functional areas: Basic, Form Controls, Navigation, Communication, and Layout.
- Utilities are grouped by module type (Background, Text, Spacing, Display, Typography, Border, Flex, Width, Text Alignment).
- Bundle packages (e.g., Form Controls, Navigation) are documented via their individual component stories rather than separate bundle pages.

**Sidebar structure**:

```
Components
├── Basic
│   ├── Button
│   ├── Button Group
│   ├── Card
│   ├── Link
│   ├── List
│   ├── Tag
│   └── Table
├── Form Controls
│   ├── Checkbox
│   ├── Combo Box
│   ├── Date Picker
│   ├── Input
│   ├── Radio
│   ├── Select
│   ├── Textarea
│   └── ...
├── Navigation
│   ├── Breadcrumb
│   ├── Header
│   ├── Pagination
│   ├── Search
│   ├── Sidenav
│   └── Skipnav
├── Communication
│   ├── Accordion
│   ├── Alert
│   ├── Banner
│   ├── Modal
│   ├── Process List
│   ├── Site Alert
│   ├── Step Indicator
│   └── Summary Box
└── Layout
    ├── Grid
    ├── Icon
    └── Media Block

Utilities
├── Background Colors
├── Text Colors
├── Spacing
├── Display
├── Typography Utilities
├── Border & Border Radius
├── Flex & Alignment
├── Width & Max Width
└── Text Alignment
```

### R0-4: Autodocs Configuration

**Question**: How should Storybook's autodocs be configured for CSS-only HTML stories?

**Decision**: Enable autodocs globally in `main.js`.

**Rationale**:

- `docs: { autodocs: true }` in `main.js` enables the Docs tab for all stories by default.
- The Docs tab shows the rendered HTML, the source code (via `@storybook/addon-docs`), and any description from story parameters.
- Individual story files can opt out with `tags: ['!autodocs']` if needed.
- Autodocs works well with `@storybook/html-vite` — no special configuration needed.

### R0-5: Manager Theme Customization

**Question**: How should the Storybook UI chrome be customized with PathAble brand colors and typography?

**Decision**: Use `@storybook/manager-api` to create a custom theme object in `manager.js`, and add Google Fonts links in `manager-head.html`.

**Rationale**:

- `@storybook/manager-api` provides `create` and `themes.createFrom` for building custom themes.
- The theme object sets brand colors, fonts, and UI chrome colors.
- PathAble brand tokens map to Storybook theme fields:
  - `brandTitle`: 'Pathable Styles'
  - `colorPrimary`: `#00365c` (PathAble Blue)
  - `colorSecondary`: `#1cae96` (Intelligent Jade)
  - `base`: `'dark'` for dark sidebar or `'light'` for light sidebar
  - `fontBase`: `'Nunito', system-ui, sans-serif` (body font)
  - `fontCode`: Monospace font
- Google Fonts links for Fredoka (headings) and Nunito (body text) are added via Storybook's `managerHead` tag or a `manager-head.html` file.
- The `manager.js` file exports `addons.setConfig({ theme: customTheme })` to apply the theme.

**Alternatives considered**:

| Option | Decision | Reason for rejection |
| -------- | ---------- | --------------------- |
| Inline CSS overrides in `preview-head.html` | Rejected | Fragile, doesn't use Storybook's theming API |
| `@storybook/addon-themes` | Rejected | Addon is for theme switching within stories, not manager chrome |

### R0-6: Story File Format for HTML Components

**Question**: What is the standard format for `.stories.js` files that render HTML with `pathable-*` classes?

**Decision**: Use the CSF (Component Story Format) 3 standard with functions returning HTML strings.

**Rationale**:

- CSF 3 is the current Storybook standard.
- Each story exports a default object with `title`, `tags`, and named story exports.
- Stories are functions that return HTML strings via the `render` property.
- The `@storybook/html-vite` framework executes these render functions and injects the HTML into the preview iframe.
- `args` and `argTypes` can be used for component stories where interactive controls are useful (e.g., switching button variants).
- Simpler stories (especially utilities) can use static `render` functions with no args.

**Format example**:

```js
// Default export defines metadata
export default {
  title: 'Components/Button',
  tags: ['autodocs'],
};

// Named exports define individual stories
export const Default = {
  render: () => '<button class="pathable-button">Default Button</button>',
};

export const AccentCool = {
  render: () => '<button class="pathable-button pathable-button--accent-cool">Accent Cool</button>',
};

export const Outline = {
  render: () => '<button class="pathable-button pathable-button--outline">Outline</button>',
};
```
