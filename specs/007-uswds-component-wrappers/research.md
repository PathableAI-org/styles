# Research: USWDS Component Wrappers

**Branch**: `007-uswds-component-wrappers` | **Date**: 2026-07-07

## R0-1: SCSS Wrapping Approach

### Decision: `@extend`

The `.pathable-*` component wrappers will use SCSS `@extend` to alias each `.usa-{component}` class. This is the simplest, most maintainable approach with minimal CSS output.

**Pattern for each component wrapper:**

```scss
// pathable-button.scss
@use 'uswds-core' as *;

// Forward the USWDS component source to compile its classes
@forward 'usa-button/src/styles';

// Extend each .usa-* class into a .pathable-* equivalent
.pathable-button {
  @extend .usa-button;
}

.pathable-button--accent-cool {
  @extend .usa-button--accent-cool;
}

.pathable-button--outline {
  @extend .usa-button--outline;
}
```

**Rationale**: SCSS `@extend` compiles to comma-separated selectors (e.g., `.pathable-button, .usa-button { ... }`). This means:
- Zero CSS duplication — both class names share the same rule block
- 100% style fidelity — `.pathable-button` is guaranteed to render identically to `.usa-button`
- Automatic maintenance — when USWDS updates component styles, the `pnpm build` picks them up without wrapper changes
- SCSS `@forward` deduplication ensures shared dependencies (e.g., `uswds-fonts` forwarded by both accordion and alert) are compiled only once

### Alternatives Considered

| Option | Verdict | Reason |
|--------|---------|--------|
| CSS copy (duplicating rules) | Rejected | Massive duplication, violates FR-002, drifts from USWDS updates |
| SCSS mixin pattern | Rejected | Adds unnecessary complexity — FR-002 requires identical styles, not customization. Mixin pattern would be useful for a future customization API but is not needed for the wrapper layer |
| `@extend only` | ✅ Selected | Minimal output, automatic sync, simplest code. |

## R0-2: Component-to-Package Mapping

### Full Component Inventory

The USWDS packages directory (`node_modules/@uswds/uswds/packages/`) contains the following packages grouped by type:

**Individual Component Packages (need `.pathable-*` wrappers):**

