# Feature Specification: Next Consumer Compatibility

**Feature Branch**: `034-next-consumer-compat`

**Created**: 2026-08-12

**Status**: Draft

**Input**: Make the published PathAble React and styles packages consumable by a Next.js 15 App Router application using React 18, validate the packages as consumers receive them, and prepare patch releases without publishing.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Render PathAble components in an App Router application (Priority: P1)

An application developer can install the PathAble React package alongside React 18, import representative components into an App Router page, and build and render that page without conflicting React runtimes.

**Why this priority**: The current published package fails during server rendering, so downstream applications cannot safely adopt it.

**Independent Test**: Install the packed package into a clean representative application, render Card, Link, List, Tag, and Loading, and verify the production page renders their content without runtime-version errors.

**Acceptance Scenarios**:

1. **Given** an App Router application using React 18, **When** it builds a page importing PathAble React components, **Then** the build completes without an embedded or conflicting React runtime.
2. **Given** the built application, **When** its page is server-rendered, **Then** representative component content is returned without React ownership or older-element errors.

---

### User Story 2 - Apply complete published styling (Priority: P1)

An application developer can use one documented public styling contract and receive every stylesheet asset from the installed packages without private distribution-path imports or application-specific bundler workarounds.

**Why this priority**: Components that render without their fonts and icons do not satisfy the design-system consumption contract.

**Independent Test**: Import styling exactly as documented from packed packages, build the consumer, and confirm every local asset referenced by the stylesheet is included at its resolved package path.

**Acceptance Scenarios**:

1. **Given** a consumer following the React package README, **When** it imports the documented public entrypoint, **Then** PathAble styling is included without importing the styles package directly.
2. **Given** the packed styles package, **When** all local stylesheet URLs are resolved, **Then** every referenced font and image exists in the tarball.

---

### User Story 3 - Prepare corrected packages safely (Priority: P2)

A maintainer can verify the exact publishable artifacts and prepare newer patch releases while preserving existing release-workflow output and without publishing.

**Why this priority**: npm versions are immutable and the correction must be releasable without overwriting the current generated changelogs or versions.

**Independent Test**: Pack both workspaces, inspect their manifests and contents, run the release status command, and confirm both packages have pending patch changes newer than 0.0.1 with no registry publication action.

**Acceptance Scenarios**:

1. **Given** the existing Changesets-generated 0.0.1 worktree output, **When** the fix is prepared, **Then** those changes remain intact and a new Changeset describes patch releases for both packages.
2. **Given** the packed React manifest, **When** dependencies and exports are inspected, **Then** no workspace protocol remains and the documented styling contract is public.

### Edge Cases

- Production and development JSX runtime entrypoints must both remain external to the React library bundle.
- Package asset checks must distinguish local stylesheet URLs from data URLs, fragments, and remote URLs.
- Nested icon and font directories must preserve the paths expected by compiled CSS.
- Validation must fail when source builds pass but packed manifests, exports, or tarball contents are incomplete.
- The consumer smoke test must avoid relying on an npm registry after repository dependencies are available, where practical.
- Existing generated changelog, version, and consumed-Changeset changes must not be reverted, rewritten, or silently staged as part of this feature.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The React package MUST use the consuming application's React and React DOM runtimes rather than embedding its own copies.
- **FR-002**: The React package MUST keep both production and development JSX runtime modules external to its publishable runtime artifact.
- **FR-003**: A consumer installing only the React wrapper package as its PathAble dependency MUST receive the required PathAble CSS and assets through that package's normal dependency graph and public entrypoint.
- **FR-004**: The React README MUST document the actual styling behavior and MUST NOT claim automatic styling unless the public React entrypoint provides it.
- **FR-005**: The styles package MUST publish every local font and image asset at the path resolved by its compiled stylesheet.
- **FR-006**: The styles package MUST retain its authoritative CSS, font, icon, and component-class contracts without adding consumer-specific bundler configuration.
- **FR-007**: Automated regression coverage MUST pack both packages, install those packed artifacts into a clean representative App Router application using React 18, and exercise Card, Link, List, Tag, and Loading.
- **FR-008**: The packed-consumer regression MUST build and render the production application, verify representative content, and reject React runtime-version failures.
- **FR-009**: Package validation MUST inspect packed manifests and tarball contents for registry-safe dependencies, the public styling contract, external React runtimes, and all stylesheet-referenced assets.
- **FR-010**: The new consumer regression SHOULD run without registry access after workspace dependencies are installed, where practical.
- **FR-011**: The change MUST preserve the existing Changesets-generated version, changelog, and consumed-Changeset worktree changes.
- **FR-012**: A new Changeset MUST prepare patch releases for both packages because both published contracts change.
- **FR-013**: No command in this work may publish either package to a registry.
- **FR-014**: All applicable build, lint, type, package, Storybook, and format gates MUST remain enforced and pass or be reported precisely.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A clean representative downstream application builds successfully and serves a page containing all five required representative components on the first validation run after the fix.
- **SC-002**: Zero copies of React or its production/development JSX runtime implementations are embedded in the packed React runtime artifact.
- **SC-003**: One hundred percent of local assets referenced by the compiled stylesheet exist in the packed package at their resolved paths.
- **SC-004**: The packed React manifest contains zero workspace-protocol dependencies and exposes or automatically loads exactly the styling contract documented to consumers.
- **SC-005**: Both corrected packages have pending patch release intent newer than 0.0.1, while zero publication commands are executed.
- **SC-006**: All required repository gates complete with exact results recorded; any environment limitation is separated from a product failure.

## Assumptions

- The existing generated 0.0.1 package versions and changelogs are intentional user-owned Changesets output and form the base for the next patch release.
- Automatic styling through the React public entrypoint remains the preferred contract because it matches the repository constitution and existing wrapper-package intent.
- React and React DOM remain peer dependencies of the React wrapper package.
- The repository's installed dependency graph contains enough material to create an offline or registry-independent temporary consumer fixture.
- No component markup, visual variant, or accessibility behavior change is required; this feature corrects distribution and integration contracts.
