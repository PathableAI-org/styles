# Package Contract: Next Consumer Compatibility

## `@pathableai/react`

- Importing the package root loads its ESM runtime and the `@pathableai/styles` public CSS entry as a side effect.
- The runtime imports React and JSX helpers from the consumer's installed React package.
- `react`, `react-dom`, `react/jsx-runtime`, and `react/jsx-dev-runtime` implementations are not embedded in `dist/index.js`.
- Public component and type exports remain backward compatible.
- The packed manifest rewrites the styles workspace dependency to a registry-safe version.

## `@pathableai/styles`

- The package root exports `dist/styles.css`.
- Existing JavaScript, distribution, and source subpath exports remain available.
- Each local `url(...)` in `dist/styles.css` resolves to a file included in the packed tarball.
- Generated CSS remains usable without Sass or a framework-specific bundler workaround.

## Packed consumer smoke command

- Builds both packages before packing.
- Runs pnpm pack for both workspaces into a fresh temporary directory.
- Extracts or lists both tarballs and validates consumer-visible manifests and file contents.
- Generates a temporary App Router page importing Card, Link, List, Tag, and Loading from the React tarball installation.
- Installs Next 15.5.22, React 18.3.1, React DOM 18.3.1, and both local tarballs without downloading dependencies during the smoke phase where the pnpm store is already populated.
- Runs a production build, starts the built server, fetches the page, and verifies all representative text.
- Fails on known React runtime mismatch messages, missing CSS assets, missing public style import, workspace protocols, or non-zero child commands.

## Release contract

- A new Changeset marks both packages for patch releases.
- Existing generated 0.0.1 changelogs, versions, and consumed Changeset deletions remain untouched.
- No publish command is part of implementation or validation.
