# Data Model: Storybook Standalone Workspace

**Feature**: 009-storybook-standalone-workspace | **Date**: 2026-07-08

## Workspace Configuration Model

### Entity: `WorkspaceManifest`

Represents a pnpm workspace package.json for `apps/storybook`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Y | Package name: `@pathable/storybook` |
| `private` | boolean | Y | `true` — this is not published to npm |
| `type` | string | Y | `"module"` — ESM module format |
| `scripts.storybook` | string | Y | `"storybook dev -p 6006"` — dev server command |
| `scripts.build-storybook` | string | Y | `"storybook build"` — static build command |
| `scripts.build` | string | Y | `"storybook build"` — alias for monorepo `pnpm -r build` compatibility |
| `devDependencies` | object | Y | See [research.md](./research.md) for full list |

### Entity: `StorybookConfigMain`

Represents the `.storybook/main.js` configuration file.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `framework` | string | Y | `"@storybook/html-vite"` |
| `stories` | array | Y | Glob patterns referencing `packages/styles/src/stories/` |
| `addons` | array | Y | `["@storybook/addon-docs"]` |
| `docs.autodocs` | boolean | Y | `true` — enable autodocs |
| `viteFinal` | function | N | Custom Vite config for base path in production |

### Entity: `RootScripts`

Represents the scripts added to the root `package.json`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `scripts.docs` | string | Y | `"pnpm --filter @pathable/storybook storybook"` |
| `scripts["build:docs"]` | string | Y | `"pnpm --filter @pathable/storybook build-storybook"` |

## CI/CD Workflow Model

### Entity: `DeployWorkflow`

Represents the GitHub Actions workflow for deploying docs to GitHub Pages.

| Property | Current Value (apps/docs) | New Value (apps/storybook) |
|----------|--------------------------|---------------------------|
| Trigger | push to main | push to main (unchanged) |
| Build command | `pnpm --filter @pathable/docs build` | `pnpm --filter @pathable/storybook build-storybook` |
| Upload path | `apps/docs/dist` | `./packages/styles/node_modules/.cache/storybook-static` or `storybook-static` |
| .nojekyll | not created | must be added to deployment root |

**Note**: The Storybook static build outputs to `storybook-static` by default. Verify this directory name matches the build output (it may vary with Vite builder caching in pnpm). The upload-pages-artifact path should point to the actual output directory.

### Entity: `CIWorkflow`

Represents the GitHub Actions workflow for verifying docs build on PRs.

| Property | Current Value | New Value |
|----------|---------------|-----------|
| Trigger | PR to any branch | PR to any branch (unchanged) |
| Build commands | `pnpm --filter @pathable/styles build && pnpm --filter @pathable/docs build` | `pnpm --filter @pathable/styles build && pnpm --filter @pathable/storybook build-storybook` |

## State Transitions

### Workspace Creation Process

```
1. Create apps/storybook/package.json
   → State: new workspace exists in repo
2. Create apps/storybook/.storybook/* config files
   → State: Storybook can run from workspace
3. Add apps/storybook to pnpm-workspace.yaml
   → State: pnpm recognizes the workspace
4. pnpm install
   → State: dependencies resolved, lockfile updated
5. Verify pnpm docs (root dev server)
   → State: developer workflow works
6. Update GitHub Actions workflows
   → State: CI builds and deploys new workspace
7. Remove storybook deps from packages/styles
   → State: old workspace cleaned up
```

### Deployment Transition

```
1. Update docs-deploy.yml to build apps/storybook
2. Update upload path to storybook-static
3. Add .nojekyll creation step
4. Merge to main
5. Verify GitHub Pages site updates correctly
6. (Optional) Remove apps/docs CI references
```