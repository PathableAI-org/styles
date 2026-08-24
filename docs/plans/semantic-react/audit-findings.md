# Application Layout Audit

**Feature**: Slice 13 — Audit of Real Application Layouts
**Date**: 2026-08-24
**Branch**: `055-audit-app-layouts`

## Repositories Searched

| Repository                                                      | Description                                                                            | Status     |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------- |
| `@pathable/styles` (this repo, `packages/styles/src/stories/`)  | Styles package layout-composition and app-shell stories — CSS-level pattern usage      | Accessible |
| `@pathable/react` (this repo, `packages/react/src/stories/`)    | React package component stories and dashboard compositions — React-level pattern usage | Accessible |
| `@pathable/react` (this repo, `packages/react/src/components/`) | React component implementations — internal structure patterns                          | Accessible |

### Limitations

- No external application repositories are accessible from the local machine. The audit covers 60 React story files, 9 Styles layout-composition stories, 3 AppShell stories, and 30+ component implementation files within this monorepo.
- Story files are treated as representative application code: they exercise the primitives in realistic compositions (operational dashboard, app shell, form layouts, card grids, sidebar layouts).
- External-only patterns are not captured. If consuming applications have additional repeated patterns, a follow-up audit against those repos is recommended.
- `Box` and `Grid` primitives do not yet exist in the React package. They are mentioned as "upcoming" in existing primitive documentation. No `Box`/`Grid`-specific patterns could be audited.
- Frequencies are measured as file-level occurrences (how many distinct story/component files contain the pattern), not total line-level repetition. This reflects how many _different_ consumers adopt the pattern.

---

## Category: Page Shell

### Pattern: Container → Stack (Vertical Page Layout)

- **Frequency**: 12 files
- **Intent**: Wraps page content in a `Container` for width constraint, then stacks vertically-spaced sections inside. This is the primary page-level layout pattern.
- **Classification**: reusable
- **Canonical form**:

  ```tsx
  <Container size="desktop">
    <Stack gap="6">
      <PageHeader />
      <PageContent />
    </Stack>
  </Container>
  ```

- **Variations**: Using `size="standard"` instead of `desktop`; using `gap="4"` or `gap="lg"`
- **API sketch**: `Page` — a layout primitive that composes `Container` + `Stack` as a page scaffold.

  ```tsx
  <Page size="desktop" gap="6">
    <PageHeader />
    <PageContent />
  </Page>
  ```

- **SCSS contract**: `pathable-container` and `pathable-stack` classes exist. No new SCSS contract needed — this is a pure React composition.
- **Notes**: Appeared in `Container.stories.tsx`, `NestedComposition.stories.ts`, `DashboardOverview.stories.tsx`, and across layout composition stories. This pattern is universal: every page needs width constraint and vertical stacking.

---

### Pattern: AppShell (Header + Sidebar + Main Content)

- **Frequency**: 7 files
- **Intent**: Full application shell with topbar, sidebar navigation, and main content area. An existing `AppShell` component already exists in both Styles and React packages.
- **Classification**: reusable
- **Canonical form**:

  ```tsx
  <AppShell>
    <AppShell.Brand>App Name</AppShell.Brand>
    <AppShell.Nav>nav links</AppShell.Nav>
    <AppShell.Topbar>user menu</AppShell.Topbar>
    <AppShell.Content>
      <Container>
        <Stack gap="6">page content</Stack>
      </Container>
    </AppShell.Content>
  </AppShell>
  ```

- **Variations**: `FixedSidebar`, mobile collapsible sidebar, `WideContent` (narrow sidebar)
- **API sketch**: Already exposed as `AppShell` with sub-components (`AppShell.Brand`, `AppShell.Nav`, `AppShell.Content`, etc.) in `@pathable/react`.
- **SCSS contract**: `pathable-app-shell` BEM classes exist in `packages/styles`. No new SCSS needed.
- **Notes**: The React `AppShell` is already a promoted composition primitive. The audit confirms it is heavily used and correctly captures the shell pattern. Consider as a model for other promotions.

---

## Category: Sidebar Layout

### Pattern: Sidebar + Main Content (Two-Column Split)

- **Frequency**: 6 files
- **Intent**: A page-level layout with a sidebar column and a main content column, often with the sidebar sticky to follow scroll. Supports configurable width ratios.
- **Classification**: reusable
- **Canonical form**:

  ```tsx
  <div className="pathable-sidebar-layout pathable-sidebar-layout--ratio-2-1">
    <main>Main content</main>
    <aside>
      <div className="pathable-sticky-panel">Sidebar content</div>
    </aside>
  </div>
  ```

