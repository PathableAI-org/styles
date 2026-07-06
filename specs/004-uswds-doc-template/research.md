# Research: USWDS Documentation Page Template for Astro Docs

**Phase**: 0 | **Feature**: 004-uswds-doc-template | **Date**: 2026-07-06

## R1: Starlight Component Override Architecture

### Findings

**Starlight v0.32.0** provides a `components` option in `astro.config.mjs` that maps Starlight's internal component names to user-provided Astro components:

```js
// astro.config.mjs
starlight({
  components: {
    PageFrame: './src/components/PageFrame.astro',
  },
})
```

**PageFrame slot contract** (from `virtual:starlight/components/PageFrame`):

| Slot | Description | When Available |
|---|---|---|
| `slot="header"` | Top header bar (brand, search, theme toggle, mobile menu button) | Always |
| `slot="sidebar"` | Left sidebar with page navigation tree | When `hasSidebar` is true |
| Default `slot` | Main content area | Always |

**Key imports from `virtual:starlight/components/`:**

- `MobileMenuToggle` — hamburger button for mobile sidebar
- `ThemeSelect` — dark/light mode toggle (if enabled)
- `Search` — search UI (if enabled)

**Sidebar content**: Starlight auto-generates the sidebar from the `docs` content collection and `sidebar` config in `astro.config.mjs`. It is passed through the sidebar slot as pre-rendered HTML.

**Constraint**: Starlight does NOT provide component overrides for individual sidebar items or footer. The `PageFrame` component is the main extension point. A footer must be added as a new element within the custom `PageFrame`.

### Decision

Use PageFrame override as the main entry point. Keep Starlight's sidebar slot as-is (content is auto-generated). Add a new footer element in PageFrame. The existing HorizontalNav.astro is already implemented and overlaid onto PageFrame — it should be retained and restyled.

---

## R2: USWDS Documentation Template Layout Anatomy

### Extract from USWDS Template HTML

The USWDS documentation page template has the following structure:

```
<body>
  <a class="usa-skipnav" href="#main-content">Skip to main content</a>
  <section class="usa-banner"> ... </section>         <!-- EXCLUDED: government-specific -->
  <div class="usa-overlay"></div>
  <header class="usa-header usa-header--basic">        <!-- Fixed top header -->
    <div class="usa-nav-container">
      <div class="usa-navbar">
        <div class="usa-logo">
          <em class="usa-logo__text"><a href="/" title="<Project title>">...</a></em>
        </div>
        <button class="usa-menu-btn">Menu</button>     <!-- Mobile menu trigger -->
      </div>
      <nav class="usa-nav">                            <!-- Primary navigation -->
        <button class="usa-nav__close">Close</button>
        <ul class="usa-nav__primary">...</ul>
        <section>Search...</section>
      </nav>
    </div>
  </header>
  <div class="usa-section">
    <div class="grid-container">
      <div class="grid-row grid-gap">
        <aside class="usa-layout-docs__sidenav desktop:grid-col-3">  <!-- Sidebar -->
          <nav aria-label="Secondary navigation">
            <ul class="usa-sidenav">...</ul>            <!-- Hierarchical nav -->
          </nav>
        </aside>
        <main class="desktop:grid-col-9 usa-prose" id="main-content">  <!-- Content -->
          <h1>Page heading (h1)</h1>
          <p class="usa-intro">...</p>
          ...
        </main>
      </div>
      <!-- Duplicate sidenav for mobile (shown below content on mobile) -->
      <aside class="usa-layout-docs__sidenav display-none desktop:display-none">
        <!-- Same nav for mobile at bottom -->
      </aside>
    </div>
  </div>
  <footer class="usa-footer">...</footer>               <!-- Medium footer -->
  <div class="usa-identifier">...</div>                 <!-- EXCLUDED: government-specific -->
</body>
```

### Key USWDS CSS classes for mapping:

| Class | Purpose | Token Strategy |
|---|---|---|
| `.usa-header--basic` | Fixed top header | Component-scoped CSS with `--pathable-*` tokens |
| `.usa-logo` / `.usa-logo__text` | Brand/logo display | Component-scoped CSS |
| `.usa-nav__primary` | Top-level nav list | Component-scoped CSS (existing HorizontalNav) |
| `.usa-layout-docs__sidenav` | Sidebar wrapper | Starlight sidebar slot wrapper |
| `.usa-sidenav` | Hierarchical nav tree | Starlight sidebar already provides this structure |
| `.usa-prose` | Content prose typography | `custom.css` prose styles |
| `.usa-section` | Section spacing | Equivalent custom class |
| `.grid-container`, `.grid-row`, `.grid-gap` | Layout grid | USWDS grid utility classes (available via styles package) |
| `.usa-footer` | Footer | New DocFooter component |
| `.usa-footer__primary-section` | Footer nav links | Component-scoped CSS |
| `.usa-footer__secondary-section` | Footer contact/social | Component-scoped CSS |

