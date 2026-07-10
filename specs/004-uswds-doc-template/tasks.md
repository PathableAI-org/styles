# Tasks: USWDS Documentation Page Template for Astro Docs

**Input**: Design documents from `/specs/004-uswds-doc-template/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No explicit test tasks generated — this feature uses manual visual verification per the plan and spec.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1](#phase-3-user-story-1---developer-browses-documentation-with-uswds-inspired-layout-priority-p1)
- [Phase 4: User Story 2](#phase-4-user-story-2---developer-verifies-uswds-token-output-through-component-rendering-priority-p1)
- [Phase 5: User Story 3](#phase-5-user-story-3---maintainer-validates-responsive-layout-priority-p2)
- [Phase 6: Polish](#phase-6-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)

## Format: `[ID] [P?] [Story] Description`

- **[ID]** is a unique task identifier
- **[P]** indicates the task can run in parallel with other [P] tasks in the same phase
- **[P1/P2/P3]** indicates priority level
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- **Status**: `[ ]` = pending, `[x]` = completed
- Include exact file paths in descriptions

---

## Phase 1: Setup — Shared Infrastructure

> **Goal**: Configure the docs site project with Google Fonts, Starlight component overrides, and base token infrastructure.

### T001 [P1] Add Google Fonts loading for Fredoka and Nunito in astro.config.mjs

**File**: `apps/docs/astro.config.mjs`
**Action**: Add `head` configuration to the Starlight config to load Google Fonts for Fredoka (heading font) and Nunito (body font). Use `<link>` tags with `preconnect` and `stylesheet` entries.

```js
head: [
  { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
  { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
  { tag: 'link', attrs: { href: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap', rel: 'stylesheet' } },
],
```

- [x] Add Google Fonts preconnect links
- [x] Add Google Fonts stylesheet link for Fredoka + Nunito
- [x] Verify fonts load in browser DevTools

### T002 [P1] Verify Starlight component overrides are configured

**File**: `apps/docs/astro.config.mjs`
**Action**: Confirm the `components` option in the Starlight config already maps `PageFrame` to `./src/components/PageFrame.astro`. No change needed — verify the override is active.

- [x] Confirm `PageFrame` override is already configured
- [x] Verify the file `apps/docs/src/components/PageFrame.astro` exists

---

## Phase 2: Foundational — Blocking Prerequisites

> **Goal**: Establish the CSS foundation that all layout components depend on — prose typography, layout grid styles, and token-based theme variables.

### T003 [P1] Update custom.css with USWDS-inspired prose and layout styles

**File**: `apps/docs/src/styles/custom.css`
**Action**: Add or update CSS rules for:

- **Content prose**: Continue refining `.sl-markdown-content` typography using `--pathable-font-heading` (headings), `--pathable-font-body` (body), `--pathable-color-text`, `--pathable-color-link` — matching the `.usa-prose` pattern from USWDS
- **Layout grid**: Add container and section styles mimicking USWDS `.grid-container`, `.usa-section` using `--pathable-*` tokens
- **Sidebar styling**: Add base styles for the sidebar wrapper that match the `.usa-sidenav` visual pattern using `--pathable-*` tokens
- **Footer region**: Add base styles for the footer region

All styles MUST use `--pathable-*` CSS custom properties per the token-usage contract. No hardcoded color, font, or spacing values.

- [x] Add/update prose typography styles using `--pathable-*` tokens
- [x] Add layout grid and section container styles
- [x] Add sidebar base styles
- [x] Add footer region base styles
- [x] Verify no hardcoded color/font/spacing values in the CSS

---

## Phase 3: User Story 1 — Developer browses documentation with USWDS-inspired layout (Priority: P1) 🎯 MVP

> **Goal**: Deliver the complete USWDS-inspired page layout — fixed header, horizontal nav, sidebar, prose content, footer, and skip-to-content link — so that developers can navigate the docs with a professional, familiar layout.
>
> **Independent Test**: Navigate to any documentation page and verify the layout structure: fixed top header with brand and section links, left sidebar with hierarchical page navigation (desktop), main content area with styled prose, and a footer with return-to-top link and branding.

### Implementation for User Story 1

#### T004 [US1] Create SkipNav.astro component for skip-to-content accessibility

**File**: `apps/docs/src/components/SkipNav.astro`
**Action**: Create a new Astro component that renders a skip-to-main-content link. This is an accessibility link that is visually hidden by default and becomes visible on keyboard focus (first Tab press). It should link to `#main-content`.

- Uses `--pathable-color-focus-ring` for the focus outline
- Visible on focus with a white background
- Uses `position: absolute` / `position: fixed` pattern
- Standard text: "Skip to main content"

- [x] Create `SkipNav.astro` with proper focus-visible styling
- [x] Use `--pathable-color-focus-ring` for focus indicator
- [x] Verify it appears on first Tab press and links to `#main-content`

#### T005 [US1] Update HorizontalNav.astro with USWDS basic header styling

**File**: `apps/docs/src/components/HorizontalNav.astro`
**Action**: Refactor the existing HorizontalNav component to match the USWDS basic header visual pattern:

- Style the nav bar with `--pathable-color-surface` background, `--pathable-color-border` bottom border, and subtle `--elevation-sm` shadow
- Style nav links with `--pathable-color-text` default color and `--pathable-color-text` for hover
- Style the active nav item with `--pathable-color-accent` bottom border (current indicator)
- Style the site title/logo area within the nav using `--pathable-font-heading`
- Use `--pathable-font-body` for nav link text
- Keep the existing functionality (current page detection, nav items from config)

- [x] Update nav bar background to `var(--pathable-color-surface)`
- [x] Update nav bar bottom border to `var(--pathable-color-border)`
- [x] Add `--elevation-sm` box-shadow
- [x] Update nav link colors to `var(--pathable-color-text)`
- [x] Update active nav indicator to `var(--pathable-color-accent)`
- [x] Update site title font to `var(--pathable-font-heading)`
- [x] Update nav link font to `var(--pathable-font-body)`

#### T006 [US1] Update PageFrame.astro with USWDS-inspired layout structure

**File**: `apps/docs/src/components/PageFrame.astro`
**Action**: Restructure the PageFrame component to implement the USWDS documentation page template layout (top-to-bottom):

1. **SkipNav** — rendered at the very top of the page
2. **Header slot** — Starlight's header (brand, search, theme toggle)
3. **HorizontalNav** — primary section links below the header
4. **Body layout** — a flex/grid container with:
   - **Sidebar** (conditional on `hasSidebar`) — Starlight's sidebar slot wrapped in a styled container matching `.usa-layout-docs__sidenav`
   - **Main content** — `<main id="main-content">` wrapping the default slot, with prose styling
5. **Footer** — new DocFooter component (imported, will be created in T008)

Use USWDS grid classes (`.grid-container`, `.grid-row`, `.grid-gap`) for the body layout grid. Style the sidebar wrapper with `--pathable-*` tokens.

**Important**: The Starlight TOC (right sidebar) slot is NOT part of PageFrame — it is injected by Starlight separately. Do not try to add it.

- [x] Import and render SkipNav at the top of the page frame
- [x] Keep the header slot for Starlight header content
- [x] Keep HorizontalNav import and render
- [x] Create body layout with sidebar (conditional) + main content (with `id="main-content"`)
- [x] Import and render DocFooter component (will be created in T008)
- [x] Style sidebar wrapper with `--pathable-*` tokens
- [x] Ensure main content area has proper prose styling
- [x] Verify the layout structure renders correctly

#### T007 [US1] Style Starlight sidebar slot to match USWDS side navigation

**File**: `apps/docs/src/styles/custom.css` (add sidebar styles)
**Action**: Add CSS rules in `custom.css` to style the Starlight sidebar content (passed through the sidebar slot) to match the USWDS `.usa-sidenav` visual pattern:

- Sidebar wrapper: `--pathable-color-surface` background, `--pathable-color-border` border
- Sidebar links: `--pathable-color-text` color, hover state uses `--pathable-color-accent` or a subtle background
- Active/current page link: `--pathable-color-accent` left border indicator, bold weight
- Nested/child links: indented, lower font weight, `--pathable-color-text-muted` color
- Link padding, spacing, and font-family using `--pathable-font-body`

These styles must target the CSS classes that Starlight generates for its sidebar (`li`, `a`, `details`, `summary` elements within the sidebar slot).

- [x] Style sidebar wrapper background and borders
- [x] Style sidebar link colors and hover states
- [x] Style active/current page indicator
- [x] Style nested/child link hierarchy
- [x] Use `--pathable-*` tokens for all values

#### T008 [US1] Create DocFooter.astro component with USWDS medium footer pattern

**File**: `apps/docs/src/components/DocFooter.astro`
**Action**: Create a new Astro component implementing the USWDS medium footer pattern:

Three sections:

1. **Return to top**: A centered link at the top of the footer that scrolls to the top of the page
2. **Primary section**: Navigation links for top-level doc sections (mirroring the HorizontalNav items), displayed in a grid row
3. **Secondary section**: Pathable Styles branding, copyright year, and "Powered by USWDS" attribution

All styling uses `--pathable-*` tokens:

- Background: `--pathable-color-surface`
- Text: `--pathable-color-text`, `--pathable-color-text-muted` for secondary text
- Borders: `--pathable-color-border` for dividers between sections
- Links: `--pathable-color-link` for link colors
- Font: `--pathable-font-body` for all text, `--pathable-font-heading` for the brand name

- [x] Create DocFooter.astro with return-to-top link
- [x] Add primary section with navigation links
- [x] Add secondary section with branding and copyright
- [x] Use `--pathable-*` tokens for all colors, fonts, spacing
- [x] Verify in PageFrame.astro import

**Checkpoint**: At this point, User Story 1 should be fully functional. Navigate to any page and verify the complete layout structure.

---

## Phase 4: User Story 2 — Developer verifies USWDS token output through component rendering (Priority: P1)

> **Goal**: Audit all components to ensure every color, font, spacing, elevation, and radius value references a `--pathable-*` CSS custom property, and that the rendered output matches the expected token values. This serves as the visual test surface for `@pathable/styles`.
>
> **Independent Test**: Inspect the rendered docs page in browser DevTools. Confirm that the page background matches `--pathable-color-bg`, header/surface areas match `--pathable-color-surface`, links match `--pathable-color-link`, active nav items use `--pathable-color-accent`, and headings use `--pathable-font-heading`.

### Implementation for User Story 2

#### T009 [US2] Audit all component styles for `--pathable-*` token compliance

**Files**: `apps/docs/src/components/PageFrame.astro`, `apps/docs/src/components/HorizontalNav.astro`, `apps/docs/src/components/DocFooter.astro`, `apps/docs/src/components/SkipNav.astro`, `apps/docs/src/styles/custom.css`
**Action**: Review every `<style>` block in all custom components and `custom.css`. Verify that:

- Every color value references a `--pathable-*` token via `var()`
- Every font-family references `--pathable-font-heading` or `--pathable-font-body`
- Every spacing value references `--space-*` tokens
- Every elevation references `--elevation-*` tokens
- Every radius references `--radius-*` tokens

**Allowed exceptions**: `transparent`, `currentColor`, `inherit`, `initial`, `unset`, `rgba(0,0,0,X)` for overlay, `vw`/`vh` for full-screen elements, and pixel values for `max-width` (readability constraint).

- [x] Audit PageFrame.astro styles — no hardcoded values
- [x] Audit HorizontalNav.astro styles — no hardcoded values
- [x] Audit DocFooter.astro styles — no hardcoded values
- [x] Audit SkipNav.astro styles — no hardcoded values
- [x] Audit custom.css styles — no hardcoded values
- [x] Document any exceptions with their rationale

#### T010 [US2] Verify token values in browser DevTools

**Action**: Run the docs dev server and inspect each layout region in browser DevTools. Verify computed style values match the expected token values from the token-usage contract.

| Region | Token | Expected Value | Actual |
| --- | --- | --- | --- |
| Page background | `--pathable-color-bg` | `#dfe1e2` | `[ ] verify` |
| Header background | `--pathable-color-surface` | `#ffffff` | `[ ] verify` |
| Body text | `--pathable-color-text` | `#162e51` | `[ ] verify` |
| Links | `--pathable-color-link` | `#58b4ff` | `[ ] verify` |
| Active nav accent | `--pathable-color-accent` | `#1dc2ae` | `[ ] verify` |
| Focus ring | `--pathable-color-focus-ring` | `#2491ff` | `[ ] verify` |
| Borders | `--pathable-color-border` | `#dfe1e2` | `[ ] verify` |
| Heading font | `--pathable-font-heading` | Fredoka | `[ ] verify` |
| Body font | `--pathable-font-body` | Nunito | `[ ] verify` |

- [x] Verify all token values in browser DevTools
- [x] Fix any discrepancies found

#### T011 [US2] Add `usa-*` utility classes for grid layout where needed

**Files**: `apps/docs/src/components/PageFrame.astro`
**Action**: Where the USWDS layout grid is used (`.grid-container`, `.grid-row`, `.grid-gap`), verify these classes are available and resolve correctly. The `@pathable/styles` package includes USWDS as a transitive dependency, so these utility classes should be available. If they are not available, add the USWDS CSS import to the docs site.

- [x] Verify `.grid-container`, `.grid-row`, `.grid-gap` classes resolve
- [x] If not available, add USWDS CSS import in `custom.css`

**Checkpoint**: At this point, User Stories 1 AND 2 should both be verified. All layout regions render with correct token values.

---

## Phase 5: User Story 3 — Maintainer validates responsive layout (Priority: P2)

> **Goal**: Ensure the page layout adapts correctly across mobile, tablet, and desktop viewports — sidebar visibility, nav wrapping, content width, and fixed positioning all behave as expected.
>
> **Independent Test**: Resize the browser viewport and verify that at < 640px the sidebar is hidden behind a menu toggle, at 640-1024px the layout is single-column, and at > 1024px the sidebar is visible as a left column alongside the content.

### Implementation for User Story 3

#### T012 [US2] Add responsive sidebar visibility and mobile menu toggle

**Files**: `apps/docs/src/styles/custom.css`, `apps/docs/src/components/PageFrame.astro`
**Action**: Implement responsive sidebar behavior:

- **Desktop (>= 1024px)**: Sidebar visible as a left column (roughly 3/12 width), content takes remaining width
- **Mobile (< 1024px)**: Sidebar hidden behind the Starlight mobile menu toggle button
- Use the existing `MobileMenuToggle` import from `virtual:starlight/components/MobileMenuToggle` (already in PageFrame)
- Style the mobile menu overlay with a semi-transparent background (`rgba(0, 0, 0, 0.5)` — overlay exception allowed per contract)
- Ensure the sidebar panel slides in from the left on mobile when toggled

- [x] Add desktop breakpoint styles for sidebar (>= 1024px, fixed width column)
- [x] Add mobile breakpoint styles for sidebar (< 1024px, hidden behind toggle)
- [x] Style mobile menu overlay background
- [x] Verify sidebar panel slides in correctly on mobile toggle
- [x] Verify sidebar visibility toggling works on mobile

#### T013 [US2] Ensure header and horizontal nav remain fixed on scroll

**Files**: `apps/docs/src/styles/custom.css`, `apps/docs/src/components/PageFrame.astro`
**Action**: Verify that the header and horizontal nav remain fixed at the top when the page scrolls:

- Header: `position: fixed` at top (already set by Starlight — verify)
- HorizontalNav: `position: fixed` below the header (already set — verify)
- Content area: has appropriate `padding-top` to account for the fixed header + nav height
- The `--sl-nav-height` + `--sl-horizontal-nav-height` CSS variables should be used for offset calculations

- [x] Verify header is fixed at top
- [x] Verify HorizontalNav is fixed below header
- [x] Verify content padding-top accounts for both fixed elements
- [x] Test scroll behavior on pages with long content

#### T014 [US2] Add responsive navigation wrapping for narrow viewports

**File**: `apps/docs/src/components/HorizontalNav.astro`
**Action**: Ensure the horizontal nav items wrap or collapse appropriately on narrow viewports (under 640px):

- Add `overflow-x: auto` with touch scrolling for the nav items
- Ensure nav items don't overflow the viewport
- Optionally reduce font size and padding on mobile
- Test at 320px viewport width — no horizontal overflow

- [x] Add horizontal scroll for nav items on narrow viewports
- [x] Reduce font size/padding on mobile if needed
- [x] Test at 320px width — no overflow

#### T015 [US2] Test responsive behavior at USWDS standard breakpoints

**Action**: Test the complete layout at each USWDS standard breakpoint:

- **Mobile (< 640px)**: Sidebar hidden, nav items scroll horizontally, content full-width
- **Tablet (640-1024px)**: Sidebar hidden, nav items visible, content full-width
- **Desktop (1024-1280px)**: Sidebar visible, content constrained
- **Widescreen (> 1280px)**: Sidebar visible, content at max readability width

- [x] Test at 320px width
- [x] Test at 640px width
- [x] Test at 1024px width
- [x] Test at 1280px width
- [x] Fix any layout issues found

**Checkpoint**: All user stories should now be independently functional and responsive.

---

## Phase 6: Polish — Cross-Cutting Concerns

> **Goal**: Complete documentation, accessibility validation, and final cleanup.

### T016 [P] Add ARIA labels and accessibility attributes to navigation components

**Files**: `apps/docs/src/components/HorizontalNav.astro`, `apps/docs/src/components/PageFrame.astro`
**Action**: Ensure all navigation elements have proper ARIA labels:

- The horizontal nav should have `aria-label="Primary navigation"` or similar
- The sidebar nav should have `aria-label="Secondary navigation"` or similar
- The mobile menu toggle should have `aria-expanded` and `aria-controls` attributes
- The footer nav should have `aria-label="Footer navigation"`

- [x] Add ARIA labels to HorizontalNav
- [x] Add ARIA labels to sidebar wrapper
- [x] Add ARIA attributes to mobile menu toggle
- [x] Add ARIA labels to footer nav

### T017 [P] Run quickstart.md validation checklist

**File**: `specs/004-uswds-doc-template/quickstart.md`
**Action**: Execute every item in the quickstart validation checklist:

- [x] Layout Structure verification (7 items)
- [x] Token Compliance verification (9 items)
- [x] Responsive Behavior verification (4 items)
- [x] Accessibility verification (4 items)
- [x] Build verification: `cd apps/docs && pnpm build` succeeds

### T018 [P] Build and verify the docs site

**File**: Terminal
**Action**: Run a clean build of the docs site and verify no errors:

```bash
cd apps/docs
pnpm build
```

- [x] Build succeeds with no errors
- [x] Preview the built site with `pnpm preview`
- [x] Verify all pages render correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 completion
- **Phase 3 (US1, P1)**: Depends on Phase 2 completion — this is the MVP
- **Phase 4 (US2, P1)**: Depends on Phase 3 completion (audits the components built in Phase 3)
- **Phase 5 (US3, P2)**: Depends on Phase 3 completion (adds responsive behavior to components)
- **Phase 6 (Polish)**: Depends on Phase 3-5 completion

### User Story Dependencies

- **User Story 1 (P1)**: Foundation of all layout components — no dependencies on other stories
- **User Story 2 (P1)**: Depends on US1 (audits token usage in US1 components). Can partially parallelize with US1 (token audit plan can be prepared while US1 is being implemented)
- **User Story 3 (P2)**: Depends on US1 (adds responsive behavior to US1 components). No dependency on US2.

### Within Each Phase

- Tasks marked [P] can run in parallel (different files, no dependencies)
- Sequential tasks within a phase must be completed in order

### Parallel Opportunities

| Phase | Tasks | Parallel Opportunities |
| --- | --- | --- |
| Phase 1 | T001, T002 | T001 and T002 can run in parallel (different concerns) |
| Phase 2 | T003 | Single file — serial |
| Phase 3 | T004-T008 | T004, T005, T008 can run in parallel (new files, different components). T006 (PageFrame) depends on T005 and T008 being available. T007 can run in parallel with all. |
| Phase 4 | T009-T011 | T009 depends on all Phase 3 components being built. T010 can run in parallel with T009. T011 can run independently. |
| Phase 5 | T012-T015 | T012, T013 can run in parallel. T014 depends on T013. T015 is manual testing. |
| Phase 6 | T016-T018 | All can run in parallel. |

### Parallel Example: User Story 1

```bash
# Launch these in parallel (new components, no shared files):
Task: "Create SkipNav.astro in apps/docs/src/components/SkipNav.astro"
Task: "Update HorizontalNav.astro in apps/docs/src/components/HorizontalNav.astro"
Task: "Create DocFooter.astro in apps/docs/src/components/DocFooter.astro"

# After T005 completes, update PageFrame (depends on T005, T008):
Task: "Update PageFrame.astro in apps/docs/src/components/PageFrame.astro"

# Can run in parallel with T006:
Task: "Style Starlight sidebar via custom.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (font loading, config verification)
2. Complete Phase 2: Foundational (custom.css prose styling)
3. Complete Phase 3: User Story 1 (layout components)
4. **STOP and VALIDATE**: Test User Story 1 independently — navigate pages, verify layout structure
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → CSS foundation ready
2. Add User Story 1 (layout components) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (token audit) → Test independently → Deploy/Demo
4. Add User Story 3 (responsive) → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Complete Phase 1 + Phase 2 together
2. Phase 3 (US1): Developer A works on SkipNav (T004) + HorizontalNav (T005), Developer B works on DocFooter (T008) + sidebar styles (T007), then both collaborate on PageFrame (T006)
3. Phase 4 (US2): Developer A audits styles (T009), Developer B verifies tokens (T010)
4. Phase 5 (US3): Developer A handles responsive layout (T012-T013), Developer B handles nav wrapping (T014)
5. Phase 6: Polish tasks distributed

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All component `<style>` blocks MUST use `--pathable-*` tokens — no hardcoded values
- Government-specific USWDS elements (`.usa-banner`, `.usa-identifier`) are excluded
- The Starlight TOC (right sidebar) and search are preserved as-is
||||||| d6da715d
