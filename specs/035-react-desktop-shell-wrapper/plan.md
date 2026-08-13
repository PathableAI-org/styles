# Implementation Plan: React Desktop Shell Wrapper

**Branch**: `035-react-desktop-shell-wrapper` | **Date**: 2026-08-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/speckit-specify`

## Technical Context

**Package**: `packages/react`
**Target**: `src/components/AppShell/AppShell.tsx` (new file)
**Scope**: React wrapper over the existing `pathable-app-shell` styles contract in `packages/styles`
**Framework**: React 18/19, TypeScript 5.7+
**Package Manager**: pnpm, ESM workspace (`"type": "module"`)
**Dependencies**: `@pathableai/styles` (workspace:`*` — runtime dependency, already declared)

The owning styles contract exists at:
- `packages/styles/src/pathable-component-wrappers/pathable-app-shell-layout.scss` — grid layout, sidebar, topbar, content, notification, mobile-responsive breakpoints, forced-colors, reduced-motion
- `packages/styles/src/pathable-component-wrappers/pathable-bottom-navigation.scss` — mobile bottom nav bar with safe-area, 5 destinations

The React wrapper follows the same component pattern established by `Card`, `Button`, and other existing wrappers:
- CamelCase name (`AppShell` from `pathable-app-shell`)
- No index.ts re-export file — direct import from `./components/AppShell/AppShell.js`
- Props map to BEM classes from the styles contract
- Side-effect CSS import through the barrel `src/index.ts`
- Stories in `packages/react/src/stories/components/AppShell/AppShell.stories.tsx`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I — @pathable/styles Is the Authoritative Workspace
- [x] The `pathable-app-shell` and `pathable-bottom-navigation` contracts already exist in `packages/styles` (from spec #017).
- [x] No new visual contract, token, or component-class behavior is being defined in the wrapper.
- [x] FR-017 explicitly prohibits wrapper-only visual variants.

### Principle IV — Wrapper Packages Preserve Semantic and Visual Parity
- [x] Component name follows CamelCase rule: `pathable-app-shell` → `AppShell`.
- [x] Sub-component: `pathable-app-shell__nav-item` → `AppShellNavItem`.
- [x] Semantic HTML (aside, nav, main, header), accessibility behavior, class contracts, design tokens preserved.
- [x] FR-002 requires mapping to existing styles contract.

### Principle V — Consumer Imports Must Be Complete
- [x] `@pathableai/styles` is already a runtime dependency of `packages/react`.
- [x] The barrel `src/index.ts` already imports `@pathableai/styles` as a side-effect.
- [x] FR-013 requires transitive styling availability.

### Principle X — Accessibility Is a Release Requirement
- [x] Skip link (FR-009), focus order (FR-010), active-state cues (FR-011), forced-colors and reduced-motion (FR-012) already provided by the styles contract.
- [x] FR-015 requires interaction tests for keyboard accessibility.
- [x] SC-007 requires automated rendered accessibility checks.

### Principle XIV — Storybook Stories Are Executable Component Contracts
- [x] FR-014 requires 5+ configurations: desktop shell, mobile shell, fixed sidebar, wide content, composition.
- [x] FR-015 requires interaction tests for skip link, active item focus, responsive layout switching.
- [x] SC-005 requires keyboard interaction test coverage.

### Principle XV — Responsive and Inclusive States Are First-Class
- [x] Desktop/mobile breakpoint behavior is inherited from the styles contract (1024px).
- [x] Mobile viewport story requirements in SC-004.
- [x] Forced-colors and reduced-motion handled by styles contract (FR-012).

### Principle XVI — Framework Storybooks Must Remain Independently Valid
- [x] React Storybook builds and tests independently via `pnpm docs:react` / `pnpm test:storybook-react`.
- [x] No cross-framework story dependencies introduced.

### Lint Enforcement
- [x] FR-018 prohibits disabling, weakening, skipping, or silencing lint checks.

**Gate Result**: ALL PASS. No violations. Proceed to Phase 0.

## Phase 0: Research

All unknowns are resolved from existing repository context — no external research needed:

| Research Item | Resolution |
|---|---|
| Component name | `AppShell` — follows CamelCase rule: strip `pathable-` prefix, convert remaining to CamelCase |
| Sub-component name | `AppShellNavItem` — follows same convention for `pathable-app-shell__nav-item` |
| Styles contract location | `packages/styles/src/pathable-component-wrappers/pathable-app-shell-layout.scss` (218 lines) and `pathable-bottom-navigation.scss` (158 lines) |
| BEM class names to apply | `pathable-app-shell`, `pathable-app-shell__sidebar`, `pathable-app-shell__sidebar--fixed`, `pathable-app-shell__brand`, `pathable-app-shell__nav`, `pathable-app-shell__nav-item`, `pathable-app-shell__nav-item--active`, `pathable-app-shell__account`, `pathable-app-shell__topbar`, `pathable-app-shell__topbar-title`, `pathable-app-shell__content`, `pathable-app-shell__content--standard`, `pathable-app-shell__content--wide`, `pathable-app-shell__notification` |
| Skip link | Uses existing `pathable-skipnav` from `packages/styles` |
| Bottom navigation | Uses existing `pathable-bottom-navigation` BEM classes |
| Story location | `packages/react/src/stories/components/AppShell/` (new directory, matches `AppShell` component name) |
| Barrel export | Add to `packages/react/src/index.ts`: `export { AppShell } from './components/AppShell/AppShell.js'` and `export { AppShellNavItem } from './components/AppShell/AppShellNavItem.js'` |
| React naming parity | `pathable-app-shell` → `AppShell` ✓ per constitution IV |
| Styles import mechanism | `import '@pathableai/styles'` already in barrel; no additional CSS import needed in component file |
| Package contents verification | `pnpm pack --dry-run` in `packages/react` confirms transitive CSS |

**Output**: `research.md` captures these resolutions.

## Phase 1: Design & Contracts

### Data Model

**Entities from spec**:
| Entity | React Representation | Key Attributes |
|---|---|---|
| AppShell | `<AppShell>` component | `sidebarFixed`, `contentWidth`, `topBarTitle`, `bottomNavItems`, `notification` |
| AppShellNavItem | `<AppShellNavItem>` component | `href`, `active`, `className`, `children` |
| Sidebar | Props region | brand, nav items, account context — children of sidebar |
| Mobile Top Bar | `topBarTitle` prop | string rendered into `pathable-app-shell__topbar-title` |
| Mobile Bottom Navigation | `bottomNavItems` prop | Array of `{label, icon, href, active}` |
| Main Content | `children` prop | rendered inside `pathable-app-shell__content` |
| Skip Link | Built-in | uses `pathable-skipnav` class, targets `#main-content` |