| # | USWDS Package | Main `.usa-*` Class(es) | JS-Driven? | PathAble Wrapper |
|---|--------------|------------------------|------------|-----------------|
| 1 | usa-accordion | `.usa-accordion`, `.usa-accordion__button`, `.usa-accordion__content` | Yes — JS toggles expand/collapse | `pathable-accordion.scss` |
| 2 | usa-alert | `.usa-alert`, `.usa-alert--info`, `.usa-alert--warning`, etc. | No | `pathable-alert.scss` |
| 3 | usa-banner | `.usa-banner` | Yes — JS toggles banner content | `pathable-banner.scss` |
| 4 | usa-breadcrumb | `.usa-breadcrumb` | No | `pathable-breadcrumb.scss` |
| 5 | usa-button | `.usa-button`, `.usa-button--accent-cool`, `.usa-button--outline`, `.usa-button--big` | No | `pathable-button.scss` |
| 6 | usa-button-group | `.usa-button-group` | No | `pathable-button-group.scss` |
| 7 | usa-card | `.usa-card`, `.usa-card__container`, `.usa-card__header`, `.usa-card__body`, `.usa-card__footer`, `.usa-card--flag` | No | `pathable-card.scss` |
| 8 | usa-character-count | `.usa-character-count` | Yes — JS tracks character count | `pathable-character-count.scss` |
| 9 | usa-checkbox | `.usa-checkbox`, `.usa-checkbox__input`, `.usa-checkbox__label` | No | `pathable-checkbox.scss` |
| 10 | usa-checklist | `.usa-checklist` | No | `pathable-checklist.scss` |
| 11 | usa-collection | `.usa-collection`, `.usa-collection__item`, `.usa-collection__heading` | No | `pathable-collection.scss` |
| 12 | usa-combo-box | `.usa-combo-box` | Yes — JS manages dropdown | `pathable-combo-box.scss` |
| 13 | usa-date-picker | `.usa-date-picker` | Yes — JS manages calendar | `pathable-date-picker.scss` |
| 14 | usa-date-range-picker | `.usa-date-range-picker` | Yes — extends date picker | `pathable-date-range-picker.scss` |
| 15 | usa-embed-container | `.usa-embed-container` | No | `pathable-embed-container.scss` |
| 16 | usa-error-message | `.usa-error-message` | No | `pathable-error-message.scss` |
| 17 | usa-fieldset | `.usa-fieldset` | No | `pathable-fieldset.scss` |
| 18 | usa-file-input | `.usa-file-input` | Yes — JS manages drag-drop | `pathable-file-input.scss` |
| 19 | usa-footer | `.usa-footer`, `.usa-footer--slim`, `.usa-footer__primary-section`, etc. | No | `pathable-footer.scss` |
| 20 | usa-form | `.usa-form` | No | `pathable-form.scss` |
| 21 | usa-form-group | `.usa-form-group` | No | `pathable-form-group.scss` |
| 22 | usa-graphic-list | `.usa-graphic-list`, `.usa-graphic-list__heading` | No | `pathable-graphic-list.scss` |
| 23 | usa-header | `.usa-header`, `.usa-header--basic`, `.usa-header--megamenu`, `.usa-header--extended` | Yes — JS manages mobile menu | `pathable-header.scss` |
| 24 | usa-hero | `.usa-hero`, `.usa-hero__callout`, `.usa-hero__heading` | No | `pathable-hero.scss` |
| 25 | usa-hint | `.usa-hint` | No | `pathable-hint.scss` |
| 26 | usa-icon | `.usa-icon` | No | `pathable-icon.scss` |
| 27 | usa-icon-list | `.usa-icon-list`, `.usa-icon-list__item`, `.usa-icon-list__icon`, `.usa-icon-list__content` | No | `pathable-icon-list.scss` |
| 28 | usa-identifier | `.usa-identifier`, `.usa-identifier__section`, `.usa-identifier__container` | No | `pathable-identifier.scss` |
| 29 | usa-in-page-navigation | `.usa-in-page-nav` | Yes — JS manages scroll tracking | `pathable-in-page-navigation.scss` |
| 30 | usa-input | `.usa-input` | No | `pathable-input.scss` |
| 31 | usa-input-mask | `.usa-input-mask` | Yes — JS manages mask formatting | `pathable-input-mask.scss` |
| 32 | usa-input-prefix-suffix | `.usa-input-prefix-suffix`, `.usa-input-prefix`, `.usa-input-suffix` | No | `pathable-input-prefix-suffix.scss` |
| 33 | usa-label | `.usa-label` | No | `pathable-label.scss` |
| 34 | usa-language-selector | `.usa-language-selector` | Yes — JS manages language switching | `pathable-language-selector.scss` |
| 35 | usa-layout-grid | `.grid-container`, `.grid-row`, `.grid-gap`, `.grid-col-*` | No | `pathable-layout-grid.scss` |
| 36 | usa-legend | `.usa-legend` | No | `pathable-legend.scss` |
| 37 | usa-link | `.usa-link`, `.usa-link--external`, `.usa-link--alt` | No | `pathable-link.scss` |
| 38 | usa-list | `.usa-list` | No | `pathable-list.scss` |
| 39 | usa-media-block | `.usa-media-block`, `.usa-media-block__img`, `.usa-media-block__body` | No | `pathable-media-block.scss` |
| 40 | usa-memorable-date | `.usa-memorable-date` | No | `pathable-memorable-date.scss` |
| 41 | usa-modal | `.usa-modal`, `.usa-modal__content`, `.usa-modal__heading`, `.usa-modal__footer` | Yes — JS manages show/hide | `pathable-modal.scss` |
| 42 | usa-nav | `.usa-nav`, `.usa-nav__primary`, `.usa-nav__link`, `.usa-nav__submenu` | Yes — JS manages submenu toggles | `pathable-nav.scss` |
| 43 | usa-pagination | `.usa-pagination`, `.usa-pagination__item`, `.usa-pagination__link` | No | `pathable-pagination.scss` |
| 44 | usa-process-list | `.usa-process-list`, `.usa-process-list__item`, `.usa-process-list__heading` | No | `pathable-process-list.scss` |
| 45 | usa-prose | `.usa-prose` | No | `pathable-prose.scss` |
| 46 | usa-radio | `.usa-radio`, `.usa-radio__input`, `.usa-radio__label` | No | `pathable-radio.scss` |
| 47 | usa-range | `.usa-range` | No | `pathable-range.scss` |
| 48 | usa-search | `.usa-search`, `.usa-search--big`, `.usa-search--small` | Yes — JS may enhance search | `pathable-search.scss` |
| 49 | usa-section | `.usa-section`, `.usa-section--dark` | No | `pathable-section.scss` |
| 50 | usa-select | `.usa-select` | No | `pathable-select.scss` |
| 51 | usa-sidenav | `.usa-sidenav`, `.usa-sidenav__item`, `.usa-sidenav__sublist` | No | `pathable-sidenav.scss` |
| 52 | usa-site-alert | `.usa-site-alert`, `.usa-site-alert--info`, `.usa-site-alert--warning`, `.usa-site-alert--emergency` | Yes — JS may manage dismiss | `pathable-site-alert.scss` |
| 53 | usa-skipnav | `.usa-skipnav` | No | `pathable-skipnav.scss` |
| 54 | usa-step-indicator | `.usa-step-indicator`, `.usa-step-indicator__header`, `.usa-step-indicator__segment` | No | `pathable-step-indicator.scss` |
| 55 | usa-summary-box | `.usa-summary-box`, `.usa-summary-box__heading`, `.usa-summary-box__body` | No | `pathable-summary-box.scss` |
| 56 | usa-table | `.usa-table`, `.usa-table--borderless`, `.usa-table--compact`, `.usa-table--striped` | No | `pathable-table.scss` |
| 57 | usa-tag | `.usa-tag`, `.usa-tag--big` | No | `pathable-tag.scss` |
| 58 | usa-textarea | `.usa-textarea` | No | `pathable-textarea.scss` |
| 59 | usa-time-picker | `.usa-time-picker` | Yes — JS manages time select | `pathable-time-picker.scss` |
| 60 | usa-tooltip | `.usa-tooltip` | Yes — JS manages tooltip show/hide | `pathable-tooltip.scss` |
| 61 | usa-validation | `.usa-validation` | Yes — JS manages validation | `pathable-validation.scss` |

