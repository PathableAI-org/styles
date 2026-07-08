# Quickstart: Storybook Documentation for Pathable Styles

**Branch**: `008-storybook-documentation` | **Date**: 2026-07-08 | **Plan**: [plan.md](./plan.md)

## Prerequisites

- Node.js >= 18
- pnpm installed
- Repository cloned and dependencies installed (`pnpm install`)

## Setup

### 1. Install Storybook Dependencies

From the repository root or `packages/styles/` directory:

```bash
cd packages/styles
pnpm add -D storybook @storybook/html-vite @storybook/addon-docs @storybook/manager-api
```

This installs:
- `storybook` — Storybook core
- `@storybook/html-vite` — HTML framework adapter (Vite-based)
- `@storybook/addon-docs` — Autodocs for automatic documentation page generation
- `@storybook/manager-api` — API for customizing the Storybook manager UI theme

### 2. Create Storybook Configuration

Create the `.storybook/` directory in `packages/styles/` with three files:

**`.storybook/main.js`**:

```js
/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ['../src/stories/**/*.stories.js'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  docs: {
    autodocs: true,
  },
};

export default config;
```

**`.storybook/preview.js`**:

```js
import '../dist/styles.css';

/** @type { import('@storybook/html').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

**`.storybook/manager.js`**:

```js
import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

const pathableTheme = create({
  base: 'light',
  brandTitle: 'Pathable Styles',
  brandUrl: 'https://github.com/pathableai/styles',
  colorPrimary: '#00365c',
  colorSecondary: '#1cae96',
  appBg: '#f8f9fa',
  appContentBg: '#ffffff',
  barBg: '#00365c',
  barTextColor: '#ffffff',
  barSelectedColor: '#1cae96',
  textColor: '#1a1a1a',
  textMutedColor: '#6c757d',
  fontBase: "'Nunito', system-ui, sans-serif",
  fontCode: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
});

addons.setConfig({
  theme: pathableTheme,
});
```

### 3. Add Storybook Script to `package.json`

Add to `packages/styles/package.json`:

```json
"scripts": {
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build"
}
```

### 4. Add Google Fonts for Manager Theme

Create `packages/styles/.storybook/manager-head.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400..700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
```

## Running Storybook

### First Time

```bash
cd packages/styles
pnpm build      # Build dist/styles.css first
pnpm storybook  # Start Storybook dev server
```

### Subsequent Runs

After the first build, you only need to rebuild styles if you change SCSS source files:

```bash
cd packages/styles
pnpm storybook  # Starts Storybook (uses existing dist/styles.css)
```

### Expected Output

Storybook starts at `http://localhost:6006` with:
- PathAble-themed sidebar and toolbar
- Components section with all documented component wrappers
- Utilities section with all documented utility class groups
- Each component page shows variants, modifiers, and sub-elements

## Adding a New Component Story

1. Create a file at `src/stories/components/{ComponentName}.stories.js`
2. Follow the pattern:

```js
// Button.stories.js
export default {
  title: 'Components/Basic/Button',
  tags: ['autodocs'],
};

export const Default = {
  render: () => '<button class="pathable-button">Default Button</button>',
};

export const AccentCool = {
  render: () => '<button class="pathable-button pathable-button--accent-cool">Accent Cool</button>',
};

export const Outline = {
  render: () => '<button class="pathable-button pathable-button--outline">Outline</button>',
};

export const Big = {
  render: () => '<button class="pathable-button pathable-button--big">Big Button</button>',
};

export const Unstyled = {
  render: () => '<button class="pathable-button pathable-button--unstyled">Unstyled</button>',
};
```

3. Storybook automatically detects the new file (no config changes needed).

## Adding a New Utility Story

1. Create a file at `src/stories/utilities/{UtilityGroup}.stories.js`
2. Follow the pattern:

```js
// BackgroundColors.stories.js
export default {
  title: 'Utilities/Background Colors',
  tags: ['autodocs'],
};

export const AllColors = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      <div class="pathable-bg-primary" style="padding: 1rem; color: white;">pathable-bg-primary</div>
      <div class="pathable-bg-base" style="padding: 1rem; color: white;">pathable-bg-base</div>
      <div class="pathable-bg-surface" style="padding: 1rem;">pathable-bg-surface</div>
      <div class="pathable-bg-accent" style="padding: 1rem; color: white;">pathable-bg-accent</div>
      <div class="pathable-bg-link" style="padding: 1rem; color: white;">pathable-bg-link</div>
      <div class="pathable-bg-focus-ring" style="padding: 1rem;">pathable-bg-focus-ring</div>
      <div class="pathable-bg-danger" style="padding: 1rem; color: white;">pathable-bg-danger</div>
      <div class="pathable-bg-success" style="padding: 1rem; color: white;">pathable-bg-success</div>
      <div class="pathable-bg-transparent" style="padding: 1rem; border: 1px solid #ccc;">pathable-bg-transparent</div>
    </div>
  `,
};
```

## JS-Driven Components

The following components require USWDS JavaScript for full interactivity:

| Component | USWDS JS Class Selectors |
|-----------|-------------------------|
| Accordion | `.usa-accordion__button` |
| Banner | `.usa-banner__button` |
| Combo Box | `.usa-combo-box` |
| Date Picker | `.usa-date-picker` |
| Date Range Picker | `.usa-date-range-picker` |
| File Input | `.usa-file-input` |
| Header | `.usa-header`, `.usa-nav` |
| In-Page Navigation | `.usa-in-page-navigation` |
| Input Mask | `.usa-input-mask` |
| Modal | `.usa-modal` |
| Navigation | `.usa-nav` |
| Site Alert | `.usa-site-alert` |
| Tooltip | `.usa-tooltip` |
| Validation | `.usa-validation` |

Their Storybook documentation includes a note about the JS dependency. Only static CSS examples are provided.

## Sidebar Organization

```
Components
├── Basic/               Standalone components
├── Form Controls/       Input and form-related components
├── Navigation/          Navigation and wayfinding components
├── Communication/       Alerts, messaging, information display
└── Layout/              Layout and structural components

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

## Known Limitations

- **Responsive utilities**: Storybook renders in an iframe, making responsive breakpoint testing limited. Utility documentation lists available breakpoints but does not demonstrate them live.
- **No interactive behavior**: JS-driven components are shown as static HTML. No accordion toggle, modal open/close, or tooltip hover behavior is available.
- **No tests**: This Storybook setup is documentation-only. No test runners, visual regression tests, or interaction tests are configured.
- **No CI/CD deployment**: Storybook runs locally only. GitHub Pages deployment of Storybook is out of scope for this feature.