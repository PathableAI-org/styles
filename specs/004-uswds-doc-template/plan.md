# Implementation Plan: USWDS Documentation Page Template for Astro Docs

**Branch**: `004-uswds-doc-template` | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-uswds-doc-template/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

The Astro docs site in `apps/docs` (powered by Starlight) currently uses a plain Starlight layout. This feature re-themes the page frame to match the USWDS documentation page template layout: a fixed top header with brand logo and horizontal nav, a hierarchical side navigation sidebar (USWDS sidenav style), a prose-optimized main content area, and a USWDS-inspired medium footer. All styling uses `--pathable-*` CSS custom properties from `@pathable/styles` for consistency and to serve as a visual test surface for the styles package. The Starlight TOC (right sidebar) and search functionality are preserved. `usa-*` classes are used only where no `--pathable-*` equivalent exists.

## Technical Context

**Language/Version**: Astro 5.x, `@astrojs/starlight` ^0.32.0, TypeScript (Astro frontmatter/scripts)

**Primary Dependencies**:
- `@pathable/styles` (workspace:*) — provides `--pathable-*` CSS custom properties for colors, typography, spacing, elevation, radius
- `astro` ^5.0.0 — static site framework
- `@astrojs/starlight` ^0.32.0 — documentation theme with component override system
- `uswds` (transitive via `@pathable/styles`) — available for `.usa-*` classes if needed

**Storage**: N/A — static site, no runtime data storage

**Testing**: Manual visual verification — inspect rendered pages in browser DevTools to confirm `--pathable-*` tokens resolve correctly

**Target Platform**: Web browsers — static documentation site

**Project Type**: Static documentation site (Astro + Starlight)

**Performance Goals**: Static site generation — build times under 30s, zero runtime performance concerns

**Constraints**:
- All custom styling MUST use `--pathable-*` CSS custom properties (no hardcoded colors, spacing, fonts)
- `.usa-*` classes MAY be used only where `--pathable-*` equivalents do not yet exist
- Government-specific USWDS elements (`.usa-banner`, `.usa-identifier`) are excluded
- The Starlight TOC (right sidebar on desktop) and search must be preserved
- Existing Starlight component overrides (`PageFrame`) must be preserved and extended
- No additional JavaScript runtime dependencies beyond what Astro/Starlight already provides

**Scale/Scope**: Single app (`apps/docs`), ~5 content pages, primarily CSS and Astro component changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Applicable Principles

| Principle | Relevance | Compliance |
|-----------|-----------|------------|
| **I. CSS Custom Properties Are the Runtime Contract** | The docs site consumes `--pathable-*` tokens as its primary styling mechanism. | ✅ COMPLIANT — All custom components use `--pathable-*` custom properties per FR-010. |
| **III. pnpm Workspaces Structure the Repository** | `apps/docs` already uses `"@pathable/styles": "workspace:*"`. | ✅ COMPLIANT — Workspace boundary respected, no token duplication. |
| **VI. Token Naming Must Be Semantic and Stable** | The docs site uses semantic tokens like `--pathable-color-bg`, `--pathable-font-heading`. | ✅ COMPLIANT |
| **VIII. Accessibility Is Part of Token Quality** | FR-011 requires skip-to-content links; acceptance scenarios require ARIA labels on nav landmarks. Focus ring uses `--pathable-color-focus-ring`. | ✅ COMPLIANT |
| **IX. Framework Independence Comes First** | The docs site is a downstream consumer of `@pathable/styles`, not redefining tokens. | ✅ COMPLIANT |
| **X. Documentation Is a First-Class Package Concern** | The docs site is the primary documentation vehicle for the styles package. | ✅ COMPLIANT — This feature improves the documentation experience. |

### Gate Evaluation

| Gate | Status |
|------|--------|
| No unjustified constitution violations | ✅ All principles are complied with or not applicable |
| All [NEEDS CLARIFICATION] markers resolved | ✅ Spec has zero markers |
| Feature spec is internally consistent | ✅ Verified |
| Constitution read and checked | ✅ Loaded from `.specify/memory/constitution.md` |

**GATE PASSED** — proceed to Phase 0.

### Post-Design Re-Check

*Completed after Phase 1 artifacts generated.*

- [x] No design decision contradicts ratified principles
- [x] data-model.md does not duplicate constitution text
- [x] Complexity Tracking justifications remain valid

## Project Structure

### Documentation (this feature)

```text
specs/004-uswds-doc-template/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 — technical research on Starlight/USWDS patterns
├── data-model.md        # Phase 1 — entity model for layout regions
├── contracts/           # Phase 1 — interface contracts (design token usage)
│   └── token-usage.md   # Which --pathable-* tokens map to which layout regions
├── quickstart.md        # Phase 1 — setup and validation guide
└── tasks.md             # Phase 2 (/speckit-tasks output)
```

### Source Code (repository root)

```text
apps/docs/
├── astro.config.mjs              # UPDATE: already overrides PageFrame; may need sidebar/TOC overrides
├── src/
│   ├── styles/
│   │   └── custom.css            # UPDATE: add USWDS-inspired page layout styles
│   ├── components/
│   │   ├── PageFrame.astro       # UPDATE: restructure layout to USWDS template pattern
│   │   ├── HorizontalNav.astro   # UPDATE: refactor for USWDS basic header look
│   │   ├── DocFooter.astro       # NEW: USWDS medium footer component
│   │   └── SkipNav.astro         # NEW: skip-to-main-content link
│   ├── layouts/                  # (Starlight managed — no changes needed)
│   └── content/
│       └── docs/                 # (Existing markdown content — no changes needed)
└── public/                       # (Static assets — may need logo/favicon)
```

