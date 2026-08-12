# Research: Next Consumer Compatibility

## Decision 1: Preserve an external CSS side-effect import

**Decision**: Import the `@pathableai/styles` package root from the React source entry and treat that exact package entry as external during the React library build.

**Rationale**: Vite currently follows the stylesheet subpath and extracts it into `dist/index.css`, but it does not leave a runtime import in `dist/index.js`. An external side-effect import remains visible to Next's package graph, uses the styles package's public root export, and satisfies the constitutional automatic styling contract without duplicating CSS in the React tarball.

**Alternatives considered**:

- Export `@pathableai/react/styles.css` and require an application-boundary import. This is viable but weaker than the repository's automatic wrapper contract.
- Inject CSS into the browser from JavaScript. This is unsuitable for server rendering and duplicates stylesheet lifecycle concerns.
- Copy styles into the React package. This duplicates the authoritative styles artifact and risks drift.

## Decision 2: Externalize all React runtime entrypoints

**Decision**: Configure the React build to externalize `react`, `react-dom`, `react/jsx-runtime`, and `react/jsx-dev-runtime`, plus the styles package entry.

**Rationale**: Peer dependencies only describe installation expectations; they do not automatically stop Rollup from bundling JSX runtime imports. Explicit entrypoint externalization makes the published runtime consume the application's React installation.

**Alternatives considered**:

- Externalize only the package roots. This reproduces the current defect because JSX transform imports use React subpaths.
- Replace the JSX transform. This is a broad build change and does not improve the public contract.

## Decision 3: Match the existing compiled stylesheet paths

**Decision**: Copy every local USWDS image and Roboto Mono font referenced by compiled `dist/styles.css` to package-root `img/` and `fonts/` paths. Keep existing PathAble font copies under package-root `fonts/`.

**Rationale**: The stylesheet is generated at `dist/styles.css`; its `../img/...` and `../fonts/...` URLs intentionally resolve to package-root directories. Publishing the referenced assets at those paths is smaller and less fragile than rewriting a mixture of upstream Sass asset paths.

**Alternatives considered**:

- Move stylesheet assets under `dist/` and rewrite Sass configuration. This would require reconciling several USWDS path families and could break existing CSS consumers.
- Copy the entire USWDS image/font distribution. This would substantially inflate the tarball; validation can drive a complete referenced subset instead.

## Decision 4: Validate packed artifacts in a generated consumer

**Decision**: Add a repository script that builds and packs both workspaces, inspects the tarballs and packed manifests, generates a temporary Next.js 15.5.22/React 18.3.1 App Router fixture, installs the tarballs, builds it, and asserts the generated server-rendered HTML.

**Rationale**: Workspace-source tests cannot detect pnpm manifest rewriting, missing `files` entries, missing assets, or library bundling differences. A generated fixture remains narrow while exercising the same artifacts a downstream application receives.

**Alternatives considered**:

- Test only `dist/`. This misses packed manifest and tarball layout defects.
- Modify the downstream repository as the regression fixture. That expands scope and couples package CI to unrelated application source.
- Fetch dependencies during every smoke run. Repository-pinned dev dependencies and offline installation make the test more repeatable.

## Decision 5: Layer a new Changeset on existing release output

**Decision**: Add one new patch Changeset for both packages and leave generated 0.0.1 versions, changelogs, and deleted consumed Changesets unchanged.

**Rationale**: The current worktree is Changesets-generated output corresponding to the already published immutable 0.0.1 versions. A new Changeset records the corrected release intent without rewriting prior release history.

**Alternatives considered**:

- Edit generated changelogs directly. This bypasses Changesets and risks overwriting user-owned output.
- Recreate deleted Changesets. Those entries were consumed by the existing version operation and must remain consumed.
- Publish immediately. Publication is explicitly unauthorized.
