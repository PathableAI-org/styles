# Implementation Plan: Storybook Documentation

**Branch**: `008-storybook-documentation` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-storybook-documentation/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Complexity Tracking](#complexity-tracking)
- [Project Structure](#project-structure)
- [Phase 0: Research & Discovery](#phase-0-research--discovery)
- [Phase 1: Design & Contracts](#phase-1-design--contracts)

## Summary

Set up Storybook in the `packages/styles` package to provide browsable, local documentation for all `pathable-*` component wrappers and utility classes. The Storybook instance uses the `@storybook/html-vite` framework (since the components are CSS-only HTML), loads the compiled `dist/styles.css` for PathAble styling, and customizes the Storybook manager chrome with PathAble brand colors and typography. Stories are written as HTML template strings in `.stories.js` files, one per component or utility group. Autodocs generates the Docs tab for each story. No test runners or test addons are included — the scope is documentation only.

## Technical Context

**Language/Version**: JavaScript (ES modules), Storybook 8.x (`@storybook/html-vite`)

**Primary Dependencies**:
- `@storybook/html-vite` ^8.x — Storybook framework for rendering plain HTML stories
- `@storybook/addon-docs` ^8.x — Autodocs for automatic documentation page generation
- `storybook` ^8.x — Storybook core
- `@storybook/addon-themes` (optional) — for theme switching if multi-theme support is desired

**Storage**: N/A — local-only documentation tool, no data persistence

**Testing**: Explicitly out of scope — FR-009 prohibits test runners, visual regression tests, interaction tests, or test-related addons

**Target Platform**: Local web browser (dev server at `http://localhost:6006`)

**Project Type**: Documentation tooling for a SCSS/CSS design token and component library

**Performance Goals**: Storybook dev server starts within 30 seconds on modern hardware (SC-001). Storybook build (for potential future deployment) should complete within 60 seconds.

**Constraints**:
- Storybook configuration must live within `packages/styles/` and not affect `apps/docs/` (FR-011)
- No test runners or test-related addons may be installed or configured (FR-009)
- Stories must only document `pathable-*` classes, not underlying `usa-*` classes
- Compiled `dist/styles.css` must be loaded in preview for all examples to render with PathAble styles (FR-004)
- JS-driven components must include a note that USWDS JS is required for full interactivity (FR-012)
- Non-JS components must not include USWDS JavaScript

**Scale/Scope**: Single package (`packages/styles`). ~30+ component story files + ~9 utility group story files. No changes to `apps/docs/`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Applicable Principles

| Principle | Relevance | Compliance |
|-----------|-----------|------------|
| **I. CSS Custom Properties Are the Runtime Contract** | Storybook loads compiled `dist/styles.css` which contains all `--pathable-*` and `--usa-*` CSS custom properties. Component examples demonstrate these tokens in use. | ✅ COMPLIANT — The compiled CSS is the contract, and Storybook renders examples using it directly. |
| **II. SCSS Is an Authoring and Extension Layer** | Storybook consumes the compiled CSS output, not SCSS source. No SCSS changes are needed for Storybook configuration. | ✅ COMPLIANT — SCSS remains the authoring layer; Storybook works from the compiled output. |
| **III. pnpm Workspaces** | Storybook is added as dev dependencies to `packages/styles/package.json`. The existing `pnpm build` and `pnpm storybook` commands coexist. | ✅ COMPLIANT — Changes are scoped to `packages/styles`, respecting workspace boundaries. |
| **IV. First Implementation Slice Is Narrow** | This feature is a narrow slice: documentation only, no tests, no CI/CD deployment. | ✅ COMPLIANT — Scope is explicitly bounded to local documentation (FR-009, Assumptions). |
| **V. Published Artifacts Must Be Reliable** | The Storybook setup is a development tool, not a published artifact. The existing `pnpm build` command is unchanged. | ✅ COMPLIANT — No change to published artifacts or build pipeline. |
| **VI. Token Naming Must Be Semantic and Stable** | Storybook documentation uses `pathable-*` naming as the primary surface, which follows the established semantic convention. | ✅ COMPLIANT — Documentation reinforces the existing naming convention. |
| **VII. Design Source Alignment** | Storybook theme customization uses PathAble brand colors and typography from the existing token definitions. | ✅ COMPLIANT — Colors and fonts are sourced from the established brand tokens. |
| **VIII. Accessibility Is Part of Token Quality** | Storybook documentation is a dev tool; no accessibility requirements for the tool itself. Component examples inherit USWDS accessibility because they use the same compiled CSS. | ✅ COMPLIANT — No new accessibility concerns introduced. |
| **IX. Framework Independence Comes First** | `@storybook/html-vite` is used because components are CSS-only HTML. No React, Vue, or other framework dependency is introduced. | ✅ COMPLIANT — HTML-vite framework preserves framework independence. |
| **X. Documentation Is a First-Class Package Concern** | This feature adds Storybook-based documentation alongside the existing Starlight docs site. | ✅ COMPLIANT — Documentation is being treated as a first-class concern. |
| **XI. Versioning and Release Discipline** | New Storybook dev dependencies are additive. No breaking changes to the package. | ✅ COMPLIANT — Additive change only. |

### Gate Evaluation

| Gate | Status |
|------|--------|
| No unjustified constitution violations | ✅ All principles in compliance — see table above |
| All [NEEDS CLARIFICATION] markers resolved | ✅ No markers in spec |
| Feature spec is internally consistent | ✅ Verified |
| Constitution read and checked | ✅ Loaded from `.specify/memory/constitution.md` |

**GATE PASSED** — proceed to Phase 0.

## Complexity Tracking

No constitution violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/008-storybook-documentation/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 — Storybook setup research
├── data-model.md        # Phase 1 — entity model for stories
├── quickstart.md        # Phase 1 — setup and usage guide
├── contracts/
│   └── story-interface.md # Interface contract for story file format
└── tasks.md             # Phase 2 (/speckit-tasks output - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/styles/
├── package.json                          # UPDATE: add storybook dev deps + scripts
├── .storybook/                           # NEW: Storybook configuration directory
│   ├── main.js                           # NEW: Storybook main config (stories, addons, framework)
│   ├── preview.js                        # NEW: Preview config (CSS import, decorators)
│   └── manager.js                        # NEW: Manager theme customization (brand colors/fonts)
├── src/
│   ├── index.scss                        # Unchanged
│   ├── pathable-component-wrappers/      # Unchanged (66 component wrappers)
│   │   └── ... (component wrapper files)
│   └── stories/                          # NEW: Story files for Storybook
│       ├── components/                   # NEW: Component wrapper stories
│       │   ├── Button.stories.js
│       │   ├── Alert.stories.js
│       │   ├── Accordion.stories.js
│       │   ├── Breadcrumb.stories.js
│       │   ├── Card.stories.js
│       │   ├── Table.stories.js
│       │   ├── Tag.stories.js
│       │   ├── Modal.stories.js
│       │   ├── FormControls/             # Grouped form control stories
│       │   │   ├── Checkbox.stories.js
│       │   │   ├── Input.stories.js
│       │   │   ├── Select.stories.js
│       │   │   ├── Radio.stories.js
│       │   │   ├── Textarea.stories.js
│       │   │   └── ...
│       │   ├── Navigation/
│       │   │   ├── Header.stories.js
│       │   │   ├── Sidenav.stories.js
│       │   │   ├── Pagination.stories.js
│       │   │   └── ...
│       │   └── ... (one stories file per component wrapper)
│       └── utilities/                    # NEW: Utility class stories
│           ├── BackgroundColors.stories.js
│           ├── TextColors.stories.js
│           ├── Spacing.stories.js
│           ├── Display.stories.js
│           ├── TypographyUtilities.stories.js
│           ├── Border.stories.js
│           ├── FlexAlignment.stories.js
│           ├── Width.stories.js
│           └── TextAlignment.stories.js
└── dist/
    └── styles.css                        # Rebuilt — Storybook preview loads this
```

**Structure Decision**: Story files live in a new `src/stories/` directory within `packages/styles`, organized into `components/` and `utilities/` subdirectories. This keeps story files co-located with the source they document while maintaining separation from the SCSS source files. The `.storybook/` config directory sits at the package root, following Storybook conventions.

## Phase 0: Research & Discovery

The spec has no [NEEDS CLARIFICATION] markers. Research tasks focus on Storybook setup approach, framework selection, and configuration patterns for a CSS-only component library.

### Research Task R0-1: Storybook Framework Selection

Determine the appropriate Storybook framework for documenting CSS-only components that use `pathable-*` classes on plain HTML.

**Options evaluated**:

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A: `@storybook/html-vite` | Storybook framework that renders plain HTML templates | No framework dependency, lightweight, fast Vite-based dev server, ES module stories | Limited interactivity compared to React/Web components |
| B: `@storybook/web-components-vite` | Uses Lit/web components for rendering | Framework-agnostic rendering, real DOM elements | Over-engineered for CSS class documentation; adds Lit dependency |
| C: `@storybook/react-vite` | Uses React components for rendering | Most common Storybook setup, rich ecosystem of addons | Adds React dependency to a CSS-only package; misleading since components aren't React |

**Decision**: Option A (`@storybook/html-vite`). This is the lightest-weight option that supports the feature's needs: rendering HTML snippets with CSS classes applied. No framework dependency is introduced, and Vite provides fast dev server startup. HTML stories are straightforward template strings with the `pathable-*` classes.

### Research Task R0-2: CSS Loading Strategy

Determine how to load the compiled `dist/styles.css` in Storybook so all examples render with PathAble styling.

**Options evaluated**:

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A: Import in `preview.js` | `import '../dist/styles.css'` in preview.js | Simple, standard Storybook pattern, CSS processed by Vite | Requires build step before Storybook startup |
| B: Import in `preview-head.html` | `<link rel="stylesheet" href="/dist/styles.css">` via Storybook `previewHead` | No import needed | Non-standard, relies on Vite serving static files |
| C: Build-before-start script | Custom script that runs `pnpm build` then starts Storybook | Guarantees CSS is fresh | Slower startup, more complex |

**Decision**: Option A (import in `preview.js`). Standard Storybook pattern for loading CSS. Vite handles the CSS import seamlessly. Developers must run `pnpm build` at least once before `pnpm storybook` (or the Storybook script can be updated to `pnpm build && storybook dev -p 6006`).

### Research Task R0-3: Story Organization and Categories

Determine how to organize component and utility stories into meaningful Storybook sidebar categories.

**Decision**: Use Storybook's built-in category/title convention. Each story file exports a default `title` like `Components/Button`, `Components/Alert`, `Utilities/Background Colors`. Stories are grouped under two top-level categories:

- **Components** — all `pathable-*` component wrappers, organized by functional area (Basic, Form Controls, Navigation, Communication)
- **Utilities** — all `pathable-*` utility class groups

### Research Task R0-4: Autodocs Configuration

Determine how to configure Storybook's autodocs for the CSS-only HTML setup.

**Decision**: Enable autodocs globally in `main.js` via `docs: { autodocs: true }`. Each story file can opt out with `tags: ['!autodocs']` if needed. The Docs tab will display:
- The story's rendered HTML output
- The source HTML template (via story source addon)
- Description from the story's parameters

### Research Task R0-5: Manager Theme Customization

Determine how to customize the Storybook UI chrome with PathAble brand colors and typography.

**Decision**: Use `@storybook/manager-api` to create a custom theme object in `manager.js`. The theme sets:
- `brandTitle`: 'Pathable Styles'
- `brandUrl`: URL to the GitHub repo or docs site
- `colorPrimary`: `#00365c` (PathAble Blue)
- `colorSecondary`: `#1cae96` (Intelligent Jade)
- `textInverse`: `#ffffff`
- `textMutedColor`: `#dde2e8` (Shilling Silver)
- `appBg`, `barBg`, `appContentBg`: Appropriate brand-derived colors
- `fontBase`: `'Nunito', system-ui, sans-serif` (body font)
- `fontCode`: Monospace font for code blocks

The Storybook manager HTML also gets the Google Fonts links for Fredoka and Nunito so the custom fonts render in the Storybook chrome.

### Research Task R0-6: Story File Format for HTML Components

Determine the standard format for `.stories.js` files that render HTML with `pathable-*` classes.

**Decision**: Each story file exports a default object with `title`, optional `tags`, and named story exports. Stories use the `createStory` pattern or directly export functions that return HTML strings. The format:

```js
// Button.stories.js
export default {
  title: 'Components/Button',
  tags: ['autodocs'],
  render: (args) => {
    const variant = args.variant ? ` pathable-button--${args.variant}` : '';
    return `<button class="pathable-button${variant}">${args.label}</button>`;
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'accent-cool', 'accent-warm', 'outline', 'inverse', 'base', 'secondary', 'big', 'unstyled'],
    },
    label: { control: 'text' },
  },
  args: {
    label: 'Click Me',
    variant: 'default',
  },
};

// Individual variant stories can also be direct HTML:
export const Default = {
  render: () => '<button class="pathable-button">Default Button</button>',
};

export const AccentCool = {
  render: () => '<button class="pathable-button pathable-button--accent-cool">Accent Cool</button>',
};
```

For utility classes, stories show the full set of values in a table or grid layout:

```js
// BackgroundColors.stories.js
export default {
  title: 'Utilities/Background Colors',
  tags: ['autodocs'],
};

export const AllColors = {
  render: () => `
    <div class="pathable-bg-primary" style="padding: 1rem; color: white;">Primary</div>
    <div class="pathable-bg-base" style="padding: 1rem; color: white;">Base</div>
    <div class="pathable-bg-surface" style="padding: 1rem;">Surface</div>
    ...
  `,
};
```

## Phase 1: Design & Contracts

### Prerequisites: research.md complete

#### 1. data-model.md

Define the entity relationships for Storybook stories, organized in two categories:

- **ComponentStory** — maps a `pathable-*` component wrapper to a `.stories.js` file with:
  - Title, tags, story exports for each variant/modifier
  - JS-driven flag for documentation note
  - Category assignment (Basic, Form Controls, Navigation, Communication)
- **UtilityStory** — maps a utility module group to a `.stories.js` file with:
  - Title, tags, story exports for each supported value
  - Responsive breakpoint documentation
  - State variant documentation
- **StoryCategory** — top-level sidebar folder (Components, Utilities) with subcategories

#### 2. contracts/story-interface.md

Define the contract for story files:
- Required exports per story file
- HTML rendering conventions
- CSS class naming expectations
- Documentation annotation format
- JS-driven component annotation pattern

#### 3. quickstart.md

Usage guide covering:
- Installing Storybook dependencies
- Starting the Storybook dev server
- Building the styles before Storybook
- Adding a new component story
- Adding a new utility story
- Understanding the sidebar organization
- Notes on JS-driven components
- Known limitations (responsive testing, no interactive behavior)

#### 4. Agent Context Update

Run agent context update script to register Storybook knowledge, component story patterns, and utility story conventions.