**Structure Decision**: Existing monorepo structure preserved. Changes are confined to `apps/docs/src/components/` (new/updated Astro components) and `apps/docs/src/styles/custom.css` (USWDS-inspired layout and region styles using `--pathable-*` tokens). No changes to content, layouts, or packages outside `apps/docs`.

## Complexity Tracking

No constitution violations identified. All principles are complied with.

### Design Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Astro component approach | Starlight's component override system allows replacing `PageFrame` while keeping content/sidebar/TOC slots. This is the idiomatic Astro/Starlight approach. | Forking Starlight, rebuilding from scratch |
| `--pathable-*` tokens as primary styling | Spec FR-010 requirement; serves as visual test surface for the styles package. | Using USWDS component CSS directly (would not test styles package) |
| Preserve Starlight sidebar slot | Starlight already generates the hierarchical sidebar from the content collection. Wrapping it in USWDS-inspired styles is more maintainable than rebuilding it. | Building a custom sidebar from scratch |
| New DocFooter component | Starlight has no built-in footer slot; USWDS template has a medium footer pattern. Adding a new component is cleanest. | Modifying Starlight internals |
| `usa-*` classes only as fallback | Keeps the docs theme aligned with `@pathable/styles` contract while allowing graceful degradation. | Always bundling USWDS component CSS (unnecessary bloat) |

## Phase 0: Research & Discovery

### Research Task R1: Starlight Component Override Architecture

Understand how Starlight's component override system works beyond just `PageFrame`:

- What slots does PageFrame expose? (header, sidebar, content, etc.)
- Can we override individual inner components (Sidebar, MobileMenuToggle, ThemeSelect)?
- How does the sidebar content get generated and passed?

Key finding from code inspection: `PageFrame.astro` already uses `slot name="header"`, `slot name="sidebar"`, and the default `<slot />` for content. The `hasSidebar` flag from `Astro.locals.starlightRoute` controls sidebar visibility.

### Research Task R2: USWDS Documentation Template Layout Anatomy

Extract the concrete layout regions from the USWDS template HTML:

- **Skip nav**: `.usa-skipnav` — hidden link that appears on focus
- **Banner**: `.usa-banner` — government site identification (EXCLUDED per spec)
- **Overlay + Header**: `.usa-overlay` + `.usa-header--basic` — fixed top header with logo and nav
- **Sidebar**: `.usa-layout-docs__sidenav` + `.usa-sidenav` — hierarchical navigation, hidden on mobile
- **Content**: `<main id="main-content" class="usa-prose">` — prose-styled main content
- **Footer**: `.usa-footer` with `.usa-footer__primary-section` and `.usa-footer__secondary-section`

### Research Task R3: Token Mapping for Layout Regions

Map each layout region to the `--pathable-*` tokens it should use:

| Layout Region | Token | USWDS Equivalent |
|---|---|---|
| Page background | `--pathable-color-bg` | `bg-base-lightest` |
| Header/surface | `--pathable-color-surface` | `bg-white` |
| Body text | `--pathable-color-text` | `text-base-darkest` |
| Links | `--pathable-color-link` | `text-primary` |
| Accent/active | `--pathable-color-accent` | `text-secondary` |
| Focus ring | `--pathable-color-focus-ring` | `focus` |
| Borders | `--pathable-color-border` | `border-base-light` |
| Muted text | `--pathable-color-text-muted` | `text-base` |
| Heading font | `--pathable-font-heading` | Fredoka |
| Body font | `--pathable-font-body` | Nunito |

### Research Task R4: Web Font Loading in Astro

Determine how Pathable brand fonts (Fredoka, Nunito) are loaded in the Astro docs:

- Check if fonts are already loaded (via Google Fonts, self-hosted, etc.)
- If not, determine the appropriate loading strategy: Google Fonts link tag, `@font-face` declarations, or Astro integration

### Research Task R5: Footer Component Design

Determine the USWDS medium footer pattern and design an equivalent using `--pathable-*` tokens:

- Return to top link
- Primary section with nav links
- Secondary section with contact info
- Styled with semantic tokens

### Consolidated Findings (in research.md)

See `research.md` for complete findings from all research tasks.

## Phase 1: Design & Contracts

### Prerequisites: research.md complete

#### 1. data-model.md

Formal entity definitions for:
- **PageFrame** — layout container with header, sidebar, content, footer regions
- **HorizontalNav** — top navigation with brand logo and section links
- **Sidebar** — hierarchical navigation tree (Starlight-generated content, custom-styled)
- **ContentProse** — main content area with typography styling
- **Footer** — site footer with links and branding
- **SkipNav** — accessibility skip-to-content link

#### 2. contracts/

Token usage contract documenting which `--pathable-*` CSS custom properties map to which layout regions, so implementers and reviewers can verify token compliance.

#### 3. quickstart.md

Validation guide covering:
- Build and dev workflow (`pnpm build`, `pnpm dev` from `apps/docs/`)
- Visual verification checklist for each layout region
- Token compliance inspection via browser DevTools
- Responsive breakpoint testing

#### 4. Agent Context Update

Run the agent context update script to register the new layout architecture and component information.

### Post-Design Constitution Re-Check

*After Phase 1 artifacts are generated, verify:*
- [ ] No design decision contradicts ratified principles
- [ ] data-model.md does not duplicate constitution text
- [ ] Complexity Tracking justifications remain valid