**Output**: `data-model.md`

### Component API Contract

**AppShell Props**:
| Prop | Type | Required | Description | Maps to |
|---|---|---|---|---|
| `children` | `ReactNode` | Yes | Main content area | `pathable-app-shell__content` |
| `sidebarBrand` | `ReactNode` | No | Brand content in sidebar | `pathable-app-shell__brand` |
| `sidebarNav` | `ReactNode` | No | Navigation items (typically AppShellNavItem) | `pathable-app-shell__nav` |
| `sidebarAccount` | `ReactNode` | No | Account context in sidebar footer | `pathable-app-shell__account` |
| `sidebarFixed` | `boolean` | No | Fixed sidebar positioning (default: sticky) | `pathable-app-shell__sidebar--fixed` |
| `topBarTitle` | `string` | No | Title shown in mobile top bar | `pathable-app-shell__topbar-title` |
| `bottomNavItems` | `BottomNavItem[]` | No | Mobile bottom navigation destinations | `pathable-bottom-navigation` |
| `contentWidth` | `'standard' \| 'wide'` | No | Content max-width (default: standard) | `pathable-app-shell__content--standard` / `--wide` |
| `notification` | `ReactNode` | No | Global notification layer content | `pathable-app-shell__notification` |
| `className` | `string` | No | Additional CSS classes | merged with base class |
| `...rest` | `HTMLAttributes` | No | Pass-through attributes | spread on root div |

**BottomNavItem**:
| Field | Type | Required | Description |
|---|---|---|---|
| `label` | `string` | Yes | Display label for the destination |
| `icon` | `ReactNode` | Yes | Icon element (SVG) |
| `href` | `string` | Yes | Navigation target URL |
| `active` | `boolean` | No | Whether this destination is active |

