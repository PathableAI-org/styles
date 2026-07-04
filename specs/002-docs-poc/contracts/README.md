# Interface Contracts: GitHub Pages Docs PoC

**Feature**: 002-docs-poc | **Date**: 2026-07-04

This static-site PoC has minimal external interfaces. The following contracts are documented.

## 1. Workspace Dependency Contract

| Contract | Value |
|----------|-------|
| Source | `apps/docs/package.json` → dependencies |
| Target | `@pathable/styles` at `workspace:*` |
| Requirement | `apps/docs` build MUST run AFTER `packages/styles` build |

## 2. Build Output Contract

| Contract | Value |
|----------|-------|
| Source | `apps/docs/` (Astro build) |
| Output | `apps/docs/dist/` (static HTML/CSS/JS) |
| Consumer | GitHub Pages deployment action |

## 3. Deployment Contract

| Contract | Value |
|----------|-------|
| Trigger | Push to `main` branch |
| Artifact path | `apps/docs/dist` |
| Actions | configure-pages → upload-pages-artifact → deploy-pages |
| Permissions | `contents: read`, `pages: write`, `id-token: write` |

## 4. CI Contract

| Contract | Value |
|----------|-------|
| Trigger | Pull request (any branch) |
| Steps | pnpm install → build @pathable/styles → build @pathable/docs |
| Deploy | MUST NOT deploy to Pages on PR |