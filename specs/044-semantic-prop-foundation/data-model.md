# Data Model: Semantic Utility Type System and Class Resolvers

**Feature**: `specs/044-semantic-prop-foundation`
**Date**: 2026-08-19

## Entities

### Semantic Capability

A named, cohesive group of CSS utility properties with verified class support in `@pathable/styles`.

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Capability name (e.g., "sizing", "spacing", "display") |
| `utilities` | `UtilityModule[]` | Individual CSS utility modules in this capability |
| `propsInterface` | `string` | TypeScript interface name (e.g., `SizingProps`) |
| `hasGaps` | `boolean` | Whether known gaps exist (per inventory) |

### UtilityModule

A single CSS utility module from the SCSS `$pathable-utilities` config map. Each module generates one family of `.pathable-{prefix}-{value}` classes.

| Field | Type | Description |
|-------|------|-------------|
| `scssModuleKey` | `string` | Key in `$pathable-utilities` map (e.g., `"width"`, `"margin-top"`) |
| `classPrefix` | `string` | Emitted CSS class prefix (e.g., `"pathable-width"`) |
| `cssProperty` | `string \| string[]` | CSS property or properties set |
| `values` | `UtilityValue[]` | All supported values observed in SCSS source |
| `responsive` | `boolean` | Whether responsive breakpoint variants are emitted |
| `stateVariants` | `("hover"\|"focus")[]` | State pseudo-class variants (bg/text only) |
| `owningSource` | `string` | SCSS source file path for the config map (e.g., `src/_utilities-config.scss`); `src/_utilities.scss` generates the utility classes |
| `capability` | `string` | Parent capability group name |

### UtilityValue

A single supported value within a utility module.

| Field | Type | Description |
|-------|------|-------------|
| `scssKey` | `string` | Key in the module's `values` map (e.g., `"full"`, `"auto"`) |
| `cssValue` | `string` | Resolved CSS value (e.g., `"100%"`) |
| `emittedClass` | `string` | Full CSS class name (e.g., `"pathable-width-full"`) |
| `responsiveBreakpoints` | `string[]` | Breakpoint-prefixed variants if responsive |

### ValueType

A TypeScript string-literal union type that enumerates the verified values for one CSS property. Each member corresponds to a `UtilityValue.scssKey`.

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Type alias name (e.g., `Width`, `SpacingScale`) |
| `members` | `string[]` | String literal values |
| `mapsTo` | `UtilityModule` | The utility module this type enumerates |
| `resolver` | `Resolver` | The function that maps values to class strings |

### CapabilityInterface

A TypeScript interface that groups related value types into a prop set.

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Interface name (e.g., `SizingProps`) |
| `props` | `InterfaceProp[]` | Individual prop definitions |
| `resolverFor` | `Record<string, Resolver>` | Prop-name → resolver function mapping |

### InterfaceProp

A single prop in a capability interface.

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Prop name (e.g., `width`, `maxWidth`) |
| `type` | `ValueType` | Referenced value type |
| `optional` | `boolean` | Always `true` (all semantic props are optional) |

### Resolver

A pure function that maps a value (or null/undefined) to a CSS class string or undefined.

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Function name (e.g., `widthClass`) |
| `inputType` | `ValueType` | Expected input value type |
| `outputType` | `string \| undefined` | Return type |
| `pure` | `boolean` | Always `true` |
| `zeroBrowserGlobals` | `boolean` | Always `true` |
| `map` | `Record<string, string>` | Statically-declared value-to-class mapping |

### ClassMergeFunction

A utility that composes class strings in the defined order.

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Function name (`mergeClasses`) |
| `order` | `string[]` | Merge order: `["component", "semantic", "consumer"]` |
| `conflictPolicy` | `string` | Reference to conflict policy document |

---

## Capability Inventory (Derived from SCSS Source)

### Sizing

| UtilityModule | Class Prefix | CSS Property | Values |
|---------------|-------------|-------------|---------|
| `width` | `pathable-width` | `width` | `auto`, `full` |
| `maxw` | `pathable-maxw` | `max-width` | `mobile` (320px), `mobile-lg` (480px), `tablet` (640px), `desktop` (1024px) |

**Props**: `width?: Width`, `maxWidth?: MaxWidth`

### Spacing

| UtilityModule | Class Prefix | CSS Property | Values |
|---------------|-------------|-------------|---------|
| `padding` | `pathable-padding` | `padding` | `0`–`10`, `15` |
| `padding-x` | `pathable-padding-x` | `padding-left`, `padding-right` | `0`–`10`, `15` |
| `padding-y` | `pathable-padding-y` | `padding-top`, `padding-bottom` | `0`–`10`, `15` |
| `margin` | `pathable-margin` | `margin` | `0`–`10`, `15` |
| `margin-x` | `pathable-margin-x` | `margin-left`, `margin-right` | `0`–`10`, `15` |
| `margin-y` | `pathable-margin-y` | `margin-top`, `margin-bottom` | `0`–`10`, `15` |
| `margin-top` | `pathable-margin-top` | `margin-top` | `0`–`10`, `15` |
| `margin-bottom` | `pathable-margin-bottom` | `margin-bottom` | `0`–`10`, `15` |