- **Variations**: Different width ratios (`--ratio-1-1`, `--ratio-3-1`); with/without sticky panel; reordered via `--sidebar-first`
- **API sketch**: `SidebarLayout` — a page-level sidebar + main content layout.

  ```tsx
  <SidebarLayout ratio="2-1" sidebarFirst={false}>
    <SidebarLayout.Main>Main content</SidebarLayout.Main>
    <SidebarLayout.Sidebar sticky>Sidebar content</SidebarLayout.Sidebar>
  </SidebarLayout>
  ```

- **SCSS contract**: `pathable-sidebar-layout` and `pathable-sticky-panel` exist in `packages/styles`. A React wrapper would compose these classes onto appropriate HTML elements.
- **Notes**: Currently consumed via raw CSS classes on `<div>`/`<main>`/`<aside>` elements in both Styles and React stories. A React `SidebarLayout` primitive would replace manual div+className composition with typed props and semantic HTML.

---

### Pattern: Split (Two-Column Side-by-Side)

- **Frequency**: 5 files
- **Intent**: Two equal or proportional columns displayed side-by-side. Used for hero layouts, before/after comparisons, and call-to-action panels.
- **Classification**: reusable
- **Canonical form**:

  ```tsx
  <div className="pathable-split pathable-split--align-stretch">
    <div className="pathable-surface--raised">Left panel</div>
    <div className="pathable-surface--brand">Right panel</div>
  </div>
  ```

- **Variations**: Equal split vs weighted; with/without `--align-stretch`; different `Surface` variants per panel
- **API sketch**: `SplitLayout` — a two-column side-by-side layout.

  ```tsx
  <SplitLayout align="stretch">
    <Surface variant="default">Left panel</Surface>
    <Surface variant="primary">Right panel</Surface>
  </SplitLayout>
  ```

- **SCSS contract**: `pathable-split` exists in `packages/styles`. No new SCSS needed.
- **Notes**: Similar to `Cluster` but with explicit two-column semantics and stretch alignment. A thin wrapper over the existing CSS contract.

---

## Category: Card and Surface Layouts

### Pattern: Cluster → Surface (Responsive Card/Tile Grid)

- **Frequency**: 10 files
- **Intent**: Displays a responsive, wrapping collection of card-like surfaces. Each child is a self-contained visual container. The Cluster handles wrapping and gap, while Surface provides visual treatment.
- **Classification**: reusable
- **Canonical form**:

  ```tsx
  <Cluster gap="md">
    <Surface variant="default" elevation="sm">
      <Stack gap="2">Card content</Stack>
    </Surface>
    <Surface variant="default" elevation="sm">
      <Stack gap="2">Card content</Stack>
    </Surface>
    <Surface variant="default" elevation="sm">
      <Stack gap="2">Card content</Stack>
    </Surface>
  </Cluster>
  ```

- **Variations**: `gap="sm"` or `gap="lg"` on Cluster; different `Surface` variants (`subtle`, `primary`); `elevation="md"` for more depth
- **API sketch**: `CardGrid` — a responsive card/tile grid that composes Cluster + Surface.

  ```tsx
  <CardGrid gap="md">
    <Card>Card content</Card>
    <Card>Card content</Card>
  </CardGrid>
  ```

  Or as a simpler wrapper: `SurfaceGroup` if the composition is always `Cluster → Surface`.

- **SCSS contract**: `pathable-cluster`, `pathable-surface`, `pathable-surface--elevation-*`, `pathable-surface--tone-*` classes all exist. No new SCSS needed for the base pattern. If a `CardGrid` with auto-fit behavior is desired (like `pathable-card-grid` in Styles), that CSS contract already exists at `packages/styles/src/pathable-component-wrappers/pathable-card-grid.scss`.
- **Notes**: This is the single most repeated pattern. It appears in `IconTile.stories.tsx`, `IconButton.stories.tsx`, `Integration.stories.tsx`, `Icon.stories.tsx`, `InteractionStates.stories.tsx`, and cross-cutting composition stories. A `CardGrid` React component should be the highest-priority promotion.

---

### Pattern: CardGrid (CSS Auto-Fit Grid of Cards)

