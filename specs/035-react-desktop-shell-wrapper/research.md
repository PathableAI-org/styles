# Research: React Desktop Shell Wrapper

**Feature**: 035-react-desktop-shell-wrapper
**Date**: 2026-08-13

## Research Scope

This feature is a framework adapter (React wrapper) over an existing, well-defined styles contract. No external research is needed. All decisions are resolved from repository-internal context.

## Decisions

### D1: Component Naming

**Decision**: `AppShell` for the main component, `AppShellNavItem` for the navigation item sub-component.

**Rationale**: Per constitution Principle IV, React components in `packages/react` MUST use the CamelCase form of the equivalent `packages/styles` component name after removing any `pathable` prefix.
- `pathable-app-shell` → strip `pathable-` → `app-shell` → CamelCase → `AppShell`
- `pathable-app-shell__nav-item` → strip `pathable-` → `app-shell__nav-item` → CamelCase → `AppShellNavItem`

**Alternatives considered**: None — this is a constitution-mandated naming rule with no discretion.

### D2: Component File Location

**Decision**: `packages/react/src/components/AppShell/AppShell.tsx` and `packages/react/src/components/AppShell/AppShellNavItem.tsx`.

**Rationale**: Follows the same pattern as `Card` (`packages/react/src/components/Card/Card.tsx`). No per-component `index.ts` barrel — direct import from the component file. The existing barrel (`src/index.ts`) uses `.js` extensions for imports.

**Alternatives considered**:
- Separate files for each sub-component type (AppShellSidebar, AppShellTopbar, etc.): Rejected — adds unnecessary file modules for markup regions that are simple DOM wrappers. The spec calls for one sub-component (`AppShellNavItem`) because it has distinct` active` state logic.
- Monolithic single file: Rejected — `AppShellNavItem` is independently exported and should be a separate module.

### D3: Component API Design

**Decision**: Props-based API with `sidebarBrand`, `sidebarNav`, `sidebarAccount`, `topBarTitle`, `bottomNavItems`, `contentWidth`, `sidebarFixed`, `notification`, and standard `children`/`className`/`...rest`.

**Rationale**: This provides a clean declarative API that maps each region to a single prop. The `AppShellNavItem` sub-component handles navigation items with proper BEM classes and `aria-current` semantics. The bottom navigation items use a data array rather than a separate sub-component because the markup structure is simpler (icon + label + href + active).

**Alternatives considered**:
- Compound components (`<AppShell.Sidebar>`, `<AppShell.Content>`, etc.): Rejected — adds unnecessary nesting depth for a layout component. The styles contract already defines the structural HTML, and the wrapper's job is to emit it correctly, not to create a parallel component API.
- Children-only approach (users pass pre-styled elements): Rejected — defeats the purpose of a wrapper. The wrapper exists to eliminate manual BEM class assembly.

### D4: Skip Link Implementation

**Decision**: The AppShell component renders a `<a className="pathable-skipnav" href="#main-content">Skip to main content</a>` element as the first child of the root div.