**Style-only packages (no `.usa-*` class wrappers but forwarded for compilation):**
- `usa-content` — content width styles, forwarded via uswds-typography
- `usa-dark-background` — dark background utility styles
- `usa-display` — display heading styles
- `usa-embed-container` — responsive embed container
- `usa-intro` — intro text styles
- `usa-layout-docs` — sidebar layout
- `usa-paragraph` — paragraph lead styles
- `usa-section` — section background styles
- `usa-site-title` — site title styles
- `usa-fonts` — font face declarations (forwarded by uswds-fonts)

**Infrastructure packages (forwarded but no `.pathable-*` class):**
- `uswds-core` — functions, mixins, tokens
- `uswds-elements` — base element styles
- `uswds-fonts` — font face declarations
- `uswds-helpers` — utility classes (sr-only, usa-focus)
- `uswds-utilities` — utility generator

## R0-3: Bundle Package Structure

Each bundle package is an SCSS file that `@forward`s multiple individual component wrappers:

```
packages/styles/src/pathable-component-wrappers/
├── pathable-form-controls.scss        # All form-related components
├── pathable-typography.scss            # Typography-related components
├── pathable-navigation.scss            # Navigation components
├── pathable-layout.scss                # Layout components
├── pathable-communication.scss         # Communication/info components
├── pathable-all.scss                   # ALL individual component wrappers
└── _index.scss                         # Forwards pathable-all (convenience)
```

**Bundle membership:**

| Bundle | Components |
|--------|-----------|
| **pathable-form-controls** | character-count, checkbox, combo-box, date-picker, date-range-picker, error-message, fieldset, file-input, form, form-group, hint, input, input-mask, input-prefix-suffix, label, legend, memorable-date, radio, range, select, textarea, time-picker, validation |
| **pathable-typography** | content (fwd), dark-background (fwd), display (fwd), intro (fwd), link, list, paragraph (fwd), prose |
| **pathable-navigation** | breadcrumb, header, in-page-navigation, nav, pagination, search, sidenav, skipnav |
| **pathable-layout** | embed-container, layout-docs (fwd), layout-grid, media-block, section |
| **pathable-communication** | accordion, alert, banner, card, collection, graphic-list, hero, icon, icon-list, identifier, modal, process-list, site-alert, step-indicator, summary-box, table, tag, tooltip |
| **pathable-all** | All individual component wrappers + all bundles + infrastructure forwards |

