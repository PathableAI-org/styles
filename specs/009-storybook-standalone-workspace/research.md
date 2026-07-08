# Research: Storybook Standalone Workspace

**Feature**: 009-storybook-standalone-workspace | **Date**: 2026-07-08

## Unknown 1: Cross-workspace Story References

**Decision**: Use a relative path glob in `apps/storybook/.storybook/main.js` to reference stories in `packages/styles/src/stories/`, optionally using the `StoriesSpecifier` object form for precision.

**Rationale**: Storybook's `stories` glob is resolved relative to the `.storybook/` directory, so `../packages/styles/src/stories/**/*.stories.js` correctly traverses up from `apps/storybook/.storybook/` to the repo root and back down into the sibling workspace. In pnpm monorepos, the standard glob form works because pnpm's node_modules symlinks do not inject `.stories.js` files into the cwd's tree. No `getAbsolutePath` helper is needed for the stories config.

**Alternatives considered**:
- Moving stories into `apps/storybook` — rejected because spec requires co-location of stories with component source code (FR-008)
- Using symlinks — unnecessary and fragile compared to relative path references

## Unknown 2: Storybook Base Path for GitHub Pages Deployment

**Decision**: Configure the base path in `main.js` using `viteFinal`, applied only during production builds (`configType === 'PRODUCTION'`). Use the existing base path `/styles/` matching the current GitHub Pages URL `https://pathableai-org.github.io/styles`.

**Rationale**: The `@storybook/html-vite` framework allows Vite config customization via `viteFinal`. Setting `config.base = '/styles/'` ensures the preview iframe resolves assets correctly under the subfolder. The `configType` guard prevents the base path from interfering with local dev. GitHub Pages' `upload-pages-artifact`/`deploy-pages` actions handle server-level serving so the manager UI's hardcoded root-relative paths resolve correctly.

**Alternatives considered**:
- Using Storybook's `--output-dir` flag only — doesn't address base path for asset resolution
- Using `<base>` tag in preview-head.html — less standard than Vite's `base` option

## Unknown 3: Storybook Dependency Set for New Workspace

**Decision**: Include the following as `devDependencies` in `apps/storybook/package.json`, all aligned to version `^10.4.6`:

| Package | Version | Purpose |
|---------|---------|---------|
| `storybook` | `^10.4.6` | CLI for `storybook dev` and `storybook build` |
| `@storybook/html-vite` | `^10.4.6` | Framework (includes Vite builder, no separate builder package needed) |
| `@storybook/addon-docs` | `^10.4.6` | Autodocs documentation generation |
| `@storybook/manager-api` | `^10.4.6` | Theme customization API for manager.js |
| `@storybook/theming` | `^10.4.6` | Theme types and helpers |

Additionally include font source packages (devDependencies):
- `@fontsource/fredoka`, `@fontsource/nunito`, `@fontsource/montserrat`, `@fontsource/poppins`

**Rationale**: All are devDependencies — they are build/dev tooling, not runtime dependencies of the documentation site. `@storybook/html-vite` already bundles the Vite builder as a transitive dependency, so no separate `@storybook/builder-vite` is needed. Versions should be aligned to `^10.4.6` (not mixed with v8 as currently exists) to avoid confusion. Note: the current `packages/styles` has `@storybook/manager-api` and `@storybook/theming` at `^8.6.14` while other Storybook deps are at `^10.4.6`; the new workspace should use consistent v10 across all packages.

**Alternatives considered**:
- Keeping mixed v8/v10 versions — rejected; aligned versions are cleaner and reduce risk of subtle incompatibilities
- Using `getAbsolutePath` helper — not needed initially; only adopt if pnpm resolution issues arise

## Technology Decisions Summary

| Decision | Choice |
|----------|--------|
| Storybook config location | `apps/storybook/.storybook/` |
| Story files location (unchanged) | `packages/styles/src/stories/` |
| Stories reference method | Relative glob from `.storybook/main.js` |
| Base path for GitHub Pages | `/styles/` via `viteFinal` in production mode |
| Storybook package versions | All `^10.4.6` (manager-api, theming upgraded from v8) |
| Dependency type | All devDependencies |
| Cross-workspace dependency | `"@pathable/styles": "workspace:*"` (to access compiled CSS) |
| Static output directory | `storybook-static` (default) |
| CI artifact path for deploy | `./storybook-static` |
| .nojekyll requirement | Yes — add to deployment root for GitHub Pages