**AppShellNavItem Props**:
| Prop | Type | Required | Description | Maps to |
|---|---|---|---|---|
| `children` | `ReactNode` | Yes | Link text/label | rendered inside anchor |
| `href` | `string` | Yes | Navigation target | `href` attribute |
| `active` | `boolean` | No | Active state | `pathable-app-shell__nav-item--active` + `aria-current="page"` |
| `className` | `string` | No | Additional CSS classes | merged with base class |
| `...rest` | `AnchorHTMLAttributes` | No | Pass-through attributes | spread on anchor element |

**Output**: `contracts/props.md`

### Quickstart Validation

Validation scenarios to prove the feature works:
1. Render AppShell with sidebar regions, verify BEM classes in DOM
2. Render at narrow viewport, verify top bar visible and sidebar hidden
3. Render with fixed sidebar, verify modifier class applied
4. Render with wide content, verify modifier class applied
5. Verify skip link is first focusable element
6. Verify AppShellNavItem produces correct active markup
7. `pnpm pack --dry-run` confirms transitive CSS presence
8. vite build succeeds without errors

**Output**: `quickstart.md`

## Constitution Check (Post-Design Re-evaluation)

*Re-check after Phase 1 design artifacts are generated.*

### Principle I — @pathable/styles Is the Authoritative Workspace
- [x] All BEM classes in `contracts/props.md` map to documented `pathable-app-shell__*` and `pathable-bottom-navigation__*` elements.
- [x] `data-model.md` confirms no new visual regions or tokens are created.

### Principle IV — Wrapper Packages Preserve Semantic and Visual Parity
- [x] `AppShell` name confirmed: `pathable-app-shell` → strip `pathable-` → `app-shell` → CamelCase `AppShell`.
- [x] `AppShellNavItem` name confirmed: same convention.
- [x] Semantic HTML preserved: `<aside>`, `<nav>`, `<main>`, `<header>`, `<a>` — all matching the styles contract's documented markup.

### Principle V — Consumer Imports Must Be Complete
- [x] `research.md` D6: No direct CSS import in component files — barrel `src/index.ts` already imports `@pathableai/styles`.
- [x] `quickstart.md` VS-07 confirms package contents verification via `pnpm pack --dry-run`.

### Principle X — Accessibility Is a Release Requirement
- [x] Skip link always rendered (research.md D4), targets `#main-content`.
- [x] `aria-current="page"` on active nav items (props contract).
- [x] `aria-label="Primary"` on bottom navigation (props contract).
- [x] `aria-hidden="true"` on icons in bottom nav (props contract).
- [x] `pathable-skipnav` provides built-in focus visibility.

### Principle XIV — Storybook Stories Are Executable Component Contracts
- [x] `research.md` D7: Story locations and types planned.
- [x] `quickstart.md` VS-01 through VS-11 define validation scenarios that prove each story type.

### Principle XV — Responsive and Inclusive States Are First-Class
- [x] Desktop/mobile switching via CSS breakpoint — no React-side breakpoint logic needed.
- [x] `quickstart.md` VS-02 tests mobile viewport.
- [x] Forced-colors and reduced-motion covered by styles contract (FR-012).

### Principle XVI — Framework Storybooks Must Remain Independently Valid
- [x] React Storybook builds independently via `pnpm docs:react`.

### Lint Enforcement
- [x] FR-018 preserved in all design artifacts.

**Post-Design Gate Result**: ALL PASS. No violations introduced by design decisions.

## Design Artifacts

- [x] Research decisions: `./research.md`
- [x] Data model: `./data-model.md`
- [x] Component API contract: `./contracts/props.md`
- [x] Validation path: `./quickstart.md`

## Mandatory Post-Execution Hooks

Check `.specify/extensions.yml` for `hooks.after_plan`:
- `speckit.git.commit` (optional): Auto-commit after implementation planning
- `speckit.agent-context.update` (disabled): skipped

## Completion Report

**Branch**: `035-react-desktop-shell-wrapper`

**Generated Artifacts**:
- `specs/035-react-desktop-shell-wrapper/plan.md` (this file)
- `specs/035-react-desktop-shell-wrapper/research.md`
- `specs/035-react-desktop-shell-wrapper/data-model.md`
- `specs/035-react-desktop-shell-wrapper/contracts/props.md`
- `specs/035-react-desktop-shell-wrapper/quickstart.md`
- `AGENTS.md` (updated plan reference)

**Readiness**: Ready for `/speckit-tasks`.