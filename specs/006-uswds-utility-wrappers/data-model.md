# Data Model: USWDS Utility Wrappers

**Branch**: `006-uswds-utility-wrappers` | **Date**: 2026-07-07

## Entities

### UtilityModule

A category of CSS utility classes that generates a family of related selectors from a shared configuration map.

| Field | Type | Description | Example |
| ------- | ------ | ------------- | --------- |
| `name` | String | Module identifier used in SCSS map keys | `'bg'`, `'padding'`, `'margin'` |
| `classBase` | String | CSS class prefix without the `.pathable-` namespace | `'bg'`, `'padding'`, `'display'` |
| `property` | String | CSS property the utility targets | `'background-color'`, `'padding'`, `'display'` |
| `values` | Map<String, Value> | Token name → resolved CSS value pairs | `'primary': #00365c` |
| `moduleSettings` | Map | USWDS module settings (output, responsive, state variants) | `(output: true, responsive: true)` |
| `responsive` | Boolean | Whether responsive variants should be generated | `true` |
| `stateVariants` | List<String> | State variant pseudo-classes to generate | `('hover', 'focus')` |

**Validation Rules**:

- `name` MUST be unique across all utility modules
- `classBase` SHOULD match the USWDS utility module's class base for consistency
- `property` MUST be a valid CSS property name
- Each value in `values` MUST produce valid CSS when serialized after the property

### UtilityValueToken

A named value within a utility module, mapping a token name to its resolved CSS value.

| Field | Type | Description | Example |
| ------- | ------ | ------------- | --------- |
| `tokenName` | String | Semantic name within the module | `'primary'`, `'4'`, `'flex'`, `'center'` |
| `resolvedValue` | CSS Value | Concrete CSS value resolved from the theme | `#00365c`, `1rem`, `flex` |
| `uswdsSource` | String | USWDS function or variable used for resolution | `color('blue-warm-80v')`, `units(4)`, literal |

**Validation Rules**:

- `tokenName` MUST be unique within its parent `UtilityModule`
- `resolvedValue` MUST be a valid CSS value for the module's `property`
- `uswdsSource` documents how the value is derived for maintainability

### DualCSSProperty

A CSS custom property emitted under both `--pathable-*` and `--usa-*` namespaces.

| Field | Type | Description | Example |
| ------- | ------ | ------------- | --------- |
| `pathableName` | String | The name segment after `--pathable-` | `'bg-primary'`, `'padding-4'` |
| `usaName` | String | The name segment after `--usa-` | `'bg-primary'`, `'padding-4'` |
| `resolvedValue` | CSS Value | The concrete CSS value | `#00365c` |
| `sourceModule` | Reference → UtilityModule | Which utility module the value originates from | Reference to 'bg' module |

**Validation Rules**:

- `pathableName` SHOULD equal `usaName` for consistency (both resolve to same value)
- Each utility value token MUST produce an equivalent `DualCSSProperty`

### ResponsiveBreakpoint

A mobile-first breakpoint at which responsive utility variants are generated.

| Field | Type | Description | Example |
| ------- | ------ | ------------- | --------- |
| `name` | String | Breakpoint identifier used in class name | `'tablet'`, `'desktop'` |
| `minWidth` | Length | The `min-width` value in px | `640px`, `1024px` |
| `enabled` | Boolean | Whether this breakpoint is active in the theme | `true`, `false` |

**Validation Rules**:

- `name` MUST match a key in `$theme-utility-breakpoints`
- `minWidth` MUST be a positive length value
- Only enabled breakpoints generate responsive variants

### StateVariant

A state pseudo-class variant for utility classes.

| Field | Type | Description | Example |
| ------- | ------ | ------------- | --------- |
| `name` | String | State identifier used in class name | `'hover'`, `'focus'` |
| `pseudoClass` | String | CSS pseudo-class selector | `':hover'`, `':focus'` |
| `enabled` | Boolean | Whether this state variant is active for the module | `true`, `false` |

**Validation Rules**:

- `name` MUST match a key in the module's state settings
- `pseudoClass` MUST be a valid CSS pseudo-class

## Relationships

```
UtilityModule 1───* UtilityValueToken
    │                      │
    │                      └───* DualCSSProperty (one token → both --pathable and --usa)
    │
    ├───* ResponsiveBreakpoint (responsive variants via @media)
    └───* StateVariant (state variants via &:{state})
```

## State Transitions

The utility generation process follows this flow:

1. **Configure**: Define utility modules and their value maps
2. **Resolve**: Call USWDS functions to resolve each token to concrete CSS values
3. **Emit Custom Properties**: Generate `--pathable-{name}` and `--usa-{name}` in `:root`
4. **Emit Base Classes**: Generate `.pathable-{base}-{value}` selectors
5. **Emit Responsive Variants**: Wrap base classes in `@media` queries for each enabled breakpoint
6. **Emit State Variants**: Generate `.{state}\:pathable-{base}-{value}` with `&:{state}` nesting
7. **Consume**: Docs site and other consumers apply `.pathable-*` classes in HTML/Astro templates
