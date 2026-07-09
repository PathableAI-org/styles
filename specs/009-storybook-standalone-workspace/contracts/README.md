# Interface Contracts: Storybook Standalone Workspace

**Feature**: 009-storybook-standalone-workspace | **Date**: 2026-07-08

## 1. Root Package Script Interface

### `pnpm docs`

| Property | Value |
|----------|-------|
| Script | `pnpm --filter @pathable/storybook storybook` |
| Effect | Starts Storybook dev server on port 6006 |
| Prerequisite | `@pathable/styles` must be built (`pnpm --filter @pathable/styles build`) |
| Error on missing deps | Storybook outputs clear error about missing peer/module |

### `pnpm build:docs`

| Property | Value |
|----------|-------|
| Script | `pnpm --filter @pathable/storybook build-storybook` |
| Effect | Builds static Storybook site to `storybook-static/` |
| Prerequisite | `@pathable/styles` must be built |
| Output dir | `apps/storybook/storybook-static/` (default) |

## 2. Workspace Dependency Contract

### `apps/storybook` ← `packages/styles`

| Property | Value |
|----------|-------|
| Dependency type | `dependencies` (or `devDependencies`) |
| Package spec | `"@pathable/styles": "workspace:*"` |
| Required output | `dist/styles.css` (compiled CSS imported in preview.js) |
| Consumer location | `apps/storybook/.storybook/preview.js` |
| Import path | `import '../node_modules/@pathable/styles/dist/styles.css'` or via workspace alias |

### `pnpm-workspace.yaml` Membership

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

No change needed — `apps/storybook` is already matched by `apps/*`.

## 3. GitHub Actions Workflow: `docs-deploy.yml`

### Before (current)

```yaml
- name: Build styles
  run: pnpm --filter @pathable/styles build
- name: Build docs
  run: pnpm --filter @pathable/docs build
- name: Upload Pages artifact
  uses: actions/upload-pages-artifact@v5
  with:
    path: apps/docs/dist
```

### After (target)

```yaml
- name: Build styles
  run: pnpm --filter @pathable/styles build
- name: Build docs
  run: pnpm --filter @pathable/storybook build-storybook
- name: Create .nojekyll
  run: touch apps/storybook/storybook-static/.nojekyll
- name: Upload Pages artifact
  uses: actions/upload-pages-artifact@v5
  with:
    path: apps/storybook/storybook-static
```

## 4. GitHub Actions Workflow: `docs-ci.yml`

### Before (current)

```yaml
- name: Build styles
  run: pnpm --filter @pathable/styles build
- name: Build docs
  run: pnpm --filter @pathable/docs build
```

### After (target)

```yaml
- name: Build styles
  run: pnpm --filter @pathable/styles build
- name: Build docs
  run: pnpm --filter @pathable/storybook build-storybook
```

## 5. Storybook Configuration Contract

### `apps/storybook/.storybook/main.js`

```js
export default {
  framework: '@storybook/html-vite',
  stories: ['../packages/styles/src/stories/**/*.stories.js'],
  addons: ['@storybook/addon-docs'],
  docs: { autodocs: true },
  async viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION') {
      config.base = '/styles/';
    }
    return config;
  },
}
```

### `apps/storybook/.storybook/preview.js`

```js
import '../node_modules/@pathable/styles/dist/styles.css'

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
}
```

### `apps/storybook/.storybook/manager.js`

Preserved from current `packages/styles/.storybook/manager.js` with import paths updated for the new workspace location.

### `apps/storybook/.storybook/manager-head.html`

Preserved from current `packages/styles/.storybook/manager-head.html` — unchanged content.