# Research: React Dashboard Header Wrapper

**Feature**: 037-react-dashboard-header
**Date**: 2026-08-14

## Research Scope

This feature is a framework adapter (React wrapper) over an existing, well-defined styles contract. No external research is needed. All decisions are resolved from repository-internal context.

## Decisions

### D1: Component Naming

**Decision**: `DashboardHeader`.

**Rationale**: Per constitution Principle IV (React naming parity), React components in `packages/react` MUST use the CamelCase form of the equivalent `packages/styles` component name after removing any `pathable` prefix.
- `pathable-dashboard-header` → strip `pathable-` → `dashboard-header` → CamelCase → `DashboardHeader`

**Alternatives considered**: None — constitution-mandated naming rule with no discretion.

### D2: Component File Location

**Decision**: `packages/react/src/components/DashboardHeader/DashboardHeader.tsx`.

**Rationale**: Follows the same pattern as `Card` (`packages/react/src/components/Card/Card.tsx`) and `AppShell` (`packages/react/src/components/AppShell/AppShell.tsx`). No per-component `index.ts` barrel — direct import from the component file. The existing barrel (`src/index.ts`) uses `.js` extensions for imports.

**Alternatives considered**:
- Sub-components for each region (title, context, description, actions): Rejected — these are simple DOM regions, not independently exported components. The styles contract's regions map directly to props, matching the `AppShell` precedent where only items with distinct state logic (e.g., nav items) became sub-components.
- Monolithic `components/DashboardHeader.tsx`: Rejected — the repo convention places each component in a CamelCase directory named after the component.

### D3: Component API Design

**Decision**: Props-based API with `title` (required string), `breadcrumb`, `context`, `description`, `actions` (all optional ReactNode), plus `compact` and `stacked` boolean modifiers and standard `className`/`...rest`.

**Rationale**: This is a thin presentational wrapper. The title is the only structurally required element (the page must always have a primary heading). Breadcrumb, context, description, and actions are optional regions that render only when provided. The two modifiers map directly to the SCSS modifier classes.

**Alternatives considered**:
- Compound components (`<DashboardHeader.Title>`, `<DashboardHeader.Actions>`, etc.): Rejected — over-engineered for a presentational header. Props map one-to-one to the styles contract regions and are simpler for consumers.
- Accepting `ReactNode` for the title instead of `string`: Rejected — the title must be a semantic `h1` for page orientation and a11y; a string keeps the contract unambiguous (per spec FR-003 and Assumptions).
- Data-array model for breadcrumb: Rejected — the styles contract renders breadcrumb as free-form consumer markup (links/spans). Passing `ReactNode` preserves that flexibility without inventing a new breadcrumb model (per spec Assumptions).

### D4: Modifier Variants

**Decision**: `compact?: boolean` → `pathable-dashboard-header--compact`; `stacked?: boolean` → `pathable-dashboard-header--stacked`.

**Rationale**: The SCSS contract defines exactly two modifier classes. Boolean props are the direct mapping and keep the API minimal and type-safe. Default (both `false`) is the base header.

**Alternatives considered**:
- A single `variant?: 'default' | 'compact' | 'stacked'` prop: Rejected — the two modifiers are orthogonal in the styles contract (they affect different regions), so two booleans are more faithful and future-proof.

### D5: DOM Structure

**Decision**: Render the following structure, emitting each optional region only when provided:

```html
<div class="pathable-dashboard-header [--compact] [--stacked] [className]">
  <div class="pathable-dashboard-header__breadcrumb">...</div>   <!-- optional -->
  <div class="pathable-dashboard-header__row">
    <h1 class="pathable-dashboard-header__title">[title]</h1>
    <span class="pathable-dashboard-header__context">...</span>  <!-- optional -->
    <div class="pathable-dashboard-header__actions">...</div>    <!-- optional -->
  </div>
  <p class="pathable-dashboard-header__description">...</p>      <!-- optional -->
</div>
```

**Rationale**: Matches the styles Storybook's `DashboardHeader.stories.ts` markup exactly, including the `__row` wrapper that groups title + context + actions and enables the flex `space-between` layout. Preserving the `__row` is required for the responsive "actions beside title / stack below" behavior (FR-015).

**Alternatives considered**: Omitting `__row` and laying out children directly — Rejected: the styles contract's flex/gap and mobile stacking rules are scoped to `__row`, so omitting it would break the documented layout.

### D6: Transitive Styles Strategy

**Decision**: No direct CSS import in the component file. The barrel `src/index.ts` already imports `@pathableai/styles` as a side-effect; adding the `DashboardHeader` export is sufficient.

**Rationale**: Per Principle V, consumers must receive required styles through the wrapper package. No existing component in `packages/react/src/components/` imports CSS directly; the barrel handles it once.

**Alternatives considered**:
- Direct CSS import in component: Rejected — duplicates the barrel import and violates the established convention.

### D7: Story Structure and Title

**Decision**: Story file at `packages/react/src/stories/dashboard/DashboardHeader.stories.tsx` with `title: 'Dashboard/Dashboard Header'`.

**Rationale**: Mirrors the styles Storybook's `packages/styles/src/stories/dashboard/DashboardHeader.stories.ts` (title `Dashboard/Dashboard Header`). This establishes a new top-level `Dashboard` section in the React Storybook, matching the styles Storybook structure (spec FR-010). The React Storybook main config (`apps/storybook-react/.storybook/main.js`) already globs `packages/react/src/stories/**/*.stories.tsx`, so the file is picked up automatically.

**Alternatives considered**:
- `Components/Basic/DashboardHeader.stories.tsx`: Rejected — would nest under `Components`, contradicting the requirement to mirror the styles `Dashboard` section.

### D8: Story Set

**Decision**: Playground + named stories: `Default`, `WithoutActions`, `ManyActions`, `Compact`, `Stacked`, `Mobile`, `LongTitle`, plus an interaction test story `ActionKeyboardActivation`.

**Rationale**: Maps 1:1 to the states in the styles `DashboardHeader.stories.ts` (Default, WithoutActions, WithManyActions, Compact, Mobile, LongTitle) plus the `Stacked` modifier that the styles contract supports but the styles story file does not currently showcase. The interaction story satisfies FR-013 (keyboard focus/activation). Content is deterministic (mirrors the styles story fixtures, no dates/random/network).

## Dependencies

| Dependency | Status | Notes |
|---|---|---|
| `@pathableai/styles` (workspace:`*`) | Already declared | Runtime dependency in `packages/react/package.json` |
| `pathable-dashboard-header.scss` | Exists | `packages/styles/src/pathable-component-wrappers/pathable-dashboard-header.scss` |
| `Button` component | Exists | `packages/react/src/components/Button/Button.tsx` — used in story actions |
| React 18/19 | Already peer dependency | Declared in `packages/react/package.json` |

## Best Practices

- **Follow Card/AppShell component pattern**: props handling (`className`, `...rest` spread), empty-region avoidance, TypeScript typing.
- **Follow Button story pattern**: `satisfies Meta<typeof DashboardHeader>`, `tags: ['autodocs']`, Playground with controls, fixed-variant stories, interaction tests with `@storybook/test`, accessible queries.
- **Accessible queries**: Use `getByRole`, `getByText` in story interaction tests. Avoid `getByTestId` or CSS selectors.
- **No wrapper-only styling**: Every rendered class name must map to a documented `pathable-dashboard-header*` BEM class in the styles contract.
- **Package verification**: Run `pnpm pack --dry-run` / `publint` / `attw` from `packages/react` before marking complete.