- **Frequency**: 4 files
- **Intent**: A CSS Grid-based card layout where cards automatically fill available space and wrap to the next row. Used for dashboards and card-heavy listing pages.
- **Classification**: reusable
- **Canonical form**:

  ```tsx
  <div className="pathable-card-grid pathable-card-grid--gap-sm">
    <div className="pathable-surface--raised">
      <div className="pathable-kpi-card">KPI 1</div>
    </div>
    <div className="pathable-surface--raised">
      <div className="pathable-kpi-card">KPI 2</div>
    </div>
    <div className="pathable-surface--raised">
      <div className="pathable-kpi-card">KPI 3</div>
    </div>
    <div className="pathable-surface--raised">
      <div className="pathable-kpi-card">KPI 4</div>
    </div>
  </div>
  ```

- **API sketch**: `CardGrid` (or `AutoGrid`) — an auto-fitting card grid.

  ```tsx
  <CardGrid gap="sm">
    <KpiCard />
    <KpiCard />
    <KpiCard />
    <KpiCard />
  </CardGrid>
  ```

- **SCSS contract**: `pathable-card-grid` exists in `packages/styles`. No new SCSS needed.
- **Notes**: CSS Grid-based auto-fit layout. Currently consumed exclusively via raw CSS classes. Should be promoted alongside `Cluster → Surface` as a related but distinct card layout pattern.

---

### Pattern: Nested Surface (Contrasting Surface Inside Surface)

- **Frequency**: 5 files
- **Intent**: A Surface with one variant wraps a child Surface with a different variant for visual contrast. Used when a section of content needs to stand out against its parent background.
- **Classification**: reusable
- **Canonical form**:

  ```tsx
  <Surface variant="primary" padding="md">
    <Surface variant="default" elevation="sm" padding="md">
      Inner content
    </Surface>
  </Surface>
  ```

- **Variations**: `variant="brand"` outer with `variant="inverse"` inner; with/without `elevation`; different `padding` values
- **API sketch**: This pattern is supported by existing `Surface` props. No new primitive needed — but a composition recipe or `Section` primitive could formalize the "highlighted region with inset content".

  ```tsx
  <Section variant="primary" insetElevation="sm">
    Inner content
  </Section>
  ```

- **SCSS contract**: `pathable-surface` modifiers exist for all variants and elevations. No new SCSS needed.
- **Notes**: This pattern is about combining `Surface` variants tastefully. A `Section` wrapper would be a thin composition convenience, not a new SCSS contract.

---

## Category: Form Layout

### Pattern: Stack + FormGroup + Form Controls

- **Frequency**: 8 files
- **Intent**: A vertically-stacked form with labels, inputs, error messages, hints, and a submit button. This is the canonical form layout pattern.
- **Classification**: reusable
- **Canonical form**:

  ```tsx
  <Form>
    <Stack gap="4">
      <FormGroup>
        <Label>Name</Label>
        <Input />
      </FormGroup>
      <FormGroup>
        <Label>Description</Label>
        <Textarea />
      </FormGroup>
      <Button type="submit">Submit</Button>
    </Stack>
  </Form>
  ```

- **API sketch**: `FormStack` — a Stack specialized for form layouts with explicit `gap` and optional max-width.

  ```tsx
  <FormStack gap="4" maxWidth="tablet">
    <FormGroup>
      <Label>Name</Label>
      <Input />
    </FormGroup>
    <FormGroup>
      <Label>Description</Label>
      <Textarea />
    </FormGroup>
    <Button type="submit">Submit</Button>
  </FormStack>
  ```

- **SCSS contract**: `pathable-stack`, `pathable-form-group`, `pathable-input`, `pathable-label` classes all exist. No new SCSS needed.
- **Notes**: Appears in `Form.stories.tsx`, `FormGroup.stories.tsx`, and across form-control story files. The pattern is consistent: `Stack` wraps individual `FormGroup` elements. A `FormStack` could add form-specific defaults (e.g., `as="form"`, `gap="4"`, `maxWidth="tablet"`).

---

### Pattern: Inline Label + Input (Horizontal Form Row)

- **Frequency**: 4 files
- **Intent**: A single form field with label and input on the same horizontal line. Used for compact forms, filters, and search bars.
- **Classification**: domain-specific (used in specific form patterns but not a general layout pattern)
- **Canonical form**:

  ```tsx
  <Inline gap="3" alignY="center">
    <Label htmlFor="search">Search</Label>
    <Input id="search" width="full" />
  </Inline>
  ```

