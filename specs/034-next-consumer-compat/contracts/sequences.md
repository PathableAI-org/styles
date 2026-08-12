# Sequences: Next Consumer Compatibility

## Build and pack validation

1. Build `@pathableai/styles`, producing CSS, JavaScript helpers, and package-root assets.
2. Build `@pathableai/react`, producing ESM and declarations while retaining external imports.
3. Pack styles into a fresh temporary directory.
4. Pack React into the same temporary directory.
5. Inspect packed manifests and tarball file lists.
6. Parse packed styles CSS and resolve each local asset URL against `dist/styles.css`.
7. Reject any absent asset, workspace protocol, missing automatic style import, or embedded React runtime.

## Consumer validation

1. Generate a minimal App Router fixture in the temporary directory.
2. Point fixture dependencies at the two local tarballs and pinned Next/React validation versions.
3. Install the fixture from the populated pnpm store, avoiding registry access during validation where practical.
4. Build the production application.
5. Read Next's generated static server HTML for the root page and verify text emitted by Card, Link, List, Tag, and Loading.
6. Reject React ownership, older-element, or runtime mismatch output.
7. Remove the temporary directory.

## Patch release preparation

1. Preserve generated 0.0.1 versions, changelogs, and consumed Changeset deletions.
2. Add a new Changeset with patch intent for both packages.
3. Run Changesets status to project the next versions.
4. Do not run versioning or publication commands unless separately authorized.
