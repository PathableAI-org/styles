# Quickstart: Validating Storybook Workflow-Context Refinement

**Created**: 2026-07-09

**Feature**: [spec.md](spec.md)

## Prerequisites

- Node.js 18+
- pnpm installed (`corepack enable && corepack prepare pnpm@latest --activate`)
- Repository cloned and dependencies installed (`pnpm install`)

## Build and Verify

### 1. Start Storybook

```bash
pnpm storybook
```

This starts Storybook on `http://localhost:6006` by default.

### 2. Verify Story Copy Updates

Open each of these stories and verify the copy reflects PathAble/CoachBridge workflows:

| Story | Location | What to Check |
| --- | --- | --- |
| Header | Components > Navigation > Header | Nav items use product-specific labels |
| Banner | Components > Communication > Banner | Copy reflects coaching/compliance context |
| Combo Box | Components > Form Controls > Combo Box | Options use realistic activity/participant data |
| Modal | Components > Communication > Modal | Title and body use workflow copy |
| Button | Components > Button | Workflow-intent variant examples exist |

### 3. Verify Interaction Models

Browse to any component story and check the **Docs** tab for the "Interaction Model" section. Run this quick checklist:

- [ ] Every story has an Interaction Model annotation
- [ ] Stories marked "Requires USWDS JS" also list specific JS behaviors
- [ ] Stories marked "Requires app-owned state" describe what state to manage
- [ ] Stories marked "CSS-only" state no JavaScript required

### 4. Verify Font Fallback

```bash
rg 'pathable-font-body' packages/styles/src/_typography.scss
```

Confirm the output shows `sans-serif` (not `serif`) as the fallback for the body font.

### 5. Verify Button Variants

In the Storybook Button story, check for these workflow-intent variants:

| Variant | Example Label | Expected Color |
| --- | --- | --- |
| `.pathable-button--save` | "Save Coaching Note" | Intelligent Jade (#1cae96) |
| `.pathable-button--continue` | "Continue to Review" | PathAble Blue (#00365c) |
| `.pathable-button--review` | "Review Compliance" | Bright Blue Brooks (#4899e8) |
| `.pathable-button--destructive` | "Delete Activity" | Danger Red (#b50909) |
| `.pathable-button--low-emphasis` | "Cancel" | Shilling Silver (#dde2e8) |

### 6. Verify Legacy Short Names Removed

```bash
rg '--pathable-brand-' packages/styles/src/_colors.scss
```

Confirm only the 6 canonical `--pathable-brand-*` properties exist. The short names (`--pathable-blue`, `--intelligent-jade`, etc.) should be absent.

### 7. Build Verification

```bash
pnpm build
```

Confirm no build errors. The compiled CSS should contain both old and new custom properties (old ones are kept for compatibility, annotated with comments where possible).

### 8. Stylelint

```bash
pnpm stylelint
```

Should pass without new errors (existing lint issues unrelated to this feature are acceptable).

## Validation Checklist

- [ ] Story copy updated in Header, Banner, Combo Box, Modal
- [ ] Interaction model annotations added to all stories
- [ ] `$pathable-font-body` fallback changed to `sans-serif`
- [ ] 5 workflow-intent button variants implemented and visible in Storybook
- [ ] Legacy short-name brand custom properties removed (`--pathable-brand-*` canonicals remain)
- [ ] `pnpm build` succeeds
- [ ] `pnpm stylelint` passes
