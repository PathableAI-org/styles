# Implementation Plan: Typography Storybook Section

**Branch**: `021-typography-storybook` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/011-typography-storybook/spec.md`

**Note**: This plan adds a Brand / Typography Storybook story, associated semantic typography tokens (if missing), and removes the FEEDBACK.md temp file. It follows the same pattern established by the existing Brand / Color Usage story.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Research Topics (Phase 0)](#research-topics-phase-0)
- [Design Artifacts (Phase 1)](#design-artifacts-phase-1)
- [Complexity Tracking](#complexity-tracking)

## Summary

Add a Brand / Typography story to Storybook that displays the four PathAble font roles (Fredoka heading, Montserrat alternate heading, Poppins subheading, Nunito body text), the full typography scale (display-lg through caption-md), long-text examples, and typography violation demonstrations. If any role-based semantic typography tokens are missing from `_typography.scss`, add them following the existing dual-naming convention. Remove the temporary FEEDBACK.md file from git tracking.

This is a documentation and token-cleanup feature — no new USWDS theme configuration, no component wrappers, and no build tooling changes.

## Technical Context

**Project Type**: Design system token package (`packages/styles`) with Storybook documentation (`apps/storybook`)

**Language/SCSS**: Dart Sass (modern-compiler API) via `sass` npm package. Storybook stories use `@storybook/html-vite` with JS-based `.stories.js` files that render HTML template strings.

**Primary Dependencies**:
- `@storybook/html-vite` — Storybook framework
- `@storybook/addon-a11y` — accessibility checks
- `@storybook/addon-docs` — autodocs generation
- `@uswds/uswds` — USWDS v3.x (SCSS source via loadPaths to `packages/uswds`)

**Token Pattern**: Dual-named CSS custom properties (`--pathable-*` and `--usa-*`) emitted from SCSS maps in `_typography.scss`. Font role tokens via `$typography-tokens` map. Size tokens via `$ui-*` variables.

**Existing Pattern for Reference**: `packages/styles/src/stories/brand/ColorUsage.stories.js` — uses `export default { title: 'Brand/Color Usage', tags: ['autodocs'] }` with a single `Default` export that renders an HTML string.

**Story Location**: `packages/styles/src/stories/brand/` — new file `Typography.stories.js`

**FEEDBACK.md**: Located at repository root. To be removed via `git rm` and `.gitignore` entry if appropriate.

**No NEEDS CLARIFICATION** — all technical choices are determined by existing patterns and the spec.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance | Notes |
|-----------|-----------|-------|
| **I. CSS Custom Properties Are the Runtime Contract** | ✅ Pass | The typography tokens are already emitted as `--pathable-*` and `--usa-*` CSS custom properties in `_typography.scss`. The new Storybook story reads from these values. Any new semantic tokens added (FR-008) will follow the same pattern. |
| **II. SCSS Is an Authoring and Extension Layer** | ✅ Pass | Token definitions remain in SCSS maps and variables; CSS custom properties are emitted from them. The Storybook story is a consumer of the compiled CSS output, not SCSS. |
| **III. pnpm Workspaces Structure the Repository** | ✅ Pass | No workspace changes. All changes are within `packages/styles` or root-level cleanup. |
| **VI. Token Naming Must Be Semantic and Stable** | ✅ Pass | Any new tokens added per FR-008 will use role-based semantic names (e.g., `--pathable-typography-heading-font`) that follow the existing naming convention. |
| **VII. Design Source Alignment Matters** | ✅ Pass | The typography roles and values are documented in BRAND_RULES.md and match the brand book. The Storybook story makes these visible for review. |
| **VIII. Accessibility Is Part of Token Quality** | ✅ Pass | The typography violations section demonstrates brand rules that support accessibility (e.g., not using low-contrast heading typefaces for body text). No token values change in ways that affect contrast. |
| **IX. Framework Independence Comes First** | ✅ Pass | The `packages/styles` package remains framework-independent. Storybook is a documentation surface, not a framework dependency. |
| **X. Documentation Is a First-Class Package Concern** | ✅ Pass | The Brand / Typography story directly addresses this principle by making typography documentation visible in Storybook. |
| **XI. Versioning and Release Discipline** | ✅ Pass | No breaking token changes. Adding new CSS custom properties (FR-008) is a minor addition. Token value fixes are patch-level. |

**Result**: ✅ All gates pass. No violations to justify in Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/011-typography-storybook/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: research findings
├── data-model.md        # Phase 1: typography entity definitions
├── quickstart.md        # Phase 1: validation guide
├── contracts/           # Phase 1: (empty — no external interfaces)
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code Changes

```text
# Design tokens package — new story + optional token additions
packages/styles/src/stories/brand/
├── ColorUsage.stories.js    # Existing (unchanged)
└── Typography.stories.js    # NEW — Brand/Typography story

packages/styles/src/
├── _typography.scss          # MODIFIED — add semantic typography tokens if missing (FR-008)
└── _semantic.scss            # UNCHANGED (color tokens only)

# Repository root
FEEDBACK.md                  # REMOVED from git tracking (FR-009)
.gitignore                   # MODIFIED — add FEEDBACK.md if permanent git-ignore desired
```

**Structure Decision**: Follows the single-project layout established by the existing `packages/styles` package. No new packages or directories. The new story file is co-located in the existing `stories/brand/` directory alongside the Color Usage story.

## Research Topics (Phase 0)

1. **Existing typography tokens audit** — inspect `_typography.scss` to determine which role-based semantic tokens already exist and which (if any) are missing per FR-008.
2. **ColorUsage story pattern analysis** — understand the HTML template pattern, data tables, and rendering approach used in the existing Brand / Color Usage story so the Typography story follows consistent conventions.
3. **FEEDBACK.md handling** — determine whether to `git rm` and delete, or add to `.gitignore`.

## Design Artifacts (Phase 1)

- **data-model.md**: Typography role entities, scale token entities, semantic token entities with their CSS custom property mappings.
- **quickstart.md**: Validation steps for verifying the feature.
- **contracts/**: Not needed — no external interfaces are defined or modified by this feature. The Storybook story is a documentation surface, not an API.

## Complexity Tracking

No constitution violations to justify.