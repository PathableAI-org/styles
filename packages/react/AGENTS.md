# Agent Instructions For PathAble React

Use these rules when creating or editing React UI that should follow the PathAble design system.

## Required Source Of Truth

Agents MUST use components from `@pathableai/react` for PathAble UI.

Agents MUST follow the brand and styling rules in `@pathableai/styles` (`AGENTS.md` and `BRAND_RULES.md`).

Agents MUST NOT recreate PathAble components with raw HTML and `.usa-*` or `.pathable-*` classes when a React wrapper exists in this package.

Agents MUST NOT hardcode brand colors or typography when a semantic token, theme token, or component prop already expresses the intent.

Agents MUST NOT import private package paths such as `dist/*` or `src/*`; import only from `@pathableai/react`.

## Package Setup

Install and import components from the public entry point:

```tsx
import { Button, Card, ThemeProvider, createTheme } from '@pathableai/react'
```

`@pathableai/react` automatically imports the structural stylesheet layers from `@pathableai/styles` (`components` and `utilities`). It does **not** import the default theme token layer.

Agents MUST choose one of these stylesheet strategies at the application boundary:

| Strategy        | When to use                      | Required imports                                                                                       |
| --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Provider-driven | Custom theme via `ThemeProvider` | `import { ThemeProvider, createTheme } from '@pathableai/react'` only                                  |
| Default tokens  | Keep shipped default colors      | Also add `import '@pathableai/styles'` or `import '@pathableai/styles/theme'` once at the app boundary |
| Structural only | Rare; tokens supplied elsewhere  | Rely on the React package entry side effects only                                                      |

Agents MUST NOT expect default color tokens when importing only `@pathableai/react` without also importing `@pathableai/styles` or `@pathableai/styles/theme`.

## Component Selection Rules

Agents MUST prefer existing package components before composing new ones.

Agents SHOULD use layout primitives (`Stack`, `Inline`, `Cluster`, `Container`, `Surface`, `Page`, `SplitLayout`, `SidebarLayout`, `CardGrid`, `AppShell`) to structure pages instead of ad-hoc flex/grid markup.

Agents SHOULD use form primitives (`Form`, `FormGroup`, `FormStack`, `Fieldset`, `Label`, `Hint`, `ErrorMessage`, plus the control wrappers) instead of unstyled native controls with manual PathAble classes.

Agents SHOULD use communication components (`Alert`, `Banner`, `Modal`, `Toast`, `Loading`, `EmptyState`, `PageError`, `Skeleton`, `SiteAlert`, `StepIndicator`, `SummaryBox`, `ProcessList`, `Accordion`) for status, feedback, and disclosure patterns.

Agents MUST NOT use `Button`, `Link`, or `IconButton` for unrelated navigation when a dedicated navigation component (`Header`, `Breadcrumb`, `Pagination`, `Sidenav`, `Skipnav`) fits the pattern.

Agents MUST NOT use `SegmentedControl` for navigation, unrelated actions, or option sets larger than about five short choices; use `Select`, radio groups, or navigation components instead.

## Component Catalog

All components below are exported from `@pathableai/react`. Detailed prop tables and examples live in `README.md`. Storybook stories under `packages/react/src/stories/` are executable specifications.

### Theming

| Export                                                            | Use when                                              |
| ----------------------------------------------------------------- | ----------------------------------------------------- |
| `ThemeProvider`                                                   | Scoping custom semantic color tokens to a subtree     |
| `createTheme`                                                     | Building a typed partial theme merged with defaults   |
| `defaultTheme`                                                    | Reading the full default token object                 |
| `themeColorToken`                                                 | Mapping a camelCase theme key to `--pathable-color-*` |
| `ThemeColors`, `ThemeConfig`, `ThemeProviderProps`, `ColorScheme` | Typing theme-aware application code                   |
| `TextTone`, `SurfaceTone`, `BorderTone`, `SurfaceElevation`       | Typing semantic tone and elevation props              |

Canonical theming docs: `docs/theming/consumer-guide.md` and `docs/theming/token-vocabulary.md`.