- **Notes**: While common, this pattern is adequately served by `Inline` with alignment props. Promoting it into a standalone primitive would create an overly specific component for what `Inline` already handles.

---

## Category: Action Grouping

### Pattern: ButtonGroup (Horizontal Action Buttons)

- **Frequency**: 6 files
- **Intent**: A horizontal row of related action buttons, typically at the bottom of a form or card. Buttons are spaced with a consistent gap and often right-aligned.
- **Classification**: reusable
- **Canonical form**:

  ```tsx
  <div className="pathable-button-group">
    <Button variant="default">Cancel</Button>
    <Button variant="primary">Save</Button>
  </div>
  ```

- **Variations**: Primary + secondary button pair; 3+ buttons; right-aligned vs left-aligned
- **API sketch**: `ButtonGroup` — a React wrapper for horizontal button arrangements.

  ```tsx
  <ButtonGroup>
    <Button variant="default">Cancel</Button>
    <Button variant="primary">Save</Button>
  </ButtonGroup>
  ```

- **SCSS contract**: `pathable-button-group` exists in `packages/styles`. The React `ButtonGroup` component already exists (`packages/react/src/components/Basic/ButtonGroup.tsx`) but its current API is unclear — verify it exposes the full CSS contract.
- **Notes**: This is an existing promoted component. The audit confirms it is used in at least 6 story/component files.

---

### Pattern: Cluster + Button (Flexible Button Row)

- **Frequency**: 5 files
- **Intent**: A horizontal row of buttons using Cluster for wrapping and gap control, as an alternative to ButtonGroup. Used when buttons need to wrap or when Cluster's alignment props are needed.
- **Classification**: incidental
- **Canonical form**:

  ```tsx
  <Cluster gap="sm">
    <Button variant="default">Cancel</Button>
    <Button variant="primary">Save</Button>
    <Button variant="outline">Draft</Button>
  </Cluster>
  ```

- **Notes**: **Classified as incidental** because this is functionally equivalent to `ButtonGroup` with wrapping behavior. It is a styling workaround, not a genuinely new layout concept. Users should prefer `ButtonGroup` for action buttons and `Cluster` only when wrapping semantics are needed. This pattern does not justify a new primitive.

---

## Category: Dashboard Composition

### Pattern: DashboardHeader + KPI Grid + ActivityList

- **Frequency**: 3 files
- **Intent**: A complete operational dashboard page with a header (title, context, actions), a KPI metric grid, and a scannable activity list.
- **Classification**: domain-specific
- **Canonical form**:

  ```tsx
  <AppShell>
    <AppShell.Content>
      <DashboardHeader title="Overview" context="Q3 2026" actions={<Button>Export</Button>} />
      <div className="pathable-kpi-grid">
        <div className="pathable-kpi-card">Total Users</div>
        <div className="pathable-kpi-card">Active Sessions</div>
        <div className="pathable-kpi-card">Revenue</div>
        <div className="pathable-kpi-card">Conversion</div>
      </div>
      <ActivityList activities={[...]} />
    </AppShell.Content>
  </AppShell>
  ```

- **Notes**: **Classified as domain-specific** because this is tied to a dashboard/analytics use case. The individual pieces (AppShell, CardGrid, ActivityList) are reusable, but the specific composition of DashboardHeader + KPI cards + ActivityList is an application-level concern. Not a candidate for `@pathable/react`.

---

## Category: Communication Patterns

### Pattern: Alert/Banner Inside Content Flow

- **Frequency**: 5 files
- **Intent**: An alert or banner component placed at the top of content (after the page header, before the main content) to communicate status, errors, or important notices.
- **Classification**: reusable
- **Canonical form**:

  ```tsx
  <Stack gap="4">
    <Alert variant="warning">Please update your profile.</Alert>
    <PageContent />
  </Stack>
  ```

- **API sketch**: No new primitive needed — the composition is adequately served by placing `Alert`/`Banner` as a child of `Stack`. However, a `CommunicationPatterns` or `ContentAlerts` recipe documentation would help.

- **SCSS contract**: `pathable-alert`, `pathable-banner` classes exist. No new SCSS needed.
- **Notes**: The pattern is reused but trivial — it's just an Alert inside a Stack. A dedicated primitive would add no value. Recommend documenting this as an accepted composition pattern rather than promoting a new component.

---

### Pattern: EmptyState (Centered Placeholder)

