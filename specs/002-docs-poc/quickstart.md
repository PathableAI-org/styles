# Quickstart: GitHub Pages Docs PoC

**Feature**: 002-docs-poc | **Date**: 2026-07-04

## Validation Path

Follow these steps to verify the implementation is correct.

### Step 1: Workspace Setup

```bash
# Add apps/* to pnpm-workspace.yaml
# Verify:
cat pnpm-workspace.yaml
# Expected: includes "apps/*"

# Install all dependencies
pnpm install
```

### Step 2: Build Styles

```bash
# Build the style package independently
pnpm --filter @pathable/styles build

# Verify output exists
ls packages/styles/dist/styles.css
```

### Step 3: Build Docs

```bash
# Build the docs package (depends on styles being built first)
pnpm --filter @pathable/docs build

# Verify output
ls apps/docs/dist/index.html
```

### Step 4: Full Root Build

```bash
# Build everything in dependency order
pnpm build

# Exit 0 expected — no errors
echo $?
```

### Step 5: Verify Nav Sections

Open `apps/docs/dist/index.html` (or dev server) and confirm:
- Four nav sections: Getting Started, Foundations, For Agents, Roadmap
- Homepage states this is a proof of concept
- Custom properties from `@pathable/styles` are applied

### Step 6: CI Validation (PR)

Push a branch and open a PR. Verify:
- GitHub Actions workflow `docs-ci.yml` runs
- Steps: install → build styles → build docs
- Check passes (green)

### Step 7: Deploy Validation (main)

Merge to `main`. Verify:
- GitHub Actions workflow `docs-deploy.yml` runs
- Steps: install → build styles → build docs → configure-pages → upload artifact → deploy
- GitHub Pages URL serves the live site