# Feature Specification: GitHub Pages Docs PoC

**Feature Branch**: `002-docs-poc`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User description: "Create the first GitHub Pages documentation proof of concept for the Pathable SCSS style package. A small hello world docs setup using Astro + Starlight, not a full design system site."

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)
- [Clarifications](#clarifications)

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Developer views the live docs site and sees Pathable styles applied (Priority: P1)

A developer visits the published GitHub Pages site and sees a documentation site using Pathable brand styles. The page background, text, headings, and accent elements use CSS custom properties from `@pathable/styles`, proving that the design tokens are consumable in a real web context.

**Why this priority**: This is the core proof-of-concept goal — demonstrating that a docs site can consume the style package and render with brand styles.

**Independent Test**: A developer can open the deployed GitHub Pages URL and visually confirm that the site uses Pathable brand colors (background, surface, text, accent) rather than default browser styles. Inspecting CSS custom properties in DevTools confirms values resolve from `--pathable-color-bg`, `--pathable-color-text`, and `--pathable-color-accent`.

**Acceptance Scenarios**:

1. **Given** the docs site is deployed to GitHub Pages, **When** a developer visits the homepage, **Then** the page background uses `var(--pathable-color-bg)` and text uses `var(--pathable-color-text)`.
2. **Given** the docs site is loaded, **When** a developer inspects the page's CSS custom properties, **Then** the values are sourced from `@pathable/styles/dist/styles.css` and are not redefined locally.

---

### User Story 2 — Developer navigates the docs site sections (Priority: P2)

A developer opens the Starlight docs site and sees four navigation items: Getting Started, Foundations, For Agents, and Roadmap. Each section has a short page with minimal content. The site is a proof of concept, not a full design system.

**Why this priority**: The navigation structure proves the site architecture is correct and ready for future content expansion.

**Independent Test**: A developer can click each nav item and verify a page loads at the expected path with content appropriate to the section.

**Acceptance Scenarios**:

1. **Given** the docs site is loaded, **When** a developer views the sidebar navigation, **Then** only four sections are visible: Getting Started, Foundations, For Agents, and Roadmap.
2. **Given** the developer navigates to `/getting-started/`, **Then** a page with basic setup guidance content is displayed.
3. **Given** the developer navigates to `/foundations/`, **Then** a page describing style foundations is displayed.
4. **Given** the developer navigates to `/for-agents/`, **Then** a page about agent-facing rules is displayed.
5. **Given** the developer navigates to `/roadmap/`, **Then** a page describing the future direction is displayed.
6. **Given** the developer is on the homepage, **Then** the content explains that this is a proof of concept and not a complete component library.

---

### User Story 3 — CI validates the docs build on every PR (Priority: P2)

A contributor opens a pull request. GitHub Actions automatically installs dependencies, builds `@pathable/styles`, and builds `@pathable/docs`. If any step fails, the PR is blocked from merging.

**Why this priority**: CI validation ensures the docs site stays buildable and the style package integration remains working.

**Independent Test**: A contributor can open a PR and see a GitHub Actions workflow that runs `pnpm install`, builds styles, then builds docs. The check badge shows green on success and red on failure.

**Acceptance Scenarios**:

1. **Given** a PR is opened, **When** the CI workflow runs, **Then** it installs dependencies using `pnpm install`.
2. **Given** dependencies are installed, **When** the workflow continues, **Then** it builds `@pathable/styles` before building `@pathable/docs`.
3. **Given** the build succeeds, **When** the workflow completes, **Then** the check status shows green.
4. **Given** the build fails, **When** the workflow completes, **Then** the check status shows red and blocks merging.

---

### User Story 4 — Maintainer deploys docs to GitHub Pages on push to main (Priority: P3)

A maintainer merges a PR to `main`. GitHub Actions automatically builds the docs site and deploys `apps/docs/dist` to GitHub Pages using `actions/deploy-pages`. No manual deployment steps are needed.

**Why this priority**: Deployment automation is important but only active after merge. The proof of concept is still valuable with local builds only.

**Independent Test**: A maintainer can push a change to `main`, wait for the workflow to finish, and visit the GitHub Pages URL to see the updated site live.

**Acceptance Scenarios**:

1. **Given** a push to `main` occurs, **When** the deploy workflow runs, **Then** it builds the docs site.
2. **Given** the build succeeds, **When** the workflow runs `actions/configure-pages`, **Then** Pages is configured.
3. **Given** Pages is configured, **When** the workflow runs `actions/upload-pages-artifact`, **Then** the artifact is uploaded from `apps/docs/dist`.
4. **Given** the artifact is uploaded, **When** the workflow runs `actions/deploy-pages`, **Then** the site is published to GitHub Pages.
5. **Given** the deployment succeeds, **When** a developer visits the GitHub Pages URL, **Then** the latest docs content is displayed.

---

### Edge Cases

- What happens when the styles package build fails but the docs build is attempted? (The docs build should fail because it depends on `@pathable/styles/dist/styles.css` — workspace dependency ordering ensures this.)
- What if Starlight configuration changes require additional dependencies? (The docs `package.json` must list all required Starlight and Astro dependencies; missing deps will be caught by CI.)
- What if the GitHub Pages deployment action fails due to permissions? (The workflow needs `pages: write` and `id-token: write` permissions.)
- What if the site is deployed but the styles CSS doesn't load? (The import of `@pathable/styles/dist/styles.css` is a build-time import; if the file is missing, the build should fail.)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The repository MUST have a new workspace at `apps/docs` using Astro and Starlight.
- **FR-002**: The Astro config must use `@astrojs/starlight` and set the Starlight title to "Pathable Styles".
- **FR-003**: The `pnpm-workspace.yaml` at the repo root MUST include both `"packages/*"` and `"apps/*"` so that `apps/docs` is a recognized workspace.
- **FR-004**: The `apps/docs/package.json` MUST have `"name": "@pathable/docs"`, be marked `"private": true`, and declare `"@pathable/styles": "workspace:*"` as a dependency.
- **FR-005**: The docs site MUST import `@pathable/styles/dist/styles.css` in its global stylesheet or layout.
- **FR-006**: The docs site MUST use Pathable CSS custom properties (e.g., `--pathable-color-bg`, `--pathable-color-surface`, `--pathable-color-text`, `--pathable-color-accent`, `--pathable-font-body`, `--pathable-font-heading`) for its visual styling. These MUST come from `@pathable/styles`, not be redefined locally.
- **FR-007**: The Starlight site MUST have exactly four top-level navigation sections: Getting Started, Foundations, For Agents, and Roadmap.
- **FR-008**: The homepage (`index.mdx`) MUST state, in plain language: that Pathable Styles is the foundational SCSS/CSS package for Pathable brand styles; the first version documents style foundations, usage guidance, and agent-facing rules; it is not yet a complete component library; future versions may add HTML/CSS examples, React examples, Vue examples, and a component catalog.
- **FR-009**: The Getting Started page MUST contain instructions on how to add `@pathable/styles` as a dependency from GitHub (e.g., `"@pathable/styles": "github:PathableAI-org/styles"` in `package.json`), since the package has not yet been published to npm. Instructions may also cover local workspace consumption via `workspace:*` protocol.
- **FR-010**: The Foundations page MUST describe the style foundations (colors, typography, spacing, elevation, radius) available in the package.
- **FR-011**: The For Agents page MUST explain the agent-facing rules and how AI agents should consume the styles package.
- **FR-012**: The Roadmap page MUST list future plans for the docs site and style package.
- **FR-013**: The root `package.json` MUST support `pnpm build`, which builds all workspaces in dependency order. The docs build MUST run after the styles package build via workspace dependency ordering.
- **FR-014**: A GitHub Actions workflow for PRs MUST: install dependencies using `pnpm install`, build `@pathable/styles`, and build `@pathable/docs`. It MUST NOT deploy to GitHub Pages.
- **FR-015**: A GitHub Actions workflow for pushes to `main` MUST: do the same validation as PRs, then deploy `apps/docs/dist` to GitHub Pages using `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`.
- **FR-016**: The deploy workflow MUST use `pnpm/action-setup` and `actions/setup-node`, with the package manager version matching the root `package.json` `"packageManager"` field.
- **FR-017**: The GitHub Actions workflows MUST NOT add: React, Vue, Storybook, Tailwind, token extraction scripts, drift checks, visual regression tests, Playwright, npm publishing, or changesets.
- **FR-018**: The docs build output MUST be placed in `apps/docs/dist` (Astro's default output directory).
- **FR-019**: Existing style package behavior (`packages/styles`, its scripts, and its build) MUST be preserved unchanged.

### Key Entities

- **Docs Workspace**: The `apps/docs` directory containing the Astro + Starlight site. This is a new pnpm workspace package.
- **Docs Page**: A single Starlight content page under `apps/docs/src/content/docs/`. Each section (Getting Started, Foundations, For Agents, Roadmap) has one page.
- **CI Workflow (PR)**: A GitHub Actions workflow file that validates the build on pull requests.
- **CD Workflow (main)**: A GitHub Actions workflow file that builds and deploys to GitHub Pages on push to main.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: The full build command succeeds from the repository root, producing compiled styles output and a deployable static site.
- **SC-002**: The docs workspace can be built independently after the style workspace has been built, through workspace dependency ordering.
- **SC-003**: The deployed site renders the homepage with Pathable brand colors visible and custom properties resolvable to correct values.
- **SC-004**: A pull request workflow passes all validation checks (dependency install, style build, docs build) and does not attempt deployment.
- **SC-005**: A push to the default branch triggers a workflow that validates the build and then deploys the docs site to a public URL where it is accessible.
- **SC-006**: No new dependencies beyond a static site framework, a documentation theme framework, and the local style package are introduced for the docs site.
- **SC-007**: A developer can navigate to each of the four navigation sections and see appropriate but intentionally brief content.

## Assumptions

- The docs site uses Starlight's default theme with minor customizations to apply Pathable brand colors. No custom theme or component override is needed for the proof of concept.
- Astro's default output directory (`dist`) is used; no custom output path configuration is needed.
- GitHub Pages is configured at the repository level (or will be configured as part of the setup) to serve from GitHub Actions.
- The `actions/deploy-pages` action requires `id-token: write` permission for OIDC token exchange; this is included in the workflow.
- The existing `context-index.json` untracked file is not related to this feature and will be ignored.
- The style package's `package.json` `"files"` field includes `dist/` so the built CSS is available to workspace consumers.

## Clarifications

### Session 2026-07-04

- Q: Since `@pathable/styles` has not been published to npm, how should the Getting Started page instruct developers to install it? → A: Instructions should use a GitHub dependency reference (e.g., `"@pathable/styles": "github:PathableAI-org/styles"`) instead of npm. Workspace `workspace:*` usage for monorepo consumers may also be documented.