### Layout And Shell

| Component         | Use when                                                         | Notes                                                                   |
| ----------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `Container`       | Constraining content width                                       | `size`: `standard`, `wide`, `full`                                      |
| `Surface`         | Semantic surface, border, elevation, and outer spacing           | Supports `variant`, `borderTone`, `elevation`, sizing, and margin props |
| `Stack`           | Vertical rhythm between children                                 | Supports `gap`, sizing, and margin props                                |
| `Inline`          | Horizontal row of items with wrapping                            | Supports `gap`, sizing, and margin props                                |
| `Cluster`         | Grouped controls or chips with wrapping                          | Supports `gap`, sizing, and margin props                                |
| `Page`            | Page-level padding and max width                                 | `size`, `gap`                                                           |
| `SplitLayout`     | Two-column responsive layout                                     | `ratio`, `align`                                                        |
| `SidebarLayout`   | Main content beside a sidebar                                    | `ratio`                                                                 |
| `CardGrid`        | Responsive card collections                                      | `variant`, gap props                                                    |
| `AppShell`        | Application shell with sidebar, top bar, and optional bottom nav | Compose with `AppShellNavItem`                                          |
| `AppShellNavItem` | Sidebar navigation item inside `AppShell`                        |                                                                         |
| `DashboardHeader` | Dashboard page header region                                     |                                                                         |

### Navigation

| Component    | Use when                                    | Notes                                                 |
| ------------ | ------------------------------------------- | ----------------------------------------------------- |
| `Skipnav`    | First focusable bypass link to main content | Point `href` at the main landmark `id`                |
| `Header`     | Primary site header with one-level nav      | Requires `@pathableai/styles/js` once at app boundary |
| `Breadcrumb` | Location trail within a site                | Mark exactly one current item                         |
| `Pagination` | Page-number navigation supplied by the app  | Does not compute pages or handle routing              |
| `Sidenav`    | Persistent section navigation               | Derive `currentId` from routing state                 |

### Content And Data Display

| Component      | Use when                                              | Notes                                                               |
| -------------- | ----------------------------------------------------- | ------------------------------------------------------------------- |
| `Heading`      | Semantic headings with PathAble typography            | Independent level and visual size                                   |
| `Text`         | Body copy with semantic tone                          | `tone`: `default`, `muted`, `danger`, `success`                     |
| `Link`         | Inline or standalone anchors                          | `presentation`: `default`, `external`                               |
| `List`         | Unordered, ordered, or unstyled lists                 | `presentation`, `items`, or composed children                       |
| `Card`         | Grouped content with optional title, footer, or media | `presentation`: `base`, `media`, `flag`, `header-first`, `workflow` |
| `MediaBlock`   | Media beside supporting content                       | Consumer owns media semantics and alt text                          |
| `Table`        | Tabular data                                          | Supply semantic `<thead>`, `<tbody>`, captions, and scopes          |
| `Tag`          | Non-interactive labels                                | `size`: `default`, `big`                                            |
| `ActivityList` | Ordered dashboard activity rows or grouped activity   | Consumer owns data, labels, and actions                             |
| `EmptyState`   | Intentional absence of content                        | `variant`: `no-data`, `no-results`, `setup-required`, `completed`   |
| `PageError`    | Page- or panel-level failure states                   | `layout`, `variant`, optional `retry` and `nav`                     |
| `Skeleton`     | Decorative loading placeholders                       | Always `aria-hidden`; pair with real loading status text            |

### Forms And Input

