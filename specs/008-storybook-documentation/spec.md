# Feature Specification: Storybook Documentation

**Feature Branch**: `008-storybook-documentation`

**Created**: 2026-07-08

**Status**: Draft

**Input**: User description: "Setup Storybook for documenting pathable component wrappers and utility classes. Storybook documentation should cover only the pathable* prefixed versions of classes. In this initial feature, set up Storybook for documentation with autodocs and make sure it uses PathAble colors and typography. Do not setup any tests. The user should be able to run a command locally and see documentation about each component."

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Developer Browsing Component Documentation (Priority: P1)

A developer working with `@pathable/styles` wants to understand what `pathable-*` component classes are available, what modifiers and sub-elements each component supports, and how to use them in HTML. They run a local Storybook command (`pnpm storybook`) and see a documentation page for each component wrapper — accordion, alert, button, card, table, etc. — with the component rendered using PathAble colors and typography. Each page shows the component's class names, modifier variants, sub-elements, and any notes about JavaScript-driven behavior.

**Why this priority**: This is the core value of the feature — providing browsable, interactive documentation for every PathAble component wrapper. Without this, developers must read SCSS source files or the USWDS documentation to understand component usage.

**Independent Test**: A developer runs `pnpm storybook` from the `packages/styles` directory, opens the Storybook UI in their browser, and can navigate to a documentation page for at least the most commonly used components (button, alert, accordion, card, breadcrumb, form inputs, table, tag, modal). Each page renders the component styled with PathAble brand colors and fonts.

**Acceptance Scenarios**:

1. **Given** the `packages/styles` package, **When** a developer runs `pnpm storybook`, **Then** a Storybook dev server starts on a local port (e.g., 6006) and is accessible in the browser.
2. **Given** the running Storybook instance, **When** a developer navigates to the Components section, **Then** they see a sidebar entry for each `pathable-*` component wrapper (e.g., "Button", "Alert", "Accordion", "Card", "Table", "Tag", "Breadcrumb", "Form Controls").
3. **Given** a component documentation page in Storybook, **When** a developer views it, **Then** the page includes the component's HTML structure, CSS class names (`.pathable-button`, `.pathable-alert`, etc.), modifier variants, and sub-element selectors.
4. **Given** the Storybook UI, **When** a developer inspects any rendered component, **Then** it displays with PathAble brand colors (PathAble Blue, Intelligent Jade, etc.) and PathAble typography (Fredoka for headings, Nunito for body text, etc.).

---

### User Story 2 — Developer Browsing Utility Class Documentation (Priority: P2)

A developer wants to see what `pathable-*` utility classes are available — background colors, text colors, padding, margin, display, flex, border, border-radius, width, max-width, font-family, font-weight, text-align — and what values each class supports. They navigate to a Utilities section in Storybook and see a documented page for each utility module with the available values and responsive breakpoints.

**Why this priority**: While the existing Starlight docs site provides some utility documentation, having it in Storybook alongside the component documentation gives developers a single, browsable reference for the entire `pathable-*` class surface. This is lower priority than the component documentation (P1) because the utility classes follow a well-defined naming pattern that is easier to understand from reference tables.

**Independent Test**: A developer opens the Storybook Utilities section and sees a page for "Background Colors" listing all `.pathable-bg-*` values (primary, base, surface, accent, link, focus-ring, danger, success, transparent), a page for "Spacing" showing padding/margin values, and a page for "Layout" showing display, flex, width, and max-width utilities.

**Acceptance Scenarios**:

1. **Given** the Storybook instance, **When** a developer opens the Utilities section, **Then** they see pages for at least the following utility groups: Background Colors, Text Colors, Spacing (padding/margin), Display, Typography Utilities, Border & Border Radius, Flex & Alignment, Width & Max-Width, Text Alignment.
2. **Given** a utility documentation page (e.g., "Spacing"), **When** a developer views it, **Then** it shows the class pattern (`.pathable-padding-{n}`), supported values (0–10, 15), and responsive breakpoint variants (mobile-lg, tablet, desktop).
3. **Given** a utility page for background colors, **When** a developer views it, **Then** each color swatch renders with the actual PathAble brand color value.

