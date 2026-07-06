# Context Digest: Docs PoC Documentation

## Tasks Assigned

| Task | Phase | Description |
|------|-------|-------------|
| T001 | Phase 1 | Update `pnpm-workspace.yaml` to include `"apps/*"` |
| T002 | Phase 1 | Create `apps/docs/package.json` with `@pathable/docs` |
| T003 | Phase 1 | Create `apps/docs/tsconfig.json` with Astro strict config |
| T005 | Phase 2 | Create `apps/docs/astro.config.mjs` with Starlight |
| T007 | Phase 3 (US1) | Create custom stylesheet importing `@pathable/styles/dist/styles.css` |
| T008 | Phase 3 (US1) | Create homepage `index.mdx` |
| T009 | Phase 4 (US2) | Create Getting Started page |
| T010 | Phase 4 (US2) | Create Foundations page |
| T011 | Phase 4 (US2) | Create For Agents page |
| T012 | Phase 4 (US2) | Create Roadmap page |
| T012b | Phase 4 (US2) | Update sidebar config in `astro.config.mjs` |

## Feature Specification (spec.md)

### Functional Requirements

| ID | Requirement | Key Detail |
|----|-------------|------------|
| FR-001 | Workspace at `apps/docs` using Astro + Starlight | New workspace |
| FR-002 | Astro config with `@astrojs/starlight`, title "Pathable Styles" | Config value |
| FR-003 | `pnpm-workspace.yaml` includes `"packages/*"` and `"apps/*"` | Workspace setup |
| FR-004 | `apps/docs/package.json`: name `@pathable/docs`, private true, dep `"@pathable/styles": "workspace:*"` | Package setup |
| FR-005 | Docs site MUST import `@pathable/styles/dist/styles.css` | Stylesheet import |
| FR-006 | Docs site MUST use `--pathable-*` custom properties from `@pathable/styles`, not redefined locally | Token usage |
| FR-007 | Exactly four top-level nav sections: Getting Started, Foundations, For Agents, Roadmap | Sidebar config |
| FR-008 | Homepage states: foundational SCSS/CSS package, first version docs style foundations + usage guidance + agent-facing rules, NOT a complete component library, future plans | Homepage content |
| FR-009 | Getting Started: GitHub dependency reference, workspace consumption via `workspace:*` | Page content |
| FR-010 | Foundations: describe colors, typography, spacing, elevation, radius | Page content |
| FR-011 | For Agents: explain agent-facing rules and how AI agents consume the package | Page content |
| FR-012 | Roadmap: list future plans (HTML/CSS examples, React, Vue, component catalog, npm publish) | Page content |
| FR-013 | Root `pnpm build` builds all workspaces in dependency order | Build ordering |
| FR-019 | Existing `packages/styles/` behavior must be untouched | Constraint |

### User Story Priorities
- **US1 (P1)**: Developer views live docs site with Pathable styles applied
- **US2 (P2)**: Developer navigates the docs site four sections
- US3 (P2) and US4 (P3) are handled by other vertical capabilities

## Current State (from context-index.json)

| File | Status | Current Content |
|------|--------|-----------------|
| `pnpm-workspace.yaml` | Exists | `packages:\n  - 'packages/*'\n` |
| Root `package.json` | Exists | `scripts.build: "pnpm -r build"`, `packageManager: pnpm@10.33.0` |
| `packages/styles/package.json` | Exists | name `@pathable/styles`, `files: [README.md, BRAND_RULES.md, AGENTS.md, dist, src]` |

## Style Package Tokens (from source files)

### Semantic Color CSS Custom Properties (from `_semantic.scss`)