| Component          | Use when                                                     | Notes                                                                   |
| ------------------ | ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `Form`             | Native form landmark                                         | Does not own submission or validation state                             |
| `FormGroup`        | Visual grouping of label, control, hint, and error           | Not a semantic substitute for `Fieldset`                                |
| `FormStack`        | Vertical spacing between form fields                         | `gap`, `maxWidth`                                                       |
| `Fieldset`         | Related controls with a shared legend                        |                                                                         |
| `Label`            | Visible control labels                                       | Pair with `htmlFor` / control `id`                                      |
| `Hint`             | Supplemental control guidance                                | Reference from control via `aria-describedby`                           |
| `ErrorMessage`     | Validation recovery text                                     | Associate with invalid controls; choose `role`/`aria-live` deliberately |
| `Input`            | Single-line native inputs                                    | Supports `width`, `maxWidth`                                            |
| `Textarea`         | Multi-line text entry                                        | Supports `width`, `maxWidth`                                            |
| `Select`           | Native pick lists                                            | Supports `width`, `maxWidth`                                            |
| `Checkbox`         | Independent or grouped boolean choices                       | Compose related options in a `Fieldset`                                 |
| `Radio`            | Mutually exclusive choices                                   | Share a `name` within a `Fieldset`                                      |
| `Range`            | Numeric slider input                                         | Provide a visible label and current value when precision matters        |
| `Search`           | Search landmark with submit action                           | Does not own query, results, or routing                                 |
| `ComboBox`         | Searchable single-select with many options                   | React-owned behavior; hidden native `<select>` submits value            |
| `DatePicker`       | Single-date input with calendar                              | React-owned behavior; ISO hidden field for forms                        |
| `DateRangePicker`  | Start/end date range                                         | React-owned behavior; ISO hidden fields for forms                       |
| `SegmentedControl` | Two to five short mutually exclusive or multi-select choices | Controlled component; not for navigation                                |

### Actions

| Component     | Use when                                         | Notes                                                       |
| ------------- | ------------------------------------------------ | ----------------------------------------------------------- |
| `Button`      | Primary actions and form submission              | Rich `variant` and `size` set; supports `width`, `maxWidth` |
| `ButtonGroup` | Adjacent related buttons                         |                                                             |
| `IconButton`  | Compact icon-only actions                        | Requires `aria-label` or `aria-labelledby`                  |
| `Icon`        | Decorative or meaningful SVG icons               | Decorative by default (`aria-hidden`)                       |
| `IconTile`    | Non-interactive icon container with status color | Use `IconButton` for actions                                |

### Communication And Feedback

| Component       | Use when                             | Notes                                                         |
| --------------- | ------------------------------------ | ------------------------------------------------------------- |
| `Alert`         | Inline status messages               | `status`, optional `slim`, `heading`                          |
| `Banner`        | Official site banner with disclosure | Controlled/uncontrolled expanded state                        |
| `SiteAlert`     | Site-wide announcements              | `status`, optional `slim`                                     |
| `Modal`         | Focus-trapped dialog                 | Controlled via `open` / `onClose`; portals to `document.body` |
| `Toast`         | Transient notification               | Consumer owns visibility and removal                          |
| `ToastRegion`   | Fixed stacking container for toasts  |                                                               |
| `Loading`       | Inline loading indicator             | Pair with meaningful status text when needed                  |
| `Accordion`     | Expandable disclosure panels         | Controlled/uncontrolled expanded IDs                          |
| `ProcessList`   | Ordered procedural steps             |                                                               |
| `StepIndicator` | Multi-step progress                  | One-based `currentStep`                                       |
| `SummaryBox`    | Key information callout              |                                                               |

## Styling Rules

Each component applies the corresponding `pathable-*` classes automatically. Agents MUST NOT duplicate those base classes in consumer code unless extending with additional utilities.

Agents MUST prefer semantic props over raw utility classes when the component supports them.

Supported semantic prop families:

| Prop family                                                 | Values                                     | Components (current)                                                                     |
| ----------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `width`                                                     | `auto`, `full`                             | `Button`, `Input`, `Select`, `Textarea`, `Card`, `Stack`, `Inline`, `Cluster`, `Surface` |
| `maxWidth`                                                  | `mobile`, `mobile-lg`, `tablet`, `desktop` | Same as `width`                                                                          |
| `padding`, `paddingX`, `paddingY`                           | `0`–`10`, `15`                             | `Card`                                                                                   |
| `margin`, `marginX`, `marginY`, `marginTop`, `marginBottom` | `0`–`10`, `15`                             | `Card`, `Stack`, `Inline`, `Cluster`, `Surface`                                          |
| `tone` / `variant`                                          | `TextTone`, `SurfaceTone`                  | `Text`, `Surface`                                                                        |
| `borderTone`                                                | `default`, `danger`                        | `Surface`                                                                                |
| `elevation`                                                 | verified elevation steps                   | `Surface`                                                                                |

