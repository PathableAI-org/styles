# Research: Responsive Application Shell Pattern

## Research Topics

### 1. CSS Grid Application Shell Layout

**Decision**: Use CSS Grid for the top-level shell layout with named template areas for desktop (sidebar + content) that collapse to a single column on mobile.

**Rationale**: CSS Grid provides a clean way to define the shell's region layout with `grid-template-areas`, making the responsive reflow from desktop sidebar to mobile top-bar+content explicit. The existing `pathable-sidebar-layout.scss` already uses CSS Grid for sidebar+content, confirming this pattern is established in the project. Using `grid-template-areas` is more declarative than nested flex containers for the multi-region shell.

**Alternatives considered**:
- Absolute/fixed positioning: Fragile, harder to maintain responsive reflow, and complicates focus order management.
- Flexbox alone: Works for simple sidebars but becomes unwieldy with multiple regions (sidebar, brand, nav, account, mobile bars, content, overlays).
- Nested framework layout (e.g., USWDS grid): Introduces unnecessary dependency on USWDS grid classes for framework-neutral shell.

### 2. Sidebar Width and Behavior

**Decision**: Sidebar uses a fixed width of 280px (via CSS custom property `--pathable-app-shell-sidebar-width`) on desktop, with independent vertical scrolling when content overflows.

**Rationale**: 280px is a common sidebar width that accommodates brand lockup, navigation labels, and account summary without being too wide. Making it a CSS custom property allows consuming applications to customize it. Independent scrolling via `overflow-y: auto` inside the sidebar ensures long navigation lists don't push account context off-screen.

**Alternatives considered**:
- Percentage-based width: Less predictable across viewport sizes and content lengths.
- Min-content / auto: Can cause layout shifts when navigation labels vary in length.
- Fixed sidebar (all content scrolls behind): Covered as an option via FR-002 but independent scrolling is the default.

### 3. Mobile Bottom Navigation Safe-Area Padding

**Decision**: Use `padding-bottom: env(safe-area-inset-bottom, 0px)` on the bottom navigation bar, applied via CSS custom property.

**Rationale**: `env(safe-area-inset-bottom)` is the standard CSS approach for devices with home indicators (iPhone X+, modern Android). Setting it via a custom property (`--pathable-app-shell-bottom-nav-safe-area`) allows consuming applications to override or disable it. The fallback to `0px` ensures graceful degradation on devices without safe areas.

**Alternatives considered**:
- JavaScript detection: Violates FR-012 (no JavaScript).
- Fixed 34px padding: Hardcoded value would be wrong for many devices.
- `constant(safe-area-inset-bottom)` (legacy WebKit): No longer needed in modern browsers; `env()` covers all current targets.

### 4. Breakpoint Strategy

**Decision**: Use the same breakpoints as the existing project utility system: desktop at 1024px (`max-width: 1023px` for the mobile rule), with no intermediate "tablet" breakpoint for the shell itself (the transition from sidebar to top-bar is a single binary switch).

**Rationale**: The existing codebase consistently uses 1024px as the desktop boundary (see `pathable-sidebar-layout.scss` using `max-width: 1023px`, utility breakpoints defined at `mobile-lg: 480px`, `tablet: 640px`, `desktop: 1024px`). A single breakpoint at 1024px simplifies the shell — below that, the sidebar is hidden and replaced by mobile top-bar + optional bottom navigation. Consumers can independently use tablet-responsive utilities within the main content area.

**Alternatives considered**:
- Three breakpoints (mobile, tablet, desktop): Adds complexity with minimal benefit for a shell pattern. Tablets in landscape (1024px+) already show the desktop shell. Tablets in portrait can use mobile shell.
- Container queries: Not yet broadly supported enough for a framework-neutral pattern.

### 5. Active Navigation Differentiation

**Decision**: Active navigation items use color PLUS an inset marker (left border in the sidebar, top border or background shape in bottom nav) combined with font-weight change.

**Rationale**: The spec requires at least two cues beyond color alone (FR-007). An inset left border on the sidebar active item (2px solid `--pathable-color-accent`) plus heavier font weight (`font-weight: 700`) satisfies this requirement. The inset border visually connects the active item to the sidebar edge, a pattern familiar in USWDS `usa-sidenav`.

**Alternatives considered**:
- Background color change only: Insufficient — relies on color alone.
- Icon change only: Requires consumers to supply different icons for active/inactive states, adding markup burden.
- Underline: Works but can be confused with text links in the content area.

### 6. Skip Link Integration

**Decision**: The shell documentation directs consumers to use the existing `pathable-skipnav` class (wraps USWDS `usa-skipnav`) targeting the main content region. The shell provides the styles for the skip link target region but does not reimplement the skip link component.

**Rationale**: The project already has a working skip navigation component (`pathable-skipnav.scss` wrapping USWDS skipnav). Reusing it avoids code duplication and ensures consistent skip link behavior across all PathAble patterns. The shell's responsibility is to ensure the skip link target (`id="main-content"` or similar) is in the correct DOM position.

**Alternatives considered**:
- Building a new skip link: Duplicates existing functionality.
- Inline skip link within shell CSS: Breaks separation of concerns — the shell is a layout pattern, not a component library.

### 7. Forced-Colors Mode

**Decision**: Every navigation region and active state indicator uses `@media (forced-colors: active)` blocks with system colors (`CanvasText`, `Highlight`, `ButtonText`) to preserve boundaries and active state visibility.

**Rationale**: The project's existing patterns (e.g., `pathable-surface.scss`) already implement forced-colors mode using this approach. Using `Highlight` for focus outlines and `CanvasText` for region boundaries follows both WCAG guidance and established project conventions.

**Alternatives considered**:
- Relying on browser defaults: Insufficient — many forced-colors mode issues involve lost boundaries on custom-styled elements.
- Using `forced-color-adjust: none`: Violates user preference and fails WCAG.

### 8. File Organization and Bundle Structure

**Decision**: Create two new SCSS files (`pathable-app-shell-layout.scss` for the shell layout, `pathable-bottom-navigation.scss` for the mobile bottom nav) plus a new bundle package `pathable-app-shell.scss` that forwards both. Update the navigation bundle (`pathable-navigation.scss`) to include the new shell files.

**Rationale**: The Issue #31 suggested outputs align with the project's file-per-component pattern. The shell layout and bottom navigation have different responsibilities and may be independently imported. Adding them to the navigation bundle is logical since both are navigation/layout patterns. The all-in-one entry point (`pathable-all.scss`) picks them up automatically.

**Alternatives considered**:
- Single file: Would prevent selective imports (FR-013).
- Adding to layout bundle: The shell is primarily a navigation pattern (it structures navigation regions), not a generic layout utility like `pathable-container`.