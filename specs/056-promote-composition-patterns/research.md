# Research: Promote Repeated Composition Patterns

**Feature**: 056-promote-composition-patterns
**Date**: 2026-08-24

## Decision 1: Box and Grid Primitives Are Not Available — Strategy for Composition Without Them

**Decision**: Build the promoted composition primitives using the five existing React layout primitives (`Container`, `Stack`, `Inline`, `Cluster`, `Surface`) and apply `pathable-*` CSS class names directly on the root element where no existing typed primitive covers the pattern. Do not block this feature on `Box`/`Grid` implementation.

**Rationale**:
- `Box` (slice 4) has no spec, no code, no tasks. It is the earliest stage of planning. Delaying slice 14 for an unscheduled prerequisite would block 5 production-ready composition primitives.
- `Grid` (slice 8) has a complete spec, plan, and task breakdown but implementation has not started. It is closer but still not available.
- Every required SCSS contract already exists and is exported from `packages/styles`. The CSS layer is complete.
- The audit findings explicitly note the gap but the promote-composition-patterns spec (FR-003) only requires Box/Grid to be "implemented and available" *before higher-level composition primitives that depend on them are built*. The composition primitives defined here do not strictly depend on Box or Grid — they compose `Container` + `Stack`, `Cluster` + `Surface`, CSS Grid classes, etc.
- Five of the six candidates are pure compositions of existing primitives that do not need Box/Grid:
  - `Page` = `Container` + `Stack`
  - `CardGrid` (cluster mode) = `Cluster` + `Surface`
  - `FormStack` = `form` + `Stack`
  - `SplitLayout` = target `pathable-split` class mapping (no existing typed wrapper)
  - `SidebarLayout` = target `pathable-sidebar-layout` class mapping (no existing typed wrapper)
- `CardGrid` (auto-fit mode) would benefit from `Grid` but can use the existing `pathable-card-grid` CSS directly on its root element until Grid is available, at which point it can be refactored.

**Alternatives considered**:
- **Block on Box/Grid**: Rejected — Box has no timeline and Grid has no ETA. Would stall delivery.
- **Implement Box as a prerequisite within this feature**: Rejected — Box is a distinct primitive with its own scope (sizing, spacing, display, flex, CSS custom property overrides). Vendoring it into this feature would create an unsplit responsibility boundary.

**Migration path**: When Box and Grid become available, each promoted primitive can be refactored to use them for cleaner internal composition. The public API (component name, props, rendered CSS classes) remains unchanged.

---

## Decision 2: Gap Scale Mapping — Each Primitive Uses Its Own SCSS Gap Scale

**Decision**: Each promoted primitive maps its `gap` prop to the specific gap scale defined by its underlying SCSS contract. No attempt to unify gap scales across primitives.

**Rationale**: The SCSS gap modifier scales are not uniform:
- `pathable-stack` (used by Page, FormStack): `sm=8px, md=16px, lg=24px, xl=32px`
- `pathable-cluster` (used by CardGrid cluster mode): `sm=4px, md=8px, lg=16px, xl=24px`
- `pathable-card-grid` (used by CardGrid auto-fit mode): `sm=16px, md=24px, lg=32px`

Each scale encodes different semantic intent (stack spacing ≠ cluster spacing ≠ card grid spacing). Unifying them would lose domain meaning and contradict the SCSS contracts.

**Implementation**: Each component defines its own `<Component>Gap` type matching its SCSS contract, with a sensible default (e.g., `md` for all).

**Alternatives considered**:
- **Normalize all gaps to a shared scale**: Rejected — would require SCSS changes across three primitives with ripple effects on existing consumers.
- **Use numeric pixel values**: Rejected — loses design-system semantic intent and contradicts the token-based architecture.

---

## Decision 3: CardGrid — Dual Mode (Cluster vs. Auto-Fit) Strategy

**Decision**: `CardGrid` accepts a `variant` prop with values `"cluster"` (default) and `"auto-fit"`. Each mode maps to a different SCSS contract: cluster mode uses `pathable-cluster` + `pathable-surface` composition, auto-fit mode uses `pathable-card-grid` CSS Grid directly.