Agents MAY use `className` with `.pathable-*` utility classes when no semantic prop exists. See `docs/capability-inventory.md` and `@pathableai/styles` `AGENTS.md` for the utility catalog.

Agents MUST append consumer `className` values rather than replacing component classes. When both semantic props and `className` are present, the consumer class list comes last in the DOM class attribute.

Agents MUST NOT invent new BEM modifiers on PathAble components.

## Theming Rules

Agents MUST use `createTheme` and `ThemeProvider` to override semantic colors instead of redeclaring `--pathable-color-*` on `:root` in application CSS.

Agents MUST keep theme overrides semantic (`accent`, `surface`, `textMuted`, etc.), not visual descriptions (`prettyBlue`, `cardBackground`).

Agents MAY extend `defaultTheme` when most defaults should remain unchanged.

Agents MUST NOT treat algorithmically generated themes as official without human review.

Agents MUST preserve accessibility over subtle brand expression when choosing theme colors.

## JavaScript Requirements

`Header` mobile navigation depends on USWDS JavaScript from `@pathableai/styles`. Agents MUST import it once at the application boundary when using `Header`:

```tsx
import '@pathableai/styles/js'
```

Agents MUST NOT import `@pathableai/styles/js` inside individual components.

The following React components implement their own client behavior and do NOT require `@pathableai/styles/js`: `Accordion`, `Banner`, `ComboBox`, `DatePicker`, `DateRangePicker`, `Modal`.

## Client Boundary Rules

Most components are server-compatible by default. Agents MUST add a `'use client'` boundary in Next.js App Router (or equivalent) before components that rely on browser-only behavior or React state/effects hooks.

Agents MUST treat these components as client-boundary components:

- `Accordion`
- `Banner`
- `ComboBox`
- `DatePicker`
- `DateRangePicker`
- `Modal`

Agents MUST also wrap controlled interactive usage of these components in a client boundary even though they do not use hooks internally:

- `SegmentedControl`
- `Toast` and `ToastRegion` when visibility changes in response to client state

Agents MUST NOT mark purely presentational components as client-only without a concrete reason.

## Accessibility Rules

Agents MUST give every interactive control an accessible name.

Agents MUST associate `Hint` and `ErrorMessage` content with controls through `aria-describedby`.

Agents MUST use `ErrorMessage` for validation recovery and `Hint` for non-error guidance.

Agents MUST provide meaningful alternative text for informative images and `alt=""` for decorative images.

Agents MUST preserve native semantics from the underlying HTML elements (`button`, `a`, `input`, `fieldset`, `nav`, `main`, etc.).

Agents MUST prioritize accessibility over brand subtlety when the two conflict.

Agents MUST NOT remove focus indicators or rely on color alone to communicate state.

## Documentation References

| Document                              | Purpose                                                  |
| ------------------------------------- | -------------------------------------------------------- |
| `README.md` (this package)            | Human-oriented install guide, examples, and prop tables  |
| `docs/capability-inventory.md`        | Utility-class coverage and semantic-prop support matrix  |
| `docs/theming/consumer-guide.md`      | ThemeProvider usage patterns                             |
| `docs/theming/token-vocabulary.md`    | Complete overridable color token list                    |
| `@pathableai/styles` `AGENTS.md`      | Brand tokens, utilities, and CSS wrapper rules           |
| `@pathableai/styles` `BRAND_RULES.md` | Full brand color and typography guidance                 |
| `STORYBOOK_STANDARD.md`               | Required story structure for component work in this repo |

When README.md and AGENTS.md disagree on operational agent rules, AGENTS.md wins for agent-generated work. When runtime behavior and documentation disagree, the component source and published types win; file an issue for doc drift.
