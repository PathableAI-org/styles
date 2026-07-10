# Research: React Package Workspace Setup

## Phase 0 — Unknowns and Technical Decisions

### Storybook Composition Approach

**Decision**: Use Storybook's built-in `refs` configuration in `main.js` to compose the React Storybook into the main Storybook.

**Rationale**: The spec explicitly references [Storybook composition](https://storybook.js.org/docs/sharing/storybook-composition) as the intended approach. The main Storybook at `apps/storybook` (running on port 6006) adds a `refs` entry pointing to the React Storybook at `apps/storybook-react` (running on port 6007). This is the standard Storybook pattern for multi-framework setups.

**Alternatives considered**: Importing stories directly via a shared stories glob was rejected because the React stories require a React framework (`@storybook/react-vite`) while the main Storybook uses `@storybook/html-vite`. Composition allows each Storybook to use its own framework.

**Required case coverage**:

- S-005: Main Storybook composes React stories (positive, CC-013)
- S-006: Graceful degradation when React Storybook is unavailable (negative, CC-014)

### React Package Build Strategy

**Decision**: The `@pathable/react` package will use a Vite library build (or esbuild, consistent with the existing `packages/styles` tooling) to compile JSX and produce a distributable `dist/` output.

**Rationale**: Vite is the existing project's build tooling direction (Storybook uses `@storybook/react-vite`). JSX compilation is required for `.jsx` source files. The compiled CSS from `@pathable/styles` is imported directly in the component or entry point, so consumers do not need to configure CSS loaders.

**Alternatives considered**: Raw JSX publish (requires consumers to configure JSX compilation) was rejected per the spec's requirement that consumers not need additional configuration. TSC-only compilation was rejected because it doesn't bundle the CSS import.

**Test level**: Build verification — `pnpm build` must succeed and produce `dist/` with the compiled component and imported CSS.

### CSS Inclusion Strategy

**Decision**: The Button component (or the package entry point) will import `@pathable/styles/dist/styles.css` directly. When the package is built, this CSS import is resolved at build time and included in the built output.

**Rationale**: This satisfies FR-009 (styles included automatically) and the clarified requirement that no additional SCSS/Sass configuration is needed by consumers. The `@pathable/styles` package declares the compiled CSS in its `exports` field.

**Alternatives considered**: Requiring consumers to import CSS separately was rejected as it violates the core value proposition. Using SCSS `@use` was rejected because it requires a Sass compiler.

**Fixture strategy**: No external mocks needed — all fixture setup is file-based (package.json, source files, build config).

### React Storybook Setup

**Decision**: Create `apps/storybook-react` as a new workspace package using `@storybook/react-vite` framework. Stories are defined in `packages/react/src/stories/` and referenced via a stories glob in the Storybook config.

**Rationale**: This follows the existing convention where `apps/storybook` uses a stories glob pointing to `packages/styles/src/stories/`. Port 6007 is chosen as the distinct port (spec assumption).

**Error-branch validation decisions**: Port conflict handling is accepted as a low-impact edge case (not formally automated).

### No NEEDS CLARIFICATION Remaining

All technical context items have been resolved through specification content and the clarifications session. No further unknowns require research.
