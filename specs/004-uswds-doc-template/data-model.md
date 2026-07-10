# Data Model: USWDS Documentation Page Template for Astro Docs

**Phase**: 1 | **Feature**: 004-uswds-doc-template | **Date**: 2026-07-06

## Entities

### PageFrame

The top-level layout container that wraps the entire page. It arranges header, navigation, sidebar, content, and footer regions.

| Field | Type | Description | Source |
| --- | --- | --- | --- |
| `hasSidebar` | `boolean` | Whether sidebar content exists for this page | `Astro.locals.starlightRoute.hasSidebar` |
| `headerSlot` | `slot` | Starlight header content | Starlight internals |
| `sidebarSlot` | `slot` | Starlight sidebar content | Starlight internals |
| `defaultSlot` | `slot` | Main page content | Starlight internals |

**Layout structure** (top to bottom):

1. SkipNav (always)
2. Header slot (Starlight — brand, search, theme toggle)
3. HorizontalNav (always — primary section links)
4. Main body: sidebar + content (2-column on desktop, single on mobile)
5. Footer (always)

**State transitions**: None — static layout, no interactive state beyond mobile menu toggle.

---

### HorizontalNav

The primary navigation bar appearing below the header, styled like the USWDS basic header pattern.

| Field | Type | Description | Source |
| --- | --- | --- | --- |
| `primaryNavItems` | `Array<{label, href}>` | Top-level section links | Defined in component |
| `currentPath` | `string` | Current page URL path | `Astro.url.pathname` |
| `isCurrent(href)` | `function` | Whether a nav item matches current page | Comparison logic |

**Styling**: Uses `--pathable-*` tokens for colors, fonts, spacing. Active item highlighted with `--pathable-color-accent`.

---

### Sidebar

The hierarchical page navigation tree, displayed as a left column on desktop and hidden behind a menu toggle on mobile.

| Field | Type | Description | Source |
| --- | --- | --- | --- |
| `navContent` | `slot` | Pre-rendered Starlight sidebar HTML | Starlight internals |
| `isVisible` | `boolean` | Whether sidebar is visible (desktop always; mobile toggled) | CSS media query + JS toggle |

**Styling**: Wrapped in a styled container using `--pathable-*` tokens for background, borders, text, and active states. Follows the USWDS `.usa-sidenav` visual pattern.

---

### ContentProse

The main content area where documentation markdown is rendered.

| Field | Type | Description | Source |
|---|---|---|---|
| `content` | `slot` | Rendered markdown content | Starlight internals |

**Styling**: Prose-optimized typography using `--pathable-font-heading` (headings), `--pathable-font-body` (body text), `--pathable-color-text`, `--pathable-color-link`, etc. Follows USWDS `.usa-prose` patterns.

---

### Footer

The site footer with links and branding, styled like the USWDS medium footer.

| Field | Type | Description | Source |
| --- | --- | --- | --- |
| `primaryLinks` | `Array<{label, href}>` | Navigation links | Defined in component |
| `brandName` | `string` | Site name for branding | Hardcoded in component |
| `currentYear` | `number` | Copyright year | `new Date().getFullYear()` |

**Styling**: Uses `--pathable-*` tokens. Three sections: return-to-top, primary nav links, secondary branding.

---

### SkipNav

An accessibility link that becomes visible on focus, allowing keyboard users to skip directly to the main content.

| Field | Type | Description | Source |
| --- | --- | --- | --- |
| `targetId` | `string` | ID of the main content element | `"main-content"` |
| `label` | `string` | Link text | "Skip to main content" |

**Styling**: Hidden by default, visible on focus using `--pathable-color-focus-ring`.

---

## Relationships

```
PageFrame
├── SkipNav (accessibility, always visible when focused)
├── slot: header (Starlight — brand, search, theme toggle)
├── HorizontalNav (always visible, primary section links)
├── body-layout (flex container)
│   ├── Sidebar (conditional: only when hasSidebar)
│   │   └── slot: sidebar (Starlight-generated navigation tree)
│   └── ContentProse (always visible)
│       └── default slot (Starlight-rendered markdown)
└── Footer (always visible)
```

## States

| State | Sidebar | Content Width | Trigger |
| --- | --- | --- | --- |
| Desktop with sidebar | Visible, left column (3/12 width) | Right column (9/12 width) | Viewport >= 1024px + hasSidebar |
| Desktop no sidebar | Hidden | Full width | Viewport >= 1024px + !hasSidebar |
| Mobile | Hidden, togglable via menu button | Full width | Viewport < 1024px |
| Mobile with menu open | Overlay panel | Hidden behind overlay | Viewport < 1024px + menu toggle