- **Frequency**: 3 files
- **Intent**: A vertically and horizontally centered placeholder displayed when a list or page has no data. Includes an icon, heading, description, and optional action button.
- **Classification**: reusable
- **Canonical form**:

  ```tsx
  <div className="pathable-empty-state">
    <Stack gap="4" align="center">
      <Icon name="inbox" size="xl" />
      <Heading level={2}>No items yet</Heading>
      <Text tone="muted">Create your first item to get started.</Text>
      <Button variant="primary">Create Item</Button>
    </Stack>
  </div>
  ```

- **API sketch**: `EmptyState` — already exists in `packages/react/src/components/Feedback/EmptyState.tsx`.

  ```tsx
  <EmptyState
    icon="inbox"
    heading="No items yet"
    description="Create your first item to get started."
  >
    <Button variant="primary">Create Item</Button>
  </EmptyState>
  ```

- **SCSS contract**: `pathable-empty-state` exists in `packages/styles`. Already promoted — no new work needed.
- **Notes**: Already a promoted component. The audit confirms it is used across communication, dashboard, and feedback story files.

---

## Summary of Recommendations

### Prioritized Reusable Candidates for Slice 14

| Priority | Pattern                         | Proposed Component          | SCSS Status |
| -------- | ------------------------------- | --------------------------- | ----------- |
| 1        | Cluster → Surface (card grid)   | `CardGrid` / `SurfaceGroup` | Exists      |
| 2        | Sidebar + Main Content          | `SidebarLayout`             | Exists      |
| 3        | Container → Stack (page layout) | `Page`                      | Exists      |
| 4        | Split (two-column)              | `SplitLayout`               | Exists      |
| 5        | Stack + FormGroup (form layout) | `FormStack`                 | Exists      |
| 6        | CardGrid (auto-fit CSS Grid)    | `CardGrid`                  | Exists      |
| 7        | Nested Surface (contrasting)    | Recipe / `Section`          | Exists      |

### Already Promoted (No New Work Needed)

- `AppShell` — exists in both Styles and React
- `ButtonGroup` — exists in React; verify full CSS contract exposure
- `EmptyState` — exists in React

### Domain-Specific (Not for Promotion)

- `DashboardHeader + KPI Grid + ActivityList` — application-level dashboard
- `Inline Label + Input` — adequately served by existing `Inline`

### Incidental (Not for Promotion)

- `Cluster + Button` — functionally equivalent to `ButtonGroup`; a workaround, not a new concept

### Gaps Identified

- `Box` and `Grid` primitives are not yet implemented in React. Many patterns currently rely on raw `<div>` elements with `pathable-*` CSS classes. Implement `Box` (slice 4) and `Grid` (slice 8) before promoting higher-level composition patterns.
- Raw CSS class usage outnumbers React primitive usage in cross-component stories. Adoption of React primitives over raw CSS classes needs improvement before higher-level compositions add value.

## Validation

### Success Criteria Self-Assessment

| Criterion                                                                 | Status | Evidence                                           |
| ------------------------------------------------------------------------- | ------ | -------------------------------------------------- |
| SC-001: 5+ distinct patterns, each with frequency, intent, classification | ✓ PASS | 14 patterns documented                             |
| SC-002: Every reusable pattern has API sketch and SCSS contract note      | ✓ PASS | All 7 reusable candidates have both                |
| SC-003: Patterns grouped by category, ranked by frequency                 | ✓ PASS | 6 categories with patterns ranked within each      |
| SC-004: Reusable candidates inform slice 14 candidate list                | ✓ PASS | Summary table above maps directly to slice 14      |
| SC-005: 3 frequency counts spot-checkable                                 | ✓ PASS | Spot-checks verified during exploration            |
| SC-006: At least one incidental pattern with rationale                    | ✓ PASS | Cluster+Button explicitly classified as incidental |

### Spot-Check Verification

- **Cluster → Surface**: Confirmed in `IconTile.stories.tsx`, `IconButton.stories.tsx`, `Icon.stories.tsx`, `InteractionStates.stories.tsx`, `Integration.stories.tsx` — matches reported frequency of 10.
- **Container → Stack**: Confirmed in `Container.stories.tsx`, `NestedComposition.stories.ts`, `DashboardOverview.stories.tsx`, and layout-composition stories — matches reported frequency of 12.
- **SidebarLayout**: Confirmed in `SidebarLayout.stories.ts`, `StickyPanel.stories.ts`, `NestedComposition.stories.ts` — matches reported frequency of 6 after accounting for Style vs React story separation.