**Rationale**: The existing `packages/styles` provides `pathable-skipnav` as a USWDS component wrapper. The app shell spec (#017) calls for a skip link as the first focusable element. The `#main-content` ID is already used in the styles contract examples. No new styles or classes are needed.

**Alternatives considered**:
- Configurable skip link target: Rejected — the spec ties the skip link to the main content region, which is always `#main-content`. This is not a design parameter; it's a structural invariant of the shell.
- Making it optional: Rejected — FR-009 is unconditional. Every app shell MUST include a skip link.

### D5: Mobile Bottom Navigation Items

**Decision**: The `bottomNavItems` prop accepts an array of `BottomNavItem` objects with `label`, `icon` (ReactNode), `href`, and optional `active` fields. The AppShell component renders a `<nav className="pathable-bottom-navigation">` with anchor items.

**Rationale**: The `pathable-bottom-navigation` BEM structure (nav > a > icon + label) is straightforward and repetitive. An array-of-objects API avoids the verbosity of a sub-component for each item while still providing type safety. The `active` field drives both the `--active` modifier class and `aria-current="page"`.

**Alternatives considered**:
- `AppShellBottomNavItem` sub-component: Rejected — navigation bar items have no meaningful internal complexity beyond icon + label + active, unlike sidebar nav items that expose additional className/rest passthrough.
- Allow raw ReactNode: Rejected — the wrapper must emit correct BEM markup. Consumer-provided raw nodes could break the contract.

### D6: Transitive Styles Strategy

**Decision**: No additional CSS import in the AppShell component files. The barrel `src/index.ts` already imports `@pathableai/styles` as a side-effect. Adding the AppShell export to the barrel is sufficient.

**Rationale**: Per Principle V, consumers must receive required styles through the wrapper package. The existing React package barrel already imports `@pathableai/styles`. As long as the component is exported through the barrel, consumers get the CSS automatically. Verified by the existing pattern — no other component in `packages/react/src/components/` imports CSS directly.

**Alternatives considered**:
- Direct CSS import in component file: Rejected — duplicates the barrel import and violates the existing package convention.
- Separate entry point: Rejected — over-engineering for a single component.

### D7: Story Structure

**Decision**: Stories in `packages/react/src/stories/components/AppShell/AppShell.stories.tsx` with `title: 'Components/AppShell'`.

**Rationale**: Follows the pattern established by Card (`packages/react/src/stories/components/Basic/Card.stories.tsx`). The stories directory uses CamelCase matching the component name. Required stories: Playground, DesktopShell, MobileShell, FixedSidebar, WideContent, LongNavLabels, NarrowViewport, and at least one OperationalDashboard composition.

**Alternatives considered**:
- `packages/react/src/stories/components/Basic/AppShell.stories.tsx`: Rejected — AppShell is a complex layout component, not a Basic element. A dedicated directory better communicates its role.

### D8: Content Width Default

**Decision**: Default content width is `'standard'` (maps to `pathable-app-shell__content--standard`, max-width 1024px). The `'wide'` option maps to `pathable-app-shell__content--wide` (max-width 1280px).

**Rationale**: The styles contract defaults to standard width, and the `--standard` modifier class is the documented default. The `contentWidth` prop controls which modifier is applied. When omitted, the component applies `--standard`.

**Alternatives considered**: Using `maxWidth` as a CSS custom property directly: Rejected — the wrapper must map to existing BEM modifier classes, not create new CSS variables.

## Dependencies

| Dependency | Status | Notes |
|---|---|---|
| `@pathableai/styles` (workspace:`*`) | Already declared | Runtime dependency in `packages/react/package.json` |
| `pathable-app-shell-layout.scss` | Exists | `packages/styles/src/pathable-component-wrappers/pathable-app-shell-layout.scss` |
| `pathable-bottom-navigation.scss` | Exists | `packages/styles/src/pathable-component-wrappers/pathable-bottom-navigation.scss` |
| `pathable-skipnav` | Exists | USWDS component wrapper in `packages/styles` |
| React 18/19 | Already peer dependency | Declared in `packages/react/package.json` |

## Best Practices

- **Follow Card component pattern**: Structure, prop handling (`className`, `...rest` spread), empty state avoidance, and TypeScript typing conventions.
- **Follow Button story pattern**: `satisfies Meta<typeof AppShell>`, `tags: ['autodocs']`, Playground with controls, fixed-variant stories, interaction tests with `@storybook/test`, accessible queries.
- **Accessible queries**: Use `getByRole`, `getByLabelText`, `getByText` in story interaction tests. Do not use `getByTestId` or CSS selectors.
- **No wrapper-only styling**: Every visible class name in the React output must map to a documented BEM class in the styles contract.
- **Package verification**: Run `pnpm pack --dry-run` from `packages/react` before marking complete.