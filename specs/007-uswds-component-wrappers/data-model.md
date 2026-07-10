# Data Model: USWDS Component Wrappers

**Branch**: `007-uswds-component-wrappers` | **Date**: 2026-07-07

## Entities

### ComponentWrapper

A SCSS definition that provides a `.pathable-{component}` class as an alias for an `.usa-{component}` class via `@extend`.

| Field | Type | Description | Example |
| ------- | ------ | ------------- | --------- |
| `name` | String | Component identifier used in SCSS file naming | `'button'`, `'accordion'`, `'alert'` |
| `uswdsPackage` | String | USWDS package name | `'usa-button'`, `'usa-accordion'` |
| `uswdsClasses` | List<String> | `.usa-*` class selectors defined in the component | `('.usa-button', '.usa-button--accent-cool', '.usa-button--outline', '.usa-button--big')` |
| `pathableClasses` | List<String> | Corresponding `.pathable-*` class selectors | `('.pathable-button', '.pathable-button--accent-cool', '.pathable-button--outline', '.pathable-button--big')` |
| `wrapperFile` | String | SCSS file path relative to the wrappers directory | `'pathable-button.scss'` |
| `dependencies` | List<String> | USWDS packages that this component depends on | `('uswds-fonts', 'usa-icon')` |
| `jsDriven` | Boolean | Whether the component uses USWDS JavaScript | `false` for button, `true` for accordion |
| `requiresUSAClassOnDOM` | Boolean | Whether `.usa-*` must remain on the DOM for JS | `false` for non-JS components, `true` for accordion, banner, etc. |

**Validation Rules**:

- `name` MUST be unique across all `ComponentWrapper` instances
- `uswdsPackage` MUST exist in `node_modules/@uswds/uswds/packages/`
- Each entry in `uswdsClasses` MUST correspond to a CSS class defined in the USWDS component source
- Each entry in `pathableClasses` MUST have the `.pathable-` prefix replacing `.usa-`
- `wrapperFile` MUST match the pattern `pathable-{name}.scss`
- When `jsDriven` is `true`, `requiresUSAClassOnDOM` MUST be `true`

### ComponentPackage

A discrete importable SCSS entry point corresponding to one USWDS component or bundle.

| Field | Type | Description | Example |
| ------- | ------ | ------------- | --------- |
| `name` | String | Package name used in `@forward` | `'pathable-button'` |
| `type` | Enum('individual', 'bundle') | Whether this is a single component or a bundle | `'individual'` |
| `scssPath` | String | SCSS file path within the wrappers directory | `'pathable-button.scss'` |
| `forwardedWrappers` | List<Reference → ComponentWrapper> | Individual component wrappers included | For bundles: list of all included components |
| `forwardedBundles` | List<Reference → ComponentPackage> | Sub-bundles included (for bundle-all) | For `pathable-all`: all bundle packages |

**Validation Rules**:

- `name` MUST be unique across all packages
- All forwarded wrappers in a bundle MUST be distinct (no duplicates)
- Shared dependencies across forwarded wrappers MUST be deduplicated via SCSS module system

### BundlePackage

A named collection of component packages grouped by functional area.

| Field | Type | Description | Example |
| ------- | ------ | ------------- | --------- |
| `name` | String | Bundle name used in SCSS `@forward` | `'pathable-form-controls'` |
| `functionalArea` | String | What the bundle covers | `'form controls'`, `'typography'` |
| `components` | List<Reference → ComponentWrapper> | Component wrappers in this bundle | character-count, checkbox, combo-box, etc. |

**Predefined Bundles**:

- `pathable-form-controls` — character-count, checkbox, combo-box, date-picker, date-range-picker, error-message, fieldset, file-input, form, form-group, hint, input, input-mask, input-prefix-suffix, label, legend, memorable-date, radio, range, select, textarea, time-picker, validation
- `pathable-typography` — link, list, prose (forwards content, dark-background, display, intro, paragraph as style dependencies)
- `pathable-navigation` — breadcrumb, header, in-page-navigation, nav, pagination, search, sidenav, skipnav
- `pathable-layout` — embed-container, layout-grid, media-block, section (forwards layout-docs as style dependency)
- `pathable-communication` — accordion, alert, banner, card, collection, graphic-list, hero, icon, icon-list, identifier, modal, process-list, site-alert, step-indicator, summary-box, table, tag, tooltip

### DualComponentProperty

