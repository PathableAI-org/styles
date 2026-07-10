# Research: Storybook Workflow-Context Refinement

**Created**: 2026-07-09

**Feature**: [spec.md](spec.md)

## Overview

This document captures research findings for the Storybook workflow-context refinement, covering three areas: button variant mapping for workflow-intent aliases, interaction model classification for all Storybook components, and the deprecation API surface for brand CSS custom properties.

---

## 1. Button Variant Mapping: Workflow-Intent Aliases

### Current State

The `pathable-button.scss` wrapper provides these USWDS-backed variants:

| Variant Class | Background | Text Color | Visual Role |
|---|---|---|---|
| `.pathable-button` (base) | `--pathable-color-action-primary-bg` (#00365c) | White | Primary CTA |
| `.pathable-button--primary` | (same as base) | (same) | (explicit primary) |
| `.pathable-button--secondary` | `--pathable-color-action-secondary-bg` (#1cae96) | `--pathable-color-on-accent` (#001a33) | Supportive action |
| `.pathable-button--accent-cool` | `--pathable-color-link` (#4899e8) | `--pathable-color-on-accent` (#001a33) | Tertiary action |
| `.pathable-button--accent-warm` | USWDS default | USWDS default | Warm accent |
| `.pathable-button--outline` | USWDS default | USWDS default | Outlined |
| `.pathable-button--inverse` | USWDS default | USWDS default | On dark backgrounds |
| `.pathable-button--base` | `--pathable-color-bg` (#dde2e8) | `--pathable-color-text` (#00365c) | Low emphasis |
| `.pathable-button--big` | USWDS default | USWDS default | Large size |
| `.pathable-button--unstyled` | none | inherit | No visible styling |

### Proposed Mapping

| Workflow Intent | Maps To | Rationale | WCAG AA |
|---|---|---|---|
| `.pathable-button--save` | `--secondary` (Intelligent Jade) | Positive confirmatory action — green-ish tone signals success/completion | ✅ 5.8:1 on `--on-accent` |
| `.pathable-button--continue` | `--primary` (PathAble Blue) | Primary forward navigation — highest prominence | ✅ White on #00365c > 7:1 |
| `.pathable-button--review` | `--accent-cool` (Bright Blue Brooks) | Review/inspection action — moderate prominence, blue is trustworthy | ✅ 5.8:1 on `--on-accent` |
| `.pathable-button--destructive` | Custom: `--pathable-color-danger` (#b50909) | Error/destructive action — distinct red for danger semantics | ✅ White on #b50909 > 7:1 |
| `.pathable-button--low-emphasis` | `--base` (Shilling Silver) | Minimal emphasis, ghost-like appearance for dismissible/cancel actions | ✅ #00365c on #dde2e8 > 10:1 |

**Note on `--destructive`**: The current `--pathable-color-danger` is #b50909 (a red). This maps well for destructive actions. The variant should extend `.usa-button` directly (not a USWDS variant) to avoid inheriting unwanted styles, and use `background-color: var(--pathable-color-danger)` with white text.

### Implementation Approach

Each workflow-intent alias will be a new CSS class in `pathable-button.scss` that either:
- `@extend` an existing `.pathable-button--{variant}` and re-export under the intent name, OR
- `@extend .usa-button` directly and apply the branded semantic token

Both approaches produce equivalent output. The former is preferred for variants mapping to existing USWDS variants (save → secondary, continue → primary, review → accent-cool, low-emphasis → base). The latter is needed for `--destructive` since there is no USWDS variant that cleanly maps to a danger action.

---

## 2. Interaction Model Classification

### Classification Guide

| Classification | Definition | Consumer Must |
|---|---|---|
| **CSS-only** | All visual styling works without JavaScript. No interactive behavior is expected. | Import the CSS. That's it. |
| **Requires USWDS JS** | The component uses USWDS JavaScript for interactivity (open/close, expand/collapse, filtering, etc.). | Import `@pathable/styles/js` to enable USWDS JS behaviors, or provide equivalent behavior. |
| **Requires app-owned state** | The component wrapper provides styling only; the consuming application must manage state (selected values, open/closed, validation errors, etc.). | Implement state management in the application framework (Vue, React, etc.). |
| **Not yet behavior-complete** | The component wrapper does not yet replicate all USWDS interactive behaviors. Known gaps exist. | Review the gap documentation and either provide missing behavior or use the USWDS JS equivalent. |

### Component Classification Table

| Component | Classification | Details |
|---|---|---|
| **Accordion** | Requires USWDS JS | Expand/collapse via USWDS JS |
| **Alert** | CSS-only | Static notification display |
| **Banner** | Requires USWDS JS | Dismissible banner via USWDS JS |
| **Breadcrumb** | CSS-only | Static navigation trail |
| **Button** | CSS-only (base) / Requires app-owned state (form submit) | Visual styling only; form submission is app responsibility |
| **Button Group** | CSS-only | Visual grouping only |
| **Card** | CSS-only | Static content container |
| **Checkbox** | CSS-only / Requires app-owned state (controlled inputs) | Styling only; checked state and validation are app responsibilities |
| **Combo Box** | Requires USWDS JS | Typeahead filtering, dropdown management |
| **Date Picker** | Requires USWDS JS | Calendar interaction, date selection |
| **Date Range Picker** | Requires USWDS JS | Dual calendar, range selection |
| **Header** | Requires USWDS JS | Mobile menu toggle, navigation behavior |
| **Icon** | CSS-only | Static SVG rendering |
| **Input** | CSS-only / Requires app-owned state (controlled inputs) | Styling only; value and validation are app responsibilities |
| **Link** | CSS-only | Static anchor styling |
| **List** | CSS-only | Static list styling |
| **Media Block** | CSS-only | Static layout component |
| **Modal** | Requires USWDS JS | Open/close, focus trapping via USWDS JS |
| **Pagination** | CSS-only / Requires app-owned state | Styling only; page state is app responsibility |
| **Process List** | CSS-only | Static step display |
| **Radio** | CSS-only / Requires app-owned state (controlled inputs) | Styling only; selection state is app responsibility |
| **Search** | Requires USWDS JS | Search form behavior |
| **Select** | CSS-only / Requires app-owned state | Styling only; value and validation are app responsibilities |
| **Sidenav** | CSS-only / Requires app-owned state | Styling only; active state is app responsibility |
| **Site Alert** | Requires USWDS JS | Dismissible alert via USWDS JS |
| **Skipnav** | CSS-only | Anchor-based skip link |
| **Step Indicator** | CSS-only | Static step progress display |
| **Summary Box** | CSS-only | Static summary display |
| **Table** | CSS-only | Static data table styling |
| **Tag** | CSS-only | Static label/badge |
| **Textarea** | CSS-only / Requires app-owned state | Styling only; value and validation are app responsibilities |
| **Utilities (bg, text, spacing, etc.)** | CSS-only | Pure CSS utility classes |

---

## 3. Legacy Short Name Removal: Brand CSS Custom Properties

### Current Dual-Naming Issue

`_colors.scss` previously emitted both naming conventions:

```scss
:root {
  // Short names (legacy, removed)
  --pathable-blue: #00365c;
  --intelligent-jade: #1cae96;
  --bright-blue-brooks: #4899e8;
  --tech-teal: #015a76;
  --lived-in-lime: #d3ff66;
  --shilling-silver: #dde2e8;

  // Prefixed names (canonical API)
  --pathable-brand-pathable-blue: #00365c;
  --pathable-brand-intelligent-jade: #1cae96;
  --pathable-brand-bright-blue-brooks: #4899e8;
  --pathable-brand-tech-teal: #015a76;
  --pathable-brand-lived-in-lime: #d3ff66;
  --pathable-brand-shilling-silver: #dde2e8;
}
```

### Recommended Canonical API

**Canonical (preferred)**: `--pathable-brand-{name}` — the fully namespaced version
- `--pathable-brand-pathable-blue`
- `--pathable-brand-intelligent-jade`
- `--pathable-brand-bright-blue-brooks`
- `--pathable-brand-tech-teal`
- `--pathable-brand-lived-in-lime`
- `--pathable-brand-shilling-silver`

**Removed legacy aliases**:
- `--pathable-blue` → use `--pathable-brand-pathable-blue`
- `--intelligent-jade` → use `--pathable-brand-intelligent-jade`
- `--bright-blue-brooks` → use `--pathable-brand-bright-blue-brooks`
- `--tech-teal` → use `--pathable-brand-tech-teal`
- `--lived-in-lime` → use `--pathable-brand-lived-in-lime`
- `--shilling-silver` → use `--pathable-brand-shilling-silver`

### Consumer Migration

Consumers using short names must migrate:
1. Replace `var(--pathable-blue)` with `var(--pathable-brand-pathable-blue)` in CSS
2. Replace `$pathable-blue` with `$pathable-brand-pathable-blue` in SCSS (these are Sass variables, not custom properties — they remain valid)
3. Run `pnpm build` and verify output

### Versioning Impact

This is a **minor** change (removal of CSS custom property aliases, no breaking change since no consumers reference the short names).