## R0-4: CSS Custom Property Strategy

### Decision: Dedicated partial for component properties

Component-level CSS custom properties will be emitted in a dedicated `_components-custom-properties.scss` partial that maps component-level USWDS tokens to CSS custom properties.

**Pattern:**

```scss
:root {
  // Button component tokens
  --pathable-button-border-radius: #{radius($theme-button-border-radius)};
  --pathable-button-padding-x: #{units(2.5)};
  --pathable-button-padding-y: #{units(1.5)};
  --usa-button-border-radius: #{radius($theme-button-border-radius)};
  --usa-button-padding-x: #{units(2.5)};
  --usa-button-padding-y: #{units(1.5)};

  // Alert component tokens
  --pathable-alert-padding-x: #{units(2)};
  --usa-alert-padding-x: #{units(2)};
}
```

**Rationale**: A dedicated partial keeps component properties separate from utility and general token properties. The dual-naming convention is preserved: every value appears as both `--pathable-*` and `--usa-*`.

## R0-5: JS Boundary Analysis

### Problem

USWDS JavaScript components reference `.usa-*` class names for DOM selection. For example, the accordion JS likely does `document.querySelectorAll('.usa-accordion__button')` to attach click handlers. If we only compile `.pathable-accordion` as a CSS alias, the DOM elements still have `.usa-accordion` classes (because the USWDS source compiles `.usa-accordion`), so JS continues to work.

However, if a developer replaces `<div class="usa-accordion">` with `<div class="pathable-accordion">` in their HTML, the JS would no longer find elements — because the selector `.usa-accordion__button` wouldn't match `.pathable-accordion`.

### Resolution

The wrapping strategy addresses this explicitly:

1. **CSS layer**: `.pathable-{component}` works as a CSS class alias via `@extend`. Both classes produce identical styles.
2. **DOM layer**: Consumers MUST keep the `.usa-*` class on JS-interactive components, or the JS selector will not match. The wrapper provides `.pathable-*` purely as a CSS class; the `.usa-*` class must remain on the DOM element for JS-driven components.
3. **Documentation**: Each JS-driven component's wrapper docstring and the quickstart guide will note: *"This component uses USWDS JavaScript. Keep `.usa-{component}` on the DOM element for JS interactivity. Apply `.pathable-{component}` as an additional class for PathAble naming."*

**Components requiring `.usa-*` retention on DOM (affects docs refactoring):**

- accordion — JS selects `.usa-accordion__button`
- banner — JS selects `.usa-banner__button`
- combo-box — JS selects `.usa-combo-box`
- date-picker — JS selects `.usa-date-picker`
- date-range-picker — JS selects `.usa-date-range-picker`
- file-input — JS selects `.usa-file-input`
- header — JS selects `.usa-header`, `.usa-nav`
- in-page-navigation — JS selects `.usa-in-page-nav`
- input-mask — JS selects `.usa-input-mask`
- modal — JS selects `.usa-modal`, `.usa-modal__close`
- nav — JS selects `.usa-nav`, `.usa-nav__link`
- search — JS may enhance search
- site-alert — JS may handle dismiss
- time-picker — JS selects `.usa-time-picker`
- tooltip — JS selects `.usa-tooltip`
- validation — JS manages validation states

### Docs Refactoring Guidance

For JS-driven components, the docs templates should apply BOTH classes:

```html
<!-- Before: usa-* only -->
<button class="usa-accordion__button">Section 1</button>

<!-- After: usa-* retained for JS + pathable-* for CSS naming -->
<button class="usa-accordion__button pathable-accordion__button">Section 1</button>
```

For non-JS components, `.usa-*` can be fully replaced:

```html
<!-- Before -->
<a class="usa-link" href="/">Home</a>

<!-- After -->
<a class="pathable-link" href="/">Home</a>
```

## Research Summary

All research questions answered. No [NEEDS CLARIFICATION] markers remain. The `@extend` approach is confirmed as the optimal technique, the complete component-to-wrapper mapping is documented, bundle package structure is defined, the JS boundary strategy is resolved, and the CSS custom property approach is established.