A CSS custom property emitted under both `--pathable-{component}-{property}` and `--usa-{component}-{property}` namespaces for component-level styling values.

| Field | Type | Description | Example |
| ------- | ------ | ------------- | --------- |
| `pathableName` | String | The name segment after `--pathable-` | `'button-border-radius'`, `'alert-padding-x'` |
| `usaName` | String | The name segment after `--usa-` | `'button-border-radius'`, `'alert-padding-x'` |
| `resolvedValue` | CSS Value | The concrete CSS value | `'0.25rem'`, `'1rem'` |
| `sourceComponent` | Reference → ComponentWrapper | Which component the property belongs to | Reference to 'button' wrapper |
| `uswdsTokenFunction` | String | USWDS function used to derive the value | `'radius($theme-button-border-radius)'`, `'units(2.5)'` |

**Validation Rules**:

- `pathableName` MUST equal `usaName` for consistency (both resolve to the same value)
- Each component SHOULD emit at least its key dimensional/spacing tokens (border-radius, padding, font-size)

### JSDrivenComponent

A component whose USWDS JavaScript references `.usa-*` class names internally, requiring the DOM to retain both classes.

| Field | Type | Description | Example |
| ------- | ------ | ------------- | --------- |
| `name` | String | Component name | `'accordion'` |
| `uswdsPackage` | String | USWDS package | `'usa-accordion'` |
| `jsSelectors` | List<String> | Class selectors the JS uses for DOM querying | `('.usa-accordion__button', '.usa-accordion__content')` |
| `workaround` | String | How consumers should handle the boundary | `'Keep .usa-accordion on the DOM for JS. Add .pathable-accordion as an additional class.'` |

**Known JS-Driven Components**:

| Component | JS Selectors | Workaround |
| ----------- | ------------- | ------------ |
| accordion | `.usa-accordion__button` | Add both classes |
| banner | `.usa-banner__button`, `.usa-banner__content` | Add both classes |
| combo-box | `.usa-combo-box` | Add both classes |
| date-picker | `.usa-date-picker` | Add both classes |
| date-range-picker | `.usa-date-range-picker` | Add both classes |
| file-input | `.usa-file-input` | Add both classes |
| header/nav | `.usa-header`, `.usa-nav`, `.usa-nav__link` | Add both classes |
| in-page-navigation | `.usa-in-page-nav` | Add both classes |
| input-mask | `.usa-input-mask` | Add both classes |
| modal | `.usa-modal`, `.usa-modal__close` | Add both classes |
| site-alert | `.usa-site-alert` | Add both classes |
| time-picker | `.usa-time-picker` | Add both classes |
| tooltip | `.usa-tooltip` | Add both classes |
| validation | `.usa-validation` | Add both classes |

### WrapperGenerationStrategy

The SCSS technique used to generate the `.pathable-*` alias for a component.

| Field | Type | Description | Value |
| ------- | ------ | ------------- | ------- |
| `strategy` | Enum('extend') | The generation technique | `'extend'` |
| `rationale` | String | Why this strategy was chosen | `'@extend produces minimal CSS output, guarantees 100% style fidelity, and auto-syncs with USWDS updates.'` |
| `alternatives` | List<String> | Other options evaluated and rejected | `('CSS copy - duplication, drifts from updates', 'SCSS mixin - unnecessary complexity for wrapper use case')` |

## Relationships

```
BundlePackage 1───* ComponentPackage (bundle contains individual packages)
ComponentPackage 1───1 ComponentWrapper (for individual type)
ComponentWrapper 1───* DualComponentProperty (each wrapper emits its custom properties)
ComponentWrapper 1───0..1 JSDrivenComponent (only JS-driven components have boundary data)
ComponentWrapper *───* ComponentPackage (dependencies are shared across packages)
```

## State Transitions

The component wrapper generation follows this flow:

1. **Configure**: Define USWDS component → PathAble class mapping per wrapper file
2. **Forward**: Each wrapper file `@forward`s its USWDS dependency chain and source
3. **Extend**: Each `.pathable-*` class `@extend`s the corresponding `.usa-*` class
4. **Emit Custom Properties**: Generate `--pathable-{component}-{property}` and `--usa-{component}-{property}` in `:root`
5. **Consume**: Consumers import individual wrappers, bundles, or the all-in-one entry point
6. **Refactor Docs**: Replace `.usa-*` class references in `apps/docs` with `.pathable-*` equivalents