**Rationale**:
- Both patterns are independently validated by the audit. Cluster mode appears in 10 files, auto-fit mode in 4 files.
- The two modes produce fundamentally different layouts (flex-wrap vs. CSS Grid auto-fill) with different SCSS contracts and different gap scales.
- A single component with a variant prop is clearer than two separate components (`CardGrid` and `AutoGrid`) because the consumer intent is the same ("render a grid of cards").

**Implementation**:
- **Cluster mode**: Composes `Cluster` as the outer wrapper, with children implicitly rendered as `Surface` cards. The `gap` prop maps to `ClusterGap` values.
- **Auto-fit mode**: Renders a `<div>` with `pathable-card-grid` class. The `gap` prop maps to `CardGridGap` values (different scale!). Children are rendered directly — they are responsible for their own surface treatment.
- Each child in either mode receives `pathable-surface` class treatment.

**Alternatives considered**:
- **Two separate components (`CardGrid` + `AutoGrid`)**: Rejected — splits user intent unnecessarily.
- **Auto-detect mode from child count**: Rejected — unpredictable layout changes based on data, not developer intent.

---

## Decision 4: SidebarLayout — Sticky Sidebar Implementation

**Decision**: `SidebarLayout` provides a `sticky` boolean prop on the sidebar slot. When `true`, the sidebar child is wrapped in a `<div>` with `pathable-sticky-panel` class. Sticky behavior is a consumer opt-in, not a default.

**Rationale**:
- The `pathable-sticky-panel` SCSS contract is separate from `pathable-sidebar-layout`. Not all sidebars need to be sticky.
- Making sticky behavior a prop on the sidebar slot (rather than `SidebarLayout` itself) is consistent with how `Surface` handles elevation and tone.

**Implementation**:
- `SidebarLayout` renders a root `<div>` with `pathable-sidebar-layout` class and ratio modifier.
- Two slots: `<SidebarLayout.Main>` (renders `<main>`) and `<SidebarLayout.Sidebar sticky>` (renders `<aside>` with optional `pathable-sticky-panel` wrapper).
- The `ratio` prop maps to `--ratio-1-1`, `--ratio-2-1`, `--ratio-3-1`, `--ratio-4-1`.
- The `sidebarFirst` prop inverts the DOM order and sets `--sidebar-first` modifier.

**Alternatives considered**:
- **Sticky as default**: Rejected — sticky behavior should be opt-in, consistent with `pathable-sticky-panel` being a separate contract.
- **Compound component pattern with dot notation**: Accepted — consistent with how `AppShell` uses `AppShell.Brand`, `AppShell.Nav`, etc.

---

## Decision 5: FormStack — `<form>` as Default Root Element

**Decision**: `FormStack` renders as a `<form>` element by default, composing `Stack` internally for vertical spacing. The `as` prop can override the root element (e.g., `as="div"`), but `<form>` is the semantic default.

**Rationale**:
- The SCSS contract `pathable-form-group` expects children inside a `<form>` context for proper label-input association.
- Making `<form>` the default eliminates a common accessibility oversight (wrapping form controls in a `<div>` without form semantics).
- The existing `Form` component already renders `<form>` — `FormStack` follows the same convention.

**Alternatives considered**:
- **`<div>` as default**: Rejected — contradicts form semantics and accessibility requirements.
- **No default, require explicit `as="form"`**: Rejected — adds boilerplate for the 99% case.

---

## Decision 6: SplitLayout — Ratio and Alignment Mapping

**Decision**: `SplitLayout` accepts `ratio` (e.g., `"1-1"`, `"1-2"`, `"2-1"`, `"1-3"`) and `align` (e.g., `"center"`, `"start"`, `"end"`, `"stretch"`) props, mapped to `pathable-split--ratio-*` and `pathable-split--align-*` BEM modifiers. Default ratio is `"1-1"`, default align is `"center"`.

**Rationale**:
- The SCSS contract supports these exact ratio values (defined as CSS custom property overrides).
- The responsive collapse at 1023px is built into the SCSS — no component-level media query logic needed.

**Alternatives considered**:
- **Flexbox-based split with column widths**: Rejected — the CSS Grid contract is already defined and tested. Reimplementing with flex would duplicate battle-tested SCSS.