# Context Digest: S03-documentation-01 (US2 Content Pages)

## Tasks

| Task | Description |
|------|-------------|
| T009 | Getting Started page - GitHub dependency instruction + workspace:* |
| T010 | Foundations page - brand colors, typography, spacing, elevation, radius |
| T011 | For Agents page - agent-facing rules from AGENTS.md and BRAND_RULES.md |
| T012 | Roadmap page - future plans (HTML/CSS examples, React, Vue, component catalog, npm) |

## Spec Requirements

| FR | Description |
|----|-------------|
| FR-009 | Getting Started: GitHub dependency reference, workspace:* consumption |
| FR-010 | Foundations: describe colors, typography, spacing, elevation, radius |
| FR-011 | For Agents: explain agent-facing rules and AI agent consumption |
| FR-012 | Roadmap: list future plans |

## Key Agent-Facing Rules (from AGENTS.md)

- MUST use tokens from `@pathable/styles` rather than hardcoded values
- MUST prefer semantic tokens (`--pathable-color-*`) over raw brand colors
- MUST NOT introduce new brand colors or typography rules unless explicitly instructed
- MUST NOT rename brand colors casually
- MUST check contrast for text color pairs
- MUST use `Fredoka` for headings, `Nunito` for body text

## Style Token Reference

| Category | Properties |
|----------|-----------|
| Brand Colors | `--pathable-blue`, `--intelligent-jade`, `--bright-blue-brooks`, `--tech-teal`, `--lived-in-lime`, `--shilling-silver` |
| Semantic Colors | `--pathable-color-bg`, `--pathable-color-surface`, `--pathable-color-text`, `--pathable-color-accent`, `--pathable-color-link`, `--pathable-color-danger`, `--pathable-color-success` |
| Typography | `--pathable-font-heading` (Fredoka), `--pathable-font-body` (Nunito) |
| Spacing | `--space-4` through `--space-48` (4px to 48px) |
| Elevation | `--elevation-sm`, `--elevation-md`, `--elevation-lg`, `--elevation-xl` |
| Border Radius | `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (12px) |

## Validation

```bash
pnpm --filter @pathable/docs build
```