---

### User Story 3 — Storybook Uses PathAble Theme (Priority: P2)

A developer opening Storybook expects the documentation UI itself to feel consistent with the PathAble brand — the Storybook chrome (toolbar, sidebar, buttons, text) should use PathAble colors and typography, not the default Storybook styling. This reinforces that the documentation is a first-class part of the PathAble design system.

**Why this priority**: Theme consistency is important for developer experience and brand alignment. It makes the documentation feel like a natural part of the PathAble ecosystem rather than a generic tool bolted on. This is P2 because the core value (component docs) works without theming, but theming significantly improves the experience.

**Independent Test**: A developer opens Storybook and sees that the sidebar, toolbar, and documentation pages use PathAble brand colors (e.g., PathAble Blue for headers/sidebar, Nunito font for body text, Fredoka for headings) rather than the default Storybook colors.

**Acceptance Scenarios**:

1. **Given** the Storybook instance, **When** a developer inspects the Storybook UI chrome, **Then** the sidebar uses PathAble Blue (`--pathable-blue` / `#00365c`) as the background color for the active navigation item.
2. **Given** the Storybook instance, **When** a developer reads any documentation page heading, **Then** it renders in Fredoka (the PathAble heading font).
3. **Given** the Storybook instance, **When** a developer reads any documentation page body text, **Then** it renders in Nunito (the PathAble body font).
4. **Given** the Storybook instance, **When** a developer inspects a component example, **Then** the example renders with PathAble CSS custom properties and brand colors applied.

---

### Edge Cases

- **Components with no direct `.usa-*` class**: Some entries in the component wrapper directory (e.g., `pathable-typography.scss`, `pathable-navigation.scss`) are bundle packages, not individual components. These should be documented as bundle packages that forward multiple component wrappers, not as individual components.
- **JS-driven components**: Components like accordion, banner, combo-box, modal, and tooltip require USWDS JavaScript for interactivity. Their documentation should note that JS behavior is not included in the Storybook examples and that consumers need to add USWDS JS separately.
- **Components with many variants**: Some components (button with 8+ modifier variants, alert with 6 variants) may have long documentation pages. Story stories should show representative examples rather than every possible combination.
- **Responsive utilities**: Storybook runs in an iframe, making responsive testing limited. Documentation should note responsive breakpoint availability but may not demonstrate breakpoint behavior live.
- **No USWDS JavaScript**: The Storybook setup should not include USWDS JavaScript. Components that are JS-driven will be documented as static HTML examples only.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `@pathable/styles` package MUST have a Storybook configuration that can be started with `pnpm storybook` from the `packages/styles` directory.
- **FR-002**: The Storybook instance MUST serve documentation pages for each `pathable-*` component wrapper in `packages/styles/src/pathable-component-wrappers/`, covering at minimum: accordion, alert, banner, breadcrumb, button, button-group, card, checkbox, collection, combo-box, date-picker, date-range-picker, footer, form, header, icon, icon-list, identifier, input, link, modal, pagination, process-list, prose, radio, search, select, sidenav, site-alert, step-indicator, summary-box, table, tag, textarea, tooltip.
- **FR-003**: Each component documentation page MUST use Storybook's autodocs (Automatic Documentation) to generate the Docs tab from Story stories, showing the component's class name, HTML structure, modifier variants, and sub-elements.
- **FR-004**: The Storybook preview MUST be configured to load the compiled `dist/styles.css` so that all component examples render with PathAble styles.
- **FR-005**: The Storybook theme MUST be customized to use PathAble brand colors and typography, including the toolbar, sidebar, and documentation page chrome.
- **FR-006**: The Storybook configuration MUST define Story stories for each component that render the `pathable-*` HTML with appropriate modifier variants and sub-elements.
- **FR-007**: The Storybook documentation MUST include pages for `pathable-*` utility classes, covering at minimum: background colors, text colors, spacing (padding/margin), display, typography utilities (font-family, font-weight), border & border-radius, flex & alignment, width & max-width, and text alignment.
- **FR-008**: Utility class documentation pages MUST show the class pattern, supported values, available responsive breakpoints, and state variants (hover/focus where applicable).
- **FR-009**: The Storybook instance MUST NOT include any test runners, visual regression tests, interaction tests, or test-related addons. The scope is limited to documentation only.
- **FR-010**: The Storybook setup MUST use the Storybook framework for React (`@storybook/react-vite`) or HTML (`@storybook/html-vite`) — the choice depending on which is most appropriate for a CSS-only component library. Documentation examples are rendered as HTML snippets with CSS classes applied.
- **FR-011**: The Storybook configuration MUST be scoped to the `packages/styles` package and not affect the existing `apps/docs` Starlight site.
- **FR-012**: Component documentation for JS-driven components MUST include a note indicating that the component requires USWDS JavaScript for full interactivity and that only static CSS documentation is provided.

