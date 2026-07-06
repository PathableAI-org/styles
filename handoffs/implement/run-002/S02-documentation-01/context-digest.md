# Context Digest: S02-documentation-01 (Starlight Config & US1)

## Tasks

| Task | Description | Phase |
|------|-------------|-------|
| T005+T012b | Create `apps/docs/astro.config.mjs` with Starlight, title, and all 4 sidebar sections | Phase 2 + US2 |
| T007 | Create custom stylesheet importing `@pathable/styles/dist/styles.css` with `--pathable-*` tokens | Phase 3 (US1) |
| T008 | Create homepage `index.mdx` stating PoC nature | Phase 3 (US1) |

## Spec Requirements

| FR | Description |
|----|-------------|
| FR-001 | Workspace at `apps/docs` using Astro + Starlight |
| FR-002 | Astro config with `@astrojs/starlight`, title "Pathable Styles" |
| FR-005 | Docs site MUST import `@pathable/styles/dist/styles.css` |
| FR-006 | Docs site MUST use `--pathable-*` custom properties from `@pathable/styles`, not redefined locally |
| FR-007 | Exactly four top-level nav sections: Getting Started, Foundations, For Agents, Roadmap |
| FR-008 | Homepage states: foundational SCSS/CSS package, first version docs style foundations + usage guidance + agent-facing rules, NOT a complete component library |

## Semantic Token Reference (from compiled styles.css)

| Property | Value |
|----------|-------|
| `--pathable-color-bg` | `#dde2e8` |
| `--pathable-color-surface` | `#ffffff` |
| `--pathable-color-text` | `#00365c` |
| `--pathable-color-accent` | `#1cae96` |
| `--pathable-font-heading` | `'Fredoka', system-ui, sans-serif` |
| `--pathable-font-body` | `'Nunito', system-ui, serif` |

## Validation Commands

```bash
test -f apps/docs/astro.config.mjs && echo 'config exists'
test -f apps/docs/src/styles/custom.css && echo 'custom.css exists'
test -f apps/docs/src/content/docs/index.mdx && echo 'index.mdx exists'
pnpm --filter @pathable/styles build && pnpm --filter @pathable/docs build
```