### Decision

Use USWDS layout grid classes (`.grid-container`, `.grid-row`, `.grid-gap`) for the overall page grid since they are available from the `@pathable/styles` package (USWDS is a transitive dependency). Style individual page regions with component-scoped CSS using `--pathable-*` tokens. The `.usa-prose` typography patterns inform the custom CSS in `custom.css`.

---

## R3: Token Mapping for Layout Regions

### Complete Token Map

| Layout Region | CSS Property | `--pathable-*` Token | Notes |
|---|---|---|---|
| Page body background | `background-color` | `var(--pathable-color-bg)` | |
| Header background | `background-color` | `var(--pathable-color-surface)` | |
| Header text | `color` | `var(--pathable-color-text)` | |
| Header borders | `border-bottom-color` | `var(--pathable-color-border)` | |
| Horizontal nav link (default) | `color` | `var(--pathable-color-text)` | |
| Horizontal nav link (active) | `color`, `border-bottom-color` | `var(--pathable-color-accent)` | |
| Sidebar background | `background-color` | `var(--pathable-color-surface)` | |
| Sidebar link (default) | `color` | `var(--pathable-color-text)` | |
| Sidebar link (current/active) | `color`, `border-*` | `var(--pathable-color-accent)` | |
| Sidebar borders | `border-*-color` | `var(--pathable-color-border)` | |
| Content heading font | `font-family` | `var(--pathable-font-heading)` | Fredoka |
| Content body font | `font-family` | `var(--pathable-font-body)` | Nunito |
| Content text color | `color` | `var(--pathable-color-text)` | |
| Content link color | `color` | `var(--pathable-color-link)` | Bright Blue Brooks |
| Footer background | `background-color` | `var(--pathable-color-surface)` | |
| Footer text | `color` | `var(--pathable-color-text)` | |
| Footer borders | `border-*-color` | `var(--pathable-color-border)` | |
| Focus ring | `outline-color` | `var(--pathable-color-focus-ring)` | |
| Accent/highlight | `color`, `background-color` | `var(--pathable-color-accent)` | Intelligent Jade |
| Muted/secondary text | `color` | `var(--pathable-color-text-muted)` | Tech Teal |

### Decision

All eleven semantic color tokens from `@pathable/styles` are used across the layout. No hardcoded color values anywhere.

---

## R4: Web Font Loading in Astro

### Findings

The existing `custom.css` defines `--pathable-font-heading: Fredoka` and `--pathable-font-body: Nunito` as CSS custom properties, and Starlight maps them to `--sl-font` and `--sl-font-headings`. However, the actual font files (`.woff2` or Google Fonts URL) are NOT loaded anywhere in the docs site.

### Options

| Option | Effort | Pros | Cons |
|---|---|---|---|
| Google Fonts link in `<head>` | Low (add link tag) | Simple, CDN-hosted | External dependency, privacy |
| Self-hosted `@font-face` | Medium | No external dependency, offline-friendly | Need font files, more config |
| Astro integration (e.g., `@astrojs/google-fonts`) | Low | Clean integration | External dependency |

### Decision

Add Google Fonts `<link>` tags in the `<head>` for Fredoka and Nunito. This is the simplest approach and consistent with typical Starlight documentation sites. The link tags can be added via the Starlight `head` option in `astro.config.mjs` or via a custom `Head.astro` component override.

---

## R5: Footer Component Design

### USWDS Medium Footer Pattern

The USWDS medium footer has three sections:

1. **Return to top**: `.usa-footer__return-to-top` — a simple link centered at the top of the footer
2. **Primary section**: `.usa-footer__primary-section` — contains a nav with grid-row/column layout for link groups
3. **Secondary section**: `.usa-footer__secondary-section` — contains logo, agency name, social links, contact info

### Pathable Docs Footer Design

For the Pathable docs site, the footer will be simplified:

1. **Return to top**: A centered link at the top
2. **Primary section**: Navigation links for top-level doc sections (mirroring the horizontal nav)
3. **Secondary section**: Pathable Styles branding, copyright, and a "Powered by USWDS" attribution

### Implementation

The footer will be a single `DocFooter.astro` Astro component with scoped `<style>` blocks using `--pathable-*` tokens. It will be embedded in `PageFrame.astro` after the content area.

---

## Summary of Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Use PageFrame override as main entry point | Starlight's documented extension mechanism |
| D2 | Keep Starlight sidebar slot as-is | Content generation is complex; wrapping is simpler |
| D3 | Use USWDS grid classes for layout | Already available via transitive dependency; matches template |
| D4 | All styling via `--pathable-*` tokens | Spec FR-010; serves as styles package test surface |
| D5 | Google Fonts for web font loading | Simple, works with static site |
| D6 | New DocFooter component | Starlight has no footer mechanism |
| D7 | Duplicate sidebar for mobile at bottom (USWDS pattern) | Follows template accessibility guidance |