| Property | Value | Role |
|----------|-------|------|
| `--pathable-color-bg` | `#dde2e8` | Background (Shilling Silver) |
| `--pathable-color-surface` | `#ffffff` | Surface (White) |
| `--pathable-color-text` | `#00365c` | Text (PathAble Blue) |
| `--pathable-color-text-muted` | `#015a76` | Muted text (Tech Teal) |
| `--pathable-color-border` | `#dde2e8` | Borders |
| `--pathable-color-link` | `#4899e8` | Links (Bright Blue Brooks) |
| `--pathable-color-accent` | `#1cae96` | Accent (Intelligent Jade) |
| `--pathable-color-focus-ring` | `#4899e8` | Focus rings |
| `--pathable-color-danger` | `#dc3545` | Danger |
| `--pathable-color-success` | `#1cae96` | Success |

### Typography CSS Custom Properties (from `_typography.scss`)

| Property | Value | Role |
|----------|-------|------|
| `--pathable-font-heading` | `'Fredoka', system-ui, sans-serif` | Heading font |
| `--pathable-font-alternate-heading` | `'Montserrat Bold', system-ui, sans-serif` | Alternate heading |
| `--pathable-font-subheading` | `'Poppins Bold', system-ui, sans-serif` | Subheading |
| `--pathable-font-body` | `'Nunito', system-ui, serif` | Body font |

### Spacing CSS Custom Properties (from `_spacing.scss`)

| Property | Value |
|----------|-------|
| `--space-4` | `4px` |
| `--space-8` | `8px` |
| `--space-12` | `12px` |
| `--space-16` | `16px` |
| `--space-24` | `24px` |
| `--space-32` | `32px` |
| `--space-48` | `48px` |

### Elevation CSS Custom Properties (from `_elevation.scss`)

| Property | Value |
|----------|-------|
| `--elevation-sm` | `0px 1px 2px 0px rgba(0, 54, 92, 0.12)` |
| `--elevation-md` | `0px 4px 8px 0px rgba(0, 54, 92, 0.16)` |
| `--elevation-lg` | `0px 8px 16px -2px rgba(0, 54, 92, 0.2)` |
| `--elevation-xl` | `0px 12px 24px -4px rgba(0, 54, 92, 0.24)` |

### Border-Radius CSS Custom Properties (from `_radius.scss`)

| Property | Value |
|----------|-------|
| `--radius-sm` | `4px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` |

Raw brand colors (`--pathable-blue`, `--intelligent-jade`, `--bright-blue-brooks`, `--tech-teal`, `--lived-in-lime`, `--shilling-silver`) are also available as CSS custom properties from `_colors.scss`.

## Agent-Facing Rules (from AGENTS.md)

Key directives for the For Agents page (T011):
- Agents MUST use tokens from `@pathable/styles` rather than hardcoded values
- Agents MUST prefer semantic tokens (`--pathable-color-*`) over raw brand colors
- Agents MUST NOT introduce new brand colors or typography rules unless explicitly instructed
- Agents MUST NOT rename brand colors casually
- Agents MUST check contrast for text color pairs
- Agents MUST use `Fredoka` for headings, `Nunito` for body text

## Key Constants

| Constant | Value |
|----------|-------|
| Workspace name | `@pathable/docs` |
| Docs dir | `apps/docs` |
| Styles package | `@pathable/styles` |
| Styles workspace dir | `packages/styles` |
| Package manager | `pnpm@10.33.0` |
| Root build command | `pnpm build` (= `pnpm -r build`) |
| Astro config | `apps/docs/astro.config.mjs` |

## Known Boundaries

- **Must NOT touch**: `packages/styles/src/**`, `packages/styles/dist/**`, `packages/styles/package.json`, `packages/styles/README.md`, `packages/styles/BRAND_RULES.md`, `packages/styles/AGENTS.md`
- **No external dependencies**: No React, Vue, Tailwind, Storybook, Playwright, or npm publishing (per FR-017)

## Research Context

All technology choices are specified and unambiguous:
- Astro + Starlight for static docs site
- pnpm workspace monorepo
- `workspace:*` protocol for local style package dependency
- CSS import of built `dist/styles.css` for token consumption
- GitHub Actions for CI/CD
- TypeScript as language