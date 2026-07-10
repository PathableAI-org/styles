# Feature Specification: Storybook Standalone Workspace

**Feature Branch**: `009-storybook-standalone-workspace`
**Created**: 2026-07-08
**Status**: Draft
**Input**: User description: "Storybook should not be part of the packages/styles workspace. It should be its own workspace that will one day document our web components alongside their React and View equivalents. It should also replace apps/docs as our GitHub Pages deployment. Users should be able to run pnpm docs from the root directory to get the Storybook documentation site."

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Runs Storybook Documentation Locally (Priority: P1)

A developer on the project wants to browse the interactive component documentation to understand how components look and behave. They run a single command from the monorepo root and get the Storybook documentation site running locally.

**Why this priority**: This is the core value — providing a simple, discoverable developer experience for documentation. If this doesn't work, nothing else matters.

**Independent Test**: Can be fully tested by running the command from the root directory and confirming the Storybook dev server starts at `localhost:6006` with all 40+ stories rendering correctly.

**Acceptance Scenarios**:

1. **Given** a fresh checkout of the repository, **When** the developer runs `pnpm docs` from the root, **Then** the Storybook dev server starts on port 6006 and all component stories are accessible
2. **Given** the Storybook dev server is running at `localhost:6006`, **When** the developer views any story, **Then** the component renders with the correct `@pathable/styles` CSS
3. **Given** the Storybook dev server is running, **When** the developer makes changes to a story or component source, **Then** hot-reload reflects the changes immediately

---

### User Story 2 - Storybook Deploys to GitHub Pages on Main Push (Priority: P1)

A maintainer merges changes to the `main` branch. The Storybook documentation site automatically builds and deploys to GitHub Pages, replacing the previous Astro/Starlight docs site.

**Why this priority**: The GitHub Pages deployment is the public face of the project's documentation. Replacing `apps/docs` as the deployment target is a core requirement.

**Independent Test**: Can be fully tested by pushing a change to `main` and verifying the GitHub Pages site updates at `https://pathableai-org.github.io/styles` with the Storybook output.

**Acceptance Scenarios**:

1. **Given** a push to the `main` branch, **When** the CI pipeline runs, **Then** the Storybook static build completes successfully
2. **Given** the Storybook build completes, **When** the deploy action uploads the artifact, **Then** the GitHub Pages site at the project's URL shows the Storybook documentation
3. **Given** the Storybook site is deployed, **When** a user visits `https://pathableai-org.github.io/styles`, **Then** all stories render correctly with proper styling

---

### User Story 3 - Future-Ready: Multi-Framework Documentation (Priority: P3)

A component author wants to document a component that has implementations in HTML, React, and Vue. The Storybook workspace is structured to support adding React and Vue framework support in the future without reorganization.

**Why this priority**: This is a forward-looking requirement. The workspace needs to be architected correctly now so future framework integrations don't require a rewrite.

**Independent Test**: Can be tested by verifying the workspace structure is independently configurable from framework-specific packages, even if React/Vue are not yet implemented.

**Acceptance Scenarios**:

1. **Given** the Storybook workspace exists, **When** a developer inspects its configuration, **Then** it has the capacity to add React or Vue framework presets without restructuring the workspace
2. **Given** the Storybook workspace is standalone, **When** a developer adds new framework-specific stories in future, **Then** they can be added alongside existing HTML stories without conflict

---

### Edge Cases

- What happens when there are no story files to display? The Storybook should show a welcome/empty state rather than crashing.
- How does the system handle a broken story file? One broken story should not prevent the rest of the documentation from rendering.
- What happens if `@pathable/styles` build fails? The Storybook build should fail with a clear error message indicating the dependency issue.
- How does deployment handle the transition from `apps/docs`? The old GitHub Pages URL and deployment workflow must be updated atomically to prevent downtime.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A new Storybook workspace MUST be created at `apps/storybook` containing the Storybook configuration, moving it out of `packages/styles`.
- **FR-002**: The new workspace MUST have `storybook` and `build-storybook` scripts that can be invoked via the monorepo's package filter mechanism.
- **FR-003**: The root `package.json` MUST include a `docs` script that runs the Storybook dev server.
- **FR-004**: The root `package.json` MUST include a `build:docs` script that builds the Storybook static site for deployment.
- **FR-005**: The root `docs` and `build:docs` scripts MUST use the monorepo's package filter mechanism to target the new Storybook workspace.
- **FR-006**: The `apps/docs` Astro/Starlight site MUST be removed as a deployment target; the automated deployment workflow MUST be updated to deploy the new Storybook workspace instead.
- **FR-007**: The automated deployment workflow MUST build the `@pathable/styles` package first (dependency), then build the Storybook static site, then deploy the output to GitHub Pages.
- **FR-008**: The Storybook configuration MUST reference stories from `packages/styles/src/stories/`, keeping them co-located with component source code.
- **FR-009**: The new workspace MUST depend on `@pathable/styles` from the monorepo's internal packages.
- **FR-010**: Storybook addons and configuration (theme, preview, manager) MUST be preserved and functional in the new workspace.
- **FR-011**: The `apps/docs` directory and its contents MAY be kept as legacy source but MUST NOT be built or deployed by any CI workflow.
- **FR-012**: The deployment workflow MUST create a `.nojekyll` file in the published root to ensure GitHub Pages serves Storybook assets correctly.

### Key Entities

- **Storybook Workspace (`apps/storybook`)**: A new pnpm workspace containing Storybook configuration (main.js, preview.js, manager.js, manager-head.html) and its own package.json with storybook and related dependencies.
- **Story Files (`packages/styles/src/stories/`)**: The existing 40+ story files that remain in `packages/styles` and are referenced by the Storybook workspace.
- **Automated Deployment Workflow**: The CI configuration that builds and deploys documentation, updated to target the Storybook workspace instead of `apps/docs`.
- **Root Package Scripts**: The `pnpm docs` and `pnpm build:docs` commands added to the root `package.json`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can run `pnpm docs` from the monorepo root and see the Storybook site at `localhost:6006` within 30 seconds on a warm cache.
- **SC-002**: The Storybook static build for deployment completes in under 2 minutes in the automated build environment.
- **SC-003**: All 40+ existing stories render correctly in both dev mode and the static build.
- **SC-004**: The GitHub Pages site updates on every `main` push without manual intervention.
- **SC-005**: No existing development workflows are broken — existing build, lint, and format commands continue to work as before.
- **SC-006**: The workspace structure is ready for future React and Vue story additions without requiring restructuring.

## Assumptions

- The new workspace will be named `apps/storybook` and its package will be named `@pathable/storybook` (following the `apps/` naming convention).
- Story files will remain in `packages/styles/src/stories/` co-located with component source code; the Storybook workspace will reference them via a path alias or direct import.
- The `apps/docs` directory will be kept in the repository but will no longer be built or deployed; it serves as legacy reference only.
- The existing `docs-deploy.yml` workflow will be modified (not replaced wholesale) to switch the deployment target to Storybook.
- The existing `docs-ci.yml` workflow will be updated to verify the Storybook build passes on pull requests.
- Storybook's static output directory will be configured to `storybook-static` (the default) and deployed from there.
- A `.nojekyll` file is required at the root of the GitHub Pages deployment for Storybook assets to load correctly.