### Key Entities

- **Storybook Configuration**: The `.storybook/` directory within `packages/styles` containing `main.js` (configuration), `preview.js` (global decorators/loaders), and `manager.js` (theme customization).
- **Story Story**: A named export from a `.stories.js` (or `.stories.ts`) file that renders a component example. Each component wrapper gets one or more stories showing its default state, modifier variants, and sub-elements.
- **Autodocs Page**: A generated documentation page that combines the story's rendered output with its source code and JSDoc-style comments. Generated by `@storybook/addon-docs` with the `autodocs` tag.
- **Storybook Theme**: A custom theme object that sets brand colors, fonts, and UI chrome styling for the Storybook manager UI.
- **Component Wrapper Story**: A `.stories.*` file that documents a single `pathable-*` component wrapper, showing its class name, modifier variants, sub-elements, and usage notes.
- **Utility Class Story**: A `.stories.*` file that documents a group of related `pathable-*` utility classes, showing the class pattern, supported values, and responsive variants.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can run `pnpm storybook` from `packages/styles/` and see a running Storybook instance at `http://localhost:6006` within 30 seconds.
- **SC-002**: At least 25 individual component documentation pages are available in Storybook, covering the most commonly used USWDS components wrapped by `pathable-*` classes.
- **SC-003**: Each component documentation page renders the `pathable-*` component with PathAble brand colors and typography (not default browser styles), verified by visual inspection.
- **SC-004**: Utility class documentation pages cover at least 9 utility module groups (background, text, spacing, display, typography, border, flex, width, text-align), showing available values and responsive breakpoints.
- **SC-005**: The Storybook UI chrome (sidebar, toolbar, navigation) uses PathAble brand colors and fonts, distinct from the default Storybook theme.
- **SC-006**: No test-related addons or configurations are present in the Storybook setup — verified by checking `main.js` for addon entries and `package.json` for test dependencies.

## Assumptions

- Storybook will be installed as a dev dependency in `packages/styles/package.json` using the latest stable version of Storybook 8.x.
- The `@storybook/html-vite` framework (or similar) will be used for Storybook, since the components are CSS-only with no framework dependency. React is not needed for rendering CSS class documentation.
- The compiled `dist/styles.css` will be imported in the Storybook preview configuration so that all component examples automatically use PathAble styles.
- Each component wrapper will have a corresponding `.stories.js` file that uses HTML template strings to render the component with `pathable-*` classes.
- Components will be organized into Storybook categories (e.g., "Components", "Utilities") matching the package structure.
- The existing `pnpm build` command will continue to work as before; Storybook will be an additional script that does not replace or modify the existing build pipeline.
- Storybook documentation will be local-only in this initial feature. CI/CD deployment and GitHub Pages publishing of Storybook are out of scope.
- The `@storybook/addon-docs` addon will be used with `autodocs` enabled for automatic documentation page generation.