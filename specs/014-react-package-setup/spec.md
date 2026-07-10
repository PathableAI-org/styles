# Feature Specification: React Package Workspace Setup

**Feature Branch**: `021-react-package-setup`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Initialize the packages/react workspace, which will provide react components of all our components in packages/styles. A client application should only have to require / depend on the react package, not both. For our first version, we are just working on the initial package setup by including only the default Button component. We want to include the react package in the storybook (look at https://storybook.js.org/docs/sharing/storybook-composition )"

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - React Application Developer Uses PathAble Components Without Direct Styles Dependency (Priority: P1)

As a developer building a React application with PathAble-styled components, I want to install only `@pathable/react` and get working React components (including the imported styles) so that I do not need to also install and configure `@pathable/styles` separately.

**Why this priority**: This is the core value proposition of the react package. Eliminating the dual-dependency requirement is the primary motivation for this feature. Without this, the package has no reason to exist.

**Independent Test**: A developer can create a new React project, install only `@pathable/react` as a dependency, import a Button component from it, and render it in a page with the PathAble styles applied correctly.

**Acceptance Scenarios**:

1. **Given** a fresh React project, **When** I add `@pathable/react` as a dependency (without separately adding `@pathable/styles`), **Then** the dependency tree resolves without errors and `@pathable/styles` is included as a dependency of `@pathable/react`.
2. **Given** the fresh React project, **When** I import `{ Button }` from `@pathable/react` and render it in a component, **Then** the rendered button has the `pathable-button` CSS class applied and is styled with the PathAble brand theme.
3. **Given** the fresh React project, **When** I inspect the built output, **Then** the CSS from `@pathable/styles` is included in the stylesheet (either via CSS import or bundled CSS).

---

### User Story 2 - Developer Can Use a React Button Component with Standard Props (Priority: P1)

As a React developer, I want to import a `<Button>` component from `@pathable/react` that accepts familiar React props (children, onClick, className, variant, disabled, type) so that I can use it naturally in my React application without learning custom patterns.

**Why this priority**: The Button is the first component from the react package. It must feel idiomatic to React developers, matching the ergonomics of standard HTML `<button>` elements while adding PathAble style variants.

**Independent Test**: A developer can render a `<Button variant="primary" onClick={handleClick}>Click Me</Button>` in a React component and verify it produces a styled `<button>` element with the correct class and behavior.

**Acceptance Scenarios**:

1. **Given** the React Button component, **When** I render it with `children` text, **Then** the text appears inside the rendered `<button>` element.
2. **Given** the React Button component, **When** I set `variant="primary"`, **Then** the rendered element has both `pathable-button` and `pathable-button--primary` classes.
3. **Given** the React Button component, **When** I pass an `onClick` handler, **Then** clicking the button triggers the handler.
4. **Given** the React Button component, **When** I set `disabled={true}`, **Then** the rendered `<button>` element has the `disabled` attribute.
5. **Given** the React Button component, **When** I pass a `className` prop, **Then** the custom class is appended to the element's class list alongside the PathAble classes.
6. **Given** the React Button component, **When** I set `type="submit"`, **Then** the rendered `<button>` element has `type="submit"`.

---

### User Story 3 - Developer Can Browse React Button Stories via Storybook Composition (Priority: P2)

As a developer working in the monorepo, I want to see the React Button component's stories alongside the existing HTML stories in the main Storybook so that I can browse and develop both layers in a single Storybook interface.

**Why this priority**: Storybook composition enables a unified development experience. Without it, developers would need to run separate Storybook instances for HTML and React stories, reducing the value of the monorepo.

**Independent Test**: A developer can start the main Storybook and see the React Button stories in the sidebar under a "React" section, alongside the existing HTML stories under "Basic".

**Acceptance Scenarios**:

1. **Given** the main Storybook is running, **When** I view the sidebar, **Then** there is a composed "React" section (or similar) containing the React Button stories.
2. **Given** the React Button story is selected, **When** I view the rendered component, **Then** it displays a working React Button with the PathAble styles applied.
3. **Given** the React Button story, **When** I interact with the button (e.g., click or hover), **Then** the expected interaction feedback is rendered (e.g., click handler fires, hover styles apply).

---

### User Story 4 - Developer Can Run the React Storybook Independently (Priority: P2)

As a developer focused on React components, I want to run a standalone Storybook for the react package on a separate port so that I can develop React components in isolation without loading the full HTML Storybook.

**Why this priority**: Independent development of the react package requires its own Storybook instance. This also enables the composition workflow, where the main Storybook composes in the React Storybook.

**Independent Test**: A developer can run a command to start the React Storybook, navigate to `http://localhost:6007` (or similar port), and see the React Button stories rendered.

**Acceptance Scenarios**:

1. **Given** the developer runs the React Storybook start command, **When** the server starts, **Then** it is accessible on a port distinct from the main Storybook (e.g., port 6007).
2. **Given** the React Storybook is running, **When** I navigate to it in a browser, **Then** the Button stories are displayed and rendered correctly.
3. **Given** the React Storybook is running, **When** I make a change to a React component source file, **Then** hot module replacement updates the story in real-time.

---

### Edge Cases

- What happens when a consumer imports a component from `@pathable/react` but the `@pathable/styles` CSS is not loaded? The styles should be self-contained — either the React package imports the compiled CSS, or it documents that consumers must import the CSS separately.
- How does the React Button component handle unknown or misspelled variant names? It should fall back to the default button style (no variant class) or emit a warning.
- What happens when the same Storybook port is already in use? The React Storybook should log a clear error message suggesting the next available port.
- How does the composed Storybook behave when the React Storybook is not running? The main Storybook should show the composed ref as unavailable (graceful degradation) rather than crashing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `packages/react` directory MUST exist as a pnpm workspace package with the name `@pathable/react`.
- **FR-002**: `@pathable/react` MUST include `@pathable/styles` as a dependency so that consuming applications automatically get the styles when they install the react package.
- **FR-003**: `@pathable/react` MUST export a `Button` component from its main entry point.
- **FR-004**: The `Button` component MUST render a native `<button>` HTML element.
- **FR-005**: The `Button` component MUST apply the `pathable-button` CSS class to the rendered element.
- **FR-006**: The `Button` component MUST accept a `variant` prop corresponding to the `pathable-button--{variant}` modifier classes (e.g., `"primary"`, `"accent-cool"`, `"accent-warm"`, `"outline"`, `"inverse"`, `"base"`, `"secondary"`, `"big"`, `"unstyled"`).
- **FR-007**: The `Button` component MUST accept and forward all standard HTML button props: `children`, `onClick`, `className`, `disabled`, `type`, and `style`.
- **FR-008**: The `Button` component MUST extend any custom `className` prop onto the element, appending it after the PathAble classes.
- **FR-009**: The `@pathable/react` package MUST include the compiled CSS from `@pathable/styles` so that consumers do not need to import styles separately.
- **FR-010**: A React Storybook instance MUST be created for the react package so that developers can browse and develop React components in isolation.
- **FR-011**: The React Storybook MUST contain at least one story for the Button component covering its default state and at least three variant states.
- **FR-012**: The main Storybook MUST visually include the React component stories alongside the existing HTML stories, accessible through a unified sidebar.
- **FR-013**: The main Storybook MUST gracefully handle the case where the React Storybook is not running (composed ref shows as unavailable rather than causing an error).
- **FR-014**: Developers MUST be able to start the React Storybook with a single command from the repository root.
- **FR-015**: The React Storybook MUST run on a port different from the main Storybook so that both can run simultaneously without conflicts.

### Key Entities

- **`@pathable/react` (packages/react)**: The new React component library package that re-exports styles components as idiomatic React components.
- **`Button` component**: The React component wrapping the `pathable-button` CSS class. Accepts standard HTML button props plus a `variant` prop.
- **`apps/storybook-react`**: The standalone Storybook instance for the React package, where developers can develop and browse React components.
- **Storybook composition**: The mechanism in Storybook's `main.js` `refs` configuration that allows one Storybook to include stories from another Storybook instance.
- **`@pathable/styles`**: The existing CSS/SCSS design token package that the React components will use for styling.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can install only `@pathable/react` in a fresh React project, import `<Button>`, and render it with PathAble styles applied — without separately installing `@pathable/styles`.
- **SC-002**: The React Button component renders with all specified variant classes (`pathable-button--primary`, `--accent-cool`, `--outline`, etc.) and passes `onClick`, `className`, `disabled`, and `type` props correctly.
- **SC-003**: The main Storybook displays React Button stories under a composed "React" section in the sidebar, viewable alongside existing HTML stories.
- **SC-004**: The React Storybook runs independently on port 6007 and can be started with a single command from the repository root.
- **SC-005**: The main Storybook continues to function normally when the React Storybook is not running (composed ref is unavailable, but no errors occur).

## Assumptions

- The React package will import the compiled CSS (`dist/styles.css`) from `@pathable/styles` rather than requiring consumers to configure SCSS load paths.
- The React Storybook will use a Vite-based framework, consistent with the existing project's tooling direction.
- Storybook composition is the right approach for including React stories — the React Storybook runs as a separate process and the main Storybook references it via URL.
- React and ReactDOM will be added as peer dependencies of `@pathable/react` (consumers bring their own React).
- The React Button component will be a thin wrapper — it applies the appropriate CSS classes and forwards props, but does not add new behavior or state management beyond what the HTML element provides.
- The existing `@pathable/styles` CSS compilation pipeline remains unchanged — the React package consumes the compiled output.
- The React package source files will use typed JavaScript (or TypeScript) to provide good developer experience with type-checking and autocompletion.
- No additional components beyond the Button are in scope for this initial version.