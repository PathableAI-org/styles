# Quickstart: USWDS Documentation Page Template for Astro Docs

**Phase**: 1 | **Feature**: 004-uswds-doc-template | **Date**: 2026-07-06

## Prerequisites

- Node.js >= 18 (per Astro 5 requirements)
- pnpm installed globally
- Repository cloned and `pnpm install` run at the root

## Setup

The docs app is already set up in `apps/docs`. To verify:

```bash
cd apps/docs
pnpm install        # Already done if you ran root install
pnpm dev            # Start dev server at http://localhost:4321
pnpm build          # Build static site
```

## Development Workflow

### 1. Start the dev server

```bash
cd apps/docs
pnpm dev
```

### 2. Build the styles package (required when tokens change)

```bash
cd packages/styles
pnpm build          # Rebuilds dist/styles.css with USWDS theme tokens
```

### 3. Key files to edit

| File | Purpose |
| --- | --- |
| `apps/docs/astro.config.mjs` | Starlight config, component overrides |
| `apps/docs/src/components/PageFrame.astro` | Main layout frame (header + nav + sidebar + content + footer) |
| `apps/docs/src/components/HorizontalNav.astro` | Primary navigation bar |
| `apps/docs/src/components/DocFooter.astro` | USWDS-inspired footer |
| `apps/docs/src/components/SkipNav.astro` | Skip-to-content accessibility link |
| `apps/docs/src/styles/custom.css` | Prose typography and layout styles using --pathable-\* tokens |

## Visual Validation Checklist

After making changes, verify each of the following:

### Layout Structure

- [ ] Page has a fixed top header with brand logo and search
- [ ] Horizontal nav appears below the header with section links
- [ ] Sidebar is visible on desktop (width >= 1024px)
- [ ] Sidebar is hidden on mobile (width < 1024px) behind menu toggle
- [ ] Main content has readable max-width
- [ ] Footer appears at the bottom with return-to-top link, nav links, and branding
- [ ] Skip-to-content link appears on first Tab press

### Token Compliance (DevTools Inspection)

- [ ] Page background matches `--pathable-color-bg`
- [ ] Header background matches `--pathable-color-surface`
- [ ] Body text matches `--pathable-color-text`
- [ ] Links match `--pathable-color-link`
- [ ] Active nav item accent matches `--pathable-color-accent`
- [ ] Focus ring matches `--pathable-color-focus-ring`
- [ ] Borders match `--pathable-color-border`
- [ ] Headings use Fredoka (`--pathable-font-heading`)
- [ ] Body text uses Nunito (`--pathable-font-body`)

### Responsive Behavior

- [ ] At 320px width: no horizontal overflow, nav items wrap/collapse
- [ ] At 768px width: sidebar hidden, content full-width
- [ ] At 1280px width: sidebar visible, content constrained
- [ ] Header and horizontal nav remain fixed when scrolling

### Accessibility

- [ ] Tab through the page: skip link appears first
- [ ] Nav landmarks have proper ARIA labels
- [ ] Sidebar navigation is keyboard-accessible
- [ ] Focus indicators are visible on all interactive elements

## Build Verification

```bash
cd apps/docs
pnpm build          # Must complete without errors
pnpm preview        # Preview the built site
```

Verify that the built output in `apps/docs/dist/` produces valid HTML with the correct layout structure.