**Props**: `padding?: SpacingScale`, `paddingX?: SpacingScale`, `paddingY?: SpacingScale`, `margin?: SpacingScale`, `marginX?: SpacingScale`, `marginY?: SpacingScale`, `marginTop?: SpacingScale`, `marginBottom?: SpacingScale`

**Conflict direction**: `marginTop` overrides `margin` for top edge (shorthand first, directional second in output order).

### Display

| UtilityModule | Class Prefix | CSS Property | Values |
|---------------|-------------|-------------|---------|
| `display` | `pathable-display` | `display` | `flex`, `block`, `inline`, `inline-block`, `none` |

**Props**: `display?: Display`

### Alignment

| UtilityModule | Class Prefix | CSS Property | Values |
|---------------|-------------|-------------|---------|
| `align-items` | `pathable-flex-align` | `align-items` | `center`, `start`, `end`, `stretch`, `baseline` |
| `justify-content` | `pathable-flex-justify` | `justify-content` | `center`, `start`, `end`, `between`, `around` |
| `text-align` | `pathable-text` | `text-align` | `center`, `left`, `right` |

**Props**: `alignItems?: AlignItems`, `justifyContent?: JustifyContent`, `textAlign?: TextAlign`

**Note**: The `pathable-text` class prefix is shared by text-color, text-weight, and text-align modules. Resolver naming disambiguates: `textAlignClass` maps `"center"` → `"pathable-text-center"`.

### Visibility (GAP)

No utility classes exist for `visibility`, `opacity`, or `z-index`. Documented as a gap. No props or resolvers defined.

### Flex/Grid Participation

| UtilityModule | Class Prefix | CSS Property | Values |
|---------------|-------------|-------------|---------|
| `flex` | `pathable-flex` | `flex` | `1` (1 1 0%), `fill` (1 1 auto) |

**Props**: `flex?: Flex`

**Gaps**: No individual `flex-grow`, `flex-shrink`, `flex-basis`, or `order` utilities. No grid utilities exist.

### Typography

| UtilityModule | Class Prefix | CSS Property | Values |
|---------------|-------------|-------------|---------|
| `font-family` | `pathable-font-family` | `font-family` | `heading`, `body`, `mono`, `alt` |
| `text-weight` | `pathable-text` | `font-weight` | `normal`, `semibold`, `bold` |
| `text` | `pathable-text` | `color` | `base`, `primary`, `muted`, `accent`, `link`, `white` |

**Props**: `fontFamily?: FontFamily`, `fontWeight?: FontWeight`

**Note**: Text color is grouped under Color/Tone capability for semantic clarity.

**Gaps**: No `font-size`, `line-height`, `letter-spacing`, `text-transform`, or `text-decoration` utilities.

### Color/Tone

| UtilityModule | Class Prefix | CSS Property | Values |
|---------------|-------------|-------------|---------|
| `bg` | `pathable-bg` | `background-color` | `primary`, `base`, `surface`, `accent`, `link`, `focus-ring`, `danger`, `success`, `transparent` |
| `text` | `pathable-text` | `color` | `base`, `primary`, `muted`, `accent`, `link`, `white` |

**Props**: `backgroundColor?: BackgroundColor`, `textColor?: TextColor`

**Note**: `bg` and `text` modules have `hover:` and `focus:` state variants in CSS, but initial resolver layer does NOT handle state variants (see research.md Decision 7).

---

## Value Type Definitions

```typescript
// Sizing
type Width = "auto" | "full"
type MaxWidth = "mobile" | "mobile-lg" | "tablet" | "desktop"

// Spacing
type SpacingScale = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "15"

// Display
type Display = "flex" | "block" | "inline" | "inline-block" | "none"

// Alignment
type AlignItems = "center" | "start" | "end" | "stretch" | "baseline"
type JustifyContent = "center" | "start" | "end" | "between" | "around"
type TextAlign = "center" | "left" | "right"

// Flex/Grid
type Flex = "1" | "fill"

// Typography
type FontFamily = "heading" | "body" | "mono" | "alt"
type FontWeight = "normal" | "semibold" | "bold"

// Color/Tone
type BackgroundColor = "primary" | "base" | "surface" | "accent" | "link" | "focus-ring" | "danger" | "success" | "transparent"
type TextColor = "base" | "primary" | "muted" | "accent" | "link" | "white"
```

## Capability Interfaces

```typescript
interface SizingProps {
  width?: Width
  maxWidth?: MaxWidth
}

interface SpacingProps {
  padding?: SpacingScale
  paddingX?: SpacingScale
  paddingY?: SpacingScale
  margin?: SpacingScale
  marginX?: SpacingScale
  marginY?: SpacingScale
  marginTop?: SpacingScale
  marginBottom?: SpacingScale
}

interface DisplayProps {
  display?: Display
}

interface AlignmentProps {
  alignItems?: AlignItems
  justifyContent?: JustifyContent
  textAlign?: TextAlign
}

interface FlexGridProps {
  flex?: Flex
}

interface TypographyProps {
  fontFamily?: FontFamily
  fontWeight?: FontWeight
}

interface ColorToneProps {
  backgroundColor?: BackgroundColor
  textColor?: TextColor
}
```