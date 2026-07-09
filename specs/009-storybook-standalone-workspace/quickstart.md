# Quickstart: Storybook Standalone Workspace

**Feature**: 009-storybook-standalone-workspace | **Date**: 2026-07-08

## Local Development

```bash
# From the repository root

# 1. Install dependencies (first time or after adding deps)
pnpm install

# 2. Build the styles package (required before running Storybook)
pnpm --filter @pathable/styles build

# 3. Start the Storybook dev server
pnpm docs
# Opens at http://localhost:6006

# 4. Build static site for production
pnpm build:docs
# Output: apps/storybook/storybook-static/
```

## Validation Checklist

- [ ] `pnpm docs` starts Storybook dev server on port 6006
- [ ] All 40+ component stories render with correct styling
- [ ] Hot-reload works when editing stories in `packages/styles/src/stories/`
- [ ] `pnpm build:docs` produces a valid static build
- [ ] `pnpm build` continues to work (does not attempt to build apps/docs)
- [ ] `pnpm lint:styles` continues to work
- [ ] `pnpm format` continues to work

## CI Deployment

After merging to `main`, verify:
- [ ] GitHub Actions `docs-deploy.yml` triggers and completes successfully
- [ ] GitHub Pages site at `https://pathableai-org.github.io/styles` shows Storybook
- [ ] All stories render correctly on the deployed site
- [ ] Assets load without 404 errors (no broken CSS, JS, or font links)