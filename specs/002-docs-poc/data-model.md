# Data Model: GitHub Pages Docs PoC

**Feature**: 002-docs-poc | **Date**: 2026-07-04

## Entity: Docs Workspace (`apps/docs`)

| Field | Value |
| ------- | ------- |
| Package name | `@pathable/docs` |
| Visibility | `private: true` |
| Type | Static site (Astro + Starlight) |
| Dependencies | `astro`, `@astrojs/starlight`, `@pathable/styles` (workspace:*) |

## Entity: Docs Page

| Field | Description |
| ------- | ------------- |
| Location | `apps/docs/src/content/docs/` |
| Format | MDX |
| Pages | `index.mdx`, `getting-started/index.mdx`, `foundations/index.mdx`, `for-agents/index.mdx`, `roadmap/index.mdx` |

## Entity: GitHub Actions Workflow

| Field | Description |
| ------- | ------------- |
| PR workflow | `.github/workflows/docs-ci.yml` — validate build only |
| Deploy workflow | `.github/workflows/docs-deploy.yml` — validate + deploy to Pages |
| Permissions | `contents: read`, `pages: write`, `id-token: write` |

## Relationships

```
styles package (packages/styles)
    │
    │ consumes via workspace:*
    ▼
docs workspace (apps/docs)
    │
    │ builds to
    ▼
apps/docs/dist/
    │
    │ deployed on push to main
    ▼
GitHub Pages
```
